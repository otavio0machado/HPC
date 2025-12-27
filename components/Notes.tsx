import React, { useState, useEffect, useRef } from 'react';
import { FileText, Folder, FolderPlus, FilePlus, ChevronRight, ChevronDown, Search, Trash2, Edit3, Eye, Upload, File as FileIcon, X, Columns, PanelLeftClose, PanelLeftOpen, Bold, Italic, List, Quote, Code, ZoomIn, ZoomOut, ChevronLeft, ArrowRight, SplitSquareHorizontal, Strikethrough, ListOrdered, CheckSquare, Minus, Heading1, Heading2, Link as LinkIcon, Check } from 'lucide-react';
import { authService } from '../services/authService';
import { NoteFile } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar o Worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const Notes: React.FC = () => {
  // --- Global Data ---
  const [files, setFiles] = useState<NoteFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // --- Workspace State ---
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activePdfId, setActivePdfId] = useState<string | null>(null);

  // UI States
  const [zenMode, setZenMode] = useState(false);
  const [showPdfPane, setShowPdfPane] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  // PDF State
  const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [textSelection, setTextSelection] = useState<{ text: string, x: number, y: number } | null>(null);

  // Modal & Settings
  const [creationModal, setCreationModal] = useState<{ isOpen: boolean, type: 'folder' | 'markdown', parentId: string | null }>({ isOpen: false, type: 'markdown', parentId: null });
  const [newItemName, setNewItemName] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const creationInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Storage
  const STORAGE_KEY = authService.getUserStorageKey('hpc_notes_obsidian');

  // --- Initialization ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFiles(JSON.parse(saved));
      } catch (e) { console.error("Failed to load notes"); }
    } else {
      const initial: NoteFile[] = [
        { id: '1', parentId: null, name: 'UFRGS', type: 'folder', createdAt: Date.now(), updatedAt: Date.now() },
        { id: '2', parentId: '1', name: 'História RS.md', type: 'markdown', content: '# História do RS\n\nPrincipais tópicos:\n- Farroupilha', createdAt: Date.now(), updatedAt: Date.now() }
      ];
      setFiles(initial);
      setExpandedFolders(new Set(['1']));
    }
  }, []);

  useEffect(() => {
    if (creationModal.isOpen && creationInputRef.current) {
      setTimeout(() => creationInputRef.current?.focus(), 50);
    }
  }, [creationModal.isOpen]);

  // --- File Management ---

  const saveFiles = (newFiles: NoteFile[]) => {
    setFiles(newFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const { type, parentId } = creationModal;
    const name = newItemName.trim();
    const newFile: NoteFile = {
      id: crypto.randomUUID(),
      parentId,
      name: type === 'markdown' ? (name.endsWith('.md') ? name : `${name}.md`) : name,
      type,
      content: type === 'markdown' ? '# ' + name : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    saveFiles([...files, newFile]);

    if (type === 'markdown') {
      setActiveNoteId(newFile.id);
      setEditorViewMode('split');
      if (window.innerWidth < 768) setZenMode(true);
    } else {
      setExpandedFolders(prev => new Set(prev).add(newFile.id));
    }
    setCreationModal({ ...creationModal, isOpen: false });
  };

  const handleUploadPDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      const newFile: NoteFile = {
        id: crypto.randomUUID(),
        parentId: null,
        name: file.name,
        type: 'pdf',
        pdfData: base64,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      saveFiles([...files, newFile]);
      setActivePdfId(newFile.id);
      setShowPdfPane(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Excluir arquivo permanentemente?')) return;

    const idsToDelete = new Set<string>();
    const collectIds = (targetId: string) => {
      idsToDelete.add(targetId);
      files.filter(f => f.parentId === targetId).forEach(child => collectIds(child.id));
    };
    collectIds(id);

    const updated = files.filter(f => !idsToDelete.has(f.id));
    saveFiles(updated);

    if (idsToDelete.has(activeNoteId || '')) setActiveNoteId(null);
    if (idsToDelete.has(activePdfId || '')) {
      setActivePdfId(null);
      setShowPdfPane(false);
    }
  };

  // --- Editor Logic ---

  const updateContent = (id: string, newContent: string) => {
    const updated = files.map(f => f.id === id ? { ...f, content: newContent, updatedAt: Date.now() } : f);
    setFiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  // --- PDF Logic & Citation System ---

  const handlePdfTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setTextSelection(null);
      return;
    }
    if (pdfContainerRef.current && !pdfContainerRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = pdfContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

    setTextSelection({
      text: selection.toString(),
      x: rect.left - containerRect.left + (rect.width / 2),
      y: rect.top - containerRect.top
    });
  };

  const insertCitation = () => {
    if (!textSelection || !activeNoteId || !activePdfId) {
      if (!activeNoteId) alert("Abra uma nota Markdown à esquerda para inserir a citação.");
      return;
    }

    const pdfFile = files.find(f => f.id === activePdfId);
    if (!pdfFile) return;

    const quote = `> "${textSelection.text.trim()}"\n> **[${pdfFile.name}: Pg. ${pdfPageNumber}](pdf://${activePdfId}?page=${pdfPageNumber})**\n\n`;
    insertMarkdown(quote);
    setTextSelection(null);
    window.getSelection()?.removeAllRanges();
    triggerSaveFeedback();
  };

  const handleMarkdownLinkClick = (href: string) => {
    if (href.startsWith('pdf://')) {
      const url = new URL(href);
      const pdfId = url.hostname;
      const page = url.searchParams.get('page');

      if (pdfId && pdfId !== activePdfId) {
        setActivePdfId(pdfId);
        setShowPdfPane(true);
      }
      if (page) {
        setPdfPageNumber(parseInt(page));
      }
    }
  };

  const MarkdownLink = (props: any) => {
    const isInternal = props.href?.startsWith('pdf://');
    return (
      <a
        {...props}
        onClick={(e) => {
          if (isInternal) {
            e.preventDefault();
            handleMarkdownLinkClick(props.href);
          }
        }}
        className={isInternal ? "text-blue-400 cursor-pointer hover:underline font-bold bg-blue-500/10 px-1 rounded" : "text-blue-400 hover:underline"}
        target={isInternal ? "_self" : "_blank"}
      >
        {isInternal && <LinkIcon size={10} className="inline mr-1" />}
        {props.children}
      </a>
    );
  };

  // --- Rendering Helpers ---

  const renderTree = (parentId: string | null, depth = 0) => {
    const nodes = files.filter(f => f.parentId === parentId).sort((a, b) => a.type === 'folder' ? -1 : 1);

    return nodes.map(node => {
      if (searchTerm && node.type !== 'folder' && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) return null;

      const isExpanded = expandedFolders.has(node.id);
      const isFolder = node.type === 'folder';
      const isActiveNote = activeNoteId === node.id;
      const isActivePdf = activePdfId === node.id;

      return (
        <div key={node.id} style={{ paddingLeft: depth > 0 ? 12 : 0 }}>
          <div
            className={`flex items-center justify-between group px-3 py-1.5 cursor-pointer rounded-md text-sm mb-0.5 transition-colors
              ${(isActiveNote || isActivePdf) ? 'bg-blue-600/20 text-blue-200' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
            `}
            onClick={() => {
              if (isFolder) {
                const next = new Set(expandedFolders);
                if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
                setExpandedFolders(next);
              } else if (node.type === 'markdown') {
                setActiveNoteId(node.id);
                setEditorViewMode('split');
              } else if (node.type === 'pdf') {
                setActivePdfId(node.id);
                setShowPdfPane(true);
              }
            }}
          >
            <div className="flex items-center gap-2 truncate flex-1">
              {isFolder && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
              {!isFolder && <span className="w-3.5"></span>}
              {node.type === 'folder' ? <Folder size={14} className="text-zinc-500" /> :
                node.type === 'markdown' ? <FileText size={14} className="text-blue-500" /> :
                  <FileIcon size={14} className="text-red-500" />}
              <span className="truncate">{node.name}</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
              {isFolder && <button onClick={(e) => { e.stopPropagation(); setCreationModal({ isOpen: true, type: 'markdown', parentId: node.id }); }}><FilePlus size={12} /></button>}
              {!isFolder && node.type === 'pdf' && (
                <button onClick={(e) => { e.stopPropagation(); setActivePdfId(node.id); setShowPdfPane(true); }} title="Abrir ao lado">
                  <Columns size={12} />
                </button>
              )}
              <button onClick={(e) => handleDelete(node.id, e)} className="hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
          {isFolder && isExpanded && <div className="ml-3 border-l border-zinc-800">{renderTree(node.id, depth + 1)}</div>}
        </div>
      );
    });
  };

  const activeNote = files.find(f => f.id === activeNoteId);
  const activePdf = files.find(f => f.id === activePdfId);

  return (
    <div className="relative h-[calc(100vh-140px)] flex glass-hydro rounded-[32px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
      <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleUploadPDF} />

      {/* --- SIDEBAR --- */}
      {!zenMode && (
        <div className="w-64 flex flex-col border-r border-white/10 bg-black/20 z-10 flex-shrink-0 backdrop-blur-md">
          <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
            <span className="font-bold text-zinc-300 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Cofre HPC</span>
            <div className="flex gap-1">
              <button onClick={() => setCreationModal({ isOpen: true, type: 'folder', parentId: null })} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Nova Pasta"><FolderPlus size={14} /></button>
              <button onClick={() => setCreationModal({ isOpen: true, type: 'markdown', parentId: null })} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Nova Nota"><Edit3 size={14} /></button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Upload PDF"><Upload size={14} /></button>
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
          !activePdf && (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/50">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4"><Edit3 size={40} /></div>
              <h3 className="text-white font-bold">Workbench de Pesquisa</h3>
              <p className="text-sm max-w-xs text-center mt-2">Abra uma nota e um PDF simultaneamente para citar e estudar com alta performance.</p>
            </div>
          )
        )}

        {/* RIGHT: PDF VIEWER PANE */}
        {showPdfPane && activePdf && (
          <div className={`w-[45%] flex flex-col border-l border-zinc-800 bg-zinc-900 transition-all absolute right-0 top-0 bottom-0 z-20 shadow-2xl md:relative md:w-1/2 lg:w-[45%]`}>
            {/* PDF Toolbar */}
            <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-3 bg-zinc-950 select-none">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">PDF</span>
                <span className="text-sm text-white truncate max-w-[150px]">{activePdf.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPdfScale(s => Math.max(0.6, s - 0.2))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"><ZoomOut size={16} /></button>
                <span className="text-xs text-zinc-500 w-10 text-center font-mono">{Math.round(pdfScale * 100)}%</span>
                <button onClick={() => setPdfScale(s => Math.min(2.5, s + 0.2))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"><ZoomIn size={16} /></button>
                <div className="w-[1px] h-5 bg-zinc-800 mx-1"></div>
                <button onClick={() => setPdfPageNumber(p => Math.max(1, p - 1))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                <span className="text-xs text-zinc-400 font-mono">{pdfPageNumber} / {pdfNumPages || '-'}</span>
                <button onClick={() => setPdfPageNumber(p => Math.min(pdfNumPages || 999, p + 1))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"><ArrowRight size={16} /></button>
                <div className="w-[1px] h-5 bg-zinc-800 mx-1"></div>
                <button onClick={() => setShowPdfPane(false)} className="p-2 hover:bg-red-500/10 rounded text-zinc-400 hover:text-red-400 transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* PDF Canvas */}
            <div
              className="flex-1 overflow-auto bg-[#2a2a2e] relative flex justify-center p-4 custom-scrollbar"
              ref={pdfContainerRef}
              onMouseUp={handlePdfTextSelection}
            >
              {/* Floating Navigation Controls */}
              {activePdf.pdfData && (
                <>
                  {/* Previous Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPdfPageNumber(p => Math.max(1, p - 1)); }}
                    disabled={pdfPageNumber <= 1}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all disabled:opacity-0 disabled:pointer-events-none transform hover:scale-110 shadow-lg backdrop-blur-sm border border-white/10"
                    title="Página Anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Next Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPdfPageNumber(p => Math.min(pdfNumPages || 999, p + 1)); }}
                    disabled={pdfPageNumber >= (pdfNumPages || 999)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all disabled:opacity-0 disabled:pointer-events-none transform hover:scale-110 shadow-lg backdrop-blur-sm border border-white/10"
                    title="Próxima Página"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {activePdf.pdfData ? (
                <Document
                  file={activePdf.pdfData}
                  onLoadSuccess={({ numPages }) => setPdfNumPages(numPages)}
                  loading={<div className="mt-10 text-zinc-500 text-xs">Carregando PDF...</div>}
                >
                  <Page
                    pageNumber={pdfPageNumber}
                    scale={pdfScale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-2xl mb-4"
                  />
                </Document>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-zinc-500">
                  <FileIcon size={32} className="mb-2 opacity-50" />
                  <p>Erro ao carregar PDF.</p>
                </div>
              )}

              {/* Citation Button Popup */}
              {textSelection && (
                <div
                  className="absolute z-50 transform -translate-x-1/2 -translate-y-full mb-2"
                  style={{ top: textSelection.y, left: textSelection.x }}
                >
                  <button
                    onClick={insertCitation}
                    className="bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-xl flex items-center gap-1 hover:bg-blue-500 hover:scale-105 transition-all animate-in zoom-in backdrop-blur-md border border-white/20"
                  >
                    <Quote size={12} /> Citar na Nota
                  </button>
                  <div className="w-2 h-2 bg-blue-600 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                </div>
              )}
            </div>
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