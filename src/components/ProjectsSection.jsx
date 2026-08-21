import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Smartphone, ArrowLeft } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';
import MobileSimulator from './MobileSimulator';
import BrowserSimulator from './BrowserSimulator';

const projects = [
    {
        title: "Sales Utility App",
        type: "mobile",
        description: "A comprehensive Flutter-based mobile application designed to streamline field sales operations, inventory management, and live location tracking.",
        tech: ["Flutter", "Provider", "Geolocator"],
        link: "#",
        iframeSrc: "/apps/sales-utility/index.html",
        previewImg: "/apps/sales-utility/salesman-utility.jpg"
    },
    {
        title: "Fitness Tracker",
        type: "mobile",
        description: "An elegant workout logging application utilizing complex health data visualization.",
        tech: ["Swift", "HealthKit", "CoreData"],
        link: "#"
    },
    {
        title: "Social Dashboard",
        type: "website",
        description: "A beautiful analytics dashboard for tracking cross-platform social media growth and engagement metrics.",
        tech: ["React", "Tailwind", "D3.js"],
        link: "https://socialdashboard.example.com"
    }
];

const MiniSimulatorButton = ({ project, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isWebsite = project.type === 'website';

    // Mobile: 50x100 placeholder, 175x350 native, 0.2857 scale
    // Website: 80x50 placeholder, 320x200 native, 0.25 scale
    const placeholderWidth = isWebsite ? 80 : 50;
    const placeholderHeight = isWebsite ? 50 : 100;
    
    const nativeWidth = isWebsite ? 320 : 175;
    const nativeHeight = isWebsite ? 200 : 350;
    const idleScale = isWebsite ? 0.25 : 0.2857;

    return (
        <motion.div 
            style={{ width: placeholderWidth, height: placeholderHeight, position: 'relative', zIndex: isHovered ? 50 : 1 }}
            animate={{ y: isHovered ? -50 : [0, -8, 0], x: isHovered ? -20 : 0 }}
            transition={{ y: { duration: isHovered ? 0.4 : 1.5, repeat: isHovered ? 0 : Infinity, ease: "easeOut" } }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            title="Run Simulator"
        >
            <motion.div 
                className={isWebsite ? "mini-browser-btn interactive" : "mini-simulator-btn interactive"}
                style={{ 
                    position: 'absolute',
                    width: nativeWidth,
                    height: nativeHeight,
                    left: (placeholderWidth - nativeWidth) / 2,
                    top: (placeholderHeight - nativeHeight) / 2,
                    borderWidth: isWebsite ? 6 : 14,
                    borderRadius: isWebsite ? 12 : 42,
                    background: isWebsite ? '#000' : undefined,
                    borderColor: '#333',
                    borderStyle: 'solid',
                    display: 'flex',
                    flexDirection: 'column',
                    perspective: 1000, 
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    margin: 0
                }}
                animate={{ 
                    scale: isHovered ? 1 : idleScale,
                    rotateY: isHovered ? -15 : 0,
                    rotateX: isHovered ? 10 : 0,
                    rotateZ: isHovered ? -2 : 0,
                    boxShadow: isHovered 
                        ? "20px 30px 40px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.2)"
                        : `0 ${35}px ${70}px rgba(0,0,0,0.5), inset 0 0 ${17.5}px rgba(255,255,255,0.1)`
                }}
                transition={{ 
                    scale: { type: "spring", stiffness: 200, damping: 20 },
                    default: { duration: 0.4, ease: "easeOut" }
                }}
            >
                {!isWebsite && (
                    <div className="mini-notch" style={{ zIndex: 2, width: 70, height: 17.5, borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}></div>
                )}
                {isWebsite && (
                    <div style={{ height: 24, background: '#1e1e1e', borderTopLeftRadius: 6, borderTopRightRadius: 6, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                )}
                <div className={isWebsite ? "" : "mini-screen"} style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: isWebsite ? '0 0 6px 6px' : 21, background: isWebsite ? '#0a0a0a' : undefined }}>
                    <AnimatePresence mode="wait">
                        {isHovered && project.previewImg ? (
                            <motion.img 
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                src={project.previewImg} 
                                alt="Preview" 
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <motion.span 
                                key="text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mini-text"
                                style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.9rem', color: 'white', fontWeight: 800, textAlign: 'center' }}
                            >
                                Tap to<br/>Demo
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function ProjectsSection() {
    const [activeProject, setActiveProject] = useState(null);

    const handleRunDemo = (project) => {
        setActiveProject(project);
        const section = document.getElementById('projects-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <motion.div 
            id="projects-section"
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-20%" }}
            variants={fadeUpVariants}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
            <h2 style={{ marginBottom: activeProject ? '1rem' : '0' }}>Recent Projects</h2>
            
            <AnimatePresence mode="wait">
                {!activeProject ? (
                    <motion.div 
                        key="grid"
                        className="project-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        {projects.map((project, index) => (
                            <div key={index} className="project-card interactive">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="project-tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <div className="project-links">
                                    <MiniSimulatorButton 
                                        project={project} 
                                        onClick={() => handleRunDemo(project)} 
                                    />
                                    <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                                        <button className="btn-icon interactive" title="View Source">
                                            <Code2 size={20} />
                                        </button>
                                        <button className="btn-icon interactive" title="Live Preview">
                                            <ExternalLink size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="showcase"
                        className="showcase-view interactive"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="showcase-info">
                            <button className="btn-icon back-btn" onClick={() => setActiveProject(null)}>
                                <ArrowLeft size={24} /> Back to Projects
                            </button>
                            <h3 style={{ fontSize: '2rem', marginTop: '1rem' }}>{activeProject.title}</h3>
                            <p style={{ fontSize: '1.1rem', color: '#a3a3a3', lineHeight: '1.6' }}>{activeProject.description}</p>
                            <div className="project-tech" style={{ marginTop: '1rem' }}>
                                {activeProject.tech.map((tech, i) => (
                                    <span key={i} className="project-tech-tag">{tech}</span>
                                ))}
                            </div>
                        </div>

                        <div className="showcase-simulator-container">
                            {activeProject.type === 'website' ? (
                                <BrowserSimulator project={activeProject} />
                            ) : (
                                <MobileSimulator project={activeProject} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
