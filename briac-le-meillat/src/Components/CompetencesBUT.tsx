import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Code,
    Shield,
    FileText,
    ExternalLink,
    Search,
    X,
    Download
} from 'lucide-react';
import GlassCard from './GlassCard';

interface TP {
    id: string;
    titre: string;
    ressource: string;
    fichier: string;
    date: string;
}

interface UEDefinition {
    id: string;
    titre: string;
    couleur: string;
    description: string;
    icon: React.ReactNode;
}

const UES: UEDefinition[] = [
    {
        id: 'Administrer',
        titre: 'Administrer',
        couleur: '#0075FF',
        description: "Architecture et maintenance des systèmes complexes.",
        icon: <Layers />
    },
    {
        id: 'Connecter',
        titre: 'Connecter',
        couleur: '#f336f0',
        description: "Infrastructure réseaux et communications universelles.",
        icon: <Target />
    },
    {
        id: 'Programmer',
        titre: 'Programmer',
        couleur: '#00ccff',
        description: "Développement d'applications et automatisation.",
        icon: <Code />
    },
    {
        id: 'Sécuriser',
        titre: 'Sécuriser',
        couleur: '#ff3b3b',
        description: "Cybersécurité et protection des données.",
        icon: <Shield />
    }
];

const AC_MAPPING: Record<string, string> = {
    // UE1 : Administrer
    "AC11.01": "R101, R103, SAE102",
    "AC11.02": "R101, R102, R103, R106",
    "AC11.03": "R103, R108, SAE102",
    "AC11.04": "R202, R203",
    "AC11.05": "R103, SAE102",
    "AC11.06": "R108, R202",
    // UE2 : Connecter
    "AC12.01": "R104, R201, R205, R206",
    "AC12.02": "R105, R201, R205",
    "AC12.03": "R105, R203, R204",
    "AC12.04": "R203, R204",
    "AC12.05": "R110, R211",
    // UE3 : Programmer
    "AC13.01": "R108, R202, R207",
    "AC13.02": "R107, R208",
    "AC13.03": "R107, R208",
    "AC13.04": "R109, R209",
    "AC13.05": "R207, R208",
    "AC13.06": "R115, R212"
};

