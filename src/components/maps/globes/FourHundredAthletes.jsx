import React, { useState, useEffect, useRef } from "react";
import Globe from 'react-globe.gl';

const FourHundredAthletes = ({ width, height }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [athleteData, setAthleteData] = useState([]);
  const [processedData, setProcessedData] = useState(new Map());
  const [transitionDuration] = useState(1000);

  // Calculate medal scores and athlete counts per country
  const processAthleteData = (athletes) => {
    const countryData = new Map();

    athletes.forEach(athlete => {
      const country = athlete.NOC;
      if (!countryData.has(country)) {
        countryData.set(country, {
          athleteCount: 0,
          medalScore: 0,
          medals: { Gold: 0, Silver: 0, Bronze: 0 }
        });
      }

      const data = countryData.get(country);
      data.athleteCount++;

      // Calculate medal score (Gold=3, Silver=2, Bronze=1)
      switch (athlete.Medal) {
        case 'Gold':
          data.medalScore += 3;
          data.medals.Gold++;
          break;
        case 'Silver':
          data.medalScore += 2;
          data.medals.Silver++;
          break;
        case 'Bronze':
          data.medalScore += 1;
          data.medals.Bronze++;
          break;
        default:
          break;
      }
    });

    return countryData;
  };

  useEffect(() => {
    // Load GeoJSON data
    fetch('/maps/world-geojson.json')
      .then(res => res.json())
      .then(geoData => {
        setCountries(geoData);
      });

    // Load athlete data
    fetch('/json/senior/four_hundred_athletes_parameters.json')
      .then(res => res.json())
      .then(athletes => {
        setAthleteData(athletes);
        setProcessedData(processAthleteData(athletes));
      });
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.pointOfView({ altitude: 2.5 }, 5000);
    }
  }, []);

  // Calculate polygon height based on medal score
  const getPolygonHeight = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return 0.1;
    
    // Normalize height based on medal score
    return Math.max(0.1, countryData.medalScore * 0.01);
  };

  // Calculate polygon color based on athlete count
  const getPolygonColor = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return 'rgba(200, 200, 200, 0.6)';
    
    // Color intensity based on athlete count
    const intensity = Math.min(255, countryData.athleteCount * 5);
    return `rgba(${intensity}, 0, 0, 0.6)`;
  };

  // Create detailed label for each country
  const getPolygonLabel = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return `<b>${feature.properties.ADMIN}</b>`;

    return `
      <b>${feature.properties.ADMIN}</b><br />
      Athletes: ${countryData.athleteCount}<br />
      Medal Score: ${countryData.medalScore}<br />
      Gold: ${countryData.medals.Gold}<br />
      Silver: ${countryData.medals.Silver}<br />
      Bronze: ${countryData.medals.Bronze}
    `;
  };

  return (
    <div className="h-screen w-full">
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonAltitude={getPolygonHeight}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonLabel={getPolygonLabel}
        polygonsTransitionDuration={transitionDuration}
      />
    </div>
  );
};

export default FourHundredAthletes;