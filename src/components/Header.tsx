import React from "react";
import { GraduationCap } from "lucide-react";

const Header = () => {
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
        </div>
      </div>
    </div>
  );
};

export default Header;
