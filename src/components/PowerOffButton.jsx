import React from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

export default function PowerOffButton({ setIsPoweredOn }) {
    return (
        <motion.button
            className="power-off-button interactive"
            onClick={() => setIsPoweredOn(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 1 }}
            title="Power Off"
        >
            <Power size={22} color="rgba(255, 255, 255, 0.8)" />
        </motion.button>
    );
}
