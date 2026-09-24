import React, { useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import UnifiedFooter from '@/Components/UnifiedFooter';
import JourneyTimeline from '@/Components/JourneyTimeline';

export default function JourneyPage() {
    useEffect(() => {
        document.title = 'Mon Parcours — Briac Le Meillat';
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-black font-sans">
            {/* Navbar fixe */}
            <div className="pointer-events-none fixed top-0 left-0 w-full flex justify-center z-[100]">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Navbar />
                </div>
            </div>

            <main className="relative w-full">
                {/* La nouvelle timeline (Baskerville / Apple-style) */}
                <JourneyTimeline />
                
                {/* Footer final */}
                <div className="relative z-20">
                    <UnifiedFooter />
                </div>
            </main>
        </div>
    );
}
