'use client';
import React from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export const CesiumComponent = ({ CesiumJs, modelUrl, geojsonPath }) => {
    const viewerRef = React.useRef(null);
    const cesiumContainerRef = React.useRef(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const initializeCesiumJs = React.useCallback(async () => {
        if (viewerRef.current !== null) {
            // Set up the clock
            const start = CesiumJs.JulianDate.fromDate(new Date());
            const stop = CesiumJs.JulianDate.addSeconds(start, 300, new CesiumJs.JulianDate());
            viewerRef.current.clock.startTime = start.clone();
            viewerRef.current.clock.stopTime = stop.clone();
            viewerRef.current.clock.currentTime = start.clone();
            viewerRef.current.clock.clockRange = CesiumJs.ClockRange.LOOP_STOP;
            viewerRef.current.timeline.zoomTo(start, stop);

            // Load and process GeoJSON data
            const dataSource = await CesiumJs.GeoJsonDataSource.load(geojsonPath);
            viewerRef.current.dataSources.add(dataSource);
            const entities = dataSource.entities.values;
            
            if (entities.length > 0) {
                const positions = [];
                const times = [];

                entities.forEach((entity, index) => {
                    const position = entity.position.getValue(start);
                    positions.push(position);
                    
                    const time = CesiumJs.JulianDate.addSeconds(start, index * 10, new CesiumJs.JulianDate());
                    times.push(time);
                });

                // Create a position property for smooth interpolation
                const position = new CesiumJs.SampledPositionProperty();
                for (let i = 0; i < positions.length; i++) {
                    position.addSample(times[i], positions[i]);
                }

                // Add the model
                const model = await CesiumJs.Model.fromGltfAsync({
                    url: modelUrl,
                    scale: 1, // Adjust scale as needed
                });
                const modelPrimitive = viewerRef.current.scene.primitives.add(model);

                // Update model position and orientation
                viewerRef.current.scene.preUpdate.addEventListener(() => {
                    const time = viewerRef.current.clock.currentTime;
                    const pos = position.getValue(time);
                    const hpr = new CesiumJs.HeadingPitchRoll();
                    const orientation = CesiumJs.Transforms.headingPitchRollQuaternion(pos, hpr);
                    
                    modelPrimitive.modelMatrix = CesiumJs.Matrix4.fromTranslationQuaternionRotationScale(
                        pos,
                        orientation,
                        new CesiumJs.Cartesian3(1, 1, 1)
                    );
                });

                // Set up camera to follow the model
                viewerRef.current.trackedEntity = new CesiumJs.Entity({
                    position: position,
                    orientation: new CesiumJs.VelocityOrientationProperty(position),
                });
            }

            setIsLoaded(true);
        }
    }, [CesiumJs, modelUrl, geojsonPath]);

    React.useEffect(() => {
        if (viewerRef.current === null && cesiumContainerRef.current) {
            viewerRef.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
                shouldAnimate: true,
            });
        }
    }, [CesiumJs]);

    React.useEffect(() => {
        if (isLoaded)
            return;
        initializeCesiumJs();
    }, [isLoaded, initializeCesiumJs]);

    React.useEffect(() => {
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
            }
        };
    }, []);

    return <div ref={cesiumContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default CesiumComponent;