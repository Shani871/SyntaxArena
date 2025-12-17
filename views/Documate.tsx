import React, { useState, useMemo } from 'react';
import { Editor } from '../components/documate/Editor';
import { ChatSidebar } from '../components/documate/ChatSidebar';
import { PageList } from '../components/documate/PageList';
import { DocumatePage, DocumateMessage } from '../types';
import { MessageSquare, FileText, X, Menu } from 'lucide-react';

const INITIAL_PAGE_ID = 'init-1';
const INITIAL_PAGES: DocumatePage[] = [
    {
        id: INITIAL_PAGE_ID,
        title: 'Project Proposal: SmartGarden',
        content: `## Executive Summary
SmartGarden is an IoT-based solution designed to help urban gardeners monitor and maintain their plants remotely.

## Problem Statement
Urban dwellers often struggle with maintaining plants due to busy schedules.

## Timeline
- **Phase 1**: Prototyping hardware.
- **Phase 2**: App development.`,
        lastModified: Date.now()
    }
];

export const Documate: React.FC = () => {
    const [pages, setPages] = useState<DocumatePage[]>(INITIAL_PAGES);
    const [activePageId, setActivePageId] = useState<string>(INITIAL_PAGE_ID);

    // Mobile UI States
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const activePage = pages.find(p => p.id === activePageId) || pages[0];

    // Combine all pages for the AI context so it knows the whole project structure
    const fullDocumentContext = useMemo(() => {
        return pages.map(p => `--- Page: ${p.title || 'Untitled'} ---\n${p.content}`).join('\n\n');
    }, [pages]);

    const handleAddPage = () => {
        const newPage: DocumatePage = {
            id: Date.now().toString(),
            title: '',
            content: '',
            lastModified: Date.now()
        };
        setPages(prev => [...prev, newPage]);
        setActivePageId(newPage.id);
        setIsMobileMenuOpen(false); // Close menu on mobile after action
    };

    const handleDeletePage = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (pages.length <= 1) {
            alert("You cannot delete the only page.");
            return;
        }

        if (confirm("Are you sure you want to delete this page?")) {
            const newPages = pages.filter(p => p.id !== id);
            setPages(newPages);
            if (activePageId === id) {
                setActivePageId(newPages[0].id);
            }
        }
    };

    const updateActivePage = (updates: Partial<DocumatePage>) => {
        setPages(prev => prev.map(p =>
            p.id === activePageId
                ? { ...p, ...updates, lastModified: Date.now() }
                : p
        ));
    };

    const handleInsertContent = (text: string) => {
        if (!activePage) return;
        const currentContent = activePage.content;
        const newContent = currentContent ? currentContent + "\n\n" + text : text;
        updateActivePage({ content: newContent });
    };

    return (
        <div className="h-full w-full flex flex-col bg-gray-100 overflow-hidden text-slate-900">
            {/* Mobile Header */}
            <div className="lg:hidden flex-none h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 relative">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="font-bold text-gray-800 text-lg">
                        <span className="text-primary">DocuMate</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium transition-colors border border-gray-200"
                >
                    {isMobileChatOpen ? (
                        <>
                            <FileText size={16} />
                            <span>Doc</span>
                        </>
                    ) : (
                        <>
                            <MessageSquare size={16} className="text-primary" />
                            <span>AI</span>
                        </>
                    )}
                </button>
            </div>

            {/* Main Layout Content */}
            <div className="flex-grow flex relative overflow-hidden">

                {/* Left Sidebar (Page List) */}
                <div
                    className={`
            fixed inset-y-0 left-0 z-20 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex
            ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-0 lg:w-auto'}
          `}
                >
                    <PageList
                        pages={pages}
                        activePageId={activePageId}
                        onSelectPage={(id) => { setActivePageId(id); setIsMobileMenuOpen(false); }}
                        onAddPage={handleAddPage}
                        onDeletePage={handleDeletePage}
                    />
                </div>

                {/* Overlay for mobile sidebar */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-10 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Editor Pane */}
                <div className="flex-grow flex flex-col min-w-0 bg-white">
                    {activePage ? (
                        <Editor
                            title={activePage.title}
                            content={activePage.content}
                            onTitleChange={(t) => updateActivePage({ title: t })}
                            onContentChange={(c) => updateActivePage({ content: c })}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select or create a page
                        </div>
                    )}
                </div>

                {/* Chat Sidebar Pane (Right) */}
                <div
                    className={`
                h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out z-20
                lg:flex lg:w-2/5 xl:w-1/3
                ${isMobileChatOpen ? 'flex w-full absolute inset-0 lg:static' : 'hidden lg:flex'}
            `}
                >
                    {/* Mobile chat close button */}
                    {isMobileChatOpen && (
                        <button
                            onClick={() => setIsMobileChatOpen(false)}
                            className="lg:hidden absolute top-4 right-4 z-30 p-2 bg-gray-100 rounded-full text-gray-600 shadow-md"
                        >
                            <X size={20} />
                        </button>
                    )}
                    <div className="w-full h-full">
                        <ChatSidebar
                            documentContent={fullDocumentContext}
                            onInsertContent={handleInsertContent}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};
