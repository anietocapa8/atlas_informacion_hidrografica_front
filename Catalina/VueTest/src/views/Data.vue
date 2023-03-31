<template>
    <div class="h-full w-full p-10 scrollbar overflow-y-scroll flex flex-col space-y-10">

        <h1 class="text-5xl text-green-700 dark:text-green-400 font-bold mx-auto">
            Data tests
        </h1>

        <DataMap />
        <Graph />

    </div>
</template>

<script lang="ts" setup>

import DataMap from '../components/DataMap.vue';
import Graph from '../components/Graph.vue';

</script>
