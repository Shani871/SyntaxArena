import React, { useState } from 'react';
import { Box, Cpu, Languages, RefreshCcw, PlayCircle, BookOpen, Share2, FileCode, FileText, Check, ChevronRight, ChevronLeft, PauseCircle, Square, Play } from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { generateApiDiagram } from '../services/geminiService';
import { apiService } from '../services/apiService';
import { useAuth } from '../components/AuthContext';
import { VisualizerStep } from '../types';

export const Visualizer: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'EXECUTION' | 'STORY' | 'DIAGRAM' | 'CONCEPT'>('EXECUTION');

  // Execution State
  const [code, setCode] = useState(`function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`);
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer State
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer Logic
  React.useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Playback Logic
  React.useEffect(() => {
    let interval: any;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps]);

  const handleStep = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
    if (direction === 'prev' && currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  // Story/Concept State
  const [storyCode, setStoryCode] = useState(`// Paste code here to get a story...`);
  const [apiCode, setApiCode] = useState(`app.get('/users/:id', async (req, res) => {
  const user = await db.users.find(req.params.id);
  res.json(user);
});`);

  const [concept, setConcept] = useState("JWT Authentication");
  const [language, setLanguage] = useState("English");
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [outputContent, setOutputContent] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  // Save to docs state
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleVisualize = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const result = await apiService.visualizeExecution(code, language, token);
      if (result) {
        if (Array.isArray(result)) {
          setSteps(result as any);
          setCurrentStepIndex(0); // Start at step 0
        } else if (typeof result === 'string') {
          // Fallback: Parse the AI response into individual steps if it's a string
          const stepMatches = (result as string).match(/\*\*Step \d+[^*]*\*\*[^*]*/g) || [];

          if (stepMatches.length > 0) {
            const parsedSteps = stepMatches.map((stepText, index) => {
              const lineMatch = stepText.match(/Line (\d+)/i);
              const line = lineMatch ? parseInt(lineMatch[1]) : null;
              let description = stepText
                .replace(/\*\*Step \d+[^:]*:\*\*/g, '')
                .replace(/\*\*/g, '')
                .trim();
              return {
                step: index + 1,
                description: description,
                line: line,
                changedVariables: {}
              };
            });
            setSteps(parsedSteps);
            setCurrentStepIndex(0);
          } else {
            const lines = (result as string).split('\n').filter(l => l.trim());
            const parsedSteps = lines.map((line, index) => ({
              step: index + 1,
              description: line.replace(/^[\d+\.\-\*]\s*/, '').replace(/\*\*/g, ''),
              line: null,
              changedVariables: {}
            }));
            setSteps(parsedSteps.length > 0 ? parsedSteps : [{ step: 1, description: result as string, line: null, changedVariables: {} }]);
            setCurrentStepIndex(0);
          }
        }
      }
    } catch (error) {
      console.error("Visualization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    setContentLoading(true);
    try {
      const token = await user?.getIdToken();
      const result = await apiService.simplifyConcept(concept, language, difficulty, token);
      setOutputContent(result || "Error generating explanation.");
    } catch (error) {
      console.error("Concept explanation error:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    setContentLoading(true);
    try {
      const token = await user?.getIdToken();
      const result = await apiService.generateCodeStory(storyCode, language, token);
      setOutputContent(result || "Error generating story.");
    } catch (error) {
      console.error("Story generation error:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleGenerateDiagram = async () => {
    setContentLoading(true);
    try {
      const result = await generateApiDiagram(apiCode);
      setOutputContent(result);
    } catch (error) {
      console.error("Diagram generation error:", error);
    } finally {
      setContentLoading(false);
    }
  };

  // Save AI output as a new document
  const handleSaveAsDocument = () => {
    let title = '';
    let category = 'AI Generated';
    let content = '';

    if (activeTab === 'EXECUTION' && steps.length > 0) {
      title = 'Execution Flow Analysis';
      category = 'Code Analysis';
      content = steps.map(s => `## Step ${s.step}\n\n${s.description}`).join('\n\n');
    } else if (outputContent) {
      switch (activeTab) {
        case 'STORY':
          title = 'Code Story';
          category = 'Code Stories';
          break;
        case 'DIAGRAM':
          title = 'API Flow Diagram';
          category = 'API Documentation';
          break;
        case 'CONCEPT':
          title = `${concept} Explained`;
          category = 'Concept Guides';
          break;
      }
      content = outputContent;
    }

    if (!content) return;

    // Create new document and save to localStorage for Documentation to pick up
    const newDoc = {
      id: Date.now().toString(),
      title,
      category,
      content,
      lastUpdated: 'Just now'
    };

    // Get existing docs from localStorage
    const existingDocs = JSON.parse(localStorage.getItem('syntaxarena_docs') || '[]');
    existingDocs.push(newDoc);
    localStorage.setItem('syntaxarena_docs', JSON.stringify(existingDocs));

    // Show success feedback
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const hasContent = activeTab === 'EXECUTION' ? steps.length > 0 : !!outputContent;

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden font-mono text-sm">

      {/* Header Tabs */}
      <div className="flex border-b border-[#333] bg-[#252526] overflow-x-auto">
        <button
          onClick={() => setActiveTab('EXECUTION')}
          className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'EXECUTION' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-purple' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
        >
          <Cpu size={14} /> Execution Flow
        </button>
        <button
          onClick={() => setActiveTab('STORY')}
          className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'STORY' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-neon' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
        >
          <BookOpen size={14} /> Code Story
        </button>
        <button
          onClick={() => setActiveTab('DIAGRAM')}
          className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'DIAGRAM' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-blue' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
        >
          <Share2 size={14} /> API Visualizer
        </button>
        <button
          onClick={() => setActiveTab('CONCEPT')}
          className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'CONCEPT' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-danger' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
        >
          <Languages size={14} /> Concept Simplifier
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* EXECUTION MODE */}
        {activeTab === 'EXECUTION' && (
          <div className="w-full h-full flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-[#333]">
              <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-[#333]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#ccc] pl-2 font-bold">Input Code</span>
                  <div className="flex items-center gap-1 bg-[#1e1e1e] rounded p-0.5 border border-[#444]">
                    {!isTimerRunning ? (
                      <button onClick={() => setIsTimerRunning(true)} className="p-1 hover:bg-[#333] rounded text-green-500" title="Start Timer">
                        <Play size={10} fill="currentColor" />
                      </button>
                    ) : (
                      <button onClick={() => setIsTimerRunning(false)} className="p-1 hover:bg-[#333] rounded text-red-500" title="Stop Timer">
                        <Square size={10} fill="currentColor" />
                      </button>
                    )}
                    <span className={`text-[10px] font-mono px-1 min-w-[50px] text-center ${isTimerRunning ? 'text-white' : 'text-[#666]'}`}>
                      {formatTime(timer)}
                    </span>
                  </div>
                </div>
                <button onClick={handleVisualize} disabled={loading} className="px-3 py-1 bg-cyber-purple text-white rounded text-xs flex items-center gap-1">
                  {loading ? <RefreshCcw className="animate-spin" size={12} /> : <PlayCircle size={12} />} Run
                </button>
              </div>
              <CodeEditor
                code={code}
                setCode={setCode}
                activeLine={currentStepIndex >= 0 ? steps[currentStepIndex]?.line : undefined}
                timerValue={formatTime(timer)}
              />
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#1e1e1e] p-4 pb-24 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#858585] uppercase">Execution Steps</h3>
                {steps.length > 0 && (
                  <button
                    onClick={handleSaveAsDocument}
                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${saveSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-[#333] hover:bg-[#444] text-[#ccc]'
                      }`}
                  >
                    {saveSuccess ? <Check size={12} /> : <FileText size={12} />}
                    {saveSuccess ? 'Saved!' : 'Save as Doc'}
                  </button>
                )}
              </div>
              {steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-20 text-[#555]">
                  <Cpu size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Run visualization to see step-by-step execution</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Timeline connector */}
                  <div className="relative">
                    {steps.map((step, idx) => (
                      <div key={idx} className="relative flex gap-4 group">
                        {/* Vertical line connector */}
                        {idx < steps.length - 1 && (
                          <div className="absolute left-3 top-8 w-0.5 h-full bg-gradient-to-b from-cyber-purple/50 to-transparent" />
                        )}

                        {/* Step number circle */}
                        <div className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-br from-cyber-purple to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform">
                          {step.step}
                        </div>

                        {/* Step content card */}
                        <div className="flex-1 bg-[#252526] border border-[#333] rounded-lg p-4 hover:border-cyber-purple/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] group-hover:-translate-y-0.5">
                          {/* Line number badge */}
                          {(step as any).line && (
                            <div className="inline-block px-2 py-1 bg-[#1e1e1e] border border-cyber-blue/30 rounded text-xs text-cyber-blue font-mono mb-2">
                              Line {(step as any).line}
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-[#d4d4d4] text-sm leading-relaxed mb-2">{step.description}</p>

                          {/* Variables changed */}
                          {Object.keys(step.changedVariables).length > 0 && (
                            <div className="bg-[#1e1e1e] border border-[#444] p-3 rounded text-xs font-mono mt-3">
                              <div className="text-[#858585] uppercase text-[10px] font-bold mb-2">Variables</div>
                              <div className="space-y-1">
                                {Object.entries(step.changedVariables).map(([key, value]) => (
                                  <div key={key} className="flex gap-2">
                                    <span className="text-[#4EC9B0]">{key}</span>
                                    <span className="text-[#555]">=</span>
                                    <span className="text-[#CE9178]">{JSON.stringify(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
        }

        {/* STORY & DIAGRAM & CONCEPT Shared Layout */}
        {
          activeTab !== 'EXECUTION' && (
            <div className="w-full h-full flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-[#333]">
                {/* Controls */}
                <div className="p-4 bg-[#252526] border-b border-[#333] space-y-4">
                  {activeTab === 'CONCEPT' && (
                    <input
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#333] p-2 rounded text-white text-xs"
                      placeholder="Enter concept (e.g. Database Indexing)"
                    />
                  )}

                  <div className="flex flex-wrap gap-4">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-[#1e1e1e] border border-[#333] p-2 rounded text-white text-xs flex-1 min-w-[100px]"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Gujarati</option>
                      <option>Telugu</option>
                      <option>Kannada</option>
                    </select>

                    {activeTab === 'CONCEPT' && (
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="bg-[#1e1e1e] border border-[#333] p-2 rounded text-white text-xs flex-1 min-w-[100px]"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    )}

                    <button
                      onClick={activeTab === 'STORY' ? handleGenerateStory : activeTab === 'DIAGRAM' ? handleGenerateDiagram : handleExplainConcept}
                      disabled={contentLoading}
                      className="px-4 py-2 bg-cyber-blue text-white rounded text-xs font-bold disabled:opacity-50 flex-1 min-w-[80px]"
                    >
                      {contentLoading ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </div>

                {/* Editor for Story/Diagram input */}
                {activeTab !== 'CONCEPT' && (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="bg-[#2d2d2d] px-2 py-1 text-xs text-[#ccc]">Input Code</div>
                    <CodeEditor
                      code={activeTab === 'STORY' ? storyCode : apiCode}
                      setCode={activeTab === 'STORY' ? setStoryCode : setApiCode}
                    />
                  </div>
                )}
              </div>

              {/* Output Panel */}
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#1e1e1e] p-6 pb-24 overflow-y-auto border-t lg:border-t-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[#858585] uppercase flex items-center gap-2">
                    <FileCode size={14} /> AI Output
                  </h3>
                  {outputContent && (
                    <button
                      onClick={handleSaveAsDocument}
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-all ${saveSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-[#333] hover:bg-[#444] text-[#ccc]'
                        }`}
                    >
                      {saveSuccess ? <Check size={12} /> : <FileText size={12} />}
                      {saveSuccess ? 'Saved!' : 'Save as Doc'}
                    </button>
                  )}
                </div>
                {outputContent ? (
                  <div className="prose prose-invert prose-sm font-mono whitespace-pre-wrap leading-relaxed text-[#d4d4d4]">
                    {outputContent}
                  </div>
                ) : (
                  <div className="text-[#555] text-center mt-20">
                    {activeTab === 'STORY' && "Paste code and click Generate to see the story."}
                    {activeTab === 'DIAGRAM' && "Paste API route and click Generate to see the flow."}
                    {activeTab === 'CONCEPT' && "Enter a concept to get a simplified explanation."}
                  </div>
                )}
              </div>
            </div>
          )
        }

      </div >
    </div >
  );
};