import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import MapGL, { Source, Layer } from "react-map-gl";
import crossfilter from "crossfilter2";
import * as d3 from "d3";
import _ from "lodash";

import ControlPanel from "./control-panel";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ScatterPlot from "./ScatterPlot";

const MAPBOX_TOKEN = ""; // Set your mapbox token here

const routeLayer = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': 'red',
    'line-width': 2
  }
};

function filterRunsByDay(runs, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return runs.filter(run => {
    const runDate = new Date(run.start_date);
    return (
      runDate.getFullYear() === year &&
      runDate.getMonth() === month &&
      runDate.getDate() === day
    );
  });
}

const CombinedRunningMapAndCharts = () => {
  const [allDays, setAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [runningData, setRunningData] = useState(null);
  const [cf, setCf] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const [groups, setGroups] = useState({});

  useEffect(() => {
    // Replace this with your actual data loading logic
    fetch("/data/sensor_track.geojson")
      .then(resp => resp.json())
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        const startTime = new Date(sortedData[0].start_date).getTime();
        const endTime = new Date(sortedData[sortedData.length - 1].start_date).getTime();
        setTimeRange([startTime, endTime]);
        setRunningData(sortedData);
        setSelectedTime(endTime);

        // Create crossfilter instance
        const cfInstance = crossfilter(sortedData);
        setCf(cfInstance);

        // Create dimensions
        const timeDim = cfInstance.dimension(d => new Date(d.start_date));
        const distanceDim = cfInstance.dimension(d => d.distance);
        const paceDim = cfInstance.dimension(d => d.average_speed);
        const elevationDim = cfInstance.dimension(d => d.total_elevation_gain);

        setDimensions({
          time: timeDim,
          distance: distanceDim,
          pace: paceDim,
          elevation: elevationDim
        });

        // Create groups
        setGroups({
          time: timeDim.group(d3.timeDay),
          distance: distanceDim.group(Math.floor),
          pace: paceDim.group(d => Math.floor(d * 10) / 10),
          elevation: elevationDim.group(Math.floor)
        });
      })
      .catch(err => console.error("Could not load data", err));
  }, []);

  const filteredData = useMemo(() => {
    if (!runningData || !cf) return null;

    const filtered = allDays
      ? cf.allFiltered()
      : filterRunsByDay(runningData, selectedTime);

    return filtered;
  }, [runningData, cf, allDays, selectedTime]);

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

  const mapData = useMemo(() => {
    if (!filteredData) return null;
    return {
      type: "FeatureCollection",
      features: filteredData.map(run => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: run.map.summary_polyline.map(coord => [coord[1], coord[0]])
        },
        properties: {
          id: run.id,
          name: run.name,
          distance: run.distance,
          moving_time: run.moving_time,
          total_elevation_gain: run.total_elevation_gain,
          start_date: run.start_date
        }
      }))
    };
  }, [filteredData]);

  return (
    <>
      <MapGL
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {mapData && (
          <Source type="geojson" data={mapData}>
            <Layer {...routeLayer} />
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
          xLabel="Date"
          yLabel="Number of Runs"
        />
        <BarChart
          dimension={dimensions.distance}
          group={groups.distance}
          onBrush={(extent) => handleChartBrush(extent, 'distance')}
          xLabel="Distance (km)"
          yLabel="Number of Runs"
        />
        <ScatterPlot
          dimension={dimensions.pace}
          group={groups.pace}
          onBrush={(extent) => handleChartBrush(extent, 'pace')}
          xLabel="Average Pace (km/h)"
          yLabel="Elevation Gain (m)"
        />
      </div>
    </>
  );
};

export default CombinedRunningMapAndCharts;

export function renderToDom(container) {
  createRoot(container).render(<CombinedRunningMapAndCharts />);
}