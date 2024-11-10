import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data for Table 2
const dataTable2 = [
    { "stage": 17, "100m_n": 12, "100m_x_sd": "10.46 ± 0.09", "100m_anova": 0.05, "400m_n": 7, "400m_x_sd": "46.29 ± 1.06", "400m_anova": 0 },
    { "stage": 18, "100m_n": 20, "100m_x_sd": "10.34 ± 0.16", "100m_anova": 0, "400m_n": 13, "400m_x_sd": "45.76 ± 1.38", "400m_anova": 0 },
    { "stage": 19, "100m_n": 34, "100m_x_sd": "10.26 ± 0.16", "100m_anova": 0, "400m_n": 20, "400m_x_sd": "45.37 ± 0.95", "400m_anova": 0 },
    { "stage": 20, "100m_n": 37, "100m_x_sd": "10.21 ± 0.22", "100m_anova": 0.01, "400m_n": 22, "400m_x_sd": "45.09 ± 0.83", "400m_anova": 0 },
    { "stage": 21, "100m_n": 41, "100m_x_sd": "10.09 ± 0.17", "100m_anova": 0.01, "400m_n": 27, "400m_x_sd": "44.76 ± 0.78", "400m_anova": 0 },
    { "stage": 22, "100m_n": 42, "100m_x_sd": "9.97 ± 0.21", "100m_anova": 0, "400m_n": 31, "400m_x_sd": "44.63 ± 0.74", "400m_anova": 0 },
    { "stage": 23, "100m_n": 39, "100m_x_sd": "9.98 ± 0.15", "100m_anova": 0, "400m_n": 34, "400m_x_sd": "44.76 ± 0.93", "400m_anova": 0 },
    { "stage": 24, "100m_n": 40, "100m_x_sd": "10.01 ± 0.18", "100m_anova": 0, "400m_n": 31, "400m_x_sd": "44.59 ± 0.64", "400m_anova": 0.05 },
    { "stage": 25, "100m_n": 38, "100m_x_sd": "10.01 ± 0.14", "100m_anova": 0, "400m_n": 26, "400m_x_sd": "44.96 ± 0.61", "400m_anova": 0 },
    { "stage": 26, "100m_n": 35, "100m_x_sd": "9.98 ± 0.15", "100m_anova": 0, "400m_n": 27, "400m_x_sd": "45.02 ± 1.02", "400m_anova": 0 }
];

const Table2Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dataTable2} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stage" label={{ value: 'Stage (years of career)', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Performance (s)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="mean_100m" stroke="#8884d8" name="100m Mean" />
        <Line type="monotone" dataKey="mean_400m" stroke="#82ca9d" name="400m Mean" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Table2Chart;
