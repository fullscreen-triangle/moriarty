import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 800;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const RadialChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      const processedData = data.map(d => ({
        ...d,
        Date: new Date(d.Date),
        Time: parseFloat(d.Time)
      }));
      setChartData(processedData);
    }
  }, [data]);

  const innerRadius = 100;
  const outerRadius = Math.min(width, height) / 2 - margin.top;

  const xScale = d3.scaleTime()
    .domain([new Date(2024, 0, 1), new Date(2024, 11, 31)])
    .range([0, 2 * Math.PI]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(chartData, d => d.Time), d3.max(chartData, d => d.Time)])
    .range([innerRadius, outerRadius]);

  const colorScale = d3.scaleSequential()
    .domain(d3.extent(chartData, d => d.main.temp))
    .interpolator(d3.interpolateRdYlBu);

  const radialLine = d3.lineRadial()
    .angle(d => xScale(d.Date))
    .radius(d => yScale(d.Time))
    .curve(d3.curveCardinalClosed);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {/* Render circular grid lines */}
        {yScale.ticks(5).map((tick, i) => (
          <circle
            key={i}
            r={yScale(tick)}
            fill="none"
            stroke="#ccc"
            strokeDasharray="2,2"
          />
        ))}

        {/* Render radial lines for months */}
        {d3.timeMonths(new Date(2024, 0, 1), new Date(2024, 11, 31)).map((month, i) => (
          <line
            key={i}
            y1={-outerRadius}
            y2={-innerRadius}
            transform={`rotate(${xScale(month) * (180 / Math.PI)})`}
            stroke="#ccc"
          />
        ))}

        {/* Render data points */}
        {chartData.map((d, i) => (
          <circle
            key={i}
            cx={Math.cos(xScale(d.Date) - Math.PI / 2) * yScale(d.Time)}
            cy={Math.sin(xScale(d.Date) - Math.PI / 2) * yScale(d.Time)}
            r={5}
            fill={colorScale(d.main.temp)}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}

        {/* Render month labels */}
        {d3.timeMonths(new Date(2024, 0, 1), new Date(2024, 11, 31)).map((month, i) => (
          <text
            key={i}
            x={Math.cos(xScale(month) - Math.PI / 2) * (outerRadius + 20)}
            y={Math.sin(xScale(month) - Math.PI / 2) * (outerRadius + 20)}
            dy=".35em"
            textAnchor="middle"
            transform={`
              rotate(${(xScale(month) * 180) / Math.PI - 90})
              rotate(${90 - (xScale(month) * 180) / Math.PI})
            `}
          >
            {d3.timeFormat("%b")(month)}
          </text>
        ))}

        {/* Render legend */}
        <g transform={`translate(${-outerRadius}, ${-outerRadius})`}>
          <text x={0} y={-10} fontWeight="bold">Temperature</text>
          {d3.range(0, 1.01, 0.1).map((t, i) => (
            <rect
              key={i}
              x={i * 20}
              y={0}
              width={20}
              height={10}
              fill={colorScale(d3.interpolate(d3.extent(chartData, d => d.main.temp))(t))}
            />
          ))}
          <text x={0} y={25}>{d3.min(chartData, d => d.main.temp).toFixed(1)}°C</text>
          <text x={200} y={25} textAnchor="end">{d3.max(chartData, d => d.main.temp).toFixed(1)}°C</text>
        </g>
      </g>
    </svg>
  );
};

export default RadialChart;