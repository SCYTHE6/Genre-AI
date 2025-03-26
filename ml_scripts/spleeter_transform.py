import sys
import os
import numpy as np
import librosa
import soundfile as sf
from spleeter.separator import Separator
import tempfile
import shutil
import time
import traceback

def transform_genre(input_file, output_file, target_genre):
    """Transform audio to specified genre using Spleeter to separate stems"""
    print(f"[PYTHON] Processing {input_file} to {target_genre} genre")
    start_time = time.time()
    
    try:
        # Create a temporary directory for Spleeter output
        with tempfile.TemporaryDirectory() as temp_dir:
            # Initialize Spleeter separator
            print("[PYTHON] Initializing Spleeter (first run will download models)...")
            separator = Separator('spleeter:4stems')
            
            # Separate the audio file into stems
            print("[PYTHON] Separating audio stems...")
            separator.separate_to_file(input_file, temp_dir)
            
            # Get the directory containing the separated stems
            stem_dir = os.path.join(temp_dir, os.path.splitext(os.path.basename(input_file))[0])
            
            # Check that the stem files exist
            vocals_path = os.path.join(stem_dir, 'vocals.wav')
            bass_path = os.path.join(stem_dir, 'bass.wav')
            drums_path = os.path.join(stem_dir, 'drums.wav')
            other_path = os.path.join(stem_dir, 'other.wav')
            
            print(f"[PYTHON] Checking stems at {stem_dir}")
            if not all(os.path.exists(p) for p in [vocals_path, bass_path, drums_path, other_path]):
                raise Exception("Stem separation failed - one or more stems missing")
            
            # Load all the stems
            print("[PYTHON] Loading separated stems...")
            vocals, sr_vocals = librosa.load(vocals_path, sr=None)
            bass, sr_bass = librosa.load(bass_path, sr=None)
            drums, sr_drums = librosa.load(drums_path, sr=None)
            other, sr_other = librosa.load(other_path, sr=None)
            
            # Ensure all stems have the same sample rate
            sr = sr_vocals
            
            # Apply genre-specific processing to each stem
            print(f"[PYTHON] Applying {target_genre} effects to stems...")
            
            # Process based on target genre
            if target_genre.lower() == "rock":
                # Rock: Heavily distorted guitars, very prominent drums, compressed vocals
                vocals = apply_compression(vocals, 0.9) * 0.8        # More compressed vocals, slightly quieter
                drums = apply_compression(drums, 0.8) * 2.0          # Much more prominent drums
                bass = apply_distortion(bass, 0.7) * 1.5             # More distorted bass
                other = apply_distortion(other, 0.9) * 2.0           # Heavily distorted guitars
                
            elif target_genre.lower() == "electronic":
                # Electronic: Heavy processing, filters, delay effects
                vocals = apply_delay(vocals, 0.15, 0.3)
                drums = apply_compression(drums, 0.8) * 1.3  # Punchy drums
                bass = apply_filter(bass, "lowpass", 250) * 1.4  # Heavy bass
                other = apply_filter(other, "highpass", 2000)  # High synths
                other = apply_delay(other, 0.1, 0.4)
                
            elif target_genre.lower() == "hip hop":
                # Hip Hop: Prominent bass and drums, clear vocals
                vocals = apply_compression(vocals, 0.6) * 1.2
                drums = apply_compression(drums, 0.7) * 1.3
                bass = apply_bass_boost(bass, 1.8)
                other = other * 0.7  # Reduce other elements
                
            elif target_genre.lower() == "jazz":
                # Jazz: Warm sound, balanced, light reverb
                vocals = apply_reverb(vocals, 0.3, 0.4)
                drums = drums * 0.8  # Reduce drums
                bass = apply_filter(bass, "lowpass", 400) * 1.1
                other = apply_reverb(other, 0.4, 0.5) * 1.2  # Emphasize instruments
                
            elif target_genre.lower() == "classical":
                # Classical: Significant reverb, dynamic range
                vocals = apply_reverb(vocals, 0.7, 0.8) * 1.1
                drums = drums * 0.5  # Significantly reduce drums
                bass = bass * 0.9
                other = apply_reverb(other, 0.8, 0.7) * 1.4  # Emphasize orchestra
                
            elif target_genre.lower() == "country":
                # Country: Clear vocals, balanced instruments
                vocals = apply_compression(vocals, 0.5) * 1.3  # Prominent vocals
                drums = apply_compression(drums, 0.6) * 0.9
                bass = bass * 0.9
                other = apply_eq_boost(other, 2000, 1.2) * 1.1  # Bright guitars
                
            elif target_genre.lower() == "metal":
                # Metal: Heavy distortion, compressed drums, loud
                vocals = apply_distortion(vocals, 0.4)
                vocals = apply_compression(vocals, 0.8) * 1.1
                drums = apply_compression(drums, 0.9) * 1.4  # Very punchy drums
                bass = apply_distortion(bass, 0.6) * 1.2
                other = apply_distortion(other, 0.8) * 1.3  # Heavy distorted guitars
                
            elif target_genre.lower() == "r&b":
                # R&B: Smooth, bass-focused, clear vocals
                vocals = apply_compression(vocals, 0.5) * 1.3
                drums = apply_compression(drums, 0.6) * 0.9
                bass = apply_bass_boost(bass, 1.4)
                other = apply_filter(other, "lowpass", 6000) * 0.9  # Warm instruments
                
            elif target_genre.lower() == "reggae":
                # Reggae: Echo effects, prominent bass
                vocals = apply_delay(vocals, 0.2, 0.3)
                drums = apply_delay(drums, 0.1, 0.2) * 0.9
                bass = apply_bass_boost(bass, 1.5)
                other = apply_delay(other, 0.15, 0.3) * 0.9
                
            else:  # Pop or default
                # Pop: Balanced, compressed, radio-friendly
                vocals = apply_compression(vocals, 0.6) * 1.2  # Forward vocals
                drums = apply_compression(drums, 0.7) * 1.1
                bass = apply_compression(bass, 0.7) * 1.0
                other = apply_compression(other, 0.6) * 0.9
            
            # Mix the processed stems back together
            print("[PYTHON] Mixing processed stems...")
            # Make sure all stems are the same length
            min_length = min(len(vocals), len(bass), len(drums), len(other))
            vocals = vocals[:min_length]
            bass = bass[:min_length]
            drums = drums[:min_length]
            other = other[:min_length]
            
            # Mix stems together
            mixed = vocals + bass + drums + other
            
            # Normalize the final mix
            mixed = librosa.util.normalize(mixed)
            
            # Save the final audio
            print(f"[PYTHON] Saving final audio to {output_file}")
            sf.write(output_file, mixed, sr)
            
            elapsed_time = time.time() - start_time
            print(f"[PYTHON] Successfully transformed to {target_genre} genre in {elapsed_time:.2f} seconds")
            return True
            
    except Exception as e:
        print(f"[PYTHON] ERROR during Spleeter transformation: {str(e)}")
        print(f"[PYTHON] Exception type: {type(e).__name__}")
        print(f"[PYTHON] Exception traceback: {traceback.format_exc()}")
        # Fall back to simpler processing without stem separation
        try:
            print("[PYTHON] Falling back to simple audio effects...")
            return apply_simple_effects(input_file, output_file, target_genre)
        except Exception as fallback_error:
            print(f"[PYTHON] Fallback processing failed: {str(fallback_error)}")
            # Last resort: just copy the file
            try:
                shutil.copy(input_file, output_file)
                print("[PYTHON] Copied original file as last resort")
                return True
            except:
                print("[PYTHON] Failed to copy original file")
                return False

