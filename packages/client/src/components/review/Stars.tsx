export const renderStars = (rating: number) => {
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return (
        <span className="text-yellow-500 text-lg">
            {filledStars}
            <span className="text-gray-300">{emptyStars}</span>
        </span>
    );
};
