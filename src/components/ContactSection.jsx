import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';

export default function ContactSection() {
    return (
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
    );
}
