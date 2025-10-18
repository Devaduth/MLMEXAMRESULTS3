# PDF Upload and AI Processing Setup

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Getting OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Important: OpenAI Billing Setup

**You must add billing information to use the API:**

1. Go to [OpenAI Billing](https://platform.openai.com/account/billing)
2. Add a payment method (credit card)
3. Set up usage limits if desired
4. The API requires paid credits to function

**Common Issues:**
- **429 Error (Quota Exceeded)**: You've hit your usage limit or haven't added billing
- **401 Error (Unauthorized)**: Invalid API key
- **Rate Limits**: Too many requests in a short time

## Features

- **PDF Upload**: Drag & drop or file picker for PDF files
- **AI Processing**: Uses OpenAI GPT-4 to extract and structure exam results
- **Dynamic Results**: Results are displayed based on extracted data
- **Re-upload**: Easy re-upload functionality without page refresh
- **Error Handling**: Comprehensive error handling for various scenarios

## How It Works

1. User uploads a PDF file containing exam results
2. The app extracts text from the PDF using pdf-parse
3. AI analyzes the text and structures it into the required JSON format
4. Results are displayed using the existing Result component
5. Users can re-upload different PDFs as needed

## Security Note

The current implementation uses the OpenAI API directly from the browser. For production use, consider:
- Moving the AI processing to a backend server
- Implementing proper API key management
- Adding rate limiting and usage monitoring
