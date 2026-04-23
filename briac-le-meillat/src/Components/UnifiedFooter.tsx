import React from 'react';
import { Link } from 'react-router-dom';

/**
 * UnifiedFooter - Reprise de l'architecture Nexus (Hub)
 * Design premium, épuré, type Apple / Nexus.
 */
export default function UnifiedFooter() {
    return (
        <footer className="bg-black py-16 px-6 border-t border-white/5 w-full">
            {/* Bloc Signature Dynamique - Centré au-dessus */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="text-[13px] font-semibold text-zinc-500 flex flex-col items-center gap-1 leading-relaxed">
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-zinc-400 transition-colors cursor-default">
                            Bérangère • Development
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
                {/* Écosystème */}
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Écosystème</span>
                    <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Nexus</Link>
                    <a href="#synapseo" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Synapseo</a>
                    <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Heryze</Link>
                    <a href="#store" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Store</a>
                </div>

                {/* Entreprise */}
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Entreprise</span>
                    <a href="#support" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Support</a>
                    <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Blog</a>
                </div>

                {/* Légal */}
                <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Légal</span>
                    <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Confidentialité</a>
                    <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Conditions</a>
                </div>
            </div>

            {/* Mention Légale Isolée */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
                <p className="text-[11px] text-zinc-600 font-bold tracking-[0.3em] uppercase">
                    © 2026 Bérangère • Development - All Rights Reserved
                </p>
            </div>
        </footer>
    );
}
