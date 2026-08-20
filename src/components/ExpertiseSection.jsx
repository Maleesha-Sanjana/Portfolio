import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Code2 } from 'lucide-react';
import { fadeUpVariants } from '../utils/animations';

export default function ExpertiseSection() {
    return (
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
    );
}
