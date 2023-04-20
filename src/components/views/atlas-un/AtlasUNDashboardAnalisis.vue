<template>
  <div id="atlas-dashboard-analisis" class="atlas-dashboard-analisis">
    <h2 id="atlas-dashboard-analisis-title" class="atlas-dashboard-analisis-title">
      {{ $t('atlasun.dashboardLabels.analisis') }}
    </h2>
    <v-select id="atlas-dashboard-analisis-dropdown" class="atlas-dashboard-analisis-dropdown"
      v-model="analisis" :options="tiposAnalisis"></v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select';
export default {
  name: 'AtlasUNDashboardAnalisis',
  components: { vSelect },
  data() {
    return {
      analisis: { value: 0, label: 'Máximos' },
      tiposAnalisis: [
        { value: 0, label: 'Máximos' },
        { value: 1, label: 'Mínimos' },
        { value: 2, label: 'Promedios' }
      ]
    }
  }
}
</script>

<style scoped>
.atlas-dashboard-analisis {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-dashboard-analisis-title {
  width: 30%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-dashboard-analisis-dropdown {
  width: 60%;
  font-size: 14px;
  height: 100px;
  align-items: center;
}

.atlas-dashboard-analisis-dropdown .vs__selected-options {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.atlas-dashboard-analisis-dropdown .vs__dropdown-toggle {
  border: 1px solid #ccc;
  border-radius: 4px;
  color: red;
}

.atlas-dashboard-analisis-dropdown .vs__dropdown-menu {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: none;
  margin-top: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
}

.atlas-dashboard-analisis-dropdown .vs__dropdown-item {
  color: #555;
}

.atlas-dashboard-analisis-dropdown .vs__dropdown-item--active,
.atlas-dashboard-analisis-dropdown .vs__dropdown-item--selected {
  background-color: #f0f0f0;
  color: #333;
}

</style>
