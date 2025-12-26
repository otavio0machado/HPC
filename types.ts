
export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
  tip: string;
}

export interface StudyPlanResponse {
  weeklyGoal: string;
  strategyNote: string;
  schedule: DayPlan[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional because we might verify separately
  subscription_tier?: 'free' | 'pro';
}

export enum ExamType {
  UFRGS = 'UFRGS',
  ENEM = 'ENEM',
  BOTH = 'AMBOS'
}

export enum SubjectFocus {
  MATH = 'Matemática',
  PHYSICS = 'Física',
  CHEMISTRY = 'Química',
  BIOLOGY = 'Biologia',
  HISTORY = 'História',
  GEOGRAPHY = 'Geografia',
  LITERATURE = 'Literatura',
  WRITING = 'Redação',
  GENERAL = 'Geral'
}

// Simulados Types
export interface SimuladoArea {
  name: string;
  correct: number;
  total: number;
}

export interface SimuladoResult {
  id: string;
  date: string;
  examType: ExamType;
  areas: SimuladoArea[];
  essayScore?: number; // Nota da redação (0-1000)
  totalScore?: number; // Média simples ou TRI estimada
  aiAnalysis?: string; // Análise gerada pelo Gemini
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  subject?: string;
  supportText?: string; // Texto de apoio (artigo, trecho de livro)
  imageDescription?: string; // Descrição visual para placeholder
}

export interface SimulationConfig {
  type: ExamType;
  area: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  count: number;
  mode: 'Rápido' | 'Maratona'; // Novo controle de modo
}

// Planner Types
export type TaskScope = 'Daily' | 'Weekly' | 'Monthly';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface PlannerTask {
  id: string;
  title: string;
  completed: boolean;
  scope: TaskScope;
  priority: TaskPriority;
  createdAt: number;
  date?: string; // Para tarefas diárias (DD/MM/YYYY)
  time?: string; // Novo: Horário da tarefa (HH:MM)
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  currentChapter: number;
  totalChapters: number;
  lastUpdated: number;
}

// Error List Types
export interface ErrorEntry {
  id: string;
  subject: string;
  description: string;
  cause: 'Conteúdo' | 'Atenção' | 'Interpretação' | 'Tempo';
  date: string;
}

export interface ErrorAnalysisResponse {
  description: string;
  subject: string;
  cause: string;
  flashcards: { front: string; back: string }[];
}

// Tutor Types
export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Notes Types
export interface NoteFile {
  id: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'markdown' | 'pdf';
  content?: string;
  tags?: string[];
  pdfAnnotations?: any[];
  isFavorite?: boolean;
  pdfData?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Block {
  id: string;
  noteId: string;
  content: string; // Text content or stringified JSON for complex nodes
  type: string;
  properties: any;
  parentBlockId: string | null;
  rank?: string;
  createdAt: string;
  updatedAt: string;
}
