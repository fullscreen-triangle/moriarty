import React, { useEffect, useState } from 'react';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import {
  LineChart,
  ScatterPlot,
  RowChart,
  ChartContext,
} from 'react-dc-js';

import './App.css';

const numberFormat = d3.format('.2f');

function TrackFilter() {
  const [cx, setCx] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ksachikonye/hzevo-server/refs/heads/main/circuit/sensor_track.geojson');
        const geojsonData = await response.json();
        const rawData = geojsonData.features.map(feature => feature.properties);
        
        const dateFormatSpecifier = "%Y-%m-%d %H:%M:%S%Z";
        const dateFormatParser = d3.timeParse(dateFormatSpecifier);
        const processedData = rawData.map((d) => ({
          ...d,
          dd: dateFormatParser(d.timestamp),
          speed: parseFloat(d.speed),
          heart_rate: parseFloat(d.heart_rate),
          cadence: parseFloat(d.cadence),
          altitude: parseFloat(d.altitude),
          stance_time: parseFloat(d.stance_time),
          vertical_oscillation: parseFloat(d.vertical_oscillation)
        }));
        
        setData(processedData);
        setCx(crossfilter(processedData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!cx || data.length === 0) {
    return <p>Loading Data...</p>;
  }

  const timeDimension = cx.dimension((d) => d.dd);
  const speedDimension = cx.dimension((d) => d.speed);

  const speedByTimeGroup = timeDimension.group().reduceSum((d) => d.speed);
  const heartRateByTimeGroup = timeDimension.group().reduceSum((d) => d.heart_rate);
  const cadenceByTimeGroup = timeDimension.group().reduceSum((d) => d.cadence);

  const altitudeDimension = cx.dimension((d) => Math.floor(d.altitude));
  const altitudeGroup = altitudeDimension.group();

  return (
    <div className="App">
      <h1>Running Data Visualization</h1>
      <ChartContext>
        <LineChart
          width={990}
          height={200}
          dimension={timeDimension}
          group={speedByTimeGroup}
          x={d3.scaleTime().domain(d3.extent(data, d => d.dd))}
          xUnits={d3.timeSeconds}
          elasticY={true}
          renderHorizontalGridLines={true}
          renderArea={false}
          renderDataPoints={true}
          dotRadius={2}
          renderTitle={true}
          title={d => `Time: ${d.key.toLocaleString()}, Speed: ${numberFormat(d.value)} km/h`}
          xAxisLabel="Time"
          yAxisLabel="Speed (km/h)"
        />
        <LineChart
          width={990}
          height={200}
          dimension={timeDimension}
          group={heartRateByTimeGroup}
          x={d3.scaleTime().domain(d3.extent(data, d => d.dd))}
          xUnits={d3.timeSeconds}
          elasticY={true}
          renderHorizontalGridLines={true}
          renderArea={false}
          renderDataPoints={true}
          dotRadius={2}
          renderTitle={true}
          title={d => `Time: ${d.key.toLocaleString()}, Heart Rate: ${numberFormat(d.value)} bpm`}
          xAxisLabel="Time"
          yAxisLabel="Heart Rate (bpm)"
          colors={['red']}
        />
        <ScatterPlot
          width={480}
          height={300}
          dimension={speedDimension}
          group={speedDimension.group()}
          x={d3.scaleLinear().domain([0, d3.max(data, d => d.speed)])}
          y={d3.scaleLinear().domain([0, d3.max(data, d => d.heart_rate)])}
          xAxisLabel="Speed (km/h)"
          yAxisLabel="Heart Rate (bpm)"
          symbolSize={5}
          clipPadding={10}
          renderHorizontalGridLines={true}
          renderVerticalGridLines={true}
          title={d => `Speed: ${numberFormat(d.key)}, Heart Rate: ${numberFormat(d.value)}`}
        />
        <RowChart
          width={480}
          height={300}
          dimension={altitudeDimension}
          group={altitudeGroup}
          elasticX={true}
          xAxis={{ticks: 5}}
          title={d => `Altitude: ${d.key}m, Count: ${d.value}`}
        />
      </ChartContext>
    </div>
  );
}

export default TrackFilter;