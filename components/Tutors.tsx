import React, { useState, useRef, useEffect } from 'react';
import { createTutorChat } from '../services/geminiService';
import { MessageSquare, Send, ArrowLeft, Bot, User, Sparkles, BrainCircuit, Atom, Calculator, BookOpen, Globe, Dna, FlaskConical, Trash2, Users, Lightbulb, Languages, Feather } from 'lucide-react';
import { Chat, GenerateContentResponse, Content } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { authService } from '../services/authService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const subjects = [
  { id: 'Matemática', icon: <Calculator size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'Física', icon: <Atom size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'Química', icon: <FlaskConical size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'Biologia', icon: <Dna size={24} />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'História', icon: <BookOpen size={24} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'Geografia', icon: <Globe size={24} />, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'Português', icon: <Feather size={24} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'Literatura', icon: <BookOpen size={24} />, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 'Inglês', icon: <Languages size={24} />, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  { id: 'Espanhol', icon: <Languages size={24} />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'Sociologia', icon: <Users size={24} />, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'Filosofia', icon: <Lightbulb size={24} />, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'Redação', icon: <MessageSquare size={24} />, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

const Tutors: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  const chatInstanceRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic storage key based on logged user
  const STORAGE_KEY = authService.getUserStorageKey('hpc_tutor_history');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load active sessions on mount to show "Resume" indicators
  useEffect(() => {
    updateActiveSessions();
  }, [selectedSubject]);

  const updateActiveSessions = () => {
    try {
      const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const sessions = Object.keys(allHistory).filter(key => allHistory[key] && allHistory[key].length > 0);
      setActiveSessions(sessions);
    } catch (e) {
      console.error("Failed to load sessions info", e);
    }
  };

  const saveHistory = (subject: string, msgs: Message[]) => {
    try {
      const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      allHistory[subject] = msgs;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
      if (!activeSessions.includes(subject)) {
        updateActiveSessions();
      }
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const clearHistory = () => {
    if (!selectedSubject) return;
    try {
      const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete allHistory[selectedSubject];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
      
      const initialMsg: Message = { role: 'model', text: `Histórico limpo. Olá! Sou seu tutor especialista em ${selectedSubject}. Como posso te ajudar a destruir na prova hoje?` };
      setMessages([initialMsg]);
      
      // Re-initialize chat with empty history
      chatInstanceRef.current = createTutorChat(selectedSubject);
      saveHistory(selectedSubject, [initialMsg]);
      updateActiveSessions();
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    
    // Load history
    let subjectHistory: Message[] = [];
    try {
      const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allHistory[subject] && Array.isArray(allHistory[subject]) && allHistory[subject].length > 0) {
        subjectHistory = allHistory[subject];
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }

    if (subjectHistory.length > 0) {
      setMessages(subjectHistory);
      // Map local messages to Gemini Content format for context to restore chat session
      const geminiHistory: Content[] = subjectHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      chatInstanceRef.current = createTutorChat(subject, geminiHistory);
    } else {
      const initialMsg: Message = { role: 'model', text: `Olá! Sou seu tutor especialista em ${subject}. Como posso te ajudar a destruir na prova hoje?` };
      setMessages([initialMsg]);
      chatInstanceRef.current = createTutorChat(subject);
      saveHistory(subject, [initialMsg]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatInstanceRef.current || !selectedSubject) return;

    const userMsg = inputValue;
    setInputValue('');
    
    // Optimistic update
    const messagesWithUser: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(messagesWithUser);
    saveHistory(selectedSubject, messagesWithUser);
    
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatInstanceRef.current.sendMessage({ message: userMsg });
      const text = result.text || "Desculpe, tive um problema ao processar sua resposta.";
      
      const messagesWithModel: Message[] = [...messagesWithUser, { role: 'model', text }];
      setMessages(messagesWithModel);
      saveHistory(selectedSubject, messagesWithModel);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { role: 'model', text: "Erro ao conectar com o tutor. Tente novamente." };
      const messagesWithError = [...messagesWithUser, errorMsg];
      setMessages(messagesWithError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setMessages([]);
    chatInstanceRef.current = null;
    updateActiveSessions();
  };

  if (!selectedSubject) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Tutores de Elite</h2>
          </div>
          <p className="text-zinc-400">Escolha seu mentor especializado e tire dúvidas em tempo real. O histórico é salvo automaticamente.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const hasHistory = activeSessions.includes(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id)}
                className={`group flex items-center p-6 rounded-2xl border ${hasHistory ? 'border-blue-500/30 bg-blue-900/10' : 'border-zinc-800 bg-zinc-900/40'} hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 relative`}
              >
                {hasHistory && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wide">Continuar</span>
                  </div>
                )}
                <div className={`p-4 rounded-xl ${sub.bg} ${sub.color} mr-4 group-hover:scale-110 transition-transform`}>
                  {sub.icon}
                </div>
                <div className="text-left">
                  <h3 className={`text-lg font-bold ${hasHistory ? 'text-blue-100' : 'text-white'} group-hover:text-blue-100 transition-colors`}>{sub.id}</h3>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <Sparkles size={10} /> IA Especializada
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-zinc-800 flex items-center gap-6">
           <div className="bg-zinc-950 p-4 rounded-full border border-zinc-800 text-blue-400">
              <BrainCircuit size={32} />
           </div>
           <div>
             <h4 className="text-white font-bold mb-1">Como usar?</h4>
             <p className="text-zinc-400 text-sm">Nossos tutores utilizam a tecnologia Gemini 2.0. Eles foram treinados especificamente com o padrão de questões da UFRGS e do ENEM. Peça resoluções, explicações teóricas ou dicas de macetes.</p>
           </div>
        </div>
      </div>
    );
  }

  const currentSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="h-[600px] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack} 
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={`p-2 rounded-lg ${currentSubjectData?.bg} ${currentSubjectData?.color}`}>
            {currentSubjectData?.icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">Tutor de {selectedSubject}</h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online
            </span>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          title="Limpar Histórico"
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 text-xs"
        >
          <Trash2 size={16} /> <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/30 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                 {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                 <span>{msg.role === 'user' ? 'Você' : 'HPC Tutor'}</span>
              </div>
              <div className="text-sm leading-relaxed">
                {msg.role === 'model' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                    components={{
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="marker:text-zinc-500" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mb-1" {...props} />,
                      code: ({node, ...props}) => <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-xs font-mono text-blue-300 border border-zinc-700" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-zinc-600 pl-3 italic text-zinc-400 my-2" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  // User messages render as plain text to preserve exact spacing/format
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-none p-4 border border-zinc-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Pergunte algo sobre ${selectedSubject}...`}
            className="flex-1 bg-zinc-950 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tutors;