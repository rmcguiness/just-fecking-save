'use client';

import { useCallback, useState } from 'react';

interface FileDropZoneProps {
  onFileProcessed: (file: File) => void;
  isProcessing: boolean;
}

export default function FileDropZone({ onFileProcessed, isProcessing }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => 
      f.type === 'text/csv' || 
      f.type === 'application/pdf' || 
      f.name.endsWith('.csv') || 
      f.name.endsWith('.pdf')
    );

    if (file) {
      onFileProcessed(file);
    }
  }, [onFileProcessed]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileProcessed(file);
    }
  }, [onFileProcessed]);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg min-h-[300px]
          transition-all duration-200 flex items-center justify-center
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50'}
        `}
      >
        <input
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
          disabled={isProcessing}
        />
        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-12"
        >
          <p className="text-xl font-bold text-black mb-3 text-center">
            Drop your last 2-3 months of statements
          </p>
          <p className="text-base text-black text-center">
            CSV files from any bank • Takes under 90 seconds
          </p>
        </label>
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-blue-500 font-medium">Processing...</div>
          </div>
        )}
        
        {/* Privacy message at bottom */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
          <p className="text-xs text-gray-400 text-center">
            Your files are analyzed and immediately discarded. Nothing is stored.
          </p>
        </div>
      </div>
    </div>
  );
}

