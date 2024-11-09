import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 60 };

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.Name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => parseFloat(d.Time)) - 0.1, d3.max(data, d => parseFloat(d.Time)) + 0.1])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.Name))
      .attr("y", d => yScale(parseFloat(d.Time)))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(parseFloat(d.Time)))
      .attr("fill", d => colorScale(d.Country));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .text("Athlete Names");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Time (seconds)");

  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;