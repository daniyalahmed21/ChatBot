import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa6';

const ChatBot = () => {
    return (
        <div className="flex flex-col gap-3 shadow-lg mt-auto p-4 border rounded-2xl w-full overflow-hidden">
            <textarea
                maxLength={1000}
                placeholder="Type your message..."
                className="px-3 py-2 border rounded-xl outline-none w-full h-24 text-zinc-800 placeholder:text-zinc-500 text-sm resize-none"
            />
            <div className="flex justify-end">
                <Button className="bg-zinc-900/90 hover:opacity-80 rounded-full w-9 h-9 font-medium text-white transition-all duration-200">
                    <FaArrowUp />
                </Button>
            </div>
        </div>
    );
};

export default ChatBot;
