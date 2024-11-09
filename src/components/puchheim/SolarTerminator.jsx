'use client'
import React, {useState, useEffect, useRef} from "react"
import * as THREE from 'three';
import * as solar from 'solar-calculator';
import Globe from 'react-globe.gl';

 

  const VELOCITY = 0.5; // minutes per frame

  const solarMaterial = new THREE.MeshLambertMaterial({ color: '#ffff00', opacity: 0.3, transparent: true });

  const sunPosAt = dt => {
    const day = new Date(+dt).setUTCHours(0, 0, 0, 0);
    const t = solar.century(dt);
    const longitude = (day - dt) / 864e5 * 360 - 180;
    return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
  };

  const SolarTerminator = () => {
    const [dt, setDt] = useState(+new Date());
    const globeRef = useRef();

    useEffect(() => {
      (function iterateTime() {
        setDt(dt => dt + VELOCITY * 60 * 1000);
        requestAnimationFrame(iterateTime);
      })();
    }, []);

    return <Globe
       ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      tilesData={[{ pos: sunPosAt(dt) }]}
      tileLng={d => d.pos[0]}
      tileLat={d => d.pos[1]}
      tileAltitude={0.005}
      tileWidth={180}
      tileHeight={180}
      tileUseGlobeProjection={false}
      tileMaterial={() => solarMaterial}
      tilesTransitionDuration={0}
    />;
  };

  export default SolarTerminator;


