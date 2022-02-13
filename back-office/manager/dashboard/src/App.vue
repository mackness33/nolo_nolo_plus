<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
  <div class="general">
    <!-- navbar -->
    <nav class="navbar navbar-expand-md navbar-dark br-primary d-flex align-items-center">

      <!-- navbar content -->
      <div class="container-fluid" id="nav-container">

      <a class="navbar-brand d-flex align-items-center" href="#" aria-hidden="true" tabindex="-1">
        <!-- navbar logo -->
          <img src="@/assets/logo.png" class="logo">
        </a>

        <!-- navbar toggle -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navElements"
        aria-controls="navElements" aria-expanded="false" aria-label="Mostra e nascondi navigazione">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- navbar navigation -->
      <div class="collapse navbar-collapse" id="navElements">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="nav-list">
          <li class="nav-item">
            <a class="link active-nav" href="/nnplus/home" aria-label="Pagina Clienti" aria-current="page">Clienti</a>
          </li>
          <li class="nav-item">
            <a class="link" href="/nnplus/home/inventory" aria-label="Pagina Inventario">Inventario</a>
          </li>
          <li class="nav-item">
            <a class="link" href="/nnplus/home/booking" aria-label="Pagina Gestione">Noleggi</a>
          </li>
          <li class="nav-item">
            <a class="link" href="/nnplus/dashboard/" aria-label="Pagina Gestione">Dashboards</a>
          </li>
          <li class="nav-item">
            <a class="link" href="/nnplus/logout" aria-label="Effettua il log out">Log Out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>



  <!-- main content -->
  <main>

    <!-- add and search customer -->
    <div class="container-fluid" id="main-container">
      <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />

        <div class="wrapper">
          <HelloWorld msg="You did it!" />

          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </header>

      <RouterView />
    </div>
  </main>
  </div>
</template>

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
