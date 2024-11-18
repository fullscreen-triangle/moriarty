
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/blood_supply_to_the_lower_limb.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.023, -0.008, -0.039]} rotation={[-1.536, 0.026, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-0.099, 1.237, -0.109]} rotation={[1.56, 0.016, 3.017]} scale={0.008}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_14.geometry}
              material={materials.Lowerlimbgrey_Bones___Vray}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_16.geometry}
              material={materials.Lowerlimbgrey_White___Vray}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_18.geometry}
              material={materials.Lowerlimbgrey_Brown___Vray}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_4.geometry}
            material={materials.brush_Marker}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_6.geometry}
            material={materials.brush_MatteHull}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_9.geometry}
            material={materials.brush_Icing}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_11.geometry}
            material={materials.brush_NeonPulse}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/blood_supply_to_the_lower_limb.glb')




