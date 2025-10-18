import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { aiClient } from '../lib/aiClient';
import Template from '../prompts/review-summarizer.txt';

export const reviewService = {
    getReviews: (productId: number): Promise<Review[]> => {
        return reviewRepository.findReviewsByProduct(productId);
    },

    getSummary: (productId: number): Promise<string | null> => {
        return reviewRepository.findActiveSummary(productId);
    },

    generateSummary: async (productId: number): Promise<string> => {
        const cached = await reviewRepository.findActiveSummary(productId);
        if (cached) return cached;

        const reviews = await reviewRepository.findReviewsByProduct(
            productId,
            10
        );
        if (reviews.length === 0)
            return 'No reviews available for this product.';

        const joined = reviews.map((r) => r.content).join('\n');
        const prompt = Template.replace('{{reviews}}', joined);

        try {
            const summary = await aiClient.generateText(prompt);
            await reviewRepository.saveSummary(productId, summary);
            return summary;
        } catch {
            return 'Unable to generate summary at this time.';
        }
    },
};
