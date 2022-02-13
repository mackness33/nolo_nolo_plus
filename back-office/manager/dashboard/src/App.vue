<template>
  <v-app>
    <v-main>
    <v-header>
      <NavBar/>
    </v-header>
      <v-container>
        <div class="container-fluid" id="main-container">

        <HelloWorld/>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
    NavBar,
  },

  data: () => ({
    //
  }),
}
</script>

<style>
@import '@/assets/nav.css';
@import '@/assets/users.css';

.general {
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

a,
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
}
</style>
