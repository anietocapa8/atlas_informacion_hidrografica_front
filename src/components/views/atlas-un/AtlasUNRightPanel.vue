<template>
  <div id="atlas-un-right-panel" class="atlas-un-right-panel">
    <AtlasUNMap id="atlas-un-map" class="atlas-un-map" :actualAtlas="actualAtlas"></AtlasUNMap>
    <AtlasUNStats id="atlas-un-stats" class="atlas-un-stats" :actualAtlas="actualAtlas"></AtlasUNStats>
  </div>
</template>


<script>
import AtlasUNMap from './AtlasUNMap.vue'
import AtlasUNStats from './AtlasUNStats.vue'
export default {
  name: 'AtlasUNRightPanel',
  components: { AtlasUNMap, AtlasUNStats },
  props: ['actualAtlas'],
  data(){
    return{
      viewAtlas: 1 //1: estaciones, 2: muestreo, 3: historico, 4: dashboard
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

.atlas-un-right-panel{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.atlas-un-map, .atlas-un-stats {
  height: 50vh;
  width: 100%;
}

</style>
