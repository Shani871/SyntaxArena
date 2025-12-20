import React, { useState } from 'react';
import { MOCK_USER } from '../constants';
import { TodoItem, GameMode } from '../types';
import { Trophy, Flame, Target, CheckSquare, Plus, Trash2, Book, Code, ArrowUpRight, Sparkles, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
    setMode?: (mode: GameMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setMode }) => {
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: '1', text: 'Master REST API concepts', completed: true },
        { id: '2', text: 'Visualize JWT flow', completed: false },
        { id: '3', text: 'Complete DB Indexing tutorial', completed: false },
    ]);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const activityData = [
        { day: 'Mon', current: 12, previous: 8 },
        { day: 'Tue', current: 18, previous: 10 },
        { day: 'Wed', current: 15, previous: 12 },
        { day: 'Thu', current: 25, previous: 15 },
        { day: 'Fri', current: 20, previous: 18 },
        { day: 'Sat', current: 32, previous: 22 },
        { day: 'Sun', current: 28, previous: 14 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1e1e1e] border border-[#333] p-3 rounded-lg shadow-xl">
                    <p className="text-xs text-[#858585] mb-2 font-bold uppercase tracking-wider">{label}</p>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-cyber-blue flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6]"></span>
                            Current: {payload[0].value}
                        </p>
                        <p className="text-sm font-bold text-cyber-purple flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-purple shadow-[0_0_8px_#8b5cf6]"></span>
                            Previous: {payload[1].value}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#0a0a0b] overflow-hidden font-mono text-sm relative">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 relative z-10">
                <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-24">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-white/5 mx-1">
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-[-4px] bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity"></div>
                                <div className="relative w-16 h-16 rounded-full bg-[#161617] border border-white/10 flex items-center justify-center text-2xl font-black text-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-blue-500/50 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                                    {MOCK_USER.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0b] rounded-full shadow-[0_0_10px_#22c55e]"></div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{MOCK_USER.username}</span> <Sparkles size={18} className="text-yellow-400 animate-pulse" />
                                </h1>
                                <div className="flex items-center gap-3 mt-1.5 ">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-black text-slate-400">
                                        <Zap size={10} className="text-blue-400" /> Lvl 12 Architect
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-cyber-blue font-black tracking-wider text-[11px] uppercase">{MOCK_USER.xp.toLocaleString()} XP COLLECTED</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="px-4 py-2 bg-[#252526] hover:bg-[#333] border border-[#333] text-white rounded text-xs transition-colors flex-1 md:flex-initial font-bold">Edit Profile</button>
                            <button
                                onClick={() => setMode?.(GameMode.RESUME_BUILDER)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded text-xs font-bold transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transform flex-1 md:flex-initial"
                            >
                                Resume Builder
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-[#252526] to-[#1e1e1e] p-6 rounded-xl border border-cyber-purple/30 flex items-center gap-5 hover:border-cyber-purple/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)] shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-4 bg-gradient-to-br from-cyber-purple/10 to-cyber-purple/5 text-cyber-purple rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-cyber-purple/20 shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-500 relative z-10"><Trophy size={28} className="animate-float" /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Global Rank</div>
                                <div className="text-3xl font-black text-white">#42 <span className="text-xs text-green-500 font-bold ml-2 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/30">▲ 3</span></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#252526] to-[#1e1e1e] p-6 rounded-xl border border-cyber-danger/30 flex items-center gap-5 hover:border-cyber-danger/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(239,68,68,0.2)] shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-danger/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-4 bg-gradient-to-br from-cyber-danger/10 to-cyber-danger/5 text-cyber-danger rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-cyber-danger/20 shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-500 relative z-10"><Flame size={28} className="group-hover:animate-pulse" /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Daily Streak</div>
                                <div className="text-3xl font-black text-white">{MOCK_USER.streak} <span className="text-xs text-[#666] font-bold">Days</span></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#252526] to-[#1e1e1e] p-6 rounded-xl border border-cyber-blue/30 flex items-center gap-5 hover:border-cyber-blue/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)] shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-4 bg-gradient-to-br from-cyber-blue/10 to-cyber-blue/5 text-cyber-blue rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-cyber-blue/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 relative z-10"><Target size={28} /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Tutorials</div>
                                <div className="text-3xl font-black text-white">{MOCK_USER.tutorialsCompleted.length} <span className="text-xs text-[#666] font-bold">Done</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                        {/* Learning Progress */}
                        <div className="bg-[#161617]/40 backdrop-blur-xl rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl h-full min-h-[320px] group/card">
                            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyber-neon shadow-[0_0_8px_#10b981]"></div> Active Training Path
                                </h2>
                                <button className="text-[10px] text-cyber-blue hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-widest">
                                    Syllabus <ArrowUpRight size={12} />
                                </button>
                            </div>
                            <div className="p-8 space-y-10 flex-1 flex flex-col justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

                                <div className="group cursor-pointer relative z-10 transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-neon shadow-[0_0_8px_#10b981] animate-glow-pulse"></div> Backend Fundamentals</span>
                                        <span className="font-mono font-bold">80%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333] shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-cyber-neon to-cyber-neon-light w-[80%] shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out group-hover:w-[82%] relative overflow-hidden">
                                            <div className="absolute inset-0 animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer relative z-10 transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6] animate-glow-pulse"></div> Database Design</span>
                                        <span className="font-mono font-bold">33%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333] shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-cyber-blue to-cyber-blue-light w-[33%] shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out group-hover:w-[35%] relative overflow-hidden">
                                            <div className="absolute inset-0 animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer relative z-10 transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-danger shadow-[0_0_8px_#ef4444] animate-glow-pulse"></div> API Security</span>
                                        <span className="font-mono font-bold">25%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333] shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-cyber-danger to-red-400 w-[25%] shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out group-hover:w-[27%] relative overflow-hidden">
                                            <div className="absolute inset-0 animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Todo List */}
                        <div className="bg-[#161617]/40 backdrop-blur-xl rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl h-full min-h-[320px] group/todo">
                            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6]"></div> Priority Protocols
                                </h2>
                                <span className="text-[10px] font-black bg-white/5 px-2.5 py-1 rounded text-slate-400 border border-white/10 uppercase tracking-widest">{todos.filter(t => !t.completed).length} Pending</span>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-3 max-h-[250px] lg:max-h-none scrollbar-thin scrollbar-thumb-white/5">
                                {todos.map(todo => (
                                    <div key={todo.id} className="flex items-center gap-3 p-3 glass-effect hover:bg-[#2a2a2a]/70 border border-[#333] rounded-lg transition-all duration-300 group shadow-sm hover:border-cyber-blue/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.1)] animate-slide-in-left">
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${todo.completed ? 'bg-cyber-blue border-cyber-blue scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-[#555] hover:border-cyber-blue hover:scale-110'}`}
                                        >
                                            {todo.completed && <CheckSquare size={14} className="text-white animate-scale-in" />}
                                        </button>
                                        <span className={`flex-1 text-xs font-medium transition-all duration-300 ${todo.completed ? 'text-[#555] line-through decoration-2' : 'text-gray-300'}`}>
                                            {todo.text}
                                        </span>
                                        <button onClick={() => deleteTodo(todo.id)} className="text-[#555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:scale-110">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {todos.length === 0 && (
                                    <div className="text-center text-[#555] py-12 flex flex-col items-center">
                                        <Sparkles size={24} className="mb-2 opacity-50" />
                                        <span className="text-xs">All tasks complete! Time to code.</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-[#333] bg-[#2d2d2d]/50">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                        placeholder="Add a new goal..."
                                        className="flex-1 bg-[#1e1e1e] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-cyber-blue outline-none text-xs transition-colors placeholder-[#555]"
                                    />
                                    <button onClick={handleAddTodo} className="bg-cyber-blue hover:bg-blue-600 text-white w-9 rounded-lg transition-colors shadow-lg flex items-center justify-center">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Activity Chart (Modernized) */}
                        <div className="col-span-1 lg:col-span-2 bg-[#161617]/40 backdrop-blur-xl rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl min-h-[350px]">
                            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Zap size={10} className="text-yellow-500 fill-yellow-500" /> Performance Metrics
                                </h2>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.15em]">
                                        <div className="flex items-center gap-1.5 text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-cyber-purple"></span> Previous</div>
                                        <div className="flex items-center gap-1.5 text-white"><span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6]"></span> Current Cycle</div>
                                    </div>
                                    <select className="bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyber-blue transition-colors">
                                        <option>Weekly View</option>
                                        <option>Monthly View</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full p-6 bg-[#252526] relative flex-1" style={{ minWidth: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            hide
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#555', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" opacity={0.3} />
                                        <Area
                                            type="monotone"
                                            dataKey="previous"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            fillOpacity={1}
                                            fill="url(#colorPrevious)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="current"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                            fillOpacity={1}
                                            fill="url(#colorCurrent)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};