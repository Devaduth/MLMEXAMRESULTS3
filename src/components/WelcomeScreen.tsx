import React, { useState } from "react";
import { Upload, FileText, Zap, Shield, TrendingUp } from "lucide-react";
import { useResults } from "../context/ResultsContext";
import { GeminiDebugger } from "./GeminiDebugger";

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
    const pdfFile = files.find((file) =>
      file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFile) {
      try {
        await uploadPDF(pdfFile);
      } catch (err: any) {
        setLocalError(err.message || "Failed to process PDF");
        console.error("Upload error:", err);
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
        setLocalError(err.message || "Failed to process PDF");
        console.error("Upload error:", err);
      }
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-16 px-4 transition-colors duration-300">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 text-gray-900 dark:text-white">
            Exam Results Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-inter max-w-2xl mx-auto">
            Upload your PDF results and get instant analysis with AI-powered
            insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 p-6 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold font-poppins text-gray-800 dark:text-gray-100 mb-2">
              Lightning Fast
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              AI-powered processing delivers results in minutes
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold font-poppins text-gray-800 dark:text-gray-100 mb-2">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Your data is processed securely and never stored
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-300">
            <div className="bg-gray-100 dark:bg-slate-700 w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold font-poppins text-gray-800 dark:text-gray-100 mb-2">
              Smart Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              Get detailed insights and performance metrics
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-slate-800 p-8 mb-8 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors duration-300">
          {/* Error Display */}
          {(localError || error) && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Upload Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    {localError || error}
                  </p>
                  <button
                    onClick={() => setLocalError(null)}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
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
                className={`border-2 border-dashed p-12 text-center transition-all duration-200 rounded-xl ${
                  isDragging
                    ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-gray-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-800"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>

                <h3 className="text-xl font-semibold font-poppins text-gray-900 dark:text-gray-100 mb-2">
                  Upload Results PDF
                </h3>

                <p className="text-gray-600 dark:text-gray-400 font-inter mb-6 text-sm">
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
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white font-medium font-poppins hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 transition-all duration-200 rounded-lg shadow-sm cursor-pointer"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Select PDF File
                </label>

                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-inter">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full"></div>
                    <span>Up to 50MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full"></div>
                    <span>60-90 seconds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full"></div>
                    <span>AI Powered</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Loading State */
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-slate-700"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-900 dark:border-gray-300 border-t-transparent animate-spin"></div>
              </div>

              <h3 className="text-2xl font-semibold font-poppins text-gray-900 dark:text-gray-100 mb-3">
                {uploadProgress.message}
              </h3>

              <div className="max-w-md mx-auto bg-gray-200 dark:bg-slate-700 h-3 mb-4 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-gray-300 h-full transition-all duration-500"
                  style={{ width: `${uploadProgress.percent}%` }}
                ></div>
              </div>

              <p className="text-xl font-medium font-poppins text-gray-700 dark:text-gray-300 mb-4">
                {uploadProgress.percent}% Complete
              </p>

              <div className="bg-gray-100 dark:bg-slate-800 p-5 max-w-lg mx-auto border border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-inter leading-relaxed">
                  <strong>Our AI is analyzing your document with precision.</strong>
                  <p className="text-xs text-gray-500">
                    Please wait this may take 5–10 minutes.
                  </p>
                  <p className="text-xs">As a wise man once said, “Good things takes time.”</p>
                  <br />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel - Remove after fixing issue */}
      {/* <GeminiDebugger /> */}
    </div>
  );
};

export default WelcomeScreen;
