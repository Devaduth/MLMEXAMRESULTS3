import { useState } from "react";
import Header from "./components/Header";
import Result from "./components/Result";
import Footer from "./components/Footer";
import PdfExtractor from "./components/PdfExtractor";

function App() {
  
  const [showPdfExtractor, setShowPdfExtractor] = useState(true);
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <Header />
      {showPdfExtractor && (
        <div style={{ padding: '20px' }}>
          <PdfExtractor />
        </div>
      )}
      {showResults && <Result />}
      <Footer />
    </>
  );
}

export default App;
