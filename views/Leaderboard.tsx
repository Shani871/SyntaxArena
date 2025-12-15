import React from 'react';
import { Trophy, Medal, Flame, User, Crown, TrendingUp } from 'lucide-react';
import { LEADERBOARD_DATA, MOCK_USER } from '../constants';

export const Leaderboard: React.FC = () => {
    // Sort data by XP descending
    const sortedData = [...LEADERBOARD_DATA].sort((a, b) => b.xp - a.xp);
    const userRank = sortedData.findIndex(u => u.id === MOCK_USER.id) + 1;
    
    const topThree = sortedData.slice(0, 3);
    const restList = sortedData.slice(3);

    const renderPodiumItem = (user: typeof MOCK_USER, rank: number) => {
        const isCurrentUser = user.id === MOCK_USER.id;
        
        let heightClass = "h-32 md:h-40";
        let colorClass = "bg-[#252526] border-slate-700";
        let iconColor = "text-slate-400";
        let icon = <Medal size={24} />;
        let scale = "scale-100";
        let zIndex = "z-10";
        let order = "order-2"; // Default for rank 2 & 3

        if (rank === 1) {
            heightClass = "h-40 md:h-52";
            colorClass = "bg-gradient-to-b from-yellow-900/40 to-[#252526] border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
            iconColor = "text-yellow-400";
            icon = <Crown size={32} fill="currentColor" />;
            scale = "scale-110 md:scale-125 origin-bottom";
            zIndex = "z-20";
            order = "order-2 md:order-2"; // Center in desktop, center in mobile flex
        } else if (rank === 2) {
            heightClass = "h-32 md:h-40";
            colorClass = "bg-gradient-to-b from-slate-700/40 to-[#252526] border-slate-300";
            iconColor = "text-slate-300";
            icon = <Medal size={24} />;
            order = "order-1"; // Left
        } else if (rank === 3) {
            colorClass = "bg-gradient-to-b from-amber-900/40 to-[#252526] border-amber-700";
            iconColor = "text-amber-700";
            icon = <Medal size={24} />;
            order = "order-3"; // Right
        }

        return (
            <div className={`flex flex-col items-center ${scale} ${zIndex} ${order} transition-all duration-300 hover:-translate-y-1 relative mb-4 md:mb-0 mx-2`}>
                {isCurrentUser && (
                    <div className="absolute -top-12 animate-bounce text-cyber-blue font-bold text-[10px] md:text-xs uppercase tracking-widest bg-cyber-blue/10 px-2 py-1 rounded border border-cyber-blue/50 whitespace-nowrap">
                        You
                    </div>
                )}
                
                {/* Avatar/Icon Circle */}
                <div className={`relative mb-3`}>
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center ${colorClass} ${isCurrentUser ? 'ring-4 ring-cyber-blue ring-opacity-50' : ''}`}>
                        <span className={`font-bold text-sm md:text-lg ${iconColor}`}>{user.username.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className={`absolute -top-2 -right-2 md:-top-3 md:-right-3 ${iconColor} drop-shadow-lg transform scale-75 md:scale-100`}>
                        {icon}
                    </div>
                </div>
                
                {/* Info Card */}
                <div className={`flex flex-col items-center p-2 md:p-3 rounded-lg border w-24 md:w-40 backdrop-blur-sm ${colorClass}`}>
                    <span className={`text-[10px] md:text-xs font-bold truncate w-full text-center ${isCurrentUser ? 'text-cyber-blue' : 'text-white'}`}>
                        {user.username}
                    </span>
                    <span className={`text-xs md:text-sm font-bold mt-1 ${iconColor}`}>{user.xp.toLocaleString()} XP</span>
                    <div className="hidden md:flex items-center gap-1 text-[10px] text-[#858585] mt-1">
                        <Flame size={10} /> {user.streak} day streak
                    </div>
                </div>
                
                {/* Podium Stand */}
                <div className={`w-24 md:w-40 ${heightClass} mt-2 rounded-t-lg opacity-80 ${colorClass} flex items-end justify-center pb-4`}>
                    <span className={`text-3xl md:text-5xl font-black opacity-30 ${iconColor}`}>{rank}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e] overflow-hidden font-mono">
             <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-700">
                <div className="w-full max-w-5xl mx-auto flex flex-col min-h-full pb-24">
                     
                     {/* Header */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Hall of Fame</h1>
                                <p className="text-[#858585] text-sm">Season 5 • Top Coders by XP</p>
                            </div>
                        </div>
                        
                        {/* User Stats Summary */}
                        <div className="flex gap-4 self-start md:self-auto">
                            <div className="bg-[#252526] px-4 py-2 border border-[#333] rounded-lg min-w-[100px] flex flex-col items-center justify-center shadow-lg">
                                <span className="text-[10px] text-[#858585] uppercase block tracking-wider">Your Rank</span>
                                <div className="flex items-center gap-1">
                                     <span className="text-xl font-bold text-white">#{userRank}</span>
                                     <TrendingUp size={12} className="text-green-500" />
                                </div>
                            </div>
                             <div className="bg-[#252526] px-4 py-2 border border-[#333] rounded-lg min-w-[120px] flex flex-col items-center justify-center shadow-lg">
                                <span className="text-[10px] text-[#858585] uppercase block tracking-wider">Total XP</span>
                                <span className="text-xl font-bold text-cyber-blue">{MOCK_USER.xp.toLocaleString()}</span>
                            </div>
                        </div>
                     </div>

                     {/* Podium Section */}
                     <div className="flex justify-center items-end mb-8 shrink-0 border-b border-[#333] pb-6 min-h-[200px]">
                        {sortedData[1] && renderPodiumItem(sortedData[1], 2)}
                        {sortedData[0] && renderPodiumItem(sortedData[0], 1)}
                        {sortedData[2] && renderPodiumItem(sortedData[2], 3)}
                     </div>

                     {/* List Container */}
                     <div className="bg-[#252526] border border-[#333] rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-0">
                        {/* Sticky Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 bg-[#2d2d2d] border-b border-[#333] text-xs font-bold text-[#858585] uppercase tracking-wider sticky top-0 z-30">
                            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                            <div className="col-span-6 md:col-span-5">User</div>
                            <div className="col-span-2 text-right hidden md:block">Logic / Syntax</div>
                            <div className="col-span-2 text-center hidden md:block">Streak</div>
                            <div className="col-span-4 md:col-span-2 text-right">XP</div>
                        </div>

                        {/* Scrollable List Body */}
                        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-700 bg-[#252526]">
                            {restList.map((user, index) => {
                                const rank = index + 4; // Since we skipped top 3
                                const isCurrentUser = user.id === MOCK_USER.id;
                                
                                return (
                                    <div 
                                        key={user.id} 
                                        className={`grid grid-cols-12 gap-4 p-4 border-b border-[#333] items-center transition-all hover:bg-[#2a2d2e]
                                            ${isCurrentUser 
                                                ? 'bg-cyber-blue/10 border-l-4 border-l-cyber-blue' 
                                                : 'border-l-4 border-l-transparent'
                                            }`}
                                    >
                                        <div className={`col-span-2 md:col-span-1 flex justify-center font-bold text-lg ${isCurrentUser ? 'text-cyber-blue' : 'text-[#666]'}`}>
                                            #{rank}
                                        </div>
                                        <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center border ${isCurrentUser ? 'border-cyber-blue text-cyber-blue' : 'border-[#333] text-[#858585]'}`}>
                                                <User size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`font-bold text-sm truncate ${isCurrentUser ? 'text-cyber-blue flex items-center gap-2' : 'text-slate-200'}`}>
                                                    {user.username}
                                                    {isCurrentUser && <span className="text-[9px] bg-cyber-blue text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                                                </div>
                                                <div className="text-[10px] text-[#666] truncate">Lvl {Math.floor(user.xp / 1000)} Architect</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-right text-xs text-[#858585] hidden md:block font-mono">
                                            <span className="text-purple-400">{user.logicRating}</span> / <span className="text-blue-400">{user.codingRating}</span>
                                        </div>
                                        <div className="col-span-2 hidden md:flex justify-center items-center gap-1 text-xs text-[#ccc]">
                                             <Flame size={14} className={user.streak > 5 ? "text-orange-500 fill-orange-500" : "text-[#444]"} />
                                             {user.streak}
                                        </div>
                                        <div className={`col-span-4 md:col-span-2 text-right font-bold text-sm font-mono ${isCurrentUser ? 'text-cyber-neon' : 'text-slate-300'}`}>
                                            {user.xp.toLocaleString()} XP
                                        </div>
                                    </div>
                                )
                            })}
                            
                            {/* Empty state padding to ensure bottom content isn't cut off */}
                            <div className="h-6"></div>
                        </div>
                     </div>
                </div>
             </div>
        </div>
    )
}