<template>
  <div id="atlas-dashboard-exportar" class="atlas-dashboard-exportar">
    <button v-bind:class="{ active: optionAtlas === 4 }" class="atlas-dashboard-boton" @click="clickExportar()">
      {{ this.$i18n.t('atlasun.exportar') }}
    </button>
    <i class="fas fa-file atlas-dashboard-csv">csv</i>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNDashboardExportar',
  methods:{
    clickExportar(){
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.atlas-dashboard-exportar
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;

.atlas-dashboard-boton
  height: 30px;
  width: 100px;
  background-color: #ccc;
  border-radius: 10px;
  color: black;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border: 2px solid #000;

.atlas-dashboard-boton:focus
  background-color: #444;
  color: white;

.atlas-dashboard-csv
  font-size: 25px;
  color: black;
  padding-left: 10px;
</style>

