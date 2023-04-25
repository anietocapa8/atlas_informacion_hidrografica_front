<template>
  <div id="atlas-historico-fechas" class="atlas-historico-fechas">
    <div id="atlas-historico-fecha-inicio" class="atlas-historico-fecha-inicio">
      <h2 id="atlas-historico-fecha-inicio-title" class="atlas-historico-fecha-inicio-title">
        {{ $t('atlasun.historicoLabels.fechaInicio') }}
      </h2>
      <date-picker id="atlas-historico-inicio-picker" class="atlas-historico-inicio-picker" v-model="fechaInicio"></date-picker>
    </div>
    <div id="atlas-historico-fecha-fin" class="atlas-historico-fecha-fin">
      <h2 id="atlas-historico-fecha-fin-title" class="atlas-historico-fecha-fin-title">
        {{ $t('atlasun.historicoLabels.fechaFin') }}
      </h2>
      <date-picker id="atlas-historico-fin-picker" class="atlas-historico-fin-picker" v-model="fechaFin"></date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
export default {
  name: 'AtlasUNHistoricoFechas',
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
.atlas-historico-fechas {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-historico-fecha-inicio{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-historico-fecha-inicio-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-historico-inicio-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.atlas-historico-fecha-fin{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-historico-fecha-fin-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-historico-fin-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

</style>

