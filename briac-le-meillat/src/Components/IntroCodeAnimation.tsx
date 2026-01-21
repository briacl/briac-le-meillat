import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroCodeAnimationProps {
    onComplete: () => void;
}

const sequences = [
    {
        lang: 'python',
        code: 'who = "world"\nprint(f"dematt {who}")',
        output: 'dematt world'
    },
    {
        lang: 'php',
        code: '$who = "world";\necho "dematt " . $who;',
        output: 'dematt world'
    },
    {
        lang: 'tsx', // React/JSX
        code: 'const who = "world";\nreturn <>dematt {who}</>;',
        output: 'dematt world'
    }
];

export default function IntroCodeAnimation({ onComplete }: IntroCodeAnimationProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [showOutput, setShowOutput] = useState(false);

    // Typing effect
    useEffect(() => {
        if (stepIndex >= sequences.length) {
            onComplete();
            return;
        }

        const currentSeq = sequences[stepIndex];
        let charIndex = 0;
        setDisplayText("");
        setShowOutput(false);

        const typeInterval = setInterval(() => {
            if (charIndex <= currentSeq.code.length) {
                setDisplayText(currentSeq.code.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Finished typing code, delay before showing output
                setTimeout(() => {
                    setShowOutput(true);

                    // Delay before next sequence
                    setTimeout(() => {
                        setStepIndex(prev => prev + 1);
                    }, 2000);
                }, 500);
            }
        }, 50); // Typing speed

        return () => clearInterval(typeInterval);
    }, [stepIndex, onComplete]);

    // Use the last sequence if we exceeded the bounds (while waiting for parent to unmount)
    const activeIndex = Math.min(stepIndex, sequences.length - 1);
    const currentSeq = sequences[activeIndex];

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-700 font-mono text-sm md:text-base">
                {/* Mac-style header */}
                <div className="bg-[#2d2d2d] px-4 py-2 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Code Area */}
                <div className="p-6 md:p-8 min-h-[200px] flex flex-col items-start gap-4">
                    {/* Source Code */}
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed w-full">
                        <span className="text-blue-400 mr-2">$</span>
                        {displayText}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-2 h-5 bg-[#00f2ff] ml-1 align-middle"
                        />
                    </div>

                    {/* Execution Output */}
                    <AnimatePresence>
                        {showOutput && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 text-[#00f2ff] font-bold mt-2"
                            >
                                <span className="text-blue-500">➜</span>
                                <span>{currentSeq.output}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Language Badge */}
                <div className="bg-[#2d2d2d] px-4 py-1 text-right text-xs text-gray-500 uppercase tracking-widest">
                    {currentSeq.lang}
                </div>
            </div>
        </div>
    );
}
