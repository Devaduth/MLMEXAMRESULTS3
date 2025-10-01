import React, { useState } from "react";
import {
  ChevronDown,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
} from "lucide-react";
import resultsData from "../data/ResultsData";

interface StudentResult {
  registerNo: string;
  courses: { [courseCode: string]: string };
}

interface DepartmentData {
  name: string;
  code: string;
  students: StudentResult[];
  courses: { [courseCode: string]: string };
}

const Result = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("default");
  const [filterBy, setFilterBy] = useState<string>("none");

  const failingGrades = ["F", "Absent", "Withheld"];

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    setIsDropdownOpen(false);
    setFilterBy("none"); // Reset filter when department changes
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };

  const handleFilterChange = (option: string) => {
    setFilterBy(option);
    setIsFilterDropdownOpen(false);
  };

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

  const countFails = (student: StudentResult) => {
    return Object.values(student.courses).filter((grade) =>
      failingGrades.includes(grade)
    ).length;
  };

  const filterStudents = (students: StudentResult[]) => {
    if (filterBy === "none") {
      return students;
    }
    if (filterBy === "allPass") {
      return students.filter((student) =>
        Object.values(student.courses).every(
          (grade) => !failingGrades.includes(grade)
        )
      );
    }
    if (filterBy.startsWith("failed")) {
      const numStr = filterBy.replace("failed", "");
      if (numStr === "5plus") {
        return students.filter((student) => countFails(student) > 5);
      }else if(numStr === "3plus"){
        return students.filter((student) => countFails(student) > 3);
      } else {
        const num = parseInt(numStr, 10);
        return students.filter((student) => countFails(student) === num);
      }
    }
    // Filter by specific course pass
    return students.filter((student) => {
      const grade = student.courses[filterBy];
      return grade && !failingGrades.includes(grade);
    });
  };

  const sortStudents = (students: StudentResult[]) => {
    const sorted = [...students];
    if (sortOption === "allPass") {
      return sorted.sort((a, b) => {
        const aHasNoFail = !Object.values(a.courses).some((grade) =>
          failingGrades.includes(grade)
        );
        const bHasNoFail = !Object.values(b.courses).some((grade) =>
          failingGrades.includes(grade)
        );
        if (aHasNoFail && !bHasNoFail) return -1;
        if (!aHasNoFail && bHasNoFail) return 1;
        return a.registerNo.localeCompare(b.registerNo);
      });
    }
    return sorted.sort((a, b) => a.registerNo.localeCompare(b.registerNo));
  };

  const departmentStats = selectedDepartment
    ? (() => {
        const students = resultsData[selectedDepartment]?.students || [];
        const totalStudents = students.length;

        const passed = students.filter((student) =>
          Object.values(student.courses ?? {}).every(
            (grade) => !failingGrades.includes(grade)
          )
        ).length;

        return {
          totalStudents,
          passPercentage:
            totalStudents > 0
              ? Number(((passed / totalStudents) * 100).toFixed(2))
              : 0,
          totalCourses: Object.keys(
            resultsData[selectedDepartment]?.courses || {}
          ).length,
        };
      })()
    : null;

  const courseStats = selectedDepartment
    ? (() => {
        const students = resultsData[selectedDepartment]?.students || [];
        const totalStudents = students.length;
        const courses = resultsData[selectedDepartment]?.courses || {};
        const stats: { [courseCode: string]: { passed: number; percentage: number } } = {};

        Object.keys(courses).forEach((courseCode) => {
          const passedCount = students.filter((student) => {
            const grade = student.courses[courseCode];
            return grade && !failingGrades.includes(grade);
          }).length;

          const percentage =
            totalStudents > 0
              ? Number(((passedCount / totalStudents) * 100).toFixed(2))
              : 0;

          stats[courseCode] = { passed: passedCount, percentage };
        });

        return stats;
      })()
    : null;

  const getFilterDisplay = () => {
    if (filterBy === "none") return "No Filter";
    if (filterBy === "allPass") return "All Pass";
    if (filterBy.startsWith("failed")) {
      const numStr = filterBy.replace("failed", "");
      if (numStr === "5plus") return "Failed in 5+ subjects";
      return `Failed in ${numStr} subject${parseInt(numStr) > 1 ? "s" : ""}`;
    }
    const courseName = resultsData[selectedDepartment]?.courses[filterBy] || filterBy;
    return `Passed in ${filterBy} - ${courseName.slice(0, 20)}...`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Selection, Sorting, and Filtering */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    selectedDepartment ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {selectedDepartment
                    ? `${resultsData[selectedDepartment].name} (${selectedDepartment})`
                    : "Choose a department..."}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {Object.entries(resultsData).map(([code, dept]) => (
                  <button
                    key={code}
                    onClick={() => handleDepartmentChange(code)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{dept.name}</div>
                    <div className="text-sm text-gray-500">
                      Department Code: {code}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  {sortOption === "allPass"
                    ? "All Pass (No Failures)"
                    : "Register Number"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isSortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isSortDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                <button
                  onClick={() => handleSortChange("default")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    Register Number
                  </div>
                </button>
                <button
                  onClick={() => handleSortChange("allPass")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    All Pass (No Failures)
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter By
            </label>
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  {getFilterDisplay()}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isFilterDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isFilterDropdownOpen && selectedDepartment && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                <button
                  onClick={() => handleFilterChange("none")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">No Filter</div>
                </button>
                <button
                  onClick={() => handleFilterChange("allPass")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">All Pass</div>
                </button>
                <hr className="border-gray-100" />
                {Object.entries(resultsData[selectedDepartment].courses).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleFilterChange(code)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                  >
                    <div className="font-medium text-gray-900">Passed in {code}</div>
                    <div className="text-sm text-gray-500">{name.slice(0, 30)}...</div>
                  </button>
                ))}
                <hr className="border-gray-100" />
                <button
                  onClick={() => handleFilterChange("failed1")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">Failed in 1 subject</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed2")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">Failed in 2 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed3")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">Failed in 3 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed3plus")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">Failed in 3+ subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed4")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">Failed in 4 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed5")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">Failed in 5 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed5plus")}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">Failed in 5+ subjects</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Department Statistics */}
        {selectedDepartment && departmentStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.totalStudents}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.passPercentage}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.totalCourses}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {selectedDepartment && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {resultsData[selectedDepartment].name} - Student Results
                <span className="text-sm text-gray-600 ml-2">
                  (No of students: {sortStudents(filterStudents(resultsData[selectedDepartment].students)).length})
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Academic Year: 2024-28 | Semester: 2
              </p>
            </div>

            <div className="relative max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 top-0 bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 z-20">
                      Register No.
                    </th>
                    {Object.entries(
                      resultsData[selectedDepartment].courses
                    ).map(([code, name]) => (
                      <th
                        key={code}
                        className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                      >
                        <div className="font-bold">{code}</div>
                        <div className="text-xs text-gray-400 normal-case mt-1 line-clamp-2">
                          {name}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Pass: {courseStats?.[code]?.passed || 0} / {courseStats?.[code]?.percentage || 0}%
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortStudents(filterStudents(resultsData[selectedDepartment].students)).map(
                    (student, index) => (
                      <tr
                        key={student.registerNo}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 border-r border-gray-200">
                          {student.registerNo}
                        </td>
                        {Object.keys(
                          resultsData[selectedDepartment].courses
                        ).map((courseCode) => (
                          <td
                            key={courseCode}
                            className="px-3 py-4 whitespace-nowrap text-center"
                          >
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getGradeColor(
                                student.courses[courseCode] || "N/A"
                              )}`}
                            >
                              {student.courses[courseCode] || "N/A"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grade Legend */}
        {selectedDepartment && (
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
        )}

        {!selectedDepartment && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Select a Department
            </h3>
            <p className="text-gray-600">
              Choose a department from the dropdown above to view student
              results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;