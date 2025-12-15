import React, { useState } from 'react';
import { Box, Cpu, Languages, RefreshCcw, PlayCircle, BookOpen, Share2, FileCode } from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { visualizeCodeExecution, explainConceptSimple, generateCodeStory, generateApiDiagram } from '../services/geminiService';
import { VisualizerStep } from '../types';

export const Visualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EXECUTION' | 'STORY' | 'DIAGRAM' | 'CONCEPT'>('EXECUTION');
  
  // Execution State
  const [code, setCode] = useState(`function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`);
  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [loading, setLoading] = useState(false);
  
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

  const handleVisualize = async () => {
    setLoading(true);
    const result = await visualizeCodeExecution(code);
    setSteps(result);
    setLoading(false);
  };

  const handleExplainConcept = async () => {
    setContentLoading(true);
    const result = await explainConceptSimple(concept, language, difficulty);
    setOutputContent(result);
    setContentLoading(false);
  };

  const handleGenerateStory = async () => {
    setContentLoading(true);
    const result = await generateCodeStory(storyCode, language);
    setOutputContent(result);
    setContentLoading(false);
  };

  const handleGenerateDiagram = async () => {
    setContentLoading(true);
    const result = await generateApiDiagram(apiCode);
    setOutputContent(result);
    setContentLoading(false);
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden font-mono text-sm">
      
      {/* Header Tabs */}
      <div className="flex border-b border-[#333] bg-[#252526] overflow-x-auto">
          <button 
            onClick={() => setActiveTab('EXECUTION')} 
            className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'EXECUTION' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-purple' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
          >
             <Cpu size={14}/> Execution Flow
          </button>
          <button 
            onClick={() => setActiveTab('STORY')} 
            className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'STORY' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-neon' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
          >
             <BookOpen size={14}/> Code Story
          </button>
          <button 
            onClick={() => setActiveTab('DIAGRAM')} 
            className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'DIAGRAM' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-blue' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
          >
             <Share2 size={14}/> API Visualizer
          </button>
          <button 
            onClick={() => setActiveTab('CONCEPT')} 
            className={`px-4 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap ${activeTab === 'CONCEPT' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-cyber-danger' : 'text-[#858585] hover:bg-[#2a2d2e]'}`}
          >
             <Languages size={14}/> Concept Simplifier
          </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* EXECUTION MODE */}
        {activeTab === 'EXECUTION' && (
             <div className="w-full h-full flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-[#333]">
                   <div className="flex justify-between items-center p-2 bg-[#2d2d2d] border-b border-[#333]">
                      <span className="text-xs text-[#ccc] pl-2">Input Code</span>
                      <button onClick={handleVisualize} disabled={loading} className="px-3 py-1 bg-cyber-purple text-white rounded text-xs flex items-center gap-1">
                          {loading ? <RefreshCcw className="animate-spin" size={12}/> : <PlayCircle size={12}/>} Run
                      </button>
                   </div>
                   <CodeEditor code={code} setCode={setCode} />
                </div>
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#1e1e1e] p-4 pb-24 overflow-y-auto">
                    <h3 className="text-xs font-bold text-[#858585] mb-4 uppercase">Execution Steps</h3>
                    {steps.length === 0 ? (
                         <div className="text-[#555] text-center mt-10">Run visualization to see steps.</div>
                    ) : (
                         <div className="space-y-4">
                             {steps.map((step, idx) => (
                                 <div key={idx} className="flex gap-4">
                                     <div className="w-6 h-6 rounded-full bg-[#333] text-white flex items-center justify-center text-xs font-bold shrink-0">{step.step}</div>
                                     <div>
                                         <p className="text-[#d4d4d4] mb-1">{step.description}</p>
                                         {Object.keys(step.changedVariables).length > 0 && (
                                             <div className="bg-[#252526] p-2 rounded text-xs text-[#9cdcfe] font-mono">
                                                 {JSON.stringify(step.changedVariables).replace(/["{}]/g, '').replace(/:/g, ' = ')}
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                    )}
                </div>
             </div>
        )}

        {/* STORY & DIAGRAM & CONCEPT Shared Layout */}
        {activeTab !== 'EXECUTION' && (
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
                    <h3 className="text-xs font-bold text-[#858585] mb-4 uppercase flex items-center gap-2">
                        <FileCode size={14}/> AI Output
                    </h3>
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
        )}

      </div>
    </div>
  );
};