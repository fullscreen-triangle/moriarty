import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          flowchart: {
            curve: 'basis',
            padding: 15,
            nodeSpacing: 30,
            rankSpacing: 50,
          },
        });

        const { svg } = await mermaid.render('athlete-assessment', chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        setError('Failed to render assessment flowchart');
        console.error(err);
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <div ref={containerRef} className="w-full overflow-x-auto" />;
};

const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 
    hover:bg-gray-50 transition-colors ${className}`}
  >
    {children}
  </button>
);

const OptimalTournamentStrategy = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const athleteFlowchart = `flowchart TD
    A[Athlete Input Data] --> B{Initial Assessment}
    B --> C[Physiological Metrics]
    B --> D[Biomechanical Factors]
    B --> E[Environmental Conditions]
    
    C --> F[Heart Rate Metrics]
    C --> G[Sleep Quality]
    C --> H[Muscle Fatigue]
    
    F --> I[HRV > 85% baseline]
    F --> J[RHR within 5% baseline]
    
    G --> K[Sleep Score]
    K --> L[>7.5hrs sleep]
    K --> M[>85% efficiency]
    
    H --> N[CMJ > 90% baseline]
    H --> O[Cortisol < 110% baseline]
    
    D --> P[Height Analysis]
    D --> Q[Weight Impact]
    D --> R[Limb Length]
    
    P --> S[Lane Assignment]
    Q --> S
    R --> S
    
    E --> T[Altitude Effects]
    E --> U[Temperature]
    E --> V[Time Zones]
    
    T --> W[Air Density Calculation]
    U --> X[Heat Management]
    V --> Y[Circadian Adjustment]
    
    S --> Z[Race Strategy]
    W --> Z
    X --> Z
    Y --> Z
    
    Z --> AA[Competition Ready]
    Z --> BB[Additional Recovery]
    
    BB --> CC[Reassess Every 6hrs]
    CC --> B`;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Athlete Assessment System
          </h2>
          <div className="flex gap-2">
            <Button onClick={() => setIsZoomed(!isZoomed)}>
              {isZoomed ? 'Zoom Out' : 'Zoom In'}
            </Button>
            <Button 
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showInfo && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm">
            <h3 className="font-semibold text-blue-900 mb-2">
              Assessment Criteria
            </h3>
            <ul className="space-y-1 text-blue-800">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Heart Rate Variability (HRV) must be 85% of baseline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Resting Heart Rate (RHR) within 5% of baseline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Minimum 7.5 hours of sleep with 85% efficiency
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Counter Movement Jump (CMJ) 90% of baseline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Cortisol levels must be below 110% of baseline
              </li>
            </ul>
          </div>
        )}

        <div 
          className={`transition-all duration-300 ${
            isZoomed ? 'scale-125 transform-origin-top-left' : ''
          }`}
        >
          <MermaidDiagram chart={athleteFlowchart} />
        </div>
      </div>
    </div>
  );
};

export default OptimalTournamentStrategy;