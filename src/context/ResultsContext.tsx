import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParsedResults, parseUniversityPDF } from '../services/pdfParser';

interface UploadProgress {
  percent: number;
  message: string;
}

interface ResultsContextType {
  data: ParsedResults | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: UploadProgress;
  hasPDFData: boolean;
  uploadPDF: (file: File) => Promise<void>;
  uploadSupplyPDF: (file: File) => Promise<void>;
  clearData: () => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

const STORAGE_KEY = 'university_results_data';

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ParsedResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percent: 0,
    message: 'Ready to upload',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        console.log('✅ Loaded saved results from localStorage');
      } catch (err) {
        console.error('Failed to load saved data:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const uploadPDF = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress({ percent: 0, message: 'Starting upload...' });

    console.log('📤 Starting PDF upload:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    try {
      const results = await parseUniversityPDF(file, (percent, message) => {
        console.log(`📊 Progress: ${percent}% - ${message}`);
        setUploadProgress({ percent, message });
      });

      console.log('✅ Parsing complete, received results:', results);
      
      setData(results);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      console.log('💾 Saved to localStorage');
      
      setUploadProgress({ percent: 100, message: 'Upload complete!' });
      
      console.log('✅ PDF uploaded and parsed successfully');
      console.log('📊 Data state updated, hasPDFData should now be true');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process PDF';
      setError(errorMessage);
      setUploadProgress({ percent: 0, message: 'Upload failed' });
      console.error('❌ PDF upload error:', err);
      console.error('Error stack:', err.stack);
      
      // Show error to user
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Upload process finished, isLoading set to false');
    }
  };

  const uploadSupplyPDF = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress({ percent: 0, message: 'Starting supply upload...' });

    console.log('📤 Starting Supply PDF upload:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    if (!data) {
      setIsLoading(false);
      const error = 'Please upload regular results first';
      setError(error);
      throw new Error(error);
    }

    try {
      const supplyResults = await parseUniversityPDF(file, (percent, message) => {
        console.log(`📊 Supply Progress: ${percent}% - ${message}`);
        setUploadProgress({ percent, message: `Supply: ${message}` });
      });

      console.log('✅ Supply parsing complete, merging results...');
      
      // Merge supply results with existing data
      const mergedData = mergeSupplyResults(data, supplyResults);
      setData(mergedData);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
      console.log('💾 Saved merged results to localStorage');
      
      setUploadProgress({ percent: 100, message: 'Supply results merged successfully!' });
      
      console.log('✅ Supply results merged successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process supply PDF';
      setError(errorMessage);
      setUploadProgress({ percent: 0, message: 'Supply upload failed' });
      console.error('❌ Supply PDF upload error:', err);
      console.error('Error stack:', err.stack);
      
      // Show error to user
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Supply upload process finished');
    }
  };

  const mergeSupplyResults = (regularData: ParsedResults, supplyData: ParsedResults): ParsedResults => {
    console.log('🔄 Starting merge of supply results...');
    const merged = JSON.parse(JSON.stringify(regularData)); // Deep clone

    const failingGrades = ['F', 'Absent', 'Withheld', 'ABSENT', 'WITHHELD'];

    supplyData.departments.forEach(supplyDept => {
      console.log(`📝 Processing supply department: ${supplyDept.name}`);
      
      const regularDept = merged.departments.find(
        (d: any) => d.name.toLowerCase() === supplyDept.name.toLowerCase()
      );
      
      if (!regularDept) {
        console.log(`⚠️ Department not found in regular results: ${supplyDept.name}`);
        return;
      }

      supplyDept.courses.forEach(supplyCourse => {
        supplyCourse.students.forEach(supplyStudent => {
          console.log(`👤 Processing supply student: ${supplyStudent.registerNumber}`);
          
          // Find student in regular data across all courses
          let regularStudent: any = null;
          
          for (const course of regularDept.courses) {
            const foundStudent = course.students.find(
              (s: any) => s.registerNumber === supplyStudent.registerNumber
            );
            if (foundStudent) {
              regularStudent = foundStudent;
              break;
            }
          }
          
          if (!regularStudent) {
            console.log(`⚠️ Student not found in regular results: ${supplyStudent.registerNumber}`);
            return;
          }

          // Update subjects with supply results
          supplyStudent.subjects.forEach(supplySubject => {
            const regularSubjectIndex = regularStudent.subjects.findIndex(
              (s: any) => s.code === supplySubject.code
            );
            
            if (regularSubjectIndex !== -1) {
              const oldGrade = regularStudent.subjects[regularSubjectIndex].grade;
              const newGrade = supplySubject.grade;
              
              // Only update if the new grade is not failing
              if (!failingGrades.includes(newGrade.toUpperCase())) {
                regularStudent.subjects[regularSubjectIndex].grade = newGrade;
                regularStudent.subjects[regularSubjectIndex].isSupply = true;
                
                console.log(`✅ Updated ${supplyStudent.registerNumber} - ${supplySubject.code}: ${oldGrade} → ${newGrade} (Supply)`);
              } else {
                console.log(`⚠️ Skipped update for ${supplyStudent.registerNumber} - ${supplySubject.code}: Still failing with ${newGrade}`);
              }
            }
          });

          // Update student status after merging
          regularStudent.status = determineStudentStatus(regularStudent.subjects);
        });
      });
    });

    console.log('✅ Merge completed successfully');
    return merged;
  };

  const determineStudentStatus = (subjects: any[]): 'PASS' | 'FAIL' | 'ABSENT' | 'WITHHELD' => {
    for (const subject of subjects) {
      const grade = subject.grade.toUpperCase();
      if (grade === 'F') return 'FAIL';
      if (grade === 'ABSENT') return 'ABSENT';
      if (grade === 'WITHHELD') return 'WITHHELD';
    }
    return 'PASS';
  };

  const clearData = () => {
    setData(null);
    setError(null);
    setUploadProgress({ percent: 0, message: 'Ready to upload' });
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared all data');
  };

  const hasPDFData = data !== null;
  
  // Debug logging
  useEffect(() => {
    console.log('📊 Context state changed:', {
      hasPDFData,
      hasData: !!data,
      isLoading,
      error,
      dataKeys: data ? Object.keys(data) : 'null'
    });
  }, [data, isLoading, error, hasPDFData]);

  return (
    <ResultsContext.Provider
      value={{
        data,
        isLoading,
        error,
        uploadProgress,
        hasPDFData,
        uploadPDF,
        uploadSupplyPDF,
        clearData,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = (): ResultsContextType => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
