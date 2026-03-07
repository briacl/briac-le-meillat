import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from './Contexts/ThemeProvider';
import { AuthProvider } from './Contexts/AuthContext';
import { ProjectProvider } from './Contexts/ProjectContext';
import { TexteProvider } from './Contexts/TexteContext';
import { WebProjectProvider } from './Contexts/WebProjectContext';
import { CookieConsentProvider } from './Contexts/CookieConsentContext';
import { CookieConsent } from './Components/CookieConsent';
import { CryptoProvider } from './Contexts/CryptoContext';

/**
 * Providers.tsx — centralise tous les providers React de l'application.
 *
 * Ordre d'imbrication (du plus externe au plus interne) :
 *  CookieConsentProvider  → gestion RGPD (indépendant de tout)
 *  ThemeProvider          → thème light/dark (indépendant)
 *  AuthProvider           → authentification JWT
 *  ProjectProvider        → données des projets DevOp
 *  WebProjectProvider     → données des projets web
 *  HeroUIProvider         → composants UI (doit être le plus interne)
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CookieConsentProvider>
            {/* La bannière cookie est rendue ici, au-dessus de tout le reste */}
            <CookieConsent />
            <ThemeProvider>
                <AuthProvider>
                    <CryptoProvider>
                        <ProjectProvider>
                            <TexteProvider>
                                <WebProjectProvider>
                                    <HeroUIProvider>
                                        {children}
                                    </HeroUIProvider>
                                </WebProjectProvider>
                            </TexteProvider>
                        </ProjectProvider>
                    </CryptoProvider>
                </AuthProvider>
            </ThemeProvider>
        </CookieConsentProvider>
    );
}
