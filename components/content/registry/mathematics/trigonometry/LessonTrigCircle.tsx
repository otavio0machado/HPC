import React from 'react';

export const LessonTrigCircle = () => {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-indigo-400">1. Introdução e Definição</h2>
                <p className="text-zinc-400 leading-relaxed">
                    Para descrever o que se repete (ondas, marés, som), o triângulo não basta. Precisamos do <strong className="text-white">Ciclo Trigonométrico</strong>.
                    É a máquina de transformar rotação em ondas {'($y = \\text{sen}(x)$)'}.
                </p>
            </div>

            {/* Cycle Anatomy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-[#1A1B26] p-6 rounded-full aspect-square border-2 border-indigo-500/30 relative flex items-center justify-center">
                    {/* Axes */}
                    <div className="absolute w-full h-px bg-white/20"></div>
                    <div className="absolute h-full w-px bg-white/20"></div>
                    {/* Labels */}
                    <div className="absolute top-4 text-xs text-indigo-300 font-bold">SEN (Sem sono)</div>
                    <div className="absolute right-4 text-xs text-indigo-300 font-bold">COS (Com sono)</div>
                    {/* Quadrants */}
                    <div className="absolute top-1/4 right-1/4 text-zinc-600 text-xs">1º (+,+)</div>
                    <div className="absolute top-1/4 left-1/4 text-zinc-600 text-xs">2º (-,+)</div>
                    <div className="absolute bottom-1/4 left-1/4 text-zinc-600 text-xs">3º (-,-)</div>
                    <div className="absolute bottom-1/4 right-1/4 text-zinc-600 text-xs">4º (+,-)</div>
                </div>

                <div className="space-y-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-indigo-500">
                        <strong className="text-indigo-400 block mb-1">Relação Fundamental</strong>
                        <div className="text-xl font-mono text-white">sen²x + cos²x = 1</div>
                        <p className="text-xs text-zinc-500 mt-2">O Pitágoras do Ciclo (Raio = 1).</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-emerald-500">
                        <strong className="text-emerald-400 block mb-1">Sinais (SE TA CO)</strong>
                        <p className="text-xs text-zinc-400">
                            1º Q: Todos. <br />
                            2º Q: <strong className="text-white">SE</strong>no +.<br />
                            3º Q: <strong className="text-white">TA</strong>ngente +.<br />
                            4º Q: <strong className="text-white">CO</strong>sseno +.
                        </p>
                    </div>
                </div>
            </div>

            {/* Graph Function */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-indigo-400">2. Funções Trigonométricas</h2>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="font-mono text-center text-lg text-white mb-4 bg-black/20 p-2 rounded">
                        f(x) = a + b . sen(cx + d)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                        <div>
                            <strong className="text-indigo-300 block">a</strong>
                            <span className="text-zinc-500 text-xs">Eixo Médio (Sobe/Desce)</span>
                        </div>
                        <div>
                            <strong className="text-indigo-300 block">b</strong>
                            <span className="text-zinc-500 text-xs">Amplitude (Estica Y)</span>
                        </div>
                        <div>
                            <strong className="text-indigo-300 block">c</strong>
                            <span className="text-zinc-500 text-xs">Período (P = 2π/c)</span>
                        </div>
                        <div>
                            <strong className="text-indigo-300 block">d</strong>
                            <span className="text-zinc-500 text-xs">Fase (Esquerda/Direita)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Study */}
            <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20">
                <h2 className="text-xl font-bold text-amber-400 mb-2">Estudo de Caso: Cancelamento de Ruído</h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    Como o fone isola o som? Criando uma <strong className="text-white">onda trigonométrica inversa</strong>.
                    Ao somar $sen(x)$ (ruído) com $-sen(x)$ (anti-ruído), o resultado é Zero. Silêncio matemático.
                </p>
                <div className="h-12 w-full bg-black/30 rounded flex items-center justify-center overflow-hidden relative">
                    <div className="absolute w-full h-px bg-amber-500/50"></div>
                    <span className="text-xs text-amber-500/50 z-10">Onda + Anti-Onda = 0</span>
                </div>
            </div>
        </div>
    );
};
