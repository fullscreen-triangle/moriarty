"use client"
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import scrollama from 'scrollama';
import "mapbox-gl/dist/mapbox-gl.css";

const Chapter = ({ chapter, isActive }) => {
  return (
    <div className={`step ${isActive ? 'active' : ''}`} id={chapter.id}>
      <div className={chapter.theme || 'light'}>
        <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
        {chapter.image && <img src={chapter.image} alt={chapter.title} className="mb-2" />}
        <p>{chapter.description}</p>
      </div>
    </div>
  );
};

const AnimatedStory = ({ config }) => {
  const mapContainer = useRef(null);
  const storyContainer = useRef(null);
  const mapRef = useRef(null);
  const scrollerRef = useRef(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    // Load route data
    const loadFiles = [
      fetch("/maps/puchheim_track.geojson").then(res => res.json()),
      fetch("/maps/puchheim_camera.geojson").then(res => res.json())
    ];

    Promise.all(loadFiles).then(([trackData, cameraData]) => {
      const targetRoute = trackData.features[0].geometry.coordinates.reverse();
      const cameraRoute = cameraData.features[0].geometry.coordinates.reverse();
      
      // Initialize map
      mapboxgl.accessToken = config.accessToken;
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: config.style,
        center: config.chapters[0].location.center,
        zoom: config.chapters[0].location.zoom,
        bearing: config.chapters[0].location.bearing,
        pitch: config.chapters[0].location.pitch,
        interactive: false
      });

      // Set up terrain and sky
      mapRef.current.on('load', () => {
        mapRef.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512
        });
        mapRef.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
        
        mapRef.current.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15
          }
        });

        // Add route line
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: targetRoute
            }
          }
        });

        mapRef.current.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ffffff",
            "line-opacity": 0.7,
            "line-width": 4
          }
        });
      });

      // Initialize scrollama
      scrollerRef.current = scrollama();

      const handleStepProgress = (response) => {
        const chapter = config.chapters[response.index];
        const progress = response.progress;

        // Calculate camera position based on progress
        const routeLength = turf.length(turf.lineString(targetRoute));
        const cameraRouteLength = turf.length(turf.lineString(cameraRoute));
        
        const alongRoute = turf.along(
          turf.lineString(targetRoute),
          routeLength * progress
        ).geometry.coordinates;

        const alongCamera = turf.along(
          turf.lineString(cameraRoute),
          cameraRouteLength * progress
        ).geometry.coordinates;

        // Update camera position
        const cameraAltitude = 7800 + (progress * 5000);
        const camera = mapRef.current.getFreeCameraOptions();
        
        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
          {
            lng: alongCamera[0],
            lat: alongCamera[1]
          },
          cameraAltitude
        );

        camera.lookAtPoint({
          lng: alongRoute[0],
          lat: alongRoute[1]
        });

        mapRef.current.setFreeCameraOptions(camera);
      };

      const handleStepEnter = (response) => {
        const chapter = config.chapters[response.index];
        setActiveChapterIndex(response.index);

        // Handle layer opacity changes
        if (chapter.onChapterEnter.length > 0) {
          chapter.onChapterEnter.forEach(({ layer, opacity }) => {
            mapRef.current.setPaintProperty(layer, `${layer}-opacity`, opacity);
          });
        }
      };

      const handleStepExit = (response) => {
        const chapter = config.chapters[response.index];
        if (chapter.onChapterExit.length > 0) {
          chapter.onChapterExit.forEach(({ layer, opacity }) => {
            mapRef.current.setPaintProperty(layer, `${layer}-opacity`, opacity);
          });
        }
      };

      // Set up scrollama
      scrollerRef.current
        .setup({
          step: '.step',
          offset: 0.5,
          progress: true
        })
        .onStepProgress(handleStepProgress)
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

      // Handle window resize
      window.addEventListener('resize', scrollerRef.current.resize);

      return () => {
        window.removeEventListener('resize', scrollerRef.current.resize);
        if (mapRef.current) mapRef.current.remove();
        if (scrollerRef.current) scrollerRef.current.destroy();
      };
    });
  }, [config]);

  return (
    <div>
      <div ref={mapContainer} style={{ position: 'fixed', width: '100%', height: '100vh' }} />
      <div id="story" ref={storyContainer}>
        <div id="features">
          {config.chapters.map((chapter, idx) => (
            <Chapter
              key={chapter.id}
              chapter={chapter}
              isActive={idx === activeChapterIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedStory;