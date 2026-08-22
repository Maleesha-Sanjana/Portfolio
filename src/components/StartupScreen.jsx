import React from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

export default function StartupScreen({ setIsPoweredOn }) {
    return (
        <motion.div 
            className="startup-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ flexDirection: 'column', gap: '2rem' }}
        >
            <button className="power-button" onClick={() => setIsPoweredOn(true)}>
                <Power size={48} strokeWidth={1.5} color="rgba(255, 255, 255, 0.8)" />
            </button>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit', fontSize: '1rem', textAlign: 'center', maxWidth: '80%', margin: 0, letterSpacing: '0.05em' }}>
                For the most immersive interactive experience, please view on a Desktop or Laptop.
            </p>
        </motion.div>
    );
}
