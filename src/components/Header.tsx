import { GraduationCap, Upload, Trash2 } from "lucide-react";
import { useResults } from "../context/ResultsContext";

const Header = () => {
  const { clearData, hasPDFData } = useResults();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data and upload a new PDF?')) {
      clearData();
    }
  };

  return (
    <div className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div>
              <img
                src="/images/mlm-logo.gif"
                alt="Mangalam College of Engineering"
                className="h-20 w-auto"
              />
              <div className="flex items-center justify-center mt-2">
                <GraduationCap className="h-10 w-10 text-blue-600 mr-2" />
                <p className="text-sm text-center text-gray-600 mt-1">
                  APJ Abdul Kalam Technological University
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {hasPDFData && (
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleClearData}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New PDF
              </button>
              
              <button
                onClick={handleClearData}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
