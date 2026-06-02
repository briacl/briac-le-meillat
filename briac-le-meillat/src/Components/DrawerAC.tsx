import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import type { AcEntry } from '@/data/journey';

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const QUESTIONS: { key: keyof AcEntry; label: string }[] = [
    { key: 'ce_que_jai_fait', label: "Ce que j'ai fait" },
    { key: 'pourquoi', label: 'Pourquoi' },
    { key: 'comment', label: 'Comment' },
    { key: 'difficultes', label: 'Difficultés rencontrées' },
    { key: 'appris', label: "Ce que j'en ai appris" },
    { key: 'autrement', label: "Ce que je ferais autrement" },
];

function AcCard({ entry, color }: { entry: AcEntry; color: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: `rgba(${color}, 0.18)`, backgroundColor: `rgba(${color}, 0.04)` }}
        >
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
            >
                <div>
                    <span
                        className="font-mono text-[9px] uppercase tracking-[0.4em]"
                        style={{ color: `rgb(${color})`, opacity: 0.7 }}
                    >
                        {entry.id}
                    </span>
                    <p className="mt-0.5 text-sm text-white/80 font-medium leading-snug">{entry.label}</p>
                </div>
                <ChevronDown
                    size={16}
                    className="flex-shrink-0 text-white/30 transition-transform duration-300"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {QUESTIONS.map(q => (
                                <div key={q.key}>
                                    <p
                                        className="font-mono text-[8px] uppercase tracking-[0.35em] mb-1"
                                        style={{ color: `rgb(${color})`, opacity: 0.55 }}
                                    >
                                        {q.label}
                                    </p>
                                    <p className="text-xs text-white/55 leading-relaxed">
                                        {entry[q.key] as string}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface DrawerACProps {
    open: boolean;
    onClose: () => void;
    titre: string;
    acs: AcEntry[];
    color: string;
    colorRgb: string;
}

export default function DrawerAC({ open, onClose, titre, acs, color, colorRgb }: DrawerACProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[210] max-h-[80vh] overflow-y-auto rounded-t-3xl bg-zinc-950 border-t border-white/8"
                        style={{ borderColor: `rgba(${colorRgb}, 0.2)` }}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-5 pb-4 bg-zinc-950 border-b border-white/5">
                            <div>
                                <p
                                    className="font-mono text-[8px] uppercase tracking-[0.5em]"
                                    style={{ color, opacity: 0.6 }}
                                >
                                    Apprentissages Critiques
                                </p>
                                <p className="mt-0.5 text-white font-medium text-sm">{titre}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:border-white/25 transition-colors text-white/50 hover:text-white"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-3">
                            {acs.map(ac => (
                                <AcCard key={ac.id} entry={ac} color={colorRgb} />
                            ))}
                        </div>

                        <div className="h-safe-area-bottom h-6" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
