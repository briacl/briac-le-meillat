import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatWidget } from '@/Contexts/ChatContext';

/**
 * Navbar - Nexus Styled Floating Navbar
 * Implementation strictly following NexusLayout.jsx from Referentiel.
 */
export default function Navbar() {
    const location = useLocation();
    const { setIsOpen: openChat } = useChatWidget();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[90%] h-16 bg-white/70 backdrop-blur-md rounded-full px-8 flex items-center justify-between z-[100] border border-blue-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-500">

            {/* Left: Branding (Custom Text Logo mimicking Hero Style) */}
            <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap">
                <span
                    className="text-black"
                    style={{
                        fontFamily: "'NeutrafaceText', 'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontStyle: 'italic',
                        letterSpacing: '0.2em',
                        fontSize: '1rem'
                    }}
                >
                    Bérangère
                </span>
                <span className="text-black/30 mx-1">•</span>
                <span
                    className="font-['Paris2024'] uppercase bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent"
                    style={{
                        fontSize: '1rem',
                        letterSpacing: '0.15em'
                    }}
                >
                    Development
                </span>
            </Link>

            {/* Center: Links (Desktop) - Nexus Layout Style */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[13px] font-semibold text-gray-500">
                <a 
                    href="#student-showcase" 
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('student-showcase')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            window.location.href = import.meta.env.BASE_URL + '#student-showcase';
                        }
                    }}
                    className="hover:text-gray-900 transition-colors"
                >
                    Me
                </a>
                <Link 
                    to="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    Blog
                </Link>
                <Link 
                    to="/scripts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    Scripts
                </Link>
                <Link 
                    to="/web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    Web
                </Link>
                <Link 
                    to="/net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    Net
                </Link>
                <Link 
                    to="/thinking-about-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    AI
                </Link>
                <Link 
                    to="/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                >
                    Contact
                </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 text-gray-400 relative">
                <button
                    onClick={() => openChat(true)}
                    className="hidden md:flex items-center gap-2 text-[#0071e3] font-bold text-sm h-10 px-4 hover:opacity-70 transition-opacity"
                >
                    <Sparkles size={15} />
                    AI Assistance
                </button>

                {/* Mobile Menu Trigger */}
                <button
                    className="md:hidden flex flex-col items-center justify-center gap-1.5 w-8 h-8 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <motion.div
                        animate={isMenuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                        className="w-5 h-[1.5px] bg-gray-900 rounded-full"
                    />
                    <motion.div
                        animate={isMenuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                        className="w-5 h-[1.5px] bg-gray-900 rounded-full"
                    />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-100 p-8 flex flex-col gap-6 md:hidden z-[110]"
                    >
                        <a 
                            href="#student-showcase" 
                            onClick={(e) => {
                                setIsMenuOpen(false);
                                if (location.pathname === '/') {
                                    e.preventDefault();
                                    document.getElementById('student-showcase')?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = import.meta.env.BASE_URL + '#student-showcase';
                                }
                            }} 
                            className="text-2xl font-bold text-gray-900"
                        >
                            Me
                        </a>
                        <Link 
                            to="/blog"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Blog
                        </Link>
                        <Link 
                            to="/scripts"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Scripts
                        </Link>
                        <Link 
                            to="/web"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Web
                        </Link>
                        <Link 
                            to="/net"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Net
                        </Link>
                        <Link 
                            to="/thinking-about-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            AI
                        </Link>
                        <Link 
                            to="/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Contact
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
