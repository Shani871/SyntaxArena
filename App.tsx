import React, { Suspense, lazy, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AppLoader } from './components/AppLoader';
import { useAuth } from './components/AuthContext';
import { GameMode, ScheduledBattle } from './types';
import { readStorage, storageKeys, writeStorage } from './utils/storage';

const Landing = lazy(() => import('./views/Landing').then((module) => ({ default: module.Landing })));
const BattleArena = lazy(() => import('./views/BattleArena').then((module) => ({ default: module.BattleArena })));
const Visualizer = lazy(() => import('./views/Visualizer').then((module) => ({ default: module.Visualizer })));
const Leaderboard = lazy(() => import('./views/Leaderboard').then((module) => ({ default: module.Leaderboard })));
const Dashboard = lazy(() => import('./views/Dashboard').then((module) => ({ default: module.Dashboard })));
const Playground = lazy(() => import('./views/Playground').then((module) => ({ default: module.Playground })));
const Tutorials = lazy(() => import('./views/Tutorials').then((module) => ({ default: module.Tutorials })));
const Documentation = lazy(() => import('./views/Documentation').then((module) => ({ default: module.Documentation })));
const Auth = lazy(() => import('./views/Auth').then((module) => ({ default: module.Auth })));
const Profile = lazy(() => import('./views/Profile').then((module) => ({ default: module.Profile })));
const AptitudeTest = lazy(() => import('./views/AptitudeTest').then((module) => ({ default: module.AptitudeTest })));
const Jobs = lazy(() => import('./views/Jobs').then((module) => ({ default: module.Jobs })));
const Settings = lazy(() => import('./views/Settings').then((module) => ({ default: module.Settings })));
const ArenaLobby = lazy(() => import('./views/ArenaLobby').then((module) => ({ default: module.ArenaLobby })));
const ResumeBuilder = lazy(() => import('./views/ResumeBuilder').then((module) => ({ default: module.ResumeBuilder })));
const Blackhole = lazy(() => import('./components/Blackhole').then((module) => ({ default: module.Blackhole })));

function App() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<GameMode>(GameMode.AUTH);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scheduledBattles, setScheduledBattles] = useState<ScheduledBattle[]>(() =>
    readStorage<ScheduledBattle[]>(storageKeys.scheduledBattles, []),
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      if (mode === GameMode.AUTH) {
        setMode(GameMode.DASHBOARD);
      }
      return;
    }

    setMode(GameMode.AUTH);
    setIsChatOpen(false);
  }, [loading, mode, user]);

  useEffect(() => {
    writeStorage(storageKeys.scheduledBattles, scheduledBattles);
  }, [scheduledBattles]);

  const handleAddBattle = (battle: ScheduledBattle) => {
    setScheduledBattles((previousBattles) => [...previousBattles, battle]);
  };

  const handleRemoveBattle = (id: string) => {
    setScheduledBattles((previousBattles) => previousBattles.filter((battle) => battle.id !== id));
  };

  const renderView = () => {
    switch (mode) {
      case GameMode.AUTH:
        return <Auth setMode={setMode} />;
      case GameMode.HOME:
        return <Landing setMode={setMode} onScheduleBattle={handleAddBattle} />;
      case GameMode.DASHBOARD:
        return <Dashboard setMode={setMode} scheduledBattles={scheduledBattles} onRemoveBattle={handleRemoveBattle} />;
      case GameMode.BATTLE:
      case GameMode.ASSESSMENT:
        return <BattleArena key={mode} mode={mode} setMode={setMode} />;
      case GameMode.PRACTICE:
        return <BattleArena key="practice" mode={GameMode.PRACTICE} />;
      case GameMode.ARENA:
        return <ArenaLobby setMode={setMode} />;
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
        return <ResumeBuilder setMode={setMode} />;
      default:
        return <Landing setMode={setMode} onScheduleBattle={handleAddBattle} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full bg-slate-950">
        <AppLoader label="Connecting account" />
      </div>
    );
  }

  const showNavigation = mode !== GameMode.AUTH;

  return (
    <div className="flex h-full w-full flex-col-reverse overflow-hidden bg-slate-950 text-slate-100 md:flex-row">
      {showNavigation && <Navbar currentMode={mode} setMode={setMode} />}

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.1),_transparent_34%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
          <Suspense fallback={<AppLoader label="Loading module" />}>{renderView()}</Suspense>
        </div>

        {showNavigation && (
          <>
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="absolute bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/40 bg-sky-500 text-white shadow-[0_24px_60px_rgba(14,165,233,0.34)] transition hover:-translate-y-1 hover:bg-sky-400"
                title="Open AI assistant"
              >
                <MessageSquare size={22} />
              </button>
            )}

            {isChatOpen && (
              <Suspense fallback={null}>
                <Blackhole onClose={() => setIsChatOpen(false)} />
              </Suspense>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
