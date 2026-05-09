import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OctGlobe } from './OctGlobe';
import { useScrollTransform } from '../../hooks/useScrollTransform';

export const ScrollScene = () => {
  const transforms = useScrollTransform();
  
  return (
    <div
      style={{
        position: 'fixed',
        right: '-5vw',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '55vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 0, 4] }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 4]} color="#e63a2e" intensity={2} />
        <Suspense fallback={null}>
          <OctGlobe transforms={transforms} />
        </Suspense>
      </Canvas>
    </div>
  );
};

