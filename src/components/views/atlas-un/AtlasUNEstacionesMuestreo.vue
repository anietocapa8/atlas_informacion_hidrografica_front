<template>
  <div id="atlas-estaciones-muestreo" class="atlas-estaciones-muestreo">
    <h2 id="atlas-estaciones-muestreo-title" class="atlas-estaciones-muestreo-title">
      {{ $t('atlasun.estacionesLabels.muestreo') }}
    </h2>
    <input type="number" id="atlas-estaciones-muestreo-picker" v-model="frecuenciaMuestreo" class="atlas-estaciones-muestreo-picker" min="0" max="10" step="1">
    <div class="atlas-muestreo-corchete">}</div>
    <p id="atlas-estaciones-muestreo-texto" class="atlas-estaciones-muestreo-texto">{{ $t('atlasun.estacionesTexts.muestreo') }}</p>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNEstacionesMuestreo',
  data() {
    return {
      frecuenciaMuestreo: 0
    }
  }
}
</script>

<style scoped>
.atlas-estaciones-muestreo {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.atlas-estaciones-muestreo-title {
  width: 40%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-estaciones-muestreo-picker {
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.atlas-muestreo-corchete{
  height: 100%;
  background-color: white;
  justify-content: center;
  align-items: center;
  font-size: 5em;
}

.atlas-estaciones-muestreo-texto{
  font-size: 12px;
  color: black;
  padding-top: 1em;
  padding-left: 10px;
}

</style>
