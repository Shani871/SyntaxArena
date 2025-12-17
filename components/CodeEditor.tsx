import React, { useRef, useState } from 'react';
import Editor, { OnMount } from "@monaco-editor/react";
import { Lock } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  preventPaste?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language = "javascript",
  readOnly = false,
  preventPaste = false
}) => {
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Cyberpunk Theme
    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'type', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a',
        'editorLineNumber.foreground': '#6272a4',
        'editor.selectionBackground': '#44475a',
        'editorCursor.foreground': '#f8f8f2',
      }
    });

    monaco.editor.setTheme('cyberpunk');

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
    <div className="w-full h-full relative overflow-hidden bg-[#1e1e1e]">
      {/* Paste Warning Overlay */}
      {showPasteWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900/90 text-white px-6 py-3 rounded-lg border border-red-500 shadow-2xl z-50 flex items-center gap-3 animate-bounce">
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
        theme="cyberpunk"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          cursorStyle: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: !preventPaste, // Disable context menu if paste prevented (simple measure)
        }}
      />
    </div>
  );
};