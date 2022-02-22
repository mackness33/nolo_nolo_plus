<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Dashboard noleggi</h2>
    <bookingdata title="Statistiche" />
    <div class="graphContainer">
      <linechart
        data="http://localhost:8000/dash/booking/bookingPerMonth"
        title="guadagni nell'ultimo anno"
      />
      <Piechart
        data="http://localhost:8000/dash/booking/mostBookedMonths"
        title="distribuzione dei noleggi nei mesi"
      />
      <columnchart
        data="http://localhost:8000/dash/booking/bookingStatus"
        title="Situazione delle prenotazioni"
      />
      <!-- <scatterchart
        data="http://localhost:8000/dash/booking/booksDistr"
        title="Distribuzione delle prenotazioni"
      /> -->
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Piechart from "./userPage/Piechart.vue";
import Linechart from "./userPage/Linechart.vue";
import Columnchart from "./userPage/Columnchart.vue";
import Scatterchart from "./userPage/Scatterchart.vue";
import Moneydata from "./userPage/Moneydata.vue";
import Bookingdata from "./bookingPage/Bookingdata.vue";

export default {
  name: "bookingContainer",

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
    Bookingdata,
    Scatterchart,
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