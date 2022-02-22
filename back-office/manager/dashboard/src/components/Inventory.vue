<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Dashboard inventario</h2>
    <Invdata title="Statistiche" />
    <div class="graphContainer">
      <Piechart
        data="http://localhost:8000/dash/inv/brandProfit"
        title="Fatturato per marca"
      />
      <Columnchart
        data="http://localhost:8000/dash/inv/computerMostUsed"
        title="Numero di prenotazioni per computer"
      />
      <Columnchart
        data="http://localhost:8000/dash/inv/maxPricePerComputer"
        title="Fatturato per computer"
      />
      <Piechart
        data="http://localhost:8000/dash/inv/componentNumbers"
        title="Numero di componenti per categoria"
      />
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Piechart from "./userPage/Piechart.vue";
import Linechart from "./userPage/Linechart.vue";
import Columnchart from "./userPage/Columnchart.vue";
import Invdata from "./inventoryPage/Invdata.vue";

export default {
  name: "inventoryContainer",

  data: () => {
    return {
      info: null,
    };
  },

  components: {
    Piechart,
    Linechart,
    Columnchart,
    Invdata,
  },

  methods: {
    showInfo() {
      console.log(this.info);
    },
  },

  props: [],
};
</script>

<style scoped>
#customerContainer {
  margin: 1rem;
  background-color: lightslategray;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.graphContainer {
  margin-top: 1rem;
  display: flex;
  flex-flow: wrap;
  flex-direction: row;
  justify-content: center;
}
</style>