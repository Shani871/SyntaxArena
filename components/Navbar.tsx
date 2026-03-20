import React from 'react';
import {
  BarChart2,
  BookOpen,
  Boxes,
  BrainCircuit,
  Briefcase,
  Code,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sword,
  Swords,
  Terminal,
  User,
} from 'lucide-react';
import { GameMode } from '../types';
import { BrandMark } from './BrandMark';

interface NavbarProps {
  currentMode: GameMode;
  setMode: (mode: GameMode) => void;
}

const navItems = [
  { mode: GameMode.HOME, icon: Terminal, label: 'Home' },
  { mode: GameMode.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { mode: GameMode.PRACTICE, icon: Code, label: 'Practice' },
  { mode: GameMode.ARENA, icon: Swords, label: 'Arena' },
  { mode: GameMode.BATTLE, icon: Sword, label: 'Battle' },
  { mode: GameMode.APTITUDE, icon: BrainCircuit, label: 'Aptitude' },
  { mode: GameMode.JOBS, icon: Briefcase, label: 'Jobs' },
  { mode: GameMode.RESUME_BUILDER, icon: FileText, label: 'Resume' },
  { mode: GameMode.VISUALIZER, icon: BookOpen, label: 'Visualizer' },
  { mode: GameMode.PLAYGROUND, icon: Boxes, label: 'Playground' },
  { mode: GameMode.TUTORIALS, icon: GraduationCap, label: 'Tutorials' },
  { mode: GameMode.DOCS, icon: FileText, label: 'Docs' },
  { mode: GameMode.LEADERBOARD, icon: BarChart2, label: 'Leaderboard' },
  { mode: GameMode.PROFILE, icon: User, label: 'Profile' },
  { mode: GameMode.SETTINGS, icon: Settings, label: 'Settings' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  return (
    <nav className="z-50 flex h-20 w-full shrink-0 border-t border-white/10 bg-slate-950/95 px-3 backdrop-blur-xl md:h-full md:w-[268px] md:flex-col md:border-r md:border-t-0 md:px-4 md:py-5">
      <div className="hidden md:block">
        <button
          onClick={() => setMode(GameMode.HOME)}
          className="flex w-full items-start rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-sky-400/40 hover:bg-white/[0.05]"
        >
          <BrandMark />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar md:mt-6 md:flex-col md:items-stretch md:gap-1 md:overflow-y-auto">
        {navItems.map(({ mode, icon: Icon, label }) => {
          const active = currentMode === mode;

          return (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              title={label}
              className={`group relative flex min-w-[68px] flex-col items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[11px] font-semibold transition md:min-w-0 md:flex-row md:justify-start md:px-4 md:py-3 md:text-sm ${
                active
                  ? 'bg-sky-500/16 text-white shadow-[0_14px_40px_rgba(14,165,233,0.16)]'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              {active && <div className="absolute inset-y-3 left-0 hidden w-1 rounded-full bg-gradient-to-b from-sky-400 to-emerald-400 md:block" />}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  active
                    ? 'border-sky-400/40 bg-sky-500/18 text-sky-300'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 group-hover:border-white/20 group-hover:text-white'
                }`}
              >
                <Icon size={18} />
              </div>
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
