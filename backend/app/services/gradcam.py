import cv2
import numpy as np
import base64
import torch
import io
from PIL import Image

def generate_gradcam_overlay(model, input_tensor, raw_img):
    """
    Native PyTorch Grad-CAM implementation without external libraries.
    Extracts features and gradients from layer4 of ResNet50.
    """
    model.eval()
    
    # Enable gradient calculation for input to extract gradients
    input_tensor.requires_grad_(True)
    
    # We will hook into the last block of layer4
    target_layer = model.layer4[-1]
    
    features = []
    gradients = []
    
    def forward_hook(module, input, output):
        features.append(output)
        
    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])
        
    # Register hooks
    handle_fw = target_layer.register_forward_hook(forward_hook)
    handle_bw = target_layer.register_full_backward_hook(backward_hook)
    
    # Forward pass
    output = model(input_tensor)
    
    # Get the class with highest score
    target_class = torch.argmax(output, dim=1).item()
    
    # Zero gradients
    model.zero_grad()
    
    # Target for backprop
    one_hot = torch.zeros((1, output.size()[-1]), dtype=torch.float32, device=output.device)
    one_hot[0][target_class] = 1.0
    
    # Backward pass
    output.backward(gradient=one_hot, retain_graph=True)
    
    # Remove hooks
    handle_fw.remove()
    handle_bw.remove()
    
    # Get saved features and gradients
    activations = features[0].detach().cpu().numpy()[0] # Shape: (channels, H, W)
    grads = gradients[0].detach().cpu().numpy()[0] # Shape: (channels, H, W)
    
    # Global average pooling on gradients to get channel weights
    weights = np.mean(grads, axis=(1, 2)) # Shape: (channels,)
    
    # Compute Grad-CAM
    cam = np.zeros(activations.shape[1:], dtype=np.float32)
    for i, w in enumerate(weights):
        cam += w * activations[i]
        
    # Apply ReLU (clip negative values)
    cam = np.maximum(cam, 0)
    
    # Normalize between 0 and 1
    if np.max(cam) != 0:
        cam = cam / np.max(cam)
    else:
        cam = np.zeros_like(cam)
        
    # Resize cam to match input image size (224x224)
    cam_resized = cv2.resize(cam, (224, 224))
    
    # Convert cam to heatmap colormap
    heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
    heatmap = np.float32(heatmap) / 255
    
    # Resize raw image
    raw_img_resized = raw_img.resize((224, 224))
    rgb_img = np.float32(raw_img_resized) / 255
    
    # Overlay heatmap on image
    visualization = heatmap * 0.6 + rgb_img
    visualization = visualization / np.max(visualization) # Normalize
    
    # Convert back to uint8
    visualization = np.uint8(255 * visualization)
    # Convert BGR to RGB
    visualization = cv2.cvtColor(visualization, cv2.COLOR_BGR2RGB)
    
    # Convert to base64
    overlay_pil = Image.fromarray(visualization)
    buffered = io.BytesIO()
    overlay_pil.save(buffered, format="PNG")
    overlay_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    orig_buffered = io.BytesIO()
    raw_img_resized.save(orig_buffered, format="PNG")
    orig_b64 = base64.b64encode(orig_buffered.getvalue()).decode("utf-8")
    
    return overlay_b64, orig_b64
