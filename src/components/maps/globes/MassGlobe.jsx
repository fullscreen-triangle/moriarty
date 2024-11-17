import React, { useState, useEffect, useRef } from "react";
import Globe from 'react-globe.gl';

const MassGlobe = () => {
  const globeRefs = [useRef(), useRef(), useRef()];
  const [countries, setCountries] = useState({ features: [] });
  const [athleteData, setAthleteData] = useState([]);
  const [processedData, setProcessedData] = useState(new Map());
  const [transitionDuration] = useState(1000);

  // Process athlete data to calculate average masses per country
  const processAthleteData = (athletes) => {
    const countryData = new Map();

    athletes.forEach(athlete => {
      const country = athlete.NOC;
      if (!countryData.has(country)) {
        countryData.set(country, {
          athleteCount: 0,
          totalMasses: {
            totalBodyMass: 0,
            trunkMass: 0,
            legMass: 0,
          }
        });
      }

      const data = countryData.get(country);
      // Only count athletes with valid mass data
      if (athlete.Weight && athlete.trunk_mass && athlete.total_leg_mass) {
        data.athleteCount++;
        data.totalMasses.totalBodyMass += athlete.Weight;
        data.totalMasses.trunkMass += athlete.trunk_mass;
        data.totalMasses.legMass += athlete.total_leg_mass;
      }
    });

    // Calculate averages
    countryData.forEach((data, country) => {
      if (data.athleteCount > 0) {
        data.averageMasses = {
          totalBodyMass: data.totalMasses.totalBodyMass / data.athleteCount,
          trunkMass: data.totalMasses.trunkMass / data.athleteCount,
          legMass: data.totalMasses.legMass / data.athleteCount,
        };
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
    // Initialize all globes
    globeRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.controls().autoRotate = true;
        ref.current.controls().autoRotateSpeed = 0.3;
        ref.current.pointOfView({ altitude: 2.5 }, 5000);
      }
    });
  }, []);

  // Get polygon height based on mass type
  const getPolygonHeight = (massType) => (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData?.averageMasses) return 0.1;
    
    // Scale factor can be adjusted for better visualization
    const scaleFactor = 0.01;
    return Math.max(0.1, countryData.averageMasses[massType] * scaleFactor);
  };

  // Get polygon color based on athlete count
  const getPolygonColor = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return 'rgba(200, 200, 200, 0.6)';
    
    const intensity = Math.min(255, countryData.athleteCount * 5);
    return `rgba(${intensity}, 0, 0, 0.6)`;
  };

  // Create detailed label for each mass type
  const getPolygonLabel = (massType) => (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData?.averageMasses) return `<b>${feature.properties.ADMIN}</b>`;

    return `
      <b>${feature.properties.ADMIN}</b><br />
      Athletes: ${countryData.athleteCount}<br />
      Average ${massType.replace(/([A-Z])/g, ' $1').toLowerCase()}: 
      ${countryData.averageMasses[massType].toFixed(2)} kg
    `;
  };

  // Configuration for each globe
  const globeConfigs = [
    {
      title: "Average Total Body Mass",
      massType: "totalBodyMass",
    },
    {
      title: "Average Trunk Mass",
      massType: "trunkMass",
    },
    {
      title: "Average Leg Mass",
      massType: "legMass",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen w-full p-4">
      {globeConfigs.map((config, index) => (
        <div key={config.massType} className="h-full flex flex-col">
          <h2 className="text-xl font-bold text-center mb-2">{config.title}</h2>
          <div className="flex-grow">
            <Globe
              ref={globeRefs[index]}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
              backgroundColor="rgba(0,0,0,0)"
              polygonsData={countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ')}
              polygonAltitude={getPolygonHeight(config.massType)}
              polygonCapColor={getPolygonColor}
              polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
              polygonLabel={getPolygonLabel(config.massType)}
              polygonsTransitionDuration={transitionDuration}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MassGlobe;