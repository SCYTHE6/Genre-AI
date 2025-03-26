import sys
import os
import numpy as np
import librosa
import soundfile as sf
from spleeter.separator import Separator
import tempfile
import shutil
import traceback

def transform_genre(input_file, output_file, target_genre):
    """
    Transform audio file to target genre using Spleeter for stem separation
    and genre-specific audio effects.
    """
    print(f"Processing {input_file} to {target_genre} genre")
    
    try:
        # Create a temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Initialize the separator - using 4stems model (vocals, drums, bass, other)
            separator = Separator('spleeter:4stems')
            
            # Separate the audio file
            print("Separating stems...")
            separator.separate_to_file(input_file, temp_dir)
            
            # Get the base filename without extension
            basename = os.path.splitext(os.path.basename(input_file))[0]
            stems_dir = os.path.join(temp_dir, basename)
            
            # Load separated stems
            vocals_path = os.path.join(stems_dir, 'vocals.wav')
            drums_path = os.path.join(stems_dir, 'drums.wav')
            bass_path = os.path.join(stems_dir, 'bass.wav')
            other_path = os.path.join(stems_dir, 'other.wav')
            
            vocals, vocals_sr = librosa.load(vocals_path, sr=None)
            drums, drums_sr = librosa.load(drums_path, sr=None)
            bass, bass_sr = librosa.load(bass_path, sr=None)
            other, other_sr = librosa.load(other_path, sr=None)
            
            # Apply genre-specific transformations
            print(f"Applying {target_genre} effects...")
            
            # Each genre gets different processing
            if target_genre.lower() == "rock":
                # Rock: Distorted guitars, prominent drums, compressed vocals
                other = apply_distortion(other, 0.7)  # Distort guitars/other instruments
                drums = apply_compression(drums, 0.8)  # Heavier drums
                vocals = apply_compression(vocals, 0.5)  # Vocal compression
                bass = apply_compression(bass, 0.6)  # Bass boost
                
                # Mix with genre-appropriate levels
                mix = vocals * 0.8 + drums * 1.1 + bass * 1.0 + other * 0.9
                
            elif target_genre.lower() == "electronic":
                # Electronic: Filter effects, delays, synthesized elements
                other = apply_filter(other, "highpass", 200)  # Filter other instruments
                drums = apply_delay(drums, 0.1, 0.3)  # Add echo to drums
                # Apply LFO to some elements
                bass = apply_lfo(bass, 0.2, 8)  # Wobble bass effect
                
                # Mix with genre-appropriate levels
                mix = vocals * 0.7 + drums * 1.2 + bass * 1.3 + other * 0.8
                
            elif target_genre.lower() == "hip hop":
                # Hip Hop: Heavy bass, processed drums, vocal effects
                bass = apply_bass_boost(bass, 1.5)  # Boost bass
                drums = apply_compression(drums, 0.9)  # Heavy drums
                drums = apply_filter(drums, "lowpass", 8000)  # Filter high frequencies
                vocals = apply_delay(vocals, 0.08, 0.2)  # Slight vocal delay
                
                # Mix with genre-appropriate levels
                mix = vocals * 1.0 + drums * 1.1 + bass * 1.4 + other * 0.6
                
            elif target_genre.lower() == "jazz":
                # Jazz: Natural sound, room ambience, balanced mix
                other = apply_reverb(other, 0.3, 0.7)  # Add reverb to instruments
                drums = apply_reverb(drums, 0.2, 0.5)  # Light drum reverb
                bass = apply_eq_boost(bass, 200, 1.2)  # Warm bass
                vocals = apply_reverb(vocals, 0.15, 0.4)  # Vocal ambience
                
                # Mix with genre-appropriate levels
                mix = vocals * 0.9 + drums * 0.8 + bass * 1.0 + other * 1.1
                
            elif target_genre.lower() == "classical":
                # Classical: Large reverb, natural dynamics, orchestral balance
                other = apply_reverb(other, 0.6, 0.8)  # Significant reverb
                drums = apply_reverb(drums, 0.5, 0.7)  # Reverb on percussion
                bass = apply_reverb(bass, 0.5, 0.7)  # Reverb on low instruments
                vocals = apply_reverb(vocals, 0.5, 0.7)  # Reverb on vocals
                
                # Mix with genre-appropriate levels
                mix = vocals * 1.0 + drums * 0.6 + bass * 0.7 + other * 1.2
                
            elif target_genre.lower() == "country":
                # Country: Twangy guitars, vocal clarity, balanced rhythm
                other = apply_eq_boost(other, 2000, 1.3)  # Boost guitar "twang" frequencies
                vocals = apply_compression(vocals, 0.4)  # Vocal clarity
                drums = apply_compression(drums, 0.5)  # Light drum compression
                
                # Mix with genre-appropriate levels
                mix = vocals * 1.1 + drums * 0.9 + bass * 0.8 + other * 1.0
                
            elif target_genre.lower() == "metal":
                # Metal: Heavy distortion, aggressive drums, compressed mix
                other = apply_distortion(other, 0.9)  # Heavy distortion
                drums = apply_compression(drums, 0.9)  # Aggressive drums
                bass = apply_distortion(bass, 0.4)  # Distorted bass
                vocals = apply_compression(vocals, 0.7)  # Compressed vocals
                
                # Mix with genre-appropriate levels
                mix = vocals * 0.8 + drums * 1.2 + bass * 1.0 + other * 1.1
            
            elif target_genre.lower() == "r&b":
                # R&B: Smooth bass, vocal effects, mellow instruments
                bass = apply_bass_boost(bass, 1.2)  # Rich bass
                vocals = apply_reverb(vocals, 0.2, 0.4)  # Smooth vocal reverb
                other = apply_filter(other, "lowpass", 7000)  # Mellow instruments
                
                # Mix with genre-appropriate levels
                mix = vocals * 1.2 + drums * 0.8 + bass * 1.1 + other * 0.9
                
            elif target_genre.lower() == "reggae":
                # Reggae: Echo effects, strong bass, rhythmic elements
                other = apply_delay(other, 0.2, 0.5)  # Echo on instruments
                drums = apply_filter(drums, "lowpass", 6000)  # Filtered drums
                bass = apply_bass_boost(bass, 1.3)  # Prominent bass
                
                # Mix with genre-appropriate levels
                mix = vocals * 0.9 + drums * 1.0 + bass * 1.3 + other * 0.8
            
            else:  # Pop or other genres
                # Pop: Balanced, compressed, radio-friendly
                vocals = apply_compression(vocals, 0.5)  # Compressed vocals
                drums = apply_compression(drums, 0.6)  # Punchy drums
                bass = apply_compression(bass, 0.5)  # Solid bass
                other = apply_compression(other, 0.5)  # Balanced instruments
                
                # Mix with genre-appropriate levels
                mix = vocals * 1.0 + drums * 1.0 + bass * 1.0 + other * 1.0
            
            # Normalize final mix
            mix = librosa.util.normalize(mix)
            
            # Save the transformed audio
            print(f"Saving transformed audio to {output_file}")
            sf.write(output_file, mix, vocals_sr)
            
            print(f"Successfully transformed to {target_genre} genre")
            return True
            
    except Exception as e:
        print(f"Error during transformation: {str(e)}")
        traceback.print_exc()
        # If processing fails, fallback to the original file
        try:
            shutil.copy(input_file, output_file)
            print("Falling back to original file")
        except Exception as copy_err:
            print(f"Error copying original file: {str(copy_err)}")
        return False

