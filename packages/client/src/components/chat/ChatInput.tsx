import React from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa6';
import { type UseFormRegister } from 'react-hook-form';

type ChatInputProps = {
    register: UseFormRegister<{ prompt: string }>;
    isValid: boolean;
    isDisabled: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => void;
};

export const ChatInput: React.FC<ChatInputProps> = ({
    register,
    isValid,
    isDisabled,
    onSubmit,
    onKeyDown,
}) => {
    return (
        <div className="border-t bg-white px-6 py-4">
            <form
                onSubmit={onSubmit}
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
                    disabled={!isValid || isDisabled}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center text-white transition-all shrink-0 disabled:cursor-not-allowed"
                >
                    <FaArrowUp className="text-lg" />
                </Button>
            </form>
        </div>
    );
};
