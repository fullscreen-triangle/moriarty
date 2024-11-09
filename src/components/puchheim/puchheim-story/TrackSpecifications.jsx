import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TrackSpecifications = () => {
  const [trackDetails, setTrackDetails] = useState([]);

  useEffect(() => {
    fetchTrackData();
  }, []);

  const fetchTrackData = async () => {
    try {
      const response = await fetch("/json/puchheim/track_dimensions.json");
      const data = await response.json();
      const newTrackDetails = data.map((lane, index) => ({
        icon: createChart(lane, index),
        title: `Lane ${lane.Lane}`,
        description: `Total length: ${lane["Total length"]}, Radius: ${lane.Radius}`,
      }));
      setTrackDetails(newTrackDetails);
    } catch (error) {
      console.error("Error fetching track data:", error);
    }
  };

  const createChart = (lane, index) => {
    // We'll cycle through different chart types
    const chartTypes = [
      createRadialBarChart,
      createDonutChart,
      createBarChart,
      createLineChart,
      createAreaChart,
      createScatterChart,
      createHeatmapChart,
      createPolarAreaChart,
      createTreemapChart,
    ];
    const chartFunction = chartTypes[index % chartTypes.length];
    return chartFunction(lane);
  };

  const createRadialBarChart = (lane) => {
    const options = {
      chart: { height: 150, type: "radialBar" },
      plotOptions: { radialBar: { hollow: { size: "70%" } } },
      labels: ["Lane " + lane.Lane],
    };
    const series = [parseFloat(lane["Total length"])];
    return (
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={150}
      />
    );
  };

  const createDonutChart = (lane) => {
    const options = {
      chart: { type: "donut" },
      labels: ["Radius", "Delta", "Angle"],
      legend: { show: false },
    };
    const series = [
      parseFloat(lane.Radius),
      parseFloat(lane.Delta),
      parseFloat(lane.Angle),
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="donut"
        height={150}
      />
    );
  };

  const createBarChart = (lane) => {
    const options = {
      chart: { type: "bar" },
      xaxis: { categories: ["Total length", "Radius", "Semi-circle length"] },
    };
    const series = [
      {
        data: [
          parseFloat(lane["Total length"]),
          parseFloat(lane.Radius),
          parseFloat(lane["Semi-circle length"]),
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="bar"
        height={150}
      />
    );
  };

  const createLineChart = (lane) => {
    const options = {
      chart: { type: "line" },
      xaxis: {
        categories: ["Total length", "Radius", "Semi-circle length", "Delta"],
      },
    };
    const series = [
      {
        data: [
          parseFloat(lane["Total length"]),
          parseFloat(lane.Radius),
          parseFloat(lane["Semi-circle length"]),
          parseFloat(lane.Delta),
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height={150}
      />
    );
  };

  const createAreaChart = (lane) => {
    const options = {
      chart: { type: "area" },
      xaxis: {
        categories: ["Total length", "Radius", "Semi-circle length", "Delta"],
      },
    };
    const series = [
      {
        data: [
          parseFloat(lane["Total length"]),
          parseFloat(lane.Radius),
          parseFloat(lane["Semi-circle length"]),
          parseFloat(lane.Delta),
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="area"
        height={150}
      />
    );
  };

  const createScatterChart = (lane) => {
    const options = {
      chart: { type: "scatter" },
      xaxis: { type: "numeric" },
    };
    const series = [
      {
        data: [
          { x: parseFloat(lane.Radius), y: parseFloat(lane["Total length"]) },
          { x: parseFloat(lane.Delta), y: parseFloat(lane.Angle) },
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="scatter"
        height={150}
      />
    );
  };

  const createHeatmapChart = (lane) => {
    const options = {
      chart: { type: "heatmap" },
      dataLabels: { enabled: false },
    };
    const series = [
      {
        name: "Lane " + lane.Lane,
        data: [
          { x: "Total length", y: parseFloat(lane["Total length"]) },
          { x: "Radius", y: parseFloat(lane.Radius) },
          {
            x: "Semi-circle length",
            y: parseFloat(lane["Semi-circle length"]),
          },
          { x: "Delta", y: parseFloat(lane.Delta) },
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="heatmap"
        height={150}
      />
    );
  };

  const createPolarAreaChart = (lane) => {
    const options = {
      chart: { type: "polarArea" },
      labels: ["Total length", "Radius", "Semi-circle length", "Delta"],
    };
    const series = [
      parseFloat(lane["Total length"]),
      parseFloat(lane.Radius),
      parseFloat(lane["Semi-circle length"]),
      parseFloat(lane.Delta),
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="polarArea"
        height={150}
      />
    );
  };

  const createTreemapChart = (lane) => {
    const options = {
      chart: { type: "treemap" },
    };
    const series = [
      {
        data: [
          { x: "Total length", y: parseFloat(lane["Total length"]) },
          { x: "Radius", y: parseFloat(lane.Radius) },
          {
            x: "Semi-circle length",
            y: parseFloat(lane["Semi-circle length"]),
          },
          { x: "Delta", y: parseFloat(lane.Delta) },
        ],
      },
    ];
    return (
      <Chart
        options={options}
        series={series}
        type="treemap"
        height={150}
      />
    );
  };

  return (
    <div className="container box-border mx-auto resize items-center justify-center overflow-hidden">
      {trackDetails.map((detail, index) => (
        <div key={index} style={{ display: "inline-block", margin: "10px" }}>
          {detail.icon}
          <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-white">{detail.title}</h3>
          <p>{detail.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackSpecifications;
