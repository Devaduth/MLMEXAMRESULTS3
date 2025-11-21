const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center">
        {/* Animated M Logo */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-slate-700"></div>
          
          {/* Rotating Accent Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-600 dark:border-t-indigo-500 dark:border-r-indigo-500 animate-spin"></div>
          
          {/* Inner M Shape Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
              {/* Left Leg */}
              <rect 
                x="10" 
                y="16" 
                width="4" 
                height="32" 
                fill="url(#gradient-indigo)"
                className="animate-pulse-subtle"
              />
              
              {/* Middle Peak */}
              <rect 
                x="30" 
                y="16" 
                width="4" 
                height="24" 
                fill="url(#gradient-orange)"
                className="animate-pulse-subtle-delayed"
              />
              
              {/* Right Leg */}
              <rect 
                x="50" 
                y="16" 
                width="4" 
                height="32" 
                fill="url(#gradient-indigo)"
                className="animate-pulse-subtle"
              />
              
              {/* Left Diagonal */}
              <line 
                x1="12" 
                y1="16" 
                x2="32" 
                y2="24" 
                stroke="url(#gradient-indigo)" 
                strokeWidth="2"
                strokeLinecap="round"
              />
              
              {/* Right Diagonal */}
              <line 
                x1="52" 
                y1="16" 
                x2="32" 
                y2="24" 
                stroke="url(#gradient-indigo)" 
                strokeWidth="2"
                strokeLinecap="round"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
                <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 blur-2xl animate-pulse"></div>
        </div>

        {/* College Name */}
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold font-poppins text-gray-800 dark:text-gray-100 tracking-tight">
            Mangalam College
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
            Department of Computer Science
          </p>
        </div>

        {/* Loading Text with Dots Animation */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 font-inter">
            Preparing your results
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-bounce animation-delay-200"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-bounce animation-delay-400"></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-indigo-600 via-orange-500 to-indigo-600 dark:from-indigo-500 dark:via-orange-400 dark:to-indigo-500 rounded-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