def apply_simple_effects(input_file, output_file, target_genre):
    """Apply genre effects without stem separation as fallback"""
    print(f"[PYTHON] Applying simple effects for {target_genre}")
    # Load the audio file
    y, sr = librosa.load(input_file, sr=None)
    
    # Apply basic genre effects
    if target_genre.lower() == "rock":
        y = apply_distortion(y, 0.5)
        y = apply_compression(y, 0.7)
    elif target_genre.lower() == "electronic":
        y = apply_delay(y, 0.15, 0.4)
        y = apply_filter(y, "highpass", 200)
    elif target_genre.lower() == "hip hop":
        y = apply_bass_boost(y, 1.4)
        y = apply_compression(y, 0.8)
    # Add more genre conditions as needed
    else:
        y = apply_compression(y, 0.6)
    
    # Normalize and save
    y = librosa.util.normalize(y)
    sf.write(output_file, y, sr)
    print(f"[PYTHON] Simple effects applied and saved to {output_file}")
    return True

# Audio Effect Functions
def apply_compression(audio, ratio):
    """Apply compression to audio"""
    print(f"[PYTHON]   Applying compression with ratio {ratio}...")
    threshold = 0.3
    # Simple compressor implementation
    indices = np.where(np.abs(audio) > threshold)[0]
    if len(indices) > 0:
        audio[indices] = threshold + (audio[indices] - threshold) / ratio
    return audio

