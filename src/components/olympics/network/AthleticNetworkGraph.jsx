'use client'
import React, { useEffect, useState, useRef} from 'react';
import { NetworkDiagram } from './NetworkDiagram';
import { useDimensions } from '@/components/Hooks/use-dimensions';

const transformData = (athletesData) => {
  // Extract array of athletes from the object
  const athletes = Object.values(athletesData.individual_results || {});
  
  // Create nodes
  const nodes = athletes.map(athlete => ({
    id: athlete.athlete_info.Name,
    group: athlete.cluster, // Using cluster as the group for coloring
    sport: athlete.athlete_info.Sport,
    event: athlete.athlete_info.Event,
    medal: athlete.athlete_info.Medal
  }));

  // Create links between athletes in the same cluster
  const links = [];
  for (let i = 0; i < athletes.length; i++) {
    for (let j = i + 1; j < athletes.length; j++) {
      if (athletes[i].cluster === athletes[j].cluster) {
        links.push({
          source: athletes[i].athlete_info.Name,
          target: athletes[j].athlete_info.Name,
          value: 1
        });
      }
    }
  }

  return { nodes, links };
};

const AthleteNetwork = ({ dataUrl }) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  const [networkData, setNetworkData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const transformedData = transformData(data);
        setNetworkData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading network data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!networkData) {
    return null;
  }

  return (
    <div className="relative">
      <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
            <NetworkDiagram
                data={networkData}
                width={chartSize.width}
                height={chartSize.height}
            />
      </div>
      <div className="absolute top-2 right-2 bg-white/80 p-4 rounded shadow">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="text-sm">
          <div>• Nodes represent athletes</div>
          <div>• Colors represent clusters</div>
          <div>• Links connect athletes in the same cluster</div>
        </div>
      </div>
    </div>
  );
};

export default AthleteNetwork;