import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Planner from './components/Planner';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TransitionOverlay from './components/TransitionOverlay';
import { authService } from './services/authService';

type ViewState = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [showTransition, setShowTransition] = useState(false);

  // Check for active session on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setView('dashboard');
    }
  }, []);

  const handleLoginClick = () => {
    // If we are already logged in (checked via local storage), go straight to dashboard
    const user = authService.getCurrentUser();
    if (user) {
      setView('dashboard');
    } else {
      setView('auth');
    }
  };

  const handleAuthSuccess = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setView('dashboard');
    // Allow the transition overlay to fade out smoothly before unmounting/hiding
    // The TransitionOverlay component handles its own internal fade out visual over 500ms
    // We wait slightly longer to ensure it's fully invisible before removing from DOM
    setTimeout(() => {
      setShowTransition(false);
    }, 600); 
  };

  const handleLogout = () => {
    authService.logout();
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      {showTransition && (
        <TransitionOverlay onAnimationComplete={handleTransitionComplete} />
      )}

      {view === 'landing' && (
        <>
          <Navbar onLoginClick={handleLoginClick} isLoggedIn={false} />
          <main>
            <Hero />
            <Features />
            <Planner />
            
            {/* Simple Pricing/CTA Section */}
            <section id="pricing" className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-900/5 -z-10"></div>
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Pronto para elevar seu nível?</h2>
                <p className="text-zinc-400 mb-10 max-w-2xl mx-auto">
                  Junte-se a centenas de estudantes que já transformaram sua rotina de estudos. 
                  Acesso completo à plataforma, mentorias ao vivo e banco de questões inteligente.
                </p>
                <button 
                  onClick={handleLoginClick}
                  className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-transform hover:scale-105 shadow-xl shadow-blue-900/10"
                >
                  Quero ser Membro HPC
                </button>
                <p className="mt-4 text-sm text-zinc-600">Garantia de 7 dias ou seu dinheiro de volta.</p>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}

      {view === 'auth' && (
        <Auth onBack={() => setView('landing')} onSuccess={handleAuthSuccess} />
      )}

      {view === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;