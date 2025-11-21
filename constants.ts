import { TestScenario } from './types';

export const DEFAULT_TARGET_URL = 'https://www.mymondi.net/en/ufp/';

export const SAMPLE_SCENARIOS: TestScenario[] = [
  {
    id: '1',
    name: 'Login & Dashboard Check',
    description: 'Navigate to login, input valid credentials, assert dashboard loads, and check API response for user profile.',
    category: 'e2e'
  },
  {
    id: '2',
    name: 'Product Search',
    description: 'Use the search bar to find a specific paper product and verify the results list UI components.',
    category: 'ui'
  },
  {
    id: '3',
    name: 'Contact Form API Intercept',
    description: 'Fill out the contact form and intercept the POST request to verify the payload structure without actually sending it.',
    category: 'api'
  }
];

export const SYSTEM_INSTRUCTION = `
You are a Senior QA Automation Engineer expert in Playwright and TypeScript.
Your task is to generate high-quality, robust Playwright test code based on the user's description and target URL.

Strict Guidelines:
1. Use the 'Page Object Model' pattern where appropriate, or keep it simple in a single file if the scope is small.
2. ALWAYS include 'page.route' examples if the user mentions API, network, or backend testing to simulate/mock responses.
3. Use semantic locators (getByRole, getByText, getByLabel) over CSS selectors where possible.
4. Include comments explaining the test steps.
5. CRITICAL: You MUST use numbered comments for the main test steps in the format: "// 1. Step Description", "// 2. Step Description".
6. The code should be ready to copy-paste into a '.spec.ts' file.
7. Target URL: https://www.mymondi.net/en/ufp/ unless specified otherwise.
`;