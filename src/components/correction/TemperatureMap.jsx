import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const TemperatureMap = () => {
  const mapContainerRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 0,
      center: [0, 0],
      projection: 'mercator'
    });

    map.on('load', () => {
      map.addSource('gfs-temperature', {
        type: 'raster-array',
        url: 'mapbox://mapbox.gfs-temperature',
        tileSize: 256
      });

      map.addLayer({
        id: 'gfs-temperature-layer',
        type: 'raster',
        source: 'gfs-temperature',
        'source-layer': '2t',
        paint: {
          'raster-color-range': [204, 323],
          'raster-array-band': '3',
          'raster-color': [
            'interpolate',
            ['linear'],
            ['raster-value'],
            204,
            '#50509B',
            266,
            '#FAFAA0',
            323,
            '#96053C'
          ],
          'raster-resampling': 'nearest'
        }
      });

      // Fetch and add points with the updated data structure
      fetch('/api/points')
        .then(response => response.json())
        .then(data => {
          // Create markers for each point
          data.forEach(record => {
            // Create a popup with record information
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<div class="p-2">
                  <h3 class="font-bold">${record.Name}</h3>
                  <p>Time: ${record.Time}</p>
                  <p>Date: ${record.Date}</p>
                  <p>Country: ${record.Country}</p>
                  <p>Weather: ${record.weather[0].description}</p>
                </div>`
              );

            // Create and add the marker
            const marker = new mapboxgl.Marker()
              .setLngLat([record.coord.lon, record.coord.lat])
              .setPopup(popup)
              .addTo(map);

            setMarkers(prev => [...prev, marker]);
          });

          // Fit the map to show all markers
          const bounds = new mapboxgl.LngLatBounds();
          data.forEach(record => {
            bounds.extend([record.coord.lon, record.coord.lat]);
          });
          map.fitBounds(bounds, { padding: 50 });
        })
        .catch(error => {
          console.error('Error loading points:', error);
        });
    });

    // Cleanup function
    return () => {
      markers.forEach(marker => marker.remove());
      map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-screen" />;
};

export default TemperatureMap;