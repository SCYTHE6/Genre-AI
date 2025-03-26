'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.css';

interface DropZoneProps {
  onFileUpload: (file: File) => void;
  file: File | null;
}

export default function DropZone({ onFileUpload, file }: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);
  
  const maxSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE 
    ? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) 
    : 10 * 1024 * 1024; // Default to 10MB
    
  const supportedFormats = process.env.NEXT_PUBLIC_SUPPORTED_FORMATS 
    ? process.env.NEXT_PUBLIC_SUPPORTED_FORMATS.split(',').map(format => `.${format.trim()}`)
    : ['.mp3', '.wav', '.ogg', '.m4a'];

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setError(`File is too large. Max size is ${(maxSize / (1024 * 1024)).toFixed(2)} MB`);
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setError(`Unsupported file format. Please use ${supportedFormats.join(', ')}`);
        } else {
          setError(rejection.errors[0].message);
        }
        return;
      }
      
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload, maxSize, supportedFormats]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': supportedFormats
    },
    maxFiles: 1,
    maxSize,
  });

  return (
    <div className={styles.dropzoneContainer}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${error ? styles.error : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the audio file here...</p>
        ) : file ? (
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileSize}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <p>Drag and drop an audio file here, or click to select a file</p>
            <p className={styles.supportedFormats}>
              Supports {supportedFormats.join(', ')} up to {(maxSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
} 