'use client'
import React, { useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const ClusterForceGraph = ({ dataUrl }) => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const rawData = await response.json();
        
        // Transform the data into nodes and links
        const nodes = [];
        const links = [];
        
        // Process individual results into nodes
        Object.entries(rawData.individual_results).forEach(([name, data], index) => {
          nodes.push({
            id: name,
            user: name,
            description: `${data.athlete_info.Sport} - ${data.athlete_info.Event}`,
            cluster: data.cluster,
            // Additional metrics that might be useful for visualization
            metrics: data.metrics,
            info: data.athlete_info
          });
          
          // Create links between nodes in the same cluster
          nodes.forEach((existingNode) => {
            if (existingNode.cluster === data.cluster && existingNode.id !== name) {
              links.push({
                source: name,
                target: existingNode.id,
                value: 1
              });
            }
          });
        });

        setGraphData({ nodes, links });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataUrl]);

  if (!graphData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full h-screen p-4">
      <ForceGraph3D
        graphData={graphData}
        nodeLabel={node => `${node.user}\n${node.description}`}
        nodeAutoColorBy="cluster"
        linkDirectionalParticles={1}
        nodeResolution={8}
        nodeRelSize={6}
        linkWidth={0.5}
        backgroundColor="#ffffff"
      />
    </div>
  );
};

export default ClusterForceGraph;