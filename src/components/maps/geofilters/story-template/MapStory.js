import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import { useSpring, animated } from '@react-spring/web';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const MapStory = ({ config, width, height, geoJsonUrl }) => {
  const [map, setMap] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [xVariable, setXVariable] = useState('x');
  const [yVariable, setYVariable] = useState('y');

  const mapContainer = useRef(null);
  const chartContainer = useRef(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  useEffect(() => {
    mapboxgl.accessToken = config.accessToken;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: config.style,
        center: config.chapters[0].location.center,
        zoom: config.chapters[0].location.zoom,
        bearing: config.chapters[0].location.bearing,
        pitch: config.chapters[0].location.pitch,
        interactive: false,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();

        // Load GeoJSON data
        fetch(geoJsonUrl)
          .then(response => response.json())
          .then(data => {
            setGeoJsonData(data);
            map.addSource('geojson-source', {
              type: 'geojson',
              data: data
            });
            map.addLayer({
              id: 'geojson-layer',
              type: 'circle',
              source: 'geojson-source',
              paint: {
                'circle-radius': 6,
                'circle-color': '#B42222'
              }
            });
          });
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, config]);

  useEffect(() => {
    if (geoJsonData) {
      const features = geoJsonData.features;
      setChartData(features.map(f => ({
        x: f.properties[xVariable],
        y: f.properties[yVariable],
        name: f.properties.name || ''
      })));
    }
  }, [geoJsonData, xVariable, yVariable]);

  useEffect(() => {
    if (chartContainer.current && chartData.length > 0) {
      const svg = d3.select(chartContainer.current);
      svg.selectAll("*").remove();

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d[xVariable])])
        .range([0, boundsWidth]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d[yVariable])])
        .range([boundsHeight, 0]);

      const g = svg.append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

      g.selectAll("circle")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[xVariable]))
        .attr("cy", d => yScale(d[yVariable]))
        .attr("r", 5)
        .attr("fill", "purple");

      g.append("g")
        .attr("transform", `translate(0,${boundsHeight})`)
        .call(d3.axisBottom(xScale));

      g.append("g")
        .call(d3.axisLeft(yScale));

      g.append("text")
        .attr("x", boundsWidth / 2)
        .attr("y", boundsHeight + MARGIN.bottom - 10)
        .style("text-anchor", "middle")
        .text(xVariable);

      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - MARGIN.left)
        .attr("x", 0 - (boundsHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yVariable);
    }
  }, [chartData, xVariable, yVariable, boundsWidth, boundsHeight]);

  useEffect(() => {
    const scroller = ScrollTrigger.create({
      trigger: "#story",
      start: "top top",
      end: "bottom bottom",
      onUpdate: self => {
        const newStep = Math.floor(self.progress * config.chapters.length);
        if (newStep !== currentStep && newStep < config.chapters.length) {
          setCurrentStep(newStep);
          const chapter = config.chapters[newStep];
          if (map) {
            map.flyTo(chapter.location);
          }
          if (chapter.xVariable && chapter.yVariable) {
            setXVariable(chapter.xVariable);
            setYVariable(chapter.yVariable);
          }
        }
      }
    });

    return () => scroller.kill();
  }, [config, map, currentStep]);

  return (
    <div id="story">
      <div ref={mapContainer} style={{ width: '100%', height: '50vh' }} />
      <svg ref={chartContainer} width={width} height={height} />
      {config.chapters.map((chapter, idx) => (
        <div key={idx} className="step" data-step={idx}>
          <div className={`${config.theme} ${config.alignment}`}>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapStory;