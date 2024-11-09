import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Thermometer, Droplets, Wind, Sun, Gauge, 
  CloudRain, Compass, Clock
} from 'lucide-react';

// Custom Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const WeatherDeviationPuchheim = ({ lat, lon, date, apiKey }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('Failed to fetch current weather');
      return await response.json();
    } catch (err) {
      throw new Error(`Current weather fetch failed: ${err.message}`);
    }
  };

  const fetchHistoricalWeather = async () => {
    const timestamp = Math.floor(new Date(date).getTime() / 1000);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&units=metric&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('Failed to fetch historical weather');
      return await response.json();
    } catch (err) {
      throw new Error(`Historical weather fetch failed: ${err.message}`);
    }
  };

  const fetchMonthlyAverages = async () => {
    // Using the month from the provided date
    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Fetch data for each day of the month
    const promises = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const timestamp = Math.floor(new Date(year, month, day).getTime() / 1000);
      promises.push(
        fetch(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&units=metric&appid=${apiKey}`
        ).then(res => res.json())
      );
    }

    return Promise.all(promises);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [current, historical, monthlyData] = await Promise.all([
          fetchCurrentWeather(),
          fetchHistoricalWeather(),
          fetchMonthlyAverages()
        ]);

        // Calculate monthly averages
        const monthlyAverages = monthlyData.reduce((acc, day) => {
          Object.keys(day.data[0]).forEach(key => {
            if (typeof day.data[0][key] === 'number') {
              acc[key] = (acc[key] || 0) + day.data[0][key];
            }
          });
          return acc;
        }, {});

        // Divide by number of days to get averages
        Object.keys(monthlyAverages).forEach(key => {
          monthlyAverages[key] /= monthlyData.length;
        });

        setWeatherData(current.current);
        setHistoricalData({
          historical: historical.data[0],
          monthlyAverages
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lat, lon, date, apiKey]);

  const calculateDeviation = (current, historical) => {
    if (!historical) return 0;
    return ((current - historical) / historical * 100).toFixed(1);
  };

  const getDeviationColor = (deviation) => {
    const dev = parseFloat(deviation);
    if (dev > 10) return 'text-red-600';
    if (dev < -10) return 'text-blue-600';
    return 'text-gray-600';
  };

  const DeviationIndicator = ({ 
    current, 
    historical, 
    monthlyAvg, 
    label, 
    unit, 
    icon: Icon,
    description 
  }) => {
    const deviation = calculateDeviation(current, historical);
    const monthlyDeviation = calculateDeviation(current, monthlyAvg);
    
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold mb-1">
          {current?.toFixed(1)} {unit}
        </div>
        <div className={`flex flex-col gap-1 text-sm`}>
          <div className={getDeviationColor(deviation)}>
            {Math.abs(deviation)}% vs historical
          </div>
          <div className={getDeviationColor(monthlyDeviation)}>
            {Math.abs(monthlyDeviation)}% vs monthly avg
          </div>
          <div className="text-gray-600 mt-1">{description}</div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
      {error}
    </div>
  );

  if (!weatherData || !historicalData) return null;

  const parameters = [
    {
      label: "Temperature",
      current: weatherData.temp,
      historical: historicalData.historical.temp,
      monthlyAvg: historicalData.monthlyAverages.temp,
      unit: "°C",
      icon: Thermometer,
      description: "Ambient temperature at 2m height"
    },
    {
      label: "Humidity",
      current: weatherData.humidity,
      historical: historicalData.historical.humidity,
      monthlyAvg: historicalData.monthlyAverages.humidity,
      unit: "%",
      icon: Droplets,
      description: "Relative humidity"
    },
    {
      label: "Wind Speed",
      current: weatherData.wind_speed,
      historical: historicalData.historical.wind_speed,
      monthlyAvg: historicalData.monthlyAverages.wind_speed,
      unit: "m/s",
      icon: Wind,
      description: "Wind speed at 10m height"
    },
    {
      label: "UV Index",
      current: weatherData.uvi,
      historical: historicalData.historical.uvi,
      monthlyAvg: historicalData.monthlyAverages.uvi,
      unit: "",
      icon: Sun,
      description: "UV radiation index"
    },
    {
      label: "Pressure",
      current: weatherData.pressure,
      historical: historicalData.historical.pressure,
      monthlyAvg: historicalData.monthlyAverages.pressure,
      unit: "hPa",
      icon: Gauge,
      description: "Atmospheric pressure at sea level"
    },
    {
      label: "Rain",
      current: weatherData.rain?.["1h"] || 0,
      historical: historicalData.historical.rain?.["1h"] || 0,
      monthlyAvg: historicalData.monthlyAverages.rain?.["1h"] || 0,
      unit: "mm",
      icon: CloudRain,
      description: "Precipitation volume for last hour"
    },
    {
      label: "Wind Direction",
      current: weatherData.wind_deg,
      historical: historicalData.historical.wind_deg,
      monthlyAvg: historicalData.monthlyAverages.wind_deg,
      unit: "°",
      icon: Compass,
      description: "Wind direction in degrees"
    },
    {
      label: "Feels Like",
      current: weatherData.feels_like,
      historical: historicalData.historical.feels_like,
      monthlyAvg: historicalData.monthlyAverages.feels_like,
      unit: "°C",
      icon: Clock,
      description: "Human perception of weather"
    }
  ];

  // Prepare trend data for the chart
  const trendData = parameters.map(param => ({
    name: param.label,
    current: param.current,
    historical: param.historical,
    monthlyAvg: param.monthlyAvg
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {parameters.map((param, index) => (
            <DeviationIndicator
              key={index}
              {...param}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Parameter Comparison</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3b82f6" 
                  name="Current"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="#94a3b8" 
                  name="Historical"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="monthlyAvg" 
                  stroke="#f59e0b" 
                  name="Monthly Average"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDeviationPuchheim;