import React from 'react';
import { motion } from 'framer-motion';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

export default function Signature() {
    return (
        <div id="signature-section" className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ paddingBottom: '20vh' }}>
            <motion.div
                initial={{ opacity: 0, filter: 'blur(12px)', y: 30 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ 
                    duration: 1.8,
                    ease: APPLE_BEZIER as any
                }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl text-white font-['Baskerville'] tracking-tight text-center"
            >
                System Harmony.
            </motion.div>
        </div>
    );
}
