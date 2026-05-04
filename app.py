import os
import io
import torch
import torch.nn.functional as F
from flask import Flask, request, jsonify, render_template
from PIL import Image
from torchvision import transforms
from model import get_model
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max limit

# Global variables for model
device = torch.device("cpu")
model = None
class_names = ['CNV', 'DME', 'DRUSEN', 'NORMAL']

def load_inference_model():
    global model, device
    print("Loading model for inference...")
    
    try:
        import intel_extension_for_pytorch as ipex
        has_ipex = True
    except ImportError:
        has_ipex = False

    if torch.cuda.is_available():
        device = torch.device("cuda:0")
    elif has_ipex and hasattr(torch, "xpu") and torch.xpu.is_available():
        device = torch.device("xpu")
    else:
        device = torch.device("cpu")

    model_path = 'models/oct_resnet50_finetuned.pth'
    num_classes = len(class_names)
    
    model = get_model(num_classes=num_classes, freeze_base=False)
    
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Model weights loaded from {model_path}.")
    else:
        print(f"WARNING: No model found at {model_path}. Using untrained weights for demonstration.")

    model = model.to(device)
    if device.type == "xpu" and has_ipex:
        model = ipex.optimize(model)
        
    model.eval()

# Normalization values used during training
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
input_size = 224

eval_transforms = transforms.Compose([
    transforms.Resize((input_size, input_size)),
    transforms.ToTensor(),
    transforms.Normalize(mean, std)
])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/report')
def report():
    return render_template('report.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    try:
        # Read image
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        # Preprocess
        tensor = eval_transforms(img).unsqueeze(0).to(device)
        
        # Inference
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = F.softmax(outputs, dim=1).cpu().numpy()[0]
            
        # Format results
        results = []
        for i, class_name in enumerate(class_names):
            results.append({
                'class': class_name,
                'probability': float(probabilities[i]) * 100
            })
            
        # Sort by probability descending
        results.sort(key=lambda x: x['probability'], reverse=True)
        
        return jsonify({
            'success': True,
            'prediction': results[0]['class'],
            'confidence': results[0]['probability'],
            'all_scores': results
        })
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    load_inference_model()
    # Create static/css and static/js directories if they don't exist
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
