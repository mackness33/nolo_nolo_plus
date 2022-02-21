<template>
  <div>
    <MqResponsive target="md-">
      <div class="graphSm rounded shadow-lg">
        <h5 class="text-capitalize d-flex justify-content-center">
          {{ title }}
        </h5>
        <pie-chart :data="data"></pie-chart>
      </div>
    </MqResponsive>
    <MqResponsive target="lg+">
      <div class="graphLg rounded shadow-lg">
        <h5 class="text-capitalize d-flex justify-content-center">
          {{ title }}
        </h5>
        <pie-chart :data="data"></pie-chart>
      </div>
    </MqResponsive>
  </div>
</template>


<script>
import { MqResponsive } from "vue3-mq";

export default {
  name: "barchart",

  data: () => {
    return {};
  },

  components: {
    MqResponsive,
  },

  methods: {
    showInfo() {
      console.log(this.data);
    },
  },

  props: ["data", "title"],
};
</script>

<style scoped>
.graphSm {
  max-width: 332px;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}

.graphLg {
  width: 35rem;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}
</style>