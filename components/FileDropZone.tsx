'use client';

import { useCallback, useState } from 'react';

interface FileDropZoneProps {
  onFileProcessed: (file: File, accountType: 'checking' | 'credit') => void;
  isProcessing: boolean;
}

export default function FileDropZone({ onFileProcessed, isProcessing }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [accountType, setAccountType] = useState<'checking' | 'credit'>('checking');

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
      onFileProcessed(file, accountType);
    }
  }, [onFileProcessed, accountType]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileProcessed(file, accountType);
    }
  }, [onFileProcessed, accountType]);

  return (
    <div className="w-full">
      {/* Account Type Selector */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <label className="text-sm font-medium text-gray-700">Account Type:</label>
        <div
          className={`relative flex items-center bg-gray-200 rounded-full p-1 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !isProcessing && setAccountType(accountType === 'checking' ? 'credit' : 'checking')}
        >
          <span className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${accountType === 'checking'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600'
            }`}>
            Checking Account
          </span>
          <span className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${accountType === 'credit'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600'
            }`}>
            Credit Card
          </span>
        </div>
      </div>
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
            PDF or CSV files from any bank • Takes under 90 seconds
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

