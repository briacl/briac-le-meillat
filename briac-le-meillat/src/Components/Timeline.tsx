import React from 'react';

interface TimelineProps {
    steps: {
        year: string;
        title: string;
    }[];
    activeStep: number;
    onStepClick: (index: number) => void;
}

export default function Timeline({ steps, activeStep, onStepClick }: TimelineProps) {
    return (
        <div className="w-full flex items-center justify-between relative px-4 py-8 select-none">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-skin-card-border rounded-full -z-10 transform -translate-y-1/2"></div>

            {/* Progress Line */}
            <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#00f2ff] to-[#0055ff] rounded-full -z-10 transform -translate-y-1/2 transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
                const isActive = index <= activeStep;
                const isCurrent = index === activeStep;

                return (
                    <div
                        key={index}
                        onClick={() => onStepClick(index)}
                        className={`
                            relative flex flex-col items-center cursor-pointer group
                            transition-all duration-300
                        `}
                    >
                        {/* Year Label */}
                        <span className={`
                            absolute -top-10 font-['Montserrat_Alternates'] text-sm font-bold transition-all duration-300
                            ${isActive ? 'text-[#0055ff]' : 'text-skin-text-secondary opacity-50'}
                            ${isCurrent ? 'transform scale-110' : ''}
                        `}>
                            {step.year}
                        </span>

                        {/* Dot */}
                        <div className={`
                            w-5 h-5 rounded-full border-4 border-white shadow-md transition-all duration-300 z-10
                            ${isActive ? 'bg-[#0055ff] scale-125' : 'bg-skin-card-border hover:bg-skin-card-border/80'}
                            ${isCurrent ? 'ring-4 ring-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.6)]' : ''}
                        `}></div>

                        {/* Title (visible on hover or active?) - keeping it simple for now, just year on timeline */}
                    </div>
                );
            })}
        </div>
    );
}
