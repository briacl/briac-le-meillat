import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';

export default function ThinkingAboutAi() {
    useEffect(() => {
        document.title = 'Thinking About AI — Briac Le Meillat';
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-black overflow-hidden">
            {/* Navbar fixe */}
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            {/* Réseau de neurones en plein écran */}
            <div className="absolute inset-0 z-0">
                <NeuralNetworkBackground interactive={true} />
            </div>

            {/* Contenu textuel - Mention de l'étude des réseaux de neurones */}
            <div className="relative z-10 pointer-events-none flex flex-col justify-end min-h-screen p-8 md:p-16 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.5 }}
                    className="max-w-xl"
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4">
                        Recherche & Réflexion
                    </p>
                    <h1 className="font-['Baskerville'] text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
                        Une approche des <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">
                            réseaux de neurones.
                        </span>
                    </h1>
                    <div className="space-y-4 text-zinc-400 font-sans text-sm md:text-base leading-relaxed">
                        <p>
                            Durant mon cursus à l'IUT, j'ai eu l'opportunité d'étudier l'impact et le fonctionnement 
                            des intelligences artificielles. J'ai notamment rédigé un article sur l'arrivée de l'IA 
                            et ses conséquences sur notre manière de travailler et d'apprendre.
                        </p>
                        <p>
                            Ce qui tourne en arrière-plan n'est pas qu'une simple animation, c'est une 
                            représentation interactive inspirée de la structure des réseaux de neurones, 
                            codée pour expérimenter avec ces concepts géométriques.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
