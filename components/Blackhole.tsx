import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Loader2, GripHorizontal, Sparkles, ThumbsUp, ThumbsDown, Minimize2, Maximize2, Copy, Check, Bot, User as UserIcon } from 'lucide-react';
import { chatWithBlackhole } from '../services/geminiService';
import { ChatMessage } from '../types';

interface BlackholeProps {
    onClose: () => void;
}

export const Blackhole: React.FC<BlackholeProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'model',
            text: 'Welcome to **Blackhole AI** 🌌\n\nI\'m your coding assistant powered by advanced AI. I can help you with:\n\n• Debugging code\n• Explaining concepts\n• Algorithm suggestions\n• Best practices\n\nHow can I assist you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Dragging State
    const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    // Initialize position to bottom-right
    useEffect(() => {
        if (window.innerWidth) {
            setPosition({
                x: window.innerWidth - 420, // 400px width + 20px margin
                y: window.innerHeight - 620 // 600px height + 20px margin
            });
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (position) {
            setIsDragging(true);
            dragStartRef.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStartRef.current.x,
                    y: e.clientY - dragStartRef.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const responseText = await chatWithBlackhole(messages, input);

        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        setIsLoading(false);
    };

    const handleFeedback = (index: number, type: 'like' | 'dislike') => {
        setMessages(prev => prev.map((msg, i) =>
            i === index ? { ...msg, feedback: msg.feedback === type ? undefined : type } : msg
        ));
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const formatMessage = (text: string) => {
        // Simple markdown-like formatting
        return text
            .split('\n')
            .map((line, i) => {
                // Code blocks
                if (line.startsWith('```')) {
                    return <div key={i} className="bg-[#0a0a0a] border border-[#333] rounded px-2 py-1 my-1 font-mono text-[10px] text-green-400">{line.replace(/```/g, '')}</div>;
                }
                // Bold
                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <div key={i}>
                            {parts.map((part, j) => j % 2 === 0 ? part : <strong key={j} className="text-white font-bold">{part}</strong>)}
                        </div>
                    );
                }
                // Bullet points
                if (line.startsWith('•') || line.startsWith('-')) {
                    return <div key={i} className="ml-2 text-gray-300">• {line.substring(1).trim()}</div>;
                }
                return <div key={i}>{line || <br />}</div>;
            });
    };

    if (!position) return null;

    return (
        <div
            ref={windowRef}
            className={`fixed bg-gradient-to-br from-[#0f0f10] via-[#1a1a2e] to-[#0f0f10] backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.3)] z-50 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'w-[300px] h-[60px]' : 'w-[400px] h-[600px]'
                }`}
            style={{ left: position.x, top: position.y }}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-transparent to-blue-500 animate-pulse"></div>
            </div>

            {/* Header (Draggable) */}
            <div
                className="relative h-14 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-purple-500/30 flex items-center justify-between px-4 cursor-move select-none backdrop-blur-sm"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-pulse">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                            BLACKHOLE AI
                            <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[8px] font-bold text-purple-300">v2.0</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">Powered by Gemini</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Area */}
                    <div className="relative flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                    }`}>
                                    {msg.role === 'user' ? <UserIcon size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-lg ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm'
                                                : 'bg-[#1e1e1e]/80 backdrop-blur-sm border border-purple-500/20 text-gray-200 rounded-tl-sm'
                                            }`}
                                    >
                                        {formatMessage(msg.text)}
                                    </div>

                                    {/* Actions */}
                                    <div className={`flex gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {msg.role === 'model' && (
                                            <>
                                                <button
                                                    onClick={() => handleCopy(msg.text, idx)}
                                                    className="p-1 text-gray-600 hover:text-purple-400 transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedIndex === idx ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                                </button>
                                                <button
                                                    onClick={() => handleFeedback(idx, 'like')}
                                                    className={`p-1 transition-colors ${msg.feedback === 'like' ? 'text-green-400' : 'text-gray-600 hover:text-green-400'}`}
                                                    title="Helpful"
                                                >
                                                    <ThumbsUp size={10} />
                                                </button>
                                                <button
                                                    onClick={() => handleFeedback(idx, 'dislike')}
                                                    className={`p-1 transition-colors ${msg.feedback === 'dislike' ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`}
                                                    title="Not Helpful"
                                                >
                                                    <ThumbsDown size={10} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1e1e]/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl rounded-tl-sm">
                                    <Loader2 size={12} className="animate-spin text-purple-400" />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="relative p-4 bg-[#0a0a0a]/50 backdrop-blur-sm border-t border-purple-500/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-[#1e1e1e]/50 border border-purple-500/20 rounded-xl px-4 py-3 text-white text-xs focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none placeholder-gray-500 transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                        <div className="text-[9px] text-gray-600 mt-2 text-center">
                            AI can make mistakes. Verify important information.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};