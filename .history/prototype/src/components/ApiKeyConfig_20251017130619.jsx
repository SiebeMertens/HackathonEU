import React, { useState } from 'react';
import { Key, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const ApiKeyConfig = ({ currentKey, onSave, onClose }) => {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Test' }] }]
          })
        }
      );

      if (response.ok) {
        setTestResult({ success: true, message: 'API key is valid!' });
      } else {
        const error = await response.json();
        setTestResult({ 
          success: false, 
          message: error.error?.message || 'Invalid API key' 
        });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Failed to test API key. Check your connection.' 
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(apiKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Configure AI Questions</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-slate-300 text-sm mb-4">
              Enable AI-generated questions using Google's Gemini API. Get your free API key from Google AI Studio.
            </p>
            
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-4"
            >
              Get API Key from Google AI Studio
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Google AI Studio API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-500/10 border border-green-500/50' 
                : 'bg-red-500/10 border border-red-500/50'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${testResult.success ? 'text-green-300' : 'text-red-300'}`}>
                {testResult.message}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 text-sm">What happens when enabled:</h4>
            <ul className="space-y-1 text-slate-300 text-sm">
              <li>• AI will generate 1-2 additional questions per assessment</li>
              <li>• Questions are aligned with NIST, ENISA, and ECSO frameworks</li>
              <li>• Falls back to local questions if API fails</li>
              <li>• Your API key is stored locally in your browser</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={testing || !apiKey.trim()}
            className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {testing ? 'Testing...' : 'Test API Key'}
          </button>
          <button
            onClick={handleSave}
            disabled={!testResult?.success}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Save & Enable
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyConfig;
