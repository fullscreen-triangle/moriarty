import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg';
const API_URL = '/json/senior/four_hunnad_weather.json';

const weatherModes = {
  default: { label: 'Default View', color: '#0066ff' },
  temperature: { label: 'Temperature', color: '#ff4444' },
  wind: { label: 'Wind Speed', color: '#44ff44' },
  pressure: { label: 'Pressure', color: '#4444ff' },
  humidity: { label: 'Humidity', color: '#44ffff' },
  visibility: { label: 'Visibility', color: '#ffff44' },
  precipitation: { label: 'Precipitation', color: '#ff44ff' }
};

const StadiumWeatherMap = () => {
  const [map, setMap] = useState(null);
  const [stadiums, setStadiums] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [mapMode, setMapMode] = useState('default');
  
  // New state variables for filtering and time control
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [currentDate, setCurrentDate] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    minTemp: '',
    maxTemp: '',
    weatherCondition: '',
    minWindSpeed: '',
    maxWindSpeed: ''
  });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setStadiums(data);
        
        // Set time range based on available data
        const dates = data.map(s => new Date(s.Date));
        setTimeRange({
          start: new Date(Math.min(...dates)),
          end: new Date(Math.max(...dates))
        });
        setCurrentDate(new Date(Math.min(...dates)));
        
        // Generate time series data
        const timeSeriesData = generateTimeSeriesData(data);
        setTimeSeriesData(timeSeriesData);
      } catch (err) {
        setError('Failed to fetch stadium data');
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  // Filter stadiums based on current filters
  useEffect(() => {
    let filtered = stadiums;

    if (filters.country) {
      filtered = filtered.filter(s => 
        s.Country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    if (filters.minTemp) {
      filtered = filtered.filter(s => s.main.temp >= parseFloat(filters.minTemp));
    }

    if (filters.maxTemp) {
      filtered = filtered.filter(s => s.main.temp <= parseFloat(filters.maxTemp));
    }

    if (filters.weatherCondition) {
      filtered = filtered.filter(s => 
        s.weather[0].main.toLowerCase().includes(filters.weatherCondition.toLowerCase())
      );
    }

    if (filters.minWindSpeed) {
      filtered = filtered.filter(s => s.wind.speed >= parseFloat(filters.minWindSpeed));
    }

    if (filters.maxWindSpeed) {
      filtered = filtered.filter(s => s.wind.speed <= parseFloat(filters.maxWindSpeed));
    }

    // Filter by current date
    if (currentDate) {
      filtered = filtered.filter(s => {
        const stadiumDate = new Date(s.Date);
        return stadiumDate.toDateString() === currentDate.toDateString();
      });
    }

    setFilteredStadiums(filtered);
  }, [stadiums, filters, currentDate]);

  // Update map when filtered stadiums change
  useEffect(() => {
    if (map) {
      updateMapData(map, filteredStadiums, mapMode);
    }
  }, [map, filteredStadiums, mapMode]);

  // Time control playback
  useEffect(() => {
    let interval;
    if (isPlaying && timeRange.start && timeRange.end) {
      interval = setInterval(() => {
        setCurrentDate(prevDate => {
          const nextDate = new Date(prevDate.getTime() + 86400000); // Add one day
          if (nextDate > timeRange.end) {
            setIsPlaying(false);
            return timeRange.start;
          }
          return nextDate;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timeRange]);

  // Initialize map
  useEffect(() => {
    if (!map && !loading && stadiums.length > 0) {
      const mapboxgl = window.mapboxgl;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [0, 20],
        zoom: 2
      });

      newMap.on('load', () => {
        // Add weather layers based on mode
        Object.keys(weatherModes).forEach(mode => {
          addWeatherLayer(newMap, mode);
        });
        
        updateMapData(newMap, filteredStadiums, mapMode);
      });

      setMap(newMap);
    }

    return () => map?.remove();
  }, [loading, stadiums]);

  const generateTimeSeriesData = (data) => {
    // Group data by date and calculate averages
    const groupedData = data.reduce((acc, stadium) => {
      const date = new Date(stadium.Date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          avgTemp: 0,
          avgWind: 0,
          count: 0
        };
      }
      acc[date].avgTemp += stadium.main.temp;
      acc[date].avgWind += stadium.wind.speed;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.values(groupedData).map(d => ({
      date: d.date,
      temperature: d.avgTemp / d.count,
      windSpeed: d.avgWind / d.count
    }));
  };

  const addWeatherLayer = (map, mode) => {
    const layerConfig = {
      id: `${mode}-layer`,
      type: mode === 'wind' ? 'symbol' : 'heatmap',
      source: 'stadiums',
      layout: mode === 'wind' ? {
        'icon-image': 'arrow',
        'icon-rotate': ['get', 'wind_deg'],
        'icon-size': ['interpolate', ['linear'], ['get', 'wind_speed'], 0, 0.5, 20, 1.5],
        'visibility': 'none'
      } : {
        'visibility': 'none'
      },
      paint: mode === 'wind' ? {} : {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', mode === 'temperature' ? 'temp' : 
                 mode === 'pressure' ? 'pressure' : 
                 mode === 'humidity' ? 'humidity' : 
                 mode === 'visibility' ? 'visibility' : 'precipitation'],
          0, 0,
          100, 1
        ],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 0, 0)',
          0.2, weatherModes[mode].color + '40',
          1, weatherModes[mode].color
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        'heatmap-opacity': 0.7
      }
    };

    map.addLayer(layerConfig);
  };

  const updateMapData = (map, data, mode) => {
    const geojson = {
      type: 'FeatureCollection',
      features: data.map(stadium => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [stadium.coord.lon, stadium.coord.lat]
        },
        properties: {
          ...stadium,
          temp: stadium.main.temp,
          pressure: stadium.main.pressure,
          humidity: stadium.main.humidity,
          visibility: stadium.visibility,
          precipitation: stadium.rain || 0,
          wind_speed: stadium.wind.speed,
          wind_deg: stadium.wind.deg
        }
      }))
    };

    if (map.getSource('stadiums')) {
      map.getSource('stadiums').setData(geojson);
    } else {
      map.addSource('stadiums', { type: 'geojson', data: geojson });
    }

    // Update layer visibility
    Object.keys(weatherModes).forEach(m => {
      map.setLayoutProperty(
        `${m}-layer`,
        'visibility',
        m === mode ? 'visible' : 'none'
      );
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded">
        <input
          type="text"
          placeholder="Filter by country"
          value={filters.country}
          onChange={e => setFilters(prev => ({ ...prev, country: e.target.value }))}
          className="p-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min temp"
            value={filters.minTemp}
            onChange={e => setFilters(prev => ({ ...prev, minTemp: e.target.value }))}
            className="p-2 border rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Max temp"
            value={filters.maxTemp}
            onChange={e => setFilters(prev => ({ ...prev, maxTemp: e.target.value }))}
            className="p-2 border rounded w-1/2"
          />
        </div>
        <input
          type="text"
          placeholder="Weather condition"
          value={filters.weatherCondition}
          onChange={e => setFilters(prev => ({ ...prev, weatherCondition: e.target.value }))}
          className="p-2 border rounded"
        />
      </div>

      {/* Weather Mode Selection */}
      <div className="flex gap-2 overflow-x-auto p-2">
        {Object.entries(weatherModes).map(([mode, { label, color }]) => (
          <button
            key={mode}
            onClick={() => setMapMode(mode)}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              mapMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div id="map" className="w-full h-96 rounded" />

      {/* Time Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <input
            type="range"
            min="1"
            max="10"
            value={playbackSpeed}
            onChange={e => setPlaybackSpeed(Number(e.target.value))}
            className="w-32"
          />
          <span>Speed: {playbackSpeed}x</span>
          <span>
            Current Date: {currentDate?.toLocaleDateString()}
          </span>
        </div>

        {/* Time Series Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="temp" orientation="left" stroke="#ff4444" />
              <YAxis yAxisId="wind" orientation="right" stroke="#44ff44" />
              <Tooltip />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#ff4444"
                dot={false}
                name="Temperature"
              />
              <Line
                yAxisId="wind"
                type="monotone"
                dataKey="windSpeed"
                stroke="#44ff44"
                dot={false}
                name="Wind Speed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Stadium Info */}
      {selectedStadium && (
        <div className="p-4 bg-white border rounded">
          <h3 className="font-bold text-lg">{selectedStadium.Name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p>Location: {selectedStadium.City}, {selectedStadium.Country}</p>
              <p>Date: {new Date(selectedStadium.Date).toLocaleDateString()}</p>
              <p>Temperature: {selectedStadium.main.temp}°C</p>
              <p>Feels Like: {selectedStadium.main.feels_like}°C</p>
            </div>
            <div>
              <p>Wind: {selectedStadium.wind.speed} m/s</p>
              <p>Humidity: {selectedStadium.main.humidity}%</p>
              <p>Pressure: {selectedStadium.main.pressure} hPa</p>
              <p>Visibility: {selectedStadium.visibility} m</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadiumWeatherMap;