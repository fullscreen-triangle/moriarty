import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxSoldier = ({ 
  mapboxToken, 
  dataUrl,
  modelScale = 15 // Increased base scale for better visibility
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const tbRef = useRef(null);
  const soldierRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 18,
      pitch: 60,
      antialias: true,
      bearing: 0
    });

    // Add navigation control
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Initialize Threebox when style loads
    mapRef.current.on('style.load', () => {
      fetchDataAndInitialize();
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const fetchDataAndInitialize = async () => {
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error('Failed to fetch path data');
      const pathData = await response.json();

      // Set initial center to first coordinate
      const initialCenter = [pathData[0].longitude, pathData[0].latitude];
      mapRef.current.setCenter(initialCenter);

      initializeThreebox(pathData);
    } catch (error) {
      console.error('Error fetching path data:', error);
    }
  };

  const processPathData = (data) => {
    // Convert data array to coordinate path
    return data.map(point => [point.longitude, point.latitude, point.altitude]);
  };

  const calculateModelScale = (pathData) => {
    // Calculate scale based on altitude and speed
    // This is a simple example - you might want to adjust the formula
    const averageAltitude = pathData.reduce((sum, point) => sum + point.altitude, 0) / pathData.length;
    const maxSpeed = Math.max(...pathData.map(point => point.speed));
    
    // Base scale factor adjusted by altitude and speed
    const altitudeFactor = averageAltitude / 500; // Normalize by assuming 500m as baseline
    const speedFactor = maxSpeed > 0 ? maxSpeed / 10 : 1; // Normalize by assuming 10m/s as baseline
    
    return modelScale * (altitudeFactor + speedFactor) / 2;
  };

  const initializeThreebox = (pathData) => {
    mapRef.current.addLayer({
      id: 'custom_layer',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function (map, mbxContext) {
        // Initialize Threebox
        tbRef.current = new window.Threebox(
          map,
          mbxContext,
          { 
            defaultLights: true,
            enableTooltips: false
          }
        );

        const calculatedScale = calculateModelScale(pathData);
        
        // Load soldier model
        const options = {
          obj: '/models/soldier.glb', // Adjust path as needed
          type: 'gltf',
          scale: calculatedScale,
          units: 'meters',
          rotation: { x: 90, y: 0, z: 0 },
          anchor: 'center'
        };

        tbRef.current.loadObj(options, (model) => {
          const initialCoords = [pathData[0].longitude, pathData[0].latitude, pathData[0].altitude];
          soldierRef.current = model.setCoords(initialCoords);
          
          // Set wireframe mode
          soldierRef.current.wireframe = true;
          
          tbRef.current.add(soldierRef.current);

          // Process coordinates and animate
          const processedPath = processPathData(pathData);
          animateAlongPath(processedPath);
        });
      },
      render: function (gl, matrix) {
        tbRef.current?.update();
      }
    });
  };

  const animateAlongPath = (pathCoordinates) => {
    // Calculate duration based on path length and average speed
    const totalDistance = calculatePathDistance(pathCoordinates);
    const averageSpeed = 5; // meters per second - adjust as needed
    const duration = (totalDistance / averageSpeed) * 1000; // Convert to milliseconds

    const animationOptions = {
      path: pathCoordinates,
      duration: duration,
      animation: 1
    };

    soldierRef.current?.followPath(animationOptions);
    soldierRef.current?.playAnimation(animationOptions);
  };

  const calculatePathDistance = (coordinates) => {
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [x1, y1, z1] = coordinates[i - 1];
      const [x2, y2, z2] = coordinates[i];
      
      // Calculate 3D distance between points
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) + 
        Math.pow(y2 - y1, 2) + 
        Math.pow(z2 - z1, 2)
      );
      totalDistance += distance;
    }
    return totalDistance;
  };

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
};

export default MapboxSoldier;