import React, { useState, useEffect } from 'react';
import { GameMode } from '../types';
import { Shield, Sword, Zap, Calendar, Clock, CheckCircle2, Cpu, BarChart2, Globe, Users } from 'lucide-react';

interface LandingProps {
    setMode: (mode: GameMode) => void;
}

export const Landing: React.FC<LandingProps> = ({ setMode }) => {
    const [text, setText] = useState('');
    const fullText = "> Initializing competitive environment...\n> The ultimate platform to Learn, Battle, and Visualize backend systems.";
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleData, setScheduleData] = useState({ date: '', time: '' });
    const [scheduleSuccess, setScheduleSuccess] = useState(false);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, []);

    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setScheduleSuccess(true);
        setTimeout(() => {
            setShowScheduleModal(false);
            setScheduleSuccess(false);
            setScheduleData({ date: '', time: '' });
        }, 2000);
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#0f0f10] font-mono text-sm overflow-hidden">
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                <div className="min-h-full w-full flex flex-col items-center justify-start p-4 md:p-8 pb-24 animate-fade-in relative z-10">

                    {/* HERO SECTION */}
                    <div className="w-full max-w-7xl flex flex-col items-center py-12 md:py-20 text-center">
                        <div className="mb-8 relative group cursor-default">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-all duration-1000 animate-gradient-shift"></div>
                            <div className="relative flex items-center gap-4 bg-gradient-to-br from-[#1e1e1e] to-[#252526] px-8 py-4 rounded-full border border-cyber-blue/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] transition-all duration-500 hover:scale-105 glass-effect">
                                <div className="animate-float">
                                    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                                        <defs>
                                            <linearGradient id="landing_logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M50 10L89 32.5V77.5L50 100L11 77.5V32.5L50 10Z" stroke="url(#landing_logo_grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M35 48L22 58L35 68" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M65 48L78 58L65 68" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="50" y1="75" x2="58" y2="35" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyber-blue-light to-white bg-clip-text text-transparent tracking-tighter animate-gradient-shift">
                                    SyntaxArena<span className="text-cyber-blue blink">_</span>
                                </h1>
                            </div>
                        </div>

                        <div className="max-w-2xl h-16 mb-10 glass-effect p-3 rounded-lg border border-cyber-blue/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] w-full text-sm text-[#858585] overflow-hidden flex items-center mx-auto justify-center hover:border-cyber-blue/40 transition-all duration-500">
                            <span className="whitespace-pre-wrap">{text}</span>
                            <span className="animate-pulse inline-block w-2 h-4 bg-cyber-neon ml-1 align-middle shadow-[0_0_10px_#10b981]"></span>
                        </div>

                        {/* Main Action Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-20">
                            <div onClick={() => setMode(GameMode.BATTLE)} className="cursor-pointer glass-effect hover:bg-[#2a2a2a]/70 p-6 rounded-xl border border-[#333] hover:border-cyber-danger/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(239,68,68,0.3)] transform-gpu animate-fade-in" style={{ animationDelay: '0ms' }}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-danger transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top shadow-[0_0_20px_#ef4444]"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-danger/0 via-cyber-danger/0 to-cyber-danger/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Sword size={32} className="text-cyber-danger mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">PvP Arena</h3>
                                <p className="text-xs text-[#858585] group-hover:text-gray-400 transition-colors relative z-10">1v1 real-time coding duels with fog-of-war logic.</p>
                            </div>

                            <div onClick={() => setMode(GameMode.ASSESSMENT)} className="cursor-pointer glass-effect hover:bg-[#2a2a2a]/70 p-6 rounded-xl border border-[#333] hover:border-cyber-blue/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] transform-gpu animate-fade-in" style={{ animationDelay: '100ms' }}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-blue transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top shadow-[0_0_20px_#3b82f6]"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/0 via-cyber-blue/0 to-cyber-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Shield size={32} className="text-cyber-blue mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Invigilator</h3>
                                <p className="text-xs text-[#858585] group-hover:text-gray-400 transition-colors relative z-10">Gemini-powered cheat detection for assessments.</p>
                            </div>

                            <div onClick={() => setMode(GameMode.VISUALIZER)} className="cursor-pointer glass-effect hover:bg-[#2a2a2a]/70 p-6 rounded-xl border border-[#333] hover:border-cyber-neon/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)] transform-gpu animate-fade-in" style={{ animationDelay: '200ms' }}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-neon transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top shadow-[0_0_20px_#10b981]"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-neon/0 via-cyber-neon/0 to-cyber-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Zap size={32} className="text-cyber-neon mb-4 group-hover:scale-125 transition-all duration-500 relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:animate-pulse" />
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Visualizer</h3>
                                <p className="text-xs text-[#858585] group-hover:text-gray-400 transition-colors relative z-10">Step-by-step execution analysis and breakdown.</p>
                            </div>

                            <div onClick={() => setShowScheduleModal(true)} className="cursor-pointer glass-effect hover:bg-[#2a2a2a]/70 p-6 rounded-xl border border-[#333] hover:border-cyber-purple/50 transition-all duration-500 group relative overflow-hidden shadow-lg hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(139,92,246,0.3)] transform-gpu animate-fade-in" style={{ animationDelay: '300ms' }}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-purple transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top shadow-[0_0_20px_#8b5cf6]"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/0 via-cyber-purple/0 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Calendar size={32} className="text-cyber-purple mb-4 group-hover:scale-125 transition-all duration-500 relative z-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Schedule</h3>
                                <p className="text-xs text-[#858585] group-hover:text-gray-400 transition-colors relative z-10">Book a future duel. Challenge a friend or rival.</p>
                            </div>
                        </div>

                        {/* HOW IT WORKS SECTION */}
                        <div className="w-full max-w-6xl mb-24 text-left">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                                <Cpu className="text-cyber-blue" /> How It Works
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="relative pl-8 border-l border-[#333]">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-cyber-blue"></div>
                                    <h4 className="text-lg font-bold text-white mb-2">1. Connect & Match</h4>
                                    <p className="text-[#858585] text-sm leading-relaxed">
                                        Our ranked matchmaking system pairs you with developers of similar skill levels using Elo ratings.
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l border-[#333]">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-cyber-purple"></div>
                                    <h4 className="text-lg font-bold text-white mb-2">2. Code in Real-time</h4>
                                    <p className="text-[#858585] text-sm leading-relaxed">
                                        Solve complex backend problems in our IDE. The AI Invigilator monitors logic and provides Socratic hints.
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l border-[#333]">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-cyber-neon"></div>
                                    <h4 className="text-lg font-bold text-white mb-2">3. Analyze & Improve</h4>
                                    <p className="text-[#858585] text-sm leading-relaxed">
                                        Get detailed post-match analytics, visualize your execution flow, and climb the global leaderboard.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STATS SECTION */}
                        <div className="w-full max-w-6xl bg-[#1e1e1e] border border-[#333] rounded-xl p-8 mb-20">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                                    <div className="text-xs text-[#858585] uppercase tracking-wider font-bold">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-cyber-blue mb-1">500k+</div>
                                    <div className="text-xs text-[#858585] uppercase tracking-wider font-bold">Code Submissions</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-cyber-purple mb-1">99.9%</div>
                                    <div className="text-xs text-[#858585] uppercase tracking-wider font-bold">Uptime</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-cyber-neon mb-1">24/7</div>
                                    <div className="text-xs text-[#858585] uppercase tracking-wider font-bold">AI Support</div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="w-full border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center text-[#555] text-xs">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <Globe size={14} /> SyntaxArena Global Network
                            </div>
                            <div className="flex gap-6">
                                <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
                                <span className="hover:text-white cursor-pointer transition-colors">Terms of Engagement</span>
                                <span className="hover:text-white cursor-pointer transition-colors">System Status</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl p-0 w-full max-w-md overflow-hidden animate-slide-up mx-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1"></div>
                        <div className="p-6">
                            {!scheduleSuccess ? (
                                <>
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                        <Calendar size={24} className="text-cyber-purple" /> Schedule Battle
                                    </h2>
                                    <p className="text-[#858585] text-sm mb-6">Select a date and time to challenge a rival.</p>

                                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#858585] uppercase mb-1">Date</label>
                                            <div className="relative">
                                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                                                <input
                                                    type="date"
                                                    required
                                                    value={scheduleData.date}
                                                    onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })}
                                                    className="w-full bg-[#252526] border border-[#333] rounded px-3 py-2 pl-10 text-white text-sm focus:border-cyber-blue outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#858585] uppercase mb-1">Time</label>
                                            <div className="relative">
                                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                                                <input
                                                    type="time"
                                                    required
                                                    value={scheduleData.time}
                                                    onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })}
                                                    className="w-full bg-[#252526] border border-[#333] rounded px-3 py-2 pl-10 text-white text-sm focus:border-cyber-blue outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowScheduleModal(false)}
                                                className="flex-1 py-2 bg-[#252526] hover:bg-[#333] text-[#ccc] font-bold text-sm rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 bg-cyber-purple hover:bg-purple-600 text-white font-bold text-sm rounded shadow-lg transition-colors"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4 animate-bounce" />
                                    <h3 className="text-xl font-bold text-white mb-1">Battle Scheduled!</h3>
                                    <p className="text-[#858585] text-sm">We'll notify you when it starts.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};