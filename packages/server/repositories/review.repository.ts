import type { Review } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

export const reviewRepository = {
    findReviewsByProduct: async (
        productId: number,
        limit?: number
    ): Promise<Review[]> => {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    findActiveSummary: async (productId: number): Promise<string | null> => {
        const summary = await prisma.summary.findFirst({
            where: { productId, expiresAt: { gt: new Date() } },
        });
        return summary?.content || null;
    },

    saveSummary: async (productId: number, content: string): Promise<void> => {
        const now = new Date();
        const expiresAt = dayjs(now).add(7, 'days').toDate();

        await prisma.summary.upsert({
            where: { productId },
            create: { productId, content, expiresAt, createdAt: now },
            update: { content, expiresAt, createdAt: now },
        });
    },
};
