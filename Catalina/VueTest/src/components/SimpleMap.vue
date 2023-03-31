<template>
    <div class="h-[30rem]">
        <div id="flares1" ref="flares1" class="h-[30rem]"></div>
        <div id="timeSliderFlares"></div>
    </div>
</template>

<script lang="ts" setup>

    import { ref, onMounted } from 'vue';

    import esriConfig from '@arcgis/core/config.js';
    import Map from '@arcgis/core/Map.js';
    import MapView from '@arcgis/core/views/MapView.js';
    import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
    import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer.js';
    import TimeSlider from '@arcgis/core/widgets/TimeSlider.js';

    onMounted(loadMap);

    function loadMap() {


                esriConfig.apiKey = "AAPK46e2c79b43d04be098fe1bcc92e8a120-zC451UrOSGL-vmvtor8Zm3YtE-S45ldEIGAONKe1fGVZ6t3GWlAQepWQTshcait";

    const map = new Map({
        basemap: "arcgis-imagery" // Basemap layer service
    });

    const view = new MapView({
        map: map,
        center: [-74.65, 3.9], // Longitude, latitude
        zoom: 5, // Zoom level
        container: "flares1" // Div element
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

    const NASALayer = new GeoJSONLayer({
        url: "https://www.arcgis.com/sharing/rest/content/items/62be85dca8de4456bee00607138474f8/data",
        title: "NASA HeatMap",
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
        popupTemplate: {
            title: "Flares",
            content: '<b>Date:</b> {date}<br><b>Channel 21:</b> {FP_T21}<br><b>Channel 31:</b> {FP_T31}<br><b>Power:</b> {FP_power}'
        },
        renderer: NASARenderer,
    });

    map.add(NASALayer);

    // Create a new time slider widget.
    const timeSlider = new TimeSlider({
        container: "timeSliderFlares",
        playRate: 200,
        loop: true,
        stops: {
            interval: {
                value: 1,
                unit: "months"
            }
        },
        view: view
    });
    view.ui.add(timeSlider, "bottom-left");

    view.whenLayerView(NASALayer).then((lv: any) => {

        timeSlider.fullTimeExtent = (
            NASALayer.timeInfo.fullTimeExtent
        );

        timeSlider.stops = {
            interval: NASALayer.timeInfo.interval
        };

    });


    }

</script>

<style>
    @import "https://js.arcgis.com/4.26/@arcgis/core/assets/esri/themes/dark/main.css";
</style>
