import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../lib/supabase';
import { PlannerTask } from '../types';

const ROADMAP_MODEL = "gemini-2.5-flash";

const getAI = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key missing");
    return new GoogleGenAI({ apiKey: key });
};

export interface RoadmapTask {
    title: string;
    focus: string; // Subject focus like Math, History
    complexity: 'High' | 'Medium' | 'Low';
    estimatedHours: number;
    week: number;
    day: number; // 1-7
    description?: string;
}

export interface RoadmapResponse {
    goalSummary: string;
    totalWeeks: number;
    strategy: string;
    phases: {
        phaseName: string;
        weeks: number[]; // e.g., [1, 2, 3, 4]
        focus: string;
    }[];
    tasks: RoadmapTask[];
}

export const roadmapService = {

    generateRoadmap: async (goal: string, hoursPerDay: number, deadline: Date, currentLevel: string): Promise<RoadmapResponse> => {
        const today = new Date();
        const diffTime = Math.abs(deadline.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);

        // Cap weeks to reasonable amount for prompt, maybe 12 weeks detailed
        const planningWeeks = Math.min(weeks, 12);

        const prompt = `
            ATUE COMO UM ESTRATEGISTA DE ESTUDOS DE ALTA PERFORMANCE (GPS ACADÊMICO).
            
            Aluno:
            - Objetivo: "${goal}"
            - Nível Atual: "${currentLevel}"
            - Tempo Disponível: ${hoursPerDay}h/dia
            - Prazo: ${deadline.toLocaleDateString()} (~${weeks} semanas)
            
            Tarefa:
            Crie um ROADMAP ESTRATÉGICO detalhado para as próximas ${planningWeeks} semanas.
            O plano deve ser "Dopaminérgico" (recompensas rápidas) e "Ascendente" (começa fácil, fica difícil).
            
            Gere um JSON com:
            1. Resumo do Objetivo (Slogan motivacional)
            2. Estratégia Macro (Fases do estudo: Base, Aprofundamento, Revisão)
            3. Lista de Tarefas DIÁRIAS (apenas os pontos chave, não hora a hora) para engajar.
            
            JSON Schema:
            {
                "goalSummary": "string",
                "totalWeeks": number,
                "strategy": "string",
                "phases": [{ "phaseName": "string", "weeks": [1, 2], "focus": "string" }],
                "tasks": [
                    {
                        "title": "string (Ação clara, ex: 'Dominar Logaritmos')",
                        "focus": "string (Matéria)",
                        "complexity": "High" | "Medium" | "Low",
                        "estimatedHours": number,
                        "week": number,
                        "day": number,
                        "description": "string (Por que isso é importante?)"
                    }
                ]
            }
            
            Gere tarefas suficientes para preencher os dias de estudo de ${planningWeeks} semanas.
            Seja agressivo mas realista.
        `;

        const ai = getAI();
        const response = await ai.models.generateContent({
            model: ROADMAP_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        goalSummary: { type: Type.STRING },
                        totalWeeks: { type: Type.INTEGER },
                        strategy: { type: Type.STRING },
                        phases: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    phaseName: { type: Type.STRING },
                                    weeks: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                                    focus: { type: Type.STRING }
                                }
                            }
                        },
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    focus: { type: Type.STRING },
                                    complexity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                                    estimatedHours: { type: Type.NUMBER },
                                    week: { type: Type.INTEGER },
                                    day: { type: Type.INTEGER },
                                    description: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Falha ao gerar o Roadmap.");
        return JSON.parse(text) as RoadmapResponse;
    },

    saveToPlanner: async (roadmap: RoadmapResponse, startDate: Date = new Date()): Promise<boolean> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const tasksToInsert = roadmap.tasks.map(t => {
            const taskDate = new Date(startDate);
            // Calculate date: start + (week-1)*7 + (day-1)
            const dayOffset = ((t.week - 1) * 7) + (t.day - 1);
            taskDate.setDate(taskDate.getDate() + dayOffset);

            return {
                user_id: user.id,
                title: `${t.focus}: ${t.title}`,
                scope: 'Daily',
                priority: t.complexity,
                completed: false,
                date: taskDate.toLocaleDateString('pt-BR'), // DD/MM/YYYY
                // Store description in metadata or just title? title is simple. 
                // We'll stick to title for now or append desc.
            };
        });

        const { error } = await supabase.from('tasks').insert(tasksToInsert);

        if (error) {
            console.error("Error saving roadmap tasks", error);
            return false;
        }
        return true;
    }
};
