import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { EncryptedImage } from '../Components/EncryptedImage';
import { useCrypto, useStealthData } from '../Contexts/CryptoContext';
/* ─────────────────────────────────────────────
   FONT DECLARATION (in-component style tag)
───────────────────────────────────────────── */
const fontStyles = `
  /* ── Light ── */
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Light.otf') format('opentype');
    font-weight: 300; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-LightItalic.otf') format('opentype');
    font-weight: 300; font-style: italic;
  }
  /* ── Book (400) ── */
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Book.otf') format('opentype');
    font-weight: 400; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BookItalic.otf') format('opentype');
    font-weight: 400; font-style: italic;
  }
  /* ── Demi (500) ── */
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Demi.otf') format('opentype');
    font-weight: 500; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-DemiItalic.otf') format('opentype');
    font-weight: 500; font-style: italic;
  }
  /* ── Bold (700) ── */
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Bold.otf') format('opentype');
    font-weight: 700; font-style: normal;
  }
  /* ── Small Caps (separate families for explicit use) ── */
  @font-face {
    font-family: 'NeutrafaceTextLightSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-LightSC.otf') format('opentype');
  }
  @font-face {
    font-family: 'NeutrafaceTextBookSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BookSC.otf') format('opentype');
  }
  @font-face {
    font-family: 'NeutrafaceTextDemiSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-DemiSC.otf') format('opentype');
  }
  @font-face {
    font-family: 'NeutrafaceTextBoldSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BoldSC.otf') format('opentype');
  }
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Film {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    series?: string[];
    type?: 'film' | 'serie';
    category?: string;
    director?: string;
    cast?: string;
    production?: string;
    duration?: string;
    videoLink?: string;
    createdAt?: number;
}

const EDITION_MOCKUP_ENCRYPTED_PATH = '/briac-le-meillat/encrypted_data/chunks/m_assets/asset-ems-0x9.enc';

const withBasePath = (sourcePath: string, basePath: string) =>
    sourcePath.replace('/briac-le-meillat/', basePath.endsWith('/') ? basePath : `${basePath}/`);

/* ─────────────────────────────────────────────
   FILM GRAIN CANVAS OVERLAY
───────────────────────────────────────────── */
function FilmGrain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            const { width, height } = canvas;
            const imageData = ctx.createImageData(width, height);
            const buf = new Uint32Array(imageData.data.buffer);
            for (let i = 0; i < buf.length; i++) {
                const noise = (Math.random() * 30) | 0;
                buf[i] = (18 << 24) | (noise << 16) | (noise << 8) | noise;
            }
            ctx.putImageData(imageData, 0, 0);
            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.045,
                mixBlendMode: 'screen',
                zIndex: 4,
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   PROJECTOR FLASH SWEEP
───────────────────────────────────────────── */
function ProjectorFlash({ onDone }: { onDone: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDone, 900);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <motion.div
            initial={{ x: '-120%', skewX: -15 }}
            animate={{ x: '220%', skewX: -15 }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
                position: 'absolute',
                inset: 0,
                width: '55%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 60%, transparent)',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'blur(18px)',
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   BLUR-IN WORD ANIMATION
───────────────────────────────────────────── */
interface BlurWordProps {
    text: string;
    startDelay: number;
    staggerDelay?: number;
    className?: string;
    onAllDone?: () => void;
}

function BlurWords({ text, startDelay, staggerDelay = 0.18, className = '', onAllDone }: BlurWordProps) {
    const words = text.split(' ');

    return (
        <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35em', justifyContent: 'center' }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(14px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                        delay: startDelay + i * staggerDelay,
                        duration: 0.75,
                        ease: 'easeOut',
                    }}
                    onAnimationComplete={i === words.length - 1 ? onAllDone : undefined}
                    style={{ display: 'inline-block' }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

/* ─────────────────────────────────────────────
   BÉRANGÈRE NAVBAR
───────────────────────────────────────────── */
function BerengereNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '75%',
            maxWidth: 900,
            zIndex: 100,
        }}>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 2rem',
                    borderRadius: 9999,
                    border: scrolled ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.08)',
                    background: scrolled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    transition: 'background 0.4s ease, border 0.4s ease',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                }}
            >
                {/* Brand */}
                <span style={{
                    color: '#fff',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    letterSpacing: '0.42em',
                    fontSize: '1rem',
                    fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                }}>
                    Bérangère
                </span>

                {/* Nav links */}
                <div style={{ display: 'flex', gap: '2.5rem' }}>
                    {[
                        { label: 'Accueil', href: '#hero' },
                        { label: 'Livres', href: '#livres' },
                    ].map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            onClick={e => {
                                e.preventDefault();
                                if (href === '#hero') {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            style={{
                                color: 'rgba(255,255,255,0.65)',
                                textDecoration: 'none',
                                fontSize: '0.78rem',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                transition: 'color 0.25s',
                                fontWeight: 400,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* Back to main site */}
                <Link
                    to="/"
                    style={{
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        fontSize: '0.72rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'color 0.25s',
                        fontWeight: 300,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                    ← briac-le-meillat
                </Link>
            </motion.nav>
        </div>
    );
}

/* ─────────────────────────────────────────────
   HERO SECTION — elements appear at final position
───────────────────────────────────────────── */
const TAGLINE_WORDS = 'Images que le temps retient.';

function HeroSection() {
    const [phase, setPhase] = useState<'flash' | 'tagline' | 'title' | 'done'>('flash');

    return (
        <section
            id="hero"
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                minHeight: 600,
                background: '#000',
                overflow: 'hidden',
            }}
        >
            {/* Film grain */}
            <FilmGrain />

            {/* Subtle vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
                zIndex: 3,
                pointerEvents: 'none',
            }} />

            {/* Projector flash sweep */}
            <AnimatePresence>
                {phase === 'flash' && (
                    <ProjectorFlash onDone={() => setPhase('tagline')} />
                )}
            </AnimatePresence>

            {/*
              Hero text — positioned absolutely at their final location.
              No layout shift: tagline sits at ~42% from top, title at ~50%.
            */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                /* Push content slightly above center for cinematic feel */
                paddingBottom: '8vh',
            }}>
                {/* Small Title: a Bérangère branch */}
                <motion.div
                    className="mb-2 flex items-center justify-center gap-2 drop-shadow-sm z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={(phase === 'title' || phase === 'done') ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <span style={{
                        fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontStyle: 'italic',
                        letterSpacing: '0.15em',
                        fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        a
                    </span>

                    <span style={{
                        fontFamily: "'NeutrafaceTextDemiSC', 'Montserrat', sans-serif",
                        fontStyle: 'normal',
                        fontSize: 'clamp(0.9rem, 1.7vw, 1.35rem)',
                        letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        Bérangère
                    </span>

                    <span style={{
                        fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontStyle: 'italic',
                        letterSpacing: '0.15em',
                        fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)',
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        branch
                    </span>
                </motion.div>

                {/* Main Title: Bérangère • Edition */}
                <h1 className="m-0 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 select-none drop-shadow-sm leading-tight text-center sm:text-left z-10">
                    <motion.span
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={(phase === 'title' || phase === 'done') ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        onAnimationComplete={() => {
                            if (phase === 'title') setPhase('done');
                        }}
                        style={{
                            fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                            fontWeight: 300,
                            fontStyle: 'italic',
                            letterSpacing: '0.42em',
                            marginRight: '-0.42em', // Compensate for trailing letter-spacing
                            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                            color: '#fff'
                        }}
                    >
                        Bérangère
                    </motion.span>

                    <motion.span
                        className="text-white opacity-50 font-sans"
                        initial={{ opacity: 0 }}
                        animate={phase === 'done' ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', paddingBottom: '0.1em' }}
                    >
                        •
                    </motion.span>

                    <motion.span
                        className="text-white"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={phase === 'done' ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        style={{
                            fontFamily: "'NeutrafaceTextDemiSC', 'Montserrat', sans-serif",
                            fontStyle: 'normal',
                            letterSpacing: '0.2em',
                            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)'
                        }}
                    >
                        Édition
                    </motion.span>
                </h1>

                {/* Tagline — fixed height wrapper so it doesn't push title down */}
                <div style={{ height: '2rem', display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                    {(phase === 'tagline' || phase === 'title' || phase === 'done') && (
                        <span style={{
                            fontStyle: 'italic',
                            fontWeight: 300,
                            fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.08em',
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                            gap: '0.35em',
                            justifyContent: 'center',
                        }}>
                            <BlurWords
                                text={TAGLINE_WORDS}
                                startDelay={0.1}
                                staggerDelay={0.2}
                                onAllDone={() => setPhase('title')}
                            />
                        </span>
                    )}
                </div>
            </div>

            {/* Scroll indicator */}
            <AnimatePresence>
                {phase === 'done' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0] }}
                        transition={{ delay: 1, duration: 2.5, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            bottom: '6%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            zIndex: 5,
                        }}
                    >
                        <span style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.25em',
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            fontFamily: "'NeutrafaceText', sans-serif",
                        }}>
                            Défiler
                        </span>
                        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

/* ─────────────────────────────────────────────
   SHARED: SEARCH BAR + FILTER PILLS
───────────────────────────────────────────── */
interface SearchFilterBarProps {
    search: string;
    onSearchChange: (v: string) => void;
    filters: string[];
    activeFilter: string;
    onFilterChange: (f: string) => void;
}

function SearchFilterBar({ search, onSearchChange, filters, activeFilter, onFilterChange }: SearchFilterBarProps) {
    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Search bar */}
            <div style={{
                position: 'relative',
                marginBottom: '1rem',
                maxWidth: 340,
            }}>
                <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#aaa',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                }}>
                    ⌕
                </span>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.55rem 1rem 0.55rem 2.4rem',
                        borderRadius: 9999,
                        border: '1px solid #ddd',
                        background: '#fafafa',
                        fontSize: '0.76rem',
                        letterSpacing: '0.05em',
                        color: '#333',
                        fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#555')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#ddd')}
                />
            </div>
            {/* Filter pills */}
            {filters.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {['ALL', ...filters].map(s => (
                        <button
                            key={s}
                            onClick={() => onFilterChange(s)}
                            style={{
                                padding: '0.4rem 1.1rem',
                                borderRadius: 9999,
                                border: activeFilter === s ? '1px solid #000' : '1px solid #ddd',
                                background: activeFilter === s ? '#000' : 'transparent',
                                color: activeFilter === s ? '#fff' : '#666',
                                fontSize: '0.68rem',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                                fontWeight: 400,
                            }}
                        >
                            {s === 'ALL' ? 'Tout' : s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   BOOK CARD (portrait, poster above white card)
───────────────────────────────────────────── */
function BookCard({ project }: { project: Film }) {
    const [hovered, setHovered] = useState(false);
    const basePath = import.meta.env.BASE_URL || '/';

    const imageUrl = withBasePath(EDITION_MOCKUP_ENCRYPTED_PATH, basePath);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: 'pointer',
                paddingTop: '3.4rem',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: 'center bottom',
                transition: 'transform 0.4s ease',
            }}
        >
            {/* White card */}
            <div style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: hovered
                    ? '0 16px 48px rgba(0,0,0,0.14)'
                    : '0 2px 12px rgba(0,0,0,0.07)',
                borderRadius: 16,
                padding: '0 1.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                transition: 'box-shadow 0.4s ease',
            }}>
                {/* Cover */}
                <div style={{
                    width: '74%',
                    marginTop: '-3.4rem',
                    marginBottom: '1.1rem',
                    position: 'relative',
                    background: '#fff',
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 6px 22px rgba(0,0,0,0.25)',
                    flexShrink: 0,
                }}>
                    {imageUrl && (
                        <EncryptedImage
                            src={imageUrl}
                            alt={project.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                filter: hovered ? 'brightness(0.5)' : 'brightness(1)',
                                transition: 'filter 0.4s ease',
                            }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    )}
                    {/* Hover overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.35s ease',
                        zIndex: 3,
                    }}>
                        <span style={{
                            fontSize: '0.62rem',
                            letterSpacing: '0.26em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.9)',
                            fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                            fontWeight: 400,
                            border: '1px solid rgba(255,255,255,0.5)',
                            padding: '0.45rem 1rem',
                            borderRadius: 9999,
                            backdropFilter: 'blur(4px)',
                        }}>
                            Voir le livre
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#111',
                    lineHeight: 1.35,
                    margin: '0 0 0.5rem',
                    letterSpacing: '0.01em',
                }}>
                    {project.title}
                </h3>

                {/* Synopsis */}
                <div style={{
                    fontSize: '0.75rem',
                    color: '#555',
                    lineHeight: 1.65,
                    margin: '0 0 0.85rem',
                    fontWeight: 300,
                    opacity: 1,
                }}>
                    {project.description || '\u00a0'}
                </div>

                {/* Genre */}
                {project.category && (
                    <span style={{
                        fontSize: '0.58rem',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 600,
                    }}>
                        {project.category}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   BOOKS SECTION
───────────────────────────────────────────── */
function BooksSection() {
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const basePath = import.meta.env.BASE_URL || '/';

    const films = useStealthData<Film>('vendor-b9c3.enc');

    // Last book by createdAt (highest = most recent = first in list)
    const featuredBook = useMemo(() =>
        [...films].sort((a, b) => (b.createdAt as unknown as number) - (a.createdAt as unknown as number))[0],
        [films]
    );

    const allCategories = Array.from(new Set(films.map(f => f.series?.[0]).filter(Boolean))) as string[];

    const filtered = useMemo(() => {
        let list = films;
        if (filter !== 'ALL') list = list.filter(f => f.series?.includes(filter));
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(f => f.title.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q));
        }
        return list;
    }, [films, filter, search]);

    const featuredImageUrl = withBasePath(EDITION_MOCKUP_ENCRYPTED_PATH, basePath);

    return (
        <section
            id="livres"
            style={{
                background: '#fff',
                minHeight: '100vh',
                padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 6vw, 5rem)',
                fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
            }}
        >
            {/* Section header */}
            <div style={{ marginBottom: '3rem' }}>
                <p style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#999',
                    marginBottom: '0.75rem',
                    fontWeight: 400,
                }}>
                    Catalogue
                </p>
                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 300,
                    color: '#000',
                    letterSpacing: '0.06em',
                    margin: 0,
                    lineHeight: 1.1,
                }}>
                    Livres
                </h2>
                <div style={{ width: '2.5rem', height: '1px', background: '#000', marginTop: '1.25rem' }} />
            </div>

            {/* Featured book promo */}
            {featuredBook && (
                <div style={{
                    display: 'flex',
                    gap: 'clamp(2rem, 5vw, 4rem)',
                    alignItems: 'flex-start',
                    marginBottom: '5rem',
                    padding: '2.5rem',
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
                    border: '1px solid #ebebeb',
                    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
                }}>
                    {/* Cover */}
                    <div style={{
                        flexShrink: 0,
                        width: 'clamp(260px, 34%, 420px)',
                        background: '#fff',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
                    }}>
                        {featuredImageUrl && (
                            <EncryptedImage
                                src={featuredImageUrl}
                                alt={featuredBook.title}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                        {/* «  a  Bérangère  livre  » credit line */}
                        <p style={{
                            fontFamily: "'NeutrafaceText', sans-serif",
                            fontWeight: 400,
                            fontStyle: 'italic',
                            fontSize: '0.72rem',
                            color: '#bbb',
                            letterSpacing: '0.12em',
                            marginBottom: '0.4rem',
                        }}>
                            dernier livre
                        </p>
                        {/* Title in Demi SC */}
                        <h3 style={{
                            fontFamily: "'NeutrafaceTextDemiSC', sans-serif",
                            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                            fontWeight: 'normal',
                            color: '#000',
                            letterSpacing: '0.06em',
                            lineHeight: 1.2,
                            margin: '0 0 0.35rem',
                        }}>
                            {featuredBook.title}
                        </h3>
                        {/* Genre tag in Book Italic */}
                        {featuredBook.category && (
                            <p style={{
                                fontFamily: "'NeutrafaceText', sans-serif",
                                fontWeight: 400,
                                fontStyle: 'italic',
                                fontSize: '0.8rem',
                                color: '#999',
                                letterSpacing: '0.06em',
                                marginBottom: '1.75rem',
                            }}>
                                {featuredBook.category}
                            </p>
                        )}
                        {/* Separator */}
                        <div style={{ width: '2rem', height: '1px', background: '#ddd', marginBottom: '1.5rem' }} />
                        {/* Info rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Autrice', value: featuredBook.director || 'À compléter' },
                                { label: 'Collaborateurs', value: featuredBook.cast || 'À compléter' },
                                { label: 'Édition', value: featuredBook.production || 'À compléter' },
                                { label: 'Pages', value: featuredBook.duration || 'À compléter' },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    {/* Label: Book italic, small, uppercase */}
                                    <span style={{
                                        fontFamily: "'NeutrafaceText', sans-serif",
                                        fontWeight: 400,
                                        fontStyle: 'italic',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        color: '#bbb',
                                        display: 'block',
                                        marginBottom: '0.2rem',
                                    }}>
                                        {label}
                                    </span>
                                    {/* Value: Demi SC or italic if placeholder */}
                                    <span style={{
                                        fontFamily: value === 'À compléter'
                                            ? "'NeutrafaceText', sans-serif"
                                            : "'NeutrafaceTextDemiSC', sans-serif",
                                        fontWeight: value === 'À compléter' ? 300 : 'normal',
                                        fontStyle: value === 'À compléter' ? 'italic' : 'normal',
                                        fontSize: value === 'À compléter' ? '0.78rem' : '0.88rem',
                                        color: value === 'À compléter' ? '#ccc' : '#222',
                                        letterSpacing: '0.04em',
                                    }}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {featuredBook.description && (
                            <p style={{
                                marginTop: '1.75rem',
                                fontFamily: "'NeutrafaceText', sans-serif",
                                fontSize: '0.8rem',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: '#777',
                                lineHeight: 1.75,
                                borderLeft: '2px solid #e8e8e8',
                                paddingLeft: '1rem',
                            }}>
                                {featuredBook.description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Search + filters */}
            <SearchFilterBar
                search={search}
                onSearchChange={setSearch}
                filters={allCategories}
                activeFilter={filter}
                onFilterChange={setFilter}
            />

            {/* Books grid */}
            {filtered.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'clamp(1.25rem, 2.5vw, 2rem)',
                }}>
                    <AnimatePresence>
                        {filtered.map((project, i) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: i * 0.06 } }}
                                exit={{ opacity: 0 }}
                            >
                                <BookCard project={project} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '4rem 0', letterSpacing: '0.12em' }}>
                    Aucun livre trouvé.
                </p>
            )}

            {/* Footer */}
            <div style={{
                marginTop: '6rem',
                paddingTop: '2rem',
                borderTop: '1px solid #e8e8e8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: '#bbb', textTransform: 'uppercase' }}>
                    Bérangère — Édition
                </span>
                <Link
                    to="/"
                    style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.15em',
                        color: '#999',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#000')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#999')}
                >
                    ← Retour au site principal
                </Link>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function BerangerEditionPage() {
    const { isUnlocked } = useCrypto();

    if (!isUnlocked) {
        return <div style={{ background: '#000', minHeight: '100vh', width: '100vw' }} />;
    }

    return (
        <>
            <style>{fontStyles}</style>
            <div style={{ background: '#000' }}>
                <BerengereNavbar />
                <HeroSection />
                <BooksSection />
            </div>
        </>
    );
}
