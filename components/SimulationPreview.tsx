import React, { useEffect, useState, useRef } from 'react';
import { SimulationStep, TestStatus, SimulatedScreenshot } from '../types';

interface SimulationPreviewProps {
  status: TestStatus;
  onRun: () => void;
  onComplete?: () => void;
  code?: string;
}

const MOCK_STEPS: SimulationStep[] = [
  { id: 1, action: 'Browser Context Created', status: 'pending' },
  { id: 2, action: 'Navigate to https://www.mymondi.net/en/ufp/', status: 'pending' },
  { id: 3, action: 'Waiting for network idle', status: 'pending' },
  { id: 4, action: 'Identify Selector: button[name="login"]', status: 'pending' },
  { id: 5, action: 'Intercept Route: /api/v1/user/auth', status: 'pending' },
  { id: 6, action: 'Assertion: expect(page).toHaveTitle(/Mondi/)', status: 'pending' },
];

const MockScreenshotVisual: React.FC<{ type: SimulatedScreenshot['type']; label: string }> = ({ type, label }) => {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden relative font-sans select-none">
        {/* Mock Browser Header */}
        <div className="h-4 bg-[#f1f3f4] w-full flex items-center px-2 gap-1.5 border-b border-slate-300">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-white h-2.5 rounded-sm mx-2 border border-slate-200 flex items-center px-2">
                <span className="text-[6px] text-slate-400">https://www.mymondi.net/en/ufp/</span>
            </div>
        </div>

        {/* Mock Website Content (Mondi Style) */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Navbar */}
            <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-4 shadow-sm z-10">
                <div className="w-6 h-6 bg-[#E31E24] flex items-center justify-center rounded-sm text-white font-bold text-[8px]">M</div>
                <div className="flex gap-2">
                    <div className="w-8 h-1.5 bg-slate-100 rounded-full"></div>
                    <div className="w-8 h-1.5 bg-slate-100 rounded-full"></div>
                    <div className="w-8 h-1.5 bg-slate-100 rounded-full"></div>
                </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 bg-slate-50 p-4 overflow-hidden relative">
                
                {type === 'navigation' && (
                    <div className="animate-pulse space-y-3">
                         <div className="h-24 w-full bg-slate-200 rounded-md"></div>
                         <div className="h-4 w-2/3 bg-slate-200 rounded-md"></div>
                         <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
                    </div>
                )}

                {(type === 'form' || type === 'action' || type === 'success') && (
                    <div className="bg-white p-3 rounded shadow-sm border border-slate-100 max-w-[80%] mx-auto mt-2">
                        <div className="h-2 w-1/3 bg-slate-800 rounded-sm mb-3"></div>
                        <div className="space-y-2">
                            <div className="group">
                                <div className="h-1.5 w-10 bg-slate-400 rounded-sm mb-0.5"></div>
                                <div className={`h-4 w-full border rounded-sm ${label.toLowerCase().includes('name') && type === 'form' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}></div>
                            </div>
                            <div className="group">
                                <div className="h-1.5 w-8 bg-slate-400 rounded-sm mb-0.5"></div>
                                <div className={`h-4 w-full border rounded-sm ${label.toLowerCase().includes('email') && type === 'form' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}></div>
                            </div>
                            <div className="group">
                                <div className="h-1.5 w-12 bg-slate-400 rounded-sm mb-0.5"></div>
                                <div className={`h-8 w-full border rounded-sm ${label.toLowerCase().includes('message') && type === 'form' ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}></div>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-2 h-2 border border-slate-300 rounded-sm"></div>
                                <div className="h-1 w-24 bg-slate-300 rounded-sm"></div>
                            </div>
                            <div className="mt-2 h-4 w-16 bg-[#E31E24] rounded-sm flex items-center justify-center">
                                <div className="w-8 h-0.5 bg-white/50 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Interactive Elements Overlay */}
                {type === 'action' && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="relative translate-x-8 translate-y-12">
                            <svg className="w-6 h-6 text-slate-900 drop-shadow-xl" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="2">
                                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                            </svg>
                            <div className="absolute top-6 left-4 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap">
                                Click
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Overlay */}
                {type === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px] z-30">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-lg flex items-col justify-center items-center gap-2 transform scale-110">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">TEST PASSED</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const extractStepsFromCode = (code: string): SimulationStep[] => {
  if (!code || code.startsWith('// Error') || code.startsWith('// No code')) return [];
  
  const steps: SimulationStep[] = [];
  let idCounter = 1;

  const numberedCommentRegex = /\/\/\s*(\d+)\.?\s*(.+)/g;
  let match;
  const cleanCode = code; 

  while ((match = numberedCommentRegex.exec(cleanCode)) !== null) {
    steps.push({
      id: idCounter++,
      action: match[2].trim(),
      status: 'pending'
    });
  }

  if (steps.length === 0) {
     const lines = code.split('\n');
     lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('await page.goto')) {
            steps.push({ id: idCounter++, action: `Navigate to URL`, status: 'pending' });
        } else if (trimmed.includes('page.route')) {
             steps.push({ id: idCounter++, action: `Setup Network Interception`, status: 'pending' });
        } else if (trimmed.includes('await page.click') || trimmed.includes('.click(')) {
             const selector = trimmed.match(/['"`](.*?)['"`]/)?.[1] || 'element';
             steps.push({ id: idCounter++, action: `Click: ${selector}`, status: 'pending' });
        } else if (trimmed.includes('await page.fill') || trimmed.includes('.fill(')) {
             const selector = trimmed.match(/['"`](.*?)['"`]/)?.[1] || 'input';
             steps.push({ id: idCounter++, action: `Fill Input: ${selector}`, status: 'pending' });
        } else if (trimmed.includes('expect(')) {
             steps.push({ id: idCounter++, action: 'Verify Assertion', status: 'pending' });
        }
     });
  }

  if (steps.length === 0 && code.length > 50) {
      steps.push({ id: 1, action: 'Execute Test Script', status: 'pending' });
  }

  if (steps.length > 0 && !steps[0].action.toLowerCase().includes('browser') && !steps[0].action.toLowerCase().includes('context')) {
      steps.unshift({ id: 0, action: 'Initialize Browser Context', status: 'pending' });
  }

  return steps.length > 0 ? steps : [];
};

export const SimulationPreview: React.FC<SimulationPreviewProps> = ({ status, onRun, onComplete, code }) => {
  const [displaySteps, setDisplaySteps] = useState<SimulationStep[]>(MOCK_STEPS);
  const [screenshots, setScreenshots] = useState<SimulatedScreenshot[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'console' | 'trace'>('console');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (code) {
        const extracted = extractStepsFromCode(code);
        if (extracted.length > 0) {
            setDisplaySteps(extracted);
        } else if (status === TestStatus.IDLE) {
            setDisplaySteps(MOCK_STEPS);
        }
    } else if (status === TestStatus.IDLE) {
        setDisplaySteps(MOCK_STEPS);
    }
  }, [code, status]);

  // Auto-switch tab on success
  useEffect(() => {
    if (status === TestStatus.SUCCESS) {
        setActiveTab('trace');
    }
  }, [status]);

  useEffect(() => {
    if (status === TestStatus.SIMULATING) {
      const runSimulation = async () => {
        setDisplaySteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
        setScreenshots([]);
        setProgress(0);
        setActiveTab('console');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isMounted.current) return;

        const stepsToRun = [...displaySteps];
        const totalSteps = stepsToRun.length;

        for (let i = 0; i < totalSteps; i++) {
          if (!isMounted.current) return;

          setDisplaySteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));

          let delay = 800;
          const action = stepsToRun[i].action.toLowerCase();
          let shotType: SimulatedScreenshot['type'] | null = null;

          if (action.includes('navigate')) {
              delay = 1500;
              shotType = 'navigation';
          }
          else if (action.includes('intercept') || action.includes('wait')) {
              delay = 1000;
          }
          else if (action.includes('fill') || action.includes('type')) {
              delay = 900;
              shotType = 'form';
          }
          else if (action.includes('click') || action.includes('check')) {
              delay = 800;
              shotType = 'action';
          }
          else if (action.includes('assert') || action.includes('verify')) {
              delay = 600;
              // Only take assertion screenshot if it's the last one or explicit
              if (i === totalSteps - 1) shotType = 'success';
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          if (!isMounted.current) return;

          // Take Screenshot
          if (shotType) {
              setScreenshots(prev => [...prev, {
                  id: Date.now(),
                  stepId: stepsToRun[i].id,
                  title: stepsToRun[i].action,
                  timestamp: new Date().toLocaleTimeString(),
                  type: shotType!
              }]);
          }

          setDisplaySteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
          const currentProgress = Math.round(((i + 1) / totalSteps) * 100);
          setProgress(currentProgress);

          await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (isMounted.current) {
             setDisplaySteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
             setProgress(100);
             if (onComplete) onComplete();
        }
      };

      runSimulation();
    }
  }, [status]);

  if (status === TestStatus.IDLE || status === TestStatus.GENERATING) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Simulate</h3>
        <p className="text-slate-500 max-w-sm">
          {status === TestStatus.GENERATING 
            ? 'Generating test plan...' 
            : 'Generate code first to enable the test simulator. This will visualize the step-by-step execution logic.'}
        </p>
      </div>
    );
  }

  const completedCount = displaySteps.filter(s => s.status === 'completed').length;
  const passedTime = (completedCount * 1.2).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          {status === TestStatus.SUCCESS ? 'Execution Results' : 'Test Simulator'}
        </h3>
        {status === TestStatus.READY || status === TestStatus.SUCCESS ? (
           <button 
             onClick={onRun}
             className="text-sm px-4 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
           >
             {status === TestStatus.SUCCESS ? 'Re-run Simulation' : 'Run Simulation'}
           </button>
        ) : (
            <span className="text-sm font-medium text-slate-500 px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Running...
            </span>
        )}
      </div>

      {/* Tabs (Only visible if Success or running) */}
      <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'console' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Console & Steps
          </button>
          <button 
            onClick={() => setActiveTab('trace')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'trace' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Trace Viewer
            {screenshots.length > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs py-0.5 px-1.5 rounded-full">{screenshots.length}</span>
            )}
          </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {/* Progress Bar (Top Overlay) */}
        {status === TestStatus.SIMULATING && (
            <div className="h-1 w-full bg-slate-100 absolute top-0 left-0 right-0 z-10">
            <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
            </div>
        )}

        {/* Content Area */}
        {activeTab === 'console' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Steps List */}
                <div className="flex-1 overflow-auto p-4 space-y-3 custom-scrollbar">
                {displaySteps.map((step) => (
                    <div 
                    key={step.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        step.status === 'running' ? 'bg-indigo-50 border-indigo-200 shadow-sm translate-x-1' : 
                        step.status === 'completed' ? 'bg-white border-slate-200' : 
                        'bg-slate-50 border-transparent opacity-60'
                    }`}
                    >
                    <div className="mt-0.5 flex-shrink-0">
                        {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                        {step.status === 'running' && (
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        )}
                        {step.status === 'completed' && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        )}
                    </div>
                    <div>
                        <p className={`text-sm font-medium transition-colors ${step.status === 'running' ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {step.action}
                        </p>
                        {step.status === 'running' && (
                        <p className="text-xs text-indigo-600 mt-1 animate-pulse">Executing step...</p>
                        )}
                    </div>
                    </div>
                ))}
                </div>
                
                {/* Bottom Console Mock */}
                <div className="bg-slate-900 text-slate-400 p-3 font-mono text-xs border-t border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500">➜</span>
                    <span>npx playwright test</span>
                </div>
                <div className="h-20 overflow-y-auto custom-scrollbar flex flex-col-reverse">
                    {progress === 100 && <div className="text-green-400 mt-1 font-bold">1 passed ({passedTime}s)</div>}
                    {[...displaySteps].reverse().map(s => s.status === 'completed' && (
                        <div key={s.id} className="text-slate-500 py-0.5">
                            [chromium] › generated.spec.ts:10:{s.id} › {s.action}
                        </div>
                    ))}
                </div>
                </div>
            </div>
        )}

        {activeTab === 'trace' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
                {/* Trace Viewer Toolbar */}
                <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 text-xs text-slate-600">
                     <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-800">Source:</span>
                         <span>generated.spec.ts</span>
                     </div>
                     <div className="h-4 w-px bg-slate-300"></div>
                     <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-800">Browser:</span>
                         <span>Chromium (Headless)</span>
                     </div>
                     <div className="ml-auto text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Virtual Simulation
                     </div>
                </div>

                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {screenshots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">No execution traces available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {screenshots.map((shot, index) => (
                                <div key={shot.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]" title={shot.title}>
                                            {index + 1}. {shot.title}
                                        </span>
                                        <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                            {shot.timestamp}
                                        </span>
                                    </div>
                                    <div className="aspect-video bg-slate-100 relative group cursor-default border-b border-slate-100">
                                        <MockScreenshotVisual type={shot.type} label={shot.title} />
                                    </div>
                                    <div className="px-3 py-2 bg-white flex justify-between items-center">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                            shot.type === 'success' ? 'bg-green-100 text-green-700' :
                                            shot.type === 'action' ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {shot.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">1280x720</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {status === TestStatus.SUCCESS && screenshots.length > 0 && (
                        <div className="mt-8 mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                             </svg>
                             <div>
                                 <h4 className="text-blue-800 font-semibold text-sm mb-1">Simulation Complete</h4>
                                 <p className="text-blue-700 text-xs leading-relaxed">
                                     The logic flow of your generated test has been verified. These wireframes are simulations to help you visualize the sequence of operations. To run this actual test against <strong>mymondi.net</strong>, copy the code and run it in your local Playwright environment.
                                 </p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};