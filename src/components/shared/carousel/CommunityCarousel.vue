<template>
    <div class="community-carousel">
        <div class="left-a" @click="scroll_left()"><i class="fa fa-angle-left" /></div>
        <div class="carousel">
            <div class="item" v-for="(page,i) in pageP" :key="i">
                <div v-if="page != undefined">
                    <router-link :to="{name: page.alias}" tag="div" v-if="page.alias !== 'CommunityLibrary' && page.alias !== 'CommunityImages'">
                        <div class="title"><h2>{{$t(`home.communityFeed.${page.alias}`)}}</h2></div>
                        <div class="img"><img :src=" getImgURL(page.urlImage)" ></div>
                        <div class="colors-container">
                            <div class="colors"
                                :style="{'background-color': page.ruralModelColor}" v-b-tooltip.hover :title="page.ruralModelName">
                            </div>
                        </div>
                        <p class="descript">{{page.descriptionImage}}</p>
                    </router-link>
                    <router-link :to="{name: page.alias}" tag="div" v-else-if="page.alias == 'CommunityImages'">
                        <div class="title"><h2>{{$t(`home.communityFeed.${page.alias}`)}}</h2></div>
                        <div v-if="ruralImages != null && ruralImages[selectRImage] != undefined">
                            <div class="img"><img :src=" getImgURL(ruralImages[selectRImage].url)" ></div>
                            <div class="colors-container">
                                <div class="colors"
                                    :style="{'background-color': ruralImages[selectRImage].ruralModelColor}" v-b-tooltip.hover :title="ruralImages[selectRImage].ruralModelName">
                                </div>
                            </div>
                            <p class="descript">{{ruralImages[selectRImage].description}}</p>
                        </div>
                        <div v-else>
                        <div class="img"><img :src="getImgURL(page.urlImage)" ></div>
                            <div class="colors-container">
                                <div class="colors"
                                    :style="{'background-color': page.ruralModelColor}" v-b-tooltip.hover :title="page.ruralModelName">
                                </div>
                            </div>
                            <p class="descript">{{page.descriptionImage}}</p>
                        </div>
                    </router-link>
                    <router-link :to="{name: page.alias, params: {community : 'community'}}" tag="div" v-else>
                    <div class="title"><h2>{{$t(`home.communityFeed.${page.alias}`)}}</h2></div>
                        <div class="img"><img :src="getImgURL(page.urlImage)" ></div>
                        <div class="colors-container">
                            <div class="colors"
                                :style="{'background-color': page.ruralModelColor}" v-b-tooltip.hover :title="page.ruralModelName">
                            </div>
                        </div>
                        <p class="descript">{{page.descriptionImage}}</p>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="right-a" @click="scroll_right()"><i class="fa fa-angle-right" /></div>
    </div>
</template>

<script>
import {COMMUNITY_CAROUSEL, SERVICE_NAMES} from '../../../sipsder_constants'
import VAPI from '../../../http_common'
import S_UTIL from '../../../util/sipsder_util'

