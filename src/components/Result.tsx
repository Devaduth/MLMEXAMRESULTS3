import { useState, useMemo } from "react";
import {
  ChevronDown,
  BookOpen,
  Users,
  Trophy,
  Download,
  Upload,
} from "lucide-react";
import { useResults } from "../context/ResultsContext";
import GradeLegend from "./GradeLegend";
import ResultCharts from "./ResultCharts";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { exportStyledExcel, exportStudentListExcel } from "../utils/excelExporter";

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
  const { data, isLoading, error, uploadSupplyPDF } = useResults();
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
  const [showSupplyUpload, setShowSupplyUpload] = useState(false);
  const [supplyFile, setSupplyFile] = useState<File | null>(null);
  const [supplyUploading, setSupplyUploading] = useState(false);

  // Transform parsed data to match existing component structure
  const resultsData = useMemo(() => {
    if (!data) return {};

    const departments = data.departments.flatMap(dept => 
      dept.courses.map(course => {
        // Collect ALL unique subjects across ALL students
        const allSubjects = new Map<string, string>();
        
        course.students.forEach(student => {
          student.subjects.forEach(subject => {
            if (!allSubjects.has(subject.code)) {
              allSubjects.set(subject.code, subject.name);
            }
          });
        });

        return {
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
          // Use the complete map of all subjects instead of just first student's subjects
          courses: Object.fromEntries(allSubjects)
        };
      })
    );

    // Convert array to object keyed by code
    return departments.reduce((acc, dept) => {
      acc[dept.code] = dept;
      return acc;
    }, {} as { [key: string]: any });
  }, [data]);

  const failingGrades = ["F", "Absent", "Withheld"];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-300 dark:border-slate-600 border-t-gray-800 dark:border-t-slate-400 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Processing PDF...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 max-w-md">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (!data || Object.keys(resultsData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 max-w-md text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No Data</h3>
          <p className="text-gray-600 dark:text-gray-400">Please upload a PDF to view results.</p>
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
        // Handle "ALL" departments case
        if (selectedDepartment === "ALL") {
          let totalStudents = 0;
          let totalPassed = 0;
          let totalSubjects = new Set<string>();

          Object.values(resultsData).forEach((dept: any) => {
            const deptStudents = dept.students;
            totalStudents += deptStudents.length;
            
            const passedInDept = deptStudents.filter((student: any) =>
              Object.values(student.courses ?? {}).every(
                (grade) => !failingGrades.includes(grade)
              )
            ).length;
            
            totalPassed += passedInDept;
            Object.keys(dept.courses).forEach(code => totalSubjects.add(code));
          });

          const passPercentage = totalStudents > 0 
            ? Number(((totalPassed / totalStudents) * 100).toFixed(2))
            : 0;

          return {
            totalStudents,
            passPercentage,
            totalCourses: totalSubjects.size,
          };
        }

        // Handle individual department
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

  const exportToExcel = async () => {
    if (!selectedDepartment || selectedStudents.size === 0) return;

    const dept = resultsData[selectedDepartment];
    const filteredStudents = sortStudents(filterStudents(dept.students)).filter(s =>
      selectedStudents.has(s.registerNo)
    );
    const totalSelected = filteredStudents.length;
    const passedSelected = filteredStudents.filter(s =>
      Object.values(s.courses).every(g => !failingGrades.includes(g))
    ).length;
    const passPercentage = totalSelected > 0 ? Number(((passedSelected / totalSelected) * 100).toFixed(2)) : 0;

    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();

    try {
      if (downloadType === "summary") {
        // Prepare subject-wise data
        const subjects = Object.entries(dept.courses).map(([code, name], index) => {
          const total = filteredStudents.length;
          const passed = filteredStudents.filter(s => !failingGrades.includes(s.courses[code] || "N/A")).length;
          const failed = total - passed;
          const percentage = total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0;
          const teacher = teachers[code] || "Staff Name";
          
          return {
            slNo: index + 1,
            code,
            name,
            staffName: teacher,
            totalStudents: total,
            passed,
            failed,
            passPercentage: percentage,
          };
        });

        // Calculate failure counts
        const failCounts = {
          failed1: filteredStudents.filter(s => countFails(s) === 1).length,
          failed2: filteredStudents.filter(s => countFails(s) === 2).length,
          failed3: filteredStudents.filter(s => countFails(s) === 3).length,
          failedMoreThan3: filteredStudents.filter(s => countFails(s) > 3).length,
          failedAll: filteredStudents.filter(s => countFails(s) === Object.keys(dept.courses).length).length,
        };

        await exportStyledExcel({
          collegeName: 'MANGALAM COLLEGE OF ENGINEERING',
          departmentName: `DEPARTMENT OF ${dept.name.toUpperCase()}`,
          resultHeading: `UNIVERSITY RESULT ANALYSIS ${currentMonth} 2025`,
          classSem: classSem || 'Not specified',
          academicSemester: 'JAN 2025 - MAY 2025',
          totalStudents: totalSelected,
          totalCleared: passedSelected,
          passPercentageS2WithWH: passPercentage,
          passPercentageS2WithoutWH: passPercentage,
          overallPassPercentage: passPercentage,
          subjects,
          failureCounts: failCounts,
        }, `${downloadTitle || "ResultAnalysis"}.xlsx`);

      } else {
        // Student List Export
        const courseCodes = Object.keys(dept.courses);
        
        // Compute stats per course
        const passCounts: number[] = [];
        const failureCounts: number[] = [];
        const withheldCounts: number[] = [];
        const absentCounts: number[] = [];
        const passPercentages: number[] = [];

        courseCodes.forEach(code => {
          const passed = filteredStudents.filter(s => {
            const grade = s.courses[code] || "N/A";
            return !failingGrades.includes(grade);
          }).length;
          const failed = filteredStudents.filter(s => s.courses[code] === "F").length;
          const withheld = filteredStudents.filter(s => s.courses[code] === "Withheld").length;
          const absent = filteredStudents.filter(s => s.courses[code] === "Absent").length;
          const passPerc = totalSelected > 0 ? Number(((passed / totalSelected) * 100).toFixed(2)) : 0;

          passCounts.push(passed);
          failureCounts.push(failed);
          withheldCounts.push(withheld);
          absentCounts.push(absent);
          passPercentages.push(passPerc);
        });

        // Prepare student data
        const studentsData = filteredStudents.map((student, index) => ({
          slNo: index + 1,
          registerNo: student.registerNo,
          name: student.name || "N/A",
          grades: courseCodes.map(code => student.courses[code] || "N/A"),
          suppliesCount: countFails(student),
        }));

        // Prepare subject data
        const subjects = Object.entries(dept.courses).map(([code, name], index) => ({
          slNo: index + 1,
          code,
          name,
          staffName: teachers[code] || "Staff Name",
          passPercentage: passPercentages[index],
        }));

        await exportStudentListExcel({
          collegeName: 'MANGALAM COLLEGE OF ENGINEERING',
          departmentName: `DEPARTMENT OF ${dept.name.toUpperCase()}`,
          resultHeading: `UNIVERSITY RESULT ANALYSIS ${currentMonth} 2025`,
          classSem: classSem || 'Not specified',
          academicSemester: 'JAN 2025 - MAY 2025',
          totalStudents: totalSelected,
          totalCleared: passedSelected,
          passPercentageS2: passPercentage,
          overallPassPercentage: passPercentage,
          courseCodes,
          students: studentsData,
          summaryStats: {
            passCounts,
            failureCounts,
            withheldCounts,
            absentCounts,
            passPercentages,
          },
          subjects,
        }, `${downloadTitle || "StudentList"}.xlsx`);
      }

      setDownloadFormVisible(false);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel file. Please try again.');
    }
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

  const handleSupplyUpload = async () => {
    if (!supplyFile) return;

    setSupplyUploading(true);
    try {
      await uploadSupplyPDF(supplyFile);
      setSupplyFile(null);
      setShowSupplyUpload(false);
      alert('Supply results merged successfully! Updated grades are now reflected in the student records.');
    } catch (error) {
      console.error('Supply upload failed:', error);
      alert('Failed to upload supply results. Please try again.');
    } finally {
      setSupplyUploading(false);
    }
  };

  const handleSupplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSupplyFile(file);
    }
  };

  const isSupplyGrade = (registerNo: string, courseCode: string): boolean => {
    if (!data) return false;
    
    for (const dept of data.departments) {
      for (const course of dept.courses) {
        const student = course.students.find(s => s.registerNumber === registerNo);
        if (student) {
          const subject = student.subjects.find(sub => sub.code === courseCode);
          return subject?.isSupply === true;
        }
      }
    }
    return false;
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white mb-2">
            Results Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-inter">
            Analyze and manage student performance
          </p>
        </div>

        {/* Department Selection, Sorting, and Filtering */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-semibold font-poppins text-gray-700 dark:text-gray-300 mb-2">
              Select Department
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-left hover:border-gray-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600 transition-colors duration-200 font-inter"
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    selectedDepartment ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {selectedDepartment === "ALL"
                    ? "All Departments"
                    : selectedDepartment
                    ? `${resultsData[selectedDepartment].name}`
                    : "Choose a department..."}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 max-h-60 overflow-auto">
                <button
                  onClick={() => handleDepartmentChange("ALL")}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700 font-inter bg-indigo-50 dark:bg-indigo-900/20"
                >
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">📊 All Departments</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">View college-wide performance</div>
                </button>
                {Object.entries(resultsData).map(([code, dept]) => (
                  <button
                    key={code}
                    onClick={() => handleDepartmentChange(code)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700 last:border-b-0 font-inter"
                  >
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{dept.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold font-poppins text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-left hover:border-gray-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600 transition-colors duration-200 font-inter"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                  {sortOption === "allPass"
                    ? "All Pass (No Failures)"
                    : "Register Number"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    isSortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isSortDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 shadow-sm max-h-60 overflow-auto">
                <button
                  onClick={() => handleSortChange("default")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Register Number
                  </div>
                </button>
                <button
                  onClick={() => handleSortChange("allPass")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    All Pass (No Failures)
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter By
            </label>
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-left hover:border-gray-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100 text-sm">
                  {getFilterDisplay()}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    isFilterDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isFilterDropdownOpen && selectedDepartment && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 shadow-sm max-h-60 overflow-auto">
                <button
                  onClick={() => handleFilterChange("none")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">No Filter</div>
                </button>
                <button
                  onClick={() => handleFilterChange("allPass")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">All Pass</div>
                </button>
                <hr className="border-gray-100 dark:border-slate-700" />
                {Object.entries(resultsData[selectedDepartment].courses).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => handleFilterChange(code)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                  >
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Passed in {code}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{name.slice(0, 30)}...</div>
                  </button>
                ))}
                <hr className="border-gray-200 dark:border-slate-700" />
                <button
                  onClick={() => handleFilterChange("failed1")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 1 subject</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed2")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 2 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed3")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 3 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed3plus")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 3+ subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed4")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 4 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed5")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 5 subjects</div>
                </button>
                <button
                  onClick={() => handleFilterChange("failed5plus")}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-gray-100 dark:focus:bg-slate-700 focus:outline-none transition-colors duration-150 border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Failed in 5+ subjects</div>
                </button>
              </div>
            )}
          </div>
          {/* New Range Filter Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Register Range
            </label>
            <input
              type="text"
              value={studentRange}
              onChange={(e) => setStudentRange(e.target.value)}
              placeholder="e.g., MLM24CS061-MLM24CS125"
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-3 text-left focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600 transition-all duration-200 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {selectedDepartment && (
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base"
              disabled={selectedStudents.size === 0}
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Download Report
            </button>
            <button
              onClick={handleDownloadStudentList}
              className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base"
              disabled={selectedStudents.size === 0}
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Download Student List
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 my-4 px-2 sm:px-0">
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Download className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Class Report</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select students and use the "Download Report" button to generate a comprehensive class report.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Download className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Student List Report</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select students and use the "Download Student List" button to generate a detailed student list report.
                </p>
              </div>
            </div>
          </div>
        </div>
        {downloadFormVisible && (
          <div className="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 sm:p-6 w-full max-w-md overflow-y-auto max-h-[90vh] rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Download Report</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={downloadTitle}
                  onChange={(e) => setDownloadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={downloadDescription}
                  onChange={(e) => setDownloadDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class & Sem</label>
                <input
                  type="text"
                  value={classSem}
                  onChange={(e) => setClassSem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Teachers</label>
                {Object.entries(resultsData[selectedDepartment]?.courses || {}).map(([code, name]) => (
                  <div key={code} className="mb-2">
                    <label className="block text-xs text-gray-600 dark:text-gray-400">{code} - {name.slice(0, 20)}...</label>
                    <input
                      type="text"
                      value={teachers[code] || ""}
                      onChange={(e) => handleTeacherChange(code, e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-slate-600 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDownloadFormVisible(false)}
                  className="px-4 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 rounded-lg shadow-sm transition-all duration-200"
                >
                  Export to Excel
                </button>
                {downloadType === "summary" && (
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 rounded-lg shadow-sm transition-all duration-200"
                  >
                    Export to PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedDepartment && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 p-2.5 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                    {departmentStats?.totalStudents ?? 0}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter font-medium">Total Students</p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 p-2.5 rounded-lg">
                  <Trophy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                    {departmentStats?.passPercentage ?? 0}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter font-medium">Pass Rate</p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 p-2.5 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                    {departmentStats?.totalCourses ?? 0}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter font-medium">Total Courses</p>
            </div>
          </div>
        )}

        {/* Supply Upload Section */}
        {selectedDepartment && (
          <div className="mb-6 px-2 sm:px-0">
            <button
              onClick={() => setShowSupplyUpload(!showSupplyUpload)}
              className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white font-medium font-poppins hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-900 transition-all duration-200 rounded-lg shadow-sm text-sm sm:text-base"
            >
              <Upload className="h-4 w-4 mr-2" />
              {showSupplyUpload ? 'Hide Supply Upload' : 'Upload Supply Results'}
            </button>
          </div>
        )}

        {showSupplyUpload && selectedDepartment && (
          <div className="mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-5 mx-2 sm:mx-0">
            <h3 className="text-base sm:text-lg font-semibold font-poppins text-gray-900 dark:text-gray-100 mb-2 flex items-center flex-wrap">
              <Upload className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Upload Supply Exam Results
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-inter mb-4">
              Upload a PDF file containing supply exam results. Grades for failed subjects will be automatically updated if students passed in the supply exam. Supply-updated grades will be marked with a green indicator.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={handleSupplyFileChange}
                className="block w-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-inter file:mr-2 sm:file:mr-3 file:py-2 file:px-3 sm:file:px-4 file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-slate-900 dark:file:bg-slate-700 file:text-white hover:file:bg-slate-800 dark:hover:file:bg-slate-600 cursor-pointer file:transition-colors file:duration-200 file:rounded"
              />
              <button
                onClick={handleSupplyUpload}
                disabled={!supplyFile || supplyUploading}
                className="px-4 sm:px-6 py-2 bg-slate-900 dark:bg-slate-800 text-white font-medium font-poppins hover:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap text-sm sm:text-base rounded"
              >
                {supplyUploading ? 'Uploading...' : 'Merge Results'}
              </button>
            </div>
            {supplyFile && (
              <p className="text-sm text-gray-700 dark:text-gray-300 font-inter font-medium mt-3 bg-gray-100 dark:bg-slate-700 px-4 py-2">
                ✓ Selected: {supplyFile.name}
              </p>
            )}
          </div>
        )}

        {selectedDepartment && selectedDepartment !== "ALL" && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden mx-2 sm:mx-0">
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold font-poppins text-gray-900 dark:text-white">
                {resultsData[selectedDepartment].name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-inter mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span>📊 Students: {sortStudents(filterStudents(resultsData[selectedDepartment].students)).length}</span>
                <span className="hidden sm:inline">•</span>
                <span>📅 Academic Year: 2024-28 | Semester: 2</span>
              </p>
            </div>

            <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin -mx-2 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
              <table className="min-w-full w-full">
                <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="sticky left-0 top-0 bg-gray-50 dark:bg-slate-900 px-2 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-200 dark:border-slate-700 z-20 w-24 sm:w-auto min-w-[6rem] sm:min-w-[9rem]">
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
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 focus:ring-2 focus:ring-gray-500"
                      />
                    </th>
                    <th className="sticky left-24 sm:left-[9rem] top-0 bg-gray-50 dark:bg-slate-900 px-2 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-gray-200 dark:border-slate-700 z-20 min-w-[8rem] sm:min-w-[12rem]">
                      Name
                    </th>
                    {Object.entries(
                      resultsData[selectedDepartment].courses
                    ).map(([code, name]) => (
                      <th
                        key={code}
                        className="px-3 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]"
                      >
                        <div className="font-bold">{code}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-400 normal-case mt-1 line-clamp-2">
                          {name}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Pass: {courseStats?.[code]?.passed || 0} / {courseStats?.[code]?.percentage || 0}%
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">
                      No. of Supplies
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {sortStudents(filterStudents(resultsData[selectedDepartment].students)).map(
                    (student, index) => (
                      <tr
                        key={student.registerNo}
                        className={index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-800/50"}
                      >
                        <td className="sticky left-0 bg-inherit px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-400 border-r border-gray-200 dark:border-slate-700 w-24 sm:w-auto min-w-[6rem] sm:min-w-[9rem]">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(student.registerNo)}
                              onChange={() => handleStudentSelect(student.registerNo)}
                              className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            />
                            <span className="break-all text-[10px] sm:text-xs leading-tight">{student.registerNo}</span>
                          </div>
                        </td>
                        <td className="sticky left-24 sm:left-[9rem] bg-inherit px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-slate-700 min-w-[8rem] sm:min-w-[12rem]">
                          <span className="block truncate max-w-[7rem] sm:max-w-none">{student.name || "N/A"}</span>
                        </td>
                        {Object.keys(
                          resultsData[selectedDepartment].courses
                        ).map((courseCode) => (
                          <td
                            key={courseCode}
                            className="px-3 py-4 whitespace-nowrap text-center"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getGradeColor(
                                  student.courses[courseCode] || "N/A"
                                )}`}
                              >
                                {student.courses[courseCode] || "N/A"}
                              </span>
                              {isSupplyGrade(student.registerNo, courseCode) && (
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                                  Supply
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-red-600 dark:text-red-400">
                          {countFails(student)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {selectedDepartment && selectedDepartment !== "ALL" && (
          <GradeLegend />
        )}
        
        {selectedDepartment && (
          <ResultCharts
            resultsData={resultsData}
            selectedDepartment={selectedDepartment}
            failingGrades={failingGrades}
          />
        )}

        {!selectedDepartment && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              Select a Department
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
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