import React, { useState } from 'react';
import { FileText, Search, Plus, Save, Edit3, Trash2, Folder, ChevronRight, CornerDownRight, X } from 'lucide-react';

interface Doc {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}

const INITIAL_DOCS: Doc[] = [
  {
    id: '1',
    title: 'Introduction',
    category: 'Getting Started',
    content: "Backend development refers to the server-side development of web applications. It focuses on databases, scripting, website architecture, and API design.\n\nKey Components:\n- Server: A computer that listens for incoming requests.\n- Database: Organized collection of data.\n- API: Mechanism for software communication.",
    lastUpdated: '2 mins ago'
  },
  {
    id: '2',
    title: 'Installation',
    category: 'Getting Started',
    content: "To get started with the SyntaxArena backend environment:\n\n1. npm install @syntax-arena/core\n2. Configure your .env file\n3. Run the development server with 'npm run dev'",
    lastUpdated: '1 hour ago'
  },
  {
    id: '3',
    title: 'HTTP Methods',
    category: 'Core Concepts',
    content: "Standard HTTP methods used in RESTful APIs:\n\nGET - Retrieve data\nPOST - Submit new data\nPUT - Update existing data\nDELETE - Remove data\nPATCH - Partial update",
    lastUpdated: '1 day ago'
  }
];

export const Documentation: React.FC = () => {
    const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
    const [selectedDocId, setSelectedDocId] = useState<string | null>('1');
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form state for editing
    const [editForm, setEditForm] = useState<Partial<Doc>>({});

    const selectedDoc = docs.find(d => d.id === selectedDocId);

    // Group docs by category
    const categories = Array.from(new Set(docs.map(d => d.category)));
    const filteredDocs = docs.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectDoc = (doc: Doc) => {
        if (isEditing && window.confirm("Discard unsaved changes?")) {
            setIsEditing(false);
            setSelectedDocId(doc.id);
        } else if (!isEditing) {
            setSelectedDocId(doc.id);
        }
    };

    const handleStartEdit = () => {
        if (!selectedDoc) return;
        setEditForm({ ...selectedDoc });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!selectedDocId || !editForm) return;
        
        setDocs(prev => prev.map(d => 
            d.id === selectedDocId 
                ? { ...d, ...editForm, lastUpdated: 'Just now' } as Doc 
                : d
        ));
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newDoc: Doc = {
            id: Date.now().toString(),
            title: 'Untitled Document',
            category: 'Uncategorized',
            content: 'Start writing your documentation here...',
            lastUpdated: 'Just now'
        };
        setDocs([...docs, newDoc]);
        setSelectedDocId(newDoc.id);
        setEditForm(newDoc);
        setIsEditing(true);
    };

    const handleDelete = () => {
        if (!selectedDocId) return;
        if (window.confirm("Are you sure you want to delete this document?")) {
            const newDocs = docs.filter(d => d.id !== selectedDocId);
            setDocs(newDocs);
            setSelectedDocId(newDocs.length > 0 ? newDocs[0].id : null);
            setIsEditing(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col md:flex-row bg-[#1e1e1e] font-mono text-sm overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-72 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-[#333] bg-[#252526] flex flex-col shrink-0">
                {/* Search & Add */}
                <div className="p-4 border-b border-[#333] space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#858585] uppercase tracking-wider">Explorer</span>
                        <button 
                            onClick={handleCreateNew}
                            className="p-1 hover:bg-[#333] rounded text-[#ccc] hover:text-white transition-colors"
                            title="New Document"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 flex items-center gap-2 group focus-within:border-cyber-blue transition-colors">
                        <Search size={14} className="text-[#555] group-focus-within:text-cyber-blue" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white text-xs focus:outline-none w-full placeholder-[#555]"
                        />
                    </div>
                </div>

                {/* Doc List */}
                <div className="flex-1 overflow-y-auto p-2 pb-24 md:pb-2">
                    {categories.map(cat => {
                        const catDocs = filteredDocs.filter(d => d.category === cat);
                        if (catDocs.length === 0) return null;

                        return (
                            <div key={cat} className="mb-2">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#858585] px-2 py-1 uppercase tracking-wider">
                                    <Folder size={12} /> {cat}
                                </div>
                                <div className="space-y-0.5">
                                    {catDocs.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleSelectDoc(doc)}
                                            className={`w-full text-left px-3 py-1.5 rounded flex items-center gap-2 text-xs transition-all border-l-2 ${
                                                selectedDocId === doc.id 
                                                    ? 'bg-[#333] text-white border-cyber-blue' 
                                                    : 'text-[#999] hover:bg-[#2d2d2d] hover:text-[#ccc] border-transparent'
                                            }`}
                                        >
                                            <FileText size={12} className={selectedDocId === doc.id ? "text-cyber-blue" : "text-[#666]"} /> 
                                            <span className="truncate">{doc.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    
                    {filteredDocs.length === 0 && (
                        <div className="text-center text-[#555] mt-4 text-xs">No documents found.</div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] h-2/3 md:h-full">
                {selectedDoc ? (
                    <>
                        {/* Toolbar */}
                        <div className="h-14 border-b border-[#333] bg-[#252526] flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyber-blue/10 rounded text-cyber-blue">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={editForm.title || ''}
                                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                            className="bg-[#1e1e1e] border border-[#444] rounded px-2 py-0.5 text-sm font-bold text-white focus:border-cyber-blue outline-none w-32 md:w-64"
                                            placeholder="Document Title"
                                        />
                                    ) : (
                                        <h1 className="text-sm font-bold text-white line-clamp-1">{selectedDoc.title}</h1>
                                    )}
                                    <div className="flex items-center gap-2 text-[10px] text-[#858585] mt-0.5">
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={editForm.category || ''}
                                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                                className="bg-[#1e1e1e] border border-[#444] rounded px-1 py-0 text-[10px] text-[#858585] focus:border-cyber-blue outline-none"
                                                placeholder="Category"
                                            />
                                        ) : (
                                           <>
                                             <span className="hidden md:inline">{selectedDoc.category}</span>
                                             <span className="hidden md:inline">•</span>
                                             <span>Last edited {selectedDoc.lastUpdated}</span>
                                           </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1.5 rounded hover:bg-[#333] text-[#858585] text-xs font-bold transition-colors flex items-center gap-2"
                                        >
                                            <X size={14} /> <span className="hidden md:inline">Cancel</span>
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            <Save size={14} /> <span className="hidden md:inline">Save Changes</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleDelete}
                                            className="p-2 rounded hover:bg-red-900/20 text-[#858585] hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button 
                                            onClick={handleStartEdit}
                                            className="px-3 py-1.5 rounded bg-cyber-blue hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            <Edit3 size={14} /> <span className="hidden md:inline">Edit Doc</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Editor / View */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col pb-24">
                            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                                {isEditing ? (
                                    <textarea 
                                        value={editForm.content || ''}
                                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                                        className="w-full flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed p-4 border border-[#333] rounded focus:border-cyber-blue outline-none resize-none"
                                        placeholder="Type your documentation content here..."
                                        spellCheck={false}
                                    />
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-[#d4d4d4] leading-relaxed font-mono">
                                            {selectedDoc.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#555]">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">Select a document to view or edit</p>
                    </div>
                )}
            </div>
        </div>
    );
};