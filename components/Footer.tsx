import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold tracking-tighter text-white">
              HPC<span className="text-blue-500">.</span>
            </span>
            <p className="text-zinc-500 text-sm mt-2">
              High Performance Club &copy; {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
            <a href="mailto:contato@hpc.com" className="text-zinc-500 hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;