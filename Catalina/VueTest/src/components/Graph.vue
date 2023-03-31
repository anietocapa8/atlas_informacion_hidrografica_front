<template>

    <div id="FP_T21"></div>
    <div id="FP_T31"></div>
    <div id="FP_power"></div>

</template>

<script>

    import Plotly from "plotly.js-dist";
    import $ from 'jquery';

    import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';

    import { ref, onMounted } from 'vue';
    const NASAData = ref(
        {
            "FP_T21": [{
                x: [],
                type: "histogram",
            }],
            "FP_T31": [{
                x: [],
                type: "histogram",
            }],
            "FP_power": [{
                x: [],
                type: "histogram",
            }],
        }
    );

    let res = null;

    const layout = ref(
        {
            title: "Test"
        }
    );

    // Violence feature layer (points)
    const NASALayer = new FeatureLayer({
        url: "https://services1.arcgis.com/feGg99NkOSy3XuE4/arcgis/rest/services/NASA/FeatureServer/0"
    });

    onMounted(() => {

        res.features.forEach((feature, i) => {

            NASAData.value["FP_T21"][0].x.push(feature.attributes.FP_T21);
            NASAData.value["FP_T31"][0].x.push(feature.attributes.FP_T31);
            NASAData.value["FP_power"][0].x.push(feature.attributes.FP_power);

        });

        Plotly.newPlot(document.getElementById("#FP_T21"), NASAData.value["FP_T21"]);

    });

    res = await NASALayer.queryFeatures({
        where: "",
        orderByFields: ["date ASC"],
        outFields: ["date", "FP_T21", "FP_T31", "FP_power"],
        returnGeometry: false
    });

</script>
