import React, { Component } from "react";
import * as d3 from "d3";

const width = 1200;
const height = 800;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const chartWidth = (width - margin.left - margin.right) / 2;
const chartHeight = (height - margin.top - margin.bottom) / 2;

class GPSVisualization extends Component {
  state = {
    speedPath: null,
    heartRatePath: null,
    altitudePath: null,
    cadenceBars: [],
  };

  xScale = d3.scaleTime().range([0, chartWidth]);
  yScaleSpeed = d3.scaleLinear().range([chartHeight, 0]);
  yScaleHeartRate = d3.scaleLinear().range([chartHeight, 0]);
  yScaleAltitude = d3.scaleLinear().range([chartHeight, 0]);
  yScaleCadence = d3.scaleLinear().range([chartHeight, 0]);

  xAxis = d3.axisBottom().scale(this.xScale);
  yAxisSpeed = d3.axisLeft().scale(this.yScaleSpeed);
  yAxisHeartRate = d3.axisLeft().scale(this.yScaleHeartRate);
  yAxisAltitude = d3.axisLeft().scale(this.yScaleAltitude);
  yAxisCadence = d3.axisLeft().scale(this.yScaleCadence);

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const parsedData = data.map(d => ({
      timestamp: new Date(d.properties.timestamp),
      speed: d.properties.speed * 3.6, // convert m/s to km/h
      heartRate: d.properties.heart_rate,
      altitude: d.properties.altitude,
      cadence: d.properties.cadence,
    }));

    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.timestamp))
      .range([0, chartWidth]);

    const yScaleSpeed = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.speed)])
      .range([chartHeight, 0]);

    const yScaleHeartRate = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.heartRate)])
      .range([chartHeight, 0]);

    const yScaleAltitude = d3.scaleLinear()
      .domain(d3.extent(parsedData, d => d.altitude))
      .range([chartHeight, 0]);

    const yScaleCadence = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.cadence)])
      .range([chartHeight, 0]);

    const line = d3.line()
      .x(d => xScale(d.timestamp))
      .curve(d3.curveMonotoneX);

    const speedPath = line.y(d => yScaleSpeed(d.speed))(parsedData);
    const heartRatePath = line.y(d => yScaleHeartRate(d.heartRate))(parsedData);
    const altitudePath = line.y(d => yScaleAltitude(d.altitude))(parsedData);

    const cadenceBars = parsedData.map(d => ({
      x: xScale(d.timestamp),
      y: yScaleCadence(d.cadence),
      height: chartHeight - yScaleCadence(d.cadence),
    }));

    return { 
      speedPath, 
      heartRatePath, 
      altitudePath, 
      cadenceBars,
      xScale,
      yScaleSpeed,
      yScaleHeartRate,
      yScaleAltitude,
      yScaleCadence,
    };
  }

  componentDidMount() {
    this.drawAxes();
  }

  componentDidUpdate() {
    this.drawAxes();
  }

  drawAxes() {
    d3.select(this.refs.xAxisSpeed).call(this.xAxis);
    d3.select(this.refs.yAxisSpeed).call(this.yAxisSpeed);
    d3.select(this.refs.xAxisHeartRate).call(this.xAxis);
    d3.select(this.refs.yAxisHeartRate).call(this.yAxisHeartRate);
    d3.select(this.refs.xAxisAltitude).call(this.xAxis);
    d3.select(this.refs.yAxisAltitude).call(this.yAxisAltitude);
    d3.select(this.refs.xAxisCadence).call(this.xAxis);
    d3.select(this.refs.yAxisCadence).call(this.yAxisCadence);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {/* Speed Chart */}
        <g transform={`translate(${margin.left},${margin.top})`}>
          <path d={this.state.speedPath} fill="none" stroke="blue" strokeWidth="1.5" />
          <g ref="xAxisSpeed" transform={`translate(0,${chartHeight})`} />
          <g ref="yAxisSpeed" />
          <text x={chartWidth / 2} y={chartHeight + 25} textAnchor="middle">Time</text>
          <text transform={`rotate(-90)`} y={-30} x={-chartHeight / 2} dy="1em" textAnchor="middle">Speed (km/h)</text>
        </g>

        {/* Heart Rate Chart */}
        <g transform={`translate(${margin.left + chartWidth + margin.right},${margin.top})`}>
          <path d={this.state.heartRatePath} fill="none" stroke="red" strokeWidth="1.5" />
          <g ref="xAxisHeartRate" transform={`translate(0,${chartHeight})`} />
          <g ref="yAxisHeartRate" />
          <text x={chartWidth / 2} y={chartHeight + 25} textAnchor="middle">Time</text>
          <text transform={`rotate(-90)`} y={-30} x={-chartHeight / 2} dy="1em" textAnchor="middle">Heart Rate (bpm)</text>
        </g>

        {/* Altitude Chart */}
        <g transform={`translate(${margin.left},${margin.top + chartHeight + margin.bottom})`}>
          <path d={this.state.altitudePath} fill="none" stroke="green" strokeWidth="1.5" />
          <g ref="xAxisAltitude" transform={`translate(0,${chartHeight})`} />
          <g ref="yAxisAltitude" />
          <text x={chartWidth / 2} y={chartHeight + 25} textAnchor="middle">Time</text>
          <text transform={`rotate(-90)`} y={-30} x={-chartHeight / 2} dy="1em" textAnchor="middle">Altitude (m)</text>
        </g>

        {/* Cadence Chart */}
        <g transform={`translate(${margin.left + chartWidth + margin.right},${margin.top + chartHeight + margin.bottom})`}>
          {this.state.cadenceBars.map((d, i) => (
            <rect key={i} x={d.x} y={d.y} width="2" height={d.height} fill="orange" />
          ))}
          <g ref="xAxisCadence" transform={`translate(0,${chartHeight})`} />
          <g ref="yAxisCadence" />
          <text x={chartWidth / 2} y={chartHeight + 25} textAnchor="middle">Time</text>
          <text transform={`rotate(-90)`} y={-30} x={-chartHeight / 2} dy="1em" textAnchor="middle">Cadence (spm)</text>
        </g>
      </svg>
    );
  }
}

export default GPSVisualization;