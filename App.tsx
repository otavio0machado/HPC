import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Planner from './components/Planner';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TransitionOverlay from './components/TransitionOverlay';
import { authService } from './services/authService';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import LandingPage from './components/landing/LandingPage';

type ViewState = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [showTransition, setShowTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setView('dashboard');
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginClick = async () => {
    // Check if valid session exists
    const user = await authService.getCurrentUser();
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
    setTimeout(() => {
      setShowTransition(false);
    }, 600);
  };

  const handleLogout = async () => {
    await authService.logout();
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {showTransition && (
          <TransitionOverlay onAnimationComplete={handleTransitionComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onLoginClick={handleLoginClick} />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Auth onBack={() => setView('landing')} onSuccess={handleAuthSuccess} />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
};

export default App;