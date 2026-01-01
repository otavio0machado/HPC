import React from 'react';

export const LessonTrigTriangle = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. Medindo o Impossível</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Como medir a largura de um rio sem atravessar? Usando <strong className="text-white">Triângulos</strong>.
                    Se tem 90°, usamos SOHCAHTOA. Se não tem, usamos as Leis (Senos e Cossenos).
                </p>
            </div>

            {/* Rights vs Any Triangle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Triangle */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Triângulo Retângulo (90°)</h3>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-center gap-2 mb-2">
                            <span className="bg-indigo-900/30 text-indigo-300 px-2 rounded text-xs">SOH</span>
                            <span className="bg-indigo-900/30 text-indigo-300 px-2 rounded text-xs">CAH</span>
                            <span className="bg-indigo-900/30 text-indigo-300 px-2 rounded text-xs">TOA</span>
                        </div>
                        <ul className="text-xs text-zinc-400 space-y-1">
                            <li>• Sen = Oposto / Hipotenusa</li>
                            <li>• Cos = Adjacente / Hipotenusa</li>
                            <li>• Tan = Oposto / Adjacente</li>
                        </ul>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded text-center text-xs text-yellow-200">
                        Decorar: 30°, 45°, 60° (1,2,3... 3,2,1)
                    </div>
                </div>

                {/* Any Triangle */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Triângulo Qualquer</h3>

                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                        <strong className="text-blue-400 block text-sm">Lei dos Senos (Pares)</strong>
                        <div className="font-mono text-center text-white my-2 text-xs">
                            a/senA = b/senB = 2R
                        </div>
                        <p className="text-[10px] text-zinc-500">Use quando tiver pares (Lado X e Ângulo X).</p>
                    </div>

                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                        <strong className="text-purple-400 block text-sm">Lei dos Cossenos (LAL)</strong>
                        <div className="font-mono text-center text-white my-2 text-xs">
                            a² = b² + c² - 2bc.cosA
                        </div>
                        <p className="text-[10px] text-zinc-500">Use com 3 lados ou Lado-Ângulo-Lado. (Pitágoras Turbinado).</p>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🛰️</span>
                    <h2 className="text-xl font-bold text-indigo-300">Estudo de Caso: GPS</h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    O GPS não mede distâncias com régua. Ele usa geometria.
                    Seu celular calcula a distância até 3 ou 4 satélites e usa a intersecção de esferas (baseada na <strong className="text-white">Lei dos Cossenos 3D</strong>) para te localizar.
                </p>
            </div>
        </div>
    );
};
