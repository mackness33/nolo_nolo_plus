<template>
  <div id="customerContainer" class="shadow rounded">
    <h2 class="border-bottom border-2 pt-2">Login</h2>
    <form id="loginForm" @submit="handleLogin">
      <input required class="form-control" placeholder="E-mail" type="text" />
      <input
        required
        class="form-control"
        placeholder="Password"
        type="password"
      />

      <button class="btn btn-primary">Accedi</button>
    </form>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "login",

  data: () => {
    return {
      info: null,
      some: "Titulo belimpu",
    };
  },

  components: {},

  methods: {
    showInfo() {
      console.log(this.info);
    },
    async handleLogin(e) {
      e.preventDefault();
      console.log(e.target.elements[0].value);
    },
  },

  props: [],
};
</script>
}; console.log(res.data)
<style scoped>
#customerContainer {
  margin: 1rem;
  background-color: lightslategray;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 50rem;
}

#customerContainer > h2 {
  margin-bottom: 2rem;
}

#loginForm {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loginForm > * {
  margin-bottom: 0.5rem;
}
</style>