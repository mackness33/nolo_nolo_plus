<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <line-chart :data="{ '2017-05-13': 2, '2017-05-14': 5 }"></line-chart>
  </div>
</template>


<script>
export default {
  name: "linechart",

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
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}
</style>