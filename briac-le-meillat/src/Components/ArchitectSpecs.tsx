import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimate } from 'framer-motion';

const APPLE_BEZIER = [0.21, 0.47, 0.32, 0.98];

// --- Sound Wave Component for Code Poetics ---
const SoundWave = ({ progress }: { progress: any }) => {
    // We create multiple bars that scale based on progress
    const barCount = 40;
    return (
        <div className="flex items-center justify-center gap-1 h-64 w-full max-w-md mx-auto">
            {[...Array(barCount)].map((_, i) => {
                // Calculate individual scale based on position and progress
                // We want a wave effect that moves or grows
                const scale = useTransform(
                    progress,
                    [0, 0.5, 1],
                    [0.2, Math.sin(i * 0.5) * 0.8 + 1, 0.2]
                );

                return (
                    <motion.div
                        key={i}
                        style={{ scaleY: scale }}
                        className="w-1.5 h-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full origin-center"
                    />
                );
            })}
        </div>
    );
};

export const PureStructure = () => {
    return (
        <section id="pure-structure" className="w-full min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                viewport={{ once: true }}
                className="max-w-4xl space-y-6"
            >
                <h2 className="text-5xl md:text-7xl font-['Paris2024'] text-white tracking-tighter">
                    Pure Structure.
                </h2>
                <p className="text-xl md:text-2xl font-sans leading-relaxed max-w-3xl mx-auto">
                    <span className="text-white">L'invisible au service de l'invincible.</span>{" "}
                    <span className="text-zinc-400">
                        Je bâtis des architectures capables d'absorber la charge sans jamais fléchir.
                        Parce qu'un beau design sans une structure robuste n'est qu'une façade.
                    </span>
                </p>
            </motion.div>

            {/* Navigation Button to The Foundation */}
            <div className="absolute left-0 w-full flex justify-center" style={{ bottom: 'calc(3rem - 5vh)' }}>
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#the-foundation"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('the-foundation')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const CodePoetics = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    return (
        <section id="code-poetics" ref={sectionRef} tabIndex={-1} className="w-full min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6 md:px-20 relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-5xl md:text-7xl font-['Paris2024'] tracking-tighter bg-gradient-to-r from-[#0075FF] via-white to-[#0075FF] bg-clip-text text-transparent">
                        Code Poetics.
                    </h2>
                    <p className="text-xl md:text-2xl font-sans leading-relaxed">
                        <span className="text-white">Écrire pour l'utilisateur, composer pour la machine.</span>{" "}
                        <span className="text-zinc-400">
                            Je n'agence pas seulement des lignes, je compose. Comme un instrument parfaitement accordé, l'interface réagit à l'instinct, sans friction, avec une justesse mathématique.
                        </span>
                    </p>
                </motion.div>

                <div className="flex justify-center">
                    <SoundWave progress={scrollYProgress} />
                </div>
            </div>

            {/* Navigation Button to Logic as Canvas */}
            <div className="absolute left-0 w-full flex justify-center" style={{ bottom: 'calc(3rem - 5vh)' }}>
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#logic-as-canvas"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('logic-as-canvas')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

const COLS = 10;
const ROWS = 8;

const GridCell = ({ progress, col, row }: { progress: any; col: number; row: number }) => {
    const wave = Math.sin((col + row) * 0.6);
    const scale = useTransform(progress, [0, 0.4, 0.8, 1], [0.15, wave * 0.4 + 0.6, wave * 0.3 + 0.5, 0.15]);
    const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.05, wave * 0.3 + 0.5, wave * 0.25 + 0.4, 0.05]);
    const hue = 280 + col * 8;
    return (
        <motion.div style={{ scale, opacity }} aria-hidden="true">
            <div className="w-full rounded-full aspect-square" style={{ background: `hsl(${hue}, 80%, 65%)` }} />
        </motion.div>
    );
};

const LogicGrid = ({ progress }: { progress: any }) => (
    <div
        className="w-full max-w-md mx-auto"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '10px' }}
    >
        {[...Array(COLS * ROWS)].map((_, i) => (
            <GridCell key={i} progress={progress} col={i % COLS} row={Math.floor(i / COLS)} />
        ))}
    </div>
);

