'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import Microphone3D from './Microphone3D';
import Particles from './Particles';

export default function Scene3D() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />

                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <pointLight position={[2, 2, 2]} intensity={0.8} color="#3b82f6" />
                    <pointLight position={[-2, -2, 2]} intensity={0.6} color="#8b5cf6" />
                    <directionalLight position={[0, 5, 0]} intensity={0.4} />

                    {/* 3D Objects */}
                    <Microphone3D position={[0, 0, 0]} scale={1.5} />
                    <Particles count={150} radius={3} />

                    {/* Environment */}
                    <Environment preset="night" />

                    {/* Controls */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
