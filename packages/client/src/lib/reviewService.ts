import axios from 'axios';
import type { GetReviewsResponse } from './reviewTypes';

export const fetchReviews = async (
    productId: number
): Promise<GetReviewsResponse> => {
    const response = await axios(`/api/products/${productId}/reviews`);
    return response.data;
};

export const generateSummary = async (productId: number): Promise<string> => {
    const response = await axios.post(
        `/api/products/${productId}/reviews/summarize`
    );
    return response.data.summary;
};
