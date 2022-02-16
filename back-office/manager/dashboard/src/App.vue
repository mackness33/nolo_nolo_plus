<template>
  <div v-cloak id="globalContainer">
    <NavBar />
    <CustomerContainer />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import HelloWorld from "./components/HelloWorld.vue";
import CustomerContainer from "./components/Customer.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
    NavBar,
    CustomerContainer,
  },

  data: () => {
    return {
      isVisible: false,
    };
  },

  methods: {
    toggleBox() {
      this.isVisible = !this.isVisible;
    },
  },

  updated() {
    console.log("updated");
  },
};
</script>

<style>
/* @import '@/assets/nav.css'; */
/* @import '@/assets/users.css'; */

/* .general {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#app {
  margin: 0 auto;
  background-color: hsla(160, 100%, 37%, 0.2);
  font-weight: normal;
}

.logo {
  display: block;
}


.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (max-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: flex;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
} */
</style>

<style>
#globalContainer {
  background-color: dimgray;
}
</style>
