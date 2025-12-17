import { GoogleGenAI } from "@google/genai";
import { DocumateMessage as Message } from "../../types";

const SYSTEM_INSTRUCTION = `You are an intelligent AI assistant integrated into a document editor.

Your capabilities:
1. **Analysis**: You can read the full document to answer questions, summarize, or extract information.
2. **Writing**: You can write new content, draft sections, rewrite paragraphs, or fix grammar based on the user's request.

Context:
You are provided with the current full text of the user's document.

Rules:
• **Q&A Mode**: If the user asks a question about the existing document (e.g., "What is the budget?"), answer strictly based on the document content. Do not hallucinate facts not in the document.
• **Writing Mode**: If the user asks you to write new content (e.g., "Write a conclusion", "Draft a section on marketing"), use your general knowledge and the document context to generate the best possible text.
• When generating text, match the tone and style of the existing document if possible.
• Be concise, helpful, and clear.`;

export const generateAIResponse = async (
  documentContent: string,
  history: Message[],
  userQuestion: string
): Promise<string> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  try {
    if (!apiKey) {
      throw new Error("API key is not configured. Please set GEMINI_API_KEY in .env.local");
    }

    console.log('Initializing Google GenAI...');
    const ai = new GoogleGenAI({ apiKey });

    // Format history as a transcript for the model to see previous Q&A context
    const historyContext = history
      .slice(-5) // Keep only last 5 messages to avoid context overflow
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `${SYSTEM_INSTRUCTION}

Current Document Content:
"""
${documentContent}
"""

${historyContext ? `Conversation History:\n${historyContext}\n\n` : ''}User Question:
${userQuestion}`;

    console.log('Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    console.log('Response received from Gemini API');
    return response.text || "I couldn't generate a response based on the document.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Provide more specific error messages
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env.local');
    }
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please check your Google Cloud quota limits.');
    }
    if (error.status === 400) {
      throw new Error('Bad request to Gemini API. Please try again.');
    }
    if (error.status === 401 || error.status === 403) {
      console.error("Auth Error Details:", {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        keyLength: apiKey?.length,
        keyStart: apiKey?.substring(0, 5)
      });
      throw new Error(`Authentication failed (${error.status}). Check console for details.`);
    }

    throw new Error(`Failed to communicate with the AI assistant: ${error.message || 'Unknown error'}`);
  }
};