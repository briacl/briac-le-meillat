import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useProjects, Project } from '@/Contexts/ProjectContext';
import { motion } from 'framer-motion';



// ... (existing constants or code if any need to be preserved, but in this replacement block we are replacing snippets)

// NODE DEFINITIONS
const MAJOR_NODES = [
    {
        id: "dev-web",
        text: "DÉVELOPPEMENT WEB",
        description: "Passionné par la création d'expériences utilisateurs fluides et interactives, je maîtrise l'écosystème moderne (React, TypeScript, Node.js) pour concevoir des applications web performantes et esthétiques."
    },
    {
        id: "reseaux",
        text: "RÉSEAUX INFORMATIQUES",
        description: "Les réseaux constituent le cœur de ma formation. J’y développe une compréhension approfondie des protocoles, de l’adressage IPv4, des outils de diagnostic comme le ping, ainsi que des principes fondamentaux de communication entre machines."
    },
    {
        id: "ia",
        text: "INTELLIGENCE ARTIFICIELLE",
        description: "L’intelligence artificielle est un domaine qui me passionne par sa capacité à transformer des données en décisions intelligentes. Je m’intéresse particulièrement au machine learning, au deep learning et aux LLM, avec une approche orientée compréhension des modèles, expérimentation et applications concrètes."
    },
    {
        id: "telecom",
        text: "TÉLÉCOMMUNICATIONS",
        description: "Les télécommunications relient le monde. Je m'intéresse aux fondamentaux du traitement du signal, aux réseaux mobiles (4G/5G) et aux technologies de transmission moderne."
    },
    {
        id: "programmation",
        text: "PROGRAMMATION",
        description: "La programmation, notamment en Python, est pour moi un outil essentiel pour automatiser, analyser et concevoir des solutions efficaces. J’accorde une grande importance à la clarté du code, à la logique et à la résolution de problèmes."
    }
];

const MINOR_NODES = [
    // Dev Web
    { text: "React", target: "dev-web" },
    { text: "TypeScript", target: "dev-web" },
    { text: "Node.js", target: "dev-web" },
    { text: "Tailwind", target: "dev-web" },

    // Réseaux
    { text: "Cisco", target: "reseaux" },
    { text: "TCP/IP", target: "reseaux" },
    { text: "VLAN", target: "reseaux" },
    { text: "Cybersecurité", target: "reseaux" },

    // IA
    { text: "Python", target: "ia" },
    { text: "PyTorch", target: "ia" },
    { text: "Machine Learning", target: "ia" },
    { text: "Data Science", target: "ia" },

    // Telecom
    { text: "5G/4G", target: "telecom" },
    { text: "Signal Processing", target: "telecom" },
    { text: "VoIP", target: "telecom" },
    { text: "Optical Fiber", target: "telecom" }
];

