import React from 'react';

const LessonFuncoesInorganicas: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* 1. Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    As <strong className="text-white">Funções Inorgânicas</strong> são os "grupos funcionais" da química mineral. Assim como na biologia agrupamos animais, na química agrupamos substâncias baseadas no seu comportamento em solução aquosa.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    A definição clássica de <strong>Arrhenius (1887)</strong> é a base para o vestibular:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <li className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-red-200">
                        <strong>Ácidos:</strong> Liberam H⁺ em água. <span className="text-xs block opacity-70">Ex: HCl</span>
                    </li>
                    <li className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-200">
                        <strong>Bases:</strong> Liberam OH⁻ em água. <span className="text-xs block opacity-70">Ex: NaOH</span>
                    </li>
                    <li className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-green-200">
                        <strong>Sais:</strong> Produto de Ácido + Base. <span className="text-xs block opacity-70">Ex: NaCl</span>
                    </li>
                    <li className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 text-orange-200">
                        <strong>Óxidos:</strong> Binários com Oxigênio. <span className="text-xs block opacity-70">Ex: CO₂</span>
                    </li>
                </ul>
            </div>

            {/* 2. Characteristics */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-400">2. Características Técnicas</h2>

                {/* Acids */}
                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">H+</div>
                        <h3 className="text-xl font-bold text-white">Ácidos (O Protonador)</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">Compostos covalentes que <strong>ionizam</strong> em água.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/20 p-3 rounded-lg">
                            <strong className="text-red-300 block mb-1">Força (Grau α)</strong>
                            <ul className="space-y-1 text-zinc-500">
                                <li><span className="text-white">Fortes:</span> HCl, H₂SO₄ (Ionizam &gt;50%)</li>
                                <li><span className="text-white">Fracos:</span> HCN, H₂CO₃ (O "H" fica preso)</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg">
                            <strong className="text-red-300 block mb-1">Nomenclatura</strong>
                            <ul className="space-y-1 text-zinc-500">
                                <li>Sem Oxigênio: ...ídrico (Clorídrico)</li>
                                <li>Com Oxigênio: Nox Alto=ICO, Baixo=OSO</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bases */}
                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">OH-</div>
                        <h3 className="text-xl font-bold text-white">Bases (O Receptor)</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">Compostos iônicos que <strong>dissociam</strong> em água (liberam íons existentes).</p>
                    <div className="text-sm bg-black/20 p-3 rounded-lg border-l-4 border-blue-500">
                        <strong className="text-blue-300">Regra de Ouro:</strong> Bases da Família 1 e 2 são fortes e solúveis (exceto Mg/Be). As outras são fracas/insolúveis.<br />
                        <span className="text-zinc-500 italic">Ex: NaOH (Soda Cáustica) vs Mg(OH)₂ (Leite de Magnésia).</span>
                    </div>
                </div>

                {/* Neutralization */}
                <div className="bg-gradient-to-r from-emerald-900/10 to-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">Reação de Neutralização</h3>
                    <div className="flex items-center justify-center gap-4 text-xl font-mono font-bold text-white my-4">
                        <span className="text-red-400">Ácido</span> + <span className="text-blue-400">Base</span> → <span className="text-green-400">Sal</span> + <span className="text-cyan-400">Água</span>
                    </div>
                    <p className="text-center text-zinc-400 text-sm">HCl + NaOH → NaCl + H₂O</p>
                </div>

            </div>

            {/* Case Study */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Chuva Ácida</h2>
                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🌧️</div>
                    <h3 className="text-lg font-bold text-white mb-2">Por que estátuas derretem?</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                        Mármore é Carbonato de Cálcio (CaCO₃). A poluição cria Ácido Sulfúrico (H₂SO₄) na chuva.
                    </p>
                    <div className="bg-black/30 p-4 rounded-xl font-mono text-xs text-green-300 overflow-x-auto">
                        CaCO₃(s) + H₂SO₄(aq) → CaSO₄(aq) + H₂O(l) + CO₂(g)
                    </div>
                    <p className="text-zinc-500 text-xs mt-2">
                        O CaSO₄ (Gesso) é solúvel e a água lava o rosto da estátua.
                    </p>
                </div>
            </div>

            {/* Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
                <div className="bg-white/5 p-4 rounded-xl">
                    <strong className="text-white block mb-1">🏥 Fisiologia (Sangue)</strong>
                    O pH do sangue deve ser 7.35-7.45. O sistema "tampão" (H₂CO₃/HCO₃⁻) evita que morramos com variações de acidez.
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                    <strong className="text-white block mb-1">🌱 Agricultura (Calagem)</strong>
                    Solos do Cerrado são ácidos. Agricultores jogam Calcário (CaCO₃), um sal básico, para neutralizar a terra.
                </div>
            </div>
        </div>
    );
};

export default LessonFuncoesInorganicas;
