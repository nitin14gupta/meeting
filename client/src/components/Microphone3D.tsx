'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';

interface Microphone3DProps {
    position?: [number, number, number];
    scale?: number;
}

export default function Microphone3D({ position = [0, 0, 0], scale = 1 }: Microphone3DProps) {
    const meshRef = useRef<Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Create microphone geometry
    const microphoneGeometry = useMemo(() => {
        const group = new THREE.Group();

        // Main body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);
        const body = new THREE.Mesh(bodyGeometry);
        body.position.y = 0.2;
        group.add(body);

        // Microphone head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const head = new THREE.Mesh(headGeometry);
        head.position.y = 1.1;
        group.add(head);

        // Stand (thin cylinder)
        const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const stand = new THREE.Mesh(standGeometry);
        stand.position.y = -0.6;
        group.add(stand);

        // Base (wider cylinder)
        const baseGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
        const base = new THREE.Mesh(baseGeometry);
        base.position.y = -0.9;
        group.add(base);

        return group;
    }, []);

    // Floating animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={microphoneGeometry} />
            <mesh ref={meshRef}>
                <meshStandardMaterial
                    color="#3b82f6"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#1e40af"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    );
}
