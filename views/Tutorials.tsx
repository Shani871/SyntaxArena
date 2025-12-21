import React from 'react';
import { Book, ChevronRight, Lock, CheckCircle, ExternalLink } from 'lucide-react';

const TUTORIALS_LIST = [
    { id: 1, title: "Backend 101: What is a Server?", category: "Fundamentals", completed: true },
    { id: 2, title: "REST APIs Explained", category: "API Design", completed: true },
    { id: 3, title: "Node.js Event Loop Visualized", category: "Runtime", completed: false },
    { id: 4, title: "Database Normalization", category: "Data", completed: false },
    { id: 5, title: "Authentication: Cookies vs Tokens", category: "Security", completed: false },
    { id: 6, title: "System Design: Load Balancing", category: "Architecture", completed: false },
    { id: 7, title: "Microservices Architecture", category: "Architecture", completed: false },
    { id: 8, title: "GraphQL vs REST", category: "API Design", completed: false },
];

export const Tutorials: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e] overflow-hidden font-mono text-sm">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-700">
                <div className="w-full max-w-7xl mx-auto flex flex-col min-h-full pb-24">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Interactive Tutorials</h1>
                        <p className="text-[#858585] max-w-2xl">Master backend concepts through our visual guides, interactive quizzes, and code-along challenges. Track your progress as you go.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 items-start">
                        {TUTORIALS_LIST.map((tut) => (
                            <div key={tut.id} className="bg-[#252526] border border-[#333] rounded-xl p-6 hover:border-cyber-blue hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden shadow-lg h-full flex flex-col">
                                {/* Progress Indicator */}
                                {tut.completed && (
                                    <div className="absolute top-3 right-3 text-cyber-neon bg-[#1e1e1e] rounded-full p-1 shadow-sm">
                                        <CheckCircle size={14} />
                                    </div>
                                )}

                                <div className="w-12 h-12 rounded-lg bg-[#1e1e1e] border border-[#333] flex items-center justify-center mb-5 text-[#858585] group-hover:text-white group-hover:bg-cyber-blue group-hover:border-cyber-blue transition-colors shadow-inner shrink-0">
                                    <Book size={20} />
                                </div>

                                <div className="text-[10px] text-cyber-blue uppercase font-bold mb-2 tracking-wider">{tut.category}</div>
                                <h3 className="text-lg font-bold text-white mb-3 leading-tight flex-1">{tut.title}</h3>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#333]">
                                    <span className="text-[#858585] text-xs">15 mins</span>
                                    <a
                                        href="https://grow.google/intl/en_in/certificates/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-xs text-[#ccc] font-bold group-hover:text-cyber-blue transition-colors outline-none"
                                    >
                                        Start <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};