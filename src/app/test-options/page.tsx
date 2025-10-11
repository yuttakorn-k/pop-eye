"use client";
import React, { useState } from 'react';
import MenuOptionService from '../services/menuOptionService';

export default function TestOptionsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async (endpoint: string, method: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 Testing: ${endpoint}`);
      const data = await method();
      console.log('✅ Success:', data);
      setResult(data);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err?.message || 'Unknown error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🧪 API Tester</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => testAPI('GET /option-groups/', () => MenuOptionService.getOptionGroups())}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              Get All Option Groups
            </button>
            
            <button
              onClick={() => testAPI('GET /option-groups/4', () => MenuOptionService.getOptionGroupById(4))}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              Get Option Group #4
            </button>
            
            <button
              onClick={() => testAPI('GET /menu-option-groups/', () => MenuOptionService.getAllMappings())}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              disabled={loading}
            >
              Get All Mappings
            </button>
            
            <button
              onClick={() => testAPI('GET /menus/32/option-groups', () => MenuOptionService.getMenuOptionGroups(32))}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              disabled={loading}
            >
              Get Menu #32 Options
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">⏳ Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