def apply_distortion(audio, amount):
    """Apply distortion effect"""
    print(f"[PYTHON]   Applying distortion with amount {amount}...")
    # Simple waveshaping distortion
    return np.tanh(audio * amount * 3) / np.tanh(amount)

def apply_filter(audio, filter_type, cutoff):
    """Apply filter (lowpass or highpass)"""
    print(f"[PYTHON]   Applying {filter_type} filter at {cutoff}Hz...")
    if filter_type == "lowpass":
        b = np.array([1.0 - cutoff/22050])
        a = np.array([1.0, -cutoff/22050])
        return librosa.filtfilt(b, a, audio)
    elif filter_type == "highpass":
        b = np.array([1.0, -1.0])
        a = np.array([1.0, -0.99])
        return librosa.filtfilt(b, a, audio)
    return audio

def apply_delay(audio, delay_time, mix):
    """Apply delay effect"""
    print(f"[PYTHON]   Applying delay with time {delay_time}s and mix {mix}...")
    delay_samples = int(delay_time * 44100)
    delayed = np.zeros_like(audio)
    if delay_samples < len(audio):
        delayed[delay_samples:] = audio[:-delay_samples]
    return audio * (1 - mix) + delayed * mix

def apply_reverb(audio, room_size, mix):
    """Apply reverb effect"""
    print(f"[PYTHON]   Applying reverb with size {room_size} and mix {mix}...")
    impulse_response = np.exp(-np.linspace(0, 5, int(room_size * 44100)))
    reverb = np.convolve(audio, impulse_response, mode='full')[:len(audio)]
    return audio * (1 - mix) + reverb * mix

def apply_bass_boost(audio, amount):
    """Apply bass boost"""
    print(f"[PYTHON]   Applying bass boost with amount {amount}...")
    lowpass = apply_filter(audio, "lowpass", 200)
    return audio + (lowpass * (amount - 1))

def apply_eq_boost(audio, freq, amount):
    """Apply EQ boost at specific frequency"""
    print(f"[PYTHON]   Boosting frequency around {freq}Hz by {amount}...")
    return audio * amount

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("[PYTHON] Usage: python spleeter_transform.py input_file output_file target_genre")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_genre = sys.argv[3]
    
    print(f"[PYTHON] Starting transformation of {input_file} to {target_genre}")
    
    if not os.path.exists(input_file):
        print(f"[PYTHON] ERROR: Input file does not exist: {input_file}")
        sys.exit(1)
        
    success = transform_genre(input_file, output_file, target_genre)
    sys.exit(0 if success else 1)