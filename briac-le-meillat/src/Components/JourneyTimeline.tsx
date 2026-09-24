import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TimelineNode = ({ date, stepTitle, text, position }: { date: string, stepTitle: string, text: React.ReactNode, position: 'above' | 'below' }) => {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-full shrink-0 relative">
            {/* Le point temporel sur la ligne centrale */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] z-20"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            />

            <motion.div
                initial={{ opacity: 0, y: position === 'above' ? 40 : -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.2 }}
                className={`absolute w-full px-6 md:px-12 flex flex-col items-center text-center max-w-2xl ${position === 'above' ? 'bottom-[55%]' : 'top-[55%]'}`}
            >
                {/* Bloc structuré : Année -> Étape -> Paragraphe */}
                <div className="flex flex-col items-center">
                    <span className="font-['Baskerville'] italic text-sm md:text-base text-zinc-500 mb-2 tracking-widest">
                        {date}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-['Baskerville'] text-white tracking-wide mb-4">
                        {stepTitle}
                    </h3>
                    <p className="text-base md:text-lg font-['Baskerville'] text-zinc-400 leading-[1.6] relative z-10">
                        {/* Halo de lumière diffuse derrière le texte */}
                        <span className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full" />
                        {text}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default function JourneyTimeline() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // 5 panels = 500vw width total. We need to translate by -80% to show the last panel.
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    return (
        <section ref={targetRef} className="relative h-[500vh] bg-black pointer-events-auto z-10">
            {/* Conteneur Sticky */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-black">

                {/* Ligne horizontale fine et centrée */}
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0" />

                {/* Contenu défilant */}
                <motion.div style={{ x }} className="flex h-full items-center z-10">

                    {/* Panel d'introduction */}
                    <div className="flex flex-col items-center justify-center w-screen h-full shrink-0 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="flex flex-col items-center text-center px-6"
                        >
                            <span className="font-['Baskerville'] italic text-sm md:text-base text-zinc-500 mb-6 tracking-widest">
                                Rétrospective
                            </span>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl text-white font-['Baskerville'] tracking-tight mb-8">
                                Mon Histoire
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="absolute bottom-24 text-zinc-400 font-['Baskerville'] italic text-sm flex flex-col items-center gap-3 tracking-widest"
                        >
                            <span>Scrollez vers le futur</span>
                            <span className="animate-bounce-horizontal">→</span>
                        </motion.div>
                    </div>

                    {/* Nodes de l'histoire */}
                    <TimelineNode
                        date="2022 — 2023"
                        stepTitle="Entrée en MMI"
                        position="above"
                        text={
                            <>
                                Découverte du <span className="text-white">développement web</span> et de la création d'interfaces. C'est à ce moment précis que je suis véritablement <span className="text-white">entré dans l'informatique</span>.
                            </>
                        }
                    />

                    <TimelineNode
                        date="2023 — 2025"
                        stepTitle="Exploration Autodidacte"
                        position="below"
                        text={
                            <>
                                Une longue phase d'exploration personnelle. La passion de l'automatisation s'installe. J'apprends, je scripte et je forge ma propre logique technique <span className="text-white">hors des sentiers battus</span>.
                            </>
                        }
                    />

                    <TimelineNode
                        date="2025 — 2026"
                        stepTitle="1ère année R&T"
                        position="above"
                        text={
                            <>
                                Une année décisive. Entrée à l'IUT de Béthune. Classé dans le <span className="text-white">top 15 sur une cinquantaine d'élèves</span>, j'accomplis des projets majeurs et acquiers des fondations solides en <span className="text-white">administration système et réseaux</span>.
                            </>
                        }
                    />

                    <TimelineNode
                        date="2026 — 2027"
                        stepTitle="2ème année R&T"
                        position="below"
                        text={
                            <>
                                Aujourd'hui. Une maîtrise assumée où je deviens <span className="text-white">l'orchestrateur</span>. Les outils et l'IA exécutent le code, mon rôle est désormais d'architecturer les infrastructures et les flux.
                            </>
                        }
                    />

                </motion.div>
            </div>

            <style>
                {`
                @keyframes bounceHorizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
                .animate-bounce-horizontal {
                    animation: bounceHorizontal 2s infinite;
                }
                `}
            </style>
        </section>
    );
}
