<template>
  <div id="atlas-un-left-panel" class="atlas-un-left-panel">
    <AtlasUNOptions id="atlas-un-options" class="atlas-un-options" @option-atlas="actualizarOption"></AtlasUNOptions>
    <AtlasUNEstaciones v-if="optionAtlas === 1" id="atlas-un-estaciones" class="atlas-un-estaciones"></AtlasUNEstaciones>
    <AtlasUNMuestreo v-if="optionAtlas === 2" id="atlas-un-muestreo" class="atlas-un-muestreo"></AtlasUNMuestreo>
    <AtlasUNHistorico v-if="optionAtlas === 3" id="atlas-un-historico" class="atlas-un-historico"></AtlasUNHistorico>
    <AtlasUNDashboard v-if="optionAtlas === 4" id="atlas-un-dashboard" class="atlas-un-dashboard"></AtlasUNDashboard>
  </div>
</template>

<script>
import AtlasUNOptions from './AtlasUNOptions.vue'
import AtlasUNEstaciones from './AtlasUNEstaciones.vue'
import AtlasUNMuestreo from './AtlasUNMuestreo.vue'
import AtlasUNHistorico from './AtlasUNHistorico.vue'
import AtlasUNDashboard from './AtlasUNDashboard.vue'
export default {
  name: 'AtlasUNLeftPanel',
  components: { AtlasUNOptions, AtlasUNEstaciones, AtlasUNMuestreo, AtlasUNHistorico, AtlasUNDashboard },
  data(){
    return{
      optionAtlas: 1 //1: estaciones, 2: muestreo, 3: historico, 4: dashboard
    }
  },
  methods:{
    actualizarOption(option){
      this.optionAtlas = option
      this.$emit('option-atlas', option)
    }
  }
}
</script>

<style scoped>
.atlas-un-left-panel{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.atlas-un-options{
  width: 100%;
  height: 65px;
}

.atlas-un-estaciones{
  width: 100%;
  height: 100%;
}

.atlas-un-muestreo{
  width: 100%;
  height: 100%;
}
.atlas-un-historico{
  width: 100%;
  height: 100%;
}
.atlas-un-dashboard{
  width: 100%;
  height: 100%;
}
</style>
