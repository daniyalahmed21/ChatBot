import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Template from '../prompts/review-summarizer.txt';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = process.env.MODEL_NAME || 'gemini-pro';

export const reviewService = {
    getReviews: (productId: number): Promise<Review[]> => {
        return reviewRepository.findReviewsByProduct(productId);
    },

    getSummary: (productId: number): Promise<string | null> => {
        return reviewRepository.findActiveSummary(productId);
    },

    generateSummary: async (productId: number): Promise<string> => {
        const cachedSummary =
            await reviewRepository.findActiveSummary(productId);
        if (cachedSummary) return cachedSummary;

        const reviews = await reviewRepository.findReviewsByProduct(
            productId,
            10
        );
        if (!reviews.length) return 'No reviews available for this product.';

        const combinedText = reviews.map((r) => r.content).join('\n');
        const prompt = Template.replace('{{reviews}}', combinedText);

        try {
            const model = client.getGenerativeModel({
                model: MODEL_NAME,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
            });

            const result = await model.generateContent(prompt);
            const summaryText = result.response.text();

            await reviewRepository.saveSummary(productId, summaryText);
            return summaryText;
        } catch (err) {
            console.error('Error generating summary:', err);
            return 'Unable to generate summary at this time.';
        }
    },
};
