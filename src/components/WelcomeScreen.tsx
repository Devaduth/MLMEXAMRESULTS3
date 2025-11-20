import React, { useState } from 'react';
import { Upload, FileText, Zap, Shield, TrendingUp } from 'lucide-react';
import { useResults } from '../context/ResultsContext';
import { GeminiDebugger } from './GeminiDebugger';

const WelcomeScreen: React.FC = () => {
  const { uploadPDF, isLoading, uploadProgress, error } = useResults();
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setLocalError(null);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.name.toLowerCase().endsWith('.pdf'));

    if (pdfFile) {
      try {
        await uploadPDF(pdfFile);
      } catch (err: any) {
        setLocalError(err.message || 'Failed to process PDF');
        console.error('Upload error:', err);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalError(null);
      try {
        await uploadPDF(file);
      } catch (err: any) {
        setLocalError(err.message || 'Failed to process PDF');
        console.error('Upload error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Error Display */}
          {(localError || error) && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
                  <p className="mt-1 text-sm text-red-700">{localError || error}</p>
                  <button
                    onClick={() => setLocalError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading ? (
            <>
              <div
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Upload University Results PDF
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Drag and drop your PDF here, or click to browse
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select PDF File
                </label>

                <p className="text-sm text-gray-500 mt-4">
                  Supports PDF files up to 50MB • Processes 29+ page documents in 60-90 seconds
                </p>
              </div>
            </>
          ) : (
            /* Loading State */
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {uploadProgress.message}
              </h3>
              
              <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percent}%` }}
                ></div>
              </div>
              
              <p className="text-lg text-gray-600">
                {uploadProgress.percent}% Complete
              </p>
              
              <p className="text-sm text-gray-500 mt-2">
                Processing with Google Gemini AI...
              </p>
            </div>
          )}
        </div>

        

        
      </div>

      {/* Debug Panel - Remove after fixing issue */}
      <GeminiDebugger />
    </div>
  );
};



export default WelcomeScreen;
