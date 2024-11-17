import React, { useState } from 'react';
import { Sankey, Tooltip, Label } from 'recharts';

const ParisSankey = () => {
  const [activeLink, setActiveLink] = useState(null);

  const getQualificationColor = (notes) => {
    if (!notes) return '#9e9e9e';
    const noteArray = typeof notes === 'string' ? notes.split(', ') : notes;
    
    if (noteArray.some(note => ['WL', 'AR', 'NR'].includes(note))) {
      return '#ffd700';
    }
    if (noteArray.some(note => note === 'Q')) {
      return '#4CAF50';
    }
    if (noteArray.some(note => note === 'q')) {
      return '#2196F3';
    }
    return '#9e9e9e';
  };

  const nodes = [
    // Heats
    { name: 'Heat 1', round: 'heats', color: '#e5e5e5' },
    { name: 'Heat 2', round: 'heats', color: '#e5e5e5' },
    { name: 'Heat 3', round: 'heats', color: '#e5e5e5' },
    { name: 'Heat 4', round: 'heats', color: '#e5e5e5' },
    { name: 'Heat 5', round: 'heats', color: '#e5e5e5' },
    { name: 'Heat 6', round: 'heats', color: '#e5e5e5' },
    // Semifinals
    { name: 'Semifinal 1', round: 'semis', color: '#d4d4d4' },
    { name: 'Semifinal 2', round: 'semis', color: '#d4d4d4' },
    { name: 'Semifinal 3', round: 'semis', color: '#d4d4d4' },
    // Final
    { name: 'Final', round: 'final', color: '#a3a3a3' }
  ];

  const links = [
    // Heat 1 to Semifinals
    { source: 0, target: 6, value: 1, athlete: 'Hudson-Smith', nation: 'GBR', time: '44.78', prevTime: null, notes: 'Q', improvement: null },
    { source: 0, target: 7, value: 1, athlete: 'Bailey', nation: 'USA', time: '44.89', prevTime: null, notes: 'Q', improvement: null },
    { source: 0, target: 6, value: 1, athlete: 'Ingvaldsen', nation: 'NOR', time: '45.46', prevTime: null, notes: 'Q', improvement: null },
    
    // Heat 2 to Semifinals
    { source: 1, target: 8, value: 1, athlete: 'Norman', nation: 'USA', time: '44.10', prevTime: null, notes: 'Q, SB', improvement: null },
    { source: 1, target: 6, value: 1, athlete: 'Richards', nation: 'TTO', time: '44.31', prevTime: null, notes: 'Q', improvement: null },
    { source: 1, target: 6, value: 1, athlete: 'Kebinatshipi', nation: 'BOT', time: '44.45', prevTime: null, notes: 'Q, PB', improvement: null },
    
    // Heat 3 to Semifinals
    { source: 2, target: 7, value: 1, athlete: 'Samukonga', nation: 'ZAM', time: '44.56', prevTime: null, notes: 'Q', improvement: null },
    { source: 2, target: 7, value: 1, athlete: 'Ndori', nation: 'BOT', time: '44.87', prevTime: null, notes: 'Q', improvement: null },
    { source: 2, target: 7, value: 1, athlete: 'Sito', nation: 'ITA', time: '44.99', prevTime: null, notes: 'Q', improvement: null },
    
    // Semifinals to Final
    { source: 6, target: 9, value: 1, athlete: 'Hall', nation: 'USA', time: '43.95', prevTime: '44.28', notes: 'Q', improvement: 0.33 },
    { source: 6, target: 9, value: 1, athlete: 'Richards', nation: 'TTO', time: '44.33', prevTime: '44.31', notes: 'Q', improvement: -0.02 },
    
    { source: 7, target: 9, value: 1, athlete: 'James', nation: 'GRN', time: '43.78', prevTime: '44.78', notes: 'Q, SB', improvement: 1.00 },
    { source: 7, target: 9, value: 1, athlete: 'Samukonga', nation: 'ZAM', time: '43.81', prevTime: '44.56', notes: 'Q, NR', improvement: 0.75 },
    { source: 7, target: 9, value: 1, athlete: 'Bailey', nation: 'USA', time: '44.31', prevTime: '44.89', notes: 'q, PB', improvement: 0.58 },
    
    { source: 8, target: 9, value: 1, athlete: 'Hudson-Smith', nation: 'GBR', time: '44.07', prevTime: '44.78', notes: 'Q', improvement: 0.71 },
    { source: 8, target: 9, value: 1, athlete: 'Norman', nation: 'USA', time: '44.26', prevTime: '44.10', notes: 'Q', improvement: -0.16 },
    { source: 8, target: 9, value: 1, athlete: 'Ogazi', nation: 'NGR', time: '44.41', prevTime: '44.50', notes: 'q, PB', improvement: 0.09 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-bold text-lg mb-2">{data.athlete} ({data.nation})</h3>
        <div className="space-y-1">
          <p>Current Time: {data.time}s</p>
          {data.prevTime && (
            <>
              <p>Previous Time: {data.prevTime}s</p>
              <p className={`font-semibold ${data.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Improvement: {data.improvement > 0 ? '+' : ''}{data.improvement?.toFixed(2)}s
              </p>
            </>
          )}
          <div className="mt-2">
            {data.notes.split(', ').map((note, i) => (
              <span 
                key={i} 
                className="inline-block px-2 py-1 rounded-full text-sm mr-1 mb-1"
                style={{
                  backgroundColor: note === 'Q' ? '#4CAF50' :
                               note === 'q' ? '#2196F3' :
                               (note.includes('PB') || note.includes('SB')) ? '#22c55e' : '#ef4444',
                  color: 'white'
                }}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Olympic 400m Men's Competition Flow</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Direct Qualification (Q)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2196F3' }}></div>
              <span>Time Qualification (q)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffd700' }}></div>
              <span>Records (NR/AR/WL)</span>
            </div>
          </div>
        </div>
        <div className="w-full h-128">
          <Sankey
            width={1000}
            height={600}
            data={{ nodes, links }}
            node={{
              nodePadding: 30,
              nodeWidth: 10,
              fill: (entry) => entry.color
            }}
            link={{
              stroke: (entry) => getQualificationColor(entry.notes),
              opacity: (entry) => activeLink === entry ? 0.9 : 0.6,
              strokeWidth: (entry) => activeLink === entry ? 3 : 1
            }}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
            onMouseEnter={(data) => setActiveLink(data)}
            onMouseLeave={() => setActiveLink(null)}
          >
            <Label
              position="right"
              content={({ name }) => (
                <text x={5} y={0} fill="#666" textAnchor="start" dominantBaseline="middle">
                  {name}
                </text>
              )}
            />
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </div>
      </div>
    </div>
  );
};

export default ParisSankey;