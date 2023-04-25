<template>
  <div id="atlas-estaciones-elementos" class="atlas-estaciones-elementos">
    <h2 id="atlas-estaciones-elementos-title" class="atlas-estaciones-elementos-title">
      {{ $t('atlasun.estacionesLabels.elementos') }}
    </h2>
    <div id="atlas-estaciones-elementos-list-div" class="atlas-estaciones-elementos-list-div">
      <ul id="atlas-estaciones-elementos-list" class="atlas-estaciones-elementos-list">
        <li id="atlas-estaciones-elemento" class="atlas-estaciones-elemento" v-for="(elemento, index) in elementos"
          :key="index">{{ elemento }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AtlasUNEstacionesElementos',
  data() {
    return {
      elementos: ["Elemento 1", "Elemento 2", "Elemento 3"]
    }
  }
}
</script>

<style scoped>
.atlas-estaciones-elementos {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
}

.atlas-estaciones-elementos-title {
  width: 40%;
  color: black;
  font-size: 14px;
  background-color: white;
}

.atlas-estaciones-elementos-list-div {
  width: 50%;
  font-size: 14px;
  align-items: center;
}

.atlas-estaciones-elementos {
  list-style-type: circle;
}

.atlas-estaciones-elemento {
  color: black;
  font-size: 14px;
}
</style>
