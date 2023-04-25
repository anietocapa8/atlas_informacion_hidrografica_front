<template>
  <div class="topics">
    <div class="left-bar" :class="{'is-open': isOpenLeftMenu}" v-if="menuHide">
      <div class="left-bar-content-container">
        <div class="left-bar-title">
          <img src="../../../assets/sidebar_desktop.png" alt="">
        </div>
        <div class="left-bar-content"> 
          <div class="row"  v-for="(link,i) in topicsMenu" v-bind:key="i" :class="{'selected': ($route.name == link.alias)}">
            <div class="icon"><i :class="link.icon"></i></div>
            <router-link :to="{name: link.alias}" class="text" tag="div">
              {{link.name}}
            </router-link>
          </div>
        </div>
        <div class="left-bar-footer">
          <img class="image" src="../../../assets/logo_bogota.png" />
        </div>
      </div>
      <div class="left-bar-button-container">
        <div class="left-bar-button" @click="toggleMenu"> 
          <div class="button-text">
            {{$t( 'topic.sidebar.title' )}}
          </div>
          <i :class="iconDesktop" />
        </div>
      </div>
    </div>
    <router-view tag="div" class="topics"  :key="$route.fullPath + isLogged "></router-view>
  </div>
  
</template>

<script>
export default {
 data(){
   return{
     iconDesktop: "fa fa-angle-right",
     isOpenLeftMenu: false,
     menuHide: false,
     topicsMenu:[
       {
         name: this.$t( 'topic.sidebar.ruralHousing' ),
         alias: "RuralHousingIndex",
         icon: "far fa-file-image"
       },
       {
         name: this.$t( 'topic.sidebar.payEnvironmentalService' ),
         alias: "Home",
         icon: "fab fa-wpforms"
       },
       {
         name: this.$t( 'topic.sidebar.alternativeMarket' ),
         alias: "Home",
         icon: "fas fa-edit"
       },
       {
         name: this.$t( 'topic.sidebar.productiveChain' ),
         alias: "Home",
         icon: "fas fa-users"
       },
       {
         name: this.$t( 'topic.sidebar.climateAndEnergy' ),
         alias: "Home",
         icon: "fas fa-check-square "
       },
       {
         name: this.$t( 'topic.sidebar.tourism' ),
         alias: "Home",
         icon: "far fa-file-alt"
       },
     ]
   }
 },
  computed: {
    isResponsive() {
      return this.$store.getters.isResponsive;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated
    },
  },
  methods:{
    toggleMenu() {
      this.isOpenLeftMenu = !this.isOpenLeftMenu
      if(this.isOpenLeftMenu){
        this.iconDesktop= "fa fa-angle-left"
      }
      else{
        this.iconDesktop= "fa fa-angle-right"
      }
    },
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.topics
  width: 100%
.left-bar
  width: 30%
  z-index: 201
  height: calc(100%)
  position: fixed
  right: 97%
  top: 0
  +flexbox
  +justify-content(flex-end)
  +align-items(center)
  transition: right 0.4s ease-in
  &.is-open
    z-index: 201
    right: 70%
  .left-bar-button-container
    width: 10%
    height: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    align-content: center
    flex-wrap: wrap
    .arrow-container
      +flexbox
      +justify-content(center)
      +align-items(center)
      width: 100%
      margin-top: 20px
      padding: 12px 0
      background: $colorTitleDark
      cursor: pointer
      i
        font-size: 2rem
        color: white
        font-weight: 600
    .left-bar-button
      width: 100%
      box-shadow: 0px 0px 3px #333
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-direction(column)
      padding: 12px 0
      background: $colorTitle
      .button-text
        writing-mode: vertical-lr
        text-orientation: sideways-right
        color: white
        font-size: 1.5rem
        font-weight: 600
        font-family: $fontBody
      i
        margin-top: 15px
        font-size: 2rem
        color: white
        font-weight: 600
  .left-bar-content-container
    width: 90%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    flex-direction: column
    box-shadow: 0px 0px 3px #333
    .left-bar-title
      background: $colorTitle
      width: 100%
      height: 12.5%
      +flexbox
      +justify-content(flex-start)
      +align-items(center)
      img
        width: 100%
    .left-bar-content
      background: $colorMenuBg
      width: 100%
      +flexbox
      +justify-content(center)
      +align-items(center)
      overflow-y: auto
      flex-wrap: wrap
      .selected
        background-color: $colorTitle !important
        border-bottom: 2px solid white !important
      .row
        cursor: pointer
        width: 100%
        padding: 10px 10px
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-wrap(nowrap)
        border-bottom: 2px solid $colorTitle
        &:hover
          background-color: $colorTitle
          border-bottom: 2px solid white
        i
          font-size: 40px
          padding-left: 20px
          color: #fff
        .icon
          width: 70px
        .text
          width: 100%
          padding-left: 20px
          font-size: 2rem
          color: white
          +flexbox
          +justify-content(flex-start)
          +align-items(center)
    .left-bar-footer
      +flexbox
      +justify-content(flex-end)
      +align-items(center)
      background: $colorTitle
      width: 100%
      height: 12.5%
      .image
        height: 100%
        max-height: 88px
@media screen and (max-width: $widthTablet)
  .left-bar
    width: 100% !important
    right: 96% !important
    transition: right 0.4s ease-in !important
    &.is-open
        left: -5% !important
  .left-bar-button-container
    width: 5% !important
</style>
