import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import UnifiedFooter from '../Components/UnifiedFooter';
import MarkdownRenderer from '../Components/MarkdownRenderer';
import { motion } from 'framer-motion';
import { Terminal, Book, Type } from 'lucide-react';

const ExPage: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}assets/documents/apprentissage/sae102.md`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.text();
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching markdown:', err);
                setContent('# Error\nImpossible de charger le compte-rendu.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />

            <main className="pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Typography Test Section */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 p-8 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <h2 className="font-['Paris2024'] text-2xl mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                            <Type className="w-6 h-6 text-accent-primary" />
                            Visualisation des Typographies
                        </h2>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-['Roboto_Mono']">En-tête & Titres</span>
                                <p className="font-['Paris2024'] text-3xl text-slate-800 dark:text-slate-200">Paris 2024</p>
                                <p className="text-sm text-slate-500 font-['Montserrat']">Utilisée pour la hiérarchie visuelle et l'impact institutionnel.</p>
                            </div>
                            
                            <div className="space-y-3">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-['Roboto_Mono']">Corps de Texte</span>
                                <p className="font-['Baskerville'] text-xl text-slate-800 dark:text-slate-200">Baskerville Regular</p>
                                <p className="text-sm text-slate-500 font-['Baskerville']">Une police serif classique pour une élégance académique.</p>
                            </div>
                            
                            <div className="space-y-3">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-['Roboto_Mono']">Style Terminal</span>
                                <p className="font-['Roboto_Mono'] text-lg text-slate-800 dark:text-slate-200">Roboto Mono</p>
                                <p className="text-sm text-slate-500 font-['Baskerville']">Pour les données techniques, tableaux et extraits de code.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Main Content Card */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800/50 shadow-xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                                <Book className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.2em] text-accent-primary font-bold">Rapport Académique</p>
                                <h1 className="font-['Paris2024'] text-3xl md:text-5xl text-slate-900 dark:text-white mt-1">SAE102 - Compte Rendu</h1>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-10 h-10 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                                <p className="font-['Roboto_Mono'] text-slate-400 text-sm animate-pulse">Chargement du document...</p>
                            </div>
                        ) : (
                            <MarkdownRenderer content={content} />
                        )}
                    </motion.div>
                </div>
            </main>

            <UnifiedFooter />
        </div>
    );
};

export default ExPage;
