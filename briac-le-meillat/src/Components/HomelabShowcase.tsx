import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@heroui/react';
import { X, Network } from 'lucide-react';
import ExPage from '@/Pages/ExPage';
import { getAllTps, Proof } from '@/utils/tpsProvider';

const APPLE_BEZIER: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export default function HomelabShowcase() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProject, setSelectedProject] = useState<Proof | null>(null);
    const [homelabProjects, setHomelabProjects] = useState<Proof[]>([]);
    
    useEffect(() => {
        const allTps = getAllTps();
        const persos = allTps.filter(tp => tp.project_type === 'perso');
        setHomelabProjects(persos);
    }, []);

    const handleOpen = (project: Proof) => {
        if (project.link) {
            window.open(project.link, '_blank', 'noopener,noreferrer');
        } else {
            setSelectedProject(project);
            onOpen();
        }
    };

    const handleClose = () => {
        setSelectedProject(null);
        onClose();
    };

    if (homelabProjects.length === 0) return null;

    return (
        <>
            <section className="w-full bg-zinc-50 flex flex-col items-center justify-center py-24 lg:py-32 px-6 relative z-20 border-t border-b border-black/5">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                    transition={{ duration: 1, ease: APPLE_BEZIER }}
                    className="flex flex-col items-center gap-12 w-full max-w-7xl"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mb-2">
                            <Network size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-normal tracking-tighter leading-none font-['Paris2024'] text-center">
                            <span className="text-zinc-900">
                                Laboratoire Personnel
                            </span>
                        </h2>
                        <p className="text-zinc-500 font-['Baskerville'] text-lg md:text-xl text-center max-w-2xl italic">
                            Initiatives personnelles, expérimentations réseaux et projets "HomeLab" réalisés hors cadre universitaire.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
                        {homelabProjects.map((project, i) => (
                            <motion.div
                                key={project.path}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, duration: 0.8, ease: APPLE_BEZIER }}
                                className="group cursor-pointer flex flex-col gap-4"
                                onClick={() => handleOpen(project)}
                            >
                                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1 relative">
                                    <img
                                        src={project.image || ''}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRmNGY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiNhMWExYWEiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF1Y3VuZSBpbWFnZTwvdGV4dD48L3N2Zz4='; // Fallback SVG
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>
                                <div className="px-2">
                                    <div className="flex items-center gap-2 mb-1 opacity-60">
                                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-zinc-500">
                                            {new Date(project.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="font-['Paris2024'] text-zinc-800 text-lg leading-tight group-hover:text-[#0075FF] transition-colors duration-300 line-clamp-2">
                                        {project.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onClose}
                size="full"
                classNames={{
                    base: "bg-black/50 backdrop-blur-xl m-0 sm:m-0",
                    wrapper: "z-[999]",
                    backdrop: "z-[998]"
                }}
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { duration: 0.4, ease: APPLE_BEZIER }
                        },
                        exit: {
                            opacity: 0,
                            y: 20,
                            scale: 0.98,
                            transition: { duration: 0.3, ease: APPLE_BEZIER }
                        }
                    }
                }}
            >
                <ModalContent className="h-[100dvh] w-full relative bg-transparent shadow-none rounded-none overflow-hidden flex flex-col items-center justify-center p-0 sm:p-6">
                    {(onClose) => (
                        <ModalBody className="w-full max-w-6xl h-full p-0 flex flex-col relative">
                            {/* Close Button - Apple Style */}
                            <Button 
                                isIconOnly
                                onPress={handleClose}
                                className="absolute top-4 right-4 md:top-0 md:-right-16 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full w-10 h-10 min-w-10 border border-white/10 shadow-2xl transition-all"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </Button>

                            <motion.div 
                                className="w-full h-full bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col mt-12 sm:mt-0"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.5, ease: APPLE_BEZIER }}
                            >
                                {selectedProject && (
                                    <div className="w-full h-full overflow-y-auto no-scrollbar relative">
                                        <ExPage embedded={true} file={selectedProject.path} title={selectedProject.title} />
                                    </div>
                                )}
                            </motion.div>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
