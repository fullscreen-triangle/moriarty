import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import RadialChart from './RadialChart';
import LineChart from './LineChart';

const Combinedbrush = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/json/senior/four_hundred_records.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
      });
  }, []);

  return (
    <div className="container mx-auto items-center justify-center  resize ">
      <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Time by Athlete</h2>
      <BarChart data={data} />
      <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Records Throughout the Year</h2>
      <RadialChart data={data} />
      <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">Time Progression</h2>
      <LineChart data={data} />
    </div>
  );
};

export default Combinedbrush;