<template>
  <div id="atlas-dashboard" class="atlas-dashboard">
    <h1 id="atlas-dashboard-title" class="atlas-dashboard-title">{{ $t('atlasun.dashboardLabels.title') }}</h1>
    <AtlasUNDashboardFechas id="atlas-dashboard-fechas" class="atlas-dashboard-fechas"></AtlasUNDashboardFechas>
    <AtlasUNDashboardAnalisis id="atlas-dashboard-analisis" class="atlas-dashboard-analisis"></AtlasUNDashboardAnalisis>
    <AtlasUNDashboardExportar id="atlas-dashboard-exportar" class="atlas-dashboard-exportar"></AtlasUNDashboardExportar>
    <AtlasUNNota :nota="$t('atlasun.dashboardTexts.nota')" id="atlas-dashboard-nota" class="atlas-dashboard-nota"></AtlasUNNota>
  </div>
</template>

<script>
import AtlasUNDashboardFechas from './AtlasUNDashboardFechas.vue';
import AtlasUNDashboardAnalisis from './AtlasUNDashboardAnalisis.vue';
import AtlasUNDashboardExportar from './AtlasUNDashboardExportar.vue';
import AtlasUNNota from './AtlasUNNota.vue';
export default {
  name: 'AtlasUNDashboard',
  components: { AtlasUNDashboardFechas, AtlasUNDashboardAnalisis, AtlasUNDashboardExportar, AtlasUNNota }
}
</script>

<style scoped>
.atlas-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.atlas-dashboard-title {
  width: 100%;
  background-color: white;
  color: black;
  font-size: 18px;
}

.atlas-dashboard-fechas{
  width: 100%;
}

.atlas-dashboard-analisis{
  width: 100%;
}
.atlas-dashboard-exportar{
  width: 100%;
}

.atlas-dashboard-nota{
  width: 100%;
}

</style>

