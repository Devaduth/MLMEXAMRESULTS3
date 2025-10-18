// Sample test data for development/testing purposes
export const samplePDFText = `
MANGALAM COLLEGE OF ENGINEERING
DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
UNIVERSITY EXAMINATION RESULTS - SEMESTER 2

Student Results:

MLM24CS001 - John Doe
MAT201: A+
CS201: B
CS202: A
CS203: C+
CS204: B+
CS205: A
CS206: B

MLM24CS002 - Jane Smith  
MAT201: B+
CS201: A
CS202: B
CS203: A+
CS204: A
CS205: B+
CS206: A

MLM24CS003 - Bob Johnson
MAT201: F
CS201: D
CS202: F
CS203: C
CS204: D
CS205: F
CS206: C

Course Details:
MAT201 - Mathematics for Computer Science
CS201 - Programming in C
CS202 - Data Structures
CS203 - Digital Electronics
CS204 - Computer Organization
CS205 - Database Management Systems
CS206 - Software Engineering
`;

export const expectedStructuredData = {
  CS: {
    name: "Computer Science and Engineering",
    code: "CS",
    courses: {
      "MAT201": "Mathematics for Computer Science",
      "CS201": "Programming in C",
      "CS202": "Data Structures", 
      "CS203": "Digital Electronics",
      "CS204": "Computer Organization",
      "CS205": "Database Management Systems",
      "CS206": "Software Engineering"
    },
    students: [
      {
        registerNo: "MLM24CS001",
        courses: {
          "MAT201": "A+",
          "CS201": "B",
          "CS202": "A",
          "CS203": "C+",
          "CS204": "B+",
          "CS205": "A",
          "CS206": "B"
        }
      },
      {
        registerNo: "MLM24CS002",
        courses: {
          "MAT201": "B+",
          "CS201": "A",
          "CS202": "B",
          "CS203": "A+",
          "CS204": "A",
          "CS205": "B+",
          "CS206": "A"
        }
      },
      {
        registerNo: "MLM24CS003",
        courses: {
          "MAT201": "F",
          "CS201": "D",
          "CS202": "F",
          "CS203": "C",
          "CS204": "D",
          "CS205": "F",
          "CS206": "C"
        }
      }
    ]
  }
};
