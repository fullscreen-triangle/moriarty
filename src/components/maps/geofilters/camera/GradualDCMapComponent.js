import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import { ChartContext, BarChart } from 'react-dc-js';

const GradualDCMapComponent = ({ data, mapboxToken, style = 'mapbox://styles/mapbox/outdoors-v11' }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [cx, setCx] = useState(null);
  const [error, setError] = useState(null);

  const initializeMap = useCallback(() => {
    if (!mapboxToken) {
      setError("Mapbox token is required");
      return;
    }

    if (!mapboxgl.supported()) {
      setError("Your browser does not support Mapbox GL");
      return;
    }

    if (!data || data.length === 0) {
      setError("No data available");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: style,
      center: data[0].geometry.coordinates,
      zoom: 14
    });

    newMap.on("load", () => {
      setMap(newMap);
      newMap.resize();

      // Add the route source and layer
      newMap.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: data.map(d => d.geometry.coordinates)
          }
        }
      });

      newMap.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'red',
          'line-opacity': 0.75,
          'line-width': 3
        }
      });

      // Set map bounds
      const coordinates = data.map(d => d.geometry.coordinates);
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      newMap.fitBounds(bounds, { padding: 50 });
    });

    // Initialize crossfilter
    const cxData = crossfilter(data);
    setCx(cxData);
  }, [data, mapboxToken, style]);

  useEffect(() => {
    if (!map) {
      initializeMap();
    }

    return () => map && map.remove();
  }, [map, initializeMap]);

  if (error) return <div>Error: {error}</div>;
  if (!cx || !map) return <div>Loading...</div>;

  // Crossfilter dimensions and groups
  const timeDimension = cx.dimension(d => new Date(d.properties.timestamp));
  const speedGroup = timeDimension.group().reduceSum(d => d.properties.speed);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'rgba(255, 255, 255, 0.7)' }}>
        <ChartContext>
          <BarChart
            dimension={timeDimension}
            group={speedGroup}
            x={d3.scaleTime().domain(d3.extent(data, d => new Date(d.properties.timestamp)))}
            renderHorizontalGridLines={true}
            elasticY={true}
            brushOn={true}
            title="Speed over Time"
            yAxisLabel="Speed (m/s)"
            xAxisLabel="Time"
            height={200}
          />
        </ChartContext>
      </div>
    </div>
  );
};

export default GradualDCMapComponent;