export default function NeuralNetworkBackground({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
    const { theme } = useTheme();
    const { getProjectsByDomain, projects } = useProjects();

    // Camera state
    const cameraRef = useRef({ x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 });
    const selectedNodeRef = useRef<string | null>(null);

    // Lock body scroll when a node is selected
    useEffect(() => {
        if (selectedNode) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedNode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const styles = getComputedStyle(document.documentElement);
        const nodeColor = styles.getPropertyValue('--node-color').trim();
        const linkColorRaw = "255, 255, 255"; // Simplified for now, or fetch from CSS

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        // Ensure camera is initialized
        if (cameraRef.current.targetZoom === 1) {
            cameraRef.current.targetX = width / 2;
            cameraRef.current.targetY = height / 2;
            cameraRef.current.x = width / 2;
            cameraRef.current.y = height / 2;
        }

        // --- PARTICLE CLASS ---
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            label: string | null;
            category: 'major' | 'minor' | 'background';
            targetId: string | null;
            partners: Particle[]; // To track specific connections if needed, for now used for visual

            // For Major nodes, we might want stable positions or just stronger presence
            // For now, let's keep them floating but slowly.

            constructor(type: 'major' | 'minor' | 'background', labelData: any = null) {
                this.category = type;
                this.partners = [];

                // Position initialization
                this.x = Math.random() * width;
                this.y = Math.random() * height;

                // Velocity
                const speedMulti = type === 'major' ? 0.2 : (type === 'minor' ? 0.4 : 0.6);
                this.vx = (Math.random() - 0.5) * speedMulti;
                this.vy = (Math.random() - 0.5) * speedMulti;

                // Props based on type
                if (type === 'major') {
                    this.size = 6 + Math.random() * 2;
                    this.label = labelData.text;
                    this.targetId = labelData.id; // Using ID as targetId for minor nodes to find me
                } else if (type === 'minor') {
                    this.size = 3.5 + Math.random() * 1.5;
                    this.label = labelData.text;
                    this.targetId = labelData.target; // ID of the major node I follow
                } else {
                    this.size = 1 + Math.random() * 2;
                    this.label = null;
                    this.targetId = null;
                }
            }

            update(particles: Particle[]) {
                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // ATTRACTION LOGIC FOR MINOR NODES
                if (this.category === 'minor' && this.targetId) {
                    // Find my Major node
                    const major = particles.find(p => p.category === 'major' && p.targetId === this.targetId);
                    if (major) {
                        const dx = major.x - this.x;
                        const dy = major.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Attraction range
                        const maxDist = 300;
                        if (dist > 100 && dist < maxDist) {
                            // Gently nudge towards major if too far, but keep some distance (orbit)
                            this.vx += dx * 0.00005;
                            this.vy += dy * 0.00005;
                        }
                    }
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                // Color & Opacity
                if (this.category === 'major') {
                    ctx.fillStyle = nodeColor || '#0055ff';
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = nodeColor || '#0055ff';
                } else if (this.category === 'minor') {
                    ctx.fillStyle = nodeColor || '#00aaff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = nodeColor || '#00aaff';
                } else {
                    ctx.fillStyle = `rgba(100, 150, 255, 0.5)`;
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset

                // Label
                if (this.label) {
                    ctx.font = this.category === 'major'
                        ? "20px 'Paris2024'"
                        : "400 10px 'Montserrat Alternates'";

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    if (this.category === 'major') {
                        // Original Gradient Style for Major Nodes
                        const metrics = ctx.measureText(this.label);
                        const textWidth = metrics.width;
                        const textHeight = 14;
                        const gradient = ctx.createLinearGradient(
                            this.x - textWidth / 2,
                            this.y - 15 - textHeight / 2,
                            this.x + textWidth / 2,
                            this.y - 15 + textHeight / 2
                        );
                        gradient.addColorStop(0, '#00f2ff');
                        gradient.addColorStop(1, '#0055ff');

                        ctx.fillStyle = gradient;
                        // Optional: Add a subtle shadow for better readability against particles
                        ctx.shadowColor = "rgba(0,0,0,0.5)";
                        ctx.shadowBlur = 4;
                        ctx.fillText(this.label, this.x, this.y - 15);
                        ctx.shadowBlur = 0; // Reset
                    } else {
                        // Minor nodes style
                        const metrics = ctx.measureText(this.label);
                        const pad = 4;

                        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                        ctx.fillText(this.label, this.x, this.y - 10);
                    }
                }
            }
        }

        let particles: Particle[] = [];
        let animationFrameId: number;

        const init = () => {
            particles = [];

            // Spawn Major Nodes
            MAJOR_NODES.forEach(data => {
                particles.push(new Particle('major', data));
            });

            // Spawn Minor Nodes
            MINOR_NODES.forEach(data => {
                particles.push(new Particle('minor', data));
            });

            // Spawn Background Particles
            for (let i = 0; i < 40; i++) {
                particles.push(new Particle('background'));
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Connection Rules
                    let maxDist = 150;
                    let opacity = 0;

                    // 1. Minor to its Target Major
                    if (p1.category === 'minor' && p2.category === 'major' && p1.targetId === p2.targetId) {
                        maxDist = 300; // Strong long-distance link
                        if (dist < maxDist) {
                            opacity = 1 - dist / maxDist;
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(${linkColorRaw}, ${opacity * 0.6})`;
                            ctx.lineWidth = 1.5;
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                            continue; // Drawn specific link
                        }
                    }
                    // Reverse check
                    if (p2.category === 'minor' && p1.category === 'major' && p2.targetId === p1.targetId) {
                        maxDist = 300;
                        if (dist < maxDist) {
                            opacity = 1 - dist / maxDist;
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(${linkColorRaw}, ${opacity * 0.6})`;
                            ctx.lineWidth = 1.5;
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                            continue;
                        }
                    }

                    // 2. Standard proximity connections (Background to Background, or any nearby)
                    if (dist < maxDist) {
                        opacity = 1 - dist / maxDist;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${linkColorRaw}, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        };


        const updateCamera = () => {
            // Smoothly interpolate camera properties
            const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
            cameraRef.current.x = lerp(cameraRef.current.x, cameraRef.current.targetX, 0.1);
            cameraRef.current.y = lerp(cameraRef.current.y, cameraRef.current.targetY, 0.1);
            cameraRef.current.zoom = lerp(cameraRef.current.zoom, cameraRef.current.targetZoom, 0.1);
        };

        const animate = () => {
            if (!ctx) return;

            // Update target if node is selected (TRACKING)
            // Use ref value to check which one is selected
            const currentSelection = selectedNodeRef.current;
            if (currentSelection) {
                const targetParticle = particles.find(p => p.label === currentSelection);
                if (targetParticle) {
                    cameraRef.current.targetX = targetParticle.x;
                    cameraRef.current.targetY = targetParticle.y;
                }
            }

            updateCamera();

            ctx.clearRect(0, 0, width, height);

            ctx.save();
            // Apply camera transform: 
            // Translate to center, scale, then translate back relative to camera position
            // We want (camera.x, camera.y) to be at the center of the screen (width/2, height/2)
            ctx.translate(width / 2, height / 2);
            ctx.scale(cameraRef.current.zoom, cameraRef.current.zoom);
            ctx.translate(-cameraRef.current.x, -cameraRef.current.y);


            particles.forEach(particle => {
                particle.update(particles);
                particle.draw(ctx);
            });

            connectParticles();

            ctx.restore();

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();

        // Click handler
        const handleCanvasClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Mouse position relative to canvas (screen space)
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Convert mouse position to world space
            // screenX = (worldX - camX) * zoom + width/2
            // worldX = (screenX - width/2) / zoom + camX

            const cam = cameraRef.current;
            const worldX = (mouseX - width / 2) / cam.zoom + cam.x;
            const worldY = (mouseY - height / 2) / cam.zoom + cam.y;

            // Find clicked particle
            let clickedInfo: string | null = null;
            const hitRadius = 30; // 30px radius around node

            for (const p of particles) {
                if (p.label) {
                    const dx = p.x - worldX;
                    const dy = p.y - worldY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < hitRadius) {
                        clickedInfo = p.label;
                        break;
                    }
                }
            }

            // Update both State (for UI) and Ref (for Animation Loop)
            if (clickedInfo) {
                setSelectedNode(clickedInfo);
                selectedNodeRef.current = clickedInfo;
                cameraRef.current.targetZoom = 3;
            } else {
                setSelectedNode(null);
                selectedNodeRef.current = null;
                cameraRef.current.targetZoom = 1;
                cameraRef.current.targetX = width / 2;
                cameraRef.current.targetY = height / 2;
            }
        };

        canvas.addEventListener('click', handleCanvasClick);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', handleCanvasClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full cursor-pointer z-[0] \${className}`}
                style={{ pointerEvents: 'auto' }}
            />

            {/* Overlay Card */}
            {selectedNode && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden
                            border border-white/20 shadow-xl shadow-blue-900/10 z-50 animate-in fade-in zoom-in duration-300
                            max-w-6xl w-[95vw] h-[85vh] flex relative"
                    style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>


                    {/* CONTENT CONTAINER - Full width but z-10 above animation */}
                    <div className="relative z-10 w-full h-full flex flex-col p-8 md:p-12 overflow-hidden">


                        <button
                            onClick={() => {
                                setSelectedNode(null);
                                cameraRef.current.targetZoom = 1;
                                const canvas = canvasRef.current;
                                if (canvas) {
                                    cameraRef.current.targetX = canvas.width / 2;
                                    cameraRef.current.targetY = canvas.height / 2;
                                }
                                if (selectedNodeRef.current) selectedNodeRef.current = null;
                            }}
                            className="absolute top-6 right-8 text-[#0055ff]/50 hover:text-[#0055ff] transition-colors z-[60] text-4xl font-light"
                        >
                            ✕
                        </button>

                        {/* HEADERS - Left Aligned */}
                        <div className="mb-10 text-left border-b border-white/10 pb-6 w-full">
                            <h3 className="text-5xl font-bold mb-2 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent drop-shadow-sm font-['Paris2024'] tracking-widest">
                                {selectedNode}
                            </h3>
                            <p className="text-white font-['Paris2024'] text-sm tracking-widest">
                                {(() => {
                                    const node = MAJOR_NODES.find(n => n.text === selectedNode);
                                    return node?.description || "Ce domaine occupe une place importante dans mon parcours. Il me permet de développer des compétences variées.";
                                })()}
                            </p>
                        </div>

                        {/* SCROLLABLE PROJECTS AREA */}
                        <div className="flex-1 overflow-y-auto w-full custom-scrollbar pr-4">
                            <div className="w-full flex flex-col gap-16 text-left pb-12">
                                {(() => {
                                    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    const domainProjects = projects.filter(p =>
                                        normalize(p.domain) === normalize(selectedNode || "")
                                    );

                                    const bestProjects = domainProjects.filter(p => p.isBest);
                                    const recentProjects = domainProjects.filter(p => p.isRecent);

                                    if (domainProjects.length === 0) {
                                        return (
                                            <div className="flex flex-col items-center justify-center p-12 opacity-50">
                                                <i className="fa-solid fa-code text-4xl mb-4 text-[#0055ff]"></i>
                                                <p className="font-['Montserrat_Alternates'] text-xl italic">
                                                    Projets à venir dans ce secteur...
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <>
                                            {/* BEST PROJECTS */}
                                            {bestProjects.length > 0 && (
                                                <div className="relative">
                                                    <h4 className="font-['Paris2024'] text-3xl mb-8 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent drop-shadow-sm tracking-widest">
                                                        Mes meilleurs projets
                                                    </h4>
                                                    <p className="text-white font-['Roboto_Mono'] text-sm tracking-widest mb-12">
                                                        Vous trouverez ici une sélection de mes projets les plus aboutis, ceux qui reflètent le mieux mon niveau actuel, ma rigueur et mon investissement.
                                                        Ils mettent en avant ma capacité à mener un projet de bout en bout, de la conception à la réalisation.
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {bestProjects.map(project => (
                                                            <div key={project.id} className="group relative bg-white/40 rounded-2xl overflow-hidden border border-white/40 hover:shadow-2xl hover:shadow-[#00f2ff]/10 transition-all duration-300 flex flex-col h-full">
                                                                <div className="h-40 w-full overflow-hidden relative bg-black/40">
                                                                    {project.imageUrl ? (
                                                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50">
                                                                            <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                        </div>
                                                                    )}

                                                                    {/* Dark overlay for Title/Tags visibility when NOT hovered (optional, keeping existing logic) */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>

                                                                    {/* Title & Tags - Visible by default, fade out on hover */}
                                                                    <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                                                                        <div className="flex gap-2 mb-2 flex-wrap">
                                                                            {project.languages.slice(0, 3).map((l, idx) => (
                                                                                <span key={idx} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                                                                    {l}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <h3 className="text-white font-['Paris2024'] text-lg tracking-wider leading-tight">
                                                                            {project.title}
                                                                        </h3>
                                                                    </div>

                                                                    {/* HOVER OVERLAY: Description & Link */}
                                                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                                        <h3 className="text-white font-['Paris2024'] text-lg mb-2 tracking-wider">
                                                                            {project.title}
                                                                        </h3>
                                                                        <p className="text-xs text-gray-300 line-clamp-3 mb-4 font-['Montserrat_Alternates'] leading-relaxed">
                                                                            {project.description}
                                                                        </p>

                                                                        {project.link && (
                                                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-[#00f2ff] hover:text-[#80fbff] transition-colors group/link border border-[#00f2ff] hover:border-[#80fbff] px-3 py-1.5 rounded-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20">
                                                                                Voir le projet
                                                                                <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* RECENT PROJECTS */}
                                            {recentProjects.length > 0 && (
                                                <div className="relative">
                                                    <h4 className="font-['Paris2024'] text-3xl mb-8 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent drop-shadow-sm tracking-widest">
                                                        Mes récents projets
                                                    </h4>
                                                    <p className="text-white font-['Roboto_Mono'] text-sm tracking-widest mb-12">
                                                        Vous trouverez ici une sélection de mes projets les plus aboutis, ceux qui reflètent le mieux mon niveau actuel, ma rigueur et mon investissement.
                                                        Ils mettent en avant ma capacité à mener un projet de bout en bout, de la conception à la réalisation.
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {recentProjects.map(project => (
                                                            <div key={project.id} className="group relative bg-white/40 rounded-2xl overflow-hidden border border-white/40 hover:shadow-2xl hover:shadow-[#00f2ff]/10 transition-all duration-300 flex flex-col h-full">
                                                                <div className="h-40 w-full overflow-hidden relative bg-black/40">
                                                                    {project.imageUrl ? (
                                                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50">
                                                                            <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                        </div>
                                                                    )}

                                                                    {/* Dark overlay for Title/Tags visibility when NOT hovered */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>

                                                                    {/* Title & Tags - Visible by default, fade out on hover */}
                                                                    <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                                                                        <div className="flex gap-2 mb-2 flex-wrap">
                                                                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                                                                RÉCENT
                                                                            </span>
                                                                        </div>
                                                                        <h3 className="text-white font-['Paris2024'] text-lg tracking-wider leading-tight">
                                                                            {project.title}
                                                                        </h3>
                                                                    </div>

                                                                    {/* HOVER OVERLAY: Description & Link */}
                                                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                                        <h3 className="text-white font-['Paris2024'] text-lg mb-2 tracking-wider">
                                                                            {project.title}
                                                                        </h3>
                                                                        <p className="text-xs text-gray-300 line-clamp-3 mb-4 font-['Montserrat_Alternates'] leading-relaxed">
                                                                            {project.description}
                                                                        </p>

                                                                        {project.link && (
                                                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-[#00f2ff] hover:text-[#80fbff] transition-colors group/link border border-[#00f2ff] hover:border-[#80fbff] px-3 py-1.5 rounded-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20">
                                                                                Voir le projet
                                                                                <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-white font-['Baskerville'] text-sm tracking-widest mt-16 mb-8 leading-loose">
                                                        Pour plus d’informations, veuillez cliquer sur les vignettes afin d’accéder aux pages détaillées des projets, consulter les liens associés et explorer le reste du site.
                                                        Pour toute information complémentaire ou prise de contact, la section Contact est à votre disposition.
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                    </div>
                </div >
            )
            }
        </>
    );
}
