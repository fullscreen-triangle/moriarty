'use client'
import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const FourHundredAthletes = ({ dataUrl }) => {
  const globeEl = useRef();
  const [athletes, setAthletes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [altitude] = useState(0.1);
  const [transitionDuration] = useState(1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl]);

  // Process athletes data to create a map of athletes per country
  const getAthletesPerCountry = () => {
    const countryMap = new Map();
    Object.values(athletes).forEach(athlete => {
      const noc = athlete.athlete_info.NOC;
      countryMap.set(noc, (countryMap.get(noc) || 0) + 1);
    });
    return countryMap;
  };

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.pointOfView({ altitude: 2.5 }, 5000);
    }
  }, []);

  const getPolygonColor = (feat) => {
    const athletesCount = getAthletesPerCountry();
    const countryCode = feat.properties?.ISO_A2;
    const count = athletesCount.get(countryCode) || 0;
    
    // Color intensity based on athlete count
    const intensity = Math.min(255, count * 50);
    return `rgba(${intensity}, 0, 0, 0.6)`;
  };

  // Function to parse geometry string into GeoJSON format
  const parseGeometry = (geometryStr) => {
    try {
      // Extract the coordinates from the MULTIPOLYGON string
      const coordsStr = geometryStr.replace('MULTIPOLYGON ', '');
      
      // Parse the nested coordinate arrays
      const parseCoordinates = (str) => {
        return str
          .replace(/[()]/g, '') // Remove parentheses
          .split(',')
          .map(coord => {
            const [lng, lat] = coord.trim().split(' ');
            return [parseFloat(lng), parseFloat(lat)];
          });
      };

      // Split into polygons
      const polygons = coordsStr
        .match(/\(\([^)]+\)\)/g)
        .map(poly => {
          return [parseCoordinates(poly)];
        });

      return {
        type: "MultiPolygon",
        coordinates: polygons
      };
    } catch (err) {
      console.error('Error parsing geometry:', err);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-lg">Loading globe data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Extract all countries from the athletes data
  const countryFeatures = Object.values(athletes)
    .map(athlete => {
      if (athlete.athlete_info.geometry) {
        return {
          type: "Feature",
          properties: {
            ISO_A2: athlete.athlete_info.ISO_A2,
            ADMIN: athlete.athlete_info.ADMIN
          },
          geometry: parseGeometry(athlete.athlete_info.geometry)
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="container p-0 m-0 justify-center items-center resize  overflow-hidden">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countryFeatures}
        polygonAltitude={altitude}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }) => {
          const athletesCount = getAthletesPerCountry();
          const count = athletesCount.get(d?.ISO_A2) || 0;
          return `
            <div class="bg-black bg-opacity-75 p-2 rounded">
              <b>${d?.ADMIN} (${d?.ISO_A2})</b><br />
              Athletes: <i>${count}</i>
            </div>
          `;
        }}
        polygonsTransitionDuration={transitionDuration}
      />
    </div>
  );
};

export default FourHundredAthletes;