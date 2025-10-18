import type { Content } from '@google/generative-ai';
import conversationRepository from '../repositories/conversation.repository';
import { aiClient } from '../lib/aiClient';
import fs from 'fs';
import path from 'path';
import template from '../prompts/prompt.txt';

const parkInfo = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'parkInfo.md'),
    'utf-8'
);

const systemInstructions = template.replace('{{parkInfo}}', parkInfo);

const chatService = {
    getChatResponse: async (
        modelName: string,
        conversationId: string,
        userPrompt: string
    ) => {
        const history: Content[] =
            conversationRepository.get(conversationId) || [];

        // Push user message
        history.push({ role: 'user', parts: [{ text: userPrompt }] });

        // Generate AI response
        const aiResponse = await aiClient.generateChat(
            modelName,
            history,
            systemInstructions
        );

        if (!aiResponse.trim()) {
            console.error('Empty response from AI');
            throw new Error('Received empty response from AI');
        }

        // Save AI response to conversation history
        history.push({ role: 'model', parts: [{ text: aiResponse }] });
        conversationRepository.save(conversationId, history);

        return aiResponse;
    },
};

export default chatService;
