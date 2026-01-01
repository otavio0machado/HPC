import React from 'react';

export const LessonGeoEspacial = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. O Mundo 3D</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Aqui ganhamos profundidade. Calculamos <strong className="text-white">Área Total</strong> (casca) e <strong className="text-white">Volume</strong> (recheio).
                    O segredo é ver se o sólido tem "ponta" ou não.
                </p>
            </div>

            {/* Solids Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prism/Cylinder */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border-t-4 border-blue-500">
                    <h3 className="text-lg font-bold text-white mb-2">Corpo Reto (Prisma/Cilindro)</h3>
                    <p className="text-xs text-zinc-500 mb-4">Teto igual ao chão.</p>
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded">
                        <span className="text-zinc-300 text-sm">Volume</span>
                        <span className="font-mono text-blue-400 font-bold">{'Ab . h'}</span>
                    </div>
                </div>

                {/* Pyramid/Cone */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border-t-4 border-red-500">
                    <h3 className="text-lg font-bold text-white mb-2">Com Ponta (Pirâmide/Cone)</h3>
                    <p className="text-xs text-zinc-500 mb-4">Afunila num vértice.</p>
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded">
                        <span className="text-zinc-300 text-sm">Volume</span>
                        <span className="font-mono text-red-400 font-bold">{'Ab . h / 3'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 text-center">Cabem 3 cones no cilindro.</p>
                </div>
            </div>

            {/* Sphere */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                <div className="text-4xl animate-pulse">🔮</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">A Esfera (Perfeição)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-500 block">Volume</span>
                            <span className="font-mono text-purple-400 font-bold">{'4/3 πR³'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500 block">Área</span>
                            <span className="font-mono text-purple-400 font-bold">{'4πR²'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scaling 3D */}
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Escala 3D (O Perigo)</strong>
                <p className="text-xs text-zinc-400">
                    Se dobrar a aresta de uma caixa (x2):
                    <br />• A Área quadruplica (x4).
                    <br />• O Volume <strong className="text-red-400">OCTUPLICA</strong> (2³ = 8).
                </p>
            </div>

            {/* Case Study */}
            <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🐻‍❄️</span>
                    <h2 className="text-xl font-bold text-cyan-400">Estudo de Caso: Biologia</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Por que ursos polares são grandes? (Regra de Bergmann).
                    <br />O calor sai pela pele (Área). O calor é gerado pela carne (Volume).
                    <br />Animais grandes têm muito mais volume do que área. Seguram o calor.
                    Um rato morreria congelado no Ártico em minutos.
                </p>
            </div>
        </div>
    );
};
