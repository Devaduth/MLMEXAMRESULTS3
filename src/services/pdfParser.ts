import * as pdfjsLib from 'pdfjs-dist';
import { geminiService } from './geminiService';

// Configure PDF.js worker
const PDFJS_VERSION = '5.4.149';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export interface Student {
  registerNumber: string;
  name: string;
  subjects: Subject[];
  status: 'PASS' | 'FAIL' | 'ABSENT' | 'WITHHELD';
  cgpa?: string;
}

export interface Subject {
  code: string;
  name: string;
  grade: string;
  isSupply?: boolean; // Flag to indicate if this is a supply result
}

export interface Course {
  name: string;
  students: Student[];
}

export interface Department {
  name: string;
  courses: Course[];
}

export interface ParsedResults {
  departments: Department[];
}

/**
 * Transform Gemini response format to expected ParsedResults format
 */
function transformGeminiResponse(geminiData: any): ParsedResults {
  // Gemini returns: [{name, code, students: [{registerNo, courses: {CODE: GRADE}}]}]
  // We need: {departments: [{name, courses: [{name, students: [{registerNumber, subjects: []}]}]}]}
  
  if (!Array.isArray(geminiData)) {
    console.error('❌ Gemini data is not an array:', geminiData);
    throw new Error('Invalid Gemini response format');
  }
  
  const departments: Department[] = geminiData.map((dept: any) => {
    // Group all students into one course per department (simplified structure)
    const allStudents: Student[] = (dept.students || []).map((student: any) => {
      const subjects: Subject[] = Object.entries(student.courses || {}).map(([code, grade]: [string, any]) => ({
        code,
        name: code, // Use code as name for now
        grade: String(grade)
      }));
      
      return {
        registerNumber: student.registerNo || '',
        name: student.registerNo || '', // Use register number as name
        subjects,
        status: determineStatus(subjects),
        cgpa: undefined
      };
    });
    
    return {
      name: dept.name || 'Unknown Department',
      courses: [{
        name: `${dept.name || 'Unknown'} - All Students`,
        students: allStudents
      }]
    };
  });
  
  return { departments };
}

/**
 * Determine student status based on grades
 */
function determineStatus(subjects: Subject[]): 'PASS' | 'FAIL' | 'ABSENT' | 'WITHHELD' {
  for (const subject of subjects) {
    const grade = subject.grade.toUpperCase();
    if (grade === 'F') return 'FAIL';
    if (grade === 'ABSENT') return 'ABSENT';
    if (grade === 'WITHHELD') return 'WITHHELD';
  }
  return 'PASS';
}

/**
 * Attempt to fix incomplete JSON by closing open structures
 */
function attemptFixIncompleteJSON(json: string): string {
  let fixed = json.trim();
  
  console.log('🔧 Starting JSON repair...');
  console.log('🔍 Original length:', fixed.length);
  console.log('🔍 Last 200 chars:', fixed.substring(fixed.length - 200));
  
  // Remove incomplete property/value at the end
  // Look for patterns like: "key": "incom or "key":  or "key
  const incompletePatterns = [
    /,\s*"[^"]*":\s*"[^"]*$/,  // Incomplete string value: ..."key": "val
    /,\s*"[^"]*":\s*$/,         // Property with no value: ..."key": 
    /,\s*"[^"]*$/,              // Incomplete property name: ..."key
    /:\s*"[^"]*$/,              // Incomplete value after colon: ...": "val
  ];
  
  for (const pattern of incompletePatterns) {
    if (pattern.test(fixed)) {
      const before = fixed.length;
      fixed = fixed.replace(pattern, '');
      console.log(`🔧 Removed incomplete pattern (${before - fixed.length} chars)`);
      break; // Only remove once
    }
  }
  
  // Count open/close brackets
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/]/g) || []).length;
  
  console.log('🔍 JSON structure:', {
    openBraces,
    closeBraces,
    openBrackets,
    closeBrackets,
    needsClose: { braces: openBraces - closeBraces, brackets: openBrackets - closeBrackets }
  });
  
  // Close open structures
  const bracesToAdd = openBraces - closeBraces;
  const bracketsToAdd = openBrackets - closeBrackets;
  
  // Add missing closing brackets/braces
  for (let i = 0; i < Math.min(bracesToAdd, bracketsToAdd); i++) {
    fixed += '}]';
  }
  for (let i = 0; i < Math.max(0, bracesToAdd - bracketsToAdd); i++) {
    fixed += '}';
  }
  for (let i = 0; i < Math.max(0, bracketsToAdd - bracesToAdd); i++) {
    fixed += ']';
  }
  
  console.log(`✅ Added ${bracesToAdd} braces and ${bracketsToAdd} brackets`);
  console.log('🔍 Fixed length:', fixed.length);
  console.log('🔍 Last 100 chars:', fixed.substring(fixed.length - 100));
  
  return fixed;
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('📄 Reading PDF file...');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    console.log(`📖 PDF loaded: ${pdf.numPages} pages`);
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      if (i % 5 === 0) {
        console.log(`📄 Processed ${i}/${pdf.numPages} pages...`);
      }
    }
    
    console.log(`✅ Extracted ${fullText.length} characters from PDF`);
    return fullText;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

/**
 * Parse university results PDF using Gemini AI
 */
