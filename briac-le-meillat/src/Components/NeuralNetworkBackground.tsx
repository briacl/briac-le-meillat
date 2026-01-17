import React, { useEffect, useRef } from 'react';

export default function NeuralNetworkBackground({ className = "", theme = "dark" }: { className?: string, theme?: "light" | "dark" }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedNode, setSelectedNode] = React.useState<string | null>(null);

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

        const isLight = theme === 'light';
        // Using brand blue for light mode
        const particleColor = isLight ? '#0055ff' : '#00f2ff';
        const textColor = isLight ? '#0044cc' : '#ffffff';
        const connectionColor = isLight ? '0, 85, 255' : '0, 242, 255'; // RGB for opacity manipulation

        const labelledNodes = [
            { text: "DÉVELOPPEMENT WEB", isActive: true },
            { text: "RÉSEAUX INFORMAIQUES", isActive: true },
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
                this.color = label ? (isLight ? '#334155' : '#ffffff') : particleColor;
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

                    if (isLight) {
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
                    } else {
                        ctx.fillStyle = textColor;
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
                        ctx.strokeStyle = `rgba(${connectionColor}, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;

                        if (p1.label || p2.label) {
                            ctx.strokeStyle = `rgba(${isLight ? '15, 23, 42' : '255, 255, 255'}, ${opacity * 0.3})`;
                            ctx.lineWidth = 1.5;
                        }

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

            // Check distance to particles (consider zoom for hit radius?)
            // Hit area should be reasonable.
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
                className={`absolute top-0 left-0 w-full h-full cursor-pointer z-[0] ${className}`}
                style={{ pointerEvents: 'auto' }}
            />

            {/* Overlay Card */}
            {selectedNode && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            bg-white/10 backdrop-blur-md rounded-3xl px-12 py-8 flex flex-col items-center justify-center 
                            border border-white/20 shadow-xl shadow-blue-900/10 z-50 text-center animate-in fade-in zoom-in duration-300"
                    style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>

                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-br from-[#00f2ff] to-[#0055ff] bg-clip-text text-transparent drop-shadow-sm font-['Paris2024'] tracking-widest">
                        {selectedNode}
                    </h3>
                    <p className="text-black font-['Montserrat_Alternates'] mt-2">
                        (en chantier)
                    </p>
                    <button
                        onClick={() => {
                            setSelectedNode(null);
                            cameraRef.current.targetZoom = 1;
                            // Reset camera target to center
                            const canvas = canvasRef.current;
                            if (canvas) {
                                cameraRef.current.targetX = canvas.width / 2;
                                cameraRef.current.targetY = canvas.height / 2;
                            }
                            if (selectedNodeRef.current) selectedNodeRef.current = null;
                        }}
                        className="absolute top-4 right-6 text-[#0055ff]/50 hover:text-[#0055ff] transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
