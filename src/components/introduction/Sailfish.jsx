import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Center } from '@react-three/drei'

 function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/sailfish.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions['Armature|SwimFast'].play();
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="be133ff3ace04f48afa409d60f9ecd61fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name="Object_24"
                      geometry={nodes.Object_24.geometry}
                      material={materials.Material}
                      skeleton={nodes.Object_24.skeleton}
                    />
                    <group name="Object_23" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                  </group>
                </group>
                <group name="Sailfish" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/sailfish.glb')

const Sailfish = () => (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
      <Environment files="/environments/potsdamer_platz_1k.hdr" />
        <Center>
          <Model scale={2}/>
        </Center>
        </Suspense>
    </Canvas>
  )


  export default Sailfish