'use client';

import { useState } from 'react';
import FileDropZone from '@/components/FileDropZone';
import ResultsDisplay from '@/components/ResultsDisplay';
import Footer from '@/components/Footer';
import { processFile } from '@/utils/fileProcessor';
import type { ProcessedData } from '@/types';

export default function Home() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcessed = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    const startTime = Date.now();

    try {
      const data = await processFile(file);
      const endTime = Date.now();
      setProcessingTime((endTime - startTime) / 1000);
      setProcessedData(data);
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error processing file. Please try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-1 bg-white p-8">
      <div className="flex items-center justify-center mb-6">
        <div className="w-full max-w-4xl">
          <div className="flex items-end gap-4 mb-4">
            <div>
              <h1 className="text-5xl font-extrabold text-black mb-2">
                just fucking save
              </h1>
              <p className="text-blue-500 text-md">
                Filter and organize your dumbass spending
              </p>
            </div>
            <button
              onClick={() => {
                // Handle star button click
                console.log('Star button clicked');
              }}
              className="px-3 py-1 bg-white border border-dashed border-gray-300 rounded-full flex items-center gap-1.5 transition-all duration-200 hover:bg-blue-200 hover:border-blue-500 hover:scale-105 cursor-pointer"
            >
              <svg
                className="w-3 h-3 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">223</span>
            </button>
          </div>
          <div className="border-t-2 border-dashed border-blue-300"></div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {!processedData ? (
            <FileDropZone
              onFileProcessed={handleFileProcessed}
              isProcessing={isProcessing}
            />
          ) : (
            <ResultsDisplay
              data={processedData}
              processingTime={processingTime}
              onReset={() => {
                setProcessedData(null);
                setProcessingTime(null);
                setError(null);
              }}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

