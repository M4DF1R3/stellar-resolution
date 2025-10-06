import React, { useEffect, useRef } from "react";

// Import ArcGIS modules
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";
import Graphic from "@arcgis/core/Graphic";

const MarsAnnotationMap = () => {
    const mapRef = useRef(null);
    const sketchRef = useRef(null);

    useEffect(() => {
        let view;

        if (mapRef.current) {
            const marsElevation = new ElevationLayer({
                url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer",
                copyright:
                    "Topography: NASA GSFC, DLR, USGS Astrogeology, JPL, Esri",
            });

            const ctxLayer = new TileLayer({
                url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX1/MapServer",
                copyright: "Imagery: NASA, JPL, MSSS, Caltech/Murray Lab, Esri",
                visible: true,
                listMode: "hide",
            });

            const annotationsLayer = new GraphicsLayer({
                title: "Annotations",
            });

            const cratersLayer = new FeatureLayer({
                url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Mars_Nomenclature_Mountains/FeatureServer",
                definitionExpression: "type = 'Crater, craters'",
                title: "Impact Craters",
                visible: false,
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "polygon-3d",
                        symbolLayers: [
                            {
                                type: "fill",
                                material: { color: [255, 255, 255, 0.1] },
                                outline: { color: [0, 0, 0, 0.4], size: 5 },
                            },
                        ],
                    },
                },
                labelingInfo: [
                    {
                        labelPlacement: "above-center",
                        labelExpressionInfo: { expression: "$feature.NAME" },
                        symbol: {
                            type: "label-3d",
                            symbolLayers: [
                                {
                                    type: "text",
                                    material: { color: [255, 255, 255, 0.9] },
                                    halo: { size: 1, color: [0, 0, 0, 0.7] },
                                    font: { size: 14, weight: "bold" },
                                },
                            ],
                            verticalOffset: {
                                screenLength: 40,
                                maxWorldLength: 500000,
                                minWorldLength: 0,
                            },
                            callout: {
                                type: "line",
                                size: 0.5,
                                color: [255, 255, 255, 0.9],
                                border: { color: [0, 0, 0, 0.3] },
                            },
                        },
                    },
                ],
            });

            // Initialize the map
            const map = new Map({
                ground: { layers: [marsElevation] },
                layers: [ctxLayer, annotationsLayer, cratersLayer],
            });

            view = new SceneView({
                container: mapRef.current,
                map: map,
                qualityProfile: "high",
                spatialReference: { wkid: 104971 }, // Mars 2000 Sphere
                camera: {
                    position: {
                        x: -5.37351,
                        y: -2.78455,
                        z: 17323.085,
                        spatialReference: 104971,
                    },
                    heading: 0.27,
                    tilt: 57.98,
                },
                environment: {
                    background: { type: "color", color: [0, 0, 0, 1] },
                    starsEnabled: false,
                    atmosphereEnabled: false,
                    lighting: { type: "virtual" },
                },
            });

            // Initialize LayerList and Expand widgets
            const layerList = new LayerList({ view });
            const bkExpandLayer = new Expand({
                view,
                content: layerList,
                expanded: false,
                group: "top-left",
            });
            view.ui.add(bkExpandLayer, "top-left");

            // Initialize the Sketch widget
            const sketch = new Sketch({
                view: view,
                layer: annotationsLayer,
                polygonSymbol: {
                    type: "simple-fill",
                    color: [255, 0, 0, 0.5],
                    outline: { color: [255, 0, 0, 1], width: 2 },
                },
            });
            sketchRef.current = sketch; // Store instance in ref

            // Listen for the sketch create event
            sketch.on("create", (event) => {
                if (event.state === "complete") {
                    const polygonGeometry = event.graphic.geometry;
                    const annotationText = prompt(
                        "Enter annotation text for this polygon:"
                    );

                    if (annotationText) {
                        const polygonGraphic = new Graphic({
                            geometry: polygonGeometry,
                            symbol: {
                                type: "simple-fill",
                                color: [0, 255, 255, 0.4],
                                outline: { color: [0, 255, 255, 1], width: 2 },
                            },
                            attributes: { text: annotationText },
                        });

                        const textGraphic = new Graphic({
                            geometry: polygonGeometry.extent.center,
                            symbol: {
                                type: "text",
                                color: "white",
                                text: annotationText,
                                font: { size: 14, weight: "bold" },
                                haloColor: "black",
                                haloSize: 1,
                            },
                            attributes: { text: annotationText },
                        });

                        annotationsLayer.remove(event.graphic);
                        annotationsLayer.addMany([polygonGraphic, textGraphic]);
                        alert(`Annotation saved: ${annotationText}`);
                    } else {
                        annotationsLayer.remove(event.graphic);
                        alert("Annotation cancelled.");
                    }
                }
            });
        }

        // Cleanup function to destroy the view when the component unmounts
        return () => {
            if (view) {
                view.destroy();
            }
        };
    }, []);

    // Click handler for the annotation button
    const handleStartAnnotation = () => {
        if (sketchRef.current) {
            sketchRef.current.create("polygon");
        }
    };

    return (
        <div className="map-container">
            <div ref={mapRef} className="viewDiv"></div>
            <div id="annotationTools" className="esri-widget">
                <button
                    id="startAnnotationButton"
                    className="esri-button esri-button--primary"
                    onClick={handleStartAnnotation}
                >
                    Create Label
                </button>
            </div>
        </div>
    );
};

export default MarsAnnotationMap;
