import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dataTable5 = [
    { "stage": 1, "100m_n": 40, "100m_x_sd": "10.36 ± 0.18", "100m_anova": 0.05, "400m_n": 30, "400m_x_sd": "45.90 ± 1.12", "400m_anova": 0.01 },
    { "stage": 2, "100m_n": 35, "100m_x_sd": "10.24 ± 0.17", "100m_anova": null, "400m_n": 29, "400m_x_sd": "45.30 ± 1.05", "400m_anova": null },
    { "stage": 3, "100m_n": 39, "100m_x_sd": "10.16 ± 0.14", "100m_anova": null, "400m_n": 25, "400m_x_sd": "45.05 ± 0.85", "400m_anova": 0.05 },
    { "stage": 4, "100m_n": 41, "100m_x_sd": "10.08 ± 0.16", "100m_anova": null, "400m_n": 28, "400m_x_sd": "44.98 ± 0.90", "400m_anova": null },
    { "stage": 5, "100m_n": 45, "100m_x_sd": "10.03 ± 0.13", "100m_anova": 0.01, "400m_n": 32, "400m_x_sd": "44.76 ± 0.76", "400m_anova": 0.01 },
    { "stage": 6, "100m_n": 48, "100m_x_sd": "9.98 ± 0.12", "100m_anova": null, "400m_n": 34, "400m_x_sd": "44.65 ± 0.69", "400m_anova": null },
    { "stage": 7, "100m_n": 43, "100m_x_sd": "9.97 ± 0.15", "100m_anova": null, "400m_n": 30, "400m_x_sd": "44.71 ± 0.72", "400m_anova": null }
  ];
  
  const Table5Chart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dataTable5} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="parameter" label={{ value: 'Parameter', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Correlation (r)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="r_100m" fill="#8884d8" name="100m Correlation" />
          <Bar dataKey="r_400m" fill="#82ca9d" name="400m Correlation" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default Table5Chart;
  