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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API authentication delay
    setTimeout(() => {
        setLoading(false);
        setMode(GameMode.DASHBOARD);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-y-auto bg-cyber-dark text-slate-200 font-mono">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9),rgba(15,23,42,0.9)),url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-[#1e1e1e]/90 backdrop-blur-xl border border-[#333] rounded-2xl shadow-2xl animate-fade-in mx-4 my-10">
            
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6 group relative">
                    <div className="absolute inset-0 bg-cyber-blue/20 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                    <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-2xl group-hover:rotate-3 transition-transform duration-300 ease-out">
                        <defs>
                            <linearGradient id="auth_logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                        <path d="M50 5L93.3 30V80L50 105L6.7 80V30L50 5Z" fill="url(#auth_logo_grad)" fillOpacity="0.05" />
                        <path d="M50 10L89 32.5V77.5L50 100L11 77.5V32.5L50 10Z" stroke="url(#auth_logo_grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35 48L22 58L35 68" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M65 48L78 58L65 68" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="50" y1="75" x2="58" y2="35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">SyntaxArena<span className="text-cyber-blue">_</span></h1>
                <p className="text-[#858585] text-sm">
                    {isLogin ? 'Authenticate to access the mainframe.' : 'Initialize new developer protocol.'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#858585] uppercase tracking-wider ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555] group-focus-within:text-cyber-blue transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full bg-[#252526] border border-[#333] text-white text-sm rounded-lg focus:ring-2 focus:ring-cyber-blue/50 focus:border-cyber-blue block w-full pl-10 p-2.5 outline-none transition-all placeholder-[#555]" 
                                placeholder="NeoCoder"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#858585] uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555] group-focus-within:text-cyber-blue transition-colors">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#252526] border border-[#333] text-white text-sm rounded-lg focus:ring-2 focus:ring-cyber-blue/50 focus:border-cyber-blue block w-full pl-10 p-2.5 outline-none transition-all placeholder-[#555]" 
                            placeholder="dev@syntaxarena.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#858585] uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555] group-focus-within:text-cyber-blue transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[#252526] border border-[#333] text-white text-sm rounded-lg focus:ring-2 focus:ring-cyber-blue/50 focus:border-cyber-blue block w-full pl-10 p-2.5 outline-none transition-all placeholder-[#555]" 
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {isLogin && (
                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-cyber-blue hover:text-blue-400 hover:underline">Forgot password?</a>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30 group"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Authenticating...
                        </>
                    ) : (
                        <>
                            {isLogin ? 'Access System' : 'Create Account'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="w-full h-px bg-[#333]"></div>
                <div className="px-3 text-xs text-[#555] font-medium">OR</div>
                <div className="w-full h-px bg-[#333]"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#252526] hover:bg-[#333] border border-[#333] rounded-lg text-white text-xs transition-colors group">
                    <Github size={16} className="group-hover:text-white" /> Github
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#252526] hover:bg-[#333] border border-[#333] rounded-lg text-white text-xs transition-colors group">
                    <ShieldCheck size={16} className="text-green-500" /> Google
                </button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
                <p className="text-sm text-[#858585]">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-cyber-blue hover:text-white font-bold hover:underline transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
            
            {/* Footer Stats - Centered relative to the card */}
            <div className="mt-8 pt-4 border-t border-[#333] text-center text-[10px] text-[#444] space-x-4">
                <span>USERS: 14,203</span>
                <span>•</span>
                <span>BATTLES: 89,102</span>
                <span>•</span>
                <span>STATUS: ONLINE</span>
            </div>
        </div>
    </div>
  );
};