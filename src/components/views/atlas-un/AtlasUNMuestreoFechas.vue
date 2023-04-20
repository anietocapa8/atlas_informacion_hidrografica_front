<template>
  <div id="atlas-muestreo-fechas" class="atlas-muestreo-fechas">
    <div id="atlas-muestreo-fecha-inicio" class="atlas-muestreo-fecha-inicio">
      <h2 id="atlas-muestreo-fecha-inicio-title" class="atlas-muestreo-fecha-inicio-title">
        {{ $t('atlasun.muestreoLabels.fechaInicio') }}
      </h2>
      <date-picker id="atlas-muestreo-inicio-picker" class="atlas-muestreo-inicio-picker" v-model="fechaInicio"></date-picker>
    </div>
    <div id="atlas-muestreo-fecha-fin" class="atlas-muestreo-fecha-fin">
      <h2 id="atlas-muestreo-fecha-fin-title" class="atlas-muestreo-fecha-fin-title">
        {{ $t('atlasun.muestreoLabels.fechaFin') }}
      </h2>
      <date-picker id="atlas-muestreo-fin-picker" class="atlas-muestreo-fin-picker" v-model="fechaFin"></date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
export default {
  name: 'AtlasUNMuestreoFechas',
  components:{ DatePicker },
  data() {
    return {
      fechaInicio: null,
      fechaFin: null
    }
  }
}
</script>

<style scoped>
.atlas-muestreo-fechas {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-muestreo-fecha-inicio{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-muestreo-fecha-inicio-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-muestreo-inicio-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.atlas-muestreo-fecha-fin{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-muestreo-fecha-fin-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-muestreo-fin-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

</style>

