import axios from 'axios';
import type { GetReviewsResponse } from './reviewTypes';

export const fetchReviews = async (
    productId: number
): Promise<GetReviewsResponse> => {
    const response = await fetch(`/api/products/${productId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
};

export const generateSummary = async (productId: number): Promise<string> => {
    const response = await axios.post(
        `/api/products/${productId}/reviews/summarize`
    );
    return response.data.summary;
};
