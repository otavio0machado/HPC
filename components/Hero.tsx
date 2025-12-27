import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        <div className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">Vagas abertas para o extensivo</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Domine o Jogo da <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Alta Performance</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-xl text-zinc-400 font-light leading-relaxed">
          Não é apenas sobre estudar mais. É sobre estudar melhor.
          O <span className="text-white font-medium">High Performance Club</span> entrega a estratégia,
          a inteligência emocional e a tecnologia para sua aprovação na UFRGS e ENEM.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#planner"
            className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out flex items-center gap-2"
          >
            Gerar Plano Gratuito <TrendingUp size={18} />
          </a>
          <a
            href="#metodologia"
            className="px-8 py-4 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] text-white font-semibold hover:bg-white/[0.08] hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out flex items-center gap-2 group ring-1 ring-white/[0.05] inset"
          >
            Conhecer Método <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      <div className="mt-20 relative max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-700">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[32px] blur opacity-20 animate-pulse"></div>
        <div className="relative glass-hydro rounded-[30px] p-6 lg:p-8 overflow-hidden aspect-video flex items-center justify-center">
          {/* Mock UI Content inside Glass Card */}
          <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/[0.05] flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm font-medium text-blue-400 mb-2 uppercase tracking-widest">Preview Only</p>
            <h3 className="text-3xl font-bold text-white drop-shadow-md tracking-tight">Dashboard Experience</h3>
            <p className="text-zinc-400 mt-2 max-w-md mx-auto">This surface uses the exact liquid glass recipe requested, simulating visionOS depth.</p>
          </div>
          {/* Abstract Glow */}
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[80px]"></div>
        </div>
      </div>

      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>
    </div>
  );
};

export default Hero;