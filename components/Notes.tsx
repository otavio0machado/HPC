import React, { useState, useEffect, useRef } from 'react';
import { FileText, Folder, FolderPlus, FilePlus, ChevronRight, ChevronDown, Search, Trash2, Edit3, Eye, File as FileIcon, PanelLeftClose, PanelLeftOpen, Bold, Italic, List, Quote, Code, SplitSquareHorizontal, Strikethrough, ListOrdered, CheckSquare, Heading1, Heading2, Link as LinkIcon, Check } from 'lucide-react';
import { authService } from '../services/authService';
import { notesService } from '../services/notesService';
import { NoteFile } from '../types';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const Notes: React.FC = () => {
  // --- Global Data ---
  const [files, setFiles] = useState<NoteFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // --- Workspace State ---
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // UI States
  const [zenMode, setZenMode] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  // Modal & Settings
  const [creationModal, setCreationModal] = useState<{ isOpen: boolean, type: 'folder' | 'markdown', parentId: string | null }>({ isOpen: false, type: 'markdown', parentId: null });
  const [newItemName, setNewItemName] = useState('');

  // Refs
  const creationInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Storage
  const STORAGE_KEY = authService.getUserStorageKey('hpc_notes_obsidian');

  // --- Initialization ---
  useEffect(() => {
    const load = async () => {
      try {
        const data = await notesService.fetchNotes();
        if (data && data.length > 0) {
          setFiles(data);
          // Try to expand the first folder found if none are expanded
          const firstFolder = data.find(f => f.type === 'folder');
          if (firstFolder) setExpandedFolders(new Set([firstFolder.id]));
        } else {
          // If totally empty, maybe create a welcome note?
          // For now, just keep empty.
        }
      } catch (e) {
        console.error("Failed to load notes", e);
        toast.error("Erro ao carregar notas da nuvem.");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (creationModal.isOpen && creationInputRef.current) {
      setTimeout(() => creationInputRef.current?.focus(), 50);
    }
  }, [creationModal.isOpen]);

  // --- File Management ---

  // --- File Management ---

  const refreshFiles = async () => {
    try {
      const data = await notesService.fetchNotes();
      setFiles(data);
    } catch (e) {
      console.error("Refresh failed", e);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const { type, parentId } = creationModal;
    const name = newItemName.trim();

    const toastId = toast.loading("Criando...");

    const { data: newFile, error } = await notesService.createNote({
      parentId,
      name: type === 'markdown' ? (name.endsWith('.md') ? name : `${name}.md`) : name,
      type,
      content: type === 'markdown' ? '# ' + name : undefined
    });

    toast.dismiss(toastId);

    if (error || !newFile) {
      toast.error("Erro ao criar item");
      return;
    }

    setFiles(prev => [...prev, newFile]);

    if (type === 'markdown') {
      setActiveNoteId(newFile.id);
      setEditorViewMode('split');
      if (window.innerWidth < 768) setZenMode(true);
    } else {
      setExpandedFolders(prev => new Set(prev).add(newFile.id));
    }
    setCreationModal({ ...creationModal, isOpen: false });
    setNewItemName('');
  };



  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Excluir arquivo permanentemente?')) return;

    const toastId = toast.loading("Excluindo...");
    const success = await notesService.deleteNote(id);
    toast.dismiss(toastId);

    if (success) {
      toast.success("Excluído com sucesso");
      const idsToDelete = new Set<string>();
      const collectIds = (targetId: string) => {
        idsToDelete.add(targetId);
        files.filter(f => f.parentId === targetId).forEach(child => collectIds(child.id));
      };
      collectIds(id);

      setFiles(prev => prev.filter(f => !idsToDelete.has(f.id)));
      if (idsToDelete.has(activeNoteId || '')) setActiveNoteId(null);
    } else {
      toast.error("Erro ao excluir");
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const note = files.find(f => f.id === id);
    if (!note) return;

    const newStatus = !note.isFavorite;

    // Optimistic update
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isFavorite: newStatus } : f));

    const success = await notesService.updateNote(id, { isFavorite: newStatus });
    if (!success) {
      // Revert if failed
      setFiles(prev => prev.map(f => f.id === id ? { ...f, isFavorite: !newStatus } : f));
      toast.error("Erro ao atualizar favorito");
    }
  };

  // --- Editor Logic ---

  const updateContent = async (id: string, newContent: string) => {
    // Update local state first for immediate UI response
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content: newContent, updatedAt: Date.now() } : f));

    // Simple debounce would be better, but let's do direct update for now or just trust local sync
    // In a real app we'd debounce the Supabase call.
    await notesService.updateNote(id, { content: newContent });
  };

  const handleEditorScroll = () => {
    if (editorViewMode !== 'split' || !textareaRef.current || !previewRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;

    const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current || !activeNoteId) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newContent = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    updateContent(activeNoteId, newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const triggerSaveFeedback = () => {
    setShowSaveFeedback(true);
    setTimeout(() => setShowSaveFeedback(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertMarkdown('  ');
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); insertMarkdown('**', '**'); break;
        case 'i': e.preventDefault(); insertMarkdown('*', '*'); break;
        case 'k': e.preventDefault(); insertMarkdown('[', '](url)'); break;
        case 's': e.preventDefault(); triggerSaveFeedback(); break;
      }
    }
  };

  // --- Rendering Helpers ---

  const MarkdownLink = (props: any) => {
    return (
      <a
        {...props}
        className="text-blue-400 hover:underline"
        target="_blank"
      >
        {props.children}
      </a>
    );
  };

  const renderTree = (parentId: string | null, depth = 0) => {
    const nodes = files.filter(f => f.parentId === parentId).sort((a, b) => a.type === 'folder' ? -1 : 1);

    return nodes.map(node => {
      if (searchTerm && node.type !== 'folder' && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) return null;

      const isExpanded = expandedFolders.has(node.id);
      const isFolder = node.type === 'folder';
      const isActiveNote = activeNoteId === node.id;

      return (
        <div key={node.id} style={{ paddingLeft: depth > 0 ? 12 : 0 }}>
          <div
            className={`flex items-center justify-between group px-3.5 py-2 cursor-pointer rounded-xl text-sm mb-1 transition-all duration-300
                ${isActiveNote
                ? 'bg-blue-600/20 text-blue-200 shadow-[0_4px_12px_rgba(37,99,235,0.2)] backdrop-blur-md border border-blue-500/20'
                : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-100 hover:scale-[1.02]'}
              `}}
          onClick={() => {
            if (isFolder) {
              const next = new Set(expandedFolders);
              if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
              setExpandedFolders(next);
            } else if (node.type === 'markdown') {
              setActiveNoteId(node.id);
              setEditorViewMode('split');
            }
          }}
          >
          <div className="flex items-center gap-2 truncate flex-1">
            {isFolder && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            {!isFolder && <span className="w-3.5"></span>}
            {node.type === 'folder' ? <Folder size={14} className="text-zinc-500" /> :
              <FileText size={14} className="text-blue-500" />}
            <span className="truncate">{node.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            {isFolder && <button onClick={(e) => { e.stopPropagation(); setCreationModal({ isOpen: true, type: 'markdown', parentId: node.id }); }}><FilePlus size={12} /></button>}
            <button onClick={(e) => handleDelete(node.id, e)} className="hover:text-red-400"><Trash2 size={12} /></button>
          </div>
        </div>
          { isFolder && isExpanded && <div className="ml-3 border-l border-zinc-800">{renderTree(node.id, depth + 1)}</div> }
        </div >
      );
    });
  };

const activeNote = files.find(f => f.id === activeNoteId);

return (
  <div className="relative h-[calc(100vh-140px)] flex glass-hydro rounded-[32px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-2xl">

    {/* --- SIDEBAR --- */}
    {!zenMode && (
      <div className="w-72 flex flex-col border-r border-white/5 bg-black/10 z-10 flex-shrink-0 backdrop-blur-xl">
        <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
          <span className="font-bold text-zinc-300 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Cofre HPC</span>
          <div className="flex gap-1.5">
            <button onClick={() => setCreationModal({ isOpen: true, type: 'folder', parentId: null })} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10 bubble-hover" title="Nova Pasta"><FolderPlus size={14} /></button>
            <button onClick={() => setCreationModal({ isOpen: true, type: 'markdown', parentId: null })} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10 bubble-hover" title="Nova Nota"><Edit3 size={14} /></button>
          </div>
        </div>
        <div className="p-2 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-zinc-600" size={12} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filtrar..." className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 pl-7 py-1 text-xs text-white focus:border-blue-500 outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">{renderTree(null)}</div>
      </div>
    )}

    {/* --- WORKBENCH AREA --- */}
    <div className="flex-1 flex overflow-hidden relative">

      {/* LEFT: MARKDOWN EDITOR */}
      {activeNote ? (
        <div className={`flex-1 flex flex-col min-w-0 transition-all ${showPdfPane ? 'border-r border-white/10' : ''}`}>
          {/* Editor Toolbar */}
          <div className="h-12 border-b border-white/10 flex items-center justify-between px-3 bg-white/5 select-none">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setZenMode(!zenMode)} className="text-zinc-500 hover:text-white flex-shrink-0">{zenMode ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
              <span className="text-sm font-medium text-white truncate max-w-[120px] md:max-w-xs">{activeNote.name}</span>
              {showSaveFeedback && <span className="text-[10px] text-emerald-500 animate-pulse flex items-center gap-1 hidden md:flex"><Check size={10} /> Salvo</span>}
            </div>

            <div className="flex items-center gap-1">
              {/* Formatting Tools */}
              <div className="hidden md:flex items-center gap-0.5 bg-black/20 rounded p-0.5 border border-white/5 mr-2">
                <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Negrito (Ctrl+B)"><Bold size={14} /></button>
                <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Itálico (Ctrl+I)"><Italic size={14} /></button>
                <button onClick={() => insertMarkdown('~~', '~~')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Taxado"><Strikethrough size={14} /></button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button onClick={() => insertMarkdown('# ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Título 1"><Heading1 size={14} /></button>
                <button onClick={() => insertMarkdown('## ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Título 2"><Heading2 size={14} /></button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button onClick={() => insertMarkdown('- ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Lista"><List size={14} /></button>
                <button onClick={() => insertMarkdown('1. ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Lista Numérica"><ListOrdered size={14} /></button>
                <button onClick={() => insertMarkdown('- [ ] ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Checklist"><CheckSquare size={14} /></button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button onClick={() => insertMarkdown('> ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Citação"><Quote size={14} /></button>
                <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Código"><Code size={14} /></button>
              </div>

              {/* View Modes */}
              <div className="flex bg-black/20 rounded p-0.5 border border-white/5">
                <button onClick={() => setEditorViewMode('edit')} className={`p-1.5 rounded ${editorViewMode === 'edit' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`} title="Apenas Editor"><Edit3 size={14} /></button>
                <button onClick={() => setEditorViewMode('split')} className={`p-1.5 rounded ${editorViewMode === 'split' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`} title="Live Preview (Dividido)"><SplitSquareHorizontal size={14} /></button>
                <button onClick={() => setEditorViewMode('preview')} className={`p-1.5 rounded ${editorViewMode === 'preview' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`} title="Apenas Leitura"><Eye size={14} /></button>
              </div>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Pane */}
            {(editorViewMode === 'edit' || editorViewMode === 'split') && (
              <textarea
                ref={textareaRef}
                value={activeNote.content || ''}
                onChange={(e) => updateContent(activeNote.id, e.target.value)}
                onScroll={handleEditorScroll}
                onKeyDown={handleKeyDown}
                className={`flex-1 h-full bg-transparent p-6 font-mono text-sm text-zinc-300 resize-none focus:outline-none custom-scrollbar leading-relaxed selection:bg-blue-500/30 ${editorViewMode === 'split' ? 'border-r border-white/10' : ''}`}
                placeholder="# Comece sua nota..."
              />
            )}

            {/* Preview Pane (Live Feedback) */}
            {(editorViewMode === 'preview' || editorViewMode === 'split') && (
              <div
                ref={previewRef}
                className={`flex-1 h-full overflow-y-auto custom-scrollbar bg-black/5 p-8 prose prose-invert prose-zinc max-w-none 
                                     prose-headings:text-white prose-p:leading-7 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
                                     prose-code:text-purple-300 prose-code:bg-black/30 prose-code:px-1 prose-code:rounded 
                                     prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 
                                     prose-blockquote:border-blue-500 prose-blockquote:bg-white/5 prose-blockquote:not-italic prose-blockquote:px-4 prose-blockquote:py-1
                                     ${editorViewMode === 'split' ? 'w-1/2' : 'w-full'}
                           `}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                  components={{ a: MarkdownLink }}
                >
                  {activeNote.content || ''}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/50">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"><Edit3 size={40} /></div>
          <h3 className="text-white font-bold text-2xl tracking-tight mb-2 text-spatial">Workbench de Pesquisa</h3>
          <p className="text-sm max-w-sm text-center text-zinc-400 leading-relaxed">Crie ou selecione uma nota para começar a escrever.</p>
        </div>
      )}
    </div>


    {/* Creation Modal */}
    {creationModal.isOpen && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-80 shadow-2xl animate-in zoom-in-95">
          <h3 className="text-lg font-bold text-white mb-4">{creationModal.type === 'folder' ? 'Nova Pasta' : 'Nova Nota'}</h3>
          <form onSubmit={handleCreateSubmit}>
            <input
              ref={creationInputRef}
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Nome..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none mb-4"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setCreationModal({ ...creationModal, isOpen: false })} className="flex-1 py-2 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 bg-transparent hover:bg-zinc-800 rounded-lg transition-all">Cancelar</button>
              <button type="submit" className="flex-1 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 shadow-lg backdrop-blur-md">Criar</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default Notes;