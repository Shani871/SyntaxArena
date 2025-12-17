import React, { useState, useEffect, useRef } from 'react';
import { Play, Send, AlertTriangle, Flag, CheckCircle2, ChevronDown, ChevronUp, Terminal as TerminalIcon, FileText, Lightbulb, XCircle, Wifi, Zap, Timer, Code2, ChevronRight, User, RefreshCw, Target, BarChart2, Settings, Swords, Cpu } from 'lucide-react';
import { Problem, BattleState, ChatMessage, GameMode } from '../types';
import { SAMPLE_PROBLEMS, MOCK_USER } from '../constants';
import { CodeEditor } from '../components/CodeEditor';
import { generateProblemVariant, getInvigilatorHint, generatePracticeProblem, evaluateCodeSubmission } from '../services/geminiService';

interface BattleArenaProps {
    mode?: GameMode;
}

export const BattleArena: React.FC<BattleArenaProps> = ({ mode = GameMode.BATTLE }) => {
    const [matchState, setMatchState] = useState<'SEARCHING' | 'FOUND' | 'BATTLE'>('SEARCHING');
    const [problem, setProblem] = useState<Problem>(SAMPLE_PROBLEMS[0]);
    const [code, setCode] = useState(`function solve(nums, target) {
  // Write your code here
  
}`);
    const [isLoading, setIsLoading] = useState(false);
    const [currentXp, setCurrentXp] = useState(MOCK_USER.xp);

    // Tabs State
    const [activeLeftTab, setActiveLeftTab] = useState<'DESCRIPTION' | 'SUBMISSIONS' | 'CONFIG'>('DESCRIPTION');
    const [activeBottomTab, setActiveBottomTab] = useState<'CONSOLE' | 'TESTS'>('CONSOLE');
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const [testResults, setTestResults] = useState<{ id: number; input: string; expected: string; actual: string; passed: boolean }[]>([]);

    // Hint Menu State
    const [showHintMenu, setShowHintMenu] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ show: boolean; type: 'SYNTAX' | 'LOGIC' | 'OPTIMIZATION' | 'EXPLANATION'; cost: number } | null>(null);

    // Practice State
    const [practiceDifficulty, setPracticeDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [practiceTopic, setPracticeTopic] = useState<string>('Arrays');
    const [practiceLanguage, setPracticeLanguage] = useState<string>('JavaScript');
    const [practiceStats, setPracticeStats] = useState({ solved: 0, attempts: 0 });

    // Battle State
    const [battle, setBattle] = useState<BattleState>({
        isActive: false,
        timeLeft: 900, // 15 mins
        myProgress: 0,
        opponentProgress: 0,
        opponentName: "CyberGhost_99"
    });

    // Chat/Invigilator State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize Practice or Matchmaking Sequence
    useEffect(() => {
        // If we are in Practice Mode, ensure we are immediately in BATTLE state
        if (mode === GameMode.PRACTICE) {
            setMatchState('BATTLE');
            // If the user hasn't explicitly navigated tabs yet, default to CONFIG for better UX
            // We use a ref or just simple logic: if currently on SUBMISSIONS (default hidden) switch to CONFIG
            if (activeLeftTab === 'SUBMISSIONS') setActiveLeftTab('CONFIG');
        } else {
            // If switching BACK to Battle mode, start searching if not already found/battle
            if (matchState === 'BATTLE') setMatchState('SEARCHING');
        }
    }, [mode]);

    // Handle Matchmaking Timers
    useEffect(() => {
        if (mode === GameMode.PRACTICE) return;

        if (matchState === 'SEARCHING') {
            const timer = setTimeout(() => setMatchState('FOUND'), 3000);
            return () => clearTimeout(timer);
        }
        if (matchState === 'FOUND') {
            const timer = setTimeout(() => {
                setMatchState('BATTLE');
                setActiveLeftTab('DESCRIPTION'); // Auto-show problem in Battle
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [matchState, mode]);

    // Load a problem for practice based on difficulty
    const loadPracticeProblem = async () => {
        setIsLoading(true);

        try {
            // Reset console and tests
            setTestResults([]);
            setMessages([{ role: 'model', text: `>> PRACTICE MODE INITIALIZED.\n>> GENERATING A UNIQUE PROBLEM...` }]);

            const newProblem = await generatePracticeProblem(practiceTopic, practiceDifficulty);
            setProblem(newProblem);

            // Reset code with simple starter
            // In a real app, generate starter code based on language
            // For now simple generic placeholder
            let starter = `// Write your ${practiceLanguage} solution for: ${newProblem.title}\n`;
            if (practiceLanguage === 'Python') starter += `def solve():\n    # your code\n    pass`;
            else if (practiceLanguage === 'JavaScript') starter += `function solve() {\n    // your code\n}`;
            else if (practiceLanguage === 'Java') starter += `class Solution {\n    public void solve() {\n        // your code\n    }\n}`;
            else if (practiceLanguage === 'C++') starter += `void solve() {\n    // your code\n}`;
            else starter += `// Entry point for solution`;

            setCode(starter);

            setMessages(prev => [...prev, { role: 'model', text: `>> PROBLEM LOADED: ${newProblem.title.toUpperCase()}` }]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize Battle when entering BATTLE state
    useEffect(() => {
        if (matchState !== 'BATTLE' || mode === GameMode.PRACTICE) return;

        const initBattle = async () => {
            setIsLoading(true);
            const variantDesc = await generateProblemVariant(problem);
            setProblem(prev => ({ ...prev, generatedStory: variantDesc }));
            setBattle(prev => ({ ...prev, isActive: true, opponentProgress: 0 }));
            setMessages([{ role: 'model', text: 'System Initialized. Invigilator AI active.' }]);
            setIsLoading(false);
        };
        initBattle();
    }, [matchState, problem.id, mode]);

    // Simulate Opponent & Timer
    useEffect(() => {
        if (!battle.isActive && mode !== GameMode.PRACTICE) return;

        const interval = setInterval(() => {
            setBattle(prev => {
                let newOppProgress = prev.opponentProgress;

                if (mode === GameMode.BATTLE) {
                    const oppChance = Math.random();
                    newOppProgress = prev.opponentProgress < 100 && oppChance > 0.7
                        ? prev.opponentProgress + 5
                        : prev.opponentProgress;
                }

                return {
                    ...prev,
                    timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
                    opponentProgress: newOppProgress
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [battle.isActive, mode]);

    // Scroll chat to bottom - FIX: Use 'nearest' block to prevent whole page jump
    useEffect(() => {
        if (isConsoleOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages, activeBottomTab, isConsoleOpen]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMsgText = inputMessage;
        const newUserMsg: ChatMessage = { role: 'user', text: userMsgText };

        setMessages(prev => [...prev, newUserMsg]);
        setInputMessage("");

        const currentHistory = [...messages, newUserMsg];
        const response = await getInvigilatorHint(currentHistory, problem.generatedStory || problem.baseDescription, code, 'GENERAL');
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    };

    const handleBuyHint = (type: 'SYNTAX' | 'LOGIC' | 'OPTIMIZATION' | 'EXPLANATION', cost: number) => {
        if (currentXp < cost) {
            setMessages(prev => [...prev, { role: 'model', text: `[SYSTEM] Insufficient XP. Required: ${cost} XP.` }]);
            setShowHintMenu(false);
            return;
        }
        setConfirmModal({ show: true, type, cost });
        setShowHintMenu(false);
    };

    const onConfirmPurchase = async () => {
        if (!confirmModal) return;
        const { type, cost } = confirmModal;

        setConfirmModal(null);
        setCurrentXp(prev => prev - cost);

        const systemMsg: ChatMessage = { role: 'user', text: `>> PURCHASE_HINT --type=${type} --cost=${cost}` };
        const processingMsg: ChatMessage = { role: 'model', text: 'Processing transaction... Analyzing code context...' };

        setMessages(prev => [...prev, systemMsg, processingMsg]);

        const currentHistory = [...messages, systemMsg, processingMsg];
        const response = await getInvigilatorHint(currentHistory, problem.generatedStory || problem.baseDescription, code, type);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    };

    const handleSurrender = () => {
        if (confirm("End session?")) {
            setBattle(prev => ({ ...prev, isActive: false }));
            setMessages(prev => [...prev, { role: 'model', text: "Session ended. Solution key decrypted." }]);
            setCode("// Solution revealed: \n function solve() { return 'Optimized Result'; }");
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'model', text: `>> SUBMISSION RECEIVED. ${mode === GameMode.PRACTICE ? 'AI JUDGE ANALYZING...' : 'RUNNING TEST SUITES...'}` }]);

        let newResults: any[] = [];
        let success = false;

        if (mode === GameMode.PRACTICE) {
            // USE AI Evaluation
            try {
                newResults = await evaluateCodeSubmission(problem, code, practiceLanguage);
                success = newResults.every(r => r.passed);
            } catch (e) {
                console.error("AI Evaluation Failed", e);
                newResults = [{ id: 1, input: "Error", expected: "Success", actual: "Fail", passed: false }];
            }
        } else {
            // --- EXISTING BATTLE MODE MOCK LOGIC ---
            // (Keeping original logic for Battle Mode / PvP simulation stability)
            success = Math.random() > 0.3; // 70% success chance for demo

            if (problem.id === 'p1') {
                newResults = [
                    { id: 1, input: "nums = [2,7,11,15], target = 9", expected: "[0,1]", actual: "[0,1]", passed: true },
                    { id: 2, input: "nums = [3,2,4], target = 6", expected: "[1,2]", actual: "[1,2]", passed: true },
                    { id: 3, input: "nums = [3,3], target = 6", expected: "[0,1]", actual: success ? "[0,1]" : "[0,0]", passed: success }
                ];
            } else if (problem.id === 'p2') {
                newResults = [
                    { id: 1, input: "[[1,3],[2,6],[8,10]]", expected: "[[1,6],[8,10]]", actual: "[[1,6],[8,10]]", passed: true },
                    { id: 2, input: "[[1,4],[4,5]]", expected: "[[1,5]]", actual: "[[1,5]]", passed: true },
                    { id: 3, input: "[[1,4],[0,4]]", expected: "[[0,4]]", actual: success ? "[[0,4]]" : "[[1,4],[0,4]]", passed: success }
                ];
            } else {
                newResults = [
                    { id: 1, input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6", actual: "6", passed: true },
                    { id: 2, input: "height = [4,2,0,3,2,5]", expected: "9", actual: "9", passed: true },
                    { id: 3, input: "height = [4,2,3]", expected: "1", actual: success ? "1" : "0", passed: success }
                ];
            }
        }

        setTestResults(newResults);
        setActiveBottomTab('TESTS');
        setIsConsoleOpen(true);
        setIsLoading(false);

        if (success) {
            if (mode === GameMode.PRACTICE) {
                setPracticeStats(prev => ({ ...prev, solved: prev.solved + 1, attempts: prev.attempts + 1 }));
                setMessages(prev => [...prev, { role: 'model', text: ">> EXCELLENT. Problem solved. Ready for next challenge." }]);
            } else {
                setBattle(prev => ({ ...prev, myProgress: 100, isActive: false }));
                setMessages(prev => [...prev, { role: 'model', text: ">> EXECUTION SUCCESS. All test cases passed." }]);
            }
        } else {
            if (mode === GameMode.PRACTICE) {
                setPracticeStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));

                // Count failed tests
                const failedCount = newResults.filter(r => !r.passed).length;
                setMessages(prev => [...prev, { role: 'model', text: `>> FAILED: ${failedCount} test case(s) did not match expectations.` }]);
            } else {
                setBattle(prev => ({ ...prev, myProgress: prev.myProgress + 10 }));
                setMessages(prev => [...prev, { role: 'model', text: ">> RUNTIME ERROR: Test case #3 failed logic check." }]);
            }
        }
    };

    const toggleConsole = () => {
        setIsConsoleOpen(!isConsoleOpen);
    };

    const selectConsoleTab = (tab: 'CONSOLE' | 'TESTS') => {
        setActiveBottomTab(tab);
        if (!isConsoleOpen) setIsConsoleOpen(true);
    };

    // -----------------------------------------------------------
    // RENDER: MATCHMAKING OVERLAY (Skipped in Practice)
    // -----------------------------------------------------------
    if (matchState === 'SEARCHING') {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-cyber-dark text-white font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0f172a] opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-80 h-80 mb-10 flex items-center justify-center">
                        <div className="absolute inset-0 border border-[#333] rounded-full opacity-50"></div>
                        <div className="absolute inset-0 rounded-full border-t-2 border-cyber-blue shadow-[0_0_15px_#3b82f6] animate-[spin_3s_linear_infinite]"></div>
                        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse"></div>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="flex flex-col items-center gap-2 text-[#858585] text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2 text-cyber-blue"><Wifi size={14} className="animate-pulse" /> Node: US-EAST-1</span>
                            <span className="flex items-center gap-2"><Cpu size={14} /> Matching Protocol: RANKED</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------
    // RENDER: MATCH FOUND
    // -----------------------------------------------------------
    if (matchState === 'FOUND') {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] text-white font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-cyber-blue/5 animate-pulse"></div>
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-32 animate-fade-in relative z-10">
                    <div className="flex flex-col items-center gap-6 animate-slide-in-left">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-cyber-blue bg-[#1e1e1e] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 relative overflow-hidden">
                                <span className="text-5xl font-bold text-white z-10">{MOCK_USER.username.slice(0, 2).toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{MOCK_USER.username}</h3>
                            <p className="text-cyber-blue font-bold text-sm tracking-wider uppercase">Lvl 12 Architect</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce">VS</span>
                    </div>
                    <div className="flex flex-col items-center gap-6 animate-slide-in-right">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-cyber-danger bg-[#1e1e1e] flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.5)] z-10 relative overflow-hidden">
                                <span className="text-5xl font-bold text-white z-10">CG</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{battle.opponentName}</h3>
                            <p className="text-cyber-danger font-bold text-sm tracking-wider uppercase">Lvl 14 Phantom</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------
    // RENDER: BATTLE ARENA
    // -----------------------------------------------------------
    return (
        <div className="h-full w-full flex flex-col bg-[#0f0f10] overflow-hidden relative animate-fade-in font-sans">

            {/* Top Bar */}
            <div className="h-14 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 shrink-0 z-20 shadow-md">
                <div className="flex items-center gap-4">
                    <div className={`w-2 h-8 rounded-full ${mode === GameMode.PRACTICE ? 'bg-cyber-neon shadow-[0_0_10px_#10b981]' : 'bg-green-500'}`}></div>
                    <div>
                        <h1 className="font-bold text-white text-sm md:text-base leading-none">{problem.title}</h1>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${mode === GameMode.PRACTICE ? 'text-cyber-neon' : 'text-green-400'}`}>
                            {mode === GameMode.PRACTICE ? 'Practice Mode' : problem.difficulty}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-lg border border-[#333] ${battle.timeLeft < 60 && mode !== GameMode.PRACTICE ? 'border-red-900/50' : ''}`}>
                        <Timer size={14} className={battle.timeLeft < 60 && mode !== GameMode.PRACTICE ? 'text-red-500 animate-pulse' : 'text-[#858585]'} />
                        <span className="font-mono text-lg font-bold text-white">
                            {Math.floor(battle.timeLeft / 60).toString().padStart(2, '0')}:{String(battle.timeLeft % 60).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 bg-[#1e1e1e] px-2 py-1.5 rounded border border-[#333]">
                        <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-mono text-xs text-white font-bold">{currentXp}</span>
                    </div>

                    {/* Hint Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowHintMenu(!showHintMenu)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#27272a] hover:bg-[#333] text-[#a1a1aa] border border-[#3f3f46]"
                        >
                            <Lightbulb size={14} /> <span className="hidden sm:inline">Hint</span>
                        </button>
                        {showHintMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowHintMenu(false)}></div>
                                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl z-50 p-1">
                                    {[
                                        { id: 'EXPLANATION', label: 'Explain', cost: 30, color: 'text-blue-400' },
                                        { id: 'SYNTAX', label: 'Syntax', cost: 50, color: 'text-cyber-blue' },
                                        { id: 'LOGIC', label: 'Logic', cost: 100, color: 'text-cyber-neon' },
                                        { id: 'OPTIMIZATION', label: 'Optimize', cost: 150, color: 'text-cyber-purple' }
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleBuyHint(item.id as any, item.cost)}
                                            className="flex items-center justify-between w-full p-2 hover:bg-[#2a2a2a] rounded text-left group"
                                        >
                                            <span className={`text-xs font-bold text-white`}>{item.label}</span>
                                            <span className="text-xs font-mono text-red-400 font-bold">-{item.cost}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors"
                    >
                        <Play size={14} fill="currentColor" /> <span className="hidden sm:inline">Run</span>
                    </button>
                </div>
            </div>

            {/* Main Workspace - Stable Flex Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">

                {/* Left Panel: Problem & Config */}
                <div className="w-full lg:w-[35%] h-[40%] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-[#27272a] bg-[#18181b] overflow-hidden shrink-0">
                    <div className="flex border-b border-[#27272a] bg-[#18181b] shrink-0">
                        <button
                            onClick={() => setActiveLeftTab('DESCRIPTION')}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 relative ${activeLeftTab === 'DESCRIPTION' ? 'text-white bg-[#202023]' : 'text-[#666] hover:bg-[#1e1e1e]'}`}
                        >
                            <FileText size={14} /> Problem
                            {activeLeftTab === 'DESCRIPTION' && <div className="absolute top-0 left-0 w-full h-0.5 bg-cyber-blue"></div>}
                        </button>

                        <button
                            onClick={() => setActiveLeftTab('CONFIG')}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 relative ${activeLeftTab === 'CONFIG' ? 'text-white bg-[#202023]' : 'text-[#666] hover:bg-[#1e1e1e]'}`}
                        >
                            {mode === GameMode.PRACTICE ? <Settings size={14} /> : <Swords size={14} />}
                            {mode === GameMode.PRACTICE ? 'Practice' : 'Status'}
                            {activeLeftTab === 'CONFIG' && <div className={`absolute top-0 left-0 w-full h-0.5 ${mode === GameMode.PRACTICE ? 'bg-cyber-neon' : 'bg-cyber-danger'}`}></div>}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#333]">
                        {activeLeftTab === 'DESCRIPTION' && (
                            <div className="prose prose-invert prose-sm max-w-none">
                                {isLoading ? (
                                    <div className="space-y-4 animate-pulse mt-4">
                                        <div className="h-6 bg-[#27272a] rounded w-3/4"></div>
                                        <div className="h-4 bg-[#27272a] rounded w-full"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <h3 className="text-white font-bold mb-2">Problem Description</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">{problem.generatedStory || problem.baseDescription}</p>
                                        </div>

                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Examples</h4>
                                        <div className="bg-[#0f0f10] p-3 rounded border border-[#333] font-mono text-xs mb-4 space-y-2">
                                            {problem.id === 'p1' && <div>Input: nums = [2,7,11,15], target = 9<br />Output: [0,1]</div>}
                                            {problem.id === 'p2' && <div>Input: intervals = [[1,3],[2,6]]<br />Output: [[1,6]]</div>}
                                            {problem.id === 'p3' && <div>Input: height = [0,1,0,2]<br />Output: 6</div>}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeLeftTab === 'CONFIG' && mode === GameMode.PRACTICE && (
                            <div className="space-y-6">
                                <div className="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                                    <div className="text-xs text-[#888] mb-3 font-bold uppercase">Configuration</div>

                                    {/* Topic Selector */}
                                    <div className="mb-4">
                                        <label className="text-[10px] text-[#666] uppercase font-bold mb-1 block">Topic</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Arrays', 'Strings', 'DP', 'Graps', 'Trees', 'Sorting'].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setPracticeTopic(t)}
                                                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-colors ${practiceTopic === t
                                                        ? 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue'
                                                        : 'bg-[#252526] text-[#888] border-transparent hover:bg-[#333]'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language Selector */}
                                    <div className="mb-4">
                                        <label className="text-[10px] text-[#666] uppercase font-bold mb-1 block">Language</label>
                                        <select
                                            value={practiceLanguage}
                                            onChange={(e) => setPracticeLanguage(e.target.value)}
                                            className="w-full bg-[#252526] text-[#ccc] text-xs font-bold border border-[#333] rounded p-2 focus:outline-none focus:border-cyber-neon"
                                        >
                                            <option value="JavaScript">JavaScript</option>
                                            <option value="Python">Python</option>
                                            <option value="Java">Java</option>
                                            <option value="C++">C++</option>
                                            <option value="TypeScript">TypeScript</option>
                                            <option value="Go">Go</option>
                                            <option value="Rust">Rust</option>
                                        </select>
                                    </div>

                                    <div className="text-xs text-[#888] mb-3 font-bold uppercase">Difficulty</div>
                                    <div className="flex gap-2 mb-4">
                                        {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                                            <button
                                                key={diff}
                                                onClick={() => setPracticeDifficulty(diff)}
                                                className={`flex-1 py-2 text-xs font-bold rounded transition-all border ${practiceDifficulty === diff
                                                    ? 'bg-cyber-neon/10 text-cyber-neon border-cyber-neon'
                                                    : 'bg-[#252526] text-[#666] border-transparent hover:bg-[#333]'
                                                    }`}
                                            >
                                                {diff}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={loadPracticeProblem}
                                        disabled={isLoading}
                                        className="w-full py-2 bg-[#252526] hover:bg-[#333] border border-[#333] text-[#ccc] text-xs font-bold rounded flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        <RefreshCw size={12} className={`group-hover:rotate-180 transition-transform ${isLoading ? 'animate-spin' : ''}`} />
                                        {isLoading ? 'Generating...' : 'Load New Problem'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#1e1e1e] border border-[#333] p-3 rounded text-center">
                                        <div className="text-2xl font-bold text-white">{practiceStats.solved}</div>
                                        <div className="text-[9px] text-[#666] uppercase font-bold mt-1">Solved</div>
                                    </div>
                                    <div className="bg-[#1e1e1e] border border-[#333] p-3 rounded text-center">
                                        <div className="text-2xl font-bold text-white">{practiceStats.attempts}</div>
                                        <div className="text-[9px] text-[#666] uppercase font-bold mt-1">Attempts</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeLeftTab === 'CONFIG' && mode === GameMode.BATTLE && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs items-center">
                                            <span className="font-bold text-cyber-blue">YOU</span>
                                            <span className="font-mono text-white">{battle.myProgress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[#0f0f10] w-full rounded-full border border-[#27272a]">
                                            <div className="h-full bg-cyber-blue transition-all duration-700" style={{ width: `${battle.myProgress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs items-center">
                                            <span className="font-bold text-cyber-danger">OPPONENT</span>
                                            <span className="font-mono text-white">{battle.opponentProgress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[#0f0f10] w-full rounded-full border border-[#27272a]">
                                            <div className="h-full bg-cyber-danger transition-all duration-700" style={{ width: `${battle.opponentProgress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor & Console */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] h-[60%] lg:h-full relative overflow-hidden">

                    {/* Editor - Flexible Height */}
                    <div className="flex-1 flex flex-col min-h-0 border-b border-[#27272a] relative">
                        <CodeEditor code={code} setCode={setCode} preventPaste={true} language={mode === GameMode.PRACTICE ? practiceLanguage : 'JavaScript'} />
                    </div>

                    {/* Bottom Panel - Fixed Height when open */}
                    <div
                        className={`flex flex-col border-t border-[#27272a] bg-[#0f0f10] transition-all duration-300 ease-in-out shrink-0 ${isConsoleOpen ? 'h-[40%] md:h-64' : 'h-10'}`}
                    >
                        <div
                            className="flex border-b border-[#27272a] bg-[#18181b] justify-between items-center pr-2 h-10 shrink-0 cursor-pointer hover:bg-[#202023]"
                            onClick={toggleConsole}
                        >
                            <div className="flex h-full">
                                <button
                                    onClick={(e) => { e.stopPropagation(); selectConsoleTab('CONSOLE'); }}
                                    className={`px-5 h-full text-xs font-bold flex items-center gap-2 relative ${activeBottomTab === 'CONSOLE' && isConsoleOpen ? 'text-white bg-[#0f0f10]' : 'text-[#666]'}`}
                                >
                                    <TerminalIcon size={12} /> Console
                                    {activeBottomTab === 'CONSOLE' && isConsoleOpen && <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500"></div>}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); selectConsoleTab('TESTS'); }}
                                    className={`px-5 h-full text-xs font-bold flex items-center gap-2 relative ${activeBottomTab === 'TESTS' && isConsoleOpen ? 'text-white bg-[#0f0f10]' : 'text-[#666]'}`}
                                >
                                    <CheckCircle2 size={12} /> Tests
                                    {activeBottomTab === 'TESTS' && isConsoleOpen && <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500"></div>}
                                </button>
                            </div>
                            {isConsoleOpen ? <ChevronDown size={14} className="text-[#666]" /> : <ChevronUp size={14} className="text-[#666]" />}
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden">
                            {activeBottomTab === 'CONSOLE' ? (
                                <>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs text-[#d4d4d4]">
                                        {messages.map((msg, i) => (
                                            <div key={i} className={`flex gap-3 ${msg.role === 'model' ? 'text-green-400' : 'text-blue-400'}`}>
                                                <span className="font-bold select-none">{msg.role === 'user' ? '>>' : '$'}</span>
                                                <span>{msg.text}</span>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="p-2 bg-[#18181b] flex gap-2 border-t border-[#27272a] items-center shrink-0">
                                        <span className="text-green-500 font-mono py-1 pl-2">{'>'}</span>
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="flex-1 bg-transparent text-gray-300 text-xs font-mono focus:outline-none"
                                            placeholder="Type command..."
                                        />
                                        <button onClick={handleSendMessage} className="p-1.5 hover:text-white text-[#888]"><Send size={12} /></button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                                    {testResults.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-[#444] space-y-2">
                                            <Code2 size={32} className="opacity-20" />
                                            <span>Run code to see results</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {testResults.map((result) => (
                                                <div key={result.id} className={`p-2 rounded border ${result.passed ? 'bg-green-900/10 border-green-900/30' : 'bg-red-900/10 border-red-900/30'}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {result.passed ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-500" />}
                                                        <span className={`font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>Test {result.id}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[#ccc]">
                                                        <div>Exp: {result.expected}</div>
                                                        <div>Act: {result.actual}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Confirmation Modal */}
            {confirmModal && confirmModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#18181b] border border-[#333] p-6 rounded-xl shadow-2xl max-w-sm w-full">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" size={20} /> Confirm Purchase
                        </h3>
                        <p className="text-sm text-[#888] mb-6">Spend {confirmModal.cost} XP for a {confirmModal.type} hint?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 text-xs font-bold text-[#888] hover:text-white rounded"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={onConfirmPurchase}
                                className="px-4 py-2 bg-cyber-blue text-white text-xs font-bold rounded"
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};