import React, { useRef, useState } from 'react';
import Editor, { OnMount } from "@monaco-editor/react";
import { Lock, FileCode, X, Search, GitBranch, Settings, Bell, Menu, Clock } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  preventPaste?: boolean;
  theme?: string;
  activeLine?: number;
  filename?: string;
  timerValue?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language = "javascript",
  readOnly = false,
  preventPaste = false,
  theme = "vs-dark",
  activeLine,
  filename = "script.js",
  timerValue
}) => {
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const editorRef = useRef<any>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const decorationsRef = useRef<any[]>([]);

  // Effect to update line highlight
  React.useEffect(() => {
    if (editorRef.current && activeLine) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new (window as any).monaco.Range(activeLine, 1, activeLine, 1),
          options: {
            isWholeLine: true,
            className: 'myLineDecoration',
            inlineClassName: 'myInlineDecoration'
          }
        }
      ]);
      editorRef.current.revealLineInCenter(activeLine);
    } else if (editorRef.current) {
      // Clear decorations if no active line
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Add Highlight CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .myLineDecoration { background: rgba(59, 130, 246, 0.3) !important; border-left: 2px solid #3b82f6; }
    `;
    document.head.appendChild(style);

    // Prevent Paste Logic
    if (preventPaste) {
      editor.onKeyDown((e) => {
        if ((e.metaKey || e.ctrlKey) && e.code === 'KeyV') {
          e.preventDefault();
          e.stopPropagation();
          setShowPasteWarning(true);
          setTimeout(() => setShowPasteWarning(false), 2000);
        }
      });
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#1e1e1e] border-l border-[#2b2b2b]">
      {/* VS Code Title / Tabs Bar */}
      <div className="flex bg-[#252526] h-9 shrink-0 select-none">
        <div className="flex items-center bg-[#1e1e1e] border-t border-blue-500 pr-3 min-w-[120px] text-[#e7e7e7] text-xs px-3 gap-2 cursor-pointer">
          <FileCode size={14} className="text-blue-400" />
          <span>{filename}</span>
          <X size={14} className="ml-auto hover:bg-[#333] rounded p-0.5" />
        </div>
        <div className="flex-1 bg-[#2d2d2d]"></div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        {/* Paste Warning Overlay */}
        {showPasteWarning && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white px-6 py-3 rounded-lg border border-red-500 shadow-2xl z-50 flex items-center gap-3 animate-bounce">
            <Lock size={20} />
            <span className="font-bold">Paste Disabled in Competitive Mode</span>
          </div>
        )}

        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          theme={theme || "vs-dark"}
          options={{
            minimap: { enabled: true }, // Enable minimap like VS Code
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: true, // VS Code default
            readOnly: readOnly,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            cursorStyle: "line",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: !preventPaste,
            bracketPairColorization: {
              enabled: true, // VS Code feature
            },
            renderLineHighlight: 'all',
          }}
        />
      </div>

      {/* VS Code Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] select-none shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
            <GitBranch size={10} />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
            <X size={10} className="rounded-full border border-white p-[1px]" />
            <span>0</span>
            <Bell size={10} />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {timerValue && (
            <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer font-bold">
              <Clock size={10} />
              <span>{timerValue}</span>
            </div>
          )}
          <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
          <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
            UTF-8
          </div>
          <div className="hover:bg-white/20 px-1 rounded cursor-pointer uppercase">
            {language}
          </div>
          <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
            <Bell size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};