import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ label, value, change, prefix = '', suffix = '' }) => {
  const [counted, setCounted] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCounted(value);
        clearInterval(timer);
      } else {
        setCounted(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  const getChangeColor = () => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-black p-6 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:transform hover:scale-105">
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">{label}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold text-white">
            {prefix}{Math.round(counted).toLocaleString()}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${getChangeColor()}`}>
              {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : 
               change < 0 ? <ArrowDownRight className="w-4 h-4" /> : 
               <Minus className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ stats }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

// Example usage
const Surface = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: 458200,
      change: 12.5,
      prefix: "$"
    },
    {
      label: "Active Users",
      value: 42853,
      change: -2.4
    },
    {
      label: "Conversion Rate",
      value: 28.6,
      change: 4.1,
      suffix: "%"
    }
  ];

  return (
    <div className="bg-black p-6">
      <StatsGrid stats={stats} />
    </div>
  );
};

export default Surface;