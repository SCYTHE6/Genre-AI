import os
import sys
import numpy as np
import librosa
import soundfile as sf
import traceback

def transform_with_genre_effects(input_file, output_file, target_genre):
    """
    Transform audio using genre-specific audio effects
    """
    print(f"[PYTHON] Starting genre transformation to {target_genre}...")
    
    try:
        # Load audio file
        print(f"[PYTHON] Loading audio file: {input_file}")
        audio, sr = librosa.load(input_file, sr=None)
        print(f"[PYTHON] Audio loaded successfully. Duration: {len(audio)/sr:.2f}s, Sample rate: {sr}Hz")
        
        # Process based on genre
        if target_genre.lower() == "jazz":
            print("[PYTHON] Applying jazz style transformation...")
            processed_audio = apply_jazz_style(audio, sr)
        elif target_genre.lower() == "rock":
            print("[PYTHON] Applying rock style transformation...")
            processed_audio = apply_rock_style(audio, sr)
        elif target_genre.lower() == "electronic":
            print("[PYTHON] Applying electronic style transformation...")
            processed_audio = apply_electronic_style(audio, sr)
        elif target_genre.lower() == "classical":
            print("[PYTHON] Applying classical style transformation...")
            processed_audio = apply_classical_style(audio, sr)
        else:
            print(f"[PYTHON] No specific transformation for genre '{target_genre}', applying default style")
            processed_audio = apply_default_style(audio, sr)
        
        # Save the processed audio
        print(f"[PYTHON] Saving processed audio to: {output_file}")
        sf.write(output_file, processed_audio, sr)
        print(f"[PYTHON] Successfully transformed to {target_genre} style")
        return True
        
    except Exception as e:
        print(f"[PYTHON] Error in genre transformation: {str(e)}")
        print(f"[PYTHON] Traceback: {traceback.format_exc()}")
        # Fall back to original audio
        try:
            print(f"[PYTHON] Falling back to simple processing")
            processed_audio = apply_simple_effects(audio, sr, target_genre)
            sf.write(output_file, processed_audio, sr)
            return True
        except:
            print(f"[PYTHON] Could not apply simple effects, attempting direct file copy")
            import shutil
            shutil.copyfile(input_file, output_file)
            return False

def apply_jazz_style(audio, sr):
    """Apply jazz-like characteristics to audio"""
    print("[PYTHON] Extracting harmonic and percussive components...")
    # Step 1: Split into harmonic and percussive components
    y_harmonic, y_percussive = librosa.effects.hpss(audio)
    
    # Step 2: Enhance harmony with jazz-like characteristics
    print("[PYTHON] Applying jazz harmonics...")
    y_harmonic_shifted1 = librosa.effects.pitch_shift(y_harmonic, sr=sr, n_steps=0.3)
    y_harmonic_shifted2 = librosa.effects.pitch_shift(y_harmonic, sr=sr, n_steps=-0.1)
    y_harmonic = y_harmonic * 0.6 + y_harmonic_shifted1 * 0.3 + y_harmonic_shifted2 * 0.1
    
    # Step 3: Apply swing feel to percussive elements
    print("[PYTHON] Applying swing rhythm...")
    y_perc_output = apply_swing(y_percussive, sr)
    
    # Step 4: Apply "warm" EQ (boost lows and highs)
    print("[PYTHON] Applying jazz EQ...")
    b, a = librosa.filters.butter(4, 300/(sr/2), btype='lowshelf', gain_db=3)
    y_harmonic = librosa.filtfilt(b, a, y_harmonic)
    
    # Step 5: Mix components with jazz-appropriate balance
    print("[PYTHON] Mixing components...")
    result = y_harmonic * 0.75 + y_perc_output * 0.25
    
    # Step 6: Subtle compression
    print("[PYTHON] Applying compression...")
    result = apply_compression(result, threshold=0.3, ratio=4.0)
    
    # Normalize
    result = result / np.max(np.abs(result)) * 0.9
    
    return result

