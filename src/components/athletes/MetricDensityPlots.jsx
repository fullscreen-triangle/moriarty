import React, { useMemo, useRef } from 'react';
import { useDimensions } from '@/components/Hooks/use-dimensions.js';

const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

const DensityPlot = ({ data, label, min, max, mean, std, width }) => {
  // Make height proportional to width for a pleasing aspect ratio
  const height = width * 0.75;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Generate normal distribution data points
  const points = useMemo(() => {
    const points = [];
    for (let x = min; x <= max; x += (max - min) / 100) {
      const y = (1 / (std * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
      points.push([x, y]);
    }
    return points;
  }, [min, max, mean, std]);

  // Scale for X axis
  const xScale = useMemo(() => {
    return points.map(p => ((p[0] - min) / (max - min)) * boundsWidth);
  }, [points, boundsWidth, min, max]);

  // Scale for Y axis
  const yScale = useMemo(() => {
    const maxY = Math.max(...points.map(p => p[1]));
    return points.map(p => boundsHeight - (p[1] / maxY) * boundsHeight);
  }, [points, boundsHeight]);

  // Create path
  const path = useMemo(() => {
    let d = `M ${xScale[0]},${yScale[0]}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${xScale[i]},${yScale[i]}`;
    }
    return d;
  }, [xScale, yScale]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <p className="text-sm font-medium mb-2 text-gray-700">{label}</p>
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Density curve */}
          <path
            d={path}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
          />
          
          {/* Area under the curve */}
          <path
            d={`${path} L ${boundsWidth},${boundsHeight} L 0,${boundsHeight} Z`}
            fill="#93c5fd"
            fillOpacity={0.3}
          />
          
          {/* Mean line */}
          <line
            x1={(mean - min) / (max - min) * boundsWidth}
            y1={0}
            x2={(mean - min) / (max - min) * boundsWidth}
            y2={boundsHeight}
            stroke="#dc2626"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          
          {/* X-axis */}
          <line
            x1={0}
            y1={boundsHeight}
            x2={boundsWidth}
            y2={boundsHeight}
            stroke="black"
            strokeWidth={1}
          />
          
          {/* Axis labels */}
          <text x={0} y={boundsHeight + 20} className="text-xs">{min.toFixed(1)}</text>
          <text x={boundsWidth - 20} y={boundsHeight + 20} className="text-xs">{max.toFixed(1)}</text>
        </g>
      </svg>
    </div>
  );
};

const MetricDensityPlots = () => {
  const containerRef = useRef(null);
  const { width } = useDimensions(containerRef);
  
  // Calculate individual plot width based on container width
  const plotWidth = width ? (width - 48) / 2 : 0; // 48px accounts for grid gap and padding

  const stats = {
    "Height": {
      mean: 182.07,
      std: 6.35,
      min: 160.0,
      max: 194.0
    },
    "Weight": {
      mean: 74.20,
      std: 6.58,
      min: 57.0,
      max: 89.0
    },
    "BMI": {
      mean: 22.38,
      std: 1.63,
      min: 18.30,
      max: 28.12
    },
    "Lean_Body_Mass": {
      mean: 62.18,
      std: 4.66,
      min: 49.16,
      max: 72.06
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Distribution of Physical Measurements</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {width > 0 && Object.entries(stats).map(([key, value]) => (
            <DensityPlot
              key={key}
              label={key.replace(/_/g, ' ')}
              width={plotWidth}
              {...value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricDensityPlots;