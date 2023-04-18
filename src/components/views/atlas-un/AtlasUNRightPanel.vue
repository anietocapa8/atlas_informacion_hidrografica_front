<template>
  <div id="atlas-un-right-panel" class="atlas-un-right-panel">
    <AtlasUNMap id="atlas-un-map" class="atlas-un-map"></AtlasUNMap>
  </div>
</template>


<script>
import AtlasUNMap from './AtlasUNMap.vue'
export default {
  name: 'AtlasUNRightPanel',
  components: { AtlasUNMap }
}
</script>

<style scoped>

.atlas-un-right-panel{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.atlas-un-map {
  height: 50vh;
  width: 100%;
}

</style>
