<template>
    <div class="news-carousel">
        <div class="grid-related">
            <div class="item-related" v-for="(relatedN,i) in related" :key="i">
                <div class="image-related" v-if="relatedN.type=='Video'">
                  <router-link :to="{ name: 'EventDetail', params: { id: relatedN.id , url: relatedN.url }}">
                    <img :style="{'border-color': relatedN.color[0], 'border-style': 'solid','border-width': '3px' }" :src="getYTvideoCode(relatedN.image)">
                  </router-link>
                </div>
                <div class="image-related" v-else>
                  <router-link :to="{ name: 'EventDetail', params: { id: relatedN.id , url: relatedN.url }}">
                    <img :style="{'border-color': relatedN.color[0], 'border-style': 'solid','border-width': '3px' }" :src="getImgURL(relatedN.image)">
                  </router-link>
                </div>
                <b-row class="padded-end" align-h="end">
                  <div v-for="(color, i) in relatedN.color" :key="i"
                    class="text-right circle" :style="{ background: color }">
                  </div>
                </b-row>
                <div class="title-related">
                  <router-link :to="{ name: 'EventDetail', params: { id: relatedN.id , url: relatedN.url }}">
                    {{relatedN.name}}
                  </router-link>
                </div>
                <div class="date-related">{{$t('event_detail.start')}} {{relatedN.start | moment("DD MMM YYYY - h:mm a")}}</div>
                <div class="date-related">{{$t('event_detail.end')}} {{relatedN.end | moment("DD MMM YYYY - h:mm a")}}</div>
            </div>
        </div>
        <button class="previmg" @click="scroll_left()"><i class="fas fa-caret-left"></i></button>
        <button class="nextimg" @click="scroll_right()"><i class="fas fa-caret-right"></i></button>
    </div>
</template>

<script>
import S_UTIL from "@/util/sipsder_util";

export default {
    props:{
        related: {
            type: Array,
            default: []
        }
    },
    methods: {
        getImgURL (url) {
          return S_UTIL.getImgURL(url);
        },
        scroll_left() {
            let content = document.querySelector(".grid-related");
            content.scrollLeft -= 300;
        },
        scroll_right() {
            let content = document.querySelector(".grid-related");
            content.scrollLeft += 300;
        },
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
}

</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
$padding-const: 15px
$padding-offset: 60px
.news-carousel
    position: relative
    width: 100%
    margin-left: 15px
    button
        background: white
        border-radius: 3px
        font-size: 5rem
        color: $colorTitle
        font-weight: bold
        border: 1px solid transparent
    .previmg
        position: absolute
        left: -2.5%
        top: 0
        height: 100%
    .nextimg
        position: absolute
        right: -2.5%
        top: 0
        height: 100%
.grid-related 
    padding: 15px
    display: grid
    grid-template-columns: 33% 33% 33% 33% 33% 33% 
    grid-auto-flow: column
    align-content: center
    justify-items: center
    grid-gap: $padding-const
    margin-top: $padding-const
    overflow: hidden
    scroll-behavior: smooth
    background: rgba(255,255,255,0.6)
    .item-related
      margin: 0 25px
      width: 370px
    img 
      max-width: 370px
      width: 400px
      max-height: 225px
      height: 225px
    .image-related
      text-align: center
    .circle
      border-radius: 50%
      height: 20px
      width: 20px
      border: 3px solid transparent
      margin: 0px 5px 0px 5px
    .padded-end
      padding: 10px 10px 5px 10px
    .clasification-related
      font-family:Palatino Linotype
      font-style: italic
      font-size: 1.5rem
    .date-related
      color: #6d6e71
      font-size: 1.25rem
    .title-related, .description-related
      font-weight: bold
      font-size: 1.5rem
      color: #555
      a
        color: #000
        text-decoration: none
        &:hover 
          text-decoration: underline
    .description-related
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

@media screen and (max-width: $widthMobile)
    .grid-related 
      grid-template-columns: auto  !important
      max-width: 560px !important
      .item-related
        width: 270px !important
        margin: 0 auto
      img 
        width: 100%
        max-height: 169px !important
        height: 169px !important
    .news-carousel
        margin-left: 0px
        .previmg
            background: rgba(0,0,0,0)
            left: -5% !important
            transform: translateX(-40%) !important
        .nextimg
            background: rgba(0,0,0,0)
            right: -5% !important
            transform: translateX(40%) !important

@media screen  and (max-width: 1600px) and (min-width: $widthMobile)
    .grid-related 
      grid-template-columns: auto  !important
      max-width: 1200px !important
      .item-related
        width: 300px !important
      img 
        max-width: 300px !important
        width: 300px !important
        max-height: 169px !important
        height: 169px !important

</style>
