import React from 'react';

export const LessonGeoPlana = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. O Medidor de Terras</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Geometria (Geo=Terra, Metron=Medida) nasceu no Egito.
                    O conceito central é <strong className="text-white">Área</strong>: quanto "papel" preciso para cobrir uma forma 2D.
                </p>
            </div>

            {/* Area Formulas Grid */}
            <h3 className="text-lg font-bold text-white mt-4">Kit de Sobrevivência (Áreas)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                    <div className="text-2xl mb-2">🟦</div>
                    <strong className="text-blue-400 block mb-1">Retângulo</strong>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'b . h'}
                    </div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                    <div className="text-2xl mb-2">🔺</div>
                    <strong className="text-yellow-400 block mb-1">Triângulo</strong>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'(b . h) / 2'}
                    </div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-emerald-500">
                    <div className="text-2xl mb-2">🔼</div>
                    <strong className="text-emerald-400 block mb-1">T. Equilátero</strong>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'l²√3 / 4'}
                    </div>
                    <span className="text-[10px] text-zinc-500 block text-center mt-1">Decore!</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                    <div className="text-2xl mb-2">🏗️</div>
                    <strong className="text-purple-400 block mb-1">Trapézio</strong>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                        {'(B + b).h / 2'}
                    </div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-orange-500 col-span-2 md:col-span-1">
                    <div className="text-2xl mb-2">⚪</div>
                    <strong className="text-orange-400 block mb-1">Círculo</strong>
                    <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded mb-1">
                        {'A = πR²'}
                    </div>
                    <div className="font-mono text-center text-zinc-400 text-[10px]">
                        {'C = 2πR'}
                    </div>
                </div>
            </div>

            {/* Polygons & Angles */}
            <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Soma dos Ângulos Internos</h3>
                    <p className="text-sm text-zinc-400 mb-2">
                        Qualquer polígono vira triângulos. Um quadrado são 2 triângulos (360°).
                    </p>
                    <div className="font-mono text-indigo-400 font-bold">
                        {'Si = (n - 2) . 180°'}
                    </div>
                </div>
                <div className="w-px h-16 bg-white/10 hidden md:block"></div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Semelhança (Escala)</h3>
                    <p className="text-sm text-zinc-400 mb-2">
                        Cuidado! Se dobrar o lado (x2), a área <strong className="text-red-400">QUADRUPLICA</strong> (x4).
                    </p>
                    <div className="font-mono text-red-400 font-bold">
                        {'k²'}
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-orange-900/10 p-6 rounded-2xl border border-orange-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🍕</span>
                    <h2 className="text-xl font-bold text-orange-400">Estudo de Caso: A Economia da Pizza</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Uma pizza gigante (40cm) vale mais que duas médias (20cm).
                    <br />Raio 10cm → {'Área 100π'}.
                    <br />Raio 20cm → {'Área 400π'}. (4x maior, não 2x).
                    <br />As pizzarias lucram na geometria quadrática.
                </p>
            </div>
        </div>
    );
};
