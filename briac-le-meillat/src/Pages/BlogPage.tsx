import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisclosure, Button } from '@heroui/react';
import { X, ArrowLeft, Download } from 'lucide-react';
import { exportToPDF } from '@/Utils/DocumentExporter';
import Navbar from '@/Components/Navbar';
import UnifiedFooter from '@/Components/UnifiedFooter';
import ExPage from '@/Pages/ExPage';
import BlogSearchBar from '@/Components/BlogSearchBar';
import { readDocument } from '@/Utils/DocumentExporter';

import { Proof } from '@/Utils/searchEngine';


const OriginBadge = ({ label, color }: { label: string; color: string }) => (
    <span className={`text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-0.5 rounded-full border ${color}`}>
        {label}
    </span>
);

function AiResponseRenderer({ text, onNavigate }: { text: string; onNavigate: (path: string) => void }) {
    // Parse markdown links [label](href) → clickable buttons, rest stays as text
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            elements.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
        }
        const label = match[1];
        const href = match[2];
        elements.push(
            <button
                key={key++}
                onClick={() => onNavigate(href)}
                className="inline text-[#0075FF] underline underline-offset-2 hover:text-[#f336f0] transition-colors"
            >
                {label}
            </button>
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }
    return <>{elements}</>;
}

export default function BlogPage() {
    const [proofs, setProofs] = useState<Proof[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5);
    const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<{ query: string; response: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [filteredProofs, setFilteredProofs] = useState<Proof[] | null>(null);

    useEffect(() => {
        document.title = 'Blog · Bérangère Development';
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                const [registryRes, tpsRes] = await Promise.all([
                    fetch(`${baseUrl}data/registry.json?v=${Date.now()}`),
                    fetch(`${baseUrl}data/tps.json?v=${Date.now()}`).catch(() => null),
                ]);
                let merged: Proof[] = [];
                if (registryRes.ok) {
                    const data = await registryRes.json();
                    const baseUrl2 = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                    merged = data.proofs.map((p: any) => ({
                        ...p,
                        image: p.image ? `${baseUrl2}${p.image}` : undefined,
                    }));
                }
                if (tpsRes && tpsRes.ok) {
                    const tpsData = await tpsRes.json();
                    merged = [...merged, ...tpsData.map((tp: any) => ({
                        title: tp.titre,
                        module: tp.ressource,
                        techs: ['PDF'],
                        date: tp.date.split('/').reverse().join('-'),
                        path: tp.fichier,
                        isPDF: true,
                    }))];
                }
                merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setProofs(merged);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClick = (proof: Proof) => {
        readDocument(proof.path, () => {
            setSelectedProof(proof);
            onOpen();
        });
    };

    const handleSearchResult = (query: string, response: string, filtered: Proof[] | null) => {
        setSearchQuery(query);
        setSearchResult({ query, response });
        setFilteredProofs(filtered);
        setVisibleCount(5);
    };

    const handleNavigate = (href: string) => {
        if (href === '/blog') {
            setSearchResult(null);
            setFilteredProofs(null);
        } else {
            window.location.href = href;
        }
    };

    const visible = proofs.slice(0, visibleCount);

    const isSearchMode = searchResult !== null;

    return (
        <div className="min-h-screen font-sans bg-white">
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isSearchMode ? (
                    /* ── ÉTAT INITIAL : barre de recherche centrée ── */
                    <motion.main
                        key="search-home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
                    >
                        {/* Glow cyan — centré exactement sur la barre de recherche */}
                        <div
                            className="pointer-events-none absolute"
                            style={{
                                width: '800px',
                                height: '400px',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-75%, -50%)',
                                background: 'radial-gradient(ellipse at center, rgba(0,117,255,0.5) 0%, transparent 65%)',
                                filter: 'blur(60px)',
                            }}
                        />
                        {/* Glow magenta — centré exactement sur la barre de recherche */}
                        <div
                            className="pointer-events-none absolute"
                            style={{
                                width: '800px',
                                height: '400px',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-25%, -50%)',
                                background: 'radial-gradient(ellipse at center, rgba(243,54,240,0.42) 0%, transparent 65%)',
                                filter: 'blur(60px)',
                            }}
                        />

                        {/* Titre + barre : titre hors du flux (absolute) → flex center = barre seule au vrai centre */}
                        <div className="relative w-full max-w-2xl">
                            {/* Hero text — flotte au-dessus de la barre */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute bottom-full left-0 right-0 text-center mb-8"
                                style={{ marginBottom: '2rem' }}
                            >
                                <h1 className="font-['Paris2024'] text-3xl md:text-4xl tracking-tight text-zinc-600">
                                    Explorez les travaux de Briac
                                </h1>
                            </motion.div>

                            {/* Search bar — seul élément dans le flux, sera au vrai centre vertical */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="w-full"
                            >
                                <BlogSearchBar
                                    onResult={handleSearchResult}
                                    proofs={proofs}
                                    isLoading={isSearching}
                                    setIsLoading={setIsSearching}
                                />
                            </motion.div>
                        </div>
                    </motion.main>
                ) : (
                    /* ── ÉTAT RÉSULTATS ── */
                    <motion.main
                        key="search-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl mx-auto px-6 pt-40 pb-32"
                    >
                        {/* Compact search bar */}
                        <div className="mb-10">
                            <BlogSearchBar
                                onResult={handleSearchResult}
                                proofs={proofs}
                                isLoading={isSearching}
                                setIsLoading={setIsSearching}
                                compact={true}
                                initialValue={searchQuery}
                            />
                        </div>

                        {/* AI Response card — affiché uniquement si réponse substantielle */}
                        {searchResult.response.trim().length > 20 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mb-14 rounded-3xl border border-zinc-100 bg-white shadow-sm overflow-hidden"
                            >
                                <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0075FF]" />
                                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">
                                        Recherche · Bérangère Development
                                    </span>
                                </div>
                                <div className="px-6 py-5 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                    <AiResponseRenderer text={searchResult.response} onNavigate={handleNavigate} />
                                </div>
                            </motion.div>
                        )}

                        {/* Divider + list title */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-zinc-100" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-400">
                                {filteredProofs !== null
                                    ? (filteredProofs.length > 0 ? `${filteredProofs.length} résultat(s)` : 'Aucun résultat')
                                    : 'Tous les travaux'}
                            </span>
                            <div className="h-px flex-1 bg-zinc-100" />
                        </div>

                        {/* Documents list */}
                        {loading ? (
                            <p className="text-zinc-400 font-mono text-sm">Chargement…</p>
                        ) : (
                            <div>
                                {(filteredProofs !== null ? filteredProofs : visible).map((proof, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.3 }}
                                    >
                                        <a
                                            href={`${import.meta.env.BASE_URL}ex?file=${encodeURIComponent(proof.path)}&title=${encodeURIComponent(proof.title)}`}
                                            onClick={(e) => {
                                                if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleClick(proof);
                                                }
                                            }}
                                            className="block w-full text-left py-7 group"
                                        >
                                            <div className="flex items-start gap-5">
                                                {/* Vignette */}
                                                {proof.image && (
                                                    <div className="flex-shrink-0 w-32 rounded-xl overflow-hidden bg-zinc-100">
                                                        <img
                                                            src={proof.image}
                                                            alt={proof.title}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                                                            {new Date(proof.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-zinc-200">·</span>
                                                        <span className="text-[10px] font-mono text-[#0075FF]/70 tracking-[0.2em] uppercase">
                                                            {proof.module}
                                                        </span>
                                                        {proof.isPDF && (
                                                            <OriginBadge label="IUT" color="bg-[#0075FF]/5 text-[#0075FF] border-[#0075FF]/20" />
                                                        )}
                                                    </div>
                                                    <h2 className="font-['Baskerville'] text-xl text-zinc-900 group-hover:text-[#0075FF] transition-colors leading-snug">
                                                        {proof.title}
                                                    </h2>
                                                    <div className="flex gap-2 flex-wrap pt-1">
                                                        {proof.techs.slice(0, 4).map((t, idx) => (
                                                            <span key={idx} className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 px-2 py-0.5 border border-zinc-100 rounded bg-zinc-50">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0 mt-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); exportToPDF(proof.title, proof.path); }}
                                                        className="text-zinc-300 hover:text-[#0075FF] transition-colors p-1"
                                                        title="Télécharger"
                                                    >
                                                        <Download size={15} />
                                                    </button>
                                                    <span className="text-zinc-300 group-hover:text-[#0075FF] group-hover:translate-x-1 transition-all text-lg">
                                                        →
                                                    </span>
                                                </div>
                                                </div>
                                            </div>
                                        </a>
                                        {i < (filteredProofs !== null ? filteredProofs : visible).length - 1 && <div className="h-px bg-zinc-100" />}
                                    </motion.div>
                                ))}

                                {filteredProofs === null && visibleCount < proofs.length && (
                                    <div className="mt-12 flex justify-center">
                                        <button
                                            onClick={() => setVisibleCount(c => c + 5)}
                                            className="group flex flex-col items-center gap-3 transition-all duration-300"
                                        >
                                            <div className="w-10 h-px bg-zinc-200 group-hover:w-20 group-hover:bg-[#0075FF] transition-all duration-300" />
                                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-400 group-hover:text-zinc-800 transition-colors">
                                                Afficher 5 de plus ({proofs.length - visibleCount} restants)
                                            </span>
                                        </button>
                                    </div>
                                )}

                                {filteredProofs === null && proofs.length === 0 && (
                                    <p className="text-zinc-400 font-mono text-sm text-center py-20">Aucun document trouvé.</p>
                                )}
                            </div>
                        )}

                        {/* Back to search */}
                        <div className="mt-16 flex justify-center">
                            <button
                                onClick={() => { setSearchResult(null); setFilteredProofs(null); }}
                                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-700 transition-colors"
                            >
                                <ArrowLeft size={12} />
                                Nouvelle recherche
                            </button>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            <UnifiedFooter />

            {/* Reader Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[300] bg-slate-50 overflow-y-auto">
                    <div className="fixed top-8 right-8 z-[400]">
                        <Button
                            isIconOnly
                            onPress={() => onOpenChange()}
                            className="rounded-full bg-white/80 hover:bg-white backdrop-blur-xl w-14 h-14 border border-black/5 shadow-xl transition-all hover:scale-105"
                        >
                            <X size={22} />
                        </Button>
                    </div>
                    <div className="max-w-4xl mx-auto px-6 py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white border border-slate-100 rounded-[3rem] shadow-xl overflow-hidden"
                        >
                            <div className="p-10 md:p-20">
                                {selectedProof && (
                                    <ExPage embedded={true} file={selectedProof.path} title={selectedProof.title} />
                                )}
                                <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center">
                                    <Button
                                        variant="solid"
                                        onPress={() => onOpenChange()}
                                        className="font-bold rounded-2xl px-14 h-14 bg-zinc-900 text-white hover:bg-zinc-800 transition-all hover:scale-[1.02]"
                                    >
                                        Terminer la lecture
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}
