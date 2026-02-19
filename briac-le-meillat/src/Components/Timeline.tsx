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
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical md:timeline-horizontal w-full grid grid-cols-1 md:grid-cols-6">
            {steps.map((step, index) => {
                const isActive = index <= activeStep;
                const isPast = index < activeStep;
                const isEven = index % 2 === 0;

                return (
                    <li key={index} onClick={() => onStepClick(index)} className="w-full">
                        {/* Connecting Line (Previous) */}
                        {index > 0 && (
                            <hr className={`grow w-full h-1 border-none ${isActive ? "bg-[#0055ff]" : "bg-gray-200"}`} />
                        )}

                        {/* Start Content (Even indices - Top) */}
                        {isEven && (
                            <div className={`timeline-start timeline-box mb-8 relative p-4 text-xl font-['Montserrat_Alternates'] font-bold transition-all duration-300 ${isActive ? 'bg-[#0055ff] text-white border-none shadow-lg scale-110' : 'bg-transparent text-skin-text-secondary border-skin-card-border hover:bg-skin-card-border/50'}`}>
                                {step.year}
                                {/* Connector Line Down */}
                                <div className={`absolute left-1/2 -translate-x-1/2 top-full w-[1px] h-6 ${isActive ? 'bg-[#0055ff]' : 'bg-skin-card-border'} opacity-50`}></div>
                            </div>
                        )}

                        {/* Middle Icon */}
                        <div className="timeline-middle z-10 bg-skin-base rounded-full"> {/* z-10 to sit above lines if needed, bg to hide lines behind if crossing */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`h-8 w-8 transition-colors duration-300 ${isActive ? 'text-[#0055ff]' : 'text-gray-400 group-hover:text-[#0055ff]/70'}`}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {/* End Content (Odd indices - Bottom) */}
                        {!isEven && (
                            <div className={`timeline-end timeline-box mt-8 relative p-4 text-xl font-['Montserrat_Alternates'] font-bold transition-all duration-300 ${isActive ? 'bg-[#0055ff] text-white border-none shadow-lg scale-110' : 'bg-transparent text-skin-text-secondary border-skin-card-border hover:bg-skin-card-border/50'}`}>
                                {/* Connector Line Up */}
                                <div className={`absolute left-1/2 -translate-x-1/2 bottom-full w-[1px] h-6 ${isActive ? 'bg-[#0055ff]' : 'bg-skin-card-border'} opacity-50`}></div>
                                {step.year}
                            </div>
                        )}

                        {/* Connecting Line (Next) */}
                        {index < steps.length - 1 && (
                            <hr className={`grow w-full h-1 border-none ${isPast ? "bg-[#0055ff]" : "bg-gray-200"}`} />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
