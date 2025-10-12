import z from 'zod';
import type { Request, Response } from 'express';
import chatService from '../services/chat.service';

const chatRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').trim(),
    conversationId: z.string().uuid('Invalid conversation ID'),
});

const modelName = process.env.MODEL_NAME || 'gemini-pro';

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

            console.log('Processing request:', { prompt, conversationId });

            const response = await chatService.getChatResponse(
                modelName,
                conversationId,
                prompt
            );

            console.log('Sending response:', { message: response });

            return res.json({
                message: response,
            });
        } catch (error: any) {
            console.error('Error in chatController:', error);
            console.error('Error stack:', error.stack);

            return res.status(500).json({
                error: 'Failed to generate response',
                message: error.message || 'Unknown error',
            });
        }
    },
};