# Audio Effect Functions
def apply_compression(audio, ratio):
    """Apply compression to audio"""
    threshold = 0.3
    # Simple compressor implementation
    indices = np.where(np.abs(audio) > threshold)[0]
    if len(indices) > 0:
        audio[indices] = threshold + (audio[indices] - threshold) / ratio
    return audio

def apply_distortion(audio, amount):
    """Apply distortion effect"""
    # Simple waveshaping distortion
    return np.tanh(audio * amount * 3) / np.tanh(amount)

def apply_filter(audio, filter_type, cutoff):
    """Apply filter (lowpass or highpass)"""
    # For simplicity, we're using a very basic filter implementation
    # In a real app, you'd use proper filter design
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
    # Simple delay implementation
    delay_samples = int(delay_time * 44100)  # Assuming 44.1kHz
    delayed = np.zeros_like(audio)
    if delay_samples < len(audio):
        delayed[delay_samples:] = audio[:-delay_samples]
    return audio * (1 - mix) + delayed * mix

def apply_reverb(audio, room_size, mix):
    """Apply reverb effect"""
    # Very simplified reverb simulation
    impulse_response = np.exp(-np.linspace(0, 5, int(room_size * 44100)))
    reverb = np.convolve(audio, impulse_response, mode='full')[:len(audio)]
    return audio * (1 - mix) + reverb * mix

def apply_bass_boost(audio, amount):
    """Apply bass boost"""
    # Simplified bass boost by emphasizing low frequencies
    lowpass = apply_filter(audio, "lowpass", 200)
    return audio + (lowpass * (amount - 1))

def apply_eq_boost(audio, freq, amount):
    """Apply EQ boost at specific frequency"""
    # This is a simplified EQ boost - a real implementation would use proper EQ filters
    # For demonstration purposes only
    return audio * amount

def apply_lfo(audio, depth, rate):
    """Apply LFO modulation"""
    # Simple tremolo effect
    lfo = depth * np.sin(2 * np.pi * np.arange(len(audio)) * rate / 44100)
    return audio * (1 + lfo)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python process_audio.py input_file output_file target_genre")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_genre = sys.argv[3]
    
    success = transform_genre(input_file, output_file, target_genre)
    sys.exit(0 if success else 1) 