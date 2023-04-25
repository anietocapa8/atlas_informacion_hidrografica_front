<template>
    <router-view tag="div" class="admin-visit"></router-view>

</template>

<script>
export default {
  beforeCreate(){
    this.$scrollTo('.container-sipsder', 0)
  }
}
</script>

<style lang="sass" scoped>
  .admin-visit
    width: 100%
</style>