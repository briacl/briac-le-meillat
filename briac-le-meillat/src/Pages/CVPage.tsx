import React, { useRef } from 'react';
import NeuralNetworkBackground from '@/Components/NeuralNetworkBackground';
import GlassCard from '@/Components/GlassCard';
import Navbar from '@/Components/Navbar';
import { motion } from 'framer-motion';

// Reusing data from CVSection for consistency, but expanded for the full page if needed
// For now, I'll map the existing data to the new structure, or add more details if available.
// Since the user provided a snippet with specific structure (Apple history), I will adapt that structure 
// to display the user's actual CV data.

const cvDataDetailed = [
    {
        year: '2021',
        title: 'Classes Préparatoires',
        subtitle: 'Lycée Chateaubriand, Rennes',
        description: 'Admission en Classes Préparatoires aux Grandes Écoles (MPSI/MP). Deux années intensives de mathématiques et physique. Acquisition de bases solides en rigueur scientifique et capacité de travail.'
    },
    {
        year: '2023',
        title: 'IMT Nord Europe',
        subtitle: 'Douai / Lille',
        description: 'Entrée en école d\'ingénieur. Début de la spécialisation en numérique, développement et réseaux. Participation à divers projets techniques et associatifs.'
    },
    {
        year: '2024',
        title: 'Spécialisation IA',
        subtitle: 'IMT Nord Europe',
        description: 'Approfondissement des connaissances en Intelligence Artificielle et Data Science. Projets de machine learning, deep learning et traitement de données massives.'
    },
    {
        year: '2025',
        title: 'Futur Ingénieur',
        subtitle: 'À venir',
        description: 'Stage de fin d\'études et diplomation à venir. Prêt à relever de nouveaux défis technologiques et à intégrer le monde professionnel.'
    }
];

export default function CVPage() {
    return (
        <div className="relative w-full min-h-screen font-sans text-skin-text-main bg-skin-base transition-colors duration-500">
            <Navbar />

            {/* FIXED Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0">
                <NeuralNetworkBackground />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-32 pb-20 w-full">
                <GlassCard className="w-3/4 p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-['Paris2024'] text-center mb-16 bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent">
                        Mon Parcours
                    </h1>

                    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                        {cvDataDetailed.map((item, index) => (
                            <li key={index} className="grid-cols-[1fr_auto_1fr] gap-x-4">
                                {index > 0 && <hr className="bg-[#0055ff] w-1 h-full min-h-[10rem]" />}

                                <div className="timeline-middle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-5 w-5 text-[#0055ff]"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                <motion.div
                                    className={`timeline-${index % 2 === 0 ? 'start' : 'end'} my-32 text-${index % 2 === 0 ? 'right' : 'left'}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                    <time className="font-mono italic text-[#0055ff]">{item.year}</time>
                                    <div className="text-xl font-black font-['Paris2024'] mt-1 mb-2">{item.title}</div>
                                    <div className="text-sm font-bold text-gray-400 mb-2 font-['Montserrat_Alternates']">{item.subtitle}</div>
                                    <p className="text-skin-text-secondary leading-relaxed font-['Montserrat_Alternates']">
                                        {item.description}
                                    </p>
                                </motion.div>

                                {index < cvDataDetailed.length - 1 && <hr className="bg-[#0055ff] w-1 h-full min-h-[10rem]" />}
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            </div>
        </div>
    );
}
