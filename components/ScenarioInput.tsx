import React, { useState } from 'react';
import { SAMPLE_SCENARIOS, DEFAULT_TARGET_URL } from '../constants';
import { TestScenario } from '../types';

interface ScenarioInputProps {
  onGenerate: (url: string, scenario: string) => void;
  isGenerating: boolean;
}

export const ScenarioInput: React.FC<ScenarioInputProps> = ({ onGenerate, isGenerating }) => {
  const [url, setUrl] = useState(DEFAULT_TARGET_URL);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && customPrompt) {
      onGenerate(url, customPrompt);
    }
  };

  const handleScenarioSelect = (scenario: TestScenario) => {
    setCustomPrompt(scenario.description);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mondi-red" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Configure Test Scenario
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">Target URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mondi-red focus:border-transparent outline-none transition-all text-slate-600 bg-slate-50"
            placeholder="https://..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Quick Templates</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleScenarioSelect(s)}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-mondi-red hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800 text-sm group-hover:text-mondi-red">{s.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    s.category === 'api' ? 'bg-purple-100 text-purple-700' :
                    s.category === 'ui' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">Test Description & Requirements</label>
          <textarea
            id="prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-mondi-red focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400"
            placeholder="Describe what you want to test. E.g., 'Go to the homepage, click login, intercept the auth request...'"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating || !url || !customPrompt}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
              ${isGenerating 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-mondi-red hover:shadow-lg'
              }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Playwright Code...
              </>
            ) : (
              <>
                Generate Test Suite
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};