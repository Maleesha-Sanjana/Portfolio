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
        >
            <button className="power-button" onClick={() => setIsPoweredOn(true)}>
                <Power size={48} strokeWidth={1.5} color="rgba(255, 255, 255, 0.8)" />
            </button>
        </motion.div>
    );
}
