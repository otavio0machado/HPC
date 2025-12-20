import React, { useEffect, useState } from 'react';
import { Lock, Unlock, Zap, Terminal } from 'lucide-react';

interface TransitionOverlayProps {
  onAnimationComplete: () => void;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ onAnimationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'imploding' | 'exploding'>('loading');
  const [terminalText, setTerminalText] = useState('INIT_PROTOCOL_V2.0...');
  const [hexBg, setHexBg] = useState<string>('');

  // Generate random hex background content
  useEffect(() => {
    let str = '';
    for(let i=0; i<400; i++) {
      str += Math.floor(Math.random()*16).toString(16).toUpperCase() + ' ';
    }
    setHexBg(str);
  }, []);

  useEffect(() => {
    const totalDuration = 2500; // 2.5s total loading
    const intervalTime = 30;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const messages = [
      "BYPASSING_FIREWALL...",
      "DECRYPTING_USER_DATA...",
      "OPTIMIZING_NEURAL_NET...",
      "SYNCHRONIZING_CORE...",
      "ACCESS_GRANTED_//"
    ];

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      // Glitch text updates
      if (newProgress < 90 && Math.random() > 0.8) {
         setTerminalText(messages[Math.floor((newProgress / 100) * messages.length)]);
      }

      // Phase Control
      if (newProgress >= 100) {
        clearInterval(interval);
        setPhase('imploding');
        setTerminalText("SYSTEM_OVERRIDE");
        
        // Trigger Explosion after brief implosion
        setTimeout(() => {
          setPhase('exploding');
          // Notify app to switch views right as explosion covers screen
          setTimeout(() => {
            onAnimationComplete();
          }, 300); // Wait for whiteout
        }, 600);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onAnimationComplete]);

  // Dynamic Glitch Style
  const glitchStyle = {
    clipPath: `polygon(
      ${Math.random() * 10}% 0%, 
      ${Math.random() * 100}% 0%, 
      ${Math.random() * 100}% 100%, 
      ${Math.random() * 10}% 100%
    )`,
    transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`
  };

  if (phase === 'exploding' && progress === 100) {
     // Don't unmount immediately, let the explosion fade out via the parent handling or CSS opacity
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 overflow-hidden cursor-none ${phase === 'exploding' ? 'pointer-events-none' : ''}`}>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch-anim {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        @keyframes shockwave {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(30); opacity: 0; }
        }
        @keyframes text-flicker {
          0% { opacity: 0.1; }
          2% { opacity: 1; }
          8% { opacity: 0.1; }
          9% { opacity: 1; }
          12% { opacity: 0.1; }
          20% { opacity: 1; }
          25% { opacity: 1; }
          30% { opacity: 0.1; }
          100% { opacity: 1; }
        }
        .crt-scanline {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
          animation: scanline 0.1s linear infinite; /* Reduced animation speed/load for visual only */
          pointer-events: none;
        }
        .shockwave-circle {
          animation: shockwave 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }
      `}</style>

      {/* Background Hex Rain (Static/Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] font-mono text-[10px] break-all p-4 pointer-events-none select-none text-emerald-500 overflow-hidden">
        {hexBg}
      </div>

      {/* CRT Effects */}
      <div className="absolute inset-0 pointer-events-none z-10 crt-scanline"></div>
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

      {/* EXPLOSION LAYER */}
      {phase === 'exploding' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* The Flash */}
            <div className="w-full h-full bg-white animate-[fadeOut_0.5s_ease-out_forwards]"></div>
            {/* The Shockwave Ring */}
            <div className="absolute w-20 h-20 rounded-full border-[50px] border-blue-500 shockwave-circle bg-white mix-blend-screen"></div>
            <div className="absolute w-20 h-20 rounded-full border-[20px] border-emerald-400 shockwave-circle bg-transparent mix-blend-screen" style={{animationDelay: '0.1s'}}></div>
        </div>
      )}

      {/* Main Content Container */}
      <div className={`relative z-20 flex flex-col items-center transition-all duration-300 ${phase === 'imploding' ? 'scale-50 opacity-0 blur-md' : 'scale-100 opacity-100'}`}>
        
        {/* LOGO GLITCH WRAPPER */}
        <div className="relative mb-12">
            <div className="relative z-10">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mix-blend-difference" style={{ fontFamily: 'monospace' }}>
                    HPC<span className="text-blue-500">_</span>
                </h1>
            </div>
            {/* RGB Split Layers */}
            <div 
                className="absolute top-0 left-0 text-6xl md:text-8xl font-black tracking-tighter text-red-500 opacity-70 z-0 animate-[glitch-anim_0.3s_infinite]"
                style={{ fontFamily: 'monospace', clipPath: 'inset(40% 0 61% 0)' }}
            >
                HPC_
            </div>
            <div 
                className="absolute top-0 left-0 text-6xl md:text-8xl font-black tracking-tighter text-cyan-500 opacity-70 z-0 animate-[glitch-anim_0.3s_infinite_reverse]"
                style={{ fontFamily: 'monospace', clipPath: 'inset(10% 0 80% 0)' }}
            >
                HPC_
            </div>
        </div>

        {/* TERMINAL STATUS */}
        <div className="w-80 font-mono text-sm mb-6">
            <div className="flex justify-between items-end mb-2 text-blue-400">
                <span className="flex items-center gap-2">
                    <Terminal size={14} />
                    {terminalText}
                </span>
                <span>{progress}%</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="h-2 w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                {/* Glitchy Bar */}
                <div 
                    className="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
                </div>
                {/* Random Error Blocks in Bar */}
                <div 
                    className="h-full bg-red-500 absolute top-0 w-2 opacity-50" 
                    style={{ left: `${Math.random() * 100}%`, display: Math.random() > 0.9 ? 'block' : 'none' }} 
                />
            </div>
        </div>

        {/* SECURITY TOKENS */}
        <div className="flex gap-8 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
            <div className={`flex items-center gap-2 ${progress > 30 ? 'text-emerald-500' : ''}`}>
                {progress > 30 ? <Unlock size={12} /> : <Lock size={12} />}
                CORE_SECURE
            </div>
            <div className={`flex items-center gap-2 ${progress > 70 ? 'text-emerald-500' : ''}`}>
                <Zap size={12} className={progress > 70 ? "fill-current" : ""} />
                POWER_100%
            </div>
        </div>

      </div>
    </div>
  );
};

export default TransitionOverlay;
