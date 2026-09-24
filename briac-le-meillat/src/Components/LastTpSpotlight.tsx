import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@heroui/react';
import { X } from 'lucide-react';
import ExPage from '@/Pages/ExPage';
import { getAllTps } from '@/utils/tpsProvider';

const APPLE_BEZIER: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const LastTpSpotlight = () => {
    const [tps, setTps] = useState(() => {
        try {
            const data = getAllTps();
            const validProofs = data.filter((p: any) => p.path && p.image);
            const top5 = validProofs.slice(0, 5).map((p: any) => ({
                title: p.title,
                image: p.image, // URL is already resolved by Vite in tpsProvider
                path: p.path,
            }));
            return top5;
        } catch (err) {
            console.error("Error loading dynamic TPs:", err);
            return [];
        }
    });
    
    const [current, setCurrent] = useState(0);
    const [userControlled, setUserControlled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOpen = () => {
        setUserControlled(true);
        onOpen();
    };

    const handleClose = () => {
        setUserControlled(false);
        onClose();
    };

    // Préchargement unique de toutes les images
    useEffect(() => {
        tps.forEach(tp => {
            const img = new Image();
            img.src = tp.image;
        });
    }, [tps]);

    // Détection de visibilité via IntersectionObserver
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const goTo = useCallback((index: number, byUser = false) => {
        setCurrent(index);
        if (byUser) setUserControlled(true);
    }, []);

    // Timer actif uniquement si visible et non contrôlé par l'user
    useEffect(() => {
        if (userControlled || !isVisible || tps.length === 0) return;
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % tps.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [userControlled, isVisible, tps.length]);

    if (tps.length === 0) return null;

    const tp = tps[current];

    return (
        <>
            <section ref={sectionRef} id="last-tp-spotlight" className="w-full bg-white flex flex-col items-center justify-center py-32 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                    transition={{ duration: 1, ease: APPLE_BEZIER }}
                    className="flex flex-col items-center gap-6 w-full max-w-4xl"
                >
                    {/* Titre animé selon le tp courant */}
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={current}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.4, ease: APPLE_BEZIER }}
                            className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter leading-none font-['Paris2024'] text-center"
                        >
                            <span className="bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent select-none">
                                {tp.title}
                            </span>
                        </motion.h2>
                    </AnimatePresence>

                    {/* Toutes les images rendues une fois, visibilité CSS uniquement — pas de rechargement */}
                    <a
                        href={`${import.meta.env.BASE_URL}ex?file=${encodeURIComponent(tp.path)}&title=${encodeURIComponent(tp.title)}`}
                        className="block w-full mt-4 relative aspect-video cursor-pointer rounded-[3rem] transition-all duration-500 hover:scale-[1.015] border border-slate-100/80 overflow-hidden"
                        style={{
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
                        }}
                        onClick={(e) => {
                            if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                e.preventDefault();
                                handleOpen();
                            }
                        }}
                    >
                        {tps.map((t, i) => (
                            <motion.img
                                key={t.image}
                                src={t.image}
                                alt={t.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                animate={{ opacity: i === current ? 1 : 0 }}
                                transition={{ duration: 0.5, ease: APPLE_BEZIER }}
                            />
                        ))}
                    </a>

                    {/* Dots */}
                    <div className="flex items-center gap-3 mt-4">
                        {tps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, true)}
                                className="transition-all duration-300"
                                style={{
                                    width: i === current ? '28px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: i === current
                                        ? 'linear-gradient(to right, #0075FF, #f336f0)'
                                        : 'rgba(0,0,0,0.15)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Lien vers le blog */}
                    <div className="flex flex-col items-center gap-5 mt-16">
                        <p className="font-['Paris2024'] text-sm tracking-[0.2em] text-zinc-500 uppercase text-center leading-relaxed">
                            pour voir davantage de tp, allez voir le blog
                        </p>
                        <motion.button
                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => window.open(`${import.meta.env.BASE_URL}blog`, '_blank')}
                            className="relative px-10 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.25em] border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(59,130,246,0.06)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)]"
                        >
                            blog
                        </motion.button>
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
                                        <ExPage embedded={true} file={tp.path} title={tp.title} />
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
};

export default LastTpSpotlight;
