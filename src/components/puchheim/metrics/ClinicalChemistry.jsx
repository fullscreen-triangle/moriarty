import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AthleteDashboard = () => {
  // Sample array data - replace with your actual arrays
  const [bloodData, setBloodData] = useState({
    hemoglobin: [14.2, 14.5, 14.8, 15.1, 15.4, 15.7, 16.0, 15.8, 15.6, 15.4, 15.2, 15.0],
    ferritin: [45, 48, 51, 54, 57, 60, 63, 61, 59, 57, 55, 53],
    vitaminD: [32, 35, 38, 41, 44, 47, 50, 48, 46, 44, 42, 40]
  });

  // Transform array data into the format needed for charts
  const transformedData = bloodData.hemoglobin.map((_, index) => ({
    index: index + 1,
    hemoglobin: bloodData.hemoglobin[index],
    ferritin: bloodData.ferritin[index],
    vitaminD: bloodData.vitaminD[index]
  }));

  // Calculate basic statistics
  const calculateStats = (array) => {
    const mean = array.reduce((sum, val) => sum + val, 0) / array.length;
    const sorted = [...array].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = array.length % 2 === 0 
      ? (sorted[array.length/2 - 1] + sorted[array.length/2]) / 2
      : sorted[Math.floor(array.length/2)];
    
    return { mean, median, min, max };
  };

  const stats = {
    hemoglobin: calculateStats(bloodData.hemoglobin),
    ferritin: calculateStats(bloodData.ferritin),
    vitaminD: calculateStats(bloodData.vitaminD)
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-4 flex">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Hemoglobin</h3>
          <p className="text-4xl font-bold">{stats.hemoglobin.mean.toFixed(2)}</p>
          <div className="mt-4">
            <p>Min: {stats.hemoglobin.min.toFixed(2)}</p>
            <p>Median: {stats.hemoglobin.median.toFixed(2)}</p>
            <p>Max: {stats.hemoglobin.max.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={transformedData}>
              <XAxis dataKey="index" hide />
              <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <Tooltip />
              <Line type="monotone" dataKey="hemoglobin" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 flex">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Ferritin</h3>
          <p className="text-4xl font-bold">{stats.ferritin.mean.toFixed(2)}</p>
          <div className="mt-4">
            <p>Min: {stats.ferritin.min.toFixed(2)}</p>
            <p>Median: {stats.ferritin.median.toFixed(2)}</p>
            <p>Max: {stats.ferritin.max.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={transformedData}>
              <XAxis dataKey="index" hide />
              <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <Tooltip />
              <Line type="monotone" dataKey="ferritin" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 flex">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Vitamin D</h3>
          <p className="text-4xl font-bold">{stats.vitaminD.mean.toFixed(2)}</p>
          <div className="mt-4">
            <p>Min: {stats.vitaminD.min.toFixed(2)}</p>
            <p>Median: {stats.vitaminD.median.toFixed(2)}</p>
            <p>Max: {stats.vitaminD.max.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={transformedData}>
              <XAxis dataKey="index" hide />
              <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
              <Tooltip />
              <Line type="monotone" dataKey="vitaminD" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AthleteDashboard;