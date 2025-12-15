import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Loader2, GripHorizontal, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { chatWithBlackhole } from '../services/geminiService';
import { ChatMessage } from '../types';

interface BlackholeProps {
  onClose: () => void;
}

export const Blackhole: React.FC<BlackholeProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '>> BLACKHOLE SYSTEM ONLINE. AWAITING INPUT.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Dragging State
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Initialize position to center of screen
  useEffect(() => {
    if (window.innerWidth) {
      setPosition({
        x: window.innerWidth / 2 - 176, // 176 is approx half of width (350px/2)
        y: window.innerHeight / 2 - 250 // approx half of height
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

  if (!position) return null;

  return (
    <div 
        ref={windowRef}
        className="fixed w-[350px] h-[500px] bg-[#0f0f10]/95 backdrop-blur-md border border-[#333] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden animate-scale-in"
        style={{ left: position.x, top: position.y }}
    >
        {/* Header (Draggable) */}
        <div 
            className="h-10 bg-[#18181b] border-b border-[#333] flex items-center justify-between px-3 cursor-move select-none"
            onMouseDown={handleMouseDown}
        >
            <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wider">
                <Sparkles size={14} className="text-cyber-purple" />
                BLACKHOLE v1.0
            </div>
            <div className="flex items-center gap-2">
                <GripHorizontal size={14} className="text-[#555]" />
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-[#333] rounded text-[#858585] hover:text-white transition-colors"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag on close click
                >
                    <X size={14} />
                </button>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#333]">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                        className={`max-w-[85%] px-3 py-2 rounded-lg text-xs font-mono leading-relaxed shadow-md ${
                            msg.role === 'user' 
                                ? 'bg-cyber-blue/10 border border-cyber-blue/30 text-white' 
                                : 'bg-[#1e1e1e] border border-[#333] text-[#d4d4d4]'
                        }`}
                    >
                        {msg.text}
                    </div>
                    {/* Feedback Actions for Model */}
                    {msg.role === 'model' && (
                        <div className="flex gap-2 mt-1 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleFeedback(idx, 'like')} 
                                className={`p-1 transition-colors ${msg.feedback === 'like' ? 'text-green-400' : 'text-[#444] hover:text-green-400'}`}
                                title="Helpful"
                            >
                                <ThumbsUp size={10} />
                            </button>
                            <button 
                                onClick={() => handleFeedback(idx, 'dislike')} 
                                className={`p-1 transition-colors ${msg.feedback === 'dislike' ? 'text-red-400' : 'text-[#444] hover:text-red-400'}`}
                                title="Not Helpful"
                            >
                                <ThumbsDown size={10} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#666] animate-pulse px-2">
                    <Loader2 size={12} className="animate-spin" /> Computing...
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#18181b] border-t border-[#333] flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask the void..."
                className="flex-1 bg-[#0f0f10] border border-[#333] rounded px-3 py-2 text-white text-xs focus:border-cyber-purple outline-none placeholder-[#444]"
            />
            <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-2 bg-cyber-purple hover:bg-purple-600 text-white rounded transition-colors disabled:opacity-50"
            >
                <Send size={14} />
            </button>
        </div>
    </div>
  );
};