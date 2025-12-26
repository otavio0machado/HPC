import React, { useState } from 'react';
import { User, Mail, Save, User as UserIcon, Shield, Camera, Award, Calendar, Zap, CreditCard, Check } from 'lucide-react';
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
      // Para implementação real: Criar Edge Function para Stripe Customer Portal
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
         <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
               <UserIcon className="text-blue-500" /> Meu Perfil
            </h2>
            <p className="text-zinc-400 mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
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
            <div className="md:col-span-1">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-900/40 to-transparent"></div>

                  <div className="relative mb-4 group cursor-pointer">
                     <div className="w-24 h-24 rounded-full bg-zinc-950 border-4 border-zinc-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {name.substring(0, 2).toUpperCase()}
                     </div>
                     <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg border-2 border-zinc-900">
                        <Camera size={14} />
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{email}</p>

                  <div className="w-full flex items-center justify-between py-3 border-t border-zinc-800/50 mt-2">
                     <div className="flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Membro</span>
                        <span className={`text-sm font-bold flex items-center gap-1 ${isPro ? 'text-blue-400' : 'text-zinc-400'}`}>
                           {isPro ? <><Award size={12} /> Pro</> : <><User size={12} /> Free</>}
                        </span>
                     </div>
                     <div className="h-8 w-[1px] bg-zinc-800"></div>
                     <div className="flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Entrou</span>
                        <span className="text-sm font-bold text-zinc-300 flex items-center gap-1"><Calendar size={12} /> 2024</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Subscription Management Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard size={18} className="text-purple-500" /> Assinatura</h3>

               <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 mb-4">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-zinc-400">Plano Atual</span>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPro ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {isPro ? 'ELITE PRO' : 'GRATUITO'}
                     </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
                     <div className={`h-full rounded-full ${isPro ? 'bg-blue-500 w-full' : 'bg-zinc-700 w-1/3'}`}></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                     {isPro ? 'Sua assinatura está ativa e renova automaticamente.' : 'Faça upgrade para acessar todos os recursos.'}
                  </p>
               </div>

               {isPro ? (
                  <button
                     onClick={handleCancelSubscription}
                     disabled={isLoadingTier}
                     className="w-full py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                     {isLoadingTier ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : 'Gerenciar / Cancelar'}
                  </button>
               ) : (
                  <button
                     onClick={() => setShowUpgradeModal(true)}
                     className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                  >
                     <Zap size={14} className="fill-white" /> Virar PRO
                  </button>
               )}
            </div>
         </div>

         {/* Right Column: Edit Form */}
         <div className="md:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Dados da Conta</h3>
                  {!isEditing && (
                     <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                     >
                        Editar Informações
                     </button>
                  )}
               </div>

               {message && (
                  <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                     {message.type === 'success' ? <Shield size={18} /> : <Shield size={18} />}
                     <span className="text-sm font-medium">{message.text}</span>
                  </div>
               )}

               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                     <div>
                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Nome Completo</label>
                        <div className="relative">
                           <User className="absolute left-3 top-3 text-zinc-600" size={18} />
                           <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              disabled={!isEditing}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Email de Acesso</label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-3 text-zinc-600" size={18} />
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={!isEditing}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                           />
                        </div>
                     </div>
                  </div>

                  {isEditing && (
                     <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                        <button
                           type="button"
                           onClick={() => {
                              setIsEditing(false);
                              setName(currentUser.name);
                              setEmail(currentUser.email);
                              setMessage(null);
                           }}
                           className="flex-1 py-3 bg-zinc-800 text-zinc-300 hover:text-white rounded-xl font-medium transition-colors"
                        >
                           Cancelar
                        </button>
                        <button
                           type="submit"
                           className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                        >
                           <Save size={18} /> Salvar Alterações
                        </button>
                     </div>
                  )}
               </form>
            </div>

            <div className="mt-6 bg-zinc-900/50 border border-red-900/20 rounded-2xl p-6">
               <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><Shield size={18} /> Zona de Perigo</h3>
               <p className="text-sm text-zinc-500 mb-4">A exclusão da conta é permanente e removerá todo o histórico de simulados e flashcards.</p>
               <button className="text-sm text-red-500 hover:text-red-400 font-medium border border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-900/10 transition-colors">
                  Excluir minha conta
               </button>
            </div>
         </div>
      </div>

   );
};

export default Profile;