'use client';

interface AudioDebugProps {
  audioUrl: string;
}

export default function AudioDebug({ audioUrl }: AudioDebugProps) {
  return (
    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
      <p>Debug Info:</p>
      <p>Audio URL: {audioUrl}</p>
      <audio controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
} 