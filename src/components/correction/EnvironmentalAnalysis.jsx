import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Wind, ArrowUp, Gauge } from 'lucide-react';

const EnvironmentalAnalysis = ({ analysisData }) => {
  const createChartData = (factor) => {
    const stats = analysisData.summary_statistics[factor];
    return [
      { name: 'Minimum', value: stats.optimal_range.lower },
      { name: 'Mean', value: stats.mean },
      { name: 'Maximum', value: stats.optimal_range.upper }
    ];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Wind Impact Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wind className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Wind Impact</h3>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">
              {(analysisData.environmental_factors.wind.wind_effect.correlation * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Correlation with Performance</p>
          </div>
        </div>

        {/* Altitude Effect Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Altitude Effect</h3>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">
              {(analysisData.environmental_factors.altitude.altitude_effect.correlation * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Correlation with Performance</p>
          </div>
        </div>

        {/* Pressure Impact Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Pressure Impact</h3>
          </div>
          <div>
            <p className="text-2xl font-bold mb-1">
              {(analysisData.environmental_factors.pressure.pressure_effect.correlation * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Correlation with Performance</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environmental Factors Analysis</h2>
        
        {/* Wind Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Wind Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Statistics:</p>
              <ul className="list-none pl-4">
                <li>Mean Speed: {analysisData.environmental_factors.wind.wind_speed_stats.mean.toFixed(2)} m/s</li>
                <li>Max Speed: {analysisData.environmental_factors.wind.wind_speed_stats.max.toFixed(2)} m/s</li>
                <li>R-squared: {(analysisData.environmental_factors.wind.wind_effect.r_squared * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Performance Impact:</p>
              <ul className="list-none pl-4">
                <li>Correlation: {(analysisData.environmental_factors.wind.wind_effect.correlation * 100).toFixed(1)}%</li>
                <li>P-value: {analysisData.environmental_factors.wind.wind_effect.p_value.toFixed(4)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Altitude Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Altitude Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Statistics:</p>
              <ul className="list-none pl-4">
                <li>Mean Altitude: {analysisData.environmental_factors.altitude.altitude_stats.mean.toFixed(2)} m</li>
                <li>Max Altitude: {analysisData.environmental_factors.altitude.altitude_stats.max.toFixed(2)} m</li>
                <li>R-squared: {(analysisData.environmental_factors.altitude.altitude_effect.r_squared * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Performance Impact:</p>
              <ul className="list-none pl-4">
                <li>Correlation: {(analysisData.environmental_factors.altitude.altitude_effect.correlation * 100).toFixed(1)}%</li>
                <li>P-value: {analysisData.environmental_factors.altitude.altitude_effect.p_value.toFixed(4)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pressure Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Pressure Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Statistics:</p>
              <ul className="list-none pl-4">
                <li>Mean Pressure: {analysisData.environmental_factors.pressure.pressure_stats.mean.toFixed(2)} hPa</li>
                <li>Max Pressure: {analysisData.environmental_factors.pressure.pressure_stats.max.toFixed(2)} hPa</li>
                <li>R-squared: {(analysisData.environmental_factors.pressure.pressure_effect.r_squared * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Performance Impact:</p>
              <ul className="list-none pl-4">
                <li>Correlation: {(analysisData.environmental_factors.pressure.pressure_effect.correlation * 100).toFixed(1)}%</li>
                <li>P-value: {analysisData.environmental_factors.pressure.pressure_effect.p_value.toFixed(4)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Combined Effects */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Combined Effects</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Multiple Regression Results:</p>
              <p className="pl-4">
                R² Score: {(analysisData.environmental_factors.combined_effects.multiple_regression.r_squared * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="font-medium">Standardized Coefficients:</p>
              <ul className="list-none pl-4">
                <li>Wind: {analysisData.environmental_factors.combined_effects.multiple_regression.standardized_coefficients.wind_speed.toFixed(3)}</li>
                <li>Altitude: {analysisData.environmental_factors.combined_effects.multiple_regression.standardized_coefficients.altitude.toFixed(3)}</li>
                <li>Pressure: {analysisData.environmental_factors.combined_effects.multiple_regression.standardized_coefficients.pressure.toFixed(3)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Performance Trends</h3>
          <div className="h-64">
            <LineChart
              width={800}
              height={240}
              data={createChartData('wind_speed')}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalAnalysis;