# 🎓 University Results Dashboard with AI-Powered PDF Parsing

A modern, intelligent React application that automatically parses university examination results PDFs using **Google Gemini AI** and displays interactive analytics dashboards.

---

## ✨ Features

### 🤖 AI-Powered PDF Parsing
- **Google Gemini 1.5 Flash** integration for intelligent document processing
- Handles large PDFs (up to 50MB, 100+ pages)
- Automatic extraction of departments, courses, students, and grades
- Processes 29-page documents in 60-90 seconds

### 📊 Interactive Dashboard
- Real-time filtering by department and course
- Search students by name or register number
- Grade distribution analytics
- Pass/Fail/Absent/Withheld statistics
- Export to Excel, CSV, and PDF

### 🎨 Modern UI/UX
- Beautiful gradient design with Tailwind CSS
- Drag-and-drop PDF upload
- Real-time progress indicators
- Responsive layout for all devices
- Dark mode friendly

### 💾 Data Persistence
- LocalStorage integration (survives page refresh)
- No backend required - fully client-side
- Clear data option for privacy

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Google Account for Gemini API key

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MLMEXAMRESULTS3

# Install dependencies
npm install
```

### 3. Get Gemini API Key

1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

### 4. Configure Environment

Create/edit `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=AIzaSyD...your_actual_key_here
```

> **Important**: Never commit your `.env` file! It's already in `.gitignore`.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage Guide

### Step 1: Welcome Screen
On first load, you'll see the **Welcome Screen** with upload options.

### Step 2: Upload PDF
- **Drag & Drop**: Drag your PDF onto the upload area
- **Click to Browse**: Click "Select PDF File" button

### Step 3: Processing
- Watch real-time progress (0-100%)
- See processing stages:
  - Reading PDF file (20%)
  - Analyzing with Gemini AI (80%)
  - Validating data (90%)
  - Complete (100%)

### Step 4: View Dashboard
- Browse departments and courses
- Filter and search students
- View analytics and statistics
- Export data in multiple formats

### Step 5: Upload New PDF (Optional)
- Click **"Upload New PDF"** in header
- Previous data is cleared automatically

---

## 🏗️ Project Structure

```
MLMEXAMRESULTS3/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Header with upload button
│   │   ├── Result.tsx            # Main dashboard component
│   │   ├── WelcomeScreen.tsx     # Initial upload screen
│   │   ├── Footer.tsx            # Footer component
│   │   └── GradeLegend.tsx       # Grade legend display
│   ├── context/
│   │   └── ResultsContext.tsx    # Global state management
│   ├── services/
│   │   ├── geminiService.ts      # Gemini API client
│   │   └── pdfParser.ts          # PDF parsing logic
│   ├── data/
│   │   └── ResultsData.ts        # (Legacy) Static data
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── public/
│   └── images/                   # Static assets
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example env file
├── package.json                  # Dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── GEMINI_SETUP_GUIDE.md         # Detailed setup guide
└── README.md                     # This file
```

---

## 🔧 Technical Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite 7.2** - Build tool
- **Tailwind CSS** - Styling

### AI & Parsing
- **Google Gemini 1.5 Flash** - AI document parsing
- **pdfjs-dist** - PDF text extraction
- **@google/generative-ai** - Gemini SDK

### Data & State
- **Context API** - Global state management
- **LocalStorage** - Client-side persistence

### Export Libraries
- **jsPDF** - PDF generation
- **xlsx** - Excel export

---

## 📊 Data Structure

The AI extracts data in the following format:

```typescript
{
  departments: [
    {
      name: "B.Tech Computer Science",
      courses: [
        {
          name: "Semester 1",
          students: [
            {
              registerNumber: "CS001",
              name: "John Doe",
              subjects: [
                {
                  code: "CS101",
                  name: "Programming",
                  grade: "A"
                }
              ],
              status: "PASS",
              cgpa: "8.5"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🔐 Security & Privacy

### Data Handling
✅ **Client-Side Processing**: PDFs are parsed in your browser  
✅ **Encrypted API Calls**: All Gemini API requests use HTTPS  
✅ **No Server Storage**: No data stored on external servers  
✅ **LocalStorage Only**: Data saved locally in your browser  

### API Key Safety
⚠️ **Never commit** `.env` to version control  
⚠️ **Never share** your API key publicly  
⚠️ **Rotate key** if exposed  

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

### Supported PDF Formats
- ✅ University examination results
- ✅ Student grade sheets
- ✅ Department-wise summaries
- ✅ Digital PDFs (not scanned images)
- ✅ Max file size: 50MB
- ✅ Max pages: 100+

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Gemini API key not configured"
**Solution**: Add your API key to `.env` and restart dev server:
```bash
# Stop server (Ctrl+C)
# Add key to .env
npm run dev
```

#### 2. "API_KEY_INVALID"
**Solution**: Regenerate key at [Google AI Studio](https://aistudio.google.com/app/apikey)

#### 3. "Failed to extract text from PDF"
**Possible causes**:
- PDF is password-protected
- PDF is corrupted
- PDF is image-based (scanned document)

**Solution**: Use a digital PDF with selectable text

#### 4. Slow Processing
**Normal**: Large PDFs (29+ pages) take 60-120 seconds  
**Check**: Internet connection speed  
**Verify**: PDF size is under 50MB  

#### 5. TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
npm run dev
```

---

## 📈 Performance

### Processing Times
| PDF Size | Pages | Processing Time |
|----------|-------|-----------------|
| Small | 1-10 | 15-30 seconds |
| Medium | 11-20 | 30-60 seconds |
| Large | 21-50 | 60-120 seconds |

### Token Usage (Gemini Free Tier)
- **Daily Limit**: 2 million tokens
- **29-page PDF**: ~60K tokens (3% of limit)
- **Daily Capacity**: ~40-50 large PDFs

### Browser Requirements
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Adding New Features

1. **New Component**: Add to `src/components/`
2. **New Service**: Add to `src/services/`
3. **State Management**: Use `ResultsContext`
4. **Styling**: Use Tailwind CSS classes

---

## 🔄 Version History

### v2.0.0 (Current) - Gemini AI Integration
- ✅ Replaced Ollama with Google Gemini 1.5 Flash
- ✅ Added WelcomeScreen component
- ✅ Implemented context-based architecture
- ✅ Added drag-and-drop upload
- ✅ LocalStorage persistence
- ✅ Real-time progress tracking

### v1.0.0 - Initial Release
- ✅ Static data display
- ✅ Department/course filtering
- ✅ Export to Excel/CSV/PDF
- ✅ Grade analytics

---

## 📚 Documentation

- **[Setup Guide](./GEMINI_SETUP_GUIDE.md)** - Detailed setup instructions
- **[API Documentation](https://ai.google.dev/docs)** - Google Gemini docs
- **[PDF.js Guide](https://mozilla.github.io/pdf.js/)** - PDF parsing library

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

### Get Help
- **Documentation**: Check `GEMINI_SETUP_GUIDE.md`
- **Browser Console**: Press F12 to see detailed logs
- **Issues**: Open a GitHub issue

### Resources
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎉 Acknowledgments

- **Google Gemini AI** - Intelligent document parsing
- **PDF.js** - Mozilla's PDF rendering library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon set

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**

---

## 📞 Contact

For questions or support, please open an issue on GitHub.

**Happy analyzing! 🚀**
