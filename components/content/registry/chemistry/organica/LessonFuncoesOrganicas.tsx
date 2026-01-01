import React from 'react';

const LessonFuncoesOrganicas: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-emerald-400">1. Funções: A Personalidade</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Se a cadeia é o esqueleto, a <strong className="text-white">Função</strong> é a personalidade. O grupo funcional define como a molécula reage e cheira.
                </p>
            </div>

            {/* Functions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                    <strong className="text-white block">Álcool (-OH)</strong>
                    <span className="text-xs text-zinc-500">Hidroxila em Carbono Saturado. Solúvel.</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                    <strong className="text-white block">Ácido (-COOH)</strong>
                    <span className="text-xs text-zinc-500">O mais ácido. Vinagre.</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                    <strong className="text-white block">Amina (-NH₂)</strong>
                    <span className="text-xs text-zinc-500">Básica. Cheiro de peixe.</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                    <strong className="text-white block">Aldeído (-CHO)</strong>
                    <span className="text-xs text-zinc-500">Na ponta. Formol.</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-orange-500">
                    <strong className="text-white block">Cetona (C=O)</strong>
                    <span className="text-xs text-zinc-500">No meio. Acetona.</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-pink-500">
                    <strong className="text-white block">Éster (-COO-)</strong>
                    <span className="text-xs text-zinc-500">Cereja do bolo. Aromas de frutas.</span>
                </div>
            </div>

            {/* Isomerism */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-emerald-400">2. Isomeria: As Aparências Enganam</h2>
                <p className="text-zinc-400 text-sm">
                    Mesma fórmula molecular, estruturas (e destinos) diferentes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cis-Trans */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-2">Geométrica (Cis-Trans)</h3>
                        <div className="flex gap-4 mb-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-emerald-300">Cis: Juntos (Barco)</span>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-emerald-300">Trans: Opostos (Cadeira)</span>
                        </div>
                        <p className="text-xs text-zinc-400">Precisa de dupla ligação rígida.</p>
                    </div>

                    {/* Optical */}
                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-2">Óptica (Quiralidade)</h3>
                        <div className="flex gap-4 mb-2">
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-300">Carbono Quiral*</span>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-300">4 Ligantes Diferentes</span>
                        </div>
                        <p className="text-xs text-zinc-400">Imagem no espelho não sobrepõe (Mãos).</p>
                    </div>
                </div>
            </div>

            {/* Case Study: Thalidomide */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-bold text-red-400 mb-2">A Tragédia da Talidomida</h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    O exemplo mais dramático de Isomeria Óptica. Vendida nos anos 50 para enjoo.
                    <br />• Isômero R (Dextro): Sedativo seguro.
                    <br />• Isômero S (Levo): <strong className="text-red-300">Teratogênico</strong> (causa má formação fetal).
                    <br />O remédio era uma mistura dos dois. Milhares de bebês nasceram com focomelia.
                </p>
                <div className="bg-black/30 p-2 rounded text-center text-xs text-red-200">
                    Hoje é obrigatório separar os isômeros.
                </div>
            </div>
        </div>
    );
};

export default LessonFuncoesOrganicas;
