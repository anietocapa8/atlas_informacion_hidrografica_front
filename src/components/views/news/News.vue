<template>
  <router-view tag="div" class="news"  :key="$route.fullPath"></router-view>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
  .news
    width: 100%
</style>

