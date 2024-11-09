'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 30,
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg';

const OlympicsDashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [athletesData, setAthletesData] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch athletes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/json/senior/senior_men_400_hundred_indices.json');
        const data = await response.json();
        setAthletesData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animation control
  useEffect(() => {
    let animationFrame;
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prevTime) => (prevTime + 1) % 100);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  // Transform athletes data into GeoJSON features
  const createGeoJsonFeatures = () => {
    return Object.entries(athletesData).map(([name, data]) => ({
      type: 'Feature',
      geometry: data.athlete_info.geometry,
      properties: {
        name,
        ...data.athlete_info,
        additional_metrics: data.additional_metrics
      }
    }));
  };

  // Create GeoJSON layer
  const geoJsonLayer = new GeoJsonLayer({
    id: 'countries',
    data: {
      type: 'FeatureCollection',
      features: createGeoJsonFeatures()
    },
    stroked: true,
    filled: true,
    lineWidthMinPixels: 1,
    getFillColor: d => {
      const medal = d.properties.Medal;
      switch(medal) {
        case "1": return [255, 215, 0, 150]; // Gold
        case "2": return [192, 192, 192, 150]; // Silver
        case "3": return [205, 127, 50, 150]; // Bronze
        default: return [200, 200, 200, 100];
      }
    },
    getLineColor: [80, 80, 80],
    getLineWidth: 1,
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        console.log('Clicked athlete:', info.object.properties.name);
      }
    }
  });

  const layers = [geoJsonLayer];

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg">Loading data...</div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg text-red-500">{error}</div>
    </div>
  );

  // Get metrics from the first athlete
  const firstAthlete = Object.values(athletesData)[0] || { additional_metrics: {} };
  const metrics = Object.entries(firstAthlete.additional_metrics || {});

  // Create metric data distribution including all athletes
  const createMetricData = (metricName) => {
    const allValues = Object.values(athletesData).map(athlete => 
      athlete.additional_metrics[metricName]
    ).filter(Boolean);

    // Sort values for distribution
    const sortedValues = [...allValues].sort((a, b) => a - b);
    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];
    
    // Create distribution points
    return Array(10).fill(0).map((_, i) => ({
      time: i,
      value: min + (max - min) * (i / 9),
      // Add reference lines for medal winners
      goldValue: Object.values(athletesData).find(a => a.athlete_info.Medal === "1")?.additional_metrics[metricName],
      silverValue: Object.values(athletesData).find(a => a.athlete_info.Medal === "2")?.additional_metrics[metricName],
      bronzeValue: Object.values(athletesData).find(a => a.athlete_info.Medal === "3")?.additional_metrics[metricName],
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Map section */}
      <div className="w-1/2 relative">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
        >
          <Map
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v10"
          />
        </DeckGL>
        
        {/* Controls overlay */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/90 transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Timeline slider */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg p-2">
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Metrics section */}
      <div className="w-1/2 overflow-y-auto p-4 grid grid-cols-2 gap-4 bg-white/50">
        {metrics.map(([metric]) => (
          <div 
            key={metric} 
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4"
          >
            <div className="text-sm font-medium mb-2">{metric}</div>
            <div className="h-32">
              <LineChart 
                width={300} 
                height={120} 
                data={createMetricData(metric)}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  dot={false} 
                />
                {/* Reference lines for medal winners */}
                <Line 
                  type="monotone" 
                  dataKey="goldValue" 
                  stroke="#FFD700" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="silverValue" 
                  stroke="#C0C0C0" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="bronzeValue" 
                  stroke="#CD7F32" 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OlympicsDashboard;