'use client';

import React from 'react';

interface SimpleAudioTestProps {
  src: string;
  title?: string;
}

export default function SimpleAudioTest({ src, title = 'Audio' }: SimpleAudioTestProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg mt-2 mb-4">
      <h4 className="text-white mb-2">{title}</h4>
      <audio src={src} controls className="w-full" />
    </div>
  );
} 