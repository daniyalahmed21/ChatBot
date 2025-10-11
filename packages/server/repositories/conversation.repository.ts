import type { Content } from '@google/generative-ai';

const conversations = new Map<string, Content[]>();

const conversationRepository = {
    get: (conversationId: string) => {
        return conversations.get(conversationId) || [];
    },
    save: (conversationId: string, history: Content[]) => {
        conversations.set(conversationId, history);
    },
};

export default conversationRepository;
