'use client'
import React, { useEffect, useState } from 'react';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import Globe from 'react-globe.gl';

const D3Chart = ({ 
  dimension, 
  group, 
  type,
  width = 400,
  height = 300,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  xScale: xScaleProps,
  yScale: yScaleProps,
  title,
  xAxisLabel,
  yAxisLabel
}) => {
  const svgRef = React.useRef();

  useEffect(() => {
    if (!dimension || !group) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = group.all();
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Ensure we have valid data
    if (!data || data.length === 0) return;

    // Create scales based on data if not provided
    let xScale = xScaleProps;
    let yScale = yScaleProps;

    // If scales are not provided or invalid, create default ones based on type
    if (!xScale || typeof xScale.domain !== 'function') {
      switch (type) {
        case 'pie':
          xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, 2 * Math.PI]);
          break;
        case 'row':
          xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, chartWidth]);
          break;
        default:
          xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.key), d3.max(data, d => d.key)])
            .range([0, chartWidth]);
      }
    }

    if (!yScale || typeof yScale.domain !== 'function') {
      switch (type) {
        case 'pie':
          yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, chartHeight]);
          break;
        case 'row':
          yScale = d3.scaleBand()
            .domain(data.map(d => d.key))
            .range([0, chartHeight])
            .padding(0.1);
          break;
        default:
          yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([chartHeight, 0]);
      }
    }

    // Set range for scales if not already set
    if (type !== 'pie') {
      xScale.range([0, chartWidth]);
      if (type === 'row') {
        yScale.range([0, chartHeight]);
      } else {
        yScale.range([chartHeight, 0]);
      }
    }

    // Add title
    if (title) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
    }

    // Add axes for non-pie charts
    if (type !== 'pie') {
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Add x-axis
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

      // Add y-axis
      g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

      // Add axis labels if provided
      if (xAxisLabel) {
        g.append("text")
          .attr("x", chartWidth / 2)
          .attr("y", chartHeight + margin.bottom)
          .attr("text-anchor", "middle")
          .text(xAxisLabel);
      }

      if (yAxisLabel) {
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left)
          .attr("x", -chartHeight / 2)
          .attr("text-anchor", "middle")
          .text(yAxisLabel);
      }
    }

    // Draw chart based on type
    switch (type) {
      case 'bar':
        const barWidth = Math.max(1, chartWidth / data.length - 1);
        g.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d.key))
          .attr("y", d => yScale(d.value))
          .attr("width", barWidth)
          .attr("height", d => chartHeight - yScale(d.value))
          .attr("fill", "steelblue");
        break;

      case 'line':
        const line = d3.line()
          .x(d => xScale(d.key))
          .y(d => yScale(d.value))
          .defined(d => !isNaN(d.value));

        g.append("path")
          .datum(data.filter(d => !isNaN(d.value)))
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);
        break;

      case 'scatter':
        g.selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.key))
          .attr("cy", d => yScale(d.value))
          .attr("r", 3)
          .attr("fill", "steelblue");
        break;

      case 'bubble':
        const radiusScale = d3.scaleSqrt()
          .domain([0, d3.max(data, d => d.value)])
          .range([2, 20]);

        g.selectAll(".bubble")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "bubble")
          .attr("cx", d => xScale(d.key))
          .attr("cy", d => yScale(d.value))
          .attr("r", d => radiusScale(d.value))
          .attr("fill", "steelblue")
          .attr("opacity", 0.7);
        break;

      case 'row':
        const rowHeight = Math.max(1, chartHeight / data.length - 1);
        g.selectAll(".row")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "row")
          .attr("x", 0)
          .attr("y", (d, i) => i * rowHeight)
          .attr("width", d => xScale(d.value))
          .attr("height", rowHeight - 1)
          .attr("fill", "steelblue");
        break;

      case 'pie':
        const radius = Math.min(chartWidth, chartHeight) / 2;
        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const pieG = g.append("g")
          .attr("transform", `translate(${chartWidth/2},${chartHeight/2})`);

        pieG.selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("path")
          .attr("class", "arc")
          .attr("d", arc)
          .attr("fill", (d, i) => d3.schemeCategory10[i]);
        break;
    }

    // Add brush for non-pie charts
    if (type !== 'pie') {
      const brush = d3.brushX()
        .extent([[0, 0], [chartWidth, chartHeight]])
        .on("end", event => {
          if (!event?.selection) {
            dimension.filterAll();
          } else {
            const [x0, x1] = event.selection.map(xScale.invert);
            dimension.filterRange([x0, x1]);
          }
          // Force update
          dimension.group().all();
        });

      g.append("g")
        .attr("class", "brush")
        .call(brush);
    }

  }, [dimension, group, width, height, margin, type, xScaleProps, yScaleProps, title]);

  return <svg ref={svgRef} />;
};

