<template>
  <div id="atlas-dashboard-fechas" class="atlas-dashboard-fechas">
    <div id="atlas-dashboard-fecha-inicio" class="atlas-dashboard-fecha-inicio">
      <h2 id="atlas-dashboard-fecha-inicio-title" class="atlas-dashboard-fecha-inicio-title">
        {{ $t('atlasun.dashboardLabels.fechaInicio') }}
      </h2>
      <date-picker id="atlas-dashboard-inicio-picker" class="atlas-dashboard-inicio-picker" v-model="fechaInicio"></date-picker>
    </div>
    <div id="atlas-dashboard-fecha-fin" class="atlas-dashboard-fecha-fin">
      <h2 id="atlas-dashboard-fecha-fin-title" class="atlas-dashboard-fecha-fin-title">
        {{ $t('atlasun.dashboardLabels.fechaFin') }}
      </h2>
      <date-picker id="atlas-dashboard-fin-picker" class="atlas-dashboard-fin-picker" v-model="fechaFin"></date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
export default {
  name: 'AtlasUNDashboardFechas',
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
.atlas-dashboard-fechas {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-dashboard-fecha-inicio{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-dashboard-fecha-inicio-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-dashboard-inicio-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.atlas-dashboard-fecha-fin{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
}

.atlas-dashboard-fecha-fin-title {
  width: 20%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-dashboard-fin-picker {
  width: 20%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

</style>

