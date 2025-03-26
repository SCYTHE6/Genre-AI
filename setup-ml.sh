#!/bin/bash

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install numpy librosa soundfile spleeter

# Print versions for debugging
python -c "import numpy; print('NumPy:', numpy.__version__)"
python -c "import librosa; print('Librosa:', librosa.__version__)"
python -c "import spleeter; print('Spleeter:', spleeter.__version__)"

echo "ML environment setup complete!" 