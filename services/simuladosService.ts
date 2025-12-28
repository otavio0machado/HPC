import { supabase } from '../lib/supabase';
import { SimuladoResult, SimuladoArea } from '../types';

export const simuladosService = {
    async fetchSimulados(): Promise<SimuladoResult[]> {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Usuário não autenticado ou sessão expirada');

        const { data, error } = await supabase
            .from('simulados')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching simulados:', error);
            throw error;
        }

        return (data || []).map((s: any) => ({
            id: s.id,
            date: s.date,
            examType: s.exam_type,
            areas: s.areas as SimuladoArea[],
            essayScore: s.essay_score,
            totalScore: s.total_score,
            aiAnalysis: s.ai_analysis
        }));
    },

    async createSimulado(simulado: Omit<SimuladoResult, 'id'>): Promise<SimuladoResult | null> {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Usuário não autenticado ou sessão expirada');

        const { data, error } = await supabase
            .from('simulados')
            .insert([{
                user_id: user.id,
                date: simulado.date,
                exam_type: simulado.examType,
                areas: simulado.areas,
                essay_score: simulado.essayScore,
                ai_analysis: simulado.aiAnalysis
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating simulado:', error);
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            examType: data.exam_type,
            areas: data.areas,
            essayScore: data.essay_score,
            totalScore: data.total_score,
            aiAnalysis: data.ai_analysis
        };
    },

    async updateSimuladoAnalysis(id: string, analysis: string): Promise<boolean> {
        const { error } = await supabase
            .from('simulados')
            .update({ ai_analysis: analysis })
            .eq('id', id);

        if (error) {
            console.error('Error updating analysis:', error);
            return false;
        }
        return true;
    },

    async deleteSimulado(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('simulados')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting simulado:', error);
            return false;
        }
        return true;
    }
};
