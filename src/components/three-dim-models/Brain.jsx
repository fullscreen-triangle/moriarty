import React, { useRef, useEffect, Suspense } from 'react'
import { useGLTF, useAnimations, Environment, Center } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";

function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/encefalo_humano.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    actions['Scene'].play();
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="f17553193e7943d7b29f9b0ed9b8c2bffbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="T��lamo001"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="T��lamo001_mtl1002_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['T��lamo001_mtl1002_0'].geometry}
                    material={materials['mtl1.002']}
                  />
                </group>
                <group
                  name="Tronco"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Tronco_mtl1003_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Tronco_mtl1003_0.geometry}
                    material={materials['mtl1.003']}
                  />
                </group>
                <group
                  name="Septum_Pel��cido"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Septum_Pel��cido_mtl1004_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Septum_Pel��cido_mtl1004_0'].geometry}
                    material={materials['mtl1.004']}
                  />
                </group>
                <group
                  name="Quiasma_��ptico"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Quiasma_��ptico_mtl1005_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Quiasma_��ptico_mtl1005_0'].geometry}
                    material={materials['mtl1.005']}
                  />
                </group>
                <group
                  name="Pedunculos_cerebrales"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Pedunculos_cerebrales_mtl1007_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Pedunculos_cerebrales_mtl1007_0.geometry}
                    material={materials['mtl1.007']}
                  />
                </group>
                <group
                  name="Nucleo_caudado"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Nucleo_caudado_mtl1008_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Nucleo_caudado_mtl1008_0.geometry}
                    material={materials['mtl1.008']}
                  />
                </group>
                <group
                  name="Materia_gris"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Materia_gris_mtl1009_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Materia_gris_mtl1009_0.geometry}
                    material={materials['mtl1.009']}
                  />
                  <mesh
                    name="Materia_gris_mtl1009_0_1"
                    castShadow
                    receiveShadow
                    geometry={nodes.Materia_gris_mtl1009_0_1.geometry}
                    material={materials['mtl1.009']}
                  />
                  <mesh
                    name="Materia_gris_mtl1009_0_2"
                    castShadow
                    receiveShadow
                    geometry={nodes.Materia_gris_mtl1009_0_2.geometry}
                    material={materials['mtl1.009']}
                  />
                  <mesh
                    name="Materia_gris_mtl1009_0_3"
                    castShadow
                    receiveShadow
                    geometry={nodes.Materia_gris_mtl1009_0_3.geometry}
                    material={materials['mtl1.009']}
                  />
                </group>
                <group
                  name="Materia_blanca"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Materia_blanca_mtl1010_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Materia_blanca_mtl1010_0.geometry}
                    material={materials['mtl1.010']}
                  />
                </group>
                <group
                  name="Hipofisis"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Hipofisis_mtl1011_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Hipofisis_mtl1011_0.geometry}
                    material={materials['mtl1.011']}
                  />
                </group>
                <group
                  name="Hipocampo"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Hipocampo_mtl1012_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Hipocampo_mtl1012_0.geometry}
                    material={materials['mtl1.012']}
                  />
                </group>
                <group
                  name="Gl��ndula_pineal"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Gl��ndula_pineal_mtl1013_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Gl��ndula_pineal_mtl1013_0'].geometry}
                    material={materials['mtl1.013']}
                  />
                </group>
                <group
                  name="Globo_p��lido"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Globo_p��lido_mtl1014_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Globo_p��lido_mtl1014_0'].geometry}
                    material={materials['mtl1.014']}
                  />
                </group>
                <group
                  name="F��rnix"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="F��rnix_mtl1015_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['F��rnix_mtl1015_0'].geometry}
                    material={materials['mtl1.015']}
                  />
                </group>
                <group
                  name="C��psula_interna_DER"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="C��psula_interna_DER_mtl1016_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['C��psula_interna_DER_mtl1016_0'].geometry}
                    material={materials['mtl1.016']}
                  />
                </group>
                <group
                  name="Cuerpos_Mamilares"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Cuerpos_Mamilares_mtl1017_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cuerpos_Mamilares_mtl1017_0.geometry}
                    material={materials['mtl1.017']}
                  />
                </group>
                <group
                  name="Cuerpo_Calloso"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Cuerpo_Calloso_mtl1018_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cuerpo_Calloso_mtl1018_0.geometry}
                    material={materials['mtl1.018']}
                  />
                </group>
                <group
                  name="Comisura_anterior"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Comisura_anterior_mtl1019_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Comisura_anterior_mtl1019_0.geometry}
                    material={materials['mtl1.019']}
                  />
                </group>
                <group
                  name="Cerebelo"
                  position={[721.305, 11475.103, -391.125]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Cerebelo_Material001_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cerebelo_Material001_0.geometry}
                    material={materials['Material.001']}
                  />
                </group>
                <group
                  name="Am��gdala"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Am��gdala_mtl1021_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Am��gdala_mtl1021_0'].geometry}
                    material={materials['mtl1.021']}
                  />
                </group>
                <group
                  name="Putamen_DER001"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Putamen_DER001_mtl1022_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Putamen_DER001_mtl1022_0.geometry}
                    material={materials['mtl1.022']}
                  />
                </group>
                <group
                  name="C��psula_interna001"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="C��psula_interna001_mtl1023_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['C��psula_interna001_mtl1023_0'].geometry}
                    material={materials['mtl1.023']}
                  />
                </group>
                <group
                  name="Globo_p��lido_DER"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Globo_p��lido_DER_mtl1024_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Globo_p��lido_DER_mtl1024_0'].geometry}
                    material={materials['mtl1.024']}
                  />
                </group>
                <group
                  name="Nucleo_caudado001"
                  position={[-0.583, 12925.58, -51.55]}
                  rotation={[-1.539, 0.008, -0.075]}
                  scale={100}>
                  <mesh
                    name="Nucleo_caudado001_mtl1025_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Nucleo_caudado001_mtl1025_0.geometry}
                    material={materials['mtl1.025']}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/encefalo_humano.glb')

const Brain = () => {

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
  
  
  
  export default Brain;