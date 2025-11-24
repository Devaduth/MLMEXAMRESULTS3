import ExcelJS from 'exceljs';

interface ExcelExportData {
  collegeName: string;
  departmentName: string;
  resultHeading: string;
  classSem: string;
  academicSemester: string;
  totalStudents: number;
  totalCleared: number;
  passPercentageS2WithWH: number;
  passPercentageS2WithoutWH: number;
  overallPassPercentage: number;
  subjects: Array<{
    slNo: number;
    code: string;
    name: string;
    staffName: string;
    totalStudents: number;
    passed: number;
    failed: number;
    passPercentage: number;
  }>;
  failureCounts: {
    failed1: number;
    failed2: number;
    failed3: number;
    failedMoreThan3: number;
    failedAll: number;
  };
}

/**
 * Apply white header background and black bold text
 */
const applyHeaderStyle = (cell: ExcelJS.Cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }, // white
  };
  cell.font = {
    name: 'Calibri',
    size: 14,
    bold: true,
    color: { argb: 'FF000000' }, // black
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };
};

/**
 * Apply light gray background for table headers
 */
const applyTableHeaderStyle = (cell: ExcelJS.Cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' }, // gray-200
  };
  cell.font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FF000000' },
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };
};

/**
 * Apply standard cell styling with borders
 */
const applyCellStyle = (cell: ExcelJS.Cell, options?: {
  bold?: boolean;
  alignment?: Partial<ExcelJS.Alignment>;
  wrapText?: boolean;
  backgroundColor?: string;
}) => {
  cell.font = {
    name: 'Calibri',
    size: 10,
    bold: options?.bold || false,
  };
  cell.alignment = {
    vertical: 'middle',
    horizontal: options?.alignment?.horizontal || 'left',
    wrapText: options?.wrapText !== false, // default true
    ...options?.alignment,
  };
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };
  
  if (options?.backgroundColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: options.backgroundColor },
    };
  }
};

/**
 * Main function to export styled Excel report
 */
