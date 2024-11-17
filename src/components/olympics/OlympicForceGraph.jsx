import React, { useState, useEffect, useRef } from 'react';
import { ForceGraph2D } from 'react-force-graph-2d';

const AthleteForceGraph = ({ athleteData }) => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [containerRef, setContainerRef] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Calculate similarity between two athletes
  const calculateSimilarity = (athlete1, athlete2) => {
    const features = ['Height', 'Weight', 'theoretical_max_speed', 'power_to_weight'];
    let similarity = 0;
    
    features.forEach(feature => {
      const diff = Math.abs(athlete1[feature] - athlete2[feature]);
      const max = Math.max(athlete1[feature], athlete2[feature]);
      similarity += 1 - (diff / max);
    });
    
    return similarity / features.length;
  };

  // Prepare graph data
  useEffect(() => {
    if (!athleteData) return;

    const nodes = [];
    const links = [];
    
    // Create cluster center nodes
    const clusterCenters = {};
    const uniqueClusters = [...new Set(athleteData.map(a => a.Cluster))];
    
    uniqueClusters.forEach(cluster => {
      const centerId = `cluster-${cluster}`;
      clusterCenters[cluster] = centerId;
      nodes.push({
        id: centerId,
        name: `Cluster ${cluster}`,
        level: 0,
        cluster: cluster,
        size: 50,
        isClusterCenter: true
      });
    });

    // Create athlete nodes and links
    athleteData.forEach(athlete => {
      const athleteNode = {
        id: athlete.Name,
        name: athlete.Name,
        level: 1,
        cluster: athlete.Cluster,
        size: 20,
        medal: athlete.Medal,
        height: athlete.Height,
        weight: athlete.Weight,
        speed: athlete.theoretical_max_speed,
        power: athlete.power_to_weight
      };
      
      nodes.push(athleteNode);
      
      // Link to cluster center
      links.push({
        source: clusterCenters[athlete.Cluster],
        target: athlete.Name,
        value: 1
      });
      
      // Create links between similar athletes in same cluster
      athleteData.forEach(otherAthlete => {
        if (athlete.Name !== otherAthlete.Name && 
            athlete.Cluster === otherAthlete.Cluster) {
          const similarity = calculateSimilarity(athlete, otherAthlete);
          if (similarity > 0.8) { // Only link very similar athletes
            links.push({
              source: athlete.Name,
              target: otherAthlete.Name,
              value: similarity * 0.5
            });
          }
        }
      });
    });

    setGraphData({ nodes, links });
  }, [athleteData]);

  // Node color based on cluster and medal
  const getNodeColor = node => {
    if (node.isClusterCenter) {
      return `hsl(${node.cluster * 360 / 8}, 70%, 50%)`; // Distribute colors evenly
    }
    if (node.medal) {
      return '#FFD700';  // Gold for medalists
    }
    return `hsl(${node.cluster * 360 / 8}, 70%, 50%)`;
  };

  // Node size based on performance metrics
  const getNodeSize = node => {
    if (node.isClusterCenter) return node.size;
    return node.size * (node.medal ? 1.5 : 1);
  };

  useEffect(() => {
    if (fgRef.current) {
      // Add forces
      fgRef.current.d3Force('charge').strength(-100);
      fgRef.current.d3Force('link').distance(link => 100 * (1 - (link.value || 0.5)));
      
      // Add collision force
      fgRef.current.d3Force('collision', d3.forceCollide(node => Math.sqrt(getNodeSize(node) * 2)));
      
      // Zoom to fit after graph stabilizes
      setTimeout(() => {
        fgRef.current.zoomToFit(400);
      }, 500);
    }
  }, [graphData]);

  useEffect(() => {
    if (containerRef) {
      const { width, height } = containerRef.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [containerRef]);

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = node.isClusterCenter ? 14 : 12;
    const size = getNodeSize(node);
    
    // Node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = getNodeColor(node);
    ctx.fill();
    
    // Node label
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(label, node.x, node.y);
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      <div
        className="w-full h-full"
        ref={(ref) => {
          setContainerRef(ref);
        }}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeId="id"
          nodeVal={getNodeSize}
          nodeLabel={node => `
            ${node.name}
            ${node.isClusterCenter ? '' : `
            Height: ${node.height}cm
            Weight: ${node.weight}kg
            Speed: ${node.speed}m/s
            Power: ${node.power}`}
          `}
          nodeColor={getNodeColor}
          nodeCanvasObject={nodeCanvasObject}
          linkColor={() => 'rgba(255,255,255,0.2)'}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          d3VelocityDecay={0.3}
          cooldownTicks={100}
          backgroundColor="#1a1b1e"
        />
      </div>
    </div>
  );
};

const OlympicForceGraph = () => {
  const [athleteData, setAthleteData] = useState(null);

  // For testing, create some sample data
  const sampleData = Array(20).fill(null).map((_, i) => ({
    Name: `Athlete ${i + 1}`,
    Height: 170 + Math.random() * 20,
    Weight: 65 + Math.random() * 15,
    Medal: Math.random() > 0.8 ? 'Gold' : null,
    Cluster: Math.floor(Math.random() * 4),
    theoretical_max_speed: 9 + Math.random() * 3,
    power_to_weight: 20 + Math.random() * 10
  }));

  useEffect(() => {
    // For development, use sample data
    setAthleteData(sampleData);
    
    // When ready to use real data:
    // fetch('/api/athletes')
    //   .then(response => response.json())
    //   .then(data => setAthleteData(data));
  }, []);

  if (!athleteData) return <div>Loading...</div>;

  return <AthleteForceGraph athleteData={athleteData} />;
};

export default OlympicForceGraph;