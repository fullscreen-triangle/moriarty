import React, { useEffect, useRef, useState } from 'react';

const ResponsiveGlobeContainer = ({ children }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '100%', height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const parentWidth = container.parentElement.clientWidth;
        // Set height based on viewport and container width
        const calculatedHeight = Math.min(
          window.innerHeight * 0.7, // Max 70% of viewport height
          parentWidth * 0.75 // Maintain aspect ratio
        );
        
        setDimensions({
          width: '100%',
          height: calculatedHeight
        });
      }
    };

    // Initial sizing
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full transition-all duration-300 ease-in-out"
      style={{ 
        height: dimensions.height,
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      {React.cloneElement(children, {
        width: dimensions.width,
        height: dimensions.height
      })}
    </div>
  );
};

export default ResponsiveGlobeContainer;