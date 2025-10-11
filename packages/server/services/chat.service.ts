import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import conversationRepository from '../repositories/conversation.repository';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const chatService = {
    getChatResponse: async (
        modelName: string,
        conversationId: string,
        prompt: string
    ) => {
        const history: Content[] = conversationRepository.get(conversationId);

        history.push({
            role: 'user',
            parts: [{ text: prompt }],
        });

        const modelInstance = client.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 100,
            },
        });

        const result = await modelInstance.generateContent({
            contents: history,
        });

        const aiResponseText = result.response.text();

        history.push({
            role: 'model',
            parts: [{ text: result.response.text() }],
        });

        conversationRepository.save(conversationId, history);

        return aiResponseText;
    },
};

export default chatService;
