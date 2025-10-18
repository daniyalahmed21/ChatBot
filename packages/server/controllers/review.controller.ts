import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { validateProductId } from '../lib/validateProduct';

export const reviewController = {
    getReviews: async (req: Request, res: Response) => {
        const productId = validateProductId(req, res);
        if (productId === null) return;

        const [reviews, summary] = await Promise.all([
            reviewService.getReviews(productId),
            reviewService.getSummary(productId),
        ]);

        res.json({ reviews, summary });
    },

    getSummary: async (req: Request, res: Response) => {
        const productId = validateProductId(req, res);
        if (productId === null) return;

        const summary = await reviewService.generateSummary(productId);
        res.json({ summary });
    },
};
