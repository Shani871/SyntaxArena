import React, { useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { TodoItem } from '../types';
import { Trophy, Flame, Target, CheckSquare, Plus, Trash2, Book, Code, ArrowUpRight, Sparkles, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { apiService, DashboardStats } from '../services/apiService';

interface DashboardProps {
    // toggleBlackhole?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: '1', text: 'Master REST API concepts', completed: true },
        { id: '2', text: 'Visualize JWT flow', completed: false },
        { id: '3', text: 'Complete DB Indexing tutorial', completed: false },
    ]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            const data = await apiService.getDashboardStats();
            if (data) setStats(data);
            setLoading(false);
        };
        fetchStats();
        // Poll every 5s for "real-time" feel
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

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

    const activityData = stats?.activityData || [
        { day: 'Mon', current: 0, previous: 0 },
        { day: 'Tue', current: 0, previous: 0 },
        { day: 'Wed', current: 0, previous: 0 },
        { day: 'Thu', current: 0, previous: 0 },
        { day: 'Fri', current: 0, previous: 0 },
        { day: 'Sat', current: 0, previous: 0 },
        { day: 'Sun', current: 0, previous: 0 },
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
        <div className="h-full w-full flex flex-col bg-[#1e1e1e] overflow-hidden font-mono text-sm">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-700">
                <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-24">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2">
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform ring-4 ring-[#252526]">
                                    {stats?.username.slice(0, 2).toUpperCase() || "GU"}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-[#1e1e1e] rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                    Welcome back, {stats?.username || "Guest"} <Sparkles size={18} className="text-yellow-400 animate-pulse" />
                                </h1>
                                <div className="flex items-center gap-3 mt-1 text-[#858585]">
                                    <span className="bg-[#333] px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-[#444]">Lvl {Math.floor((stats?.xp || 0) / 1000)} Architect</span>
                                    <span>•</span>
                                    <span className="text-cyber-blue font-bold">{(stats?.xp || 0).toLocaleString()} XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="px-4 py-2 bg-[#252526] hover:bg-[#333] border border-[#333] text-white rounded text-xs transition-colors flex-1 md:flex-initial font-bold">Edit Profile</button>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded text-xs font-bold transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transform flex-1 md:flex-initial">Resume Builder</button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#252526] p-6 rounded-xl border border-[#333] flex items-center gap-5 hover:border-[#555] transition-all hover:-translate-y-1 shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 bg-cyber-purple/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="p-4 bg-[#1e1e1e] text-cyber-purple rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-[#333] shadow-inner group-hover:scale-110 transition-transform"><Trophy size={28} /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Global Rank</div>
                                <div className="text-3xl font-black text-white">#{stats?.rank || "-"} <span className="text-xs text-green-500 font-bold ml-2 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/30">▲ 3</span></div>
                            </div>
                        </div>
                        <div className="bg-[#252526] p-6 rounded-xl border border-[#333] flex items-center gap-5 hover:border-[#555] transition-all hover:-translate-y-1 shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 bg-cyber-danger/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="p-4 bg-[#1e1e1e] text-cyber-danger rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-[#333] shadow-inner group-hover:scale-110 transition-transform"><Flame size={28} /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Daily Streak</div>
                                <div className="text-3xl font-black text-white">{stats?.streak || 0} <span className="text-xs text-[#666] font-bold">Days</span></div>
                            </div>
                        </div>
                        <div className="bg-[#252526] p-6 rounded-xl border border-[#333] flex items-center gap-5 hover:border-[#555] transition-all hover:-translate-y-1 shadow-lg h-full group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 bg-cyber-blue/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="p-4 bg-[#1e1e1e] text-cyber-blue rounded-xl flex items-center justify-center h-16 w-16 shrink-0 border border-[#333] shadow-inner group-hover:scale-110 transition-transform"><Target size={28} /></div>
                            <div className="relative z-10">
                                <div className="text-[#858585] text-[10px] uppercase tracking-wider font-bold mb-1">Tutorials</div>
                                <div className="text-3xl font-black text-white">{stats?.recentTutorials.length || 0} <span className="text-xs text-[#666] font-bold">Done</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                        {/* Learning Progress */}
                        <div className="bg-[#252526] rounded-xl border border-[#333] flex flex-col overflow-hidden shadow-lg h-full min-h-[320px]">
                            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#2d2d2d]/50 backdrop-blur-sm">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <Book size={18} className="text-cyber-neon" /> Current Path
                                </h2>
                                <button className="text-xs text-cyber-blue hover:text-white flex items-center gap-1 transition-colors font-bold">
                                    View Curriculum <ArrowUpRight size={12} />
                                </button>
                            </div>
                            <div className="p-6 space-y-8 flex-1 flex flex-col justify-center relative">
                                {/* Background lines */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

                                <div className="group cursor-pointer relative z-10">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-neon"></div> Backend Fundamentals</span>
                                        <span className="font-mono">80%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333]">
                                        <div className="h-full bg-cyber-neon w-[80%] shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out group-hover:w-[82%]"></div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer relative z-10">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-blue"></div> Database Design</span>
                                        <span className="font-mono">33%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333]">
                                        <div className="h-full bg-cyber-blue w-[33%] shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out group-hover:w-[35%]"></div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer relative z-10">
                                    <div className="flex justify-between text-xs mb-2 text-[#ccc] group-hover:text-white transition-colors">
                                        <span className="font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyber-danger"></div> API Security</span>
                                        <span className="font-mono">25%</span>
                                    </div>
                                    <div className="h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#333]">
                                        <div className="h-full bg-cyber-danger w-[25%] shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out group-hover:w-[27%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Todo List */}
                        <div className="bg-[#252526] rounded-xl border border-[#333] flex flex-col overflow-hidden shadow-lg h-full min-h-[320px]">
                            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#2d2d2d]/50 backdrop-blur-sm">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <CheckSquare size={18} className="text-cyber-blue" /> Priority Tasks
                                </h2>
                                <span className="text-[10px] font-bold bg-[#333] px-2 py-1 rounded text-white border border-[#444]">{todos.filter(t => !t.completed).length} PENDING</span>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-2 max-h-[250px] lg:max-h-none">
                                {todos.map(todo => (
                                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] rounded-lg transition-all group shadow-sm hover:border-[#555]">
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${todo.completed ? 'bg-cyber-blue border-cyber-blue' : 'border-[#555] hover:border-cyber-blue'}`}
                                        >
                                            {todo.completed && <CheckSquare size={14} className="text-white" />}
                                        </button>
                                        <span className={`flex-1 text-xs font-medium ${todo.completed ? 'text-[#555] line-through decoration-2' : 'text-gray-300'}`}>
                                            {todo.text}
                                        </span>
                                        <button onClick={() => deleteTodo(todo.id)} className="text-[#555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
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
                        <div className="col-span-1 lg:col-span-2 bg-[#252526] rounded-xl border border-[#333] flex flex-col overflow-hidden shadow-lg min-h-[350px]">
                            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#2d2d2d]/50 backdrop-blur-sm">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-500 fill-yellow-500" /> Activity Metrics
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 text-gray-400"><span className="w-2 h-2 rounded-full bg-cyber-purple"></span> Previous</div>
                                        <div className="flex items-center gap-1.5 text-white"><span className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#3b82f6]"></span> Current</div>
                                    </div>
                                    <select className="bg-[#1e1e1e] border border-[#333] text-[10px] font-bold text-white px-2 py-1 rounded focus:outline-none focus:border-cyber-blue">
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
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', shadow: '0 0 10px #3b82f6' }}
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