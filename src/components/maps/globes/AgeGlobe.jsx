import React, { useState, useEffect, useRef } from "react";
import Globe from 'react-globe.gl';

const AgeGlobe = () => {
  const globeRefs = [useRef(), useRef(), useRef()];
  const [countries, setCountries] = useState({ features: [] });
  const [athleteData, setAthleteData] = useState([]);
  const [processedData, setProcessedData] = useState(new Map());
  const [transitionDuration] = useState(1000);

  // Process athlete data to calculate age statistics per country
  const processAthleteData = (athletes) => {
    const countryData = new Map();

    athletes.forEach(athlete => {
      const country = athlete.NOC;
      if (!countryData.has(country)) {
        countryData.set(country, {
          athleteCount: 0,
          ages: [],
          totalAge: 0,
        });
      }

      const data = countryData.get(country);
      // Only count athletes with valid age data
      if (athlete.Age) {
        data.athleteCount++;
        data.ages.push(athlete.Age);
        data.totalAge += athlete.Age;
      }
    });

    // Calculate statistics
    countryData.forEach((data, country) => {
      if (data.athleteCount > 0) {
        // Average age
        data.averageAge = data.totalAge / data.athleteCount;
        
        // Youngest and oldest ages
        data.ages.sort((a, b) => a - b);
        data.youngestAge = data.ages[0];
        data.oldestAge = data.ages[data.ages.length - 1];
        
        // Age range
        data.ageRange = data.oldestAge - data.youngestAge;
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

  // Get polygon height based on age metric
  const getPolygonHeight = (metricType) => (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return 0.1;
    
    // Scale factors adjusted for each metric type
    const scaleFactors = {
      averageAge: 0.05,    // For average age
      ageRange: 0.1,       // For age range
      oldestAge: 0.05      // For oldest age
    };
    
    return Math.max(0.1, countryData[metricType] * scaleFactors[metricType]);
  };

  // Get polygon color based on athlete count
  const getPolygonColor = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return 'rgba(200, 200, 200, 0.6)';
    
    const intensity = Math.min(255, countryData.athleteCount * 5);
    return `rgba(${intensity}, 0, 0, 0.6)`;
  };

  // Create detailed label for each metric
  const getPolygonLabel = (metricType) => (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const countryData = processedData.get(countryCode);
    if (!countryData) return `<b>${feature.properties.ADMIN}</b>`;

    let metricValue;
    let additionalInfo = '';
    
    switch(metricType) {
      case 'averageAge':
        metricValue = countryData.averageAge.toFixed(1);
        break;
      case 'ageRange':
        metricValue = countryData.ageRange.toFixed(1);
        additionalInfo = `<br />Youngest: ${countryData.youngestAge}<br />Oldest: ${countryData.oldestAge}`;
        break;
      case 'oldestAge':
        metricValue = countryData.oldestAge.toFixed(1);
        break;
      default:
        metricValue = 'N/A';
    }

    return `
      <b>${feature.properties.ADMIN}</b><br />
      Athletes: ${countryData.athleteCount}<br />
      ${metricType.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${metricValue} years
      ${additionalInfo}
    `;
  };

  // Configuration for each globe
  const globeConfigs = [
    {
      title: "Average Age",
      metricType: "averageAge",
    },
    {
      title: "Age Range",
      metricType: "ageRange",
    },
    {
      title: "Oldest Athlete Age",
      metricType: "oldestAge",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen w-full p-4">
      {globeConfigs.map((config, index) => (
        <div key={config.metricType} className="h-full flex flex-col">
          <h2 className="text-xl font-bold text-center mb-2">{config.title}</h2>
          <div className="flex-grow">
            <Globe
              ref={globeRefs[index]}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
              backgroundColor="rgba(0,0,0,0)"
              polygonsData={countries.features?.filter(d => d.properties.ISO_A2 !== 'AQ')}
              polygonAltitude={getPolygonHeight(config.metricType)}
              polygonCapColor={getPolygonColor}
              polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
              polygonLabel={getPolygonLabel(config.metricType)}
              polygonsTransitionDuration={transitionDuration}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgeGlobe;