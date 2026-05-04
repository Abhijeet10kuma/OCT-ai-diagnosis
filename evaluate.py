import torch
import torch.nn as nn
from dataset import get_dataloaders
from model import get_model
import os
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import torch.nn.functional as F

def evaluate_model(model, test_loader, device, class_names):
    model.eval()
    
    all_probs = []
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            
            outputs = model(inputs)
            probs = F.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())
            
    all_probs = np.array(all_probs)
    all_labels = np.array(all_labels)

    # Calculate metrics
    print("\nClassification Report:")
    print(classification_report(all_labels, all_preds, target_names=class_names))
    
    cm = confusion_matrix(all_labels, all_preds)
    print("Confusion Matrix:")
    print(cm)
    
    os.makedirs('results', exist_ok=True)
    
    # Plot Confusion Matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('results/confusion_matrix.png')
    plt.close()
    print("Saved confusion_matrix.png to results/")

    # Plot ROC Curve
    plt.figure(figsize=(10, 8))
    colors = ['blue', 'red', 'green', 'orange']
    
    for i in range(len(class_names)):
        # Binarize labels for the current class
        y_true_bin = (all_labels == i).astype(int)
        y_score = all_probs[:, i]
        
        fpr, tpr, _ = roc_curve(y_true_bin, y_score)
        roc_auc = auc(fpr, tpr)
        
        plt.plot(fpr, tpr, color=colors[i % len(colors)], lw=2,
                 label=f'ROC curve of class {class_names[i]} (area = {roc_auc:0.2f})')

    plt.plot([0, 1], [0, 1], 'k--', lw=2)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig('results/roc_curve.png')
    plt.close()
    print("Saved roc_curve.png to results/")

if __name__ == '__main__':
    # Configuration
    DATA_DIR = os.path.join('archive (6)', 'OCT2017_')
    MODEL_PATH = 'models/oct_resnet50_finetuned.pth'
    BATCH_SIZE = 32
    NUM_WORKERS = 0
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
        
    print(f"Using device: {device}")
    
    # Load Data (we just need the test loader and class names)
    dataloaders, _, class_names = get_dataloaders(DATA_DIR, batch_size=BATCH_SIZE, num_workers=NUM_WORKERS)
    test_loader = dataloaders['test']
    
    # Load Model
    model = get_model(num_classes=len(class_names), freeze_base=False)
    
    if os.path.exists(MODEL_PATH):
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model = model.to(device)
        if device.type == "xpu":
            model = ipex.optimize(model)
        print("Model loaded successfully. Starting evaluation...")
        evaluate_model(model, test_loader, device, class_names)
    else:
        print(f"Model file not found at {MODEL_PATH}. Please train the model first.")
