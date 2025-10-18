export type Props = {
    productId: number;
};

export type Review = {
    content: string;
    rating: number;
    createdAt: string;
    author: string;
};

export type GetReviewsResponse = {
    reviews: Review[];
    summary: string | null;
};
