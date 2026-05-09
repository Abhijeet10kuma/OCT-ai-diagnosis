import torch
import torch.nn as nn
import torch.optim as optim
import copy
import time
from dataset import get_dataloaders
from model import get_baseline_cnn
import os
import matplotlib.pyplot as plt

def train_model(model, dataloaders, dataset_sizes, criterion, optimizer, device, num_epochs=10):
    since = time.time()

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    
    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': []}

    for epoch in range(num_epochs):
        print(f'Epoch {epoch}/{num_epochs - 1}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')
            
            history[f'{phase}_loss'].append(epoch_loss)
            history[f'{phase}_acc'].append(epoch_acc.item())

            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        print()

    time_elapsed = time.time() - since
    print(f'Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best val Acc: {best_acc:4f}')

    model.load_state_dict(best_model_wts)
    return model, history

if __name__ == '__main__':
    DATA_DIR = os.path.join('archive (6)', 'OCT2017_')
    BATCH_SIZE = 32
    NUM_WORKERS = 0
    EPOCHS = 10
    
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

    dataloaders, dataset_sizes, class_names = get_dataloaders(DATA_DIR, batch_size=BATCH_SIZE, num_workers=NUM_WORKERS)
    num_classes = len(class_names)

    print("\n--- Training Baseline CNN ---")
    model = get_baseline_cnn(num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    if device.type == "xpu" and has_ipex:
        model, optimizer = ipex.optimize(model, optimizer=optimizer)

    model, history = train_model(model, dataloaders, dataset_sizes, criterion, optimizer, device, num_epochs=EPOCHS)

    os.makedirs('models', exist_ok=True)
    save_path = 'models/oct_baseline_cnn.pth'
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

    # Plot and save training curves
    def plot_history(history, title, filename):
        epochs = range(1, len(history['train_loss']) + 1)
        plt.figure(figsize=(12, 5))
        plt.subplot(1, 2, 1)
        plt.plot(epochs, history['train_loss'], 'b-', label='Training Loss')
        plt.plot(epochs, history['val_loss'], 'r-', label='Validation Loss')
        plt.title(f'{title} - Loss')
        plt.xlabel('Epochs')
        plt.ylabel('Loss')
        plt.legend()
        
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

    plot_history(history, "Baseline CNN", "training_curves_baseline")
