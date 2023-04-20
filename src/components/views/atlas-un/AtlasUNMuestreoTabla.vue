<template>
  <table id="atlas-muestreo-tabla" class="atlas-muestreo-tabla">
    <thead>
      <tr>
        <th>Dato A</th>
        <th>Dato B</th>
        <th>Dato C</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(dato, index) in datosMuestreo" :key="index">
        <td>{{ dato.datoA }}</td>
        <td>{{ dato.datoB }}</td>
        <td>{{ dato.datoC }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'AtlasUNMuestreoTabla',
  data() {
    return {
      datosMuestreo: [
        { datoA: "AA", datoB: "XYZ", datoC: 10 },
        { datoA: "BB", datoB: "XYZ", datoC: 10 },
        { datoA: "CC", datoB: "IJK", datoC: 50 },
      ]
    }
  }
}
</script>

<style>
.atlas-muestreo-tabla {
  width: 100%;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: center;
}

th {
  background-color: #333;
  color: #fff;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}
</style>
