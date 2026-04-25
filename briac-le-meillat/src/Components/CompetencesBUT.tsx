import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Accordion,
    AccordionItem,
    Card,
    CardBody,
    CardHeader
} from "@heroui/react";
import {
    ChevronRight,
    BookOpen,
    Layers,
    Target,
    HelpCircle,
    Lightbulb,
    RefreshCw,
    BarChart3,
    Paperclip,
    ExternalLink,
    Search,
    X
} from 'lucide-react';
import GlassCard from './GlassCard';
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

interface Reflexion {
    fait: string;
    pourquoi: string;
    comment: string;
    difficultes: string;
    appris: string;
    autrement: string;
    preuves?: Preuve[]; // On garde pour compatibilité mais on utilisera le registry
}

interface Preuve {
    titre: string;
    module: string;
    technos: string[];
    chemin_fichier_md: string;
}

interface AC {
    code: string;
    titre: string;
    reflexion: Reflexion;
}

interface Competence {
    id: string;
    titre: string;
    couleur: string;
    description_courte: string;
    situations_pro: string[];
    apprentissages_critiques: AC[];
}

interface CompetencesData {
    competences: Competence[];
}

export default function CompetencesBUT() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isReportOpen, onOpen: onReportOpen, onOpenChange: onReportOpenChange } = useDisclosure();

    const [selectedComp, setSelectedComp] = useState<Competence | null>(null);
    const [selectedReport, setSelectedReport] = useState<{ file: string; title: string } | null>(null);
    const [data, setData] = useState<CompetencesData | null>(null);
    const [registry, setRegistry] = useState<Registry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

                // Charger data.json
                const dataResponse = await fetch(`${baseUrl}assets/documents/apprentissage/data.json`);
                const jsonData = await dataResponse.json();
                setData(jsonData);

                // Charger registry.json
                const registryResponse = await fetch(`${baseUrl}assets/data/registry.json`);
                if (registryResponse.ok) {
                    const registryData = await registryResponse.json();
                    setRegistry(registryData);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenDetails = (comp: Competence) => {
        setSelectedComp(comp);
        onOpen();
    };

    const handleProofClick = (proof: Proof) => {
        setSelectedReport({ file: proof.path, title: proof.title });
        onReportOpen();
    };

    /**
     * Filtre les preuves du registre pour un AC donné
     */
    const getProofsForAC = (acCode: string) => {
        if (!registry) return [];
        return registry.proofs.filter(proof =>
            proof.ac_lies && proof.ac_lies.includes(acCode)
        );
    };

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-[#00f2ff]/30 border-t-[#00f2ff] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div id="competences-section" className="w-full flex items-center justify-center py-10 pointer-events-auto z-10 relative">
            <GlassCard className="w-full bg-[#0d0d0d]/40 border-white/10 backdrop-blur-2xl">
                <div className="text-center mb-8 space-y-4">
                    <h2 className="text-[3rem] text-blue-500 font-['Paris2024'] text-center uppercase tracking-widest mb-4">
                        Mes Compétences
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-zinc-400 font-['Paris2024'] uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-70"
                    >
                        Section écrite afin de mettre en avant le programme national de ma formation BUT Réseaux & Télécommunications
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
                    {data.competences.map((comp, index) => (
                        <motion.div
                            key={comp.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        >
                            <Card
                                isPressable
                                onPress={() => handleOpenDetails(comp)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-[360px] bg-zinc-900/40 border border-white/10 hover:border-white/20 transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-blue-500/10 group"
                                style={{ boxShadow: `0 10px 40px ${comp.couleur}15` }}
                            >
                                <CardHeader className="flex-col items-start px-8 pt-8 pb-0">
                                    <div
                                        className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                                        style={{ backgroundColor: `${comp.couleur}15`, borderColor: `${comp.couleur}30` }}
                                    >
                                        {comp.id === 'admin' && <Layers style={{ color: comp.couleur }} />}
                                        {comp.id === 'connect' && <Target style={{ color: comp.couleur }} />}
                                        {comp.id === 'prog' && <BarChart3 style={{ color: comp.couleur }} />}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white font-['Paris2024'] tracking-tight group-hover:translate-x-1 transition-transform uppercase">{comp.titre}</h3>
                                    <p className="text-xs font-mono mt-2 font-bold opacity-90" style={{ color: comp.couleur }}>{comp.description_courte}</p>
                                </CardHeader>
                                <CardBody className="px-8 pt-6">
                                    <p className="text-zinc-400 text-sm italic font-['Baskerville'] leading-relaxed">
                                        Cliquez pour voir les apprentissages critiques et mes réflexions détaillées.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {comp.situations_pro.slice(0, 2).map((sit, i) => (
                                            <span key={i} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/5 text-zinc-500">
                                                {sit.split(' ').slice(0, 3).join(' ')}...
                                            </span>
                                        ))}
                                    </div>
                                </CardBody>
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 p-2 rounded-full border border-white/10">
                                    <ChevronRight className="text-white" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>

            {/* Modal Lvl 2: AC Details */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="inside"
                backdrop="blur"
                className="bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-[2.5rem] max-h-[75vh]"
            >
                <ModalContent className="bg-[#0a0a0a] text-white">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 border-b border-white/5 py-8 px-10">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm"
                                        style={{ backgroundColor: `${selectedComp?.couleur}10`, borderColor: `${selectedComp?.couleur}30` }}
                                    >
                                        <BookOpen size={24} style={{ color: selectedComp?.couleur }} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white font-['Montserrat'] tracking-tight uppercase tracking-widest">{selectedComp?.titre}</h2>
                                        <p className="text-xs font-mono font-bold tracking-widest uppercase opacity-80" style={{ color: selectedComp?.couleur }}>Détails des Apprentissages</p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody className="py-10 px-10">
                                <Accordion 
                                    className="px-0"
                                    itemClasses={{
                                        base: "bg-[#121212] border border-white/10 rounded-[2rem] mb-4 transition-all duration-300 hover:bg-[#1a1a1a]",
                                        title: "font-['Paris2024'] font-bold text-white text-xl py-2 uppercase tracking-wide",
                                        trigger: "py-6 px-8",
                                        content: "px-8 pb-10 text-zinc-300",
                                        indicator: "text-[#0075FF] scale-150"
                                    }}
                                >
                                    {(selectedComp?.apprentissages_critiques || []).map((ac) => {
                                        // On récupère les preuves dynamiques du registre
                                        const dynamicProofs = getProofsForAC(ac.code);

                                        return (
                                            <AccordionItem
                                                key={ac.code}
                                                aria-label={ac.titre}
                                                title={`${ac.code} - ${ac.titre}`}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                                    <ReflexionField icon={<Layers size={18} className="text-[#0075FF]" />} label="Ce que j'ai fait" value={ac.reflexion.fait} />
                                                    <ReflexionField icon={<HelpCircle size={18} className="text-[#0075FF]" />} label="Pourquoi" value={ac.reflexion.pourquoi} />
                                                    <ReflexionField icon={<Target size={18} className="text-[#0075FF]" />} label="Comment" value={ac.reflexion.comment} />
                                                    <ReflexionField icon={<HelpCircle size={18} className="text-red-500" />} label="Difficultés" value={ac.reflexion.difficultes} />
                                                    <ReflexionField icon={<Lightbulb size={18} className="text-yellow-600" />} label="Acquis" value={ac.reflexion.appris} />
                                                    <ReflexionField icon={<RefreshCw size={18} className="text-blue-600" />} label="Améliorations" value={ac.reflexion.autrement} />
                                                </div>

                                                <div className="mt-10 pt-8 border-t border-white/5">
                                                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 mb-6">Galerie de Preuves (Indexation Automatique)</h4>
                                                    {dynamicProofs.length > 0 ? (
                                                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
                                                            {dynamicProofs.map((proof, idx) => (
                                                                <ProofCard
                                                                    key={idx}
                                                                    proof={proof}
                                                                    accentColor={selectedComp?.couleur || "#0075FF"}
                                                                    onClick={() => handleProofClick(proof)}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-zinc-400 font-['Baskerville'] italic text-sm text-center py-4">Pas encore de preuves indexées pour cet AC.</p>
                                                    )}
                                                </div>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </ModalBody>
                            <ModalFooter className="border-t border-white/5 py-6 px-10">
                                <Button onPress={onClose} className="bg-white text-black font-bold rounded-xl px-8">Fermer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal Lvl 3: Immersive Report Viewer */}
            <Modal
                isOpen={isReportOpen}
                onOpenChange={onReportOpenChange}
                size="full"
                scrollBehavior="inside"
                backdrop="blur"
                className="bg-slate-50 dark:bg-[#0a0a0a] m-0 p-0 rounded-none shadow-none"
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
                                    className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-zinc-500 w-14 h-14 border border-white/10 shadow-2xl transition-all"
                                >
                                    <X size={28} />
                                </Button>
                            </div>

                            <div className="w-full max-w-5xl mx-auto px-4 md:px-12 py-12 md:py-24 flex-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
                                >
                                    <div className="p-8 md:p-20">
                                        {selectedReport && (
                                            <ExPage
                                                embedded={true}
                                                file={selectedReport.file}
                                                title={selectedReport.title}
                                            />
                                        )}

                                        <div className="mt-24 pt-12 border-t border-white/5 flex justify-center">
                                            <Button
                                                variant="solid"
                                                onPress={onClose}
                                                className="bg-white text-black font-bold rounded-2xl px-16 h-16 shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
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
        </div>
    );
}

function ReflexionField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400">{label}</span>
            </div>
            <p className="text-zinc-200 leading-relaxed font-['Baskerville'] text-base md:text-lg bg-white/5 p-4 rounded-2xl border border-white/5 min-h-[80px]">
                {value}
            </p>
        </div>
    );
}

function ProofCard({ proof, accentColor, onClick }: { proof: Proof, accentColor: string, onClick: () => void }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="flex-shrink-0 w-[260px] h-[150px] bg-zinc-900/50 rounded-3xl border border-white/10 shadow-sm relative overflow-hidden group cursor-pointer"
        >
            <div className="p-6 h-full flex flex-col justify-between">
                <div>
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-40 mb-1 block" style={{ color: accentColor }}>{proof.module}</span>
                    <h5 className="text-base font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">{proof.title}</h5>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                    <Search size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Voir le rapport</span>
                </div>
            </div>

            <div className="absolute inset-0 bg-black/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-6 text-center">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-3 text-white">
                    <ExternalLink size={18} />
                </div>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black mb-3">TECH</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                    {proof.techs.map((tech, i) => (
                        <span key={i} className="bg-white/10 text-white px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-1 transition-all duration-300 group-hover:h-full h-0" style={{ backgroundColor: accentColor }} />
        </motion.div>
    );
}
