import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const productController = {
    GetProductReviews: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (isNaN(Number(id))) {
            return res
                .status(400)
                .json({ error: 'Product ID must be a number' });
        }
        const reviews = await prisma.review.findMany({
            where: { productId: Number(id) },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ reviews });
    },
};
