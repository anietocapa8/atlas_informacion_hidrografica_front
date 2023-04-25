<template>
    <div class="news-carousel">
        <div class="grid-related">
            <div class="item-related" v-for="(relatedN,i) in related" :key="i">
                <div class="image-related" v-if="relatedN.imageType=='Video'">
                    <img :style="{'border-color': relatedN.color, 'border-style': 'solid','border-width': '7px' }" :src="getYTvideoCode(relatedN.image)">
                </div>
                <div class="image-related" v-else>
                    <img  :style="{'border-color': relatedN.color, 'border-style': 'solid','border-width': '7px' }" :src="getImgURL(relatedN.image)">
                </div>
                <div class="colors-container">
                    <div class="colors"
                          :style="{'background-color':relatedN.color}" v-b-tooltip.hover :title="relatedN.clasification">
                      </div>
                </div>
                <!--<div class="clasification-related" :style="{'color': relatedN.color}">{{relatedN.clasification}}</div>-->
                <div class="date-related">{{relatedN.date}}</div>
                <div class="title-related"><router-link :to="{ name: 'NewsDetail', params: { id: relatedN.id , url: relatedN.url }}">{{relatedN.headline}}</router-link></div>
                <div class="description-related">{{relatedN.resume}}</div>
            </div>
        </div>
        <button class="previmg" @click="scroll_left()"><i class="fas fa-caret-left"></i></button>
        <button class="nextimg" @click="scroll_right()"><i class="fas fa-caret-right"></i></button>
    </div>
</template>

<script>
import S_UTIL from "@/util/sipsder_util";

export default {
    props:['related'],
    methods: {
        getImgURL(url) {
          return S_UTIL.getImgURL(url)
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
            return this.getImgURL(url)
          }
      },
    },
}

</script>

<style lang="sass" scoped>
@import '../../stylesheets/style.sass'
$padding-const: 15px
$padding-offset: 60px
.colors-container
  width: 100%
  height: 30px
  .colors
    margin: 5px 0 0 5px
    width: 25px
    height: 25px
    border-radius: 50%
    float: right
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
    .clasification-related
      font-family:Palatino Linotype
      font-style: italic
      font-size: 1.5rem
    .date-related
      color: #6d6e71
      font-size: 1.25rem
    .title-related, .description-related
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
        width: 210px !important
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
