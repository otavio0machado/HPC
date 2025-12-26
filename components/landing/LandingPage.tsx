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
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <Navbar onLoginClick={onLoginClick} isLoggedIn={false} />

            <main className="flex-grow">
                <Hero onCtaClick={onLoginClick} />
                <SocialProof />
                <Methodology />
                <Features />
                <Planner />
                <Pricing />
                <CTA onCtaClick={onLoginClick} />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