export const LogicAsCanvas = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    return (
        <section id="logic-as-canvas" ref={sectionRef} className="w-full min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6 md:px-24 relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -30 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="order-2 md:order-1 relative flex items-center justify-center py-12"
                >
                    <LogicGrid progress={scrollYProgress} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                    viewport={{ once: true }}
                    className="order-1 md:order-2 space-y-6"
                >
                    <h2 className="text-5xl md:text-7xl font-['Paris2024'] tracking-tighter bg-gradient-to-r from-white via-[#f336f0] to-[#0075FF] bg-clip-text text-transparent">
                        Logic as Canvas.
                    </h2>
                    <p className="text-xl md:text-2xl font-sans leading-relaxed">
                        <span className="text-white">Où la donnée devient émotion.</span>{" "}
                        <span className="text-zinc-400">
                            La logique est mon canevas. Je transforme des flux complexes en expériences sereines. Mon rôle est de rendre l'informatique invisible pour ne laisser que l'harmonie.
                        </span>
                    </p>
                </motion.div>
            </div>

            {/* Navigation Button to The Core */}
            <div className="absolute left-0 w-full flex justify-center" style={{ bottom: 'calc(3rem - 5vh)' }}>
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#the-core-header"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('the-core-header')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

export const TheCoreHeader = () => {
    return (
        <section id="the-core-header" className="w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: APPLE_BEZIER as any }}
                viewport={{ once: true }}
                className="max-w-5xl space-y-6"
            >
                <h2 className="text-5xl md:text-8xl font-['Paris2024'] text-white tracking-tighter">
                    The Ecosystem.
                </h2>
                <p className="text-xl md:text-2xl text-zinc-400 font-sans leading-relaxed max-w-3xl mx-auto">
                    La vue macro de la galaxie de micro-outils et de recherches.
                </p>
                <p className="text-sm font-mono text-zinc-600 tracking-widest uppercase animate-pulse">
                    ↓ cliquez sur un nœud pour explorer
                </p>
            </motion.div>

            {/* Navigation Button to The Core Visual */}
            <div className="absolute left-0 w-full flex justify-center" style={{ bottom: 'calc(3rem - 5vh)' }}>
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    href="#the-core-visual"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('the-core-visual')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </motion.a>
            </div>
        </section>
    );
};

// ─── Shared showcase components ───────────────────────────────────────────────

const ScrollChevron = ({ target }: { target: string }) => (
    <div className="absolute left-0 w-full flex justify-center" style={{ bottom: 'calc(3rem - 5vh)' }}>
        <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            href={`#${target}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); }}
            className="border border-white/10 rounded-full w-[60px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-300 animate-bounce hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
        >
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-blue-500 transition-transform group-hover:scale-110">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
        </motion.a>
    </div>
);

// Style calqué sur ExPage : outer slate-100 + inner white, transposé en dark
function TerminalBlock({ lines, label = 'Terminal', accentColor = '#06b6d4' }: { lines: string[]; label?: string; accentColor?: string }) {
    return (
        <div className="rounded-xl p-2 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-3 pb-2 pt-1.5 flex items-center gap-2 font-sans">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <pre className="p-4 font-mono text-[13px] leading-7 overflow-x-auto">
                    {lines.map((line, i) => {
                        const isSuccess = line.includes('✓') || line.includes('✔');
                        const isTree = line.startsWith('├') || line.startsWith('└') || line.startsWith('│');
                        const isPrompt = line.startsWith('>') || line.startsWith('$') || line.startsWith('[');
                        const isEmpty = line.trim() === '';
                        let color = 'rgba(201,209,217,0.85)';
                        if (isSuccess) color = accentColor;
                        else if (isTree) color = 'rgba(139,148,158,0.65)';
                        else if (isPrompt) color = '#79c0ff';
                        return <div key={i} style={{ color, minHeight: isEmpty ? '1rem' : undefined }}>{line}</div>;
                    })}
                </pre>
            </div>
        </div>
    );
}

function CodeBlock({ lines, label = 'code' }: { lines: string[]; label?: string }) {
    return (
        <div className="rounded-xl p-2 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-3 pb-2 pt-1.5 flex items-center gap-2 font-sans">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <pre className="p-4 font-mono text-[13px] leading-7 overflow-x-auto">
                    {lines.map((line, i) => {
                        const isHighlight = line.includes('console.print') || line.includes('border_style') || line.includes('webbrowser') || line.includes('"id"') || line.includes('"label"') || line.includes('questionary');
                        const isKeyword = /^\s*(def |import |from |if |return |class )/.test(line);
                        const isString = line.includes('"') && !isHighlight;
                        let color = 'rgba(201,209,217,0.85)';
                        if (isHighlight) color = '#79c0ff';
                        else if (isKeyword) color = '#ff7b72';
                        else if (isString) color = '#a5d6ff';
                        return (
                            <div key={i} style={{
                                color,
                                borderLeft: isHighlight ? '2px solid #0075FF' : '2px solid transparent',
                                paddingLeft: isHighlight ? '10px' : undefined,
                                background: isHighlight ? 'rgba(0,117,255,0.07)' : undefined,
                            }}>
                                {line}{'\n'}
                            </div>
                        );
                    })}
                </pre>
            </div>
        </div>
    );
}

function StackBadge({ label }: { label: string }) {
    return (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-white/10 text-white/50">
            {label}
        </span>
    );
}

function OriginTag({ label, color }: { label: string; color: string }) {
    return (
        <span className={`text-[9px] font-mono uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border ${color}`}>
            {label}
        </span>
    );
}

function GithubLink({ href, label = 'Voir sur GitHub' }: { href: string; label?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5"
        >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {label}
        </a>
    );
}

// Wrapper pour que perspective s'applique correctement sur les enfants motion
function ShowcaseLayout({ textSlot, cardSlot, textLeft = true }: {
    textSlot: React.ReactNode;
    cardSlot: React.ReactNode;
    textLeft?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [cardScope, animateCard] = useAnimate();
    const [textScope, animateText] = useAnimate();
    const fired = useRef(false);

    useEffect(() => {
        if (!inView || fired.current) return;
        fired.current = true;

        // Card apparaît face (0°) puis se désaxe : bord extérieur (côté fenêtre) avancé vers le viewer
        // textLeft=true → card à droite → rotateY négatif avance le bord droit
        const finalAngle = textLeft ? -14 : 14;
        animateCard(cardScope.current, {
            rotateY: [0, finalAngle * 1.25, finalAngle],
        }, {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
        });

        // Le texte glisse vers la card et reste à cette position
        const dir = textLeft ? 10 : -10;
        animateText(textScope.current, {
            x: [0, dir],
        }, {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
        });
    }, [inView]);

    return (
        <div ref={ref} className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start py-24">
            <div ref={textScope} className={textLeft ? 'space-y-6 sticky top-[20vh]' : 'space-y-6 sticky top-[20vh] order-1 md:order-2'}>
                {textSlot}
            </div>
            <div
                className={textLeft ? '' : 'order-2 md:order-1'}
                style={{ perspective: '1000px' }}
            >
                <div ref={cardScope} className="space-y-3">
                    {cardSlot}
                </div>
            </div>
        </div>
    );
}

// ─── Showcase 1 : willkommen_v2 — Terminal animé pixel-perfect ────────────────

// Couleurs exactes observées dans les screenshots du vrai terminal
const TC = {
    cyan: '#06b6d4',
    magenta: '#d946ef',
    white: '#e2e8f0',
    dim: 'rgba(226,232,240,0.35)',
    green: '#22c55e',
};

const MONO: React.CSSProperties = {
    fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", monospace',
    fontSize: '12px',
    lineHeight: '1.65',
};

/* Bannière Rich (panel cyan, titre magenta) */
function TBanner() {
    return (
        <div style={{ border: `1px solid ${TC.cyan}`, borderRadius: 4, padding: '10px 20px', marginBottom: 8 }}>
            <div style={{ color: TC.magenta, fontWeight: 700 }}>✨ WILLKOMMEN v2 ✨</div>
            <div style={{ color: TC.white, fontWeight: 700 }}>pour créer n'importe quel fichier</div>
        </div>
    );
}

/* Ligne promptée résolue : > label answer */
function TPrompt({ label, answer, answerColor = TC.cyan }: { label: string; answer: string; answerColor?: string }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 6px' }}>
            <span style={{ color: TC.cyan, fontWeight: 700, flexShrink: 0 }}>{'>'}</span>
            <span style={{ color: TC.white, fontWeight: 700, flexShrink: 0 }}>{label}</span>
            <span style={{ color: answerColor }}>{answer}</span>
        </div>
    );
}

/* Ligne en cours de saisie avec curseur clignotant */
function TTyping({ label, typed }: { label: string; typed: string }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 6px' }}>
            <span style={{ color: TC.cyan, fontWeight: 700, flexShrink: 0 }}>{'>'}</span>
            <span style={{ color: TC.white, fontWeight: 700, flexShrink: 0 }}>{label}</span>
            <span style={{ color: TC.cyan }}>{typed}</span>
            <span style={{ color: TC.white }} className="animate-pulse">▌</span>
        </div>
    );
}

/* Menu de sélection questionary : » item sélectionné en cyan, autres en blanc */
function TSelect({ label, choices, selectedIdx }: { label: string; choices: string[]; selectedIdx: number }) {
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 6px' }}>
                <span style={{ color: TC.cyan, fontWeight: 700, flexShrink: 0 }}>{'>'}</span>
                <span style={{ color: TC.white, fontWeight: 700 }}>{label}</span>
                <span style={{ color: TC.dim }}>{'(Use arrow keys)'}</span>
            </div>
            {choices.map((c, i) => (
                <div key={i} style={{ paddingLeft: 12, color: i === selectedIdx ? TC.cyan : TC.white, fontWeight: i === selectedIdx ? 700 : 400 }}>
                    {i === selectedIdx ? '» ' : '  '}{c}
                </div>
            ))}
        </div>
    );
}

/* Panel Résumé (bordure + titre magenta, labels magenta, valeurs cyan) */
function TResume({ nom, objectif, fichier }: { nom: string; objectif: string; fichier: string }) {
    const rows: [string, string][] = [
        ['Langage', 'Markdown 📝'],
        ['Dossier', '/home/briacl/Development/willkommen_v2'],
        ['Programme', nom],
        ['Objectif', objectif],
        ['Fichier principal', fichier],
    ];
    return (
        <div style={{ border: `1px solid ${TC.magenta}`, borderRadius: 4, margin: '6px 0' }}>
            <div style={{ textAlign: 'center', padding: '2px 0', color: TC.magenta, borderBottom: `1px solid rgba(217,70,239,0.25)` }}>
                📋 Résumé
            </div>
            <div style={{ padding: '6px 16px' }}>
                {rows.map(([k, v]) => (
                    <div key={k}>
                        <span style={{ color: TC.magenta, fontWeight: 700 }}>{k} : </span>
                        <span style={{ color: TC.cyan }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* Panel succès (bordure verte) */
function TSuccess({ nom }: { nom: string }) {
    return (
        <div style={{ border: `1px solid ${TC.green}`, borderRadius: 4, padding: '6px 16px', margin: '6px 0' }}>
            <span style={{ color: TC.white }}>✅ Projet <strong style={{ color: TC.white }}>{nom}</strong> créé dans </span>
            <span style={{ color: TC.cyan }}>/home/briacl/Development/willkommen_v2</span>
        </div>
    );
}

/* ── Animation state machine ── */
const NOM_T = 'notes-cours-reseaux';
const OBJ_T = 'Synthèse BUT Réseaux R2';
const FIC_T = 'cours-reseaux.md';
const CHAR_MS = 55;

function WillkommenTerminalAnimation() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const inView = useInView(wrapRef, { once: false, margin: '-80px' });
    const animKey = useRef(0);

    const [phase, setPhase] = useState(-1);
    const [typedStr, setTypedStr] = useState('');
    const [cNom, setCNom] = useState('');
    const [cObj, setCObj] = useState('');
    const [cFic, setCFic] = useState('');

    useEffect(() => {
        if (!inView) return;
        const key = ++animKey.current;
        const ids: ReturnType<typeof setTimeout>[] = [];

        function at(ms: number, fn: () => void) {
            ids.push(setTimeout(() => { if (animKey.current === key) fn(); }, ms));
        }

        /* Planifie la frappe d'un texte et retourne le timestamp de fin */
        function typeFrom(text: string, startMs: number, onChar: (s: string) => void): number {
            for (let i = 1; i <= text.length; i++) {
                at(startMs + i * CHAR_MS, () => onChar(text.slice(0, i)));
            }
            return startMs + text.length * CHAR_MS + 120;
        }

        function run() {
            if (animKey.current !== key) return;

            // Reset complet
            setPhase(-1); setTypedStr('');
            setCNom(''); setCObj(''); setCFic('');

            at(50, () => setPhase(0));                          // bannière
            at(500, () => setPhase(1));                          // select langage visible

            // Langage résolu + dossier
            at(1150, () => setPhase(2));

            // Nom du programme
            at(1700, () => { setPhase(3); setTypedStr(''); });
            const afterNom = typeFrom(NOM_T, 1700, setTypedStr);

            // Objectif
            at(afterNom, () => { setCNom(NOM_T); setPhase(4); setTypedStr(''); });
            const afterObj = typeFrom(OBJ_T, afterNom, setTypedStr);

            // Fichier principal
            at(afterObj, () => { setCObj(OBJ_T); setPhase(5); setTypedStr(''); });
            const afterFic = typeFrom(FIC_T, afterObj, setTypedStr);

            // Select mode markdown
            at(afterFic, () => { setCFic(FIC_T); setPhase(6); setTypedStr(''); });

            // Résumé + confirm
            const t7 = afterFic + 700;
            at(t7, () => { setPhase(7); setTypedStr(''); });
            const afterYes = typeFrom('Yes', t7, setTypedStr);

            // Select scaffold
            at(afterYes, () => { setPhase(8); setTypedStr(''); });

            // Succès
            const t9 = afterYes + 800;
            at(t9, () => setPhase(9));

            // Replay
            at(t9 + 5000, run);
        }

        run();
        return () => { animKey.current++; ids.forEach(clearTimeout); };
    }, [inView]);

    return (
        <div ref={wrapRef} className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Barre de titre */}
            <div className="px-3 pb-2 pt-1.5 flex items-center gap-2 font-sans">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>Terminal</span>
                <span className="ml-auto text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.15)' }}>live demo</span>
            </div>

            {/* Corps du terminal */}
            <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '380px', padding: '14px 16px', ...MONO }}>

                {phase >= 0 && <TBanner />}

                {/* Sélection du langage — menu visible */}
                {phase === 1 && (
                    <TSelect
                        label="Sélectionnez le langage du programme:"
                        choices={['Python 🐍', 'JavaScript (Node) 🟨', 'TypeScript 🟦', 'Go 🐹', 'Rust 🦀', 'C# (.NET) #', 'Java ☕', 'HTML/CSS/JS 🌐', 'Markdown 📝']}
                        selectedIdx={8}
                    />
                )}

                {/* Sélection résolue + dossier */}
                {phase >= 2 && (
                    <>
                        <TPrompt label="Sélectionnez le langage du programme:" answer="Markdown 📝" />
                        <TPrompt label="Dans quel dossier créer le projet?" answer="/home/briacl/Development/willkommen_v2" />
                    </>
                )}

                {/* Nom du programme */}
                {phase === 3 && <TTyping label="Nom du programme:" typed={typedStr} />}
                {phase >= 4 && cNom && <TPrompt label="Nom du programme:" answer={cNom} />}

                {/* Objectif */}
                {phase === 4 && <TTyping label="Objectif du programme:" typed={typedStr} />}
                {phase >= 5 && cObj && <TPrompt label="Objectif du programme:" answer={cObj} />}

                {/* Fichier principal */}
                {phase === 5 && <TTyping label="Nom du fichier principal:" typed={typedStr} />}
                {phase >= 6 && cFic && <TPrompt label="Nom du fichier principal:" answer={cFic} />}

                {/* Select mode Markdown */}
                {phase === 6 && (
                    <TSelect
                        label="Comment créer le fichier Markdown ?"
                        choices={['📁 Créer un dossier avec ressources (README, assets/)', '📄 Créer uniquement le fichier Markdown']}
                        selectedIdx={1}
                    />
                )}
                {phase >= 7 && <TPrompt label="Comment créer le fichier Markdown ?" answer="📄 Créer uniquement le fichier Markdown" />}

                {/* Résumé */}
                {phase >= 7 && cNom && cObj && cFic && (
                    <TResume nom={cNom} objectif={cObj} fichier={cFic} />
                )}

                {/* Confirmation */}
                {phase === 7 && <TTyping label="Confirmer la création de ce projet? (Y/n)" typed={typedStr} />}
                {phase >= 8 && <TPrompt label="Confirmer la création de ce projet? (Y/n)" answer="Yes" />}

                {/* Select scaffold */}
                {phase === 8 && (
                    <TSelect
                        label="Voulez-vous créer un dossier ou uniquement le fichier principal ?"
                        choices={['📁 Créer un dossier (tous les fichiers du template)', '📄 Créer uniquement le fichier principal']}
                        selectedIdx={1}
                    />
                )}
                {phase >= 9 && <TPrompt label="Voulez-vous créer un dossier ou uniquement le fichier principal ?" answer="📄 Créer uniquement le fichier principal" />}

                {/* Succès */}
                {phase >= 9 && cNom && <TSuccess nom={cNom} />}
            </div>
        </div>
    );
}

export const ShowcaseWillkommen = () => (
    <section id="showcase-willkommen" className="w-full min-h-screen bg-[#000000] flex items-center justify-center px-6 md:px-20 relative overflow-hidden border-t border-white/5">
        {/* Effet de lumière bleu au centre du fond noir */}
        <div
            className="pointer-events-none absolute"
            style={{
                width: '700px',
                height: '700px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0, 117, 255, 0.16) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
            }}
        />
        <ShowcaseLayout
            textLeft={true}
            textSlot={<>
                <div className="flex gap-2"><OriginTag label="Perso" color="bg-[#8B5CF6]/20 text-[#a78bfa] border-[#8B5CF6]/30" /></div>
                <h2 className="text-4xl md:text-6xl font-['Paris2024'] tracking-tighter text-white">willkommen_v2</h2>
                <p className="text-lg md:text-xl font-sans leading-relaxed">
                    <span className="text-white">Un projet, une commande.</span>{' '}
                    <span className="text-zinc-400">Génère le squelette complet d'un projet dans n'importe quel langage avec une interface terminal guidée et stylée — opérationnel en 30 secondes.</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">{['Python', 'Rich', 'Questionary', 'CLI'].map(s => <StackBadge key={s} label={s} />)}</div>
                <GithubLink href="https://github.com/briacl/willkommen_v2" />
            </>}
            cardSlot={<WillkommenTerminalAnimation />}
        />
        <ScrollChevron target="showcase-reseau" />
    </section>
);

// ─── Showcase 2 : réseau — Terminal animé pixel-perfect ──────────────────────

const RC = {
    magenta: '#d946ef',
    cyan: '#06b6d4',
    yellow: '#eab308',
    white: '#e2e8f0',
    dim: 'rgba(226,232,240,0.28)',
};

const RM: React.CSSProperties = {
    fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace',
    fontSize: '10.5px',
    lineHeight: '1.6',
};

function RSep({ title }: { title: string }) {
    const eq = '='.repeat(52);
    return (
        <div style={{ color: RC.magenta, marginBottom: 4 }}>
            <div>{eq}</div>
            <div style={{ textAlign: 'center' }}>{title}</div>
            <div>{eq}</div>
        </div>
    );
}

function REthTable({ dest, src, type, data }: { dest: string; src: string; type: string; data: string }) {
    const b = RC.dim;
    const cell = (color: string, content: string, last = false): React.CSSProperties => ({
        color, padding: '1px 5px', borderRight: last ? 'none' : `1px solid ${b}`,
    });
    return (
        <div style={{ border: `1px solid ${b}`, margin: '3px 0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${b}` }}>
                <span style={cell(RC.cyan, 'DEST MAC')}>DEST MAC</span>
                <span style={cell(RC.cyan, 'SRC MAC')}>SRC MAC</span>
                <span style={cell(RC.yellow, 'TYPE')}>TYPE</span>
                <span style={cell(RC.white, 'DONNÉES', true)}>DONNÉES</span>
            </div>
            <div style={{ display: 'flex' }}>
                <span style={cell(RC.white, dest)}>{dest}</span>
                <span style={cell(RC.white, src)}>{src}</span>
                <span style={cell(RC.white, type)}>{type}</span>
                <span style={{ ...cell(RC.white, data, true) }}>{data}</span>
            </div>
        </div>
    );
}

