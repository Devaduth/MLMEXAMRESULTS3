import { ResultsProvider, useResults } from "./context/ResultsContext";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
import Result from "./components/Result";
import Footer from "./components/Footer";

function AppContent() {
  const { hasPDFData, data, isLoading, error } = useResults();

  console.log(
    "🔍 AppContent render - hasPDFData:",
    hasPDFData,
    "isLoading:",
    isLoading,
    "hasData:",
    !!data,
    "error:",
    error
  );

  // Show WelcomeScreen if no PDF data exists
  if (!hasPDFData) {
    console.log("📱 Rendering WelcomeScreen (no PDF data)");
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <WelcomeScreen />
        <Footer />
      </div>
    );
  }

  // Show main dashboard after successful upload
  console.log("📊 Rendering Dashboard (has PDF data)");
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <Result />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ResultsProvider>
      <AppContent />
    </ResultsProvider>
  );
}

export default App;
