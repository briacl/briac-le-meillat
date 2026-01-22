import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NeuralNetworkBackground from '../../Components/NeuralNetworkBackground';

interface ResearchDetailProps {
    title: string;
    subtitle: string;
    date: string;
    content: React.ReactNode;
}

export default function ResearchDetail({ title, subtitle, date, content }: ResearchDetailProps) {
    return (
        <div className="min-h-screen bg-skin-base text-skin-text-main font-serif selection:bg-blue-500/30 relative overflow-hidden">
            <NeuralNetworkBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                <Link
                    to="/recherches"
                    className="inline-flex items-center gap-2 text-skin-text-secondary hover:text-[#00f2ff] transition-colors mb-8 font-sans uppercase tracking-wider text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Retour aux recherches
                </Link>

                <article className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl">
                    <header className="mb-12 border-b border-white/10 pb-8">
                        <span className="font-mono text-[#00f2ff] text-sm mb-4 block">{date}</span>
                        <h1 className="font-['Paris2024'] text-4xl md:text-6xl bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent mb-6">
                            {title}
                        </h1>
                        <p className="font-['Baskerville'] text-2xl text-skin-text-secondary italic">
                            {subtitle}
                        </p>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none font-['Baskerville']">
                        {content}
                    </div>
                </article>
            </div>
        </div>
    );
}
