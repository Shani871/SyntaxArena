import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './views/Landing';
import { BattleArena } from './views/BattleArena';
import { Visualizer } from './views/Visualizer';
import { Leaderboard } from './views/Leaderboard';
import { Dashboard } from './views/Dashboard';
import { Playground } from './views/Playground';
import { Tutorials } from './views/Tutorials';
import { Documentation } from './views/Documentation';
import { Auth } from './views/Auth';
import { Profile } from './views/Profile';
import { AptitudeTest } from './views/AptitudeTest';
import { Jobs } from './views/Jobs';
import { Settings } from './views/Settings';
import { ArenaLobby } from './views/ArenaLobby';
import { ResumeBuilder } from './views/ResumeBuilder';
import { Blackhole } from './components/Blackhole';
import { GameMode } from './types';
import { MessageSquare } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<GameMode>(GameMode.AUTH);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Wrapper to switch mode
  const handleSetMode = (newMode: GameMode) => {
    setMode(newMode);
  };

  const renderView = () => {
    switch (mode) {
      case GameMode.AUTH:
        return <Auth setMode={handleSetMode} />;
      case GameMode.HOME:
        return <Landing setMode={handleSetMode} />;
      case GameMode.DASHBOARD:
        return <Dashboard setMode={handleSetMode} />;
      case GameMode.BATTLE:
      case GameMode.ASSESSMENT:
        return <BattleArena key={mode} mode={mode} />;
      case GameMode.PRACTICE:
        return <BattleArena key="practice" mode={GameMode.PRACTICE} />;
      case GameMode.ARENA:
        return <ArenaLobby setMode={handleSetMode} />;
      case GameMode.VISUALIZER:
        return <Visualizer />;
      case GameMode.PLAYGROUND:
        return <Playground />;
      case GameMode.TUTORIALS:
        return <Tutorials />;
      case GameMode.DOCS:
        return <Documentation />;
      case GameMode.LEADERBOARD:
        return <Leaderboard />;
      case GameMode.PROFILE:
        return <Profile />;
      case GameMode.APTITUDE:
        return <AptitudeTest />;
      case GameMode.JOBS:
        return <Jobs />;
      case GameMode.SETTINGS:
        return <Settings />;
      case GameMode.RESUME_BUILDER:
        return <ResumeBuilder setMode={handleSetMode} />;
      default:
        return <Landing setMode={handleSetMode} />;
    }
  };

  return (
    // Main App Container
    // Uses flex-col-reverse on mobile (Navbar at bottom) and flex-row on desktop (Navbar at left)
    // h-full ensures it takes the full 100vh provided by #root
    <div className="w-full h-full flex flex-col-reverse md:flex-row bg-[#0f0f10] text-slate-200 font-sans overflow-hidden">

      {/* Navigation (Flex Item, shrink-0) */}
      {mode !== GameMode.AUTH && (
        <Navbar
          currentMode={mode}
          setMode={handleSetMode}
        />
      )}

      {/* Main Content Area (Flex Item, flex-1) */}
      {/* overflow-hidden ensures internal scroll containers work properly */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#0f0f10]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBWMHptNDAgMEwwIDAiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1c2UoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.03] pointer-events-none -z-10"></div>

        {/* View Container - Flex-1 to consume all available space in main */}
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden relative">
          {renderView()}
        </div>

        {/* Chatbot Floating Button & Interface */}
        {mode !== GameMode.AUTH && (
          <>
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="absolute bottom-6 right-6 p-4 bg-cyber-purple hover:bg-purple-600 text-white rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all hover:scale-110 z-50 group animate-bounce-subtle"
                title="Open AI Assistant"
              >
                <MessageSquare size={24} fill="currentColor" className="text-white" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#18181b] border border-[#333] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                  Blackhole AI
                </span>
              </button>
            )}

            {isChatOpen && <Blackhole onClose={() => setIsChatOpen(false)} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;