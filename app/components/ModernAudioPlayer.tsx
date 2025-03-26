import React, { useState, useEffect, useRef } from 'react';

interface ModernAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  onEnded?: () => void;
}

const ModernAudioPlayer: React.FC<ModernAudioPlayerProps> = ({
  src,
  title = 'Audio Track',
  artist = '',
  coverImage = '',
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar || !audioRef.current) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };
  
  const handleRewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };
  
  const handleForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="modern-audio-player">
      <div className="player-card">
        <div className="player-content">
          {coverImage && (
            <div className="album-art">
              <img src={coverImage} alt="Cover Art" />
            </div>
          )}
          
          <div className="player-info">
            <div className="track-details">
              <h3 className="track-title">{title}</h3>
              {artist && <p className="track-artist">{artist}</p>}
            </div>
            
            <div className="progress-container">
              <div 
                className="progress-bar-bg" 
                ref={progressRef}
                onClick={handleProgressClick}
              >
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="time-display">
                <span className="current-time">{formatTime(currentTime)}</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="controls">
              <button className="control-button" onClick={handleRewind} aria-label="Rewind">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.5 12l8.5 6V6m-9 12V6l-8.5 6 8.5 6z"></path>
                </svg>
              </button>
              <button className="control-button play-button" onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                )}
              </button>
              <button className="control-button" onClick={handleForward} aria-label="Forward">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"></path>
                </svg>
              </button>
              <button className="control-button volume-button" aria-label="Volume">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default ModernAudioPlayer; 