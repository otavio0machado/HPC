import React from 'react';
import { Target, Zap, Users, BarChart3 } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Target className="text-blue-500" size={32} />,
      title: "Direcionamento Estratégico",
      description: "Não estude tudo. Estude o que cai. Nossa análise de dados da UFRGS e ENEM filtra o ruído e foca no sinal."
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "Retenção Ativa",
      description: "Métodos baseados em neurociência. Flashcards, repetição espaçada e recuperação ativa integrados à rotina."
    },
    {
      icon: <BarChart3 className="text-emerald-500" size={32} />,
      title: "Métricas de Evolução",
      description: "Simulados com TRI calibrada e análise de lacunas. Saiba exatamente onde ganhar os pontos mais fáceis."
    },
    {
      icon: <Users className="text-purple-500" size={32} />,
      title: "Comunidade de Elite",
      description: "Esteja entre os melhores. Networking com estudantes que compartilham a mesma ambição e mentalidade."
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">A Metodologia HPC</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card p-6 rounded-[24px] hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group">
              <div className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {React.cloneElement(feature.icon as React.ReactElement<{ size: number }>, { size: 28 })}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{feature.title}</h3>
              <p className="text-zinc-300 leading-relaxed text-sm font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;