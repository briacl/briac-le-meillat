import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';

const BASE = (() => {
    const b = import.meta.env.BASE_URL;
    return b.endsWith('/') ? b : `${b}/`;
})();

import { getAllTps, Proof } from '@/utils/tpsProvider';
import { exportToPDF } from '@/Utils/DocumentExporter';

interface AC {
    code: string;
    titre: string;
}

// OriginBadge Component
const OriginBadge = ({ label, color }: { label: string; color: string }) => (
    <span className={`text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-0.5 rounded-full border ${color}`}>
        {label}
    </span>
);

// Typewriter text effect component
function TypewriterText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.02, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            transition: { duration: 0.01 },
        },
        hidden: {
            opacity: 0,
            transition: { duration: 0.01 },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            className={`flex flex-wrap ${className}`}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}

export default function StudentShowcaseSection() {
    const [acs, setAcs] = useState<AC[]>([]);
    const [proofs, setProofs] = useState<Proof[]>([]);
    const [activeAc, setActiveAc] = useState<string>('');

    // Fetch data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch competences to get ACs
                const compRes = await fetch(`${BASE}data/competences.json?v=${Date.now()}`);
                const compData = await compRes.json();

                let allAcs: AC[] = [];
                if (compData && compData.competences) {
                    compData.competences.forEach((comp: any) => {
                        if (comp.apprentissages_critiques) {
                            const excludedAcs = ['AC11.01', 'AC12.01', 'AC12.02', 'AC12.03', 'AC12.05', 'AC13.02', 'AC13.03', 'AC13.06'];
                            const filteredAcs = comp.apprentissages_critiques.filter((ac: any) => !excludedAcs.includes(ac.code));

                            allAcs = [...allAcs, ...filteredAcs.map((ac: any) => ({
                                code: ac.code,
                                titre: ac.titre
                            }))];
                        }
                    });
                }
                setAcs(allAcs);

                if (allAcs.length > 0) {
                    setActiveAc(allAcs[0].code);
                }

                // Load all TPs
                const allProofs = await getAllTps();
                setProofs(allProofs);

            } catch (err) {
                console.error("Error loading showcase data", err);
            }
        };

        loadData();
    }, []);

    // Filter proofs for the active AC, hide perso projects, and hide SAE102
    const activeProofs = proofs.filter(p =>
        p.ac_lies &&
        p.ac_lies.includes(activeAc) &&
        p.project_type !== 'perso' &&
        !p.title.toLowerCase().includes('sae102') &&
        !p.path.toLowerCase().includes('sae102')
    );
    console.log('CLIENT DEBUG (StudentShowcase) - activeAc:', activeAc, '| proofs:', proofs.length, '| activeProofs:', activeProofs.length);
    if (proofs.length > 0 && activeProofs.length === 0) {
        console.log('CLIENT DEBUG (StudentShowcase) - Sample proof ac_lies:', proofs.slice(0, 3).map(p => ({ title: p.title, ac_lies: p.ac_lies, type: typeof p.ac_lies })));
    }

    return (
        <section id="student-showcase" className="relative w-full h-[90vh] lg:h-screen bg-white flex flex-col lg:flex-row border-b border-black/5 overflow-hidden">

            {/* Left Column: Text & AC List (Fixed) */}
            <div className="w-full lg:w-5/12 h-full z-20 flex flex-col px-8 lg:pl-16 xl:pl-32 lg:pr-12 pt-10 lg:pt-[15vh] bg-white">

                <div className="mb-8">
                    <div className="min-h-[40px] flex items-center mb-1">
                        <TypewriterText
                            text="Je suis étudiant de 2ème année"
                            className="font-['Baskerville'] text-2xl md:text-3xl text-black leading-tight"
                        />
                    </div>
                    <TypewriterText
                        text="en Réseaux et Télécommunications"
                        delay={0.6}
                        className="font-['Baskerville'] text-base md:text-lg text-zinc-500 leading-relaxed italic"
                    />
                    <TypewriterText
                        text="à l'IUT de Béthune, faisant partie de"
                        delay={1.2}
                        className="font-['Baskerville'] text-base md:text-lg text-zinc-500 leading-relaxed italic"
                    />
                    <TypewriterText
                        text="l'Université d'Artois"
                        delay={1.8}
                        className="font-['Baskerville'] text-base md:text-lg text-zinc-500 mb-8 leading-relaxed italic"
                    />
                    <TypewriterText
                        text="Je sais :"
                        delay={2.5}
                        className="font-['Baskerville'] text-xl md:text-2xl text-zinc-400"
                    />
                </div>

                {/* Static AC List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.2, duration: 1 }}
                    className="w-full h-[40vh] overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="flex flex-col gap-2 pb-10">
                        {acs.map((ac) => {
                            const isActive = activeAc === ac.code;
                            return (
                                <button
                                    key={ac.code}
                                    onClick={() => setActiveAc(ac.code)}
                                    className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-200 border-l-2 ${isActive
                                        ? 'border-[#0075FF] bg-[#0075FF]/5'
                                        : 'border-transparent hover:bg-zinc-50'
                                        }`}
                                >
                                    <p className={`font-mono text-[9px] uppercase tracking-[0.1em] mb-1 ${isActive ? 'text-[#0075FF]/70' : 'text-zinc-400'}`}>
                                        {ac.code}
                                    </p>
                                    <p className={`text-xs md:text-sm leading-snug ${isActive ? 'text-[#0075FF] font-medium' : 'text-zinc-500'}`}>
                                        {ac.titre}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Blog-style list (Internal Scroll) */}
            <div className="w-full lg:w-7/12 h-full flex flex-col bg-white px-8 lg:pr-16 xl:pr-32 lg:pl-12 pt-10 lg:pt-[15vh] relative">

                <div className="max-w-4xl mx-auto lg:mx-0 w-full h-full flex flex-col">
                    {/* Blog Link (Fixed at the same height as the left title) */}
                    <div className="min-h-[40px] flex items-center justify-end mb-1">
                        <Link
                            to="/blog"
                            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-[#0075FF] transition-colors"
                        >
                            Accéder au Blog
                            <span className="text-base leading-none group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Scrollable Area for TPs */}
                    <div className="flex-1 overflow-y-auto pb-32" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={activeAc}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeProofs.length > 0 ? (
                                <div className="space-y-2">
                                    {activeProofs.map((proof, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.3 }}
                                            className="group"
                                        >
                                            <a
                                                href={`${BASE}ex?file=${encodeURIComponent(proof.path)}&title=${encodeURIComponent(proof.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-left py-6 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 rounded-2xl px-4 -mx-4 transition-colors"
                                            >
                                                <div className="flex items-start gap-6">
                                                    {/* Vignette */}
                                                    {proof.image && (
                                                        <div className="hidden sm:block flex-shrink-0 w-28 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-50 shadow-sm mt-1">
                                                            <img
                                                                src={proof.image}
                                                                alt={proof.title}
                                                                className="w-full h-auto object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                                                                {new Date(proof.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="text-zinc-200">·</span>
                                                            <span className="text-[10px] font-mono text-[#0075FF]/70 tracking-[0.2em] uppercase">
                                                                {proof.module}
                                                            </span>
                                                            {proof.isPDF && (
                                                                <OriginBadge label="IUT" color="bg-[#0075FF]/5 text-[#0075FF] border-[#0075FF]/20" />
                                                            )}
                                                        </div>
                                                        <h2 className="font-['Baskerville'] text-xl md:text-2xl text-zinc-900 group-hover:text-[#0075FF] transition-colors leading-snug">
                                                            {proof.title}
                                                        </h2>
                                                        <div className="flex gap-2 flex-wrap pt-2">
                                                            {proof.techs.slice(0, 5).map((t, idx) => (
                                                                <span key={idx} className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 px-2 py-0.5 border border-zinc-100 rounded bg-white">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center justify-between self-stretch flex-shrink-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                exportToPDF(proof.title, proof.path);
                                                            }}
                                                            className="text-zinc-300 hover:text-[#0075FF] transition-colors p-2 rounded-full hover:bg-[#0075FF]/5"
                                                            title="Télécharger en PDF"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <span className="text-zinc-300 group-hover:text-[#0075FF] group-hover:translate-x-1 transition-all text-xl mb-1">
                                                            →
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-32 text-center">
                                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
                                        Archive vide
                                    </p>
                                    <p className="text-zinc-500 text-sm max-w-sm">
                                        Aucun compte-rendu technique n'est publiquement associé à cet apprentissage critique pour le moment.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                </div>
            </div>
        </section>
    );
}
