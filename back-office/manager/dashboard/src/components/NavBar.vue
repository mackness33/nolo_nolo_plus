

<template>
  <div id="navContainer">
    <nav class="navbar navbar-dark bg-primary navbar-expand-lg rounded shadow">
      <div class="container-fluid">
        <img src="../assets/logo.png" id="logoId" alt="" />
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" id="0" aria-current="clienti" to="/"
                >Clienti</router-link
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <router-link class="nav-link" id="1" to="/inventory"
                >Inventario</router-link
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <router-link class="nav-link" id="2" to="/booking"
                >Noleggi</router-link
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <router-link class="nav-link" id="2" to="/employee"
                >Dipendenti</router-link
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <a
                class="nav-link"
                href="http://localhost:8000/nnplus/home/inventory"
                >Gestionale</a
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <a class="nav-link" href="http://localhost:8000/front/catalogue"
                >Sito web</a
              >
            </li>

            <li
              v-show="this.$store.state.logged"
              class="nav-item"
              @click="logout"
            >
              <button class="nav-link">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "NavBar",

  components: {},

  // data: () => {
  //   return {
  //   };
  // },

  methods: {
    makeActive(event) {
      this.currentlyActive = event.target.id;
    },
    async logout() {
      try {
        const res = await axios.get("http://localhost:8000/dash/logout");
      } catch (err) {
        this.$store.commit("logout");
        this.$router.replace("/login");
      }
    },
  },

  props: ["modelValue"],

  computed: {
    currentlyActive: {
      get() {},
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style scoped>
#navContainer {
  padding: 0.7rem;
}

#logoId {
  width: 5rem;
  margin-right: 3rem;
}

[v-cloal] {
  display: none;
}
</style>