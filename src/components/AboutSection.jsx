import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../utils/animations';
import GitHubGraph3D from './GitHubGraph3D';

export default function AboutSection() {
    return (
        <motion.div 
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-20%" }}
            variants={fadeUpVariants}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                <div className="glass-card interactive" style={{ height: '620px', display: 'flex', flexDirection: 'column' }}>
                    <h2>About Me</h2>
                    <p>
                        I am currently working as a Full Stack Mobile Application Developer at Jazz Business Solutions (Pvt) Ltd and pursuing a BSc. (Hons) in Software Engineering at CINEC Campus. I specialize in building high-performance mobile applications, combining solid engineering with an obsession for smooth animations and pixel-perfect design.
                    </p>
                    
                    <h3 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>Core Technologies</h3>
                    <div className="skills-grid">
                        {['Flutter', 'React.js', 'Java', 'Python', 'Node.js', 'MSSQL', 'Firebase', 'HTML', 'CSS', 'Javascript'].map(skill => (
                            <div key={skill} className="skill-tag">
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>

                <GitHubGraph3D />
            </div>
        </motion.div>
    );
}
