<template>
  <div class="atlas-un-options">
    <button v-bind:class="{ active: optionAtlas === 1 }" class="atlas-un-option" @click="clickOption(1)">
      {{ this.$i18n.t('atlasun.estaciones') }}</button>
    <button v-bind:class="{ active: optionAtlas === 2 }" class="atlas-un-option" @click="clickOption(2)">
      {{ this.$i18n.t('atlasun.muestreo') }}</button>
    <button v-bind:class="{ active: optionAtlas === 3 }" class="atlas-un-option" @click="clickOption(3)">
      {{ this.$i18n.t('atlasun.historico') }}</button>
    <button v-bind:class="{ active: optionAtlas === 4 }" class="atlas-un-option" @click="clickOption(4)">
      {{ this.$i18n.t('atlasun.dashboard') }}</button>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNOptions',
  data() {
    return {
      optionAtlas: 1
    }
  },
  methods:{
    clickOption(option){
      this.optionAtlas = option
      this.$emit('option-atlas', option)
    }
  }
}
</script>

<style scoped>
.atlas-un-options {
  display: flex;
  justify-content: center;
}

.atlas-un-option {
  height: 30px;
  width: 100px;
  background-color: #ccc;
  border-radius: 10px;
  color: black;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border: 2px solid #000;
}

.atlas-un-option.active {
  background-color: #444;
  color: white;
}
</style>
