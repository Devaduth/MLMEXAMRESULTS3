import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the Gemini API client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

class GeminiService {
  private model: GenerativeModel | null = null;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds

  constructor() {
    if (genAI) {
      try {
        this.model = genAI.getGenerativeModel({
          model: 'models/gemini-2.5-pro',
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 65536,
          },
        });
      } catch (error) {
        // Fallback to gemini-1.5-pro if 2.5-pro fails
        try {
          this.model = genAI.getGenerativeModel({
            model: 'models/gemini-1.5-pro',
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 65536,
            },
          });
        } catch (fallbackError) {
          // Last resort: use gemini-1.5-flash
          this.model = genAI.getGenerativeModel({
            model: 'models/gemini-1.5-flash',
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 32768,
            },
          });
        }
      }
    }
  }

  /**
   * Retry helper with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries === 0) {
        throw error;
      }

      // Check if it's a network error that should be retried
      const isNetworkError = 
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('timeout') ||
        error.status === 503 ||
        error.status === 504;

      if (!isNetworkError) {
        throw error; // Don't retry non-network errors
      }

      // Wait before retrying (exponential backoff)
      const delay = this.retryDelay * (this.maxRetries - retries + 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.retryWithBackoff(fn, retries - 1);
    }
  }

  /**
   * Parse university results PDF using Gemini AI with retry logic
   */
  async parseUniversityPDF(pdfText: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    const maxChars = 3000000;
    if (pdfText.length > maxChars) {
      throw new Error('PDF text is too long. Please try with a smaller PDF.');
    }

    return this.retryWithBackoff(async () => {
      try {
        const prompt = this.buildParsingPrompt(pdfText);
        
        const result = await this.model!.generateContent(prompt);
        const response = await result.response;
        
        // Check for safety blocks
        if (response.promptFeedback?.blockReason) {
          throw new Error(`Content was blocked by Gemini: ${response.promptFeedback.blockReason}`);
        }
        
        const text = response.text();

        if (!text || text.trim().length === 0) {
          throw new Error('Gemini returned an empty response. This might be due to content filtering or API limits.');
        }
        
        return text;
      } catch (error: any) {
        // Enhanced error messages for mobile users
        if (error.message?.includes('Failed to fetch')) {
          throw new Error('Network connection issue. Please check your internet connection and try again.');
        } else if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
          throw new Error('Invalid API configuration. Please contact support.');
        } else if (error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429) {
          throw new Error('Service is temporarily busy. Please try again in a few minutes.');
        } else if (error.status === 503 || error.status === 504) {
          throw new Error('Service temporarily unavailable. Retrying...');
        }
        
        throw error;
      }
    });
  }

  /**
   * Build the parsing prompt for university results
   */
  private buildParsingPrompt(pdfText: string): string {
    return `Extract university exam results from this PDF text into compact JSON. 

RULES:
- Extract ALL student records
- Format: [{"name":"DEPT","code":"XX","students":[{"registerNo":"XXX","courses":{"CODE":"GRADE"}}],"courses":{"CODE":"Name"}}]
- Use SHORT course names (max 20 chars)
- Return ONLY valid JSON array, NO markdown, NO extra text
- Complete the JSON properly - don't truncate

PDF TEXT:
${pdfText}

JSON:`;
  }

  /**
   * Attempt to fix incomplete JSON by closing open structures
   */
  private attemptFixIncompleteJSON(json: string): string {
    let fixed = json.trim();
    
    // Remove incomplete property/value at the end
    const incompletePatterns = [
      /,\s*"[^"]*":\s*"[^"]*$/,
      /,\s*"[^"]*":\s*$/,
      /,\s*"[^"]*$/,
      /:\s*"[^"]*$/,
    ];
    
    for (const pattern of incompletePatterns) {
      if (pattern.test(fixed)) {
        fixed = fixed.replace(pattern, '');
        break;
      }
    }
    
    // Count and close brackets
    const openBraces = (fixed.match(/{/g) || []).length;
    const closeBraces = (fixed.match(/}/g) || []).length;
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/]/g) || []).length;
    
    const bracesToAdd = openBraces - closeBraces;
    const bracketsToAdd = openBrackets - closeBrackets;
    
    for (let i = 0; i < Math.min(bracesToAdd, bracketsToAdd); i++) {
      fixed += '}]';
    }
    for (let i = 0; i < Math.max(0, bracesToAdd - bracketsToAdd); i++) {
      fixed += '}';
    }
    for (let i = 0; i < Math.max(0, bracketsToAdd - bracesToAdd); i++) {
      fixed += ']';
    }
    
    return fixed;
  }

  /**
   * Parse large PDF by splitting into chunks and combining results
   */
  async parseUniversityPDFInChunks(pdfText: string): Promise<string> {
    const chunkSize = 6000;
    const chunks: string[] = [];
    
    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.substring(i, i + chunkSize));
    }
    
    const allResults: any[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const prompt = `Extract exam results to JSON. Format: [{"name":"DEPT","code":"XX","students":[{"registerNo":"XXX","courses":{"CODE":"GRADE"}}]}]
NO markdown. Skip incomplete records.

TEXT:
${chunks[i]}

JSON:`;

      try {
        // Use retry logic for each chunk
        const text = await this.retryWithBackoff(async () => {
          const result = await this.model!.generateContent(prompt);
          const response = await result.response;
          return response.text();
        });
        
        if (!text || text.trim().length === 0) {
          continue;
        }
        
        let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        if (!cleaned || cleaned === '[]') {
          continue;
        }
        
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (parseError) {
          cleaned = this.attemptFixIncompleteJSON(cleaned);
          try {
            parsed = JSON.parse(cleaned);
          } catch (repairError) {
            continue;
          }
        }
        
        if (Array.isArray(parsed)) {
          for (const dept of parsed) {
            const existing = allResults.find(d => d.code === dept.code || d.name === dept.name);
            if (existing) {
              existing.students = existing.students || [];
              existing.students.push(...(dept.students || []));
            } else {
              allResults.push(dept);
            }
          }
        }
      } catch (error) {
        // Continue with other chunks even if one fails
        continue;
      }
    }
    
    // Remove duplicate students within each department
    for (const dept of allResults) {
      if (dept.students) {
        const seen = new Set();
        dept.students = dept.students.filter((student: any) => {
          if (seen.has(student.registerNo)) {
            return false;
          }
          seen.add(student.registerNo);
          return true;
        });
      }
    }
    
    return JSON.stringify(allResults);
  }

  /**
   * Check if Gemini API is configured and accessible
   */
  async checkConnection(): Promise<boolean> {
    if (!this.model) {
      return false;
    }

    try {
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      return true;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Get available models by actually calling the API
   */
  async listModels(): Promise<string[]> {
    if (!genAI) {
      return [];
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name) || [];
      return models;
    } catch (error) {
      return [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro'
      ];
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
