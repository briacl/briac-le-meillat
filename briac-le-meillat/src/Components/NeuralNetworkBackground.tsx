import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/Contexts/ThemeProvider';
import { useProjects, Project } from '@/Contexts/ProjectContext';
import { motion } from 'framer-motion';

const CODE_CARDS = [
    {
        title: "ProjectContext.tsx",
        language: "typescript",
        code: `export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: uuidv4() };
    setProjects(prev => [...prev, newProject]);
  };

  useEffect(() => {
    // Sync with backend
    api.sync(projects).then(console.log);
  }, [projects]);
  
  return (
    <ProjectContext.Provider value={{ projects }}>
      {children}
    </ProjectContext.Provider>
  );
};`
    },
    {
        title: "NeuralNetwork.css",
        language: "css",
        code: `.neuron-node {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #00f2ff, #0055ff);
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.6);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.neuron-node:hover {
  transform: scale(1.5);
  z-index: 100;
}

.connection-line {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 1px;
}`
    },
    {
        title: "ApiHandler.ts",
        language: "typescript",
        code: `async function fetchData(endpoint: string) {
  try {
    const response = await fetch(\`\${API_URL}/\${endpoint}\`);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    return data.map(item => ({
      ...item,
      processed: true,
      timestamp: new Date()
    }));
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}`
    }
];

// ... (existing constants or code if any need to be preserved, but in this replacement block we are replacing snippets)

