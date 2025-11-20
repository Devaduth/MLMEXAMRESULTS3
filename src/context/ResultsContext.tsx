import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParsedResults, parseUniversityPDF } from '../services/pdfParser';

interface UploadProgress {
  percent: number;
  message: string;
}

interface ResultsContextType {
  data: ParsedResults | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: UploadProgress;
  hasPDFData: boolean;
  uploadPDF: (file: File) => Promise<void>;
  clearData: () => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

const STORAGE_KEY = 'university_results_data';

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ParsedResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percent: 0,
    message: 'Ready to upload',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        console.log('✅ Loaded saved results from localStorage');
      } catch (err) {
        console.error('Failed to load saved data:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const uploadPDF = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress({ percent: 0, message: 'Starting upload...' });

    console.log('📤 Starting PDF upload:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    try {
      const results = await parseUniversityPDF(file, (percent, message) => {
        console.log(`📊 Progress: ${percent}% - ${message}`);
        setUploadProgress({ percent, message });
      });

      console.log('✅ Parsing complete, received results:', results);
      
      setData(results);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      console.log('💾 Saved to localStorage');
      
      setUploadProgress({ percent: 100, message: 'Upload complete!' });
      
      console.log('✅ PDF uploaded and parsed successfully');
      console.log('📊 Data state updated, hasPDFData should now be true');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process PDF';
      setError(errorMessage);
      setUploadProgress({ percent: 0, message: 'Upload failed' });
      console.error('❌ PDF upload error:', err);
      console.error('Error stack:', err.stack);
      
      // Show error to user
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Upload process finished, isLoading set to false');
    }
  };

  const clearData = () => {
    setData(null);
    setError(null);
    setUploadProgress({ percent: 0, message: 'Ready to upload' });
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared all data');
  };

  const hasPDFData = data !== null;
  
  // Debug logging
  useEffect(() => {
    console.log('📊 Context state changed:', {
      hasPDFData,
      hasData: !!data,
      isLoading,
      error,
      dataKeys: data ? Object.keys(data) : 'null'
    });
  }, [data, isLoading, error, hasPDFData]);

  return (
    <ResultsContext.Provider
      value={{
        data,
        isLoading,
        error,
        uploadProgress,
        hasPDFData,
        uploadPDF,
        clearData,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = (): ResultsContextType => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
