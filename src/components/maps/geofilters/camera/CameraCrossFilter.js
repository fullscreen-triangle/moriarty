import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import { ChartContext, BarChart, LineChart, BubbleChart, PieChart } from 'react-dc-js';

const numberFormat = d3.format('.2f');

const CameraCrossFilter = ({ data, mapboxToken, style = 'mapbox://styles/mapbox/outdoors-v11', lineColor = 'red', lineOpacity = 0.75, lineWidth = 3 }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [cx, setCx] = useState(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      setError("No data available");
      return;
    }

    if (!data[0].geometry || !data[0].geometry.coordinates) {
      setError("Invalid data format");
      return;
    }

    if (!mapboxgl.supported()) {
      setError("Your browser does not support Mapbox GL");
      return;
    }

    try {
      // Initialize crossfilter
      const cxData = crossfilter(data);
      setCx(cxData);

      // Initialize Mapbox
      mapboxgl.accessToken = mapboxToken;
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: data[0].geometry.coordinates,
        zoom: 14
      });

      newMap.on('load', () => {
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
            'line-color': lineColor,
            'line-opacity': lineOpacity,
            'line-width': lineWidth
          }
        });

        // Add a moving point
        newMap.addSource('point', {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: data[0].geometry.coordinates
          }
        });

        newMap.addLayer({
          id: 'point',
          type: 'circle',
          source: 'point',
          paint: {
            'circle-radius': 6,
            'circle-color': '#007cbf'
          }
        });

        // Set map bounds
        const coordinates = data.map(d => d.geometry.coordinates);
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        newMap.fitBounds(bounds, { padding: 50 });
      });

      setMap(newMap);
    } catch (err) {
      setError(`Error initializing map: ${err.message}`);
    }

    return () => map && map.remove();
  }, [data, mapboxToken, style, lineColor, lineOpacity, lineWidth]);

  const updateMapPosition = (index) => {
    if (map && data[index] && data[index].geometry) {
      const point = {
        type: 'Point',
        coordinates: data[index].geometry.coordinates
      };
      map.getSource('point').setData(point);
      map.easeTo({
        center: data[index].geometry.coordinates,
        duration: 1000
      });
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!cx || !data || data.length === 0) return <div>Loading...</div>;

  // Dimensions and groups
  const timeDimension = cx.dimension(d => new Date(d.properties.timestamp));
  const speedGroup = timeDimension.group().reduceSum(d => d.properties.speed);
  const altitudeDimension = cx.dimension(d => d.properties.altitude);
  const altitudeGroup = altitudeDimension.group().reduceCount();
  const cadenceDimension = cx.dimension(d => d.properties.cadence);
  const heartRateDimension = cx.dimension(d => d.properties.heart_rate);
  const bubbleGroup = timeDimension.group().reduce(
    (p, v) => {
      p.speed = v.properties.speed;
      p.heartRate = v.properties.heart_rate;
      p.cadence = v.properties.cadence;
      return p;
    },
    (p, v) => p,
    () => ({ speed: 0, heartRate: 0, cadence: 0 })
  );
  
  const lapDimension = cx.dimension(d => d.properties.lap);
  const lapGroup = lapDimension.group().reduceCount();


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div ref={mapContainerRef} style={{ flex: 1 }} />
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
          onBrush={(range) => {
            if (range) {
              const index = data.findIndex(d => new Date(d.properties.timestamp) >= range[0]);
              setCurrentPointIndex(index);
              updateMapPosition(index);
            }
          }}
        />
        <LineChart
          dimension={timeDimension}
          group={altitudeGroup}
          x={d3.scaleTime().domain(d3.extent(data, d => new Date(d.properties.timestamp)))}
          renderArea={true}
          brushOn={false}
          title="Altitude over Time"
          yAxisLabel="Altitude (m)"
          xAxisLabel="Time"
          height={200}
        />
        <BubbleChart
          dimension={timeDimension}
          group={bubbleGroup}
          x={d3.scaleTime().domain(d3.extent(data, d => new Date(d.properties.timestamp)))}
          y={d3.scaleLinear().domain([0, d3.max(data, d => d.properties.heart_rate)])}
          r={d3.scaleLinear().domain([0, 100])}
          elasticY={true}
          elasticX={true}
          renderHorizontalGridLines={true}
          renderVerticalGridLines={true}
          xAxisLabel="Time"
          yAxisLabel="Heart Rate"
          title={d => `${d.key.toLocaleString()}\nSpeed: ${numberFormat(d.value.speed)}\nHeart Rate: ${d.value.heartRate}\nCadence: ${d.value.cadence}`}
          keyAccessor={p => p.key}
          valueAccessor={p => p.value.heartRate}
          radiusValueAccessor={p => p.value.cadence}
          maxBubbleRelativeSize={0.1}
          height={250}
        />
        <PieChart
          dimension={lapDimension}
          group={lapGroup}
          width={300}
          height={300}
          radius={120}
          innerRadius={40}
        />
      </ChartContext>
    </div>
  );
};

export default CameraCrossFilter;