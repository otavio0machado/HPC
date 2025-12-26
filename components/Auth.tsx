import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { z } from 'zod';

interface AuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "A senha é obrigatória")
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
  // .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula") // Optional: Enforce complexity
  // .regex(/[0-9]/, "A senha deve conter pelo menos um número") // Optional
});

const Auth: React.FC<AuthProps> = ({ onBack, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showVerification, setShowVerification] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      if (isRegister) {
        registerSchema.parse({ name, email, password });
      } else {
        loginSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const zodError = err as z.ZodError<any>;
        const fieldErrors: { [key: string]: string } = {};
        zodError.errors.forEach((error: any) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        // Toast the first error for visibility
        if (zodError.errors[0]) {
          toast.error(zodError.errors[0].message);
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isRegister) {
        const result = await authService.register(name, email, password);
        if (result.success) {
          toast.success("Cadastro realizado!");
          onSuccess();
        } else {
          if (result.message && result.message.includes("Confirme seu email")) {
            setShowVerification(true);
            toast.info("Verifique seu email para continuar.");
          } else {
            toast.error(result.message || "Erro ao registrar.");
          }
        }
      } else {
        const result = await authService.login(email, password);
        if (result.success) {
          toast.success("Login realizado com sucesso!");
          onSuccess();
        } else {
          if (result.message?.toLowerCase().includes("email not confirmed")) {
            setShowVerification(true);
          }
          toast.error(result.message || "Erro ao entrar.");
        }
      }
    } catch (err) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const result = await authService.resendVerificationEmail(email);
      if (result.success) {
        toast.success("Email de verificação reenviado!");
        setResendTimer(60);
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(result.message || "Erro ao reenviar.");
      }
    } catch (e) {
      toast.error("Erro ao reenviar email.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
    setShowPassword(false);
    setShowVerification(false);
  };

  if (showVerification) {
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

        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
              <Mail size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifique seu Email</h2>
          <p className="text-zinc-400 mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. <br />
            Por favor, verifique sua caixa de entrada (e spam).
          </p>

          <div className="space-y-3">
            <button
              onClick={() => onSuccess()} // Or allow them to try logging in again
              className="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Já confirmei, fazer login
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resendTimer > 0 || isLoading}
              className="w-full bg-zinc-800 text-white font-medium py-2.5 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Aguarde ${resendTimer}s` : 'Reenviar Email'}
            </button>

            <button
              onClick={() => setShowVerification(false)}
              className="text-sm text-zinc-500 hover:text-white mt-4 underline decoration-zinc-700 underline-offset-4"
            >
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="space-y-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  const result = await authService.loginWithGoogle();
                  if (!result.success) {
                    toast.error(result.message || "Erro ao iniciar login com Google.");
                  }
                } catch (err) {
                  toast.error("Erro inesperado com Google.");
                }
              }}
              className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative bg-zinc-900 px-4 text-sm text-zinc-500">ou</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full bg-zinc-950 border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Seu nome"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full bg-zinc-950 border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full bg-zinc-950 border ${errors.password ? 'border-red-500' : 'border-zinc-800'} rounded-lg py-2.5 pl-10 pr-12 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group-btn"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Registrar' : 'Entrar'} <ArrowRight size={18} className="group-btn-hover:translate-x-1 transition-transform" />
                </>
              )}
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