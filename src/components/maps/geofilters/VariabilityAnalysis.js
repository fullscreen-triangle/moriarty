import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SprintDataAnalysis = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('t100m');

  useEffect(() => {
    // In a real application, you'd fetch this data from an API
    const rawData = [
      {
        "FIELD1": "Chambers Dwain",
        "Nationality": "GBR",
        "Round": "Ht 4",
        "Wind": "-0,1",
        "RT": "0,148",
        "t20m": "2,99",
        "t40m": "4,83",
        "t60m": "6,60",
        "t80m": "8,35",
        "t100m": "10,18",
        "t20-40": "1,84",
        "t40-60": "1,77",
        "t60-80": "1,75",
        "t80-100": "1,83"
      },
      // ... (other data points)
    ];

    const processedData = rawData.map(athlete => ({
      ...athlete,
      RT: parseFloat(athlete.RT.replace(',', '.')),
      t100m: parseFloat(athlete.t100m.replace(',', '.')),
      Wind: parseFloat(athlete.Wind.replace(',', '.')),
    }));

    setData(processedData);
  }, []);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => a[sortCriteria] - b[sortCriteria]);
    setSortedData(sorted);
  }, [data, sortCriteria]);

  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sum_x2 = x.reduce((total, xi) => total + xi * xi, 0);
    const sum_y2 = y.reduce((total, yi) => total + yi * yi, 0);

    const numerator = n * sum_xy - sum_x * sum_y;
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

    return numerator / denominator;
  };

  const analyzeData = () => {
    const rtCorrelation = calculateCorrelation(
      data.map(d => d.RT),
      data.map(d => d.t100m)
    );

    const windCorrelation = calculateCorrelation(
      data.map(d => d.Wind),
      data.map(d => d.t100m)
    );

    return (
      <div>
        <h3>Data Analysis</h3>
        <p>Correlation between Reaction Time and Final Time: {rtCorrelation.toFixed(4)}</p>
        <p>Correlation between Wind and Final Time: {windCorrelation.toFixed(4)}</p>
        <p>
          Interpretation: A correlation closer to -1 or 1 indicates a stronger relationship, 
          while a correlation closer to 0 indicates a weaker relationship.
        </p>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">100m Sprint Data Analysis</h2>
      
      <div className="mb-4">
        <label htmlFor="sortCriteria" className="mr-2">Sort by:</label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="border p-1"
        >
          <option value="t100m">Final Time</option>
          <option value="RT">Reaction Time</option>
          <option value="Wind">Wind Speed</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sortedData}>
          <XAxis dataKey="FIELD1" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="t100m" fill="#8884d8" name="Final Time" />
          <Bar dataKey="RT" fill="#82ca9d" name="Reaction Time" />
          <Bar dataKey="Wind" fill="#ffc658" name="Wind Speed" />
        </BarChart>
      </ResponsiveContainer>

      {analyzeData()}
    </div>
  );
};

export default SprintDataAnalysis;