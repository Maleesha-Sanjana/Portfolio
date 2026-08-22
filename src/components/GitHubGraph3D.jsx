import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const WEEKS = 52;
const DAYS = 7;
const TOTAL = WEEKS * DAYS;

const colors = [
    new THREE.Color('#1e293b'), // 0 (darker slate)
    new THREE.Color('#0e4429'), // 1
    new THREE.Color('#006d32'), // 2
    new THREE.Color('#26a641'), // 3
    new THREE.Color('#39d353')  // 4
];

// Generate realistic mock data
const data = new Array(TOTAL).fill(0).map(() => {
    const r = Math.random();
    if (r < 0.6) return 0;
    if (r < 0.8) return 1;
    if (r < 0.9) return 2;
    if (r < 0.96) return 3;
    return 4;
});

function InstancedGraph() {
    const meshRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Handle hover effect and initial setup
    useFrame(() => {
        if (!meshRef.current) return;
        let i = 0;
        const offsetW = WEEKS / 2;
        const offsetD = DAYS / 2;

        for (let w = 0; w < WEEKS; w++) {
            for (let d = 0; d < DAYS; d++) {
                const isHovered = i === hoveredId;
                const count = data[i];
                
                // Scale up slightly if hovered
                const height = count === 0 ? 0.2 : 0.2 + (count * 0.5);
                const scaleY = isHovered ? height + 1.0 : height;
                
                // Position: X is weeks, Z is days
                dummy.position.set(
                    (w - offsetW) * 1.2, 
                    scaleY / 2, 
                    (d - offsetD) * 1.2
                );
                dummy.scale.set(1, scaleY, 1);
                dummy.updateMatrix();
                
                meshRef.current.setMatrixAt(i, dummy.matrix);
                
                // Highlight color if hovered
                if (isHovered) {
                    meshRef.current.setColorAt(i, new THREE.Color('#ffffff'));
                } else {
                    meshRef.current.setColorAt(i, colors[count]);
                }
                i++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <>
            <instancedMesh 
                ref={meshRef} 
                args={[null, null, TOTAL]}
                onPointerMove={(e) => {
                    e.stopPropagation();
                    if (e.instanceId !== undefined) {
                        setHoveredId(e.instanceId);
                    }
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHoveredId(null);
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial toneMapped={false} roughness={0.2} metalness={0.1} />
            </instancedMesh>
            
            {/* Simple tooltip for hovered item */}
            {hoveredId !== null && (
                <Html 
                    position={[
                        (Math.floor(hoveredId / DAYS) - WEEKS / 2) * 1.2, 
                        4, 
                        ((hoveredId % DAYS) - DAYS / 2) * 1.2
                    ]}
                    center
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{ 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        color: 'white', 
                        fontSize: '13px', 
                        whiteSpace: 'nowrap',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        fontWeight: '500'
                    }}>
                        {data[hoveredId]} commits
                    </div>
                </Html>
            )}
        </>
    );
}

export default function GitHubGraph3D() {
    return (
        <div style={{ 
            width: '100%', 
            height: '620px',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.8) 100%)', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, color: 'white' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" fill="white">
                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                    </svg>
                    Github Contribution
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', marginTop: 6 }}>Drag to rotate • Hover to inspect</p>
            </div>

            <Canvas camera={{ position: [-30, 25, 40], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[20, 30, 10]} intensity={1.5} />
                <directionalLight position={[-20, -30, -10]} intensity={0.4} />
                
                <InstancedGraph />
                
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    autoRotate 
                    autoRotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 2 - 0.15}
                    minPolarAngle={0.1}
                />
            </Canvas>
        </div>
    );
}
