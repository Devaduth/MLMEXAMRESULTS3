import React from 'react'


const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "bg-green-100 text-green-800 border-green-200";
      case "A+":
      case "A":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "B+":
      case "B":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "C+":
      case "C":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "D":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "P":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "F":
        return "bg-red-100 text-red-800 border-red-200";
      case "PASS":
        return "bg-green-50 text-green-700 border-green-200";
      case "Absent":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Withheld":
        return "bg-gray-200 text-gray-700 border-gray-300";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
const GradeLegend = () => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Legend
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { grade: "S", desc: "Outstanding" },
                { grade: "A+", desc: "Excellent" },
                { grade: "A", desc: "Very Good" },
                { grade: "B+", desc: "Good Plus" },
                { grade: "B", desc: "Good" },
                { grade: "C+", desc: "Average Plus" },
                { grade: "C", desc: "Average" },
                { grade: "D", desc: "Pass" },
                { grade: "P", desc: "Pass" },
                { grade: "F", desc: "Fail" },
                { grade: "PASS", desc: "Passed" },
                { grade: "Absent", desc: "Absent" },
                { grade: "Withheld", desc: "Withheld" },
              ].map(({ grade, desc }) => (
                <div key={grade} className="text-center">
                  <div
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border mb-1 ${getGradeColor(
                      grade
                    )}`}
                  >
                    {grade}
                  </div>
                  <div className="text-xs text-gray-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
  )
}

export default GradeLegend