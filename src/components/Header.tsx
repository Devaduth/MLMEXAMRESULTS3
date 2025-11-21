import { GraduationCap, Upload, Trash2, Sparkles, Sun, Moon } from "lucide-react";
import { useResults } from "../context/ResultsContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { clearData, hasPDFData } = useResults();
  const { theme, toggleTheme } = useTheme();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data and upload a new PDF?')) {
      clearData();
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="relative">
          {/* Theme Switcher - Top Right */}
          <div className="absolute right-0 top-0 z-30">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-gray-700" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>

          {/* Top Left Logos */}
          <div className="absolute left-0 top-0 flex items-center gap-3">
            <img
              src="/images/accreditation.jpg"
              alt="Accreditation"
              className="h-16 w-auto object-contain"
            />
            <img
              src="/images/kirf.jpg"
              alt="KIRF"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex flex-col items-center">
                {/* Main Logo */}
                <img
                  src="/images/mlm-logo.gif"
                  alt="Mangalam College of Engineering"
                  className="h-20 w-auto"
                />

                {/* University Name */}
                <div className="flex items-center justify-center mt-4 bg-gray-50 dark:bg-slate-800 px-5 py-2">
                  <GraduationCap className="h-6 w-6 text-gray-700 dark:text-gray-300 mr-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-inter font-medium">
                    APJ Abdul Kalam Technological University
                  </p>
                </div>

                {/* Department Name */}
                <div className="mt-3 bg-slate-900 dark:bg-slate-800 text-white px-6 py-2">
                  <p className="font-semibold text-center font-poppins text-sm">
                    Department of Computer Science & Engineering
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {hasPDFData && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-medium font-poppins hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Upload New PDF</span>
                </button>
                
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-6 py-2.5 bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-200 font-medium font-poppins hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Clear Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
    </div>
  );
};

export default Header;
