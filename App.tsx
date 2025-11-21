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
                 <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-xs text-green-800 leading-relaxed">
                      <strong>Repo Configured:</strong> I have added <code>playwright.config.ts</code> and <code>package.json</code> to this project. It is now a fully functional Playwright repository.
                    </p>
                 </div>

                 <div>
                   <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">How to Run (Local)</h5>
                   <div className="bg-slate-900 rounded-md p-3 group relative text-xs font-mono space-y-1">
                      <div className="text-slate-400"># 1. Install dependencies</div>
                      <div className="text-green-400">npm install</div>
                      <div className="text-slate-400 mt-2"># 2. Save your generated code</div>
                      <div className="text-slate-300">Create file: <span className="text-yellow-300">tests/my-test.spec.ts</span></div>
                      <div className="text-slate-400 mt-2"># 3. Run the tests</div>
                      <div className="text-green-400">npx playwright test</div>
                   </div>
                 </div>

                 <div>
                   <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">How to Run (GitHub)</h5>
                   <p className="text-xs text-slate-600 mb-2">
                     This project includes a GitHub Actions workflow.
                   </p>
                   
                   <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-3">
                      <p className="text-[10px] text-red-800 font-medium leading-tight">
                        <strong>CRITICAL:</strong> If you see a <code>.github</code> folder in your file list, <strong>delete it</strong> manually. It may block commits in some environments.
                      </p>
                      <p className="text-[10px] text-red-800 font-medium leading-tight mt-2">
                        Use the <code>github-setup</code> folder instead.
                      </p>
                   </div>

                   <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                     <li>Push this code to a new GitHub repository.</li>
                     <li>Rename folder <code>github-setup/</code> to <code>.github/</code></li>
                     <li>Navigate to the <strong>Actions</strong> tab to see your tests run.</li>
                   </ul>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;