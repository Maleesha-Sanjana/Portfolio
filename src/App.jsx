import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Code2, Rocket, Mail, ExternalLink, Power } from 'lucide-react';
import './index.css';

const frameCount = 300;

// Generate image paths matching ezgif-frame-001.png to ezgif-frame-300.png
const currentFrame = (index) => {
    return `/Animation/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`;
};

function App() {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(0);
    const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
    const [error, setError] = useState('');
    
    // We keep images in a ref so they don't trigger re-renders
    const imagesRef = useRef(new Array(frameCount));
    const frameRef = useRef({ frame: 0 });
    const tickingRef = useRef(false);
    const [isPoweredOn, setIsPoweredOn] = useState(false);

    useEffect(() => {
        if (!isPoweredOn) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isPoweredOn]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');

        const updateFrameIndex = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScrollTop > 0) {
                const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
                frameRef.current.frame = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
            } else {
                frameRef.current.frame = 0;
            }
        };

        const render = () => {
            const img = imagesRef.current[frameRef.current.frame];
            if (img && img.complete && img.naturalWidth > 0) {
                const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
                const x = (canvas.width / 2) - (img.naturalWidth / 2) * scale;
                const y = (canvas.height / 2) - (img.naturalHeight / 2) * scale;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        updateFrameIndex();

        // 1. Load initial frame
        const initialFrameIndex = frameRef.current.frame;
        const initialImg = new Image();
        initialImg.src = currentFrame(initialFrameIndex);
        
        initialImg.onload = () => {
            imagesRef.current[initialFrameIndex] = initialImg;
            setIsFirstFrameLoaded(true);
            render();
            
            // 2. Preload remaining
            let loadedCount = 1;
            for (let i = 0; i < frameCount; i++) {
                if (i === initialFrameIndex) continue;

                const img = new Image();
                img.src = currentFrame(i);
                img.onload = () => {
                    loadedCount++;
                    setLoading(Math.round((loadedCount / frameCount) * 100));
                    
                    if (i === frameRef.current.frame) {
                        render(); 
                    }
                };
                imagesRef.current[i] = img;
            }
        };

        initialImg.onerror = () => {
            setError("Error loading images. Check console.");
        };

        const handleScroll = () => {
            if (!tickingRef.current) {
                window.requestAnimationFrame(() => {
                    updateFrameIndex();
                    render();
                    tickingRef.current = false;
                });
                tickingRef.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Framer Motion animation variants for sections appearing
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <>
            {!isFirstFrameLoaded && !error && (
                <div className="loading-indicator">
                    Loading... {loading}%
                </div>
            )}
            {error && (
                <div className="loading-indicator">
                    {error}
                </div>
            )}
            
            <canvas ref={canvasRef} id="canvas"></canvas>

            {/* OVERLAY CONTENT */}
            <div className="overlay-container">
                
                {/* HERO SECTION */}
                <motion.div 
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-20%" }}
                    variants={fadeUpVariants}
                >
                    <h1>Maleesha Sanjana</h1>
                    <p className="subtitle">Crafting immersive digital experiences as a Mobile Application Developer.</p>
                    
                    <div style={{ display: 'flex', gap: '1rem' }} className="interactive">
                        <button className="btn">
                            <Rocket size={20} /> View Projects
                        </button>
                        <button className="btn btn-secondary">
                            <Mail size={20} /> Contact Me
                        </button>
                    </div>
                </motion.div>

                <div className="spacer"></div>

                {/* ABOUT SECTION */}
                <motion.div 
                    className="section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-20%" }}
                    variants={fadeUpVariants}
                >
                    <div className="glass-card interactive">
                        <h2>About Me</h2>
                        <p>
                            I am currently pursuing a BSc. (Hons) in Software Engineering at CINEC Campus and working as a Full Stack Mobile Application Developer at Jazz Business Solutions (Pvt) Ltd. I specialize in building high-performance mobile applications, combining solid engineering with an obsession for smooth animations and pixel-perfect design.
                        </p>
                        
                        <h3 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>Core Technologies</h3>
                        <div className="skills-grid">
                            {['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'].map(skill => (
                                <div key={skill} className="skill-tag">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="spacer"></div>

                {/* EXPERTISE SECTION */}
                <motion.div 
                    className="section" style={{ alignItems: 'flex-end' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-20%" }}
                    variants={fadeUpVariants}
                >
                    <div className="glass-card interactive">
                        <h2>What I Do</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Smartphone color="#a3a3a3" size={32} />
                                <div>
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontFamily: 'Outfit' }}>Mobile Development</h3>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>End-to-end development for iOS and Android platforms.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Code2 color="#a3a3a3" size={32} />
                                <div>
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontFamily: 'Outfit' }}>UI/UX Implementation</h3>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>Translating complex designs into responsive, interactive interfaces.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* FOOTER / CONTACT SECTION */}
                <motion.div 
                    className="section" style={{ justifyContent: 'flex-end', paddingBottom: '10vh' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-10%" }}
                    variants={fadeUpVariants}
                >
                    <div style={{ textAlign: 'center', margin: '0 auto' }} className="interactive">
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Ready to build something amazing?</h2>
                        <button className="btn" style={{ marginTop: '1.5rem' }}>
                            Get in touch <ExternalLink size={18} />
                        </button>
                    </div>
                </motion.div>

            </div>

            <AnimatePresence>
                {!isPoweredOn && (
                    <motion.div 
                        className="startup-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        <button className="power-button" onClick={() => setIsPoweredOn(true)}>
                            <Power size={48} strokeWidth={1.5} color="rgba(255, 255, 255, 0.8)" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default App;
