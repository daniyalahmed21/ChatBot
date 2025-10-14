import { prisma } from '../lib/prisma';

export const reviewService = {
    getReviewsByProductId: async (productId: number) => {
        return await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
