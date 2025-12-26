import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, isLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Metodologia', href: '#metodologia' },
    { name: 'Planner AI', href: '#planner' },
    { name: 'Planos', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-500 rounded-full px-6 
      ${isScrolled
        ? 'py-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ring-1 ring-white/[0.05] inset bg-gradient-to-br from-white/[0.1] to-white/[0.02]'
        : 'py-4 bg-transparent border-transparent'
      }`}>
      <div className="flex items-center justify-between">
        {/* Enhanced Logo */}
        <motion.div
          className="flex-shrink-0 flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <span className="font-black italic text-white text-sm">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors duration-300 cursor-pointer">
            HPC<span className="text-blue-500 text-2xl leading-none">.</span>
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 rounded-full group-hover:w-full transition-all duration-300 ease-out opacity-0 group-hover:opacity-100" />
              </motion.a>
            ))}

            {/* Enhanced CTA Button */}
            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] backdrop-blur-md text-sm font-bold shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out flex items-center gap-2 group ring-1 ring-white/[0.05] inset"
            >
              <span>{isLoggedIn ? 'Dashboard' : 'Entrar'}</span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <Sparkles size={10} className="text-white" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="inline-flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Menu - Floating Bubble */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute top-full left-0 right-0 mt-4 mx-2 rounded-3xl bg-[#0a0a0c]/90 backdrop-blur-3xl border border-white/10 p-4 shadow-2xl overflow-hidden"
          >
            <div className="space-y-2">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="block px-4 py-3.5 rounded-2xl text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full mt-4 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
              >
                {isLoggedIn ? 'Ir para Dashboard' : 'Começar Agora'}
                <Sparkles size={16} className="text-white/70" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