export async function parseUniversityPDF(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<ParsedResults> {
  try {
    // Validate file
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please upload a PDF file');
    }

    // Check file size (max 50MB for large university PDFs)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 50MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Step 1: Extract text from PDF (20%)
    onProgress?.(10, 'Reading PDF file...');
    const pdfText = await extractTextFromPDF(file);
    onProgress?.(20, `Extracted text from ${file.name}`);

    // Validate extracted text
    if (!pdfText || pdfText.length < 100) {
      throw new Error('PDF appears to be empty or corrupted');
    }

    // Step 2: Send to Gemini for parsing (20-80%)
    onProgress?.(30, 'Your document is going through our AI engine…');
    
    // Always use single-pass with Pro model (supports up to 1M input tokens, 64K output)
    const useChunking = false; // Disabled - Pro model handles large PDFs in one call
    console.log('📄 Using single-pass parsing with Gemini Pro');
    
    const jsonResponse = useChunking 
      ? await geminiService.parseUniversityPDFInChunks(pdfText)
      : await geminiService.parseUniversityPDF(pdfText);
      
    onProgress?.(80, 'Processing results...');

    console.log('📝 Gemini response length:', jsonResponse.length);
    console.log('📝 First 1000 chars of response:', jsonResponse.substring(0, 1000));

    // Check if response is empty
    if (!jsonResponse || jsonResponse.trim().length === 0) {
      throw new Error('Gemini returned an empty response. The PDF might be too complex or the content is not readable.');
    }

    // Step 3: Parse JSON response (80-90%)
    let parsedData: ParsedResults;
    try {
      // Remove markdown code blocks if present
      let cleanJson = jsonResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('🧹 Cleaned JSON (first 500 chars):', cleanJson.substring(0, 500));
      
      if (!cleanJson) {
        throw new Error('Empty response after cleaning');
      }
      
      // Try parsing first
      try {
        const rawData = JSON.parse(cleanJson);
        
        // Transform from Gemini format to expected format
        // Gemini returns: [{name, code, students: [{registerNo, courses: {}}]}]
        // We need: {departments: [{name, courses: [{name, students: [{registerNumber, subjects: []}]}]}]}
        parsedData = transformGeminiResponse(rawData);
      } catch (parseError) {
        // If JSON is incomplete, try to fix it
        console.warn('⚠️ JSON parse failed, attempting to fix incomplete JSON...');
        console.warn('Parse error:', parseError);
        
        // Attempt to complete the JSON
        cleanJson = attemptFixIncompleteJSON(cleanJson);
        console.log('🔧 Attempted fix - trying parse again...');
        const rawData = JSON.parse(cleanJson);
        parsedData = transformGeminiResponse(rawData);
        console.log('✅ Fixed incomplete JSON successfully!');
      }
    } catch (error) {
      console.error('❌ JSON parsing error:', error);
      console.error('Full response (first 1000 chars):', jsonResponse.substring(0, 1000));
      console.error('Full response (last 500 chars):', jsonResponse.substring(jsonResponse.length - 500));
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }

    // Step 4: Validate parsed data (90-100%)
    onProgress?.(90, 'Validating data...');
    validateParsedResults(parsedData);
    
    onProgress?.(100, 'Parsing complete!');
    
    console.log('✅ Successfully parsed PDF:', {
      departments: parsedData.departments.length,
      totalStudents: parsedData.departments.reduce(
        (sum, dept) => sum + dept.courses.reduce(
          (s, course) => s + course.students.length, 0
        ), 0
      )
    });

    return parsedData;
  } catch (error: any) {
    console.error('❌ PDF parsing error:', error);
    throw error;
  }
}

/**
 * Validate the parsed results structure
 */
function validateParsedResults(data: ParsedResults): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data structure: Expected an object');
  }

  if (!Array.isArray(data.departments)) {
    throw new Error('Invalid data structure: departments must be an array');
  }

  if (data.departments.length === 0) {
    throw new Error('No departments found in PDF. Please check the PDF format.');
  }

  // Validate each department
  for (const dept of data.departments) {
    if (!dept.name || typeof dept.name !== 'string') {
      throw new Error('Invalid department: Missing name');
    }

    if (!Array.isArray(dept.courses)) {
      throw new Error(`Invalid department "${dept.name}": courses must be an array`);
    }

    // Validate each course
    for (const course of dept.courses) {
      if (!course.name || typeof course.name !== 'string') {
        throw new Error(`Invalid course in department "${dept.name}": Missing name`);
      }

      if (!Array.isArray(course.students)) {
        throw new Error(`Invalid course "${course.name}": students must be an array`);
      }

      // Check if at least one student exists
      if (course.students.length === 0) {
        console.warn(`⚠️ Warning: Course "${course.name}" has no students`);
      }
    }
  }
}

/**
 * Get statistics from parsed results
 */
export function getResultsStats(data: ParsedResults): {
  totalDepartments: number;
  totalCourses: number;
  totalStudents: number;
  passCount: number;
  failCount: number;
  absentCount: number;
  withheldCount: number;
} {
  let totalCourses = 0;
  let totalStudents = 0;
  let passCount = 0;
  let failCount = 0;
  let absentCount = 0;
  let withheldCount = 0;

  for (const dept of data.departments) {
    totalCourses += dept.courses.length;
    
    for (const course of dept.courses) {
      totalStudents += course.students.length;
      
      for (const student of course.students) {
        switch (student.status) {
          case 'PASS':
            passCount++;
            break;
          case 'FAIL':
            failCount++;
            break;
          case 'ABSENT':
            absentCount++;
            break;
          case 'WITHHELD':
            withheldCount++;
            break;
        }
      }
    }
  }

  return {
    totalDepartments: data.departments.length,
    totalCourses,
    totalStudents,
    passCount,
    failCount,
    absentCount,
    withheldCount,
  };
}
