import torch
import torch.nn as nn
from torchvision import models

def get_model(num_classes, freeze_base=True):
    """
    Returns a ResNet50 model modified for the specified number of classes.
    
    Args:
        num_classes (int): Number of output classes.
        freeze_base (bool): If True, freezes all layers except the final fully connected layer.
    """
    # Load pretrained ResNet50
    # Using the newer weights parameter format
    weights = models.ResNet50_Weights.IMAGENET1K_V1
    model = models.resnet50(weights=weights)

    if freeze_base:
        # Freeze all parameters
        for param in model.parameters():
            param.requires_grad = False

    # Replace the fully connected layer
    num_ftrs = model.fc.in_features
    # The new layer will have requires_grad=True by default
    model.fc = nn.Linear(num_ftrs, num_classes)

    return model

def unfreeze_layers(model, num_layers_to_unfreeze=None):
    """
    Unfreezes the top layers of the model for fine-tuning.
    
    Args:
        model: The PyTorch model.
        num_layers_to_unfreeze (int, optional): Number of top layers/blocks to unfreeze. 
                                                If None, unfreezes all layers.
    """
    if num_layers_to_unfreeze is None:
        # Unfreeze all parameters
        for param in model.parameters():
            param.requires_grad = True
    else:
        # Example for ResNet: Unfreeze layer4 (the last convolutional block) and fc
        for name, param in model.named_parameters():
            if 'layer4' in name or 'fc' in name:
                param.requires_grad = True
            
    return model

class BaselineCNN(nn.Module):
    def __init__(self, num_classes):
        super(BaselineCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        
        # 224x224 -> pool -> 112x112 -> pool -> 56x56
        self.fc1 = nn.Linear(32 * 56 * 56, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

def get_baseline_cnn(num_classes):
    """
    Returns a simple, lightweight Custom CNN for baseline comparison.
    """
    return BaselineCNN(num_classes)
