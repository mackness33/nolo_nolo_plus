<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Gestione Dipendenti</h2>
    <form id="searchForm">
      <input
        aria-label="Inserisci la mail del dipendente"
        placeholder="Inserisci la mail del dipendente"
        class="form-control"
        type="text"
        id="searchInput"
      />
      <button class="btn btn-primary">Cerca</button>
    </form>
    <div id="employeeList">
      <EmployeeCard v-for="user in data" :user="user" :key="user._id" />
    </div>
  </div>
</template>


<script>
import EmployeeCard from "./employeePage/EmployeeCard.vue";
import axios from "axios";

export default {
  name: "employee",
  components: {
    EmployeeCard,
  },
  data: () => {
    return {
      data: [],
    };
  },

  methods: {
    async getEmpls() {},
  },

  async mounted() {
    const res = await axios.get("http://localhost:8000/dash/empl/getAll");
    this.data = res.data;
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

#searchForm {
  width: 95%;
  display: flex;
  margin-top: 2rem;
}

#searchForm > * {
  max-width: 20rem;
  margin: 0.5rem;
}

#employeeList {
  width: 90%;
  margin-top: 1.5rem;
}

.emplCard {
  margin-bottom: 0.5rem;
}

.emplDetails {
  list-style: none;
  padding-left: 0 !important;
  display: flex;
}

.emplDetails > li {
  margin-right: 8rem;
}

@media only screen and (max-width: 1024px) {
  #searchForm {
    align-items: center;
    flex-direction: column;
  }
}
</style>