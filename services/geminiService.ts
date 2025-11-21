import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePlaywrightTest = async (url: string, scenario: string): Promise<string> => {
  try {
    const prompt = `
    Target Website: ${url}
    Test Scenario: ${scenario}
    
    Please write a complete, runnable Playwright test in TypeScript.
    
    CRITICAL FORMATTING INSTRUCTION:
    - Divide the test into logical steps.
    - Precede each step with a numbered comment exactly like this: 
      // 1. Navigate to the homepage
      // 2. Click the login button
    - This format is required for the test visualization tool.

    Include:
    - Imports (@playwright/test)
    - A 'test' block
    - UI interactions (clicks, fills)
    - API interception (page.route) if relevant to the scenario
    - Assertions (expect)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        // maxOutputTokens removed to ensure full code generation
      }
    });

    if (response.text) {
      return response.text;
    }
    
    return '// No code generated. The model returned an empty response. Please try refining your prompt.';
  } catch (error) {
    console.error("Error generating test code:", error);
    return `// Error generating code: ${(error as Error).message}. \n// Please check your API key and connection.`;
  }
};