import { motion } from 'framer-motion';
import projects from '@/data/projects.json';

const lastPerso = [...projects].reverse().find(p => p.origin.includes('perso'))!;

const LastProjectSpotlight = () => {
    return (
        <section id="last-project-spotlight" className="w-full bg-white flex flex-col items-center justify-center py-32 px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex flex-col items-center gap-6 w-full max-w-4xl"
            >
                {/* <p className="text-xs tracking-[0.4em] text-black/30 uppercase font-['Baskerville']">
                    Dernier projet
                </p> */}

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter leading-none font-['Paris2024'] text-center">
                    <span className="bg-gradient-to-br from-[#0075FF] to-[#f336f0] bg-clip-text text-transparent select-none">
                        {lastPerso.title}
                    </span>
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, margin: '-15% 0px -15% 0px' }}
                    transition={{ delay: 0.3, duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="w-full mt-6 cursor-pointer rounded-[5%] transition-all duration-500 hover:scale-[1.015] border border-slate-100/80"
                    style={{
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
                    }}
                    onClick={() => window.open('https://briacl.github.io/notgoogle/', '_blank', 'noopener')}
                >
                    <img
                        src={lastPerso.imageUrl}
                        alt={lastPerso.title}
                        className="w-full object-cover rounded-[5%]"
                    />
                </motion.div>

            </motion.div>
        </section>
    );
};

export default LastProjectSpotlight;
