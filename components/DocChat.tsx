import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2, Bot, FileText } from 'lucide-react';
import { chatWithDocument } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useAuth } from './AuthContext';

interface DocChatProps {
    documentContent: string;
    onClose: () => void;
    onCreateDocument?: (title: string, category: string, content: string) => void;
}

export const DocChat: React.FC<DocChatProps> = ({ documentContent, onClose, onCreateDocument }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! I can help you with this document or create new ones. Try saying "Create a document about [topic]"' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/doc-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    documentContent,
                    message: input,
                    history: messages,
                }),
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();

            // Check if this is a document creation response
            if (data.action === 'CREATE_DOC' && onCreateDocument) {
                onCreateDocument(data.title, data.category, data.content);
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: `✅ Document "${data.title}" has been created and added to your documentation!\n\nCategory: ${data.category}`
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: data.response || "I could not generate a response." }]);
            }
        } catch (error: any) {
            console.error("DocChat error", error);
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message}` }]);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#333]">
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-[#333] bg-[#252526]">
                <div className="flex items-center gap-2 text-cyber-blue font-bold text-xs uppercase tracking-wider">
                    <Bot size={14} /> Doc Assistant
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-[#333] rounded text-[#858585] hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                            className={`max-w-[90%] px-3 py-2 rounded-lg text-xs leading-relaxed ${msg.role === 'user'
                                ? 'bg-cyber-blue/20 text-white'
                                : 'bg-[#2d2d2d] text-[#d4d4d4]'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#666] animate-pulse">
                        <Loader2 size={12} className="animate-spin" /> Thinking...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#333] bg-[#252526]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask or say 'Create a doc about...'"
                        className="flex-1 bg-[#1e1e1e] border border-[#333] rounded px-3 py-1.5 text-white text-xs focus:border-cyber-blue outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="p-1.5 bg-cyber-blue hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
