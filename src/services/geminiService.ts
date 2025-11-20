import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the Gemini API client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('🔑 Gemini API Key status:', API_KEY ? `Loaded (${API_KEY.substring(0, 10)}...)` : 'NOT FOUND');

if (!API_KEY) {
  console.error('⚠️ VITE_GEMINI_API_KEY not found in environment variables');
  console.error('💡 Make sure you have a .env file with VITE_GEMINI_API_KEY=your_key');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

class GeminiService {
  private model: GenerativeModel | null = null;

  constructor() {
    if (genAI) {
      // Try different model names - Gemini API model naming can vary
      const modelNames = [
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash', 
        'models/gemini-pro',
        'models/gemini-1.5-pro',
        'models/gemini-pro'
      ];
      
      // Try the first model name
      try {
        this.model = genAI.getGenerativeModel({
          model: 'models/gemini-flash-lite-latest',
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192, // Maximum for flash model
          },
        });
        console.log('✅ Gemini model initialized: gemini-1.5-flash-8b with 8192 max output tokens');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini model:', error);
      }
    } else {
      console.error('❌ Failed to initialize Gemini - API key missing');
    }
  }

  /**
   * Parse university results PDF using Gemini AI
   */
  async parseUniversityPDF(pdfText: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    // Check text length (gemini-1.5-pro supports ~1M tokens = ~4M characters)
    const maxChars = 3000000; // Conservative limit for Gemini 1.5 Pro
    if (pdfText.length > maxChars) {
      console.warn(`⚠️ PDF text is very long (${pdfText.length} chars). May exceed context window.`);
      console.warn('Consider splitting into smaller chunks or using a summary approach.');
    }

    try {
      const prompt = this.buildParsingPrompt(pdfText);
      
      console.log('📤 Sending PDF text to Gemini API...');
      console.log(`📊 Text length: ${pdfText.length} characters (~${Math.ceil(pdfText.length / 4)} tokens)`);
      console.log(`📝 Prompt length: ${prompt.length} characters`);
      console.log('🔍 First 500 chars of prompt:', prompt.substring(0, 500));
      console.log('🔍 Last 300 chars of PDF text:', pdfText.substring(pdfText.length - 300));
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      // Log the full response structure to debug
      console.log('📦 Raw response object:', {
        candidates: response.candidates?.length || 0,
        text: response.text ? 'Available' : 'Missing',
        promptFeedback: response.promptFeedback,
        finishReason: response.candidates?.[0]?.finishReason,
      });
      
      // Check for safety blocks
      if (response.promptFeedback?.blockReason) {
        console.error('❌ Response was blocked:', response.promptFeedback.blockReason);
        throw new Error(`Content was blocked by Gemini: ${response.promptFeedback.blockReason}`);
      }
      
      // Check if response was truncated
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason === 'MAX_TOKENS' || finishReason === 'STOP') {
        console.warn('⚠️ Response finish reason:', finishReason);
        if (finishReason === 'MAX_TOKENS') {
          console.warn('⚠️ Response was truncated due to token limit. Attempting to handle incomplete JSON...');
        }
      }
      
      const text = response.text();

      console.log('✅ Received response from Gemini API');
      console.log('Response length:', text.length, 'characters');
      
      if (!text || text.trim().length === 0) {
        console.error('❌ Gemini returned empty response');
        console.error('Response object:', response);
        throw new Error('Gemini returned an empty response. This might be due to content filtering or API limits.');
      }
      
      console.log('First 500 characters of response:', text.substring(0, 500));
      
      return text;
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        status: error.status,
        statusText: error.statusText,
      });
      
      if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
        throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in .env file');
      } else if (error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429) {
        throw new Error('Gemini API quota exceeded. Please try again later or check your quota at https://aistudio.google.com/');
      } else if (error.message?.includes('INVALID_ARGUMENT') || error.status === 400) {
        throw new Error('Invalid request format. The PDF might be too corrupted to parse');
      } else if (error.message?.includes('PERMISSION_DENIED') || error.status === 403) {
        throw new Error('API key does not have permission. Check API key restrictions in Google AI Studio');
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        throw new Error('Network error: Cannot connect to Gemini API. Check your internet connection or firewall settings');
      }
      
      throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
    }
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
    
    console.log('🔧 Starting JSON repair...');
    
    // Remove incomplete property/value at the end
    const incompletePatterns = [
      /,\s*"[^"]*":\s*"[^"]*$/,  // Incomplete string value
      /,\s*"[^"]*":\s*$/,         // Property with no value
      /,\s*"[^"]*$/,              // Incomplete property name
      /:\s*"[^"]*$/,              // Incomplete value after colon
    ];
    
    for (const pattern of incompletePatterns) {
      if (pattern.test(fixed)) {
        fixed = fixed.replace(pattern, '');
        console.log(`🔧 Removed incomplete pattern`);
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
    
    console.log(`✅ Added ${bracesToAdd} braces and ${bracketsToAdd} brackets`);
    
    return fixed;
  }

  /**
   * Parse large PDF by splitting into chunks and combining results
   */
  async parseUniversityPDFInChunks(pdfText: string): Promise<string> {
    // Split by department sections (look for department headers)
    const chunkSize = 10000; // Reduced to 10K chars per chunk for better completion rate
    const chunks: string[] = [];
    
    console.log(`📦 Splitting PDF into chunks (${pdfText.length} chars total)`);
    
    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.substring(i, i + chunkSize));
    }
    
    console.log(`📦 Created ${chunks.length} chunks`);
    
    const allResults: any[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`🔄 Processing chunk ${i + 1}/${chunks.length}...`);
      
      const prompt = `Extract exam results to JSON. Format: [{"name":"DEPT","code":"XX","students":[{"registerNo":"XXX","courses":{"CODE":"GRADE"}}]}]
NO markdown. Skip incomplete records.

TEXT:
${chunks[i]}

JSON:`;

      try {
        const result = await this.model!.generateContent(prompt);
        const response = await result.response;
        
        // Log response details
        const finishReason = response.candidates?.[0]?.finishReason;
        const safetyRatings = response.candidates?.[0]?.safetyRatings;
        
        console.log(`📦 Chunk ${i + 1} response details:`, {
          finishReason,
          hasText: !!response.text,
          promptFeedback: response.promptFeedback,
          blocked: response.promptFeedback?.blockReason
        });
        
        const text = response.text();
        
        console.log(`✅ Chunk ${i + 1} response: ${text.length} chars`);
        console.log(`📝 First 200 chars:`, text.substring(0, 200));
        
        if (!text || text.trim().length === 0) {
          console.warn(`⚠️ Chunk ${i + 1} returned empty response, skipping...`);
          continue;
        }
        
        // Parse and merge
        let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        if (!cleaned || cleaned === '[]') {
          console.warn(`⚠️ Chunk ${i + 1} returned empty array, skipping...`);
          continue;
        }
        
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch (parseError) {
          // If truncated (MAX_TOKENS), try to repair
          if (finishReason === 'MAX_TOKENS') {
            console.warn(`⚠️ Chunk ${i + 1} truncated, attempting repair...`);
            // Import and use repair function
            cleaned = this.attemptFixIncompleteJSON(cleaned);
            try {
              parsed = JSON.parse(cleaned);
              console.log(`✅ Successfully repaired chunk ${i + 1}`);
            } catch (repairError) {
              console.error(`❌ Repair failed for chunk ${i + 1}:`, repairError);
              continue;
            }
          } else {
            throw parseError;
          }
        }
        
        if (Array.isArray(parsed)) {
          console.log(`📦 Chunk ${i + 1} added ${parsed.length} departments`);
          allResults.push(...parsed);
        }
      } catch (error) {
        console.error(`❌ Error processing chunk ${i + 1}:`, error);
        // Continue with other chunks
      }
    }
    
    console.log(`✅ Merged ${allResults.length} departments from ${chunks.length} chunks`);
    
    return JSON.stringify(allResults);
  }

  /**
   * Check if Gemini API is configured and accessible
   */
  async checkConnection(): Promise<boolean> {
    if (!this.model) {
      console.error('❌ Model not initialized - API key missing');
      return false;
    }

    try {
      console.log('🔍 Testing Gemini API connection...');
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      console.log('✅ Connection test successful, response:', text.substring(0, 50));
      return true;
    } catch (error: any) {
      console.error('❌ Gemini connection check failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
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
      console.log('📋 Fetching available models from Gemini API...');
      
      // Try to call the listModels API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      
      if (!response.ok) {
        console.error('Failed to fetch models:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name) || [];
      console.log('✅ Available models:', models);
      return models;
    } catch (error) {
      console.error('Error listing models:', error);
      // Return common model names as fallback
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
