<template>
    <div>
        <div class="feed-title">{{$t('home.communityFeed.title')}}</div>
        <div class="col-90">
            <div v-for="(page,i) in pages" :key="i" class="grid-col">
                <div class="title">
                    <h2>{{$t(`home.communityFeed.${page.alias}`)}}</h2>
                     <sipsder-btn btnType="uploadImage" variant="primary" :text="$t('home.communityFeed.edit')" @onClick="showModal('addImageModal', i)"></sipsder-btn>
                </div>
                <div class="image">
                    <div class="img"><img :src="getImgURL(page.urlImage)" ></div>
                </div>
            </div>  
        </div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>
        <b-modal ref="errorEvent" :title="'Alerta del Sistema'"
        @ok="closeModal('errorEvent')"
        @cancel="closeModal('errorEvent')"
        >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import {COMMUNITY_CAROUSEL, SERVICE_NAMES} from '../../../sipsder_constants'
import VAPI from '../../../http_common'
import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
import { PERMISSIONS_TYPES, ATTACHMENT_TYPE} from '../../../domain_constants';
import S_UTIL from "../../../util/sipsder_util";

export default {
    components: {
      Audiovisualmedia
    },
    data(){
        return {
            COMMUNITY_CAROUSEL,
            pages: null,
            mediaOptions: [
                {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")}
            ],
            selected: 0,
            error: ''
        }
    },
    async beforeMount(){
        try {
            let alias = [COMMUNITY_CAROUSEL.RURAL_IMAGES, COMMUNITY_CAROUSEL.RURAL_SURVEY, COMMUNITY_CAROUSEL.RURAL_DOCUMENTS, COMMUNITY_CAROUSEL.RURAL_HISTORY]
            let result = await VAPI.get(`${SERVICE_NAMES.PAGE}/carousel?alias=${alias}`);
            this.pages = result.data.data;
        } catch (error) {
            console.info(error);
        }
    },
    methods : {
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        showModal(ref,i){
            this.$refs[ref].show();
            this.selected = i
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        created_image(response){
            this.closeModal('addImageModal')
            let image = _.find(this.eventAttach, { 'id': response[0]});
            if(!image){
                this.pages[this.selected].idImage = response[0]
                this.pages[this.selected].urlImage = response[1]
                VAPI.put(`${SERVICE_NAMES.PAGE}/carousel`, this.pages[this.selected]).then((output)=>{
                    this.error=""
                    this.error= this.$t('home.communityFeed.correct')
                    this.showModal("errorEvent",0)
                }).catch((e)=>{
                    this.error=""
                    this.error= this.$t('home.communityFeed.error')
                    this.showModal("errorEvent",0)
                })
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_3.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    height: 90px
    width: 105%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(12% + 40px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
.grid-col
    display: grid
    grid-template-columns: 49% 49%
    grid-gap: 2%
    margin: 10px auto
    width: 65%
    background: rgba(255,255,255,.8)
    border: 2px solid $colorTitle
    .title
        padding: 15px
    .image
        padding: 15px
        overflow: hidden
        .img
            text-align: center
            overflow: hidden
            background: #eee
            img
                height: 200px
    .colors-container
        width: 100%
        height: 30px
        .colors
            margin: 5px 0 0 5px
            width: 25px
            height: 25px
            border-radius: 50%
@media screen and (max-width: 1200px)
    .grid-col
        width: 75% !important
@media screen and (max-width: 800px)
    .grid-col
        grid-template-columns: 98% !important
        width: 85% !important
</style>
