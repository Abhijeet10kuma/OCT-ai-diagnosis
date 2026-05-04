# Retinal OCT Diagnostic Dashboard

A deep learning-based web application for classifying Optical Coherence Tomography (OCT) images of the retina. This project uses a fine-tuned ResNet50 model to identify four retinal conditions: Choroidal Neovascularization (CNV), Diabetic Macular Edema (DME), Drusen, and Normal retinas.

## Features

- **Automated Classification**: Classify OCT images into 4 categories with high accuracy (97%)
- **Web Interface**: User-friendly Flask web application with drag-and-drop image upload
- **Detailed Reports**: Generate comprehensive diagnostic reports with confidence scores
- **Model Comparison**: Includes baseline CNN for performance comparison
- **Hyperparameter Tuning**: Grid search optimization for best model performance

## Dataset

The project uses the OCT2017 dataset from Kaggle, containing thousands of retinal OCT images categorized into:
- CNV (Choroidal Neovascularization)
- DME (Diabetic Macular Edema)
- DRUSEN
- NORMAL

## Model Architecture

### Primary Model: ResNet50 (Fine-tuned)
- Pre-trained on ImageNet
- Two-phase training: Feature extraction followed by fine-tuning
- Input: 224x224 RGB images
- Output: 4-class classification with softmax

### Baseline Model: Custom CNN
- Built from scratch for comparison
- 2 convolutional layers with max pooling
- Fully connected classification head

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/retinal-oct-dashboard.git
cd retinal-oct-dashboard
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download the pre-trained model weights and place them in the `models/` directory.

## Usage

### Training the Model

1. **Baseline Model**:
```bash
python train_baseline.py
```

2. **ResNet50 Model**:
```bash
python train.py
```

3. **Hyperparameter Tuning**:
```bash
python tune.py
```

### Running the Web Application

```bash
python app.py
```

Open your browser and navigate to `http://localhost:5000`

### Model Evaluation

```bash
python evaluate.py
```

## Project Structure

```
├── app.py                 # Flask web application
├── model.py               # Model architecture definitions
├── dataset.py             # Data loading and preprocessing
├── train.py               # ResNet50 training script
├── train_baseline.py      # Baseline CNN training script
├── tune.py                # Hyperparameter tuning
├── evaluate.py            # Model evaluation
├── eda.py                 # Exploratory data analysis
├── requirements.txt       # Python dependencies
├── static/                # CSS and JS files
├── templates/             # HTML templates
├── models/                # Saved model weights
├── results/               # Evaluation results and plots
├── archive/               # Dataset storage
└── project_report_final.md # Detailed project report
```

## Results

The ResNet50 model achieves:
- **Overall Accuracy**: 97%
- **Precision**: CNV (0.93), DME (0.96), DRUSEN (1.00), NORMAL (0.98)
- **Recall**: CNV (0.97), DME (0.98), DRUSEN (0.93), NORMAL (1.00)
- **F1-score**: CNV (0.95), DME (0.97), DRUSEN (0.96), NORMAL (0.99)

## Technologies Used

- **Deep Learning**: PyTorch, torchvision
- **Web Framework**: Flask
- **Data Science**: NumPy, scikit-learn, Matplotlib, Seaborn
- **Image Processing**: Pillow
- **Hardware Acceleration**: Intel Extension for PyTorch (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OCT2017 Dataset from Kaggle
- PyTorch team for the deep learning framework
- Flask community for the web framework

## Author

Abhijeet Kumar 