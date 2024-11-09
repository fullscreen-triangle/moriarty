'use client'
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const WeatherPerformanceBrush = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [brushExtent, setBrushExtent] = useState(null);
  
  const scatterPlotRef1 = useRef();
  const scatterPlotRef2 = useRef();
  const scatterPlotRef3 = useRef();
  const lineChartRef = useRef();
  const pieChartRef = useRef();
  const bubbleChartRef = useRef();

  useEffect(() => {
    if (!data) return;

    const parsedData = data.map(d => ({
      ...d,
      Time: parseFloat(d.Time),
      temp: d.main.temp,
      humidity: d.main.humidity,
      windSpeed: d.wind.speed,
      Date: new Date(d.Date)
    }));

    setFilteredData(parsedData);
    
    // Create scales
    const tempScale = d3.scaleLinear()
      .domain([0, 40])
      .range([0, 260]);

    const humidityScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 260]);

    const windScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 260]);

    const timeScale = d3.scaleLinear()
      .domain([43, 44])
      .range([180, 0]);

    const dateScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.Date))
      .range([0, 860]);

    // Temperature scatter plot
    const tempSvg = d3.select(scatterPlotRef1.current);
    tempSvg.selectAll('*').remove();

    tempSvg.append('g')
      .selectAll('circle')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('cx', d => tempScale(d.temp))
      .attr('cy', d => timeScale(d.Time))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.6);

    tempSvg.append('g')
      .attr('transform', `translate(0, 180)`)
      .call(d3.axisBottom(tempScale));

    tempSvg.append('g')
      .call(d3.axisLeft(timeScale));

    // Humidity scatter plot
    const humiditySvg = d3.select(scatterPlotRef2.current);
    humiditySvg.selectAll('*').remove();

    humiditySvg.append('g')
      .selectAll('circle')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('cx', d => humidityScale(d.humidity))
      .attr('cy', d => timeScale(d.Time))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.6);

    humiditySvg.append('g')
      .attr('transform', `translate(0, 180)`)
      .call(d3.axisBottom(humidityScale));

    humiditySvg.append('g')
      .call(d3.axisLeft(timeScale));

    // Wind speed scatter plot
    const windSvg = d3.select(scatterPlotRef3.current);
    windSvg.selectAll('*').remove();

    windSvg.append('g')
      .selectAll('circle')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('cx', d => windScale(d.windSpeed))
      .attr('cy', d => timeScale(d.Time))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.6);

    windSvg.append('g')
      .attr('transform', `translate(0, 180)`)
      .call(d3.axisBottom(windScale));

    windSvg.append('g')
      .call(d3.axisLeft(timeScale));

    // Line chart
    const lineSvg = d3.select(lineChartRef.current);
    lineSvg.selectAll('*').remove();

    const lineGenerator = d3.line()
      .x(d => dateScale(d.Date))
      .y(d => timeScale(d.Time));

    lineSvg.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    lineSvg.append('g')
      .attr('transform', `translate(0, 180)`)
      .call(d3.axisBottom(dateScale));

    lineSvg.append('g')
      .call(d3.axisLeft(timeScale));

    // Add brush to line chart
    const brush = d3.brushX()
      .d3.extent([[0, 0], [860, 180]])
      .on('end', brushed);

    lineSvg.append('g')
      .attr('class', 'brush')
      .call(brush);

    function brushed(event) {
      if (!event.selection) return;
      const [x0, x1] = event.selection.map(dateScale.invert);
      setBrushExtent([x0, x1]);
      
      const filtered = parsedData.filter(d => {
        const date = d.Date;
        return date >= x0 && date <= x1;
      });
      
      setFilteredData(filtered);
    }

    // Pie chart
    const pieSvg = d3.select(pieChartRef.current);
    pieSvg.selectAll('*').remove();

    const weatherGroups = {};
    parsedData.forEach(d => {
      const weather = d.weather[0].main;
      if (!weatherGroups[weather]) {
        weatherGroups[weather] = 0;
      }
      weatherGroups[weather] += 1;
    });

    const pieData = Object.entries(weatherGroups).map(([key, value]) => ({
      weather: key,
      count: value
    }));

    const pieGenerator = d3.pie().value(d => d.count);
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(100);

    const pieGroup = pieSvg.append('g')
      .attr('transform', 'translate(200, 125)');

    pieGroup.selectAll('path')
      .data(pieGenerator(pieData))
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => d3.schemeCategory10[i])
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

  }, [data, brushExtent]);

  return (
    <div className='w-full h-full box-border resize mx-auto bg-inherit text-white overflow-hidden '>
      <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Weather Impact on 400m Sprint Performance</h2>
      
      <div className="flex justify-between">
        <div className="w-1/3">
          <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">Temperature vs Time</h3>
          <svg ref={scatterPlotRef1} width={300} height={200} />
        </div>
        
        <div className="w-1/3">
          <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">Humidity vs Time</h3>
          <svg ref={scatterPlotRef2} width={300} height={200} />
        </div>
        
        <div className="w-1/3">
          <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">Wind Speed vs Time</h3>
          <svg ref={scatterPlotRef3} width={300} height={200} />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">Performance Over Time</h3>
        <svg ref={lineChartRef} width={900} height={200} />
      </div>

      <div className="flex justify-between mt-5">
        <div className="w-1/2">
          <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">Performance by Weather Type</h3>
          <svg ref={pieChartRef} width={400} height={250} />
        </div>
      </div>
    </div>
  );
};

export default WeatherPerformanceBrush;