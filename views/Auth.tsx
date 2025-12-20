import React, { useState } from 'react';
import { GameMode } from '../types';
import { User, Lock, Mail, ArrowRight, Github, ShieldCheck, Loader2 } from 'lucide-react';

interface AuthProps {
    setMode: (mode: GameMode) => void;
}

export const Auth: React.FC<AuthProps> = ({ setMode }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Social login loading states
    const [socialLoading, setSocialLoading] = useState<'GOOGLE' | 'GITHUB' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API authentication delay
        setTimeout(() => {
            setLoading(false);
            setMode(GameMode.DASHBOARD);
        }, 1500);
    };

    const handleSocialAuth = (provider: 'GOOGLE' | 'GITHUB') => {
        setSocialLoading(provider);
        setTimeout(() => {
            setSocialLoading(null);
            setMode(GameMode.DASHBOARD);
        }, 1800);
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-start relative overflow-y-auto bg-[#0a0a0b] text-slate-200 font-mono scrollbar-hide pt-12 md:pt-24">
            {/* High-End Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                {/* Visual Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                {/* Moving Code Fragments or Light Streaks */}
                <div className="absolute top-1/4 left-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-1/2 animate-scan-slow"></div>
            </div>

            {/* Auth Card - Premium Glassmorphism */}
            <div className="relative z-10 w-full max-w-[360px] p-5 md:p-7 bg-[#161617]/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in mx-4 my-6 md:my-10 overflow-hidden group shrink-0">
                {/* Subtle Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Header */}
                <div className="text-center mb-8 relative">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyber-blue/30 blur-2xl rounded-full scale-110"></div>
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 animate-float">
                                <defs>
                                    <linearGradient id="auth_logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#60a5fa" />
                                        <stop offset="100%" stopColor="#a78bfa" />
                                    </linearGradient>
                                </defs>
                                <path d="M50 5L93.3 30V80L50 105L6.7 80V30L50 5Z" fill="url(#auth_logo_grad)" fillOpacity="0.1" />
                                <path d="M50 10L89 32.5V77.5L50 100L11 77.5V32.5L50 10Z" stroke="url(#auth_logo_grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M35 48L22 58L35 68" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M65 48L78 58L65 68" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="50" y1="75" x2="58" y2="35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1 select-none">
                        SYNTAX<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ARENA</span>
                    </h1>
                    <div className="h-1 w-12 bg-cyber-blue mx-auto rounded-full mb-4"></div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
                        {isLogin ? 'Authorization Required' : 'Initialize Protocol'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Terminal Handle</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyber-blue transition-colors">
                                    <User size={16} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-1 focus:ring-cyber-blue/50 focus:border-cyber-blue/50 block w-full pl-10 p-3 outline-none transition-all placeholder-slate-600 hover:bg-white/[0.07]"
                                    placeholder="NeoCoder"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Network Identity</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyber-blue transition-colors">
                                <Mail size={16} />
                            </div>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-1 focus:ring-cyber-blue/50 focus:border-cyber-blue/50 block w-full pl-10 p-3 outline-none transition-all placeholder-slate-600 hover:bg-white/[0.07]"
                                placeholder="dev@syntaxarena.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Credentials</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyber-blue transition-colors">
                                <Lock size={16} />
                            </div>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-1 focus:ring-cyber-blue/50 focus:border-cyber-blue/50 block w-full pl-10 p-3 outline-none transition-all placeholder-slate-600 hover:bg-white/[0.07]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <button type="button" className="text-[10px] text-slate-500 hover:text-cyber-blue uppercase tracking-wider font-bold transition-colors">Restore Data</button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !!socialLoading}
                        className="w-full h-12 relative overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 group/btn disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Transmitting...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Establish Connection' : 'Register User'} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                {/* Divider with High-End Look */}
                <div className="flex items-center my-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <div className="px-4 text-[10px] text-slate-600 font-black tracking-widest">SECURE LINK</div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                {/* Enhanced Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleSocialAuth('GITHUB')}
                        disabled={loading || !!socialLoading}
                        className="flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/[0.1] border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {socialLoading === 'GITHUB' ? <Loader2 size={14} className="animate-spin text-cyber-blue" /> : <Github size={16} />}
                        {socialLoading === 'GITHUB' ? 'Linking...' : 'GitHub'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialAuth('GOOGLE')}
                        disabled={loading || !!socialLoading}
                        className="flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/[0.1] border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {socialLoading === 'GOOGLE' ? <Loader2 size={14} className="animate-spin text-red-400" /> : <ShieldCheck size={16} className="text-red-400" />}
                        {socialLoading === 'GOOGLE' ? 'Verifying...' : 'Google'}
                    </button>
                </div>

                {/* Toggle Mode */}
                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {isLogin ? "New to the Arena?" : "Existing Network Identity?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white hover:text-cyber-blue font-black underline decoration-cyber-blue/50 underline-offset-4 transition-all ml-1"
                        >
                            {isLogin ? 'Join Collective' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Footer Stats - Centered relative to the card */}
            <div className="mt-auto md:mt-8 pb-8 md:pb-4 text-center text-[10px] text-[#444] space-x-4 shrink-0">
                <span>USERS: 14,203</span>
                <span>•</span>
                <span>BATTLES: 89,102</span>
                <span>•</span>
                <span>STATUS: ONLINE</span>
            </div>
        </div>
    );
};