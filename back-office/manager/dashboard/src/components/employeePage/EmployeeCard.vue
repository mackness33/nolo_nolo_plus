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
      <div class="buttonGroup">
        <button @click="showBookings" class="btn btn-primary">
          Mostra prenotazioni
        </button>
        <button
          v-if="user.person.role == 1"
          @click="promote"
          class="btn btn-success"
        >
          Promuovi
        </button>
        <button
          v-if="!(user._id == this.$store.state.userId)"
          @click="deleteThis"
          class="btn btn-danger"
        >
          Elimina
        </button>
        <button
          class="btn btn-primary"
          data-bs-toggle="collapse"
          :data-bs-target="'#' + user.person.mail.replace('@', '')"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Mostra Statistiche
        </button>
      </div>
      <div
        class="collapse statContainer"
        :id="user.person.mail.replace('@', '')"
      >
        <div class="card card-body emplStat">
          <section class="border-bottom">
            <span class="fw-bold"> Numero di prenotazioni: </span>
            <span>{{ totalNum }}</span>
          </section>

          <section class="border-bottom">
            <span class="fw-bold"> Fatturato totale: </span>
            <span>{{ totalPrice }}$</span>
          </section>

          <section class="border-bottom">
            <span class="fw-bold"> Fatturato medio: </span>
            <span>{{ avgPrice }}$</span>
          </section>

          <section class="border-bottom">
            <span class="fw-bold"> Massima fattura: </span>
            <span>{{ maximumPrice }}$</span>
          </section>

          <section class="border-bottom">
            <span class="fw-bold"> Minima fattura: </span>
            <span>{{ minimumPrice }}$</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data: () => {
    return {
      totalNum: 0,
      totalPrice: 0,
      avgPrice: 0,
      maximumPrice: 0,
      minimumPrice: 0,
    };
  },

  props: ["user", "updateList"],

  methods: {
    async deleteThis() {
      const res = await axios.post(
        "http://localhost:8000/dash/empl/deleteOne",
        { mail: this.user.person.mail }
      );
      alert(res.data.message);
      this.updateList();
    },

    async promote() {
      const res = await axios.post("http://localhost:8000/dash/empl/promote", {
        mail: this.user.person.mail,
      });
      if (res.data.success) {
        alert(
          `${this.user.person.name} ${this.user.person.surname} promosso con successo!`
        );
        this.updateList();
      } else {
        alert("Promozioe fallita");
        console.log(res.data.error);
      }
    },

    showBookings() {
      sessionStorage.setItem("emplId", this.user._id);
      console.log(sessionStorage);
      window.location.href = "http://localhost:8000/nnplus/home/booking";
    },
  },

  async mounted() {
    const res = await axios.get("http://localhost:8000/dash/empl/getStats", {
      params: { id: this.user._id },
    });
    if (res.data.success && res.data.payload.length > 0) {
      const data = res.data.payload[0];
      this.totalNum = data.totalNum;
      this.totalPrice = data.totalPrice.toFixed(2);
      this.avgPrice = data.avgPrice.toFixed(2);
      this.maximumPrice = data.maximumPrice.toFixed(2);
      this.minimumPrice = data.minimumPrice.toFixed(2);
    }
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

.buttonGroup > button {
  margin: 0.2rem;
}

.emplStat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.emplStat > section {
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

@media only screen and (max-width: 768px) {
  .emplDetails {
    flex-direction: column;
  }

  .buttonGroup {
    display: flex;
    flex-direction: column;
  }

  .emplStat > section {
    width: 100%;
  }
}
</style>