<template>
  <div class="graph rounded shadow-lg">
    <h5 class="text-capitalize d-flex justify-content-center">{{ title }}</h5>
  </div>
</template>


<script>
export default {
  name: "moneydata",

  data: () => {
    return {};
  },

  components: {},

  methods: {},

  props: ["data", "title"],
};
</script>

<style scoped>
</style>