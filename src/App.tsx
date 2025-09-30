import React, { useState } from "react";
import {
  ChevronDown,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
} from "lucide-react";

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

const resultsData: { [key: string]: DepartmentData } = {
  CE: {
    name: "Civil Engineering",
    code: "CE",
    courses: {
      GYMAT201: "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      GCCYT122: "CHEMISTRY FOR PHYSICAL SCIENCE",
      GCEST203: "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING",
      GZEST204: "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      PCCET205: "MECHANICS OF SOLIDS",
      UCEST206: "ENGINEERING ENTREPRENEURSHIP & IPR",
      GCESL218: "CIVIL ENGINEERING DRAFTING LAB",
      UCHUT128: "LIFE SKILLS AND PROFESSIONAL COMMUNICATION",
    },
    students: [
      {
        registerNo: "MLM24CE001",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "F",
          GYMAT201: "F",
          UCEST206: "F",
          GCEST203: "F",
          GZEST204: "F",
          PCCET205: "F",
          GCESL218: "D",
        },
      },
      {
        registerNo: "MLM24CE002",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "C",
          GYMAT201: "C+",
          UCEST206: "C+",
          GCEST203: "D",
          GZEST204: "D",
          PCCET205: "D",
          GCESL218: "A",
        },
      },
      {
        registerNo: "MLM24CE003",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "F",
          GYMAT201: "F",
          UCEST206: "D",
          GCEST203: "F",
          GZEST204: "F",
          PCCET205: "F",
          GCESL218: "D",
        },
      },
      {
        registerNo: "MLM24CE004",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "F",
          GYMAT201: "F",
          UCEST206: "F",
          GCEST203: "F",
          GZEST204: "F",
          PCCET205: "F",
          GCESL218: "D",
        },
      },
    ],
  },
  CS: {
    name: "Computer Science & Engineering",
    code: "CS",
    courses: {
      GAMAT201: "MATHEMATICS FOR INFORMATION SCIENCE - 2",
      GAPHT121: "PHYSICS FOR INFORMATION SCIENCE",
      GXEST203:
        "FOUNDATIONS OF COMPUTING: FROM HARDWARE ESSENTIALS TO WEB DESIGN",
      GXEST204: "PROGRAMMING IN C",
      PCCST205: "DISCRETE MATHEMATICS",
      UCEST206: "ENGINEERING ENTREPRENEURSHIP & IPR",
      GXESL208: "IT WORKSHOP",
      UCHWT127: "HEALTH AND WELLNESS",
    },
    students: [
      {
        registerNo: "MLM24CS001",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C+",
          GXEST204: "D",
          PCCST205: "P",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS002",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "B+",
          GXEST204: "C+",
          PCCST205: "C",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS003",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "F",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS004",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "A",
          GXEST204: "C+",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS005",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "P",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS006",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS007",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS008",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "D",
          GXEST204: "D",
          PCCST205: "D",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS009",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS010",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "P",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS011",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS012",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS013",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS014",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS015",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C+",
          GXEST204: "C+",
          PCCST205: "P",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS016",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "D",
          GXEST204: "D",
          PCCST205: "P",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS017",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "B",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS018",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "A+",
          GXEST204: "B+",
          PCCST205: "D",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS019",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C+",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS020",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "C+",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS021",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "D",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS022",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "A",
          GXEST204: "A",
          PCCST205: "C",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS023",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "B+",
          GXEST204: "D",
          PCCST205: "P",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS024",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS025",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS026",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "B+",
          GXEST204: "B",
          PCCST205: "P",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS027",
        courses: {
          GAPHT121: "A",
          UCHWT127: "PASS",
          GAMAT201: "A+",
          GXEST203: "A",
          GXEST204: "A",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS028",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS029",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "B+",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS030",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS031",
        courses: {
          GAPHT121: "A",
          UCHWT127: "PASS",
          GAMAT201: "A+",
          GXEST203: "A+",
          GXEST204: "C+",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS032",
        courses: {
          GAPHT121: "A+",
          UCHWT127: "PASS",
          GAMAT201: "A+",
          GXEST203: "A+",
          GXEST204: "B+",
          PCCST205: "C+",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS033",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS034",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "B+",
          GXEST204: "C",
          PCCST205: "P",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS035",
        courses: {
          GAPHT121: "A",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "A+",
          GXEST204: "A",
          PCCST205: "C",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS036",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "B+",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS037",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "B",
          GXEST204: "D",
          PCCST205: "C",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS038",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS039",
        courses: {
          GAPHT121: "S",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "S",
          GXEST204: "A",
          PCCST205: "B",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS040",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS041",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS042",
        courses: {
          GAPHT121: "S",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "B+",
          GXEST204: "A",
          PCCST205: "A+",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS043",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "D",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS044",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "C+",
          GXEST204: "D",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS045",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS046",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "B",
          GXEST204: "B",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS047",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "C+",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS048",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS049",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "A+",
          GXEST204: "C",
          PCCST205: "D",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS050",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "B",
          GXEST204: "B",
          PCCST205: "B",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS051",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "C+",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS052",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "B+",
          GXEST204: "C+",
          PCCST205: "C",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS053",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS054",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "D",
          GXEST204: "P",
          PCCST205: "P",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS055",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "C",
          GXEST204: "C+",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS056",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS057",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "B+",
          GXEST204: "C",
          PCCST205: "F",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS058",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "B",
          GXEST204: "C+",
          PCCST205: "C+",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS059",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "B",
          GXEST204: "B",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS060",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS061",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C+",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS062",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS063",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "D",
          GXEST204: "D",
          PCCST205: "P",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS064",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS065",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS066",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "C+",
          GXEST204: "C+",
          PCCST205: "F",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS067",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "C+",
          GXEST204: "A+",
          PCCST205: "C",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS068",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS069",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C+",
          GXEST204: "B+",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS070",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS071",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "A+",
          GXEST204: "A",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS072",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS073",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "B+",
          GXEST204: "A",
          PCCST205: "C",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS074",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS075",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "S",
          GXEST204: "C",
          PCCST205: "C",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS076",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "A+",
          GXEST203: "B+",
          GXEST204: "B+",
          PCCST205: "B",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS077",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS078",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "C",
          GXEST204: "B",
          PCCST205: "D",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS079",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "C",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS080",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "A",
          GXEST204: "B+",
          PCCST205: "C",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS081",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "C+",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS082",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "D",
          GXEST204: "B+",
          PCCST205: "P",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS083",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "B",
          GXEST204: "C",
          PCCST205: "P",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS084",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "C",
          GXEST204: "B+",
          PCCST205: "B",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS085",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "D",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS086",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C+",
          GXEST204: "B",
          PCCST205: "P",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS087",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "C",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS088",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "P",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS089",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "P",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "D",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS090",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS091",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "B",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS092",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "C",
          GXEST204: "C",
          PCCST205: "P",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS093",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS094",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "C+",
          GXEST204: "C+",
          PCCST205: "C",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS095",
        courses: {
          GAPHT121: "P",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "B+",
          GXEST204: "C",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS098",
        courses: {
          GAPHT121: "C",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "B",
          GXEST204: "B+",
          PCCST205: "C",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS099",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "D",
          GXEST204: "C+",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS100",
        courses: {
          GAPHT121: "A+",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "S",
          GXEST204: "S",
          PCCST205: "B+",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS101",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "B",
          GXEST204: "F",
          PCCST205: "D",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS102",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "D",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS103",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS104",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "A+",
          GXEST203: "A+",
          GXEST204: "A",
          PCCST205: "C+",
          UCEST206: "A+",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS105",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "C+",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS106",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "B+",
          GXEST204: "C+",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS107",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "D",
          GXEST204: "P",
          PCCST205: "F",
          UCEST206: "C",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS108",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "C",
          GXEST204: "B",
          PCCST205: "F",
          UCEST206: "B",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS110",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "F",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS111",
        courses: {
          GAPHT121: "A",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "B+",
          GXEST204: "B+",
          PCCST205: "C+",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS112",
        courses: {
          GAPHT121: "S",
          UCHWT127: "PASS",
          GAMAT201: "A",
          GXEST203: "B",
          GXEST204: "B+",
          PCCST205: "B+",
          UCEST206: "A+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS113",
        courses: {
          GAPHT121: "D",
          UCHWT127: "PASS",
          GAMAT201: "D",
          GXEST203: "C+",
          GXEST204: "C",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS114",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "P",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS115",
        courses: {
          GAPHT121: "A",
          UCHWT127: "PASS",
          GAMAT201: "B",
          GXEST203: "C",
          GXEST204: "C+",
          PCCST205: "D",
          UCEST206: "A+",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS116",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS117",
        courses: {
          GAPHT121: "B",
          UCHWT127: "PASS",
          GAMAT201: "C+",
          GXEST203: "P",
          GXEST204: "P",
          PCCST205: "D",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS118",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "C",
          GXEST203: "P",
          GXEST204: "D",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS119",
        courses: {
          GAPHT121: "B+",
          UCHWT127: "PASS",
          GAMAT201: "S",
          GXEST203: "B",
          GXEST204: "A",
          PCCST205: "B",
          UCEST206: "S",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS120",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "P",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS121",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "P",
          GXEST203: "P",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "B+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS122",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C+",
          GXEST204: "C",
          PCCST205: "F",
          UCEST206: "A",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS123",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "D",
          GXESL208: "A+",
        },
      },
      {
        registerNo: "MLM24CS124",
        courses: {
          GAPHT121: "F",
          UCHWT127: "PASS",
          GAMAT201: "F",
          GXEST203: "F",
          GXEST204: "F",
          PCCST205: "F",
          UCEST206: "C+",
          GXESL208: "S",
        },
      },
      {
        registerNo: "MLM24CS125",
        courses: {
          GAPHT121: "C+",
          UCHWT127: "PASS",
          GAMAT201: "B+",
          GXEST203: "C",
          GXEST204: "C",
          PCCST205: "D",
          UCEST206: "A+",
          GXESL208: "A+",
        },
      },
    ],
  },
  EC: {
    name: "Electronics & Communication Engineering",
    code: "EC",
    courses: {
      GYMAT201: "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      GBPHT121: "PHYSICS FOR ELECTRICAL SCIENCE",
      GXEST203:
        "FOUNDATIONS OF COMPUTING: FROM HARDWARE ESSENTIALS TO WEB DESIGN",
      GXEST204: "PROGRAMMING IN C",
      PCECT205: "NETWORK THEORY",
      UCEST206: "ENGINEERING ENTREPRENEURSHIP & IPR",
      GXESL208: "IT WORKSHOP",
      UCHWT127: "HEALTH AND WELLNESS",
    },
    students: [
      {
        registerNo: "MLM24EC001",
        courses: {
          GBPHT121: "F",
          UCHWT127: "PASS",
          GYMAT201: "F",
          GXEST203: "P",
          GXEST204: "F",
          PCECT205: "F",
          UCEST206: "D",
          GXESL208: "B+",
        },
      },
      {
        registerNo: "MLM24EC002",
        courses: {
          GBPHT121: "F",
          UCHWT127: "PASS",
          GYMAT201: "C",
          GXEST203: "B",
          GXEST204: "F",
          PCECT205: "F",
          UCEST206: "B",
          GXESL208: "B",
        },
      },
      {
        registerNo: "MLM24EC003",
        courses: {
          GBPHT121: "D",
          UCHWT127: "PASS",
          GYMAT201: "B+",
          GXEST203: "A",
          GXEST204: "B+",
          PCECT205: "C",
          UCEST206: "B",
          GXESL208: "A+",
        },
      },
    ],
  },
  EE: {
    name: "Electrical and Electronics Engineering",
    code: "EE",
    courses: {
      GYMAT201: "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      GXCYT122: "CHEMISTRY FOR INFORMATION SCIENCE / ELECTRICAL SCIENCE",
      GBEST213: "ENGINEERING MECHANICS",
      GXEST204: "PROGRAMMING IN C",
      PCEET205: "MEASUREMENTS AND INSTRUMENTATION",
      UCEST206: "ENGINEERING ENTREPRENEURSHIP & IPR",
      GXESL208: "IT WORKSHOP",
      UCHUT128: "LIFE SKILLS AND PROFESSIONAL COMMUNICATION",
    },
    students: [
      {
        registerNo: "MLM24EE001",
        courses: {
          GXCYT122: "B+",
          UCHUT128: "PASS",
          GYMAT201: "C+",
          GXEST204: "C+",
          PCEET205: "A",
          UCEST206: "A+",
          GXESL208: "A+",
          GBEST213: "A",
        },
      },
      {
        registerNo: "MLM24EE002",
        courses: {
          GXCYT122: "F",
          UCHUT128: "PASS",
          GYMAT201: "F",
          GXEST204: "F",
          PCEET205: "F",
          UCEST206: "C",
          GXESL208: "A+",
          GBEST213: "F",
        },
      },
    ],
  },
  ME: {
    name: "Mechanical Engineering",
    code: "ME",
    courses: {
      GYMAT201: "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      GCCYT122: "CHEMISTRY FOR PHYSICAL SCIENCE",
      GCEST203: "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING",
      GZEST204: "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      PCMET205: "MATERIAL SCIENCE AND ENGINEERING",
      UCEST206: "ENGINEERING ENTREPRENEURSHIP & IPR",
      GZESL208: "BASIC ELECTRICAL AND ELECTRONICS ENGINEERING WORKSHOP",
      UCHUT128: "LIFE SKILLS AND PROFESSIONAL COMMUNICATION",
    },
    students: [
      {
        registerNo: "MLM24ME001",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "F",
          GYMAT201: "D",
          UCEST206: "D",
          GCEST203: "F",
          GZEST204: "F",
          PCMET205: "F",
          GZESL208: "S",
        },
      },
      {
        registerNo: "MLM24ME002",
        courses: {
          UCHUT128: "PASS",
          GCCYT122: "F",
          GYMAT201: "F",
          UCEST206: "F",
          GCEST203: "F",
          GZEST204: "F",
          PCMET205: "F",
          GZESL208: "A+",
        },
      },
    ],
  },
};

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    setIsDropdownOpen(false);
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

  const departmentStats = selectedDepartment
    ? {
        totalStudents: resultsData[selectedDepartment]?.students.length || 0,
        passPercentage: Math.round(
          ((resultsData[selectedDepartment]?.students.filter((student) =>
            Object.values(student.courses).every(
              (grade) => !["F", "Absent"].includes(grade)
            )
          ).length || 0) /
            (resultsData[selectedDepartment]?.students.length || 1)) *
            100
        ),
        totalCourses: Object.keys(
          resultsData[selectedDepartment]?.courses || {}
        ).length,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  APJ Abdul Kalam Technological University
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Mangalam College of Engineering
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg inline-block">
              <h2 className="text-xl font-semibold">
                B.Tech S2 (R) Exam Results - May 2025 (2024 Scheme)
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Selection */}
        <div className="mb-8">
          <div className="relative inline-block w-full max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    selectedDepartment ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {selectedDepartment
                    ? `${resultsData[selectedDepartment].name} (${selectedDepartment})`
                    : "Choose a department..."}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {Object.entries(resultsData).map(([code, dept]) => (
                  <button
                    key={code}
                    onClick={() => handleDepartmentChange(code)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{dept.name}</div>
                    <div className="text-sm text-gray-500">
                      Department Code: {code}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department Statistics */}
        {selectedDepartment && departmentStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.totalStudents}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.passPercentage}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentStats.totalCourses}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {selectedDepartment && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {resultsData[selectedDepartment].name} - Student Results
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Academic Year: 2024-28 | Semester: 2
              </p>
            </div>

            <div className="relative max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 top-0 bg-gray-50 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 z-20">
                      Register No.
                    </th>
                    {Object.entries(
                      resultsData[selectedDepartment].courses
                    ).map(([code, name]) => (
                      <th
                        key={code}
                        className="px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                      >
                        <div className="font-bold">{code}</div>
                        <div className="text-xs text-gray-400 normal-case mt-1 line-clamp-2">
                          {name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resultsData[selectedDepartment].students
                    .sort((a, b) => a.registerNo.localeCompare(b.registerNo))
                    .map((student, index) => (
                      <tr
                        key={student.registerNo}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 border-r border-gray-200">
                          {student.registerNo}
                        </td>
                        {Object.keys(
                          resultsData[selectedDepartment].courses
                        ).map((courseCode) => (
                          <td
                            key={courseCode}
                            className="px-3 py-4 whitespace-nowrap text-center"
                          >
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getGradeColor(
                                student.courses[courseCode] || "N/A"
                              )}`}
                            >
                              {student.courses[courseCode] || "N/A"}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grade Legend */}
        {selectedDepartment && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Legend
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { grade: "S", desc: "Outstanding" },
                { grade: "A+", desc: "Excellent" },
                { grade: "A", desc: "Very Good" },
                { grade: "B+", desc: "Good Plus" },
                { grade: "B", desc: "Good" },
                { grade: "C+", desc: "Average Plus" },
                { grade: "C", desc: "Average" },
                { grade: "D", desc: "Pass" },
                { grade: "P", desc: "Pass" },
                { grade: "F", desc: "Fail" },
                { grade: "PASS", desc: "Passed" },
                { grade: "Absent", desc: "Absent" },
              ].map(({ grade, desc }) => (
                <div key={grade} className="text-center">
                  <div
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border mb-1 ${getGradeColor(
                      grade
                    )}`}
                  >
                    {grade}
                  </div>
                  <div className="text-xs text-gray-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedDepartment && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Select a Department
            </h3>
            <p className="text-gray-600">
              Choose a department from the dropdown above to view student
              results
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 APJ Abdul Kalam Technological University - Mangalam College
            of Engineering
          </p>
          <p className="text-xs text-gray-400 mt-1">
            &copy; Developed By <a href="https://www.instagram.com/devaduthhhh">Devaduth</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
