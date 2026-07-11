import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@heroui/react';
import { X } from 'lucide-react';
import ExPage from '@/Pages/ExPage';

const FAVORITE_PROJECTS = [
    {
        title: 'NetworkBriac',
        image: '/briac-le-meillat/assets/projects/networkbriac-visu.png',
        path: 'assets/documents/apprentissage/NetworkBriac.md',
    },
    {
        title: 'Passerelle Linux',
        image: '/briac-le-meillat/assets/projects/tp2-passerelle-linux-visu.png',
        path: 'assets/documents/apprentissage/tech-internet/tp2-passerelle_linux.md',
    },
    {
        title: 'NotGoogle',
        image: '/briac-le-meillat/assets/projects/notgoogle-visu.png',
        path: 'https://briacl.github.io/notgoogle/',
        isExternal: true,
    },
    {
        title: 'Interopérabilité Samba',
        image: '/briac-le-meillat/assets/projects/samba-visu.png',
        path: 'assets/documents/apprentissage/bases-services-reseaux/tp-samba.md',
    },
    {
        title: 'Flask & SQLAlchemy',
        image: '/briac-le-meillat/assets/projects/tp3-flask-visuel.png',
        path: 'assets/documents/apprentissage/dev-web/tp3/tp3-flask.md',
    },
];

const APPLE_BEZIER: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export default function FavoriteProjects() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProject, setSelectedProject] = useState<typeof FAVORITE_PROJECTS[0] | null>(null);

    const handleOpen = (project: typeof FAVORITE_PROJECTS[0]) => {
        if (project.isExternal) {
            window.open(project.path, '_blank', 'noopener,noreferrer');
        } else {
            setSelectedProject(project);
            onOpen();
        }
    };

    const handleClose = () => {
        setSelectedProject(null);
        onClose();
    };

    return (
        <>
            <section className="w-full bg-white flex flex-col items-center justify-center py-24 px-6 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                    transition={{ duration: 1, ease: APPLE_BEZIER }}
                    className="flex flex-col items-center gap-12 w-full max-w-7xl"
                >
                    <h2 className="text-3xl md:text-5xl font-normal tracking-tighter leading-none font-['Paris2024'] text-center">
                        <span className="text-zinc-900">
                            Projets Préférés
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
                        {FAVORITE_PROJECTS.map((project, i) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, duration: 0.8, ease: APPLE_BEZIER }}
                                className="group cursor-pointer flex flex-col gap-4"
                                onClick={() => handleOpen(project)}
                            >
                                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1 relative">
                                    <img 
                                        src={project.image} 
                                        alt={project.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRmNGY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiNhMWExYWEiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF1Y3VuZSBpbWFnZTwvdGV4dD48L3N2Zz4='; // Fallback SVG "Aucune image"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </div>
                                <h3 className="font-['Paris2024'] text-center text-zinc-800 text-lg group-hover:text-[#0075FF] transition-colors duration-300">
                                    {project.title}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                size="full"
                scrollBehavior="inside"
                classNames={{
                    base: 'bg-[#f8f8f8] m-0 rounded-none max-h-screen',
                    body: 'p-0',
                }}
            >
                <ModalContent>
                    {() => (
                        <ModalBody>
                            <div className="sticky top-0 z-50 flex justify-end px-6 pt-6">
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                                >
                                    <X size={18} className="text-black/60" />
                                </button>
                            </div>
                            <div className="w-full max-w-6xl mx-auto px-6 py-12 flex-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                                    className="bg-white border border-slate-200/50 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden"
                                >
                                    <div className="p-10 md:p-24 relative">
                                        {selectedProject && (
                                            <ExPage embedded={true} file={selectedProject.path} title={selectedProject.title} />
                                        )}
                                        <div className="mt-24 pt-12 border-t flex justify-center border-slate-100">
                                            <Button
                                                variant="solid"
                                                onPress={handleClose}
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
        </>
    );
}
