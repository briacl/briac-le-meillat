import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
    text: string | string[];
    delay?: number;
    className?: string;
}

export default function Typewriter({ text, delay = 0, className = "" }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState<string[]>(Array.isArray(text) ? Array(text.length).fill("") : [""]);
    const [currentIndex, setCurrentIndex] = useState<{ line: number, char: number }>({ line: 0, char: 0 });
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay * 1000);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        const lines = Array.isArray(text) ? text : [text];

        if (currentIndex.line >= lines.length) return;

        const currentLineText = lines[currentIndex.line];

        if (currentIndex.char < currentLineText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => {
                    const newLines = [...prev];
                    newLines[currentIndex.line] = currentLineText.slice(0, currentIndex.char + 1);
                    return newLines;
                });
                setCurrentIndex(prev => ({ ...prev, char: prev.char + 1 }));
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            // Move to next line
            if (currentIndex.line < lines.length - 1) {
                const timeout = setTimeout(() => {
                    setCurrentIndex(prev => ({ line: prev.line + 1, char: 0 }));
                }, 300); // Pause between lines
                return () => clearTimeout(timeout);
            }
        }
    }, [currentIndex, text, started]);

    return (
        <div className={`font-['Paris2024'] text-[1.2rem] tracking-[4px] text-skin-text-main mt-4 leading-normal text-center min-h-[3.6rem] ${className}`}>
            {displayedText.map((line, i) => (
                <React.Fragment key={i}>
                    <span>
                        {line}
                        {/* Show cursor on the active line, or keep it on the last line when finished */}
                        {(i === currentIndex.line || (i === displayedText.length - 1 && currentIndex.line >= displayedText.length)) && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                className="inline-block w-[2px] h-[1.2rem] bg-[#0055ff] ml-1 align-middle"
                            />
                        )}
                    </span>
                    {(i < displayedText.length - 1) && <br />}
                </React.Fragment>
            ))}
        </div>
    );
}
