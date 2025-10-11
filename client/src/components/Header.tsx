import React from 'react'
import { GraduationCap } from 'lucide-react'


const Header = () => {
  return (
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  APJ Abdul Kalam Technological University
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Mangalam College of Engineering
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg inline-block">
              <h2 className="text-xl font-semibold">
                B.Tech S2 (R) Exam Results - May 2025 (2024 Scheme)
              </h2>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Header