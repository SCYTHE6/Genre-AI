@echo off
echo Setting up Python environment for ML processing...

:: Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate.bat

:: Install dependencies
pip install numpy librosa soundfile

:: Print versions for debugging
python -c "import numpy; print('NumPy:', numpy.__version__)"
python -c "import librosa; print('Librosa:', librosa.__version__)"
python -c "import soundfile; print('SoundFile:', soundfile.__version__)"

echo ML environment setup complete!