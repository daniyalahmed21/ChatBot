import { GoogleGenerativeAI, type Content } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const DEFAULT_MODEL = process.env.MODEL_NAME || 'gemini-pro';

export const aiClient = {
    /**
     * Generate a response from plain text prompt.
     */
    generateText: async (prompt: string): Promise<string> => {
        try {
            const model = client.getGenerativeModel({
                model: DEFAULT_MODEL,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
            });

            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('AI generation error:', error);
            throw new Error('Failed to generate text');
        }
    },

    /**
     * Generate a response from a chat history (for conversational AI).
     */
    generateChat: async (
        modelName: string,
        history: Content[],
        systemInstruction?: string
    ): Promise<string> => {
        try {
            const model = client.getGenerativeModel({
                model: modelName || DEFAULT_MODEL,
                systemInstruction,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
            });

            const result = await model.generateContent({ contents: history });
            return result.response.text();
        } catch (error) {
            console.error('AI chat generation error:', error);
            throw new Error('Failed to generate chat response');
        }
    },
};

//Sample usage:
// const response = await aiClient.generateText("Summarize the following text...");
// await aiClient.generateText("Summarize this document");
// await aiClient.generateChat("gemini-1.5-pro", conversationHistory);
