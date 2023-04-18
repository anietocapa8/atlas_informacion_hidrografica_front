<template>
    <router-view tag="div" class="contact"></router-view>
</template>

<script>
export default {
  beforeCreate(){
    this.$scrollTo('.container-sipsder', 0)
  }
}
</script>

<style lang="sass" scoped>
  .contact
    width: 100%
</style>
