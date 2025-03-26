'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    // Set up event listeners
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Effect for setting initial audio properties
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  // Separate effect for handling play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      setIsLoading(false);
      
      // Ensure volume is set correctly
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration > 0) {
      const progressRect = progressRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
      const seekTime = Math.max(0, Math.min(seekPosition * duration, duration));
      
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleError = () => {
    setError('Error loading audio. The file may be corrupted or unsupported.');
    setIsLoading(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleLoadedData}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.mainControls}>
            <button 
              className={styles.skipButton}
              onClick={() => skip(-10)}
              disabled={isLoading || duration <= 0}
              aria-label="Skip backward 10 seconds"
              type="button"
            >
              -10s
            </button>
            
            <button 
              className={styles.playButton}
              onClick={togglePlay}
              disabled={isLoading || duration <= 0}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              type="button"
            >
              {isLoading ? '⏳' : isPlaying ? '❚❚' : '▶'}
            </button>
            
            <button 
              className={styles.skipButton}
              onClick={() => skip(10)}
              disabled={isLoading || duration <= 0}
              aria-label="Skip forward 10 seconds"
              type="button"
            >
              +10s
            </button>
          </div>
          
          <div className={styles.progressArea}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            
            <div 
              className={styles.progressContainer}
              ref={progressRef}
              onClick={handleSeek}
            >
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
          
          <div className={styles.secondaryControls}>
            <div className={styles.volumeControl}>
              <button 
                className={styles.muteButton}
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                type="button"
              >
                {isMuted ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
                aria-label="Volume"
              />
            </div>
            
            <div className={styles.playbackControl}>
              <span className={styles.playbackLabel}>Speed:</span>
              <div className={styles.playbackButtons}>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    className={`${styles.playbackButton} ${playbackRate === rate ? styles.activeRate : ''}`}
                    onClick={() => handlePlaybackRateChange(rate)}
                    aria-label={`Set playback speed to ${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}