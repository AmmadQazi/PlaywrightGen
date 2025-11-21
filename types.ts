export interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: 'ui' | 'api' | 'e2e';
}

export interface GeneratedCode {
  code: string;
  explanation: string;
}

export enum TestStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
  SIMULATING = 'SIMULATING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export interface SimulationStep {
  id: number;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
}

export interface SimulatedScreenshot {
  id: number;
  stepId: number;
  title: string;
  timestamp: string;
  type: 'navigation' | 'form' | 'action' | 'success';
}