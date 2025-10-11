import React from 'react';
import resultsData from '../data/ResultsData';

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

interface ResultsProps {
  data?: { [key: string]: DepartmentData };
  onSave?: (data: { [key: string]: DepartmentData }) => void;
}

const Results: React.FC<ResultsProps> = ({ data = resultsData, onSave }) => {
  const departments = Object.values(data);

  return (
    <div className="results-container">
      {departments.map((dept) => (
        <div key={dept.code} className="department-section">
          <h2>{dept.name} ({dept.code})</h2>
          
          <div className="courses-section">
            <h3>Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dept.courses).map(([code, name]) => (
                  <tr key={code}>
                    <td>{code}</td>
                    <td>{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="students-section">
            <h3>Student Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Register No</th>
                  {Object.keys(dept.courses).map((code) => (
                    <th key={code}>{code}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dept.students.map((student) => (
                  <tr key={student.registerNo}>
                    <td>{student.registerNo}</td>
                    {Object.keys(dept.courses).map((code) => (
                      <td key={code} className={student.courses[code]?.toLowerCase()}>
                        {student.courses[code] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <style>{`
        .results-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .department-section {
          margin-bottom: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
        }
        
        .pass {
          background-color: #e8f5e9;
        }
        
        .f {
          background-color: #ffebee;
        }
        
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        
        h3 {
          color: #666;
          margin: 15px 0;
        }
      `}</style>
    </div>
  );
};

export default Results;