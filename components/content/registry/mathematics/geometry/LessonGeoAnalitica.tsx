import React from 'react';

export const LessonGeoAnalitica = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. O Sonho de Descartes</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Antes, Geometria era desenho. Descartes transformou formas em números $(x, y)$.
                    Agora, uma reta é uma equação $y = mx + n$. Isso permitiu que computadores (que só veem números) desenhassem o mundo.
                </p>
            </div>

            {/* Point, Line, Circle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Point */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-emerald-500">
                    <strong className="text-emerald-400 block mb-1">Ponto (x,y)</strong>
                    <p className="text-xs text-zinc-400 mb-2">A unidade básica.</p>
                    <div className="font-mono text-center text-white text-[10px] bg-black/20 p-1 rounded mb-1">
                        {'d² = Δx² + Δy²'}
                    </div>
                    <span className="text-[10px] text-zinc-500 block text-center">Distância (=Pitágoras)</span>
                </div>

                {/* Line */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                    <strong className="text-blue-400 block mb-1">Reta</strong>
                    <p className="text-xs text-zinc-400 mb-2">Linearidade.</p>
                    <div className="font-mono text-center text-white text-[10px] bg-black/20 p-1 rounded mb-1">
                        {'y = mx + n'}
                    </div>
                    <span className="text-[10px] text-zinc-500 block text-center">m = inclinação</span>
                </div>

                {/* Circle */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                    <strong className="text-purple-400 block mb-1">Circunferência</strong>
                    <p className="text-xs text-zinc-400 mb-2">Equidistância.</p>
                    <div className="font-mono text-center text-white text-[10px] bg-black/20 p-1 rounded mb-1">
                        {'(x-a)² + (y-b)² = R²'}
                    </div>
                    <span className="text-[10px] text-zinc-500 block text-center">Centro (a,b)</span>
                </div>
            </div>

            {/* Relative Positions */}
            <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 space-y-2">
                <h3 className="text-sm font-bold text-white">Posições Relativas das Retas</h3>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Paralelas (Nunca tocam)</span>
                    <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{'m1 = m2'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Perpendiculares (90°)</span>
                    <span className="font-mono text-pink-400 bg-pink-500/10 px-2 py-1 rounded">{'m1 . m2 = -1'}</span>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🛰️</span>
                    <h2 className="text-xl font-bold text-indigo-400">Estudo de Caso: GPS (3D)</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    O GPS é Geometria Analítica pura.
                    Cada satélite gera uma esfera: {'(x-xs)² + (y-ys)² + (z-zs)² = d²'}.
                    Seu celular resolve um sistema de equações para achar a interseção (seu ponto x, y, z).
                </p>
            </div>
        </div>
    );
};
