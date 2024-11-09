import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { TripsLayer } from '@deck.gl/geo-layers';
import { StaticMap } from 'react-map-gl';

// Mapbox configuration - you'll need to replace this with your actual token
const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_TOKEN';

const RaceAnimation = ({ athletes, trackGeojson }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Process athlete data to create timestamps
  const processAthleteData = (athlete) => {
    const { splits, lane, path } = athlete;
    // Convert splits to cumulative times in milliseconds
    const cumulativeTimes = splits.reduce((acc, split, index) => {
      const prevTime = index > 0 ? acc[index - 1] : 0;
      return [...acc, prevTime + split * 1000];
    }, []);
    
    // Create timestamps for each coordinate in the path
    const timestamps = [];
    const totalTime = cumulativeTimes[cumulativeTimes.length - 1];
    
    path.forEach((_, index) => {
      // Calculate progress through the race (0 to 1)
      const progress = index / (path.length - 1);
      // Find which split section we're in
      const splitIndex = Math.floor(progress * 4);
      
      // Interpolate time within the split section
      let timestamp;
      if (splitIndex === 0) {
        timestamp = progress * 4 * cumulativeTimes[0];
      } else {
        const sectionProgress = (progress * 4) % 1;
        const timeInSection = cumulativeTimes[splitIndex] - cumulativeTimes[splitIndex - 1];
        timestamp = cumulativeTimes[splitIndex - 1] + (sectionProgress * timeInSection);
      }
      timestamps.push(timestamp);
    });
    
    return {
      path,
      timestamps,
      lane,
      name: athlete.name,
      totalTime
    };
  };

  const layers = [
    new TripsLayer({
      id: 'race-animation',
      data: athletes.map(processAthleteData),
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => {
        // Assign different colors to each lane
        const colors = [
          [255, 0, 0],    // Red
          [0, 255, 0],    // Green
          [0, 0, 255],    // Blue
          [255, 255, 0],  // Yellow
          [255, 0, 255],  // Magenta
          [0, 255, 255],  // Cyan
          [255, 128, 0],  // Orange
          [128, 0, 255]   // Purple
        ];
        return colors[d.lane - 1] || [255, 255, 255];
      },
      opacity: 0.8,
      widthMinPixels: 4,
      rounded: true,
      trailLength: 0.1,  // Shorter trail for runner visualization
      currentTime: time,
    })
  ];

  // Animation control
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (isRunning) {
        setTime(t => {
          // Find the longest race time
          const maxTime = Math.max(...athletes.map(a => 
            a.splits.reduce((sum, split) => sum + split, 0) * 1000
          ));
          
          // Reset animation when reaching the end
          if (t >= maxTime) {
            return 0;
          }
          return t + 16.67; // Approximately 60fps
        });
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (isRunning) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning, athletes]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <DeckGL
        initialViewState={{
          latitude: trackGeojson.center[1],
          longitude: trackGeojson.center[0],
          zoom: 17,
          pitch: 45,
          bearing: 0
        }}
        controller={true}
        layers={layers}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'white',
          padding: '1rem',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              background: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => setTime(0)}
          >
            Reset
          </button>
          <div style={{ marginTop: '0.5rem' }}>
            Race Time: {(time / 1000).toFixed(2)}s
          </div>
        </div>
      </DeckGL>
    </div>
  );
};

export default RaceAnimation;