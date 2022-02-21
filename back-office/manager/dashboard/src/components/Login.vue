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
    <div
      v-if="showError"
      class="animate__animated animate__bounceIn"
      id="errMsg"
    >
      Login fallito
    </div>
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
      showError: false,
    };
  },

  props: [],

  components: {},

  methods: {
    showInfo() {
      console.log(this.info);
    },
    async handleLogin(e) {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:8000/dash/login", {
          mail: e.target.elements[0].value,
          password: e.target.elements[1].value,
        });
        console.log("RIUSCITO");
        console.log(res);
        this.showError = false;
        this.$store.commit("login");
        await this.setUser();
        this.$router.replace("/");
      } catch (err) {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
        console.log(err);
      }
    },

    async setUser() {
      const res = await axios.get("http://localhost:8000/dash/empl/whoAmI");
      if (res.data.success) {
        this.$store.commit("setUser", res.data.payload._id);
      } else {
        this.$store.commit("setUser", 0);
      }
    },
  },

  mounted() {
    this.$store.commit("logout");
  },
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

#errMsg {
  color: red;
  font-weight: 600;
  font-size: 2rem;
}
</style>