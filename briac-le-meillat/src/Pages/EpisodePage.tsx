import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import seriesData from '../data/berangere-series.json';
import VideoPlayer from '../Components/VideoPlayer';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Serie {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    videoLink?: string;
    series?: string[];
    season?: number;
    episode?: number;
    duration?: string;
    category?: string;
    createdAt?: number;
}

/* ─────────────────────────────────────────────
   FONT STYLES (same family as BerangerePage)
───────────────────────────────────────────── */
const fontStyles = `
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
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Demi.otf') format('opentype');
    font-weight: 500; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Bold.otf') format('opentype');
    font-weight: 700; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceTextDemiSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-DemiSC.otf') format('opentype');
  }
  @font-face {
    font-family: 'NeutrafaceTextBookSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BookSC.otf') format('opentype');
  }

  *, *::before, *::after { box-sizing: border-box; }

  .ep-arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.55;
    transition: opacity 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .ep-arrow-btn:hover { opacity: 1; transform: scale(1.12); }
  .ep-arrow-btn:disabled { opacity: 0.15; cursor: default; }
  .ep-arrow-btn:disabled:hover { transform: none; }

  .ep-back-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255,255,255,0.65);
    font-family: 'NeutrafaceText', sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    padding: 0;
    transition: color 0.2s;
  }
  .ep-back-btn:hover { color: rgba(255,255,255,0.95); }
`;

