import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';

const AthleteDashboard = ({ 
  dataUrl,  // URL to fetch the JSON data
  metrics = ['Age', 'Height', 'Weight', 'body_surface_area']  // Default metrics
}) => {
  const chartsRef = useRef([]);
  const listRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formatters
  const formatNumber = d3.format(",.2f");
  const formatChange = d3.format("+,.2f");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl]);

  // Main dashboard effect
  useEffect(() => {
    if (!data) return;

    // Rest of the dashboard logic remains the same as in the previous version
    // ... (All the code from the previous version's main useEffect)
    
  }, [data, metrics]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-xl text-red-600 mb-2">Error loading dashboard</div>
          <div className="text-red-500">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-xl font-bold mb-4">
        <span>Athlete Analytics Dashboard</span>
        <span className="ml-4">
          Showing <span id="active">-</span> of <span id="total">-</span> athletes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[...metrics, 'medals'].map((_, i) => (
          <div key={i} className="p-4 border rounded shadow-sm" ref={el => chartsRef.current[i] = el}>
            <div className="chart-title font-bold mb-2"></div>
            <div className="chart-body"></div>
          </div>
        ))}
      </div>

      <div className="border rounded shadow-sm p-4" ref={listRef}>
        <h2 className="text-lg font-bold mb-2">Athlete List</h2>
      </div>
    </div>
  );
};

export default AthleteDashboard;


  {/* 
    <AthleteDashboard 
  dataUrl="https://your-api-endpoint/athletes.json"
  metrics={['Age', 'Height', 'Weight', 'body_surface_area']}
/>

*/}