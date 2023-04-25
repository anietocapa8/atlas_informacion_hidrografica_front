<template>
    <div>
        <router-view tag="div" class="announcement"  :key="$route.fullPath + isLogged "></router-view>
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
.announcement
  width: 100%
</style>