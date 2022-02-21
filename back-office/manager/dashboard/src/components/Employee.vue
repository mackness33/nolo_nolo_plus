<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Gestione Dipendenti</h2>
    <div id="topBar">
      <form @submit="searchSubmit" id="searchForm">
        <input
          required
          v-model="searchMail"
          aria-label="Inserisci mail dipendente"
          placeholder="Inserisci mail dipendente"
          class="form-control"
          type="text"
          id="searchInput"
        />
        <button class="btn btn-primary">Cerca</button>
      </form>
      <div class="d-flex align-items-center">
        <button @click="updateList" class="btn btn-warning m-1" id="resetBtn">
          Reset
        </button>
        <button
          id="addModalToggle"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          Aggiungi Dipendente
        </button>
      </div>
    </div>
    <div id="employeeList">
      <EmployeeCard
        v-for="user in data"
        :user="user"
        :updateList="updateList"
        :key="user._id"
      />
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
            <form id="addForm" class="w-75" @submit="addUserSubmit">
              <div>
                <span class="fw-bold">Nome:</span>
                <input
                  v-model="addUser.person.name"
                  required
                  type="text"
                  class="form-control"
                  id="addName"
                />
              </div>

              <div>
                <span class="fw-bold">Cognome:</span>
                <input
                  v-model="addUser.person.surname"
                  required
                  type="text"
                  class="form-control"
                  id="addSurname"
                />
              </div>

              <div>
                <span class="fw-bold">E-mail:</span>
                <input
                  v-model="addUser.person.mail"
                  required
                  type="email"
                  class="form-control"
                  id="addMail"
                />
              </div>

              <div>
                <span class="fw-bold">Password:</span>
                <input
                  v-model="addUser.person.password"
                  required
                  type="password"
                  class="form-control"
                  id="AddPassword"
                />
              </div>

              <div>
                <span class="fw-bold">Ruolo:</span>
                <select
                  v-model="addUser.person.role"
                  required
                  class="form-select"
                  id="addSelect"
                >
                  <option value="0">Manager</option>
                  <option value="1">Dipendente</option>
                </select>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <p
              class="animate__animated animate__bounceIn"
              v-if="alert"
              :style="alertStyle"
            >
              {{ alertMsg }}
            </p>
            <button
              style="color: white"
              class="btn btn-primary"
              type="submit"
              form="addForm"
            >
              Aggiungi
            </button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Chiudi
            </button>
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
      searchMail: "",
      data: [],
      addUser: {
        person: {
          name: "",
          surname: "",
          mail: "",
          password: "",
          role: 1,
          picture: "",
        },
      },
      alert: false,

      alertMsg: "dioCane",
      alertStyle: {
        color: "red",
      },
    };
  },

  methods: {
    async updateList() {
      const res = await axios.get("http://localhost:8000/dash/empl/getAll");
      this.data = res.data;
    },

    async addUserSubmit(e) {
      e.preventDefault();
      e.target.reset();
      const res = await axios.post(
        "http://localhost:8000/dash/empl/addOne",
        this.addUser
      );
      console.log(res.data);
      this.resetAddUser();
      this.alertMsg = res.data.message;
      this.alertStyle.color = res.data.success ? "green" : "red";
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 3000);
      await this.updateList();
    },

    resetAddUser() {
      this.addUser.person.name = "";
      this.addUser.person.surname = "";
      this.addUser.person.mail = "";
      this.addUser.person.password = "";
      this.addUser.person.role = 1;
    },

    async searchSubmit(e) {
      e.preventDefault();
      const res = await axios.get("http://localhost:8000/dash/empl/getOne", {
        params: { mail: this.searchMail },
      });

      if (res.data.success && res.data.payload.length > 0) {
        this.data = res.data.payload;
      } else {
        alert("Errore durante la ricerca o nessun utente trovato");
      }
    },
  },

  async mounted() {
    await this.updateList();
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

#addForm > div {
  margin-bottom: 1rem;
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