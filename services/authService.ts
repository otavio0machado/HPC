import { supabase } from '../lib/supabase';
import { User } from '../types';

// NOTE: Usage of this service now requires async/await handling in the frontend components.
// Previous synchronous methods (getCurrentUser) are now async to support Supabase.

export const authService = {
  // Changed to async
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.name || '',
    };
  },

  // Helper to get session synchronously if needed (wrapping basic check), 
  // though getSession() is the source of truth.
  // This is a "best effort" check from memory if session was already loaded, 
  // but reliable auth should use the async method.
  isLoggedIn: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  register: async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      // Se não houver sessão e o e-mail não estiver confirmado, impedimos o login automático.
      if (!data.session) {
        return {
          success: false,
          message: 'Cadastro realizado! Confirme seu email para entrar.'
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || name
        }
      };
    }

    return { success: false, message: 'Erro desconhecido ao registrar.' };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, message: 'Email ou senha incorretos.' };
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || ''
        }
      };
    }
    return { success: false, message: 'Erro ao fazer login.' };
  },

  updateUser: async (updatedUser: User): Promise<{ success: boolean; message?: string }> => {
    // Updates both Auth metadata and Profiles table
    const { error: paramError } = await supabase.auth.updateUser({
      data: { name: updatedUser.name }
    });

    if (paramError) return { success: false, message: paramError.message };

    // Explicitly update profile table if needed (though metadata is usually enough for simple names)
    const { error: tableError } = await supabase
      .from('profiles')
      .update({ name: updatedUser.name, email: updatedUser.email })
      .eq('id', updatedUser.id);

    if (tableError) return { success: false, message: tableError.message };

    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  // Deprecated: No longer needed for Supabase RLS, simply returns base key.
  // Kept to avoid breaking existing calls before refactor.
  getUserStorageKey: (baseKey: string): string => {
    return baseKey;
  }
};