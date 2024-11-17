import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Individual Chart Component
const D3Chart = ({ 
  data, 
  xAccessor, 
  yAccessor, 
  width, 
  height, 
  marginTop = 8,
  onBrush,
  brushExtent,
  title
}) => {
  const svgRef = useRef(null);
  const brushRef = useRef(null);

  useEffect(() => {
    if (!data || !width || !height) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Set up scales
    const xDomain = d3.extent(data, xAccessor);
    const yDomain = [0, d3.max(data, yAccessor)];

    const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([height - marginTop, marginTop]);

    // Create area generator
    const areaGenerator = d3.area()
      .x(d => xScale(xAccessor(d)))
      .y1(d => yScale(yAccessor(d)))
      .y0(height - marginTop)
      .curve(d3.curveBumpX);

    // Create line generator
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
      .curve(d3.curveBumpX);

    // Draw area
    svg.append('path')
      .datum(data)
      .attr('d', areaGenerator)
      .attr('fill', '#e6e6e6');

    // Draw line
    svg.append('path')
      .datum(data)
      .attr('d', lineGenerator)
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('fill', 'none');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', marginTop)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-medium')
      .text(title);

    // Create brush
    const brush = d3.brushX()
      .extent([[0, marginTop], [width, height - marginTop]])
      .on('brush end', (event) => {
        if (event.selection && onBrush) {
          const [x1, x2] = event.selection;
          onBrush([xScale.invert(x1), xScale.invert(x2)]);
        }
      });

    // Add brush to svg
    const brushGroup = svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    // Update brush if extent is provided
    if (brushExtent) {
      brushGroup.call(brush.move, brushExtent.map(xScale));
    }

    // Store brush reference for cleanup
    brushRef.current = brushGroup;

    return () => {
      if (brushRef.current) {
        brushRef.current.remove();
      }
    };
  }, [data, width, height, marginTop, brushExtent]);

  return <svg ref={svgRef} />;
};

// Grid Container Component
const ChartGrid = ({ charts }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [brushExtent, setBrushExtent] = useState(null);
  const [loadedData, setLoadedData] = useState({});

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Calculate height to maintain aspect ratio
        const height = width * 0.4;
        setDimensions({ 
          width: width / 3 - 20, // Account for gaps
          height: height / 3 - 20  // Account for gaps
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data for all charts
  useEffect(() => {
    const fetchData = async () => {
      const newData = {};
      for (const chart of charts) {
        try {
          const response = await fetch(chart.dataUrl);
          const rawData = await response.json();
          newData[chart.id] = rawData.map(d => ({
            ...d,
            [chart.xAccessor.name]: new Date(d[chart.xAccessor.name])
          })).sort((a, b) => d3.ascending(chart.xAccessor(a), chart.xAccessor(b)));
        } catch (error) {
          console.error(`Error fetching data for chart ${chart.id}:`, error);
        }
      }
      setLoadedData(newData);
    };

    fetchData();
  }, [charts]);

  const handleBrush = (extent) => {
    setBrushExtent(extent);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full grid grid-cols-3 gap-5 p-4"
    >
      {charts.map((chart) => (
        <div key={chart.id} className="relative">
          {loadedData[chart.id] && (
            <D3Chart
              data={loadedData[chart.id]}
              xAccessor={chart.xAccessor}
              yAccessor={chart.yAccessor}
              width={dimensions.width}
              height={dimensions.height}
              marginTop={20}
              onBrush={handleBrush}
              brushExtent={brushExtent}
              title={chart.title}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
    // Define your charts configuration
    const charts = [
      {
        id: 'downloads',
        title: 'Package Downloads',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c',
        xAccessor: d => d.date,
        yAccessor: d => d.downloads,
      },
      {
        id: 'stars',
        title: 'GitHub Stars',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.stars,
      },
      {
        id: 'issues',
        title: 'Open Issues',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.issues,
      },
      {
        id: 'commits',
        title: 'Daily Commits',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.commits,
      },
      {
        id: 'contributors',
        title: 'Active Contributors',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.contributors,
      },
      {
        id: 'pullRequests',
        title: 'Pull Requests',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.pullRequests,
      },
      {
        id: 'builds',
        title: 'Build Duration',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.buildDuration,
      },
      {
        id: 'coverage',
        title: 'Test Coverage',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.coverage,
      },
      {
        id: 'dependencies',
        title: 'Dependencies',
        dataUrl: 'https://api.npoint.io/9f3edee2d00c8ade835c', // Replace with your actual data URL
        xAccessor: d => d.date,
        yAccessor: d => d.dependencies,
      },
    ];
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Project Analytics Dashboard</h1>
        <ChartGrid charts={charts} />
      </div>
    );
  };
  
  export default App;

