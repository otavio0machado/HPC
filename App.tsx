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
import { ThemeProvider } from './contexts/ThemeContext';

type ViewState = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [showTransition, setShowTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
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
      setIsLoggedIn(true);
      setView('dashboard');
    } else {
      setView('auth');
    }
  };

  const handleAuthSuccess = () => {
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setIsLoggedIn(true);
    setView('dashboard');
    setTimeout(() => {
      setShowTransition(false);
    }, 600);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-900 dark:text-white">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">

        {/* --- FLUID BACKGROUND ENGINE --- */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-zinc-50 dark:bg-[#050505]">
          <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#4F46E5] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-20 animate-[float-blob_15s_ease-in-out_infinite]" />
          <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#9333EA] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-20 animate-[float-blob_20s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-[#0EA5E9] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-20 animate-[float-blob_25s_ease-in-out_infinite]" />
        </div>

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
              <LandingPage onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
    </ThemeProvider>
  );
};

export default App;