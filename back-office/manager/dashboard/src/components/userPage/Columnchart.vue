<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>

    <bar-chart :data="data" :download="true"></bar-chart>
  </div>
</template>


<script>
export default {
  name: "columnchart",

  data: () => {
    return {};
  },

  components: {},

  methods: {
    showInfo() {
      console.log(this.data);
    },
  },

  props: ["data", "title"],
};
</script>

<style scoped>
.graph {
  width: 35rem;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

@media only screen and (max-width: 1024) {
  .graph {
    width: 20rem;
  }
}
</style>