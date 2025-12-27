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
    ];

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
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-4 left-4 bottom-4 z-50 glass-spatial rounded-[32px] transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64 flex flex-col justify-between
        `}
            >
                {/* Header / Logo */}
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="font-bold text-xl tracking-tighter text-white animate-in fade-in duration-300">
                            HPC<span className="text-blue-500">.</span>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-full flex justify-center font-bold text-xl tracking-tighter text-white">
                            H<span className="text-blue-500">.</span>
                        </div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isLocked = item.restricted && currentUser.subscription_tier !== 'pro';

                        return (
                            <SpotlightButton
                                key={item.id}
                                className={`
                  w-full rounded-xl transition-all duration-200 group relative
                  ${isActive
                                        ? 'glass-active text-blue-400'
                                        : 'hover:bg-white/5'}
                `}
                            >
                                <button
                                    onClick={() => handleTabClick(item.id, item.restricted)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-3 transition-all duration-200
                    ${isActive
                                            ? 'text-blue-400'
                                            : 'text-zinc-400 hover:text-zinc-200'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                                >
                                    <Icon size={20} className={`min-w-[20px] ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:text-zinc-200'}`} />

                                    {!isCollapsed && (
                                        <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                                    )}

                                    {!isCollapsed && isLocked && (
                                        <Lock size={14} className="ml-auto text-zinc-600" />
                                    )}

                                    {/* Collapsed Tooltip */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            </SpotlightButton>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-3 border-t border-white/5 space-y-1 bg-zinc-900/20">
                    <button
                        onClick={() => handleTabClick('Perfil')}
                        className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${activeTab === 'Perfil' ? 'bg-white/5 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}
              ${isCollapsed ? 'justify-center' : ''}
            `}
                    >
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-zinc-950">
                                {currentUser.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                        </div>

                        {!isCollapsed && (
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-200 truncate">{currentUser.name.split(' ')[0]}</p>
                                <p className="text-xs text-zinc-500 truncate">{currentUser.subscription_tier === 'pro' ? 'Pro Member' : 'Free Plan'}</p>
                            </div>
                        )}
                    </button>

                    <button
                        onClick={onLogout}
                        className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10
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
