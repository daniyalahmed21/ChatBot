import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Template from '../prompts/review-summarizer.txt';
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const reviewService = {
    getReviewsByProductId: async (productId: number): Promise<Review[]> => {
        return await reviewRepository.getReviewsByProductId(productId);
    },

    summarizeReviews: async (productId: number): Promise<string> => {
        const existingSummary =
            await reviewRepository.getReviewSummaryByProductId(productId);
        if (existingSummary && existingSummary.expiresAt > new Date()) {
            return existingSummary.content;
        }
        const reviews = await reviewRepository.getReviewsByProductId(
            productId,
            10
        );

        if (reviews.length === 0) {
            return 'No reviews available for this product.';
        }

        const joinedReviews = reviews.map((r) => r.content).join('\n');
        const prompt = Template.replace('{{reviews}}', joinedReviews);

        try {
            const model = client.getGenerativeModel({
                model: process.env.MODEL_NAME || 'gemini-pro',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            });

            const result = await model.generateContent(prompt);
            await reviewRepository.storeReviewSummary(
                productId,
                result.response.text()
            );
            return result.response.text();
        } catch (error) {
            console.error('Error generating summary:', error);
            return 'Unable to generate summary at this time.';
        }
    },
};
