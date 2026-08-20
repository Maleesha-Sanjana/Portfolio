import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../utils/animations';

export default function AboutSection() {
    return (
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
    );
}
