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
    content?: React.ReactNode; // Legacy support
    contentId?: string; // New lazy loading ID
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
                        contentId: 'chemistry_atomistica_modelos'
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
                        contentId: 'chemistry_atomistica_tabela'
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
                        contentId: 'chemistry_funcoes_inorganicas'
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
                        contentId: 'chemistry_estequiometria_leis'
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
                        contentId: 'chemistry_solucoes_intro'
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
                        contentId: 'chemistry_termoquimica_intro'
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
                        contentId: 'chemistry_cinetica_equilibrio'
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
                        contentId: 'chemistry_organica_funcoes'
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
                        contentId: 'chemistry_organica_reacoes'
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
                        contentId: 'mathematics_sequences_finance'
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
                        contentId: 'mathematics_trig_circle'
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
                        contentId: 'mathematics_trig_triangle'
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
                        contentId: 'mathematics_combinatoria'
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
                        contentId: 'mathematics_probabilidade'
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
                        contentId: 'mathematics_geo_plana'
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
                        contentId: 'mathematics_geo_espacial'
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
                        contentId: 'mathematics_geo_analitica'
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
                        contentId: 'mathematics_estatistica'
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
                        contentId: 'physics_cinematica_intro'
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
                        contentId: 'physics_dinamica_intro'
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
                        contentId: 'physics_energia_intro'
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
        id: 'sociology',
        title: 'Sociologia',
        description: 'Compreensão da sociedade, instituições e relações humanas.',
        category: 'HUMANAS',
        duration: '50h',
        progress: 0,
        icon: Users,
        color: 'bg-orange-600',
        tags: ['humanas', 'enem', 'ufrgs'],
        objectives: [
            "Analisar as relações entre indivíduo e sociedade",
            "Compreender os clássicos: Marx, Durkheim e Weber",
            "Discutir temas contemporâneos: Cultura, Trabalho e Desigualdade",
            "Desenvolver o olhar estranhamento e desnaturalização"
        ],
        modules: [
            {
                id: 'm_soc_intro',
                title: 'Módulo 1: Introdução à Sociologia',
                description: 'O surgimento da ciência da sociedade.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_soc_surgimento',
                        title: 'O Surgimento da Sociologia e o Positivismo',
                        duration: '1h 30m',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-orange-400">1. Por que a Sociologia nasceu?</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A Sociologia é uma ciência jovem ("filha do século XIX"). Ela nasceu de uma necessidade urgente: explicar o <strong>CAOS</strong>. A Europa passava pela <strong>Dupla Revolução</strong> (Industrial e Francesa), que destruiu o antigo modo de vida feudal e rural, jogando multidões nas cidades insalubres, criando novas classes sociais (burguesia e proletariado) e novas formas de pensar.
                                    </p>
                                    <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30 my-4">
                                        <p className="text-orange-200 text-sm italic">
                                            "A Sociologia é a ciência da crise." — Ela surge para tentar colocar ordem na bagunça social criada pela modernidade.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Revolução Industrial (Econômica)</h3>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside space-y-1">
                                            <li>Fim do artesão, início da maquinofatura.</li>
                                            <li>Êxodo Rural: Inchaço urbano desordenado.</li>
                                            <li>Surgimento do Proletariado (trabalhadores sem terra, donos apenas da prole).</li>
                                            <li><strong className="text-orange-400">Problema:</strong> Miséria, exploração, doenças.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Revolução Francesa (Política)</h3>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside space-y-1">
                                            <li>Queda do Antigo Regime (Rei/Igreja).</li>
                                            <li>Ascensão da Burguesia ao poder.</li>
                                            <li>Ideais de Liberdade, Igualdade e Fraternidade.</li>
                                            <li><strong className="text-orange-400">Problema:</strong> Instabilidade política, guilhotina, medo.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="text-2xl">🧪</span> Augusto Comte e o Positivismo
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        Comte é considerado o "Pai da Sociologia" (ele cunhou o termo, inicialmente chamando de <em>Física Social</em>). Sua filosofia, o <strong>Positivismo</strong>, acreditava que a ciência era a única forma de conhecimento verdadeiro e que a sociedade deveria ser estudada com o mesmo rigor das ciências naturais (como a Biologia ou a Astronomia).
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <strong className="block text-orange-300 text-sm">Ordem e Progresso</strong>
                                            <span className="text-[10px] text-zinc-500">Lema do Positivismo (e da bandeira do Brasil!). O progresso só vem se houver ordem social.</span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <strong className="block text-orange-300 text-sm">Lei dos 3 Estados</strong>
                                            <span className="text-[10px] text-zinc-500">Evolução humana: Teológico (Deus) → Metafísico (Filosofia) → Positivo (Ciência).</span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded text-center">
                                            <strong className="block text-orange-300 text-sm">Religião da Humanidade</strong>
                                            <span className="text-[10px] text-zinc-500">Substituir Deus pela Humanidade/Ciência. Cientistas seriam os novos sacerdotes.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_soc_durkheim', title: 'Émile Durkheim: O Fato Social', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_weber', title: 'Max Weber: Ação Social e Burocracia', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_marx_soc', title: 'Karl Marx: Luta de Classes e Mais-Valia', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_soc_cultura',
                title: 'Módulo 2: Cultura e Ideologia',
                description: 'Identidade, diversidade e indústria cultural.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_soc_cult_conc', title: 'Conceito Antropológico de Cultura', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_etno', title: 'Etnocentrismo e Relativismo Cultural', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_soc_ind_cult', title: 'Indústria Cultural (Adorno e Horkheimer)', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_ideologia', title: 'Ideologia e Alienação', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_soc_brasil',
                title: 'Módulo 3: Sociologia Brasileira',
                description: 'Os intérpretes do Brasil.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_soc_gilberto', title: 'Gilberto Freyre: Casa-Grande & Senzala', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_sergio', title: 'Sérgio Buarque: O Homem Cordial', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_caio', title: 'Caio Prado Jr: Formação do Brasil Contemporâneo', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_florestan', title: 'Florestan Fernandes: O Mito da Democracia Racial', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_soc_politica',
                title: 'Módulo 4: Poder e Política',
                description: 'Estado, democracia e movimentos sociais.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_soc_estado', title: 'Conceitos de Estado e Governo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_soc_cidadania', title: 'Cidadania: Civil, Política e Social (Marshall)', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_movimentos', title: 'Novos Movimentos Sociais', duration: '2h', status: 'Locked' },
                    { id: 'l_soc_desigualdade', title: 'Estratificação e Desigualdade Social', duration: '2h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'portuguese',
        title: 'Português',
        description: 'Domínio da norma culta, gramática e interpretação.',
        category: 'LINGUAGENS',
        duration: '110h',
        progress: 0,
        icon: BookA,
        color: 'bg-blue-600',
        tags: ['linguagens', 'enem', 'ufrgs'],
        objectives: [
            "Dominar a ortografia, morfologia e sintaxe",
            "Desenvolver estratégias avançadas de leitura",
            "Compreender a variação linguística",
            "Preparação completa para redação e questões objetivas"
        ],
        modules: [
            {
                id: 'm_port_fonologia',
                title: 'Módulo 1: Fonologia e Ortografia',
                description: 'Sons, letras e acentuação.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_port_fonemas',
                        title: 'Fonemas, Letras e Sílabas',
                        duration: '2h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-blue-400">1. O Som e o Símbolo</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Para começar a gramática, precisamos diferenciar o que ouvimos do que escrevemos.
                                        <br />
                                        <strong className="text-white">Fonema:</strong> É a menor unidade sonora. (O som /k/ em "Casa").
                                        <br />
                                        <strong className="text-white">Letra:</strong> É a representação gráfica do fonema. (A letra "C" em "Casa").
                                    </p>
                                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 my-4">
                                        <p className="text-blue-200 text-sm">
                                            <strong>Dica do ENEM:</strong> Nem sempre o número de letras é igual ao número de fonemas!
                                            <br />Ex: TÁXI (4 letras, 5 fonemas - /t/ /a/ /k/ /s/ /i/).
                                            <br />Ex: HOJE (4 letras, 3 fonemas - o H é mudo).
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Dígrafo (2 letras = 1 som)</h3>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside space-y-2">
                                            <li><strong className="text-blue-300">Vocálicos:</strong> AM, AN, EM, EN, IM... (falam pelo nariz). Ex: C<span className="text-white">am</span>po (/k/ /ã/ /p/ /o/).</li>
                                            <li><strong className="text-blue-300">Consonantais:</strong> CH, LH, NH, RR, SS, QU, GU, SC, XC. Ex: C<span className="text-white">h</span>ave (/x/ /a/ /v/ /e/).</li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">Dífono (1 letra = 2 sons)</h3>
                                        <p className="text-xs text-zinc-400 mb-2">Ocorre apenas com a letra <strong>X</strong> com som de /KS/.</p>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside space-y-2">
                                            <li>Tó<span className="text-white">x</span>ico (/ks/).</li>
                                            <li>Fi<span className="text-white">x</span>o (/ks/).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-xl font-bold text-white">Encontros Vocálicos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                        <div className="bg-black/20 p-3 rounded">
                                            <strong className="block text-red-300">Ditongo</strong>
                                            <span className="text-xs text-zinc-500">Vogal + Semivogal na mesma sílaba. (Ex: P<strong className="text-white">ai</strong>). Não separa!</span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded">
                                            <strong className="block text-green-300">Tritongo</strong>
                                            <span className="text-xs text-zinc-500">SV + V + SV na mesma sílaba. (Ex: Parag<strong className="text-white">uai</strong>). Não separa!</span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded">
                                            <strong className="block text-yellow-300">Hiato</strong>
                                            <span className="text-xs text-zinc-500">Vogal + Vogal. Elas se odeiam e ficam separadas. (Ex: S<strong className="text-white">a-í</strong>-da).</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-400 italic mt-2">
                                        *Lembre-se: Não existe sílaba sem vogal, e nunca há duas vogais verdadeiras (fortes) na mesma sílaba. Uma delas vira semivogal ou separa (hiato).
                                    </p>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_port_acentuacao', title: 'Regras de Acentuação e Crase', duration: '2h', status: 'Locked' },
                    { id: 'l_port_hifens', title: 'Uso do Hífen e Novo Acordo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_port_morfologia1', title: 'Estrutura e Formação das Palavras', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_port_morfologia',
                title: 'Módulo 2: Morfologia (Classes de Palavras)',
                description: 'Substantivos, Verbos, Pronomes e Conectivos.',
                locked: true,
                duration: '15h',
                status: 'Locked',
                lessons: [
                    { id: 'l_port_subs_adj', title: 'Substantivos e Adjetivos', duration: '2h', status: 'Locked' },
                    { id: 'l_port_verbos', title: 'Verbos: Tempos e Modos', duration: '3h', status: 'Locked' },
                    { id: 'l_port_pronomes', title: 'Pronomes e Colocação Pronominal', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_port_conjuncoes', title: 'Preposições e Conjunções (Conectivos)', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_port_sintaxe',
                title: 'Módulo 3: Sintaxe',
                description: 'Análise da frase e relação entre termos.',
                locked: true,
                duration: '15h',
                status: 'Locked',
                lessons: [
                    { id: 'l_port_sujeito', title: 'Tipos de Sujeito e Predicado', duration: '2h', status: 'Locked' },
                    { id: 'l_port_trans', title: 'Transitividade Verbal e Complementos', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_port_concordancia', title: 'Concordância Nominal e Verbal', duration: '3h', status: 'Locked' },
                    { id: 'l_port_regencia', title: 'Regência Nominal e Verbal', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_port_interp',
                title: 'Módulo 4: Interpretação de Texto',
                description: 'Estratégias de leitura e gêneros textuais.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_port_generos', title: 'Gêneros e Tipologias Textuais', duration: '2h', status: 'Locked' },
                    { id: 'l_port_funcoes', title: 'Funções da Linguagem', duration: '2h', status: 'Locked' },
                    { id: 'l_port_figuras', title: 'Figuras de Linguagem', duration: '2h', status: 'Locked' },
                    { id: 'l_port_intertext', title: 'Intertextualidade e Coesão/Coerência', duration: '2h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'literature',
        title: 'Literatura',
        description: 'Movimentos literários, escolas e obras obrigatórias.',
        category: 'LINGUAGENS',
        duration: '90h',
        progress: 0,
        icon: BookOpen,
        color: 'bg-rose-600',
        tags: ['linguagens', 'enem', 'ufrgs'],
        objectives: [
            "Analisar o contexto histórico e características das escolas literárias",
            "Ler e interpretar obras clássicas portuguesas e brasileiras",
            "Relacionar literatura com outras artes",
            "Desenvolver senso crítico estético"
        ],
        modules: [
            {
                id: 'm_lit_era_colonial',
                title: 'Módulo 1: Era Medieval e Colonial',
                description: 'Trovadorismo, Humanismo, Classicismo e Quinhentismo.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_lit_trovadorismo',
                        title: 'Trovadorismo: O Início de Tudo',
                        duration: '2h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-rose-400">1. A Idade das Trevas?</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        No século XII, Portugal estava nascendo. A literatura não era escrita para ser lida silenciosamente, mas para ser <strong>CANTADA</strong> (acompanhada de alaúdes, liras). O Trovadorismo reflete a sociedade feudal, com sua vassalagem e teocentrismo.
                                    </p>
                                </div>

                                <div className="bg-rose-900/10 p-6 rounded-2xl border border-rose-500/20">
                                    <h3 className="text-xl font-bold text-rose-300 mb-4">Cantigas Líricas (Sentimento)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <strong className="text-white block mb-1">Cantiga de AMOR</strong>
                                            <ul className="text-xs text-zinc-400 list-disc list-inside">
                                                <li>Eu-lírico: <span className="text-blue-400">Masculino</span>.</li>
                                                <li>Tema: Vassalagem Amorosa (o homem serve à mulher como serve ao suserano).</li>
                                                <li>Mulher: Inatingível, "Senhor".</li>
                                                <li>Ambiente: Palaciano (nobreza).</li>
                                                <li>Sofrimento: "Coita de amor" (dor de amar sem ser correspondido).</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Cantiga de AMIGO</strong>
                                            <ul className="text-xs text-zinc-400 list-disc list-inside">
                                                <li>Eu-lírico: <span className="text-pink-400">Feminino</span> (mas escrito por homens).</li>
                                                <li>Tema: Saudade do namorado (amigo) que foi pra guerra ou pro mar.</li>
                                                <li>Mulher: Camponesa simples.</li>
                                                <li>Ambiente: Rural/Natural (fala com as ondas, com as flores).</li>
                                                <li>Estrutura: Paralelismo (repetições).</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-xl font-bold text-white mb-4">Cantigas Satíricas (Zoeira)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <strong className="text-white block mb-1">Escárnio</strong>
                                            <p className="text-xs text-zinc-400">Crítica indireta, sem citar nomes. Ironia fina, duplo sentido. "Quem carapuça serviu...".</p>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Maldizer</strong>
                                            <p className="text-xs text-zinc-400">Crítica direta, cita o nome (fulano de tal). Palavrões, baixaria, agressão verbal explícita.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/10 flex gap-4 items-center">
                                    <span className="text-3xl">📜</span>
                                    <div>
                                        <strong className="text-white">Cancioneiros</strong>
                                        <p className="text-xs text-zinc-500">
                                            As cantigas foram compiladas séculos depois em livros chamados Cancioneiros (da Ajuda, da Vaticana, da Biblioteca Nacional).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_lit_humanismo', title: 'Humanismo e Gil Vicente', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_classicismo', title: 'Classicismo: Camões e Os Lusíadas', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_lit_quinhentismo', title: 'Quinhentismo: Carta de Caminha e Anchieta', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_lit_era_classica',
                title: 'Módulo 2: Barroco e Arcadismo',
                description: 'O conflito e o equilíbrio.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_lit_barroco_br', title: 'Barroco no Brasil: Gregório de Matos', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_vieira', title: 'Padre Antônio Vieira e os Sermões', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_arcadismo', title: 'Arcadismo e Inconfidência Mineira', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_bocage', title: 'O Arcadismo em Portugal: Bocage', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_lit_era_romantica',
                title: 'Módulo 3: Romantismo',
                description: 'O século XIX e a construção da identidade nacional.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_lit_rom_ind', title: '1ª Geração: Indianismo (Gonçalves Dias e Alencar)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_lit_rom_mal', title: '2ª Geração: Mal do Século (Álvares de Azevedo)', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_rom_cond', title: '3ª Geração: Condoreirismo (Castro Alves)', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_rom_prosa', title: 'Romance Romântico: O Guarani, A Moreninha', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_lit_era_realista',
                title: 'Módulo 4: Realismo, Naturalismo e Parnasianismo',
                description: 'A crítica social e a objetividade.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_lit_machado', title: 'Machado de Assis e o Realismo', duration: '3h', status: 'Locked' },
                    { id: 'l_lit_naturalismo', title: 'O Cortiço e o Naturalismo', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_parnasianismo', title: 'Parnasianismo: Arte pela Arte', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_lit_simbolismo', title: 'Simbolismo: Cruz e Sousa (O Cisne Negro)', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_lit_modernismo',
                title: 'Módulo 5: Pré-Modernismo e Modernismo',
                description: 'A Semana de 22 e suas fases.',
                locked: true,
                duration: '15h',
                status: 'Locked',
                lessons: [
                    { id: 'l_lit_pre_mod', title: 'Pré-Modernismo: Euclides da Cunha e Lima Barreto', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_sem_22', title: 'Semana de Arte Moderna de 1922', duration: '2h', status: 'Locked' },
                    { id: 'l_lit_mod_1', title: '1ª Fase (Heroica): Andrade e Bandeira', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_lit_mod_2_poesia', title: '2ª Fase (Poesia): Drummond e Cecília', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_lit_mod_2_prosa', title: '2ª Fase (Prosa): Graciliano e Jorge Amado', duration: '3h', status: 'Locked' },
                    { id: 'l_lit_mod_3', title: '3ª Fase (45): Clarice Lispector e Guimarães Rosa', duration: '3h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'english',
        title: 'Inglês',
        description: 'Reading comprehension and Grammar for exams.',
        category: 'LINGUAGENS',
        duration: '100h',
        progress: 0,
        icon: Languages,
        color: 'bg-red-600',
        tags: ['linguagens', 'enem'],
        objectives: [
            "Develop reading strategies (Skimming & Scanning)",
            "Master essential grammar points",
            "Expand vocabulary with focus on academic texts",
            "Interpret diverse text genres (cartoons, news, lyrics)"
        ],
        modules: [
            {
                id: 'm_eng_basico',
                title: 'Módulo 1: Foundations',
                description: 'Grammar basics to build sentences.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_eng_tobe',
                        title: 'Verb To Be & Pronouns: The Pillars',
                        duration: '2h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-red-500">1. O Verbo Mais Importante</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Em inglês, você não "tem" 18 anos, você "é" 18 anos. Você não "está" com fome, você "é" faminto. O <strong>Verb To Be</strong> significa SER ou ESTAR. Ele é a base de tudo.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2 text-xl">AM</strong>
                                        <p className="text-sm text-zinc-400">Usado APENAS com <strong>I</strong> (Eu).</p>
                                        <p className="text-xs text-red-400 mt-2">I am happy.</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2 text-xl">IS</strong>
                                        <p className="text-sm text-zinc-400">Usado com <strong>He, She, It</strong> (Singular).</p>
                                        <p className="text-xs text-red-400 mt-2">It is a dog.</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2 text-xl">ARE</strong>
                                        <p className="text-sm text-zinc-400">Usado com <strong>You, We, They</strong> (Plural/Você).</p>
                                        <p className="text-xs text-red-400 mt-2">We are students.</p>
                                    </div>
                                </div>

                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20 space-y-4">
                                    <h3 className="text-lg font-bold text-red-400">Pronouns Overview</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong className="block text-white mb-1">Subject (Faz a ação)</strong>
                                            <ul className="text-zinc-400 space-y-1">
                                                <li>I (Eu)</li>
                                                <li>You (Você)</li>
                                                <li>He/She/It (Ele/Ela/Coisa)</li>
                                                <li>We (Nós)</li>
                                                <li>They (Eles)</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong className="block text-white mb-1">Object (Recebe a ação)</strong>
                                            <ul className="text-zinc-400 space-y-1">
                                                <li>Me (Me)</li>
                                                <li>You (Te/Você)</li>
                                                <li>Him/Her/It (O/A/Lhe)</li>
                                                <li>Us (Nos)</li>
                                                <li>Them (Os/As/Lhes)</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded mt-2">
                                        <p className="text-xs text-zinc-300">
                                            Exemplo: <strong className="text-white">I</strong> love <strong className="text-white">her</strong>. (Eu a amo).
                                            <br />NUNCA diga "I love she".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_eng_present', title: 'Simple Present vs Present Continuous', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_past', title: 'Simple Past (Regular & Irregular)', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_future', title: 'Future: Will vs Going To', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_eng_reading',
                title: 'Módulo 2: Reading Strategies',
                description: 'Como ler sem traduzir tudo.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_eng_skim_scan', title: 'Skimming & Scanning', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_cognates', title: 'Cognates & False Friends', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_eng_connector', title: 'Linking Words (Connectors)', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_genres', title: 'Text Genres Practice', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_eng_grammar',
                title: 'Módulo 3: Advanced Grammar',
                description: 'Estruturas complexas para textos difíceis.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_eng_present_perf', title: 'Present Perfect (Have you ever?)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_eng_passive', title: 'Passive Voice', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_modals', title: 'Modal Verbs (Can, Should, Must)', duration: '2h', status: 'Locked' },
                    { id: 'l_eng_if_clauses', title: 'Conditionals (If Clusters)', duration: '2h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'spanish',
        title: 'Espanhol',
        description: 'Comprensión lectora y gramática para el examen.',
        category: 'LINGUAGENS',
        duration: '70h',
        progress: 0,
        icon: Languages,
        color: 'bg-yellow-600',
        tags: ['linguagens', 'enem'],
        objectives: [
            "Compreender textos jornalísticos e literários em espanhol",
            "Identificar 'falsos amigos' (heterosemânticos)",
            "Dominar as diferenças gramaticais chave entre Port/Esp",
            "Interpretar charges e tirinhas (Matfalda, Gaturro)"
        ],
        modules: [
            {
                id: 'm_esp_intro',
                title: 'Módulo 1: Introducción y Falsos Amigos',
                description: 'O básico que engana.',
                locked: false,
                duration: '8h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_esp_heteroseman',
                        title: 'Heterosemânticos (Falsos Amigos)',
                        duration: '2h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-yellow-500">1. Cuidado! Parece, mas não é.</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O português e o espanhol são irmãos (filhos do Latim), mas às vezes eles brigam. A maior armadilha do ENEM são os <strong>Heterosemânticos</strong>: palavras que escrevem igual (ou quase) mas têm significado totalmente diferente.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20">
                                        <h3 className="text-lg font-bold text-red-400 mb-3">Os Clássicos do "Erro"</h3>
                                        <ul className="text-sm space-y-3">
                                            <li className="flex justify-between border-b border-red-500/10 pb-2">
                                                <span className="text-yellow-200">Embarazada</span>
                                                <span className="text-zinc-400">Grávida (e não confusa!)</span>
                                            </li>
                                            <li className="flex justify-between border-b border-red-500/10 pb-2">
                                                <span className="text-yellow-200">Exquisito</span>
                                                <span className="text-zinc-400">Delicioso (e não estranho!)</span>
                                            </li>
                                            <li className="flex justify-between border-b border-red-500/10 pb-2">
                                                <span className="text-yellow-200">Pelado</span>
                                                <span className="text-zinc-400">Careca (e não nu!)</span>
                                            </li>
                                            <li className="flex justify-between border-b border-red-500/10 pb-2">
                                                <span className="text-yellow-200">Borracha</span>
                                                <span className="text-zinc-400">Bêbada (e não de apagar!)</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-3">Dicas de Leitura</h3>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            No texto, o contexto salva. Se diz "Comí un pastel exquisito", você sabe que comeu um bolo gostoso, não um bolo estranho.
                                        </p>
                                        <div className="bg-black/20 p-3 rounded mt-2">
                                            <strong className="text-yellow-400 block text-xs mb-1">Outros Perigos:</strong>
                                            <span className="text-[10px] text-zinc-500">
                                                Vaso (Copo), Copa (Taça), Taza (Xícara), Oficina (Escritório), Polvo (Pó), Cachorro (Filhote).
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_esp_articulos', title: 'Artículos y Contracciones', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_esp_heterogen', title: 'Heterogenéricos (El vs La)', duration: '2h', status: 'Locked' },
                    { id: 'l_esp_pronombres', title: 'Pronombres y Tratamiento (Tú vs Usted)', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_esp_grammar',
                title: 'Módulo 2: Gramática Contextualizada',
                description: 'Verbos e conectivos essenciais.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_esp_verbos', title: 'Verbos: Presente y Pasados (Pretéritos)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_esp_gustar', title: 'Verbo Gustar (A mí me gusta)', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_esp_conjunciones', title: 'Conjunciones (Pero, Sino, Sin Embargo)', duration: '2h', status: 'Locked' },
                    { id: 'l_esp_apocope', title: 'Apócope (Muy vs Mucho)', duration: '2h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'history',
        title: 'História',
        description: 'História Geral, do Brasil e do Rio Grande do Sul (Foco UFRGS/ENEM).',
        category: 'HUMANAS',
        duration: '120h',
        progress: 0,
        icon: Hourglass,
        color: 'bg-amber-600',
        tags: ['humanas', 'enem', 'ufrgs'],
        objectives: [
            "Compreender os processos históricos globais e locais",
            "Analisar a formação social e política do Brasil",
            "Dominar tópicos específicos da história do RS para UFRGS",
            "Desenvolver senso crítico sobre passado e presente"
        ],
        modules: [
            {
                id: 'm_hist_antiguidade',
                title: 'Módulo 1: Introdução e Antiguidade',
                description: 'Dos primeiros humanos à queda de Roma.',
                locked: false,
                duration: '10h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_hist_intro',
                        title: 'Teoria da História e Pré-História',
                        duration: '1h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-amber-400">1. O Que é História?</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        História não é apenas o estudo do passado, mas a ciência que estuda o ser humano e suas ações no tempo e no espaço. Para o ENEM e UFRGS, é fundamental entender a história como processo de mudança e permanência.
                                    </p>
                                    <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/30 my-4">
                                        <p className="text-amber-200 text-sm italic">
                                            "A história é filha de seu tempo." - Todo historiador escreve influenciado pela época em que vive. Fontes históricas podem ser escritas, orais, arqueológicas ou iconográficas.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-amber-400 mb-4">2. Periodização Clássica</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="text-white block mb-1">Pré-História</strong>
                                            <span className="text-zinc-400 text-sm">Do surgimento do homem à invenção da escrita (aprox. 4000 a.C.). Paleolítico (Pedra Lascada) e Neolítico (Pedra Polida/Agricultura).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="text-white block mb-1">Idade Antiga</strong>
                                            <span className="text-zinc-400 text-sm">Da escrita até a Queda de Roma (476 d.C.). Antiguidade Oriental (Egito, Mesopotâmia) e Clássica (Grécia, Roma).</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_oriental',
                        title: 'Antiguidade Oriental: Egito e Mesopotâmia',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-amber-400">1. Civilizações Hidráulicas</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O berço da civilização ocorreu onde havia água. No deserto árido do Oriente Médio, os grandes rios (Nilo, Tigre e Eufrates) permitiram a agricultura em larga escala, levando à sedentarização e ao surgimento do Estado.
                                    </p>
                                    <div className="bg-amber-900/10 p-4 rounded-xl border border-amber-500/20 my-4">
                                        <p className="text-amber-200 text-sm italic">
                                            "O Egito é uma dádiva do Nilo." - Heródoto. Sem as cheias regulares do rio, a civilização egípcia não existiria.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <span className="text-2xl">🏺</span> Egito Antigo
                                        </h3>
                                        <ul className="space-y-2 text-zinc-400 text-sm">
                                            <li><strong className="text-amber-400">Política:</strong> Teocracia (Faraó é um deus vivo).</li>
                                            <li><strong className="text-amber-400">Sociedade:</strong> Estamental (imóvel). Sacerdotes e Escribas no topo, camponeses (felás) na base.</li>
                                            <li><strong className="text-amber-400">Religião:</strong> Politeísta e Antropozoomórfica. Crença na vida após a morte (mumificação).</li>
                                            <li><strong className="text-amber-400">Economia:</strong> Modo de Produção Asiático (Servidão Coletiva). O Estado é dono das terras.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <span className="text-2xl">🦁</span> Mesopotâmia
                                        </h3>
                                        <p className="text-xs text-zinc-500 mb-2">Terra "entre rios" (Tigre e Eufrates). Atual Iraque.</p>
                                        <ul className="space-y-2 text-zinc-400 text-sm">
                                            <li><strong className="text-amber-400">Política:</strong> Cidades-Estado rivais (Ur, Uruk, Babilônia). Instabilidade política.</li>
                                            <li><strong className="text-amber-400">Legado:</strong> Código de Hamurábi ("Olho por olho"). Primeira lei escrita.</li>
                                            <li><strong className="text-amber-400">Arquitetura:</strong> Zigurat (Templos/Observatórios).</li>
                                            <li><strong className="text-amber-400">Escrita:</strong> Cuneiforme (em argila).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-lg font-bold text-white mb-2">Estudo de Caso: A Lei de Talião</h3>
                                    <p className="text-zinc-400 text-sm">
                                        O Código de Hamurábi não era igualitário. Se um nobre furasse o olho de um escravo, pagava uma multa. Se furasse o olho de outro nobre, perdia o olho. A lei refletia a hierarquia social. Para o ENEM: a escrita da lei servia para consolidar o poder do Estado sobre a vingança privada.
                                    </p>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_grecia',
                        title: 'Grécia Antiga: Democracia e Cultura',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-blue-400">1. O Berço do Ocidente</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A Grécia não era um país unificado, mas um conjunto de <strong className="text-white">Cidades-Estado (Polis)</strong> independentes que compartilhavam língua e religião. A geografia montanhosa favoreceu o isolamento e a autonomia política.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-blue-300">Atenas</h3>
                                            <span className="text-xs bg-blue-500/20 px-2 py-1 rounded text-blue-200">Democracia</span>
                                        </div>
                                        <ul className="space-y-2 text-zinc-400 text-sm">
                                            <li>• Foco intelectual e comercial (marítimo).</li>
                                            <li>• <strong className="text-white">Democracia Direta:</strong> Cidadãos votavam na Ágora.</li>
                                            <li>• <strong className="text-red-400">Exclusão:</strong> Mulheres, estrangeiros (metecos) e escravos NÃO eram cidadãos.</li>
                                            <li>• Século de Péricles: Apogeu cultural.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-red-300">Esparta</h3>
                                            <span className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-200">Oligarquia</span>
                                        </div>
                                        <ul className="space-y-2 text-zinc-400 text-sm">
                                            <li>• Foco militar e agrário (terrestre).</li>
                                            <li>• <strong className="text-white">Laconismo:</strong> Falar pouco e agir muito.</li>
                                            <li>• Sociedade estamental rígida (Espartiatas &gt; Periecos &gt; Hilotas).</li>
                                            <li>• Mulheres tinham mais liberdade física (para gerar guerreiros fortes).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-blue-400">2. Legado Cultural</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl text-center border border-white/5">
                                            <div className="text-2xl mb-2">🎭</div>
                                            <strong className="block text-white">Teatro</strong>
                                            <span className="text-xs text-zinc-400">Tragédia e Comédia como função pedagógica e cívica.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl text-center border border-white/5">
                                            <div className="text-2xl mb-2">🧠</div>
                                            <strong className="block text-white">Filosofia</strong>
                                            <span className="text-xs text-zinc-400">Sócrates, Platão e Aristóteles: o uso da razão (Logos) sobre o mito.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl text-center border border-white/5">
                                            <div className="text-2xl mb-2">🏛️</div>
                                            <strong className="block text-white">Arquitetura</strong>
                                            <span className="text-xs text-zinc-400">Busca pela harmonia, proporção e beleza ideal.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_roma',
                        title: 'Roma Antiga: Da Monarquia ao Império',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-red-500">1. O Grande Império</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Roma começou como uma vila de pastores e se tornou o maior império da Antiguidade, chamando o Mediterrâneo de <strong className="text-white italic">"Mare Nostrum"</strong> (Nosso Mar). Seu maior legado não foram as conquistas, mas o <strong className="text-amber-400">Direito Romano</strong>, base das leis ocidentais modernas.
                                    </p>
                                </div>

                                <div className="relative border-l-4 border-red-500 pl-6 py-2 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">A. República (509 a.C. - 27 a.C.)</h3>
                                        <p className="text-sm text-zinc-400">
                                            O poder estava no <strong className="text-white">Senado</strong> (aristocracia/patrícios). Foi a época da expansão territorial.
                                            <br />
                                            <span className="text-red-400">Conflito Social:</span> Patrícios vs Plebeus (que conquistaram direitos como o Tribuno da Plebe).
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">B. Império (27 a.C. - 476 d.C.)</h3>
                                        <p className="text-sm text-zinc-400">
                                            Centralização no Imperador (Augusto, César).
                                            <br />
                                            <span className="text-red-400">Política:</span> Pão e Circo (distração da plebe). Pax Romana.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <span className="text-2xl">✝️</span> A Ascensão do Cristianismo
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        Inicialmente perseguidos (pois negavam a divindade do imperador), os cristãos cresceram na crise do Império.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-zinc-500 mt-2">
                                        <div className="bg-black/30 p-2 rounded">Edito de Milão (313): Liberdade de culto.</div>
                                        <div className="bg-black/30 p-2 rounded">Edito de Tessalônica (380): Religião Oficial.</div>
                                    </div>
                                    <p className="text-zinc-400 text-sm">
                                        Quando Roma caiu, a Igreja Católica foi a única instituição que permaneceu em pé, inaugurando a Idade Média.
                                    </p>
                                </div>

                                <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                                    <strong className="text-red-300 block mb-1">Queda de Roma (476 d.C.)</strong>
                                    <ul className="text-sm text-zinc-400 list-disc list-inside">
                                        <li>Crise do Escravismo (falta de conquistas = falta de mão de obra).</li>
                                        <li>Corrupção e vastidão ingovernável.</li>
                                        <li>Invasões Bárbaras (Germânicas).</li>
                                        <li>Ruralização da economia (início do Feudalismo).</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    },
                ]
            },
            {
                id: 'm_hist_media',
                title: 'Módulo 2: Idade Média',
                description: 'Do Feudalismo ao nascimento da Burguesia.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    {
                        id: 'l_hist_feudalismo',
                        title: 'Alta Idade Média e Feudalismo',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. O Sistema Feudal</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Com a queda de Roma e as invasões bárbaras, as cidades esvaziaram. A Europa se ruralizou. O poder, antes centralizado no Imperador, fragmentou-se nas mãos dos senhores de terra. Terra era poder, não dinheiro.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-4 border-indigo-500">
                                        <strong className="block text-white mb-2">Politica</strong>
                                        <span className="text-sm text-zinc-400">Descentralizada. O Rei tinha pouco poder real ("Primus inter pares"). Quem manda no feudo é o Senhor Feudal.</span>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-4 border-indigo-500">
                                        <strong className="block text-white mb-2">Economia</strong>
                                        <span className="text-sm text-zinc-400">Agrária e de Subsistência. Pouco comércio, pouca moeda. Sistema de trocas naturais.</span>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border-t-4 border-indigo-500">
                                        <strong className="block text-white mb-2">Sociedade</strong>
                                        <span className="text-sm text-zinc-400">Estamental e Imóvel. A posição social é definida pelo nascimento e função divina.</span>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">As Três Ordens Medievais</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                            <span className="text-2xl">🙏</span>
                                            <div>
                                                <strong className="block text-indigo-300">Clero (Oratores)</strong>
                                                <span className="text-xs text-zinc-500">Os que rezam. Detinham o saber e a salvação.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                            <span className="text-2xl">⚔️</span>
                                            <div>
                                                <strong className="block text-red-300">Nobreza (Bellatores)</strong>
                                                <span className="text-xs text-zinc-500">Os que lutam. Detinham a terra e as armas.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                            <span className="text-2xl">🌾</span>
                                            <div>
                                                <strong className="block text-green-300">Camponeses/Servos (Laboratores)</strong>
                                                <span className="text-xs text-zinc-500">Os que trabalham. Sustentam todos. Presos à terra.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/20">
                                    <h3 className="text-lg font-bold text-indigo-300 mb-2">Conceito Chave: Suserania e Vassalagem</h3>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        Relação exclusiva entre <strong>NOBRES</strong>. O Suserano doa a terra (beneficium), o Vassalo jura fidelidade militar (auxilium et consilium). Esta rede de lealdades mantinha a Europa unida culturalmente, apesar da fragmentação política.
                                    </p>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_igreja',
                        title: 'O Poder da Igreja e Cultura Medieval',
                        duration: '1h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-yellow-500">1. A Grande Senhora Feudal</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A Igreja Católica Apostólica Romana era a maior instituição da Idade Média. Era a maior proprietária de terras (1/3 da Europa) e detinha o monopólio da cultura e da ideologia.
                                    </p>
                                    <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20 my-4 text-center">
                                        <p className="text-yellow-200 font-serif italic text-lg">"Fora da Igreja não há salvação."</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white">Clero Regular vs Secular</h3>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="text-white block">Secular (No Mundo)</strong>
                                            <span className="text-sm text-zinc-400">Padres, Bispos, Papa. Vivem entre os fiéis.</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="text-white block">Regular (Na Regra)</strong>
                                            <span className="text-sm text-zinc-400">Monges, Beneditinos, Franciscanos. Vivem em mosteiros, isolados para rezar e copiar livros.</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white">Mecanismos de Controle</h3>
                                        <ul className="space-y-2 text-sm text-zinc-400">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" />Excomunhão: Morte espiritual e exclusão social.</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" />Inquisição: Tribunal do Santo Ofício para julgar hereges.</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" />Index: Lista de livros proibidos.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 mt-4">
                                    <h3 className="text-lg font-bold text-white mb-2">Cultura e Universidade</h3>
                                    <p className="text-sm text-zinc-400 mb-4">
                                        A Igreja criou as primeiras Universidades (Paris, Bolonha, Oxford). O pensamento dominante era a <strong className="text-white">Escolástica</strong> (São Tomás de Aquino), tentando conciliar Fé (Bíblia/Cristianismo) com a Razão (Aristóteles).
                                    </p>
                                    <div className="text-xs text-zinc-500 bg-black/30 p-3 rounded-lg">
                                        Estilo Gótico: Catedrais verticais com vitrais, buscando a luz (Deus) e a altura, ensinando a bíblia aos analfabetos através das imagens.
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_isla',
                        title: 'Islã e Império Bizantino',
                        duration: '1h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-emerald-400">1. O Outro Lado do Mundo</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Enquanto a Europa Ocidental vivia o feudalismo e a ruralização, o Oriente preservava o brilho urbano e comercial.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Islã */}
                                    <div className="border border-emerald-500/20 bg-emerald-900/10 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2">☪️ O Islã</h3>
                                        <p className="text-sm text-zinc-300 mb-4">
                                            Fundado por <strong>Maomé (622 d.C. - Hégira)</strong>. Uma religião monoteísta que unificou as tribos árabes.
                                        </p>
                                        <div className="space-y-2 text-sm text-zinc-400">
                                            <p><strong>Corão:</strong> Livro sagrado.</p>
                                            <p><strong>Jihad:</strong> Esforço pela fé (ou Guerra Santa).</p>
                                            <p><strong>Legado:</strong> Álgebra, Algarismos "Arábicos", Medicina (Avicena), preservação de Aristóteles.</p>
                                        </div>
                                    </div>

                                    {/* Bizantino */}
                                    <div className="border border-purple-500/20 bg-purple-900/10 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">👑 Império Bizantino</h3>
                                        <p className="text-sm text-zinc-300 mb-4">
                                            O antigo Império Romano do Oriente. Capital: <strong>Constantinopla</strong>. Durou 1000 anos a mais que Roma.
                                        </p>
                                        <div className="space-y-2 text-sm text-zinc-400">
                                            <p><strong>Cesaropapismo:</strong> O Imperador chefe da Igreja.</p>
                                            <p><strong>Cisma do Oriente (1054):</strong> Criação da Igreja Ortodoxa.</p>
                                            <p><strong>Importância:</strong> Barreira contra o Islã na Europa e guardião da cultura grega.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_baixa_media',
                        title: 'Baixa Idade Média: Renascimento Comercial',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-orange-400">1. O Despertar da Europa</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A partir do século XI, o feudo ficou pequeno. Inovações agrícolas aumentaram a população. As <strong className="text-white">Cruzadas</strong> (guerras santas para retomar Jerusalém) reabriram o Mar Mediterrâneo, reativando o comércio com o Oriente.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2">Burgos</strong>
                                        <span className="text-sm text-zinc-400">Cidades muradas nascidas nas feiras medievais. Origem da "Burguesia" (comerciantes).</span>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2">Corporações de Ofício</strong>
                                        <span className="text-sm text-zinc-400">Sindicatos medievais de artesãos para controlar preços e a qualidade. Monopólio.</span>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="block text-white mb-2">Rotação de Culturas</strong>
                                        <span className="text-sm text-zinc-400">Técnica agrícola que permitiu o excedente de produção (para vender).</span>
                                    </div>
                                </div>

                                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20 space-y-4">
                                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                                        <span className="text-2xl">💀</span> A Crise do Século XIV
                                    </h3>
                                    <p className="text-sm text-zinc-300">
                                        O fim da Idade Média foi catastrófico, marcado pela "Tríade da Morte":
                                    </p>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li>1. <strong>Fome:</strong> Mudanças climáticas e esgotamento do solo.</li>
                                        <li>2. <strong>Peste Negra:</strong> Matou 1/3 da Europa. Falta de mão de obra valorizou o trabalho livre.</li>
                                        <li>3. <strong>Guerra:</strong> Guerra dos Cem Anos (França vs Inglaterra). Enfraqueceu a nobreza e fortaleceu os Reis.</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_hist_moderna',
                title: 'Módulo 3: Idade Moderna',
                description: 'Grandes Navegações, Renascimento e Absolutismo.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    {
                        id: 'l_hist_renascimento',
                        title: 'Renascimento Cultural e Científico',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-purple-400">1. O Homem no Centro</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O Renascimento não foi uma negação de Deus, mas uma valorização do Homem como sua maior criação. Iniciado na Itália (devido ao comércio e mecenato), marcou a transição da Idade Média para a Moderna.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-purple-500/30 bg-purple-900/10 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-purple-300 mb-4">Valores Renascentistas</h3>
                                        <ul className="space-y-3 text-sm text-zinc-300">
                                            <li><strong className="text-white">Antropocentrismo:</strong> Homem no centro vs Teocentrismo Medieval.</li>
                                            <li><strong className="text-white">Racionalismo:</strong> Verdade pela razão e experiência, não só pela fé.</li>
                                            <li><strong className="text-white">Classicismo:</strong> Inspiração na Grécia e Roma antigas.</li>
                                            <li><strong className="text-white">Hedonismo:</strong> Busca pelo prazer carnal e material.</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="block text-white mb-1">Mecenato</strong>
                                            <span className="text-xs text-zinc-400">Burgueses ricos e Papas patrocinavam artistas para ganhar prestígio (estátus social em troca de arte).</span>
                                        </div>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                            <strong className="block text-white mb-1">Ciência</strong>
                                            <span className="text-xs text-zinc-400">Heliocentrismo (Copérnico e Galileu): A Terra gira em torno do Sol. Quebra de paradigma total.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="text-3xl">🎨</div>
                                    <div>
                                        <h4 className="text-white font-bold">Tartarugas Ninja?</h4>
                                        <p className="text-xs text-zinc-500">
                                            Leonardo (Da Vinci), Michelangelo, Donatello e Rafael. Os quatro grandes mestres do Renascimento. Da Vinci é o arquétipo do polímata: pintor, engenheiro, anatomista.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_reformas',
                        title: 'Reformas Religiosas (Protestante e Contrarreforma)',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-red-400">1. A Cristandade se Divide</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        No século XVI, a autoridade inquestionável da Igreja Católica foi quebrada. O contexto era de corrupção (venda de indulgências), luxo do clero e desejo dos Reis de confiscar as terras da Igreja.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                                        <h3 className="text-lg font-bold text-blue-300 mb-2">Luteranismo</h3>
                                        <p className="text-xs text-zinc-400 mb-2">Martinho Lutero (Alemanha, 1517).</p>
                                        <ul className="text-xs text-zinc-300 list-disc list-inside">
                                            <li>Salvação pela Fé.</li>
                                            <li>Livre interpretação da Bíblia.</li>
                                            <li>Fim do celibato e imagens.</li>
                                            <li>Apoio dos Príncipes Alemães.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-orange-900/10 p-4 rounded-xl border border-orange-500/20">
                                        <h3 className="text-lg font-bold text-orange-300 mb-2">Calvinismo</h3>
                                        <p className="text-xs text-zinc-400 mb-2">João Calvino (Suíça).</p>
                                        <ul className="text-xs text-zinc-300 list-disc list-inside">
                                            <li><strong className="text-white">Predestinação Absoluta:</strong> Deus já escolheu quem será salvo.</li>
                                            <li>Sinal de salvação = Trabalho e Riqueza.</li>
                                            <li>Apoio da Burguesia (capitalismo).</li>
                                        </ul>
                                    </div>
                                    <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                                        <h3 className="text-lg font-bold text-red-300 mb-2">Anglicanismo</h3>
                                        <p className="text-xs text-zinc-400 mb-2">Henrique VIII (Inglaterra).</p>
                                        <ul className="text-xs text-zinc-300 list-disc list-inside">
                                            <li>Política &gt; Fé.</li>
                                            <li>O Rei queria se divorciar e tomar as terras da Igreja.</li>
                                            <li>O Rei vira chefe da Igreja Inglesa.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Contrarreforma Católica</h3>
                                    <p className="text-sm text-zinc-400">
                                        A resposta da Igreja no <strong>Concílio de Trento (1545)</strong>:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-zinc-300 columns-1 md:columns-2">
                                        <li>Proibição da venda de indulgências (moralização).</li>
                                        <li>Reafirmação dos dogmas (Papa infalível, 7 sacramentos).</li>
                                        <li>Criação dos <strong>Jesuítas (Companhia de Jesus)</strong>: Soldados de Cristo para catequizar o Novo Mundo (Brasil!).</li>
                                        <li>Retorno da Inquisição e Index.</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_absolutismo',
                        title: 'Absolutismo e Mercantilismo',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-amber-400">1. O Estado Sou Eu</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Na Idade Moderna, o Rei deixou de ser uma figura decorativa (medieval) para concentrar TODO o poder. O Absolutismo é a centralização política, apoiada pela Burguesia (que queria unificação de moedas/pesos) e justificada por teóricos.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-3">Teóricos do Absolutismo</h3>
                                        <ul className="space-y-3 text-sm text-zinc-400">
                                            <li><strong className="text-amber-200">Maquiavel (O Príncipe):</strong> "Os fins justificam os meios". O Rei deve ser amado e temido (se tiver que escolher, temido).</li>
                                            <li><strong className="text-amber-200">Hobbes (O Leviatã):</strong> O homem é o lobo do homem. O Rei garante a ordem contra o caos.</li>
                                            <li><strong className="text-amber-200">Bossuet:</strong> Teoria do Direito Divino. O Rei é representante de Deus na Terra. Rebelar-se contra o Rei é rebelar-se contra Deus.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20">
                                        <h3 className="text-lg font-bold text-amber-300 mb-3">Mercantilismo: O Motor Econômico</h3>
                                        <p className="text-sm text-zinc-300 mb-3">Conjunto de práticas para fortalecer o Estado. Não é uma teoria econômica (como o capitalismo), mas uma política.</p>
                                        <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                                            <li><strong className="text-white">Metalismo:</strong> Riqueza = quanto ouro tem no cofre.</li>
                                            <li><strong className="text-white">Balança Comercial Favorável:</strong> Exportar mais que importar.</li>
                                            <li><strong className="text-white">Protecionismo:</strong> Taxar produtos estrangeiros.</li>
                                            <li><strong className="text-white">Colonialismo:</strong> Ter colônias para explorar (Exclusivo Colonial).</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_navegacoes',
                        title: 'Expansão Marítima Europeia',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-cyan-400">1. O Mundo Fica Maior</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A Expansão Marítima foi a primeira globalização. Portugal e Espanha, pioneiros, contornaram a África e cruzaram o Atlântico buscando quebrar o monopólio italiano das especiarias. O resultado foi o encontro (choque) com a América.
                                    </p>
                                </div>

                                <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-cyan-300 mb-2">Por que Portugal foi o primeiro?</h3>
                                        <ul className="space-y-2 text-sm text-zinc-300">
                                            <li className="flex items-center gap-2">✅ <strong>Centralização Precoce:</strong> Revolução de Avis (1385).</li>
                                            <li className="flex items-center gap-2">✅ <strong>Geografia:</strong> "Cara para o mar".</li>
                                            <li className="flex items-center gap-2">✅ <strong>Escola de Sagres:</strong> Centro de estudos náuticos (bússola, astrolábio, caravela).</li>
                                        </ul>
                                    </div>
                                    <div className="text-6xl opacity-50">⛵</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="text-white block">Périplo Africano (Portugal)</strong>
                                        <span className="text-sm text-zinc-400">Contornar a África para chegar às Índias. Bartolomeu Dias (Cabo das Tormentas), Vasco da Gama (Chegada à Índia), Cabral (Brasil pelo caminho).</span>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <strong className="text-white block">Circunavegação (Espanha)</strong>
                                        <span className="text-sm text-zinc-400">Colombo tentou dar a volta ao mundo e achou a América (1492). Fernão de Magalhães provou que a Terra era redonda.</span>
                                    </div>
                                </div>

                                <div className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-lg font-bold text-white mb-2">Consequências Globais</h3>
                                    <p className="text-sm text-zinc-400">
                                        O eixo econômico saiu do Mediterrâneo para o <strong className="text-white">Atlântico</strong>. Começou o genocídio ameríndio e o tráfico negreiro transatlântico, bases da acumulação primitiva de capital europeu.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_hist_br_colonia',
                title: 'Módulo 4: Brasil Colônia',
                description: 'A construção do Brasil português.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    {
                        id: 'l_hist_br_pre',
                        title: 'Período Pré-Colonial e Indígenas',
                        duration: '1h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-green-500">1. Os Donos da Terra</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Antes de Cabral, milhões de pessoas viviam aqui. Não existia "o índio" (genérico), mas milhares de etnias (Tupi, Jê, Guarani, etc.) com línguas e culturas distintas. A história do Brasil não começa em 1500, começa milênios antes.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                                        <h3 className="text-lg font-bold text-green-300 mb-3">Antropofagia Ritual</h3>
                                        <p className="text-sm text-zinc-300">
                                            Para os Tupinambás, comer a carne do inimigo valente não era fome, era honra. Era incorporar a coragem do guerreiro derrotado. Os europeus usaram isso para justificar a "Guerra Justa" e escravidão.
                                        </p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-3">Período Pré-Colonial (1500-1530)</h3>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            Portugal não colonizou de imediato (lucrava mais nas Índias). Fez apenas feitorias para exploração.
                                        </p>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside">
                                            <li><strong className="text-white">Pau-Brasil:</strong> Extração predatória (tinta vermelha).</li>
                                            <li><strong className="text-white">Escambo:</strong> Troca de trabalho indígena por bugigangas (machados, espelhos). Sem moeda.</li>
                                            <li><strong className="text-white">Estanco:</strong> Monopólio régio sobre o pau-brasil.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_br_admin',
                        title: 'Administração Colonial (Capitanias e Gov. Geral)',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-green-400">1. A Ocupação Efetiva</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Após 1530, o comércio com as Índias decaiu e piratas (franceses) ameaçavam tomar o Brasil. Portugal decidiu colonizar: "Povoar para não perder".
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">failed</div>
                                        <h3 className="text-xl font-bold text-white mb-2">A. Capitanias Hereditárias (1534)</h3>
                                        <p className="text-sm text-zinc-400 mb-4">
                                            Tentativa de privatizar a colonização. O Rei dividiu o Brasil em 15 faixas e deu a donatários (Cartas de Doação e Forais).
                                        </p>
                                        <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-red-200 text-sm">
                                            <strong>Por que fracassou?</strong> Falta de recursos, ataques indígenas, tamanho imenso, distância da metrópole. Só Pernambuco e São Vicente prosperaram (graças ao açúcar).
                                        </div>
                                    </div>

                                    <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
                                        <h3 className="text-xl font-bold text-green-300 mb-2">B. Governo Geral (1548)</h3>
                                        <p className="text-sm text-zinc-300 mb-4">
                                            Centralização administrativa para salvar as capitanias. Capital: Salvador.
                                        </p>
                                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
                                            <li className="bg-black/20 p-2 rounded">
                                                <strong className="block text-white mb-1">Tomé de Sousa</strong>
                                                Chegada dos Jesuítas, fundação de Salvador.
                                            </li>
                                            <li className="bg-black/20 p-2 rounded">
                                                <strong className="block text-white mb-1">Duarte da Costa</strong>
                                                Invasão Francesa no RJ, conflitos com índios.
                                            </li>
                                            <li className="bg-black/20 p-2 rounded">
                                                <strong className="block text-white mb-1">Mem de Sá</strong>
                                                Expulsão dos franceses, "paz" armada.
                                            </li>
                                        </ul>
                                        <p className="text-xs text-zinc-500 mt-4 italic">
                                            Nota: As Câmaras Municipais (Homens Bons) eram o poder local, muitas vezes batendo de frente com o Governador.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_br_acucar',
                        title: 'Economia Açucareira e Sociedade Escravocrata',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-white">1. O Ouro Branco</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O Açúcar foi escolhido pois Portugal já tinha experiência (ilhas atlânticas), o solo era bom (massapê no Nordeste) e o produto tinha alto valor na Europa. A Holanda financiou e refinou.
                                    </p>
                                </div>

                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                    <h3 className="text-2xl font-black text-white mb-4">O Plantation</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="text-xl mb-1">🚜</div>
                                            <div className="font-bold text-sm text-zinc-300">Latifúndio</div>
                                            <div className="text-[10px] text-zinc-500">Grandes terras</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="text-xl mb-1">🌾</div>
                                            <div className="font-bold text-sm text-zinc-300">Monocultura</div>
                                            <div className="text-[10px] text-zinc-500">Só açúcar</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="text-xl mb-1">🚢</div>
                                            <div className="font-bold text-sm text-zinc-300">Exportação</div>
                                            <div className="text-[10px] text-zinc-500">Para fora</div>
                                        </div>
                                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                            <div className="text-xl mb-1">⛓️</div>
                                            <div className="font-bold text-sm text-red-300">Escravidão</div>
                                            <div className="text-[10px] text-red-400">Mão de obra</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-white">Sociedade Açucareira</h2>
                                    <div className="flex flex-col gap-2">
                                        <div className="w-full bg-white/10 p-4 rounded-t-xl text-center border-b border-white/5">
                                            <strong className="text-white">Senhores de Engenho</strong>
                                            <span className="block text-xs text-zinc-400">A elite branca. Poder patriarcal absoluto.</span>
                                        </div>
                                        <div className="w-full bg-white/5 p-3 text-center border-b border-white/5 opacity-80">
                                            <strong className="text-zinc-300">Homens Livres</strong>
                                            <span className="block text-xs text-zinc-500">Padres, feitores, comerciantes. Camada fina e dependente.</span>
                                        </div>
                                        <div className="w-full bg-black/40 p-6 rounded-b-xl text-center border-t border-white/5">
                                            <strong className="text-red-400">Escravizados (Mãos e Pés)</strong>
                                            <span className="block text-xs text-zinc-500">A base da pirâmide. Coisificação do ser humano. Resistência (Quilombos).</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-500 italic mt-2">
                                        "O Brasil é o inferno dos negros, o purgatório dos brancos e o paraíso dos mulatos." (Ditado colonial, refletindo a mestiçagem e violência).
                                    </p>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_br_interior',
                        title: 'Expansão Territorial e Bandeiras',
                        duration: '1h 30m',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-amber-600">1. Rompendo Tordesilhas</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        O Brasil desenhado em Tordesilhas era uma tira de terra no litoral. O Brasil gigante de hoje foi construído pela interiorização, muitas vezes violenta e ignorando a lei internacional.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Fatores da Interiorização</h3>
                                        <ul className="space-y-3 text-sm text-zinc-400">
                                            <li><strong className="text-white">Pecuária:</strong> O gado foi expulso do litoral (que era para açúcar) e foi para o Sertão (São Francisco: Rio dos Currais).</li>
                                            <li><strong className="text-white">Drogas do Sertão:</strong> Jesuítas e exploração na Amazônia (cacau, guaraná).</li>
                                            <li><strong className="text-white">União Ibérica (1580-1640):</strong> Como Portugal e Espanha viraram um só país, a linha de Tordesilhas perdeu o sentido prático temporariamente.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20">
                                        <h3 className="text-lg font-bold text-amber-500 mb-2">Os Bandeirantes</h3>
                                        <p className="text-sm text-zinc-300 mb-4">
                                            Paulistas pobres, mamelucos, que entravam no mato para sobreviver. Heróis ou Vilões?
                                        </p>
                                        <div className="space-y-2 text-xs text-zinc-400">
                                            <p><strong className="text-amber-300">Caça ao Índio:</strong> Para escravizar (mão de obra barata para SP).</p>
                                            <p><strong className="text-amber-300">Sertanismo de Contrato:</strong> Contratados para destruir Quilombos (Ex: Domingos Jorge Velho destruiu Palmares).</p>
                                            <p><strong className="text-amber-300">Busca por Ouro:</strong> Fernão Dias e Borba Gato. Encontraram Minas Gerais.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_hist_br_ouro',
                        title: 'O Ciclo do Ouro e a Sociedade Mineira',
                        duration: '2h',
                        status: 'Locked',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-yellow-400">1. O Século do Ouro (XVIII)</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A descoberta de ouro em Minas Gerais mudou o Brasil. O eixo econômico e político desceu do Nordeste (Salvador) para o Sudeste (Rio de Janeiro virou capital em 1763 para escoar o ouro).
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-3">Impostos e Controle</h3>
                                        <p className="text-sm text-zinc-400 mb-2">Portugal apertou o cerco ("Derrama") para evitar contrabando (Santo do Pau Oco).</p>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside">
                                            <li><strong className="text-yellow-300">Quinto:</strong> 20% de tudo para o Rei.</li>
                                            <li><strong className="text-yellow-300">Casas de Fundição:</strong> Só ouro em barra selada circulava.</li>
                                            <li><strong className="text-yellow-300">Capitação:</strong> Imposto por cabeça de escravo.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-3">Sociedade Mineradora</h3>
                                        <p className="text-sm text-zinc-400 mb-2">Diferente da açucareira, era <strong className="text-white">Urbana</strong> e mais flexível.</p>
                                        <ul className="text-xs text-zinc-400 list-disc list-inside">
                                            <li>Surgimento de uma <strong className="text-white">Classe Média</strong> (artesãos, intelectuais).</li>
                                            <li>Possibilidade de alforria (escravo de ganho).</li>
                                            <li>Vida cultural intensa (Arcadismo).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#1A1B26] p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                                    <div className="text-4xl">⛪</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Barroco Mineiro</h3>
                                        <p className="text-sm text-zinc-400">
                                            A expressão artística do ouro. Aleijadinho. Igrejas simples por fora, mas cobertas de ouro por dentro (alma pura, corpo simples). Uma arte feita por mestiços para uma sociedade em transformação.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]
            },
            {
                id: 'm_hist_revolucoes',
                title: 'Módulo 5: Era das Revoluções',
                description: 'O fim do Antigo Regime e o mundo burguês.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_hist_iluminismo', title: 'Iluminismo e Liberalismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_rev_ind', title: 'Revolução Industrial', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_rev_fr', title: 'Revolução Francesa', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_napoleao', title: 'Era Napoleônica e Congresso de Viena', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_indep_ame', title: 'Independência da América Espanhola e EUA', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_hist_br_imperio',
                title: 'Módulo 6: Brasil Império',
                description: 'A consolidação do Estado Nacional Brasileiro.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_hist_br_indep', title: 'Processo de Independência e 1º Reinado', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_br_regencia', title: 'Período Regencial e Revoltas', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_br_2reinado', title: '2º Reinado: Café e Estabilidade', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_br_escravidao', title: 'A Escravidão e o Abolicionismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_br_crise_imp', title: 'Guerra do Paraguai e Crise do Império', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_hist_contemp',
                title: 'Módulo 7: Mundo Contemporâneo (Séc. XX)',
                description: 'Guerras, ideologias e o mundo atual.',
                locked: true,
                duration: '15h',
                status: 'Locked',
                lessons: [
                    { id: 'l_hist_imperialismo', title: 'Imperialismo e Neocolonialismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_ww1', title: 'Primeira Guerra Mundial e Revolução Russa', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_crise29', title: 'Crise de 29 e Totalitarismos (Nazifascismo)', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_ww2', title: 'Segunda Guerra Mundial', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_guerra_fria', title: 'Guerra Fria e Nova Ordem Mundial', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_hist_br_rep',
                title: 'Módulo 8: Brasil República',
                description: 'Do Marechal Deodoro aos dias atuais.',
                locked: true,
                duration: '14h',
                status: 'Locked',
                lessons: [
                    { id: 'l_hist_br_rep_velha', title: 'República Velha (Oligárquica)', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_br_vargas', title: 'Era Vargas (1930-1945)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_hist_br_populismo', title: 'República Populista (1946-1964)', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_br_ditadura', title: 'Regime Militar (1964-1985)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_hist_br_nova_rep', title: 'Redemocratização e Nova República', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_hist_rs',
                title: 'Módulo 9: História do RS (UFRGS)',
                description: 'Conteúdo específico para o vestibular da UFRGS.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_hist_rs_indigenas', title: 'Povos Indígenas e Missões Jesuíticas', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_rs_formacao', title: 'Formação do Território e Tropeirismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_rs_guerras', title: 'Guerra dos Farrapos e Conflitos Platinos', duration: '2h', status: 'Locked' },
                    { id: 'l_hist_rs_rep', title: 'O RS na República: Castilhismo e Borgismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_hist_rs_contemp', title: 'Economia e Sociedade Gaúcha Contemporânea', duration: '1h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'philosophy',
        title: 'Filosofia',
        description: 'Da Grécia Antiga aos dilemas contemporâneos: Ética, Política e Metafísica.',
        category: 'HUMANAS',
        duration: '60h',
        progress: 0,
        icon: BookA,
        color: 'bg-fuchsia-600',
        tags: ['humanas', 'enem', 'ufrgs'],
        objectives: [
            "Compreender a evolução do pensamento ocidental",
            "Relacionar conceitos filosóficos e atualidades",
            "Analisar textos clássicos de Platão a Foucault",
            "Desenvolver argumentação crítica e lógica"
        ],
        modules: [
            {
                id: 'm_filo_intro',
                title: 'Módulo 1: O Surgimento da Filosofia',
                description: 'A passagem do Mito ao Logos e os Pré-Socráticos.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_filo_intro',
                        title: 'Mito vs. Logos: O Nascimento da Razão',
                        duration: '1h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-fuchsia-400">1. O Despertar da Consciência</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A Filosofia nasce na Grécia (séc. VI a.C.) quando o ser humano deixa de se contentar com explicações sobrenaturais (<strong className="text-white">Mito</strong>) para os fenômenos da natureza e passa a buscar respostas racionais e causais (<strong className="text-white">Logos</strong>).
                                    </p>
                                    <div className="bg-fuchsia-900/20 p-4 rounded-xl border border-fuchsia-500/30 my-4">
                                        <p className="text-fuchsia-200 text-sm italic">
                                            "A filosofia começa com a admiração." — Aristóteles. É o espanto diante do mundo que nos faz perguntar os "porquês".
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-fuchsia-400 mb-4">2. Comparativo Fundamental</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">⚡</div>
                                            <strong className="text-white text-lg block mb-2">Consciência Mítica</strong>
                                            <ul className="text-zinc-400 text-sm space-y-2">
                                                <li>• Explicações sobrenaturais/divinas.</li>
                                                <li>• Verdade revelada e inquestionável.</li>
                                                <li>• Narrativas fantásticas e poéticas.</li>
                                                <li>• Ex: "Chove porque Zeus está triste."</li>
                                            </ul>
                                        </div>
                                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">📐</div>
                                            <strong className="text-white text-lg block mb-2">Consciência Filosófica</strong>
                                            <ul className="text-zinc-400 text-sm space-y-2">
                                                <li>• Explicações racionais e lógicas (Logos).</li>
                                                <li>• Verdade buscada e debatida.</li>
                                                <li>• Argumentação crítica e coerente.</li>
                                                <li>• Ex: "Chove devido ao ciclo da água."</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-800/50 p-4 rounded-xl border-l-4 border-fuchsia-500">
                                    <strong className="text-white">Condições Históricas:</strong> Navegações, invenção da moeda, da escrita alfabética e da política (pólis) criaram o ambiente propício para a troca de ideias e o surgimento do pensamento crítico.
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'l_filo_pre',
                        title: 'Os Pré-Socráticos e a Arché',
                        duration: '1h 30m',
                        status: 'Locked'
                    }
                ]
            },
            {
                id: 'm_filo_classica',
                title: 'Módulo 2: Filosofia Clássica (Socrática)',
                description: 'Sócrates, Platão e Aristóteles: Os pilares do ocidente.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_socrates', title: 'Sócrates e os Sofistas: A busca pela verdade', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_platao', title: 'Platão: O Mundo das Ideias e A República', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_filo_aristoteles', title: 'Aristóteles: Metafísica, Ética e Política', duration: '2h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_filo_helen_med',
                title: 'Módulo 3: Helenismo e Idade Média',
                description: 'A busca pela felicidade e o encontro da Fé com a Razão.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_helenismo', title: 'Escolas Helenísticas: Estoicismo e Epicurismo', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_agostinho', title: 'Patrística: Santo Agostinho e o Tempo', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_tomas', title: 'Escolástica: São Tomás de Aquino', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_maquiavel', title: 'Renascimento: O Realismo de Maquiavel', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_filo_moderna',
                title: 'Módulo 4: Filosofia Moderna (Epistemologia)',
                description: 'Racionalismo, Empirismo e a Teoria do Conhecimento.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_descartes', title: 'Racionalismo: Descartes e a Dúvida Metódica', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_empirismo', title: 'Empirismo: Locke e Hume', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_kant', title: 'Kant: A Revolução Copernicana na Filosofia', duration: '2h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_filo_politica',
                title: 'Módulo 5: Filosofia Política Moderna',
                description: 'A origem do Estado e o Contratualismo.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_hobbes', title: 'Thomas Hobbes: O Leviatã', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_filo_locke_pol', title: 'John Locke: Liberalismo Político', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_filo_rousseau', title: 'Rousseau: O Contrato Social', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_filo_contemp1',
                title: 'Módulo 6: O Século XIX e a Crise da Razão',
                description: 'Idealismo, Materialismo e Vitalismo.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_hegel', title: 'Hegel e a Dialética', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_marx', title: 'Karl Marx: Materialismo Histórico', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_nietzsche', title: 'Nietzsche: A Morte de Deus', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_schopenhauer', title: 'Schopenhauer: O Mundo como Vontade', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_filo_contemp2',
                title: 'Módulo 7: Filosofia Contemporânea',
                description: 'Existencialismo, Escola de Frankfurt e Pós-Modernidade.',
                locked: true,
                duration: '12h',
                status: 'Locked',
                lessons: [
                    { id: 'l_filo_existencialismo', title: 'Sartre e o Existencialismo', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_foucault', title: 'Michel Foucault: Poder e Disciplina', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_frankfurt', title: 'Escola de Frankfurt e Indústria Cultural', duration: '2h', status: 'Locked' },
                    { id: 'l_filo_bauman', title: 'Bauman e a Modernidade Líquida', duration: '1h 30m', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'geography',
        title: 'Geografia',
        description: 'Geografia Física, Humana, Geopolítica e Regional (Brasil e RS).',
        category: 'HUMANAS',
        duration: '90h',
        progress: 0,
        icon: Globe,
        color: 'bg-indigo-500',
        tags: ['humanas', 'enem', 'ufrgs'],
        objectives: [
            "Dominar a leitura e interpretação de mapas e escalas",
            "Compreender as dinâmicas climáticas e ambientais",
            "Analisar a organização do espaço geográfico mundial e brasileiro",
            "Entender os processos de globalização e geopolítica"
        ],
        modules: [
            {
                id: 'm_cartografia',
                title: 'Módulo 1: Cartografia e Geologia',
                description: 'A base da geografia: mapas, escalas e a estrutura da Terra.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_coord_fuso',
                        title: 'Coordenadas Geográficas e Fusos Horários',
                        duration: '1h 30m',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-indigo-400">1. O Sistema de Endereçamento da Terra</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Para navegar no mundo, precisamos de um sistema de referência universal. A <strong>Cartografia</strong> criou uma malha imaginária que envolve o planeta, permitindo localizar qualquer ponto com precisão matemática.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                            <h3 className="text-xl font-bold text-white mb-2">Latitude (Paralelos)</h3>
                                            <p className="text-zinc-400 text-sm">
                                                Distância em graus em relação à <strong className="text-indigo-400">Linha do Equador</strong> (0°). Varia de 0° a 90° para o Norte (N) ou Sul (S).
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-2">Dita os climas (zonas térmicas).</p>
                                        </div>
                                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                            <h3 className="text-xl font-bold text-white mb-2">Longitude (Meridianos)</h3>
                                            <p className="text-zinc-400 text-sm">
                                                Distância em graus em relação ao <strong className="text-indigo-400">Meridiano de Greenwich</strong> (0°). Varia de 0° a 180° para o Leste (E) ou Oeste (W).
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-2">Define os fusos horários.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-indigo-400 mb-4">2. Fusos Horários</h2>
                                    <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
                                        <p className="text-zinc-300 text-sm">
                                            A Terra gira 360° em aproximadamente 24 horas. Portanto:
                                            <br />
                                            <span className="font-mono text-indigo-300 text-lg block mt-2">360° ÷ 24h = 15° por hora</span>
                                        </p>
                                        <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                                            <li>Para Leste (→), as horas <strong>aumentam</strong> (o sol nasce antes).</li>
                                            <li>Para Oeste (←), as horas <strong>diminuem</strong>.</li>
                                        </ul>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Fusos no Brasil</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <div className="p-3 bg-zinc-800 rounded-lg text-center">
                                            <strong className="block text-indigo-300 mb-1">-2 GMT</strong>
                                            Ilhas Oceânicas (Noronha)
                                        </div>
                                        <div className="p-3 bg-zinc-800 rounded-lg border border-indigo-500/50 text-center">
                                            <strong className="block text-indigo-300 mb-1">-3 GMT</strong>
                                            Brasília (Oficial)
                                        </div>
                                        <div className="p-3 bg-zinc-800 rounded-lg text-center">
                                            <strong className="block text-indigo-300 mb-1">-4 GMT</strong>
                                            AM, RO, RR, MS, MT
                                        </div>
                                        <div className="p-3 bg-zinc-800 rounded-lg text-center">
                                            <strong className="block text-indigo-300 mb-1">-5 GMT</strong>
                                            Acre e oeste do AM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_proj_esc', title: 'Projeções Cartográficas e Escalas', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_tec_rochas', title: 'Tectônica de Placas e Tipos de Rochas', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_relevo', title: 'Agentes do Relevo (Internos e Externos)', duration: '1h', status: 'Locked' }
                ]
            },
            {
                id: 'm_clima_veg',
                title: 'Módulo 2: Climatologia e Biogeografia',
                description: 'Dinâmicas atmosféricas e os grandes biomas.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_atm_clima', title: 'Camadas da Atmosfera e Fatores Climáticos', duration: '2h', status: 'Locked' },
                    { id: 'l_fen_clim', title: 'Fenômenos Climáticos (El Niño, Monções)', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_biomas_mund', title: 'Biomas Mundiais', duration: '2h', status: 'Locked' },
                    { id: 'l_biomas_br', title: 'Domínios Morfoclimáticos do Brasil', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_hidro_amb',
                title: 'Módulo 3: Hidrografia e Meio Ambiente',
                description: 'Recursos hídricos e impactos ambientais.',
                locked: true,
                duration: '6h',
                status: 'Locked',
                lessons: [
                    { id: 'l_ciclo_agua', title: 'Ciclo da Água e Bacias Hidrográficas', duration: '2h', status: 'Locked' },
                    { id: 'l_hidro_br', title: 'Bacias Hidrográficas do Brasil', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_impactos', title: 'Problemas Ambientais Urbanos e Rurais', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_conf_amb', title: 'Conferências Ambientais e Desenvolvimento Sustentável', duration: '1h', status: 'Locked' }
                ]
            },
            {
                id: 'm_população',
                title: 'Módulo 4: Demografia e Urbanização',
                description: 'Dinâmicas populacionais e o espaço urbano.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_teorias_dem', title: 'Teorias Demográficas e Transição', duration: '2h', status: 'Locked' },
                    { id: 'l_migracoes', title: 'Fluxos Migratórios Nacionais e Internacionais', duration: '2h', status: 'Locked' },
                    { id: 'l_urb_proc', title: 'Processo de Urbanização e Conceitos', duration: '2h', status: 'Locked' },
                    { id: 'l_urb_br', title: 'Rede Urbana Brasileira', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_agraria',
                title: 'Módulo 5: Geografia Agrária',
                description: 'O espaço rural e a produção de alimentos.',
                locked: true,
                duration: '6h',
                status: 'Locked',
                lessons: [
                    { id: 'l_sist_agri', title: 'Sistemas Agrícolas (Intensivo vs Extensivo)', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_agri_br', title: 'Agropecuária no Brasil e Commodities', duration: '2h', status: 'Locked' },
                    { id: 'l_estru_fund', title: 'Estrutura Fundiária e Reforma Agrária', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_tenc_campo', title: 'Conflitos no Campo Brasileiro', duration: '1h', status: 'Locked' }
                ]
            },
            {
                id: 'm_ind_energia',
                title: 'Módulo 6: Indústria e Energia',
                description: 'Evolução industrial e fontes de energia.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_rev_ind', title: 'As Revoluções Industriais e Modelos (Fordismo, Toyotismo)', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_ind_br', title: 'Industrialização Brasileira', duration: '2h', status: 'Locked' },
                    { id: 'l_energia_fossil', title: 'Fontes de Energia Não-Renováveis', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_energia_renov', title: 'Fontes Renováveis e Matriz Energética', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_geopol',
                title: 'Módulo 7: Geopolítica e Globalização',
                description: 'A ordem mundial e os conflitos atuais.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_ordem_mundial', title: 'Guerra Fria e Nova Ordem Mundial', duration: '2h', status: 'Locked' },
                    { id: 'l_glob_blocos', title: 'Globalização e Blocos Econômicos', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_conflitos_om', title: 'Conflitos no Oriente Médio', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_geopol_atual', title: 'Geopolítica Contemporânea (EUA, China, Rússia)', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_geo_rs',
                title: 'Módulo 8: Geografia do RS (UFRGS)',
                description: 'Física e Humana do Rio Grande do Sul.',
                locked: true,
                duration: '5h',
                status: 'Locked',
                lessons: [
                    { id: 'l_rs_fisica', title: 'Relevo, Clima e Hidrografia do RS', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_rs_veg', title: 'Biomas do RS: Pampa e Mata Atlântica', duration: '1h', status: 'Locked' },
                    { id: 'l_rs_humana', title: 'População e Economia Gaúcha', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_rs_regioes', title: 'Regionalização do RS (Coredes)', duration: '1h', status: 'Locked' }
                ]
            }
        ]
    },
    {
        id: 'art_history',
        title: 'História da Arte',
        description: 'Da Pré-História à Arte Contemporânea: Movimentos, Vanguardas e Arte Brasileira.',
        category: 'ARTES',
        duration: '45h',
        progress: 0,
        icon: Palette,
        color: 'bg-rose-600',
        tags: ['artes', 'enem', 'ufrgs', 'humanas'],
        objectives: [
            "Analisar a evolução estética e cultural da humanidade",
            "Compreender as Vanguardas Europeias e o Modernismo Brasileiro",
            "Interpretar obras de arte em seu contexto histórico",
            "Identificar características dos principais movimentos artísticos"
        ],
        modules: [
            {
                id: 'm_arte_antiga',
                title: 'Módulo 1: Das Cavernas à Antiguidade',
                description: 'Pré-História, Egito, Grécia e Roma.',
                locked: false,
                duration: '6h',
                status: 'In Progress',
                lessons: [
                    {
                        id: 'l_arte_intro_pre',
                        title: 'Introdução e Arte na Pré-História',
                        duration: '1h',
                        status: 'In Progress',
                        content: (
                            <div className="space-y-8">
                                <div className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-rose-400">1. O Que é Arte?</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        A arte é uma manifestação humana que busca comunicar emoções, ideias e visões de mundo através de formas estéticas. Desde o início, o ser humano sentiu necessidade de deixar sua marca.
                                    </p>
                                </div>
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-lg font-bold text-white mb-3">Arte Rupestre</h3>
                                    <p className="text-sm text-zinc-400 mb-2">
                                        Pinturas em cavernas (Lascaux, Altamira, Serra da Capivara).
                                    </p>
                                    <ul className="text-xs text-zinc-400 list-disc list-inside">
                                        <li><strong className="text-rose-300">Naturalismo:</strong> Representação fiel dos animais.</li>
                                        <li><strong className="text-rose-300">Função Mágica (Simpatia):</strong> Acredita-se que pintar o animal facilitava a caça.</li>
                                        <li><strong className="text-rose-300">Mão em Negativo:</strong> Primeira assinatura humana.</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    },
                    { id: 'l_arte_egito', title: 'Arte Egípcia: A Lei da Frontalidade', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_grecia', title: 'Arte Grega: A Busca pelo Ideal de Beleza', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_roma', title: 'Arte Romana: Engenharia e Realismo', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_arte_medieval_renasc',
                title: 'Módulo 2: Do Sagrado ao Humano',
                description: 'Arte Medieval, Gótica e o Renascimento.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_arte_bizantina', title: 'Arte Bizantina e Paleocristã', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_gotica', title: 'O Estilo Gótico e as Catedrais', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_renascimento', title: 'Renascimento: Perspectiva e Humanismo', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_arte_maneirismo', title: 'Maneirismo: A Ruptura da Harmonia', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_arte_moderna_1',
                title: 'Módulo 3: Do Barroco ao Impressionismo',
                description: 'A emoção, a luz e a ruptura com a academia.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_arte_barroco', title: 'Barroco: Luz, Sombra e Emoção', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_rococo_neo', title: 'Rococó e Neoclassicismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_romantismo', title: 'Romantismo e Realismo', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_impressionismo', title: 'Impressionismo: A Captura do Instante', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_arte_vanguardas',
                title: 'Módulo 4: Vanguardas Europeias',
                description: 'Os "Ismos" que mudaram a arte no século XX.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_arte_cubismo', title: 'Cubismo e Futurismo', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_expressionismo', title: 'Expressionismo e Fauvismo', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_dada_surreal', title: 'Dadaísmo e Surrealismo', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_abstra', title: 'Abstracionismo', duration: '1h 30m', status: 'Locked' }
                ]
            },
            {
                id: 'm_arte_brasil',
                title: 'Módulo 5: Arte no Brasil',
                description: 'Da colônia à Semana de 22.',
                locked: true,
                duration: '10h',
                status: 'Locked',
                lessons: [
                    { id: 'l_arte_br_barroco', title: 'Barroco Mineiro e Aleijadinho', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_br_missao', title: 'Missão Artística Francesa e Academismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_br_mod', title: 'Modernismo: A Semana de 22', duration: '2h 30m', status: 'Locked' },
                    { id: 'l_arte_br_pos_mod', title: 'Portinari e o Modernismo Tardio', duration: '2h', status: 'Locked' }
                ]
            },
            {
                id: 'm_arte_contemp',
                title: 'Módulo 6: Arte Contemporânea',
                description: 'A arte pós-guerra e os novos meios.',
                locked: true,
                duration: '8h',
                status: 'Locked',
                lessons: [
                    { id: 'l_arte_pop', title: 'Pop Art e Minimalismo', duration: '1h 30m', status: 'Locked' },
                    { id: 'l_arte_conceitual', title: 'Arte Conceitual e Performance', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_br_contemp', title: 'Arte Contemporânea Brasileira (Hélio Oiticica)', duration: '2h', status: 'Locked' },
                    { id: 'l_arte_urbana', title: 'Arte Urbana e Novas Mídias', duration: '1h 30m', status: 'Locked' }
                ]
            }
        ]
    }
];
