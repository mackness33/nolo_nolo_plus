<template>
  <div>
    <MqResponsive target="md-">
      <div class="graphSm rounded shadow-lg">
        <h5 class="text-capitalize d-flex justify-content-center">
          {{ title }}
        </h5>
        <line-chart :data="data" :download="true"></line-chart>
      </div>
    </MqResponsive>
    <MqResponsive target="lg+">
      <div class="graphLg rounded shadow-lg">
        <h5 class="text-capitalize d-flex justify-content-center">
          {{ title }}
        </h5>
        <scatter-chart :data="data" :download="true"></scatter-chart>
      </div>
    </MqResponsive>
  </div>
</template>


<script>
import { MqResponsive } from "vue3-mq";

export default {
  name: "scatterchart",

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
  width: 950px;
  margin: 2rem;
  padding: 1rem;
  background-color: whitesmoke;
}
</style>