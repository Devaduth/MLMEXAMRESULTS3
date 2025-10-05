import { useState } from 'react';
import { Upload, FileText, Download, Loader } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Use a stable version that works well with CORS
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface ParsedStudent {
  registerNo: string;
  name?: string;
  department?: string;
  courses: { [courseCode: string]: string };
}

interface CourseInfo {
  code: string;
  name: string;
  department: string;
}

interface ParsedData {
  students: ParsedStudent[];
  courses: { [courseCode: string]: string };
  courseDetails: { [courseCode: string]: CourseInfo };
  departments: string[];
}

const PdfToExcelConverter = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered');
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type);
    
    // Clear previous state
    setParsedData(null);
    setError('');
    
    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      setError('Please upload a PDF file');
      setUploadedFile(null);
      return;
    }

    console.log('Valid PDF file, setting uploaded file');
    setUploadedFile(file);
    
    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const parseResultsFromText = (text: string): ParsedData => {
    console.log('=== FULL EXTRACTED TEXT ===');
    console.log(text);
    console.log('=== END EXTRACTED TEXT ===');
    
    // First, let's split the text more intelligently for this PDF format
    let processedText = text;
    
    // Add line breaks before register numbers and course codes
    processedText = processedText.replace(/\s+(MLM\d{2}[A-Z]{2}\d{3})\s+/g, '\n$1 ');
    processedText = processedText.replace(/\s+([A-Z]{3}\d{3})\s+/g, '\n$1 ');
    processedText = processedText.replace(/\s+(CIVIL ENGINEERING|COMPUTER SCIENCE|ELECTRONICS|MECHANICAL ENGINEERING)/g, '\n$1');
    
    const lines = processedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log('=== PROCESSED LINES ===');
    lines.forEach((line, index) => {
      console.log(`Line ${index}: "${line}"`);
    });
    console.log('=== END LINES ===');
    
    const students: ParsedStudent[] = [];
    const courses: { [courseCode: string]: string } = {};
    const courseDetails: { [courseCode: string]: CourseInfo } = {};
    const departments: string[] = [];
    
    const allText = text;
    
    // Extract department information with enhanced patterns
    const departmentPatterns = [
      /CIVIL ENGINEERING\[Full Time\]/g,
      /COMPUTER SCIENCE & ENGINEERING\[Full Time\]/g,
      /ELECTRONICS & COMMUNICATION ENGG\[Full Time\]/g,
      /MECHANICAL ENGINEERING\[Full Time\]/g
    ];
    
    const departmentNames = [
      'CIVIL ENGINEERING',
      'COMPUTER SCIENCE & ENGINEERING', 
      'ELECTRONICS & COMMUNICATION ENGINEERING',
      'MECHANICAL ENGINEERING'
    ];
    
    departmentPatterns.forEach((pattern, index) => {
      if (pattern.test(allText)) {
        const deptName = departmentNames[index];
        if (!departments.includes(deptName)) {
          departments.push(deptName);
          console.log(`Found department: ${deptName}`);
        }
      }
    });
    
    // Extract course information with department context
    const courseExtractionPattern = /([A-Z]{3}\d{3})\s+([A-Z\s&]+(?:STRUCTURES|SECURITY|AUTOMATION|MACHINING|DESIGN|NUMERICAL|CONTROLLED|EARTH|DAMS|RETAINING|NETWORK|ELECTRONIC|ADVANCED|[A-Z\s]+))/g;
    let courseMatch;
    
    while ((courseMatch = courseExtractionPattern.exec(allText)) !== null) {
      const courseCode = courseMatch[1];
      const courseName = courseMatch[2].trim();
      
      // Determine department based on course code prefix
      let department = '';
      switch (courseCode.substring(0, 3)) {
        case 'CET':
          department = 'CIVIL ENGINEERING';
          break;
        case 'CST':
          department = 'COMPUTER SCIENCE & ENGINEERING';
          break;
        case 'ECT':
          department = 'ELECTRONICS & COMMUNICATION ENGINEERING';
          break;
        case 'MET':
          department = 'MECHANICAL ENGINEERING';
          break;
        default:
          department = 'UNKNOWN';
      }
      
      courses[courseCode] = courseName;
      courseDetails[courseCode] = {
        code: courseCode,
        name: courseName,
        department: department
      };
      
      console.log(`Found course: ${courseCode} - ${courseName} (Department: ${department})`);
    }
    
    // Extract all student-grade combinations with department detection
    const studentPattern = /(MLM\d{2}[A-Z]{2}\d{3})\s+([A-Z]{3}\d{3})\(([A-Z+]+|F|FE|Absent|Withheld|PASS)\)/g;
    let studentMatch;
    
    while ((studentMatch = studentPattern.exec(allText)) !== null) {
      const registerNo = studentMatch[1];
      const courseCode = studentMatch[2];
      const grade = studentMatch[3];
      
      // Determine student's department from register number
      let studentDepartment = '';
      const deptCode = registerNo.substring(5, 7); // Extract department code from register number
      switch (deptCode) {
        case 'CE':
          studentDepartment = 'CIVIL ENGINEERING';
          break;
        case 'CS':
          studentDepartment = 'COMPUTER SCIENCE & ENGINEERING';
          break;
        case 'EC':
          studentDepartment = 'ELECTRONICS & COMMUNICATION ENGINEERING';
          break;
        case 'ME':
          studentDepartment = 'MECHANICAL ENGINEERING';
          break;
        default:
          studentDepartment = 'UNKNOWN';
      }
      
      console.log(`Found student-course: ${registerNo} (${studentDepartment}) - ${courseCode}(${grade})`);
      
      // Find existing student or create new one
      let student = students.find(s => s.registerNo === registerNo);
      if (!student) {
        student = {
          registerNo: registerNo,
          department: studentDepartment,
          courses: {}
        };
        students.push(student);
      }
      
      student.courses[courseCode] = grade;
      
      // Ensure course is in courses list
      if (!courses[courseCode]) {
        courses[courseCode] = `Course ${courseCode}`;
        
        // Try to determine department for course if not already set
        let courseDepartment = '';
        switch (courseCode.substring(0, 3)) {
          case 'CET':
            courseDepartment = 'CIVIL ENGINEERING';
            break;
          case 'CST':
            courseDepartment = 'COMPUTER SCIENCE & ENGINEERING';
            break;
          case 'ECT':
            courseDepartment = 'ELECTRONICS & COMMUNICATION ENGINEERING';
            break;
          case 'MET':
            courseDepartment = 'MECHANICAL ENGINEERING';
            break;
          default:
            courseDepartment = 'UNKNOWN';
        }
        
        if (!courseDetails[courseCode]) {
          courseDetails[courseCode] = {
            code: courseCode,
            name: `Course ${courseCode}`,
            department: courseDepartment
          };
        }
      }
    }
    
    // Additional parsing for any missed register numbers
    const additionalPattern = /(MLM\d{2}[A-Z]{2}\d{3})/g;
    const registerNumbers: string[] = [];
    let regMatch;
    while ((regMatch = additionalPattern.exec(allText)) !== null) {
      if (!registerNumbers.includes(regMatch[1])) {
        registerNumbers.push(regMatch[1]);
      }
    }
    
    // For any register numbers we found but don't have students for, try to extract their data
    registerNumbers.forEach(registerNo => {
      if (!students.find(s => s.registerNo === registerNo)) {
        // Determine department from register number
        const deptCode = registerNo.substring(5, 7);
        let department = '';
        switch (deptCode) {
          case 'CE':
            department = 'CIVIL ENGINEERING';
            break;
          case 'CS':
            department = 'COMPUTER SCIENCE & ENGINEERING';
            break;
          case 'EC':
            department = 'ELECTRONICS & COMMUNICATION ENGINEERING';
            break;
          case 'ME':
            department = 'MECHANICAL ENGINEERING';
            break;
          default:
            department = 'UNKNOWN';
        }
        
        // Find the context around this register number
        const regIndex = allText.indexOf(registerNo);
        if (regIndex !== -1) {
          const contextAfter = allText.substring(regIndex, regIndex + 100);
          console.log(`Checking context for ${registerNo} (${department}): "${contextAfter}"`);
          
          // Look for grade patterns in the context
          const gradeInContext = contextAfter.match(/([A-Z]{3}\d{3})\(([A-Z+]+|F|FE|Absent|Withheld|PASS)\)/);
          if (gradeInContext) {
            const courseCode = gradeInContext[1];
            const grade = gradeInContext[2];
            
            let student = students.find(s => s.registerNo === registerNo);
            if (!student) {
              student = {
                registerNo: registerNo,
                department: department,
                courses: {}
              };
              students.push(student);
            }
            
            student.courses[courseCode] = grade;
            console.log(`Added missing student: ${registerNo} (${department}) - ${courseCode}(${grade})`);
          }
        }
      }
    });
    
    console.log('=== FINAL RESULTS ===');
    console.log('Students found:', students.length);
    console.log('Students:', students);
    console.log('Courses:', courses);
    console.log('Course Details:', courseDetails);
    console.log('Departments:', departments);
    console.log('=== END RESULTS ===');
    
    return { students, courses, courseDetails, departments };
  };

  const processPdf = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      const text = await extractTextFromPdf(uploadedFile);
      const parsed = parseResultsFromText(text);
      
      if (parsed.students.length === 0) {
        setError('No student data found in the PDF. Please check the format.');
        return;
      }
      
      setParsedData(parsed);
    } catch (err) {
      setError('Error processing PDF. Please ensure it contains valid exam results.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExcel = () => {
    if (!parsedData) return;

    const workbook = XLSX.utils.book_new();
    
    // Create Results Summary Sheet
    const summaryData = [
      ['Register No', 'Department', ...Object.keys(parsedData.courses)],
      ...parsedData.students.map(student => [
        student.registerNo,
        student.department || 'Unknown',
        ...Object.keys(parsedData.courses).map(courseCode => 
          student.courses[courseCode] || 'N/A'
        )
      ])
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Results Summary');
    
    // Create Course Details Sheet
    const courseDetailsData = [
      ['Course Code', 'Course Name', 'Department']
    ];
    
    Object.values(parsedData.courseDetails).forEach(course => {
      courseDetailsData.push([
        course.code,
        course.name,
        course.department
      ]);
    });
    
    const courseDetailsSheet = XLSX.utils.aoa_to_sheet(courseDetailsData);
    XLSX.utils.book_append_sheet(workbook, courseDetailsSheet, 'Course Details');
    
    // Create Department Summary Sheet
    const departmentData = [
      ['Department', 'Courses Offered', 'Total Students']
    ];
    
    parsedData.departments.forEach(dept => {
      const coursesInDept = Object.values(parsedData.courseDetails)
        .filter(course => course.department === dept)
        .map(course => course.code);
      
      const studentsInDept = parsedData.students.filter(student => student.department === dept);
      
      departmentData.push([
        dept,
        coursesInDept.join(', '),
        studentsInDept.length.toString()
      ]);
    });
    
    const departmentSheet = XLSX.utils.aoa_to_sheet(departmentData);
    XLSX.utils.book_append_sheet(workbook, departmentSheet, 'Department Summary');
    
    // Create Student-wise Details Sheet
    const studentDetailsData = [
      ['Register No', 'Department', 'Course Code', 'Course Name', 'Grade']
    ];
    
    parsedData.students.forEach(student => {
      Object.entries(student.courses).forEach(([courseCode, grade]) => {
        const courseInfo = parsedData.courseDetails[courseCode];
        studentDetailsData.push([
          student.registerNo,
          student.department || 'Unknown',
          courseCode,
          courseInfo ? courseInfo.name : 'Unknown Course',
          grade
        ]);
      });
    });
    
    const studentDetailsSheet = XLSX.utils.aoa_to_sheet(studentDetailsData);
    XLSX.utils.book_append_sheet(workbook, studentDetailsSheet, 'Student Details');

    const fileName = `exam_results_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <FileText className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">PDF to Excel Converter</h2>
      </div>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload PDF Result Document
          </h3>
          <p className="text-gray-600 mb-4">
            Select a PDF file containing exam results to convert to Excel format
          </p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
            multiple={false}
            onClick={(e) => {
              // Clear any previous value to ensure onChange fires
              (e.target as HTMLInputElement).value = '';
            }}
          />
          <label
            htmlFor="pdf-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Choose PDF File
          </label>
          
          {uploadedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Selected: <span className="font-medium">{uploadedFile.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setParsedData(null);
                  setError('');
                }}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Remove file
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {uploadedFile && !parsedData && !isProcessing && (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 mb-4">
              File ready for processing: <strong>{uploadedFile.name}</strong>
            </p>
            <button
              onClick={processPdf}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Process PDF
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="inline-flex items-center text-yellow-800">
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Processing PDF...
            </div>
          </div>
        )}
        
        {parsedData && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-green-800 mb-2">
                Processing Complete!
              </h4>
              <p className="text-green-700">
                Found {parsedData.students.length} students and {Object.keys(parsedData.courses).length} courses
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h5 className="font-medium text-gray-900 mb-3">Preview:</h5>
              <div className="space-y-2 text-sm">
                {parsedData.students.slice(0, 5).map((student, index) => (
                  <div key={index} className="bg-white p-2 rounded">
                    <span className="font-medium">{student.registerNo}</span>
                    {student.name && <span className="text-gray-600 ml-2">{student.name}</span>}
                    <div className="text-xs text-gray-500 mt-1">
                      Courses: {Object.keys(student.courses).length}
                    </div>
                  </div>
                ))}
                {parsedData.students.length > 5 && (
                  <p className="text-gray-500 text-center">
                    ... and {parsedData.students.length - 5} more students
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={downloadExcel}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Excel File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToExcelConverter;