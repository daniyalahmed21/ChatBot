import React from 'react';
import { Message } from './Message';
import { EmptyState } from './EmptyState';
import { TypingIndicator } from './TypingIndicator';

type MessageType = {
    text: string;
    type: 'user' | 'model';
};

type MessageListProps = {
    messages: MessageType[];
    isBotTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isBotTyping,
    messagesEndRef,
}) => {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="space-y-6 max-w-4xl mx-auto">
                {messages.length === 0 && <EmptyState />}

                {messages.map((message, index) => (
                    <Message
                        key={index}
                        text={message.text}
                        type={message.type}
                    />
                ))}

                {isBotTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