export default function NeuralNetworkBackground({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
    const { theme } = useTheme();
    const { getProjectsByDomain, projects } = useProjects();

    // Camera state managed in ref to be accessible in animation loop without re-triggering effects
    const cameraRef = useRef({ x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 });

    // We use a ref to track the selected node inside the animation loop/click handler
    // to avoid closure staleness since the effect runs once.
    const selectedNodeRef = useRef<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // FETCH COLORS FROM CSS VARIABLES
        const styles = getComputedStyle(document.documentElement);
        const nodeColor = styles.getPropertyValue('--node-color').trim();
        // Helpers to parse color if needed, or just use string for fillStyle
        // For rgba manipulation in connection lines, we might need to parse. 
        // For now, let's assume --node-color is rgba or hex.

        // Simpler approach: define colors based on theme if parsing is complex, 
        // BUT user asked for easy config. 
        // Let's assume standard RGB format or simple hex for main colors.
        // Actually, connection opacity relies on string manipulation "0, 255, 255".
        // Let's grab the raw values.

        const isLight = theme === 'light';
        const particleColor = nodeColor;
        const textColor = styles.getPropertyValue('--text-primary').trim();

        // Hardcoded fallback for connection baselines if var parsing is too brittle for this snippet:
        // We will try to rely on the var.

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        // Ensure camera is initialized
        if (cameraRef.current.targetZoom === 1) {
            cameraRef.current.targetX = width / 2;
            cameraRef.current.targetY = height / 2;
            cameraRef.current.x = width / 2;
            cameraRef.current.y = height / 2;
        }

        let particles: Particle[] = [];
        let animationFrameId: number;

        // Re-instantiate particles or keep them if we moved this out of effect?
        // Since we rely on theme, let's just rebuild. It's fine.

        // Configuration
        const particleCount = 70;
        const connectionDistance = 200;
        const speedBase = 0.8;

        const labelledNodes = [
            { text: "DÉVELOPPEMENT WEB", isActive: true },
            { text: "RÉSEAUX INFORMATIQUES", isActive: true },
            { text: "IA", isActive: true },
            { text: "TÉLÉCOMMUNICATIONS", isActive: true },
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            label: string | null;
            color: string;
            shadowBlur: number;

            constructor(label: string | null = null) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * speedBase;
                this.vy = (Math.random() - 0.5) * speedBase;
                this.size = label ? 4 : Math.random() * 2 + 1;
                this.label = label;
                this.color = particleColor; // Use the fetched color
                this.shadowBlur = label ? 20 : 10;
            }

            update() {
                const currentZoom = cameraRef.current.zoom;
                // Adjust speed perception if needed, or just let them move.
                // If zoomed in, they move efficiently faster across screen, but same world speed.

                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.shadowBlur;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                if (this.label) {
                    ctx.font = "bold 14px Inter, sans-serif";

                    if (true) { // Always use gradient as requested
                        const metrics = ctx.measureText(this.label);
                        const textWidth = metrics.width;
                        const textHeight = 14;
                        // Gradient from Top-Left to Bottom-Right relative to text bounding box
                        const gradient = ctx.createLinearGradient(
                            this.x - textWidth / 2,
                            this.y - 15 - textHeight / 2,
                            this.x + textWidth / 2,
                            this.y - 15 + textHeight / 2
                        );
                        gradient.addColorStop(0, '#00f2ff');
                        gradient.addColorStop(1, '#0055ff');
                        ctx.fillStyle = gradient;
                    }

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(this.label, this.x, this.y - 15);
                }
            }
        }

        const init = () => {
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            particles = [];

            labelledNodes.forEach(item => {
                particles.push(new Particle(item.text));
            });

            for (let i = 0; i < particleCount - labelledNodes.length; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = () => {
            if (!ctx) return;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        let opacity = 1 - (dist / connectionDistance);
                        ctx.beginPath();
                        ctx.save();
                        ctx.globalAlpha = opacity * 0.4;
                        ctx.strokeStyle = particleColor;
                        ctx.lineWidth = 1;

                        if (p1.label || p2.label) {
                            ctx.globalAlpha = opacity * 0.6;
                            ctx.lineWidth = 1.5;
                        }

                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.restore();
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
                particle.update();
                particle.draw();
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

                    {/* BACKGROUND ANIMATION - IMPROVED CODE CARDS */}
                    <div className="absolute top-0 right-0 w-[50%] h-full overflow-hidden pointer-events-none z-0">
                        {/* Gradient Mask to fade top/bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/5 to-transparent z-10"></div>

                        <div className="flex justify-between h-full w-full gap-6 px-10 pt-10">
                            {CODE_CARDS.map((card, index) => (
                                <motion.div
                                    key={index}
                                    animate={{ y: [0, -1000] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 25 + index * 5,
                                        ease: "linear"
                                    }}
                                    className="flex flex-col gap-8 w-1/3"
                                    style={{ marginTop: `${index * 100}px` }}
                                >
                                    {/* Duplicated items for endless scroll illusion */}
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="bg-[#0d1117]/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-2xl overflow-hidden">
                                            {/* Window Header */}
                                            <div className="flex items-center px-3 py-2 bg-white/5 border-b border-white/5 gap-2">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-mono ml-2 opacity-50">{card.title}</span>
                                            </div>
                                            {/* Code Body */}
                                            <div className="p-3">
                                                <pre className="text-[10px] leading-relaxed font-mono text-gray-300 overflow-hidden">
                                                    <code className={card.language === 'typescript' ? 'text-blue-300' : 'text-purple-300'}>
                                                        {card.code}
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>

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
                        <div className="mb-10 text-left border-b border-white/10 pb-6 w-full max-w-2xl">
                            <h3 className="text-5xl font-bold mb-2 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent drop-shadow-sm font-['Paris2024'] tracking-widest">
                                {selectedNode}
                            </h3>
                            <p className="text-gray-500 font-['Montserrat_Alternates'] text-sm uppercase tracking-widest">
                                EXPLORATION DES PROJETS & EXPERTISES
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
                                                    <h4 className="sticky top-0 bg-white/5 backdrop-blur-sm z-20 py-2 font-['Paris2024'] text-2xl text-gray-800 mb-6 pl-4 border-l-4 border-[#00f2ff] w-full shadow-sm">
                                                        UNE SÉLECTION DE MES MEILLEURS TRAVAUX
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {bestProjects.map(project => (
                                                            <div key={project.id} className="group relative bg-white/40 rounded-2xl overflow-hidden border border-white/40 hover:shadow-2xl hover:shadow-[#00f2ff]/10 transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
                                                                <div className="h-48 bg-gray-100 w-full overflow-hidden relative">
                                                                    {project.imageUrl ? (
                                                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50">
                                                                            <span className="text-3xl opacity-20"><i className="fa-solid fa-image"></i></span>
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                                                    <div className="absolute bottom-4 left-4 right-4">
                                                                        <div className="flex gap-2 mb-2 flex-wrap">
                                                                            {project.languages.slice(0, 3).map((l, idx) => (
                                                                                <span key={idx} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                                                                    {l}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <h3 className="text-white font-['Paris2024'] text-lg tracking-wider group-hover:text-[#00f2ff] transition-colors leading-tight">
                                                                            {project.title}
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                <div className="p-6 flex flex-col flex-1 bg-white/30 backdrop-blur-md">
                                                                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 font-['Montserrat_Alternates'] leading-relaxed flex-1">
                                                                        {project.description}
                                                                    </p>

                                                                    {project.link && (
                                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto self-start inline-flex items-center gap-2 text-xs uppercase font-bold text-[#0055ff] hover:text-[#00f2ff] transition-colors group/link">
                                                                            Voir le projet
                                                                            <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* RECENT PROJECTS */}
                                            {recentProjects.length > 0 && (
                                                <div className="relative">
                                                    <h4 className="sticky top-0 bg-white/5 backdrop-blur-sm z-20 py-2 font-['Paris2024'] text-2xl text-gray-800 mb-6 pl-4 border-l-4 border-[#0055ff] w-full shadow-sm">
                                                        PROJETS RÉCENTS
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {recentProjects.map(project => (
                                                            <div key={project.id} className="group relative bg-white/30 rounded-2xl overflow-hidden border border-white/30 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col h-full">
                                                                <div className="h-40 bg-gray-100 w-full overflow-hidden relative">
                                                                    {project.imageUrl ? (
                                                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                                                    <div className="absolute top-3 right-3 bg-white/90 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                                        RÉCENT
                                                                    </div>
                                                                </div>
                                                                <div className="p-5 flex flex-col flex-1">
                                                                    <h4 className="font-['Paris2024'] text-lg mb-2 text-gray-900 group-hover:text-[#0055ff] transition-colors">{project.title}</h4>
                                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 font-['Montserrat_Alternates'] flex-1">{project.description}</p>
                                                                    {project.link && (
                                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-bold text-gray-500 hover:text-[#0055ff] self-end">
                                                                            Découvrir +
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
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
