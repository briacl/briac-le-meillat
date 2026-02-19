import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import skillsData from '../data/skills_analysis.json';

interface Skill {
    name: string;
    code?: string;
    grade: number;
    title?: string;
    average?: number;
}

const SkillsAnalysisSection: React.FC = () => {
    // Type assertion to handle the imported JSON structure safely
    const data = skillsData as {
        top_domains: { title: string; code: string; average: number }[];
        top_modules: { name: string; code: string; grade: number }[];
        detailed_performances: { name: string; grade: number }[];
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="w-full flex flex-col items-center justify-center py-20">
            <h2 className="text-[3rem] mb-12 text-[#0055ff] font-['Paris2024'] text-center tracking-wider">
                ANALYSE DES COMPÉTENCES
            </h2>

            <div className="w-full flex justify-center px-4">

                {/* 1. TOP DOMAINS */}
                <GlassCard className="h-full flex flex-col p-6">
                    <h3 className="text-xl font-bold mb-6 text-[#00f2ff] flex items-center gap-2">
                        <span className="text-2xl">🏆</span> DOMAINES MAJEURS
                    </h3>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex flex-col gap-4"
                    >
                        {data.top_domains.map((domain, i) => (
                            <motion.div key={i} variants={item} className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden group hover:border-[#00f2ff]/50 transition-colors">
                                <div className="absolute left-0 top-0 bottom-0 bg-[#00f2ff]/10 w-[var(--width)] transition-all duration-1000 ease-out" style={{ '--width': `${(domain.average / 20) * 100}%` } as React.CSSProperties}></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-skin-text-secondary font-mono">{domain.code}</span>
                                        <span className="font-semibold text-skin-text-main text-sm leading-tight mt-1">{domain.title}</span>
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent">
                                        {domain.average.toFixed(1)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <p className="mt-6 text-xs text-skin-text-secondary italic text-center">
                        * Les chiffres affichés proviennent de mes relevés de notes officiels.
                    </p>
                </GlassCard>
            </div>
        </section>
    );
};

export default SkillsAnalysisSection;
