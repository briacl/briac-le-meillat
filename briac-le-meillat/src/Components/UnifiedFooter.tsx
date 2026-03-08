import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TooltipItem = ({ label, description }: { label: string, description: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative flex items-center justify-center cursor-help group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="font-mono text-[#00f2ff] text-xl md:text-3xl tracking-widest px-4 py-2 border border-transparent rounded-lg transition-colors group-hover:border-[#00f2ff]/30 group-hover:bg-[#00f2ff]/5">
                {label}
            </span>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 text-center p-3 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-xl pointer-events-none z-50"
                    >
                        <p className="text-sm font-['Montserrat_Alternates'] text-white">
                            {description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function UnifiedFooter() {
    return (
        <footer className="w-full min-h-[50vh] flex flex-col items-center justify-center bg-black relative z-20 border-t border-white/5 py-32">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-[#00f2ff]/5 to-black pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 my-16 z-10 px-4">
                <TooltipItem label="[ Eth ]" description="Couche Liaison. Adressage physique (MAC) et accès au média." />
                <span className="text-gray-600 font-mono text-xl">—</span>
                <TooltipItem label="[ IP ]" description="Couche Réseau. Adressage logique interne/externe et routage." />
                <span className="text-gray-600 font-mono text-xl">—</span>
                <TooltipItem label="[ TCP ]" description="Couche Transport. Fiabilité, encapsulation et contrôle de flux." />
                <span className="text-gray-600 font-mono text-xl">—</span>
                <TooltipItem label="[ HTTP ]" description="Couche Application. Transfert hypertexte et interface web." />
            </div>

            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-gray-400 font-serif font-['Baskerville'] italic text-2xl md:text-3xl mt-12 text-center drop-shadow-md"
            >
                "De la machine à l'utilisateur. Tout est lié."
            </motion.p>
            
            <div className="flex justify-center gap-6 mt-32 z-10">
                <a href="/devop" className="text-gray-600 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-xs font-mono">
                    devop
                </a>
                <a href="/admin" className="text-gray-600 hover:text-[#00f2ff] transition-colors tracking-widest uppercase text-xs font-mono">
                    admin
                </a>
            </div>
        </footer>
    );
}
