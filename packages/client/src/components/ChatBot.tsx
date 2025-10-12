import { useChatBot } from '@/hooks/useChatBot';
import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

const ChatBot: React.FC = () => {
    const {
        messages,
        isBotTyping,
        messagesEndRef,
        register,
        handleSubmit,
        formState,
        sendMessage,
        handleKeyDown,
    } = useChatBot();

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto">
            <MessageList
                messages={messages}
                isBotTyping={isBotTyping}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput
                register={register}
                isValid={formState.isValid}
                isDisabled={isBotTyping}
                onSubmit={handleSubmit(sendMessage)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default ChatBot;
