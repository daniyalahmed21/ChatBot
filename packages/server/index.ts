import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const model = client.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 100,
            },
        });
        const result = await model.generateContent(prompt);

        res.json({
            message: result.response.text(),
        });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at Port http://localhost:${PORT}`);
});