def apply_rock_style(audio, sr):
    """Apply rock characteristics to audio"""
    print("[PYTHON] Extracting harmonic and percussive components...")
    # Step 1: Split into harmonic and percussive components
    y_harmonic, y_percussive = librosa.effects.hpss(audio)
    
    # Step 2: Apply distortion to harmonic content (guitar-like)
    print("[PYTHON] Applying distortion...")
    drive = 3.0  # Distortion amount
    y_harmonic = np.tanh(y_harmonic * drive) / np.tanh(drive)
    
    # Step 3: Enhance drums/percussive elements
    print("[PYTHON] Enhancing drums...")
    y_percussive = y_percussive * 1.8  # Boost percussion
    
    # Apply "rock" EQ (mid boost)
    print("[PYTHON] Applying rock EQ...")
    # Mid boost around 1kHz
    b, a = librosa.filters.butter(4, [500/(sr/2), 2000/(sr/2)], btype='bandpass')
    y_harmonic = librosa.filtfilt(b, a, y_harmonic) * 1.5 + y_harmonic * 0.5
    
    # Add bass boost for rock feel
    b_bass, a_bass = librosa.filters.butter(4, 150/(sr/2), btype='lowshelf', gain_db=6)
    y_harmonic = librosa.filtfilt(b_bass, a_bass, y_harmonic)
    
    # Step 5: Mix components with rock-appropriate balance
    print("[PYTHON] Mixing components...")
    result = y_harmonic * 0.6 + y_percussive * 0.4
    
    # Step 6: Heavy compression for rock feel
    print("[PYTHON] Applying compression...")
    result = apply_compression(result, threshold=0.2, ratio=6.0)
    
    # Normalize but keep it loud
    result = result / np.max(np.abs(result)) * 0.95
    
    return result

def apply_electronic_style(audio, sr):
    """Apply electronic music characteristics to audio"""
    print("[PYTHON] Extracting harmonic and percussive components...")
    # Step 1: Split into harmonic and percussive components
    y_harmonic, y_percussive = librosa.effects.hpss(audio)
    
    # Step 2: Add "synthesizer" effect to harmonic content
    print("[PYTHON] Creating synthesizer effect...")
    # Create a chorus-like effect
    n_voices = 3
    y_synth = np.zeros_like(y_harmonic)
    for i in range(n_voices):
        detune = 0.2 * (i - (n_voices-1)/2)
        voice = librosa.effects.pitch_shift(y_harmonic, sr=sr, n_steps=detune)
        # Add slight phase offset
        offset = int(sr * 0.01 * i)
        if offset < len(voice):
            y_synth[offset:] += voice[:-offset] * (0.8 ** i)
    
    y_synth = y_synth / n_voices
    
    # Step 3: Make percussive elements more "electronic"
    print("[PYTHON] Enhancing beats...")
    # Transient shaper to enhance attack
    perc_env = np.abs(librosa.stft(y_percussive))
    perc_env = librosa.amplitude_to_db(perc_env)
    perc_env = np.maximum(perc_env, perc_env.max() - 80)
    perc_env = librosa.db_to_amplitude(perc_env)
    y_perc_shaped = librosa.istft(perc_env * np.exp(1j * np.angle(librosa.stft(y_percussive))))
    
    # Step 4: Apply "electronic" EQ (sub bass + high end)
    print("[PYTHON] Applying electronic EQ...")
    # Sub bass boost
    b_sub, a_sub = librosa.filters.butter(4, 80/(sr/2), btype='lowshelf', gain_db=9)
    y_perc_shaped = librosa.filtfilt(b_sub, a_sub, y_perc_shaped)
    
    # High end sparkle
    b_high, a_high = librosa.filters.butter(4, 10000/(sr/2), btype='highshelf', gain_db=6)
    y_synth = librosa.filtfilt(b_high, a_high, y_synth)
    
    # Step 5: Mix components with electronic-appropriate balance
    print("[PYTHON] Mixing components...")
    result = y_synth * 0.65 + y_perc_shaped * 0.35
    
    # Step 6: Add sidechain compression effect (simulated)
    print("[PYTHON] Adding sidechain effect...")
    beat_frames = librosa.onset.onset_detect(y=y_perc_shaped, sr=sr)
    if len(beat_frames) > 0:
        envelope = np.ones_like(result)
        for beat in beat_frames:
            beat_time = int(beat)
            # Apply ducking at each beat
            duck_length = int(sr * 0.1)  # 100ms duck
            duck_curve = np.linspace(0.3, 1.0, duck_length) ** 2  # Exponential release
            if beat_time + duck_length < len(envelope):
                envelope[beat_time:beat_time+duck_length] = duck_curve
        result = result * envelope
    
    # Normalize
    result = result / np.max(np.abs(result)) * 0.95
    
    return result

