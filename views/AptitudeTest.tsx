import React, { useState } from 'react';
import { BrainCircuit, CheckCircle, XCircle, ChevronRight, RefreshCw, Award, Server, Cpu, Calculator, PieChart, Activity } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // index of correct option
}

interface Topic {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    questions: Question[];
}

const TOPICS: Topic[] = [
    {
        id: 'logic',
        name: 'Logical Reasoning',
        description: 'Test your problem-solving skills and ability to recognize patterns.',
        icon: <BrainCircuit size={32} />,
        color: 'text-cyber-purple',
        questions: [
            {
                id: 1,
                text: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
                options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
                correctAnswer: 1
            },
            {
                id: 2,
                text: 'SCD, TEF, UGH, ____, WKL',
                options: ['CMN', 'UJI', 'VIJ', 'IJT'],
                correctAnswer: 2
            },
            {
                id: 3,
                text: 'Statement: All cars are cats. All fans are cats. Conclusion: All cars are fans.',
                options: ['True', 'False', 'Either', 'Neither'],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 'backend',
        name: 'Backend Core',
        description: 'Assess your knowledge of Databases, APIs, and System Design.',
        icon: <Server size={32} />,
        color: 'text-cyber-blue',
        questions: [
            {
                id: 1,
                text: 'Which HTTP status code indicates a "Not Found" error?',
                options: ['200', '500', '404', '403'],
                correctAnswer: 2
            },
            {
                id: 2,
                text: 'In database systems, what does ACID stand for?',
                options: [
                    'Atomicity, Consistency, Isolation, Durability',
                    'Availability, Consistency, Isolation, Durability',
                    'Atomicity, Concurrency, Isolation, Data',
                    'Automatic, Consistent, Internal, Database'
                ],
                correctAnswer: 0
            },
            {
                id: 3,
                text: 'Which of the following is NOT a NoSQL database?',
                options: ['MongoDB', 'PostgreSQL', 'Cassandra', 'Redis'],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 'quant',
        name: 'Quantitative',
        description: 'Numerical ability, probability, and mathematical thinking.',
        icon: <PieChart size={32} />,
        color: 'text-cyber-neon',
        questions: [
            {
                id: 1,
                text: 'What is the probability of getting a sum of 9 from two throws of a dice?',
                options: ['1/6', '1/8', '1/9', '1/12'],
                correctAnswer: 2
            },
            {
                id: 2,
                text: 'A train 120 meters long is running with a speed of 60 km/hr. In what time will it pass a boy who is running at 6 km/hr in the direction opposite to the train?',
                options: ['5 sec', '6 sec', '8 sec', '9 sec'],
                correctAnswer: 1
            }
        ]
    }
];

export const AptitudeTest: React.FC = () => {
    const [view, setView] = useState<'TOPICS' | 'QUIZ' | 'RESULT'>('TOPICS');
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [score, setScore] = useState(0);

    const startQuiz = (topic: Topic) => {
        setActiveTopic(topic);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setScore(0);
        setView('QUIZ');
    };

    const handleAnswer = (optionIndex: number) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const nextQuestion = () => {
        if (!activeTopic) return;
        if (currentQuestionIndex < activeTopic.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateScore();
        }
    };

    const calculateScore = () => {
        if (!activeTopic) return;
        let correctCount = 0;
        activeTopic.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setView('RESULT');
    };

    const reset = () => {
        setView('TOPICS');
        setActiveTopic(null);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
    };

    // ------------------------------------------------------------------
    // RENDER: TOPIC SELECTION
    // ------------------------------------------------------------------
    if (view === 'TOPICS') {
        return (
            <div className="h-full w-full flex flex-col bg-[#1e1e1e] overflow-hidden font-mono">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="w-full max-w-5xl mx-auto flex flex-col min-h-full">
                        <div className="mb-12 text-center">
                            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight flex items-center justify-center gap-3">
                                <BrainCircuit className="text-cyber-purple" size={32} /> Aptitude Assessment
                            </h1>
                            <p className="text-[#858585] max-w-xl mx-auto text-sm leading-relaxed">
                                Sharpen your cognitive skills. Select a domain to test your knowledge with topic-wise multiple choice questions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {TOPICS.map(topic => (
                                <div 
                                    key={topic.id}
                                    onClick={() => startQuiz(topic)}
                                    className="bg-[#252526] border border-[#333] rounded-xl p-6 hover:border-cyber-blue hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden shadow-lg flex flex-col h-full"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-[#1e1e1e] border border-[#333] flex items-center justify-center mb-6 ${topic.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                        {topic.icon}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                                    <p className="text-[#858585] text-sm mb-8 leading-relaxed flex-1">
                                        {topic.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-5 border-t border-[#333] mt-auto">
                                        <span className="text-xs text-[#666] font-bold uppercase tracking-wider">{topic.questions.length} Questions</span>
                                        <div className="flex items-center text-xs text-white font-bold bg-[#333] px-4 py-2 rounded-full group-hover:bg-cyber-blue transition-colors">
                                            Start <ChevronRight size={14} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDER: QUIZ INTERFACE
    // ------------------------------------------------------------------
    if (view === 'QUIZ' && activeTopic) {
        const question = activeTopic.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / activeTopic.questions.length) * 100;
        const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

        return (
            <div className="h-full w-full bg-[#1e1e1e] flex flex-col font-mono overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                    <div className="w-full max-w-3xl animate-fade-in flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-6">
                            <div className="flex items-center gap-5">
                                <div className={`p-3.5 rounded-2xl bg-[#252526] border border-[#333] shadow-xl ${activeTopic.color} transition-transform hover:scale-105`}>
                                    {activeTopic.icon}
                                </div>
                                <div>
                                    <div className="text-[#666] text-[10px] uppercase font-bold tracking-[0.2em] mb-1.5">Assessment Mode</div>
                                    <h2 className="text-2xl text-white font-bold leading-none tracking-tight">{activeTopic.name}</h2>
                                </div>
                            </div>
                            <div className="text-right">
                                 <div className="flex flex-col items-end">
                                    <div className="text-xs font-bold text-[#858585] uppercase tracking-wider mb-1">Question</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
                                        <span className="text-lg text-[#555] font-bold">/ {String(activeTopic.questions.length).padStart(2, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-[#252526] rounded-full mb-10 overflow-hidden relative">
                            <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-blue to-purple-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Question Card */}
                        <div key={currentQuestionIndex} className="bg-[#252526] border border-[#333] rounded-2xl p-8 md:p-10 shadow-2xl animate-slide-up relative overflow-hidden">
                            {/* Background Decoration */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed relative z-10">
                                {question.text}
                            </h2>

                            <div className="grid grid-cols-1 gap-4 relative z-10">
                                {question.options.map((option, idx) => {
                                    const isSelected = userAnswers[currentQuestionIndex] === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`group relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between overflow-hidden ${
                                                isSelected 
                                                    ? 'bg-cyber-blue/10 border-cyber-blue shadow-[0_0_25px_rgba(59,130,246,0.15)] translate-x-1' 
                                                    : 'bg-[#1e1e1e] border-[#333] text-[#aaa] hover:border-[#555] hover:bg-[#2a2a2a] hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-inner ${
                                                    isSelected 
                                                        ? 'bg-cyber-blue text-white shadow-lg scale-110' 
                                                        : 'bg-[#252526] text-[#666] border border-[#333] group-hover:border-[#555] group-hover:text-[#999]'
                                                }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className="font-medium text-sm md:text-base leading-snug">
                                                    {option}
                                                </span>
                                            </div>
                                            
                                            {/* Animated Checkmark */}
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                                isSelected 
                                                    ? 'border-cyber-blue bg-cyber-blue text-white scale-100 opacity-100 rotate-0' 
                                                    : 'border-[#444] bg-transparent scale-50 opacity-0 -rotate-90'
                                            }`}>
                                                <CheckCircle size={14} fill="currentColor" className="text-white" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer / Nav */}
                        <div className="flex justify-end mt-10">
                            <button 
                                onClick={nextQuestion}
                                disabled={!hasAnswered}
                                className={`px-10 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center gap-3 transition-all duration-300 ${
                                    hasAnswered 
                                        ? 'bg-gradient-to-r from-cyber-blue to-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1' 
                                        : 'bg-[#252526] text-[#555] border border-[#333] cursor-not-allowed'
                                }`}
                            >
                                <span>{currentQuestionIndex === activeTopic.questions.length - 1 ? 'COMPLETE TEST' : 'NEXT QUESTION'}</span>
                                <ChevronRight size={18} className={hasAnswered ? "animate-pulse" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDER: RESULT SCREEN
    // ------------------------------------------------------------------
    if (view === 'RESULT' && activeTopic) {
        const percentage = Math.round((score / activeTopic.questions.length) * 100);
        
        let message = "Keep Practicing!";
        let icon = <RefreshCw size={48} className="text-[#858585]" />;
        let color = "text-[#858585]";
        
        if (percentage >= 80) {
            message = "Outstanding!";
            icon = <Award size={64} className="text-yellow-500 animate-bounce" />;
            color = "text-yellow-500";
        } else if (percentage >= 50) {
            message = "Good Job!";
            icon = <CheckCircle size={64} className="text-cyber-neon" />;
            color = "text-cyber-neon";
        }

        return (
            <div className="h-full w-full bg-[#1e1e1e] flex flex-col items-center justify-center p-6 font-mono text-center overflow-y-auto">
                <div className="max-w-lg w-full bg-[#252526] border border-[#333] rounded-xl p-10 shadow-2xl animate-scale-in">
                    <div className="flex justify-center mb-6">
                        {icon}
                    </div>
                    
                    <h2 className={`text-3xl font-bold mb-2 ${color}`}>{message}</h2>
                    <p className="text-[#858585] mb-8">You have completed the <span className="text-white font-bold">{activeTopic.name}</span> assessment.</p>

                    <div className="flex justify-center gap-8 mb-10">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{score} <span className="text-lg text-[#555]">/ {activeTopic.questions.length}</span></div>
                            <div className="text-[10px] text-[#858585] uppercase tracking-wider font-bold">Score</div>
                        </div>
                        <div className="w-px bg-[#333]"></div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${color}`}>{percentage}%</div>
                            <div className="text-[10px] text-[#858585] uppercase tracking-wider font-bold">Accuracy</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={reset}
                            className="w-full py-3 bg-cyber-blue hover:bg-blue-600 text-white font-bold rounded transition-colors shadow-lg"
                        >
                            Explore Other Topics
                        </button>
                        <button 
                            onClick={() => startQuiz(activeTopic)}
                            className="w-full py-3 bg-[#1e1e1e] hover:bg-[#333] border border-[#333] text-[#ccc] font-bold rounded transition-colors"
                        >
                            Retry This Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};