import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

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

interface ResultChartsProps {
  resultsData: DepartmentData[] | any;
  selectedDepartment: string | null;
  failingGrades: string[];
}

// Soft academic color palette matching the indigo theme
const COLORS = {
  pass: '#10b981', // green-500
  fail: '#ef4444', // red-500
  subjects: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#06b6d4', '#3b82f6'],
  grades: {
    'S': '#10b981',
    'A+': '#22c55e',
    'A': '#84cc16',
    'B+': '#eab308',
    'B': '#f59e0b',
    'C': '#f97316',
    'P': '#ef4444',
    'F': '#dc2626',
    'Ab': '#9ca3af',
  },
};

const ResultCharts: React.FC<ResultChartsProps> = ({
  resultsData,
  selectedDepartment,
  failingGrades,
}) => {
  // Calculate Pass/Fail data for Pie Chart
  const passFailData = useMemo(() => {
    if (!selectedDepartment) return [];
    
    // Handle "All Departments" case
    if (selectedDepartment === "ALL") {
      const allStudents: any[] = [];
      Object.values(resultsData).forEach((dept: any) => {
        allStudents.push(...dept.students);
      });
      
      const passed = allStudents.filter((student) =>
        Object.values(student.courses ?? {}).every(
          (grade) => !failingGrades.includes(grade as string)
        )
      ).length;
      const failed = allStudents.length - passed;

      return [
        { name: 'Passed', value: passed, percentage: ((passed / allStudents.length) * 100).toFixed(1) },
        { name: 'Failed', value: failed, percentage: ((failed / allStudents.length) * 100).toFixed(1) },
      ];
    }
    
    // resultsData can be either array or object, handle both cases
    const dept = Array.isArray(resultsData) 
      ? resultsData.find(d => d.code === selectedDepartment)
      : resultsData[selectedDepartment];
    
    if (!dept) return [];
    
    const students = dept.students;
    const passed = students.filter((student) =>
      Object.values(student.courses ?? {}).every(
        (grade) => !failingGrades.includes(grade)
      )
    ).length;
    const failed = students.length - passed;

    return [
      { name: 'Passed', value: passed, percentage: ((passed / students.length) * 100).toFixed(1) },
      { name: 'Failed', value: failed, percentage: ((failed / students.length) * 100).toFixed(1) },
    ];
  }, [resultsData, selectedDepartment, failingGrades]);

  // Calculate Subject-wise Pass Percentage for Bar Chart
  const subjectData = useMemo(() => {
    if (!selectedDepartment) return [];

    // Handle "All Departments" case - show department-wise pass rates
    if (selectedDepartment === "ALL") {
      return Object.entries(resultsData).map(([code, dept]: [string, any]) => {
        const students = dept.students;
        const passedCount = students.filter((student: any) =>
          Object.values(student.courses ?? {}).every(
            (grade) => !failingGrades.includes(grade as string)
          )
        ).length;

        const passPercentage = students.length > 0
          ? Number(((passedCount / students.length) * 100).toFixed(1))
          : 0;

        return {
          subject: dept.name.slice(0, 20),
          name: dept.name.slice(0, 30),
          passPercentage,
          failPercentage: 100 - passPercentage,
        };
      });
    }

    const dept = Array.isArray(resultsData) 
      ? resultsData.find(d => d.code === selectedDepartment)
      : resultsData[selectedDepartment];
    if (!dept) return [];

    const students = dept.students;
    const courses = dept.courses;
    
    return Object.entries(courses).map(([code, name]) => {
      const passedCount = students.filter((student) => {
        const grade = student.courses[code];
        return grade && !failingGrades.includes(grade);
      }).length;

      const passPercentage = students.length > 0
        ? Number(((passedCount / students.length) * 100).toFixed(1))
        : 0;

      return {
        subject: code,
        name: name.slice(0, 30),
        passPercentage,
        failPercentage: 100 - passPercentage,
      };
    });
  }, [resultsData, selectedDepartment, failingGrades]);

  // Calculate Grade Distribution for Donut Chart
  const gradeDistribution = useMemo(() => {
    if (!selectedDepartment) return [];

    // Handle "All Departments" case
    if (selectedDepartment === "ALL") {
      const allStudents: any[] = [];
      Object.values(resultsData).forEach((dept: any) => {
        allStudents.push(...dept.students);
      });

      const gradeCounts: { [grade: string]: number } = {};
      allStudents.forEach((student) => {
        Object.values(student.courses ?? {}).forEach((grade) => {
          gradeCounts[grade as string] = (gradeCounts[grade as string] || 0) + 1;
        });
      });

      const totalGrades = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0);
      return Object.entries(gradeCounts)
        .map(([grade, count]) => ({
          grade,
          count,
          percentage: ((count / totalGrades) * 100).toFixed(1),
        }))
        .sort((a, b) => b.count - a.count);
    }

    const dept = Array.isArray(resultsData) 
      ? resultsData.find(d => d.code === selectedDepartment)
      : resultsData[selectedDepartment];
    if (!dept) return [];

    const students = dept.students;
    const gradeCounts: { [grade: string]: number } = {};

    students.forEach((student) => {
      Object.values(student.courses ?? {}).forEach((grade) => {
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
      });
    });

    return Object.entries(gradeCounts)
      .map(([grade, count]) => ({
        grade,
        count,
        percentage: ((count / students.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [resultsData, selectedDepartment]);

  // Calculate Performance Trend (Average Pass Rate per Subject)
  const performanceTrend = useMemo(() => {
    if (!selectedDepartment) return [];

    // Handle "All Departments" case - show department performance trend
    if (selectedDepartment === "ALL") {
      return Object.entries(resultsData).map(([code, dept]: [string, any], index) => {
        const students = dept.students;
        const passedCount = students.filter((student: any) =>
          Object.values(student.courses ?? {}).every(
            (grade) => !failingGrades.includes(grade as string)
          )
        ).length;

        const passPercentage = students.length > 0
          ? Number(((passedCount / students.length) * 100).toFixed(1))
          : 0;

        return {
          subject: dept.name.slice(0, 15),
          name: dept.name.slice(0, 20),
          passRate: passPercentage,
          index: index + 1,
        };
      });
    }

    const dept = Array.isArray(resultsData) 
      ? resultsData.find(d => d.code === selectedDepartment)
      : resultsData[selectedDepartment];
    if (!dept) return [];

    const students = dept.students;
    const courses = dept.courses;

    return Object.entries(courses).map(([code, name], index) => {
      const passedCount = students.filter((student) => {
        const grade = student.courses[code];
        return grade && !failingGrades.includes(grade);
      }).length;

      const passPercentage = students.length > 0
        ? Number(((passedCount / students.length) * 100).toFixed(1))
        : 0;

      return {
        subject: code,
        name: name.slice(0, 20),
        passRate: passPercentage,
        index: index + 1,
      };
    });
  }, [resultsData, selectedDepartment, failingGrades]);

  const currentDept = selectedDepartment === "ALL" 
    ? null 
    : (Array.isArray(resultsData) 
        ? resultsData.find(d => d.code === selectedDepartment)
        : resultsData[selectedDepartment]);

  // Calculate aggregated stats for "ALL" departments
  const allDeptStats = useMemo(() => {
    if (selectedDepartment !== "ALL") return null;

    let totalStudents = 0;
    let totalPassed = 0;
    let totalSubjects = new Set<string>();

    Object.values(resultsData).forEach((dept: any) => {
      const deptStudents = dept.students;
      totalStudents += deptStudents.length;
      
      const passedInDept = deptStudents.filter((student: any) =>
        Object.values(student.courses ?? {}).every(
          (grade) => !failingGrades.includes(grade as string)
        )
      ).length;
      
      totalPassed += passedInDept;
      Object.keys(dept.courses).forEach(code => totalSubjects.add(code));
    });

    const passPercentage = totalStudents > 0 
      ? Number(((totalPassed / totalStudents) * 100).toFixed(1))
      : 0;

    return {
      totalStudents,
      totalPassed,
      passPercentage,
      totalDepartments: Object.keys(resultsData).length,
      totalSubjects: totalSubjects.size,
    };
  }, [resultsData, selectedDepartment, failingGrades]);

  if (!selectedDepartment || (selectedDepartment !== "ALL" && !currentDept)) {
    return (
      <div className="mt-8 bg-gray-50 dark:bg-slate-900 rounded-xl p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-slate-600" />
        <p className="text-gray-600 dark:text-slate-400">
          Select a department to view analytical charts
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-500" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {selectedDepartment === "ALL" ? "College-wide Analytical Insights" : "Analytical Insights"}
        </h2>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass/Fail Distribution - Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pass/Fail Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {passFailData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? COLORS.pass : COLORS.fail}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Pass Percentage - Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedDepartment === "ALL" ? "Stream-wise Pass Rate" : "Subject-wise Pass Rate"}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={subjectData} 
              layout={selectedDepartment === "ALL" ? "vertical" : "horizontal"}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              {selectedDepartment === "ALL" ? (
                <>
                  <XAxis 
                    type="number"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                    label={{ value: 'Pass Rate (%)', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="subject"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    stroke="#9ca3af"
                    width={280}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                    label={{ value: 'Pass %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === 'passPercentage' ? 'Pass Rate' : 'Fail Rate',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar 
                dataKey="passPercentage" 
                fill="#8b5cf6" 
                name="Pass Rate (%)" 
                radius={selectedDepartment === "ALL" ? [0, 8, 8, 0] : [8, 8, 0, 0]}
                label={selectedDepartment === "ALL" ? { position: 'right', fill: '#6b7280', fontSize: 12, formatter: (value: number) => `${value}%` } : false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend - Line Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedDepartment === "ALL" ? "Department Performance Trend" : "Performance Trend"}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="subject"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Pass Rate %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                formatter={(value: number) => [`${value}%`, 'Pass Rate']}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line
                type="monotone"
                dataKey="passRate"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
                name="Pass Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution - Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Grade Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.grade}: ${entry.percentage}%`}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS.grades[entry.grade as keyof typeof COLORS.grades] ||
                      COLORS.subjects[index % COLORS.subjects.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-indigo-200 dark:border-slate-600">
        {selectedDepartment === "ALL" ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {allDeptStats?.totalStudents || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Appeared for exam</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Students Passed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {allDeptStats?.totalPassed || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">All subjects cleared</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Pass Percentage</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {allDeptStats?.passPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">College average</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {allDeptStats?.totalSubjects || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Unique subjects</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Departments</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {allDeptStats?.totalDepartments || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Active streams</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentDept?.students.length || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Subjects</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentDept ? Object.keys(currentDept.courses).length : 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Average Pass Rate</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {passFailData[0]?.percentage || 0}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCharts;
