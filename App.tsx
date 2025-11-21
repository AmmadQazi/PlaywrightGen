import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ScenarioInput } from './components/ScenarioInput';
import { CodeViewer } from './components/CodeViewer';
import { SimulationPreview } from './components/SimulationPreview';
import { generatePlaywrightTest } from './services/geminiService';
import { TestStatus } from './types';

function App() {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.IDLE);
  
  const handleGenerate = async (url: string, scenario: string) => {
    setTestStatus(TestStatus.GENERATING);
    const code = await generatePlaywrightTest(url, scenario);
    setGeneratedCode(code);
    setTestStatus(TestStatus.READY);
  };

  const handleRunSimulation = () => {
    setTestStatus(TestStatus.SIMULATING);
  };

  const handleSimulationComplete = () => {
    setTestStatus(TestStatus.SUCCESS);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Column: Input and Code */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ScenarioInput onGenerate={handleGenerate} isGenerating={testStatus === TestStatus.GENERATING} />
          
          <div className="flex-1 min-h-[400px]">
             {testStatus === TestStatus.IDLE ? (
                 <div className="h-full border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-10 text-center">
                    <div>
                        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-slate-900">No code generated</h3>
                        <p className="mt-1 text-sm text-slate-500">Enter a URL and scenario to generate your Playwright test suite.</p>
                    </div>
                 </div>
             ) : (
                <CodeViewer code={generatedCode} />
             )}
          </div>
        </div>

        {/* Right Column: Simulation & Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <SimulationPreview 
             status={testStatus} 
             onRun={handleRunSimulation} 
             onComplete={handleSimulationComplete}
             code={generatedCode}
           />
           
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                <h4 className="text-slate-800 font-semibold text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mondi-red" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Execution Guide
                </h4>
              </div>
              <div className="p-5 space-y-4">
                 <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Note:</strong> This web app is a code generator and logic simulator. It cannot run real tests directly because browsers prevent web apps from controlling other browsers.
                    </p>
                 </div>

                 <div>
                   <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Option 1: Run Locally</h5>
                   <div className="bg-slate-900 rounded-md p-3 group relative">
                      <code className="text-xs font-mono text-green-400 block mb-1">npm init playwright@latest</code>
                      <code className="text-xs font-mono text-slate-300 block mb-1"># Create tests/example.spec.ts</code>
                      <code className="text-xs font-mono text-slate-300 block">npx playwright test</code>
                   </div>
                 </div>

                 <div>
                   <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Option 2: Run on GitHub</h5>
                   <p className="text-xs text-slate-600 mb-2">
                     Deploying <em>this</em> app won't work. Instead, push the generated code to a repo and use <strong>GitHub Actions</strong>.
                   </p>
                   <a 
                     href="https://playwright.dev/docs/ci-intro" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs text-mondi-red hover:underline flex items-center gap-1"
                   >
                     View Playwright CI Guide
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                       <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                     </svg>
                   </a>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;