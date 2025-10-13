import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import conversationRepository from '../repositories/conversation.repository';
import fs from 'fs';
import path from 'path';
import template from '../prompts/prompt.txt';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const parkInfo = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'parkInfo.md'),
    'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

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
            systemInstruction: instructions,
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048, // Increased from 100
            },
        });

        const result = await modelInstance.generateContent({
            contents: history,
        });

        const aiResponseText = result.response.text();

        console.log('AI Response:', aiResponseText);
        console.log('Response length:', aiResponseText.length);

        // Check if response is empty
        if (!aiResponseText || aiResponseText.trim() === '') {
            console.error('Empty response from Gemini API');
            throw new Error('Received empty response from AI');
        }

        history.push({
            role: 'model',
            parts: [{ text: aiResponseText }],
        });

        conversationRepository.save(conversationId, history);

        return aiResponseText;
    },
};

export default chatService;
