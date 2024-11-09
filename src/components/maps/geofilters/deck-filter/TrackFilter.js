import React, { useState, useEffect, useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { MapView } from "@deck.gl/core";
import crossfilter from "crossfilter2";


import RangeInput from "./RangeInput";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

const MAP_VIEW = new MapView({
  repeat: true,
  farZMultiplier: 100
});

const INITIAL_VIEW_STATE = {
  latitude: 48.18,
  longitude: 11.35,
  zoom: 14,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MS_PER_DAY = 8.64e7;

function formatLabel(timestamp) {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}

function getTimeRange(data) {
  if (!data || data.length === 0) {
    return null;
  }
  return data.reduce(
    (range, d) => {
      const t = new Date(d.properties.timestamp).getTime();
      range[0] = Math.min(range[0], t);
      range[1] = Math.max(range[1], t);
      return range;
    },
    [Infinity, -Infinity]
  );
}

function getTooltip({ object }) {
  return (
    object &&
    `\
    Time: ${object.properties.timestamp}
    Heart Rate: ${object.properties.heart_rate}
    Speed: ${object.properties.speed}
    Altitude: ${object.properties.altitude}
    `
  );
}

const TrackFilter = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [cf, setCf] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [groups, setGroups] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/track/sensor_track.geojson');
        const geojsonData = await response.json();
        const features = geojsonData.features;

        setData(features);

        const cfInstance = crossfilter(features);
        setCf(cfInstance);

        const timeDim = cfInstance.dimension(d => new Date(d.properties.timestamp).getTime());
        const heartRateDim = cfInstance.dimension(d => d.properties.heart_rate);
        const speedDim = cfInstance.dimension(d => d.properties.speed);

        setDimensions({
          time: timeDim,
          heartRate: heartRateDim,
          speed: speedDim,
        });

        setGroups({
          time: timeDim.group(d => d - (d % MS_PER_DAY)),
          heartRate: heartRateDim.group(Math.floor),
          speed: speedDim.group(d => Math.floor(d * 10) / 10),
        });
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchData();
  }, []);

  const timeRange = useMemo(() => getTimeRange(data), [data]);
  const filterValue = filter || timeRange;

  const layers = [
    new ScatterplotLayer({
      id: 'geojson-layer',
      data: cf ? cf.allFiltered() : [],
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.geometry.coordinates,
      getRadius: d => Math.sqrt(d.properties.speed) * 10,
      getFillColor: d => [255, 140, 0],
      getLineColor: d => [0, 0, 0],
    })
  ];

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    dimensions.time.filterRange(newFilter);
    cf.onChange(() => {
      setData(cf.allFiltered());
    });
  };

  const handleChartBrush = (extent, dimension) => {
    dimensions[dimension].filterRange(extent);
    cf.onChange(() => {
      setData(cf.allFiltered());
    });
  };

  return (
    <div>
      <DeckGL
        views={MAP_VIEW}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>

      {timeRange && (
        <RangeInput
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          animationSpeed={MS_PER_DAY}
          formatLabel={formatLabel}
          onChange={handleFilter}
        />
      )}

      <div className="charts">
        <LineChart
          dimension={dimensions.time}
          group={groups.time}
          onBrush={(extent) => handleChartBrush(extent, 'time')}
          title="Time"
        />
        <BarChart
          dimension={dimensions.heartRate}
          group={groups.heartRate}
          onBrush={(extent) => handleChartBrush(extent, 'heartRate')}
          title="Heart Rate"
        />
        <BarChart
          dimension={dimensions.speed}
          group={groups.speed}
          onBrush={(extent) => handleChartBrush(extent, 'speed')}
          title="Speed"
        />
      </div>
    </div>
  );
};

export default TrackFilter;