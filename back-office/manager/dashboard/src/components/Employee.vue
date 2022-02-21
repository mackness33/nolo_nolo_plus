<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Gestione Dipendenti</h2>
    <div id="topBar">
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
      <button
        id="addModalToggle"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addModal"
      >
        Aggiungi dipendete
      </button>
    </div>
    <div id="employeeList">
      <EmployeeCard v-for="user in data" :user="user" :key="user._id" />
    </div>

    <!-- add modal -->

    <div class="modal fade" id="addModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addModalTitle">Aggiungi Dipendente</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Chiudi modale"
            ></button>
          </div>
          <div class="modal-body">
            <form id="addForm">
              <div>
                <span>Nome:</span>
                <input type="text" class="form-control" id="addName" />
              </div>

              <div>
                <span>Cognome:</span>
                <input type="text" class="form-control" id="addSurname" />
              </div>

              <div>
                <span>E-mail:</span>
                <input type="text" class="form-control" id="addMail" />
              </div>

              <div>
                <span>Password:</span>
                <input type="password" class="form-control" id="AddPassword" />
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
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

#topBar {
  width: 95%;
  display: flex;
  margin-top: 2rem;
}

#topBar > * {
  max-width: 20rem;
  margin: 0.5rem;
}

#searchForm {
  display: flex;
}

#searchForm > * {
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

  #topBar {
    align-items: center;

    flex-direction: column;
  }
}
</style>