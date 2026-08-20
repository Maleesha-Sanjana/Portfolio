import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';

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
    return (
        <motion.div 
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-20%" }}
            variants={fadeUpVariants}
        >
            <h2>Recent Projects</h2>
            <div className="project-grid">
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
                            <button className="btn-icon" title="View Source">
                                <Code2 size={20} />
                            </button>
                            <button className="btn-icon" title="Live Preview">
                                <ExternalLink size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
