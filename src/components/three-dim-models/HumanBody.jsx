import React, { useRef, useEffect, Suspense } from 'react'
import { useGLTF, useAnimations, Environment, Center } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";


 function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/full_human_body_explosion.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions['Animation'].play();
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="1095_01_200K_0" position={[0, 0.595, 0]} rotation={[1.613, 0, -0.123]}>
                <mesh
                  name="Object_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_4.geometry}
                  material={materials['1095_01_200K']}
                />
                <mesh
                  name="Object_5"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_5.geometry}
                  material={materials['1095_01_200K']}
                />
              </group>
              <group
                name="1095_02_100K_1"
                position={[-0.042, 1.409, 0.045]}
                rotation={[2.032, 0.139, 0.169]}>
                <mesh
                  name="Object_7"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_7.geometry}
                  material={materials['1095_02_100K']}
                />
              </group>
              <group
                name="1095_03_100K_2"
                position={[0.005, 1.064, 0.107]}
                rotation={[3.065, -0.807, 1.491]}
                scale={1.042}>
                <mesh
                  name="Object_9"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_9.geometry}
                  material={materials['1095_03_100K']}
                />
              </group>
              <group
                name="1095_04_50K_3"
                position={[-0.251, 1.355, 0.231]}
                rotation={[0.237, 1.255, -0.883]}
                scale={1.019}>
                <mesh
                  name="Object_11"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_11.geometry}
                  material={materials['1095_04_50K']}
                />
              </group>
              <group
                name="1095_05_50K_4"
                position={[0.199, 0.906, -0.023]}
                rotation={[1.131, 1.072, 1.92]}>
                <mesh
                  name="Object_13"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_13.geometry}
                  material={materials['1095_05_50K']}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/full_human_body_explosion.glb')

const HumanBody = () => {

    return (
     
        <Canvas shadows className='animate-[fade-in_1s_ease_0.3s_forwards]'>
          <directionalLight intensity={0.5} />
          <ambientLight intensity={0.5} />
            <Suspense fallback={null}>
            <Environment files="/environments/potsdamer_platz_1k.hdr" />
            <Center>
              <Model scale={2} />
              </Center>
            </Suspense>
        </Canvas>
 
    );
  };
  
  
  
  export default HumanBody;
