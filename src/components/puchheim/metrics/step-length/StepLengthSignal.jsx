import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StepLengthSignal = ({ 
  signalUrl, 
  medianUrl, 
  powerSpectrumUrl, 
  spectrogramUrl,
  signalKey = 'step_length'  // default to step_length, but allows other signals
}) => {
  const [signalData, setSignalData] = useState(null);
  const [medianData, setMedianData] = useState(null);
  const [powerData, setPowerData] = useState(null);
  const [spectrogramData, setSpectrogramData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from provided URLs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [signalRes, medianRes, powerRes, spectrogramRes] = await Promise.all([
          fetch(signalUrl),
          fetch(medianUrl),
          fetch(powerSpectrumUrl),
          fetch(spectrogramUrl)
        ]);

        const signal = await signalRes.json();
        const median = await medianRes.json();
        const power = await powerRes.json();
        const spectrogram = await spectrogramRes.json();

        setSignalData(signal);
        setMedianData(median);
        setPowerData(power);
        setSpectrogramData(spectrogram);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [signalUrl, medianUrl, powerSpectrumUrl, spectrogramUrl]);

  // Process spectrum data (median and power)
  const processSpectrumData = (spectrumData) => {
    if (!spectrumData) return [];

    const data = [];
    const freqEntries = Object.entries(spectrumData.freq);
    const powerEntries = Object.entries(spectrumData.power);

    for (let i = 0; i < freqEntries.length; i++) {
      data.push({
        frequency: Number(freqEntries[i][1]).toFixed(3),
        power: powerEntries[i][1] || 0  // Use 0 for null values
      });
    }
    return data;
  };

  if (loading) {
    return <div>Loading signal analysis...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Raw Signal */}
      <div className="border rounded p-4">
        <h3 className="text-lg mb-4">{signalKey} Signal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[signalData]} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'bottom' }} />
              <YAxis label={{ value: `${signalKey}`, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey={signalKey} stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Median Signal */}
      <div className="border rounded p-4">
        <h3 className="text-lg mb-4">Median Signal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processSpectrumData(medianData)} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'bottom' }} />
              <YAxis domain={[0, 0.3]} label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="power" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Power Spectrum */}
      <div className="border rounded p-4">
        <h3 className="text-lg mb-4">Power Spectrum</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processSpectrumData(powerData)} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'bottom' }} />
              <YAxis domain={[0, 0.3]} label={{ value: 'Power (dB)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="power" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spectrogram */}
      <div className="border rounded p-4">
        <h3 className="text-lg mb-4">Spectrogram</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spectrogramData} margin={{ top: 5, right: 20, bottom: 25, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'bottom' }} />
              <YAxis domain={[0, 0.3]} label={{ value: 'Frequency (Hz)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="intensity" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StepLengthSignal;