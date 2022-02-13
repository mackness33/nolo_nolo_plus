<template>
  <div class="helloworld">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

  export default {
    name: 'HelloWorld',
    props: {
      msg: String,
    }
  }
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
