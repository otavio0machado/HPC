import React from 'react';
import {
    Atom,
    Calculator,
    FlaskConical,
    Network,
    Cpu,
    Dna,
    Hourglass,
    Globe,
    Brain,
    Users,
    BookA,
    Languages,
    BookOpen,
    Palette
} from 'lucide-react';

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    status: 'Locked' | 'In Progress' | 'Completed';
    content?: React.ReactNode; // For the actual lesson content
}

export interface Module {
    id: string;
    title: string;
    description: string;
    locked: boolean;
    duration: string;
    lessons: Lesson[];
    status: 'Locked' | 'In Progress' | 'Completed';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    category: 'EXATAS' | 'BIOLÓGICAS' | 'HUMANAS' | 'LINGUAGENS' | 'ARTES';
    duration: string;
    progress: number;
    icon: any; // Storing the component or element directly for simplicity in this refactor
    color: string;
    tags: string[];
    objectives?: string[];
    modules?: Module[];
}

export const COURSES_DATA: Course[] = [
    // ... (Previous courses will be re-added here, but we focus on Chemistry first)
    // We will map the "id" from the previous ContentModuleNew to this one.

    // --- QUÍMICA ---
    {
        id: 'chemistry',
        title: 'Química',
        description: 'Química geral, orgânica, físico-química e analítica.',
        category: 'EXATAS',
        duration: '85h',
        progress: 0,
        icon: FlaskConical, // Passing the component function/class, will adhere to usage in CourseCard
        color: 'bg-emerald-600',
        tags: ['exatas'],
        objectives: [
            "Compreender a evolução dos modelos atômicos",
            "Entender a tabela periódica e suas propriedades",
            "Dominar os conceitos de ligações químicas",
            "Analisar reações e estequiometria"
        ],
        modules: [
            {
                id: 'm_atomistica',
                title: 'Módulo 1: Atomística',
                description: 'A estrutura fundamental da matéria.',
                locked: false,
                duration: '4h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_modelos',
                        title: 'Modelos Atômicos e Evolução',
                        duration: '45m',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8" >
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400"> 1. Introdução e Definição</ h2 >
                                    <p className="text-zinc-400 leading-relaxed" >
                                        A evolução dos Modelos Atômicos é a espinha dorsal da Química.Não se trata apenas de memorizar nomes de cientistas, mas de compreender como a humanidade passou de uma ideia filosófica abstrata para uma descrição matemática e probabilística da matéria.
                                    </p>
                                    < p className="text-zinc-400 leading-relaxed" >
                                        Definimos < strong > "Modelo Atômico" </strong> não como a verdade absoluta e imutável de como um átomo se parece, mas como uma representação teórica capaz de explicar os fenômenos observados experimentalmente em uma determinada época. Um modelo só é substituído quando falha em explicar uma nova descoberta. Portanto, estudar Dalton, Thomson, Rutherford e Bohr é estudar a história do método científico aplicado à constituição fundamental do universo: o átomo. Esta base é crucial para entender ligações químicas, eletricidade e até a medicina nuclear.
                                    </p>

                                    < h2 className="text-2xl font-bold text-emerald-400 mt-8" > 2. Contexto Histórico e Científico </h2>
                                    < p className="text-zinc-400 leading-relaxed" >
                                        A ideia de átomo nasceu na Grécia Antiga(séc.V a.C.) com os filósofos Leucipo e Demócrito.Eles propuseram que, se dividíssemos a matéria sucessivamente, chegaríamos a uma partícula indivisível(a - tomo = sem partes).Contudo, isso era pura filosofia, sem base experimental.Durante mais de 2000 anos, essa ideia ficou adormecida, ofuscada pela teoria dos quatro elementos de Aristóteles.
                                    </p>
                                    < p className="text-zinc-400 leading-relaxed" >
                                        A retomada científica ocorreu apenas no início do século XIX.O mundo estava vivendo a Revolução Industrial e o nascimento da Química moderna com Lavoisier.Os cientistas precisavam explicar por que as massas se conservavam nas reações e por que os elementos se combinavam em proporções fixas.
                                    </p>
                                    < div className="bg-white/5 p-4 rounded-xl border-l-4 border-emerald-500 my-6" >
                                        <p className="text-sm text-zinc-300 italic">
                                            "Mais tarde, no final do século XIX e início do XX, a descoberta da eletricidade e da radioatividade quebrou a física clássica... Essas perguntas forçaram a evolução dos modelos."
                                        </p>
                                    </div>

                                    < h2 className="text-2xl font-bold text-emerald-400 mt-8" > 3. Características Fundamentais e Análise Técnica</ h2 >

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6" >
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5" >
                                            <h3 className="text-xl font-bold text-white mb-2" > A.Modelo de Dalton(1808) </h3>
                                            < div className="text-sm text-zinc-400 space-y-2" >
                                                <p><strong className="text-emerald-300" > Apelido: </strong> Bola de Bilhar</p >
                                                <p>Esfera maciça, indivisível, indestrutível e neutra.</p>
                                                < p > <span className="text-red-400" > Falha: </span> Não explicava eletricidade/radioatividade.</p>
                                            </div>
                                        </div>
                                        < div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5" >
                                            <h3 className="text-xl font-bold text-white mb-2" > B.Modelo de Thomson(1897) </h3>
                                            < div className="text-sm text-zinc-400 space-y-2" >
                                                <p><strong className="text-emerald-300" > Apelido: </strong> Pudim de Passas</p >
                                                <p>Esfera positiva com elétrons incrustados.Divisível! </p>
                                                < p > <span className="text-red-400" > Falha: </span> Não explicava o espalhamento alfa (núcleo denso).</p >
                                            </div>
                                        </div>
                                        < div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5" >
                                            <h3 className="text-xl font-bold text-white mb-2" > C.Modelo de Rutherford(1911) </h3>
                                            < div className="text-sm text-zinc-400 space-y-2" >
                                                <p><strong className="text-emerald-300" > Apelido: </strong> Sistema Planetário</p >
                                                <p>Núcleo denso e positivo, grandes vazios.</p>
                                                < p > <span className="text-red-400" > Falha: </span> Instabilidade do elétron pela física clássica.</p >
                                            </div>
                                        </div>
                                        < div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5" >
                                            <h3 className="text-xl font-bold text-white mb-2" > D.Modelo de Bohr(1913) </h3>
                                            < div className="text-sm text-zinc-400 space-y-2" >
                                                <p><strong className="text-emerald-300" > Conceito: </strong> Níveis de Energia</p >
                                                <p>Órbitas estacionárias e saltos quânticos.</p>
                                                < p > <strong className="text-emerald-300" > Importância: </strong> Explicou espectros de emissão (cores).</p >
                                            </div>
                                        </div>
                                    </div>

                                    < h2 className="text-2xl font-bold text-emerald-400 mt-8" > 4. Estudo de Caso: O Experimento da Lâmina de Ouro </h2>
                                    < p className="text-zinc-400 leading-relaxed" >
                                        Imagine que o núcleo do átomo é uma bola de tênis no centro do Maracanã.A eletrosfera seria a arquibancada.Todo o resto é vazio.
                                    </p>
                                    < ul className="list-disc list-inside space-y-2 text-zinc-400 mt-2" >
                                        <li>Rutherford bombardeou ouro com partículas alfa.</li>
                                        < li > 99 % passaram direto(o átomo é vazio).</li>
                                        < li > Algumas desviaram(repulsão do núcleo positivo).</li>
                                    </ul>

                                    < h2 className="text-2xl font-bold text-emerald-400 mt-8" > 5. Resumo "Para Levar"</ h2 >
                                    <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/30 space-y-2 text-zinc-300" >
                                        <p>✅ <strong>Dalton: </strong> Bola de bilhar, conservação de massa.</p >
                                        <p>✅ <strong>Thomson: </strong> Pudim de passas, natureza elétrica.</p >
                                        <p>✅ <strong>Rutherford: </strong> Sistema planetário, núcleo denso.</p >
                                        <p>✅ <strong>Bohr: </strong> Níveis de energia, luz e fótons.</p >
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_tabela',
                title: 'Módulo 2: Tabela Periódica',
                description: 'Organização, propriedades e tendências periódicas.',
                locked: false,
                duration: '3h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_tabela_propriedades',
                        title: 'Tabela Periódica e Propriedades',
                        duration: '50m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* 1. Introduction */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A <strong className="text-white">Tabela Periódica</strong> não é apenas um cartaz colorido na parede do laboratório; ela é o mapa rodoviário definitivo do universo químico. Ela organiza todos os 118 elementos conhecidos não de forma aleatória, mas baseada em uma lei fundamental: a <span className="text-emerald-300 italic">Lei da Periodicidade</span>.
                                    </p>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Definimos a Tabela Periódica moderna como a organização sistemática dos elementos em ordem crescente de <strong className="text-white">Número Atômico (Z)</strong>, de modo que elementos com propriedades químicas e físicas semelhantes se repetem em intervalos regulares (períodos).
                                    </p>
                                    <div className="bg-emerald-900/10 border-l-4 border-emerald-500 p-4 rounded-r-xl my-4">
                                        <p className="text-emerald-200 text-sm italic">
                                            "Para o estudante de alto desempenho, dominar a tabela não significa decorar nomes, mas sim entender a localização como uma ferramenta preditiva. Se você sabe onde o elemento está, você sabe como ele se comporta."
                                        </p>
                                    </div>
                                </div>

                                {/* 2. Historical Context */}
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Contexto Histórico e Científico</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                            <div className="text-emerald-500 font-black text-4xl mb-2 opacity-20">1800</div>
                                            <h3 className="text-lg font-bold text-white mb-2">A "Loucura" Inicial</h3>
                                            <p className="text-sm text-zinc-400">
                                                Novos elementos eram descobertos constantemente, mas não havia lógica conectando-os. A química era uma coleção de fatos isolados.
                                            </p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                                            <div className="text-emerald-500 font-black text-4xl mb-2 opacity-20">1869</div>
                                            <h3 className="text-lg font-bold text-white mb-2">O Sonho de Mendeleev</h3>
                                            <p className="text-sm text-zinc-400">
                                                Organizou os elementos por <strong>Massa Atômica</strong>. Deixou espaços vazios para elementos ainda não descobertos (como o Germânio), prevendo suas propriedades com precisão.
                                            </p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                            <div className="text-emerald-500 font-black text-4xl mb-2 opacity-20">1913</div>
                                            <h3 className="text-lg font-bold text-white mb-2">A Correção de Moseley</h3>
                                            <p className="text-sm text-zinc-400">
                                                Reorganizou a tabela por <strong>Número Atômico (Z)</strong> (carga nuclear), corrigindo falhas na sequência de Mendeleev e consolidando a Tabela Moderna.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Fundamental Characteristics & Image */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-emerald-400">3. Características Fundamentais e Análise Técnica</h2>

                                    {/* Uploaded Image Display */}
                                    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 p-2">
                                        <img
                                            src="/assets/periodic_trends.png"
                                            alt="Tendências da Tabela Periódica"
                                            className="w-full h-auto rounded-2xl"
                                        />
                                        <p className="text-center text-xs text-zinc-500 mt-2 font-mono">Tendências: Raio Atômico, Eletronegatividade e Energia de Ionização</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                                                Anatomia
                                            </h3>
                                            <ul className="space-y-3">
                                                <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <strong className="text-emerald-300 block text-xs uppercase tracking-wider mb-1">Períodos (Linhas)</strong>
                                                    <span className="text-zinc-300 text-sm">São 7. Indicam o número de camadas eletrônicas. Ex: Sódio (3º período) = camadas K, L, M.</span>
                                                </li>
                                                <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <strong className="text-emerald-300 block text-xs uppercase tracking-wider mb-1">Famílias (Colunas)</strong>
                                                    <span className="text-zinc-300 text-sm">São 18. Mesma configuração de valência ("sobrenome químico").</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                                Principais Grupos
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="p-2 bg-red-500/10 text-red-200 rounded-lg border border-red-500/20">
                                                    <strong>Metais Alcalinos (G1)</strong><br />Reativos, explodem na água.
                                                </div>
                                                <div className="p-2 bg-orange-500/10 text-orange-200 rounded-lg border border-orange-500/20">
                                                    <strong>Alcalinoterrosos (G2)</strong><br />Terminam em ns².
                                                </div>
                                                <div className="p-2 bg-yellow-500/10 text-yellow-200 rounded-lg border border-yellow-500/20">
                                                    <strong>Halogênios (G17)</strong><br />Geradores de sais, muito reativos.
                                                </div>
                                                <div className="p-2 bg-purple-500/10 text-purple-200 rounded-lg border border-purple-500/20">
                                                    <strong>Gases Nobres (G18)</strong><br />Inertes, octeto completo.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trends Details */}
                                <div className="bg-[#1A1B26] p-6 rounded-3xl border border-white/10 space-y-6">
                                    <h3 className="text-xl font-bold text-white mb-4">As Propriedades Periódicas (O Coração da Matéria)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-bold text-blue-300 border-b border-blue-500/30 pb-2">
                                                <span>Raio Atômico</span>
                                                <span>↙ (Baixo-Esquerda)</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                Aumenta para baixo (mais camadas) e para a esquerda (menor atração nuclear). <br />
                                                <span className="text-white">Maior: Frâncio (Fr)</span><br />
                                                <span className="text-white">Menor: Hélio (He)</span>
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-bold text-amber-300 border-b border-amber-500/30 pb-2">
                                                <span>Energia de Ionização</span>
                                                <span>↗ (Cima-Direita)</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                Energia para arrancar um elétron. Inverso do raio. Quanto menor, mais difícil tirar.<br />
                                                <span className="text-white">Maior EI: Hélio (He)</span>
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-bold text-green-300 border-b border-green-500/30 pb-2">
                                                <span>Eletronegatividade</span>
                                                <span>↗ (Cima-Direita)</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                "Ganância" por elétrons. Gases nobres fora.<br />
                                                <strong className="text-white">F &gt; O &gt; N &gt; Cl &gt; Br &gt; I &gt; S &gt; C &gt; P &gt; H</strong><br />
                                                <span className="text-white">Rei: Flúor (F)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Case Study */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Duelo Flúor vs. Frâncio</h2>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-green-400">Flúor (F)</h3>
                                                <span className="text-xs font-mono bg-green-500/20 px-2 py-1 rounded">Grupo 17 (Topo)</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 mb-4">
                                                Minúsculo, "desesperado" por elétrons. High Energy.<br />
                                                <strong>Resultado:</strong> Oxidante mais forte. Reage até com vidro.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center text-zinc-600 font-bold italic">VS</div>
                                        <div className="flex-1 bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-blue-400">Frâncio (Fr)</h3>
                                                <span className="text-xs font-mono bg-blue-500/20 px-2 py-1 rounded">Grupo 1 (Base)</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 mb-4">
                                                Gigantesco, elétron solto (blindagem).<br />
                                                <strong>Resultado:</strong> Instável, radioativo. Entrega elétrico facilmente (explosivo).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Connections */}
                                <div className="bg-zinc-900/30 p-6 rounded-3xl space-y-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="text-2xl">🌍</span> Conexões Interdisciplinares
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-sm text-zinc-400">
                                            <strong className="text-white">Geopolítica (Terras Raras):</strong> Os Lantanídeos são essenciais para baterias e ímãs. Domínio da China.
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            <strong className="text-white">Biologia (C vs Si):</strong> Carbono é menor que Silício, permitindo ligações duplas/triplas estáveis e cadeias longas (DNA), essencial para vida complexa.
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            <strong className="text-white">Medicina:</strong> Bário e Iodo são usados em contrastes por serem grandes (barram Raio-X).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_ligacoes',
                title: 'Módulo 3: Ligações Químicas',
                description: 'Ligações iônicas, covalentes, metálicas e geometria molecular.',
                locked: false,
                duration: '4h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_ligacoes_geometria',
                        title: 'Ligações e Geometria Molecular',
                        duration: '1h 15m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* 1. Introduction */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Se os átomos são as letras do alfabeto químico, as <strong className="text-white">Ligações Químicas</strong> são as regras gramaticais que permitem formar palavras (moléculas) e textos (substâncias complexas). Sem ligações, o universo seria uma sopa monótona de átomos gasosos isolados.
                                    </p>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A força motriz por trás de quase todas as ligações é a busca pela <strong className="text-emerald-300">Estabilidade</strong>. Na natureza, sistemas tendem a buscar o estado de menor energia possível. Para a maioria dos átomos representativos, essa estabilidade é alcançada através da <strong className="text-white">Regra do Octeto</strong>: a tendência de imitar a configuração eletrônica de um Gás Nobre (8 elétrons na camada de valência).
                                    </p>
                                </div>

                                {/* 2. Historical Context */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Gilbert N. Lewis (1916)</h3>
                                        <p className="text-sm text-zinc-400">
                                            Revolucionou a química ao propor que as ligações envolvem o compartilhamento ou transferência de elétrons. Criou a famosa <strong className="text-emerald-300">Notação de Lewis</strong> (pontinhos).
                                        </p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Linus Pauling (Séc. XX)</h3>
                                        <p className="text-sm text-zinc-400">
                                            Aprofundou a teoria com mecânica quântica, explicando a hibridização e a natureza das ligações covalentes, permitindo prever a geometria molecular.
                                        </p>
                                    </div>
                                </div>

                                {/* 3. Types of Bonds */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-emerald-400">3. Tipos de Ligações e Análise Técnica</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Ionic */}
                                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 p-6 rounded-2xl border border-purple-500/20 space-y-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 font-bold text-xs uppercase">Iônica</div>
                                            </div>
                                            <h3 className="text-xl font-bold text-purple-200">O Grande Roubo</h3>
                                            <p className="text-xs text-zinc-400"><strong>Metal + Ametal</strong></p>
                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                Transferência definitiva de elétrons. Gera Cátions (+) e Ânions (-) que se atraem. Forma retículos cristalinos sólidos.
                                            </p>
                                            <p className="text-xs text-zinc-500">Ex: NaCl (Sal)</p>
                                        </div>

                                        {/* Metallic */}
                                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 p-6 rounded-2xl border border-amber-500/20 space-y-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300 font-bold text-xs uppercase">Metálica</div>
                                            </div>
                                            <h3 className="text-xl font-bold text-amber-200">Mar de Elétrons</h3>
                                            <p className="text-xs text-zinc-400"><strong>Metal + Metal</strong></p>
                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                Cátions mergulhados em elétrons livres (gás eletrônico). Conduzem muita eletricidade e são maleáveis.
                                            </p>
                                        </div>

                                        {/* Covalent */}
                                        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20 space-y-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300 font-bold text-xs uppercase">Covalente</div>
                                            </div>
                                            <h3 className="text-xl font-bold text-cyan-200">O Compartilhamento</h3>
                                            <p className="text-xs text-zinc-400"><strong>Ametal + Ametal</strong></p>
                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                Compartilhamento de pares de elétrons. Pode ser polar ou apolar. Forma moléculas verdadeiras.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Geometria Molecular */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-emerald-400">4. Geometria Molecular (VSEPR)</h2>
                                    <p className="text-zinc-400">
                                        Elétrons se repelem e tentam ficar o mais longe possível. Visão da teoria VSEPR:
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                                            <div className="text-2xl mb-2">📏</div>
                                            <div className="font-bold text-white text-sm">Linear</div>
                                            <div className="text-xs text-zinc-500">180°</div>
                                            <div className="text-[10px] text-zinc-600 mt-1">CO₂, BeH₂</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                                            <div className="text-2xl mb-2">📐</div>
                                            <div className="font-bold text-white text-sm">Angular</div>
                                            <div className="text-xs text-zinc-500">~104.5°</div>
                                            <div className="text-[10px] text-zinc-600 mt-1">H₂O, SO₂</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                                            <div className="text-2xl mb-2">⚠️</div>
                                            <div className="font-bold text-white text-sm">Trigonal</div>
                                            <div className="text-xs text-zinc-500">120°</div>
                                            <div className="text-[10px] text-zinc-600 mt-1">BF₃, SO₃</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                                            <div className="text-2xl mb-2">⛺</div>
                                            <div className="font-bold text-white text-sm">Piramidal</div>
                                            <div className="text-xs text-zinc-500">~107°</div>
                                            <div className="text-[10px] text-zinc-600 mt-1">NH₃</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors text-center">
                                            <div className="text-2xl mb-2">🔷</div>
                                            <div className="font-bold text-white text-sm">Tetraédrica</div>
                                            <div className="text-xs text-zinc-500">109.5°</div>
                                            <div className="text-[10px] text-zinc-600 mt-1">CH₄</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Study Case */}
                                <div className="rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-2xl">💧</span> Estudo de Caso: Água (Polar) vs CO₂ (Apolar)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                        <div>
                                            <strong className="text-blue-300 block mb-1">Dióxido de Carbono (CO₂)</strong>
                                            <p className="text-zinc-300">
                                                Geometria <strong className="text-white">Linear</strong>. Os vetores de polaridade se anulam (puxam para lados opostos). Molécula <strong className="text-white">Apolar</strong>. Atração fraca = Gás.
                                            </p>
                                        </div>
                                        <div>
                                            <strong className="text-blue-300 block mb-1">Água (H₂O)</strong>
                                            <p className="text-zinc-300">
                                                Geometria <strong className="text-white">Angular</strong> devida aos pares de elétrons livres no Oxigênio que "empurram" os H para baixo. Molécula <strong className="text-white">Polar</strong>. Fortes ligações de hidrogênio = Líquida.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Connections */}
                                <div className="prose prose-invert max-w-none text-sm text-zinc-400">
                                    <h3 className="text-emerald-400 font-bold text-lg">Conexões Interdisciplinares</h3>
                                    <ul className="space-y-2">
                                        <li><strong className="text-white">Biologia:</strong> O modelo "Chave-Fechadura" das enzimas depende da geometria molecular correta.</li>
                                        <li><strong className="text-white">Engenharia:</strong> Grafite (folhas deslizantes) e Diamante (rede rígida) são ambos Carbono pura, mas a geometria dad ligações muda tudo.</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_funcoes',
                title: 'Módulo 4: Funções Inorgânicas',
                description: 'Ácidos, Bases, Sais, Óxidos e pH.',
                locked: false,
                duration: '3h 30m',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_funcoes_inorganicas',
                        title: 'Funções Inorgânicas e pH',
                        duration: '1h',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_estequiometria',
                title: 'Módulo 5: Estequiometria',
                description: 'Leis ponderais, mol, massa molar e cálculos estequiométricos.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_estequiometria_leis',
                        title: 'Estequiometria e Leis Ponderais',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Se a Química fosse um restaurante, a <strong className="text-white">Estequiometria</strong> seria a matemática da receita. Ela é a contabilidade dos átomos: em um sistema fechado, a massa total dos reagentes DEVE ser igual à massa dos produtos.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                                            <h3 className="text-emerald-400 font-bold mb-1">Lei de Lavoisier</h3>
                                            <p className="text-sm text-zinc-300">"Na natureza, nada se cria, nada se perde, tudo se transforma." (Conservação das Massas)</p>
                                        </div>
                                        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                                            <h3 className="text-emerald-400 font-bold mb-1">Lei de Proust</h3>
                                            <p className="text-sm text-zinc-300">Proporções Definidas. A água é sempre 11% H e 89% O, seja aqui ou em Marte.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* The Mole */}
                                <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-6 rounded-2xl border border-blue-500/20 flex flex-col items-center text-center">
                                    <h2 className="text-3xl font-black text-white mb-2">O MOL</h2>
                                    <div className="text-4xl font-mono text-blue-400 font-bold mb-4">6,02 × 10²³ unidades</div>
                                    <p className="text-zinc-300 max-w-lg">
                                        Átomos são pequenos demais para contar um a um. O mol é a "dúzia" do químico. <br />
                                        <span className="text-sm text-zinc-500 mt-2 block">1 Mol de qualquer gás nas CNTP ocupa <strong>22,4 Litros</strong>.</span>
                                    </p>
                                </div>

                                {/* Algorithm */}
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. O Algoritmo da Estequiometria</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                            <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">1</div>
                                            <div>
                                                <strong className="block text-white">Escreva a Equação</strong>
                                                <span className="text-zinc-400 text-sm">Quem reage com quem? O que produz?</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                            <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">2</div>
                                            <div>
                                                <strong className="block text-white">Balanceie (Obrigatório)</strong>
                                                <span className="text-zinc-400 text-sm">Use a regra do MACHO (Metal, Ametal, C, H, O). Garanta que os átomos sejam iguais nos dois lados.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                            <div className="bg-emerald-500 text-black font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">3</div>
                                            <div>
                                                <strong className="block text-white">Regra de Três</strong>
                                                <span className="text-zinc-400 text-sm">Linha 1: Dados da equação (Mols, MM, 22.4L).<br />Linha 2: Dados do problema (X).</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Airbag</h2>
                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="text-5xl">💥</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2">Salva-vidas em milissegundos</h3>
                                                <p className="text-zinc-400 text-sm mb-3">
                                                    Azida de Sódio (NaN₃) decompõe numa colisão para inflar a bolsa com Nitrogênio (N₂).
                                                </p>
                                                <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-blue-300 inline-block mb-3">
                                                    2 NaN₃(s) → 2 Na(s) + 3 N₂(g)
                                                </div>
                                                <p className="text-zinc-500 text-xs">
                                                    <strong>Erro de cálculo?</strong> Pouca massa = bolsa murcha (bate a cabeça). Muita massa = bolsa dura ou explosão. A estequiometria precisa ser exata.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_solucoes',
                title: 'Módulo 6: Soluções',
                description: 'Concentração, Molaridade, Diluição e Misturas.',
                locked: false,
                duration: '4h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_solucoes_intro',
                        title: 'Concentração e Diluição',
                        duration: '1h 20m',
                        status: 'Locked',
                        content: (
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
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">0.9g NaCl / 100mL</span>
                                            <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300">Equilíbrio Osmótico</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_termoquimica',
                title: 'Módulo 7: Termoquímica',
                description: 'Entalpia, Reações Exotérmicas/Endotérmicas e Lei de Hess.',
                locked: false,
                duration: '4h 30m',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_termoquimica_intro',
                        title: 'Entalpia e Leis de Hess',
                        duration: '1h 45m',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_cinetica_equilibrio',
                title: 'Módulo 8: Cinética e Equilíbrio',
                description: 'Velocidade das reações, catalisadores, KC e Le Chatelier.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_cinetica_equilibrio',
                        title: 'Cinética e Equilíbrio Químico',
                        duration: '1h 40m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Termodinâmica diz "se" acontece. <strong className="text-white">Cinética</strong> diz "quando". O diamante deveria virar grafite, mas leva milhões de anos (cinética lenta).
                                    </p>
                                    <p className="text-zinc-400 leading-relaxed mt-2">
                                        Já o <strong className="text-white">Equilíbrio Químico</strong> (V₁ = V₂) é a dança dinâmica onde reagentes e produtos coexistem. É vital para a indústria saber manipular esse limite.
                                    </p>
                                </div>

                                {/* Kinetics Factors */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">2. Cinética: Acelerando Reações</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                                            <div className="text-2xl mb-2">🔥</div>
                                            <strong className="block text-white mb-1">Temperatura</strong>
                                            <span className="text-xs text-zinc-400">Mais energia = colisions mais fortes. Fator mais poderoso.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                                            <div className="text-2xl mb-2">🪨</div>
                                            <strong className="block text-white mb-1">Superfície</strong>
                                            <span className="text-xs text-zinc-400">Pó reage mais rápido que barra. Mais área de contato.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                            <div className="text-2xl mb-2">🧪</div>
                                            <strong className="block text-white mb-1">Concentração</strong>
                                            <span className="text-xs text-zinc-400">Mais moléculas no mesmo espaço = mais choques.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <div className="text-2xl mb-2">⚡</div>
                                            <strong className="block text-white mb-1">Catalisador</strong>
                                            <span className="text-xs text-zinc-400">O Hacker. Cria atalho com menor Energia de Ativação. Não é consumido.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Equilibrium & Le Chatelier */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-6">
                                    <h2 className="text-xl font-bold text-white mb-2">3. Equilíbrio e Le Chatelier</h2>
                                    <p className="text-zinc-400 text-sm">
                                        "Se você perturba um sistema em equilíbrio, ele reage para neutralizar a perturbação."
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <strong className="text-blue-300 block border-b border-blue-500/20 pb-1">Pressão</strong>
                                            <p className="text-xs text-zinc-400">
                                                Aumentar P desloca para o lado de <strong>menor volume</strong> (menos gás).
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <strong className="text-red-300 block border-b border-red-500/20 pb-1">Temperatura</strong>
                                            <p className="text-xs text-zinc-400">
                                                Aumentar T favorece o sentido <strong>Endotérmico</strong> (absorve calor).
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <strong className="text-green-300 block border-b border-green-500/20 pb-1">Concentração</strong>
                                            <p className="text-xs text-zinc-400">
                                                Adicionar reagente desloca para os produtos (foge do excesso).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <strong className="text-white block">Constante Kc</strong>
                                            <span className="text-zinc-500 text-xs">[Produtos] / [Reagentes]. Só muda com a Temperatura.</span>
                                        </div>
                                        <div className="text-2xl font-mono text-emerald-500 font-bold">Kc &gt; 1 = Rende Bem</div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">4. Estudo de Caso: Haber-Bosch</h2>
                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Amônia (NH₃) e a Fome Mundial</h3>
                                        <p className="text-zinc-400 text-sm mb-4">
                                            Como produzir fertilizantes a partir do ar?
                                            <br /><code className="text-blue-300">N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (Exo)</code>
                                        </p>
                                        <ul className="space-y-2 text-sm text-zinc-300">
                                            <li><strong className="text-white">Pressão:</strong> Altíssima (200 atm) para forçar o lado de menor volume (2 mols vs 4 mols).</li>
                                            <li><strong className="text-white">Temperatura:</strong> Moderada (450°C). Baixa seria melhor pro equilíbrio (Exo), mas muito lenta (Cinética).</li>
                                            <li><strong className="text-white">Catalisador:</strong> Ferro, para compensar a velocidade.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_eletroquimica',
                title: 'Módulo 9: Eletroquímica',
                description: 'Pilhas, Eletrólise, Oxirredução e leis de Faraday.',
                locked: false,
                duration: '4h 30m',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_eletroquimica_pilhas',
                        title: 'Pilhas e Eletrólise',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A ponte entre Química e Eletricidade. Tudo é REDOX (quem perde e quem ganha elétrons).
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20">
                                            <strong className="text-emerald-400 block uppercase tracking-wider text-xs mb-1">Pilhas (Galvânicas)</strong>
                                            <span className="text-white block font-bold mb-1">Espontâneo (ΔE &gt; 0)</span>
                                            <span className="text-zinc-400 text-sm">Química gera Eletricidade. Bateria descarregando.</span>
                                        </div>
                                        <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                                            <strong className="text-blue-400 block uppercase tracking-wider text-xs mb-1">Eletrólise</strong>
                                            <span className="text-white block font-bold mb-1">Não Espontâneo</span>
                                            <span className="text-zinc-400 text-sm">Eletricidade força Química. Carregar bateria / Produzir Alumínio.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Concepts */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-emerald-400">2. O Mantra (CRAO)</h2>
                                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🐷</div>
                                            <strong className="text-red-400 block text-lg">ÂNODO</strong>
                                            <span className="text-zinc-300 text-sm">Oxida (Perde)</span><br />
                                            <span className="text-zinc-500 text-xs">Massa diminui (Corrói)</span>
                                        </div>
                                        <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🔋</div>
                                            <strong className="text-blue-400 block text-lg">CÁTODO</strong>
                                            <span className="text-zinc-300 text-sm">Reduz (Ganha)</span><br />
                                            <span className="text-zinc-500 text-xs">Massa aumenta (Deposita)</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-zinc-500 text-xs italic">
                                        "Cátodo Reduz, Ânodo Oxida" (Consoante com Consoante, Vogal com Vogal)
                                    </p>
                                </div>

                                {/* Daniell Cell */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">3. A Pilha de Daniell</h2>
                                    <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full bg-zinc-400/20 flex items-center justify-center font-bold text-zinc-200 mb-2 border-2 border-zinc-500">Zn</div>
                                                <strong className="text-red-400 block">Ânodo (-)</strong>
                                                <span className="text-zinc-500 text-xs">Mais reativo. Joga elétron fora.</span>
                                            </div>
                                            <div className="flex-1 text-center px-4">
                                                <div className="text-xs text-zinc-500 mb-1">Elétrons →</div>
                                                <div className="h-1 bg-gradient-to-r from-red-500/50 to-blue-500/50 rounded-full w-full"></div>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-16 h-16 rounded-full bg-orange-400/20 flex items-center justify-center font-bold text-orange-200 mb-2 border-2 border-orange-500">Cu</div>
                                                <strong className="text-blue-400 block">Cátodo (+)</strong>
                                                <span className="text-zinc-500 text-xs">Recebe elétron. Engorda.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/10 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 text-6xl opacity-10">🚢</div>
                                    <h3 className="text-lg font-bold text-white mb-4">Estudo de Caso: O Sacrifício do Magnésio</h3>
                                    <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                                        Por que navios têm blocos de Magnésio no casco?
                                        Para evitar que o Ferro do navio enferruje (oxide). O Magnésio é mais reativo (maior potencial de oxidação) e "se oferece" para oxidar no lugar do Ferro.
                                    </p>
                                    <div className="inline-block bg-black/30 px-3 py-1 rounded-full text-xs text-yellow-300 border border-yellow-500/30">
                                        Proteção Catódica
                                    </div>
                                </div>

                                {/* Connections */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <strong className="text-white block mb-1">🌍 Geopolítica</strong>
                                        Alumínio é "eletricidade sólida". Sua eletrólise é tão cara que o Brasil (hidrelétricas + bauxita) virou potência. Antes era jóia de reis.
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <strong className="text-white block mb-1">❤️ Biomedicina</strong>
                                        Marca-passos usam baterias de Lítio-Iodo de ultra-longa duração e estabilidade para não vazarem no peito.
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_organica_intro',
                title: 'Módulo 10: Química Orgânica I',
                description: 'Introdução, Cadeias Carbônicas e Hibridização.',
                locked: false,
                duration: '4h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_organica_intro',
                        title: 'Introdução à Orgânica',
                        duration: '1h 20m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A <strong className="text-white">Química Orgânica</strong> é a arquitetura da vida. O Carbono é singular por sua capacidade "promíscua" de formar cadeias longas e complexas (DNA, proteínas, plásticos).
                                        <br /><span className="text-xs text-zinc-500">História: Wöhler derrubou a "Força Vital" ao criar Ureia em laboratório. A vida é química, não mágica.</span>
                                    </p>
                                </div>

                                {/* Kekulé & Hybridization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kekulé Rules */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span className="text-xl">📏</span> Postulados de Kekulé
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">4</div>
                                                <span className="text-zinc-300 text-sm">Carbono é <strong className="text-white">Tetravalente</strong>. Sempre 4 ligações.</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">C</div>
                                                <span className="text-zinc-300 text-sm">Forma <strong className="text-white">Cadeias</strong> (esqueletos).</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Hybridization */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
                                        <h3 className="text-lg font-bold text-white mb-2">Hibridização</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-emerald-400 font-mono font-bold">sp³</span>
                                                <span className="text-zinc-400">4 Simples (σ)</span>
                                                <span className="text-zinc-500 text-xs">Tetraédrica (109°)</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-blue-400 font-mono font-bold">sp²</span>
                                                <span className="text-zinc-400">1 Dupla (π)</span>
                                                <span className="text-zinc-500 text-xs">Trigonal (120°)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-purple-400 font-mono font-bold">sp</span>
                                                <span className="text-zinc-400">2 Duplas ou 1 Tripla</span>
                                                <span className="text-zinc-500 text-xs">Linear (180°)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chains Classification */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">3. Classificação das Cadeias</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <div className="text-white font-bold mb-1">Aberta vs Fechada</div>
                                            <div className="text-xs text-zinc-500">Pontas soltas ou Anel?</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <div className="text-white font-bold mb-1">Saturada vs Insaturada</div>
                                            <div className="text-xs text-zinc-500">Só simples ou tem Dupla?</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <div className="text-white font-bold mb-1">Homogênea vs Heterogênea</div>
                                            <div className="text-xs text-zinc-500">Tem intruso (O, N) no meio?</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <div className="text-purple-400 font-bold mb-1">Aromática</div>
                                            <div className="text-xs text-zinc-500">Anel Benzeno (Ressonância)</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Graphene */}
                                <div className="rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">Estudo de Caso: Grafeno</h3>
                                            <p className="text-zinc-400 text-sm max-w-lg mb-4">
                                                Carbono puro pode ser Diamante (sp³ rígido) ou Grafite (sp² folhas).
                                                O <strong className="text-emerald-400">Grafeno</strong> é uma única folha de grafite. Material mais forte e condutor do mundo. Futuro dos processadores e telas.
                                            </p>
                                        </div>
                                        <div className="text-4xl animate-pulse">💠</div>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-white/10 rounded text-zinc-300">Nanotecnologia</span>
                                        <span className="px-2 py-1 bg-white/10 rounded text-zinc-300">Alótropos</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_organica_funcoes',
                title: 'Módulo 11: Química Orgânica II',
                description: 'Funções Orgânicas e Isomeria.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_organica_funcoes',
                        title: 'Funções e Isomeria',
                        duration: '1h 50m',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_organica_reacoes',
                title: 'Módulo 12: Reações Orgânicas e Polímeros',
                description: 'Reações de Substituição, Adição, Eliminação, Oxidação e Polímeros.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_organica_reacoes',
                        title: 'Reações e Polímeros',
                        duration: '2h 10m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        As <strong className="text-white">Reações Orgânicas</strong> são a alquimia moderna. É transformar petróleo em plástico, ou casca de árvore em aspirina. O segredo é quebrar ligações e formar novas.
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl flex-1 border border-white/5">
                                            <strong className="text-red-400 block mb-1">Cisão Homolítica</strong>
                                            <span className="text-xs text-zinc-500">Quebra igual. Gera <strong className="text-white">Radicais Livres</strong>. Instável e violento.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl flex-1 border border-white/5">
                                            <strong className="text-blue-400 block mb-1">Cisão Heterolítica</strong>
                                            <span className="text-xs text-zinc-500">Quebra desigual. Gera <strong className="text-white">Íons</strong>. Padrão das reações polares.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reaction Types Rules */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-emerald-400">2. As Regras do Jogo</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Markovnikov */}
                                        <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-emerald-500">+</div>
                                            <h3 className="text-lg font-bold text-white mb-2">Adição (Markovnikov)</h3>
                                            <p className="text-sm text-emerald-400 font-bold mb-2">"O Rico fica mais Rico"</p>
                                            <p className="text-xs text-zinc-400">
                                                O Hidrogênio entra no carbono da dupla que já tem <strong>mais</strong> hidrogênios.
                                            </p>
                                        </div>

                                        {/* Saytzeff */}
                                        <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-red-500">-</div>
                                            <h3 className="text-lg font-bold text-white mb-2">Eliminação (Saytzeff)</h3>
                                            <p className="text-sm text-red-400 font-bold mb-2">O Inverso</p>
                                            <p className="text-xs text-zinc-400">
                                                O Hidrogênio sai do carbono vizinho que tem <strong>menos</strong> hidrogênio.
                                            </p>
                                        </div>

                                        {/* Oxidação */}
                                        <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 md:col-span-2">
                                            <h3 className="text-lg font-bold text-white mb-2">Oxidação de Álcoois (O Bafômetro)</h3>
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                <div className="bg-white/5 p-2 rounded">
                                                    <strong className="block text-emerald-400">Primário</strong>
                                                    Aldeído → Ácido
                                                </div>
                                                <div className="bg-white/5 p-2 rounded">
                                                    <strong className="block text-yellow-400">Secundário</strong>
                                                    Vira Cetona
                                                </div>
                                                <div className="bg-white/5 p-2 rounded">
                                                    <strong className="block text-red-400">Terciário</strong>
                                                    NÃO REAGE
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Esterification & Polymers */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-emerald-400">3. Polímeros e Ésteres</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-pink-500">
                                            <strong className="text-pink-400 block mb-1">Esterificação</strong>
                                            <span className="text-xs text-zinc-400">Ácido + Álcool = Éster + Água. (Aromas).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-orange-500">
                                            <strong className="text-orange-400 block mb-1">Saponificação</strong>
                                            <span className="text-xs text-zinc-400">Gordura + Base = Sabão + Glicerina.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-purple-500">
                                            <strong className="text-purple-400 block mb-1">Polímeros</strong>
                                            <span className="text-xs text-zinc-400">Adição (Plásticos) vs Condensação (Nylon/PET).</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-4xl">🌱</div>
                                        <div>
                                            <h2 className="text-xl font-bold text-green-400">Estudo de Caso: Biodiesel</h2>
                                            <p className="text-xs text-green-300">Economia Verde</p>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                        Reação de <strong>Transesterificação</strong>. Pegamos óleo de soja (Triglicerídeo) e reagimos com Álcool.
                                        <br />Resultado: Biodiesel (Ésteres Metílicos) + Glicerina.
                                        <br />Menos poluente (sem enxofre) e renovável.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            }
        ]
    },

    // --- Placeholders for other courses to ensure the grid works ---
    {
        id: 'math',
        title: 'Matemática',
        description: 'Fundamentos, álgebra, geometria e cálculo avançado.',
        category: 'EXATAS',
        duration: '120h',
        progress: 0,
        icon: Calculator,
        color: 'bg-indigo-600',
        tags: ['exatas'],
        modules: [
            {
                id: 'm_sets_functions',
                title: 'Módulo 1: Conjuntos e Funções',
                description: 'Conjuntos Numéricos, Definição de Função e Classificações.',
                locked: false,
                duration: '4h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_sets_functions_intro',
                        title: 'Conjuntos e Teoria das Funções',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Matemática é uma linguagem. <strong className="text-white">Conjuntos</strong> são as palavras, <strong className="text-white">Funções</strong> são as frases.
                                        Uma função é uma relação onde cada elemento de partida (Domínio) se conecta a <strong>um e somente um</strong> elemento de chegada. Isso é a base do determinismo científico.
                                    </p>
                                </div>

                                {/* Numeric Sets */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-indigo-400">2. Conjuntos Numéricos (A Matrioska)</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-sm">
                                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                                            <strong className="text-white text-lg block">N</strong>
                                            <span className="text-zinc-500 text-xs">Naturais ( Contagem )</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                                            <strong className="text-white text-lg block">Z</strong>
                                            <span className="text-zinc-500 text-xs">Inteiros ( + Negativos )</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                                            <strong className="text-white text-lg block">Q</strong>
                                            <span className="text-zinc-500 text-xs">Racionais ( Frações )</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                                            <strong className="text-white text-lg block">I</strong>
                                            <span className="text-zinc-500 text-xs">Irracionais ( π, √2 )</span>
                                        </div>
                                        <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/30 col-span-2 md:col-span-1">
                                            <strong className="text-indigo-400 text-lg block">R</strong>
                                            <span className="text-zinc-400 text-xs">Reais ( Tudo )</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Function Classifications */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-6">
                                    <h2 className="text-xl font-bold text-white mb-2">Classificação das Funções</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <strong className="text-indigo-300 block border-b border-indigo-500/20 pb-1">Injetora</strong>
                                            <p className="text-xs text-zinc-400">
                                                "Cada um no seu quadrado".<br />x diferentes geram y diferentes.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <strong className="text-purple-300 block border-b border-purple-500/20 pb-1">Sobrejetora</strong>
                                            <p className="text-xs text-zinc-400">
                                                "Não sobra ninguém".<br />Imagem = Contradomínio.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <strong className="text-emerald-300 block border-b border-emerald-500/20 pb-1">Bijetora</strong>
                                            <p className="text-xs text-zinc-400">
                                                Os dois ao mesmo tempo.<br /><strong className="text-emerald-400">Admite Inversa.</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/10 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">Estudo de Caso: Criptografia</h3>
                                        <span className="text-2xl">🔒</span>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                        Como o WhatsApp protege suas mensagens? Usando <strong>Funções Inversas</strong>.
                                        <br />A mensagem "OLÁ" vira "XK9#m2" através de uma função $f(x)$ (Bijetora).
                                        Só quem tem a inversa $f^{-1}(y)$ consegue desfazer e ler.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_functions_types',
                title: 'Módulo 2: Função Afim e Quadrática',
                description: 'Funções de 1º e 2º Grau, Gráficos e Vértices.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_affine_quadratic',
                        title: 'Função Afim e Quadrática',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. Ferramentas de Modelagem</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Quase tudo na natureza é uma Reta (constante) ou uma Parábola (acelerado/área).
                                        <br />• <strong className="text-white">Afim (1º Grau):</strong> Juros simples, velocidade constante.
                                        <br />• <strong className="text-white">Quadrática (2º Grau):</strong> Gravidade, projéteis, lucro máximo.
                                    </p>
                                </div>

                                {/* Affine vs Quadratic Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Affine */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-2xl">📈</span> Função Afim
                                        </h3>
                                        <div className="font-mono text-indigo-400 text-xl font-bold mb-4 text-center bg-black/20 p-2 rounded">
                                            f(x) = ax + b
                                        </div>
                                        <ul className="space-y-2 text-sm text-zinc-400">
                                            <li><strong className="text-white">a (Angular):</strong> Inclinação. Taxa de variação.</li>
                                            <li><strong className="text-white">b (Linear):</strong> Onde corta Y (Início).</li>
                                            <li><strong className="text-white">Gráfico:</strong> Reta.</li>
                                        </ul>
                                    </div>

                                    {/* Quadratic */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-2xl">∪</span> Função Quadrática
                                        </h3>
                                        <div className="font-mono text-purple-400 text-xl font-bold mb-4 text-center bg-black/20 p-2 rounded">
                                            f(x) = ax² + bx + c
                                        </div>
                                        <ul className="space-y-2 text-sm text-zinc-400">
                                            <li><strong className="text-white">a (Concavidade):</strong> Sorriso ($&gt;0$) ou Triste ($&lt;0$).</li>
                                            <li><strong className="text-white">Vértice:</strong> Ponto Máximo ou Mínimo.</li>
                                            <li><strong className="text-white">Gráfico:</strong> Parábola.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Vertex Trick */}
                                <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20">
                                    <h2 className="text-xl font-bold text-indigo-400 mb-2">O Pulo do Gato: Vértice</h2>
                                    <p className="text-zinc-400 text-sm mb-4">
                                        No ENEM, se pedir "Máximo" ou "Mínimo", calcule o Vértice.
                                    </p>
                                    <div className="flex justify-center gap-8 text-center font-mono">
                                        <div>
                                            <div className="text-xs text-zinc-500 mb-1">X do Vértice (Quando?)</div>
                                            <div className="text-xl text-white font-bold bg-black/30 px-3 py-1 rounded">-b / 2a</div>
                                        </div>
                                        <div className="w-px bg-white/10"></div>
                                        <div>
                                            <div className="text-xs text-zinc-500 mb-1">Y do Vértice (Quanto?)</div>
                                            <div className="text-xl text-white font-bold bg-black/30 px-3 py-1 rounded">-Δ / 4a</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-indigo-400">4. Estudo de Caso: Maximizando Lucro</h2>
                                    <div className="bg-zinc-800/50 p-4 rounded-xl border-l-4 border-green-500">
                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            Fábrica: Cobra 10, vende 100. Aumenta 1 real, vende 5 a menos.
                                            <br />Isso gera uma parábola com a concavidade para baixo (a = -5).
                                            <br />Para achar o lucro máximo, calculamos o <strong className="text-green-400">X do Vértice</strong>. O aumento ideal é R$ 5,00.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_exp_log',
                title: 'Módulo 3: Exponencial e Logaritmos',
                description: 'Crescimento, Logaritmos, Propriedades e Aplicações.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_exp_log_intro',
                        title: 'Exponencial e Logaritmos',
                        duration: '2h 10m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. Introdução e Definição</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Muitos temem o <strong className="text-white">Logaritmo</strong>, mas ele é apenas o expoente.
                                        Estudar exponenciais (crescimento rápido) e logaritmos (escala) é estudar a mesma moeda. São funções inversas.
                                    </p>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Exponential */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity text-6xl">🚀</div>
                                        <h3 className="text-lg font-bold text-white mb-2">Exponencial</h3>
                                        <div className="text-3xl font-mono font-bold text-indigo-400 mb-2">f(x) = a˟</div>
                                        <p className="text-zinc-400 text-sm">
                                            A variável no expoente. Crescimento explosivo (Curva J).
                                            <br /><span className="text-xs text-zinc-500">Ex: Bactérias, Juros Compostos.</span>
                                        </p>
                                    </div>

                                    {/* Logarithm */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity text-6xl">📏</div>
                                        <h3 className="text-lg font-bold text-white mb-2">Logaritmo</h3>
                                        <div className="text-3xl font-mono font-bold text-purple-400 mb-2">logₐb = x</div>
                                        <p className="text-zinc-400 text-sm">
                                            A pergunta inversa: "a elevado a quanto dá b?".
                                            <br /><span className="text-xs text-zinc-500">Ex: Escala Richter, pH.</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Log Properties */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-indigo-400">2. Propriedades Sagradas (Ferramentas)</h2>
                                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 grid gap-4">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <span className="text-zinc-300 text-sm">Produto vira Soma</span>
                                            <span className="font-mono text-indigo-300 font-bold">log(A.B) = log A + log B</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <span className="text-zinc-300 text-sm">Divisão vira Subtração</span>
                                            <span className="font-mono text-indigo-300 font-bold">log(A/B) = log A - log B</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-300 text-sm">Potência Tomba</span>
                                            <span className="font-mono text-emerald-400 font-bold">log(Aⁿ) = n . log A</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20">
                                    <h2 className="text-xl font-bold text-indigo-300 mb-2">Estudo de Caso: Carbono-14</h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Como sabemos a idade de um fóssil? Pelo decaimento radioativo (Exponencial).
                                        Para descobrir o tempo ($t$) que está no expoente, usamos o <strong className="text-white">Logaritmo</strong>.
                                        Sem ele, a arqueologia seria impossível.
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-black/20 rounded text-indigo-200">Meia-vida</span>
                                        <span className="px-2 py-1 bg-black/20 rounded text-indigo-200">Arqueologia</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_sequences',
                title: 'Módulo 4: Sequências e Financeira',
                description: 'PA, PG, Juros Simples e Compostos.',
                locked: false,
                duration: '4h 30m',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_sequences_finance',
                        title: 'Sequências e Juros',
                        duration: '1h 50m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. O Poder dos Padrões</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Sequências são listas que seguem uma regra.
                                        <br />• <strong className="text-white">PA (Aritmética):</strong> Soma constante. (Linear).
                                        <br />• <strong className="text-white">PG (Geométrica):</strong> Multiplicação constante. (Exponencial).
                                        <br />Isso é a base do dinheiro (Juros Simples vs Compostos).
                                    </p>
                                </div>

                                {/* PA vs PG Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 border-l-4 border-blue-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Progressão Aritmética (PA)</h3>
                                        <p className="text-xs text-zinc-500 mb-3">Escada (Soma r)</p>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div className="flex justify-between"><span className="text-zinc-400">Geral:</span> <span className="text-blue-400">aₙ = a₁ + (n-1)r</span></div>
                                            <div className="flex justify-between"><span className="text-zinc-400">Soma:</span> <span className="text-blue-400">(a₁ + aₙ)n / 2</span></div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 border-l-4 border-orange-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Progressão Geométrica (PG)</h3>
                                        <p className="text-xs text-zinc-500 mb-3">Multiplicativa (Vezes q)</p>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div className="flex justify-between"><span className="text-zinc-400">Geral:</span> <span className="text-orange-400">aₙ = a₁ . qⁿ⁻¹</span></div>
                                            <div className="flex justify-between"><span className="text-zinc-400">Soma Inf:</span> <span className="text-orange-400">a₁ / (1-q)</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Linear vs Compound Interest */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-indigo-400">2. Matemática Financeira</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <strong className="text-blue-300 block mb-1">Juros Simples (PA)</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Juro incide só no capital inicial. Crescimento linear.</p>
                                            <div className="text-center font-mono text-indigo-400 font-bold bg-black/20 rounded p-1">J = C.i.t</div>
                                        </div>
                                        <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5">
                                            <strong className="text-orange-300 block mb-1">Juros Compostos (PG)</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Juro sobre juro. Crescimento Exponencial. Regra do mercado.</p>
                                            <div className="text-center font-mono text-indigo-400 font-bold bg-black/20 rounded p-1">M = C(1+i)ᵗ</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <h2 className="text-xl font-bold text-red-400 mb-2">Alerta: Cartão de Crédito</h2>
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        Por que as dívidas explodem? Porque são calculadas em <strong className="text-white">Juros Compostos (PG)</strong>.
                                        Uma dívida de 1.000 a 10% a.m. não vira 2.200 em um ano (Simples), vira mais de 3.100.
                                        O tempo joga contra quem deve e a favor de quem investe.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_trig_circle',
                title: 'Módulo 5: Trigonometria - O Ciclo',
                description: 'Ciclo Trigonométrico, Funções Seno e Cosseno.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_trig_circle',
                        title: 'O Ciclo Trigonométrico',
                        duration: '2h 15m',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_trig_triangle',
                title: 'Módulo 6: Trigonometria - Triângulos',
                description: 'Leis dos Senos e Cossenos, Razões Trigonométricas.',
                locked: false,
                duration: '5h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_trig_triangle',
                        title: 'Triângulos Quaisquer',
                        duration: '2h',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_combinatoria',
                title: 'Módulo 7: Análise Combinatória',
                description: 'Arranjos, Combinações e Permutações.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_combinatoria_intro',
                        title: 'Princípios de Contagem',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. Introdução: A Arte de Contar</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Se perguntarem "quantas senhas de 4 dígitos existem?", você não escreve todas. Você usa a <strong className="text-white">Combinatória</strong>.
                                        O grande divisor de águas é: <strong className="text-white">A ORDEM IMPORTA?</strong>
                                        <br />Se sim (Senha 123 ≠ 321), é Arranjo/Permutação.
                                        <br />Se não (Salada Maçã+Banana = Banana+Maçã), é Combinação.
                                    </p>
                                </div>

                                {/* Methods Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Permutation */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-emerald-500">
                                        <strong className="text-emerald-400 block mb-1">Permutação (Pn)</strong>
                                        <p className="text-xs text-zinc-400 mb-2">Usa <strong className="text-white">TODOS</strong>. Troca lugar.</p>
                                        <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                                            {'Pn = n!'}
                                        </div>
                                        <p className="text-[10px] text-zinc-500 mt-2">Ex: Anagramas (AMOR).</p>
                                    </div>

                                    {/* Arrangement */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                                        <strong className="text-blue-400 block mb-1">Arranjo (An,p)</strong>
                                        <p className="text-xs text-zinc-400 mb-2">Escolhe ALGUNS. <strong className="text-white">Ordem IMPORTA</strong>.</p>
                                        <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                                            {'An,p = n! / (n-p)!'}
                                        </div>
                                        <p className="text-[10px] text-zinc-500 mt-2">Ex: Pódio (Ouro/Prata).</p>
                                    </div>

                                    {/* Combination */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                                        <strong className="text-purple-400 block mb-1">Combinação (Cn,p)</strong>
                                        <p className="text-xs text-zinc-400 mb-2">Escolhe ALGUNS. <strong className="text-white">NÃO Importa</strong>.</p>
                                        <div className="font-mono text-center text-white text-xs bg-black/20 p-1 rounded">
                                            {'Cn,p = n! / p!(n-p)!'}
                                        </div>
                                        <p className="text-[10px] text-zinc-500 mt-2">Ex: Equipes, Mega-Sena.</p>
                                    </div>
                                </div>

                                {/* Factorial Info */}
                                <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                    <div className="text-2xl">❗</div>
                                    <div>
                                        <strong className="text-white block">Fatorial (n!)</strong>
                                        <p className="text-xs text-zinc-400">
                                            Multiplica descendo até 1. O crescimento é explosivo.
                                            <br />5! = 120. 10! = 3.6 milhões.
                                        </p>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🤑</span>
                                        <h2 className="text-xl font-bold text-green-400">Estudo de Caso: Mega-Sena</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Por que é difícil ganhar? É uma <strong className="text-white">Combinação</strong> de 60 números, escolhendo 6.
                                        A ordem do sorteio não importa.
                                        <br />Resultado: {'50.063.860'} possibilidades.
                                        <br />Sua chance: 1 em 50 milhões. (Mais fácil cair um raio: 1 em 1 milhão).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_probabilidade',
                title: 'Módulo 8: Probabilidade',
                description: 'Definição, Eventos, União e Bayes.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_probabilidade_intro',
                        title: 'Teoria das Probabilidades',
                        duration: '2h 10m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. A Matemática da Incerteza</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Probabilidade calcula a chance de algo acontecer. Nascida dos jogos de azar (Pascal & Fermat), hoje domina a economia e a física quântica.
                                    </p>
                                    <div className="bg-zinc-800 p-4 rounded mt-4 text-center font-mono text-white">
                                        {'P(A) = Favoráveis / Totais'}
                                    </div>
                                </div>

                                {/* Venn Diagram Logic */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Union (OR) */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-indigo-500">∪</div>
                                        <h3 className="text-lg font-bold text-white mb-2">União (OU)</h3>
                                        <p className="text-xs text-zinc-400 mb-3">Soma as chances. Cuidado para não contar a interseção 2x.</p>
                                        <div className="font-mono text-indigo-400 text-sm bg-black/20 p-2 rounded break-all">
                                            {'P(AUB) = P(A) + P(B) - P(A∩B)'}
                                        </div>
                                    </div>

                                    {/* Intersection (AND) */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-bold text-pink-500">∩</div>
                                        <h3 className="text-lg font-bold text-white mb-2">Interseção (E)</h3>
                                        <p className="text-xs text-zinc-400 mb-3">Multiplica. Acontecer um E o outro.</p>
                                        <div className="font-mono text-pink-400 text-sm bg-black/20 p-2 rounded break-all">
                                            {'P(A∩B) = P(A) . P(B)'}
                                            <span className="text-[10px] text-zinc-500 block text-center mt-1">(Se independentes)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Probability */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 border-l-4 border-yellow-500">
                                    <h3 className="text-xl font-bold text-white mb-2">Probabilidade Condicional</h3>
                                    <p className="text-sm text-zinc-400 mb-4">
                                        "Qual a chance de A, <strong className="text-white">dado que B aconteceu?</strong>"
                                        <br />O evento B reduz o seu Espaço Amostral. O denominador muda.
                                    </p>
                                    <div className="flex justify-center">
                                        <div className="font-mono text-yellow-400 text-lg bg-black/30 px-4 py-2 rounded">
                                            {'P(A|B) = P(A∩B) / P(B)'}
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: False Positive */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <h2 className="text-xl font-bold text-red-400 mb-2">O Paradoxo do Falso Positivo</h2>
                                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                        Doença rara (1%). Teste 99% preciso. Deu Positivo. Você está doente?
                                        <br /><strong className="text-white">Provavelmente NÃO.</strong> (A chance é ~50%).
                                        <br />Por quê? Em 1000 pessoas, ha 10 doentes (quase todos positivos) e 990 saudáveis (onde 1% falha = 10 falsos positivos).
                                        <br />Total de positivos: 20. Você é um deles. Só 10 são reais.
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-red-500/10 rounded text-red-200">Bayes</span>
                                        <span className="px-2 py-1 bg-red-500/10 rounded text-red-200">Contra-intuitivo</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_geometria_plana',
                title: 'Módulo 9: Geometria Plana',
                description: 'Áreas, Polígonos e Semelhança.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_geo_plana_intro',
                        title: 'Áreas e Polígonos',
                        duration: '2h 15m',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_geometria_espacial',
                title: 'Módulo 10: Geometria Espacial',
                description: 'Prismas, Pirâmides, Cilindros e Esferas.',
                locked: false,
                duration: '7h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_geo_espacial_intro',
                        title: 'Sólidos e Volumes',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_geometria_analitica',
                title: 'Módulo 11: Geometria Analítica',
                description: 'Ponto, Reta e Circunferência.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_geo_analitica_intro',
                        title: 'O Casamento Álgebra + Geometria',
                        duration: '2h',
                        status: 'Locked',
                        content: (
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
                        )
                    }
                ]
            },
            {
                id: 'm_estatistica',
                title: 'Módulo 12: Estatística e Matrizes',
                description: 'Média, Mediana, Desvio Padrão e Sistemas Lineares.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_estatistica_intro',
                        title: 'A Ciência dos Dados',
                        duration: '2h 10m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. Ordem no Caos</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Vivemos na era do Big Data. A <strong className="text-white">Estatística</strong> resume milhões de dados em decisões.
                                        As <strong className="text-white">Matrizes</strong> são a linguagem como os computadores organizam esses dados.
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Estatística Descritiva</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">Média</strong>
                                            <p className="text-xs text-zinc-500">Soma / Total. Sensível a extremos.</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                                            <strong className="text-green-400 block mb-1">Mediana</strong>
                                            <p className="text-xs text-zinc-500">O valor do meio. A verdade social (salários).</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-red-500">
                                            <strong className="text-red-400 block mb-1">Desvio Padrão</strong>
                                            <p className="text-xs text-zinc-500">Confiabilidade. Dados espalhados = Alto DP.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Matrices & Systems */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🔢</span>
                                        <h3 className="text-xl font-bold text-white">Matrizes e Sistemas</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <strong className="text-indigo-300 block mb-1">Determinante (Det)</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Se {'Det ≠ 0'}, o sistema tem solução única (Retas cruzam).
                                                <br />Se {'Det = 0'}, é Impossível ou Indeterminado (Paralelas).
                                            </p>
                                        </div>
                                        <div>
                                            <strong className="text-purple-300 block mb-1">Aplicações Reais</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Computação Gráfica (Rotação 3D), Google PageRank, Redes Neurais.
                                                Tudo são multiplicações de matrizes.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-500/20">
                                    <h2 className="text-xl font-bold text-yellow-400 mb-2">A Falácia da Média (Bill Gates)</h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Um bar tem 10 desempregados (Renda R$ 0). Bill Gates entra.
                                        <br />Média de Renda: <strong className="text-white">Milionária</strong>.
                                        <br />Mediana: <strong className="text-white">R$ 0</strong> (Continua igual).
                                        <br />Lição: Em países desiguais, a Média mente. Olhe sempre para a Mediana.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            }
        ]
    },
    {
        id: 'physics',
        title: 'Física',
        description: 'Mecânica, termodinâmica, eletromagnetismo e física moderna.',
        category: 'EXATAS',
        duration: '90h',
        progress: 0,
        icon: Atom,
        color: 'bg-violet-600',
        tags: ['exatas'],
        modules: [
            {
                id: 'm_cinematica',
                title: 'Módulo 1: Cinemática',
                description: 'MRU, MRUV e Vetores.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_cinematica_intro',
                        title: 'O Estudo do Movimento',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. O Palco do Universo</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Cinemática é descrever o movimento "sem se preocupar com a causa".
                                        O maior erro dos alunos: confundir <strong className="text-white">Escalar</strong> (só número) com <strong className="text-white">Vetorial</strong> (direção/sentido).
                                        <br />Se você der uma volta ao mundo e voltar ao mesmo lugar: Distância = 40.000km. Deslocamento = 0.
                                    </p>
                                </div>

                                {/* Formulas Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* MRU */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                                        <div className="flex justify-between items-center mb-2">
                                            <strong className="text-blue-400">MRU (Vel. Constante)</strong>
                                            <span className="text-xs text-zinc-500">a = 0</span>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded text-center mb-1">
                                            <code className="text-white text-sm">{'S = S0 + v.t'}</code>
                                        </div>
                                        <p className="text-xs text-zinc-400 text-center">"Sorvete"</p>
                                    </div>

                                    {/* MRUV */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                                        <div className="flex justify-between items-center mb-2">
                                            <strong className="text-red-400">MRUV (Aceleração)</strong>
                                            <span className="text-xs text-zinc-500">a ≠ 0</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="bg-black/20 p-2 rounded text-center">
                                                <code className="text-white text-sm">{'V = V0 + a.t'}</code>
                                            </div>
                                            <div className="bg-black/20 p-2 rounded text-center">
                                                <code className="text-white text-sm">{'S = S0 + V0t + at²/2'}</code>
                                            </div>
                                            <div className="bg-black/20 p-2 rounded text-center border border-red-500/30">
                                                <code className="text-red-200 text-sm">{'V² = V0² + 2aΔS'}</code>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 text-center">Torricelli: "Sem tempo a perder"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vectors Section */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">🏹</span>
                                        <h3 className="text-xl font-bold text-white">Cinemática Vetorial (Balística)</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-4">
                                        Jogar uma pedra gera uma Parábola. Por quê? São 2 movimentos juntos:
                                        <br />• <strong className="text-blue-400">Eixo X (Horizontal)</strong>: MRU (inércia).
                                        <br />• <strong className="text-red-400">Eixo Y (Vertical)</strong>: MRUV (gravidade).
                                    </p>
                                    <div className="bg-black/30 p-3 rounded border border-white/10 text-center">
                                        <span className="text-violet-300 font-mono text-sm">{'Vox = V.cos(θ)  |  Voy = V.sen(θ)'}</span>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <h2 className="text-xl font-bold text-red-400 mb-2">Estudo de Caso: A Morte na Estrada</h2>
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        Por que correr é fatal? A distância de frenagem é <strong className="text-white">QUADRÁTICA</strong>.
                                        <br />{'ΔS = (V² - V0²) / 2a'}
                                        <br />Se você dobra a velocidade (50 → 100km/h), você precisa de <strong className="text-red-300">4x mais pista</strong> para parar.
                                        A intuição é linear, mas a física é exponencial.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_dinamica',
                title: 'Módulo 2: Dinâmica',
                description: 'Leis de Newton, Atrito e Elevadores.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_dinamica_intro',
                        title: 'As Leis do Universo',
                        duration: '2h 45m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Newton Explica Tudo</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Cinemática vê o movimento. Dinâmica explica a <strong className="text-white">CAUSA</strong> (Força).
                                        Newton (1687) disse: "O estado natural não é parado. É andar para sempre. A força serve para mudar isso."
                                    </p>
                                </div>

                                {/* 3 Laws Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-zinc-500">
                                        <strong className="text-white block mb-1">1ª Lei: Inércia</strong>
                                        <p className="text-xs text-zinc-500">Matéria é preguiçosa. Resiste a mudar de velocidade.</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-violet-500">
                                        <strong className="text-violet-400 block mb-1">2ª Lei: Princípio</strong>
                                        <div className="bg-black/20 p-1 rounded text-center my-2">
                                            <code className="text-white font-bold">{'Fr = m.a'}</code>
                                        </div>
                                        <p className="text-xs text-zinc-500">Força gera Aceleração.</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-pink-500">
                                        <strong className="text-pink-400 block mb-1">3ª Lei: Ação/Reação</strong>
                                        <p className="text-xs text-zinc-500">Pares nunca se anulam (corpos diferentes).</p>
                                    </div>
                                </div>

                                {/* Special Forces */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Forças Especiais</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">⚖️</span>
                                            <div>
                                                <strong className="block text-zinc-300">Peso vs Normal</strong>
                                                <span className="text-xs text-zinc-500">Peso é gravidade mg. Normal é contato (não é o peso!).</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🛑</span>
                                            <div>
                                                <strong className="block text-zinc-300">Atrito (Fat)</strong>
                                                <span className="text-xs text-zinc-500">{'Fat = μ . N'}. Estático (segura) {'>'} Cinético (desliza).</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-violet-900/10 p-6 rounded-2xl border border-violet-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🛗</span>
                                        <h2 className="text-xl font-bold text-violet-400">Estudo de Caso: O Elevador</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        A balança marca a <strong className="text-white">Normal</strong>, não seu peso.
                                        <br />• Subindo Acelerado: Você sente "pesado" ($N = P + ma$).
                                        <br />• Descendo Acelerado: Chão foge ($N = P - ma$).
                                        <br />• Cabo Cortado: Você flutua ($N=0$).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_energia',
                title: 'Módulo 3: Trabalho e Energia',
                description: 'Potência, Cinética, Potencial e Conservação.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_energia_intro',
                        title: 'A Moeda do Universo',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Energia e Trabalho</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Energia é a capacidade de realizar <strong className="text-white">Trabalho</strong>.
                                        Trabalho não é cansaço. É deslocar algo com força.
                                        <br />Se a parede não mexe, Trabalho = 0 (mesmo que você sue).
                                    </p>
                                </div>

                                {/* Concepts Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Work */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                                        <strong className="text-yellow-400 block mb-1">Trabalho (τ)</strong>
                                        <div className="bg-black/20 p-2 rounded text-center mb-1">
                                            <code className="text-white text-sm">{'τ = F . d . cos(θ)'}</code>
                                        </div>
                                        <p className="text-xs text-zinc-500">Se θ=90° (pendicular), não trabalha.</p>
                                    </div>

                                    {/* Power */}
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-orange-500">
                                        <div className="flex justify-between">
                                            <strong className="text-orange-400 block mb-1">Potência (W)</strong>
                                            <span className="text-xs text-zinc-500">Rapidez</span>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded text-center mb-1">
                                            <code className="text-white text-sm">{'Pot = Trabalho / Tempo'}</code>
                                        </div>
                                        <p className="text-xs text-zinc-500">Fusca vs Ferrari: Mesmo trabalho, tempos diferentes.</p>
                                    </div>
                                </div>

                                {/* Mechanical Energy Types */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Energia Mecânica (Soma)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                        <div className="p-3 bg-black/20 rounded-xl">
                                            <span className="text-2xl block mb-1">🏃</span>
                                            <strong className="text-blue-400 text-sm">Cinética</strong>
                                            <div className="mt-1 text-xs text-zinc-400">{'mV² / 2'}</div>
                                            <span className="text-[10px] text-red-400 block mt-1">Velocidade ²</span>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-xl">
                                            <span className="text-2xl block mb-1">🏔️</span>
                                            <strong className="text-emerald-400 text-sm">Pot. Gravitacional</strong>
                                            <div className="mt-1 text-xs text-zinc-400">{'m.g.h'}</div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">Depende da Altura</span>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-xl">
                                            <span className="text-2xl block mb-1">🌀</span>
                                            <strong className="text-purple-400 text-sm">Pot. Elástica</strong>
                                            <div className="mt-1 text-xs text-zinc-400">{'kx² / 2'}</div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">Molas</span>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-500/10 p-3 rounded text-center border border-indigo-500/30">
                                        <strong className="text-indigo-300 text-sm block mb-1">Conservação da Energia</strong>
                                        <code className="text-white text-xs">{'Em(antes) = Em(depois)'}</code>
                                        <p className="text-[10px] text-zinc-400 mt-1">(Sem atrito, a energia só se transforma)</p>
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🎢</span>
                                        <h2 className="text-xl font-bold text-blue-400">Estudo de Caso: O Looping</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Qual a altura mínima para não cair no loop?
                                        <br />Pela conservação da energia e força centrípeta:
                                        <br /><code className="text-white">{'h = 2,5 . R'}</code>
                                        <br />Tem que ser 2,5 vezes o raio. Menos que isso, a gravidade vence no topo.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_impulso',
                title: 'Módulo 4: Impulso e Colisões',
                description: 'Impulso, Quantidade de Movimento e segurança automotiva.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_impulso_intro',
                        title: 'Quantidade de Movimento',
                        duration: '2h 15m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. O Poder do Impacto</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Imagine um caminhão a 10 km/h e uma bicicleta a 10 km/h. O caminhão é mais difícil de parar.
                                        Agora, uma bala a 1000 km/h vs uma bola de gude. A bala causa mais estrago.
                                        <br />Essa união de Massa e Velocidade é a <strong className="text-white">Quantidade de Movimento (Q)</strong>.
                                    </p>
                                </div>

                                {/* Formulas Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Momentum */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-indigo-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Quantidade de Movimento (Q)</h3>
                                        <p className="text-xs text-zinc-500 mb-4">"Massa em movimento". Vetorial (tem direção).</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <code className="text-indigo-400 font-bold text-lg">{'Q = m . v'}</code>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 text-center mt-2">kg.m/s</p>
                                    </div>

                                    {/* Impulse */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-pink-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Impulso (I)</h3>
                                        <p className="text-xs text-zinc-500 mb-4">A "dose" de força no tempo.</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <code className="text-pink-400 font-bold text-lg">{'I = F . Δt'}</code>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 text-center mt-2">Área do gráfico Fxt</p>
                                    </div>
                                </div>

                                {/* Theorem */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Teorema do Impulso</h3>
                                    <p className="text-sm text-zinc-400 mb-4">
                                        Para mudar a velocidade (Q), você precisa gastar Impulso.
                                    </p>
                                    <div className="bg-black/30 px-6 py-3 rounded-xl border border-white/10">
                                        <code className="text-2xl text-yellow-400 font-bold">{'I = ΔQ'}</code>
                                        <div className="text-xs text-zinc-500 mt-1">Impulso = Qfinal - Qinicial</div>
                                    </div>
                                </div>

                                {/* Collisions */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Tipos de Colisão</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                                            <strong className="text-green-400 block mb-1">Elástica</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Bate e volta (Perfeita).</p>
                                            <div className="text-[10px] bg-black/20 p-1 rounded text-center text-white">
                                                Conserva Q e Energia
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">e = 1 (Bilhar)</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-yellow-500">
                                            <strong className="text-yellow-400 block mb-1">Parcial</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Bate e separa (Realidade).</p>
                                            <div className="text-[10px] bg-black/20 p-1 rounded text-center text-white">
                                                Conserva só Q
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">0 {'<'} e {'<'} 1</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-red-500">
                                            <strong className="text-red-400 block mb-1">Inelástica</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Bate e gruda.</p>
                                            <div className="text-[10px] bg-black/20 p-1 rounded text-center text-white">
                                                Perde Energia Máxima
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">e = 0 (Chiclete)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Airbag */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💥</span>
                                        <h2 className="text-xl font-bold text-red-400">Estudo de Caso: O Airbag</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Numa batida, você vai de 100km/h a 0. O <strong className="text-white">ΔQ</strong> é o mesmo com ou sem airbag (você vai parar de qualquer jeito).
                                        <br />O segredo é a fórmula: <code className="text-red-300">{'F . Δt = ΔQ'}</code>.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong className="text-zinc-500 block">Sem Airbag</strong>
                                            <p className="text-zinc-400">Tempo curto (0,01s). <strong className="text-red-400">Força Gigante</strong> (Morte).</p>
                                        </div>
                                        <div>
                                            <strong className="text-red-300 block">Com Airbag</strong>
                                            <p className="text-zinc-400">Tempo longo (0,2s). <strong className="text-green-400">Força Pequena</strong> (Vida).</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rocket Science */}
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                                    <div className="text-3xl">🚀</div>
                                    <div>
                                        <strong className="text-white block mb-1">Engenharia Espacial</strong>
                                        <p className="text-xs text-zinc-400">
                                            Foguetes não "empurram o ar". Eles funcionam pela <strong className="text-white">Conservação da Quantidade de Movimento</strong>.
                                            Ao jogar gás para trás (rápido), o foguete vai para frente. Funciona até no vácuo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_hidrostatica',
                title: 'Módulo 5: Estática e Hidrostática',
                description: 'Torque, Pressão, Empuxo e Fluidos.',
                locked: false,
                duration: '7h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_hidro_intro',
                        title: 'O Equilíbrio das Coisas',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Por que os prédios não caem?</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        <strong className="text-white">Estática:</strong> Estuda corpos parados. O segredo não é só zerar a Força, é zerar o GIRO (Torque).
                                        <br /><strong className="text-white">Hidrostática:</strong> Aplica isso a fluidos. Aqui a força vira Pressão. É a base de submarinos e do seu sangue.
                                    </p>
                                </div>

                                {/* Statics Rigid Body */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-xl font-bold text-white">Estática do Corpo Rígido</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <strong className="text-indigo-300 block mb-1">1. Não Transladar</strong>
                                            <div className="bg-black/30 p-2 rounded text-center border border-indigo-500/30">
                                                <code className="text-indigo-400 font-bold">{'Σ F = 0'}</code>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1">Soma das forças nula.</p>
                                        </div>
                                        <div>
                                            <strong className="text-pink-300 block mb-1">2. Não Girar (Torque)</strong>
                                            <div className="bg-black/30 p-2 rounded text-center border border-pink-500/30">
                                                <code className="text-pink-400 font-bold">{'Σ M = 0'}</code>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1">{'M = Força . Distância (Alavanca)'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hydrostatics Laws */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Os 3 Pilares da Hidrostática</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">Stevin (Profundidade)</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Pressão aumenta descendo.</p>
                                            <div className="text-[10px] bg-black/20 p-2 rounded font-mono text-white break-all">
                                                {'P = Patm + d.g.h'}
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">+1 atm a cada 10m.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                                            <strong className="text-green-400 block mb-1">Pascal (Prensa)</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Pressão se espalha igual.</p>
                                            <div className="text-[10px] bg-black/20 p-2 rounded font-mono text-white break-all">
                                                {'F1/A1 = F2/A2'}
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">Multiplica a força.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-orange-500">
                                            <strong className="text-orange-400 block mb-1">Arquimedes (Empuxo)</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Líquido deslocado empurra.</p>
                                            <div className="text-[10px] bg-black/20 p-2 rounded font-mono text-white break-all">
                                                {'E = d(liq).V(sub).g'}
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block mt-1">Isso faz flutuar.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Iceberg */}
                                <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🧊</span>
                                        <h2 className="text-xl font-bold text-cyan-400">Estudo de Caso: O Iceberg</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Por que só vemos a ponta (10%)?
                                        <br />O gela é 90% denso em relação à agua ($0,9 | 1,0$).
                                        <br />Para flutuar ($E = P$), ele precisa deslocar seu próprio peso em água.
                                        Como ele é mais "leve" (menos denso), precisa afundar 90% do corpo para gerar força suficiente.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_gravitacao',
                title: 'Módulo 6: Gravitação Universal',
                description: 'Leis de Kepler, Força Gravitacional e Marés.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_gravitacao_intro',
                        title: 'A Dança dos Planetas',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. A Força Invisível</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        É a "cola" do universo. A mesma força que faz a maçã cair, mantém a Lua em órbita.
                                        <strong className="text-white">Kepler</strong> disse COMO move (elipses). <strong className="text-white">Newton</strong> disse POR QUE move (força).
                                    </p>
                                </div>

                                {/* Kepler's Laws */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Leis de Kepler</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                                            <strong className="text-yellow-400 block mb-1">1ª: Órbitas</strong>
                                            <p className="text-xs text-zinc-500">Não são círculos. São <strong className="text-white">Elipses</strong>.</p>
                                            <div className="mt-2 text-[10px] text-zinc-400">O Sol fica num foco (não no meio).</div>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">2ª: Áreas</strong>
                                            <p className="text-xs text-zinc-500">Velocidade muda.</p>
                                            <div className="mt-2 text-[10px] text-zinc-400">
                                                Perto do Sol (Periélio) = <strong className="text-white">Rápido</strong>.
                                                <br />Longe (Afélio) = <strong className="text-white">Lento</strong>.
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                                            <strong className="text-red-400 block mb-1">3ª: Períodos</strong>
                                            <p className="text-xs text-zinc-500">Longe demora mais.</p>
                                            <div className="bg-black/20 p-1 rounded text-center mt-2">
                                                <code className="text-white text-[10px]">{'T²/R³ = K'}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Newton's Law */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <h3 className="text-xl font-bold text-white mb-4">Lei da Gravitação Universal</h3>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="bg-black/30 px-6 py-4 rounded-xl border border-white/10">
                                            <code className="text-2xl text-violet-400 font-bold">{'F = G . (M.m) / d²'}</code>
                                        </div>
                                        <div className="text-sm text-zinc-400 max-w-sm">
                                            A força cai com o <strong className="text-red-400">Quadrado da Distância</strong>.
                                            <br />Se afastar 2x, a força cai 4x.
                                            <br />Se afastar 3x, a força cai 9x.
                                        </div>
                                    </div>
                                </div>

                                {/* Orbits & Weightlessness */}
                                <div className="bg-zinc-900/50 p-5 rounded-xl border border-white/5">
                                    <strong className="text-white block mb-2">O Segredo da Órbita</strong>
                                    <p className="text-sm text-zinc-400">
                                        Astronautas flutuam na ISS não porque "não tem gravidade" (tem 90% lá!).
                                        Eles flutuam porque estão em <strong className="text-white">Queda Livre Eterna</strong>.
                                        A estação cai em direção à Terra, mas erra o chão porque está muito rápida lateralmente.
                                    </p>
                                </div>

                                {/* Case Study: Tides */}
                                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🌊</span>
                                        <h2 className="text-xl font-bold text-blue-400">Estudo de Caso: Marés</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        A Lua puxa a água perto dela (Maré Alta).
                                        Mas ela também puxa a Terra, "esquecendo" a água do outro lado (Outra Maré Alta).
                                        <br />A Terra vira um "ovo" de água. Por isso temos 2 marés altas por dia.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_termologia',
                title: 'Módulo 7: Termologia',
                description: 'Calorimetria, Mudanças de Fase e Propagação.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_termo_intro',
                        title: 'O Fogo e o Gelo',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Calor vs Temperatura</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Não confunda!
                                        <br /><strong className="text-white">Temperatura:</strong> Agitação das moléculas (Grau).
                                        <br /><strong className="text-white">Calor:</strong> Energia em trânsito (Fluxo).
                                        Só existe calor se houver diferença de temperatura.
                                    </p>
                                </div>

                                {/* Heat Types */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Os Dois Tipos de Calor</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Sensible Heat */}
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-orange-500">
                                            <h3 className="text-lg font-bold text-orange-400 mb-2">1. Calor Sensível</h3>
                                            <p className="text-xs text-zinc-400 mb-4">Muda a Temperatura. O corpo esquenta.</p>
                                            <div className="bg-black/20 p-3 rounded text-center">
                                                <code className="text-white font-bold text-lg">{'Q = m . c . ΔT'}</code>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 text-center mt-2">c = Calor específico (Inércia térmica da água é alta)</p>
                                        </div>

                                        {/* Latent Heat */}
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-cyan-500">
                                            <h3 className="text-lg font-bold text-cyan-400 mb-2">2. Calor Latente</h3>
                                            <p className="text-xs text-zinc-400 mb-4">Muda o Estado (Sólido/Líquido). Temperatura TRAVA.</p>
                                            <div className="bg-black/20 p-3 rounded text-center">
                                                <code className="text-white font-bold text-lg">{'Q = m . L'}</code>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 text-center mt-2">Gelo derretendo fica a 0°C até sumir.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Propagation */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Como o Calor Viaja?</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <strong className="text-red-300 block mb-1">Condução</strong>
                                            <p className="text-zinc-400 text-xs">Sólidos. Toque. Molécula a molécula. (Cabo da panela).</p>
                                        </div>
                                        <div>
                                            <strong className="text-blue-300 block mb-1">Convecção</strong>
                                            <p className="text-zinc-400 text-xs">Fluidos. Massas de ar. Quente sobe, Frio desce. (Ar condicionado).</p>
                                        </div>
                                        <div>
                                            <strong className="text-yellow-300 block mb-1">Irradiação</strong>
                                            <p className="text-zinc-400 text-xs">Ondas (Luz). Vácuo. (Sol).</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Sweat */}
                                <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💧</span>
                                        <h2 className="text-xl font-bold text-cyan-400">Estudo de Caso: O Suor</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Por que suamos? Para evaporar a água, ela precisa "roubar" calor da pele (<strong className="text-white">Calor Latente</strong>).
                                        Ao roubar energia, a pele esfria.
                                        Se estiver muito úmido, a água não evapora. O suor escorre e você não esfria (sensação de abafado).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_termodinamica',
                title: 'Módulo 8: Termodinâmica',
                description: 'Gases, Máquinas Térmicas e Entropia.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_termodinamica_intro',
                        title: 'A Ciência dos Motores',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. A Revolução Industrial</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Como transformar Calor (caos) em Movimento (ordem)?
                                        Essa é a Termodinâmica. O estudo dos gases que empurram pistões.
                                    </p>
                                </div>

                                {/* Ideal Gas Law */}
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <h3 className="text-lg font-bold text-white mb-2">Lei Geral dos Gases (Clapeyron)</h3>
                                    <div className="bg-black/30 px-6 py-3 rounded-xl border border-violet-500/30 mb-2">
                                        <code className="text-2xl text-violet-300 font-bold">{'P . V = n . R . T'}</code>
                                    </div>
                                    <p className="text-[10px] text-red-400 font-bold uppercase">Atenção: Use sempre Kelvin! (C + 273)</p>
                                </div>

                                {/* Laws of Thermo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 1st Law */}
                                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                                        <strong className="text-lg text-white block mb-2">1ª Lei: Conservação</strong>
                                        <div className="bg-black/20 p-2 rounded text-center mb-2">
                                            <code className="text-green-400 font-bold">{'Q = W + ΔU'}</code>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            O calor que entra vira:
                                            <br />1. Trabalho (Empurrar pistão)
                                            <br />2. Energia Interna (Esquentar)
                                        </p>
                                    </div>

                                    {/* 2nd Law */}
                                    <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5">
                                        <strong className="text-lg text-white block mb-2">2ª Lei: Entropia</strong>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            • O calor flui do Quente para o Frio.
                                            <br />• O rendimento nunca é 100%. Sempre sobra lixo térmico.
                                        </p>
                                        <div className="text-xs text-zinc-500 mt-2 italic">"O universo tende ao caos."</div>
                                    </div>
                                </div>

                                {/* Carnot Cycle */}
                                <div className="bg-zinc-900/50 p-5 rounded-xl border-l-4 border-yellow-500">
                                    <strong className="text-yellow-400 block mb-1">O Limite de Carnot</strong>
                                    <p className="text-sm text-zinc-400">
                                        É a máquina perfeita teórica. Mesmo ela não tem 100% de eficiência.
                                        Nenhum motor real (carro) supera Carnot.
                                    </p>
                                </div>

                                {/* Case Study: Fridge */}
                                <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">❄️</span>
                                        <h2 className="text-xl font-bold text-indigo-400">Estudo de Caso: A Geladeira</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        É uma máquina invertida. O calor não sai da comida sozinho (viola a 2ª Lei).
                                        Nós pagamos energia (Trabalho) para o compressor <strong className="text-white">FORÇAR</strong> o calor a sair do frio (congelador) para o quente (cozinha, na grade atrás).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_optica',
                title: 'Módulo 9: Óptica Geométrica',
                description: 'Espelhos, Lentes e Visão Humana.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_optica_intro',
                        title: 'A Física da Luz',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. A Luz viaja em Linha Reta</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Na Óptica Geométrica, ignoramos que a luz é onda. Tratamos como "raios" (linhas).
                                        Por isso existem sombras e eclipses.
                                        Se você vê os olhos do motorista pelo retrovisor, <strong className="text-white">ele também te vê</strong> (Reversibilidade).
                                    </p>
                                </div>

                                {/* Mirrors Types */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Espelhos (Reflexão)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-zinc-500">
                                            <strong className="text-white block mb-1">Plano</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Imagem Virtual, Direita e Igual.</p>
                                            <span className="text-[10px] text-zinc-500">Troca direita por esquerda.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">Côncavo</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Maquiagem / Telescópio.</p>
                                            <span className="text-[10px] text-zinc-500">Aumenta a imagem (perto).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-orange-500">
                                            <strong className="text-orange-400 block mb-1">Convexo</strong>
                                            <p className="text-xs text-zinc-400 mb-2">Retrovisor / Loja.</p>
                                            <span className="text-[10px] text-zinc-500">Diminui para caber mais (Campo visual).</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lenses & Snell */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Refração (Lentes)</h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <strong className="text-pink-300 block mb-1">Lei de Snell</strong>
                                            <div className="bg-black/30 p-2 rounded text-center my-2">
                                                <code className="text-pink-400 font-bold">{'n1 . sen(i) = n2 . sen(r)'}</code>
                                            </div>
                                            <p className="text-xs text-zinc-500">Quando a luz muda de meio (ar $\rightarrow$ água), ela desvia e muda de velocidade.</p>
                                        </div>
                                        <div className="flex-1">
                                            <strong className="text-green-300 block mb-1">Equação de Gauss</strong>
                                            <div className="bg-black/30 p-2 rounded text-center my-2">
                                                <code className="text-green-400 font-bold">{'1/f = 1/p + 1/p\''}</code>
                                            </div>
                                            <p className="text-xs text-zinc-500">A 'Limonada': 1/foco = 1/p + 1/p linha.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Vision */}
                                <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">👓</span>
                                        <h2 className="text-xl font-bold text-green-400">Estudo de Caso: A Visão</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong className="text-white block">Miopia (Olho Longo)</strong>
                                            <p className="text-zinc-400 text-xs mt-1">
                                                Foco cai ANTES da retina. Não vê longe.
                                                <br />Correção: Lente <strong className="text-green-300">Divergente</strong>.
                                            </p>
                                        </div>
                                        <div>
                                            <strong className="text-white block">Hipermetropia (Olho Curto)</strong>
                                            <p className="text-zinc-400 text-xs mt-1">
                                                Foco cai DEPOIS da retina. Não vê perto.
                                                <br />Correção: Lente <strong className="text-green-300">Convergente</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_ondulatoria',
                title: 'Módulo 10: Ondulatória e Acústica',
                description: 'Som, Luz, Efeito Doppler e Interferência.',
                locked: false,
                duration: '7h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_ondulatoria_intro',
                        title: 'O Universo Vibra',
                        duration: '2h 15m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Energia em Movimento</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Uma onda transporta <strong className="text-white">ENERGIA</strong>, nunca matéria.
                                        A rolha no mar sobe e desce, mas não sai do lugar.
                                        <br />• <strong>Mecânicas:</strong> Precisam de ar/água (Som). Não viajam no vácuo.
                                        <br />• <strong>Eletromagnéticas:</strong> Viajam no vácuo (Luz, Wi-Fi).
                                    </p>
                                </div>

                                {/* Wave Equation */}
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <h3 className="text-lg font-bold text-white mb-2">Equação Fundamental</h3>
                                    <div className="bg-black/30 px-8 py-4 rounded-xl border border-violet-500/30 mb-2">
                                        <code className="text-3xl text-violet-300 font-bold">{'v = λ . f'}</code>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6 text-center text-xs mt-2">
                                        <div>
                                            <strong className="block text-zinc-300">v (Velocidade)</strong>
                                            <span className="text-zinc-500">Depende do MEIO.</span>
                                        </div>
                                        <div>
                                            <strong className="block text-zinc-300">λ (Lambda)</strong>
                                            <span className="text-zinc-500">Comprimento.</span>
                                        </div>
                                        <div>
                                            <strong className="block text-zinc-300">f (Frequência)</strong>
                                            <span className="text-zinc-500">Depende da FONTE. (Identidade).</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Phenomena */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Fenômenos Ondulatórios</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-zinc-900/50 p-3 rounded-lg">
                                            <strong className="text-blue-400 block">Reflexão</strong>
                                            <span className="text-zinc-500 text-xs">Bate e volta. (Eco).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg">
                                            <strong className="text-green-400 block">Refração</strong>
                                            <span className="text-zinc-500 text-xs">Muda de meio. λ muda, f mantém.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg">
                                            <strong className="text-orange-400 block">Difração</strong>
                                            <span className="text-zinc-500 text-xs">Contornar obstáculos. (Wi-Fi pela casa).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-3 rounded-lg">
                                            <strong className="text-purple-400 block">Polarização</strong>
                                            <span className="text-zinc-500 text-xs">Filtrar direção. Só LUZ (transversal). Som não!</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Doppler */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🚑</span>
                                        <h2 className="text-xl font-bold text-red-400">Estudo de Caso: Efeito Doppler</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Por que a sirene muda quando passa? (iii-uuu $\rightarrow$ uuu-ooo).
                                        <br />• <strong>Aproximando:</strong> Onda espremida. Frequência sobe (Agudo).
                                        <br />• <strong>Afastando:</strong> Onda esticada. Frequência desce (Grave).
                                    </p>
                                    <div className="bg-black/20 p-2 rounded text-xs text-center text-zinc-300">
                                        Uso: Radares de multa e Astronomia (Expansão do Universo).
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_eletrostatica',
                title: 'Módulo 11: Eletrostática',
                description: 'Cargas, Campo Elétrico e Potencial.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_eletro_intro',
                        title: 'O Poder do Âmbar',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Opostos se Atraem</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Tudo começa com o átomo. Prótons (+) e Elétrons (-).
                                        <br />• <strong>Neutro:</strong> Iguais.
                                        <br />• <strong>Cátion (+):</strong> Perdeu Elétrons.
                                        <br />• <strong>Ânion (-):</strong> Ganhou Elétrons.
                                        <br />A carga elétrica é quantizada ($Q = n.e$).
                                    </p>
                                </div>

                                {/* Coulomb & Field */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Coulomb's Law */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-yellow-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Lei de Coulomb (Força)</h3>
                                        <p className="text-xs text-zinc-500 mb-4">A "Gravidade" das cargas. Muito mais forte.</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <code className="text-yellow-400 font-bold text-lg">{'F = k . |Q|.|q| / d²'}</code>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 text-center mt-2">Dobra a distância $\rightarrow$ Força cai 4x.</p>
                                    </div>

                                    {/* Electric Potential */}
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-blue-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Potencial (Voltagem)</h3>
                                        <p className="text-xs text-zinc-500 mb-4">Energia por carga. (Escalar).</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <code className="text-blue-400 font-bold text-lg">{'V = k . Q / d'}</code>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 text-center mt-2">Diferença de Potencial (ddp) move a corrente.</p>
                                    </div>
                                </div>

                                {/* Faraday Cage */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="text-4xl">⛈️</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Gaiola de Faraday</h3>
                                        <p className="text-sm text-zinc-400">
                                            Dentro de um condutor, o campo elétrico é <strong>ZERO</strong>.
                                            Se um raio atingir seu carro, você está salvo. Não pelos pneus, mas pela lataria metálica que distribui as cargas por fora.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_eletrodinamica',
                title: 'Módulo 12: Eletrodinâmica',
                description: 'Circuitos, Leis de Ohm e Magnetismo.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_eletrodinamica_intro',
                        title: 'A Corrente Elétrica',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-violet-400">1. Cargas em Movimento</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Quando organizamos o caos, nasce a <strong className="text-white">Corrente (i)</strong>.
                                        A Eletrodinâmica estuda o fluxo que liga a nossa sociedade.
                                        E o Eletromagnetismo (Oersted/Faraday) une tudo: Eletricidade gera Ímã, e Ímã gera Eletricidade.
                                    </p>
                                </div>

                                {/* Ohm's Law & Power */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Leis de Ohm</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-green-500">
                                            <strong className="text-green-400 block mb-1">1ª Lei (Uri)</strong>
                                            <div className="bg-black/20 p-2 rounded text-center my-1">
                                                <code className="text-white font-bold">{'U = R . i'}</code>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block">Tensão = Resistência x Corrente</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-red-500">
                                            <strong className="text-red-400 block mb-1">Potência (Piu)</strong>
                                            <div className="bg-black/20 p-2 rounded text-center my-1">
                                                <code className="text-white font-bold">{'P = i . U'}</code>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 block">Ou P = U²/R. (O que gasta luz).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-t-2 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">Resistores</strong>
                                            <div className="text-[10px] text-zinc-400 mt-1">
                                                • <strong>Série:</strong> Soma R. (i igual).
                                                <br />• <strong>Paralelo:</strong> Divide i. (U igual).
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Magnetism */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Eletromagnetismo</h3>
                                    <div className="flex flex-col md:flex-row gap-6 text-sm">
                                        <div className="flex-1">
                                            <strong className="text-violet-300 block mb-1">Oersted (Mão Direita)</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Corrente gera Campo Magnético. (Fio vira ímã).
                                                <br />Dedão no fluxo, dedos no campo.
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <strong className="text-pink-300 block mb-1">Faraday (Indução)</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Campo Magnético <strong className="text-white">VARIÁVEL</strong> gera Corrente.
                                                <br />É assim que usinas hidrelétricas funcionam.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Shower */}
                                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🚿</span>
                                        <h2 className="text-xl font-bold text-blue-400">Estudo de Caso: O Chuveiro</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Como esquentar mais no INVERNO?
                                        <strong className="text-white"> Diminuindo a Resistência.</strong> (Sério!).
                                        <br />Como $P = U²/R$, se você baixa o R, a Potência sobe brutalmente.
                                        Ao mudar a chave, você encosta em um pedaço menor do fio.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            }
        ]
    },
    {
        id: 'biology',
        title: 'Biologia',
        description: 'Citologia, genética, evolução e ecologia.',
        category: 'BIOLÓGICAS',
        duration: '95h',
        progress: 0,
        icon: Dna,
        color: 'bg-teal-600',
        tags: ['natureza'],
        modules: [
            {
                id: 'm_bioquimica',
                title: 'Módulo 1: Bioquímica Celular',
                description: 'Água, Proteínas e Enzimas.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_bioquimica_intro',
                        title: 'A Química da Vida',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. CHONPS</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Não somos feitos de pó de estrelas raro. Somos feitos do básico:
                                        <br /><strong className="text-white">C</strong>arbono, <strong className="text-white">H</strong>idrogênio, <strong className="text-white">O</strong>xigênio, <strong className="text-white">N</strong>itrogênio, <strong className="text-white">P</strong>hósforo e <strong className="text-white">S</strong>ulphur (Enxofre).
                                        A Bioquímica estuda como isso vira Vida.
                                    </p>
                                </div>

                                {/* Water */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💧</span>
                                        <h3 className="text-lg font-bold text-white">Água: O Solvente Universal</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        A molécula é <strong className="text-cyan-400">POLAR</strong> (Mickey Mouse).
                                        <br />• <strong>Coesão:</strong> Tensão superficial.
                                        <br />• <strong>Calor Específico:</strong> A água demora a esquentar e a esfriar (Regula o clima e o corpo).
                                        <br />• <strong>Solvente:</strong> Dissolve o que é polar. O que não é (gordura), vira membrana.
                                    </p>
                                </div>

                                {/* Proteins & Enzymes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-teal-500">
                                        <h3 className="text-lg font-bold text-teal-400 mb-2">Proteínas</h3>
                                        <p className="text-xs text-zinc-400 mb-4">Feitas de Aminoácidos. Forma = Função.</p>
                                        <div className="bg-black/20 p-3 rounded">
                                            <strong className="text-white block text-sm">Desnaturação</strong>
                                            <span className="text-[10px] text-zinc-500">
                                                Calor ou pH extremo destrói a forma.
                                                <br />(Ovo cozido não volta a ser cru).
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-purple-500">
                                        <h3 className="text-lg font-bold text-purple-400 mb-2">Enzimas</h3>
                                        <p className="text-xs text-zinc-400 mb-4">Catalisadores. Aceleram tudo.</p>
                                        <div className="bg-black/20 p-3 rounded">
                                            <strong className="text-white block text-sm">Chave-Fechadura</strong>
                                            <span className="text-[10px] text-zinc-500">
                                                São específicas.
                                                <br />Dependem de Temperatura e pH ótimos.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Lactose */}
                                <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🥛</span>
                                        <h2 className="text-xl font-bold text-amber-400">Estudo de Caso: Intolerância à Lactose</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Quem é intolerante não tem a enzima <strong className="text-white">Lactase</strong> (a chave).
                                        A lactose (açúcar) passa direto e as bactérias fazem a festa (gases).
                                        Evolutivamente, adultos não deveriam tomar leite, por isso o gene "desliga".
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_membrana',
                title: 'Módulo 2: Membrana Plasmática',
                description: 'Transportes e Mosaico Fluido.',
                locked: false,
                duration: '7h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_membrana_intro',
                        title: 'A Fronteira da Vida',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. O Mosaico Fluido</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A membrana não é rígida. É um mar de gordura (fosfolipídios) com "icebergs" de proteína flutuando.
                                        Ela decide quem entra e quem sai (<strong className="text-white">Permeabilidade Seletiva</strong>).
                                    </p>
                                </div>

                                {/* Transports */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Tipos de Transporte</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Pasive */}
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-t-2 border-green-500">
                                            <strong className="text-green-400 block mb-2">Passivo (Sem ATP)</strong>
                                            <p className="text-xs text-zinc-400 mb-3">A favor da correnteza. Busca equilíbrio.</p>
                                            <ul className="space-y-2 text-xs text-zinc-500">
                                                <li>• <strong>Difusão:</strong> Soluto passa direto.</li>
                                                <li>• <strong>Osmose:</strong> Água vai para onde tem mais sal. (Hipo $\rightarrow$ Hiper).</li>
                                            </ul>
                                        </div>

                                        {/* Active */}
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-t-2 border-red-500">
                                            <strong className="text-red-400 block mb-2">Ativo (Gasta ATP)</strong>
                                            <p className="text-xs text-zinc-400 mb-3">Contra a correnteza.</p>
                                            <div className="bg-black/20 p-2 rounded">
                                                <strong className="text-white block">Bomba de Sódio e Potássio</strong>
                                                <span className="text-[10px]">
                                                    Joga 3 Na+ fora, puxa 2 K+ dentro.
                                                    <br />Cria a "bateria" da célula (negativa dentro).
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Charque */}
                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🥩</span>
                                        <h2 className="text-xl font-bold text-red-400">Estudo de Caso: Carne de Sol</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Como conservar carne sem geladeira?
                                        <strong className="text-white"> Salgando muito.</strong> (Meio Hipertônico).
                                        Por osmose, a água sai da carne (seca) e também das bactérias que tentarem pousar ali.
                                        A bactéria morre desidratada. Física pura conservando alimentos.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_organelas',
                title: 'Módulo 3: Organelas e Bioenergética',
                description: 'Mitocôndrias, Cloroplastos e Fotossíntese.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_organelas_intro',
                        title: 'A Cidade Celular',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. A Usina e a Fazenda</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Organelas são os órgãos da célula.
                                        A <strong className="text-white">Teoria Endossimbiótica</strong> diz que Mitocôndrias e Cloroplastos eram bactérias que foram "engolidas" e viraram parceiras. (Têm DNA próprio!).
                                    </p>
                                </div>

                                {/* Organelles Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                                        <strong className="text-red-400 block mb-1">Mitocôndria</strong>
                                        <p className="text-xs text-zinc-400">Respiração Celular. Gera ATP. (DNA materno).</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-green-500">
                                        <strong className="text-green-400 block mb-1">Cloroplasto</strong>
                                        <p className="text-xs text-zinc-400">Fotossíntese. Gera Glicose. (Só plantas).</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-500">
                                        <strong className="text-yellow-400 block mb-1">Ribossomo</strong>
                                        <p className="text-xs text-zinc-400">Fábrica de Proteínas. (Sem membrana).</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                                        <strong className="text-purple-400 block mb-1">Lisossomo</strong>
                                        <p className="text-xs text-zinc-400">Digestão/Lixeiro. (Suicídio celular).</p>
                                    </div>
                                </div>

                                {/* Respiration vs Photosynthesis */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">O Ciclo da Vida</h3>
                                    <div className="flex flex-col md:flex-row gap-6 text-sm">
                                        <div className="flex-1">
                                            <strong className="text-orange-300 block mb-1">Respiração (Aeróbica)</strong>
                                            <p className="text-zinc-400 text-xs mb-2">
                                                Queima Glicose com O₂ para gerar ATP.
                                                <br />Saldo: 30-32 ATP.
                                            </p>
                                            <div className="bg-black/30 p-2 rounded text-center">
                                                <code className="text-orange-400 font-bold">{'C6H12O6 + O2 → CO2 + H2O + ATP'}</code>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <strong className="text-lime-300 block mb-1">Fotossíntese</strong>
                                            <p className="text-zinc-400 text-xs mb-2">
                                                Usa Luz e CO₂ para criar Glicose.
                                            </p>
                                            <div className="bg-black/30 p-2 rounded text-center">
                                                <code className="text-lime-400 font-bold">{'CO2 + H2O + Luz → C6H12O6 + O2'}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Cyanide */}
                                <div className="bg-purple-900/10 p-6 rounded-2xl border border-purple-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">☠️</span>
                                        <h2 className="text-xl font-bold text-purple-400">Estudo de Caso: O Cianeto</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        O veneno dos espiões mata celularmente.
                                        Ele trava a última enzima da Mitocôndria. O elétron não chega ao Oxigênio.
                                        Sem produzir ATP, o corpo desliga em segundos. Morte por falta de energia.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_biomol',
                title: 'Módulo 4: Biologia Molecular',
                description: 'DNA, RNA e Síntese Proteica.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_biomol_intro',
                        title: 'O Código da Vida',
                        duration: '2h 45m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. O Dogma Central</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O software da vida funciona em um fluxo único:
                                        <br /><strong className="text-white">DNA</strong> (Receita) $\rightarrow$ <strong className="text-white">RNA</strong> (Mensageiro) $\rightarrow$ <strong className="text-white">Proteína</strong> (Bolo).
                                    </p>
                                </div>

                                {/* DNA vs RNA */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-blue-500">
                                        <h3 className="text-lg font-bold text-blue-400 mb-2">DNA (Master)</h3>
                                        <ul className="text-xs text-zinc-400 space-y-2">
                                            <li>• Fita <strong>Dupla</strong> (Hélice).</li>
                                            <li>• Bases: <strong>A - T</strong> e <strong>C - G</strong>.</li>
                                            <li>• Açúcar: Desoxirribose.</li>
                                            <li>• Fica no Núcleo (Cofre).</li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-pink-500">
                                        <h3 className="text-lg font-bold text-pink-400 mb-2">RNA (Cópia)</h3>
                                        <ul className="text-xs text-zinc-400 space-y-2">
                                            <li>• Fita <strong>Simples</strong>.</li>
                                            <li>• Bases: <strong>A - U</strong> (Uracila) e C - G.</li>
                                            <li>• Açúcar: Ribose.</li>
                                            <li>• Vai para o Citoplasma.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Synthesis Process */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">A Fábrica de Proteínas</h3>
                                    <div className="relative pl-4 border-l-2 border-zinc-700 space-y-6">
                                        <div>
                                            <strong className="text-teal-300 block text-sm">1. Transcrição (Núcleo)</strong>
                                            <p className="text-zinc-500 text-xs">Copia o gene do DNA para RNA mensageiro.</p>
                                        </div>
                                        <div>
                                            <strong className="text-teal-300 block text-sm">2. Splicing (Edição)</strong>
                                            <p className="text-zinc-500 text-xs">Corta o lixo (Íntrons). Cola o útil (Éxons).</p>
                                        </div>
                                        <div>
                                            <strong className="text-teal-300 block text-sm">3. Tradução (Ribossomo)</strong>
                                            <p className="text-zinc-500 text-xs">Lê o código de 3 em 3 (Códons) e monta a proteína.</p>
                                            <span className="text-[10px] text-zinc-600 italic">Código Universal e Degenerado (Segurança).</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: mRNA Vaccine */}
                                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💉</span>
                                        <h2 className="text-xl font-bold text-blue-400">Estudo de Caso: Vacina de mRNA</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        Tecnologia Pfizer/Moderna.
                                        Injeta-se um "email" (RNA) com a instrução para o seu corpo fabricar apenas a proteína do vírus.
                                        Seu sistema imune treina com ela. O RNA se desintegra depois. Sem vírus real envolvido.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_divisao',
                title: 'Módulo 5: Divisão Celular',
                description: 'Mitose, Meiose e Ciclo Celular.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_divisao_intro',
                        title: 'A Dança dos Cromossomos',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. Mitose vs Meiose</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Não confunda!
                                        <br /><strong className="text-white">Mitose (Equacional):</strong> Clones. Crescimento e reparo. (2n $\rightarrow$ 2n).
                                        <br /><strong className="text-white">Meiose (Reducional):</strong> Gâmetas. Variabilidade. (2n $\rightarrow$ n).
                                    </p>
                                </div>

                                {/* Phases */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">As Fases (PROMETO ANA TELEFONAR)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-zinc-500">
                                            <strong className="text-zinc-300 block mb-1">Prófase & Telófase</strong>
                                            <p className="text-xs text-zinc-400">Início e Fim. Condensa e Descondensa o DNA. Membrana some e volta.</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-blue-500">
                                            <strong className="text-blue-400 block mb-1">Metáfase</strong>
                                            <p className="text-xs text-zinc-400">Meio. Fila indiana. Máxima condensação.</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-red-500">
                                            <strong className="text-red-400 block mb-1">Anáfase</strong>
                                            <p className="text-xs text-zinc-400">Separação. (Irmãos na Mitose, Homólogos na Meiose I).</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-purple-500">
                                            <strong className="text-purple-400 block mb-1">Crossing-Over</strong>
                                            <p className="text-xs text-zinc-400">Só na Prófase I da Meiose. Troca genes. Mistura tudo.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Down Syndrome */}
                                <div className="bg-orange-900/10 p-6 rounded-2xl border border-orange-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🧬</span>
                                        <h2 className="text-xl font-bold text-orange-400">Estudo de Caso: Síndrome de Down</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Erro na Anáfase I. O par 21 não se separa (<strong className="text-white">Não-disjunção</strong>).
                                        Um gâmeta leva dois cromossomos 21. Ao fecundar, o bebê fica com 3 (Trissomia).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_genetica',
                title: 'Módulo 6: Genética Clássica',
                description: 'Leis de Mendel e Tipos Sanguíneos.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_genetica_intro',
                        title: 'A Matemática da Vida',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. Mendel</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        <strong className="text-white">Genótipo:</strong> Aa (Receita).
                                        <br /><strong className="text-white">Fenótipo:</strong> Olho Azul (Bolo).
                                        <br />Mendel descobriu que os genes vêm em pares e se separam. (3:1).
                                    </p>
                                </div>

                                {/* Blood Types */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Tipos Sanguíneos (ABO)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-red-500">
                                            <h3 className="text-lg font-bold text-red-400 mb-2">Grupo O (Dador)</h3>
                                            <p className="text-xs text-zinc-400 mb-2">Genótipo: <strong>ii</strong> (Recessivo).</p>
                                            <div className="text-[10px] text-zinc-500">
                                                Hemácia "careca" (sem antígeno). Ninguém rejeita.
                                                Mas só recebe dele mesmo.
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-purple-500">
                                            <h3 className="text-lg font-bold text-purple-400 mb-2">Grupo AB (Recebedor)</h3>
                                            <p className="text-xs text-zinc-400 mb-2">Genótipo: <strong>IA IB</strong> (Codominância).</p>
                                            <div className="text-[10px] text-zinc-500">
                                                Tem os dois crachás (A e B). Não ataca ninguém.
                                                Recebe de todos.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rh Factor */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                    <h3 className="text-lg font-bold text-white mb-2">Fator Rh (+/-)</h3>
                                    <div className="bg-black/30 p-4 rounded-xl border border-teal-500/30 mb-2">
                                        <span className="text-teal-300 font-bold block">Eritroblastose Fetal</span>
                                        <span className="text-zinc-500 text-xs">Doença do 2º Filho.</span>
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        Mãe Negativa (rr) e Pai Positivo.
                                        Se o 1º filho for +, a mãe cria anticorpos.
                                        No 2º filho +, os anticorpos atacam o bebê.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_evolucao',
                title: 'Módulo 7: Evolução e Especiação',
                description: 'Lamarck, Darwin e Neodarwinismo.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_evolucao_intro',
                        title: 'A Origem das Espécies',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. A Batalha das Girafas</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        <strong className="text-white">Lamarck:</strong> O meio induz. (Estica o pescoço e cresce). <span className="text-red-400">ERRADO.</span>
                                        <br /><strong className="text-white">Darwin:</strong> O meio seleciona. (Quem tem pescoço curto morre). <span className="text-green-400">CERTO.</span>
                                        <br /><strong className="text-white">Neodarwinismo:</strong> Darwin + DNA. (Mutação cria, Seleção escolhe).
                                    </p>
                                </div>

                                {/* Evidences */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-yellow-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Homólogos</h3>
                                        <p className="text-xs text-zinc-500 mb-4">Mesma origem, função diferente.</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <strong className="text-yellow-400">Divergência Evolutiva</strong>
                                            <p className="text-[10px] text-zinc-400 mt-1">Braço Humano e Asa de Morcego.</p>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-purple-500">
                                        <h3 className="text-lg font-bold text-white mb-2">Análogos</h3>
                                        <p className="text-xs text-zinc-500 mb-4">Mesma função, origem diferente.</p>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <strong className="text-purple-400">Convergência Evolutiva</strong>
                                            <p className="text-[10px] text-zinc-400 mt-1">Asa de Ave e Asa de Mosca.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Antibiotic Resistance */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💊</span>
                                        <h3 className="text-lg font-bold text-white">Darwin no Hospital</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        O antibiótico <strong className="text-red-400">NÃO</strong> cria bactérias fortes.
                                        Ele apenas mata as fracas.
                                        A que tinha uma mutação de sorte sobrevive e se multiplica sem concorrência.
                                        (Seleção Natural pura).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_fisiologia1',
                title: 'Módulo 8: Fisiologia Humana I',
                description: 'Digestão e Respiração.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_fisiologia1_intro',
                        title: 'A Máquina Humana',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. O Tubo Digestório</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Tudo depende do pH.
                                        <br />• <strong>Boca (pH 7):</strong> Amilase (Amido).
                                        <br />• <strong>Estômago (pH 2):</strong> Pepsina (Proteína). Ácido mata bactérias.
                                        <br />• <strong>Intestino (pH 8):</strong> Tripsina/Lipase. Onde tudo é absorvido.
                                    </p>
                                </div>

                                {/* Digestion Details */}
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-green-500">
                                    <h3 className="text-lg font-bold text-green-400 mb-2">A Bile (Fígado)</h3>
                                    <p className="text-sm text-zinc-400">
                                        Cuidado no ENEM!
                                        A Bile <strong className="text-white">NÃO tem enzimas</strong>.
                                        Ela é um detergente (emulsificante) que quebra gordura em gotas menores para a Lipase agir.
                                    </p>
                                </div>

                                {/* Respiration */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Sistema Respiratório</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <strong className="text-blue-300 block mb-1">Mecânica</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Diafragma contrai e desce $\rightarrow$ Pressão cai $\rightarrow$ Ar entra.
                                                (Não "sugamos" o ar, a atmosfera empurra).
                                            </p>
                                        </div>
                                        <div>
                                            <strong className="text-red-300 block mb-1">Hematose</strong>
                                            <p className="text-zinc-400 text-xs">
                                                Troca gasosa nos Alvéolos.
                                                Ocorre por Difusão Simples.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Case Study: Carbon Monoxide */}
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-600">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💨</span>
                                        <h2 className="text-xl font-bold text-zinc-200">Perigo: Monóxido de Carbono (CO)</h2>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        "Morte Branca". A Hemoglobina prefere o CO 200x mais que o O₂.
                                        O CO "entope" o sangue permanentemente. Morte por asfixia celular, mesmo com pulmões cheios de ar.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_fisiologia2',
                title: 'Módulo 9: Fisiologia Humana II',
                description: 'Circulação, Excreção e o Rim.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_fisiologia2_intro',
                        title: 'Logística e Limpeza',
                        duration: '2h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. O Motor e o Filtro</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        <strong className="text-white">Coração:</strong> 2 Bombas. Direita (Venosa) joga pro Pulmão. Esquerda (Arterial) joga pro Corpo.
                                        <br /><strong className="text-white">Rim:</strong> Filtra tudo. Reabsorve o que é bom (Glicose/Água). Excreta o tóxico (Ureia).
                                    </p>
                                </div>

                                {/* Kidney Function */}
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-yellow-500">
                                    <h3 className="text-lg font-bold text-yellow-500 mb-2">O Néfron (Unidade Renal)</h3>
                                    <ul className="space-y-2 text-xs text-zinc-400">
                                        <li>• <strong>Filtração:</strong> O sangue chega sob pressão. Extravasa água, sais, glicose e ureia.</li>
                                        <li>• <strong>Reabsorção:</strong> O corpo pega de volta 99% da água e 100% da glicose.</li>
                                        <li>• <strong>Secreção:</strong> Elimina drogas e excessos.</li>
                                    </ul>
                                    <p className="text-[10px] text-zinc-500 mt-2 italic">Glicose na urina = Diabetes.</p>
                                </div>

                                {/* Case Study: Hangover */}
                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🍺</span>
                                        <h3 className="text-lg font-bold text-white">A Ressaca</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        O álcool inibe o <strong className="text-blue-400">ADH</strong> (Hormônio Antidiurético).
                                        Sem ADH, o rim não "segura" a água. Você urina demais (além do que bebeu).
                                        Resultado: Desidratação cerebral (dor de cabeça).
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_controle',
                title: 'Módulo 10: Sistemas de Controle',
                description: 'Nervoso, Endócrino e Imunológico.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_controle_intro',
                        title: 'O Comando Central',
                        duration: '3h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                {/* Intro */}
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-teal-400">1. Coordenação</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        <strong className="text-white">Nervoso:</strong> Elétrico. Rápido. (WhatsApp).
                                        <br /><strong className="text-white">Endócrino:</strong> Químico (Hormônios). Lento. (Correio).
                                        <br /><strong className="text-white">Imune:</strong> Defesa. (Exército).
                                    </p>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-blue-500">
                                        <h3 className="text-lg font-bold text-blue-400 mb-2">Vacina (Preventiva)</h3>
                                        <p className="text-xs text-zinc-400 mb-2">Contém o <strong>Antígeno</strong> (Morto/Fraco).</p>
                                        <ul className="text-[10px] text-zinc-500 list-disc ml-4">
                                            <li>Ensina a pescar. (Imunidade Ativa).</li>
                                            <li>Gera Memória.</li>
                                            <li>Longa duração.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-green-500">
                                        <h3 className="text-lg font-bold text-green-400 mb-2">Soro (Curativo)</h3>
                                        <p className="text-xs text-zinc-400 mb-2">Contém o <strong>Anticorpo</strong> (Pronto).</p>
                                        <ul className="text-[10px] text-zinc-500 list-disc ml-4">
                                            <li>Dá o peixe. (Imunidade Passiva).</li>
                                            <li>Não gera memória.</li>
                                            <li>Ação imediata (Ex: Picada de cobra).</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Diabetes */}
                                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-600">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🍬</span>
                                        <h2 className="text-xl font-bold text-zinc-200">Diabetes: Falha no Pâncreas</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
                                        <div>
                                            <strong className="block text-white mb-1">Tipo 1 (Autoimune)</strong>
                                            O corpo destrói o pâncreas. Não produz insulina. (Jovens).
                                        </div>
                                        <div>
                                            <strong className="block text-white mb-1">Tipo 2 (Resistência)</strong>
                                            Célula ignora a insulina. Obesidade/Sedentarismo. (Adultos).
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            }
        ]
    },
    {
        id: 'history',
        title: 'História',
        description: 'História antiga, medieval, moderna e contemporânea.',
        category: 'HUMANAS',
        duration: '100h',
        progress: 0,
        icon: Hourglass,
        color: 'bg-amber-600',
        tags: ['humanas']
    },
    {
        id: 'geography',
        title: 'Geografia',
        description: 'Geografia física, política, econômica e humana.',
        category: 'HUMANAS',
        duration: '80h',
        progress: 0,
        icon: Globe,
        color: 'bg-cyan-600',
        tags: ['humanas']
    },
    {
        id: 'philosophy',
        title: 'Filosofia',
        description: 'Ética, lógica, metafísica e história da filosofia.',
        category: 'HUMANAS',
        duration: '60h',
        progress: 0,
        icon: Brain,
        color: 'bg-fuchsia-600',
        tags: ['humanas']
    },
    {
        id: 'sociology',
        title: 'Sociologia',
        description: 'Estudo da sociedade, cultura e relações humanas.',
        category: 'HUMANAS',
        duration: '50h',
        progress: 0,
        icon: Users,
        color: 'bg-orange-600',
        tags: ['humanas']
    },
    {
        id: 'portuguese',
        title: 'Português',
        description: 'Gramática, interpretação de texto e redação.',
        category: 'LINGUAGENS',
        duration: '110h',
        progress: 0,
        icon: BookA,
        color: 'bg-blue-600',
        tags: ['linguagens']
    },
    {
        id: 'english',
        title: 'Inglês',
        description: 'Gramática, vocabulário e compreensão auditiva.',
        category: 'LINGUAGENS',
        duration: '100h',
        progress: 0,
        icon: Languages,
        color: 'bg-red-600',
        tags: ['linguagens']
    },
    {
        id: 'spanish',
        title: 'Espanhol',
        description: 'Língua espanhola para comunicação e leitura.',
        category: 'LINGUAGENS',
        duration: '70h',
        progress: 0,
        icon: Languages,
        color: 'bg-yellow-600',
        tags: ['linguagens']
    },
    {
        id: 'literature',
        title: 'Literatura',
        description: 'Movimentos literários, análise de obras e autores.',
        category: 'LINGUAGENS',
        duration: '90h',
        progress: 0,
        icon: BookOpen,
        color: 'bg-rose-600',
        tags: ['linguagens']
    },
    {
        id: 'art_history',
        title: 'História da Arte',
        description: 'Evolução das artes visuais e movimentos artísticos.',
        category: 'ARTES',
        duration: '45h',
        progress: 0,
        icon: Palette,
        color: 'bg-pink-600',
        tags: ['artes']
    }
];