const calculateAthleteScore = (height, weight, age) => {
  const heightScore = 100 - Math.abs(180 - height);
  const weightScore = 100 - Math.abs(75 - weight);
  const ageScore = 100 - Math.abs(27 - age);
  
  return (heightScore * 0.4 + weightScore * 0.35 + ageScore * 0.25).toFixed(2);
};

const BiometricsCrossfilter = () => {
  const [cx, setCx] = useState(null);
  const [globeData, setGlobeData] = useState([]);
  const [countries, setCountries] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/json/senior/senior_men_400_hundred_indices.json');
        const data = await response.json();
        
        // Transform data into array format with enhanced metrics
        const athletesArray = Object.values(data).map(athlete => ({
          ...athlete.athlete_info,
          score: calculateAthleteScore(
            athlete.athlete_info.Height,
            athlete.athlete_info.Weight,
            athlete.athlete_info.Age
          ),
          metrics: {
            ...athlete.additional_metrics,
            bsp: athlete.bsp_values
          },
          // Add performance metrics
          performanceScore: calculatePerformanceScore(athlete),
          bodyComposition: calculateBodyComposition(athlete)
        }));

        // Create crossfilter instance
        const cx = crossfilter(athletesArray);
        setCx(cx);

        // Process country data with geometries
        const countryScores = new Map();
        athletesArray.forEach(athlete => {
          const noc = athlete.NOC;
          if (!countryScores.has(noc)) {
            countryScores.set(noc, {
              scores: [],
              geometry: athlete.geometry, // Use the geometry from data
              metrics: []
            });
          }
          countryScores.get(noc).scores.push(parseFloat(athlete.score));
          countryScores.get(noc).metrics.push(athlete.metrics);
        });

        // Process globe visualization data
        const globeData = Array.from(countryScores.entries()).map(([noc, data]) => ({
          geometry: data.geometry,
          height: d3.mean(data.scores) / 20,
          color: d3.interpolateRdYlBu(d3.mean(data.scores) / 100),
          metrics: aggregateCountryMetrics(data.metrics)
        }));

        setGlobeData(globeData);
        setCountries(countryScores);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Helper functions for enhanced metrics
  const calculatePerformanceScore = (athlete) => {
    const { BSA, VO2_Max, Blood_Volume } = athlete.additional_metrics;
    return ((BSA * 0.3) + (VO2_Max * 0.4) + (Blood_Volume * 0.3)).toFixed(2);
  };

  const calculateBodyComposition = (athlete) => {
    const { Body_Fat_Percentage, Lean_Body_Mass } = athlete.additional_metrics;
    return {
      fatMass: athlete.athlete_info.Weight * (Body_Fat_Percentage / 100),
      leanMass: Lean_Body_Mass
    };
  };

  const aggregateCountryMetrics = (metrics) => {
    return {
      avgVO2Max: d3.mean(metrics.map(m => m.VO2_Max)),
      avgBMR: d3.mean(metrics.map(m => m.BMR)),
      avgBodyFat: d3.mean(metrics.map(m => m.Body_Fat_Percentage))
    };
  };

  if (!cx) {
    return <div>Loading data...</div>;
  }

  // Create dimensions
  const yearDim = cx.dimension(d => d.Year);
  const ageDim = cx.dimension(d => d.Age);
  const heightDim = cx.dimension(d => d.Height);
  const weightDim = cx.dimension(d => d.Weight);
  const sportDim = cx.dimension(d => d.Sport);
  const medalDim = cx.dimension(d => d.Medal);
  const scoreDim = cx.dimension(d => parseFloat(d.score));
  const countryDim = cx.dimension(d => d.NOC);
  const seasonDim = cx.dimension(d => d.Season);
  const bmiDim = cx.dimension(d => (d.Weight / Math.pow(d.Height/100, 2)));
  const vo2MaxDim = cx.dimension(d => d.metrics.VO2_Max);
  const performanceDim = cx.dimension(d => parseFloat(d.performanceScore));
  const bodyCompDim = cx.dimension(d => d.bodyComposition.leanMass);

  // Create groups
  const yearGroup = yearDim.group();
  const ageGroup = ageDim.group(d => Math.floor(d/5)*5);
  const heightGroup = heightDim.group(d => Math.floor(d/5)*5);
  const weightGroup = weightDim.group(d => Math.floor(d/5)*5);
  const sportGroup = sportDim.group();
  const medalGroup = medalDim.group();
  const scoreGroup = scoreDim.group(d => Math.floor(d/10)*10);
  const countryGroup = countryDim.group();
  const seasonGroup = seasonDim.group();
  const bmiGroup = bmiDim.group(d => Math.floor(d));
  const vo2MaxGroup = vo2MaxDim.group(d => Math.floor(d/5)*5);
  const performanceGroup = performanceDim.group(d => Math.floor(d/10)*10);
  const bodyCompGroup = bodyCompDim.group(d => Math.floor(d/5)*5);


  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-6">
          <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            hexPolygonsData={globeData}
            hexPolygonAltitude={d => d.height}
            hexPolygonColor={d => d.color}
            hexPolygonResolution={3}
            onHexPolygonClick={d => {
              console.log('Country metrics:', d.metrics);
            }}
          />
        </div>
        <div className="col-md-6">
          <D3Chart
            dimension={yearDim}
            group={yearGroup}
            type="line"
            xScale={d3.scaleLinear().domain([1896, 2024])}
            yScale={d3.scaleLinear().domain([0, yearGroup.top(1)[0].value])}
            title="Athletes by Year"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <D3Chart
            dimension={medalDim}
            group={medalGroup}
            type="pie"
            title="Medal Distribution"
          />
        </div>
        <div className="col-md-4">
          <D3Chart
            dimension={sportDim}
            group={sportGroup}
            type="row"
            title="Sports Distribution"
            xScale={d3.scaleLinear().domain([0, sportGroup.top(1)[0].value])}
            yScale={d3.scaleBand().domain(sportGroup.all().map(d => d.key))}
          />
        </div>
        <div className="col-md-4">
          <D3Chart
            dimension={seasonDim}
            group={seasonGroup}
            type="pie"
            title="Season Distribution"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <D3Chart
            dimension={vo2MaxDim}
            group={vo2MaxGroup}
            type="bar"
            xScale={d3.scaleLinear().domain([20, 80])}
            yScale={d3.scaleLinear().domain([0, vo2MaxGroup.top(1)[0].value])}
            title="VO2 Max Distribution"
            xAxisLabel="VO2 Max"
            yAxisLabel="Count"
          />
        </div>
        <div className="col-md-6">
          <D3Chart
            dimension={performanceDim}
            group={performanceGroup}
            type="bar"
            xScale={d3.scaleLinear().domain([0, 100])}
            yScale={d3.scaleLinear().domain([0, performanceGroup.top(1)[0].value])}
            title="Performance Score Distribution"
            xAxisLabel="Performance Score"
            yAxisLabel="Count"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <D3Chart
            dimension={heightDim}
            group={heightGroup}
            type="scatter"
            xScale={d3.scaleLinear().domain([150, 220])}
            yScale={d3.scaleLinear().domain([40, 150])}
            title="Height vs Weight"
            xAxisLabel="Height (cm)"
            yAxisLabel="Weight (kg)"
          />
        </div>
        <div className="col-md-6">
          <D3Chart
            dimension={bodyCompDim}
            group={bodyCompGroup}
            type="bar"
            xScale={d3.scaleLinear().domain([30, 100])}
            yScale={d3.scaleLinear().domain([0, bodyCompGroup.top(1)[0].value])}
            title="Lean Mass Distribution"
            xAxisLabel="Lean Mass (kg)"
            yAxisLabel="Count"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <D3Chart
            dimension={countryDim}
            group={countryGroup}
            type="bubble"
            xScale={d3.scaleLinear().domain([0, 100])}
            yScale={d3.scaleLinear().domain([0, 100])}
            title="Country Performance"
          />
        </div>
      </div>
    </div>
  );
};

export default BiometricsCrossfilter;