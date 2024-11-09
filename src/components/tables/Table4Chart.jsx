import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
const dataTable4 = [
    { "stage": -4, "100m_n": 40, "100m_x_sd": "10.14 ± 0.19", "100m_anova": null, "400m_n": 21, "400m_x_sd": "45.40 ± 1.06", "400m_anova": null },
    { "stage": -3, "100m_n": 41, "100m_x_sd": "10.09 ± 0.19", "100m_anova": null, "400m_n": 29, "400m_x_sd": "45.27 ± 0.89", "400m_anova": null },
    { "stage": -2, "100m_n": 46, "100m_x_sd": "10.02 ± 0.12", "100m_anova": null, "400m_n": 31, "400m_x_sd": "45.08 ± 0.83", "400m_anova": 0.05 },
    { "stage": -1, "100m_n": 45, "100m_x_sd": "9.95 ± 0.20", "100m_anova": 0.01, "400m_n": 38, "400m_x_sd": "44.68 ± 0.61", "400m_anova": 0.01 },
    { "stage": "PB", "100m_n": 50, "100m_x_sd": "9.86 ± 0.07", "100m_anova": 0.01, "400m_n": 50, "400m_x_sd": "44.06 ± 0.32", "400m_anova": 0.01 },
    { "stage": 1, "100m_n": 37, "100m_x_sd": "9.98 ± 0.11", "100m_anova": null, "400m_n": 37, "400m_x_sd": "44.87 ± 0.83", "400m_anova": null },
    { "stage": 2, "100m_n": 34, "100m_x_sd": "9.99 ± 0.12", "100m_anova": null, "400m_n": 21, "400m_x_sd": "44.85 ± 0.66", "400m_anova": 0.05 },
    { "stage": 3, "100m_n": 34, "100m_x_sd": "10.06 ± 0.20", "100m_anova": null, "400m_n": 17, "400m_x_sd": "45.34 ± 0.73", "400m_anova": null },
    { "stage": 4, "100m_n": 24, "100m_x_sd": "10.05 ± 0.13", "100m_anova": null, "400m_n": 12, "400m_x_sd": "45.27 ± 0.78", "400m_anova": null }
  ];
  
  const Table4Chart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataTable4} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" label={{ value: 'Stage (years from PB)', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Performance (s)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mean_100m" stroke="#8884d8" name="100m Mean" />
          <Line type="monotone" dataKey="mean_400m" stroke="#82ca9d" name="400m Mean" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  export default Table4Chart;
  