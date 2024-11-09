import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ dimension, group, onBrush }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!dimension || !group) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on("end", brushended);

    function brushended() {
      if (!d3.event.sourceEvent) return;
      if (!d3.event.selection) return;
      const [[x0, y0], [x1, y1]] = d3.event.selection;
      const extent = [[x.invert(x0), y.invert(y1)], [x.invert(x1), y.invert(y0)]];
      onBrush(extent);
    }

    function updateChart() {
      const data = group.all();

      x.domain(d3.extent(data, d => d.key[0]));
      y.domain(d3.extent(data, d => d.key[1]));

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

      g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", d => x(d.key[0]))
        .attr("cy", d => y(d.key[1]));

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

export default ScatterPlot;