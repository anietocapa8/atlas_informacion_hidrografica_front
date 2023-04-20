<template>
  <div id="atlas-muestreo-orden" class="atlas-muestreo-orden">
    <h2 id="atlas-muestreo-orden-title" class="atlas-muestreo-orden-title">
      {{ $t('atlasun.muestreoLabels.ordenamiento') }}
    </h2>
    <v-select id="atlas-muestreo-orden-dropdown" class="atlas-muestreo-orden-dropdown"
      v-model="ordenamiento" :options="ordenes"></v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select';
export default {
  name: 'AtlasUNMuestreoOrden',
  components: { vSelect },
  data() {
    return {
      ordenamiento: { value: 0, label: 'ASC.' },
      ordenes: [
        { value: 0, label: 'ASC.' },
        { value: 1, label: 'DESC.' }
      ]
    }
  }
}
</script>

<style scoped>
.atlas-muestreo-orden {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-muestreo-orden-title {
  width: 30%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-muestreo-orden-dropdown {
  width: 60%;
  font-size: 14px;
  height: 100px;
  align-items: center;
}

.atlas-muestreo-orden-dropdown .vs__selected-options {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.atlas-muestreo-orden-dropdown .vs__dropdown-toggle {
  border: 1px solid #ccc;
  border-radius: 4px;
  color: red;
}

.atlas-muestreo-orden-dropdown .vs__dropdown-menu {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: none;
  margin-top: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
}

.atlas-muestreo-orden-dropdown .vs__dropdown-item {
  color: #555;
}

.atlas-muestreo-orden-dropdown .vs__dropdown-item--active,
.atlas-muestreo-orden-dropdown .vs__dropdown-item--selected {
  background-color: #f0f0f0;
  color: #333;
}

</style>
