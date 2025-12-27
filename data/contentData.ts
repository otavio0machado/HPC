
export interface KnowledgePill {
    id: string;
    title: string;
    description: string;
    content: string; // The "pill" summary
    readTime?: string;
    layout?: 'default' | 'image_top' | 'quote' | 'list';
    imageUrl?: string;
    folder?: string;
}

export interface Folder {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    title: string;
    icon: string; // Lucide icon name or generic string
    color: string;
    pills: KnowledgePill[];
    folders?: Folder[];
}

export const contentData: Subject[] = [
    {
        id: 'math',
        title: 'Matemática',
        icon: 'Calculator',
        color: 'bg-blue-500',
        pills: [
            {
                id: 'm1',
                title: 'Teorema de Pitágoras',
                description: 'Relação fundamental na geometria euclidiana.',
                content: 'Em qualquer triângulo retângulo, o quadrado do comprimento da hipotenusa é igual à soma dos quadrados dos comprimentos dos catetos. Fórmula: a² = b² + c².',
                readTime: '2 min'
            },
            {
                id: 'm2',
                title: 'Bhaskara',
                description: 'Fórmula para resolver equações de segundo grau.',
                content: 'Para uma equação ax² + bx + c = 0, as raízes são dadas por: x = (-b ± √Δ) / 2a, onde Δ = b² - 4ac.',
                readTime: '3 min'
            }
        ]
    },
    {
        id: 'history',
        title: 'História',
        icon: 'Scroll',
        color: 'bg-amber-600',
        pills: [
            {
                id: 'h1',
                title: 'Revolução Francesa',
                description: 'Período de intensa agitação política e social na França.',
                content: 'Ocorreu entre 1789 e 1799. Principais causas: crise financeira, desigualdade social e ideais iluministas. Resultou na queda da monarquia e ascensão de Napoleão.',
                readTime: '5 min'
            },
            {
                id: 'h2',
                title: 'Segunda Guerra Mundial',
                description: 'Conflito militar global que durou de 1939 a 1945.',
                content: 'Envolveu a maioria das nações do mundo, organizadas em duas alianças militares opostas: os Aliados e o Eixo. Foi a guerra mais abrangente da história.',
                readTime: '6 min'
            }
        ]
    },
    {
        id: 'physics',
        title: 'Física',
        icon: 'Atom',
        color: 'bg-purple-500',
        pills: [
            {
                id: 'p1',
                title: 'Leis de Newton',
                description: 'Fundamentos da mecânica clássica.',
                content: '1. Inércia: Um corpo em repouso tende a permanecer em repouso. 2. F = m.a: A força é igual à massa vezes a aceleração. 3. Ação e Reação: Toda ação tem uma reação de igual intensidade e sentido oposto.',
                readTime: '4 min'
            }
        ]
    },
    {
        id: 'biology',
        title: 'Biologia',
        icon: 'Dna',
        color: 'bg-green-500',
        pills: [
            {
                id: 'b1',
                title: 'Mitocôndria',
                description: 'A usina de energia da célula.',
                content: 'Organela responsável pela respiração celular aeróbica, produzindo a maior parte do fornecimento de ATP da célula.',
                readTime: '2 min'
            }
        ]
    }
];
