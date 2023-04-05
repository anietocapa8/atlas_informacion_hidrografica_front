<template>
<div class="footer-container">
  <div class="footer" :class="{'mobile-fa': isResponsive}">
    <div class="sub" style="z-index: 3" :style="{'background-color': colors.linkFooterColor}">
      <div class="title-container">
        <i :class="icon" @click="changeVisibility"/>
        <div class="title">{{$t('footer.red')}}</div>
      </div>
      <div style="width: 100%;" v-if="open">
        <hr>
        <div class="content">
          <div class="col-25">
            <div class="row" v-for="(v,i) in partOne" :key="i">
              <a :href="getLink(v.url)" class="link" target="_blank">{{v.name}}</a>
            </div>
          </div>
          <div class="col-25">
            <div class="row" v-for="(v,i) in partTwo" :key="i">
              <a :href="getLink(v.url)" class="link" target="_blank">{{v.name}}</a>
            </div>
          </div>
          <div class="col-25">
            <div class="row" v-for="(v,i) in partThree" :key="i">
              <a :href="getLink(v.url)" class="link" target="_blank">{{v.name}}</a>
            </div>
          </div>
          <div class="col-25">
            <div class="row" v-for="(v,i) in partFour" :key="i">
              <a :href="getLink(v.url)" class="link" target="_blank">{{v.name}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub" v-if="isResponsive" :style="{'background-color': colors.contactFooterColor}" >
      <div class="title-container">
        <i :class="iconMobile" @click="changeVisibilityMenuTwo"/>
        <div class="title">{{$t('message.bogotaRural')}}</div>
      </div>
      <div style="width: 100%" v-if="openMobile">
        <hr>
        <div class="content">
          <div class="col-25">
            <div class="row">
              <div class="text">{{$t('footer.address')}}: {{direction}}</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.atention')}}: {{schedule}}</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.phone')}}: 60 1 3358000 ext 9013</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.freePhone')}}: 01 8000 913 038</div>
            </div>
            <div class="row">
              <div class="social-network">
                <a
                  v-for="v in getActiveSocialNetworks"
                  :href="getValidUrl(v.logo.url)"
                  :key="v.id"
                  class="circle mr-2"
                  target="_blank"
                >
                  <img :src="getImgURL(v.logo.attachment.url)" v-if="v.logo.attachment.url != null">
                  <i class="circle fab" :class="getSocialNetwork(v.name)" v-else></i>
                </a>
              </div>
            </div>
          </div>
          <div class="col-25">
            <div class="row">
              <div class="text">
                {{$t('footer.anticorruptionPhone')}}: Línea 195 opción 1 
              </div>
            </div>
            <div class="row">
              <div class="text">
                {{$t('footer.insEmail')}}:
                <span v-for="v in email" :key="v">
                  <div class="text">{{v}}</div>
                </span>
              </div>
            </div>
            <div class="row">
              <u class="text">
                <a href="https://www.sdp.gov.co/servicios-ciudadania/canales-atencion" target="_blank" rel="noopener noreferrer" style="color: white">
                  {{$t('footer.atentionChannels')}}
                </a>
              </u>
            </div>
            <div class="row">
              <u class="text">
                <router-link to="/sitemap" style="color: white">
                  {{ $t("footer.sitemap")}}
                </router-link>
              </u>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main" :style="{'background-color': colors.contactFooterColor}">
      <div class="title" v-if="!isResponsive">{{$t('message.bogotaRural')}}</div>
      <div class="content mt-4">
        <div class="col-25" v-if="!isResponsive">
          <div class="row">
              <div class="text">{{$t('footer.address')}}: {{direction}}</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.atention')}}: {{schedule}}</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.phone')}}: 60 1 3358000 ext 9013</div>
            </div>
            <div class="row">
              <div class="text">{{$t('footer.freePhone')}}: 01 8000 913 038</div>
            </div>
            <div class="row">
              <div class="social-network">
                <a
                  v-for="v in getActiveSocialNetworks"
                  :href="getValidUrl(v.logo.url)"
                  :key="v.id"
                  class="circle mr-2"
                  target="_blank"
                >
                  <img :src="getImgURL(v.logo.attachment.url)" v-if="v.logo.attachment.url != null">
                  <i class="circle fab" :class="getSocialNetwork(v.name)" v-else></i>
                </a>
              </div>
            </div>
        </div>
        <div class="col-25" v-if="!isResponsive">
            <div class="row">
              <div class="text">
                {{$t('footer.anticorruptionPhone')}}: Línea 195 opción 1 
              </div>
            </div>
            <div class="row">
              <div class="text w-100">
                {{$t('footer.insEmail')}}:
                <span class="" v-for="v in email" :key="v">
                  <div class="text">{{v}} </div>
                </span>
              </div>
            </div>
            <div class="row">
              <u class="text" style="color: white">
                <a href="https://www.sdp.gov.co/servicios-ciudadania/canales-atencion" target="_blank" rel="noopener noreferrer" style="color: white">
                  {{$t('footer.atentionChannels')}}
                </a>
              </u>
            </div>
            <div class="row">
              <u class="text">
                <router-link to="/sitemap" style="color: white">
                  {{ $t("footer.sitemap")}}
                </router-link>
              </u>
            </div>
        </div>
        <div class="col-50">
          <div class="row">
            <div class="col-50 logo">
                <img src="../../assets/logo_planeacion.png" v-if="footer === null">
                <a :href="getLink(footer.logos.sdp.clickUrl)" target="_blank" v-else-if="footer.logos.sdp!= null">
                  <img v-if="footer.logos.sdp.logoUrl !== null" :src="getImgURL(footer.logos.sdp.logoUrl)"  @error="getPlaceHolderSDP">
                  <img v-else src="../../assets/logo_planeacion.png">
                </a>
                <img src="../../assets/logo_planeacion.png" v-else>
            </div>
            <div class="col-50 logo">
                <img src="../../assets/colombia_logo.png" v-if="footer === null" >
                <a :href="getLink(footer.logos.country.clickUrl)" target="_blank" v-else-if="footer.logos.country != null">
                  <img v-if="footer.logos.country.logoUrl !== null" :src="getImgURL(footer.logos.country.logoUrl)"  @error="getPlaceHolderCountry">
                  <img v-else src="../../assets/colombia_logo.png">
                </a>
                <img src="../../assets/colombia_logo.png" v-else>
            </div>
            <div class="text visits">{{visits.toLocaleString()}} {{$t('footer.visit')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-gov">
    <a class="footer-gov-link" href="https://www.gov.co/" target="_blank">
      <img alt="Logo Gov.co" src="../../assets/logo_govco.svg">
    </a>
    <a class="footer-col-link" href="https://www.colombia.co/" target="_blank">
      <img alt="Logo Gov.co" src="../../assets/colombia_co.png">
    </a>
    <div class="row align-items-center h-100 mx-5">
      <div class="col-lg-4 text-center py-1">
        <u>
          <router-link to="/terms-and-conditions" style="color: white">
            {{ $t("footer.termsAndConditions")}}
          </router-link>
        </u>
      </div>
      <div class="col-lg-4 text-center py-1">
        <u>
          <router-link to="/policy-tool" style="color: white">
            {{ $t("footer.dataProtection")}}
          </router-link>
        </u>
      </div>
      <div class="col-lg-4 text-center py-1" style="color: white">
         &copy; {{$t('footer.institution')}} {{new Date().getFullYear()}}, {{$t('footer.rigths')}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
// TODO: links con store en bd y redes sociales
import VAPI from "../../http_common";
import { SERVICE_NAMES } from "@/sipsder_constants";
import S_UTIL from "../../util/sipsder_util";

export default {
  data() {
    return {
      icon: "",
      iconMobile: "",
      open: true,
      openMobile: true,
      visits: 0,
      partOne: [],
      partTwo: [],
      partThree: [],
      partFour: [],
      direction: null,
      fax: null,
      schedule: null,
      telephone: null,
      email: null,
      colors:{
        contactFooterColor:"#003e65",
        copyrightFooterColor:"#009fe3",
        linkFooterColor:"#009fe3",

      }
    };
  },
  computed: {
    isResponsive() {
      return this.$store.getters.isResponsive;
    },
    getActiveSocialNetworks() {
      return this.$store.getters.getActiveSocialNetworks;
    },
    footer() {
      return this.$store.getters.getLogosColors;
    },
  },
  beforeMount(){
    this.getActiveLinks()
    if(this.footer != undefined &&  this.footer!=null){
      this.colors=this.footer.colors
    }
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    getPlaceHolderSDP(e){
      e.target.src =  require('../../assets/logo_planeacion.png')
    },
    getPlaceHolderCountry(e){
      e.target.src =  require('../../assets/colombia_logo.png')
    },
    getActiveLinks() {
      if( this.footer != undefined &&  this.footer!=null){
        const links = this.footer.links.filter(link => !link.upper);
        var i;
        this.partOne = [];
        this.partTwo = [];
        this.partThree = [];
        this.partFour = [];
        let array = "one";
        for (i = 0; i < links.length; i++) {
          switch (array) {
            case "one":
              this.partOne.push(links[i]);
              array = "two";
              break;
            case "two":
              this.partTwo.push(links[i]);
              array = "three";
              break;
            case "three":
              this.partThree.push(links[i]);
              array = "four";
              break;
            case "four":
              this.partFour.push(links[i]);
              array = "one";
              break;
          }
        }
      }
    },
    
    getLink(link) {
      if (link.indexOf("http") !== -1) {
        return link;
      }
      return `https://${link}`;
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
    changeVisibility() {
      this.open = !this.open;
      if (this.open) {
        this.icon = "fa fa-angle-up";
      } else {
        this.icon = "fa fa-angle-down";
      }
    },
    changeVisibilityMenuTwo() {
      this.openMobile = !this.openMobile;
      if (this.openMobile) {
        this.iconMobile = "fa fa-angle-up";
      } else {
        this.iconMobile = "fa fa-angle-down";
      }
    }
  },
  watch: {
    footer(newCount, oldCount){
      this.getActiveLinks()
      if(this.footer != undefined &&  this.footer!=null){
        this.colors=this.footer.colors
      }
    },
  },
  mounted() {
    this.icon = "fa fa-angle-down";
    this.iconMobile = "fa fa-angle-down";
    VAPI.get(`${SERVICE_NAMES.PAGE}/count`).then(response => {
      this.visits = response.data.data.count;
    });
    // setInterval(() => {
    //   VAPI.get(`${SERVICE_NAMES.PAGE}/count`).then(response => {
    //     this.visits = response.data.data.count;
    //   });
    // }, 100000);
    VAPI.get(SERVICE_NAMES.SIPSDER).then(response => {
      this.direction = response.data.data[0]["direction"];
      this.fax = response.data.data[0]["fax"];
      this.schedule = response.data.data[0]["schedule"];
      this.telephone = response.data.data[0]["telephone"];
      this.email = response.data.data[0]["email"].split(",");
    });
  }
};
</script>

<style lang="sass" scoped>
  @import '../../stylesheets/style.sass'
  .footer-container
    width: 100%
    position: relative
    max-width: 100%
    margin: 0
    padding: 0
  .social-network
    margin: 1rem 0 0.5rem 0
    padding: 0
    height: 100%
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
      &:hover
        opacity: 0.7
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
      &.fa-pinterest 
        font-size: 1.5rem
        background: #cb2027
        color: white
      &.fa-vimeo 
        font-size: 1.5rem
        background: #45bbff
        color: white      
  .footer-gov
    position: relative
    background-color: #36c
    padding: 5px 0.7rem
    height: auto
    min-height: 40px
    .footer-gov-link
      z-index: 5
      position: absolute
      left: 0
      top: 20%
    .footer-col-link
      z-index: 5
      position: absolute
      right: 1%
      top: 20%
    img
      height: 25px
  .social-networks
    background: $colorSubFooter
    height: 45px
    width: 100%
    padding-right: 75px
    +flexbox
    +justify-content(center)
    +align-items(center)
    .town-hall
      padding: 0 5px
      width: 50%
      +flexbox
      +justify-content(flex-start)
      +align-items(center)
      height: 100%
      img
        width: 45px
        height: 45px
      .button
        +flexbox
        +justify-content(flex-start)
        +align-items(center)
        height: 100%
        font-size: 1rem
        border-right: 1px solid $colorMenuMobile
        text-transform: uppercase
        padding: 0 7.5px
        cursor: pointer
        background: darken($colorSubFooter,8)
      .mg-left
        margin-left: 10px
    .container
      padding: 0 5px
      width: 50%
      height: 100%
      +flexbox
      +justify-content(flex-end)
      +align-items(center)
      .social-network
        width: 35px
        height: 35px
        margin: 0 5px
        +flexbox
        +justify-content(center)
        +align-items(center)
        background: $colorMenuBg
        .icon
          color: white
          font-size: 1.5rem
        &:hover
          opacity: 0.7
  .mobile-fa
    .copyright
      padding: 0 85px !important
    .sub
      padding: 0 85px !important
    .main
      padding: 0 85px !important
  .footer
    width: 100%
    z-index: 3
    +flexbox
    +justify-content(center)
    +align-items(center)
    +flex-wrap(wrap)
    .copyright
      width: 100%
      background: $colorSidebarMobile
      box-shadow: 0 0 5px #333
      +flexbox
      +justify-content(center)
      +align-items(center)
      height: 65px
      padding: 0 10px
      z-index: 2
      .text
        font-size: 1.3rem
        font-weight: 600
        color: white
    .sub
      width: 100%
      background: $colorSidebarMobile
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-wrap(wrap)
      padding: 0.5% 5%
      z-index: 2
      &:first-child
        box-shadow: 0 0 5px #333
      hr
        margin: 1em 0
        width: 100%
        border-bottom: 1px solid
        border-image-source: linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)
        border-image-slice: 1
      .content
        width: 100%
        +flexbox
        +justify-content(center)
        +align-items(flex-start)
        .col-25
          width: 25%
          +flexbox
          +justify-content(center)
          +align-items(center)
          +flex-wrap(wrap)
          .text
            font-size: 1.5rem
          .row
            padding-left: 1.5%
            width: 100%
            +flexbox
            +justify-content(flex-start)
            +align-items(center)
            .link
              cursor: pointer
              color: white
              font-size: 1.5rem
              font-family: $fontBody
              &:hover
                opacity: 0.7
      .title-container
        width: 100%
        +flexbox
        +justify-content(flex-start)
        +align-items(center)
        .title
          width: 100% !important
          text-align: center
          width: 240px
          font-size: 1.5rem
          color: white
          padding: 0.5% 0
          font-family: $fontBody
          font-weight: 600
          margin-right: 1%
        i
          font-size: 2.5rem
          color: white
    .main
      width: 100%
      background: $colorSidebarDark
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-wrap(wrap)
      padding: 0 5%
      z-index: 1
      .title
        margin-top: 15px
        width: 100%
        color: white
        font-size: 2.2rem
        font-family: $fontBody
        font-weight: 600
      .content
        margin: 5px 0 10px 0
        width: 100%
        +flexbox
        +justify-content(space-between)
        +align-items(flex-start)
        .col-50
          +flexbox
          +justify-content(center)
          +align-items(flex-start)
          width: 45%
          .row
            width: 100%
            +flexbox
            +justify-content(center)
            +align-items(center)
            +flex-wrap(wrap)
            a
              max-height: 140px
              img
                width: auto
                max-height: 110px
            img
              width: auto
              max-height: 100%
            .text
              margin: 0 10px
              margin-top: 0px
              width: 100%
              font-size: 1.2rem
              font-family: $fontBody
              font-weight: 600
              color: white
              +flexbox
              +justify-content(center)
              +align-items(center)         
        .col-25
          +flexbox
          +justify-content(center)
          +align-items(center)
          +flex-wrap(wrap)
          width: 25%
          .row
            padding-left: 1.5%
            width: 100%
            +flexbox
            +justify-content(flex-start)
            +align-items(center)
            .text
              color: white
              font-size: 1.2rem
              font-family: $fontBody
              &:hover
                opacity: 0.7
        .logo
          height: 140px
          padding: 15px
  @media screen and (min-width: $widthMobile) and (max-width: $widthTablet)
    .footer-gov
      .footer-gov-link
        top: 10%    
      .footer-col-link
        right: 2%
        top: 10%
    .visits
      margin-top: 4px !important
    .social-networks
      height: 90px
      flex-direction: column
      .town-hall
        width: 100%
      .container
        margin: 5px 0
        width: 95%
        +justify-content(center)
    .content
      +flex-wrap(wrap)
      .col-25
        padding-top: 10px
        width: 50% !important
        .row
          .text
            font-size: 1.1rem !important
            color: white
          .link
            font-size: 1.1rem !important
      .col-50
        width: 100% !important
      .option
        width: 33%
        +flexbox
        +justify-content(center)
        +align-items(center)
        text-align: center
  @media screen and (max-width: $widthMobile)
    .footer-gov
      .footer-gov-link
        top: 10%
      .footer-col-link
        right: 2%
        top: 10%
    .visits
        top: 10%
    .visits
      margin-top: 4px !important
    .content
      +flex-wrap(wrap)
      .col-25
        padding-top: 10px
        width: 100% !important
        .row
          .text
            font-size: 1.1rem !important
            color: white
          .link
            font-size: 1.1rem !important
      .col-50
        width: 100% !important
      .option
        width: 50%
        +flexbox
        +justify-content(center)
        +align-items(center)
        text-align: center
    .social-networks
      height: 90px
      flex-direction: column
      .town-hall
        width: 100%
      .container
        margin: 5px 0
        width: 95%
        +justify-content(center)
    .footer
      .copyright
        .text
          font-size: 1rem
      .main 
        .content
          .col-50 
            +flex-wrap(wrap) 
            .row
              width: 100%
</style>
