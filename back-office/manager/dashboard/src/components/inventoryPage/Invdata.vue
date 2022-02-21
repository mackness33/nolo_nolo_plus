<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <div class="dataContainer">
      <section>
        Computer presenti nel sistema:
        <span class="fw-bold">{{ this.data.totalNumber }}</span>
      </section>
      <section>
        Computer attualmente in prestito:
        <span class="fw-bold">{{ this.data.computerCurrentlyInUse }}</span>
      </section>
      <section>
        Computer funzionanti:
        <span class="fw-bold">{{
          this.data.totalNumber - this.data.computerCurrentlyUnavailableCount
        }}</span>
      </section>
      <section>
        Computer in riparazione:
        <span class="fw-bold">{{
          this.data.computerCurrentlyUnavailableCount
        }}</span>
      </section>
      <section>
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
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

.dataContainer {
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
</style>