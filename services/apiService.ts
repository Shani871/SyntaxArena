export interface ExecutionResult {
    output: string;
    error: string;
}

export interface QuestionResult {
    title: string;
    description: string;
    examples: string[];
    starterCode: string;
    testHarness?: string; // Optional test harness code
}

export interface AptitudeQuestion {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

export interface AptitudeResult {
    questions: AptitudeQuestion[];
}

const API_BASE_URL = '/api'; // Will be proxied by Vite

export const apiService = {
    executeCode: async (language: string, code: string, testHarness?: string): Promise<ExecutionResult> => {
        try {
            const response = await fetch(`${API_BASE_URL}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language, code, testHarness }),
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
    },

    generateAptitudeQuestions: async (topic: string, numberOfQuestions: number = 3): Promise<AptitudeResult | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate-aptitude`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, numberOfQuestions }),
            });

            if (!response.ok) {
                console.error("Aptitude generation failed", response.statusText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Aptitude generation error", error);
            return null;
        }
    },

    generateCodeStory: async (code: string, language: string): Promise<string | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate-code-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                console.error("Code story generation failed", response.statusText);
                return null;
            }

            const result = await response.json();
            return result.story;
        } catch (error) {
            console.error("Code story generation error", error);
            return null;
        }
    },

    visualizeExecution: async (code: string, language: string): Promise<string | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/visualize-execution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                console.error("Execution visualization failed", response.statusText);
                return null;
            }

            const result = await response.json();
            return result.visualization;
        } catch (error) {
            console.error("Execution visualization error", error);
            return null;
        }
    },

    simplifyConcept: async (concept: string, language: string, level: string): Promise<string | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/simplify-concept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ concept, language, level }),
            });

            if (!response.ok) {
                console.error("Concept simplification failed", response.statusText);
                return null;
            }

            const result = await response.json();
            return result.explanation;
        } catch (error) {
            console.error("Concept simplification error", error);
            return null;
        }
    }
};
