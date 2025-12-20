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
            className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            Gerar Plano Gratuito <TrendingUp size={18} />
          </a>
          <a 
            href="#metodologia"
            className="px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold hover:bg-zinc-900 transition-all flex items-center gap-2 group"
          >
            Conhecer Método <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default Hero;