def apply_classical_style(audio, sr):
    """Apply classical music characteristics to audio"""
    print("[PYTHON] Extracting harmonic and percussive components...")
    # Step 1: Split into harmonic and percussive components
    y_harmonic, y_percussive = librosa.effects.hpss(audio)
    
    # Step 2: Enhance the harmonic content (string-like)
    print("[PYTHON] Creating orchestral effect...")
    # Add subtle chorus for string ensemble effect
    y_harmonic_shifted1 = librosa.effects.pitch_shift(y_harmonic, sr=sr, n_steps=0.05)
    y_harmonic_shifted2 = librosa.effects.pitch_shift(y_harmonic, sr=sr, n_steps=-0.05)
    y_harmonic = (y_harmonic + y_harmonic_shifted1 + y_harmonic_shifted2) / 3
    
    # Step 3: Reduce percussive elements (classical usually has less strong percussion)
    y_percussive = y_percussive * 0.5
    
    # Step 4: Apply "classical" EQ (warm mids, reduced highs)
    print("[PYTHON] Applying classical EQ...")
    # Warm mids
    b_mid, a_mid = librosa.filters.butter(4, [300/(sr/2), 2500/(sr/2)], btype='bandpass')
    y_harmonic = librosa.filtfilt(b_mid, a_mid, y_harmonic) * 0.3 + y_harmonic * 0.7
    
    # Gentle high cut (reduce harshness)
    b_high, a_high = librosa.filters.butter(2, 7500/(sr/2), btype='lowpass')
    y_harmonic = librosa.filtfilt(b_high, a_high, y_harmonic)
    
    # Step 5: Add reverb simulation for concert hall effect
    print("[PYTHON] Adding concert hall reverb...")
    ir_length = int(sr * 2)  # 2 second impulse response
    ir = np.exp(-np.linspace(0, 10, ir_length))
    ir = ir / np.sum(ir)  # Normalize
    
    # Convolve with simplified impulse response (computationally efficient approximation)
    y_harmonic_reverb = np.convolve(y_harmonic, ir, mode='same')
    
    # Step 6: Mix dry and wet signals
    print("[PYTHON] Mixing components...")
    result = y_harmonic * 0.3 + y_harmonic_reverb * 0.6 + y_percussive * 0.1
    
    # Step 7: Dynamic range preservation (less compression than modern genres)
    # Just normalize without heavy compression
    result = result / np.max(np.abs(result)) * 0.9
    
    return result

def apply_default_style(audio, sr):
    """Basic processing as fallback"""
    print("[PYTHON] Applying default audio enhancement...")
    # Simple enhancement without specific genre characteristics
    # Clean up with gentle highpass to remove rumble
    b, a = librosa.filters.butter(4, 30/(sr/2), btype='highpass')
    audio = librosa.filtfilt(b, a, audio)
    
    # Gentle compression
    threshold = 0.5
    ratio = 2.0
    audio = apply_compression(audio, threshold=threshold, ratio=ratio)
    
    # Normalize
    audio = audio / np.max(np.abs(audio)) * 0.9
    
    return audio

