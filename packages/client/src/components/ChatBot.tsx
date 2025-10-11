import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import React from 'react';

type formData = {
    prompt: string;
};

const ChatBot = () => {
    const { register, handleSubmit, reset, formState } = useForm<formData>();

    const onSubmit = (data: formData) => {
        console.log(data);
        reset();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
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
    );
};

export default ChatBot;
