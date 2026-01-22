import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Image, Float, useTexture, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- ASSET PATHS ---
// Ensure filenames match exactly what is in public/assets
const ASSETS = {
    vein: '/assets/01B-Vaisseaux-sanguins.webp',
    heart: '/assets/3B-Oreillettes-droite-et-gauche-MASTER.webp',
    brain: '/assets/cerveau-scaled.jpeg',
    neuron: '/assets/stimulation-ou-activite-du-cerveau-humain-avec-illustration-du-rendu-3d-en-gros-plan-du-neurone-neurologie-cognition-reseau-neuronal-psychologie-neuroscience-s-2e14nec.jpg', // Long filename
    particle: '/assets/IMG_2120.PNG'
};

// --- SCENE COMPONENTS ---

function VeinTunnel({ active, progress }: { active: boolean, progress: number }) {
    const tunnelRef = useRef<THREE.Mesh>(null);
    const texture = useTexture(ASSETS.vein);

    // Create a curved path
    const path = useMemo(() => {
        const points = [];
        for (let i = 0; i < 50; i++) {
            points.push(new THREE.Vector3(
                Math.sin(i * 0.2) * 2,
                Math.cos(i * 0.1) * 2,
                -i  // Move forward into screen (negative Z)
            ));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state) => {
        if (!tunnelRef.current) return;
        // Move texture to simulate speed
        if (active) {
            texture.offset.x += 0.005;
            texture.offset.y += 0.002;
        }
    });

    return (
        <group visible={active}>
            <mesh ref={tunnelRef} position={[0, 0, 0]}>
                <tubeGeometry args={[path, 64, 2, 8, false]} />
                <meshStandardMaterial
                    map={texture}
                    side={THREE.BackSide} // Render inside of tube
                    color="#ff8888"
                    roughness={0.4}
                />
            </mesh>
            {/* Blood Cells / Particles */}
            <Stars radius={2} depth={50} count={1000} factor={4} saturation={1} fade speed={1} />
        </group>
    );
}

function HeartScene({ active }: { active: boolean }) {
    const texture = useTexture(ASSETS.heart);
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!active || !mesh.current) return;
        // Pulse Effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
        mesh.current.scale.set(scale, scale, 1);
        mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    return (
        <group visible={active} position={[0, 0, -15]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh ref={mesh} scale={[2, 2, 1]}>
                    <planeGeometry args={[5, 5]} />
                    <meshStandardMaterial map={texture} transparent opacity={1} side={THREE.DoubleSide} />
                </mesh>
            </Float>
            <pointLight position={[2, 2, 2]} color="#ff0000" intensity={2} distance={10} />
        </group>
    );
}

function BrainScene({ active, approaching }: { active: boolean, approaching: boolean }) {
    const texture = useTexture(ASSETS.brain);
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!active || !sphereRef.current) return;

        sphereRef.current.rotation.y += delta * 0.1;

        if (approaching) {
            // Move closer if in approach phase
        }
    });

    return (
        <group visible={active} position={[0, 0, -30]}>
            <mesh ref={sphereRef} scale={[1, 1, 1]}>
                <sphereGeometry args={[4, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.5}
                    metalness={0.2}
                    color="#ffffff"
                    emissive="#111111"
                />
            </mesh>
            <ambientLight intensity={0.5} />
            <pointLight position={[-5, 5, 5]} color="#00f2ff" intensity={1} />
        </group>
    );
}

function NeuralNetworkScene({ active }: { active: boolean }) {
    // Inside the brain
    const count = 50;
    const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < count; i++) {
            pos.push((Math.random() - 0.5) * 20);
            pos.push((Math.random() - 0.5) * 20);
            pos.push((Math.random() - 0.5) * 20);
        }
        return new Float32Array(pos);
    }, []);

    useFrame((state, delta) => {
        // Rotate entire network
    });

    return (
        <group visible={active}>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.2}
                    color="#00f2ff"
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>
            {/* Connections lines could be added here similar to 2D but in 3D */}
        </group>
    );
}

// --- MAIN CONTROLLER ---

