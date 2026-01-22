import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Scène 1: Corps humain stylisé (silhouette avec particules)
function HumanBodyScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    const particleCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        // Forme humanoïde simplifiée
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 6;

            let radius;
            if (height > 2) {
                // Tête
                radius = 0.4 + Math.random() * 0.2;
            } else if (height > 0) {
                // Torse
                radius = 0.8 + Math.random() * 0.4;
            } else {
                // Jambes
                radius = 0.3 + Math.random() * 0.2;
            }

            pos[i3] = Math.cos(angle) * radius;
            pos[i3 + 1] = height;
            pos[i3 + 2] = Math.sin(angle) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!isActive || !groupRef.current || !particlesRef.current) return;

        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;

        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.001;
            positions[i + 2] += Math.cos(state.clock.elapsedTime + i) * 0.001;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.02}
                    color="#00f2ff"
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}

// Scène 2: Vaisseaux sanguins (réseau de tubes)
function BloodVesselsScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const tubesRef = useRef<THREE.Group>(null);

    const tubes = useMemo(() => {
        const result = [];
        for (let i = 0; i < 15; i++) {
            const points = [];
            const segments = 20;
            for (let j = 0; j < segments; j++) {
                const t = j / segments;
                const angle = t * Math.PI * 4 + i;
                points.push(
                    new THREE.Vector3(
                        Math.cos(angle) * (1 + Math.sin(t * Math.PI * 2) * 0.5),
                        t * 4 - 2,
                        Math.sin(angle) * (1 + Math.cos(t * Math.PI * 2) * 0.5)
                    )
                );
            }
            result.push(new THREE.CatmullRomCurve3(points));
        }
        return result;
    }, []);

    useFrame((state) => {
        if (!isActive || !groupRef.current) return;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            <group ref={tubesRef}>
                {tubes.map((curve, idx) => (
                    <mesh key={idx}>
                        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
                        <meshStandardMaterial
                            color={idx % 2 === 0 ? "#ff0044" : "#cc0033"}
                            emissive={idx % 2 === 0 ? "#ff0044" : "#cc0033"}
                            emissiveIntensity={0.3}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// Scène 3: Cœur (sphère pulsante avec particules)
function HeartScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const heartRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!isActive || !heartRef.current || !groupRef.current) return;

        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
        heartRef.current.scale.setScalar(pulse);
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            <mesh ref={heartRef}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshStandardMaterial
                    color="#ff1155"
                    emissive="#ff0044"
                    emissiveIntensity={0.5}
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>

            {/* Particules autour du cœur */}
            {Array.from({ length: 100 }).map((_, i) => {
                const angle = (i / 100) * Math.PI * 2;
                const radius = 1.8;
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius,
                            Math.sin(i * 0.5) * 0.5,
                            Math.sin(angle) * radius
                        ]}
                    >
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshBasicMaterial color="#ff3366" />
                    </mesh>
                );
            })}
        </group>
    );
}

