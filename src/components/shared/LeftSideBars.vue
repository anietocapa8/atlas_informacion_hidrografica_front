<template>
    <div class="bar">
        <div class="left-bar" :class="{'is-open': isOpenLeftMenus}" v-click-outside="onClose">
            <div class="left-bar-content-container" v-if="selectedMenu">
                <div class="left-bar-title" :style="{'background-color': selectedMenu.color}">
                <img src="../../assets/sidebar_desktop.png" alt="">
                </div>
                <div class="left-bar-content"> 
                  <div v-for="(link,i) in selectedMenu.menu.children" :key="i" style="width: 100%">
                      <div class="row" v-if="link.hasPermission" :style="[{'border-bottom-color': selectedMenu.color},{'--optionBackground': backgroundImage}]" :class="{selected : ($route.name ==  getLinkP(link.page))}" style="margin: 0 !important">
                        <div v-if="link.hasIcon" class="icon-container">
                          <i v-bind:class="link.iconUrl"></i>
                        </div>
                        <img v-else :src="getURL(link)">
                        <span v-if="link.page" @click="isOpenLeftMenus=false">
                            <router-link :to="{name: getLink(link.page.alias)}" class="text" tag="div" v-if=" getLink(link.page.alias) !== 'CommunityLibrary'">
                            {{link.name}}
                            </router-link>
                            <router-link :to="{name: getLink(link.page.alias), params: {community : 'community'}}" class="text" tag="div" v-else>
                            {{link.name}}
                            </router-link>
                        </span>
                        <span v-else @click="isOpenLeftMenus=false">
                          <router-link :to="{name:'Home'}" class="text" tag="div" >
                            {{link.name}}
                            </router-link>
                        </span>
                      </div>
                  </div>
                </div>
                <div class="left-bar-footer" :style="{'background-color': selectedMenu.color}">
                </div>
            </div>
            <div class="left-bar-button-container">
              <div class="button-container" v-for="(lateral,i) in getLateralMenuLinks()" :key="i" >
                  <div class="left-bar-button" :style="{'background-color': lateral.color}" @click="toggleMenu(i)"  v-if="lateral.menu.children.length !== 0 && lateral.menu.hasPermission"> 
                    <div class="button-text" v-b-tooltip.hover :title="lateral.menu.name">
                        <i :class="lateral.icon" />
                    </div>
                    <i :class="iconDesktop[i]" />
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

