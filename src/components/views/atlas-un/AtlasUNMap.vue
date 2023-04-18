<template>
    <div id="atlas-un-map" class="atlas-un-map"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
    name: 'AtlasUNMap',
    data() {
        return {
            map: null,
            mapview: null
        };
    },
    mounted() {
        if (!this.mapview) {
            loadModules(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer"]).then(([Map, MapView, MapImageLayer]) => {
                const map = new Map({
                    basemap: "topo-vector"
                });
                const layer0 = new MapImageLayer({
                    url: "https://serviciosgeo.sdp.gov.co/arcgis/rest/services/SIPSDER/Desarrollo_rural/MapServer/0"
                });
                const layer1 = new MapImageLayer({
                    url: "https://serviciosgeo.sdp.gov.co/arcgis/rest/services/SIPSDER/Desarrollo_rural/MapServer/1"
                });
                map.add(layer0);
                map.add(layer1);
                const view = new MapView({
                    container: 'atlas-un-map',
                    map: map,
                });
                view.scale = 2400;
                view.when(function () {
                    // MapView is now ready for display and can be used. Here we will
                    // use goTo to view a particular location at a given zoom level and center
                    view.goTo({
                        center: [-74, 4],
                        zoom: 12
                    });
                })
                    .catch(function (err) {
                        // A rejected view indicates a fatal error making it unable to display.
                        // Use the errback function to handle when the view doesn't load properly
                        console.error("MapView rejected:", err);
                    });
                this.map = map;
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
    }
}
</script>

<style scoped>
.atlas-un-map {
    width: 100%;
    height: 100%;
}
</style>