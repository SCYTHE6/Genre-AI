"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import LoadingOverlay from './components/LoadingOverlay';
import ModernAudioPlayer from '@/app/components/ModernAudioPlayer';
import SimpleAudioTest from './components/SimpleAudioTest';
import FileUpload from './components/FileUpload';
import SuccessNotification from './components/SuccessNotification';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [genre, setGenre] = useState<string>('rock');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transformedAudioUrl, setTransformedAudioUrl] = useState<string>('');
  const [originalAudio, setOriginalAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const transformedAudioRef = useRef<HTMLAudioElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const transformedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isOriginalPlaying, setIsOriginalPlaying] = useState<boolean>(false);
  const [isTransformedPlaying, setIsTransformedPlaying] = useState<boolean>(false);
  const [originalCurrentTime, setOriginalCurrentTime] = useState<number>(0);
  const [originalDuration, setOriginalDuration] = useState<number>(0);
  const [transformedCurrentTime, setTransformedCurrentTime] = useState<number>(0);
  const [transformedDuration, setTransformedDuration] = useState<number>(0);
  
  // Audio context and analyzers
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [originalAnalyser, setOriginalAnalyser] = useState<AnalyserNode | null>(null);
  const [transformedAnalyser, setTransformedAnalyser] = useState<AnalyserNode | null>(null);
  
  // Add to your state declarations:
  const [originalSource, setOriginalSource] = useState<MediaElementSourceNode | null>(null);
  const [transformedSource, setTransformedSource] = useState<MediaElementSourceNode | null>(null);
  
  // Add state for notification
  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  // Add state for transformation details
  const [transformationDetails, setTransformationDetails] = useState<string>('');
  
  // Add state for transformation completion
  const [transformationComplete, setTransformationComplete] = useState<boolean>(false);
  
  // Initialize audio context
  useEffect(() => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    
    return () => {
      if (context) {
        context.close();
      }
    };
  }, []);
  
  // Set up visualization for original audio
  useEffect(() => {
    if (!audioContext || !originalAudioRef.current || !originalCanvasRef.current) return;
    
    // Only create source node if it doesn't exist
    if (!originalSource) {
      try {
        const source = audioContext.createMediaElementSource(originalAudioRef.current);
        setOriginalSource(source);
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        setOriginalAnalyser(analyser);
      } catch (error) {
        console.error("Error setting up original audio:", error);
        return;
      }
    }
    
    if (!originalAnalyser) return;
    
    const bufferLength = originalAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const canvas = originalCanvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    if (!canvasCtx) return;
    
    const draw = () => {
      if (!isOriginalPlaying) return;
      
      requestAnimationFrame(draw);
      
      originalAnalyser.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(15, 23, 42)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#7f5af0');
      gradient.addColorStop(1, '#2cb67d');
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
    
    // No disconnection needed in cleanup since we're keeping the source
    
  }, [audioContext, isOriginalPlaying, originalSource, originalAnalyser]);
  
  // Set up visualization for transformed audio
  useEffect(() => {
    if (!audioContext || !transformedAudioRef.current || !transformedCanvasRef.current) return;
    
    // Only create source node if it doesn't exist
    if (!transformedSource) {
      try {
        const source = audioContext.createMediaElementSource(transformedAudioRef.current);
        setTransformedSource(source);
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        setTransformedAnalyser(analyser);
      } catch (error) {
        console.error("Error setting up transformed audio:", error);
        return;
      }
    }
    
    if (!transformedAnalyser) return;
    
    const bufferLength = transformedAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const canvas = transformedCanvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    if (!canvasCtx) return;
    
    const draw = () => {
      if (!isTransformedPlaying) return;
      
      requestAnimationFrame(draw);
      
      transformedAnalyser.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(15, 23, 42)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#2cb67d');
      gradient.addColorStop(1, '#7f5af0');
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
    
    // No disconnection needed in cleanup since we're keeping the source
    
  }, [audioContext, isTransformedPlaying, transformedSource, transformedAnalyser]);
  
  // Handle original audio time updates
  const handleOriginalTimeUpdate = () => {
    if (originalAudioRef.current) {
      setOriginalCurrentTime(originalAudioRef.current.currentTime);
    }
  };
  
  // Handle transformed audio time updates
  const handleTransformedTimeUpdate = () => {
    if (transformedAudioRef.current) {
      setTransformedCurrentTime(transformedAudioRef.current.currentTime);
    }
  };
  
  // Handle original audio meta data loaded
  const handleOriginalMetadataLoaded = () => {
    if (originalAudioRef.current) {
      setOriginalDuration(originalAudioRef.current.duration);
    }
  };
  
  // Handle transformed audio meta data loaded
  const handleTransformedMetadataLoaded = () => {
    if (transformedAudioRef.current) {
      setTransformedDuration(transformedAudioRef.current.duration);
    }
  };
  
  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Play/pause original audio
  const toggleOriginalPlayback = () => {
    if (originalAudioRef.current) {
      if (isOriginalPlaying) {
        originalAudioRef.current.pause();
      } else {
        // Ensure we resume the AudioContext if it's suspended
        if (audioContext?.state === 'suspended') {
          audioContext.resume();
        }
        originalAudioRef.current.play();
      }
      setIsOriginalPlaying(!isOriginalPlaying);
    }
  };
  
  // Play/pause transformed audio
  const toggleTransformedPlayback = () => {
    if (transformedAudioRef.current) {
      if (isTransformedPlaying) {
        transformedAudioRef.current.pause();
      } else {
        // Ensure we resume the AudioContext if it's suspended
        if (audioContext?.state === 'suspended') {
          audioContext.resume();
        }
        transformedAudioRef.current.play();
      }
      setIsTransformedPlaying(!isTransformedPlaying);
    }
  };
  
  // Seek in original audio
  const seekOriginalAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (originalAudioRef.current) {
      const time = parseFloat(e.target.value);
      originalAudioRef.current.currentTime = time;
      setOriginalCurrentTime(time);
    }
  };
  
  // Seek in transformed audio
  const seekTransformedAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (transformedAudioRef.current) {
      const time = parseFloat(e.target.value);
      transformedAudioRef.current.currentTime = time;
      setTransformedCurrentTime(time);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
    setFile(selectedFile);
    setTransformedAudioUrl(null);
    setError(null);
    
    // Clean up existing audio processing
    if (originalSource) {
      originalSource.disconnect();
      setOriginalSource(null);
    }
    if (originalAnalyser) {
      originalAnalyser.disconnect();
      setOriginalAnalyser(null);
    }
    
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setOriginalAudio(objectUrl);
    } else {
      setOriginalAudio(null);
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
  };

  // Define your transform function outside of any form
  const handleTransformClick = async () => {
    console.log('Transform button clicked directly!');
    
    // Check if file is selected
    if (!file) {
      alert('Please select an audio file first.');
      return;
    }
    
    // Log file details before submission
    console.log('Preparing to submit file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    console.log('Selected genre:', genre);
    
    setIsProcessing(true);
    setError(null);
    
    // Clean up existing transformed audio processing
    if (transformedSource) {
      transformedSource.disconnect();
      setTransformedSource(null);
    }
    if (transformedAnalyser) {
      transformedAnalyser.disconnect();
      setTransformedAnalyser(null);
    }
    setTransformedAudioUrl(null);
    
    // Clean up the genre value to ensure it's a valid string
    let genreValue = genre || 'rock';
    
    // Remove any special characters or excessive whitespace
    genreValue = genreValue.trim().replace(/[^\w\s-]/g, '');
    
    // Ensure there's a fallback
    if (!genreValue) {
      genreValue = 'rock';
    }
    
    console.log('Cleaned genre value:', genreValue);
    
    const formData = new FormData();
    
    // Ensure correct append of file with a unique name
    formData.append('audioFile', file, file.name);
    
    // Make sure genre is a string
    formData.append('genre', genreValue);
    
    // Log what's in the form data
    console.log('Form data entries:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    try {
      console.log('Sending request to /api/transform');
      const response = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
        }
        
        console.error('Error response data:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.error || errorText || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Transformation result:', data);
      
      // Handle the successful transformation - more robust checking
      if (data.success && data.transformedFilePath) {
        setTransformedAudioUrl(data.transformedFilePath);
        setTransformationComplete(true);
        setTransformationDetails(data.message || "Audio successfully transformed");
        setShowNotification(true);
        console.log('Transformation complete, audio URL:', data.transformedFilePath);
      } else {
        console.error('Unexpected API response:', data);
        throw new Error(data.message || 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Error transforming audio:', error);
      setError(`Failed to transform audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTransformedAudioUrl(null);
    setOriginalAudio(null);
    setError(null);
    setIsOriginalPlaying(false);
    setIsTransformedPlaying(false);
    
    // Clean up audio processing nodes
    if (originalSource) {
      originalSource.disconnect();
      setOriginalSource(null);
    }
    if (transformedSource) {
      transformedSource.disconnect();
      setTransformedSource(null);
    }
    if (originalAnalyser) {
      originalAnalyser.disconnect();
      setOriginalAnalyser(null);
    }
    if (transformedAnalyser) {
      transformedAnalyser.disconnect();
      setTransformedAnalyser(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add this debug effect to log when transformedAudio changes
  useEffect(() => {
    console.log("Transformed audio state changed:", transformedAudioUrl);
  }, [transformedAudioUrl]);

  // Add this useEffect to remove any unwanted loading elements
  useEffect(() => {
    // Function to remove any large circular elements
    const removeUnwantedLoadingIndicators = () => {
      // Look for large circular elements
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        // Check if the element is circular and large
        if (
          styles.borderRadius === '50%' || 
          styles.borderRadius === '100%' ||
          (el.tagName === 'svg' && el.getAttribute('viewBox') && el.getAttribute('viewBox').includes('0 0 100 100'))
        ) {
          const rect = el.getBoundingClientRect();
          // If it's a large element (larger than 200px in any dimension)
          if (rect.width > 200 || rect.height > 200) {
            console.log('Found large circular element:', el);
            
            // Check if it's a direct child of body or a modal container
            const parent = el.parentElement;
            if (
              parent === document.body || 
              parent.classList.contains('modal-container') ||
              parent.classList.contains('loading-container') ||
              styles.position === 'fixed'
            ) {
              console.log('Removing unwanted loading indicator:', el);
              el.style.display = 'none';
              // Optionally remove it entirely if safe
              // parent.removeChild(el);
            }
          }
        }
      });
    };

    // Run when component mounts
    removeUnwantedLoadingIndicators();
    
    // Also run whenever processing state changes
    if (isProcessing) {
      // Wait a short time for any loading elements to appear
      const timer = setTimeout(() => {
        removeUnwantedLoadingIndicators();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  const handleTestUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('audioFile', file, file.name);
      formData.append('genre', genre || 'rock');
      
      console.log('Testing upload with file:', file.name);
      
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Test upload response:', data);
      
      alert('Test upload successful! Check console for details.');
    } catch (error) {
      console.error('Test upload error:', error);
      alert('Test upload failed: ' + error.message);
    }
  };

  // Add this to the very beginning of your component for page load animation
  useEffect(() => {
    document.body.classList.add('fade-in');
    
    // Add staggered animation classes to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.classList.add('staggered-slide-up');
    });
    
    return () => {
      document.body.classList.remove('fade-in');
    };
  }, []);

  return (
    <div className="container">
      <div className="page-background"></div>

      <div className="heading-container">
        <h1 className="main-heading">Transform Your Audio</h1>
        <p className="main-subheading">
          Upload an audio file and convert it to your selected genre with our AI-powered transformation engine
        </p>
      </div>

      <div className="card upload-form-card">
        <h2 className="section-title">Upload an audio file (MP3, WAV)</h2>
        
        <div className="dropzone-container">
          <FileUpload onFileSelected={handleFileSelected} />
        </div>
        
        <h2 className="genre-selection-label">Select Target Genre</h2>
        
        <div className="genre-selection-container">
          <select 
            className="genre-select"
            value={genre}
            onChange={handleGenreChange}
          >
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="electronic">Electronic</option>
            <option value="classical">Classical</option>
          </select>
        </div>
        
        <div className="buttons-container">
          <button 
            type="button"
            className="transform-button"
            onClick={handleTransformClick}
            disabled={isProcessing || !file}
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <>
                <span className="transform-icon">▶</span> Transform Audio
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {originalAudio && (
        <div className="mt-4">
          <label className="block text-white font-medium mb-2">
            Original Audio
          </label>
          
          <div className="modern-player">
            <div className="player-container">
              <div className="player-thumbnail no-image">
                {/* Default music note shown when no thumbnail */}
              </div>
              
              <div className="player-content">
                <div className="player-header">
                  <h3 className="player-title">{file?.name || 'Original Audio'}</h3>
                  <p className="player-subtitle">Original Track</p>
                </div>
                
                <div className="player-controls">
                  <button 
                    className="player-button"
                    onClick={(e) => {
                      // Stop event from bubbling up
                      e.stopPropagation();
                      
                      if (originalAudioRef.current) {
                        originalAudioRef.current.currentTime = Math.max(0, originalAudioRef.current.currentTime - 10);
                      }
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7L4 12L12 17V7Z" fill="currentColor" />
                      <path d="M20 7L12 12L20 17V7Z" fill="currentColor" />
                    </svg>
                  </button>
                  
                  <button 
                    className="player-button play-pause"
                    onClick={(e) => {
                      // Completely prevent default behavior
                      e.preventDefault();
                      // Stop propagation to parent elements
                      e.stopPropagation();
                      // Use setTimeout to break the event chain
                      setTimeout(() => {
                        if (originalAudioRef.current) {
                          if (originalAudioRef.current.paused) {
                            originalAudioRef.current.play();
                            setIsOriginalPlaying(true);
                          } else {
                            originalAudioRef.current.pause();
                            setIsOriginalPlaying(false);
                          }
                        }
                      }, 0);
                      // Return false to prevent additional event handling
                      return false;
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {isOriginalPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
                        <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="white" />
                      </svg>
                    )}
                  </button>
                  
                  <button 
                    className="player-button"
                    onClick={(e) => {
                      // Stop event from bubbling up
                      e.stopPropagation();
                      
                      if (originalAudioRef.current) {
                        originalAudioRef.current.currentTime = Math.min(
                          originalAudioRef.current.duration, 
                          originalAudioRef.current.currentTime + 10
                        );
                      }
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7V17L20 12L12 7Z" fill="currentColor" />
                      <path d="M4 7V17L12 12L4 7Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                
                <div className="player-progress">
                  <div 
                    className="progress-bar"
                    onClick={(e) => {
                      // Stop event from bubbling up
                      e.stopPropagation();
                      
                      if (originalAudioRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        originalAudioRef.current.currentTime = pos * originalAudioRef.current.duration;
                      }
                    }}
                  >
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${originalAudioRef.current ? 
                          (originalAudioRef.current.currentTime / originalAudioRef.current.duration) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="time-display">
                    <span>{originalAudioRef.current ? formatTime(originalAudioRef.current.currentTime) : '0:00'}</span>
                    <span>{originalAudioRef.current ? formatTime(originalAudioRef.current.duration) : '0:00'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <audio 
              ref={originalAudioRef}
              src={originalAudio}
              className="hidden"
              onTimeUpdate={() => setOriginalCurrentTime(originalAudioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setOriginalDuration(originalAudioRef.current?.duration || 0)}
              onEnded={() => setIsOriginalPlaying(false)}
            />
          </div>
        </div>
      )}

      {transformedAudioUrl && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-white">
            Transformed Audio ({genre})
          </h3>
          
          <div className="modern-player">
            <div className="player-container">
              <div className="player-thumbnail" style={{ backgroundImage: `url(/genre-thumbnails/${genre}.jpg)` }}>
                {/* Genre-specific thumbnail - fallback to gradient if image doesn't exist */}
              </div>
              
              <div className="player-content">
                <div className="player-header">
                  <h3 className="player-title">{file?.name || 'Audio'} - {genre} Version</h3>
                  <p className="player-subtitle">AI Transformed</p>
                </div>
                
                <div className="player-controls">
                  <button 
                    className="player-button"
                    onClick={(e) => {
                      if (transformedAudioRef.current) {
                        transformedAudioRef.current.currentTime = Math.max(0, transformedAudioRef.current.currentTime - 10);
                      }
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7L4 12L12 17V7Z" fill="currentColor" />
                      <path d="M20 7L12 12L20 17V7Z" fill="currentColor" />
                    </svg>
                  </button>
                  
                  <button 
                    className="player-button play-pause"
                    onClick={(e) => {
                      if (transformedAudioRef.current) {
                        if (transformedAudioRef.current.paused) {
                          transformedAudioRef.current.play();
                          setIsTransformedPlaying(true);
                        } else {
                          transformedAudioRef.current.pause();
                          setIsTransformedPlaying(false);
                        }
                      }
                    }}
                  >
                    {isTransformedPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
                        <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="white" />
                      </svg>
                    )}
                  </button>
                  
                  <button 
                    className="player-button"
                    onClick={(e) => {
                      if (transformedAudioRef.current) {
                        transformedAudioRef.current.currentTime = Math.min(
                          transformedAudioRef.current.duration, 
                          transformedAudioRef.current.currentTime + 10
                        );
                      }
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7V17L20 12L12 7Z" fill="currentColor" />
                      <path d="M4 7V17L12 12L4 7Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                
                <div className="player-progress">
                  <div 
                    className="progress-bar"
                    onClick={(e) => {
                      // Stop event from bubbling up
                      e.stopPropagation();
                      
                      if (transformedAudioRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        transformedAudioRef.current.currentTime = pos * transformedAudioRef.current.duration;
                      }
                    }}
                  >
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${transformedAudioRef.current ? 
                          (transformedAudioRef.current.currentTime / transformedAudioRef.current.duration) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="time-display">
                    <span>{transformedAudioRef.current ? formatTime(transformedAudioRef.current.currentTime) : '0:00'}</span>
                    <span>{transformedAudioRef.current ? formatTime(transformedAudioRef.current.duration) : '0:00'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <audio 
              ref={transformedAudioRef}
              src={transformedAudioUrl}
              className="hidden"
              onTimeUpdate={() => setTransformedCurrentTime(transformedAudioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setTransformedDuration(transformedAudioRef.current?.duration || 0)}
              onEnded={() => setIsTransformedPlaying(false)}
            />
          </div>
          
          <div className="download-button-container">
            <a
              href={transformedAudioUrl}
              download={`transformed-${genre}.mp3`}
              className="download-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {genre} Version
            </a>
          </div>
        </div>
      )}

      {isProcessing && <LoadingOverlay />}

      {showNotification && (
        <SuccessNotification 
          message="Audio transformed successfully!" 
          onClose={() => setShowNotification(false)} 
        />
      )}

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card ai-card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Transformation</h3>
            <p>Our advanced AI models analyze your audio and transform it based on genre-specific characteristics.</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-3">Multiple Genres</h3>
            <p>Transform your audio into Rock, Jazz, Electronic, Classical and more genres with a single click.</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-3">High Quality Output</h3>
            <p>Enjoy high-fidelity audio output that preserves the original quality while applying genre transformations.</p>
          </div>
        </div>
      </div>

      {/* 
      <button 
        type="button"
        onClick={handleTestUpload}
        className="test-button"
        style={{ marginTop: '1rem' }}
      >
        Test Upload Only
      </button>
      */}

      {/* New section for transformation details */}
      {transformationComplete && transformedAudioUrl && (
        <div className="result-section">
          <h2>Transformation Complete!</h2>
          <p className="transformation-details">{transformationDetails}</p>
          
          <div className="audio-player-container">
            <audio 
              controls 
              src={transformedAudioUrl}
              className="audio-player"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="download-container">
            <a 
              href={transformedAudioUrl} 
              download 
              className="download-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download {genre} Version
            </a>
          </div>
        </div>
      )}
    </div>
  );
}