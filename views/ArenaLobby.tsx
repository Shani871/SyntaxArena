import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, Users, Zap, Trophy, Target, ChevronRight, X, Swords, Clock, Cpu, Shield } from 'lucide-react';
import { useArenaWebSocket, ArenaMessage } from '../hooks/useArenaWebSocket';
import { useProctoring } from '../hooks/useProctoring';
import { ProctoringSetup } from '../components/ProctoringSetup';
import { ProctoringCamera } from '../components/ProctoringCamera';
import { MOCK_USER } from '../constants';
import { GameMode } from '../types';

interface ArenaLobbyProps {
    setMode: (mode: GameMode) => void;
    onMatchFound?: (session: any) => void;
}

interface ArenaSession {
    sessionId: string;
    problemTitle: string;
    problemDescription: string;
    difficulty: string;
    players: Array<{
        playerId: string;
        username: string;
        rating: number;
    }>;
}

export const ArenaLobby: React.FC<ArenaLobbyProps> = ({ setMode, onMatchFound }) => {
    const [lobbyState, setLobbyState] = useState<'IDLE' | 'SEARCHING' | 'FOUND'>('IDLE');
    const [matchSession, setMatchSession] = useState<ArenaSession | null>(null);
    const [opponent, setOpponent] = useState<{ username: string; rating: number } | null>(null);
    const [searchTime, setSearchTime] = useState(0);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);

    // Proctoring State
    const [showProctoringSetup, setShowProctoringSetup] = useState(true);
    const [proctoringEnabled, setProctoringEnabled] = useState(false);

    const proctoring = useProctoring({
        onViolation: (count, reason) => {
            console.warn(`Proctoring violation ${count}/4: ${reason}`);
        },
        onDisqualified: () => {
            // Exit arena on disqualification
            setMode(GameMode.DASHBOARD);
        },
        maxViolations: 4,
    });

    const playerId = MOCK_USER.id || 'player_' + Math.random().toString(36).substr(2, 9);

    const handleMessage = useCallback((message: ArenaMessage) => {
        console.log('Arena message received:', message);

        switch (message.type) {
            case 'JOIN_QUEUE':
                if (message.payload?.queuePosition) {
                    setQueuePosition(message.payload.queuePosition);
                }
                break;

            case 'MATCH_FOUND':
                setLobbyState('FOUND');
                const session = message.payload as ArenaSession;
                setMatchSession(session);

                // Find opponent
                const opp = session.players.find(p => p.playerId !== playerId);
                if (opp) {
                    setOpponent({ username: opp.username, rating: opp.rating });
                }

                // Transition to battle after VS animation
                setTimeout(() => {
                    onMatchFound?.(session);
                }, 3000);
                break;

            case 'LEAVE_QUEUE':
                setLobbyState('IDLE');
                setSearchTime(0);
                setQueuePosition(null);
                break;
        }
    }, [playerId, onMatchFound]);

    const {
        connected,
        connect,
        disconnect,
        joinQueue,
        leaveQueue,
    } = useArenaWebSocket({ playerId, onMessage: handleMessage });

    // Search timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (lobbyState === 'SEARCHING') {
            interval = setInterval(() => {
                setSearchTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [lobbyState]);

    const handleJoinQueue = () => {
        if (!connected) {
            connect();
            // Wait for connection then join
            setTimeout(() => {
                joinQueue(MOCK_USER.username, MOCK_USER.codingRating || 1200);
                setLobbyState('SEARCHING');
            }, 1000);
        } else {
            joinQueue(MOCK_USER.username, MOCK_USER.codingRating || 1200);
            setLobbyState('SEARCHING');
        }
    };

    const handleCancelSearch = () => {
        leaveQueue();
        setLobbyState('IDLE');
        setSearchTime(0);
        setQueuePosition(null);
    };

    // Render Match Found (VS Screen)
    if (lobbyState === 'FOUND' && opponent) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] text-white font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-cyber-purple/5 animate-pulse"></div>

                {/* VS Animation */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-32 animate-fade-in relative z-10">
                    {/* Player 1 (You) */}
                    <div className="flex flex-col items-center gap-6 animate-slide-in-left">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-cyber-blue bg-[#1e1e1e] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 relative overflow-hidden">
                                <span className="text-5xl font-bold text-white z-10">
                                    {MOCK_USER.username.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyber-blue rounded-full text-xs font-bold">
                                {MOCK_USER.codingRating || 1200}
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{MOCK_USER.username}</h3>
                            <p className="text-cyber-blue font-bold text-sm tracking-wider uppercase">YOU</p>
                        </div>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-bounce">
                            VS
                        </span>
                    </div>

                    {/* Player 2 (Opponent) */}
                    <div className="flex flex-col items-center gap-6 animate-slide-in-right">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-cyber-danger bg-[#1e1e1e] flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.5)] z-10 relative overflow-hidden">
                                <span className="text-5xl font-bold text-white z-10">
                                    {opponent.username.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyber-danger rounded-full text-xs font-bold">
                                {opponent.rating}
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{opponent.username}</h3>
                            <p className="text-cyber-danger font-bold text-sm tracking-wider uppercase">OPPONENT</p>
                        </div>
                    </div>
                </div>

                {/* Problem Info */}
                {matchSession && (
                    <div className="mt-12 text-center animate-fade-in">
                        <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Challenge</p>
                        <h4 className="text-xl font-bold text-white">{matchSession.problemTitle}</h4>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${matchSession.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            matchSession.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {matchSession.difficulty}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // Render Searching State
    if (lobbyState === 'SEARCHING') {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0b] text-white font-mono relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBWMHptNDAgMEwwIDAiIHN0cm9rZT0iIzMzNDE1NSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1c2UoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.05]"></div>

                {/* Radar Animation */}
                <div className="relative w-80 h-80 mb-10 flex items-center justify-center">
                    <div className="absolute inset-0 border border-[#333] rounded-full opacity-50"></div>
                    <div className="absolute inset-8 border border-[#333] rounded-full opacity-30"></div>
                    <div className="absolute inset-16 border border-[#333] rounded-full opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyber-purple shadow-[0_0_15px_#a855f7] animate-[spin_3s_linear_infinite]"></div>

                    {/* Center pulse */}
                    <div className="w-4 h-4 bg-cyber-purple rounded-full shadow-[0_0_20px_#a855f7] animate-pulse"></div>
                </div>

                {/* Search Info */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-white">Searching for Opponent...</h2>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock size={16} className="text-cyber-purple" />
                            <span className="font-mono">{Math.floor(searchTime / 60)}:{String(searchTime % 60).padStart(2, '0')}</span>
                        </div>
                        {queuePosition && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Users size={16} className="text-cyber-blue" />
                                <span>Position: {queuePosition}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-2 text-[#858585] text-xs font-bold uppercase tracking-wider mt-4">
                        <span className="flex items-center gap-2 text-cyber-purple">
                            <Wifi size={14} className="animate-pulse" /> Node: US-EAST-1
                        </span>
                        <span className="flex items-center gap-2">
                            <Cpu size={14} /> Mode: RANKED ARENA
                        </span>
                    </div>
                </div>

                {/* Cancel Button */}
                <button
                    onClick={handleCancelSearch}
                    className="mt-8 px-6 py-2 bg-[#27272a] hover:bg-[#333] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <X size={16} /> Cancel Search
                </button>
            </div>
        );
    }

    // Render Idle State (Lobby)
    return (
        <div className="h-full w-full flex flex-col bg-[#0a0a0b] text-white overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-[#27272a]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                            ARENA
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Compete against real players in real-time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#1e1e1e] px-3 py-2 rounded-lg border border-[#333]">
                            <Trophy size={16} className="text-yellow-500" />
                            <span className="font-bold">{MOCK_USER.codingRating || 1200}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Quick Match Card */}
                    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162d] rounded-2xl border border-purple-500/20 p-8 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <Swords size={28} className="text-purple-400" />
                                <h2 className="text-2xl font-bold">Quick Match</h2>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Get matched with an opponent of similar skill level. First to solve the challenge wins!
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock size={14} /> 15 min time limit
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Target size={14} /> Ranked match
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Zap size={14} /> XP rewards
                                </div>
                            </div>

                            <button
                                onClick={handleJoinQueue}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center gap-2"
                            >
                                <Swords size={18} /> Find Match
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
                            <div className="text-3xl font-bold text-white">{MOCK_USER.xp}</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Total XP</div>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
                            <div className="text-3xl font-bold text-green-400">12</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Wins</div>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
                            <div className="text-3xl font-bold text-red-400">5</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Losses</div>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#333]">
                            <div className="text-3xl font-bold text-cyber-purple">71%</div>
                            <div className="text-xs text-gray-500 uppercase font-bold mt-1">Win Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Show proctoring setup before allowing access to lobby
    if (showProctoringSetup) {
        return (
            <>
                <ProctoringSetup
                    onReady={() => {
                        setShowProctoringSetup(false);
                        setProctoringEnabled(true);
                    }}
                    onCancel={() => {
                        // Exit to dashboard - cannot bypass proctoring
                        setMode(GameMode.DASHBOARD);
                    }}
                    onVideoRef={proctoring.attachVideoStream}
                    startProctoring={proctoring.startProctoring}
                    hasPermission={proctoring.hasPermission}
                    faceCount={proctoring.faceCount}
                    status={proctoring.status}
                    errorMessage={proctoring.errorMessage}
                />
                {/* Proctoring Camera (when active) */}
                {proctoringEnabled && proctoring.isEnabled && (
                    <ProctoringCamera
                        faceCount={proctoring.faceCount}
                        violations={proctoring.violations}
                        maxViolations={proctoring.maxViolations}
                        status={proctoring.status}
                        onVideoRef={proctoring.attachVideoStream}
                    />
                )}
            </>
        );
    }

    // Render with proctoring camera overlay
    return (
        <>
            {/* Main Arena Lobby Content */}
            {renderLobbyContent()}

            {/* Proctoring Camera (when active) */}
            {proctoringEnabled && proctoring.isEnabled && (
                <ProctoringCamera
                    faceCount={proctoring.faceCount}
                    violations={proctoring.violations}
                    maxViolations={proctoring.maxViolations}
                    status={proctoring.status}
                    onVideoRef={proctoring.attachVideoStream}
                />
            )}
        </>
    );

    function renderLobbyContent() {
        // Render Match Found (VS Screen)
        if (lobbyState === 'FOUND' && opponent) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] text-white font-mono relative overflow-hidden">
                    {/* ... rest of VS screen code ... */}
                </div>
            );
        }

        // Render Searching State
        if (lobbyState === 'SEARCHING') {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0b] text-white font-mono relative overflow-hidden">
                    {/* ... rest of searching code ... */}
                </div>
            );
        }

        // Render Idle State (Lobby)
        return (
            <div className="h-full w-full flex flex-col bg-[#0a0a0b] text-white overflow-y-auto">
                {/* ... rest of lobby code ... */}
            </div>
        );
    }
};
