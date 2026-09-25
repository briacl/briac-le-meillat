import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Award } from 'lucide-react';

const projectImages = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp,gif}', { query: '?url', eager: true });

function resolveImageUrl(rawPath: string): string {
    const parts = rawPath.split('/');
    const filename = parts[parts.length - 1];
    const matchingKey = Object.keys(projectImages).find(k => k.endsWith(`/${filename}`));
    if (matchingKey) {
        const imgModule = (projectImages as any)[matchingKey];
        return typeof imgModule === 'string' ? imgModule : imgModule.default;
    }
    return rawPath;
}

const CERTIFICATIONS = [
    {
        title: 'Python Essential 1',
        image: resolveImageUrl('/assets/certifications/certification-python-essential-1-from-cisco.png'),
        issuer: 'Cisco Networking Academy',
    },
    {
        title: 'Python Essential 2',
        image: resolveImageUrl('/assets/certifications/certification-python-essential-2-from-cisco.png'),
        issuer: 'Cisco Networking Academy',
    },
    {
        title: 'CCNA SRWE',
        image: resolveImageUrl('/assets/certifications/certification-ccna-srwe-from-cisco.png'),
        issuer: 'Cisco Networking Academy',
    },
];

const APPLE_BEZIER: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

function TiltCard({ cert }: { cert: typeof CERTIFICATIONS[0] }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="flex flex-col gap-4 items-center perspective-1000" style={{ perspective: "1000px" }}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/20 bg-white/5"
            >
                {/* Image */}
                <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRmNGY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiNhMWExYWEiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF1Y3VuZSBpbWFnZTwvdGV4dD48L3N2Zz4='; // Fallback
                    }}
                />

                {/* Glare effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
                        mixBlendMode: "overlay",
                        opacity: 0.6,
                        left: glareX,
                        top: glareY,
                        width: "200%",
                        height: "200%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </motion.div>
            
            <div className="text-center">
                <h3 className="font-['Paris2024'] text-xl text-zinc-900">{cert.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 mt-1">{cert.issuer}</p>
            </div>
        </div>
    );
}

export default function CertificationCards() {
    return (
        <section className="w-full bg-white flex flex-col items-center justify-center py-24 px-6 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 1, ease: APPLE_BEZIER }}
                className="flex flex-col items-center gap-16 w-full max-w-6xl"
            >
                <div className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                        <Award size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-normal tracking-tighter leading-none font-['Paris2024']">
                        <span className="text-zinc-900">
                            Certifications
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full perspective-1000">
                    {CERTIFICATIONS.map((cert, index) => (
                        <motion.div
                            key={cert.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 * index, duration: 0.8, ease: APPLE_BEZIER }}
                        >
                            <TiltCard cert={cert} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
