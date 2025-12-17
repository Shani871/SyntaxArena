import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DocumateMessage as Message } from '../../types';
import { Bot, User, Copy, FilePlus, Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onInsert?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onInsert }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary text-white' : 'bg-green-600 text-white'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content Column */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
          {/* Bubble */}
          <div
            className={`
                p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${isUser
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }
              `}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Actions (Only for AI) */}
          {!isUser && (
            <div className="flex items-center gap-3 mt-1.5 ml-1">
              <button
                onClick={handleCopy}
                className="text-[10px] font-medium uppercase tracking-wide text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {onInsert && (
                <button
                  onClick={() => onInsert(message.content)}
                  className="text-[10px] font-medium uppercase tracking-wide text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
                  title="Append to document"
                >
                  <FilePlus size={12} />
                  Insert to Doc
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};