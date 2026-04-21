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
    ChevronRight
} from 'lucide-react';
import ExPage from '../Pages/ExPage';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

interface Proof {
    title: string;
    module: string;
    competence: string;
    ac_lies: string[];
    techs: string[];
    date: string;
    status: string;
    path: string;
}

interface Registry {
    lastUpdated: string;
    total: number;
    proofs: Proof[];
}

export default function FieldNotes() {
    const [registry, setRegistry] = useState<Registry | null>(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProof, setSelectedProof] = useState<Proof | null>(null);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                const response = await fetch(`${baseUrl}assets/data/registry.json`);
                if (response.ok) {
                    const data = await response.json();
                    setRegistry(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement du registre:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistry();
    }, []);

    const handleProofClick = (proof: Proof) => {
        setSelectedProof(proof);
        onOpen();
    };

    if (loading || !registry || registry.proofs.length === 0) return null;

    // Latest 4 proofs for the archive
    const latestProofs = registry.proofs.slice(0, 4);

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
                            className="group relative flex flex-col md:flex-row items-center justify-between p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-700 cursor-pointer overflow-hidden first:rounded-t-[2.5rem] last:rounded-b-[2.5rem]"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 w-full relative z-10">
                                {/* Module Reference */}
                                <div className="flex flex-col min-w-[120px]">
                                    <span className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase mb-1">Module_Ref</span>
                                    <span className="text-lg font-mono text-white/70 group-hover:text-blue-400 transition-colors">
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
                                            <span key={i} className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 px-2 py-1 border border-white/10 rounded-md bg-white/[0.02]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Data & Interaction */}
                                <div className="flex items-center gap-12">
                                    <div className="hidden lg:flex flex-col items-end">
                                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20 mb-1">Index_Time</span>
                                        <span className="text-xs font-mono text-white/40">{new Date(proof.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">
                                        <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all" size={18} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Explorer Call to Action */}
                <div className="mt-20 flex justify-center">
                    <button className="group flex flex-col items-center gap-4 transition-all duration-500">
                        <div className="w-12 h-[1px] bg-white/10 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-500" />
                        <span className="text-[10px] font-['Paris2024'] uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-colors">
                            Accéder au Registre Complet
                        </span>
                    </button>
                </div>
            </div>

            {/* Modal Detail Viewer */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size="full"
                scrollBehavior="inside"
                backdrop="blur"
                className="bg-black/95 m-0 p-0 rounded-none"
            >
                <ModalContent className="bg-transparent shadow-none border-none">
                    {(onClose) => (
                        <ModalBody className="p-0 flex flex-col items-center">
                            <div className="fixed top-10 right-10 z-[100]">
                                <Button 
                                    isIconOnly
                                    onPress={onClose}
                                    className="rounded-full bg-white/5 hover:bg-red-500/20 backdrop-blur-xl text-white/50 hover:text-white w-14 h-14 border border-white/10 transition-all"
                                >
                                    <X size={24} />
                                </Button>
                            </div>

                            <div className="w-full max-w-6xl mx-auto px-6 py-24 flex-1">
                                <motion.div 
                                    initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                                    className="bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                                >
                                    <div className="p-10 md:p-24 relative">
                                        {selectedProof && (
                                            <ExPage 
                                                embedded={true} 
                                                file={selectedProof.path} 
                                                title={selectedProof.title} 
                                            />
                                        )}
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