export default {
    data(){
        return {
            COMMUNITY_CAROUSEL,
            pages: null,
            pageP: null,
            scroll: 0,
            timer: '',
            timer2: '',
            ruralImages: [],
            selectRImage: 0
        }
    },
    created: function() {
       
        this.timer = setInterval(this.scroll_right_auto, 18000)
        this.timer2 = setInterval(e=>{
            this.selectRImage+=1 
            if(this.selectRImage>this.ruralImages.length-1) this.selectRImage = 0
        }, 3000)
    },
    async beforeMount(){
        try {
            let alias = [COMMUNITY_CAROUSEL.RURAL_IMAGES, COMMUNITY_CAROUSEL.RURAL_SURVEY, COMMUNITY_CAROUSEL.RURAL_DOCUMENTS, COMMUNITY_CAROUSEL.RURAL_HISTORY]
            let result = await VAPI.get(`${SERVICE_NAMES.PAGE}/carousel?alias=${alias}`);
            this.pages = result.data.data;
            if(this.pages != null && this.pages != undefined) {
                this.pageP = this.orderPages()
            } 
        } catch (error) {
            console.error(error);
        }
        try{
            let response3 = await VAPI.get(`/${SERVICE_NAMES.RURAL_IMAGES}?page0&size=6&status=2&type=2&sort=createdAt,desc&sort=id,desc`);
            this.ruralImages= response3.data.data;
        }
        catch(e){
            console.log(e);
        }
    },
    methods : {
        getImgURL(url){
            return S_UTIL.getImgURL(url);
        },
        orderPages(){
            let pageAlt =[]
            pageAlt.push(this.pages.filter(page=>{return page.alias == COMMUNITY_CAROUSEL.RURAL_HISTORY})[0])
            pageAlt.push(this.pages.filter(page=>{return page.alias == COMMUNITY_CAROUSEL.RURAL_IMAGES})[0])
            pageAlt.push(this.pages.filter(page=>{return page.alias == COMMUNITY_CAROUSEL.RURAL_SURVEY})[0])
            pageAlt.push(this.pages.filter(page=>{return page.alias == COMMUNITY_CAROUSEL.RURAL_DOCUMENTS})[0])
            return pageAlt
        },
        scroll_left() {
            let content = document.querySelector(".community-carousel>.carousel");
            let width = content.offsetWidth
            if((this.scroll - width) <= 0) {
                content.scrollLeft = 0
                this.scroll = 0
            }
            else{
                this.scroll -= width
                content.scrollLeft = this.scroll;
            }
        },
        scroll_right() {
            let content = document.querySelector(".community-carousel>.carousel");
            let width = content.offsetWidth
            this.scroll += width;
            content.scrollLeft = this.scroll

            if(this.scroll  > (content.scrollWidth)) {
                this.scroll = 0;
                content.scrollLeft = this.scroll
            }
        },
        scroll_right_auto() {
            let content = document.querySelector(".community-carousel>.carousel");
            let width = content.offsetWidth
            this.scroll += width;
            content.scrollLeft = this.scroll
            if(this.scroll  > (content.scrollWidth)) {
                this.scroll = 0;
                content.scrollLeft = this.scroll
            }
        },
        cancelAutoUpdate: function() { clearInterval(this.timer) }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="sass" scoped>
.community-carousel
    position: relative
    height: 100%
    margin: 0
    width: 100%
    font-size: 16px
    display: grid
    grid-template-columns: 15% 70% 15%
    overflow: hidden
    .left-a, .right-a
        text-align: center
        line-height: 400px
        font-size: 32px
        cursor: pointer
        transition: all .1s ease-in-out
        color:  #333
        text-shadow: 0px 0px 2px #fff
        &:hover
            font-size: 40px
    .carousel
        display: grid
        grid-template-columns: repeat(4,49%)
        grid-gap: 1%
        grid-auto-flow: column
        align-content: center
        justify-items: center
        overflow: hidden
        scroll-behavior: smooth
        padding-left: 3px
        div.item
            padding: 5px
            border: 3px solid transparent
            margin-top: 15px
            height: 100%
            width: 100%
            cursor: pointer
            position: relative
            background-repeat: no-repeat
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            transition-duration: 0.3s;
            transition-property: box-shadow, transform;
            background-color: rgba(255,255,255,0.7)
            .descript
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
            &:hover
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
                transform: scale(1.02);
            .title
                display: block
                min-height: 60px
            .colors-container
                width: 100%
                height: 30px
                .colors
                    margin: 5px 0 0 5px
                    width: 25px
                    height: 25px
                    border-radius: 50%
            img
                max-width: 100%
                min-height: 150px
                max-height: 150px
            .img
                height: 100%
                text-align: center

@media screen and (max-width: 1200px)
    .community-carousel
        .left-a, .right-a
            line-height: 330px !important
    .carousel
        div.item
            .title
                min-height: 60px !important
            img
                max-width: 100% !important
                min-height: 110px !important
                max-height: 110px !important
            .img
                height: 100% !important
                text-align: center !important

@media screen and (max-width: 800px)
    .carousel
        grid-template-columns: repeat(4,99%) !important
        div.item
            .img
                height: 100% !important
                text-align: center !important
            img
                max-width: 99% !important
                min-height: 110px !important
                max-height: 110px !important
</style>
