import React, { useState } from 'react';
import { User, Mail, Save, User as UserIcon, Shield, Camera, Award, Calendar, Zap, CreditCard, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';
import UpgradeModal from './UpgradeModal';
import { toast } from 'sonner';

interface ProfileProps {
   currentUser: UserType;
   onUpdate: (user: UserType) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdate }) => {
   const [name, setName] = useState(currentUser.name);
   const [email, setEmail] = useState(currentUser.email);
   const [isEditing, setIsEditing] = useState(false);
   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
   const [showUpgradeModal, setShowUpgradeModal] = useState(false);
   const [isLoadingTier, setIsLoadingTier] = useState(false);

   const isPro = currentUser.subscription_tier === 'pro';

   const handleCancelSubscription = async () => {
      toast.info("Gerenciamento de assinatura disponível em breve via Portal do Cliente.");
   };

   const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) return;

      const updatedUser = { ...currentUser, name, email };
      const result = await authService.updateUser(updatedUser);

      if (result.success) {
         onUpdate(updatedUser);
         setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
         setIsEditing(false);
         setTimeout(() => setMessage(null), 3000);
      } else {
         setMessage({ type: 'error', text: result.message || 'Erro ao atualizar.' });
      }
   };

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-4 md:p-0">
         <div className="mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <UserIcon className="text-blue-600 dark:text-blue-500" size={24} />
               </div>
               Meu Perfil
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">Gerencie suas informações pessoais e sua jornada de aprendizado.</p>
         </div>

         {showUpgradeModal && (
            <UpgradeModal
               onClose={() => setShowUpgradeModal(false)}
               onSuccess={() => {
                  setShowUpgradeModal(false);
                  onUpdate({ ...currentUser, subscription_tier: 'pro' });
               }}
            />
         )}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar & Summary */}
            <div className="md:col-span-1 space-y-6">
               <div className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl group">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent"></div>

                  {/* Decorative blur */}
                  <div className="absolute top-10 inset-0 bg-blue-500/30 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity rounded-full pointer-events-none"></div>

                  <div className="relative mb-6 group cursor-pointer">
                     <div className="w-32 h-32 rounded-full bg-zinc-100 dark:bg-zinc-950 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-4xl font-bold text-zinc-900 dark:text-white shadow-2xl relative z-10 overflow-hidden">
                        {currentUser.photo_url ? (
                           <img src={currentUser.photo_url} alt={name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-950 flex items-center justify-center">
                              {name.substring(0, 2).toUpperCase()}
                           </div>
                        )}
                     </div>
                     <div className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg border-4 border-white dark:border-zinc-900 transition-transform hover:scale-110 z-20">
                        <Camera size={16} />
                     </div>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1">{name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{email}</p>

                  <div className="w-full grid grid-cols-2 divide-x divide-zinc-200 dark:divide-white/10 border-t border-zinc-200 dark:border-white/5 pt-6 mt-2">
                     <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Membro</span>
                        <span className={`text-sm font-bold flex items-center gap-1.5 ${isPro ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                           {isPro ? <><Award size={14} className="fill-blue-500/20" /> Elite Pro</> : <><User size={14} /> Free</>}
                        </span>
                     </div>
                     <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Entrou</span>
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                           <Calendar size={14} /> 2024
                        </span>
                     </div>
                  </div>
               </div>

               {/* Subscription Management Card */}
               <div className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
                  {isPro && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>}

                  <h3 className="text-zinc-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                     {isPro ? <CreditCard size={18} className="text-amber-500 dark:text-amber-400" /> : <CreditCard size={18} className="text-zinc-500 dark:text-zinc-400" />}
                     Assinatura
                  </h3>

                  <div className={`rounded-2xl p-5 border mb-6 ${isPro ? 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20' : 'bg-zinc-50 dark:bg-zinc-950/50 border-black/5 dark:border-white/5'}`}>
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Plano Atual</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${isPro ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700'}`}>
                           {isPro ? 'ELITE PRO' : 'GRATUITO'}
                        </span>
                     </div>
                     {isPro && (
                        <div className="flex items-center gap-2 text-xs text-amber-200/70 mb-2">
                           <Sparkles size={12} /> Desbloqueado: IAs avançadas, Sem limites.
                        </div>
                     )}
                     <div className="w-full bg-zinc-950/50 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${isPro ? 'bg-gradient-to-r from-amber-500 to-yellow-300 w-full shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-zinc-700 w-1/3'}`}></div>
                     </div>
                  </div>

                  {isPro ? (
                     <button
                        onClick={handleCancelSubscription}
                        disabled={isLoadingTier}
                        className="w-full py-3 border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                     >
                        {isLoadingTier ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : 'Gerenciar Assinatura'}
                     </button>
                  ) : (
                     <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group border border-white/10"
                     >
                        <Zap size={16} className="fill-white group-hover:scale-110 transition-transform" /> Desbloquear Elite Pro
                     </button>
                  )}
               </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="md:col-span-2 space-y-6">
               <div className="bg-white/60 dark:bg-[var(--glass-bg)] border border-black/5 dark:border-[var(--border-glass)] rounded-3xl p-8 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Dados da Conta</h3>
                     {!isEditing && (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-all border border-blue-500/20"
                        >
                           Editar Informações
                        </button>
                     )}
                  </div>

                  {message && (
                     <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
                        {message.type === 'success' ? <Check size={18} className="bg-emerald-500/20 p-0.5 rounded-full box-content" /> : <AlertTriangle size={18} />}
                        <span className="text-sm font-medium">{message.text}</span>
                     </div>
                  )}

                  <form onSubmit={handleSave} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Nome Completo</label>
                           <div className="relative group">
                              <User className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input
                                 type="text"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 disabled={!isEditing}
                                 className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email de Acesso</label>
                           <div className="relative group">
                              <Mail className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                              <input
                                 type="email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 disabled={!isEditing}
                                 className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                              />
                           </div>
                        </div>
                     </div>

                     {isEditing && (
                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-4">
                           <button
                              type="button"
                              onClick={() => {
                                 setIsEditing(false);
                                 setName(currentUser.name);
                                 setEmail(currentUser.email);
                                 setMessage(null);
                              }}
                              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-sm font-bold transition-colors"
                           >
                              Cancelar
                           </button>
                           <button
                              type="submit"
                              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                           >
                              <Save size={18} /> Salvar Alterações
                           </button>
                        </div>
                     )}
                  </form>
               </div>

               <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                        <Shield size={24} />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-red-400 font-bold mb-2 text-lg">Zona de Perigo</h3>
                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                           A exclusão da conta é uma ação definitiva. Todo o seu histórico de simulados, anotações, flashcards e progresso será permanentemente removido dos nossos servidores e não poderá ser recuperado.
                        </p>
                        <button className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 px-6 py-3 rounded-xl transition-all">
                           Solicitar Exclusão da Conta
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Profile;