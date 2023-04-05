<template>
    <div class="rural-carousel">
        <div class="grid-related">
            <div class="item-related clickable" v-for="(relatedN,i) in related" :key="i" @click="$emit('toDetail', relatedN)">
                <div class="image-related" v-if="relatedN[typeField]=='Video'">
                    <img class="fit-cover" :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '3px' }" :src="getYTvideoCode(relatedN[imageField])">
                </div>
                <div class="image-related" v-else>
                    <img class="fit-cover" :style="{'border-color': relatedN.ruralModels[0].color, 'border-style': 'solid','border-width': '3px' }" :src="getImgURL(relatedN[imageField])">
                </div>
                <b-row class="padded-end" align-h="end">
                  <div v-for="(ruralModel, i) in relatedN.ruralModels" :key="i"
                    class="text-right circle" :style="{ background: ruralModel.color }" v-b-tooltip.hover="ruralModel.label">
                  </div>
                </b-row>
                <slot name="info" v-bind:item="relatedN"/>
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
        },
        imageField: {
          type: String,
          default: 'image'
        },
        typeField: {
          type: String,
          default: 'type'
        }
    },
    methods: {
        scroll_left() {
            let content = document.querySelector(".grid-related");
            content.scrollLeft -= 300;
        },
        scroll_right() {
            let content = document.querySelector(".grid-related");
            content.scrollLeft += 300;
        },
        getImgURL (url) {
          return S_UTIL.getImgURL(url);
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
@import '../../stylesheets/style.sass'
$padding-const: 15px
$padding-offset: 60px

.clickable:hover
  cursor: pointer
.rural-carousel
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
    grid-auto-flow: column
    align-content: center
    justify-items: center
    grid-gap: $padding-const
    margin-top: $padding-const
    overflow: hidden
    scroll-behavior: smooth
    background: rgba(255,255,255,0.6)
    .item-related
      width: 370px
      margin: 0 25px
    img 
      max-width: 370px
      width: 400px
      max-height: 225px
      height: 225px
    .image-related
      text-align: center
      .fit-cover
        object-fit: cover
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
    .rural-carousel
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
