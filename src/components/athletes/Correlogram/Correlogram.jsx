import React, { useRef } from 'react';
import * as d3 from 'd3';
import { useDimensions } from './useDimensions';

// Constants for the visualization
const MARGIN = { top: 20, right: 20, bottom: 50, left: 50 };
const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'];

// Import only the components we actually use
import { Histogram } from './Histogram';
import { Scatterplot } from './Scatterplot';

const AthleteCorrelogram = ({ data }) => {
    const containerRef = useRef(null);
    const { width, height } = useDimensions(containerRef);
    
    if (!width || !height) {
        return <div ref={containerRef} className="w-full h-full" />;
    }

    const processedData = Object.entries(data).map(([name, info]) => ({
        name,
        group: info.athlete_info.Sport,
        BSA: info.additional_metrics.BSA,
        Max_HR: info.additional_metrics.Max_HR,
        VO2_Max: info.additional_metrics.VO2_Max,
        TER: info.additional_metrics.TER
    }));

    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    
    const allVariables = ["BSA", "Max_HR", "VO2_Max", "TER"];
    const allGroups = [...new Set(processedData.map(d => d.group))];
    
    const graphWidth = boundsWidth / allVariables.length;
    const graphHeight = boundsHeight / allVariables.length;

    const domains = allVariables.reduce((acc, variable) => {
        acc[variable] = d3.extent(processedData, d => d[variable]);
        return acc;
    }, {});

    const allGraphs = allVariables.map((yVar, i) => {
        return allVariables.map((xVar, j) => {
            if (xVar === yVar) {
                const distributionData = allGroups.map(group => ({
                    group,
                    values: processedData
                        .filter(d => d.group === group)
                        .map(d => d[xVar])
                }));

                return (
                    <Histogram
                        key={`hist-${i}-${j}`}
                        width={graphWidth}
                        height={graphHeight}
                        data={distributionData}
                        limits={domains[xVar]}
                    />
                );
            }

            const scatterData = processedData.map(d => ({
                x: d[xVar],
                y: d[yVar],
                group: d.group
            }));

            return (
                <div key={`scatter-${i}-${j}`}>
                    <Scatterplot
                        width={graphWidth}
                        height={graphHeight}
                        data={scatterData}
                        yLabel={j === 0 ? yVar : undefined}
                        xLabel={i === allVariables.length - 1 ? xVar : undefined}
                    />
                </div>
            );
        });
    });

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
        >
            <div
                style={{
                    width: boundsWidth,
                    height: boundsHeight,
                    display: "grid",
                    gridTemplateColumns: `repeat(${allVariables.length}, 1fr)`,
                    transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)`,
                }}
            >
                {allGraphs}
            </div>
        </div>
    );
};

export default AthleteCorrelogram;