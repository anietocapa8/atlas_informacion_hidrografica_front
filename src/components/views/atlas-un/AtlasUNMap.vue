<template>
    <div id="atlas-un-map" class="atlas-un-map"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
    name: 'AtlasUNMap',
    props: ['actualAtlas'],
    data() {
        return {
            maps: [],
            widgets: [],
            mapView: null
        };
    },
    mounted() {
        if (!this.mapView) {
            loadModules([
                "esri/config",
                "esri/Map",
                "esri/views/MapView",
                "esri/layers/FeatureLayer",
                "esri/layers/GeoJSONLayer",
                "esri/widgets/LayerList",
            ]).then(([
                esriConfig,
                Map,
                MapView,
                FeatureLayer,
                GeoJSONLayer,
                LayerList,
            ]) => {

                // esriConfig.apiKey = "AAPK5916cf3e3997416c8b5138a4c41e72d7L73Yx1kVNgz9TY6PRKjUUeZU4gKPJ0sthz9sl8UeoBT8dx2617lBXoV2lzPXjv2g";

                // create a geojson layer from geojson feature collection
                const geojson = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            id: 1,
                            geometry: {
                                type: "Point",
                                coordinates: [-74.15, 4.28]
                            },
                            properties: {
                                ID: "HDFS457FC",
                                Name: "Estación A",
                            }
                        },

                        {
                            type: "Feature",
                            id: 2,
                            geometry: {
                                type: "Point",
                                coordinates: [-74.16, 4.51]
                            },
                            properties: {
                                ID: "HDFS56FYT",
                                Name: "Estación B",
                            }
                        },

                        {
                            type: "Feature",
                            id: 3,
                            geometry: {
                                type: "Point",
                                coordinates: [-74.13, 4.55]
                            },
                            properties: {
                                ID: "HDFS76GUG",
                                Name: "Estación C",
                            }
                        },

                        {
                            type: "Feature",
                            id: 4,
                            geometry: {
                                type: "Point",
                                coordinates: [-74.18, 4.1]
                            },
                            properties: {
                                ID: "HDFS67GUJ",
                                Name: "Estación D",
                            }
                        }

                    ]
                };

                // create a new blob from geojson featurecollection
                const blob = new Blob([JSON.stringify(geojson)], {
                    type: "application/json"
                });

                // URL reference to the blob
                const url = URL.createObjectURL(blob);

                // create new geojson layer using the blob url
                const layerStations = new GeoJSONLayer({
                    url,
                    popupTemplate: {
                        title: "Flares",
                        content: '<b>ID:</b> {ID}<br><b>Station Name:</b> {Name}'
                    },
                    renderer: {
                        type: "simple",
                        symbol: {
                            type: "simple-marker",
                            size: 6,
                            color: [150, 205, 10],
                        }
                    },
                    title: "Estaciones"
                });

                const mapStations = new Map({
                    basemap: "topo-vector",
                    layers: [layerStations],
                });

                const NASARenderer = {
                    type: "heatmap",
                    field: "FP_Power",
                    colorStops: [
                        { color: [0, 0, 0, 0], ratio: 0 },
                        { color: [0, 0, 255, 0.5], ratio: 0.01 },
                        { color: [40, 40, 210, 0.5], ratio: 0.0925 },
                        { color: [80, 80, 180, 0.5], ratio: 0.175 },
                        { color: [160, 160, 170, 0.5], ratio: 0.2575 },
                        { color: [175, 175, 128, 0.5], ratio: 0.34 },
                        { color: [184, 184, 85, 0.5], ratio: 0.4225 },
                        { color: [192, 192, 76, 0.5], ratio: 0.505 },
                        { color: [200, 0, 55, 0.5], ratio: 0.5875 },
                        { color: [211, 0, 42, 0.5], ratio: 0.67 },
                        { color: [222, 0, 30, 0.5], ratio: 0.7525},
                        { color: [233, 0, 18, 0.5], ratio: 0.835},
                        { color: [244, 0, 7, 0.5], ratio: 0.9175},
                        { color: [255, 0, 0, 0.5], ratio: 1 }
                    ],
                    minDensity: 0,
                    maxDensity: 5,
                    radius: 10,
                    referenceScale: 5e6,
                };

                const LayerNasa = new GeoJSONLayer({
                    url: "https://www.arcgis.com/sharing/rest/content/items/62be85dca8de4456bee00607138474f8/data",
                    timeInfo: {
                        startField: "date",
                        interval: {
                            unit: "months",
                            value: 1
                        }
                    },
                    orderBy: {
                        field: "date"
                    },
                    renderer: NASARenderer,
                });

                const mapNasa = new Map({
                    basemap: "topo-vector",
                    layers: [LayerNasa]
                });

                const mapDesarrolloRural = new Map({
                    basemap: "topo-vector"
                });

                const base_URL = (
                    "https://serviciosgeo.sdp.gov.co/arcgis/rest/" +
                    "services/SIPSDER/Desarrollo_rural/MapServer/"
                );

                for (let layer = 22; layer > -1 ; layer--) {

                    const featureLayer = new FeatureLayer({
                        url: `${base_URL}${layer}`,
                    });

                    mapDesarrolloRural.add(featureLayer);

                }

                const view = new MapView({
                    container: 'atlas-un-map',
                    map: mapStations,
                });

                let layerList = new LayerList({
                    view: view
                });

                view.scale = 2400;

                // view.ui.add(
                //     layerList, {position: "top-left"}
                // );

                view.when(function () {
                    // MapView is now ready for display and can be used. Here we will
                    // use goTo to view a particular location at a given zoom level and center

                    view.goTo({
                        center: [-74.1, 4.5],
                        zoom: 9,
                        rotation: -90,
                    });

                })
                .catch(function (err) {
                    // A rejected view indicates a fatal error making it unable to display.
                    // Use the errback function to handle when the view doesn't load properly

                    console.error("MapView rejected:", err);

                });

                this.maps = [
                    mapStations,
                    mapNasa,
                    mapNasa,
                    mapDesarrolloRural,
                ];
                this.widgets = [layerList];
                this.mapView = view;
            });
        }
    },
    beforeDestroy() {
        if (this.mapView) {
            this.mapView.destroy()
            this.mapView = null
        }
    },
    beforeUpdate() {
        return false
    },
    watch: {

        actualAtlas: function (actualAtlas, prevAtlas) {

            this.mapView.map = this.maps[actualAtlas - 1];

            switch (actualAtlas) {
                case 4:
                    this.mapView.ui.add(this.widgets[0], "top-right");
                    break;

                default:
                    this.mapView.ui.remove(this.widgets[0]);
                    break;
            }

        }

    }
}
</script>

<style scoped>
@import "https://js.arcgis.com/4.26/@arcgis/core/assets/esri/themes/dark/main.css";
.atlas-un-map {
    width: 100%;
    height: 100%;
}
</style>
