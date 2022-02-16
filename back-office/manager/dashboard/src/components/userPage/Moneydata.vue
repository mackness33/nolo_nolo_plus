<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section>
        Il fatturato totale attuale corrisponde a:
        <span class="fw-bold">${{ totalIncome }}</span>
      </section>
      <section>
        Il numero di utenti totale corrisponde a
        <span class="fw-bold">{{ totalUsers }}</span>
      </section>
      <section>
        Il numero di utenti attivi corrisponde a
        <span class="fw-bold">{{ activeUsers }}</span>
      </section>
      <section>
        Il numero di utenti inattivi corrisponde a
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