import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import time
from app.core.config import settings

device = torch.device("cpu")
model = None
class_names = ['CNV', 'DME', 'DRUSEN', 'NORMAL']

def get_resnet50_model(num_classes):
    weights = models.ResNet50_Weights.IMAGENET1K_V1
    m = models.resnet50(weights=weights)
    num_ftrs = m.fc.in_features
    m.fc = nn.Linear(num_ftrs, num_classes)
    return m

def load_model():
    global model, device
    print("Loading model for inference...")
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
    else:
        device = torch.device("cpu")

    model_path = settings.MODEL_PATH
    
    model = get_resnet50_model(len(class_names))
    
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Model loaded from {model_path} successfully on {device}.")
    else:
        print(f"WARNING: Model path {model_path} not found. Using untrained weights.")
        
    model = model.to(device)
    model.eval()
    return model

mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
input_size = 224

eval_transforms = transforms.Compose([
    transforms.Resize((input_size, input_size)),
    transforms.ToTensor(),
    transforms.Normalize(mean, std)
])

def predict_image(image_bytes: bytes):
    start_time = time.time()
    
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    tensor = eval_transforms(img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1).cpu().numpy()[0]
        
    inference_time_ms = int((time.time() - start_time) * 1000)
    
    probs_dict = {class_names[i]: float(probabilities[i]) for i in range(len(class_names))}
    
    predicted_idx = probabilities.argmax()
    predicted_class = class_names[predicted_idx]
    confidence = float(probabilities[predicted_idx]) * 100
    
    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "probabilities": probs_dict,
        "inference_time_ms": inference_time_ms,
        "input_tensor": tensor,
        "raw_img": img
    }
