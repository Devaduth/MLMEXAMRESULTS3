import React from "react";
import Header from "./components/Header";
import Result from "./components/Result";
import Footer from "./components/Footer";
import PDFUpload from "./components/PDFUpload";
import { AppProvider, useAppContext } from "./context/AppContext";
import { usePDFProcessor } from "./hooks/usePDFProcessor";

const AppContent: React.FC = () => {
  const { resultsData, isProcessing, error, hasUploadedFile } = useAppContext();
  const { processPDF } = usePDFProcessor();

  const handleFileUpload = (file: File) => {
    processPDF(file);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {!hasUploadedFile || !resultsData ? (
        <>
        <Header />
        <PDFUpload 
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          error={error}
        />
        <Footer />
        </>
      ) : (
        <>
          <Header />
          <Result resultsData={resultsData} />
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
