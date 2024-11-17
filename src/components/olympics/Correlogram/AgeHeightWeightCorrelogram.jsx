import React, { useRef, useState, useEffect  } from 'react';
import { data } from "./data";
import { Correlogram } from "./Correlogram";

const useDimensions = (targetRef) => {
    const getDimensions = () => {
        return {
            width: targetRef.current ? targetRef.current.offsetWidth : 0,
            height: targetRef.current ? targetRef.current.offsetHeight : 0
        };
    };

    const [dimensions, setDimensions] = useState(getDimensions);

    const handleResize = () => {
        setDimensions(getDimensions());
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        handleResize();
    }, [targetRef]);

    return dimensions;
};

const AgeHeightWeightCorrelogram = () => {
    const containerRef = useRef(null);
    const dimensions = useDimensions(containerRef);
    
    // Set minimum dimensions to prevent the chart from becoming too small
    const minWidth = 800;
    const minHeight = 500;
    
    // Calculate aspect ratio (roughly 16:9)
    const aspectRatio = 1.75;
    
    return (
        <div className="w-full h-full min-h-[200px]" ref={containerRef}>
            <div className="w-full h-full">
                <Correlogram
                    data={data}
                    width={Math.max(dimensions.width, minWidth)}
                    height={Math.max(dimensions.width / aspectRatio, minHeight)}
                />
            </div>
        </div>
    );
};

export default AgeHeightWeightCorrelogram;





