const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');

dotenv.config();

const app = express();

// Validate environment variables
if (!process.env.XAI_API_KEY) {
  console.error('Error: XAI_API_KEY is not set in .env');
  process.exit(1);
}

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

    console.log('Making request to xAI API...');
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{
          role: 'user',
          content: `Extract structured exam results from this content. Return the data in exactly this JSON format: ${JSON.stringify(exampleFormat, null, 2)}. Each department should have its code, name, courses (with course codes and names), and student results (with register numbers and grades). Content to process: ${content}`
        }],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('xAI API Error:', response.status, errorText);
      // Handle specific error cases
      if (response.status === 403) {
        return res.status(503).json({
          error: 'Service Temporarily Unavailable',
          details: 'API credits exhausted. Please contact administrator to recharge credits.'
        });
      }
      return res.status(500).json({ 
        error: 'xAI API request failed', 
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('xAI API Response structure:', Object.keys(data));

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', data);
      return res.status(500).json({ 
        error: 'Invalid response from xAI API',
        details: 'Response missing required fields'
      });
    }

    // Try to parse the response content as JSON
    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      if (!parsedContent.departments) {
        throw new Error('Response missing departments structure');
      }
      return res.json(data);
    } catch (parseError) {
      console.error('Failed to parse xAI response:', parseError);
      return res.status(500).json({
        error: 'Invalid JSON in xAI response',
        details: parseError.message
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