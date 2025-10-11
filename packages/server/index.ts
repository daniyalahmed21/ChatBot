import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
import chatService from './services/chat.service.js';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const modelName = 'gemini-2.5-flash';

const chatRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required').trim(),
    conversationId: z.string().min(1, 'conversationId is required').uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const parseResult = chatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.format() });
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
});

app.listen(PORT, () => {
    console.log(`Server running at Port http://localhost:${PORT}`);
});
