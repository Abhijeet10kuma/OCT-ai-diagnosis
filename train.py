import torch
import torch.nn as nn
import torch.optim as optim
import copy
import time
from dataset import get_dataloaders
from model import get_model, unfreeze_layers
import os
import matplotlib.pyplot as plt

def train_model(model, dataloaders, dataset_sizes, criterion, optimizer, device, num_epochs=10):
    since = time.time()

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    
    # Store history
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}

    for epoch in range(num_epochs):
        print(f'Epoch {epoch}/{num_epochs - 1}')
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()  # Set model to training mode
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data.
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                # zero the parameter gradients
                optimizer.zero_grad()

                # forward
                # track history if only in train
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    # backward + optimize only if in training phase
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')
            
            history[f'{phase}_loss'].append(epoch_loss)
            history[f'{phase}_acc'].append(epoch_acc.item())

            # deep copy the model
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        print()

    time_elapsed = time.time() - since
    print(f'Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best val Acc: {best_acc:4f}')

    # load best model weights
    model.load_state_dict(best_model_wts)
    return model, history

if __name__ == '__main__':
    # Configuration
    DATA_DIR = os.path.join('archive (6)', 'OCT2017_')
    BATCH_SIZE = 32
    NUM_WORKERS = 0 # Set to 0 for Windows compatibility issues, can be increased if stable
    EPOCHS_PHASE1 = 3 # Train only final layer
    EPOCHS_PHASE2 = 5 # Fine-tune
    
    # Device configuration
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

    # 1. Load Data
    dataloaders, dataset_sizes, class_names = get_dataloaders(DATA_DIR, batch_size=BATCH_SIZE, num_workers=NUM_WORKERS)
    num_classes = len(class_names)

    # 2. Phase 1: Feature Extraction
    print("\n--- Phase 1: Feature Extraction (Frozen Base) ---")
    model = get_model(num_classes, freeze_base=True)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    # Optimize only the fully connected layer
    optimizer_ft = optim.Adam(model.fc.parameters(), lr=0.001)

    if device.type == "xpu":
        model, optimizer_ft = ipex.optimize(model, optimizer=optimizer_ft)

    model, history1 = train_model(model, dataloaders, dataset_sizes, criterion, optimizer_ft, device, num_epochs=EPOCHS_PHASE1)

    # 3. Phase 2: Fine-Tuning
    print("\n--- Phase 2: Fine-Tuning (Unfrozen Base) ---")
    # Unfreeze all layers for fine-tuning, or use unfreeze_layers(model, num_layers=...)
    model = unfreeze_layers(model)
    
    # Observe that all parameters are being optimized, but with a much lower learning rate
    optimizer_fine = optim.Adam(model.parameters(), lr=1e-5)

    if device.type == "xpu":
        model, optimizer_fine = ipex.optimize(model, optimizer=optimizer_fine)

    model, history2 = train_model(model, dataloaders, dataset_sizes, criterion, optimizer_fine, device, num_epochs=EPOCHS_PHASE2)

    # 4. Save the best model
    os.makedirs('models', exist_ok=True)
    save_path = 'models/oct_resnet50_finetuned.pth'
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

    # 5. Plot and save training curves
    def plot_history(history, title, filename):
        epochs = range(1, len(history['train_loss']) + 1)
        
        plt.figure(figsize=(12, 5))
        
        # Plot Loss
        plt.subplot(1, 2, 1)
        plt.plot(epochs, history['train_loss'], 'b-', label='Training Loss')
        plt.plot(epochs, history['val_loss'], 'r-', label='Validation Loss')
        plt.title(f'{title} - Loss')
        plt.xlabel('Epochs')
        plt.ylabel('Loss')
        plt.legend()
        
        # Plot Accuracy
        plt.subplot(1, 2, 2)
        plt.plot(epochs, history['train_acc'], 'b-', label='Training Accuracy')
        plt.plot(epochs, history['val_acc'], 'r-', label='Validation Accuracy')
        plt.title(f'{title} - Accuracy')
        plt.xlabel('Epochs')
        plt.ylabel('Accuracy')
        plt.legend()
        
        plt.tight_layout()
        os.makedirs('results', exist_ok=True)
        plt.savefig(f'results/{filename}.png')
        plt.close()
        print(f"Saved {filename}.png to results/")

    plot_history(history1, "Phase 1: Feature Extraction", "training_curves_phase1")
    plot_history(history2, "Phase 2: Fine-Tuning", "training_curves_phase2")
