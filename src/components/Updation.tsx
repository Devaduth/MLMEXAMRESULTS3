import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Download,
  Upload,
} from "lucide-react";
import GradeLegend from "./GradeLegend";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { exportStyledExcel, exportStudentListExcel } from "../utils/excelExporter";
import { pdfjs } from "react-pdf";

interface StudentResult {
  registerNo: string;
  name: string;
  courses: { [courseCode: string]: string };
}

interface DepartmentData {
  name: string;
  code: string;
  students: StudentResult[];
  courses: { [courseCode: string]: string };
}

const Result = () => {
  const [resultsData, setResultsData] = useState<{ [key: string]: DepartmentData }>({});
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [supplyUploadError, setSupplyUploadError] = useState<string | null>(null);
  const [isSupplyDragging, setIsSupplyDragging] = useState(false);
  const [showSupplyUpload, setShowSupplyUpload] = useState(false);

  const failingGrades = ["F", "Absent", "Withheld"];

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  const parsePDFContent = (text: string) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    const departments: { [key: string]: DepartmentData } = {};
    let currentDept: string | null = null;
    let currentCourses: { [key: string]: string } = {};
    let currentStudents: StudentResult[] = [];
    let classSemVal = "S2";

    for (const line of lines) {
      if (line.includes("B.Tech S2")) {
        classSemVal = "S2";
        break;
      }
    }

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      if (line.endsWith("(Generated on 30/09/2025 10:27 AM)")) {
        if (currentDept && currentStudents.length > 0) {
          const deptCode = currentStudents[0].registerNo.substring(6, 8) || "UNKNOWN";
          departments[deptCode] = {
            name: currentDept,
            code: deptCode,
            students: currentStudents,
            courses: currentCourses,
          };
        }

        currentDept = line.split("[Full Time]")[0].trim();
        currentCourses = {};
        currentStudents = [];
        i++;

        while (i < lines.length && lines[i] !== "Course Code") {
          i++;
        }
        if (lines[i] === "Course Code" && lines[i + 1] === "Course") {
          i += 2;
        }

        while (i < lines.length && lines[i] !== "Register No") {
          const potentialCode = lines[i];
          if (potentialCode.match(/^[A-Z]{3,6}[0-9]{3}$/)) {
            const code = potentialCode;
            i++;
            let name = "";
            while (
              i < lines.length &&
              !lines[i].match(/^[A-Z]{3,6}[0-9]{3}$/) &&
              lines[i] !== "Register No"
            ) {
              name += lines[i] + " ";
              i++;
            }
            currentCourses[code] = name.trim();
          } else {
            i++;
          }
        }

        if (lines[i] === "Register No" && lines[i + 1] === "Course Code (Grade)") {
          i += 2;
        }
      } else if (currentDept && line.startsWith("MLM24")) {
        const regNo = line;
        i++;
        let gradesLine = "";
        while (
          i < lines.length &&
          !lines[i].startsWith("MLM24") &&
          !lines[i].endsWith("(Generated on 30/09/2025 10:27 AM)")
        ) {
          gradesLine += lines[i] + " ";
          i++;
        }
        gradesLine = gradesLine.trim().replace(/\s*,\s*/g, ",");
        const courses: { [key: string]: string } = {};
        const parts = gradesLine.split(",");
        for (const part of parts) {
          const match = part.match(/([A-Z0-9]+)\(([^)]+)\)/);
          if (match) {
            const code = match[1];
            const grade = match[2];
            courses[code] = grade;
          }
        }
        currentStudents.push({
          registerNo: regNo,
          name: "",
          courses,
        });
      } else {
        i++;
      }
    }

    if (currentDept && currentStudents.length > 0) {
      const deptCode = currentStudents[0].registerNo.substring(6, 8) || "UNKNOWN";
      departments[deptCode] = {
        name: currentDept,
        code: deptCode,
        students: currentStudents,
        courses: currentCourses,
      };
    }

    if (Object.keys(departments).length === 0) {
      throw new Error("No departments found in PDF");
    }

    return { departments, classSemVal };
  };

  const handleUpload = (file: File) => {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
      pdfjs
        .getDocument(typedarray)
        .promise.then((pdf) => {
          const numPages = pdf.numPages;
          const textPromises = [];
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            textPromises.push(pdf.getPage(pageNum).then((page) => page.getTextContent()));
          }
          return Promise.all(textPromises);
        })
        .then((contents) => {
          let fullText = "";
          contents.forEach((content) => {
            let lastY: number | undefined;
            let line = "";
            content.items.forEach((item: any) => {
              const y = item.transform[5];
              if (lastY !== y) {
                if (line) fullText += line + "\n";
                line = "";
                lastY = y;
              }
              line += item.str;
              if (!item.hasEOL) line += " ";
            });
            if (line) fullText += line + "\n";
          });

          try {
            const { departments, classSemVal } = parsePDFContent(fullText);
            setResultsData(departments);
            setClassSem(classSemVal);
            setTeachers({});
            const deptKeys = Object.keys(departments);
            if (deptKeys.length > 0) {
              setSelectedDepartment(deptKeys[0]);
            }
          } catch (error: any) {
            console.error("Parsing Error:", error.message);
            setUploadError(`Failed to parse PDF: ${error.message}`);
          }
        })
        .catch((error) => {
          console.error("PDF Processing Error:", error);
          setUploadError(
            "Failed to process PDF. Please ensure the file is valid and contains the expected data format."
          );
        });
    };
    reader.onerror = () => {
      setUploadError("Error reading the PDF file. Please try another file.");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      setUploadError("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      setUploadError("Please drop a valid PDF file.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSupplyUpload = (file: File) => {
    setSupplyUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
      pdfjs
        .getDocument(typedarray)
        .promise.then((pdf) => {
          const numPages = pdf.numPages;
          const textPromises = [];
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            textPromises.push(pdf.getPage(pageNum).then((page) => page.getTextContent()));
          }
          return Promise.all(textPromises);
        })
        .then((contents) => {
          let fullText = "";
          contents.forEach((content) => {
            let lastY: number | undefined;
            let line = "";
            content.items.forEach((item: any) => {
              const y = item.transform[5];
              if (lastY !== y) {
                if (line) fullText += line + "\n";
                line = "";
                lastY = y;
              }
              line += item.str;
              if (!item.hasEOL) line += " ";
            });
            if (line) fullText += line + "\n";
          });

          try {
            const { departments } = parsePDFContent(fullText);
            // Merge supply results with existing data
            mergeSupplyResults(departments);
            setShowSupplyUpload(false);
            alert('Supply results merged successfully!');
          } catch (error: any) {
            console.error("Supply Parsing Error:", error.message);
            setSupplyUploadError(`Failed to parse supply PDF: ${error.message}`);
          }
        })
        .catch((error) => {
          console.error("Supply PDF Processing Error:", error);
          setSupplyUploadError(
            "Failed to process supply PDF. Please ensure the file is valid."
          );
        });
    };
    reader.onerror = () => {
      setSupplyUploadError("Error reading the supply PDF file.");
    };
    reader.readAsArrayBuffer(file);
  };

  const mergeSupplyResults = (supplyDepartments: { [key: string]: DepartmentData }) => {
    const merged = { ...resultsData };
    
    Object.keys(supplyDepartments).forEach(deptCode => {
      const supplyDept = supplyDepartments[deptCode];
      const regularDept = merged[deptCode];
      
      if (!regularDept) {
        console.warn(`Department ${deptCode} not found in regular results`);
        return;
      }

      supplyDept.students.forEach(supplyStudent => {
        const regularStudent = regularDept.students.find(
          s => s.registerNo === supplyStudent.registerNo
        );
        
        if (regularStudent) {
          // Update grades for subjects in supply exam
          Object.keys(supplyStudent.courses).forEach(courseCode => {
            const supplyGrade = supplyStudent.courses[courseCode];
            const regularGrade = regularStudent.courses[courseCode];
            
            // Only update if the supply grade is passing
            if (!failingGrades.includes(supplyGrade)) {
              regularStudent.courses[courseCode] = supplyGrade;
              console.log(`Updated ${supplyStudent.registerNo} - ${courseCode}: ${regularGrade} → ${supplyGrade}`);
            }
          });
        }
      });
    });

    setResultsData(merged);
  };

  const handleSupplyFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      handleSupplyUpload(file);
    } else {
      setSupplyUploadError("Please upload a valid PDF file.");
    }
  };

  const handleSupplyDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSupplyDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleSupplyUpload(file);
    } else {
      setSupplyUploadError("Please drop a valid PDF file.");
    }
  };

  const handleSupplyDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSupplyDragging(true);
  };

  const handleSupplyDragLeave = () => {
    setIsSupplyDragging(false);
  };

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    setIsDropdownOpen(false);
    setFilterBy("none");
    setSelectedStudents(new Set());
    setTeachers({});
    setStudentRange("");
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
          Object.values(student.courses).every(
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
    const filteredStudents = sortStudents(filterStudents(dept.students)).filter((s) =>
      selectedStudents.has(s.registerNo)
    );
    const totalSelected = filteredStudents.length;
    const passedSelected = filteredStudents.filter((s) =>
      Object.values(s.courses).every((g) => !failingGrades.includes(g))
    ).length;
    const passPercentage =
      totalSelected > 0
        ? Number(((passedSelected / totalSelected) * 100).toFixed(2))
        : 0;

    let content = `MANGALAM COLLEGE OF ENGINEERING\nDEPARTMENT OF ${dept.name.toUpperCase()}\nUNIVERSITY RESULT ANALYSIS ${new Date().toLocaleString("default", {
      month: "long",
    }).toUpperCase()} 2025\n\n`;
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
      const passed = filteredStudents.filter(
        (s) => !failingGrades.includes(s.courses[code] || "N/A")
      ).length;
      const failed = total - passed;
      const percentage =
        total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0;
      const teacher = teachers[code] || "Staff Name";
      content += `${slNo}\t${code}\t${name}\t${teacher}\t${total}\t${passed}\t${failed}\t${percentage}\n`;
      slNo++;
    });

    const failCounts = [1, 2, 3, "3plus"].map((n) => {
      if (n === "3plus") {
        return filteredStudents.filter((s) => countFails(s) > 3).length;
      } else {
        return filteredStudents.filter((s) => countFails(s) === n).length;
      }
    });
    content += `\nTotal Number of students failed in one subject\t\t${failCounts[0]}\n`;
    content += `Total Number of students failed in 2 subjects\t\t${failCounts[1]}\n`;
    content += `Total Number of students failed in 3 subjects\t\t${failCounts[2]}\n`;
    content += `Total Number of students failed more than 3 subjects\t\t${failCounts[3]}\n`;
    content += `Total Number of students failed in all subjects\t\t${filteredStudents.filter(
      (s) => countFails(s) === Object.keys(dept.courses).length
    ).length}\n\n`;
    content += `CLASS IN CHARGE\t\tHOD\t\tPRINCIPAL\n`;

    return content;
  };

  const generateStudentListContent = () => {
    if (!selectedDepartment || selectedStudents.size === 0) return "";

    const dept = resultsData[selectedDepartment];
    const filteredStudents = sortStudents(filterStudents(dept.students)).filter((s) =>
      selectedStudents.has(s.registerNo)
    );
    const totalSelected = filteredStudents.length;
    const passedSelected = filteredStudents.filter((s) =>
      Object.values(s.courses).every((g) => !failingGrades.includes(g))
    ).length;
    const passPercentage =
      totalSelected > 0
        ? Number(((passedSelected / totalSelected) * 100).toFixed(2))
        : 0;
    const courseCodes = Object.keys(dept.courses);
    const passCounts: { [code: string]: number } = {};
    const failureCounts: { [code: string]: number } = {};
    const withheldCounts: { [code: string]: number } = {};
    const absentCounts: { [code: string]: number } = {};
    const passPercentages: { [code: string]: number } = {};
    courseCodes.forEach((code) => {
      passCounts[code] = filteredStudents.filter((s) => {
        const grade = s.courses[code] || "N/A";
        return !failingGrades.includes(grade);
      }).length;
      failureCounts[code] = filteredStudents.filter((s) => s.courses[code] === "F").length;
      withheldCounts[code] = filteredStudents.filter((s) => s.courses[code] === "Withheld").length;
      absentCounts[code] = filteredStudents.filter((s) => s.courses[code] === "Absent").length;
      passPercentages[code] =
        totalSelected > 0
          ? Number(((passCounts[code] / totalSelected) * 100).toFixed(2))
          : 0;
    });

    let content = `MANGALAM COLLEGE OF ENGINEERING\nDEPARTMENT OF ${dept.name.toUpperCase()}\nUNIVERSITY RESULT ANALYSIS ${new Date().toLocaleString("default", {
      month: "long",
    }).toUpperCase()} 2025\n\n`;
    content += `Class & Sem                                               : ${classSem}\n`;
    content += `Academic Semester                                    : JAN 2025 - MAY 2025\n`;
    content += `Total number of Students registered         : ${totalSelected}\n`;
    content += `Total number of Students all cleared         : ${passedSelected}\n`;
    content += `Pass Percentage in S2                                : (${passedSelected}/${totalSelected}) ${passPercentage}%\n`;
    content += `Overall Pass % upto S2                             : (${passedSelected}/${totalSelected}) ${passPercentage}%\n\n`;

    content += `Sl. No.\tReg No\tName of Student\tSubject Code`;
    for (let i = 0; i < courseCodes.length - 1; i++) {
      content += "\t";
    }
    content += `\tNo.of supplies in S2\n`;
    content += `\t\t\t${courseCodes.join("\t")}\n`;

    filteredStudents.forEach((student, index) => {
      const slNo = index + 1;
      content += `${slNo}\t${student.registerNo}\t${student.name || "N/A"}\t${courseCodes
        .map((code) => student.courses[code] || "N/A")
        .join("\t")}\t${countFails(student)}\n`;
    });

    content += `No.of Pass\t\t\t${courseCodes.map((code) => passCounts[code]).join("\t")}\n`;
    content += `No.of Failures\t\t\t${courseCodes.map((code) => failureCounts[code]).join("\t")}\n`;
    content += `No of withheld\t\t\t${courseCodes.map((code) => withheldCounts[code]).join("\t")}\n`;
    content += `No.of Absentees\t\t\t${courseCodes.map((code) => absentCounts[code]).join("\t")}\n`;
    content += `Pass Percentage\t\t\t${courseCodes.map((code) => passPercentages[code]).join("\t")}\n\n`;

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
    if (!selectedDepartment || selectedStudents.size === 0 || downloadType !== "summary")
      return;
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
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(
      "MANGALAM COLLEGE OF ENGINEERING",
      pageWidth / 2,
      12,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.text(
      `DEPARTMENT OF ${resultsData[selectedDepartment].name.toUpperCase()}`,
      pageWidth / 2,
      17,
      { align: "center" }
    );
    y = 30;
    content.forEach((line) => {
      const textWidth = doc.getTextWidth(line);
      if (y + 7 > pageHeight - margin) {
        doc.addPage();
        y = 20;
        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, pageWidth, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(
          "MANGALAM COLLEGE OF ENGINEERING",
          pageWidth / 2,
          12,
          { align: "center" }
        );
        doc.text(
          `DEPARTMENT OF ${resultsData[selectedDepartment].name.toUpperCase()}`,
          pageWidth / 2,
          17,
          { align: "center" }
        );
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
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}`,
      margin,
      pageHeight - 10
    );
    doc.save(`${downloadTitle || "ResultAnalysis"}.pdf`);
    setDownloadFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(resultsData).length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              Upload PDF to Load Results
            </h3>
            <p className="text-gray-600 mb-6">
              Upload a PDF file containing the results data to get started, or drag and drop it
              below.
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors duration-200 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {isDragging
                  ? "Drop the PDF file here"
                  : "Drag and drop a PDF file here or click to upload"}
              </p>
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                <Upload className="h-5 w-5 mr-2" />
                Select PDF File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            {uploadError && <div className="text-red-600 text-sm mt-2">{uploadError}</div>}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  {selectedDepartment
                    ? resultsData[selectedDepartment].name
                    : "Select Department"}
                  <ChevronDown className="h-5 w-5" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                    {Object.keys(resultsData).map((deptCode) => (
                      <button
                        key={deptCode}
                        onClick={() => handleDepartmentChange(deptCode)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {resultsData[deptCode].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  Sort by: {sortOption === "default" ? "Default" : "All Pass"}
                  <ChevronDown className="h-5 w-5" />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                    <button
                      onClick={() => handleSortChange("default")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Default
                    </button>
                    <button
                      onClick={() => handleSortChange("allPass")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      All Pass First
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  Filter: {getFilterDisplay()}
                  <ChevronDown className="h-5 w-5" />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    <button
                      onClick={() => handleFilterChange("none")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      No Filter
                    </button>
                    <button
                      onClick={() => handleFilterChange("allPass")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      All Pass
                    </button>
                    {[1, 2, 3, "3plus", 5, "5plus"].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange(`failed${num}`)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Failed in {num === "3plus" ? "3+" : num === "5plus" ? "5+" : num}{" "}
                        subject{num !== "1" && num !== "3plus" && num !== "5plus" ? "s" : ""}
                      </button>
                    ))}
                    {selectedDepartment &&
                      Object.keys(resultsData[selectedDepartment].courses).map((code) => (
                        <button
                          key={code}
                          onClick={() => handleFilterChange(code)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Passed in {code}
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={studentRange}
                  onChange={(e) => setStudentRange(e.target.value)}
                  placeholder="Reg No Range (e.g., MLM24CE001-MLM24CE010)"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                />
              </div>
            </div>

            {selectedDepartment && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {resultsData[selectedDepartment].name} - {classSem} Results
                  </h2>
                  {departmentStats && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <GraduationCap className="h-6 w-6 text-blue-500 mb-2" />
                        <p className="text-gray-600">Total Students</p>
                        <p className="text-xl font-bold text-gray-900">
                          {departmentStats.totalStudents}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <Trophy className="h-6 w-6 text-green-500 mb-2" />
                        <p className="text-gray-600">Pass %</p>
                        <p className="text-xl font-bold text-gray-900">
                          {departmentStats.passPercentage}%
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <BookOpen className="h-6 w-6 text-indigo-500 mb-2" />
                        <p className="text-gray-600">Total Courses</p>
                        <p className="text-xl font-bold text-gray-900">
                          {departmentStats.totalCourses}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Supply Upload Section */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowSupplyUpload(!showSupplyUpload)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {showSupplyUpload ? 'Hide Supply Upload' : 'Upload Supply Results'}
                  </button>
                </div>

                {showSupplyUpload && (
                  <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Upload Supply Exam Results
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a PDF file containing supply exam results. The grades for failed subjects will be automatically updated if students passed in the supply exam.
                    </p>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors duration-200 ${
                        isSupplyDragging ? "border-green-500 bg-green-100" : "border-green-300 bg-white"
                      }`}
                      onDragOver={handleSupplyDragOver}
                      onDragLeave={handleSupplyDragLeave}
                      onDrop={handleSupplyDrop}
                    >
                      <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4 text-center">
                        {isSupplyDragging
                          ? "Drop the supply PDF file here"
                          : "Drag and drop supply PDF here or click to upload"}
                      </p>
                      <div className="flex justify-center">
                        <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                          <Upload className="h-5 w-5 mr-2" />
                          Select Supply PDF
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleSupplyFileInput}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {supplyUploadError && (
                      <div className="text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        {supplyUploadError}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Student Results</h3>
                    <div className="space-x-2">
                      <button
                        onClick={handleDownload}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Summary
                      </button>
                      <button
                        onClick={handleDownloadStudentList}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Student List
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="p-2 border-b">Select</th>
                          <th className="p-2 border-b">Reg No</th>
                          <th className="p-2 border-b">Name</th>
                          {selectedDepartment &&
                            Object.keys(resultsData[selectedDepartment].courses).map(
                              (code) => (
                                <th key={code} className="p-2 border-b">
                                  {code}
                                </th>
                              )
                            )}
                          <th className="p-2 border-b">Fails</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDepartment &&
                          sortStudents(
                            filterStudents(resultsData[selectedDepartment].students)
                          ).map((student) => (
                            <tr
                              key={student.registerNo}
                              className="hover:bg-gray-50"
                            >
                              <td className="p-2 border-b">
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.has(student.registerNo)}
                                  onChange={() => handleStudentSelect(student.registerNo)}
                                  className="h-4 w-4 text-blue-600"
                                />
                              </td>
                              <td className="p-2 border-b">{student.registerNo}</td>
                              <td className="p-2 border-b">{student.name || "N/A"}</td>
                              {Object.entries(student.courses).map(([code, grade]) => (
                                <td
                                  key={code}
                                  className={`p-2 border-b ${getGradeColor(grade)} rounded`}
                                >
                                  {grade}
                                </td>
                              ))}
                              <td className="p-2 border-b">
                                {countFails(student)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <GradeLegend />
              </>
            )}

            {downloadFormVisible && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Download {downloadType === "summary" ? "Summary" : "Student List"}
                  </h3>
                  <input
                    type="text"
                    value={downloadTitle}
                    onChange={(e) => setDownloadTitle(e.target.value)}
                    placeholder="Enter title"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
                  <textarea
                    value={downloadDescription}
                    onChange={(e) => setDownloadDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                    className="w-full mb-4 p-2 border border-gray-300 rounded h-24"
                  />
                  <div className="flex justify-end space-x-4">
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Export to PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Result;