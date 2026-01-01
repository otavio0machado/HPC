import React from 'react';

const LessonTermoquimica: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Toda reação química envolve uma troca de energia. A <strong className="text-white">Termoquímica</strong> estuda esse calor (Δ). O conceito central é a <strong className="text-emerald-300">Entalpia (H)</strong>, o "conteúdo de energia" das ligações.
                </p>
            </div>

            {/* Reactions Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exo */}
                <div className="bg-gradient-to-br from-orange-500/10 to-red-900/10 p-6 rounded-2xl border border-red-500/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">🔥</div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">Exotérmica</h3>
                    <div className="text-3xl font-mono font-bold text-white mb-2">ΔH &lt; 0</div>
                    <p className="text-zinc-300 text-sm mb-4">
                        Libera calor. Esquenta o ambiente.<br />
                        <span className="text-zinc-500 text-xs">Ex: Fogueira, Respiração.</span>
                    </p>
                    <div className="bg-black/30 p-2 rounded text-xs text-center text-red-300">Reagentes &gt; Produtos</div>
                </div>

                {/* Endo */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-900/10 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">❄️</div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Endotérmica</h3>
                    <div className="text-3xl font-mono font-bold text-white mb-2">ΔH &gt; 0</div>
                    <p className="text-zinc-300 text-sm mb-4">
                        Absorve calor. Esfria o ambiente.<br />
                        <span className="text-zinc-500 text-xs">Ex: Bolsa de gelo instantâneo, Fotossíntese.</span>
                    </p>
                    <div className="bg-black/30 p-2 rounded text-xs text-center text-blue-300">Produtos &gt; Reagentes</div>
                </div>
            </div>

            {/* Hess Law */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🗺️</span> Lei de Hess
                </h2>
                <p className="text-zinc-400 text-sm">
                    "O caminho não importa". A variação de entalpia total é a mesma, seja em uma etapa ou em várias.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                    <li className="bg-white/5 p-3 rounded-lg border-l-2 border-emerald-500 text-zinc-300">
                        Pode somar as equações.
                    </li>
                    <li className="bg-white/5 p-3 rounded-lg border-l-2 border-emerald-500 text-zinc-300">
                        Se inverter a reação, inverte o sinal do ΔH.
                    </li>
                </ul>
            </div>

            {/* Case Study */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: MRE vs Cold Pack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                        <strong className="text-orange-400 block mb-1">MRE (Ração Militar)</strong>
                        <p className="text-xs text-zinc-400">Magnésio + Água = Reação violenta <strong className="text-white">Exotérmica</strong>. Ferve em segundos para esquentar a comida.</p>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                        <strong className="text-blue-400 block mb-1">Cold Pack</strong>
                        <p className="text-xs text-zinc-400">Nitrato de Amônio + Água = Reação <strong className="text-white">Endotérmica</strong>. Rouba calor e congela em instantes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonTermoquimica;
