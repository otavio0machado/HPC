import React, { useCallback } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Hero from './Hero';
import Features from './Features';
import SocialProof from './SocialProof';
import Pricing from './Pricing';
import Methodology from './Methodology';
import CTA from './CTA';

interface LandingPageProps {
    onLoginClick: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, isLoggedIn, onLogout }) => {
    const handlePricingNavigate = useCallback((view: 'landing' | 'auth' | 'dashboard') => {
        if (view === 'auth') onLoginClick();
    }, [onLoginClick]);

    return (
        <div className="min-h-screen bg-transparent flex flex-col selection:bg-blue-500/30">
            <Navbar onLoginClick={onLoginClick} isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className="flex-grow">
                <Hero onCtaClick={onLoginClick} />
                <SocialProof />
                <Features />
                <Methodology />
                <Pricing onNavigate={handlePricingNavigate} />
                <CTA onCtaClick={onLoginClick} />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
