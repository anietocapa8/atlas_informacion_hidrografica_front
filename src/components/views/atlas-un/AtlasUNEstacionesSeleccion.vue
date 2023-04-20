<template>
  <div id="atlas-estaciones-seleccion" class="atlas-estaciones-seleccion">
    <h2 id="atlas-estaciones-seleccion-title" class="atlas-estaciones-seleccion-title">
      {{ $t('atlasun.estacionesLabels.seleccion') }}
    </h2>
    <v-select id="atlas-estaciones-seleccion-dropdown" class="atlas-estaciones-seleccion-dropdown"
      v-model="optionEstacion" :options="estaciones"></v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select';
export default {
  name: 'AtlasUNEstacionesSeleccion',
  components: { vSelect },
  data() {
    return {
      optionEstacion: { value: 0, label: 'Opción 0' },
      estaciones: [
        { value: 0, label: 'Opción 0' },
        { value: 1, label: 'Opción 1' },
        { value: 2, label: 'Opción 2' }
      ]
    }
  }
}
</script>

<style scoped>
.atlas-estaciones-seleccion {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-estaciones-seleccion-title {
  width: 30%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-estaciones-seleccion-dropdown {
  width: 60%;
  font-size: 14px;
  height: 100px;
  align-items: center;
}

.atlas-estaciones-seleccion-dropdown .vs__selected-options {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.atlas-estaciones-seleccion-dropdown .vs__dropdown-toggle {
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.atlas-estaciones-seleccion-dropdown .vs__dropdown-menu {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: none;
  margin-top: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
}

.atlas-estaciones-seleccion-dropdown .vs__dropdown-item {
  color: #555;
}

.atlas-estaciones-seleccion-dropdown .vs__dropdown-item--active,
.atlas-estaciones-seleccion-dropdown .vs__dropdown-item--selected {
  background-color: #f0f0f0;
  color: #333;
}

</style>
