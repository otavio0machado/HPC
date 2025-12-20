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
    <section id="metodologia" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">A Metodologia HPC</h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1">
              <div className="mb-4 bg-zinc-950 w-14 h-14 rounded-xl flex items-center justify-center border border-zinc-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;