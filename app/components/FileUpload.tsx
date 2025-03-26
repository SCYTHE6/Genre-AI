import { useState, useCallback, useRef, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('File dropped:', file.name, 'Size:', file.size, 'Type:', file.type);
      setSelectedFileName(file.name);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024, // 8MB
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false)
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropzone's onClick from firing
    // Trigger the hidden file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('File selected via input:', file.name, 'Size:', file.size, 'Type:', file.type);
      setSelectedFileName(file.name);
      onFileSelected(file);
    }
  };

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragging ? 'dragging' : ''} ${selectedFileName ? 'file-selected' : ''}`}
      >
        <input 
          {...getInputProps()} 
          ref={fileInputRef} 
          onChange={handleFileInputChange}
        />
        
        <div className="dropzone-content">
          <div className="upload-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          
          {selectedFileName ? (
            <p className="selected-file">Selected: {selectedFileName}</p>
          ) : (
            <p className="drag-text">Drag 'n' drop files here, or click to select files</p>
          )}
          
          <button 
            type="button"
            onClick={handleButtonClick}
            className="choose-file-btn"
          >
            Choose File
          </button>
          <p className="file-limit">You can upload 8 files (up to 8 MB each)</p>
        </div>
      </div>
    </div>
  );
} 