def apply_simple_effects(audio, sr, genre):
    """Apply simple audio effects based on genre as fallback"""
    print(f"[PYTHON] Applying simple effects for {genre} genre")
    
    if genre.lower() == "rock":
        # Apply distortion effect for rock
        audio = np.tanh(audio * 2.0) * 0.7
        
        # Apply basic EQ
        b, a = librosa.filters.butter(4, 120/(sr/2), btype='highpass')
        audio = librosa.filtfilt(b, a, audio)
        
    elif genre.lower() == "jazz":
        # Apply warmth
        b, a = librosa.filters.butter(4, 300/(sr/2), btype='lowshelf', gain_db=3)
        audio = librosa.filtfilt(b, a, audio)
        
    elif genre.lower() == "electronic":
        # Apply basic beat emphasis
        y_harmonic, y_percussive = librosa.effects.hpss(audio)
        audio = y_harmonic * 0.6 + y_percussive * 1.4
        
        # Add sub bass
        b, a = librosa.filters.butter(4, 80/(sr/2), btype='lowshelf', gain_db=6)
        audio = librosa.filtfilt(b, a, audio)
        
    elif genre.lower() == "classical":
        # Apply reverb
        ir_length = int(sr * 1.5)
        ir = np.exp(-np.linspace(0, 8, ir_length))
        ir = ir / np.sum(ir)
        audio = np.convolve(audio, ir, mode='same')
    
    # Apply normalization
    audio = audio / np.max(np.abs(audio)) * 0.9
    
    return audio

def apply_swing(audio, sr):
    """Apply swing feel to audio"""
    print("[PYTHON] Detecting beats for swing...")
    tempo, beat_frames = librosa.beat.beat_track(y=audio, sr=sr)
    
    if len(beat_frames) < 4:
        print("[PYTHON] Not enough beats detected for swing, using original")
        return audio  # Not enough beats to apply swing
    
    print(f"[PYTHON] Detected {len(beat_frames)} beats at {tempo:.1f} BPM")
    y_output = np.zeros_like(audio)
    
    for i in range(len(beat_frames)-1):
        start_frame = beat_frames[i]
        end_frame = beat_frames[i+1]
        
        # Apply different timing to alternating beats
        if i % 2 == 0:  # Even beats (on-beats)
            segment = audio[start_frame:end_frame]
            y_output[start_frame:start_frame+len(segment)] = segment
        else:  # Odd beats (off-beats) - apply swing
            segment = audio[start_frame:end_frame]
            # Create swing by time-stretching
            stretch_factor = 1.0 + 0.33  # 33% swing
            try:
                stretched = librosa.effects.time_stretch(segment, rate=stretch_factor)
                
                # Adjust length and copy
                target_len = min(len(stretched), end_frame - start_frame)
                y_output[start_frame:start_frame+target_len] = stretched[:target_len]
            except:
                # If stretching fails, use original
                y_output[start_frame:end_frame] = segment
    
    return y_output

def apply_compression(audio, threshold=0.3, ratio=4.0):
    """Apply compression to audio signal"""
    # Simple compressor
    compressed = np.zeros_like(audio)
    for i in range(len(audio)):
        level = np.abs(audio[i])
        if level > threshold:
            gain = threshold + (level - threshold) / ratio
            compressed[i] = audio[i] * (gain / level)
        else:
            compressed[i] = audio[i]
    
    return compressed

if __name__ == "__main__":
    # Test the script directly
    import sys
    if len(sys.argv) != 4:
        print("Usage: python magenta_inspired.py input_file output_file genre")
        sys.exit(1)
    
    success = transform_with_genre_effects(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0 if success else 1)