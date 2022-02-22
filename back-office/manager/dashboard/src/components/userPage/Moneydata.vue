<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section class="border rounded">
        <span>Il fatturato totale attuale corrisponde a:</span>
        <span class="fw-bold">${{ totalIncome }}</span>
      </section>
      <section class="border rounded">
        <span>Il numero di utenti totale corrisponde a</span>
        <span class="fw-bold">{{ totalUsers }}</span>
      </section>
      <section class="border rounded">
        <span>Il numero di utenti attivi corrisponde a</span>
        <span class="fw-bold">{{ activeUsers }}</span>
      </section>
      <section class="border rounded">
        <span>Il numero di utenti inattivi corrisponde a</span>
        <span class="fw-bold">{{ inactiveUsers }}</span>
      </section>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "moneydata",

  data: () => {
    return {
      totalIncome: 0,
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
    };
  },

  components: {},

  methods: {},

  async mounted() {
    const res = await axios.get("http://localhost:8000/dash/user/userStat");
    this.totalIncome = res.data.totalIncome;
    this.totalUsers = res.data.totalUsers;
    this.activeUsers = res.data.activeUsers;
    this.inactiveUsers = res.data.inactiveUsers;
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