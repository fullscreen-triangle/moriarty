'use client'
import React, { useState, useEffect } from 'react';

const ElevationMap = () => {
  const [points, setPoints] = useState([]);
  const [elevationData, setElevationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Canvas settings
  const width = 800;
  const height = 400;
  const padding = 40;

  // Map projection settings
  const mapWidth = width - 2 * padding;
  const mapHeight = height - 2 * padding;
  
  // Convert longitude/latitude to x/y coordinates
  const projectPoint = (lon, lat) => {
    const x = ((lon + 180) / 360) * mapWidth + padding;
    const y = ((90 - lat) / 180) * mapHeight + padding;
    return [x, y];
  };

  // Get tile coordinates from lon/lat
  const getTileCoordinates = (lon, lat, zoom) => {
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return [x, y, zoom];
  };

  // Calculate elevation from RGB values
  const calculateElevation = (r, g, b) => {
    return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your JSON data here
        const response = await fetch('/json/senior/four_hunnad_weather.json');
        const data = await response.json();
        
        // Process the data to extract coordinates
        const processedPoints = data.map(entry => ({
          lon: entry.coord.lon,
          lat: entry.coord.lat,
          name: entry.Name,
          city: entry.City
        }));
        
        setPoints(processedPoints);
        
        // Fetch elevation data for each point
        const elevations = {};
        for (const point of processedPoints) {
          const [x, y, z] = getTileCoordinates(point.lon, point.lat, 8);
          try {
            const response = await fetch(
              `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg`
            );
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            ctx.drawImage(bitmap, 0, 0);
            
            const pixel = ctx.getImageData(0, 0, 1, 1).data;
            elevations[`${point.lon},${point.lat}`] = calculateElevation(pixel[0], pixel[1], pixel[2]);
          } catch (err) {
            console.error(`Error fetching elevation for point ${point.name}:`, err);
          }
        }
        
        setElevationData(elevations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const drawMap = (ctx) => {
    // Draw world map outline
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.rect(padding, padding, mapWidth, mapHeight);
    ctx.stroke();

    // Draw points with elevation-based colors
    points.forEach(point => {
      const [x, y] = projectPoint(point.lon, point.lat);
      const elevation = elevationData[`${point.lon},${point.lat}`] || 0;
      
      // Color based on elevation
      const normalizedElevation = (elevation + 10000) / 20000; // normalize to 0-1
      const hue = 240 * (1 - normalizedElevation); // blue to red
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${point.city} (${Math.round(elevation)}m)`, x + 8, y + 4);
    });
  };

  useEffect(() => {
    if (!loading && !error) {
      const canvas = document.getElementById('elevationMap');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      drawMap(ctx);
    }
  }, [loading, error, points, elevationData]);

  if (loading) return (
    <div className="flex items-center justify-center p-4">
      Loading elevation data...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center p-4 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="w-full max-w-4xl rounded-lg shadow-lg bg-white">
      <div className="p-4">
        <canvas
          id="elevationMap"
          width={width}
          height={height}
          className="border border-gray-200 rounded"
        />
        <div className="mt-4 text-sm text-gray-600">
          Points colored by elevation: Blue = low elevation, Red = high elevation
        </div>
      </div>
    </div>
  );
};

export default ElevationMap;