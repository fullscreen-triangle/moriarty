import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';

const DynamicApp = dynamic(() => import('@/modules/app.esm.dev.js'), {
  ssr: false,
});

function Scene() {
  const { scene, camera } = useThree();
  const appRef = useRef(null);

  useEffect(() => {
    if (!appRef.current) {
      appRef.current = new DynamicApp(scene, camera);
    }

    return () => {
      // Clean up if necessary
      if (appRef.current && appRef.current.dispose) {
        appRef.current.dispose();
      }
    };
  }, [scene, camera]);

  return null;
}

export default function PuchheimThreeGeo() {
  return (
    <Canvas>
      <Scene />
      <OrbitControls />
    </Canvas>
  );
}