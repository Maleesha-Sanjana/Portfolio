import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Mail } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';

export default function HeroSection() {
    return (
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
    );
}
