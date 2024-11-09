import React, { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import { MapView } from "@deck.gl/core";
import { CSVLoader } from "@loaders.gl/csv";
import { load } from "@loaders.gl/core";
import crossfilter from "crossfilter2";
import * as d3 from "d3";
import _ from "lodash";

import RangeInput from "./range-input";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ScatterPlot from "./ScatterPlot";

const DATA_URL = "https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/data.csv";

const MAP_VIEW = new MapView({
  repeat: true,
  farZMultiplier: 100
});

const INITIAL_VIEW_STATE = {
  latitude: 36.5,
  longitude: -120,
  zoom: 5.5,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MS_PER_DAY = 8.64e7;

const dataFilter = new DataFilterExtension({
  filterSize: 1,
  fp64: false
});

function formatLabel(timestamp) {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}`;
}

function getTimeRange(data) {
  if (!data) {
    return null;
  }
  return data.reduce(
    (range, d) => {
      const t = d.timestamp;
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
    Time: ${new Date(object.timestamp).toUTCString()}
    Magnitude: ${object.magnitude}
    Depth: ${object.depth}
    `
  );
}

const CombinedMapAndCharts = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [cf, setCf] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [groups, setGroups] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const rawData = (await load(DATA_URL, CSVLoader)).data;
      const processedData = rawData.map(row => ({
        timestamp: new Date(`${row.DateTime} UTC`).getTime(),
        latitude: parseFloat(row.Latitude),
        longitude: parseFloat(row.Longitude),
        depth: parseFloat(row.Depth),
        magnitude: parseFloat(row.Magnitude)
      }));
      setData(processedData);

      const cfInstance = crossfilter(processedData);
      setCf(cfInstance);

      const timeDim = cfInstance.dimension(d => d.timestamp);
      const magnitudeDim = cfInstance.dimension(d => d.magnitude);
      const depthDim = cfInstance.dimension(d => d.depth);
      const locationDim = cfInstance.dimension(d => [d.longitude, d.latitude]);

      setDimensions({
        time: timeDim,
        magnitude: magnitudeDim,
        depth: depthDim,
        location: locationDim
      });

      setGroups({
        time: timeDim.group(),
        magnitude: magnitudeDim.group(),
        depth: depthDim.group(),
        location: locationDim.group()
      });
    };

    fetchData();
  }, []);

  const timeRange = useMemo(() => getTimeRange(data), [data]);
  const filterValue = filter || timeRange;

  const layers = [
    filterValue &&
    new ScatterplotLayer({
      id: "earthquakes",
      data: cf ? cf.allFiltered() : [],
      opacity: 0.8,
      radiusScale: 100,
      radiusMinPixels: 1,
      wrapLongitude: true,
      getPosition: d => [d.longitude, d.latitude, -d.depth * 1000],
      getRadius: d => Math.pow(2, d.magnitude),
      getFillColor: d => {
        const r = Math.sqrt(Math.max(d.depth, 0));
        return [255 - r * 15, r * 5, r * 10];
      },
      getFilterValue: d => d.timestamp,
      filterRange: [filterValue[0], filterValue[1]],
      filterSoftRange: [
        filterValue[0] * 0.9 + filterValue[1] * 0.1,
        filterValue[0] * 0.1 + filterValue[1] * 0.9
      ],
      extensions: [dataFilter],
      pickable: true
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
          animationSpeed={MS_PER_DAY * 30}
          formatLabel={formatLabel}
          onChange={handleFilter}
        />
      )}

      <div className="charts">
        <LineChart
          dimension={dimensions.time}
          group={groups.time}
          onBrush={(extent) => handleChartBrush(extent, 'time')}
        />
        <BarChart
          dimension={dimensions.magnitude}
          group={groups.magnitude}
          onBrush={(extent) => handleChartBrush(extent, 'magnitude')}
        />
        <ScatterPlot
          dimension={dimensions.location}
          group={groups.location}
          onBrush={(extent) => handleChartBrush(extent, 'location')}
        />
      </div>
    </div>
  );
};

export default CombinedMapAndCharts;

export async function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<CombinedMapAndCharts />);
}