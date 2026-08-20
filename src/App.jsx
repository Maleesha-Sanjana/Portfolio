import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './index.css';

import ScrollCanvas from './components/ScrollCanvas';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExpertiseSection from './components/ExpertiseSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import StartupScreen from './components/StartupScreen';
import PowerOffButton from './components/PowerOffButton';

function App() {
    const [isPoweredOn, setIsPoweredOn] = useState(false);

    useEffect(() => {
        if (!isPoweredOn) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isPoweredOn]);

    return (
        <>
            <ScrollCanvas />

            {/* OVERLAY CONTENT */}
            <div className="overlay-container">
                <HeroSection />
                <div className="spacer"></div>
                <AboutSection />
                <div className="spacer"></div>
                <ExpertiseSection />
                <div className="spacer"></div>
                <ProjectsSection />
                <div className="spacer"></div>
                <ContactSection />
            </div>

            <AnimatePresence>
                {isPoweredOn && (
                    <PowerOffButton setIsPoweredOn={setIsPoweredOn} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isPoweredOn && (
                    <StartupScreen setIsPoweredOn={setIsPoweredOn} />
                )}
            </AnimatePresence>
        </>
    );
}

export default App;
