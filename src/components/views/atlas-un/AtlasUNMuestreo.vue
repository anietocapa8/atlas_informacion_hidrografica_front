<template>
  <div id="atlas-muestreo" class="atlas-muestreo">
    <h1 id="atlas-muestreo-title" class="atlas-muestreo-title">{{ $t('atlasun.muestreoLabels.title') }}</h1>
    <AtlasUNMuestreoFechas id="atlas-muestreo-fechas" class="atlas-muestreo-fechas"></AtlasUNMuestreoFechas>
    <AtlasUNMuestreoOrden id="atlas-muestreo-orden" class="atlas-muestreo-orden"></AtlasUNMuestreoOrden>
    <AtlasUNMuestreoTabla id="atlas-muestreo-tabla" class="atlas-muestreo-tabla"></AtlasUNMuestreoTabla>
    <AtlasUNNota :nota="$t('atlasun.muestreoTexts.nota')" id="atlas-muestreo-nota" class="atlas-muestreo-nota"></AtlasUNNota>
  </div>
</template>

<script>
import AtlasUNMuestreoFechas from './AtlasUNMuestreoFechas.vue';
import AtlasUNMuestreoOrden from './AtlasUNMuestreoOrden.vue';
import AtlasUNMuestreoTabla from './AtlasUNMuestreoTabla.vue';
import AtlasUNNota from './AtlasUNNota.vue';
export default {
  name: 'AtlasUNMuestreo',
  components: { AtlasUNMuestreoFechas, AtlasUNMuestreoOrden, AtlasUNMuestreoTabla, AtlasUNNota }
}
</script>

<style scoped>
.atlas-muestreo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.atlas-muestreo-title {
  width: 100%;
  background-color: white;
  color: black;
  font-size: 18px;
}

.atlas-muestreo-fechas{
  width: 100%;
}

.atlas-muestreo-orden{
  width: 100%;
}

.atlas-muestreo-tabla{
  width: 100%;
}

.atlas-muestreo-nota{
  width: 100%;
}

</style>

