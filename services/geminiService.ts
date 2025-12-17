import { GoogleGenAI, Type } from "@google/genai";
import { Problem, VisualizerStep } from "../types";

// Initialize Gemini
// Note: In a real app, ensure process.env.API_KEY is defined.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-1.5-flash';

/**
 * Generates a unique story variant for a coding problem to prevent cheating.
 */
export const generateProblemVariant = async (baseProblem: Problem): Promise<string> => {
  if (!process.env.API_KEY) return baseProblem.baseDescription;

  const themes = ['Space Opera', 'Medieval Fantasy', 'Cyberpunk Heist', 'Pizza Delivery', 'Zombie Apocalypse'];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  const prompt = `
    Rewrite the following coding problem description into a unique narrative story based on the theme: "${randomTheme}".
    
    Original Problem: "${baseProblem.baseDescription}"
    
    Rules:
    1. Do NOT change the input/output logic or constraints.
    2. Do NOT mention the original problem name (like "Two Sum").
    3. Make it immersive.
    4. Keep it concise (under 150 words).
    5. Return ONLY the new problem description text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || baseProblem.baseDescription;
  } catch (error) {
    console.error("Gemini variant generation failed", error);
    return baseProblem.baseDescription;
  }
};

/**
 * Strict AI Invigilator that gives hints but refuses to solve.
 * Updated to support specific hint types with Socratic method.
 */
export const getInvigilatorHint = async (
  history: { role: string; text: string }[],
  problemContext: string,
  currentCode: string,
  hintType: 'GENERAL' | 'SYNTAX' | 'LOGIC' | 'OPTIMIZATION' | 'EXPLANATION' = 'GENERAL'
): Promise<string> => {
  if (!process.env.API_KEY) return "System Offline: Neural Link Severed (Check API Key).";

  let specificInstruction = "";
  switch (hintType) {
    case 'SYNTAX':
      specificInstruction = "USER_REQUEST: Syntax Analysis.\nPROTOCOL: Scan code for syntax errors. Do NOT fix them. Ask 1 leading question pointing to the line or construct where the error is (e.g., 'Check the closing brackets on line 12.').";
      break;
    case 'LOGIC':
      specificInstruction = "USER_REQUEST: Logic Assistance.\nPROTOCOL: Identify the algorithmic flaw. Do NOT reveal the solution. Ask a question that forces the user to trace their data flow (e.g., 'What happens to the variable X when the loop terminates?').";
      break;
    case 'OPTIMIZATION':
      specificInstruction = "USER_REQUEST: Optimization Query.\nPROTOCOL: Identify bottlenecks (e.g., O(n^2)). Ask user to consider specific data structures that might offer better lookup times or reduce complexity.";
      break;
    case 'EXPLANATION':
      specificInstruction = "USER_REQUEST: Conceptual Explanation.\nPROTOCOL: Explain the concept using a brief metaphor, but end with a question connecting it back to the specific problem constraints.";
      break;
    default:
      specificInstruction = "USER_REQUEST: General Query.\nPROTOCOL: Respond with a Socratic question based on the last user message. Guide them to the answer through deduction.";
  }

  const systemInstruction = `
    IDENTITY: You are the SyntaxArena Invigilator (System v2.5).
    ROLE: Strict, Socratic, fairness-focused AI proctor.
    GOAL: Verify student understanding by guiding them to the answer without giving it.
    
    STRICT RULES:
    1. NO CODE: Never write code snippets in the response.
    2. NO ANSWERS: Never explicitly state the solution.
    3. SOCRATIC METHOD: Always answer with a question or a hint that requires deduction.
    4. BREVITY: Keep responses under 50 words. Use a terminal/system output style.
    5. PERSONA: You are a system process, not a human. Use terminology like "Analysis:", "Detected:", "Query:", "Hint:".
    
    CONTEXT:
    Problem: ${problemContext}
    
    Student Code Snapshot:
    ${currentCode}
    
    CURRENT TASK:
    ${specificInstruction}
  `;

  // Format history for the API
  const conversation = [
    { role: 'user', parts: [{ text: `System Context Injection: \nProblem: ${problemContext}\nCode:\n${currentCode}` }] }, // Inject context as first message
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }))
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: conversation as any,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "Invigilator is silent.";
  } catch (error) {
    console.error("Invigilator error", error);
    return "Connection to Invigilator lost.";
  }
};

/**
 * Visualizes code execution logic.
 */
export const visualizeCodeExecution = async (code: string): Promise<VisualizerStep[]> => {
  if (!process.env.API_KEY) {
    return [{ step: 1, description: "API Key Missing", changedVariables: {} }];
  }

  const prompt = `
    Analyze this code snippet and break it down into a visual execution flow of exactly 4-6 key steps.
    Return JSON format only.
    
    Code:
    ${code}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              description: { type: Type.STRING },
              changedVariables: {
                type: Type.OBJECT,
                description: "Key-value pairs of variables changed in this step"
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as VisualizerStep[];
  } catch (error) {
    console.error("Visualizer error", error);
    return [{ step: 1, description: "Could not visualize code.", changedVariables: {} }];
  }
};

/**
 * Explains concept in native language (Story Mode).
 */
export const explainConceptSimple = async (concept: string, language: string, level: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<string> => {
  if (!process.env.API_KEY) return "Service unavailable.";

  const prompt = `
    Explain the backend computer science concept "${concept}" to a ${level} level student in the language "${language}".
    Use a simple analogy or story (e.g., cooking, traffic, organizing a room).
    Keep it under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    return "Error generating explanation.";
  }
};

/**
 * Generates a story explanation for a specific block of code.
 */
export const generateCodeStory = async (code: string, language: string): Promise<string> => {
  if (!process.env.API_KEY) return "Service unavailable.";

  const prompt = `
    Read the following code and explain exactly what it does in the form of a simple story.
    Language: ${language}
    Target Audience: Beginner Developer
    
    Code:
    ${code}
    
    Output Format:
    A short narrative story (max 200 words) where the code elements are characters or objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "Could not generate story.";
  } catch (error) {
    return "Error generating code story.";
  }
};

/**
 * Generates an ASCII/Text-based diagram for an API route.
 */
export const generateApiDiagram = async (code: string): Promise<string> => {
  if (!process.env.API_KEY) return "Service unavailable.";

  const prompt = `
    Analyze this backend API route code.
    Generate a text-based ASCII diagram (or mermaid.js compatible text) that visualizes the flow of data.
    Include: Request -> Middleware -> Controller -> Database -> Response.
    
    Code:
    ${code}
    
    Output:
    Only the text diagram.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "Could not generate diagram.";
  } catch (error) {
    return "Error generating diagram.";
  }
};

/**
 * BlackHole Chatbot Service
 */
export const chatWithBlackhole = async (history: { role: string; text: string }[], message: string): Promise<string> => {
  if (!process.env.API_KEY) return "The void is silent (Missing API Key).";

  const systemInstruction = `
    You are BlackHole, the resident AI system of SyntaxArena.
    Your personality is highly intelligent, slightly cryptic, and tech-noir.
    You assist users with coding challenges, explaining algorithms, or navigating the app.
    Keep responses concise, precise, and helpful.
    Occasionally use phrases like "Analyzing entropy...", "Void connection established...", "Querying the abyss...".
  `;

  const conversation = [
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: conversation as any,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "The Void returned nothing.";
  } catch (error) {
    console.error("Blackhole error", error);
    return "Entropy overwhelmed the connection.";
  }
};

/**
 * Document Assistant Chat
 */
export const chatWithDocument = async (
  history: { role: string; text: string }[],
  message: string,
  documentContent: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return "AI Service Unavailable (Missing API Key).";

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are a helpful Document Assistant.
    You have access to the following document content provided by the user.
    Answer questions based strictly on this document.
    If the user asks to summarize, rewrite, or explain parts of it, do so.
    
    DOCUMENT CONTEXT:
    """
    ${documentContent.slice(0, 20000)} 
    """
    (Note: Content truncated if too long)
  `;

  const conversation = [
    ...history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: conversation as any,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "I couldn't read the document.";
  } catch (error: any) {
    console.error("Document Chat Error", error);

    if (error.status === 403) {
      let errorMessage = "Access Denied (403).";

      // Try to parse detailed error from Google API response body
      try {
        if (error.response) {
          const errorBody = await error.response.json();
          if (errorBody.error && errorBody.error.message) {
            errorMessage += ` Details: ${errorBody.error.message}`;
          }
        } else if (error.message) {
          // Sometimes the message is already in the error object or in a different format
          if (error.message.includes('Generative Language API has not been used')) {
            // clean up the raw dump by taking only the human readable part
            const parts = error.message.split('then retry');
            if (parts.length > 0) {
              errorMessage = `${parts[0]}then retry.`;
            } else {
              errorMessage = error.message;
            }
          } else {
            errorMessage += ` ${error.message}`;
          }
        }
      } catch (parseError) {
        // Fallback if parsing fails
        errorMessage += " Check API Key permissions and ensure Generative Language API is enabled in Google Cloud Console.";
      }

      return errorMessage;
    }

    return "Error communicating with AI.";
  }
};

