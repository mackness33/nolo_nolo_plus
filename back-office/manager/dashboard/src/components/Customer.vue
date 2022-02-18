<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Dashboard utenti</h2>
    <div class="stats">
      <Moneydata title="Statistiche" />
      <Avgdata title="Medie" />
    </div>
    <div class="graphContainer">
      <Columnchart
        data="http://localhost:8000/dash/user/userAge"
        title="Eta' degli utenti"
      />
      <Columnchart
        data="http://localhost:8000/dash/user/userAgeSpend"
        title="Spesa degli utenti per eta'"
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
import AvgData from "./userPage/Avgdata.vue";

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
    AvgData,
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