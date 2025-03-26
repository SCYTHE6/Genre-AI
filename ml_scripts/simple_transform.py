import sys
import os
import numpy as np
import librosa
import soundfile as sf

def transform_genre(input_file, output_file, target_genre):
    """Apply genre-specific audio effects without using Spleeter"""
    print(f"Processing {input_file} to {target_genre} genre")
    
    try:
        # Load the audio file
        y, sr = librosa.load(input_file, sr=None)
        
        # Apply genre-specific effects directly to the full track
        if target_genre.lower() == "rock":
            # Rock: Add distortion and compression
            y = apply_distortion(y, 0.5)
            y = apply_compression(y, 0.7)
            
        elif target_genre.lower() == "electronic":
            # Electronic: Add echo and filter effects
            y = apply_delay(y, 0.15, 0.4)
            y = apply_filter(y, "highpass", 200)
            
        elif target_genre.lower() == "hip hop":
            # Hip Hop: Boost bass, add beat emphasis
            y = apply_bass_boost(y, 1.4)
            percussive = librosa.effects.percussive(y)
            y = y * 0.7 + percussive * 0.3
            
        elif target_genre.lower() == "jazz":
            # Jazz: Add warmth and light reverb
            y = apply_reverb(y, 0.3, 0.5)
            y_harmonic = librosa.effects.harmonic(y)
            y = y * 0.8 + y_harmonic * 0.2
            
        elif target_genre.lower() == "classical":
            # Classical: Add significant reverb, enhance dynamics
            y = apply_reverb(y, 0.6, 0.7)
            
        elif target_genre.lower() == "country":
            # Country: Enhance mids, light compression
            y = apply_eq_boost(y, 2000, 1.2)
            y = apply_compression(y, 0.5)
            
        elif target_genre.lower() == "metal":
            # Metal: Heavy distortion, compression
            y = apply_distortion(y, 0.8)
            y = apply_compression(y, 0.8)
            
        elif target_genre.lower() == "r&b":
            # R&B: Smooth, bass-enhanced
            y = apply_bass_boost(y, 1.2)
            y = apply_filter(y, "lowpass", 8000)
            
        elif target_genre.lower() == "reggae":
            # Reggae: Echo, bass emphasis
            y = apply_delay(y, 0.2, 0.4)
            y = apply_bass_boost(y, 1.3)
            
        else:  # Pop or default
            # Pop: Balanced, slight compression
            y = apply_compression(y, 0.6)
        
        # Normalize final output
        y = librosa.util.normalize(y)
        
        # Save the transformed audio
        sf.write(output_file, y, sr)
        print(f"Successfully transformed to {target_genre} genre")
        return True
        
    except Exception as e:
        print(f"Error during transformation: {str(e)}")
        # Copy the original file as fallback
        import shutil
        shutil.copy(input_file, output_file)
        return False

# Audio Effect Functions
def apply_compression(audio, ratio):
    """Apply compression to audio"""
    threshold = 0.3
    indices = np.where(np.abs(audio) > threshold)[0]
    if len(indices) > 0:
        audio[indices] = threshold + (audio[indices] - threshold) / ratio
    return audio

def apply_distortion(audio, amount):
    """Apply distortion effect"""
    return np.tanh(audio * amount * 3) / np.tanh(amount)

def apply_filter(audio, filter_type, cutoff):
    """Apply filter (lowpass or highpass)"""
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
    delay_samples = int(delay_time * 44100)
    delayed = np.zeros_like(audio)
    if delay_samples < len(audio):
        delayed[delay_samples:] = audio[:-delay_samples]
    return audio * (1 - mix) + delayed * mix

def apply_reverb(audio, room_size, mix):
    """Apply reverb effect"""
    impulse_response = np.exp(-np.linspace(0, 5, int(room_size * 44100)))
    reverb = np.convolve(audio, impulse_response, mode='full')[:len(audio)]
    return audio * (1 - mix) + reverb * mix

def apply_bass_boost(audio, amount):
    """Apply bass boost"""
    lowpass = apply_filter(audio, "lowpass", 200)
    return audio + (lowpass * (amount - 1))

def apply_eq_boost(audio, freq, amount):
    """Apply EQ boost at specific frequency"""
    return audio * amount

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python simple_transform.py input_file output_file target_genre")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_genre = sys.argv[3]
    
    success = transform_genre(input_file, output_file, target_genre)
    sys.exit(0 if success else 1) 