<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">nono</div>
  </div>
</template>


<script>
// import axios from "axios";

export default {
  name: "avgdata",

  data: () => {
    return {
      //   totalIncome: 0,
      //   totalUsers: 0,
      //   activeUsers: 0,
      //   inactiveUsers: 0,
    };
  },

  components: {},

  methods: {},

  // async mounted() {
  //   const res = await axios.get("http://localhost:8000/dash/user/userStat");
  //   this.totalIncome = res.data.totalIncome;
  //   this.totalUsers = res.data.totalUsers;
  //   this.activeUsers = res.data.activeUsers;
  //   this.inactiveUsers = res.data.inactiveUsers;
  // },

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