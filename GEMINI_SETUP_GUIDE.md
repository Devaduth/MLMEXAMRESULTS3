# 🚀 Gemini AI Integration - Quick Start Guide

## Overview
This application uses **Google Gemini 1.5 Flash** to parse university examination results PDFs and extract structured data automatically.

---

## 🎯 Why Gemini?

✅ **Large Context Window**: 1 million tokens (handles 29+ page PDFs easily)  
✅ **Fast Processing**: 60-90 seconds for large documents  
✅ **High Accuracy**: Advanced AI parsing for complex table structures  
✅ **Free Tier**: 2 million tokens per day (plenty for multiple PDFs)  
✅ **No Chunking Required**: Entire PDF processed in one request  

---

## 📋 Prerequisites

1. **Node.js** installed (v18 or later recommended)
2. **Google Account** to access Google AI Studio
3. **PDF Files** with university results (supports up to 50MB)

---

## 🔑 Step 1: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key (starts with `AI...`)

> **Note**: The free tier provides 2 million tokens per day, which is sufficient for processing multiple large PDFs.

---

## ⚙️ Step 2: Configure Environment

1. Open the `.env` file in your project root
2. Replace `your_api_key_here` with your actual API key:

```env
VITE_GEMINI_API_KEY=AIzaSyD...your_actual_key
```

3. Save the file

> **Important**: Never commit your `.env` file to version control! It's already in `.gitignore`.

---

## 🏃 Step 3: Install Dependencies

Run the following command in your terminal:

```bash
npm install
```

This will install all required packages, including:
- `@google/generative-ai` - Gemini SDK
- `pdfjs-dist` - PDF parsing library
- All other React dependencies

---

## 🎬 Step 4: Start the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📤 Step 5: Upload Your PDF

### Welcome Screen
When you first open the app, you'll see the **Welcome Screen** with an upload interface.

### Upload Methods
1. **Drag & Drop**: Drag your PDF onto the upload area
2. **Click to Browse**: Click "Select PDF File" to choose from your computer

### Supported PDFs
- ✅ University examination results
- ✅ Student grade sheets
- ✅ Department-wise result summaries
- ✅ Files up to 50MB
- ✅ Documents with 1-100+ pages

### Processing Time
- **Small PDFs (1-10 pages)**: 15-30 seconds
- **Medium PDFs (11-20 pages)**: 30-60 seconds
- **Large PDFs (21-50 pages)**: 60-120 seconds

---

## 📊 What Gets Extracted

The AI automatically extracts:

### Department Information
- Department names (e.g., "B.Tech Computer Science", "MBA")

### Course/Semester Details
- Course names and semester information

### Student Records
- Register numbers
- Student names
- Subject codes and names
- Grades (S/A/B/C/D/E/F or marks)
- Overall status (PASS/FAIL/ABSENT/WITHHELD)
- CGPA (if available)

---

## 🔍 Dashboard Features

After successful upload, you'll see:

### Analytics
- Total students processed
- Pass/Fail statistics
- Department-wise breakdown
- Grade distribution charts

### Filters
- Filter by department
- Filter by course/semester
- Search by student name or register number
- Filter by status (Pass/Fail/Absent/Withheld)

### Export Options
- Export to Excel
- Export to CSV
- Print reports

---

## ⚠️ Troubleshooting

### Error: "Gemini API key not configured"
**Solution**: Make sure you've added your API key to the `.env` file and restarted the dev server.

### Error: "API_KEY_INVALID"
**Solution**: Double-check that you copied the complete API key from Google AI Studio. It should start with `AIzaSy`.

### Error: "RESOURCE_EXHAUSTED"
**Solution**: You've exceeded the free tier quota. Wait 24 hours or upgrade your plan at Google AI Studio.

### Error: "Failed to extract text from PDF"
**Solution**: 
- Ensure the PDF is not password-protected
- Check that the file is not corrupted
- Try a different PDF file

### Slow Processing
**Solution**:
- Large PDFs (29+ pages) can take 60-120 seconds - this is normal
- Check your internet connection
- Verify the PDF file size is under 50MB

### No Data Displayed
**Solution**:
- Check browser console for error messages (F12)
- Ensure the PDF contains structured table data
- Try a different PDF format

---

## 🔐 Security & Privacy

### Data Handling
- PDFs are parsed in your browser (client-side text extraction)
- Only text content is sent to Google Gemini API
- No data is stored on our servers
- API calls are encrypted with HTTPS

### API Key Safety
- Store your API key in `.env` file only
- Never share your API key publicly
- Never commit `.env` to version control
- Rotate your key if exposed

### Local Storage
- Parsed results are saved in browser's localStorage
- Data persists between page refreshes
- Clear data anytime using the "Clear Data" button
- No server-side database required

---

## 🆘 Getting Help

### Check Logs
Open browser console (F12) to see detailed logs:
- PDF extraction progress
- API request details
- Parsing statistics
- Error messages

### Common Issues
1. **API Key not working**: Regenerate key in Google AI Studio
2. **PDF not parsing**: Check PDF format and file integrity
3. **Slow performance**: Normal for large PDFs (29+ pages)

### Need More Help?
- Check the [Google AI Studio Documentation](https://ai.google.dev/docs)
- Review the browser console for detailed error messages
- Verify all dependencies are installed: `npm install`

---

## 📈 Performance Tips

### For Best Results
1. **PDF Quality**: Use high-quality, digital PDFs (not scanned images)
2. **File Size**: Keep files under 20MB for faster processing
3. **Format**: Structured tables work best
4. **Internet**: Stable connection required during upload

### Optimization
- Close unnecessary browser tabs during upload
- Use the latest version of Chrome, Firefox, or Edge
- Ensure sufficient RAM available (500MB+)

---

## 🎉 Success!

Once your PDF is uploaded and processed:
1. Dashboard displays automatically
2. All filters and search features are available
3. Data is saved in localStorage (persists on refresh)
4. Export options are ready to use

You can now:
- ✅ Filter results by department/course
- ✅ Search for specific students
- ✅ View grade distributions
- ✅ Export data to Excel/CSV
- ✅ Generate reports

---

## 🔄 Updating Data

To upload a new PDF:
1. Click the **"Upload New PDF"** button in the header
2. Existing data will be replaced
3. New data will be processed and displayed
4. Previous data is automatically cleared

---

## 📝 Notes

- **Free Tier Limits**: 2M tokens/day = ~40-50 large PDFs
- **Token Usage**: 29-page PDF ≈ 60K tokens (3% of daily limit)
- **Processing Model**: Gemini 1.5 Flash (optimized for speed)
- **Data Persistence**: LocalStorage (survives page refresh)
- **Browser Support**: Chrome, Firefox, Edge, Safari (latest versions)

---

**Ready to get started?** 🚀

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add it to `.env`
3. Run `npm run dev`
4. Upload your PDF!

---

**Have questions?** Check the troubleshooting section above or review the browser console logs.
