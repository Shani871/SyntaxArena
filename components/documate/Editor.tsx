import React from 'react';

interface EditorProps {
  title: string;
  content: string;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (newContent: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  title, 
  content, 
  onTitleChange, 
  onContentChange 
}) => {
  return (
    <div className="flex flex-col h-full bg-white relative w-full">
      {/* Title Header */}
      <div className="flex-none px-8 py-6 border-b border-gray-100">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Page"
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 focus:outline-none bg-transparent p-0"
        />
      </div>
      
      {/* Content Area */}
      <div className="flex-grow relative">
        <textarea
          className="w-full h-full p-8 pt-6 resize-none focus:outline-none text-gray-800 text-lg leading-relaxed font-sans"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
};