import os
import random
import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset

def get_dataloaders(data_dir, batch_size=32, num_workers=4, max_samples_per_class=500):
    """
    Creates DataLoaders for train, validation, and test sets.
    If max_samples_per_class is set, it limits the dataset size for faster testing.
    """
    
    # Standard ImageNet normalization values
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    input_size = 224 # ResNet50 default input size

    # Data augmentations for training
    train_transforms = transforms.Compose([
        transforms.Resize((input_size, input_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

    # Only resize and normalize for validation/testing
    eval_transforms = transforms.Compose([
        transforms.Resize((input_size, input_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

    # Dataset paths
    train_dir = os.path.join(data_dir, 'train')
    val_dir = os.path.join(data_dir, 'val')
    test_dir = os.path.join(data_dir, 'test')

    # Create datasets
    raw_datasets = {
        'train': datasets.ImageFolder(train_dir, train_transforms),
        'val': datasets.ImageFolder(val_dir, eval_transforms),
        'test': datasets.ImageFolder(test_dir, eval_transforms)
    }
    
    class_names = raw_datasets['train'].classes
    image_datasets = {}

    if max_samples_per_class is not None:
        for phase in ['train', 'val', 'test']:
            dataset = raw_datasets[phase]
            targets = dataset.targets
            class_indices = {i: [] for i in range(len(class_names))}
            for idx, target in enumerate(targets):
                class_indices[target].append(idx)
            
            subset_indices = []
            for class_idx, indices in class_indices.items():
                if len(indices) > max_samples_per_class:
                    subset_indices.extend(random.sample(indices, max_samples_per_class))
                else:
                    subset_indices.extend(indices)
            
            # Shuffle subset indices so batches have mixed classes
            random.shuffle(subset_indices)
            image_datasets[phase] = Subset(dataset, subset_indices)
    else:
        image_datasets = raw_datasets

    # Create dataloaders
    dataloaders = {
        x: DataLoader(image_datasets[x], batch_size=batch_size, shuffle=(x == 'train'), num_workers=num_workers)
        for x in ['train', 'val', 'test']
    }

    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val', 'test']}
    # class_names was already extracted above
    # class_names = raw_datasets['train'].classes

    print(f"Classes found: {class_names}")
    print(f"Dataset sizes: {dataset_sizes}")

    return dataloaders, dataset_sizes, class_names
