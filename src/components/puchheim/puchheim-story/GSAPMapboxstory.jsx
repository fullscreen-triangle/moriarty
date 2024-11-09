import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const MapboxStorytelling = ({ config }) => {
  const [map, setMap] = useState(null)
  const [insetMap, setInsetMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const mapContainer = useRef(null)
  const insetMapContainer = useRef(null)
  const storyRef = useRef(null)
  const featuresRef = useRef(null)
  const initLoadRef = useRef(true)

  const layerTypes = {
    fill: ["fill-opacity"],
    line: ["line-opacity"],
    circle: ["circle-opacity", "circle-stroke-opacity"],
    symbol: ["icon-opacity", "text-opacity"],
    raster: ["raster-opacity"],
    "fill-extrusion": ["fill-extrusion-opacity"],
    heatmap: ["heatmap-opacity"]
  }

  const alignments = {
    left: "lefty",
    center: "centered",
    right: "righty",
    full: "fully"
  }

  const getLayerPaintType = layer => {
    if (!map) return null
    const layerType = map.getLayer(layer).type
    return layerTypes[layerType]
  }

  const setLayerOpacity = layer => {
    if (!map) return
    const paintProps = getLayerPaintType(layer.layer)
    if (!paintProps) return

    paintProps.forEach(prop => {
      const options = {}
      if (layer.duration) {
        const transitionProp = `${prop}-transition`
        options.duration = layer.duration
        map.setPaintProperty(layer.layer, transitionProp, options)
      }
      map.setPaintProperty(layer.layer, prop, layer.opacity, options)
    })
  }

  const updateMap = (element, chapter, isEntering) => {
    if (!map) return

    if (isEntering) {
      element.classList.add("active")
      const flyToOptions = {
        ...chapter.location,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      }

      map[chapter.mapAnimation || "flyTo"](flyToOptions)

      if (config.inset && insetMap) {
        insetMap.flyTo({
          center: chapter.location.center,
          zoom: chapter.location.zoom < 5 ? 0 : 3
        })
      }

      if (config.showMarkers && marker) {
        marker.setLngLat(chapter.location.center)
      }

      if (chapter.onChapterEnter?.length > 0) {
        chapter.onChapterEnter.forEach(setLayerOpacity)
      }

      if (chapter.callback) {
        const callback = window[chapter.callback]
        if (typeof callback === "function") callback()
      }

      if (chapter.rotateAnimation) {
        map.once("moveend", () => {
          const rotateNumber = map.getBearing()
          map.rotateTo(rotateNumber + 180, {
            duration: 30000,
            easing: t => t
          })
        })
      }
    } else {
      element.classList.remove("active")
      if (chapter.onChapterExit?.length > 0) {
        chapter.onChapterExit.forEach(setLayerOpacity)
      }
    }
  }

  useEffect(() => {
    if (!mapContainer.current || !config.accessToken) return

    mapboxgl.accessToken = config.accessToken

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: config.style,
      center: config.chapters[0].location.center,
      zoom: config.chapters[0].location.zoom,
      bearing: config.chapters[0].location.bearing,
      pitch: config.chapters[0].location.pitch,
      interactive: false,
      projection: config.projection
    })

    setMap(mapInstance)

    if (config.showMarkers) {
      const markerInstance = new mapboxgl.Marker({
        color: config.markerColor
      })
      markerInstance
        .setLngLat(config.chapters[0].location.center)
        .addTo(mapInstance)
      setMarker(markerInstance)
    }

    if (config.inset && insetMapContainer.current) {
      const insetMapInstance = new mapboxgl.Map({
        container: insetMapContainer.current,
        style: config.style,
        center: config.chapters[0].location.center,
        zoom: 3,
        hash: false,
        interactive: false,
        attributionControl: false
      })

      setInsetMap(insetMapInstance)
    }

    return () => {
      mapInstance.remove()
      if (insetMap) insetMap.remove()
    }
  }, [])

  useEffect(() => {
    if (!map) return

    map.on("load", () => {
      if (config.use3dTerrain) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14
        })

        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15
          }
        })
      }

      // Set up GSAP ScrollTrigger for each chapter
      const steps = document.querySelectorAll(".step")
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onEnter: () => updateMap(step, config.chapters[index], true),
          onEnterBack: () => updateMap(step, config.chapters[index], true),
          onLeave: () => updateMap(step, config.chapters[index], false),
          onLeaveBack: () => updateMap(step, config.chapters[index], false)
        })
      })

      if (config.auto) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: '.step[data-index="0"]', autoKill: false },
          ease: "power2.inOut"
        })
      }
    })
  }, [map])

  return (
    <div className="story-wrapper">
      <div ref={mapContainer} className="map" />
      {config.inset && <div ref={insetMapContainer} className="map-inset" />}
      <div ref={storyRef} id="story">
        {(config.title || config.subtitle || config.byline) && (
          <div id="header" className={config.theme}>
            {config.title && <h1>{config.title}</h1>}
            {config.subtitle && <h2>{config.subtitle}</h2>}
            {config.byline && <p className="byline">{config.byline}</p>}
          </div>
        )}
        <div ref={featuresRef} id="features">
          {config.chapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              id={chapter.id}
              className={`step ${idx === 0 ? "active" : ""} ${alignments[
                chapter.alignment
              ] || "centered"} ${chapter.hidden ? "hidden" : ""}`}
              data-index={idx}
            >
              <div className={config.theme}>
                {chapter.title && <h3 className="title">{chapter.title}</h3>}
                {chapter.image && (
                  <img
                    src={chapter.image}
                    alt={chapter.title || "Chapter image"}
                  />
                )}
                {chapter.description && (
                  <p
                    dangerouslySetInnerHTML={{ __html: chapter.description }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {config.footer && (
          <div id="footer" className={config.theme}>
            <p dangerouslySetInnerHTML={{ __html: config.footer }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MapboxStorytelling
