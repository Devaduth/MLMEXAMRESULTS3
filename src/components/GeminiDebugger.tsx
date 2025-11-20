import { useState } from 'react';
import { geminiService } from '../services/geminiService';

/**
 * Debug component to test Gemini API connection
 * TEMPORARY - Remove after debugging
 */
export function GeminiDebugger() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<string[]>([]);

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing Gemini API connection...');
    setDetails([]);

    try {
      console.log('🧪 Starting connection test...');
      const isConnected = await geminiService.checkConnection();
      
      if (isConnected) {
        setStatus('success');
        setMessage('✅ Gemini API is working! Connection successful.');
      } else {
        setStatus('error');
        setMessage('❌ Connection failed. Check console for details.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Error: ${error.message || 'Unknown error'}`);
      console.error('Connection test error:', error);
    }
  };

  const listAvailableModels = async () => {
    setStatus('testing');
    setMessage('Fetching available models...');
    setDetails([]);

    try {
      const models = await geminiService.listModels();
      setStatus('success');
      setMessage(`✅ Found ${models.length} models`);
      setDetails(models.map(m => `📦 ${m}`));
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Error: ${error.message || 'Unknown error'}`);
      console.error('List models error:', error);
    }
  };

  const checkApiKey = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const detailsArr: string[] = [];
    
    detailsArr.push(`Environment: ${import.meta.env.MODE}`);
    
    if (apiKey) {
      setStatus('success');
      setMessage(`✅ API Key found: ${apiKey.substring(0, 10)}...`);
      detailsArr.push(`Key length: ${apiKey.length} chars`);
      detailsArr.push(`Starts with: ${apiKey.substring(0, 7)}`);
      
      // Check if it looks valid
      if (apiKey.startsWith('AIzaSy')) {
        detailsArr.push('✅ Format looks correct');
      } else {
        detailsArr.push('⚠️ Key format might be incorrect');
      }
    } else {
      setStatus('error');
      setMessage('❌ API Key not found in environment variables');
      detailsArr.push('💡 Make sure dev server is restarted');
      detailsArr.push('💡 Check .env file exists in project root');
    }
    
    setDetails(detailsArr);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="text-sm font-bold text-gray-800 mb-2">🔧 Gemini Debug Panel</h3>
      
      <div className="space-y-2 mb-3">
        <button
          onClick={checkApiKey}
          className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Check API Key
        </button>
        
        <button
          onClick={listAvailableModels}
          disabled={status === 'testing'}
          className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          {status === 'testing' ? 'Loading...' : 'List Available Models'}
        </button>
        
        <button
          onClick={testConnection}
          disabled={status === 'testing'}
          className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {message && (
        <div className={`p-2 rounded text-sm ${
          status === 'success' ? 'bg-green-50 text-green-800' :
          status === 'error' ? 'bg-red-50 text-red-800' :
          'bg-gray-50 text-gray-800'
        }`}>
          {message}
        </div>
      )}

      {details.length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 space-y-1">
          {details.map((detail, idx) => (
            <div key={idx}>{detail}</div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Remove this component after debugging
      </p>
    </div>
  );
}
