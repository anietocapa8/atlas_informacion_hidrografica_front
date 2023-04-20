<template>
  <div id="atlas-historico" class="atlas-historico">
    <h1 id="atlas-historico-title" class="atlas-historico-title">{{ $t('atlasun.historicoLabels.title') }}</h1>
    <AtlasUNHistoricoFechas id="atlas-historico-fechas" class="atlas-historico-fechas"></AtlasUNHistoricoFechas>
    <AtlasUNHistoricoDescargar id="atlas-historico-descargar" class="atlas-historico-descargar"></AtlasUNHistoricoDescargar>
    <AtlasUNNota :nota="$t('atlasun.historicoTexts.nota')" id="atlas-historico-nota" class="atlas-historico-nota"></AtlasUNNota>
  </div>
</template>

<script>
import AtlasUNHistoricoFechas from './AtlasUNHistoricoFechas.vue';
import AtlasUNHistoricoDescargar from './AtlasUNHistoricoDescargar.vue';
import AtlasUNNota from './AtlasUNNota.vue';
export default {
  name: 'AtlasUNHistorico',
  components: { AtlasUNHistoricoFechas, AtlasUNHistoricoDescargar, AtlasUNNota }
}
</script>

<style scoped>
.atlas-historico {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.atlas-historico-title {
  width: 100%;
  background-color: white;
  color: black;
  font-size: 18px;
}

.atlas-historico-fechas{
  width: 100%;
}

.atlas-historico-descargar{
  width: 100%;
}

.atlas-historico-nota{
  width: 100%;
}

</style>

