const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in .env');
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Basic security middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Proxy endpoint for xAI API
app.post('/api/extract-pdf', async (req, res) => {
  console.log('Received PDF extraction request');
  
  try {
    const { content } = req.body;
    
    if (!content) {
      console.error('No content provided');
      return res.status(400).json({ error: 'PDF content is required' });
    }

    // Validate input size
    if (content.length > 100000) {
      console.error('Content too large:', content.length);
      return res.status(400).json({ error: 'Input content exceeds size limit (100k chars)' });
    }

    const exampleFormat = {
      departments: {
        "CE": {
          "name": "Civil Engineering",
          "code": "CE",
          "courses": {
            "COURSE101": "Course Name Example"
          },
          "students": [
            {
              "registerNo": "MLM24CE001",
              "name": "Student Name",
              "courses": {
                "COURSE101": "A"
              }
            }
          ]
        }
      }
    };

    console.log('Making request to OpenAI API...');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{
          role: "system",
          content: "You are a precise data extraction assistant. Extract exam results into the exact JSON format provided. Return only valid JSON, no other text."
        }, {
          role: "user",
          content: `Extract structured exam results from this content. Return the data in exactly this JSON format: ${JSON.stringify(exampleFormat, null, 2)}. Each department should have its code, name, courses (with course codes and names), and student results (with register numbers and grades). Content to process: ${content}`
        }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response structure');
      }

      const parsedContent = JSON.parse(completion.choices[0].message.content);
      if (!parsedContent.departments) {
        throw new Error('Response missing departments structure');
      }
      
      return res.json({
        choices: [{
          message: {
            content: completion.choices[0].message.content
          }
        }]
      });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return res.status(500).json({
        error: 'OpenAI API request failed',
        details: error.message
      });
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = require('net');
  
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => resolve(true));
      })
      .on('error', () => {
        resolve(false);
      });
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is in use, trying next port...`);
    port++;
  }
  return port;
};

// Start server with port finding
const startServer = async () => {
  try {
    const port = await findAvailablePort(process.env.PORT || 3000);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();