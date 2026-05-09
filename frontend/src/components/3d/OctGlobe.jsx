import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const OctGlobe = ({ transforms }) => {
  const { sphereScale, ringScale, sceneRotationY, sphereEmissive } = transforms;

  const groupRef = useRef();
  const sphereRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  // Generate random points for particles
  const [positions] = React.useState(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const r = Math.random() * 1.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Apply scroll transforms
    groupRef.current.rotation.y = sceneRotationY.get();
    const currentScale = sphereScale.get();
    sphereRef.current.scale.set(currentScale, currentScale, currentScale);
    
    const rScale = ringScale.get();
    ring1Ref.current.scale.set(rScale, rScale, rScale);
    ring2Ref.current.scale.set(rScale, rScale, rScale);
    ring3Ref.current.scale.set(rScale, rScale, rScale);

    // Apply color transform
    sphereRef.current.material.emissive.set(sphereEmissive.get());

    // Apply camera Z (simulate zoom by moving the group)
    // The previous motion.group did position-z={4 - v}. We will do exactly that.
    const camZ = transforms.cameraZ.get();
    groupRef.current.position.z = 4 - camZ;

    // Idle animations
    sphereRef.current.rotation.y += 0.002;
    ring1Ref.current.rotation.z += 0.003;
    ring2Ref.current.rotation.x += 0.002;
    ring3Ref.current.rotation.y -= 0.001;
    particlesRef.current.rotation.y += 0.0005;
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 64]}>
        <meshPhongMaterial 
          color="#1a0505" 
          emissive="#300808" 
          transparent 
          opacity={0.9} 
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[1.04, 32, 32]}>
        <meshBasicMaterial 
          color="#e63a2e" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </Sphere>

      {/* Orbital ring 1 */}
      <Torus ref={ring1Ref} args={[1.3, 0.008, 16, 100]}>
        <meshPhongMaterial color="#e63a2e" emissive="#e63a2e" />
      </Torus>

      {/* Orbital ring 2 */}
      <Torus ref={ring2Ref} args={[1.5, 0.005, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshPhongMaterial color="#ff5533" transparent opacity={0.6} />
      </Torus>

      {/* Orbital ring 3 */}
      <Torus ref={ring3Ref} args={[1.7, 0.004, 16, 100]} rotation={[-Math.PI / 6, 0, 0]}>
        <meshPhongMaterial color="#b41e14" transparent opacity={0.4} />
      </Torus>

      {/* Particles */}
      <Points ref={particlesRef} positions={positions}>
        <PointMaterial 
          transparent 
          color="#e63a2e" 
          size={0.012} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.5}
        />
      </Points>
    </group>
  );
};
