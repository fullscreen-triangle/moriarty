"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the CSS for mapbox-gl styles

const RouteCamera = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const loadFiles = [
      fetch("/maps/puchheim_track.geojson").then(
        (response) => response.json(),
      ),
      fetch("/maps/puchheim_camera.geojson").then(
        (response) => response.json(),
      ),
    ];

    Promise.all(loadFiles).then(function (data) {
      const yoshida_route = data[0].features[0].geometry.coordinates.reverse();
      const camera_route = data[1].features[0].geometry.coordinates.reverse();

      mapboxgl.accessToken =
        "pk.eyJ1IjoiaGlyb3NhamkiLCJhIjoiY2szOWlqZWNzMDJueTNjcWhyNjhqdXBnOSJ9._6mJT202QqpnMuK-jvMr3g";

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        zoom: 18,
        center: camera_route[camera_route.length - 1],
        pitch: 0,
        bearing: 0,
        style: "mapbox://styles/mapbox/satellite-v9",
        interactive: false,
      });

      const targetRoute = yoshida_route;
      const cameraRoute = camera_route;
      const shortTargetRoute = camera_route.slice(1);

      map.on("load", function () {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 3 });
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
        map.addSource("trace", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: targetRoute,
            },
          },
        });
        map.addLayer({
          type: "line",
          source: "trace",
          id: "line",
          paint: {
            "line-color": "#ffffff",
            "line-opacity": 0.5,
            "line-width": 5,
          },
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
        });
      });

      map.on("load", function () {
        const cameraAltitude_base = 7800;
        const routeLength = turf.length(turf.lineString(targetRoute));
        const cameraRouteLength = turf.length(turf.lineString(targetRoute));

        function frame() {
          ticking = false;

          const y = window.scrollY;
          const rate =
            y / window.innerHeight < 0.03 ? 0.03 : y / window.innerHeight;
          const cameraAltitude =
            rate <= 0.03
              ? cameraAltitude_base + (0.0305 - rate) * 100000
              : cameraAltitude_base + rate * rate * 10000;

          const alongRoute = turf.along(
            turf.lineString(shortTargetRoute),
            routeLength * rate,
          ).geometry.coordinates;

          const alongCamera = turf.along(
            turf.lineString(cameraRoute),
            cameraRouteLength * rate,
          ).geometry.coordinates;

          const camera = map.getFreeCameraOptions();
          camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
            {
              lng: alongCamera[0],
              lat: alongCamera[1],
            },
            cameraAltitude,
          );
          camera.lookAtPoint({
            lng: alongRoute[0],
            lat: alongRoute[1],
          });
          map.setFreeCameraOptions(camera);
        }

        let ticking = false;

        function scrollEvent() {
          if (!ticking) {
            requestAnimationFrame(frame);
            ticking = true;
          }
        }

        document.addEventListener("scroll", scrollEvent, { passive: true });
      });

      return () => {
        document.removeEventListener("scroll", scrollEvent);
        map.remove();
      };
    });
  }, []);

  return <div ref={mapContainer} id="map" style={{ height: "100vh" }} />;
};

export default RouteCamera;
