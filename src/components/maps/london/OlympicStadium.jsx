import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const OlympicStadium = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-0.01649282996038437, 51.53875741130028],
      zoom: 15.2,
      pitch: 50,
      bearing: 93,
      style: "mapbox://styles/mapbox/standard",
      minZoom: 15,
      maxZoom: 19,
    });

    mapRef.current.on("style.load", () => {
      // add a geojson source with a polygon to be used in the clip layer.
      mapRef.current.addSource("eraser", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [-0.017619286932472278, 51.54009766720873],
                  [-0.018410501343680608, 51.53944132272136],
                  [-0.018810867510524076, 51.5385531656263],
                  [-0.01825560179699437, 51.53773913335223],
                  [-0.017021504081895955, 51.53710918298711],
                  [-0.015927173096230263, 51.53721911816132],
                  [-0.0148686257838051, 51.537686906284165],
                  [-0.014480171263471675, 51.53896025628828],
                  [-0.015354650844557227, 51.53999786193293],
                  [-0.017132409067045273, 51.54031049378926],
                  [-0.01761229152700139, 51.540098914811324],
                ],
                type: "Polygon",
              },
            },
          ],
        },
      });

      mapRef.current.on("style.load", () => {
        mapRef.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 20,
        });
        mapRef.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      });

      // add the clip layer and configure it to also remove symbols and trees.
      // clipping becomes active from zoom level 16 and below.
      mapRef.current.addLayer({
        id: "eraser",
        type: "clip",
        source: "eraser",
        layout: {
          // specify the layer types to be removed by this clip layer
          "clip-layer-types": ["symbol", "model"],
        },
        maxzoom: 16,
      });

      // add a line layer to visualize the clipping region.
      mapRef.current.addLayer({
        id: "eraser-debug",
        type: "line",
        source: "eraser",
        paint: {
          "line-color": "rgba(255, 0, 0, 0.9)",
          "line-dasharray": [0, 4, 3],
          "line-width": 10,
        },
      });
    });
  }, []);

  return <div id="map" style={{ height: "100%" }} ref={mapContainerRef} />;
};

export default OlympicStadium;
