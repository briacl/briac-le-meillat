import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Modal, 
    ModalContent, 
    ModalBody, 
    Button, 
    useDisclosure
} from "@heroui/react";
import { 
    X,
    ChevronRight,
    Download
} from 'lucide-react';
import ExPage from '../Pages/ExPage';
import { exportToPDF, readDocument } from '../Utils/DocumentExporter';
import { getAllTps, Proof } from '@/utils/tpsProvider';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];



export default function FieldNotes() {
    const [mergedProofs, setMergedProofs] = useState<Proof[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProof, setSelectedProof] = useState<Proof | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const proofsData = getAllTps();
                setMergedProofs(proofsData);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleProofClick = (proof: Proof) => {
        readDocument(proof.path, () => {
            setSelectedProof(proof);
            onOpen();
        });
    };

    const handleDownload = (e: React.MouseEvent, proof: Proof) => {
        e.stopPropagation();
        exportToPDF(proof.title, proof.path);
    };

    const [visibleCount, setVisibleCount] = useState(5);

    if (loading || mergedProofs.length === 0) return null;

    const latestProofs = mergedProofs.slice(0, visibleCount);

    return (
        <section id="field-notes" className="w-full py-32 bg-black relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header: Sterile Lab Archive Style */}
                <div className="mb-24 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-16 bg-blue-500/50" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-blue-500 font-bold">
                            Archive de Laboratoire // S01.R&T
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-['Paris2024'] text-white uppercase tracking-tight">
                        Field <span className="opacity-40">Notes</span>
                    </h2>
                    <p className="text-white/40 max-w-xl font-['Baskerville'] text-xl italic leading-relaxed">
                        Exploration technique et rendus critiques indexés en temps réel.
                    </p>
                </div>

                {/* Archive Registry Grid */}
                <div className="grid grid-cols-1 gap-2">
                    {latestProofs.map((proof, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: APPLE_BEZIER as any }}
                            onClick={() => handleProofClick(proof)}
                            className="group relative flex flex-col md:flex-row items-center justify-between p-10 bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] hover:border-blue-500/40 transition-all duration-700 cursor-pointer overflow-hidden first:rounded-t-[2.5rem] last:rounded-b-[2.5rem]"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 w-full relative z-10">
                                {/* Module Reference */}
                                <div className="flex flex-col min-w-[120px]">
                                    <span className="text-[9px] font-mono text-white/35 tracking-[0.3em] uppercase mb-1">Module_Ref</span>
                                    <span className="text-lg font-mono text-white/80 group-hover:text-blue-400 transition-colors">
                                        {proof.module}
                                    </span>
                                </div>

                                {/* Title & Tech Tags */}
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-2xl font-['Paris2024'] text-white tracking-wide group-hover:text-white transition-colors">
                                        {proof.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {proof.techs.map((tech, i) => (
                                            <span key={i} className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 px-2 py-1 border border-white/20 rounded-md bg-white/[0.05]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Data & Interaction */}
                                <div className="flex items-center gap-6">
                                    <div className="hidden lg:flex flex-col items-end">
                                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/35 mb-1">Index_Time</span>
                                        <span className="text-xs font-mono text-white/60">{new Date(proof.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div 
                                            onClick={(e) => handleDownload(e, proof)}
                                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-500 group/dl"
                                            title="Télécharger en PDF"
                                        >
                                            <Download className="text-white/20 group-hover/dl:text-white" size={18} />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">
                                            <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {visibleCount < mergedProofs.length && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(c => c + 5)}
                            className="group flex flex-col items-center gap-4 transition-all duration-500"
                        >
                            <div className="w-12 h-[1px] bg-white/10 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-500" />
                            <span className="text-[10px] font-['Paris2024'] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
                                Afficher 5 de plus ({mergedProofs.length - visibleCount} restants)
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Detail Viewer */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size="full"
                scrollBehavior="inside"
                backdrop="blur"
                className="bg-slate-50 m-0 p-0 rounded-none"
            >
                <ModalContent className="bg-transparent shadow-none border-none">
                    {(onClose) => (
                        <ModalBody className="p-0 flex flex-col items-center">
                            <div className="fixed top-10 right-10 z-[100]">
                                <Button 
                                    isIconOnly
                                    onPress={onClose}
                                    className="rounded-full bg-white/70 hover:bg-white backdrop-blur-xl text-zinc-650 hover:text-black w-14 h-14 border border-black/5 hover:scale-105 active:scale-95 shadow-2xl transition-all"
                                >
                                    <X size={24} />
                                </Button>
                            </div>

                            <div className="w-full max-w-6xl mx-auto px-6 py-24 flex-1">
                                <motion.div 
                                    initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                                    className="bg-white border border-slate-200/50 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden"
                                >
                                    <div className="p-10 md:p-24 relative">
                                        {selectedProof && (
                                            <ExPage 
                                                embedded={true} 
                                                file={selectedProof.path} 
                                                title={selectedProof.title} 
                                            />
                                        )}

                                        <div className="mt-24 pt-12 border-t flex justify-center border-slate-100">
                                            <Button 
                                                variant="solid"
                                                onPress={onClose}
                                                className="font-bold rounded-2xl px-16 h-16 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg bg-zinc-900 text-white hover:bg-zinc-800"
                                            >
                                                Terminer la lecture
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
