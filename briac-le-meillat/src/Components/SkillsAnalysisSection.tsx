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

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">

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
                                        <span className="text-sm text-gray-400 font-mono">{domain.code}</span>
                                        <span className="font-semibold text-white/90 text-sm leading-tight mt-1">{domain.title}</span>
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent">
                                        {domain.average.toFixed(1)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </GlassCard>

                {/* 2. TOP MODULES */}
                <GlassCard className="h-full flex flex-col p-6">
                    <h3 className="text-xl font-bold mb-6 text-[#00f2ff] flex items-center gap-2">
                        <span className="text-2xl">💎</span> MODULES D'EXCELLENCE
                    </h3>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex flex-col gap-3"
                    >
                        {data.top_modules.map((mod, i) => (
                            <motion.div key={i} variants={item} className="flex justify-between items-center p-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-3 transition-colors">
                                <span className="text-sm text-gray-300 truncate pr-2 w-[70%]" title={mod.name}>{mod.name}</span>
                                <span className="font-mono font-bold text-[#00f2ff]">{mod.grade}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </GlassCard>

                {/* 3. DETAILED PERFORMANCES */}
                <GlassCard className="h-full flex flex-col p-6 col-span-1 md:col-span-2 lg:col-span-1">
                    <h3 className="text-xl font-bold mb-6 text-[#00f2ff] flex items-center gap-2">
                        <span className="text-2xl">🌟</span> PERFORMANCES CLÉS
                    </h3>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-2 content-start"
                    >
                        {data.detailed_performances.map((perf, i) => (
                            <motion.div key={i} variants={item} className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#00f2ff] hover:bg-[#00f2ff]/10 transition-all cursor-default" title={`${perf.name} : ${perf.grade}/20`}>
                                <span className="opacity-80 break-words">{perf.name.split(" - ").pop()}</span>
                                <span className="ml-2 font-bold text-[#00f2ff]">{perf.grade}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </GlassCard>

            </div>
        </section>
    );
};

export default SkillsAnalysisSection;
