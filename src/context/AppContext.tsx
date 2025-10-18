import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProcessedResults } from '../services/aiService';

interface AppContextType {
  resultsData: ProcessedResults | null;
  setResultsData: (data: ProcessedResults | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  hasUploadedFile: boolean;
  setHasUploadedFile: (uploaded: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [resultsData, setResultsData] = useState<ProcessedResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const value: AppContextType = {
    resultsData,
    setResultsData,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    hasUploadedFile,
    setHasUploadedFile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
