import React from 'react';
import { DocumatePage as Page } from '../../types';
import { Plus, File, Trash2, FileText } from 'lucide-react';

interface PageListProps {
  pages: Page[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: (id: string, e: React.MouseEvent) => void;
}

export const PageList: React.FC<PageListProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          Pages
        </h2>
        <button
          onClick={onAddPage}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
          title="Create New Page"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-1">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <div
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className={`
                group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                ${isActive ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-gray-200/50 border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <File size={16} className={isActive ? 'text-primary' : 'text-gray-400'} />
                <span className={`text-sm font-medium truncate ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {page.title.trim() || 'Untitled Page'}
                </span>
              </div>

              <button
                onClick={(e) => onDeletePage(page.id, e)}
                className={`
                  p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100
                  ${isActive ? 'opacity-100' : ''}
                `}
                title="Delete Page"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}

        {pages.length === 0 && (
          <div className="text-center py-8 px-4 text-gray-400 text-sm">
            No pages. Click + to create one.
          </div>
        )}
      </div>
    </div>
  );
};