// Scène 4: Cerveau (structure complexe)
function BrainScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    const brainStructure = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const i3 = i * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 0.8 + Math.random() * 0.4;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.cos(phi) * 1.2;
            positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (!isActive || !groupRef.current) return;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={5000}
                        array={brainStructure}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.015}
                    color="#ff88ff"
                    transparent
                    opacity={0.9}
                />
            </points>

            {/* Lobes du cerveau */}
            <mesh position={[0.5, 0, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial
                    color="#dd88ff"
                    emissive="#aa44cc"
                    emissiveIntensity={0.3}
                    metalness={0.5}
                    roughness={0.4}
                    transparent
                    opacity={0.7}
                />
            </mesh>
            <mesh position={[-0.5, 0, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial
                    color="#dd88ff"
                    emissive="#aa44cc"
                    emissiveIntensity={0.3}
                    metalness={0.5}
                    roughness={0.4}
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </group>
    );
}

// Scène 5: Neurones (réseau connecté)
function NeuronsScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    const neuronData = useMemo(() => {
        const neuronCount = 30;
        const neurons: THREE.Vector3[] = [];
        const connections: number[] = [];
        const connectionPositions: Float32Array = new Float32Array(neuronCount * neuronCount * 6);

        for (let i = 0; i < neuronCount; i++) {
            neurons.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                )
            );
        }

        let connectionIndex = 0;
        for (let i = 0; i < neuronCount; i++) {
            for (let j = i + 1; j < neuronCount; j++) {
                if (Math.random() > 0.7) {
                    connectionPositions[connectionIndex++] = neurons[i].x;
                    connectionPositions[connectionIndex++] = neurons[i].y;
                    connectionPositions[connectionIndex++] = neurons[i].z;
                    connectionPositions[connectionIndex++] = neurons[j].x;
                    connectionPositions[connectionIndex++] = neurons[j].y;
                    connectionPositions[connectionIndex++] = neurons[j].z;
                }
            }
        }

        return { neurons, connectionPositions: connectionPositions.slice(0, connectionIndex) };
    }, []);

    useFrame((state) => {
        if (!isActive || !groupRef.current) return;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            {/* Neurones */}
            {neuronData.neurons.map((pos, idx) => (
                <group key={idx} position={pos}>
                    <mesh>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#00ffaa"
                            emissive="#00ffaa"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    {/* Dendrites */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
                            <meshStandardMaterial color="#00ddaa" />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Connexions */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={neuronData.connectionPositions.length / 3}
                        array={neuronData.connectionPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#00ffaa" transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
}

// Scène 6: ADN et particules (transition vers les images)
function DNAScene({ isActive }: { isActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const dnaRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    const dnaStructure = useMemo(() => {
        const helixPoints = [];
        const steps = 100;
        const radius = 0.5;
        const height = 6;

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const angle = t * Math.PI * 8;
            const y = t * height - height / 2;

            helixPoints.push({
                pos1: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
                pos2: new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius),
            });
        }

        return helixPoints;
    }, []);

    const networkParticles = useMemo(() => {
        const positions = new Float32Array(1000 * 3);
        for (let i = 0; i < 1000; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (!isActive || !dnaRef.current || !groupRef.current || !particlesRef.current) return;

        dnaRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;

        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
            positions[i + 1] += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.01;
            positions[i + 2] += Math.sin(state.clock.elapsedTime + i * 0.3) * 0.01;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group ref={groupRef} visible={isActive}>
            {/* ADN hélicoïdal */}
            <group ref={dnaRef}>
                {dnaStructure.map((helix, idx) => (
                    <group key={idx}>
                        <mesh position={helix.pos1}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshStandardMaterial
                                color="#00f2ff"
                                emissive="#00f2ff"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                        <mesh position={helix.pos2}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshStandardMaterial
                                color="#ff00ff"
                                emissive="#ff00ff"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                        {idx % 3 === 0 && (
                            <mesh
                                position={new THREE.Vector3().lerpVectors(helix.pos1, helix.pos2, 0.5)}
                                rotation={[0, 0, Math.atan2(helix.pos2.z - helix.pos1.z, helix.pos2.x - helix.pos1.x)]}
                            >
                                <cylinderGeometry args={[0.02, 0.02, helix.pos1.distanceTo(helix.pos2), 8]} />
                                <meshStandardMaterial color="#ffffff" />
                            </mesh>
                        )}
                    </group>
                ))}
            </group>

            {/* Particules réseau */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={1000}
                        array={networkParticles}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#00f2ff"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>

            {/* Réseau de connexions */}
            {Array.from({ length: 20 }).map((_, i) => {
                const angle1 = (i / 20) * Math.PI * 2;
                const angle2 = ((i + 1) / 20) * Math.PI * 2;
                const radius = 3;
                return (
                    <line key={i}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([
                                    Math.cos(angle1) * radius, Math.sin(i * 0.5), Math.sin(angle1) * radius,
                                    Math.cos(angle2) * radius, Math.sin((i + 1) * 0.5), Math.sin(angle2) * radius,
                                ])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#00f2ff" transparent opacity={0.4} />
                    </line>
                );
            })}
        </group>
    );
}

// Contrôleur de caméra pour l'animation
function CameraController({ currentScene }: { currentScene: number }) {
    const { camera } = useThree();

    useFrame(() => {
        const targetPositions = [
            { x: 0, y: 0, z: 5 },      // Corps
            { x: 0, y: 0, z: 4 },      // Vaisseaux
            { x: 0, y: 0, z: 3 },      // Cœur
            { x: 0, y: 0, z: 3.5 },    // Cerveau
            { x: 0, y: 0, z: 4 },      // Neurones
            { x: 0, y: 0, z: 5 },      // ADN
        ];

        const target = targetPositions[currentScene] || targetPositions[0];

        camera.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

// Composant principal
export default function MedicalJourneyAnimation() {
    const [currentScene, setCurrentScene] = useState(0);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        const sceneTimings = [3000, 4000, 4000, 4000, 4000, 5000]; // Durée de chaque scène en ms

        const interval = setInterval(() => {
            setCurrentScene((prev) => {
                if (prev < sceneTimings.length - 1) {
                    return prev + 1;
                } else {
                    setShowLogo(true);
                    clearInterval(interval);
                    return prev;
                }
            });
        }, sceneTimings[currentScene]);

        return () => clearInterval(interval);
    }, [currentScene]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-[#050a14] to-[#0a1428]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                <CameraController currentScene={currentScene} />

                {/* Lumières */}
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f2ff" />
                <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.6} penumbra={1} />

                {/* Scènes */}
                <HumanBodyScene isActive={currentScene === 0} />
                <BloodVesselsScene isActive={currentScene === 1} />
                <HeartScene isActive={currentScene === 2} />
                <BrainScene isActive={currentScene === 3} />
                <NeuronsScene isActive={currentScene === 4} />
                <DNAScene isActive={currentScene === 5} />

                <Environment preset="night" />
            </Canvas>

            {/* Overlay pour le logo et tagline */}
            {showLogo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in">
                    <h1 className="font-['Monad'] text-[6rem] font-[200] tracking-[16px] uppercase bg-gradient-to-br from-white via-[#00f2ff] to-[#0066cc] bg-clip-text text-transparent animate-pulse-slow">
                        briac-le-meillat
                    </h1>
                    <p className="font-['Paris2024'] text-[1.5rem] tracking-[6px] text-white/90 mt-4">
                        L'INNOVATION AU SERVICE DE LA SANTÉ
                    </p>
                </div>
            )}

            {/* Indicateur de progression */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentScene ? 'bg-[#00f2ff] w-8' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            {/* Texte descriptif */}
            <div className="absolute top-8 left-8 text-white/80 font-['Inter'] text-sm">
                {currentScene === 0 && "Voyage au cœur de l'humain..."}
                {currentScene === 1 && "À travers les vaisseaux sanguins..."}
                {currentScene === 2 && "Au rythme du cœur..."}
                {currentScene === 3 && "Dans les méandres du cerveau..."}
                {currentScene === 4 && "Entre les connexions neuronales..."}
                {currentScene === 5 && "Jusqu'à l'ADN, source de vie..."}
            </div>
        </div>
    );
}
