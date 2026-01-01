import React from 'react';

const LessonSolucoes: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Introduction */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    No mundo real, raramente lidamos com substâncias puras. A água que bebemos, o ar e o sangue são <strong className="text-white">Soluções</strong>: misturas homogêneas de duas ou mais substâncias.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <strong className="text-emerald-400 block mb-1">Soluto</strong>
                        <span className="text-zinc-400 text-sm">O que é dissolvido (menor quantidade). Ex: Pó do suco.</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                        <strong className="text-blue-400 block mb-1">Solvente</strong>
                        <span className="text-zinc-400 text-sm">O que dissolve (maior quantidade). A água é o "Solvente Universal".</span>
                    </div>
                </div>
            </div>

            {/* Concentration Units */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-400">2. Unidades de Concentração</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Comum */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Rótulos</div>
                        <h3 className="text-lg font-bold text-white mb-1">Concentração Comum (C)</h3>
                        <div className="text-2xl font-mono text-emerald-400 mb-2">g/L</div>
                        <p className="text-zinc-400 text-xs">Massa do soluto / Volume da solução. Usado em alimentos.</p>
                    </div>

                    {/* Molaridade */}
                    <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-600/10 p-6 rounded-2xl border border-emerald-500/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-50 text-4xl">🧪</div>
                        <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-2">A Mais Importante</div>
                        <h3 className="text-lg font-bold text-white mb-1">Molaridade (M)</h3>
                        <div className="text-2xl font-mono text-emerald-400 mb-2">mol/L</div>
                        <p className="text-emerald-100/70 text-xs">Número de mols / Volume. Padrão internacional da química.</p>
                    </div>

                    {/* ppm */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Poluição</div>
                        <h3 className="text-lg font-bold text-white mb-1">ppm</h3>
                        <div className="text-2xl font-mono text-emerald-400 mb-2">mg/kg</div>
                        <p className="text-zinc-400 text-xs">Partes por milhão. Para poluentes e metais pesados.</p>
                    </div>
                </div>
            </div>

            {/* Dilution */}
            <div className="bg-zinc-800/30 p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">3. Diluição (Adicionar Água)</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Diluir é acrescentar solvente. A concentração cai, mas a quantidade de soluto (mol) permanece constante.
                </p>
                <div className="flex flex-col items-center justify-center bg-black/40 p-6 rounded-xl border border-white/5">
                    <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
                        M₁ . V₁ = M₂ . V₂
                    </div>
                    <p className="text-zinc-500 text-xs text-center mt-2">
                        Fórmula de Ouro. O início é igual ao fim.
                    </p>
                </div>
            </div>

            {/* Study Case */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Soro Fisiológico</h2>
                <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20">
                    <h3 className="text-lg font-bold text-blue-200 mb-2">Osmose e Morte Celular</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                        Por que não injetamos água pura? Porque causaria <strong>osmose</strong>: a água entraria nas células do sangue até elas explodirem.
                        Usamos Soro 0,9% (Isotônico) para manter o equilíbrio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LessonSolucoes;
