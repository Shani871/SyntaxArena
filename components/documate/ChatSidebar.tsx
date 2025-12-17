import React, { useState, useRef, useEffect } from 'react';
import { DocumateMessage as Message } from '../../types';
import { generateAIResponse } from '../../services/documate/geminiService';
import { ChatMessage } from './ChatMessage';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ChatSidebarProps {
    documentContent: string;
    onInsertContent: (text: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ documentContent, onInsertContent }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: "Hello! I'm your document assistant. I can answer questions about your document, or help you write and draft new content.",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const responseText = await generateAIResponse(
                documentContent,
                messages, // Send previous context
                userMsg.content
            );

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: `**Error**: ${error.message}\n\n*Please ensure your API Key is correctly configured.*`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="p-4 bg-white border-b border-gray-200 flex flex-col gap-1 shadow-sm flex-none">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary" size={20} />
                    <h2 className="font-semibold text-gray-800">AI Assistant</h2>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                    Key: ...{(process.env.GEMINI_API_KEY || process.env.API_KEY || 'MISSING').slice(-4)}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        onInsert={msg.role === 'model' ? onInsertContent : undefined}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full mb-4">
                        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                            <LoadingSpinner className="text-primary" />
                            <span className="text-sm text-gray-500 animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex-none">
                <div className="relative flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your document..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={`
              p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 mb-0.5
              ${!inputValue.trim() || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-blue-700 shadow-sm hover:shadow'
                            }
            `}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <button
                        onClick={() => setMessages([])}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors"
                    >
                        <Trash2 size={10} /> Clear Chat History
                    </button>
                </div>
            </div>
        </div>
    );
};