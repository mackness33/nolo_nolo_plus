<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>

    <column-chart :data="data" :download="true"></column-chart>
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
  max-width: 332px;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

@media only screen and (max-width: 1024) {
}
</style>