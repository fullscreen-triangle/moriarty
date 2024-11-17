import React, { useEffect, useRef, useState } from 'react';
import { useResizeObserver } from 'react-use';

const MapboxResponsiveMapContainer = ({ 
  children,
  aspectRatio = 16/9,
  minHeight = 400,
  maxHeight = 800,
  className = "",
  style = {}
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '100%', height: minHeight });

  // Use ResizeObserver for more reliable size updates
  useResizeObserver(containerRef, (entry) => {
    const { width } = entry.contentRect;
    if (width) {
      // Calculate height based on aspect ratio, but constrain it
      const calculatedHeight = Math.min(
        Math.max(
          width / aspectRatio,
          minHeight
        ),
        maxHeight,
        window.innerHeight * 0.8 // Prevent map from being too tall on screen
      );

      setDimensions({
        width: '100%',
        height: calculatedHeight
      });
    }
  });

  // Handle container resize on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const calculatedHeight = Math.min(
          Math.max(
            width / aspectRatio,
            minHeight
          ),
          maxHeight,
          window.innerHeight * 0.8
        );

        setDimensions({
          width: '100%',
          height: calculatedHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [aspectRatio, minHeight, maxHeight]);

  return (
    <div 
      ref={containerRef}
      className={`relative transition-all duration-300 ease-in-out ${className}`}
      style={{ 
        width: '100%',
        height: dimensions.height,
        ...style
      }}
    >
      <div className="absolute inset-0">
        {React.cloneElement(children, {
          style: { width: '100%', height: '100%' },
          width: '100%',
          height: '100%'
        })}
      </div>
    </div>
  );
};

export default MapboxResponsiveMapContainer;