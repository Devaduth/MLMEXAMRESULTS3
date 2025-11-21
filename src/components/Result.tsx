import { useState, useMemo } from "react";
import {
  ChevronDown,
  BookOpen,
  Users,
  Trophy,
  Download,
} from "lucide-react";
import { useResults } from "../context/ResultsContext";
import GradeLegend from "./GradeLegend";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface StudentResult {
  registerNo: string;
  name?: string;
  courses: { [courseCode: string]: string };
}

interface DepartmentData {
  name: string;
  code: string;
  students: StudentResult[];
  courses: { [courseCode: string]: string };
}

const Result = () => {
  const { data, isLoading, error } = useResults();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("default");
  const [filterBy, setFilterBy] = useState<string>("none");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [downloadFormVisible, setDownloadFormVisible] = useState(false);
  const [downloadType, setDownloadType] = useState<"summary" | "studentList">("summary");
  const [downloadTitle, setDownloadTitle] = useState("");
  const [downloadDescription, setDownloadDescription] = useState("");
  const [classSem, setClassSem] = useState("");
  const [teachers, setTeachers] = useState<{ [code: string]: string }>({});
  const [studentRange, setStudentRange] = useState("");

  // Transform parsed data to match existing component structure
  const resultsData = useMemo(() => {
    if (!data) return [];

    return data.departments.flatMap(dept => 
      dept.courses.map(course => ({
        name: dept.name,
        code: course.name, // Using course name as code
        students: course.students.map(student => ({
          registerNo: student.registerNumber,
          name: student.name,
          courses: student.subjects.reduce((acc, subject) => ({
            ...acc,
            [subject.code]: subject.grade
          }), {})
        })),
        courses: course.students[0]?.subjects.reduce((acc, subject) => ({
          ...acc,
          [subject.code]: subject.name
        }), {}) || {}
      }))
    );
  }, [data]);

  const failingGrades = ["F", "Absent", "Withheld"];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Processing PDF...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (!data || resultsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 max-w-md text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Data</h3>
          <p className="text-yellow-600">Please upload a PDF to view results.</p>
        </div>
      </div>
    );
  }

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    setIsDropdownOpen(false);
    setFilterBy("none");
    setSelectedStudents(new Set());
    setTeachers({});
    setStudentRange(""); // Reset range when department changes
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };

  const handleFilterChange = (option: string) => {
    setFilterBy(option);
    setIsFilterDropdownOpen(false);
  };

  const handleStudentSelect = (registerNo: string) => {
    const newSelectedStudents = new Set(selectedStudents);
    if (newSelectedStudents.has(registerNo)) {
      newSelectedStudents.delete(registerNo);
    } else {
      newSelectedStudents.add(registerNo);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const handleTeacherChange = (code: string, name: string) => {
    setTeachers((prev) => ({ ...prev, [code]: name }));
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
    let filtered = [...students];

    // Apply range filter if studentRange is provided
    if (studentRange) {
      const [startReg, endReg] = studentRange.split("-");
      if (startReg && endReg) {
        filtered = filtered.filter((student) => {
          const regNum = student.registerNo;
          return regNum >= startReg && regNum <= endReg;
        });
      }
    }

    if (filterBy === "none") {
      return filtered;
    }
    if (filterBy === "allPass") {
      return filtered.filter((student) =>
        Object.values(student.courses).every(
          (grade) => !failingGrades.includes(grade)
        )
      );
    }
    if (filterBy.startsWith("failed")) {
      const numStr = filterBy.replace("failed", "");
      if (numStr === "5plus") {
        return filtered.filter((student) => countFails(student) > 5);
      } else if (numStr === "3plus") {
        return filtered.filter((student) => countFails(student) > 3);
      } else {
        const num = parseInt(numStr, 10);
        return filtered.filter((student) => countFails(student) === num);
      }
    }
    return filtered.filter((student) => {
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

  const generateReportContent = () => {
    if (!selectedDepartment || selectedStudents.size === 0) return "";

    const dept = resultsData[selectedDepartment];
    const filteredStudents = sortStudents(filterStudents(dept.students)).filter(s =>
      selectedStudents.has(s.registerNo)
    );
    const totalSelected = filteredStudents.length;
    const passedSelected = filteredStudents.filter(s =>
      Object.values(s.courses).every(g => !failingGrades.includes(g))
    ).length;
    const passPercentage = totalSelected > 0 ? Number(((passedSelected / totalSelected) * 100).toFixed(2)) : 0;

    let content = `MANGALAM COLLEGE OF ENGINEERING\nDEPARTMENT OF ${dept.name.toUpperCase()}\nUNIVERSITY RESULT ANALYSIS ${new Date().toLocaleString('default', { month: 'long' }).toUpperCase()} 2025\n\n`;
    content += `Class & Sem                                               : ${classSem}\n`;
    content += `Academic Semester                                    : JAN 2025 - MAY 2025\n`;
    content += `Total number of Students registered         : ${totalSelected}\n`;
    content += `Total number of Students all cleared         : ${passedSelected}\n`;
    content += `Pass Percentage in S2(with WH)              : (${passedSelected}/${totalSelected}) ${passPercentage}%\n`;
    content += `Pass Percentage in S2(without WH)        : (${passedSelected}/${totalSelected}) ${passPercentage}%\n`;
    content += `Overall Pass % upto S2                            : (${passedSelected}/${totalSelected}) ${passPercentage}%\n\n`;

    content += `Sl No\tSubject Code\tSubject Name\tSubject Handled\tTotal No of Students\tNo.of students Passed\tNo.of Students failed\t% of pass\n`;
    let slNo = 1;
    Object.entries(dept.courses).forEach(([code, name]) => {
      const total = filteredStudents.length;
      const passed = filteredStudents.filter(s => !failingGrades.includes(s.courses[code] || "N/A")).length;
      const failed = total - passed;
      const percentage = total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0;
      const teacher = teachers[code] || "Staff Name";
      content += `${slNo}\t${code}\t${name}\t${teacher}\t${total}\t${passed}\t${failed}\t${percentage}\n`;
      slNo++;
    });

    const failCounts = [1, 2, 3, "3plus"].map(n => {
      if (n === "3plus") {
        return filteredStudents.filter(s => countFails(s) > 3).length;
      } else {
        return filteredStudents.filter(s => countFails(s) === n).length;
      }
    });
    content += `\nTotal Number of students failed in one subject\t\t${failCounts[0]}\n`;
    content += `Total Number of students failed in 2 subjects\t\t${failCounts[1]}\n`;
    content += `Total Number of students failed in 3 subjects\t\t${failCounts[2]}\n`;
    content += `Total Number of students failed more than 3 subjects\t\t${failCounts[3]}\n`;
    content += `Total Number of students failed in all subjects\t\t${filteredStudents.filter(s => countFails(s) === Object.keys(dept.courses).length).length}\n\n`;
    content += `CLASS IN CHARGE\t\tHOD\t\tPRINCIPAL\n`;

    return content;
  };

  const generateStudentListContent = () => {
    if (!selectedDepartment || selectedStudents.size === 0) return "";

    const dept = resultsData[selectedDepartment];
    const filteredStudents = sortStudents(filterStudents(dept.students)).filter(s =>
      selectedStudents.has(s.registerNo)
    );
    const totalSelected = filteredStudents.length;
    const passedSelected = filteredStudents.filter(s =>
      Object.values(s.courses).every(g => !failingGrades.includes(g))
    ).length;
    const passPercentage = totalSelected > 0 ? Number(((passedSelected / totalSelected) * 100).toFixed(2)) : 0;
    const courseCodes = Object.keys(dept.courses);

    // Compute stats per course
    const passCounts: { [code: string]: number } = {};
    const failureCounts: { [code: string]: number } = {};
    const withheldCounts: { [code: string]: number } = {};
    const absentCounts: { [code: string]: number } = {};
    const passPercentages: { [code: string]: number } = {};

    courseCodes.forEach(code => {
      passCounts[code] = filteredStudents.filter(s => {
        const grade = s.courses[code] || "N/A";
        return !failingGrades.includes(grade);
      }).length;
      failureCounts[code] = filteredStudents.filter(s => s.courses[code] === "F").length;
      withheldCounts[code] = filteredStudents.filter(s => s.courses[code] === "Withheld").length;
      absentCounts[code] = filteredStudents.filter(s => s.courses[code] === "Absent").length;
      passPercentages[code] = totalSelected > 0 ? Number(((passCounts[code] / totalSelected) * 100).toFixed(2)) : 0;
    });

    let content = `MANGALAM COLLEGE OF ENGINEERING\nDEPARTMENT OF ${dept.name.toUpperCase()}\nUNIVERSITY RESULT ANALYSIS ${new Date().toLocaleString('default', { month: 'long' }).toUpperCase()} 2025\n\n`;
    content += `Class & Sem                                               : ${classSem}\n`;
    content += `Academic Semester                                    : JAN 2025 - MAY 2025\n`; // Adjust as needed; hardcoded to match current
    content += `Total number of Students registered         : ${totalSelected}\n`;
    content += `Total number of Students all cleared         : ${passedSelected}\n`;
    content += `Pass Percentage in S2                                : (${passedSelected}/${totalSelected}) ${passPercentage}%\n`;
    content += `Overall Pass % upto S2                             : (${passedSelected}/${totalSelected}) ${passPercentage}%\n\n`;

    // Student table header
    content += `Sl. No.\tReg No\tName of Student\tSubject Code`;
    for (let i = 0; i < courseCodes.length - 1; i++) {
      content += `\t`;
    }
    content += `\tNo.of supplies in S2\n`; // Adjusted to S2 to match code context
    content += `\t\t\t${courseCodes.join('\t')}\n`;

    // Student rows
    filteredStudents.forEach((student, index) => {
      const slNo = index + 1;
      content += `${slNo}\t${student.registerNo}\t${student.name || "N/A"}\t${courseCodes.map(code => student.courses[code] || "N/A").join('\t')}\t${countFails(student)}\n`;
    });

    // Summary rows below student table
    content += `No.of Pass\t\t\t${courseCodes.map(code => passCounts[code]).join('\t')}\n`;
    content += `No.of Failures\t\t\t${courseCodes.map(code => failureCounts[code]).join('\t')}\n`;
    content += `No of withheld\t\t\t${courseCodes.map(code => withheldCounts[code]).join('\t')}\n`;
    content += `No.of Absentees\t\t\t${courseCodes.map(code => absentCounts[code]).join('\t')}\n`;
    content += `Pass Percentage\t\t\t${courseCodes.map(code => passPercentages[code]).join('\t')}\n\n`;

    // Subject table
    content += `Sl No\tSubject Code\tSubject Name\tSubject Handled by\t% of pass\n`;
    let slNo = 1;
    Object.entries(dept.courses).forEach(([code, name]) => {
      const teacher = teachers[code] || "Staff Name";
      const percentage = passPercentages[code];
      content += `${slNo}\t${code}\t${name}\t${teacher}\t${percentage}\n`;
      slNo++;
    });

    content += `\n\nCLASS IN CHARGE\t\tHOD\t\tPRINCIPAL\n`;

    return content;
  };

  const handleDownload = () => {
    if (selectedStudents.size === 0) return;
    setDownloadType("summary");
    setDownloadFormVisible(true);
  };

  const handleDownloadStudentList = () => {
    if (selectedStudents.size === 0) return;
    setDownloadType("studentList");
    setDownloadFormVisible(true);
  };

  const exportToExcel = () => {
    const content = downloadType === "summary" ? generateReportContent() : generateStudentListContent();
    const lines = content.split("\n");
    const wb = XLSX.utils.book_new();
    const wsData = lines.map(line => line.split("\t"));
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "ResultAnalysis");
    XLSX.writeFile(wb, `${downloadTitle || "ResultAnalysis"}.xlsx`);
    setDownloadFormVisible(false);
  };

  const exportToPDF = () => {
    if (!selectedDepartment || selectedStudents.size === 0 || downloadType !== "summary") return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const content = generateReportContent().split("\n");
    let y = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("MANGALAM COLLEGE OF ENGINEERING", pageWidth / 2, 12, { align: "center" });
    doc.setFontSize(12);
    doc.text(`DEPARTMENT OF ${resultsData[selectedDepartment].name.toUpperCase()}`, pageWidth / 2, 17, { align: "center" });
    y = 30;

    content.forEach(line => {
      const textWidth = doc.getTextWidth(line);
      if (y + 7 > pageHeight - margin) {
        doc.addPage();
        y = 20;
        // Add header to new page
        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, pageWidth, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("MANGALAM COLLEGE OF ENGINEERING", pageWidth / 2, 12, { align: "center" });
        doc.text(`DEPARTMENT OF ${resultsData[selectedDepartment].name.toUpperCase()}`, pageWidth / 2, 17, { align: "center" });
        y = 30;
      }

      if (textWidth > pageWidth - 2 * margin) {
        const words = line.split(" ");
        let lineText = "";
        for (let word of words) {
          const testLine = lineText + (lineText ? " " : "") + word;
          const testWidth = doc.getTextWidth(testLine);
          if (testWidth > pageWidth - 2 * margin && lineText) {
            doc.text(lineText, margin, y);
            y += 7;
            lineText = word;
          } else {
            lineText = testLine;
          }
        }
        if (lineText) {
          doc.text(lineText, margin, y);
          y += 7;
        }
      } else {
        doc.text(line, margin, y);
        y += 7;
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`, margin, pageHeight - 10);

    doc.save(`${downloadTitle || "ResultAnalysis"}.pdf`);
    setDownloadFormVisible(false);
  };

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Selection, Sorting, and Filtering */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    ? `${resultsData[selectedDepartment].name}`
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
                    {/* <div className="text-sm text-gray-500">
                      Department Code: {code}
                    </div> */}
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
          {/* New Range Filter Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Register Range
            </label>
            <input
              type="text"
              value={studentRange}
              onChange={(e) => setStudentRange(e.target.value)}
              placeholder="e.g., MLM24CS061-MLM24CS125"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {selectedDepartment && (
          <div className="mb-4 flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={selectedStudents.size === 0}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </button>
            <button
              onClick={handleDownloadStudentList}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={selectedStudents.size === 0}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Student List
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Download className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-800">Class Report</h4>
                <p className="text-sm text-blue-600 mt-1">
                  Select students and use the "Download Report" button to generate a comprehensive class report.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Download className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-800">Student List Report</h4>
                <p className="text-sm text-green-600 mt-1">
                  Select students and use the "Download Student List" button to generate a detailed student list report.
                </p>
              </div>
            </div>
          </div>
        </div>
        {downloadFormVisible && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-96">
              <h3 className="text-lg font-semibold mb-4">Download Report</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={downloadTitle}
                  onChange={(e) => setDownloadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={downloadDescription}
                  onChange={(e) => setDownloadDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Class & Sem</label>
                <input
                  type="text"
                  value={classSem}
                  onChange={(e) => setClassSem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Teachers</label>
                {Object.entries(resultsData[selectedDepartment]?.courses || {}).map(([code, name]) => (
                  <div key={code} className="mb-2">
                    <label className="block text-xs text-gray-600">{code} - {name.slice(0, 20)}...</label>
                    <input
                      type="text"
                      value={teachers[code] || ""}
                      onChange={(e) => handleTeacherChange(code, e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDownloadFormVisible(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export to Excel
                </button>
                {downloadType === "summary" && (
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Export to PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedDepartment && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats?.totalStudents ?? 0}
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
                    {departmentStats?.passPercentage ?? 0}%
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
                    {departmentStats?.totalCourses ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const newSelected = new Set<string>();
                          if (e.target.checked) {
                            sortStudents(filterStudents(resultsData[selectedDepartment].students)).forEach(s =>
                              newSelected.add(s.registerNo)
                            );
                          }
                          setSelectedStudents(newSelected);
                        }}
                        checked={selectedStudents.size === sortStudents(filterStudents(resultsData[selectedDepartment].students)).length}
                      />
                    </th>
                    <th className="sticky left-[150px] top-0 bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 z-20">
                      Name
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
                    <th className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      No. of Supplies
                    </th>
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
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student.registerNo)}
                            onChange={() => handleStudentSelect(student.registerNo)}
                          />
                          {student.registerNo}
                        </td>
                        <td className="sticky left-[150px] bg-inherit px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {student.name || "N/A"}
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
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-red-600">
                          {countFails(student)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedDepartment && (
          <GradeLegend />
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