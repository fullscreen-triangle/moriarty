import React, { useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const MultiVariableCharts = ({ data }) => {
  const [activeChart, setActiveChart] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Extract variable names excluding time, distance, and segments
  const excludedKeys = ['time', 'distance', 'segments', 'start', 'end'];
  const variables = Object.keys(data[0] || {}).filter(key => !excludedKeys.includes(key));

  // Find peak values for each variable
  const peakValues = variables.reduce((acc, variable) => {
    const maxValue = Math.max(...data.map(d => d[variable]));
    const peakPoint = data.find(d => d[variable] === maxValue);
    acc[variable] = { value: maxValue, time: peakPoint.time };
    return acc;
  }, {});

  // Generate color for each variable
  const getColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d88484'];
    return colors[index % colors.length];
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium">Time: {label}s</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  };

  // Handle mouse events for highlighting
  const handleMouseMove = useCallback((chartId, e) => {
    if (e && e.activePayload) {
      setHoveredPoint({
        chartId,
        time: e.activePayload[0].payload.time,
        value: e.activePayload[0].value
      });
    }
  }, []);

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Activity Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variables.map((variable, index) => (
          <div 
            key={variable}
            className={`h-64 p-4 rounded-lg border ${
              activeChart === variable ? 'border-blue-500' : 'border-gray-200'
            } hover:border-blue-300 transition-colors duration-200`}
            onMouseEnter={() => setActiveChart(variable)}
            onMouseLeave={() => setActiveChart(null)}
          >
            <h3 className="text-lg font-medium mb-2 text-gray-700">
              {variable.replace(/_/g, ' ').toUpperCase()}
              <span className="ml-2 text-sm text-gray-500">
                Peak: {peakValues[variable].value.toFixed(2)}
              </span>
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                syncId="anyId"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onMouseMove={(e) => handleMouseMove(variable, e)}
                onMouseLeave={handleMouseLeave}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  label={{ value: 'Time (s)', position: 'bottom' }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  label={{
                    value: variable,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={variable}
                  stroke={getColor(index)}
                  fill={getColor(index)}
                  fillOpacity={0.3}
                  strokeWidth={activeChart === variable ? 2 : 1}
                />
                {/* Peak value marker */}
                <ReferenceDot
                  x={peakValues[variable].time}
                  y={peakValues[variable].value}
                  r={4}
                  fill="red"
                  stroke="none"
                />
                {index === variables.length - 1 && (
                  <Brush 
                    dataKey="time" 
                    height={30} 
                    stroke="#8884d8"
                    travellerWidth={10}
                    className="mt-4"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiVariableCharts;