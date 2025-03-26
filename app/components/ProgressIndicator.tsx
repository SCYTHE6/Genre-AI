'use client';

import React from 'react';

interface ProgressIndicatorProps {
  processing: boolean;
  progress: number;
}

export default function ProgressIndicator({ processing, progress }: ProgressIndicatorProps) {
  if (!processing) return null;
  
  // Define processing stages for Spleeter
  const stages = [
    "Uploading file...",
    "Initializing Spleeter...",
    "Separating stems...",
    "Applying genre effects...",
    "Mixing stems...",
    "Finalizing output..."
  ];
  
  // Calculate current stage based on progress
  const currentStage = Math.min(
    Math.floor(progress / (100 / stages.length)),
    stages.length - 1
  );
  
  return (
    <div className="progress-overlay">
      <div className="progress-card">
        <h3 style={{ margin: '0 0 16px 0' }}>Processing Audio</h3>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>
            {stages[currentStage]}
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#aaa' }}>
          <span>{Math.round(progress)}% complete</span>
          <span>Please wait...</span>
        </div>
      </div>
    </div>
  );
} 