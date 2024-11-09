import { useState, useEffect } from 'react';

const AthleteTreemap = ({ dataUrl }) => {
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transform the flat metrics into a hierarchical structure
  const transformDataForTreemap = (data) => {
    const firstAthlete = Object.values(data)[0];
    const metricsData = firstAthlete.additional_metrics;
    
    return {
      name: "Athlete Metrics",
      children: Object.entries(metricsData).map(([key, value]) => ({
        name: key,
        value: parseFloat(value)
      }))
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const transformed = transformDataForTreemap(jsonData);
        setTreeData(transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl]);

  useEffect(() => {
    if (!treeData) return;

    // Initialize treemap after data is loaded
    const initTreemap = () => {
      const myChart = window.Treemap?.()
        .width(800)
        .height(600)
        .data(treeData)
        .svgStyles({
          'fill-opacity': 0.8,
        })
        .tooltipContent((d, node) => `${node.data.name}: ${node.data.value.toFixed(2)}`)
        .mapNodeAttributes({
          fill: (d, node) => {
            const value = node.data.value;
            const maxValue = Math.max(...treeData.children.map(d => d.value));
            const minValue = Math.min(...treeData.children.map(d => d.value));
            const normalizedValue = (value - minValue) / (maxValue - minValue);
            const blue = Math.floor(normalizedValue * 255);
            return `rgb(0, ${blue}, 255)`;
          }
        });

      // Clear previous chart if it exists
      const container = document.getElementById('treemap-container');
      if (container) {
        container.innerHTML = '';
        myChart(container);
      }
    };

    // Check if Treemap library is loaded
    if (window.Treemap) {
      initTreemap();
    } else {
      // If library isn't loaded yet, wait for it
      const script = document.createElement('script');
      script.src = '/path/to/treemap.js'; // Update with actual path
      script.onload = initTreemap;
      document.head.appendChild(script);
    }
  }, [treeData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-[600px] text-red-500">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div id="treemap-container" className="w-full h-[600px]"></div>
    </div>
  );
};

export default AthleteTreemap;