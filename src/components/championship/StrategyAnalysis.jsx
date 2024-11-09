import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';

const StrategyAnalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const data = {
    "title": "Individual season's (SB) and personal bests (PB), and performance during the semi-final (SF)",
    "athletes": [
      {
        "name": "VAN NIEKERK",
        "SB": {"time": 43.62, "rank": 1},
        "PB": {"time": 43.03, "rank": 1},
        "SF": {"time": 44.22, "rank": 3},
        "notes": null
      },
      {
        "name": "GARDINER",
        "SB": {"time": 44.26, "rank": 5},
        "PB": {"time": 44.26, "rank": 5},
        "SF": {"time": 43.89, "rank": 1},
        "notes": "NR"
      },
      {
        "name": "HAROUN",
        "SB": {"time": 45.15, "rank": 8},
        "PB": {"time": 44.27, "rank": 6},
        "SF": {"time": 44.64, "rank": 8},
        "notes": "SB"
      },
      {
        "name": "THEBE",
        "SB": {"time": 44.02, "rank": 4},
        "PB": {"time": 44.02, "rank": 4},
        "SF": {"time": 44.33, "rank": 5},
        "notes": null
      },
      {
        "name": "ALLEN",
        "SB": {"time": 44.52, "rank": 6},
        "PB": {"time": 44.52, "rank": 7},
        "SF": {"time": 44.19, "rank": 2},
        "notes": "PB"
      },
      {
        "name": "GAYE",
        "SB": {"time": 44.64, "rank": 7},
        "PB": {"time": 44.64, "rank": 8},
        "SF": {"time": 44.55, "rank": 7},
        "notes": "PB"
      },
      {
        "name": "KERLEY",
        "SB": {"time": 43.70, "rank": 2},
        "PB": {"time": 43.70, "rank": 2},
        "SF": {"time": 44.51, "rank": 6},
        "notes": null
      },
      {
        "name": "MAKWALA",
        "SB": {"time": 43.84, "rank": 3},
        "PB": {"time": 43.72, "rank": 3},
        "SF": {"time": 44.30, "rank": 4},
        "notes": null
      }
    ]
  };

  useEffect(() => {
    // Simulate data loading
    setIsLoading(false);
  }, []);

  // Transform data for different visualizations
  const timeComparisonData = data.athletes.map(athlete => ({
    name: athlete.name,
    'Season Best': athlete.SB.time,
    'Personal Best': athlete.PB.time,
    'Semi Final': athlete.SF.time
  }));

  const performanceData = data.athletes.map(athlete => ({
    name: athlete.name,
    'SF vs SB': +(athlete.SF.time - athlete.SB.time).toFixed(3),
    'SF vs PB': +(athlete.SF.time - athlete.PB.time).toFixed(3),
    'PB vs SB': +(athlete.PB.time - athlete.SB.time).toFixed(3)
  }));

  const rankingData = data.athletes.map(athlete => ({
    name: athlete.name,
    'SB Rank': athlete.SB.rank,
    'SF Rank': athlete.SF.rank,
    'Rank Improvement': athlete.SB.rank - athlete.SF.rank
  }));

  const consistencyData = data.athletes.map(athlete => {
    const times = [athlete.SB.time, athlete.PB.time, athlete.SF.time];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length;
    return {
      name: athlete.name,
      consistency: +(100 - (Math.sqrt(variance) * 100)).toFixed(2),
      averageTime: +avg.toFixed(2)
    };
  });

  const progressionData = data.athletes.map(athlete => ({
    name: athlete.name,
    improvement: +((athlete.PB.time - athlete.SF.time) * 100).toFixed(2),
    potential: +((athlete.PB.time - athlete.SB.time) * 100).toFixed(2)
  }));

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{data.title}</h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['overview', 'performance', 'rankings', 'consistency', 'progression'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Time Comparison</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis domain={[42, 46]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Season Best" fill="#60a5fa" />
                      <Bar dataKey="Personal Best" fill="#34d399" />
                      <Bar dataKey="Semi Final" fill="#fbbf24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Performance Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="Season Best" name="Season Best" unit="s" />
                      <YAxis type="number" dataKey="Semi Final" name="Semi Final" unit="s" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Athletes" data={timeComparisonData} fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Performance Deltas</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="SF vs SB" stroke="#60a5fa" strokeWidth={2} />
                      <Line type="monotone" dataKey="SF vs PB" stroke="#34d399" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Performance Radar</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar name="SF vs SB" dataKey="SF vs SB" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.6} />
                      <Radar name="SF vs PB" dataKey="SF vs PB" stroke="#34d399" fill="#34d399" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Rankings Tab */}
          {activeTab === 'rankings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Ranking Changes</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="SB Rank" fill="#60a5fa" />
                      <Bar dataKey="SF Rank" fill="#fbbf24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Rank Improvement</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rankingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="Rank Improvement" stroke="#60a5fa" fill="#60a5fa" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Consistency Tab */}
          {activeTab === 'consistency' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Consistency Scores</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={consistencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="consistency" stroke="#60a5fa" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Average Performance</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consistencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageTime" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
        </div>
  )

}

export default StrategyAnalysis;