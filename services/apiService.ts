export interface ExecutionResult {
    output: string;
    error: string;
}

export interface QuestionResult {
    title: string;
    description: string;
    examples: string[];
    starterCode: string;
}

const API_BASE_URL = '/api'; // Will be proxied by Vite

export const apiService = {
    executeCode: async (language: string, code: string): Promise<ExecutionResult> => {
        try {
            const response = await fetch(`${API_BASE_URL}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language, code }),
            });

            if (!response.ok) {
                throw new Error(`Execution failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            return {
                output: '',
                error: error instanceof Error ? error.message : 'Unknown execution error'
            };
        }
    },

    generateQuestion: async (topic: string, difficulty: string, language: string): Promise<QuestionResult | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate-question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, difficulty, language }),
            });

            if (!response.ok) {
                console.error("Question generation failed", response.statusText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Question generation error", error);
            return null;
        }
    }
};
