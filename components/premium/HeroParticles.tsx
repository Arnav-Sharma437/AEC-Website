"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 160;

function ParticleField() {
  const groupRef = useRef<THREE.Group>(null);

  const [positions, lines] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const lineCoords: number[] = [];

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      if (i > 0 && i % 4 === 0) {
        const j = Math.floor(Math.random() * i);
        lineCoords.push(
          pos[i * 3],
          pos[i * 3 + 1],
          pos[i * 3 + 2],
          pos[j * 3],
          pos[j * 3 + 1],
          pos[j * 3 + 2]
        );
      }
    }

    const lg = new THREE.BufferGeometry();
    lg.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lineCoords), 3)
    );
    const lineSegments = new THREE.LineSegments(
      lg,
      new THREE.LineBasicMaterial({ color: "#6b8aad", transparent: true, opacity: 0.15 })
    );

    return [pos, lineSegments] as const;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#d4af37"
          size={0.055}
          sizeAttenuation
          depthWrite={false}
          opacity={0.55}
        />
      </Points>
      <primitive object={lines} />
    </group>
  );
}

export default function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] opacity-70 mix-blend-screen">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