export default function LandingAnimation() {
    const [phase, setPhase] = useState<'VEIN' | 'HEART' | 'BRAIN_APPROACH' | 'NEURAL' | 'LOGO'>('VEIN');
    const [cameraZ, setCameraZ] = useState(0);

    // Audio/Music could go here

    useEffect(() => {
        // Sequence Controller
        const veinDuration = 6000;
        const heartDuration = 4000;
        const brainDuration = 4000;
        const neuralDuration = 4000;
        const logoDuration = 10000;

        let timer1 = setTimeout(() => setPhase('HEART'), veinDuration);
        let timer2 = setTimeout(() => setPhase('BRAIN_APPROACH'), veinDuration + heartDuration);
        let timer3 = setTimeout(() => setPhase('NEURAL'), veinDuration + heartDuration + brainDuration);
        let timer4 = setTimeout(() => setPhase('LOGO'), veinDuration + heartDuration + brainDuration + neuralDuration);
        let timer5 = setTimeout(() => {
            // Reset loop
            setPhase('VEIN');
        }, veinDuration + heartDuration + brainDuration + neuralDuration + logoDuration);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, [phase === 'VEIN']); // Restart sequence when phase resets to VEIN

    return (
        <div className="absolute top-0 left-0 w-full h-full z-[0]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                <color attach="background" args={['#000000']} />

                <CameraController phase={phase} />

                {/* SCENES */}
                <VeinTunnel active={phase === 'VEIN'} progress={0} />
                <HeartScene active={phase === 'HEART' || phase === 'VEIN'} />
                <BrainScene active={phase === 'BRAIN_APPROACH' || phase === 'HEART'} approaching={phase === 'BRAIN_APPROACH'} />
                <NeuralNetworkScene active={phase === 'NEURAL' || phase === 'LOGO'} />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} intensity={1} />
            </Canvas>

            {/* OVERLAY UI FOR LOGO REVEAL */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-2000 ${phase === 'LOGO' ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="font-['Monad'] text-[5rem] font-[200] tracking-[12px] m-0 uppercase bg-gradient-to-br from-[#00f2ff] to-[#ffffff] bg-clip-text text-transparent select-none drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]">
                    briac-le-meillat
                </h1>
                <p className="font-['Paris2024'] text-[1.2rem] tracking-[4px] text-white/90 mt-4 leading-normal text-center drop-shadow-md">
                    LA CONNEXION FLUIDE ENTRE <br />MÉDECINS, PHARMACIENS, INFIRMIERS, PATIENTS ET ÉTUDIANTS
                </p>
            </div>
        </div>
    );
}

function CameraController({ phase }: { phase: string }) {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame((state, delta) => {
        // Simple camera automation based on phase
        const speed = 2 * delta;

        if (phase === 'VEIN') {
            // Move forward through tunnel (Z decreases)
            // Reset if too far for loop? No, component resets phase.
            camera.position.z -= speed * 5;
            // Camera shake
            camera.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
            camera.position.y = Math.cos(state.clock.elapsedTime * 2) * 0.1;
        }
        else if (phase === 'HEART') {
            // Slow down, look at heart
            camera.position.lerp(vec.set(0, 0, 0), delta); // Move to 0,0,0
        }
        else if (phase === 'BRAIN_APPROACH') {
            // Move towards brain sphere at z = -30
            camera.position.lerp(vec.set(0, 0, -25), delta * 0.5);
        }
        else if (phase === 'NEURAL') {
            // Inside brain
            // Rotate camera or fly through
            camera.position.z -= speed;
            camera.rotation.z += delta * 0.1;
        }
        else if (phase === 'LOGO') {
            // Stabilize
            camera.position.lerp(vec.set(0, 0, -50), delta * 0.5);
            camera.rotation.set(0, 0, 0);
        }

        // Handling Reset
        if (phase === 'VEIN' && camera.position.z < -50) {
            camera.position.set(0, 0, 5); // Reset start
        }
    });

    // Reset camera when phase becomes VEIN (Start of loop)
    useEffect(() => {
        if (phase === 'VEIN') {
            camera.position.set(0, 0, 5);
            camera.rotation.set(0, 0, 0);
        }
    }, [phase, camera]);

    return null;
}
