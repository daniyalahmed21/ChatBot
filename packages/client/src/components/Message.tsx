import React from 'react';
import ReactMarkdown from 'react-markdown';

type MessageProps = {
    text: string;
    type: 'user' | 'model';
};

export const Message: React.FC<MessageProps> = ({ text, type }) => {
    return (
        <div
            className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`px-5 py-3 rounded-3xl max-w-[75%] ${
                    type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}
            >
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </div>
    );
};