export default {
    data(){
        return {
            lateralMenuLinks: null,
            selectedMenu: null,
            iconDesktop: ["fa fa-angle-right","fa fa-angle-right","fa fa-angle-right"],
            isOpenLeftMenu: [false,false,false],
            isOpenLeftMenus: false,
            isHover: [],
            backgroundImage: "#000",
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
      getImgURL (url) {
          return S_UTIL.getImgURL(url);
      },
      getLateralMenuLinks() {
        this.lateralMenuLinks = this.$store.getters.getLateral;
        if(this.lateralMenuLinks != null && this.lateralMenuLinks != undefined){
          if(this.lateralMenuLinks.length>0 && this.selectedMenu === null){
            this.selectedMenu = this.lateralMenuLinks[0]
            this.backgroundImage = this.selectedMenu.colorH
          }
        }
        return this.lateralMenuLinks;
      },
      getURL(link) {
      if (link.url) {
        return this.getImgURL(`${link.url}`);
      }
      return require("@/assets/ayuda.png");
      },
       onClose () {
          this.isOpenLeftMenus = false
          for(var e=0; e<3; e++){
            this.iconDesktop[e] =  "fa fa-angle-right"
            this.isOpenLeftMenu[e] = false
          }
        },
        LightenDarkenColor(col, amt) {
          var usePound = false;
          if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
          }
          var num = parseInt(col,16);
          var r = (num >> 16) + amt;
          if (r > 255) r = 255;
          else if  (r < 0) r = 0;
          var b = ((num >> 8) & 0x00FF) + amt;
          if (b > 255) b = 255;
          else if  (b < 0) b = 0;
          var g = (num & 0x0000FF) + amt;
          if (g > 255) g = 255;
          else if (g < 0) g = 0;
          return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
          
        },
        toggleMenu(i) {
          if(this.isOpenLeftMenus==false){
            for(var e=0; e<3; e++){
                this.isOpenLeftMenu[e] = false
            }
          }
          if(!this.isOpenLeftMenu[0] && !this.isOpenLeftMenu[1] && !this.isOpenLeftMenu[2]){
            this.isOpenLeftMenu[i] = true
            this.isOpenLeftMenus =true
            this.selectedMenu = this.lateralMenuLinks[i]
            this.backgroundImage = this.selectedMenu.colorH
          }
          else{
            if(this.isOpenLeftMenu[i] == false){
              for(var e=0; e<3; e++){
                this.isOpenLeftMenu[e] = false
                this.isOpenLeftMenus =false
              }
              for(var e=0; e<3; e++){
                this.iconDesktop[e] =  "fa fa-angle-right"
              }
              var self= this
              setTimeout(function(){
                  self.isOpenLeftMenu[i] = true
                  self.selectedMenu = self.lateralMenuLinks[i]
                  self.isOpenLeftMenus = true
                  self.backgroundImage = self.selectedMenu.colorH
                   if(self.isOpenLeftMenu[i]){
                      self.iconDesktop[i]= "fa fa-angle-left"
                  }
                  else{
                      self.iconDesktop[i]= "fa fa-angle-right"
                  }
              }, 700);
              
            }
            else if( this.isOpenLeftMenu[i] == true) {
              this.isOpenLeftMenu[i] = false
              this.isOpenLeftMenus = false
            }
          }
          
          if(this.isOpenLeftMenu[i]){
              this.iconDesktop[i]= "fa fa-angle-left"
          }
          else{
              this.iconDesktop[i]= "fa fa-angle-right"
          }
        },
        getLink(l){
            if(l==null) return ""
            else return l
        },
        getLinkP(l){
            if(l==null) return ""
            else if(l.alias == null) return ""
            else return l.alias
        },
    },
    
}
</script>

<style lang="sass" scoped>
@import '../../stylesheets/style.sass'
.bar
  --optionBackground: #000
.left-bar
  width: 25%
  z-index: 103
  height: 41%
  position: fixed
  right: 97.6%
  top: 30%
  +flexbox
  +justify-content(flex-end)
  +align-items(center)
  transition: right 0.4s ease-in
  &.is-open
    z-index: 201
    right: 75%
  .left-bar-button-container
    width: 10%
    height: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    align-content: center
    flex-wrap: wrap
    .button-container
      width: 100%
      margin-bottom: 20px
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
        cursor: pointer
        .button-text
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
      max-height: 500px
      .selected
        background-color: var(--optionBackground) !important
        border-bottom: 2px solid white !important
      .row
        cursor: pointer
        width: 100%
        padding: 10px 10px
        +flexbox
        +align-items(center)
        +flex-wrap(nowrap)
        border-bottom: 2px solid $colorTitle
        &:hover
           background-color: var(--optionBackground) !important
           border-bottom: 2px solid white !important
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
    .left-bar-footer
      +flexbox
      +justify-content(flex-end)
      +align-items(center)
      width: 100%
      height: 12.5%
      min-height: 20px
      .image
        height: 100%
        max-height: 88px
  .icon-container
    background-image: url('../../assets/basic.png')
    background-size: 100%
    background-repeat: no-repeat
    background-position: center bottom
    color: #445873
    height: 40px
    width: 40px
    padding-top: 7px
    padding-right: 2px
    font-size: 20px
    text-align: center
@media screen and (max-width: $widthTablet)
  .left-bar
    width: 100% !important
    right: 90.1% !important
    transition: right 0.4s ease-in !important
    &.is-open
        left: 0% !important
</style>
