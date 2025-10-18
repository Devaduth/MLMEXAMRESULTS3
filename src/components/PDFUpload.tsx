import React, { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface PDFUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onFileUpload, isProcessing, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setSelectedFile(pdfFile);
      onFileUpload(pdfFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReUpload = () => {
    handleRemoveFile();
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            Upload your exam results PDF to get intelligent analysis and structured data
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!selectedFile && !isProcessing && (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload PDF Results
              </h3>
              <p className="text-gray-600 mb-6">
                Drag and drop your PDF file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <FileText className="h-5 w-5 mr-2" />
                Choose PDF File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {selectedFile && !isProcessing && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <FileText className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  File Selected Successfully
                </h3>
                <p className="text-green-700 mb-4">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReUpload}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Choose Different File
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Processing Your PDF
                </h3>
                <p className="text-blue-700 mb-4">
                  Our AI is analyzing your exam results and extracting structured data...
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  This may take a few moments depending on the file size
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Error Processing PDF</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleReUpload}
                className="mt-3 inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <p>AI extracts and analyzes your PDF content</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <p>Data is structured into organized format</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <p>Results are displayed with analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
