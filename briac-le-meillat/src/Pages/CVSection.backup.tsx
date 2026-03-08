import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/Components/GlassCard';
import Timeline from '@/Components/Timeline';
import Typewriter from '@/Components/Typewriter';

const cvData = [
    {
        year: '2026',
        title: 'BUT R&T',
        description: '1ère année de BUT Réseaux et Télécommunications.',
        location: 'IUT de Béthune'
    },
    {
        year: '2027',
        title: 'BUT R&T',
        description: '2ème année de BUT Réseaux et Télécommunications.',
        location: 'IUT de Béthune'
    },
    {
        year: '2028',
        title: 'BUT R&T',
        description: '3ème année de BUT Réseaux et Télécommunications.',
        location: 'IUT de Béthune'
    }
];

export default function CVSection() {
    const [activeStep, setActiveStep] = useState(0); // Débute sur 2026 (index 0)

    return (
        <div className="w-full flex items-center justify-center mx-auto">
            <GlassCard className="w-full flex flex-col items-center justify-center p-12">
                {/* Profile Photo */}
                <div className="relative mb-6 group">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0075FF] to-[#f336f0] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                    {/* Profile Image container */}
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-[#0075FF] to-[#f336f0]">
                        <img
                            src={`${import.meta.env.BASE_URL}assets/profile.jpg`}
                            alt="Briac Le Meillat"
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            loading="eager"
                            onLoad={() => console.log('✓ Image profile.jpg loaded successfully')}
                            onError={(e) => {
                                console.error('✗ Image failed to load');
                                const img = e.target as HTMLImageElement;
                                console.error('Full URL attempted:', img.src);
                                console.error('Base URL:', import.meta.env.BASE_URL);
                            }}
                        />
                    </div>
                </div>

                {/* Name */}
                <h3 className="font-['Paris2024'] text-2xl font-sm bg-gradient-to-r from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent mb-2 text-center">
                    BRIAC LE MEILLAT
                </h3>

                {/* Typewriter Description */}
                <Typewriter
                    text={["ÉTUDIANT EN", "DÉVELOPPEMENT WEB, RÉSEAUX INFORMATIQUES, IA, ET TÉLÉCOMMUNICATIONS"]}
                    delay={0.5}
                    className="text-lg uppercase tracking-widest mb-16"
                />

                {/* Timeline */}
                <div className="w-full pt-12 px-4 pb-4">
                    <Timeline
                        steps={cvData.map(d => ({ year: d.year, title: d.title }))}
                        activeStep={activeStep}
                        onStepClick={setActiveStep}
                    />
                </div>

                {/* Dynamic Content */}
                <div className="w-full px-8 pb-8 pt-4 flex flex-col items-center justify-center text-center transition-all duration-500">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeStep}>
                        <h3 className="font-['Paris2024'] text-4xl mb-2 text-[#0055ff]">
                            {cvData[activeStep].title}
                        </h3>
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-bold mb-6 font-['Montserrat_Alternates']">
                            {cvData[activeStep].location}
                        </span>
                        <p className="text-xl text-skin-text-secondary font-['Montserrat_Alternates'] leading-relaxed max-w-lg mx-auto">
                            {cvData[activeStep].description}
                        </p>
                    </div>

                    <Link to="/cv" className="font-['Baskerville'] text-[#0055ff] hover:text-[#00f2ff] transition-colors mt-8 inline-block border-b border-[#0055ff] hover:border-[#00f2ff]">
                        En savoir plus
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
