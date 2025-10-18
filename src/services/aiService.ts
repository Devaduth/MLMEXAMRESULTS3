import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, this should be handled by a backend
});

export interface StudentResult {
  registerNo: string;
  courses: { [courseCode: string]: string };
}

export interface DepartmentData {
  name: string;
  code: string;
  students: StudentResult[];
  courses: { [courseCode: string]: string };
}

export interface ProcessedResults {
  [key: string]: DepartmentData;
}

export const processPDFWithAI = async (file: File): Promise<ProcessedResults> => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    // Convert file to base64
    const base64 = await fileToBase64(file);

    const prompt = `
You are an expert at analyzing exam result PDFs and extracting structured data. 

Please analyze this PDF image and extract exam results data. The PDF may contain:
- Student registration numbers
- Course codes and names
- Grades (S, A+, A, B+, B, C+, C, D, P, F, PASS, Absent, Withheld)
- Department information

Extract and structure the data into the following JSON format:

{
  "DEPT_CODE": {
    "name": "Department Name",
    "code": "DEPT_CODE", 
    "courses": {
      "COURSE_CODE": "Course Name"
    },
    "students": [
      {
        "registerNo": "REGISTRATION_NUMBER",
        "courses": {
          "COURSE_CODE": "GRADE"
        }
      }
    ]
  }
}

Important guidelines:
1. Extract ALL students and their grades for each course
2. Use the exact course codes as they appear in the PDF
3. Use the exact registration numbers as they appear
4. Map grades exactly as they appear (S, A+, A, B+, B, C+, C, D, P, F, PASS, Absent, Withheld)
5. If a student doesn't have a grade for a course, use "N/A"
6. Group students by department if multiple departments are present
7. Ensure all course codes are included in the courses object
8. Return ONLY valid JSON, no additional text or explanations
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o which supports vision
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting structured data from exam result PDFs. Always return valid JSON format."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI service');
    }

    // Clean the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    
    // Validate the structure
    if (typeof extractedData !== 'object' || extractedData === null) {
      throw new Error('Invalid data structure returned by AI');
    }

    return extractedData as ProcessedResults;

  } catch (error) {
    console.error('Error processing PDF with AI:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
    }
    
    throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
