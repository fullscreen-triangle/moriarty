import React, { useState, useMemo, useEffect } from 'react';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

// Medal colors
const MEDAL_COLORS = {
  'Gold': [255, 215, 0],
  'Silver': [192, 192, 192],
  'Bronze': [205, 127, 50]
};

const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: 0,
  zoom: 1.5,
  minZoom: 1,
  maxZoom: 8,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const WorldMetricsMap = ({ athletesDataUrl, countryGeoJsonUrl, selectedYear }) => {
  const [athletesData, setAthletesData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both datasets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch athletes data
        const athletesResponse = await fetch(athletesDataUrl);
        const athletesJson = await athletesResponse.json();
        
        // Fetch country GeoJSON
        const countryResponse = await fetch(countryGeoJsonUrl);
        const countryJson = await countryResponse.json();
        
        setAthletesData(athletesJson);
        setCountryData(countryJson);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [athletesDataUrl, countryGeoJsonUrl]);

  // Process and combine data
  const processedData = useMemo(() => {
    if (!athletesData || !countryData) return [];

    // Create a mapping of country codes to coordinates
    const countryCoordinates = {};
    countryData.features.forEach(feature => {
      // Assuming the GeoJSON has properties.ISO_A3 for country codes
      // and the centroid is calculated from the geometry
      const centroid = getCentroid(feature.geometry);
      if (centroid) {
        countryCoordinates[feature.properties.ISO_A3] = centroid;
      }
    });

    // Process athletes data
    return Object.entries(athletesData)
      .map(([name, info]) => {
        const { athlete_info, additional_metrics } = info;
        const coordinates = countryCoordinates[athlete_info.NOC];
        
        if (!coordinates || athlete_info.Year !== selectedYear) return null;
        
        return {
          name,
          coordinates,
          ...athlete_info,
          ...additional_metrics
        };
      })
      .filter(Boolean); // Remove null entries
  }, [athletesData, countryData, selectedYear]);

  // Helper function to calculate centroid of a GeoJSON geometry
  const getCentroid = (geometry) => {
    if (!geometry) return null;

    switch (geometry.type) {
      case 'Point':
        return geometry.coordinates;
      case 'Polygon':
        // Simple centroid calculation for polygon
        const coords = geometry.coordinates[0];
        const x = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
        const y = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
        return [x, y];
      case 'MultiPolygon':
        // Use the first polygon's centroid
        const firstPolygon = geometry.coordinates[0];
        const fCoords = firstPolygon[0];
        const fx = fCoords.reduce((sum, coord) => sum + coord[0], 0) / fCoords.length;
        const fy = fCoords.reduce((sum, coord) => sum + coord[1], 0) / fCoords.length;
        return [fx, fy];
      default:
        return null;
    }
  };

  const layers = [
    new ScatterplotLayer({
      id: 'athletes',
      data: processedData,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 40000,
      radiusMinPixels: 5,
      radiusMaxPixels: 30,
      lineWidthMinPixels: 1,
      getPosition: d => d.coordinates,
      getFillColor: d => MEDAL_COLORS[d.Medal] || [255, 255, 255],
      getLineColor: [0, 0, 0],
      getRadius: d => 1,
      onHover: setHoverInfo
    })
  ];

  const renderTooltip = () => {
    if (!hoverInfo?.object) return null;

    const { x, y, object } = hoverInfo;
    const {
      name,
      Age,
      Team,
      Medal,
      VO2_Max,
      Body_Fat_Percentage,
      Height,
      Weight,
      Games,
      Event
    } = object;

    return (
      <div 
        className="absolute p-4 bg-white/90 rounded shadow-lg text-sm"
        style={{ 
          left: x, 
          top: y, 
          zIndex: 1, 
          pointerEvents: 'none',
          maxWidth: '300px' 
        }}
      >
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>Country: {Team}</div>
          <div>Medal: {Medal}</div>
          <div>Games: {Games}</div>
          <div>Event: {Event}</div>
          <div>Age: {Age}</div>
          <div>Height: {Height}cm</div>
          <div>Weight: {Weight}kg</div>
          <div>VO2 Max: {VO2_Max}</div>
          <div>Body Fat: {Body_Fat_Percentage.toFixed(1)}%</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading map data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">Error loading map: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>
      {renderTooltip()}
    </div>
  );
};

export default WorldMetricsMap;