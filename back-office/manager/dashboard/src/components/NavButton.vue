<template>
  <v-btn rounded="pill">
    {{text}}
  </v-btn>
</template>


<script>
export default {
  name: 'NavButton',

  props: {
    text: String,
  }
}
</script>
