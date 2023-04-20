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
            loadModules([
                "esri/config",
                "esri/Map",
                "esri/views/MapView",
                "esri/layers/FeatureLayer",
                "esri/widgets/LayerList",
            ]).then(([
                esriConfig,
                Map,
                MapView,
                FeatureLayer,
                LayerList,
            ]) => {

                // esriConfig.apiKey = "AAPK5916cf3e3997416c8b5138a4c41e72d7L73Yx1kVNgz9TY6PRKjUUeZU4gKPJ0sthz9sl8UeoBT8dx2617lBXoV2lzPXjv2g";

                const map = new Map({
                    basemap: "topo-vector"
                });

                const view = new MapView({
                    container: 'atlas-un-map',
                    map: map,
                });

                const base_URL = (
                    "https://serviciosgeo.sdp.gov.co/arcgis/rest/" +
                    "services/SIPSDER/Desarrollo_rural/MapServer/"
                );

                for (let layer = 22; layer > -1 ; layer--) {

                    const featureLayer = new FeatureLayer({
                        url: `${base_URL}${layer}`,
                    });

                    map.add(featureLayer);

                    featureLayer.when(() => {
                        console.log(
                            "FeatureLayer fields", featureLayer.fields.map(field => {
                                return field.alias
                            })
                        );
                    });

                }

                let layerList = new LayerList({
                    view: view
                });

                view.scale = 2400;

                view.ui.add(
                    layerList, {position: "top-left"}
                );

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

                this.map = map;
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
    }
}
</script>

<style scoped>
@import "https://js.arcgis.com/4.26/@arcgis/core/assets/esri/themes/dark/main.css";
.atlas-un-map {
    width: 100%;
    height: 50%;
}
</style>
