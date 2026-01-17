import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-3/4 bg-white/5 backdrop-blur-[10px] rounded-full px-8 py-4 flex items-center justify-between z-50 border border-white/10 shadow-xl shadow-blue-900/5">
            {/* Left: Title */}
            <Link to="/" className="font-['Monad'] text-2xl bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent tracking-widest drop-shadow-sm transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">
                Synapseo
            </Link>

            {/* Center: Links */}
            <div className="flex gap-8 font-['Paris2024'] text-[#0055ff]/80 uppercase tracking-wider text-sm font-semibold">
                <Link to="/" className="hover:text-[#0055ff] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">accueil</Link>
                <Link to="/vision" className="hover:text-[#0055ff] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">vision</Link>
                <Link to="/fonctionnalites" className="hover:text-[#0055ff] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">fonctionnalités</Link>
                <Link to="/tarifs" className="hover:text-[#0055ff] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">tarifs</Link>
                <Link to="/contact" className="hover:text-[#0055ff] transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(0,85,255,0.8)] hover:scale-105">contact</Link>
            </div>

            {/* Right: Buttons */}
            <div className="flex gap-4 font-['Paris2024'] items-center">
                <Link to="/custom-login" className="text-[#0055ff] hover:text-[#0044cc] transition-colors uppercase tracking-wider text-sm font-bold">
                    Log in
                </Link>
                <Link to="/subscribe" className="bg-[#0055ff] border border-[#0055ff] text-white px-6 py-2 rounded-full hover:bg-[#0044cc] hover:border-[#0044cc] transition-all uppercase tracking-wider text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                    Subscribe
                </Link>
            </div>
        </nav>
    );
}
