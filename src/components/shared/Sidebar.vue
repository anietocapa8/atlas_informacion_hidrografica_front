<template>
<div>
  <div class="sidebar-search" :class="{'is-open-search': isOpenSearchDesktop}" :style="{'z-index': isOpenMenuMobile  ? '103' : '104'}" v-click-outside="onCloseSearch" >  
    <div class="search-button-container">
      <div class="search-button" @click="toggleSearchDesktop">
        <i class="fas fa-search"></i>
      </div>
    </div>
    <div class="search-content-container">
      <div class="search-content">
        <div class="search-row">
          <b-form-input v-model="query" v-b-tooltip.hover :title="$t('metasearch.tooltip')"
          :placeholder="$t('message.searchSidebarPlaceholder')" @keydown.enter.native="goMetasearchPage()"/>
        </div>
      </div>
    </div>
  </div>
  <div class="sidebar" :class="{'is-open': isOpenMenuDesktop}" :style="{'z-index': isOpenMenuMobile  ? '103' : '104'}" v-click-outside="onClose">
    <div class="sidebar-button-container">
      <div v-if="sidebar" class="sidebar-button" @click="toggleMenuDesktop">
        <div class="button-text">{{sidebar.name}}</div>
        <i :class="iconDesktop"/>
      </div>
      <div class="arrow-container" @click="moveUp" v-if="!isResponsive">
        <i class="fas fa-angle-up"></i>
      </div>
    </div>
    <div class="sidebar-content-container">
      <div class="sidebar-title">
        <img src="../../assets/sidebar_desktop.png" alt="">
      </div>
      <div class="sidebar-content">
        <div class="row" v-for="link of getSidebarMenu()" v-bind:key="link.id"  @click="toggleMenuDesktop">
          <div v-if="link.hasIcon" class="icon-container">
            <i v-bind:class="link.iconUrl"></i>
          </div>
          <img v-else :src="getURL(link)">
          <router-link :to="{name: getPage(link)}" class="text" tag="div">{{link.name}}</router-link>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="social-networks" v-if="isResponsive">
        <a
          :href="getValidUrl(v.logo.url)"
          v-for="v in getActiveSocialNetworks"
          :key="v.id"
          class="circle"
        >
          <img :src="getImgURL(v.logo.attachment.url)" v-if="v.logo.attachment.url != null">
          <i class="circle fab" :class="getSocialNetwork(v.name)"  v-else></i>
        </a>
      </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Login from "../views/user/Login.vue";
import VAPI from "../../http_common";
import S_UTIL from "../../util/sipsder_util";
import { SERVICE_NAMES, METASEARCH } from "../../sipsder_constants";

export default {
  data() {
    return {
      iconDesktop: "fa fa-angle-left",
      icon: "fa fa-angle-left",
      query: ''
    };
  },
  computed: {
    isOpenMenuMobile() {
      return this.$store.getters.getSidebarMobile;
    },
    isOpenMenuDesktop() {
      return this.$store.getters.getSidebarDesktop;
    },
    isResponsive() {
      return this.$store.getters.isResponsive;
    },
    getActiveSocialNetworks() {
      return this.$store.getters.getActiveSocialNetworks;
    },
    isOpenSearchDesktop(){
      return this.$store.getters.getSearchDesktop      
    },
    searchQuery(){
      return this.$store.getters.getSearchQuery;
    },
    sidebar(){
      return this.$store.getters.getSidebar
    }
  },
  watch: {
    searchQuery: function(){
      this.query = this.searchQuery
    }
  },
  async mounted() {
    this.$store.dispatch("setSidebarMobile", false);
    this.$store.dispatch("setSidebarDesktop", false);
    this.$store.dispatch("setSearchDesktop", false);
  },
  methods: {
    getImgURL (url) {
        return S_UTIL.getImgURL(url);
    },
    getSidebarMenu() {
      var sidebar = this.$store.getters.getSidebar.children;
      return sidebar;
    },
    goMetasearchPage(){
      if(this.query.length >= METASEARCH.MIN_LENGTH){
        this.$store.dispatch("setSearchQuery", this.query);
        this.$router.push({ 
          path: '/' + SERVICE_NAMES.METASEARCH_PATH,
          query: { q: this.searchQuery }
        })
      }
    },
    onCloseSearch(){
      this.$store.dispatch("setSearchDesktop", false);
    },
    onClose () {
      this.$store.dispatch("setSidebarDesktop", false);

      this.iconDesktop = "fa fa-angle-left";
    },
    getPage(link) {
      if (link.page) {
        return link.page.alias;
      }
      return "";
    },
    getURL(link) {
      if (link.url) {
        return this.getImgURL(`${link.url}`);
      }
      return require("@/assets/ayuda.png");
    },
    getValidUrl(url) {
      if (!url.includes("http")) {
        return "https://" + url;
      }
      return url;
    },
    getSocialNetwork(name) {
      let v = name.toLowerCase();
      let classObject = {
        "fa-facebook-f": v === "facebook",
        "fa-twitter": v === "twitter",
        "fa-youtube": v === "youtube",
        "fa-broadcast-tower": v === "radio",
        "fa-flickr": v === "flickr",
        "fa-instagram": v === "instagram",
        "fa-google ": v === "google plus",
        "fa-pinterest ": v === "pinterest",
        "fa-vimeo ": v === "vimeo"
      };
      return classObject;
    },
    toggleMenu() {
      this.$store.dispatch("setSidebarMobile", !this.isOpenMenuMobile);
      if (this.isOpenMenuMobile) {
        this.icon = "fa fa-angle-right";
      } else {
        this.icon = "fa fa-angle-left";
      }
    },
    toggleMenuDesktop() {
      this.$store.dispatch("setSidebarDesktop", !this.isOpenMenuDesktop);
      if (this.isOpenMenuDesktop) {
        this.iconDesktop = "fa fa-angle-right";
      } else {
        this.iconDesktop = "fa fa-angle-left";
      }
    },
    toggleSearchDesktop(){
      this.$store.dispatch("setSearchDesktop", !this.isOpenSearchDesktop)
    },
    moveUp() {
      this.$emit("move-up");
    },
    contact() {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push("../contact");
      } else {
        //alert('No esta autenticado!');
      }
    }
  },
  components: {
    "app-login": Login
  }
};
</script>

