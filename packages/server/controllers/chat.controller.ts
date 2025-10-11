import z from 'zod';
import type { Request, Response } from 'express';
import chatService from '../services/chat.service';

const chatRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').trim(),
    conversationId: z.uuid().min(1, 'conversationId is required'),
});

const modelName = process.env.MODEL_NAME || '';

export const chatController = {
    async SendMessage(req: Request, res: Response) {
        try {
            const parseResult = chatRequestSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res
                    .status(400)
                    .json({ error: parseResult.error.format() });
            }

            const { prompt, conversationId } = parseResult.data;

            const response = await chatService.getChatResponse(
                modelName,
                conversationId,
                prompt
            );

            res.json({
                message: response,
            });
        } catch (error: any) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to generate response' });
        }
    },
};
