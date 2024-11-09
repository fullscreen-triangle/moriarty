'use client'
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';

const BarChart = ({ dimension, group, width, height, segment }) => {
  const svgRef = useRef(null);
  const brushRef = useRef(null);

  useEffect(() => {
    if (!dimension || !group) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, 50])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, group.top(1)[0].value || 0])
      .range([innerHeight, 0]);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create brush
    const brush = d3.brushX()
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on('brush', brushed)
      .on('end', brushEnded);

    function brushed(event) {
      if (!event.selection) return;
      const [x0, x1] = event.selection.map(x.invert);
      dimension.filterRange([x0, x1]);
      // Force update all other charts
      d3.selectAll('.bar-chart').each(function() {
        if (this !== svgRef.current) {
          d3.select(this).dispatch('update');
        }
      });
    }

    function brushEnded(event) {
      if (!event.selection) {
        dimension.filterAll();
        // Force update all other charts
        d3.selectAll('.bar-chart').each(function() {
          if (this !== svgRef.current) {
            d3.select(this).dispatch('update');
          }
        });
      }
    }

    // Add bars
    const bars = g.selectAll('.bar')
      .data(group.all())
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('width', innerWidth / 25) // Adjust based on your bin size
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#4299e1')
      .attr('rx', 2);

    // Add axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis.ticks(5)
        .tickSize(-innerHeight)
        .tickFormat('')
      );

    g.append('g')
      .attr('class', 'grid')
      .call(yAxis.ticks(5)
        .tickSize(-innerWidth)
        .tickFormat('')
      );

    // Add axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Add brush group
    const brushGroup = g.append('g')
      .attr('class', 'brush')
      .call(brush);

    brushRef.current = brushGroup;

    // Update function for when other charts are brushed
    const update = () => {
      const bars = g.selectAll('.bar')
        .data(group.all());

      // Update existing bars
      bars
        .attr('y', d => y(d.value))
        .attr('height', d => innerHeight - y(d.value));

      // Add new bars
      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.key))
        .attr('width', innerWidth / 25)
        .attr('y', d => y(d.value))
        .attr('height', d => innerHeight - y(d.value))
        .attr('fill', '#4299e1')
        .attr('rx', 2);

      // Remove old bars
      bars.exit().remove();
    };

    // Add update event listener
    d3.select(svgRef.current).on('update', update);

    return () => {
      // Cleanup
      dimension.filterAll();
      d3.select(svgRef.current).on('update', null);
    };
  }, [dimension, group, width, height, segment]);

  return (
    <svg ref={svgRef} className="bar-chart w-full h-full" />
  );
};

const BodyMassSegments = () => {
  const [cx, setCx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/json/senior/senior_men_four_hundred_indices.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        const transformedData = transformJsonData(jsonData);
        setCx(crossfilter(transformedData));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">Error: {error}</div>;
  }

  if (!cx) {
    return <div className="flex items-center justify-center h-screen">No data available</div>;
  }

  // Mass segments to display
  const massSegments = [
    'Hand', 'Forearm', 'Upper arm', 'Forearm hand', 'Total arm',
    'Foot', 'Leg', 'Thigh', 'Head neck', 'Thorax',
    'Abdomen', 'Pelvis', 'Trunk', 'Trunk head neck', 'HAT',
    'Foot leg', 'Total leg', 'Thorax abdomen', 'Abdomen pelvis',
    'Total Mass'
  ];

  // Create dimensions and groups for each mass segment
  const createDimensionAndGroup = (segment) => {
    const dim = cx.dimension(d => d[segment]);
    const group = dim.group(value => Math.floor(value * 2) / 2); // Create bins of 0.5 units
    return { dimension: dim, group };
  };

  const charts = massSegments.map(segment => createDimensionAndGroup(segment));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mass Analysis Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {charts.map(({ dimension, group }, index) => (
          <div key={massSegments[index]} className="border rounded-lg p-2 bg-white shadow">
            <h2 className="text-sm font-semibold mb-2">{massSegments[index]}</h2>
            <div className="h-[200px]">
              <BarChart
                dimension={dimension}
                group={group}
                width={280}
                height={200}
                segment={massSegments[index]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Function to transform JSON data
const transformJsonData = (jsonData) => {
  return Object.entries(jsonData).map(([name, data]) => {
    const massData = data.bsp_values.Mass;
    const totalMass = Object.values(massData).reduce((sum, value) => sum + value, 0);
    
    return {
      name,
      ...massData,
      'Total Mass': totalMass,
      ...data.athlete_info
    };
  });
};

export default BodyMassSegments;