export const exportStyledExcel = async (data: ExcelExportData, filename: string = 'ResultAnalysis.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Result Analysis', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 3 }], // Freeze top 3 rows
  });

  let currentRow = 1;

  // ==================== ADD LOGO ====================
  
  try {
    // Fetch the logo image
    const logoResponse = await fetch('/images/emblem.jpg');
    const logoBlob = await logoResponse.blob();
    const logoArrayBuffer = await logoBlob.arrayBuffer();
    
    // Add image to workbook
    const logoId = workbook.addImage({
      buffer: logoArrayBuffer,
      extension: 'jpeg',
    });
    
    // Add logo to worksheet (top-left corner, spanning rows 1-3, column 1)
    worksheet.addImage(logoId, {
      tl: { col: 0, row: 0 }, // top-left at column A, row 1
      ext: { width: 80, height: 80 }, // 80x80 pixels
    });
  } catch (error) {
    console.warn('Could not load logo:', error);
  }

  // ==================== SECTION 1: TOP 3 HEADER ROWS ====================
  
  // Row 1: College Name (offset to make room for logo)
  worksheet.mergeCells(currentRow, 2, currentRow, 8);
  const collegeCell = worksheet.getCell(currentRow, 2);
  collegeCell.value = data.collegeName;
  applyHeaderStyle(collegeCell);
  currentRow++;

  // Row 2: Department Name
  worksheet.mergeCells(currentRow, 2, currentRow, 8);
  const deptCell = worksheet.getCell(currentRow, 2);
  deptCell.value = data.departmentName;
  applyHeaderStyle(deptCell);
  currentRow++;

  // Row 3: Result Heading
  worksheet.mergeCells(currentRow, 2, currentRow, 8);
  const headingCell = worksheet.getCell(currentRow, 2);
  headingCell.value = data.resultHeading;
  applyHeaderStyle(headingCell);
  currentRow++;

  // Empty row for spacing
  currentRow++;

  // ==================== SECTION 2: CLASS DETAILS ====================
  
  const classDetailsData = [
    { label: 'Class & Sem', value: data.classSem },
    { label: 'Academic Semester', value: data.academicSemester },
    { label: 'Total number of Students registered', value: data.totalStudents.toString() },
    { label: 'Total number of Students all cleared', value: data.totalCleared.toString() },
    { label: 'Pass Percentage in S2(with WH)', value: `(${data.totalCleared}/${data.totalStudents}) ${data.passPercentageS2WithWH.toFixed(2)}%` },
    { label: 'Pass Percentage in S2(without WH)', value: `(${data.totalCleared}/${data.totalStudents}) ${data.passPercentageS2WithoutWH.toFixed(2)}%` },
    { label: 'Overall Pass % upto S2', value: `(${data.totalCleared}/${data.totalStudents}) ${data.overallPassPercentage.toFixed(2)}%` },
  ];

  classDetailsData.forEach(({ label, value }) => {
    // Merge cells for label (columns 1-3) - narrower label width
    worksheet.mergeCells(currentRow, 1, currentRow, 3);
    const labelCell = worksheet.getCell(currentRow, 1);
    labelCell.value = label;
    applyCellStyle(labelCell, { bold: true, alignment: { horizontal: 'left' }, wrapText: true });

    // Merge cells for value (columns 4-6) - narrower values section
    worksheet.mergeCells(currentRow, 4, currentRow, 6);
    const valueCell = worksheet.getCell(currentRow, 4);
    valueCell.value = value;
    applyCellStyle(valueCell, { alignment: { horizontal: 'left' } });

    currentRow++;
  });

  // ==================== SECTION 3: SUBJECT-WISE TABLE ====================
  
  // Headers
  const subjectHeaders = [
    'Sl No',
    'Subject Code',
    'Subject Name',
    'Subject Handled by',
    'Total No of Students',
    'No. of students Passed',
    'No. of Students failed',
    '% of pass',
  ];

  subjectHeaders.forEach((header, index) => {
    const cell = worksheet.getCell(currentRow, index + 1);
    cell.value = header;
    applyTableHeaderStyle(cell);
  });
  currentRow++;

  // Subject rows with alternating colors
  data.subjects.forEach((subject, index) => {
    const isEvenRow = index % 2 === 0;
    const bgColor = isEvenRow ? 'FFFFFFFF' : 'FFF9FAFB'; // white / gray-50

    const rowData = [
      subject.slNo,
      subject.code,
      subject.name,
      subject.staffName,
      subject.totalStudents,
      subject.passed,
      subject.failed,
      subject.passPercentage.toFixed(2) + '%',
    ];

    rowData.forEach((value, colIndex) => {
      const cell = worksheet.getCell(currentRow, colIndex + 1);
      cell.value = value;
      applyCellStyle(cell, {
        backgroundColor: bgColor,
        alignment: {
          horizontal: colIndex === 0 || colIndex >= 4 ? 'center' : 'left', // Center numbers, left-align text
        },
      });
    });
    currentRow++;
  });

  // ==================== SECTION 4: FAILURE COUNTS ====================
  
  const failureData = [
    { label: 'Total Number of students failed in one subject', value: data.failureCounts.failed1 },
    { label: 'Total Number of students failed in 2 subjects', value: data.failureCounts.failed2 },
    { label: 'Total Number of students failed in 3 subjects', value: data.failureCounts.failed3 },
    { label: 'Total Number of students failed more than 3 subjects', value: data.failureCounts.failedMoreThan3 },
    { label: 'Total Number of students failed in all subjects', value: data.failureCounts.failedAll },
  ];

  failureData.forEach(({ label, value }) => {
    worksheet.mergeCells(currentRow, 1, currentRow, 4);
    const labelCell = worksheet.getCell(currentRow, 1);
    labelCell.value = label;
    applyCellStyle(labelCell, { bold: true, alignment: { horizontal: 'left' }, wrapText: true });

    worksheet.mergeCells(currentRow, 5, currentRow, 6);
    const valueCell = worksheet.getCell(currentRow, 5);
    valueCell.value = value;
    applyCellStyle(valueCell, { alignment: { horizontal: 'left' } });

    currentRow++;
  });

  // Empty row for spacing
  currentRow++;

  // ==================== SECTION 5: SIGNATURES ====================
  
  worksheet.mergeCells(currentRow, 1, currentRow, 2);
  const classInChargeCell = worksheet.getCell(currentRow, 1);
  classInChargeCell.value = 'CLASS IN CHARGE';
  applyCellStyle(classInChargeCell, { bold: true, alignment: { horizontal: 'center' } });

  worksheet.mergeCells(currentRow, 3, currentRow, 5);
  const hodCell = worksheet.getCell(currentRow, 3);
  hodCell.value = 'HOD';
  applyCellStyle(hodCell, { bold: true, alignment: { horizontal: 'center' } });

  worksheet.mergeCells(currentRow, 6, currentRow, 8);
  const principalCell = worksheet.getCell(currentRow, 6);
  principalCell.value = 'PRINCIPAL';
  applyCellStyle(principalCell, { bold: true, alignment: { horizontal: 'center' } });

  // ==================== COLUMN WIDTHS ====================
  
  worksheet.columns = [
    { width: 8 },   // Sl No
    { width: 15 },  // Subject Code
    { width: 40 },  // Subject Name
    { width: 25 },  // Staff Name
    { width: 18 },  // Total Students
    { width: 18 },  // Passed
    { width: 18 },  // Failed
    { width: 12 },  // % of pass
  ];

  // ==================== EXPORT FILE ====================
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Export student list with styled Excel
 */
interface StudentListExportData {
  collegeName: string;
  departmentName: string;
  resultHeading: string;
  classSem: string;
  academicSemester: string;
  totalStudents: number;
  totalCleared: number;
  passPercentageS2: number;
  overallPassPercentage: number;
  courseCodes: string[];
  students: Array<{
    slNo: number;
    registerNo: string;
    name: string;
    grades: string[];
    suppliesCount: number;
  }>;
  summaryStats: {
    passCounts: number[];
    failureCounts: number[];
    withheldCounts: number[];
    absentCounts: number[];
    passPercentages: number[];
  };
  subjects: Array<{
    slNo: number;
    code: string;
    name: string;
    staffName: string;
    passPercentage: number;
  }>;
}

export const exportStudentListExcel = async (data: StudentListExportData, filename: string = 'StudentList.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Student List', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 3 }],
  });

  let currentRow = 1;
  const totalCols = 3 + data.courseCodes.length + 1; // Sl, Reg, Name + courses + supplies count

  // ==================== ADD LOGO ====================
  
  try {
    // Fetch the logo image
    const logoResponse = await fetch('/images/emblem.jpg');
    const logoBlob = await logoResponse.blob();
    const logoArrayBuffer = await logoBlob.arrayBuffer();
    
    // Add image to workbook
    const logoId = workbook.addImage({
      buffer: logoArrayBuffer,
      extension: 'jpeg',
    });
    
    // Add logo to worksheet (top-left corner, spanning rows 1-3, column 1)
    worksheet.addImage(logoId, {
      tl: { col: 0, row: 0 }, // top-left at column A, row 1
      ext: { width: 80, height: 80 }, // 80x80 pixels
    });
  } catch (error) {
    console.warn('Could not load logo:', error);
  }

  // ==================== HEADER ROWS ====================
  
  worksheet.mergeCells(currentRow, 2, currentRow, totalCols);
  const collegeCell = worksheet.getCell(currentRow, 2);
  collegeCell.value = data.collegeName;
  applyHeaderStyle(collegeCell);
  currentRow++;

  worksheet.mergeCells(currentRow, 2, currentRow, totalCols);
  const deptCell = worksheet.getCell(currentRow, 2);
  deptCell.value = data.departmentName;
  applyHeaderStyle(deptCell);
  currentRow++;

  worksheet.mergeCells(currentRow, 2, currentRow, totalCols);
  const headingCell = worksheet.getCell(currentRow, 2);
  headingCell.value = data.resultHeading;
  applyHeaderStyle(headingCell);
  currentRow++;

  currentRow++;

  // ==================== CLASS DETAILS ====================
  
  const classDetailsData = [
    { label: 'Class & Sem', value: data.classSem },
    { label: 'Academic Semester', value: data.academicSemester },
    { label: 'Total number of Students registered', value: data.totalStudents.toString() },
    { label: 'Total number of Students all cleared', value: data.totalCleared.toString() },
    { label: 'Pass Percentage in S2', value: `(${data.totalCleared}/${data.totalStudents}) ${data.passPercentageS2.toFixed(2)}%` },
    { label: 'Overall Pass % upto S2', value: `(${data.totalCleared}/${data.totalStudents}) ${data.overallPassPercentage.toFixed(2)}%` },
  ];

  classDetailsData.forEach(({ label, value }) => {
    // Calculate better split: 40% for label, 60% for value
    const labelEndCol = Math.floor(totalCols * 0.4);
    worksheet.mergeCells(currentRow, 1, currentRow, labelEndCol);
    const labelCell = worksheet.getCell(currentRow, 1);
    labelCell.value = label;
    applyCellStyle(labelCell, { bold: true, alignment: { horizontal: 'left' }, wrapText: true });

    worksheet.mergeCells(currentRow, labelEndCol + 1, currentRow, totalCols);
    const valueCell = worksheet.getCell(currentRow, labelEndCol + 1);
    valueCell.value = value;
    applyCellStyle(valueCell, { alignment: { horizontal: 'left' } });

    currentRow++;
  });

  // ==================== STUDENT TABLE ====================
  
  // Header row 1: Labels
  const headerRow1 = worksheet.getRow(currentRow);
  headerRow1.getCell(1).value = 'Sl. No.';
  applyTableHeaderStyle(headerRow1.getCell(1));
  
  headerRow1.getCell(2).value = 'Reg No';
  applyTableHeaderStyle(headerRow1.getCell(2));
  
  headerRow1.getCell(3).value = 'Name of Student';
  applyTableHeaderStyle(headerRow1.getCell(3));
  
  // Merge cells for "Subject Code" label across all course columns
  worksheet.mergeCells(currentRow, 4, currentRow, 3 + data.courseCodes.length);
  const subjectCodeCell = worksheet.getCell(currentRow, 4);
  subjectCodeCell.value = 'Subject Code';
  applyTableHeaderStyle(subjectCodeCell);
  
  headerRow1.getCell(totalCols).value = 'No. of supplies in S2';
  applyTableHeaderStyle(headerRow1.getCell(totalCols));
  currentRow++;

  // Header row 2: Course codes
  const headerRow2 = worksheet.getRow(currentRow);
  // Leave first 3 columns empty
  headerRow2.getCell(1).value = '';
  applyCellStyle(headerRow2.getCell(1), { backgroundColor: 'FFE5E7EB' });
  headerRow2.getCell(2).value = '';
  applyCellStyle(headerRow2.getCell(2), { backgroundColor: 'FFE5E7EB' });
  headerRow2.getCell(3).value = '';
  applyCellStyle(headerRow2.getCell(3), { backgroundColor: 'FFE5E7EB' });
  
  data.courseCodes.forEach((code, index) => {
    const cell = headerRow2.getCell(4 + index);
    cell.value = code;
    applyTableHeaderStyle(cell);
  });
  
  headerRow2.getCell(totalCols).value = '';
  applyCellStyle(headerRow2.getCell(totalCols), { backgroundColor: 'FFE5E7EB' });
  currentRow++;

  // Student rows
  data.students.forEach((student, index) => {
    const isEvenRow = index % 2 === 0;
    const bgColor = isEvenRow ? 'FFFFFFFF' : 'FFF9FAFB';

    const row = worksheet.getRow(currentRow);
    
    row.getCell(1).value = student.slNo;
    applyCellStyle(row.getCell(1), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    
    row.getCell(2).value = student.registerNo;
    applyCellStyle(row.getCell(2), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    
    row.getCell(3).value = student.name;
    applyCellStyle(row.getCell(3), { backgroundColor: bgColor, alignment: { horizontal: 'left' } });
    
    student.grades.forEach((grade, gradeIndex) => {
      row.getCell(4 + gradeIndex).value = grade;
      applyCellStyle(row.getCell(4 + gradeIndex), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    });
    
    row.getCell(totalCols).value = student.suppliesCount;
    applyCellStyle(row.getCell(totalCols), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    
    currentRow++;
  });

  // ==================== SUMMARY STATS ====================
  
  const summaryLabels = [
    'No. of Pass',
    'No. of Failures',
    'No of withheld',
    'No. of Absentees',
    'Pass Percentage',
  ];

  const summaryValues = [
    data.summaryStats.passCounts,
    data.summaryStats.failureCounts,
    data.summaryStats.withheldCounts,
    data.summaryStats.absentCounts,
    data.summaryStats.passPercentages,
  ];

  summaryLabels.forEach((label, labelIndex) => {
    const row = worksheet.getRow(currentRow);
    
    worksheet.mergeCells(currentRow, 1, currentRow, 3);
    const labelCell = row.getCell(1);
    labelCell.value = label;
    applyCellStyle(labelCell, { bold: true, backgroundColor: 'FFDBEAFE' }); // light purple
    
    summaryValues[labelIndex].forEach((value, colIndex) => {
      const cell = row.getCell(4 + colIndex);
      cell.value = labelIndex === 4 ? `${value.toFixed(2)}%` : value; // Format percentages
      applyCellStyle(cell, { backgroundColor: 'FFDBEAFE', alignment: { horizontal: 'center' } });
    });
    
    row.getCell(totalCols).value = '';
    applyCellStyle(row.getCell(totalCols), { backgroundColor: 'FFDBEAFE' });
    
    currentRow++;
  });

  // ==================== SUBJECT TABLE ====================
  
  const subjectHeaders = ['Sl No', 'Subject Code', 'Subject Name', 'Subject Handled by', '% of pass'];
  const subjectHeaderRow = worksheet.getRow(currentRow);
  subjectHeaders.forEach((header, index) => {
    subjectHeaderRow.getCell(index + 1).value = header;
    applyTableHeaderStyle(subjectHeaderRow.getCell(index + 1));
  });
  currentRow++;

  data.subjects.forEach((subject, index) => {
    const isEvenRow = index % 2 === 0;
    const bgColor = isEvenRow ? 'FFFFFFFF' : 'FFF9FAFB';

    const row = worksheet.getRow(currentRow);
    
    row.getCell(1).value = subject.slNo;
    applyCellStyle(row.getCell(1), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    
    row.getCell(2).value = subject.code;
    applyCellStyle(row.getCell(2), { backgroundColor: bgColor });
    
    row.getCell(3).value = subject.name;
    applyCellStyle(row.getCell(3), { backgroundColor: bgColor });
    
    row.getCell(4).value = subject.staffName;
    applyCellStyle(row.getCell(4), { backgroundColor: bgColor });
    
    row.getCell(5).value = `${subject.passPercentage.toFixed(2)}%`;
    applyCellStyle(row.getCell(5), { backgroundColor: bgColor, alignment: { horizontal: 'center' } });
    
    currentRow++;
  });

  currentRow += 2;

  // ==================== SIGNATURES ====================
  
  const sigColSpan = Math.floor(totalCols / 3);
  
  worksheet.mergeCells(currentRow, 1, currentRow, sigColSpan);
  const classInChargeCell = worksheet.getCell(currentRow, 1);
  classInChargeCell.value = 'CLASS IN CHARGE';
  applyCellStyle(classInChargeCell, { bold: true, alignment: { horizontal: 'center' } });

  worksheet.mergeCells(currentRow, sigColSpan + 1, currentRow, sigColSpan * 2);
  const hodCell = worksheet.getCell(currentRow, sigColSpan + 1);
  hodCell.value = 'HOD';
  applyCellStyle(hodCell, { bold: true, alignment: { horizontal: 'center' } });

  worksheet.mergeCells(currentRow, sigColSpan * 2 + 1, currentRow, totalCols);
  const principalCell = worksheet.getCell(currentRow, sigColSpan * 2 + 1);
  principalCell.value = 'PRINCIPAL';
  applyCellStyle(principalCell, { bold: true, alignment: { horizontal: 'center' } });

  // ==================== COLUMN WIDTHS ====================
  
  worksheet.getColumn(1).width = 8;  // Sl No
  worksheet.getColumn(2).width = 15; // Reg No
  worksheet.getColumn(3).width = 30; // Name
  for (let i = 4; i < 4 + data.courseCodes.length; i++) {
    worksheet.getColumn(i).width = 12; // Course codes
  }
  worksheet.getColumn(totalCols).width = 18; // Supplies count

  // ==================== EXPORT FILE ====================
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
