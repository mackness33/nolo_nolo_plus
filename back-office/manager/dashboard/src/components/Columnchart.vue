<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
    <column-chart
      data="http://localhost:8000/dash/user/userAge"
      :download="true"
    ></column-chart>
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
</style>