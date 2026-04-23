import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Modal, 
    ModalContent, 
    ModalBody, 
    Button, 
    useDisclosure,
    Card,
    CardBody
} from "@heroui/react";
import { 
    Clock, 
    X,
    ChevronRight,
    Zap
} from 'lucide-react';
import ExPage from '../Pages/ExPage';

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

export default function FluxLabSection({ isLight = false }: { isLight?: boolean }) {
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

    // Prendre les 4 derniers
    const latestProofs = registry.proofs.slice(0, 4);

    return (
        <section id="flux-lab-section" className={`w-full py-24 relative overflow-hidden transition-colors duration-500 ${isLight ? 'bg-white' : 'bg-black'}`}>
            {/* Background elements */}
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${isLight ? 'bg-blue-500/5' : 'bg-blue-500/10'}`} />
            <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-purple-500/5' : 'bg-purple-500/10'}`} />
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 border transition-all duration-300 ${isLight ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-500/20 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>
                                <Zap size={20} />
                            </div>
                            <span className={`text-xs font-black uppercase tracking-[0.4em] font-mono transition-colors duration-300 ${isLight ? 'text-blue-500/60' : 'text-blue-400'}`}>Real-time Activity</span>
                        </div>
                        <h2 className={`text-5xl md:text-6xl font-['Paris2024'] drop-shadow-sm uppercase tracking-tight transition-colors duration-300 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                            Flux <span className="text-[#0075FF]">Lab</span>
                        </h2>
                        <p className={`max-w-xl font-['Baskerville'] text-xl italic leading-relaxed transition-colors duration-300 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            Les derniers travaux académiques et comptes-rendus techniques indexés automatiquement.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestProofs.map((proof, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card 
                                isPressable
                                onPress={() => handleProofClick(proof)}
                                className={`h-[280px] backdrop-blur-md border transition-all duration-500 group shadow-sm hover:shadow-2xl rounded-[2.5rem] ${
                                    isLight 
                                    ? 'bg-white/40 border-white/40 hover:border-blue-500/30' 
                                    : 'bg-zinc-900/40 border-white/5 hover:border-blue-500/40'
                                }`}
                            >
                                <CardBody className="p-8 flex flex-col justify-between relative overflow-hidden">
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md transition-colors ${isLight ? 'text-blue-600 bg-blue-500/5' : 'text-blue-400 bg-blue-500/10'}`}>
                                                {proof.module}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold">{new Date(proof.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <h3 className={`text-xl font-bold leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-3 ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>
                                            {proof.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            {proof.techs.slice(0, 3).map((tech, i) => (
                                                <span key={i} className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${isLight ? 'bg-zinc-900/5 border-black/5 text-zinc-500' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                                                    {tech}
                                                </span>
                                            ))}
                                            {proof.techs.length > 3 && (
                                                <span className="text-[9px] font-bold text-zinc-400">+{proof.techs.length - 3}</span>
                                            )}
                                        </div>
                                        
                                        <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 italic">Voir le rapport</span>
                                            <ChevronRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Button to Blueprint */}
                <div className="mt-20 flex justify-center">
                    <motion.a
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        href="#blueprint-transition"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('blueprint-transition')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`bg-white border border-gray-200 shadow-sm rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500 hover:shadow-lg group`}
                    >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                    </motion.a>
                </div>
            </div>

            {/* Immersive Modal Viewer */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size="full"
                scrollBehavior="inside"
                backdrop="blur"
                className={`m-0 p-0 rounded-none shadow-none ${isLight ? 'bg-slate-50' : 'bg-[#0a0a0a]'}`}
                motionProps={{
                    variants: {
                        enter: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
                        exit: { opacity: 0, scale: 1.05, transition: { duration: 0.2, ease: "easeIn" } },
                    }
                }}
            >
                <ModalContent className="bg-transparent shadow-none border-none">
                    {(onClose) => (
                        <ModalBody className="p-0 flex flex-col items-center">
                            <div className="fixed top-8 right-8 z-[100]">
                                <Button 
                                    isIconOnly
                                    variant="flat"
                                    onPress={onClose}
                                    className={`rounded-full backdrop-blur-xl w-14 h-14 border shadow-2xl transition-all ${isLight ? 'bg-white/40 border-black/5 text-zinc-500 hover:bg-white/60' : 'bg-white/10 border-white/10 text-zinc-400 hover:bg-white/20'}`}
                                >
                                    <X size={28} />
                                </Button>
                            </div>

                            <div className="w-full max-w-5xl mx-auto px-4 md:px-12 py-12 md:py-24 flex-1">
                                <motion.div 
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className={`border rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden ${isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'}`}
                                >
                                    <div className="p-8 md:p-20">
                                        {selectedProof && (
                                            <ExPage 
                                                embedded={true} 
                                                file={selectedProof.path} 
                                                title={selectedProof.title} 
                                            />
                                        )}

                                        <div className={`mt-24 pt-12 border-t flex justify-center ${isLight ? 'border-slate-50' : 'border-slate-800'}`}>
                                            <Button 
                                                variant="solid"
                                                onPress={onClose}
                                                className={`font-bold rounded-2xl px-16 h-16 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg ${isLight ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}
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
