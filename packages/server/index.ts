import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const conversations = new Map<string, Content[]>();

const modelName = 'gemini-2.5-flash';

const chatRequestSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required'),
    conversationId: z.string().min(1, 'conversationId is required').uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const parseResult = chatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.format() });
        }

        const { prompt, conversationId } = parseResult.data;

        // 1. Get current history or initialize a new one
        const history: Content[] = conversations.get(conversationId) || [];

        // 2. Add the new user prompt to the history
        history.push({
            role: 'user',
            parts: [{ text: prompt }],
        });

        const model = client.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 100,
            },
        });

        // 4. Send the *entire history* as contents to generate the next response
        const result = await model.generateContent({ contents: history });
        const aiResponseText = result.response.text();

        // 5. Add the AI's response to the history
        history.push({
            role: 'model',
            parts: [{ text: aiResponseText }],
        });

        // 6. Update the map with the new, full history
        conversations.set(conversationId, history);

        // 7. Send the response back
        res.json({
            message: aiResponseText,
        });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at Port http://localhost:${PORT}`);
});
