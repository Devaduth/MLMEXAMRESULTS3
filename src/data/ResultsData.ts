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
    "name": "Civil Engineering",
    "code": "CE",
    "courses": {
      "GYMAT201": "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      "GCCYT122": "CHEMISTRY FOR PHYSICAL SCIENCE",
      "GCEST203": "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING",
      "GZEST204": "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      "PCCET205": "MECHANICS OF SOLIDS",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GCESL218": "CIVIL ENGINEERING DRAFTING LAB",
      "UCHUT128": "LIFE SKILLS AND PROFESSIONAL COMMUNICATION"
    },
    "students": [
      {
        "registerNo": "MLM24CE001",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      },
      {
        "registerNo": "MLM24CE002",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "C+",
          "UCEST206": "C+",
          "GCEST203": "D",
          "GZEST204": "D",
          "PCCET205": "D",
          "GCESL218": "A"
        }
      },
      {
        "registerNo": "MLM24CE003",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      },
      {
        "registerNo": "MLM24CE004",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      },
      {
        "registerNo": "MLM24CE005",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "C+"
        }
      },
      {
        "registerNo": "MLM24CE006",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "B",
          "UCEST206": "A",
          "GCEST203": "C+",
          "GZEST204": "C",
          "PCCET205": "F",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE007",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      },
      {
        "registerNo": "MLM24CE008",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "D",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B"
        }
      },
      {
        "registerNo": "MLM24CE009",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "B",
          "GYMAT201": "S",
          "UCEST206": "C+",
          "GCEST203": "S",
          "GZEST204": "C",
          "PCCET205": "C+",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE010",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "P",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "A"
        }
      },
      {
        "registerNo": "MLM24CE011",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "C+",
          "UCEST206": "B",
          "GCEST203": "A+",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE013",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "C+",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B+"
        }
      },
      {
        "registerNo": "MLM24CE014",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "A",
          "UCEST206": "S",
          "GCEST203": "C",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE015",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B"
        }
      },
      {
        "registerNo": "MLM24CE016",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "P",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "C"
        }
      },
      {
        "registerNo": "MLM24CE017",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "A",
          "UCEST206": "B+",
          "GCEST203": "C",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "A+"
        }
      },
      {
        "registerNo": "MLM24CE018",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "F",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "D",
          "PCCET205": "Absent",
          "GCESL218": "B"
        }
      },
      {
        "registerNo": "MLM24CE019",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "D",
          "UCEST206": "Absent",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "C+"
        }
      },
      {
        "registerNo": "MLM24CE020",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "A"
        }
      },
      {
        "registerNo": "MLM24CE021",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "Absent",
          "GYMAT201": "Absent",
          "UCEST206": "Absent",
          "GCEST203": "Absent",
          "GZEST204": "Absent",
          "PCCET205": "Absent",
          "GCESL218": "Absent"
        }
      },
      {
        "registerNo": "MLM24CE022",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A",
          "GYMAT201": "S",
          "UCEST206": "A",
          "GCEST203": "B+",
          "GZEST204": "A",
          "PCCET205": "C+",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE023",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "A",
          "UCEST206": "B",
          "GCEST203": "A+",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B+"
        }
      },
      {
        "registerNo": "MLM24CE024",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "A+"
        }
      },
      {
        "registerNo": "MLM24CE025",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B"
        }
      },
      {
        "registerNo": "MLM24CE026",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "C",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B+"
        }
      },
      {
        "registerNo": "MLM24CE027",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      },
      {
        "registerNo": "MLM24CE028",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "S",
          "UCEST206": "B+",
          "GCEST203": "B+",
          "GZEST204": "B",
          "PCCET205": "C+",
          "GCESL218": "S"
        }
      },
      {
        "registerNo": "MLM24CE030",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "F",
          "UCEST206": "B",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "B+"
        }
      },
      {
        "registerNo": "MLM24CE031",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "P",
          "GYMAT201": "F",
          "UCEST206": "B",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCET205": "F",
          "GCESL218": "D"
        }
      }
    ]
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
        registerNo: "MLM24CS096",
        courses: {
          GAPHT121: "Withheld",
          UCHWT127: "PASS",
          GAMAT201: "Withheld",
          GXEST203: "Withheld",
          GXEST204: "Withheld",
          PCCST205: "Withheld",
          UCEST206: "Withheld",
          GXESL208: "Withheld",
        },
      },
      {
        registerNo: "MLM24CS097",
        courses: {
          GAPHT121: "Withheld",
          UCHWT127: "PASS",
          GAMAT201: "Withheld",
          GXEST203: "Withheld",
          GXEST204: "Withheld",
          PCCST205: "Withheld",
          UCEST206: "Withheld",
          GXESL208: "Withheld",
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
    "name": "Electronics & Communication Engineering",
    "code": "EC",
    "courses": {
      "GYMAT201": "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      "GBPHT121": "PHYSICS FOR ELECTRICAL SCIENCE",
      "GXEST203": "FOUNDATIONS OF COMPUTING: FROM HARDWARE ESSENTIALS TO WEB DESIGN",
      "GXEST204": "PROGRAMMING IN C",
      "PCECT205": "NETWORK THEORY",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GXESL208": "IT WORKSHOP",
      "UCHWT127": "HEALTH AND WELLNESS"
    },
    "students": [
      {
        "registerNo": "MLM24EC001",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "P",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "D",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC002",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "C",
          "GXEST203": "B",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "B",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24EC003",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "B+",
          "GXEST203": "A",
          "GXEST204": "B+",
          "PCECT205": "C",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC004",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "P",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "P",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC005",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "F",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC006",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "F",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC007",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "F",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC008",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "D",
          "UCEST206": "C",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24EC009",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C+",
          "GXESL208": "C"
        }
      },
      {
        "registerNo": "MLM24EC010",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "C+",
          "GXEST203": "B+",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C+",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24EC011",
        "courses": {
          "GBPHT121": "C",
          "UCHWT127": "PASS",
          "GYMAT201": "B+",
          "GXEST203": "S",
          "GXEST204": "B+",
          "PCECT205": "C",
          "UCEST206": "A+",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC012",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC013",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "P",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC014",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "P",
          "GXEST203": "C+",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C+",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC015",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "B",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "C+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC016",
        "courses": {
          "GBPHT121": "A",
          "UCHWT127": "PASS",
          "GYMAT201": "A",
          "GXEST203": "S",
          "GXEST204": "B",
          "PCECT205": "B+",
          "UCEST206": "S",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24EC017",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "A+",
          "GXEST203": "B",
          "GXEST204": "B+",
          "PCECT205": "C+",
          "UCEST206": "B+",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC018",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "C",
          "GXEST203": "B",
          "GXEST204": "D",
          "PCECT205": "C",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC019",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "P",
          "GXEST203": "P",
          "GXEST204": "F",
          "PCECT205": "D",
          "UCEST206": "C",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24EC020",
        "courses": {
          "GBPHT121": "C+",
          "UCHWT127": "PASS",
          "GYMAT201": "D",
          "GXEST203": "B",
          "GXEST204": "C",
          "PCECT205": "F",
          "UCEST206": "B+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC021",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "C+",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "D",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC022",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "D",
          "GXEST203": "C+",
          "GXEST204": "D",
          "PCECT205": "F",
          "UCEST206": "B+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC023",
        "courses": {
          "GBPHT121": "C+",
          "UCHWT127": "PASS",
          "GYMAT201": "B+",
          "GXEST203": "B",
          "GXEST204": "C+",
          "PCECT205": "B",
          "UCEST206": "B+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC024",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "B+",
          "GXEST203": "B+",
          "GXEST204": "C+",
          "PCECT205": "C+",
          "UCEST206": "B+",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC025",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "P",
          "GXEST203": "C",
          "GXEST204": "D",
          "PCECT205": "F",
          "UCEST206": "B",
          "GXESL208": "C+"
        }
      },
      {
        "registerNo": "MLM24EC026",
        "courses": {
          "GBPHT121": "D",
          "UCHWT127": "PASS",
          "GYMAT201": "C+",
          "GXEST203": "C+",
          "GXEST204": "D",
          "PCECT205": "C",
          "UCEST206": "B+",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC027",
        "courses": {
          "GBPHT121": "P",
          "UCHWT127": "PASS",
          "GYMAT201": "C",
          "GXEST203": "D",
          "GXEST204": "P",
          "PCECT205": "P",
          "UCEST206": "A",
          "GXESL208": "A"
        }
      },
      {
        "registerNo": "MLM24EC028",
        "courses": {
          "GBPHT121": "F",
          "UCHWT127": "PASS",
          "GYMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCECT205": "F",
          "UCEST206": "D",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24EC029",
        "courses": {
          "GBPHT121": "C+",
          "UCHWT127": "PASS",
          "GYMAT201": "C+",
          "GXEST203": "B",
          "GXEST204": "D",
          "PCECT205": "D",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24EC030",
        "courses": {
          "GBPHT121": "C+",
          "UCHWT127": "PASS",
          "GYMAT201": "B",
          "GXEST203": "B+",
          "GXEST204": "B+",
          "PCECT205": "C+",
          "UCEST206": "B+",
          "GXESL208": "A"
        }
      }
    ]
  },
  EE: {
    "name": "Electrical and Electronics Engineering",
    "code": "EE",
    "courses": {
      "GYMAT201": "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      "GXCYT122": "CHEMISTRY FOR INFORMATION SCIENCE / ELECTRICAL SCIENCE",
      "GBEST213": "ENGINEERING MECHANICS",
      "GXEST204": "PROGRAMMING IN C",
      "PCEET205": "MEASUREMENTS AND INSTRUMENTATION",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GXESL208": "IT WORKSHOP",
      "UCHUT128": "LIFE SKILLS AND PROFESSIONAL COMMUNICATION"
    },
    "students": [
      {
        "registerNo": "MLM24EE001",
        "courses": {
          "GXCYT122": "B+",
          "UCHUT128": "PASS",
          "GYMAT201": "C+",
          "GXEST204": "C+",
          "PCEET205": "A",
          "UCEST206": "A+",
          "GXESL208": "A+",
          "GBEST213": "A"
        }
      },
      {
        "registerNo": "MLM24EE002",
        "courses": {
          "GXCYT122": "F",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "C",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE004",
        "courses": {
          "GXCYT122": "C+",
          "UCHUT128": "PASS",
          "GYMAT201": "A",
          "GXEST204": "B",
          "PCEET205": "B+",
          "UCEST206": "A",
          "GXESL208": "S",
          "GBEST213": "B"
        }
      },
      {
        "registerNo": "MLM24EE006",
        "courses": {
          "GXCYT122": "F",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "F",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE007",
        "courses": {
          "GXCYT122": "C",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "C",
          "UCEST206": "B",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE008",
        "courses": {
          "GXCYT122": "A",
          "UCHUT128": "PASS",
          "GYMAT201": "B+",
          "GXEST204": "C",
          "PCEET205": "B+",
          "UCEST206": "S",
          "GXESL208": "S",
          "GBEST213": "C+"
        }
      },
      {
        "registerNo": "MLM24EE009",
        "courses": {
          "GXCYT122": "FE",
          "UCHUT128": "PASS",
          "GYMAT201": "FE",
          "GXEST204": "FE",
          "PCEET205": "FE",
          "UCEST206": "F",
          "GXESL208": "A",
          "GBEST213": "FE"
        }
      },
      {
        "registerNo": "MLM24EE010",
        "courses": {
          "GXCYT122": "F",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "F",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE012",
        "courses": {
          "GXCYT122": "Withheld",
          "UCHUT128": "PASS",
          "GYMAT201": "Withheld",
          "GXEST204": "Withheld",
          "PCEET205": "Withheld",
          "UCEST206": "Withheld",
          "GXESL208": "Withheld",
          "GBEST213": "Withheld"
        }
      },
      {
        "registerNo": "MLM24EE013",
        "courses": {
          "GXCYT122": "P",
          "UCHUT128": "PASS",
          "GYMAT201": "P",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "F",
          "GXESL208": "A+",
          "GBEST213": "D"
        }
      },
      {
        "registerNo": "MLM24EE014",
        "courses": {
          "GXCYT122": "F",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "C+",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE015",
        "courses": {
          "GXCYT122": "F",
          "UCHUT128": "PASS",
          "GYMAT201": "F",
          "GXEST204": "F",
          "PCEET205": "F",
          "UCEST206": "F",
          "GXESL208": "A+",
          "GBEST213": "F"
        }
      },
      {
        "registerNo": "MLM24EE016",
        "courses": {
          "GXCYT122": "Withheld",
          "UCHUT128": "PASS",
          "GYMAT201": "Withheld",
          "GXEST204": "Withheld",
          "PCEET205": "Withheld",
          "UCEST206": "Withheld",
          "GXESL208": "Withheld",
          "GBEST213": "Withheld"
        }
      }
    ]
  },
  ME: {
    "name": "Mechanical Engineering",
    "code": "ME",
    "courses": {
      "GYMAT201": "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      "GCCYT122": "CHEMISTRY FOR PHYSICAL SCIENCE",
      "GCEST203": "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING",
      "GZEST204": "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      "PCMET205": "MATERIAL SCIENCE AND ENGINEERING",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GZESL208": "BASIC ELECTRICAL AND ELECTRONICS ENGINEERING WORKSHOP",
      "UCHUT128": "LIFE SKILLS AND PROFESSIONAL COMMUNICATION"
    },
    "students": [
      {
        "registerNo": "MLM24ME001",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "D",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME002",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME003",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME004",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME005",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME006",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME007",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME008",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "D",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME009",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "C+",
          "UCEST206": "A+",
          "GCEST203": "D",
          "GZEST204": "C",
          "PCMET205": "C+",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME010",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "A",
          "UCEST206": "B",
          "GCEST203": "C",
          "GZEST204": "D",
          "PCMET205": "B",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME011",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "P",
          "GYMAT201": "D",
          "UCEST206": "B+",
          "GCEST203": "C",
          "GZEST204": "D",
          "PCMET205": "D",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME012",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME014",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "D",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME015",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME016",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "B",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME017",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME018",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "B+",
          "GYMAT201": "B+",
          "UCEST206": "A+",
          "GCEST203": "C",
          "GZEST204": "B",
          "PCMET205": "A",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME019",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "C",
          "UCEST206": "B+",
          "GCEST203": "A",
          "GZEST204": "D",
          "PCMET205": "C+",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME020",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME021",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "C",
          "UCEST206": "B+",
          "GCEST203": "C+",
          "GZEST204": "D",
          "PCMET205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME022",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "C+",
          "UCEST206": "B+",
          "GCEST203": "D",
          "GZEST204": "C",
          "PCMET205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME023",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "A",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME024",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "C+",
          "PCMET205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME025",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "P",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME026",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME027",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "D",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME029",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME030",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME031",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "D",
          "UCEST206": "C",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME032",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "C+",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME033",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "Absent",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "C",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME034",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME035",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24ME036",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "C+",
          "UCEST206": "C",
          "GCEST203": "D",
          "GZEST204": "C",
          "PCMET205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME038",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "C",
          "UCEST206": "C+",
          "GCEST203": "C+",
          "GZEST204": "D",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME039",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "B+",
          "UCEST206": "B+",
          "GCEST203": "A+",
          "GZEST204": "B+",
          "PCMET205": "B",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME040",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24ME041",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "P",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24ME042",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCMET205": "F",
          "GZESL208": "S"
        }
      }
    ]
  },
  CH: {
    "name": "Chemical Engineering",
    "code": "CH",
    "courses": {
      "GYMAT201": "MATHEMATICS FOR ELECTRICAL SCIENCE-2 / PHYSICAL SCIENCE-2",
      "GCCYT122": "CHEMISTRY FOR PHYSICAL SCIENCE",
      "GCEST203": "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING",
      "GZEST204": "BASIC ELECTRICAL & ELECTRONICS ENGINEERING",
      "PCCHT205": "PROCESS CALCULATIONS",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GZESL208": "BASIC ELECTRICAL AND ELECTRONICS ENGINEERING WORKSHOP",
      "UCHUT128": "LIFE SKILLS AND PROFESSIONAL COMMUNICATION"
    },
    "students": [
      {
        "registerNo": "MLM24CH001",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "P",
          "GYMAT201": "D",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH002",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A+",
          "GYMAT201": "S",
          "UCEST206": "B+",
          "GCEST203": "B+",
          "GZEST204": "B+",
          "PCCHT205": "D",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH003",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH004",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "B",
          "GCEST203": "P",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH005",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A",
          "GYMAT201": "C",
          "UCEST206": "A",
          "GCEST203": "F",
          "GZEST204": "B+",
          "PCCHT205": "C+",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH006",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "F",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH007",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "D",
          "UCEST206": "B+",
          "GCEST203": "D",
          "GZEST204": "C",
          "PCCHT205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH008",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "D",
          "GYMAT201": "D",
          "UCEST206": "C+",
          "GCEST203": "F",
          "GZEST204": "C+",
          "PCCHT205": "D",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH009",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A",
          "GYMAT201": "C+",
          "UCEST206": "B+",
          "GCEST203": "F",
          "GZEST204": "C+",
          "PCCHT205": "C",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH011",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "Absent",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH012",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "B+",
          "GYMAT201": "F",
          "UCEST206": "A",
          "GCEST203": "F",
          "GZEST204": "B+",
          "PCCHT205": "F",
          "GZESL208": "A"
        }
      },
      {
        "registerNo": "MLM24CH013",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A+",
          "GYMAT201": "B+",
          "UCEST206": "B",
          "GCEST203": "S",
          "GZEST204": "B",
          "PCCHT205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH014",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "F",
          "UCEST206": "C",
          "GCEST203": "D",
          "GZEST204": "C+",
          "PCCHT205": "F",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH015",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C+",
          "GCEST203": "D",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH016",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "A",
          "GYMAT201": "C+",
          "UCEST206": "B",
          "GCEST203": "B+",
          "GZEST204": "C+",
          "PCCHT205": "D",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH017",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "A+",
          "UCEST206": "B",
          "GCEST203": "B+",
          "GZEST204": "B",
          "PCCHT205": "C",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH018",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "C",
          "UCEST206": "B+",
          "GCEST203": "C+",
          "GZEST204": "C+",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH019",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C",
          "GYMAT201": "P",
          "UCEST206": "C+",
          "GCEST203": "B",
          "GZEST204": "D",
          "PCCHT205": "D",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH020",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "C+",
          "GYMAT201": "C+",
          "UCEST206": "C+",
          "GCEST203": "B+",
          "GZEST204": "C",
          "PCCHT205": "D",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH021",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C",
          "GCEST203": "F",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A"
        }
      },
      {
        "registerNo": "MLM24CH022",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "P",
          "UCEST206": "F",
          "GCEST203": "C",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24CH023",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "B",
          "GYMAT201": "D",
          "UCEST206": "C+",
          "GCEST203": "A",
          "GZEST204": "C",
          "PCCHT205": "D",
          "GZESL208": "S"
        }
      },
      {
        "registerNo": "MLM24CH024",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "F",
          "GYMAT201": "F",
          "UCEST206": "C",
          "GCEST203": "P",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A"
        }
      },
      {
        "registerNo": "MLM24CH025",
        "courses": {
          "UCHUT128": "PASS",
          "GCCYT122": "P",
          "GYMAT201": "F",
          "UCEST206": "B",
          "GCEST203": "B+",
          "GZEST204": "F",
          "PCCHT205": "F",
          "GZESL208": "A"
        }
      }
    ]
  },
  AIM: {
    "name": "Artificial Intelligence and Machine Learning",
    "code": "AIM",
    "courses": {
      "GAMAT201": "MATHEMATICS FOR INFORMATION SCIENCE - 2",
      "GAPHT121": "PHYSICS FOR INFORMATION SCIENCE",
      "GXEST203": "FOUNDATIONS OF COMPUTING: FROM HARDWARE ESSENTIALS TO WEB DESIGN",
      "GXEST204": "PROGRAMMING IN C",
      "PCCST205": "DISCRETE MATHEMATICS",
      "UCEST206": "ENGINEERING ENTREPRENEURSHIP & IPR",
      "GXESL208": "IT WORKSHOP",
      "UCHWT127": "HEALTH AND WELLNESS"
    },
    "students": [
      {
        "registerNo": "MLM24AIM001",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "C+",
          "GXEST204": "P",
          "PCCST205": "P",
          "UCEST206": "B",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM002",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "B",
          "GXEST203": "B",
          "GXEST204": "C+",
          "PCCST205": "P",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM003",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "D",
          "PCCST205": "F",
          "UCEST206": "A",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM004",
        "courses": {
          "GAPHT121": "P",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "D",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM005",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "P",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C",
          "GXESL208": "C"
        }
      },
      {
        "registerNo": "MLM24AIM006",
        "courses": {
          "GAPHT121": "C",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "D",
          "PCCST205": "F",
          "UCEST206": "B+",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM007",
        "courses": {
          "GAPHT121": "A",
          "UCHWT127": "PASS",
          "GAMAT201": "S",
          "GXEST203": "A+",
          "GXEST204": "A",
          "PCCST205": "C",
          "UCEST206": "A+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM008",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "B",
          "GXEST203": "C",
          "GXEST204": "D",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM009",
        "courses": {
          "GAPHT121": "P",
          "UCHWT127": "PASS",
          "GAMAT201": "P",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM010",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "B",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCCST205": "P",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM011",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "D",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM013",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "A+",
          "GXEST203": "C",
          "GXEST204": "D",
          "PCCST205": "C",
          "UCEST206": "B",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM014",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM015",
        "courses": {
          "GAPHT121": "P",
          "UCHWT127": "PASS",
          "GAMAT201": "C+",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM016",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM017",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM018",
        "courses": {
          "GAPHT121": "B",
          "UCHWT127": "PASS",
          "GAMAT201": "A+",
          "GXEST203": "C+",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM019",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM020",
        "courses": {
          "GAPHT121": "A",
          "UCHWT127": "PASS",
          "GAMAT201": "B+",
          "GXEST203": "B+",
          "GXEST204": "F",
          "PCCST205": "B",
          "UCEST206": "A",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM021",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "C",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM022",
        "courses": {
          "GAPHT121": "A",
          "UCHWT127": "PASS",
          "GAMAT201": "S",
          "GXEST203": "B+",
          "GXEST204": "F",
          "PCCST205": "B",
          "UCEST206": "S",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM023",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM024",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM025",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24AIM026",
        "courses": {
          "GAPHT121": "Absent",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "Absent",
          "GXEST204": "Absent",
          "PCCST205": "Absent",
          "UCEST206": "Absent",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM027",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "P",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM028",
        "courses": {
          "GAPHT121": "C",
          "UCHWT127": "PASS",
          "GAMAT201": "C",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM029",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "D",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM030",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "C+",
          "GXEST203": "B",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B+",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24AIM031",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24AIM032",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM033",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "D",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM034",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "C",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM035",
        "courses": {
          "GAPHT121": "C",
          "UCHWT127": "PASS",
          "GAMAT201": "B+",
          "GXEST203": "B",
          "GXEST204": "D",
          "PCCST205": "F",
          "UCEST206": "A",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM036",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24AIM037",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM038",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "B+",
          "GXEST203": "C+",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM039",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "B"
        }
      },
      {
        "registerNo": "MLM24AIM040",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM041",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM042",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM043",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "D",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM044",
        "courses": {
          "GAPHT121": "D",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "C+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM045",
        "courses": {
          "GAPHT121": "B+",
          "UCHWT127": "PASS",
          "GAMAT201": "B+",
          "GXEST203": "B+",
          "GXEST204": "C",
          "PCCST205": "C",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM046",
        "courses": {
          "GAPHT121": "B",
          "UCHWT127": "PASS",
          "GAMAT201": "B",
          "GXEST203": "A",
          "GXEST204": "C+",
          "PCCST205": "D",
          "UCEST206": "A+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM047",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM048",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM049",
        "courses": {
          "GAPHT121": "P",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM050",
        "courses": {
          "GAPHT121": "Absent",
          "UCHWT127": "PASS",
          "GAMAT201": "Absent",
          "GXEST203": "Absent",
          "GXEST204": "Absent",
          "PCCST205": "Absent",
          "UCEST206": "Absent",
          "GXESL208": "F"
        }
      },
      {
        "registerNo": "MLM24AIM051",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM052",
        "courses": {
          "GAPHT121": "Withheld",
          "UCHWT127": "PASS",
          "GAMAT201": "Withheld",
          "GXEST203": "Withheld",
          "GXEST204": "Withheld",
          "PCCST205": "Withheld",
          "UCEST206": "Withheld",
          "GXESL208": "Withheld"
        }
      },
      {
        "registerNo": "MLM24AIM053",
        "courses": {
          "GAPHT121": "P",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B+",
          "GXESL208": "A+"
        }
      },
      {
        "registerNo": "MLM24AIM054",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM055",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "P",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM056",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "D",
          "GXEST203": "C",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "A+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM058",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "P",
          "GXEST204": "P",
          "PCCST205": "F",
          "UCEST206": "S",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM059",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24AIM060",
        "courses": {
          "GAPHT121": "F",
          "UCHWT127": "PASS",
          "GAMAT201": "F",
          "GXEST203": "F",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "F",
          "GXESL208": "B+"
        }
      },
      {
        "registerNo": "MLM24AIM061",
        "courses": {
          "GAPHT121": "C+",
          "UCHWT127": "PASS",
          "GAMAT201": "C",
          "GXEST203": "D",
          "GXEST204": "C",
          "PCCST205": "C",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      },
      {
        "registerNo": "MLM24AIM062",
        "courses": {
          "GAPHT121": "C",
          "UCHWT127": "PASS",
          "GAMAT201": "C+",
          "GXEST203": "D",
          "GXEST204": "F",
          "PCCST205": "F",
          "UCEST206": "B+",
          "GXESL208": "S"
        }
      }
    ]
  }
};

export default resultsData;