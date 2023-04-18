<template>
  <div class="planning-feed container-form">
    <div class="title" v-b-tooltip.hover :title="$t( 'home.planningFeed.title')">{{$t( 'home.planningFeed.title')}}</div>
    <div class="feed-body">
        <div class="image" @click="$router.push({ name: 'RuralModel'})">
            <div class="title" v-b-tooltip.hover :title="$t( 'home.planningFeed.ruralModel')">{{$t( 'home.planningFeed.ruralModel')}}</div>
            <img src="../../../assets/home/model.png">
        </div>
        <div class="separator"></div>
        <div class="image" @click="$router.push({ name: 'RuralIndicatorIndex'})">
            <div class="title" v-b-tooltip.hover :title="$t( 'home.planningFeed.ruralStadistics')">{{$t( 'home.planningFeed.ruralStadistics')}}</div>
            <img src="../../../assets/home/indicator.png">
        </div>
        <div class="separator"></div>
        <div class="image" @click="$router.push({ name: 'GeoViewer'})">
            <div class="title" v-b-tooltip.hover :title="$t( 'home.planningFeed.geoVisor')">{{$t( 'home.planningFeed.geoVisor')}}</div>
            <img src="../../../assets/home/visor.png">
        </div>

       <!--<ul>
           <li :class="{default:a1}" @mouseenter="setTrueA1()" @mouseover="setTrueA1()" @click="setTrueA1()">
               <div class="title">{{$t( 'home.planningFeed.ruralModel')}}</div>
                <router-link :to="{ name: 'RuralModel'}">
                    <img v-if="optionalImage.url != null && optionalImage.type=='Video'" :src="getYTvideoCode(optionalImage.url)" >
                    <img v-else-if="optionalImage.url != null && optionalImage.type!='Video'" :src="optionalImage.url">
                    <img v-else src="../../../assets/rural-model/ModelRural.png">
                </router-link>
            </li>
           <li :class="{default:a2}" @mouseenter="setTrueA2()" @mouseover="setTrueA2()" @click="setTrueA1()" @mouseout="setTrueA1()">
               <router-link :to="{ name: 'RuralIndicatorIndex'}">
                    <div class="title">{{$t( 'home.planningFeed.ruralStadistics')}}</div>
                    <img src="../../../assets/home/estadisticas.png">
               </router-link>
           </li>
           <li :class="{default:a3}" @mouseenter="setTrueA3()" @mouseover="setTrueA3()" @click="setTrueA1()" @mouseout="setTrueA1()">
               <div class="title">{{$t( 'home.planningFeed.geoVisor')}}</div>
               <img class="control" src="../../../assets/home/calendario_construccionTEXTO.png" v-if="a3">
               <img src="../../../assets/home/Mapa.png">
           </li>
       </ul>-->
    </div>
  </div>
</template>

<script>
import VAPI from '../../../http_common';
import { SERVICE_NAMES } from '@/sipsder_constants';

export default {
  data(){
    return {
      optionalImage: {
          url: null,
          type: null
      }
    }
  },
  methods: {
     getYTvideoCode(url){
          if(url.search("youtube")>0){
            var res = url.split("/")
            var rel = res[4].split("?")
            return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
          }
          else{
            return url
          }
      },
  },
  computed:{
    
  },
  components:{
  },
  mounted() {
   
  },
  async created( ) {
      //const response = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/general?book=false`)
        /*if( response.data != null ) {
                this.optionalImage.url = response.data.optionalImage
                this.optionalImage.type = response.data.optionalType
        }*/
  },
  beforeMount() {
    
  },
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@media screen  and (max-width:  1440px)
    .feed-body
        min-height: 99% !important
        max-height: 318px !important
    .planning-feed
        .title
            font-size: 20px !important
@media screen  and (max-width:800px)
    .feed-body
        min-height: 99% !important
        max-height: 349px !important
    .planning-feed
        .title
            font-size: 16px !important

.planning-feed
    width: 100%
    margin: 0 auto
    height: 100%
    display: grid
    grid-template-rows: 65px
    .title
        padding: 12px
        font-size: 28px
        font-weight: bold
        font-family: $fontBody
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        text-shadow: 2px 2px 4px #000000;
        a
        color: #fff
.feed-body
    height: 100%
    width: 100%
    margin: 0;
    overflow: hidden
    display: grid
    grid-template-columns: 32% 2% 32% 2% 32%
    background-image: url('../../../assets/home/Planning.png')
    background-repeat: no-repeat
    background-size: cover
    background-position: bottom center
    .separator
        background: linear-gradient(transparent, #fff);
    .image
        cursor: pointer
        position: relative
        transition: all .2s ease-in-out
        .title
            margin-top: 25px
            text-align: right
            background: linear-gradient( to right, transparent, #D38429);
        img
            position: absolute
            bottom: 15px
            left: 15%
            width: 70%
            transition: all .2s ease-in-out
        &:hover
            background: linear-gradient(transparent, transparent, #fff);
            img
                transform: scale(1.05)

                
</style>