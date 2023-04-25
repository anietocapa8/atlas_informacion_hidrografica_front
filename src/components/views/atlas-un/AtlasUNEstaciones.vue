<template>
  <div id="atlas-estaciones" class="atlas-estaciones">
    <h1 id="atlas-estaciones-title" class="atlas-estaciones-title">{{ $t('atlasun.estacionesLabels.title') }}</h1>
    <AtlasUNEstacionesSeleccion id="atlas-estaciones-seleccion" class="atlas-estaciones-seleccion"></AtlasUNEstacionesSeleccion>
    <AtlasUNEstacionesElementos id="atlas-estaciones-elementos" class="atlas-estaciones-elementos"></AtlasUNEstacionesElementos>
    <AtlasUNEstacionesMuestreo id="atlas-estaciones-muestreo" class="atlas-estaciones-muestreo"></AtlasUNEstacionesMuestreo>
    <AtlasUNNota :nota="$t('atlasun.estacionesTexts.nota')" id="atlas-estaciones-nota" class="atlas-estaciones-nota"></AtlasUNNota>
  </div>
</template>

<script>
import AtlasUNEstacionesSeleccion from './AtlasUNEstacionesSeleccion.vue';
import AtlasUNEstacionesElementos from './AtlasUNEstacionesElementos.vue';
import AtlasUNEstacionesMuestreo from './AtlasUNEstacionesMuestreo.vue';
import AtlasUNNota from './AtlasUNNota.vue';
export default {
  name: 'AtlasUNEstaciones',
  components: { AtlasUNEstacionesSeleccion, AtlasUNEstacionesElementos, AtlasUNEstacionesMuestreo, AtlasUNNota }
}
</script>

<style scoped>
.atlas-estaciones {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.atlas-estaciones-title {
  width: 100%;
  background-color: white;
  color: black;
  font-size: 18px;
}

.atlas-estaciones-seleccion {
  width: 100%;
}

.atlas-estaciones-elementos {
  width: 100%;
}
.atlas-estaciones-muestreo {
  width: 100%;
}

.atlas-estaciones-nota{
  width: 100%;
}

</style>
