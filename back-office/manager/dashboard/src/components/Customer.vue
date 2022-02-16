<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Dashboard utenti</h2>
    <div class="graphContainer">
      <Piechart :data="info" title="computer disponibili" />
      <Linechart :data="info" title="linea non so" />
      <Columnchart :data="info" title="Eta' degli utenti" />
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
  },

  methods: {
    showInfo() {
      console.log(this.info);
    },
  },

  props: [],

  mounted() {
    axios
      .get("http://localhost:8000/dash/user/userAge")
      .then((res) => (this.info = res.data));
  },
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