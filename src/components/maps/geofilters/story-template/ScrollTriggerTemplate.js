import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "@react-spring/web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

export const ScrollTriggeredScatterplot = ({ width, height, initialData }) => {
  const [data, setData] = useState(initialData);
  const [xDomain, setXDomain] = useState([0, 100]);
  const [yDomain, setYDomain] = useState([0, 100]);
  
  const containerRef = useRef(null);
  const axesRef = useRef(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain(yDomain).range([boundsHeight, 0]);
  }, [yDomain, height]);

  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(xDomain).range([0, boundsWidth]);
  }, [xDomain, width]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", `translate(0,${boundsHeight})`)
      .call(xAxisGenerator);
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  useEffect(() => {
    if (containerRef.current) {
      // ScrollTrigger for filtering data
      ScrollTrigger.create({
        trigger: "#step-1",
        start: "top center",
        onEnter: () => {
          const filteredData = initialData.filter(d => d.x > 50);
          setData(filteredData);
        },
        onLeaveBack: () => setData(initialData),
      });

      // ScrollTrigger for changing x-axis
      ScrollTrigger.create({
        trigger: "#step-2",
        start: "top center",
        onEnter: () => setXDomain([0, 200]),
        onLeaveBack: () => setXDomain([0, 100]),
      });

      // ScrollTrigger for changing y-axis
      ScrollTrigger.create({
        trigger: "#step-3",
        start: "top center",
        onEnter: () => setYDomain([0, 200]),
        onLeaveBack: () => setYDomain([0, 100]),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [initialData]);

  const allShapes = data.map((d, i) => (
    <CircleItem
      key={d.name}
      x={xScale(d.x)}
      y={yScale(d.y)}
      color={d.x === 50 && d.y === 50 ? "blue" : d.x === 20 && d.y === 20 ? "red" : "purple"}
    />
  ));

  return (
    <div ref={containerRef}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        >
          {allShapes}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
        />
      </svg>
    </div>
  );
};

const CircleItem = ({ x, y, color }) => {
  const springProps = useSpring({
    from: { opacity: 0, r: 0 },
    to: { x, y, opacity: 1, r: 8 },
    config: { friction: 100 },
  });

  return (
    <animated.circle
      r={springProps.r}
      cx={springProps.x}
      cy={springProps.y}
      opacity={1}
      fill={color}
      fillOpacity={springProps.opacity}
    />
  );
};