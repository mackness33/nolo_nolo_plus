<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section>
        il numero totale di noleggi corrisponde a:
        <span class="fw-bold">${{ totalBookings }}</span>
      </section>
      <section>
        Il numero di noleggi futuri corrisponde a:
        <span class="fw-bold">{{ futureBookings }}</span>
      </section>
      <section>
        Il numero di noleggi passati corrispone a:
        <span class="fw-bold">{{ pastBookings }}</span>
      </section>
      <section>
        Il numero di noleggi restituiti con ritardo corrisponde a:
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
      futureBookings: 0,
      pastBookings: 0,
      lateBookings: 0,
    };
  },

  components: {},

  methods: {},

  async mounted() {
    const res = await axios.get("http://localhost:8000/dash/booking/userStat");
    console.log(res.data);
    // this.totalBookings = res.data.totalBookings;
    // this.futureBookings = res.data.futureBookings;
    // this.pastBookings = res.data.pastBookings;
    // this.lateBookings = res.data.lateBookings;
  },

  props: ["data", "title"],
};
</script>

<style scoped>
.graph {
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

.dataContainer {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>