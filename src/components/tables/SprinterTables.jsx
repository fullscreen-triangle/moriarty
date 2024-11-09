// components/ChartComponent.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const ChartComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  // Example: Preprocess Table 2 Data for plotting 100m and 400m results
  const stages = data.table2.map(entry => entry.stage);
  const hundredMeterData = data.table2.map(entry => parseFloat(entry["100m_x_sd"].split(" ± ")[0]));
  const fourHundredMeterData = data.table2.map(entry => parseFloat(entry["400m_x_sd"].split(" ± ")[0]));

  const chartData = {
    labels: stages,
    datasets: [
      {
        label: '100m Performance',
        data: hundredMeterData,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      },
      {
        label: '400m Performance',
        data: fourHundredMeterData,
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
      }
    ]
  };

  return (
    <div>
      <h2>Sports Performance Over Stages</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
