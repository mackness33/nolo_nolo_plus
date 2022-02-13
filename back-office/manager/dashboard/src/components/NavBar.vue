<template>
  <v-layout>
    <v-app-bar
      absolute
      color="indigo darken-2"
      dark
      shrink-on-scroll
      prominent
      scroll-target="#scrolling-techniques"
    >

    <img src="@/assets/logo.png" class="logo">
      <div class="d-flex justify-space-around align-center flex-column flex-md-row fill-height">
        <NavButton text='Clienti'/>
        <NavButton text='Inventario'/>
        <NavButton text='Noleggi'/>
        <NavButton text='Dashboard'/>
        <NavButton text='Dipendenti'/>

      </div>
      <v-spacer></v-spacer>

      <NavButton text='Log out' />

    </v-app-bar>
  </v-layout>
</template>


<script>
  import NavButton from './NavButton.vue'

  export default {
    name: 'NavBar',

    components: {
      NavButton,
    },

    data: () => ({
      //
    }),
  }
</script>
