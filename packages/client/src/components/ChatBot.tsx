import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

type formData = {
    prompt: string;
};

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [messages, setMessages] = useState<
        { text: string; type: 'user' | 'model' }[]
    >([]);
    const { register, handleSubmit, reset, formState } = useForm<formData>();

    const onSubmit = async ({ prompt }: formData) => {
        setIsBotTyping(true);
        setMessages((prev) => [...prev, { text: prompt, type: 'user' }]);
        reset();

        try {
            const { data } = await axios.post('/api/chat', {
                prompt,
                conversationId: conversationId.current,
            });

            if (data.message && data.message.trim()) {
                setMessages((prev) => [
                    ...prev,
                    { text: data.message, type: 'model' },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: 'Sorry, I received an empty response. Please try again.',
                        type: 'model',
                    },
                ]);
            }
        } catch (error) {
            console.error('API Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    text: 'Sorry, something went wrong. Please try again.',
                    type: 'model',
                },
            ]);
        } finally {
            setIsBotTyping(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isBotTyping]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
                <div className="space-y-6 max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <p className="text-lg">Start a conversation</p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-5 py-3 rounded-3xl max-w-[75%] ${
                                    message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                                }`}
                            >
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {isBotTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-5 py-3 rounded-3xl">
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0s' }}
                                ></span>
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.15s' }}
                                ></span>
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.3s' }}
                                ></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="border-t bg-white px-6 py-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={onKeyDown}
                    className="flex items-end gap-3 max-w-4xl mx-auto"
                >
                    <div className="flex-1 relative">
                        <textarea
                            {...register('prompt', {
                                required: true,
                                validate: (value) => value.trim().length > 0,
                            })}
                            maxLength={1000}
                            placeholder="Message..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-3xl outline-none resize-none text-gray-900 placeholder:text-gray-400 text-sm focus:border-blue-500 transition-colors"
                            rows={1}
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                            onInput={(e) => {
                                e.currentTarget.style.height = 'auto';
                                e.currentTarget.style.height =
                                    e.currentTarget.scrollHeight + 'px';
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!formState.isValid || isBotTyping}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center text-white transition-all shrink-0 disabled:cursor-not-allowed"
                    >
                        <FaArrowUp className="text-lg" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
