import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 60 };

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const parseDate = d3.timeParse("%d.%m.%Y");
    const sortedData = data.sort((a, b) => parseDate(a.Date) - parseDate(b.Date));

    const xScale = d3.scaleTime()
      .domain(d3.extent(sortedData, d => parseDate(d.Date)))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(sortedData, d => parseFloat(d.Time)) - 0.1, d3.max(sortedData, d => parseFloat(d.Time)) + 0.1])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(parseDate(d.Date)))
      .y(d => yScale(parseFloat(d.Time)));

    svg.append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.selectAll(".dot")
      .data(sortedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(parseDate(d.Date)))
      .attr("cy", d => yScale(parseFloat(d.Time)))
      .attr("r", 5)
      .attr("fill", "steelblue");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .text("Date");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Time (seconds)");

  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default LineChart;