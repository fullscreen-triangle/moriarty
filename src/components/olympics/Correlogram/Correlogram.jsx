import { MARGIN } from "./constants";
import { Histogram } from "./Histogram";
import { Scatterplot } from "./Scatterplot";
export const Correlogram = ({ width, height, data }) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const allVariables = ["Age", "Height", "Weight"]; // TODO: should not be hard-coded
    const allGroups = [...new Set(data.map((d) => d.group))];
    const graphWidth = boundsWidth / allVariables.length;
    const graphHeight = boundsHeight / allVariables.length;
    const allGraphs = allVariables.map((yVar, i) => {
        return allVariables.map((xVar, j) => {
            // If x and y variables are the same (diagonal), use a distribution instead.
            if (xVar === yVar) {
                const distributionData = allGroups.map((group) => {
                    return {
                        group,
                        values: data.filter((d) => d.group === group).map((d) => d[xVar]),
                    };
                });
                return (<Histogram width={graphWidth} height={graphHeight} data={distributionData} limits={[0, 200]}/>);
            }
            // Scatterplot dataset
            const scatterData = data.map((d) => {
                return { x: d[xVar], y: d[yVar], group: d.group };
            });
            return (<div key={i + "-" + j}>
          <Scatterplot width={graphWidth} height={graphHeight} data={scatterData} yLabel={j === 0 ? allVariables[i] : undefined} xLabel={i === allVariables.length - 1 ? allVariables[j] : undefined}/>
        </div>);
        });
    });
    return (<div style={{
            width,
            height,
        }}>
      <div style={{
            width: boundsWidth,
            height: boundsHeight,
            display: "grid",
            gridTemplateColumns: "1fr ".repeat(allVariables.length),
            transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)`,
        }}>
        {allGraphs}
      </div>
    </div>);
};
