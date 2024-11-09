import React, { useRef, useEffect, Suspense } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";

 function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/highly_detailed_modular_smartphone.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions['Scene'].play();
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="PHONE30fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="PhoneFrame" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh
                    name="PhoneFrame_PhoneBase_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.PhoneFrame_PhoneBase_0.geometry}
                    material={materials.PhoneBase}
                  />
                  <mesh
                    name="PhoneFrame_contactsyellow_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.PhoneFrame_contactsyellow_0.geometry}
                    material={materials.contactsyellow}
                  />
                  <group
                    name="BackGlass"
                    position={[0.062, 0, 0]}
                    rotation={[-Math.PI, -Math.PI / 2, 0]}>
                    <mesh
                      name="BackGlass_Glass_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.BackGlass_Glass_0.geometry}
                      material={materials.Glass}
                    />
                    <mesh
                      name="BackGlass_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.BackGlass_PhoneBase_0.geometry}
                      material={materials.PhoneBase}
                    />
                    <group
                      name="Camera"
                      position={[-0.062, -0.016, 0.063]}
                      rotation={[-Math.PI, -Math.PI / 2, 0]}>
                      <mesh
                        name="Camera_BlackPlastic_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Camera_BlackPlastic_0.geometry}
                        material={materials.BlackPlastic}
                      />
                      <group name="FrontCameraLens001" position={[0.004, 0, 0]}>
                        <mesh
                          name="FrontCameraLens001_LensGlass_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.FrontCameraLens001_LensGlass_0.geometry}
                          material={materials.LensGlass}
                        />
                        <mesh
                          name="FrontCameraLens001_Glass_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.FrontCameraLens001_Glass_0.geometry}
                          material={materials.Glass}
                        />
                      </group>
                    </group>
                    <group
                      name="Camera002"
                      position={[-0.062, -0.025, 0.063]}
                      rotation={[-Math.PI, -Math.PI / 2, 0]}>
                      <mesh
                        name="Camera002_BlackPlastic_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Camera002_BlackPlastic_0.geometry}
                        material={materials.BlackPlastic}
                      />
                      <group name="FrontCameraLens002" position={[0.004, 0, 0]}>
                        <mesh
                          name="FrontCameraLens002_LensGlass_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.FrontCameraLens002_LensGlass_0.geometry}
                          material={materials.LensGlass}
                        />
                        <mesh
                          name="FrontCameraLens002_Glass_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.FrontCameraLens002_Glass_0.geometry}
                          material={materials.Glass}
                        />
                      </group>
                    </group>
                    <group
                      name="Camera003"
                      position={[-0.062, -0.008, 0.061]}
                      rotation={[-Math.PI, -Math.PI / 2, 0]}
                      scale={0.558}>
                      <mesh
                        name="Camera003_BlackPlastic_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.Camera003_BlackPlastic_0.geometry}
                        material={materials.BlackPlastic}
                      />
                      <group
                        name="Flashlight"
                        position={[0.003, 0, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={[0.896, 0.896, 0.179]}>
                        <mesh
                          name="Flashlight_flash_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.Flashlight_flash_0.geometry}
                          material={materials.flash}
                        />
                      </group>
                    </group>
                  </group>
                  <group
                    name="FrontGlass"
                    position={[0.056, 0, 0]}
                    rotation={[-Math.PI, -Math.PI / 2, 0]}>
                    <mesh
                      name="FrontGlass_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.FrontGlass_PhoneBase_0.geometry}
                      material={materials.PhoneBase}
                    />
                    <mesh
                      name="FrontGlass_Screen_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.FrontGlass_Screen_0.geometry}
                      material={materials.Screen}
                    />
                  </group>
                  <group
                    name="FrontCamera001"
                    position={[0, -0.021, 0.071]}
                    rotation={[-Math.PI, -Math.PI / 2, 0]}>
                    <mesh
                      name="FrontCamera001_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.FrontCamera001_PhoneBase_0.geometry}
                      material={materials.PhoneBase}
                    />
                    <mesh
                      name="FrontCamera001_Glass_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.FrontCamera001_Glass_0.geometry}
                      material={materials.Glass}
                    />
                    <group
                      name="FrontCameraLens"
                      position={[-0.001, -0.003, 0.001]}
                      scale={[1, 1, 0.266]}>
                      <mesh
                        name="FrontCameraLens_LensGlass_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.FrontCameraLens_LensGlass_0.geometry}
                        material={materials.LensGlass}
                      />
                      <mesh
                        name="FrontCameraLens_PhoneBase_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.FrontCameraLens_PhoneBase_0.geometry}
                        material={materials.PhoneBase}
                      />
                    </group>
                  </group>
                  <group name="SimCard" position={[0, 0.035, 0.05]} rotation={[0, 0, -Math.PI]}>
                    <mesh
                      name="SimCard_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.SimCard_PhoneBase_0.geometry}
                      material={materials.PhoneBase}
                    />
                    <mesh
                      name="SimCard_RedAccent_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.SimCard_RedAccent_0.geometry}
                      material={materials.RedAccent}
                    />
                  </group>
                  <group
                    name="Lautst��rke"
                    position={[0, 0.001, 0]}
                    rotation={[-Math.PI, -Math.PI / 2, 0]}>
                    <mesh
                      name="Lautst��rke_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes['Lautst��rke_PhoneBase_0'].geometry}
                      material={materials.PhoneBase}
                    />
                  </group>
                  <group
                    name="OnOff"
                    position={[0, 0.001, 0]}
                    rotation={[-Math.PI, -Math.PI / 2, 0]}>
                    <mesh
                      name="OnOff_PhoneBase_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.OnOff_PhoneBase_0.geometry}
                      material={materials.PhoneBase}
                    />
                    <mesh
                      name="OnOff_RedAccent_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.OnOff_RedAccent_0.geometry}
                      material={materials.RedAccent}
                    />
                  </group>
                  <group name="Battery" position={[0, -0.011, 0]}>
                    <mesh
                      name="Battery_BatterySilver_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Battery_BatterySilver_0.geometry}
                      material={materials.BatterySilver}
                    />
                    <mesh
                      name="Battery_SUMSANG_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Battery_SUMSANG_0.geometry}
                      material={materials.SUMSANG}
                    />
                    <mesh
                      name="Battery_contactsyellow_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Battery_contactsyellow_0.geometry}
                      material={materials.contactsyellow}
                    />
                  </group>
                  <group name="Mainboard" position={[0, 0, 0.001]} rotation={[0, Math.PI / 2, 0]}>
                    <mesh
                      name="Mainboard_CircuitBoardTexture_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Mainboard_CircuitBoardTexture_0.geometry}
                      material={materials.CircuitBoardTexture}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/highly_detailed_modular_smartphone.glb')


const Smartphone = () => {

    return (
     
        <Canvas shadows dpr={[1, 2]} eventPrefix="client" camera={{ position: [0, 0, 4], fov: 40 }} className='opacity-0 touch-none animate-[fade-in_1s_ease_0.3s_forwards]'>
          <directionalLight intensity={0.5} />
          <ambientLight intensity={0.5} />
            <Suspense fallback={null}>
              <Model scale={0.5} />
            </Suspense>
        </Canvas>
 
    );
  };
  
  
  
  export default Smartphone;