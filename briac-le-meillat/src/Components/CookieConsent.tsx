import React from 'react';
import { useCookieConsent } from '../Contexts/CookieConsentContext';

/**
 * Bannière RGPD — s'affiche au premier arivée si aucun choix n'a été fait.
 * Non-dismissable : l'utilisateur doit faire un choix pour continuer.
 */
export const CookieConsent: React.FC = () => {
    const { cookieConsent, acceptCookies, rejectCookies } = useCookieConsent();

    // Le banner est visible uniquement en état "pending"
    if (cookieConsent !== 'pending') return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Consentement aux cookies"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
            }}
        >
            {/* Backdrop semi-transparent */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Panneau principal */}
            <div
                style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(15,15,30,0.97) 0%, rgba(25,25,50,0.97) 100%)',
                    borderTop: '1px solid rgba(139,92,246,0.35)',
                    padding: '1.75rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* Icône cookie */}
                    <span style={{ fontSize: '1.75rem', flexShrink: 0, marginTop: '0.1rem' }}>🍪</span>

                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            margin: '0 0 0.5rem',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: '#e2e8f0',
                            letterSpacing: '0.01em',
                        }}>
                            Ce site utilise des cookies
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#94a3b8',
                            lineHeight: 1.6,
                            maxWidth: '720px',
                        }}>
                            Nous utilisons des cookies essentiels pour le bon fonctionnement du site, ainsi que
                            des cookies optionnels pour améliorer votre expérience. Vous pouvez les accepter
                            tous ou vous y opposer. Votre choix sera mémorisé.
                            {' '}
                            <a
                                href="#"
                                style={{ color: '#a78bfa', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                En savoir plus
                            </a>
                        </p>
                    </div>
                </div>

                {/* Boutons */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={rejectCookies}
                        style={{
                            padding: '0.55rem 1.4rem',
                            borderRadius: '9999px',
                            border: '1px solid rgba(139,92,246,0.4)',
                            background: 'transparent',
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            (e.target as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.7)';
                            (e.target as HTMLButtonElement).style.color = '#e2e8f0';
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLButtonElement).style.borderColor = 'rgba(139,92,246,0.4)';
                            (e.target as HTMLButtonElement).style.color = '#94a3b8';
                        }}
                    >
                        Refuser
                    </button>
                    <button
                        onClick={acceptCookies}
                        style={{
                            padding: '0.55rem 1.6rem',
                            borderRadius: '9999px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            (e.target as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(139,92,246,0.65)';
                            (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(139,92,246,0.4)';
                            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                        }}
                    >
                        Accepter tout
                    </button>
                </div>
            </div>
        </div>
    );
};
