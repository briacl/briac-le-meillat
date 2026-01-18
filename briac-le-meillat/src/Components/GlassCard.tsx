import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function GlassCard({ children, className = "", id }: GlassCardProps) {
    return (
        <div
            id={id}
            className={`
                bg-skin-card-bg backdrop-blur-md rounded-3xl p-8 
                border border-skin-card-border shadow-xl shadow-blue-900/10 
                flex flex-col items-center justify-center text-center
                pointer-events-auto
                ${className}
            `}
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
            }}
        >
            {children}
        </div>
    );
}
