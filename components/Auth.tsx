import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!name || !email || !password) {
        setError("Preencha todos os campos.");
        return;
      }
      const result = authService.register(name, email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "Erro ao registrar.");
      }
    } else {
      if (!email || !password) {
        setError("Preencha email e senha.");
        return;
      }
      const result = authService.login(email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "Erro ao entrar.");
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative">
      <div className="absolute top-24 left-4 md:left-12">
        <button 
          onClick={onBack}
          className="flex items-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </button>
      </div>

      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden group">
        
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] group-hover:bg-blue-600/30 transition-all duration-700"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Junte-se ao Club' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-zinc-400 mb-8">
            {isRegister ? 'Inicie sua jornada para a aprovação.' : 'Acesse seu painel de alta performance.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-zinc-500" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all transform hover:scale-[1.02] mt-6 flex items-center justify-center gap-2 group-btn"
            >
              {isRegister ? 'Registrar' : 'Entrar'} <ArrowRight size={18} className="group-btn-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            {isRegister ? 'Já é membro? ' : 'Ainda não é membro? '}
            <button 
              onClick={toggleMode}
              className="text-blue-500 hover:text-blue-400 font-medium ml-1 underline underline-offset-4"
            >
              {isRegister ? 'Fazer Login' : 'Criar conta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;