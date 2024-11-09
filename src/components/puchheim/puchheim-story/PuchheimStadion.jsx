import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const PuchheimStadion = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hvbWJvY2hpbm9rb3NvcmFtb3RvIiwiYSI6ImNsYWIzNzN1YzA5M24zdm4xb2txdXZ0YXQifQ.mltBkVjXA6LjUJ1bi7gdRg";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [11.355998587189106, 48.18294222057796],
      zoom: 18.2,
      pitch: 50,
      bearing: 93,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
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
                  [
                    [11.356697275600567, 48.18352535045963],
                    [11.356320837229589, 48.183579688272175],
                    [11.356115154408428, 48.18363143851619],
                    [11.355381681707684, 48.18305700787786],
                    [11.355005243337786, 48.18266887542393],
                    [11.355067336264483, 48.182262626974165],
                    [11.355540794833558, 48.18202715665353],
                    [11.35603753825032, 48.182166886424795],
                    [11.356503235203206, 48.18259901127007],
                    [11.356887435189236, 48.18299749442548],
                    [11.35690683922931, 48.183323523794456],
                    [11.356695745005112, 48.18352480398411],
                  ],
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
          "line-width": 5,
        },
      });
    });
  }, []);

  return <div id="map" style={{ height: "100%" }} ref={mapContainerRef} />;
};

export default PuchheimStadion;
