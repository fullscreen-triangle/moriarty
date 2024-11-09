'use client'
import React, { useState, useEffect } from 'react';

// Mapping between JSON segments and SVG parts
const bodyPartMapping = {
  'ana1': 'Head neck',          // Head
  'ana9': 'Thorax',            // Chest
  'ana10': 'Abdomen',          // Abdomen
  'ana15': 'Total arm',        // Right Arm
  'ana16': 'Total arm',        // Left Arm
  'ana25': 'Thigh',            // Right Thigh
  'ana26': 'Thigh',            // Left Thigh
  'ana29': 'Leg',              // Right Leg
  'ana30': 'Leg'               // Left Leg
};

const BodyHeatmap = ({ dataUrl }) => {
  const [bodyPartValues, setBodyPartValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Process the data to normalize mass values
        const masses = Object.values(data).map(segment => segment.Mass);
        const maxMass = Math.max(...masses);
        
        // Create normalized values for each SVG part
        const normalizedValues = {};
        Object.entries(bodyPartMapping).forEach(([svgId, segmentName]) => {
          if (data[segmentName]) {
            normalizedValues[svgId] = data[segmentName].Mass / maxMass;
          } else {
            normalizedValues[svgId] = 0;
          }
        });
        
        setBodyPartValues(normalizedValues);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (dataUrl) {
      fetchData();
    }
  }, [dataUrl]);

  const getColor = (value) => {
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="400px"
        height="680px"
        viewBox="0 0 800 1360"
        xmlSpace="preserve"
        className="max-h-full w-full m-0"
      >
        <image
          overflow="visible"
          width={800}
          height={1360}
          xlinkHref="https://raw.githubusercontent.com/ksachikonye/preface-hezvo/main/modela.png"
          className="float-left p-[3px]"
        />
        {Object.entries(bodyPartMapping).map(([partId, segmentName]) => (
          <path
            key={partId}
            id={partId}
            fill={getColor(bodyPartValues[partId] || 0)}
            stroke="#8c8c8c"
            vectorEffect="non-scaling-stroke"
            d={
              partId === 'ana1' ? "M456.334,69C454.668,37,420,18,401,18c-30.833,0-50.167,31.5-53.167,44.5c-1.915,8.295-2.833,23.5-2.5,28.167s1,12.333,0.667,16.167c2.04,7.695,6.667,23,6.667,33c0.667,5.167,1.167,12.5,3.333,18.833c3,4,22.5,23.333,44.167,23.333s36.5-8.667,45.708-23c2.625-5.625,5-15.25,4.75-18.625c-0.708-5.125,4.708-28.042,5.709-32.708C457.001,100.334,458,101,456.334,69z" :
              partId === 'ana9' ? "M524.5,294c-2.018-20.749-37.75-48.25-48.562-51.137c-4.605,0.447-9.488,0.376-14.438-0.363c-12.805-1.911-47-1.667-50.833,4.333s-15.5,5.833-19.667,0s-29.667-4.5-45.333-3.667c-5.294,0.281-10.873-0.674-16.059-2.159c-8.004,3.48-46.033,26.426-52.127,58.308c-0.459,2.402-0.744,4.852-0.814,7.351c-1,35.667,0.003,72.11-0.165,85.722c0.383-0.096,9.666,25.111,12.166,30.778S293.75,441,297.25,447.75C305.5,455.5,344,473,370.5,466s36.5-6.244,65,0.128s52.668-2.794,73.084-27.211c1.25-3.25,4.75-11.75,5.333-15s2.667-6.999,4.084-9.749s7.455-21.675,8.005-21.176C526.678,379.65,525.667,306.001,524.5,294z" :
              partId === 'ana10' ? "M435.5,466.128C407,459.756,397,459,370.5,466s-65-10.5-73.25-18.25c3.5,6.75,2,12,3.75,17.75s5,21.334,0.5,41.501s-1.667,35.666-0.5,40.166c0.785,3.029,2.326,5.001,1.419,8.813C314,567.5,332.834,590.5,402.917,590.5s86.417-20.498,98.75-33.499c-1.666-4.5-0.501-12,2.499-21.167s-3.499-44.667-3.833-52.833s2.501-21.5,2.751-27.584s4.25-13.25,5.5-16.5C488.168,463.334,464,472.5,435.5,466.128z" :
              partId === 'ana15' ? "M276.667,306.667c0.07-2.499,0.354-4.949,0.814-7.351c-14.58,24.029-45.423,27.768-58.288,43.156c-0.437,6.049-2.914,8.093-7.442,14.778C206.5,365,196.5,396.5,193,408.5c-0.507,1.738-0.896,3.229-1.221,4.551c-1.413,17.735,10.718,25.876,24.421,31.618c11.394,4.774,24.501,8.306,33.45,1.543c0.711-1.544,1.634-3.368,2.85-5.712c3.5-6.75,23.363-47.953,24.001-48.111C276.669,378.777,275.667,342.334,276.667,306.667z" :
              partId === 'ana16' ? "M587.573,444.669c14.284-5.985,25.869-14.57,23.177-33.919c-1.625-11.25-17.875-51.25-22-57.25c-2.265-3.294-4.53-6.027-5.655-11.061C570.522,324.211,538,324.001,524.5,294c1.167,12.001,2.178,85.65,1.506,98.992c0.108,0.098,20.827,42.675,23.494,48.175C558.012,454.281,574.009,450.353,587.573,444.669z" :
              partId === 'ana25' ? "M292.327,590.5c-2.021,14.389-3.102,29.611-2.827,34c0.5,8-6.5,46-11.5,70c-3.981,19.107-12.131,56.915-14.375,92.478c-0.575,9.105,0.172,18.063,0.375,26.522c0.845,35.062,9.541,55.489,16.139,69.427c35.654,13.2,53.799,56.767,88.484,34.358c2.478-11.204,8.03-39.965,9.627-52.285c1.75-13.5,10.083-66.333,11.815-88.167s1.269-38.833,0.435-43.166s-0.167-12.667-0.417-21.334s3.083-10.166,4.083-12.333c-3.834-8.171-10.12-17.359-17.755-26.864C348.538,638.439,302.667,599.527,292.327,590.5z" :
              partId === 'ana26' ? "M426.018,672.683c-7.872,9.216-14.301,18.044-18.101,25.734c1.167,0.75,3.083,5.083,4.333,8.083s1,20.75-0.25,31.5s1.5,59.75,3.75,71s8.417,55.334,10.084,67.001s5.166,31.5,7.166,39.833c36.334,25.833,52.479-20.023,89.334-33.168c5.667-10,13.999-27.333,15.999-52.333c0.874-10.926,1.603-27.168,0.824-43.078c-1.002-20.493-3.844-40.436-5.157-47.754c-2.333-13-14.834-82.834-17-92.667s-4.333-40-5.333-53.666C500.981,601.637,454.231,639.652,426.018,672.683z" :
              partId === 'ana29' ? "M290.348,962.921c0.085,4.202,0.072,8.622-0.239,13.122c-1.393,20.15-4.799,41.913-4.109,52.957c1,16,4.5,62,7.5,83s6.875,83,7.125,87.5c0.06,1.082,0.008,2.26-0.107,3.478c6.992-11.484,36.463-9.869,44.754-6.101c-1.079-3.858-2.297-10.522-2.438-15.043c-0.167-5.333,7.5-47.167,8.333-58.333s3.667-29.5,4.333-33.333s5.75-17.168,9.5-25.918s3.5-20,2.5-27.25s-3.75-45.75-4.5-51.375s-2.25-13.125-3.5-15.125c-0.615-0.984-0.563-2.333-0.248-3.642C341.372,984.144,300.939,1007.37,290.348,962.921z" :
              "M442.5,964.834c1.167,2.833-1.25,16.416-4.25,33.916s-4.083,48.751-3.083,56.751s9.667,28.833,11.833,35s0.667,8.833,2,20.833s7.167,47.334,9,59s1.5,21-0.667,27.167C464,1193,500,1190.5,503.5,1206c-0.75-4.25-1.75-10-1-22.25s5-60.25,8.25-87.75s6.75-82,4.5-96.5s-3.5-32-3.5-43.5C503.5,1011.667,459.917,983.001,442.5,964.834z"
            }
          />
        ))}
      </svg>
      <div className="absolute top-2 right-2 bg-white/90 p-4 rounded shadow-lg">
        <div className="text-sm font-semibold mb-2">Mass Distribution (kg)</div>
        {Object.entries(bodyPartMapping).map(([partId, segmentName]) => (
          <div key={partId} className="flex items-center gap-2 text-sm">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: getColor(bodyPartValues[partId] || 0) }}
            />
            <span>{segmentName}: {(bodyPartValues[partId] || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MassHeatMap = ({ dataUrl }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Body Mass Distribution</h2>
        <div className="flex flex-col items-center justify-center gap-8">
          <BodyHeatmap dataUrl={dataUrl} />
        </div>
      </div>
    </div>
  );
};

export default MassHeatMap;