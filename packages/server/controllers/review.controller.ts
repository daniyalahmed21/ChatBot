import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { reviewService } from '../services/review.service';

export const reviewController = {
    getReviews: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (isNaN(Number(id))) {
            return res
                .status(400)
                .json({ error: 'Product ID must be a number' });
        }

        const reviews = await reviewService.getReviewsByProductId(Number(id));

        if (!reviews) {
            return res.status(404).json({ error: 'Reviews not found' });
        }

        res.json({ reviews });
    },

    getSummary: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (isNaN(Number(id))) {
            return res
                .status(400)
                .json({ error: 'Product ID must be a number' });
        }

        const summary = await reviewService.summarizeReviews(Number(id));

        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        res.json({ summary });
    },
};
