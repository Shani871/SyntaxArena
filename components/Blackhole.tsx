import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, ThumbsUp, ThumbsDown, Copy, RefreshCw, Upload, Sparkles, Check, Orbit, Bot, User as UserIcon, Loader2, GripHorizontal, MessageSquare } from 'lucide-react';
import { chatWithBlackhole } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlackholeProps {
    onClose: () => void;
}

export const Blackhole: React.FC<BlackholeProps> = ({ onClose }) => {
    const { user } = useAuth();
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

        const token = await user?.getIdToken();
        const responseText = await chatWithBlackhole(messages, input, token);

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



    if (!position) return null;

    return (
        <div
            ref={windowRef}
            className={`fixed bg-gradient-to-br from-[#0f0f10] via-[#1a1a2e] to-[#0f0f10] backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.4)] z-50 flex flex-col overflow-hidden transition-all duration-500 ease-out ${isMinimized ? 'w-[300px] h-[60px]' : 'w-[400px] h-[600px]'
                }`}
            style={{ left: position.x, top: position.y }}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-transparent to-blue-500 animate-gradient-shift"></div>
            </div>

            {/* Header (Draggable) */}
            <div
                className="relative h-14 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-purple-500/30 flex items-center justify-between px-4 cursor-move select-none backdrop-blur-sm"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-glow-pulse">
                        <Orbit size={16} className="text-white animate-spin" style={{ animationDuration: '8s' }} />
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
                    <div className="relative flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
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
                                        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-lg overflow-hidden break-words whitespace-pre-wrap transition-all duration-300 animate-slide-up ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm'
                                            : 'glass-effect border border-purple-500/30 text-gray-200 rounded-tl-sm hover:border-purple-500/50'
                                            }`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({ className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    const isInline = !match && !className?.includes('language-') && !String(children).includes('\n');
                                                    // @ts-ignore
                                                    const isCodeBlock = !isInline;
                                                    return isCodeBlock ? (
                                                        <code className={`block bg-[#0a0a0a] border border-[#333] rounded-lg p-3 my-2 font-mono text-xs overflow-x-auto text-green-400 ${className}`} {...props}>
                                                            {children}
                                                        </code>
                                                    ) : (
                                                        <code className="bg-[#0a0a0a] border border-[#333] rounded px-1.5 py-0.5 font-mono text-[10px] text-amber-500" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                                                strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                                                blockquote: ({ children }) => <blockquote className="border-l-2 border-purple-500 pl-3 my-2 italic text-gray-400">{children}</blockquote>,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
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
                                className="flex-1 bg-[#1e1e1e]/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:scale-[1.02] outline-none placeholder-gray-500 transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
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