import React, { useState, useEffect } from 'react';

export default function LoadingOverlay() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Preparing audio file...');
  
  // Simulate processing stages
  useEffect(() => {
    const stages = [
      { time: 0, text: 'Preparing audio file...', progress: 10 },
      { time: 1000, text: 'Analyzing audio characteristics...', progress: 25 },
      { time: 2500, text: 'Separating audio stems...', progress: 40 },
      { time: 4000, text: 'Applying genre effects...', progress: 65 },
      { time: 5500, text: 'Fine-tuning output...', progress: 85 },
      { time: 7000, text: 'Finalizing transformation...', progress: 95 }
    ];
    
    stages.forEach(({ time, text, progress }) => {
      const timer = setTimeout(() => {
        setStage(text);
        setProgress(progress);
      }, time);
      
      return () => clearTimeout(timer);
    });
  }, []);
  
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
        <div className="loading-text">
          <p className="loading-title">Transforming Your Audio</p>
          <p className="loading-subtitle">{stage}</p>
          <div className="loading-progress">
            <div className="loading-bar">
              <div 
                className="loading-bar-fill" 
                style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }}
              ></div>
            </div>
            <div className="progress-percentage">{progress}%</div>
          </div>
        </div>
      </div>
    </div>
  );
} 