import React from 'react';
import GlassCard from './GlassCard';

interface CertificationCardProps {
    imageUrl: string;
}

const CertificationCard = ({ imageUrl }: CertificationCardProps) => {
    return (
        <div className="hover-3d w-full">
            {/* content */}
            <figure className="w-full rounded-2xl">
                <img src={imageUrl} alt="3D card" className="w-full h-auto object-cover" />
            </figure>
            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

const CertificationsSection = () => {
    return (
        <div className="w-full flex items-center justify-center py-20 pointer-events-auto">
            <GlassCard className="w-full">
                <h2 className="text-[3rem] mb-16 text-[#0055ff] font-['Paris2024'] text-center">CERTIFICATIONS</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
                    <CertificationCard imageUrl={`${import.meta.env.BASE_URL}assets/certification-python-essential-1-from-cisco.png`} />
                    <CertificationCard imageUrl={`${import.meta.env.BASE_URL}assets/certification-python-essential-2-from-cisco.png`} />
                    <CertificationCard imageUrl={`${import.meta.env.BASE_URL}assets/certification-python-essential-2-from-cisco.png`} />
                </div>
            </GlassCard>
        </div>
    );
};

export default CertificationsSection;
