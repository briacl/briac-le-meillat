import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TIMELINE_DOCS = [
    { title: "NetworkBriacRoomGtw", path: "assets/documents/apprentissage/NetworkBriac/NetworkBriacRoomGtw.md" },
    { title: "partage-reseau", path: "assets/documents/apprentissage/NetworkBriac/partage-reseau.md" },
    { title: "NetworkBriacProxy", path: "assets/documents/apprentissage/NetworkBriac/NetworkBriacProxy.md" },
    { title: "stbernard", path: "assets/documents/apprentissage/NetworkBriac/stbernard.md" },
    { title: "NBDomain-Etablissement", path: "assets/documents/apprentissage/NetworkBriac/NBDomain-Etablissement.md" },
    { title: "NBPXE", path: "assets/documents/apprentissage/NetworkBriac/NBPXE.md" },
];

function PaperVector() {
    return (
        <div className="w-16 h-20 md:w-20 md:h-28 rounded shadow-xl flex flex-col justify-end pb-2 px-2 relative bg-white border border-black/10 overflow-hidden shrink-0 transition-transform hover:scale-105">
            {[80, 100, 65, 90, 70].map((w, i) => (
                <div key={i} className="h-[2px] rounded-full bg-black/10 mb-1" style={{ width: `${w}%` }} />
            ))}
            <div className="absolute top-0 right-0 w-4 h-4 bg-black/5" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
        </div>
    );
}

const NetworkBriacSpotlight = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const BASE_URL = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

    const handleDocClick = (path: string, e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`${BASE_URL}ex?file=/${encodeURIComponent(path)}`, '_blank');
    };

    return (
        <section id="networkbriac-spotlight" className="w-full bg-white flex flex-col items-center justify-center py-32 px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex flex-col items-center gap-6 w-full max-w-6xl"
            >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter leading-none font-['Paris2024'] text-center">
                    <span className="bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent select-none">
                        NetworkBriac
                    </span>
                </h2>

                <AnimatePresence mode="wait">
                    {!isExpanded ? (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="w-full cursor-pointer rounded-[2rem] transition-all duration-500 hover:scale-[1.015] border border-slate-100/80"
                            style={{
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
                            }}
                            onClick={() => setIsExpanded(true)}
                        >
                            <img
                                src={`${BASE_URL}assets/documents/apprentissage/NetworkBriac/visuel/Gemini_Generated_Image_uwwkdbuwwkdbuwwk.png`}
                                alt="NetworkBriac"
                                className="w-full object-cover rounded-[2rem]"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="w-full mt-16 relative flex flex-col items-center"
                        >
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="mb-10 text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400 hover:text-black transition-colors"
                            >
                                ← Revenir à l'image
                            </button>

                            {/* Ligne chronologique */}
                            <div className="relative w-full pt-4 pb-12 flex flex-col items-center">
                                {/* Ligne horizontale en bas */}
                                <div className="absolute bottom-6 left-0 w-full h-[1px] bg-zinc-300 z-0 hidden md:block" />

                                <div className="flex flex-col md:flex-row items-end justify-between w-full gap-8 md:gap-4 relative z-10 overflow-x-auto px-4 pb-4">
                                    {TIMELINE_DOCS.map((doc, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.15, duration: 0.5 }}
                                            className="flex flex-col items-center cursor-pointer min-w-[120px] group relative"
                                            onClick={(e) => handleDocClick(doc.path, e)}
                                        >
                                            <div className="mb-3">
                                                <PaperVector />
                                            </div>

                                            <div className="text-center mb-6 max-w-[140px]">
                                                <span className="block text-[9px] font-mono text-zinc-400 tracking-widest mb-1">
                                                    Étape 0{idx + 1}
                                                </span>
                                                <span className="block text-sm font-['Paris2024'] text-zinc-800 leading-tight group-hover:text-[#0075FF] transition-colors">
                                                    {doc.title}
                                                </span>
                                            </div>

                                            {/* Trait vertical et point vers la ligne */}
                                            <div className="hidden md:flex flex-col items-center absolute bottom-0 left-1/2 -translate-x-1/2 h-6">
                                                <div className="w-[1px] h-full bg-zinc-300 group-hover:bg-[#0075FF] transition-colors" />
                                                <div className="absolute bottom-[-3px] w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-[#0075FF] group-hover:scale-150 transition-all duration-300" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </section>
    );
};

export default NetworkBriacSpotlight;
