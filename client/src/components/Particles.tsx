'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, Vector3 } from 'three';
import * as THREE from 'three';

interface ParticlesProps {
    count?: number;
    radius?: number;
}

export default function Particles({ count = 200, radius = 5 }: ParticlesProps) {
    const pointsRef = useRef<Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random position in sphere
            const r = Math.random() * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.cos(phi);
            positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

            // Random blue/purple colors
            const colorChoice = Math.random();
            if (colorChoice < 0.5) {
                colors[i3] = 0.2;     // R
                colors[i3 + 1] = 0.4; // G
                colors[i3 + 2] = 1.0; // B
            } else {
                colors[i3] = 0.6;     // R
                colors[i3 + 1] = 0.2; // G
                colors[i3 + 2] = 1.0; // B
            }
        }

        return { positions, colors };
    }, [count, radius]);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                    args={[new Float32Array(particles.positions.length / 3), 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
                    args={[new Float32Array(particles.colors.length / 3), 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}
