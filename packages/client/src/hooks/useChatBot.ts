import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PopAudio from '@/assets/sounds/pop.mp3';
import NotificationAudio from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(PopAudio);
const notificationAudio = new Audio(NotificationAudio);
popAudio.volume = 0.2;
notificationAudio.volume = 0.2;

type FormData = {
    prompt: string;
};

type Message = {
    text: string;
    type: 'user' | 'model';
};

export const useChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const sendMessage = async ({ prompt }: FormData) => {
        setIsBotTyping(true);
        setMessages((prev) => [...prev, { text: prompt, type: 'user' }]);
        reset();
        popAudio.play().catch((e) => console.log('Pop sound error:', e));
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
                notificationAudio
                    .play()
                    .catch((e) => console.log('Notification sound error:', e));
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(sendMessage)();
        }
    };

    return {
        messages,
        isBotTyping,
        messagesEndRef,
        register,
        handleSubmit,
        formState,
        sendMessage,
        handleKeyDown,
    };
};
