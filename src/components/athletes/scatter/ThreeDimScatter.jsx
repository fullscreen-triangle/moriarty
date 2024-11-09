import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ThreeDimScatter = ({ dataset }) => {
  const [activeView, setActiveView] = useState('xy');

  // Extract x, y, z coordinates from the dataset
  const formattedData = dataset.map((point, index) => ({
    x: point[0],
    y: point[1],
    z: point[2] || 0,
    name: `Point ${index}`
  }));

  // Calculate axis domains
  const xDomain = [
    Math.min(...formattedData.map(d => d.x)),
    Math.max(...formattedData.map(d => d.x))
  ];
  const yDomain = [
    Math.min(...formattedData.map(d => d.y)),
    Math.max(...formattedData.map(d => d.y))
  ];
  const zDomain = [
    Math.min(...formattedData.map(d => d.z)),
    Math.max(...formattedData.map(d => d.z))
  ];

  const views = {
    xy: { xKey: 'x', yKey: 'y', title: 'X-Y View' },
    xz: { xKey: 'x', yKey: 'z', title: 'X-Z View' },
    yz: { xKey: 'y', yKey: 'z', title: 'Y-Z View' }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p>X: {data.x.toFixed(2)}</p>
          <p>Y: {data.y.toFixed(2)}</p>
          <p>Z: {data.z.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">3D Scatter Plot</h3>
          <TabsList>
            {Object.keys(views).map((view) => (
              <TabsTrigger
                key={view}
                value={view}
                onClick={() => setActiveView(view)}
                className={activeView === view ? 'bg-primary text-primary-foreground' : ''}
              >
                {views[view].title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              type="number"
              dataKey={views[activeView].xKey}
              domain={activeView.includes('x') ? xDomain : yDomain}
              name={views[activeView].xKey.toUpperCase()}
            />
            <YAxis
              type="number"
              dataKey={views[activeView].yKey}
              domain={activeView.includes('z') ? zDomain : yDomain}
              name={views[activeView].yKey.toUpperCase()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Points"
              data={formattedData}
              fill="#8884d8"
              fillOpacity={0.6}
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ThreeDimScatter;