<template>
</template>

<script>
export default {
  beforeMount() {
    //this.$router.push({ name: 'NewsDetail', meta: { view: storyId }});
    //console.info("CURRENT ", this.$route.query.view);
    this.$router.push(this.$route.query.view);
  }
}
</script>

<style lang="sass" scoped>
</style>

