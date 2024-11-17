import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

const MetricBox = ({ label, value, color = "bg-blue-50" }) => (
  <div className={`${color} p-4 rounded-lg`}>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const AltitudeWindLegality = ({ data }) => {
  if (!data) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        No data available for analysis.
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error analyzing data: {data.error}
      </div>
    );
  }

  // Data quality section
  const DataQualityCard = () => (
    <Card title="Data Quality Overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox 
          label="Total Records" 
          value={data.data_quality.total_records}
          color="bg-blue-50"
        />
        <MetricBox 
          label="Altitude Flags" 
          value={data.data_quality.altitude_flagged_records}
          color="bg-green-50"
        />
        <MetricBox 
          label="Wind Flags" 
          value={data.data_quality.wind_flagged_records}
          color="bg-yellow-50"
        />
        <MetricBox 
          label="Invalid Records" 
          value={data.data_quality.invalid_records_removed}
          color="bg-red-50"
        />
      </div>
    </Card>
  );

  // Wind analysis visualization
  const WindAnalysisCard = () => {
    const windStats = data.environmental_factors.wind.wind_speed_stats;
    const windData = [
      { name: 'Min', value: windStats.min },
      { name: 'Mean', value: windStats.mean },
      { name: 'Max', value: windStats.max }
    ];

    return (
      <Card title="Wind Analysis">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={windData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              />
              <Bar dataKey="value" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MetricBox 
            label="Correlation with Performance" 
            value={`${(data.environmental_factors.wind.wind_effect.correlation * 100).toFixed(2)}%`}
            color="bg-blue-50"
          />
          <MetricBox 
            label="R-squared" 
            value={`${(data.environmental_factors.wind.wind_effect.r_squared * 100).toFixed(2)}%`}
            color="bg-blue-50"
          />
        </div>
      </Card>
    );
  };

  // Pressure analysis visualization
  const PressureAnalysisCard = () => {
    const pressureStats = data.environmental_factors.pressure.pressure_stats;
    const pressureData = [
      { name: 'Min', value: pressureStats.min },
      { name: 'Mean', value: pressureStats.mean },
      { name: 'Max', value: pressureStats.max }
    ];

    return (
      <Card title="Pressure Analysis">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pressureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              />
              <Line type="monotone" dataKey="value" stroke="#34D399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MetricBox 
            label="Correlation with Performance" 
            value={`${(data.environmental_factors.pressure.pressure_effect.correlation * 100).toFixed(2)}%`}
            color="bg-green-50"
          />
          <MetricBox 
            label="R-squared" 
            value={`${(data.environmental_factors.pressure.pressure_effect.r_squared * 100).toFixed(2)}%`}
            color="bg-green-50"
          />
        </div>
      </Card>
    );
  };

  // Altitude analysis visualization
  const AltitudeAnalysisCard = () => {
    const altitudeStats = data.environmental_factors.altitude.altitude_stats;
    const altitudeData = [
      { name: 'Min', value: altitudeStats.min },
      { name: 'Mean', value: altitudeStats.mean },
      { name: 'Max', value: altitudeStats.max }
    ];

    return (
      <Card title="Altitude Analysis">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={altitudeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              />
              <Line type="monotone" dataKey="value" stroke="#FBBF24" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MetricBox 
            label="Correlation with Performance" 
            value={`${(data.environmental_factors.altitude.altitude_effect.correlation * 100).toFixed(2)}%`}
            color="bg-yellow-50"
          />
          <MetricBox 
            label="R-squared" 
            value={`${(data.environmental_factors.altitude.altitude_effect.r_squared * 100).toFixed(2)}%`}
            color="bg-yellow-50"
          />
        </div>
      </Card>
    );
  };

  // Combined effects visualization
  const CombinedEffectsCard = () => {
    const coefficients = data.environmental_factors.combined_effects.multiple_regression.standardized_coefficients;
    const coefficientData = [
      { name: 'Wind Speed', value: coefficients.wind_speed },
      { name: 'Pressure', value: coefficients.pressure },
      { name: 'Altitude', value: coefficients.altitude }
    ];

    return (
      <Card title="Combined Effects">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coefficientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
              />
              <Bar dataKey="value" fill="#A78BFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <MetricBox 
            label="Multiple Regression R-squared" 
            value={`${(data.environmental_factors.combined_effects.multiple_regression.r_squared * 100).toFixed(2)}%`}
            color="bg-purple-50"
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Environmental Analysis Dashboard</h1>
      
      <DataQualityCard />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WindAnalysisCard />
        <PressureAnalysisCard />
        <AltitudeAnalysisCard />
        <CombinedEffectsCard />
      </div>
    </div>
  );
};

export default AltitudeWindLegality;