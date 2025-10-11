import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

const Home = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const text = await extractTextFromPDF(file);
        const data = parseTextToJson(text);
        setJsonData(data);
        setError(null);
      } catch (err) {
        setError("Error processing PDF: " + err.message);
        setJsonData(null);
      }
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const parseTextToJson = (text) => {
    const results = {};
    const deptPattern = /([A-Z& ]+)\[Full Time\] \(Generated on 30\/09\/2025 10:27 AM\)/g;
    let match;
    while ((match = deptPattern.exec(text))) {
      let deptName = match[1].trim();
      // Normalize department name
      deptName = deptName
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
        .replace("Engg", "Engineering")
        .replace("&", "and");

      const start = deptPattern.lastIndex;
      const nextMatch = deptPattern.exec(text);
      const end = nextMatch ? nextMatch.index : text.length;
      const section = text.substring(start, end).trim();

      // Extract courses
      const coursePattern = /(\w+)\s+([\s\S]*?)(?=\n\w+\s+|\nRegister No)/g;
      const courses = {};
      let courseMatch;
      while ((courseMatch = coursePattern.exec(section))) {
        const code = courseMatch[1].trim();
        let name = courseMatch[2].replace(/\s+/g, " ").trim();
        courses[code] = name;
      }

      // Extract students
      const studentPattern = /(MLM24\w+)\s+([\s\S]*?)(?=\nMLM24|$)/g;
      const students = [];
      let studentMatch;
      while ((studentMatch = studentPattern.exec(section))) {
        const reg = studentMatch[1].trim();
        let gradesStr = studentMatch[2].replace(/\s+/g, "").trim();
        const gradePattern = /(\w+)\(([\w+]+)\)/g;
        const courseGrades = {};
        let gradeMatch;
        while ((gradeMatch = gradePattern.exec(gradesStr))) {
          courseGrades[gradeMatch[1]] = gradeMatch[2];
        }
        students.push({
          registerNo: reg,
          courses: courseGrades,
        });
      }

      // Infer dept_code
      let deptCode = "";
      if (students.length > 0) {
        const firstReg = students[0].registerNo;
        deptCode = firstReg.substring(6, 8); // e.g., 'CE'
        if (deptCode === "CS") {
          if (deptName.includes("Business")) {
            deptCode = "CSBS";
          } else if (deptName.includes("Artificial")) {
            deptCode = "AIM";
          }
        } else if (deptCode === "EC") {
          if (deptName.includes("Computer")) {
            deptCode = "ECE";
          }
        } else if (deptCode === "CH") {
          deptCode = "CH";
        } else if (deptCode === "SF") {
          deptCode = "SF";
        }
      }

      if (deptCode) {
        results[deptCode] = {
          name: deptName,
          code: deptCode,
          courses,
          students,
        };
      }
    }
    return results;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Upload PDF Results
        </h1>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {jsonData && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Extracted JSON Data</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;