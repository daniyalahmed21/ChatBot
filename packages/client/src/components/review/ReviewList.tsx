import type { GetReviewsResponse, Props, Review } from '@/lib/reviewTypes';
import { useEffect, useState } from 'react';

export const ReviewList = ({ productId }: Props) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await fetch(`/api/products/${productId}/reviews`);
            const data: GetReviewsResponse = await response.json();

            setReviews(data.reviews);
            setSummary(data.summary);
        };

        fetchReviews();
    }, [productId]);

    return (
        <div>
            <h2 className="text-lg font-semibold">
                Reviews for Product {productId}
            </h2>
            {summary && (
                <div className="mb-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-semibold mb-2">Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
            <ul className="space-y-4">
                {reviews.map((review, index) => (
                    <li key={index} className="p-4 border rounded">
                        <p className="mb-2">{review.content}</p>
                        <p className="text-sm text-gray-500">
                            Rating: {review.rating} | Author: {review.author} |
                            Created At: {review.createdAt}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
