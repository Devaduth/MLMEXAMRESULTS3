import { useState } from "react";
import Header from "./components/Header";
import Result from "./components/Result";
import Footer from "./components/Footer";
import PdfToExcelConverter from "./components/PDFToExcelConverter";


function App() {
  const [currentView, setCurrentView] = useState<'results' | 'converter'>('results');
  
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex">
            <button
              onClick={() => setCurrentView('results')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'results'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              View Results
            </button>
            <button
              onClick={() => setCurrentView('converter')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'converter'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              PDF to Excel
            </button>
          </div>
        </div>
        
        {currentView === 'results' ? <Result /> : <PdfToExcelConverter />}
      </div>
      <Footer />
    </>
  );
}

export default App;
