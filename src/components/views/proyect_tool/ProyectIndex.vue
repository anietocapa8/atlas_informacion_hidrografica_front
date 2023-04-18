<template>
    <div>
        <router-view tag="div" class="proyect"  :key="$route.fullPath + isLogged "></router-view>
    </div>
</template>

<script>
export default {
    computed: {
        isResponsive() {
            return this.$store.getters.isResponsive;
        },
        isLogged() {
            return this.$store.getters.isAuthenticated
        },
  },
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.proyect
  width: 100%
</style>