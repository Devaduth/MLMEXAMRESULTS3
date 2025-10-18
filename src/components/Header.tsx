import React from "react";
import { GraduationCap, Upload } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { usePDFProcessor } from "../hooks/usePDFProcessor";

const Header = () => {
  const { resetUpload } = usePDFProcessor();
  return (
    <div className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
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
            <div className="flex-1 flex justify-end">
              <button
                onClick={resetUpload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Re-upload PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
