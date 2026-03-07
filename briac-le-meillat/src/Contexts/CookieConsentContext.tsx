import {
    createContext,
    useContext,
    useState,
    useEffect,
    FC,
    ReactNode,
} from 'react';

export type CookieConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentContextType {
    cookieConsent: CookieConsentStatus;
    acceptCookies: () => void;
    rejectCookies: () => void;
    resetCookieConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = 'cookie-consent-status';

export const CookieConsentProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cookieConsent, setCookieConsent] = useState<CookieConsentStatus>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
            if (saved === 'accepted' || saved === 'rejected') {
                return saved as CookieConsentStatus;
            }
        }
        return 'pending';
    });

    const acceptCookies = () => {
        setCookieConsent('accepted');
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        // Ici : activer scripts analytics, tracking, etc.
    };

    const rejectCookies = () => {
        setCookieConsent('rejected');
        localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
        // Ici : désactiver tout script non-essentiel
    };

    const resetCookieConsent = () => {
        setCookieConsent('pending');
        localStorage.removeItem(COOKIE_CONSENT_KEY);
    };

    return (
        <CookieConsentContext.Provider value={{ cookieConsent, acceptCookies, rejectCookies, resetCookieConsent }}>
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
};
