# 🐛 Debugging Guide - PDF Upload Issue

## Issue: After uploading PDF, the page stays on WelcomeScreen instead of showing Result.tsx

---

## 🔍 Step-by-Step Debugging Process

### Step 1: Restart Dev Server (IMPORTANT!)
The `.env` file changes require a server restart:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

**Why?** Vite only loads environment variables on startup. Any changes to `.env` require a restart.

---

### Step 2: Open Browser Console
1. Open your browser (Chrome/Firefox/Edge)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Clear any old logs (🚫 Clear console button)

---

### Step 3: Upload a Test PDF

Upload your PDF and watch the console logs. You should see:

#### ✅ Expected Logs (Success):
```
🔑 Gemini API Key status: Loaded (AIzaSyDO02...)
📤 Starting PDF upload: filename.pdf (2.45MB)
📄 Reading PDF file...
📖 PDF loaded: 29 pages
📊 Progress: 20% - Extracted text from filename.pdf
📤 Sending PDF text to Gemini API...
📊 Text length: 45000 characters (~11250 tokens)
✅ Received response from Gemini API
📊 Progress: 80% - Processing results...
✅ Parsing complete, received results: {departments: Array(4)}
💾 Saved to localStorage
✅ PDF uploaded and parsed successfully
📊 Data state updated, hasPDFData should now be true
🏁 Upload process finished, isLoading set to false
📊 Context state changed: {hasPDFData: true, hasData: true, ...}
📊 Rendering Dashboard (has PDF data)
```

#### ❌ Common Error Patterns:

**Pattern 1: API Key Not Found**
```
⚠️ VITE_GEMINI_API_KEY not found in environment variables
💡 Make sure you have a .env file with VITE_GEMINI_API_KEY=your_key
❌ PDF upload error: Gemini API key not configured
```
**Solution:** Restart dev server after adding API key to `.env`

**Pattern 2: API Key Invalid**
```
❌ Gemini API Error: API_KEY_INVALID
```
**Solution:** Get a new API key from https://aistudio.google.com/app/apikey

**Pattern 3: PDF Extraction Failed**
```
❌ PDF extraction error: Failed to load PDF
```
**Solution:** Check if PDF is corrupted or password-protected

**Pattern 4: JSON Parsing Error**
```
❌ JSON parsing error: Unexpected token
Response: <html>...
```
**Solution:** Gemini returned HTML instead of JSON (API issue - retry)

**Pattern 5: No Response from Gemini**
```
📤 Sending PDF text to Gemini API...
[long pause]
❌ Network error: timeout
```
**Solution:** Check internet connection, Gemini API might be down

---

### Step 4: Check Network Tab

1. In DevTools, go to **Network** tab
2. Filter by **Fetch/XHR**
3. Upload PDF again
4. Look for requests to `generativelanguage.googleapis.com`

#### ✅ Successful Request:
- Status: **200 OK**
- Response contains JSON with student data

#### ❌ Failed Request:
- Status: **400** = Bad request (check API key)
- Status: **401** = Unauthorized (invalid API key)
- Status: **403** = Forbidden (API key doesn't have access)
- Status: **429** = Too many requests (quota exceeded)
- Status: **500** = Server error (Gemini API issue - retry)

---

### Step 5: Check Application Tab

1. In DevTools, go to **Application** tab
2. Expand **Local Storage**
3. Click on `http://localhost:5173`
4. Look for key: `university_results_data`

#### ✅ After Successful Upload:
You should see a large JSON value with:
```json
{
  "departments": [
    {
      "name": "B.Tech Computer Science",
      "courses": [...],
      ...
    }
  ]
}
```

#### ❌ If Missing:
- Data wasn't saved (upload failed)
- Check console for errors

---

### Step 6: Check React State

In the console logs, look for:
```
📊 Context state changed: {
  hasPDFData: true,    ← Should be TRUE after upload
  hasData: true,       ← Should be TRUE
  isLoading: false,    ← Should be FALSE after complete
  error: null          ← Should be NULL on success
}
```

If `hasPDFData` stays **false**:
- Data wasn't set in context
- Upload threw an error
- Check previous error logs

---

## 🔧 Quick Fixes

### Fix 1: Clear Everything and Retry
```bash
# In browser console:
localStorage.clear()

# Refresh page (Ctrl+R)
# Try upload again
```

### Fix 2: Verify .env File
```bash
# Make sure .env exists in project root
# Should contain:
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key

# NOT like this (wrong):
GEMINI_API_KEY=...          # Missing VITE_ prefix
VITE_GEMINI_API_KEY=        # Empty value
VITE_GEMINI_API_KEY="..."   # Quotes not needed
```

### Fix 3: Test API Key Manually
```javascript
// Paste in browser console:
console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY);

// Should show: AIzaSy...
// If shows: undefined → Server needs restart
```

### Fix 4: Check PDF File
```javascript
// Test PDF size:
// Max allowed: 50MB
// Your PDF should be under this
```

---

## 🎯 Most Likely Issues

### 1. Server Not Restarted ⭐ (Most Common)
**Symptoms:**
- API key shows as "NOT FOUND" in console
- Error: "Gemini API key not configured"

**Fix:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Invalid API Key
**Symptoms:**
- Error: "API_KEY_INVALID"
- 401 Unauthorized in Network tab

**Fix:**
- Go to https://aistudio.google.com/app/apikey
- Create new API key
- Update `.env` file
- Restart server

### 3. Internet Connection
**Symptoms:**
- Request timeout
- Network error in console
- No requests in Network tab

**Fix:**
- Check internet connection
- Try ping google.com
- Check firewall settings

### 4. PDF Format Issue
**Symptoms:**
- Error: "Failed to extract text"
- PDF loaded: 0 pages

**Fix:**
- Use a different PDF
- Ensure PDF has selectable text (not scanned image)
- Check PDF isn't password-protected

---

## 📝 What to Report

If issue persists, provide these logs:

1. **Full console output** from upload attempt
2. **Network tab** screenshot showing API request
3. **Application > LocalStorage** screenshot
4. **Your .env file** (hide the actual API key, just show format):
   ```
   VITE_GEMINI_API_KEY=AIzaSy***********
   ```

---

## 🚀 Testing Checklist

- [ ] Dev server restarted after adding API key
- [ ] Browser console open and cleared
- [ ] PDF file is under 50MB
- [ ] Internet connection is stable
- [ ] API key is valid (test at Google AI Studio)
- [ ] No browser extensions blocking requests
- [ ] Tried in incognito mode (to rule out cache issues)

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Console shows: "✅ PDF uploaded and parsed successfully"
2. ✅ Console shows: "📊 Rendering Dashboard (has PDF data)"
3. ✅ Page automatically switches to Result.tsx
4. ✅ You see the full dashboard with departments and students
5. ✅ LocalStorage has `university_results_data` key

---

**Next Step:** Follow the checklist above and share the console logs!
