import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { processPDFWithAI } from '../services/aiService';

export const usePDFProcessor = () => {
  const { 
    setResultsData, 
    setIsProcessing, 
    setError, 
    setHasUploadedFile 
  } = useAppContext();

  const processPDF = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Processing PDF with AI...');
      const processedData = await processPDFWithAI(file);
      
      if (!processedData || Object.keys(processedData).length === 0) {
        throw new Error('No valid data could be extracted from the PDF. Please check if the PDF contains exam results.');
      }

      console.log('Data processed successfully:', Object.keys(processedData));

      // Store the results
      setResultsData(processedData);
      setHasUploadedFile(true);
      setIsProcessing(false);

    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
    }
  }, [setResultsData, setIsProcessing, setError, setHasUploadedFile]);

  const resetUpload = useCallback(() => {
    setResultsData(null);
    setHasUploadedFile(false);
    setError(null);
    setIsProcessing(false);
  }, [setResultsData, setHasUploadedFile, setError, setIsProcessing]);

  return {
    processPDF,
    resetUpload,
  };
};
