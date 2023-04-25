<template>
  <div class="community">
    <router-view tag="div" class="community" :key="$route.fullPath + isLogged "></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    isLogged() {
      return this.$store.getters.isAuthenticated;
    }
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.community
  width: 100%

</style>

