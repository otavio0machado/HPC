import React, { useState } from 'react';
import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    MessageSquare,
    AlertTriangle,
    Zap,
    Activity,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Lock,
    Menu
} from 'lucide-react';
import { User as UserType } from '../types';
import { SpotlightButton } from './SpotlightCard';


interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentUser: UserType;
    onLogout: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    onUpgradeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    currentUser,
    onLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onUpgradeClick
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Planner', label: 'Planner', icon: CalendarDays },
        { id: 'Notas', label: 'Notas', icon: BookOpen },
        { id: 'Tutores', label: 'Tutores IA', icon: MessageSquare, restricted: true },
        { id: 'Lista de Erros', label: 'Lista de Erros', icon: AlertTriangle, restricted: true },
        { id: 'Flashcards', label: 'Flashcards', icon: Zap, restricted: true },
        { id: 'Simulados', label: 'Simulados', icon: Activity, restricted: true },
        { id: 'Whiteboard', label: 'Quadro', icon: BookOpen, restricted: true }, // Added Whiteboard if missing, but checking list
    ];

    // Filter duplicates if any
    const uniqueNavItems = navItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
    );

    const handleTabClick = (id: string, restricted?: boolean) => {
        if (restricted && currentUser.subscription_tier !== 'pro') {
            onUpgradeClick();
            return;
        }
        setActiveTab(id);
        setIsMobileMenuOpen(false); // Close mobile menu on selection
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-4 left-4 bottom-4 z-50 glass-hydro rounded-[32px] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'}
          ${isCollapsed ? 'md:w-[88px]' : 'md:w-72'}
          w-72 flex flex-col justify-between shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-visible
        `}
            >
                {/* Header / Logo */}
                <div className="p-6 flex items-center justify-between relative z-10">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center overflow-hidden border border-blue-500/20">
                                <img src="/logo-hpc.png" alt="Logo" className="w-full h-full object-contain mix-blend-screen brightness-110" />
                            </div>
                            <div className="font-bold text-xl tracking-tighter text-spatial text-zinc-800 dark:text-white">
                                HPC<span className="text-blue-500 font-extrabold">.</span>
                            </div>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-full flex justify-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center overflow-hidden border border-blue-500/20 p-1">
                                <img src="/logo-hpc.png" alt="Logo" className="w-full h-full object-contain mix-blend-screen brightness-110" />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar py-2">
                    {uniqueNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isLocked = item.restricted && currentUser.subscription_tier !== 'pro';

                        return (
                            <div key={item.id} className="relative group">
                                <SpotlightButton
                                    className={`
                                        w-full rounded-2xl transition-all duration-300 group
                                        ${isActive
                                            ? 'glass-card active border-blue-500/30 bg-blue-500/5 dark:bg-white/10 shadow-lg shadow-blue-500/10'
                                            : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}
                                    `}
                                    intensity={isActive ? "high" : "low"}
                                >
                                    <button
                                        onClick={() => handleTabClick(item.id, item.restricted)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-3.5 transition-all duration-300 relative z-10
                                            ${isActive
                                                ? 'text-blue-600 dark:text-white'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}
                                            ${isCollapsed ? 'justify-center' : ''}
                                        `}
                                    >
                                        <div className={`relative flex items-center justify-center p-1 rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400' : ''}`}>
                                            <Icon size={20} className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'group-hover:scale-110'}`} />
                                        </div>

                                        {!isCollapsed && (
                                            <span className={`font-medium text-[15px] whitespace-nowrap tracking-tight ${isActive ? 'font-semibold' : ''}`}>
                                                {item.label}
                                            </span>
                                        )}

                                        {!isCollapsed && isLocked && (
                                            <Lock size={14} className="ml-auto text-zinc-400" />
                                        )}
                                    </button>
                                </SpotlightButton>

                                {/* Collapsed Tooltip - Floating Glass */}
                                {isCollapsed && (
                                    <div className="absolute left-[110%] top-1/2 -translate-y-1/2 px-3 py-1.5 glass-card bg-white/80 dark:bg-black/80 text-zinc-800 dark:text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-[60] shadow-xl backdrop-blur-xl border border-white/20">
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2 mt-2">
                    <button
                        onClick={() => handleTabClick('Perfil')}
                        className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group
                            ${activeTab === 'Perfil' ? 'glass-card bg-white/50 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white dark:ring-zinc-800 shadow-md">
                                {currentUser.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                        </div>

                        {!isCollapsed && (
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{currentUser.name.split(' ')[0]}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-medium">{currentUser.subscription_tier === 'pro' ? 'Pro Member' : 'Free Plan'}</p>
                            </div>
                        )}
                    </button>

                    <button
                        onClick={onLogout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title="Sair"
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="font-medium text-sm">Sair</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
