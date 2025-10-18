import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../ui/button';
import { renderStars } from './Stars';
import type { Props, Review } from '@/lib/reviewTypes';
import { fetchReviews, generateSummary } from '@/lib/reviewService';

export const ReviewList = ({ productId }: Props) => {
    const [summary, setSummary] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => fetchReviews(productId),
        staleTime: 1000 * 60 * 2, // cache for 2 min
        retry: 1,
    });

    const handleGenerateSummary = async () => {
        try {
            const result = await generateSummary(productId);
            setSummary(result);
        } catch (err) {
            console.error('Error generating summary:', err);
        }
    };

    if (isError) {
        return (
            <div className="p-6 max-w-3xl mx-auto text-red-600">
                ⚠️ Failed to load reviews. Please try again later.
            </div>
        );
    }

    const reviews: Review[] = data?.reviews || [];
    const currentSummary: string | null = data?.summary || summary;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">
                Reviews for Product {productId}
            </h2>

            {isLoading ? (
                <>
                    <Skeleton height={80} className="mb-4" />
                    <Skeleton height={100} count={3} className="mb-4" />
                </>
            ) : (
                <>
                    {currentSummary ? (
                        <div className="mb-4 p-4 bg-gray-100 rounded">
                            <h2 className="font-semibold mb-2">Summary</h2>
                            <div className="text-gray-700 leading-relaxed">
                                <ReactMarkdown>{currentSummary}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="mb-4"
                            onClick={handleGenerateSummary}
                        >
                            Summarize
                        </Button>
                    )}

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reviews.map((review, index) => (
                                <li
                                    key={index}
                                    className="p-4 border rounded bg-white shadow-sm"
                                >
                                    <p className="mb-2 text-gray-800">
                                        {review.content}
                                    </p>
                                    <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
                                        {renderStars(review.rating)}
                                        <span>• {review.author}</span>
                                        <span>
                                            •{' '}
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};
