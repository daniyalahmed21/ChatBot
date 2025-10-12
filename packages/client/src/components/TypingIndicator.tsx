import React from 'react';

export const TypingIndicator: React.FC = () => {
    const classnameDot = 'w-2 h-2 bg-gray-400 rounded-full animate-bounce';
    return (
        <div className="flex justify-start">
            <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-5 py-3 rounded-3xl">
                <span
                    className={classnameDot}
                    style={{ animationDelay: '0s' }}
                />
                <span
                    className={classnameDot}
                    style={{ animationDelay: '0.15s' }}
                />
                <span
                    className={classnameDot}
                    style={{ animationDelay: '0.3s' }}
                />
            </div>
        </div>
    );
};
