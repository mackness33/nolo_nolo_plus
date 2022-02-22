<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section class="border rounded">
        Computer presenti nel sistema:
        <span class="fw-bold">{{ this.data.totalNumber }}</span>
      </section>
      <section class="border rounded">
        Computer attualmente in prestito:
        <span class="fw-bold">{{ this.data.computerCurrentlyInUse }}</span>
      </section>
      <section class="border rounded">
        Computer funzionanti:
        <span class="fw-bold">{{
          this.data.totalNumber - this.data.computerCurrentlyUnavailableCount
        }}</span>
      </section>
      <section class="border rounded">
        Computer in riparazione:
        <span class="fw-bold">{{
          this.data.computerCurrentlyUnavailableCount
        }}</span>
      </section>
      <section class="border rounded">
        Computer con fatturato maggiore: <br />
        <span class="fw-bold d-flex justify-content-center text-uppercase"
          >{{ this.data.maxComputer.brand }}
          {{ this.data.maxComputer.model }}</span
        >
      </section>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "inventorydata",

  data: () => {
    return {
      data: {
        totalNumber: 0,
        computerCurrentlyInUse: 0,
        computerCurrentlyUnavailableCount: 0,
        maxComputer: {
          brand: "",
          model: "",
        },
      },
    };
  },

  components: {},

  methods: {},

  async mounted() {
    const res = await axios.get("http://localhost:8000/dash/inv/invStat");
    this.data = res.data;
  },

  update() {
    console.log(this.icon);
  },

  props: ["data", "title"],
};
</script>

<style scoped>
.graph {
  width: 95%;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

.dataContainer {
  display: flex;
  justify-content: space-between;
}

.dataContainer > section {
  border-color: rgba(112, 128, 144, 0.404) !important;
  padding: 0.2rem;
  margin: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

#buttonGroup {
  margin-bottom: 1rem;
}

#buttonGroup > button {
  justify-content: space-between;
}

@media only screen and (max-width: 1024px) {
  .dataContainer {
    align-items: center;
    flex-direction: column;
  }
}
</style>