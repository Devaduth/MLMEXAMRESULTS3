import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Results from "./Results";

// Define the ExtractedData interface
interface ExtractedData {
  [deptCode: string]: {
    name: string;
    code: string;
    courses: { [courseCode: string]: string };
    students: Array<{
      registerNo: string;
      name?: string | null;
      courses: { [courseCode: string]: string };
    }>;
  };
}

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/extract-pdf";

const callXaiApi = async (content: string): Promise<ExtractedData> => {
  try {
    console.log("Calling API at:", API_ENDPOINT); // Debug log
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Proxy response error:", response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Proxy response data:", data);
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response structure from xAI API");
    }
    const result = JSON.parse(data.choices[0].message.content);
    if (!result.departments) {
      throw new Error('xAI response missing "departments" key');
    }
    return result.departments;
  } catch (err) {
    console.error("callXaiApi error:", err);
    throw new Error(
      "Failed to process with xAI API: " + (err as Error).message
    );
  }
};
export default function PdfExtractor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const numPages = pdf.getPageCount();
      let allText = "";

      // Use local pdfjs-dist worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.mjs";
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        allText += pageText + "\n";
      }

      if (allText.trim().length < 100) {
        throw new Error(
          "PDF seems to be scanned or has minimal text. Consider OCR preprocessing."
        );
      }

      return allText;
    } catch (err) {
      console.error("Extraction error:", err);
      throw new Error(
        "Failed to extract text from PDF: " + (err as Error).message
      );
    } finally {
      if (pdfjsLib.GlobalWorkerOptions.workerPort) {
        pdfjsLib.GlobalWorkerOptions.workerPort.terminate();
      }
    }
  };

  const callXaiApi = async (content: string): Promise<ExtractedData> => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return result.departments;
    } catch (err) {
      throw new Error(
        "Failed to process with xAI API: " + (err as Error).message
      );
    }
  };

  const handleExtraction = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractedText = await extractTextFromPdf(selectedFile);
      const processedData = await callXaiApi(extractedText);
      setExtractedData(processedData);
      setShowResults(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveToFile = useCallback(() => {
    if (!extractedData) return;

    const fileContent = `export default ${JSON.stringify(
      extractedData,
      null,
      2
    )} as ExtractedData;`;
    const blob = new Blob([fileContent], { type: "text/typescript" });
    saveAs(blob, "ResultsData.ts");
  }, [extractedData]);

  const handleViewResults = useCallback(() => {
    setShowResults(true);
  }, []);

  return (
    <div className="pdf-extractor">
      <h2>PDF Data Extractor</h2>
      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button onClick={handleExtraction} disabled={!selectedFile || loading}>
          {loading ? "Processing..." : "Extract Data"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-message">Processing PDF, please wait...</div>
      )}

      {extractedData && (
        <div className="actions">
          <button onClick={handleViewResults} disabled={loading}>
            View Results
          </button>
          <button onClick={saveToFile} disabled={loading}>
            Save to File
          </button>
        </div>
      )}

      {showResults && extractedData && <Results data={extractedData} />}

      <style>{`
        .actions {
          margin: 20px 0;
          display: flex;
          gap: 10px;
        }
        .pdf-extractor {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .upload-section {
          margin: 20px 0;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .error-message {
          color: red;
          margin: 10px 0;
          padding: 10px;
          background-color: #ffebee;
          border-radius: 4px;
        }
        .loading-message {
          color: #2196f3;
          margin: 10px 0;
        }
        button {
          padding: 8px 16px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
