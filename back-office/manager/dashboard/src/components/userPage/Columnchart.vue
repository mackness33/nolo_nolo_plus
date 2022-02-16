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
  max-width: 25rem;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}
</style>