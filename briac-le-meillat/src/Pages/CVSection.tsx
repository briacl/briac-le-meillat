import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/Components/GlassCard';
import ProfileCard from '@/Components/ProfileCard';
import Timeline from '@/Components/Timeline';

const cvData = [
    {
        year: '2021',
        title: 'Baccalauréat Général',
        description: 'Année de Terminale, obtention du Bac Général Spécialités SVT & Physique-Chimie Option Maths Complémentaires.',
        location: 'Lycée'
    },
    {
        year: '2022',
        title: 'Licence de Biologie',
        description: '1ère année de Licence de Biologie.',
        location: 'Faculté Jean Perrin'
    },
    {
        year: '2023',
        title: 'BUT MMI',
        description: '1ère année de BUT Métiers du Multimédia et de l\'Internet.',
        location: 'IUT de Lens'
    },
    {
        year: '2024',
        title: 'Autodidacte',
        description: '1ère année en autodidacte.',
        location: 'Autonomie'
    },
    {
        year: '2025',
        title: 'Autodidacte',
        description: '2ème année en autodidacte.',
        location: 'Autonomie'
    },
    {
        year: '2026',
        title: 'BUT R&T',
        description: '1ère année de BUT Réseaux et Télécommunications.',
        location: 'IUT de Béthune'
    }
];

export default function CVSection() {
    const [activeStep, setActiveStep] = useState(1); // Default to second step as active for demo

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-center mx-auto min-h-[700px]">

            {/* LEFT: Profile Card */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
                <ProfileCard />
            </div>

            {/* RIGHT: Timeline & Content */}
            <div className="w-full lg:w-2/3 flex flex-col">
                <GlassCard className="h-full flex flex-col justify-start !p-0 overflow-hidden">

                    {/* Top: Timeline */}
                    <div className="w-full pt-32 px-8 pb-4">
                        <Timeline
                            steps={cvData.map(d => ({ year: d.year, title: d.title }))}
                            activeStep={activeStep}
                            onStepClick={setActiveStep}
                        />
                    </div>

                    {/* Bottom: Dynamic Content */}
                    <div className="flex-1 w-full px-12 pb-12 pt-2 flex flex-col items-center justify-center text-center transition-all duration-500">

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
                            Pour plus d'info
                        </Link>

                    </div>

                </GlassCard>
            </div>

        </div>
    );
}
