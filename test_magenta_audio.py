import os
import sys
import numpy as np
import librosa
import soundfile as sf
from magenta.music import audio_io

def test_magenta_audio():
    print("Testing Magenta audio processing...")
    
    # Define paths
    test_dir = "test_output"
    if not os.path.exists(test_dir):
        os.makedirs(test_dir)
    
    # Generate a simple sine wave for testing
    sr = 22050  # Sample rate
    duration = 3  # seconds
    freq = 440.0  # A4 note
    
    print("Generating test audio...")
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    test_audio = 0.5 * np.sin(2 * np.pi * freq * t)
    
    # Add harmonics for richer sound
    test_audio += 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    test_audio += 0.2 * np.sin(2 * np.pi * freq * 3 * t)
    
    # Save original test audio
    test_file = os.path.join(test_dir, "original_test.wav")
    sf.write(test_file, test_audio, sr)
    print(f"Saved original test audio to {test_file}")
    
    # Process with Magenta-inspired techniques
    print("Processing with Magenta-inspired techniques...")
    
    # Test processing for different genres
    genres = ["jazz", "rock", "electronic", "classical"]
    
    for genre in genres:
        try:
            print(f"Processing for {genre} genre...")
            # Import functions from your magenta_transform script
            sys.path.append(os.path.join(os.getcwd(), "ml_scripts"))
            from magenta_transform import transform_with_magenta
            
            output_file = os.path.join(test_dir, f"{genre}_test.wav")
            success = transform_with_magenta(test_file, output_file, genre)
            
            if success:
                print(f"Successfully processed for {genre} genre: {output_file}")
            else:
                print(f"Processing failed for {genre} genre")
                
        except Exception as e:
            print(f"Error during {genre} processing: {str(e)}")
            import traceback
            traceback.print_exc()
    
    print("\nTest completed. Check the test_output directory for results.")

if __name__ == "__main__":
    test_magenta_audio()