/**
 * Generates a practice problem based on topic and difficulty.
 */
export const generatePracticeProblem = async (topic: string, difficulty: string): Promise<Problem> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback Mock if no API key
    return {
      id: `mock-${Date.now()}`,
      title: `${difficulty} ${topic} Problem (Mock)`,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      baseDescription: "API Key missing. This is a mock problem description.",
      generatedStory: "Once upon a time in a mock land..."
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate a unique coding problem.
    Topic: ${topic}
    Difficulty: ${difficulty}
    
    Output JSON format:
    {
      "title": "Problem Title",
      "description": "Problem description...",
      "exampleInput": "nums = [1,2]",
      "exampleOutput": "3"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    let text = response.text;
    if (!text) throw new Error("No response");

    // Sanitize: Remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);

    return {
      id: `gen-${Date.now()}`,
      title: data.title,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      baseDescription: `${data.description}\n\nExample:\nInput: ${data.exampleInput}\nOutput: ${data.exampleOutput}`,
      generatedStory: ''
    };
  } catch (error: any) {
    console.error("Gen Problem Error", error);

    // Improved Error Message for User
    let errorMsg = "Could not generate problem.";
    if (error.status === 503) errorMsg += " AI Service Overloaded.";
    else if (error.status === 403) errorMsg += " Access Denied (Check API Key).";
    else errorMsg += " Please try again.";

    return {
      id: `err-${Date.now()}`,
      title: "Generation Failed",
      difficulty: "Easy",
      baseDescription: errorMsg,
      generatedStory: ""
    }
  }
};

/**
 * AI Judge: Evaluates code submission against generated test cases.
 */
export const evaluateCodeSubmission = async (problem: Problem, code: string, language: string): Promise<{ id: number; input: string; expected: string; actual: string; passed: boolean }[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
      Act as a code judge/compiler.
      Problem: ${problem.baseDescription}
      Language: ${language}
      
      User Code:
      ${code}
      
      Task:
      1. Analyze the code logic.
      2. Generate 3 diverse test cases (Edge case, Standard case, Large case).
      3. Predict the output of the User Code for these inputs.
      4. Compare with expected correct output.
      
      Output JSON only:
      [
        { "id": 1, "input": "...", "expected": "...", "actual": "...", "passed": true/false }
      ]
    `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluation Error", error);
    return [
      { id: 1, input: "System Error", expected: "True", actual: "False", passed: false }
    ];
  }
};