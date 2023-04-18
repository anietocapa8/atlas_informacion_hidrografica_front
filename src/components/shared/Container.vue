<template>
  <div class="box">
    <router-view
      @click.native="closeSidebar"
      tag="div"
      class="content"
      :class="{'mg-top': isMenuFixed || isResponsive}"
    />
    <sidebar @move-up="moveUp"></sidebar>
    <left-side-bars></left-side-bars>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import LeftSideBars from "./LeftSideBars.vue";
export default {
  methods: {
    moveUp() {
      this.$emit("move-up");
    },
    closeSidebar() {
      this.$store.dispatch("setSidebarMobile", false);
      this.$store.dispatch("setSidebarDesktop", false);
    }
  },
  computed: {
    isMenuFixed() {
      return this.$store.getters.isMenuFixed;
    },
    isResponsive() {
      return this.$store.getters.isResponsive;
    }
  },
  components: {
    Sidebar,
    LeftSideBars
  }
};
</script>

<style lang="sass" scoped>
  @import '../../stylesheets/style.sass'
  .mg-top
    margin-top: 240px
  .box
    +flexbox
    +justify-content(center)
    +align-items(center)
    position: relative
    width: 100%
    .content
      height: 100%
      width: calc(100%)
      // overflow-x: hidden
      // overflow-y: hidden
  @media screen and (min-width: $widthMobile) and (max-width: $widthTablet)
    .mg-top
      margin-top: 80px !important
  @media screen and (max-width: $widthMobile)
    .mg-top
      margin-top: 80px !important
</style>