/* ─────────────────────────────────────────────
   ARROW SVG  — chevron style (comme France TV)
───────────────────────────────────────────── */
function ArrowLeft({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
        </svg>
    );
}
function ArrowRight({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,6 15,12 9,18" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function EpisodePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    const all = seriesData as Serie[];
    const episode = useMemo(() => all.find(s => s.id === id), [id]);

    // All episodes in the same series, sorted by season/episode
    const siblings = useMemo(() => {
        if (!episode?.series?.[0]) return [];
        return all
            .filter(s => s.series?.[0] === episode.series![0])
            .sort((a, b) => {
                if ((a.season ?? 0) !== (b.season ?? 0)) return (a.season ?? 0) - (b.season ?? 0);
                return (a.episode ?? 0) - (b.episode ?? 0);
            });
    }, [episode]);

    const currentIdx = siblings.findIndex(s => s.id === id);
    const prevEp = siblings[currentIdx - 1] ?? null;
    const nextEp = siblings[currentIdx + 1] ?? null;

    const goTo = (ep: Serie) =>
        navigate(`/berangere/serie/${ep.id}`, { replace: false });

    if (!episode) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'NeutrafaceText', sans-serif",
                color: '#555',
                letterSpacing: '0.12em',
                fontStyle: 'italic',
            }}>
                <style>{fontStyles}</style>
                Épisode introuvable.
            </div>
        );
    }

    const year = episode.createdAt
        ? new Date(episode.createdAt).getFullYear()
        : null;

    const episodeLabel = `Saison ${episode.season ?? '?'} Episode ${episode.episode ?? '?'}`;

    return (
        <div style={{
            minHeight: '100vh',
            background: isDarkMode ? '#0c0c0c' : '#f5f5f5',
            fontFamily: "'NeutrafaceText', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.4s ease',
        }}>
            <style>{fontStyles}</style>

            {/* ── TOP BAR ── */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem clamp(1.5rem, 5vw, 4rem)',
                borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
            }}>
                {/* Logo Bérangère */}
                <span style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    letterSpacing: '0.42em',
                    fontSize: '1rem',
                    fontFamily: "'NeutrafaceText', sans-serif",
                }}>
                    Bérangère
                </span>

                {/* Series name */}
                <span style={{
                    fontFamily: "'NeutrafaceTextDemiSC', sans-serif",
                    fontSize: '0.78rem',
                    color: isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                    letterSpacing: '0.1em',
                }}>
                    {episode.series?.[0]}
                </span>

                {/* Spacer */}
                <div style={{ width: 120 }} />
            </header>

            {/* ── MAIN CONTENT ── */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 0,
                minHeight: 0,
            }}>
                {/* LEFT — Video area */}
                <div style={{
                    flex: '1 1 50%',
                    background: isDarkMode ? '#000' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minHeight: 'clamp(280px, 56vw, 680px)',
                }}>
                    {/* Video Player or Thumbnail */}
                    {showPlayer ? (
                        <VideoPlayer
                            videoUrl={episode.videoLink}
                            posterUrl={episode.imageUrl}
                            title={episode.title}
                            onPlay={() => setIsDarkMode(true)}
                            isDarkMode={isDarkMode}
                        />
                    ) : (
                        // Thumbnail avec bouton play - Conteneur centré
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff',
                                padding: '2rem',
                            }}
                        >
                            {/* Vignette réduite avec bords arrondis */}
                            <div
                                onClick={() => {
                                    setShowPlayer(true);
                                    setIsDarkMode(true);
                                }}
                                style={{
                                    width: '90%',
                                    maxWidth: '800px',
                                    aspectRatio: '16/9',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
                                }}
                            >
                                {/* Image de fond */}
                                {episode.imageUrl && (
                                    <img
                                        src={episode.imageUrl}
                                        alt={episode.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        }}
                                    />
                                )}
                                
                                {/* Overlay sombre au hover */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0,0,0,0.3)',
                                        transition: 'background 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                                />
                            
                                {/* Bouton Play */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 2,
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.95)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.3s ease, background 0.3s ease',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                                    }}
                                >
                                {/* Icône Play */}
                                <svg 
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 24 24" 
                                    fill="none"
                                    style={{ marginLeft: '4px' }}
                                >
                                    <path 
                                        d="M8 5v14l11-7z" 
                                        fill="#000"
                                    />
                                </svg>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Episode nav bar at bottom of video */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.85rem clamp(1rem, 3vw, 2rem)',
                        borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
                        background: isDarkMode ? '#0a0a0a' : '#fafafa',
                    }}>
                        {/* Left: Back button */}
                        <button 
                            className="ep-back-btn" 
                            onClick={() => navigate('/berangere#series')}
                            style={{ color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}
                        >
                            <ArrowLeft size={14} />
                            Retour
                        </button>

                        {/* Right: Episode navigation */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                className="ep-arrow-btn"
                                onClick={() => prevEp && goTo(prevEp)}
                                disabled={!prevEp}
                                title={prevEp ? prevEp.title : ''}
                                style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <span style={{
                                fontFamily: "'NeutrafaceTextDemiSC', sans-serif",
                                fontSize: '0.82rem',
                                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                                letterSpacing: '0.08em',
                                userSelect: 'none',
                            }}>
                                {episodeLabel}
                            </span>

                            <button
                                className="ep-arrow-btn"
                                onClick={() => nextEp && goTo(nextEp)}
                                disabled={!nextEp}
                                title={nextEp ? nextEp.title : ''}
                                style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Episode info */}
                <div style={{
                    width: 'clamp(320px, 50%, 600px)',
                    flexShrink: 0,
                    padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
                    background: isDarkMode ? '#111' : '#fff',
                    borderLeft: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                }}>
                    {/* Series title */}
                    <p style={{
                        fontFamily: "'NeutrafaceText', sans-serif",
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '0.9rem',
                        color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                        letterSpacing: '0.05em',
                        marginBottom: '0.6rem',
                        margin: 0,
                    }}>
                        {episode.series?.[0]}
                    </p>

                    {/* Episode navigation: arrow S3E1 arrow */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        marginTop: '0.6rem',
                        marginBottom: '0.5rem',
                    }}>
                        <button
                            className="ep-arrow-btn"
                            onClick={() => prevEp && goTo(prevEp)}
                            disabled={!prevEp}
                            style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <span style={{
                            fontFamily: "'NeutrafaceText', sans-serif",
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: isDarkMode ? '#fff' : '#000',
                            letterSpacing: '0.02em',
                        }}>
                            {episodeLabel}
                        </span>

                        <button
                            className="ep-arrow-btn"
                            onClick={() => nextEp && goTo(nextEp)}
                            disabled={!nextEp}
                            style={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Episode title with dot prefix */}
                    <h1 style={{
                        fontFamily: "'NeutrafaceText', sans-serif",
                        fontWeight: 700,
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                        color: isDarkMode ? '#fff' : '#000',
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                        margin: 0,
                        marginBottom: '0.8rem',
                    }}>
                        <span style={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                            fontSize: '2.5em', 
                            lineHeight: '0',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            transform: 'translateY(-0.05em)',
                            marginRight: '0.15em'
                        }}>·</span>
                        {episode.title}
                    </h1>

                    {/* Metadata line: Bérangère | category · year · Vidéo · duration · Français */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.4rem 0.6rem',
                        marginTop: '0.2rem',
                        marginBottom: '1.8rem',
                        paddingBottom: '1.8rem',
                        borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
                    }}>
                        {/* Bérangère */}
                        <span style={{
                            fontFamily: "'NeutrafaceText', sans-serif",
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                            letterSpacing: '0.04em',
                        }}>
                            Bérangère
                        </span>

                        <span style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: '0.9rem', margin: '0 0.5em' }}>|</span>

                        {/* Category */}
                        {episode.category && (
                            <>
                                <span style={{
                                    fontFamily: "'NeutrafaceText', sans-serif",
                                    fontWeight: 400,
                                    fontSize: '0.9rem',
                                    color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                                    letterSpacing: '0.04em',
                                }}>
                                    Séries {episode.category}
                                </span>
                                <span style={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                                    fontSize: '2.2em', 
                                    lineHeight: '0',
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    transform: 'translateY(-0.08em)',
                                    margin: '0 0.2em'
                                }}>·</span>
                            </>
                        )}

                        {/* Year */}
                        {year && (
                            <>
                                <span style={{
                                    fontFamily: "'NeutrafaceText', sans-serif",
                                    fontWeight: 400,
                                    fontSize: '0.9rem',
                                    color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                                    letterSpacing: '0.04em',
                                }}>
                                    {year}
                                </span>
                                <span style={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                                    fontSize: '2.2em', 
                                    lineHeight: '0',
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    transform: 'translateY(-0.08em)',
                                    margin: '0 0.2em'
                                }}>·</span>
                            </>
                        )}

                        {/* Vidéo */}
                        <span style={{
                            fontFamily: "'NeutrafaceText', sans-serif",
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                            letterSpacing: '0.04em',
                        }}>
                            Vidéo
                        </span>

                        {/* Duration */}
                        {episode.duration && (
                            <>
                                <span style={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                                    fontSize: '2.2em', 
                                    lineHeight: '0',
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    transform: 'translateY(-0.08em)',
                                    margin: '0 0.2em'
                                }}>·</span>
                                <span style={{
                                    fontFamily: "'NeutrafaceText', sans-serif",
                                    fontWeight: 400,
                                    fontSize: '0.9rem',
                                    color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                                    letterSpacing: '0.04em',
                                }}>
                                    {episode.duration}
                                </span>
                            </>
                        )}

                        {/* Français */}
                        <span style={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                            fontSize: '2.2em', 
                            lineHeight: '0',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            transform: 'translateY(-0.08em)',
                            margin: '0 0.2em'
                        }}>·</span>
                        <span style={{
                            fontFamily: "'NeutrafaceText', sans-serif",
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                            letterSpacing: '0.04em',
                        }}>
                            Français
                        </span>
                    </div>

                    {/* Synopsis */}
                    {episode.description && (
                        <div>
                            <p style={{
                                fontFamily: "'NeutrafaceText', sans-serif",
                                fontWeight: 400,
                                fontStyle: 'italic',
                                fontSize: '0.72rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                marginBottom: '0.6rem',
                            }}>
                                Synopsis
                            </p>
                            <p style={{
                                fontFamily: "'NeutrafaceText', sans-serif",
                                fontWeight: 300,
                                fontStyle: 'italic',
                                fontSize: '0.95rem',
                                color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                                lineHeight: 1.8,
                            }}>
                                {episode.description}
                            </p>
                        </div>
                    )}

                    {/* Separator */}
                    <div style={{
                        marginTop: '2.5rem',
                        marginBottom: '1.5rem',
                        height: '1px',
                        background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    }} />

                    {/* Other episodes in same series */}
                    {siblings.length > 1 && (
                        <div>
                            <p style={{
                                fontFamily: "'NeutrafaceText', sans-serif",
                                fontWeight: 400,
                                fontStyle: 'italic',
                                fontSize: '0.72rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                marginBottom: '1rem',
                            }}>
                                Autres épisodes
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {siblings.map(ep => (
                                    <button
                                        key={ep.id}
                                        onClick={() => goTo(ep)}
                                        style={{
                                            background: ep.id === id ? (isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)') : 'none',
                                            border: ep.id === id ? (isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)') : '1px solid transparent',
                                            borderRadius: 8,
                                            padding: '0.7rem 0.9rem',
                                            cursor: ep.id === id ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.85rem',
                                            textAlign: 'left',
                                            transition: 'background 0.15s, border-color 0.15s',
                                        }}
                                        onMouseEnter={e => {
                                            if (ep.id !== id) (e.currentTarget as HTMLButtonElement).style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
                                        }}
                                        onMouseLeave={e => {
                                            if (ep.id !== id) (e.currentTarget as HTMLButtonElement).style.background = 'none';
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        {ep.imageUrl && (
                                            <div style={{
                                                width: 64,
                                                aspectRatio: '16/9',
                                                borderRadius: 5,
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                                background: '#000',
                                            }}>
                                                <img
                                                    src={ep.imageUrl}
                                                    alt={ep.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: ep.id === id ? 1 : 0.7 }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <span style={{
                                                fontFamily: "'NeutrafaceText', sans-serif",
                                                fontWeight: 400,
                                                fontStyle: 'italic',
                                                fontSize: '0.7rem',
                                                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                                letterSpacing: '0.1em',
                                                display: 'block',
                                                marginBottom: '0.2rem',
                                            }}>
                                                S{ep.season} E{ep.episode}
                                            </span>
                                            <span style={{
                                                fontFamily: "'NeutrafaceTextDemiSC', sans-serif",
                                                fontSize: '0.82rem',
                                                color: ep.id === id ? (isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)') : (isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'),
                                                letterSpacing: '0.05em',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {ep.title}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
