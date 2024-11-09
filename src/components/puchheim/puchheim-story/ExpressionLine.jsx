import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const ExpressionLine = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-77.035, 38.875],
      zoom: 12
    });

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            coordinates: [
              [-77.044211, 38.852924],
              [-77.045659, 38.860158],
              [-77.044232, 38.862326],
              [-77.040879, 38.865454],
              [-77.039936, 38.867698],
              [-77.040338, 38.86943],
              [-77.04264, 38.872528],
              [-77.03696, 38.878424],
              [-77.032309, 38.87937],
              [-77.030056, 38.880945],
              [-77.027645, 38.881779],
              [-77.026946, 38.882645],
              [-77.026942, 38.885502],
              [-77.028054, 38.887449],
              [-77.02806, 38.892088],
              [-77.03364, 38.892108],
              [-77.033643, 38.899926]
            ],
            type: 'LineString'
          }
        }
      ]
    };

    mapRef.current.on('load', () => {
      mapRef.current.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: geojson
      });

      mapRef.current.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
          'line-color': 'red',
          'line-width': 14,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'blue',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red'
          ]
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: '100%' }}></div>;
};

export default ExpressionLine;