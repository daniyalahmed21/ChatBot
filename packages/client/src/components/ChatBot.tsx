import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa6';
import { set, useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import React, { useRef, useState } from 'react';
import axios from 'axios';

type formData = {
    prompt: string;
};

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [messages, setMessages] = useState<
        { text: string; type: 'user' | 'model' }[]
    >([]);
    const { register, handleSubmit, reset, formState } = useForm<formData>();

    const onSubmit = async ({ prompt }: formData) => {
        setIsBotTyping(true);
        setMessages((prev) => [...prev, { text: prompt, type: 'user' }]);
        reset();
        const { data } = await axios.post('/api/chat', {
            prompt,
            conversationId: conversationId.current,
        });

        setIsBotTyping(false);
        setMessages((prev) => [...prev, { text: data.message, type: 'model' }]);

        console.log(data.message);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 mb-4 max-h-[70vh] overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-2xl max-w-[80%] ${
                            message.type === 'user'
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-200 text-gray-800 self-start'
                        }`}
                    >
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                ))}

                {isBotTyping && (
                    <div className="flex items-center self-start space-x-1 bg-gray-200 p-3 rounded-2xl max-w-[80%] text-gray-800">
                        <span className="bg-gray-500 rounded-full w-2 h-2 animate-bounce [animation-delay:0s]"></span>
                        <span className="bg-gray-500 rounded-full w-2 h-2 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="bg-gray-500 rounded-full w-2 h-2 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={onKeyDown}
                className="flex flex-col gap-3 shadow-lg mt-auto p-4 border rounded-2xl w-full overflow-hidden"
            >
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (value) => value.trim().length > 0,
                    })}
                    maxLength={1000}
                    placeholder="Type your message..."
                    className="px-3 py-2 border rounded-xl outline-none w-full h-24 text-zinc-800 placeholder:text-zinc-500 text-sm resize-none"
                />
                <div className="flex justify-end">
                    <Button
                        disabled={!formState.isValid}
                        className="bg-zinc-900/90 hover:opacity-80 rounded-full w-9 h-9 font-medium text-white transition-all duration-200"
                    >
                        <FaArrowUp />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatBot;
