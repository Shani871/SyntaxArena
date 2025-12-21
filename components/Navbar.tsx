import React from 'react';
import { GameMode } from '../types';
import { Sword, BookOpen, Settings, User, BarChart2, LayoutDashboard, Share2, FileText, GraduationCap, Terminal, BrainCircuit, Briefcase, Code, Swords, Boxes } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  setMode: (mode: GameMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: GameMode.HOME, icon: <Terminal size={24} />, label: "Home" },
    { mode: GameMode.DASHBOARD, icon: <LayoutDashboard size={24} />, label: "Dashboard" },
    { mode: GameMode.PRACTICE, icon: <Code size={24} />, label: "Practice" },
    { mode: GameMode.ARENA, icon: <Swords size={24} />, label: "Arena" },
    { mode: GameMode.BATTLE, icon: <Sword size={24} />, label: "Battle" },
    { mode: GameMode.APTITUDE, icon: <BrainCircuit size={24} />, label: "Aptitude" },
    { mode: GameMode.JOBS, icon: <Briefcase size={24} />, label: "Jobs" },
    { mode: GameMode.RESUME_BUILDER, icon: <FileText size={24} />, label: "Resume" },
    { mode: GameMode.VISUALIZER, icon: <BookOpen size={24} />, label: "Visualizer" },
    { mode: GameMode.PLAYGROUND, icon: <Boxes size={24} />, label: "Playground" },
    { mode: GameMode.TUTORIALS, icon: <GraduationCap size={24} />, label: "Tutorials" },
    { mode: GameMode.DOCS, icon: <FileText size={24} />, label: "Docs" },
    { mode: GameMode.LEADERBOARD, icon: <BarChart2 size={24} />, label: "Leaderboard" },
    { mode: GameMode.PROFILE, icon: <User size={24} />, label: "Profile" },
    { mode: GameMode.SETTINGS, icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <nav className="w-full h-16 bg-[#0a0a0b] border-t border-white/5 shrink-0 flex flex-row justify-between items-center md:h-full md:w-20 md:flex-col md:justify-start md:border-t-0 md:border-r md:bg-[#0a0a0b] z-50 transition-colors duration-500">

      {/* Top Section / Logo (Desktop) */}
      <div className="hidden md:flex flex-col items-center pt-6 pb-4 shrink-0">
        {/* Logo */}
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => setMode(GameMode.HOME)}>
          <defs>
            <linearGradient id="nav_logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M50 10L89 32.5V77.5L50 100L11 77.5V32.5L50 10Z" stroke="url(#nav_logo_grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 48L22 58L35 68" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M65 48L78 58L65 68" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Navigation Items - Scrollable on Desktop */}
      <div className="flex flex-row justify-start w-full md:flex-col md:w-full md:gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:scrollbar-thin md:scrollbar-thumb-[#333] h-full md:h-full items-center md:items-stretch px-2 md:px-0 md:pb-4 flex-1 min-h-0">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            title={item.label}
            className={`group relative flex items-center justify-center p-3 md:py-4 min-w-[3rem] md:w-auto transition-all duration-300 ease-out ${currentMode === item.mode
              ? 'text-white scale-110'
              : 'text-[#555] hover:text-white hover:bg-white/5 hover:scale-105'
              }`}
            aria-label={item.label}
            role="button"
          >
            {/* Active Indicator with smooth transition */}
            {currentMode === item.mode && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple md:h-full md:w-1 md:right-auto md:left-0 shadow-[0_0_15px_#3b82f6] animate-gradient-shift transition-all duration-500" />
            )}

            <div className={`transition-all duration-300 ease-out flex items-center justify-center ${currentMode === item.mode ? 'scale-110 text-cyber-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>

            {/* Enhanced Tooltip for Desktop */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-r from-[#1e1e1e] to-[#252526] border border-cyber-blue/30 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 hidden md:block whitespace-nowrap z-50 font-bold tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:translate-x-1">
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-cyber-blue/30 border-b-4 border-b-transparent"></div>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};