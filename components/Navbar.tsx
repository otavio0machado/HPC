import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? 'glass-nav border-zinc-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tighter text-white">
              HPC<span className="text-blue-500">.</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={onLoginClick}
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                {isLoggedIn ? 'Dashboard' : 'Entrar no Club'}
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4"
            >
              {isLoggedIn ? 'Dashboard' : 'Entrar no Club'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;