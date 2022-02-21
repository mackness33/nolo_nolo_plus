<template>
  <div class="card emplCard">
    <div class="card-body">
      <div class="card-box">
        <ul class="emplDetails">
          <li>
            <div class="fw-bold">Nome</div>
            <div class="text-capitalize">{{ user.person.name }}</div>
          </li>
          <li>
            <div class="fw-bold">cognome</div>
            <div class="text-capitalize">{{ user.person.surname }}</div>
          </li>
          <li>
            <div class="fw-bold">E-mail</div>
            <div>{{ user.person.mail }}</div>
          </li>
        </ul>
      </div>
      <button class="btn btn-primary">Mostra prenotazioni</button>
      <button v-if="user.person.role == 1" class="btn btn-success">
        Promuovi
      </button>
      <button class="btn btn-danger">Elimina</button>
    </div>
  </div>
</template>


<script>
export default {
  props: ["user"],

  mounted() {
    console.log(this.user);
  },
};
</script>

<style scoped>
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
</style>