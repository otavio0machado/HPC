import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-black/20 backdrop-blur-md py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center overflow-hidden border border-blue-500/20">
                <img src="/logo-hpc.png" alt="Logo" className="w-full h-full object-contain mix-blend-screen brightness-110" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                HPC<span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 font-medium">
              High Performance Club &copy; {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex space-x-8">
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-semibold">Instagram</a>
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-semibold">Twitter</a>
            <a href="mailto:contato@hpc.com" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-semibold">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;