import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useAuth } from '@/Contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const neutrafaceFontStyles = `
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-LightItalic.otf') format('opentype');
    font-weight: 300; font-style: italic;
  }
`;

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-3/4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full px-8 py-4 flex items-center justify-between z-50 border border-black/5 dark:border-white/20 shadow-xl shadow-blue-900/10 transition-colors duration-300" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <style dangerouslySetInnerHTML={{ __html: neutrafaceFontStyles }} />
            {/* Left: Title */}
            <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="drop-shadow-sm transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] hover:scale-105 normal-case"
                style={{
                    color: theme === 'dark' ? '#fff' : '#111',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    letterSpacing: '0.42em',
                    fontSize: '1rem',
                    fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif"
                }}
            >
                Bérangère
            </Link>

            {/* Center: Links */}
            <div className="flex gap-8 font-['Paris2024'] text-skin-text-main uppercase tracking-wider text-sm font-sm">
                <Link to="/" className="text-skin-text-main hover:text-skin-text-main transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">accueil</Link>
                <Link to="/vision" className="text-skin-text-main hover:text-skin-text-main transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">vision</Link>
                <Link to="/recherches" className="text-skin-text-main hover:text-skin-text-main transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">recherches</Link>
                <Link to="/cv" className="text-skin-text-main hover:text-skin-text-main transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">cv</Link>
                <Link to="/contact" className="text-skin-text-main hover:text-skin-text-main transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">contact</Link>
            </div>

            {/* Right: Buttons */}
            <div className="flex gap-4 font-['Paris2024'] items-center">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    {theme === 'dark' ? (
                        <svg className="w-5 h-5 text-[#00f2ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-[#0055ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                {isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-2 text-sm text-skin-text-main font-['Paris2024'] uppercase tracking-wider">
                            <User className="w-4 h-4 text-[#00f2ff]" />
                            <span className="hidden md:inline max-w-[120px] truncate">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[#0055ff] hover:text-red-400 transition-colors uppercase tracking-wider text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Déconnexion</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            state={{ from: location }}
                            className="text-[#0055ff] hover:text-[#0044cc] transition-colors uppercase tracking-wider text-sm font-['Paris2024']"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/login?mode=signup"
                            state={{ from: location }}
                            className="bg-[#0055ff] border border-[#0055ff] text-white px-6 py-2 rounded-full hover:bg-[#0044cc] hover:border-[#0044cc] transition-all uppercase tracking-wider text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 font-['Paris2024']"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
