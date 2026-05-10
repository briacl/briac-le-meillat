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
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
                
                const responses = await Promise.allSettled([
                    fetch(`${baseUrl}data/tps.json`),
                    fetch(`${baseUrl}assets/documents/apprentissage/data.json`)
                ]);

                const tpsRes = responses[0].status === 'fulfilled' ? responses[0].value : null;
                const dataRes = responses[1].status === 'fulfilled' ? responses[1].value : null;

                if (dataRes?.ok) {
                    const data = await dataRes.json();
                    setCompetenceData(data.competences || []);
                }

                if (tpsRes?.ok) {
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

    const filteredTPs = searchTerm.trim() === '' 
        ? [] 
        : tps.filter(tp => {
            const search = searchTerm.toLowerCase();
            const matchesTitre = tp.titre.toLowerCase().includes(search);
            const matchesRessource = tp.ressource.toLowerCase().includes(search);
            // On cherche aussi dans le mapping AC pour voir si le terme de recherche correspond à un code AC
            const matchesAC = Object.keys(AC_MAPPING).some(ac => 
                ac.toLowerCase().includes(search) && AC_MAPPING[ac].includes(tp.ressource)
            );
            return matchesTitre || matchesRessource || matchesAC;
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div id="competences-section" className="w-full py-10 pointer-events-auto z-10 relative">
            <GlassCard className="w-full !bg-black/40 !border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="text-left">
                        <h2 className="text-[3rem] text-blue-500 font-['Paris2024'] uppercase tracking-widest mb-2">
                            Référentiel National
                        </h2>
                        <p className="text-zinc-400 font-['Paris2024'] uppercase tracking-widest text-xs opacity-70">
                            BUT Réseaux & Télécommunications - Compétences & Travaux Pratiques
                        </p>
                    </div>

                    <div className="w-full md:w-96 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-500">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un TP, une ressource (R201...) ou une AC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-['Baskerville'] italic"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {searchTerm.trim() !== '' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full px-4"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-zinc-500">
                                Résultats de recherche ({filteredTPs.length})
                            </h3>
                        </div>
                        
                        {filteredTPs.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTPs.map(tp => {
                                    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
                                    const filePath = tp.fichier.startsWith('/') ? tp.fichier : `/${tp.fichier}`;
                                    const fullUrl = `${baseUrl}${filePath}`;
                                    
                                    return (
                                        <motion.a
                                            key={tp.id}
                                            href={fullUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center justify-between p-6 bg-blue-500/5 border border-white/5 hover:border-blue-500/30 rounded-[1.5rem] transition-all group hover:bg-blue-500/10"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">{tp.ressource}</span>
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{tp.date}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{tp.titre}</span>
                                            </div>
                                            <Download size={20} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                <p className="text-zinc-500 italic font-['Baskerville']">Aucun travail pratique ne correspond à votre recherche.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
                        {UES.filter(ue => ue.id !== 'Sécuriser').map((ue, index) => (
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
                                    className="h-[280px] !bg-black/60 border border-white/5 hover:border-blue-500/50 transition-all duration-500 rounded-[2rem] group"
                                >
                                    <CardHeader className="flex-col items-start px-8 pt-8">
                                        <div 
                                            className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                                            style={{ color: ue.couleur, backgroundColor: `${ue.couleur}10` }}
                                        >
                                            {ue.icon}
                                        </div>
                                        <h3 className="text-2xl font-normal text-white font-['Paris2024'] uppercase tracking-tight">{ue.titre}</h3>
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
                )}
            </GlassCard>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="inside"
                backdrop="blur"
                className="!bg-[#0a0a0a] border border-white/10 rounded-[2.5rem]"
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
                                        base: "!bg-white/5 border border-white/5 rounded-2xl mb-3 hover:!bg-white/10 transition-colors",
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
