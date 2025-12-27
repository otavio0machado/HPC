import React, { useState, useRef, useEffect } from 'react';
import { createTutorChat } from '../services/geminiService';
import { MessageSquare, Send, ArrowLeft, ArrowRight, Bot, User, Sparkles, BrainCircuit, Atom, Calculator, BookOpen, Globe, Dna, FlaskConical, Trash2, Users, Lightbulb, Languages, Feather } from 'lucide-react';
import { toast } from 'sonner';
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
  { id: 'Matemática', icon: <Calculator size={24} />, from: 'from-blue-600', to: 'to-blue-400' },
  { id: 'Física', icon: <Atom size={24} />, from: 'from-purple-600', to: 'to-purple-400' },
  { id: 'Química', icon: <FlaskConical size={24} />, from: 'from-emerald-600', to: 'to-emerald-400' },
  { id: 'Biologia', icon: <Dna size={24} />, from: 'from-green-600', to: 'to-green-400' },
  { id: 'História', icon: <BookOpen size={24} />, from: 'from-amber-600', to: 'to-amber-400' },
  { id: 'Geografia', icon: <Globe size={24} />, from: 'from-orange-600', to: 'to-orange-400' },
  { id: 'Português', icon: <Feather size={24} />, from: 'from-rose-600', to: 'to-rose-400' },
  { id: 'Literatura', icon: <BookOpen size={24} />, from: 'from-pink-600', to: 'to-pink-400' },
  { id: 'Inglês', icon: <Languages size={24} />, from: 'from-sky-600', to: 'to-sky-400' },
  { id: 'Espanhol', icon: <Languages size={24} />, from: 'from-red-600', to: 'to-red-400' },
  { id: 'Sociologia', icon: <Users size={24} />, from: 'from-indigo-600', to: 'to-indigo-400' },
  { id: 'Filosofia', icon: <Lightbulb size={24} />, from: 'from-cyan-600', to: 'to-cyan-400' },
  { id: 'Redação', icon: <MessageSquare size={24} />, from: 'from-teal-600', to: 'to-teal-400' },
];

const Tutors: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  const chatInstanceRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = authService.getUserStorageKey('hpc_tutor_history');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      chatInstanceRef.current = createTutorChat(selectedSubject);
      saveHistory(selectedSubject, [initialMsg]);
      updateActiveSessions();
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    let subjectHistory: Message[] = [];
    try {
      const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allHistory[subject] && Array.isArray(allHistory[subject]) && allHistory[subject].length > 0) {
        subjectHistory = allHistory[subject];
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }

    try {
      if (subjectHistory.length > 0) {
        setMessages(subjectHistory);
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
    } catch (e: any) {
      console.error(e);
      toast.error("Erro ao iniciar Tutor.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatInstanceRef.current || !selectedSubject) return;

    const userMsg = inputValue;
    setInputValue('');

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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-1 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Tutores de Elite</h2>
            </div>
            <p className="text-zinc-400 max-w-2xl">Escolha seu mentor especializado e tire dúvidas em tempo real. O histórico é salvo automaticamente.</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} /> Gemini 2.0 Powered
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const hasHistory = activeSessions.includes(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id)}
                className={`
                    group relative overflow-hidden rounded-3xl p-6 text-left border transition-all duration-500
                    bg-[var(--glass-bg)] border-[var(--border-glass)] hover:border-white/20
                    hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]
                `}
              >
                <div className={`absolute -right-10 -top-10 w-24 h-24 bg-gradient-to-br ${sub.from} ${sub.to} rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                {hasHistory && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-zinc-950/50 backdrop-blur border border-white/5 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wide">Ativo</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br ${sub.from} ${sub.to} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3`}>
                  {sub.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">{sub.id}</h3>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-400 transition-colors">
                    Acessar Tutor <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 p-1 rounded-3xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/5">
          <div className="bg-zinc-950 rounded-[22px] p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-2">Engenharia de Prompt Avançada</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Nossos tutores utilizam a tecnologia <span className="text-blue-400 font-bold">Google Gemini 2.0</span> com prompts refinados para o padrão UFRGS e ENEM. Peça resoluções passo-a-passo e dicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="h-[750px] flex flex-col bg-[var(--glass-bg)] border border-[var(--border-glass)] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl transition-all group
                bg-white/[0.05] hover:bg-white/[0.1]
                border border-white/[0.1] hover:border-white/[0.2]
                backdrop-blur-md shadow-lg shadow-black/5
                text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentSubjectData?.from} ${currentSubjectData?.to} text-white shadow-lg`}>
              {currentSubjectData?.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Tutor de {selectedSubject}</h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={clearHistory}
          title="Limpar Histórico"
          className="p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider
            bg-white/[0.05] hover:bg-red-500/10
            border border-white/[0.1] hover:border-red-500/20
            backdrop-blur-md
            text-zinc-500 hover:text-red-400"
        >
          <Trash2 size={16} /> <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-lg ${msg.role === 'user'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm'
              : 'bg-zinc-800/80 backdrop-blur-md border border-white/5 text-zinc-100 rounded-bl-sm'
              }`}>
              <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-bold tracking-wider uppercase">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? 'Você' : 'HPC Tutor'}</span>
              </div>
              <div className="text-sm leading-relaxed">
                {msg.role === 'model' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                    components={{
                      strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 mr-2">DIGITANDO</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-white/5 select-none">
        <div className="flex gap-3 relative max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Pergunte algo sobre ${selectedSubject}...`}
            className="flex-1 bg-zinc-950/50 text-white border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20 active:scale-95 hover:rotate-3 backdrop-blur-md border border-white/10"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tutors;