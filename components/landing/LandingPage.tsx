import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Hero from './Hero';
import Features from './Features';
import SocialProof from './SocialProof';
import CTA from './CTA';
import Pricing from './Pricing';
import Methodology from './Methodology';
import Planner from '../Planner';

interface LandingPageProps {
    onLoginClick: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, isLoggedIn, onLogout }) => {
    return (
        <div className="min-h-screen bg-transparent flex flex-col selection:bg-blue-500/30">
            <Navbar onLoginClick={onLoginClick} isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main className="flex-grow">
                <Hero onCtaClick={onLoginClick} />
                <SocialProof />
                <Methodology />
                <Features />
                {/* <Planner /> */}
                <Pricing onNavigate={(view) => {
                    if (view === 'auth') onLoginClick();
                }} />
                {/* <CTA onCtaClick={onLoginClick} /> */}
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
