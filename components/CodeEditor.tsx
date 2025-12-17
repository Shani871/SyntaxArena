import React, { useRef, useEffect, useState } from 'react';
import { XCircle, AlertTriangle, Lock } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  readOnly?: boolean;
  preventPaste?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, readOnly = false, preventPaste = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [activeTab, setActiveTab] = useState<'solution' | 'tests'>('solution');
  const [showPasteWarning, setShowPasteWarning] = useState(false);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const value = textarea.value;
    const selectionStart = textarea.selectionStart;

    const linesBefore = value.substring(0, selectionStart).split('\n');
    const currentLine = linesBefore.length;
    const currentCol = linesBefore[linesBefore.length - 1].length + 1;

    setCursorPosition({ line: currentLine, col: currentCol });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (preventPaste) {
      e.preventDefault();
      setShowPasteWarning(true);
      setTimeout(() => setShowPasteWarning(false), 2000);
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col overflow-hidden font-mono text-sm relative">
      {/* Paste Warning Overlay */}
      {showPasteWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900/90 text-white px-6 py-3 rounded-lg border border-red-500 shadow-2xl z-50 flex items-center gap-3 animate-bounce">
            <Lock size={20} />
            <span className="font-bold">Paste Disabled in Competitive Mode</span>
        </div>
      )}

      {/* Tab Bar */}
      <div className="bg-[#252526] flex items-center border-b border-[#2b2b2b] select-none h-9">
        <div 
          onClick={() => setActiveTab('solution')}
          className={`px-4 h-full text-xs flex items-center gap-2 cursor-pointer pr-10 relative border-r border-[#2b2b2b] transition-colors duration-200 ${activeTab === 'solution' ? 'bg-[#1e1e1e] text-white' : 'text-[#969696] hover:bg-[#2a2d2e]'}`}
        >
          <div className={`absolute top-0 left-0 w-full h-[2px] bg-cyber-blue transition-all duration-300 ease-out origin-center ${activeTab === 'solution' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
          <span className="text-[#f1e05a] font-bold">JS</span>
          <span>solution.js</span>
          <span className={`hover:bg-[#333] text-[#858585] hover:text-white rounded-md p-0.5 w-4 h-4 flex items-center justify-center absolute right-2 transition-opacity duration-200 ${activeTab === 'solution' ? 'opacity-100' : 'opacity-0'}`}>×</span>
        </div>
        <div 
          onClick={() => setActiveTab('tests')}
          className={`px-4 h-full text-xs flex items-center gap-2 cursor-pointer relative border-r border-[#2b2b2b] transition-colors duration-200 ${activeTab === 'tests' ? 'bg-[#1e1e1e] text-white' : 'text-[#969696] hover:bg-[#2a2d2e]'}`}
        >
           <div className={`absolute top-0 left-0 w-full h-[2px] bg-cyber-blue transition-all duration-300 ease-out origin-center ${activeTab === 'tests' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
           <span>tests.spec.js</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex relative overflow-hidden bg-[#1e1e1e]">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="w-12 bg-[#252526] border-r border-[#333] text-[#858585] text-right pr-3 pt-4 select-none overflow-hidden text-xs leading-6 opacity-70"
          style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className={cursorPosition.line === i + 1 ? "text-[#c6c6c6] font-bold" : ""}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onSelect={handleCursor}
          onKeyUp={handleCursor}
          onClick={handleCursor}
          onPaste={handlePaste}
          readOnly={readOnly}
          className="flex-1 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-0 pl-2 pt-4 leading-6 border-none outline-none resize-none whitespace-pre selection:bg-blue-900/50"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          style={{ 
            fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
            tabSize: 2 
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-[#2d2d2d] border-t border-[#333] px-3 py-1 text-[11px] text-[#ccc] flex justify-between items-center select-none z-10 h-6">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1 hover:text-white cursor-pointer">
             <div className="w-2 h-2 rounded-full border border-white bg-transparent"></div>
             master*
          </span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer">
             <XCircle size={10} className="text-red-500" /> 0
          </span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer">
             <AlertTriangle size={10} className="text-yellow-500" /> 0
          </span>
        </div>
        <div className="flex gap-4 opacity-80">
          <span className="hover:text-white cursor-pointer">Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
          <span className="hover:text-white cursor-pointer">Spaces: 2</span>
          <span className="hover:text-white cursor-pointer">UTF-8</span>
          <span className="hover:text-white cursor-pointer text-cyber-blue font-bold">JavaScript</span>
          {preventPaste && <span className="text-red-400 flex items-center gap-1"><Lock size={8} /> No-Paste</span>}
        </div>
      </div>
    </div>
  );
};