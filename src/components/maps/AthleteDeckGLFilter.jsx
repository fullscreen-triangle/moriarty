import React, { useState, useMemo, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import { MapView } from "@deck.gl/core";
import { Map } from "react-map-gl/maplibre";
import { LineChart, Line, XAxis, YAxis } from 'recharts';

const MAP_VIEW = new MapView({
  repeat: true
});

const INITIAL_VIEW_STATE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const dataFilter = new DataFilterExtension({
  filterSize: 1,
  fp64: false
});

const METRICS = [
  { key: 'Age', field: 'athlete_info.Age' },
  { key: 'Height', field: 'athlete_info.Height' },
  { key: 'Weight', field: 'athlete_info.Weight' },
  { key: 'VO2_Max', field: 'additional_metrics.VO2_Max' },
  { key: 'Max_HR', field: 'additional_metrics.Max_HR' },
  { key: 'Blood_Volume', field: 'additional_metrics.Blood_Volume' },
  { key: 'Body_Fat_Percentage', field: 'additional_metrics.Body_Fat_Percentage' },
  { key: 'Lean_Body_Mass', field: 'additional_metrics.Lean_Body_Mass' },
  { key: 'Cardiac_Index', field: 'additional_metrics.Cardiac_Index' },
  { key: 'TER', field: 'additional_metrics.TER' }
];

const CHART_POSITIONS = [
  [10, 10], [210, 10], [410, 10], [610, 10], [810, 10],
  [10, 160], [210, 160], [410, 160], [610, 160], [810, 160]
];

const MiniLineChart = ({ data, metric, position }) => {
  return (
    <div style={{
      position: 'absolute',
      left: position[0],
      top: position[1],
      width: 180,
      height: 120,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: '8px',
      borderRadius: '4px',
      zIndex: 1
    }}>
      <div style={{ color: 'white', fontSize: '12px', marginBottom: '4px' }}>{metric.key}</div>
      <LineChart width={160} height={90} data={data}>
        <XAxis 
          dataKey="year" 
          stroke="white" 
          tick={{ fill: 'white', fontSize: 10 }}
        />
        <YAxis 
          stroke="white"
          tick={{ fill: 'white', fontSize: 10 }}
        />
        <Line 
          type="monotone" 
          dataKey={metric.key} 
          stroke="#8884d8" 
          dot={false}
        />
      </LineChart>
    </div>
  );
};

const getTooltip = ({ object }) => {
  if (!object) return null;
  
  return `
    Athlete: ${object.name}
    Year: ${object.athlete_info.Year}
    Event: ${object.athlete_info.Event}
    Medal: Gold
  `;
};

const AthleteDeckGLFilter = ({ data }) => {
  const [year, setYear] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
  // Process the input data
  useEffect(() => {
    if (!data) return;
    
    const processedData = Object.entries(data)
      .filter(([_, value]) => value.athlete_info.Medal === "3")
      .map(([name, value]) => ({
        name,
        ...value,
        coordinates: [-73.935242, 40.730610], // You'll need to add actual coordinates
        year: value.athlete_info.Year
      }));
      
    setFilteredData(processedData);
    
    // Set initial year to earliest year in dataset
    if (!year) {
      const minYear = Math.min(...processedData.map(d => d.year));
      setYear(minYear);
    }
  }, [data]);

  const layers = [
    new ScatterplotLayer({
      id: 'athletes',
      data: filteredData,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.coordinates,
      getRadius: d => 5,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
      extensions: [dataFilter],
      filterRange: [year, year],
      getFilterValue: d => d.year,
    })
  ];

  // Prepare time series data for charts
  const chartData = useMemo(() => {
    return filteredData.map(d => ({
      year: d.year,
      ...METRICS.reduce((acc, metric) => ({
        ...acc,
        [metric.key]: _.get(d, metric.field)
      }), {})
    }));
  }, [filteredData]);

  return (
    <>
      <DeckGL
        views={MAP_VIEW}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        {METRICS.map((metric, index) => (
          <MiniLineChart
            key={metric.key}
            data={chartData}
            metric={metric}
            position={CHART_POSITIONS[index]}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '16px',
        borderRadius: '4px'
      }}>
        <input
          type="range"
          min={Math.min(...filteredData.map(d => d.year))}
          max={Math.max(...filteredData.map(d => d.year))}
          value={year || 1896}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ textAlign: 'center', color: 'white', marginTop: '8px' }}>
          Year: {year}
        </div>
      </div>
    </>
  );
};

export default AthleteDeckGLFilter;