import { supabase } from '../lib/supabase';
import { User } from '../types';

// NOTE: Usage of this service now requires async/await handling in the frontend components.
// Previous synchronous methods (getCurrentUser) are now async to support Supabase.

export const authService = {
  // Changed to async
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        subscription_tier: user.user_metadata?.subscription_tier || 'free',
        photo_url: user.user_metadata?.photo_url
      };
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  },

  // Helper to get session - getSession is fast but can be stale.
  // Using getUser is slower but more reliable as it validates with the server.
  isLoggedIn: async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
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

  resendVerificationEmail: async (email: string): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      if (error.message.includes('Too many requests') || error.status === 429) {
        return { success: false, message: 'Muitas tentativas. Aguarde 60 segundos.' };
      }
      return { success: false, message: error.message };
    }

    return { success: true };
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
          name: data.user.user_metadata.name || '',
          subscription_tier: data.user.user_metadata?.subscription_tier || 'free'
        }
      };
    }
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          subscription_tier: data.user.user_metadata?.subscription_tier || 'free'
        }
      };
    }
    return { success: false, message: 'Erro ao fazer login.' };
  },

  loginWithGoogle: async (): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
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

  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  createCheckoutSession: async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session')

      if (error) throw error
      if (!data.url) throw new Error('No checkout URL returned')

      return { success: true, url: data.url }
    } catch (error: any) {
      console.error('Checkout error:', error)
      return { success: false, message: error.message || 'Erro ao iniciar pagamento' }
    }
  },

  createPortalSession: async (): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session')

      if (error) throw error
      if (!data.url) throw new Error('No portal URL returned')

      return { success: true, url: data.url }
    } catch (error: any) {
      console.error('Portal error:', error)
      return { success: false, message: error.message || 'Erro ao acessar portal' }
    }
  },

  // Deprecated: No longer needed for Supabase RLS, simply returns base key.
  // Kept to avoid breaking existing calls before refactor.
  getUserStorageKey: (baseKey: string): string => {
    return baseKey;
  }
};