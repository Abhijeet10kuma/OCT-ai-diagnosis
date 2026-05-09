import torch
import torch.nn as nn
import torch.optim as optim
import itertools
from dataset import get_dataloaders
from model import get_model
import os

def tune_hyperparameters():
    """
    Performs a simple grid search over learning rates and batch sizes.
    To save time during tuning, we only train for 2 epochs per combination
    and use the pre-trained ResNet base (Phase 1).
    """
    DATA_DIR = os.path.join('archive (6)', 'OCT2017_')
    
    # Grid of hyperparameters to test
    learning_rates = [0.001, 0.0001]
    batch_sizes = [16, 32]
    
    # Static parameters for tuning
    num_epochs = 2 
    num_workers = 0

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
    
    best_acc = 0.0
    best_params = {}
    results = []

    print("Starting Grid Search...")
    
    for lr, batch_size in itertools.product(learning_rates, batch_sizes):
        print(f"\n--- Testing LR: {lr}, Batch Size: {batch_size} ---")
        
        # Reload dataloaders with new batch size
        dataloaders, dataset_sizes, class_names = get_dataloaders(DATA_DIR, batch_size=batch_size, num_workers=num_workers)
        num_classes = len(class_names)
        
        # Load fresh model
        model = get_model(num_classes, freeze_base=True)
        model = model.to(device)
        
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.fc.parameters(), lr=lr)
        
        if device.type == "xpu" and has_ipex:
            model, optimizer = ipex.optimize(model, optimizer=optimizer)

        # Train loop
        for epoch in range(num_epochs):
            for phase in ['train', 'val']:
                if phase == 'train':
                    model.train()
                else:
                    model.eval()

                running_corrects = 0

                for inputs, labels in dataloaders[phase]:
                    inputs = inputs.to(device)
                    labels = labels.to(device)
                    optimizer.zero_grad()

                    with torch.set_grad_enabled(phase == 'train'):
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)

                        if phase == 'train':
                            loss = criterion(outputs, labels)
                            loss.backward()
                            optimizer.step()

                    running_corrects += torch.sum(preds == labels.data)

                epoch_acc = running_corrects.double() / dataset_sizes[phase]
                if phase == 'val':
                    print(f"Epoch {epoch+1}/{num_epochs} - Val Acc: {epoch_acc:.4f}")
                    # Track best accuracy within this run
                    val_acc = epoch_acc.item()
                    
        results.append({'lr': lr, 'batch_size': batch_size, 'val_acc': val_acc})
        
        if val_acc > best_acc:
            best_acc = val_acc
            best_params = {'lr': lr, 'batch_size': batch_size}

    print("\n--- Grid Search Results ---")
    for res in results:
        print(f"LR: {res['lr']}, Batch Size: {res['batch_size']} -> Val Acc: {res['val_acc']:.4f}")
        
    print(f"\nBest Parameters Found: {best_params} with Validation Accuracy: {best_acc:.4f}")
    
    # Save results to file for report
    os.makedirs('results', exist_ok=True)
    with open('results/tuning_results.txt', 'w') as f:
        f.write("Grid Search Hyperparameter Tuning Results\n")
        f.write("="*40 + "\n")
        for res in results:
            f.write(f"LR: {res['lr']}, Batch Size: {res['batch_size']} -> Val Acc: {res['val_acc']:.4f}\n")
        f.write("\n")
        f.write(f"Best Parameters: {best_params}\n")
        f.write(f"Best Validation Accuracy: {best_acc:.4f}\n")
    print("Saved tuning results to results/tuning_results.txt")

if __name__ == '__main__':
    tune_hyperparameters()
