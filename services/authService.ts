import { User } from '../types';

const USERS_KEY = 'hpc_users';
const SESSION_KEY = 'hpc_session';

export const authService = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  register: (name: string, email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const users = authService.getUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Este email já está cadastrado.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password // In a real app, verify hash. Here storing plain for simulation.
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto-login after register
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Email ou senha incorretos.' };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  updateUser: (updatedUser: User): { success: boolean; message?: string } => {
    try {
      const users = authService.getUsers();
      const index = users.findIndex(u => u.id === updatedUser.id);
      
      if (index === -1) return { success: false, message: 'Usuário não encontrado.' };

      // Update in users array
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Update current session
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

      return { success: true };
    } catch (e) {
      return { success: false, message: 'Erro ao salvar dados.' };
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Helpers to get user-specific keys for other services
  getUserStorageKey: (baseKey: string): string => {
    const user = authService.getCurrentUser();
    if (!user) return baseKey; // Fallback
    return `${baseKey}_${user.id}`;
  }
};