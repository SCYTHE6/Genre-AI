# Machine Learning Models

This directory is intended to store the machine learning models used for audio genre transformation.

## Model Architecture

For audio genre transformation, we typically need:

1. A feature extractor to convert audio into appropriate features (e.g., MFCCs, spectrograms)
2. A model to transform these features into the target genre
3. A synthesizer to convert the transformed features back into audio

## Getting Pre-trained Models

Several options are available for audio style transfer:

1. **Jukebox by OpenAI**: A neural network that generates music with singing
   - https://github.com/openai/jukebox

2. **DDSP (Differentiable Digital Signal Processing)** by Google:
   - https://github.com/magenta/ddsp

3. **Magenta** by Google:
   - https://github.com/magenta/magenta

## Training Custom Models

To train a custom model for genre transformation, you would need:

1. A dataset of songs in different genres
2. Feature extraction pipeline
3. Model training code (typically using TensorFlow, PyTorch, or similar)

## Model Deployment

Place the trained model files in this directory. The application is set up to load models from here. 