import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Smartphone, ArrowLeft } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';
import MobileSimulator from './MobileSimulator';

const projects = [
    {
        title: "E-Commerce App",
        description: "A full-featured mobile shopping experience with seamless animations and real-time inventory tracking.",
        tech: ["React Native", "Firebase", "Redux"],
        link: "#"
    },
    {
        title: "Fitness Tracker",
        description: "An elegant workout logging application utilizing complex health data visualization.",
        tech: ["Flutter", "GraphQL", "Swift"],
        link: "#"
    },
    {
        title: "Fintech Dashboard",
        description: "A secure, high-performance banking dashboard with real-time charting and analytics.",
        tech: ["Kotlin", "Jetpack Compose", "REST"],
        link: "#"
    }
];

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
                                    <button 
                                        className="btn interactive" 
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginTop: '0' }}
                                        onClick={() => handleRunDemo(project)}
                                    >
                                        <Smartphone size={16} /> Run Demo
                                    </button>
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
                            <MobileSimulator project={activeProject} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