export default function CompetencesBUT() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [selectedUE, setSelectedUE] = useState<UEDefinition | null>(null);
    const [competenceData, setCompetenceData] = useState<any[]>([]);
    const [tps, setTps] = useState<TP[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                
                const [tpsRes, dataRes] = await Promise.all([
                    fetch(`${baseUrl}data/tps.json`).catch(() => ({ ok: false })),
                    fetch(`${baseUrl}assets/documents/apprentissage/data.json`).catch(() => ({ ok: false }))
                ]);

                if (dataRes && dataRes.ok) {
                    const data = await dataRes.json();
                    setCompetenceData(data.competences || []);
                }

                if (tpsRes && tpsRes.ok) {
                    setTps(await tpsRes.json());
                }
            } catch (error) {
                console.error("Erreur chargement données:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenDetails = (ue: UEDefinition) => {
        setSelectedUE(ue);
        onOpen();
    };

    const getACsForUE = (ueTitle: string) => {
        const comp = competenceData.find(c => 
            c.titre.toLowerCase() === ueTitle.toLowerCase() || 
            (ueTitle === "Sécuriser" && c.id === "secure")
        );
        return comp ? comp.apprentissages_critiques : [];
    };

    const getTPsForResource = (acId: string) => {
        return tps.filter(tp => {
            // Match direct
            if (tp.ressource === acId) return true;
            
            // Match via mapping (ex: TP est R201, l'id est AC12.01)
            const linkedRs = AC_MAPPING[acId];
            if (linkedRs && linkedRs.includes(tp.ressource)) return true;
            
            return false;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div id="competences-section" className="w-full py-10 pointer-events-auto z-10 relative">
            <GlassCard className="w-full bg-[#0d0d0d]/40 border-white/10 backdrop-blur-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-[3rem] text-blue-500 font-['Paris2024'] uppercase tracking-widest mb-4">
                        Référentiel National
                    </h2>
                    <p className="text-zinc-400 font-['Paris2024'] uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-70">
                        BUT Réseaux & Télécommunications - Compétences & Travaux Pratiques
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
                    {UES.map((ue, index) => (
                        <motion.div
                            key={ue.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                isPressable
                                onPress={() => handleOpenDetails(ue)}
                                className="h-[280px] bg-zinc-900/40 border border-white/10 hover:border-blue-500/50 transition-all duration-500 rounded-[2rem] group"
                            >
                                <CardHeader className="flex-col items-start px-8 pt-8">
                                    <div 
                                        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                                        style={{ color: ue.couleur, backgroundColor: `${ue.couleur}10` }}
                                    >
                                        {ue.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white font-['Paris2024'] uppercase tracking-tight">{ue.titre}</h3>
                                </CardHeader>
                                <CardBody className="px-8 pt-2">
                                    <p className="text-zinc-400 text-sm font-['Baskerville'] italic leading-relaxed">
                                        {ue.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-400 font-bold">
                                        <span>{getACsForUE(ue.titre).length} Compétences</span>
                                        <ChevronRight size={12} />
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="inside"
                backdrop="blur"
                className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem]"
            >
                <ModalContent className="text-white">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 py-8 px-10 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center border"
                                        style={{ color: selectedUE?.couleur, borderColor: `${selectedUE?.couleur}30`, backgroundColor: `${selectedUE?.couleur}10` }}
                                    >
                                        {selectedUE?.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold font-['Paris2024'] uppercase tracking-widest">{selectedUE?.titre}</h2>
                                        <p className="text-xs font-mono opacity-60 uppercase tracking-widest">Ressources & Travaux Pratiques</p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody className="py-8 px-10">
                                <Accordion 
                                    className="px-0"
                                    itemClasses={{
                                        base: "bg-zinc-900/40 border border-white/5 rounded-2xl mb-3 hover:bg-zinc-800/40 transition-colors",
                                        title: "text-white font-bold",
                                        trigger: "px-6 py-4",
                                        content: "px-6 pb-6 text-zinc-400"
                                    }}
                                >
                                    {selectedUE && getACsForUE(selectedUE.titre).map((ac: any) => {
                                        const acId = ac.code;
                                        const resourceTPs = getTPsForResource(acId);
                                        return (
                                            <AccordionItem
                                                key={acId}
                                                aria-label={ac.titre}
                                                title={
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-blue-500 font-mono text-sm">{acId}</span>
                                                            {AC_MAPPING[acId] && (
                                                                <span className="text-[10px] text-zinc-500 font-mono italic">({AC_MAPPING[acId]})</span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm uppercase tracking-wide">{ac.titre}</span>
                                                        {resourceTPs.length > 0 && (
                                                            <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded-full h-fit">
                                                                {resourceTPs.length} TP
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                            >
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Description</p>
                                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                                            {ac.titre}
                                                        </p>
                                                    </div>

                                                    {(resourceTPs || []).length > 0 ? (
                                                        <div>
                                                            <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-3">Travaux Pratiques disponibles</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {resourceTPs.map(tp => {
                                                                    // Normalisation du chemin du fichier
                                                                    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
                                                                    const filePath = tp.fichier.startsWith('/') ? tp.fichier : `/${tp.fichier}`;
                                                                    const fullUrl = `${baseUrl}${filePath}`;
                                                                    
                                                                    return (
                                                                        <a 
                                                                            key={tp.id}
                                                                            href={fullUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-colors group"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <FileText size={18} className="text-blue-500" />
                                                                                <span className="text-sm font-bold text-zinc-200 group-hover:text-white">{tp.titre}</span>
                                                                            </div>
                                                                            <Download size={16} className="text-zinc-500 group-hover:text-blue-500" />
                                                                        </a>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs italic text-zinc-600">Aucun TP archivé pour le moment.</p>
                                                    )}
                                                </div>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </ModalBody>
                            <ModalFooter className="border-t border-white/5 p-6">
                                <Button onPress={onClose} variant="flat" className="bg-white/5 text-white">Fermer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
