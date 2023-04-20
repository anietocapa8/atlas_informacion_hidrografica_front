<template>
  <div id="atlas-historico-descargar" class="atlas-historico-descargar">
    <button v-bind:class="{ active: optionAtlas === 4 }" class="atlas-historico-boton" @click="clickDescargar()">
      {{ this.$i18n.t('atlasun.descargar') }}
    </button>
    <i class="fas fa-file atlas-historico-csv">csv</i>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNHistoricoDescargar',
  methods:{
    clickDescargar(){
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.atlas-historico-descargar
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;

.atlas-historico-boton
  height: 30px;
  width: 100px;
  background-color: #ccc;
  border-radius: 10px;
  color: black;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border: 2px solid #000;

.atlas-historico-boton:focus
  background-color: #444;
  color: white;

.atlas-historico-csv
  font-size: 25px;
  color: black;
  padding-left: 10px;
</style>

