import React, { useEffect, useRef } from 'react';

export default function NeuralNetworkBackground({ className = "", theme = "dark" }: { className?: string, theme?: "light" | "dark" }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use parent dimensions if possible, or window
        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        let particles: Particle[] = [];
        let animationFrameId: number;

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
            { text: "PATIENTS", isActive: true },
            { text: "MÉDECINS", isActive: true },
            { text: "PHARMACIES", isActive: true },
            { text: "INFIRMIERS", isActive: true },
            { text: "ÉTUDIANTS", isActive: true }
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

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full pointer-events-none z-[0] ${className}`}
        />
    );
}
