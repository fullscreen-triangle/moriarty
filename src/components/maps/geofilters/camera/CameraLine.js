import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CameraLine = ({ geojsonUrl, mapboxToken, style = 'mapbox://styles/mapbox/satellite-v9', lineColor = 'yellow', lineOpacity = 0.75, lineWidth = 5, animationSpeed = 10 }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(geojsonUrl);
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      }
    };

    fetchGeoJson();
  }, [geojsonUrl]);

  useEffect(() => {
    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) return;

    mapboxgl.accessToken = mapboxToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: style,
      zoom: 17.5,
      center: [11.3563807681,48.1835031509],
      pitch: 60,
      bearing: 45,
    });

    mapRef.current.on('load', () => {
      // Extract coordinates from all features
      const coordinates = geojsonData.features.map(feature => feature.geometry.coordinates);
      
      const data = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [coordinates[0]]
          }
        }]
      };

      mapRef.current.addSource('trace', { type: 'geojson', data: data });
      mapRef.current.addLayer({
        id: 'trace',
        type: 'line',
        source: 'trace',
        paint: {
          'line-color': lineColor,
          'line-opacity': lineOpacity,
          'line-width': lineWidth
        }
      });

      mapRef.current.on('style.load', () => {
        mapRef.current.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 18
        });
  
        mapRef.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      });

      // Set initial camera position
      mapRef.current.jumpTo({ center: coordinates[0], zoom: 17.5 });
      mapRef.current.setPitch(30);

      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
          // Add next coordinate to the line
          data.features[0].geometry.coordinates.push(coordinates[i]);
          mapRef.current.getSource('trace').setData(data);

          // Animate camera
          mapRef.current.easeTo({
            center: coordinates[i],
            duration: animationSpeed,
            easing: (t) => t
          });

          i++;
        } else {
          window.clearInterval(timer);
        }
      }, animationSpeed);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [geojsonData, mapboxToken, style, lineColor, lineOpacity, lineWidth, animationSpeed]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default CameraLine;