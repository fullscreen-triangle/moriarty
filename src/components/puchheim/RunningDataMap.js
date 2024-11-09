import React, { useState, useEffect, useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import { MapView } from "@deck.gl/core";
import RangeInput from "../maps/geofilters/deck-filter/RangeInput";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  latitude: 48.1835,
  longitude: 11.3565,
  zoom: 18,
  pitch: 0,
  bearing: 0
};

const MAP_VIEW = new MapView({ repeat: true });

const dataFilter = new DataFilterExtension({ filterSize: 1 });

function formatLabel(timestamp) {
  const date = new Date(timestamp);
  return `${date.getMinutes()}:${date.getSeconds().toString().padStart(2, '0')}`;
}

function getTimeRange(data) {
  if (!data || data.length === 0) return null;
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
  if (!object) return null;
  const { timestamp, heart_rate, speed, altitude } = object.properties;
  return `
    Time: ${new Date(timestamp).toLocaleTimeString()}
    Heart Rate: ${heart_rate} bpm
    Speed: ${speed.toFixed(2)} m/s
    Altitude: ${altitude} m
  `;
}

export default function RunningDataMap({ dataUrl }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData.features);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching data:", e);
        setError(e.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [dataUrl]);

  const timeRange = useMemo(() => getTimeRange(data), [data]);
  const filterValue = filter || timeRange;

  const layers = [
    data && new ScatterplotLayer({
      id: 'running-data',
      data,
      opacity: 0.8,
      radiusScale: 6,
      radiusMinPixels: 3,
      wrapLongitude: true,
      getPosition: d => d.geometry.coordinates.concat([d.properties.altitude]),
      getRadius: d => Math.sqrt(d.properties.speed) * 2,
      getFillColor: d => [
        255 - Math.min(d.properties.heart_rate, 255),
        Math.min(d.properties.heart_rate, 255),
        0
      ],
      getFilterValue: d => new Date(d.properties.timestamp).getTime(),
      filterRange: filterValue,
      extensions: [dataFilter],
      pickable: true
    })
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
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
          animationSpeed={1000} // 1 second per frame
          formatLabel={formatLabel}
          onChange={setFilter}
        />
      )}
    </>
  );
}