<template>
    <div id="atlas-un-stats" class="atlas-un-stats">
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
    name: 'AtlasUNStats',
    props: ['actualAtlas'],
    data() {
        return {
            map: null,
            mapview: null,
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

            })
        }
    }
}
</script>

<style scoped>
.atlas-un-stats {
    width: 100%;
    height: 100%;
}
</style>