<style lang="sass" scoped>
  @import '../../stylesheets/style.sass'
  .sidebar
    width: 25%
    z-index: 103
    height: 270px
    position: fixed
    left: 97.5%
    top: 36%
    +flexbox
    +justify-content(flex-end)
    +align-items(center)
    transition: left 0.4s ease-in
    &.is-open
      left: 75%
    .sidebar-button-container
      width: 10%
      height: 100%
      +flexbox
      +justify-content(center)
      +align-items(center)
      align-content: center
      flex-wrap: wrap
      .arrow-container
        box-shadow: 0px 0px 3px #333
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
      .sidebar-button
        width: 100%
        box-shadow: 0px 0px 3px #333;
        +flexbox
        +justify-content(center)
        +align-items(center)
        +flex-direction(column)
        padding: 12px 0
        background: $colorTitle
        cursor: pointer
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
    .sidebar-content-container
      width: 90%
      +flexbox
      +justify-content(flex-start)
      +align-items(flex-start)
      flex-direction: column
      .sidebar-title
        background: $colorTitle
        width: 100%
        height: 12.5%
        +flexbox
        +justify-content(flex-start)
        +align-items(center)
        img
          width: 100%
      .sidebar-content
        background: $colorMenuBg
        width: 100%
        height: 75%
        +flexbox
        +justify-content(center)
        +align-items(center)
        overflow-y: auto
        flex-wrap: wrap
        max-height: 500px
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
          img
            height: 40px
            width: 40px
          .text
            width: 100%
            padding-left: 20px
            font-size: 2rem
            color: white
            +flexbox
            +justify-content(flex-start)
            +align-items(center)
        .icon-container
          background-image: url('../../assets/basic.png')
          background-size: 100%
          background-repeat: no-repeat
          background-position: center bottom
          color: #445873
          height: 40px
          padding-top: 7px
          padding-right: 2px
          font-size: 20px
          text-align: center
      .sidebar-footer
        +flexbox
        +justify-content(flex-end)
        +align-items(center)
        background: $colorTitle
        width: 100%
        height: 12.5%
        min-height: 20px
        .image
          height: 100%
          max-height: 88px

  .sidebar-search
    width: 25%
    z-index: 103
    height: 50px
    position: fixed
    left: 97.5%
    top: 30%
    +flexbox
    +justify-content(flex-end)
    +align-items(center)
    transition: left 0.4s ease-in
    &.is-open-search
      left: 75%
    .search-button-container
      width: 10%
      height: 100%
      +flexbox
      +justify-content(center)
      +align-items(center)
      align-content: center
      flex-wrap: wrap
      .search-button
        box-shadow: 0px 0px 3px #333
        +flexbox
        +justify-content(center)
        +align-items(center)
        width: 100%
        margin-bottom: 20px
        padding: 12px 0
        background: $colorTitleDark
        cursor: pointer
        i
          font-size: 2rem
          padding: 4px
          color: white
          font-weight: 600
    .search-content-container
      width: 90%
      .search-content
        background: $colorMenuBg
        width: 100%
        height: 100%
        max-height: 100px
        margin-top: -20px
        .search-row
          cursor: pointer
          width: 100%
          padding: 13px 10px

          border-bottom: 2px solid $colorTitle
          &:hover
            background-color: $colorTitle
            border-bottom: 2px solid white

  @media screen and (max-width: $widthTablet)
    .sidebar-search
        width: 100% !important
        left: 90% !important
        transition: right 0.4s ease-in !important
        &.is-open-search
          left: 0% !important
    .sidebar-content-container
      height: 400px
    .sidebar
      width: 100% !important
      left: 90% !important
      transition: right 0.4s ease-in !important
      &.is-open
        left: 0% !important
      .social-networks
        width: 100%
        height: 110px
        +flexbox
        +justify-content(space-evenly)
        +align-items(center)
        .circle
          height: 35px
          width: 35px
          +flexbox
          +justify-content(center)
          +align-items(center)
          border-radius: 50%
          cursor: pointer
          img
            height: 35px
            width: 35px
            border-radius: 50%
          &.fa-facebook-f
            font-size: 1.5rem
            color: white
            background: #3b5998
          &.fa-twitter
            font-size: 1.5rem
            color: white
            background: #1da1f2
          &.fa-youtube
            font-size: 1.5rem
            background: #ff0000
            color: white
          &.fa-broadcast-tower
            font-size: 1.5rem
            color: white
            background: #99cc33
          &.fa-flickr
            font-size: 1.5rem
            background: #f40083
            color: white
          &.fa-instagram
            font-size: 1.5rem
            color: white
            background: #f09433 !important
            background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important 
            background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) !important
            background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) !important
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 ) !important
          &.fa-google 
            font-size: 1.5rem
            background: #dd4b39
            color: white
          &.fa-instagram 
            font-size: 1.5rem
            background: #125688
            color: white
          &.fa-pinterest 
            font-size: 1.5rem
            background: #cb2027
            color: white
          &.fa-vimeo 
            font-size: 1.5rem
            background: #45bbff
            color: white      

</style>
