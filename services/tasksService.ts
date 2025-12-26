import { supabase } from '../lib/supabase';
import { PlannerTask } from '../types';

export const tasksService = {
    // Fetch all tasks for the current user
    async fetchTasks(): Promise<PlannerTask[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }

        return (data || []).map((t: any) => ({
            ...t,
            // Ensure specific fields match PlannerTask type if DB columns differ
            // The DB schema has 'completed' as boolean, 'priority' etc.
        })) as PlannerTask[];
    },

    async createTask(task: Omit<PlannerTask, 'id' | 'createdAt'>): Promise<PlannerTask | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                user_id: user.id,
                title: task.title,
                completed: task.completed,
                scope: task.scope,
                priority: task.priority,
                date: task.date,
                time: task.time
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            return null;
        }

        return data as PlannerTask;
    },

    async updateTask(task: PlannerTask): Promise<boolean> {
        const { error } = await supabase
            .from('tasks')
            .update({
                title: task.title,
                completed: task.completed,
                priority: task.priority,
                date: task.date,
                time: task.time
            })
            .eq('id', task.id);

        if (error) {
            console.error('Error updating task:', error);
            return false;
        }
        return true;
    },

    async deleteTask(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            return false;
        }
        return true;
    }
};
