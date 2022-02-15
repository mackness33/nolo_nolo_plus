<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 mb-2">Dashboard utenti</h2>
    <div class="graphContainer">
      <Barchart :data="info" title="computer disponibili" />
      <div>
        <line-chart :data="{ '2017-05-13': 2, '2017-05-14': 5 }"></line-chart>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Barchart from "./Barchart.vue";

export default {
  name: "customerContainer",

  data: () => {
    return {
      info: null,
      some: "Titulo belimpu",
    };
  },

  components: {
    Barchart,
  },

  methods: {
    showInfo() {
      console.log(this.info);
    },
  },

  props: [],

  mounted() {
    axios
      .get("http://localhost:8000/dash/user/userData")
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