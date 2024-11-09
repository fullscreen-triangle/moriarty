import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dataTable3 = [
    { "stage": 1, "100m_n": 50, "100m_x_sd": "10.37 ± 0.21", "100m_anova": 0.01, "400m_n": 50, "400m_x_sd": "45.81 ± 1.29", "400m_anova": 0.01 },
    { "stage": 2, "100m_n": 45, "100m_x_sd": "10.26 ± 0.21", "100m_anova": 0.01, "400m_n": 38, "400m_x_sd": "45.15 ± 0.92", "400m_anova": 0.01 },
    { "stage": 3, "100m_n": 42, "100m_x_sd": "10.11 ± 0.15", "100m_anova": null, "400m_n": 39, "400m_x_sd": "44.80 ± 0.57", "400m_anova": null },
    { "stage": 4, "100m_n": 47, "100m_x_sd": "10.06 ± 0.14", "100m_anova": 0.05, "400m_n": 36, "400m_x_sd": "44.70 ± 0.64", "400m_anova": null },
    { "stage": 5, "100m_n": 42, "100m_x_sd": "9.99 ± 0.13", "100m_anova": null, "400m_n": 37, "400m_x_sd": "44.70 ± 0.81", "400m_anova": null },
    { "stage": 6, "100m_n": 47, "100m_x_sd": "9.97 ± 0.12", "100m_anova": null, "400m_n": 31, "400m_x_sd": "44.70 ± 0.72", "400m_anova": null },
    { "stage": 7, "100m_n": 43, "100m_x_sd": "9.95 ± 0.24", "100m_anova": null, "400m_n": 26, "400m_x_sd": "44.76 ± 0.74", "400m_anova": null }
  ];
  
  const Table3Chart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dataTable3} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" label={{ value: 'Stage (years of career)', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Performance (s)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="mean_100m" fill="#8884d8" name="100m Mean" />
          <Bar dataKey="mean_400m" fill="#82ca9d" name="400m Mean" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default Table3Chart;
  