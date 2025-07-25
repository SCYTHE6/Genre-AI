# Genre-AI: Music Genre Classification
# Genre-AI is a machine learning project that classifies music signals into their respective genres. This project utilizes the GTZAN dataset, a popular collection for genre recognition tasks. A Convolutional Neural Network (CNN) is trained to identify genres from mel-spectrograms of audio files.

# 🎵 Features

• Data Serialization: Processes and saves extracted audio features into a JSON file for efficient loading during model training.

• Audio Processing: Converts raw audio signals into mel-spectrograms, which are visual representations of the spectrum of frequencies of a signal as they vary with time.

• Deep Learning Model: Implements a Convolutional Neural Network (CNN) to learn features from the spectrograms and classify them.

• Dataset: Utilizes the GTZAN dataset, which contains 1000 audio tracks, each 30 seconds long, distributed across 10 genres.

• Evaluation: The model's performance is evaluated using standard metrics like accuracy and loss.

🛠️ Tech Stack

• Python: The core programming language.

• TensorFlow & Keras: For building and training the CNN model.

• Magenta: Google's AI library for music and art generation.

• Librosa: For audio processing and feature extraction (mel-spectrograms).

• NumPy: For numerical operations.

• Scikit-learn: For splitting the data and evaluation.

• Matplotlib: For plotting graphs and visualizing results.

• JSON: For saving and loading the processed dataset.

# ⚙️ Setup and Installation

# 1 - Clone the repository:

git clone https://github.com/SCYTHE6/Genre-AI.git
cd Genre-AI

# 2 - Install dependencies:
It's recommended to use a virtual environment.

pip install -r requirements.txt

(Ensure your requirements.txt file includes tensorflow, librosa, numpy, scikit-learn, matplotlib, and magenta)

# 3 - Download and prepare the dataset:

• Download the GTZAN dataset. You can find it online or use the GTZAN.zip file if it's in the repository.

• Extract the dataset into a directory (e.g., Data/genres_original). The model expects the audio files to be organized in subdirectories named after their genre.

# 🚀 How to Run
The main logic for data processing, model building, and training is contained within the Genre-AI.ipynb Jupyter Notebook.

# 1 - Launch Jupyter Notebook:
jupyter notebook

2 - Open Genre-AI.ipynb.

3 - Update the file paths for the dataset to match your local directory structure.

4 - Run the cells sequentially to:

• Load and process the audio data into spectrograms.

• Save the processed data to a .json file.

• Load the data from the .json file.

• Build the CNN model.

• Train the model on the training set.

• Evaluate the model's performance on the test set.

# 📈 Model Architecture
The project uses a CNN, which is highly effective for image recognition tasks. Since mel-spectrograms are essentially images, a CNN is a suitable choice. The typical architecture includes:

• Multiple convolutional layers with ReLU activation to extract features.

• Max-pooling layers to reduce dimensionality.

• Flatten layer to convert the 2D feature maps into a 1D vector.

• Dense (fully connected) layers for classification.

•  final softmax activation layer to output genre probabilities.