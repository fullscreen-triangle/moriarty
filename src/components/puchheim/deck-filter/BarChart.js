import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ dimension, group, onBrush }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!dimension || !group) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("end", brushended);

    function brushended() {
      if (!d3.event.sourceEvent) return;
      if (!d3.event.selection) return;
      const extent = d3.event.selection.map(x.invert);
      onBrush(extent);
    }

    function updateChart() {
      const data = group.all();

      x.domain(data.map(d => d.key));
      y.domain([0, d3.max(data, d => d.value)]);

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value));

      g.append("g")
        .attr("class", "brush")
        .call(brush);
    }

    updateChart();

    return () => {
      svg.selectAll("*").remove();
    };
  }, [dimension, group, onBrush]);

  return <svg ref={svgRef} width="400" height="200"></svg>;
};

export default BarChart;