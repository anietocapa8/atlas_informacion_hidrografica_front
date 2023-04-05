<template>
  <router-view tag="div" class="logos"></router-view>
</template>

<script>
export default {
  beforeCreate(){
    this.$scrollTo('.container-sipsder', 0)
  }
}
</script>

<style lang="sass" scoped>
  .logos
    width: 100%
</style>

