import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

const RouteOptimisation = ({ originalRoute, mapboxToken }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [metrics, setMetrics] = useState({
    originalDistance: 0,
    optimizedDistance: 0,
    similarity: 0,
  });

  // Convert line to points if needed
  const extractPoints = (geojson) => {
    if (geojson.type === 'Feature' && geojson.geometry.type === 'LineString') {
      // Sample points along the line at regular intervals
      const line = turf.lineString(geojson.geometry.coordinates);
      const length = turf.length(line);
      const pointsCount = Math.max(Math.floor(length * 10), 10); // 1 point per 100m, minimum 10 points
      return turf.featureCollection(
        Array.from({ length: pointsCount }, (_, i) => {
          const point = turf.along(line, (length * i) / (pointsCount - 1));
          return point;
        })
      );
    } else if (geojson.type === 'FeatureCollection') {
      return geojson;
    }
    throw new Error('Invalid GeoJSON format');
  };

  // Calculate route similarity using Fréchet distance
  const calculateSimilarity = (route1, route2) => {
    try {
      const line1 = turf.lineString(route1);
      const line2 = turf.lineString(route2);
      
      // Normalize both routes to have similar number of points
      const length1 = turf.length(line1);
      const length2 = turf.length(line2);
      const avgLength = (length1 + length2) / 2;
      const pointsCount = Math.floor(avgLength * 10);
      
      const points1 = Array.from({ length: pointsCount }, (_, i) => 
        turf.along(line1, (length1 * i) / (pointsCount - 1)).geometry.coordinates
      );
      const points2 = Array.from({ length: pointsCount }, (_, i) => 
        turf.along(line2, (length2 * i) / (pointsCount - 1)).geometry.coordinates
      );
      
      // Calculate average distance between corresponding points
      const totalDistance = points1.reduce((sum, p1, i) => {
        const p2 = points2[i];
        return sum + turf.distance(p1, p2);
      }, 0);
      
      // Convert to similarity percentage (inverse of average distance)
      const avgDistance = totalDistance / pointsCount;
      const similarity = Math.max(0, Math.min(100, (1 - avgDistance / 0.1) * 100));
      
      return similarity;
    } catch (error) {
      console.error('Error calculating similarity:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (!map.current && mapContainer.current && mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        zoom: 14
      });

      map.current.on('load', async () => {
        try {
          // Extract points from original route
          const points = extractPoints(originalRoute);
          
          // Fit map to points
          const bounds = turf.bbox(points);
          map.current.fitBounds(bounds, { padding: 50 });

          // Add original route source and layer
          map.current.addSource('original-route', {
            type: 'geojson',
            data: originalRoute
          });

          map.current.addLayer({
            id: 'original-route',
            type: 'line',
            source: 'original-route',
            paint: {
              'line-color': '#2563eb',
              'line-width': 4,
              'line-opacity': 0.7
            }
          });

          // Get coordinates for optimization
          const coordinates = points.features.map(point => 
            point.geometry.coordinates.join(',')
          ).join(';');

          // Get optimized route
          const response = await fetch(
            `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${coordinates}?overview=full&steps=true&geometries=geojson&source=first&destination=first&access_token=${mapboxToken}`
          );
          
          const data = await response.json();
          
          if (data.code !== 'Ok') {
            throw new Error(data.message);
          }

          const optimizedRoute = {
            type: 'Feature',
            properties: {},
            geometry: data.trips[0].geometry
          };

          // Add optimized route source and layer
          map.current.addSource('optimized-route', {
            type: 'geojson',
            data: optimizedRoute
          });

          map.current.addLayer({
            id: 'optimized-route',
            type: 'line',
            source: 'optimized-route',
            paint: {
              'line-color': '#dc2626',
              'line-width': 4,
              'line-opacity': 0.7
            }
          });

          // Calculate metrics
          const originalDistance = turf.length(originalRoute);
          const optimizedDistance = data.trips[0].distance / 1000;
          const similarity = calculateSimilarity(
            originalRoute.geometry.coordinates,
            optimizedRoute.geometry.coordinates
          );

          setMetrics({
            originalDistance: originalDistance.toFixed(2),
            optimizedDistance: optimizedDistance.toFixed(2),
            similarity: similarity.toFixed(1)
          });

        } catch (error) {
          console.error('Error setting up map:', error);
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [originalRoute, mapboxToken]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-600 rounded" />
            <span className="text-sm text-gray-700">Original Route: {metrics.originalDistance} km</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-600 rounded" />
            <span className="text-sm text-gray-700">Optimized Route: {metrics.optimizedDistance} km</span>
          </div>
          <div className="text-sm text-gray-700">
            Route Similarity: {metrics.similarity}%
          </div>
          <div className="text-sm text-gray-700">
            Distance Saved: {(metrics.originalDistance - metrics.optimizedDistance).toFixed(2)} km
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimisation;