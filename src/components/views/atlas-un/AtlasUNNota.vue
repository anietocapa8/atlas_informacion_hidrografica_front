<template>
  <div id="atlas-nota" class="atlas-nota">
    <h2 id="atlas-nota-title" class="atlas-nota-title">
      {{ $t('atlasun.nota') }}
    </h2>
    <div class="atlas-nota-corchete">{</div>
    <p id="atlas-nota-texto" class="atlas-nota-texto">{{ this.nota }}</p>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNNota',
  props: {
    nota: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.atlas-nota {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.atlas-nota-title {
  width: 30%;
  color: black;
  font-size: 16px;
  background-color: white;
  padding-top: 1em;
}

.atlas-nota-corchete{
  height: 100%;
  background-color: white;
  justify-content: center;
  align-items: center;
  font-size: 5em;
}

.atlas-nota-texto{
  font-size: 12px;
  color: black;
  padding-top: 1em;
  padding-left: 5px;
}
</style>
