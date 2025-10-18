import type { Review } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

export const reviewRepository = {
    getReviewsByProductId: async (
        productId: number,
        limit?: number
    ): Promise<Review[]> => {
        return await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    getReviewSummaryByProductId: async (productId: number) => {
        const summary = await prisma.summary.findUnique({
            where: { productId },
        });
        return summary;
    },

    storeReviewSummary: async (
        productId: number,
        summary: string
    ): Promise<void> => {
        const now = new Date();
        const expiresAt = dayjs(now).add(7, 'day').toDate();
        await prisma.summary.upsert({
            where: { productId },
            create: { productId, content: summary, expiresAt, createdAt: now },
            update: { content: summary, expiresAt, createdAt: now },
        });
    },
};
