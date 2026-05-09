import os
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import random

def perform_eda(data_dir, output_dir='results'):
    """
    Performs Exploratory Data Analysis on the dataset:
    1. Plots class distribution.
    2. Plots sample images from each class.
    """
    os.makedirs(output_dir, exist_ok=True)
    train_dir = os.path.join(data_dir, 'train')
    
    if not os.path.exists(train_dir):
        print(f"Error: Training directory not found at {train_dir}")
        return

    classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    class_counts = {}
    sample_images = {}

    print("Analyzing class distribution...")
    for cls in classes:
        cls_dir = os.path.join(train_dir, cls)
        images = [img for img in os.listdir(cls_dir) if img.lower().endswith(('.png', '.jpg', '.jpeg'))]
        class_counts[cls] = len(images)
        if images:
            sample_images[cls] = os.path.join(cls_dir, random.choice(images))

    # 1. Plot Class Distribution
    plt.figure(figsize=(10, 6))
    sns.barplot(x=list(class_counts.keys()), y=list(class_counts.values()), palette='viridis', hue=list(class_counts.keys()), legend=False)
    plt.title('Training Data Class Distribution', fontsize=16)
    plt.xlabel('Condition', fontsize=12)
    plt.ylabel('Number of Images', fontsize=12)
    
    # Add count labels on top of bars
    for i, count in enumerate(class_counts.values()):
        plt.text(i, count + max(class_counts.values())*0.01, str(count), ha='center', va='bottom')
        
    plt.tight_layout()
    dist_path = os.path.join(output_dir, 'class_distribution.png')
    plt.savefig(dist_path)
    print(f"Saved class distribution plot to {dist_path}")
    plt.close()

    # 2. Plot Sample Images
    if sample_images:
        print("Generating sample images plot...")
        fig, axes = plt.subplots(2, 2, figsize=(10, 10))
        axes = axes.flatten()
        for idx, (cls, img_path) in enumerate(sample_images.items()):
            if idx < 4:  # We have 4 classes
                img = Image.open(img_path)
                axes[idx].imshow(img, cmap='gray' if img.mode == 'L' else None)
                axes[idx].set_title(cls, fontsize=14)
                axes[idx].axis('off')
        
        plt.tight_layout()
        sample_path = os.path.join(output_dir, 'sample_images.png')
        plt.savefig(sample_path)
        print(f"Saved sample images plot to {sample_path}")
        plt.close()

if __name__ == "__main__":
    DATA_DIR = os.path.join('archive (6)', 'OCT2017_')
    perform_eda(DATA_DIR)
