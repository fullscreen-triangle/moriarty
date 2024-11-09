import React, { useState, useEffect, useMemo } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import crossfilter from "crossfilter2";
import * as d3 from "d3";
import _ from "lodash";

import ControlPanel from "./control-panel";
import { heatmapLayer } from "./map-style";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ScatterPlot from "./ScatterPlot";

const MAPBOX_TOKEN = "pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg"; // Set your mapbox token here

function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter(feature => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: "FeatureCollection", features };
}

const MapboxCrossfilter = () => {
  const [allDays, setAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [earthquakes, setEarthquakes] = useState(null);
  const [cf, setCf] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [groups, setGroups] = useState({});

  useEffect(() => {
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then(resp => resp.json())
      .then(json => {
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;
        setTimeRange([startTime, endTime]);
        setEarthquakes(json);
        setSelectedTime(endTime);

        // Create crossfilter instance
        const cfInstance = crossfilter(features);
        setCf(cfInstance);

        // Create dimensions
        const timeDim = cfInstance.dimension(d => d.properties.time);
        const magnitudeDim = cfInstance.dimension(d => d.properties.mag);
        const depthDim = cfInstance.dimension(d => d.geometry.coordinates[2]);
        const locationDim = cfInstance.dimension(d => d.geometry.coordinates.slice(0, 2));

        setDimensions({
          time: timeDim,
          magnitude: magnitudeDim,
          depth: depthDim,
          location: locationDim
        });

        // Create groups
        setGroups({
          time: timeDim.group(d3.timeDay),
          magnitude: magnitudeDim.group(Math.floor),
          depth: depthDim.group(Math.floor),
          location: locationDim.group()
        });
      })
      .catch(err => console.error("Could not load data", err));
  }, []);

  const filteredData = useMemo(() => {
    if (!earthquakes || !cf) return null;

    const filtered = allDays
      ? cf.allFiltered()
      : filterFeaturesByDay(earthquakes, selectedTime);

    return {
      type: "FeatureCollection",
      features: filtered
    };
  }, [earthquakes, cf, allDays, selectedTime]);

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (!allDays && dimensions.time) {
      const date = new Date(time);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime() - 1;
      dimensions.time.filterRange([startOfDay, endOfDay]);
      cf.onChange(() => {
        // This will trigger a re-render of the charts
      });
    }
  };

  const handleAllDaysChange = (value) => {
    setAllDays(value);
    if (value) {
      dimensions.time.filterAll();
      cf.onChange(() => {
        // This will trigger a re-render of the charts
      });
    } else {
      handleTimeChange(selectedTime);
    }
  };

  const handleChartBrush = (extent, dimension) => {
    dimensions[dimension].filterRange(extent);
    cf.onChange(() => {
      // This will trigger a re-render of the charts and map
    });
  };

  return (
    <>
      <MapGL
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {filteredData && (
          <Source type="geojson" data={filteredData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </MapGL>
      <ControlPanel
        startTime={timeRange[0]}
        endTime={timeRange[1]}
        selectedTime={selectedTime}
        allDays={allDays}
        onChangeTime={handleTimeChange}
        onChangeAllDays={handleAllDaysChange}
      />
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
    </>
  );
};

export default MapboxCrossfilter;

