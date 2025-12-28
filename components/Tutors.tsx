import React, { useState, useRef, useEffect } from 'react';
import { createTutorChat } from '../services/geminiService';
import { MessageSquare, Send, ArrowLeft, ArrowRight, Bot, User, Sparkles, BrainCircuit, Atom, Calculator, BookOpen, Globe, Dna, FlaskConical, Trash2, Users, Lightbulb, Languages, Feather, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Chat, GenerateContentResponse, Content } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const subjects = [
  { id: 'Matemática', icon: <Calculator size={24} />, from: 'from-blue-600', to: 'to-blue-400', description: 'Cálculo, Álgebra e Geometria' },
  { id: 'Física', icon: <Atom size={24} />, from: 'from-purple-600', to: 'to-purple-400', description: 'Mecânica, Óptica e Eletricidade' },
  { id: 'Química', icon: <FlaskConical size={24} />, from: 'from-emerald-600', to: 'to-emerald-400', description: 'Orgânica, Inorgânica e Físico-Química' },
  { id: 'Biologia', icon: <Dna size={24} />, from: 'from-green-600', to: 'to-green-400', description: 'Genética, Ecologia e Fisiologia' },
  { id: 'História', icon: <BookOpen size={24} />, from: 'from-amber-600', to: 'to-amber-400', description: 'História do Brasil e Geral' },
  { id: 'Geografia', icon: <Globe size={24} />, from: 'from-orange-600', to: 'to-orange-400', description: 'Geopolítica e Geografia Física' },
  { id: 'Português', icon: <Feather size={24} />, from: 'from-rose-600', to: 'to-rose-400', description: 'Gramática e Interpretação' },
  { id: 'Literatura', icon: <BookOpen size={24} />, from: 'from-pink-600', to: 'to-pink-400', description: 'Escolas Literárias e Obras' },
  { id: 'Inglês', icon: <Languages size={24} />, from: 'from-sky-600', to: 'to-sky-400', description: 'Gramática e Vocabulário' },
  { id: 'Espanhol', icon: <Languages size={24} />, from: 'from-red-600', to: 'to-red-400', description: 'Gramática e Interpretação' },
  { id: 'Sociologia', icon: <Users size={24} />, from: 'from-indigo-600', to: 'to-indigo-400', description: 'Sociedade e Cultura' },
  { id: 'Filosofia', icon: <Lightbulb size={24} />, from: 'from-cyan-600', to: 'to-cyan-400', description: 'Ética, Política e Lógica' },
  { id: 'Redação', icon: <MessageSquare size={24} />, from: 'from-teal-600', to: 'to-teal-400', description: 'Estrutura e Argumentação' },
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
      toast.success("Histórico limpo com sucesso!");
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
      toast.error("Erro desconhecido. Tente novamente.");
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

  const currentSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="h-full w-full flex flex-col gap-6">
      <AnimatePresence mode="wait">
        {!selectedSubject ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 h-full"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 p-1">
              <div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <div className="h-8 w-1.5 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-indigo-200 to-white tracking-tight drop-shadow-md">Tutores de Elite</h2>
                </motion.div>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-zinc-400 max-w-2xl text-lg font-light tracking-wide"
                >
                  Escolha seu mentor especializado e domine qualquer matéria.
                </motion.p>
              </div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-5 py-2.5 rounded-full glass-spatial text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md"
              >
                <Sparkles size={14} className="text-purple-400 animate-pulse" /> Gemini 2.0 Flash
              </motion.div>
            </div>

            {/* Subject Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
                {subjects.map((sub, idx) => {
                  const hasHistory = activeSessions.includes(sub.id);
                  return (
                    <motion.button
                      key={sub.id}
                      onClick={() => handleSelectSubject(sub.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                          group relative overflow-hidden rounded-[28px] p-6 text-left transition-all duration-300
                          glass-card border border-white/5 hover:border-white/20
                          shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)]
                      `}
                    >
                      {/* Hover Gradient Bloom */}
                      <div className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br ${sub.from} ${sub.to} rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />

                      {/* Active Indicator */}
                      {hasHistory && (
                        <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full shadow-lg z-10 transition-transform group-hover:scale-110">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                          <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Ativo</span>
                        </div>
                      )}

                      {/* Icon Container */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 bg-gradient-to-br ${sub.from} ${sub.to} text-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.5)] relative z-10 border border-white/20`}>
                        {sub.icon}
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight">{sub.id}</h3>
                        <p className="text-sm text-zinc-500 mt-1 mb-4 leading-snug line-clamp-2 min-h-[40px] group-hover:text-zinc-400 transition-colors">
                          {sub.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white/80 transition-colors uppercase tracking-wider">
                          <span>Iniciar Sessão</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Info Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-auto p-1 rounded-[32px] bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border border-white/5 shadow-2xl backdrop-blur-xl"
            >
              <div className="bg-zinc-950/60 rounded-[28px] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/40 relative z-10 rotate-3">
                  <BrainCircuit size={32} className="text-white drop-shadow-md" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                  <h4 className="text-xl font-bold text-white mb-2">Aprendizado Acelerado por IA</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                    Nossos tutores utilizam prompts refinados para o padrão <span className="text-blue-300 font-bold">UFRGS e ENEM</span>.
                    Peça resoluções passo-a-passo, resumos, mnemônicos e simulações de prova.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          {/* Chat Container */ }
          < motion.div
            key="chat"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="flex flex-col h-[calc(100vh-140px)] glass-hydro rounded-[36px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10"
          >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-3 rounded-full transition-all group
                      bg-white/[0.05] hover:bg-white/[0.1]
                      border border-white/[0.1] hover:border-white/[0.3]
                      backdrop-blur-md shadow-lg
                      text-zinc-400 hover:text-white"
              title="Voltar"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-4">
              <motion.div
                layoutId={`icon-${selectedSubject}`}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${currentSubjectData?.from} ${currentSubjectData?.to} text-white shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/20`}
              >
                {currentSubjectData?.icon}
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight leading-none mb-1">Tutor de {selectedSubject}</h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Online
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">{currentSubjectData?.description.split(',')[0]}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={clearHistory}
            title="Limpar Histórico"
            className="p-3 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider
                  bg-white/[0.05] hover:bg-red-500/10
                  border border-white/[0.1] hover:border-red-500/20
                  backdrop-blur-md
                  text-zinc-500 hover:text-red-400 hover:shadow-lg"
          >
            <Trash2 size={16} /> <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] rounded-[24px] p-6 shadow-xl relative backdrop-blur-sm ${msg.role === 'user'
                ? 'bg-gradient-to-br from-blue-600/90 to-indigo-600/90 text-white rounded-br-sm border border-blue-400/30'
                : 'glass-card bg-zinc-900/60 text-zinc-100 rounded-bl-sm border border-white/10'
                }`}>

                {/* Role Label */}
                <div className={`flex items-center gap-2 mb-2 text-[10px] font-bold tracking-widest uppercase opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-zinc-500'}`}>
                  {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                  <span>{msg.role === 'user' ? 'Você' : 'HPC Tutor'}</span>
                </div>

                <div className="text-sm leading-relaxed">
                  {msg.role === 'model' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                      components={{
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-3 space-y-1 marker:text-zinc-500" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-3 space-y-1 marker:text-zinc-500" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-blue-200" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-white/10 pl-4 py-1 my-2 italic text-zinc-400" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card rounded-[24px] px-6 py-4 flex items-center gap-3 border border-white/10 shadow-lg">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                  <Sparkles size={10} className="text-blue-400 animate-spin-slow" />
                  Gerando
                </span>
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></motion.div>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full"></motion.div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-5 bg-black/20 border-t border-white/5 select-none backdrop-blur-md relative z-20">
          <div className="flex gap-3 relative max-w-5xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Pergunte algo sobre ${selectedSubject}...`}
              className="flex-1 bg-black/30 text-white border border-white/10 rounded-full px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 shadow-inner font-medium text-sm backdrop-blur-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95 border border-white/20 group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </motion.div>
        )}
    </AnimatePresence>
    </div >
  );
};

export default Tutors;