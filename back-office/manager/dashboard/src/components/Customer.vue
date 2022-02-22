<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Dashboard utenti</h2>
    <Moneydata title="Statistiche" />
    <div class="graphContainer">
      <Columnchart
        data="http://localhost:8000/dash/user/userAge"
        title="Eta' degli utenti"
      />
      <Piechart
        data="http://localhost:8000/dash/user/userPoint"
        title="Quantita' media di punti per fasce di eta'"
      />
      <Columnchart
        data="http://localhost:8000/dash/user/userAgeSpend"
        title="Spesa media degli utenti per eta'"
      />
      <Piechart
        data="http://localhost:8000/dash/user/userFeed"
        title="Numero feedback dipendenti per fascia di eta' di clienti"
      />
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Piechart from "./userPage/Piechart.vue";
import Linechart from "./userPage/Linechart.vue";
import Columnchart from "./userPage/Columnchart.vue";
import Moneydata from "./userPage/Moneydata.vue";

export default {
  name: "customerContainer",

  data: () => {
    return {
      info: null,
      some: "Titulo belimpu",
    };
  },

  components: {
    Piechart,
    Linechart,
    Columnchart,
    Moneydata,
  },

  methods: {
    showInfo() {
      console.log(this.info);
    },
  },

  props: [],
};
</script>
}; console.log(res.data)
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