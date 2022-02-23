<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section class="border rounded">
        Numero totale di noleggi :
        <span class="fw-bold">{{ totalBookings }}</span>
      </section>
      <section class="border rounded">
        Numero di noleggi attivi:
        <span class="fw-bold">{{ activeBookings }}</span>
      </section>
      <section class="border rounded">
        Numero di noleggi futuri:
        <span class="fw-bold">{{ futureBookings }}</span>
      </section>
      <section class="border rounded">
        Numero di noleggi terminati con successo:
        <span class="fw-bold">{{ pastBookings }}</span>
      </section>
      <section class="border rounded">
        Noleggi non restitutiti o non pagati:
        <span class="fw-bold">{{ lateBookings }}</span>
      </section>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "bookingdata",

  data: () => {
    return {
      totalBookings: 0,
      activeBookings: 0,
      futureBookings: 0,
      pastBookings: 0,
      lateBookings: 0,
    };
  },

  components: {},

  methods: {},

  async mounted() {
    const res = await axios.get(
      "http://localhost:8000/dash/booking/bookingStat"
    );
    console.log(res.data);
    this.totalBookings = res.data.totalBookings;
    this.activeBookings = res.data.activeBookings;
    this.futureBookings = res.data.futureBookings;
    this.pastBookings = res.data.pastBookings;
    this.lateBookings = res.data.lateBookings;
  },

  props: ["data", "title"],
};
</script>

<style scoped>
.graph {
  width: 95%;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

.dataContainer {
  display: flex;
  justify-content: space-between;
}

.dataContainer > section {
  border-color: rgba(112, 128, 144, 0.404) !important;
  padding: 0.2rem;
  margin: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

@media only screen and (max-width: 1024px) {
  .dataContainer {
    align-items: center;
    flex-direction: column;
  }
}
</style>