function RContinue() {
    return <div style={{ color: RC.cyan, marginTop: 2 }}>[Appuyez sur Entrée pour continuer...]</div>;
}

function ReseauTerminalAnimation() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const inView = useInView(wrapRef, { once: false, margin: '-80px' });
    const animKey = useRef(0);
    const [phase, setPhase] = useState(-1);
    const [typedStr, setTypedStr] = useState('');

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [phase]);

    useEffect(() => {
        if (!inView) return;
        const key = ++animKey.current;
        const ids: ReturnType<typeof setTimeout>[] = [];
        function at(ms: number, fn: () => void) {
            ids.push(setTimeout(() => { if (animKey.current === key) fn(); }, ms));
        }
        function run() {
            if (animKey.current !== key) return;
            setPhase(-1); setTypedStr('');
            at(50, () => setPhase(0));
            at(700, () => { setPhase(1); setTypedStr(''); });
            at(760, () => setTypedStr('5'));
            at(1500, () => setPhase(2));
            at(2700, () => setPhase(3));
            at(4100, () => setPhase(4));
            at(5500, () => setPhase(5));
            at(6700, () => setPhase(6));
            at(7900, () => setPhase(7));
            at(7900 + 5000, run);
        }
        run();
        return () => { animKey.current++; ids.forEach(clearTimeout); };
    }, [inView]);

    return (
        <div ref={wrapRef} className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-3 pb-2 pt-1.5 flex items-center gap-2 font-sans">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>Terminal</span>
                <span className="ml-auto text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.15)' }}>live demo</span>
            </div>
            <div ref={bodyRef} className="rounded-lg overflow-y-auto" style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.06)', height: '400px', padding: '14px 16px', ...RM }}>

                {/* Menu principal */}
                {phase >= 0 && (
                    <div>
                        <div style={{ color: RC.magenta }}>{'='.repeat(52)}</div>
                        <div style={{ color: RC.magenta, textAlign: 'center' }}>MENU PRINCIPAL - PACKET ADVENTURE</div>
                        <div style={{ color: RC.magenta }}>{'='.repeat(52)}</div>
                        <div style={{ marginTop: 6 }}>
                            <div style={{ color: RC.white }}>1. Comprendre l'en-tête ETHERNET II</div>
                            <div style={{ color: RC.white }}>2. Comprendre le protocole ARP</div>
                            <div style={{ color: RC.white }}>3. Comprendre le paquet IPv4</div>
                            <div style={{ color: RC.white }}>4. Comprendre ICMP</div>
                            <div style={{ color: RC.cyan }}>5. Lancer la Simulation GUIDÉE (L'Aventure)</div>
                            <div style={{ color: RC.cyan }}>6. Générer une visualisation Web (HTML)</div>
                            <div style={{ color: RC.white }}>Q. Quitter</div>
                        </div>
                    </div>
                )}

                {/* Saisie du choix */}
                {phase >= 1 && (
                    <div style={{ marginTop: 8 }}>
                        <span style={{ color: RC.white }}>Votre choix : </span>
                        <span style={{ color: RC.cyan }}>{typedStr || (phase > 1 ? '5' : '')}</span>
                        {phase === 1 && <span className="animate-pulse" style={{ color: RC.white }}>▌</span>}
                    </div>
                )}

                {/* Simulation header + contexte */}
                {phase >= 2 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="SIMULATION COMPLÈTE : Un PING de A vers B" />
                        <div style={{ color: RC.white }}>
                            Situation : <span style={{ color: RC.cyan }}>Alice (A)</span> veut pinger <span style={{ color: RC.cyan }}>Bob (B)</span>.
                        </div>
                        <div style={{ color: RC.white }}>Alice : 192.168.1.10 (AA:AA:AA:AA:AA:AA)</div>
                        <div style={{ color: RC.white }}>Bob   : 192.168.1.20 (BB:BB:BB:BB:BB:BB)</div>
                        <RContinue />
                    </div>
                )}

                {/* Step 1 — ICMP */}
                {phase >= 3 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="1. La couche Application demande un PING" />
                        <div style={{ color: RC.white }}>Alice crée un message ICMP Echo Request.</div>
                        <div style={{ color: RC.white, fontWeight: 700, marginTop: 2 }}>--- MESSAGE ICMP ---</div>
                        <div style={{ border: `1px solid ${RC.dim}`, margin: '4px 0' }}>
                            <div style={{ display: 'flex', borderBottom: `1px solid ${RC.dim}` }}>
                                <span style={{ color: RC.yellow, padding: '1px 6px', borderRight: `1px solid ${RC.dim}` }}>TYPE = 8</span>
                                <span style={{ color: RC.white, padding: '1px 6px', borderRight: `1px solid ${RC.dim}` }}>CODE = 0</span>
                                <span style={{ color: RC.white, padding: '1px 6px' }}>Checksum = 0x1234</span>
                            </div>
                            <div style={{ color: RC.white, padding: '1px 6px' }}>DONNÉES : Hello Bob!</div>
                        </div>
                        <div style={{ color: RC.white }}>→ <span style={{ fontWeight: 700 }}>ECHO REQUEST (Ping)</span></div>
                        <RContinue />
                    </div>
                )}

                {/* Step 2 — IPv4 */}
                {phase >= 4 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="2. La couche IP ajoute son en-tête" />
                        <div style={{ color: RC.white }}>Alice encapsule l'ICMP dans un paquet IPv4.</div>
                        <div style={{ color: RC.white, fontWeight: 700, marginTop: 2 }}>--- PAQUET IPv4 ---</div>
                        <div style={{ border: `1px solid ${RC.dim}`, margin: '4px 0' }}>
                            <div style={{ display: 'flex', borderBottom: `1px solid ${RC.dim}` }}>
                                <span style={{ color: RC.white, padding: '1px 6px', borderRight: `1px solid ${RC.dim}` }}>Ver=4</span>
                                <span style={{ color: RC.yellow, padding: '1px 6px', borderRight: `1px solid ${RC.dim}` }}>Proto=1 (ICMP)</span>
                                <span style={{ color: RC.cyan, padding: '1px 6px', borderRight: `1px solid ${RC.dim}` }}>SRC: 192.168.1.10</span>
                                <span style={{ color: RC.cyan, padding: '1px 6px' }}>DST: 192.168.1.20</span>
                            </div>
                        </div>
                        <div style={{ color: RC.white }}>Le paquet IP est prêt — envoi sur le réseau local.</div>
                        <RContinue />
                    </div>
                )}

                {/* Step 3 — ARP + Ethernet */}
                {phase >= 5 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="3. Problème de la couche Liaison (Ethernet)" />
                        <div style={{ color: RC.white }}>MAC Dest : ??? → <span style={{ fontWeight: 700 }}>{'>> ALERTE : ARP NÉCESSAIRE ! <<'}</span></div>
                        <div style={{ color: RC.white, fontWeight: 700, marginTop: 2 }}>--- ARP Request (broadcast) ---</div>
                        <REthTable dest="FF:FF:FF:FF:FF:FF" src="AA:AA:AA:AA:AA:AA" type="0x0806" data="ARP Request" />
                        <div style={{ color: RC.white, fontWeight: 700 }}>--- ARP Reply (Bob répond) ---</div>
                        <REthTable dest="AA:AA:AA:AA:AA:AA" src="BB:BB:BB:BB:BB:BB" type="0x0806" data="ARP Reply" />
                        <div style={{ color: RC.cyan }}>{'>> MAC de Bob (BB:BB:BB:BB:BB:BB) apprise ! <<'}</div>
                        <RContinue />
                    </div>
                )}

                {/* Step 4 — Envoi final */}
                {phase >= 6 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="4. Envoi du paquet IP (enfin !)" />
                        <div style={{ color: RC.white, fontWeight: 700 }}>--- TRAME ETHERNET II (IP + ICMP) ---</div>
                        <REthTable dest="BB:BB:BB:BB:BB:BB" src="AA:AA:AA:AA:AA:AA" type="0x0800" data="Paquet IPv4 ICMP" />
                        <div style={{ color: RC.white }}>La trame part sur le câble... <span style={{ fontStyle: 'italic' }}>Zzzzip !</span></div>
                        <RContinue />
                    </div>
                )}

                {/* Step 5 — Réception */}
                {phase >= 7 && (
                    <div style={{ marginTop: 8 }}>
                        <RSep title="5. Réception chez Bob" />
                        <div style={{ color: RC.white }}>1. Vérifie MAC Dest (BB:BB...) → OK</div>
                        <div style={{ color: RC.white }}>2. Type 0x0800 → couche IP</div>
                        <div style={{ color: RC.white }}>3. IP Dest 192.168.1.20 → c'est moi</div>
                        <div style={{ color: RC.white }}>4. Proto 1 → ICMP</div>
                        <div style={{ color: RC.white }}>5. ECHO REQUEST → réponse <span style={{ fontWeight: 700 }}>PONG !</span></div>
                        <div style={{ color: RC.white, marginTop: 6, fontStyle: 'italic' }}>
                            C'est ainsi que fonctionnent vos réseaux tous les jours.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export const ShowcaseReseau = () => (
    <section id="showcase-reseau" className="w-full min-h-screen bg-[#000000] flex items-center justify-center px-6 md:px-20 relative overflow-hidden border-t border-white/5">
        {/* Effet de lumière bleu au centre du fond noir */}
        <div
            className="pointer-events-none absolute"
            style={{
                width: '700px',
                height: '700px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0, 117, 255, 0.16) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
            }}
        />
        <ShowcaseLayout
            textLeft={false}
            textSlot={<>
                <div className="flex gap-2">
                    <OriginTag label="IUT" color="bg-[#0075FF]/20 text-[#60a5fa] border-[#0075FF]/30" />
                    <OriginTag label="Perso" color="bg-[#8B5CF6]/20 text-[#a78bfa] border-[#8B5CF6]/30" />
                </div>
                <h2 className="text-4xl md:text-6xl font-['Paris2024'] tracking-tighter text-white">visualisation réseau</h2>
                <p className="text-lg md:text-xl font-sans leading-relaxed">
                    <span className="text-white">L'encapsulation, rendue visible.</span>{' '}
                    <span className="text-zinc-400">Simulation de paquets Ethernet, IP et ICMP construits couche par couche, puis ouverts dans une visualisation interactive — la théorie réseau en action.</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">{['Python', 'HTML/CSS', 'Gemini Pro', 'Scapy'].map(s => <StackBadge key={s} label={s} />)}</div>
                <div className="flex gap-3 flex-wrap">
                    <GithubLink href="https://github.com/briacl/reseau" />
                    <a href="https://github.com/briacl/reseau/blob/main/packet_visualizer.html" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] font-mono text-[#34d399]/60 hover:text-[#34d399] transition-colors border border-[#34d399]/20 hover:border-[#34d399]/50 rounded-full px-3 py-1.5">
                        ↗ Visualiseur HTML
                    </a>
                </div>
            </>}
            cardSlot={<ReseauTerminalAnimation />}
        />
        <ScrollChevron target="showcase-lyrae" />
    </section>
);

// ─── Showcase 3 : lyrae-shared ────────────────────────────────────────────────

const LYRAE_TERMINAL = [
    'lyrae-shared/',
    '├── rules/        ← lois de nommage, architecture',
    '├── patterns/     ← extraits React, Node, Python',
    '├── prompts/      ← guides conversationnels IA',
    '├── adapters/     ← paramètres Claude, Gemini',
    '└── packages/',
    '    ├── cli/           lyrae-pull, lyrae init',
    '    └── vscode-extension/',
    '',
    '> [lyrae] Règle chargée : zéro duplication',
    '> [lyrae] Pattern actif : fullstack-nextjs.md',
    '  ✓ Extension VSCode connectée',
];


export const ShowcaseLyrae = () => (
    <section id="showcase-lyrae" className="w-full min-h-screen bg-[#000000] flex items-center justify-center px-6 md:px-20 relative overflow-hidden border-t border-white/5">
        {/* Effet de lumière bleu au centre du fond noir */}
        <div
            className="pointer-events-none absolute"
            style={{
                width: '700px',
                height: '700px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0, 117, 255, 0.16) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
            }}
        />
        <ShowcaseLayout
            textLeft={true}
            textSlot={<>
                <div className="flex gap-2"><OriginTag label="Perso" color="bg-[#8B5CF6]/20 text-[#a78bfa] border-[#8B5CF6]/30" /></div>
                <h2 className="text-4xl md:text-6xl font-['Paris2024'] tracking-tighter text-white">lyrae-shared</h2>
                <p className="text-lg md:text-xl font-sans leading-relaxed">
                    <span className="text-white">La mémoire externe de tous les projets.</span>{' '}
                    <span className="text-zinc-400">Dépôt centralisé de règles, patterns et prompts IA — partagé via extension VSCode et CLI. Ce que lyrae-shared apprend, tous les projets en héritent.</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">{['Node.js', 'VSCode API', 'Markdown', 'JSON'].map(s => <StackBadge key={s} label={s} />)}</div>
                <GithubLink href="https://github.com/briacl/lyrae-shared" />
            </>}
            cardSlot={<TerminalBlock lines={LYRAE_TERMINAL} label="Terminal" accentColor="#a78bfa" />}
        />
        <ScrollChevron target="the-ecosystem" />
    </section>
);

export const FinalCTA = () => {
    return (
        <section className="w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="space-y-12 relative z-10"
            >
                <h2 className="text-4xl md:text-6xl font-['Paris2024'] text-white uppercase tracking-widest">
                    Prêt à composer ?
                </h2>

                <div className="relative group flex items-center justify-center w-fit mx-auto">
                    {/* Halo d'émanation Nexus */}
                    <div className="absolute -inset-1 bg-blue-500/40 rounded-full blur-md opacity-20 group-hover:opacity-100 transition-opacity duration-500 will-change-[opacity,filter]"></div>

                    <motion.button
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => window.open(`${import.meta.env.BASE_URL}contact`, '_blank')}
                        className="relative px-12 py-5 rounded-full font-black text-xl border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[240px] z-10 will-change-transform uppercase tracking-widest"
                    >
                        Lancer un projet
                    </motion.button>
                </div>
            </motion.div>

            {/* Decorative background lines */}
            <div className="absolute top-1/2 left-0 w-full h-[60vh] -translate-y-1/2 pointer-events-none opacity-[0.25]">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#0075FF] to-[#f336f0]"
                    style={{
                        maskImage: `
                            linear-gradient(#000 2px, transparent 2px), 
                            linear-gradient(90deg, #000 2px, transparent 2px),
                            linear-gradient(#000 1px, transparent 1px), 
                            linear-gradient(90deg, #000 1px, transparent 1px)
                        `,
                        maskSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
                        maskPosition: '0 -50px, 0 -50px, 0 -50px, 0 -50px',
                        WebkitMaskImage: `
                            linear-gradient(#000 2px, transparent 2px), 
                            linear-gradient(90deg, #000 2px, transparent 2px),
                            linear-gradient(#000 1px, transparent 1px), 
                            linear-gradient(90deg, #000 1px, transparent 1px)
                        `,
                        WebkitMaskSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
                        WebkitMaskPosition: '0 -50px, 0 -50px, 0 -50px, 0 -50px'
                    }}
                />
            </div>
        </section>
    );
};
