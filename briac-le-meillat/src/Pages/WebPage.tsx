import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import UnifiedFooter from '@/Components/UnifiedFooter';

const WEB_PROJECTS = [
    {
        title: "NotGoogle",
        subtitle: "découverte du système basique des navigateurs",
        image: "assets/projects/notgoogle-visu.png",
        languages: ["Python", "TCP", "Réseau"],
        link: "https://github.com/briacl/notgoogle"
    },
    {
        title: "MiniGPT",
        subtitle: "découverte de la possibilité de coder un site web via python grâce à flask et jinja2",
        image: "assets/projects/minigpt-visu.png",
        languages: ["Flask", "Python", "MySQL", "Tailwind"],
        link: "https://github.com/briacl/minigpt"
    },
    {
        title: "Mesvoyages",
        subtitle: "découverte de symfony et de l'architecture mvc",
        image: "assets/projects/mesvoyages.png",
        languages: ["Symfony", "PHP", "MVC"],
        link: "#"
    },
    {
        title: "QEL",
        subtitle: "renforcement des notions de base",
        image: "assets/projects/qel_questionnaire_en_ligne.png",
        languages: ["PHP", "MySQL"],
        link: "#"
    },
    {
        title: "Le Faux Instagram",
        subtitle: "renforcement des notions de base",
        image: "assets/projects/lefauxinstagram.png",
        languages: ["PHP", "MySQL"],
        link: "#"
    },
    {
        title: "Weackers",
        subtitle: "découverte du html/css/php/mysql",
        image: "assets/projects/weackers.png",
        languages: ["HTML/CSS", "PHP", "MySQL"],
        link: "#"
    },
    {
        title: "Vue-Briac",
        subtitle: "découverte de tailwind et donc du frontend",
        image: "assets/projects/briac_website.png",
        languages: ["Tailwind", "HTML", "JS"],
        link: "https://github.com/briacl/vue-briac"
    }
];

export default function WebPage() {
    useEffect(() => {
        document.title = 'Web — Briac Le Meillat';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-[#f5f5f7] font-sans selection:bg-[#0075FF] selection:text-white">
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            <main className="w-full pt-40 pb-32 px-6 flex flex-col items-center">
                
                {/* Header Apple Style */}
                <div className="w-full max-w-[1400px] mb-20 px-6 text-left">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-['Paris2024'] text-zinc-900 tracking-tight"
                    >
                        Mon apprentissage du Web.
                    </motion.h1>
                </div>

                {/* Carrousel de produits */}
                <div className="w-full max-w-[1400px] flex overflow-x-auto snap-x snap-mandatory gap-6 pl-12 pr-6 md:pl-20 md:pr-8 pb-12 hide-scrollbar items-start">
                    {WEB_PROJECTS.map((project, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                            className="flex-none w-[80vw] md:w-[40vw] xl:w-[320px] snap-center flex flex-col items-center group"
                        >
                            {/* Image container (Seul élément avec fond blanc et bords arrondis) */}
                            <div className="w-full aspect-[4/3] bg-white rounded-3xl relative overflow-hidden flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500 mb-6 border border-black/5 p-4">
                                <img 
                                    src={`${import.meta.env.BASE_URL}${project.image}`}
                                    alt={project.title}
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                            </div>

                            {/* Info container (Flottant en dessous) */}
                            <div className="flex flex-col items-center text-center px-4 w-full flex-grow">
                                
                                {/* Langages façon "tags" */}
                                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                                    {project.languages.map((lang, i) => (
                                        <span key={i} className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-black/10 text-zinc-500 bg-white/50">
                                            {lang}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-2xl md:text-3xl font-['Paris2024'] text-zinc-900 mb-2">
                                    {project.title}
                                </h2>
                                
                                <p className="text-sm md:text-sm text-zinc-600 font-['Baskerville'] italic mb-8 max-w-[280px]">
                                    {project.subtitle}
                                </p>

                                {/* Bouton Contact-Style repoussé en bas */}
                                <div className="mt-auto pb-2 w-full flex justify-center">
                                    <div className="relative group/btn flex items-center justify-center w-fit">
                                        {/* Halo bleu subtil */}
                                        <div className="absolute -inset-1 bg-blue-500/40 rounded-full blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 will-change-[opacity,filter]"></div>
                                        <motion.a
                                            whileHover={{ y: -2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            href={project.link}
                                            target={project.link !== '#' ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            className="relative px-6 py-2.5 rounded-full font-black text-[11px] md:text-xs border border-[#0075FF] text-[#0075FF] bg-transparent hover:bg-[#0075FF] hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[130px] z-10 uppercase tracking-widest"
                                        >
                                            Découvrir
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>

            <div className="relative z-20">
                <UnifiedFooter />
            </div>
        </div>
    );
}
