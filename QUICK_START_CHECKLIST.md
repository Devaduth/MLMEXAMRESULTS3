# ✅ Quick Start Checklist

Follow these steps to get your application running:

---

## 🔲 Step 1: Get Gemini API Key

- [ ] Go to https://aistudio.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the key (starts with `AIzaSy...`)

---

## 🔲 Step 2: Configure Environment

- [ ] Open `.env` file in project root
- [ ] Replace `your_api_key_here` with your actual API key
- [ ] Save the file

Example:
```env
VITE_GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔲 Step 3: Install Dependencies

- [ ] Open terminal in project directory
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

---

## 🔲 Step 4: Start Development Server

- [ ] Run: `npm run dev`
- [ ] Wait for server to start
- [ ] Open browser at http://localhost:5173

---

## 🔲 Step 5: Upload Your PDF

- [ ] Drag PDF onto upload area OR click "Select PDF File"
- [ ] Wait for processing (60-90 seconds for large PDFs)
- [ ] View dashboard with parsed results

---

## ✨ You're Ready!

Your application should now be running. If you encounter any issues:

1. Check browser console (F12) for error messages
2. Verify API key is correctly added to `.env`
3. Ensure internet connection is stable
4. Review `GEMINI_SETUP_GUIDE.md` for troubleshooting

---

## 🚀 Next Steps

- [ ] Upload your university results PDF
- [ ] Explore filtering and search features
- [ ] Try exporting data to Excel/CSV
- [ ] Upload additional PDFs to test

---

## 📊 Expected Behavior

### ✅ Success Indicators
- Welcome screen appears on first load
- Upload progress shows 0-100%
- Dashboard displays after upload completes
- All departments and courses are visible
- Filters and search work correctly

### ❌ Common Issues
- **"API key not configured"**: Check `.env` file
- **"API_KEY_INVALID"**: Regenerate key in Google AI Studio
- **Slow processing**: Normal for large PDFs (29+ pages)
- **TypeScript errors**: Run `npm install` again

---

**Need help?** Check `GEMINI_SETUP_GUIDE.md` for detailed instructions!
