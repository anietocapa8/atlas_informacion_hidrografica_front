<template>
    <div id="atlas-un-stats" class="atlas-un-stats">

        <div id="atlas-un-layers" class="atlas-un-layers">

            <button class="atlas-un-layers-list" v-for="layer of activeLayers" v-bind:key="layer.id">
                {{ layer.title }}
            </button>

        </div>

        <div id="atlas-un-layers-content" class="atlas-un-layers-content">
            <apexchart type="bar" :options="options" :series="series"></apexchart>
        </div>

    </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import VueApexCharts from 'vue-apexcharts'
import ApexCharts from 'apexcharts'
import Vue from 'vue'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
export default {
    name: 'AtlasUNStats',
    props: ['actualAtlas'],
    components: { VueApexCharts, ApexCharts },
    data() {
        return {
            options: {
                chart: {
                    id: 'vuechart-example',
                    background: '#000'
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                }
            },
            series: [{
                name: 'series-1',
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }],
            layers: [],
            activeLayers: [],
            mapview: null,
        };
    },
    mounted() {
        if (!this.mapview) {
            loadModules([
                "esri/layers/FeatureLayer",
                "esri/layers/GeoJSONLayer",
            ]).then(([
                FeatureLayer,
                GeoJSONLayer,
            ]) => {

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
                    title: "Estaciones"
                });

                const layerNasa = new GeoJSONLayer({
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
                    title: "NASA sample Data"
                });

                this.layers = [[layerStations], [layerNasa], [layerNasa], []];
                this.activeLayers = [layerStations];

                const base_URL = (
                    "https://serviciosgeo.sdp.gov.co/arcgis/rest/" +
                    "services/SIPSDER/Desarrollo_rural/MapServer/"
                );

                for (let layer = 22; layer > -1; layer--) {

                    const featureLayer = new FeatureLayer({
                        url: `${base_URL}${layer}`,
                    });

                    featureLayer.load();

                    this.layers[3].push(featureLayer)

                }

            })
        }
    },
    watch: {
        actualAtlas: function (newAtlas, prevAtlas) {

            this.activeLayers = this.layers[newAtlas - 1];

        }
    }
}
</script>

<style scoped>
.atlas-un-stats {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-y: scroll;
}

.atlas-un-layers {
    width: 30%;
    padding: 10px;
}

.atlas-un-layers-list {
    width: 100%;
    padding: 0.5rem;
}

.atlas-un-layers-content {
    width: 70%;
    padding: 10px;
}
</style>
