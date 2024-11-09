import React, { useRef, useEffect, Suspense } from 'react'
import { useGLTF, useAnimations, Environment, Center } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";

 function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/upper-body-explosion.glb')
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
              <group name="2_kikanshi_0">
                <mesh
                  name="Object_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_4.geometry}
                  material={materials['Bronchi.002']}
                />
              </group>
              <group name="2_Hai_R2_1">
                <mesh
                  name="Object_6"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_6.geometry}
                  material={materials.Lung}
                />
              </group>
              <group name="2_Hai_L1_2">
                <mesh
                  name="Object_8"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_8.geometry}
                  material={materials.Lung}
                />
              </group>
              <group name="2_Hai_L2_3">
                <mesh
                  name="Object_10"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_10.geometry}
                  material={materials.Lung}
                />
              </group>
              <group name="2_kanzou2_4">
                <mesh
                  name="Object_12"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_12.geometry}
                  material={materials['Organ.002']}
                />
              </group>
              <group name="0_Doumyaku_5">
                <mesh
                  name="Object_14"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_14.geometry}
                  material={materials['Artery.001']}
                />
                <mesh
                  name="Object_15"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_15.geometry}
                  material={materials['Artery.001']}
                />
              </group>
              <group name="0_Jyoumyaku_6">
                <mesh
                  name="Object_17"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_17.geometry}
                  material={materials['Vein.001']}
                />
              </group>
              <group name="2_Hai_R3_7">
                <mesh
                  name="Object_19"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_19.geometry}
                  material={materials.Lung}
                />
              </group>
              <group name="2_kikanAndShokudou001_8">
                <mesh
                  name="Object_21"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_21.geometry}
                  material={materials['Mucosa.002']}
                />
                <mesh
                  name="Object_22"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_22.geometry}
                  material={materials['Intestine.002']}
                />
              </group>
              <group name="2_Hai_R1_9">
                <mesh
                  name="Object_24"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_24.geometry}
                  material={materials.Lung}
                />
              </group>
              <group name="3_HaiDou-Jyou_R_10">
                <mesh
                  name="Object_26"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_26.geometry}
                  material={materials['Vein.001']}
                />
                <mesh
                  name="Object_27"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_27.geometry}
                  material={materials['Artery.001']}
                />
              </group>
              <group name="3_HaiDou-Jyou_L_11">
                <mesh
                  name="Object_29"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_29.geometry}
                  material={materials['Vein.001']}
                />
                <mesh
                  name="Object_30"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_30.geometry}
                  material={materials['Artery.001']}
                />
              </group>
              <group name="1_Oukakumaku_12">
                <mesh
                  name="Object_32"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_32.geometry}
                  material={materials['Muscles.002']}
                />
              </group>
              <group name="Kikanshi_RETOPO_13">
                <mesh
                  name="Object_34"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_34.geometry}
                  material={materials.kikan_retopo}
                />
              </group>
              <group name="Heart_Integrated_14">
                <mesh
                  name="Object_36"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_36.geometry}
                  material={materials['Muscles.001']}
                />
                <mesh
                  name="Object_37"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_37.geometry}
                  material={materials['Ligament.001']}
                />
                <mesh
                  name="Object_38"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_38.geometry}
                  material={materials['Cartilage.001']}
                />
                <mesh
                  name="Object_39"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_39.geometry}
                  material={materials['Vein.001']}
                />
                <mesh
                  name="Object_40"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_40.geometry}
                  material={materials['Artery.001']}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/upper-body-explosion.glb');

const UpperBody = () => {

    return (
     
        <Canvas shadows className='animate-[fade-in_1s_ease_0.3s_forwards]'>
          <directionalLight intensity={0.5} />
          <ambientLight intensity={0.5} />
            <Suspense fallback={null}>
            <Environment files="/environments/potsdamer_platz_1k.hdr" />
            <Center>
              <Model scale={4} />
              </Center>
            </Suspense>
        </Canvas>
 
    );
  };
  
  
  
  export default UpperBody;

