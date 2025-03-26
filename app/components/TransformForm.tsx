import { useState, useRef, FormEvent } from 'react';

interface TransformFormProps {
  onTransformStart: () => void;
  onTransformComplete: (outputUrl: string) => void;
  onTransformError: (error: string) => void;
}

export default function TransformForm({ 
  onTransformStart, 
  onTransformComplete, 
  onTransformError 
}: TransformFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [genre, setGenre] = useState<string>('pop');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genres = [
    'pop', 'rock', 'electronic', 'hip hop', 'jazz', 
    'classical', 'country', 'metal', 'r&b', 'reggae'
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      onTransformError('Please select an audio file');
      return;
    }
    
    if (!genre) {
      onTransformError('Please select a target genre');
      return;
    }

    try {
      setLoading(true);
      onTransformStart();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('genre', genre);
      
      console.log("Submitting file:", file.name);
      console.log("Submitting genre:", genre);
      
      // Send the request
      const response = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transform audio');
      }
      
      const data = await response.json();
      onTransformComplete(data.outputFile);
      
    } catch (error) {
      console.error('Transform error:', error);
      onTransformError(error instanceof Error ? error.message : 'Failed to transform audio');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Audio
        </label>
        
        {!file ? (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="audio/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1 dark:text-gray-400">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MP3, WAV up to 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between p-4 border border-gray-300 rounded-md">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Genre
        </label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || !file
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? 'Processing...' : 'Transform'}
        </button>
      </div>
    </form>
  );
} 