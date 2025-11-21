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
    <div className="relative bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="relative">
          {/* Theme Switcher - Top Right */}
          <div className="absolute right-0 top-0 z-30">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-200 shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-gray-700 hover:text-indigo-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300 hover:text-indigo-400" />
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
                <div className="flex items-center justify-center mt-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-950/20 px-5 py-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                  <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-inter font-medium">
                    APJ Abdul Kalam Technological University
                  </p>
                </div>

                {/* Department Name */}
                <div className="mt-3 bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-slate-800 dark:to-indigo-950 text-white px-6 py-2.5 rounded-lg shadow-sm">
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
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white font-medium font-poppins hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 transition-all duration-200 rounded-lg shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Upload New PDF</span>
                </button>
                
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium font-poppins hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Clear Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
    </div>
  );
};

export default Header;
