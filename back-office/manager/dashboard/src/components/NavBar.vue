

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
            <li class="nav-item" @click="makeActive">
              <a
                class="nav-link active"
                id="customer"
                aria-current="clienti"
                href="#"
                >Clienti</a
              >
            </li>
            <li class="nav-item" @click="makeActive">
              <a class="nav-link" href="#">Inventario</a>
            </li>
            <li class="nav-item" @click="makeActive">
              <a class="nav-link" href="#">Noleggi</a>
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
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>


<script>
export default {
  name: "NavBar",

  components: {},

  data: () => {
    return {};
  },

  methods: {
    makeActive(event) {
      document.querySelectorAll("li > a").forEach((el) => {
        el.classList.remove("active");
      });
      event.target.classList.add("active");
    },
  },

  props: [],
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