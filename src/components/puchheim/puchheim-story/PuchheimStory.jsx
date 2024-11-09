
"use client"
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import scrollama from 'scrollama';
import * as d3 from 'd3';

const Chapter = ({ chapter, isActive }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (isActive && chartRef.current) {
      // Create or update the chart when the chapter becomes active
      createOrUpdateChart(chapter.data);
    }
  }, [isActive, chapter]);

  const createOrUpdateChart = (data) => {
    const svg = d3.select(chartRef.current);
    // Clear existing chart
    svg.selectAll("*").remove();

    // Create a new chart using D3
    // This is a basic example, adjust according to your data and desired chart type
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    x.domain(data.map(d => d.name));
    y.domain([0, d3.max(data, d => d.value)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value));
  };

  return (
    <div className={`step ${isActive ? 'active' : ''}`} id={chapter.id}>
      <div className={chapter.theme}>
        <h3>{chapter.title}</h3>
        {chapter.image && <img src={chapter.image} alt={chapter.title} />}
        <p>{chapter.description}</p>
        <svg ref={chartRef} width="300" height="200"></svg>
      </div>
    </div>
  );
};

const PuchheimStory = ({ config }) => {
  const mapContainer = useRef(null);
  const storyContainer = useRef(null);
  const mapRef = useRef(null);
  const scrollerRef = useRef(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  

  useEffect(() => {
    mapboxgl.accessToken = config.accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: config.style,
      center: config.chapters[0].location.center,
      zoom: config.chapters[0].location.zoom,
      bearing: config.chapters[0].location.bearing,
      pitch: config.chapters[0].location.pitch,
      interactive: false,
    });

    const setLayerOpacity = (layer) => {
      const map = mapRef.current;
      const paintProps = getLayerPaintType(layer.layer);
      paintProps.forEach(function (prop) {
        map.setPaintProperty(layer.layer, prop, layer.opacity);
      });
    };

    scrollerRef.current = scrollama();

    const handleStepEnter = async (response) => {
      const chapter = config.chapters[response.index];
      setActiveChapterIndex(response.index);
      mapRef.current[chapter.mapAnimation || 'flyTo'](chapter.location);

      if (config.showMarkers) {
        // Update marker position
      }

      if (chapter.onChapterEnter.length > 0) {
        chapter.onChapterEnter.forEach(setLayerOpacity);
      }
    };

    const handleStepExit = (response) => {
      const chapter = config.chapters[response.index];
      if (chapter.onChapterExit.length > 0) {
        chapter.onChapterExit.forEach(setLayerOpacity);
      }
    };

    scrollerRef.current
      .setup({
        step: '.step',
        offset: 0.5,
        progress: true
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    return () => {
      if (mapRef.current) mapRef.current.remove();
      if (scrollerRef.current) scrollerRef.current.destroy();
    };
  }, [config]);



  const getLayerPaintType = (layer) => {
    const layerTypes = {
      fill: ['fill-opacity'],
      line: ['line-opacity'],
      circle: ['circle-opacity', 'circle-stroke-opacity'],
      symbol: ['icon-opacity', 'text-opacity'],
      raster: ['raster-opacity'],
      'fill-extrusion': ['fill-extrusion-opacity'],
      heatmap: ['heatmap-opacity']
    };
    const layerType = mapRef.current.getLayer(layer).type;
    return layerTypes[layerType];
  };

  return (
    <div>
      <div id="map" ref={mapContainer} style={{ position: 'fixed', width: '100%', height: '100vh' }}></div>
      <div id="story" ref={storyContainer}>
        {config.chapters.map((chapter, index) => (
          <Chapter
            key={chapter.id}
            chapter={chapter}
            isActive={index === activeChapterIndex}
          />
        ))}
      </div>
    </div>
  );
};








export default PuchheimStory