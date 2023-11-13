<template>
  <img class="not-found" src="../assets/img/404.jpeg" alt="NOT FOUND">
</template>

<script>
import mixingInit from '../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
  ],
}
</script>

<style lang="scss" scoped>
.not-found {
  max-height: 92vh;
  width: 100vw;
}
</style>


