<template>
    <div>
        <transition name="fade"><div class="protector" v-if="isPreview"></div></transition>
        <div class="feed-title">{{ $t( 'community.images.title' ).toUpperCase( ) }}</div>
        <div class="container-form col-90">
             <div class="note">
                <div class=text v-if="note != undefined && note != null">
                        <div v-for="(notei, i) in note"  :key="i">
                            <div v-if="isAdministrator">
                                <sipsder-btn btnType="edit_pen" :text="$t('community.images.enable_edit')" @onClick="isEditNote = true" v-if="!isEditNote"></sipsder-btn>
                                <sipsder-btn text="Cancelar" btnType="cancel" @onClick="unSetEdit" v-if="isEditNote"></sipsder-btn>
                                <sipsder-btn text="Guardar" btnType="add" @onClick="updateNote(notei)" v-if="isEditNote"></sipsder-btn>  
                            </div>
                            <rich-text-preview :content="notei.content" v-if="!isEditNote"/>
                            <rich-text :options="customToolbar" @changeValue="changeValueNote" :newContent="notei.content" v-else></rich-text>
                        </div>
                </div>
            </div>
            <br>
            <div class="filter-box">
                <div class="legend">{{ $t( 'community.images.filter' ).toUpperCase( ) }}</div>
                <div class="grid-col">
                    <treeselect v-model="selectedQueryModel" 
                        :multiple="true" 
                        :options="ruralModels"
                        :openDirection="'below'"
                        :placeholder="$t( 'faqs.modal.rural_select' )"
                        :clearable="true"
                        :default-expand-level="1">
                        <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                            <img v-if="node.raw && node.raw.url != null" 
                                :src="getImgURL(node.raw.url)" height="16" width="16">
                            <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                            <span> {{ node.label.split('/')[0] }} </span>
                            <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                            <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                        </label>
                    </treeselect>
                    <b-form-group
                        :label-cols="4"
                        label="" >
                        <b-form-radio-group id="radios1" label="label" :options="radioOptions" v-model="filterType" name="radioOpenions" stacked style="color: #fff"></b-form-radio-group>
                    </b-form-group>
                    <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                        <b-form-input :placeholder="$t( 'calendar.q')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                    <div>
                        <sipsder-btn btnType="search" @onClick="loadMore"></sipsder-btn>
                        <sipsder-btn btnType="clean" @onClick="clearfilter" ></sipsder-btn>
                    </div>
                </div>
            </div>
            <div class="image-list">
                <div class="info-filter">
                    <div class="info">
                        <h2>{{$t( 'community.images.gallery' ).toUpperCase( )}}</h2> <br>
                        <span style="color:#333">{{$t( 'community.images.imagesTotal' )}} {{items.length}}</span>
                    </div>
                    <div class="sort">
                         <b-form-group :label-cols="4" label-class="font-weight-bold">
                            <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderOps"></v-select>
                        </b-form-group>
                    </div>
                    <sipsder-btn btnType="add" :text="$t('community.images.add_audiovisual')" @onClick="$router.push({name: 'AudiovisualModify'})" v-if="isLogged"></sipsder-btn>
                </div>
                <stack :column-min-width="338" :gutter-width="0" :gutter-height="0" :monitor-images-loaded="true">
                    <stack-item v-for="(item, i) in items" :key="i" style="transition: transform 300ms">
                        <div class="item-relative item-image" :style="{'border-color': item.ruralModelColor, 'border-style': 'solid','border-width': '7px' }" @click="openModal(i)">
                            <div class="imgPlaceHolder" >
                                <span>{{item.title}}</span>
                                <span>Por: {{item.author}}</span>
                            </div>
                            <img src="../../../assets/icons-button-svg/imagen_video.svg" class="item-absolute imgPlay" v-if="item.idType == ATTACHMENT_TYPE.VIDEO ">
                            <img :src="getYTvideoCode(item)" alt="" class="imgPure" v-if="item.idType != ATTACHMENT_TYPE.VIDEO">
                            <img :src="getYTvideoCode(item)" alt="" class="imgPure" v-if="item.idType == ATTACHMENT_TYPE.VIDEO && isYouTube(item.url)">
                            <b-embed v-else-if="item.idType== ATTACHMENT_TYPE.VIDEO && !isYouTube(item.url)"
                                        type="video" aspect="16by9" controls style="border: 1px solid black;">
                                        <source :src="getVideoURL(item.url)" type="video/mp4">
                            </b-embed>
                        </div>
                    </stack-item>
                </stack>
                <hr>
                <div class="grid-footer" v-if="meta">
                    <sipsder-btn btnType="edit_pen" :text="$t('community.images.edit_audiovisual')" style="text-align:left" @onClick="$router.push({name: 'AudioVisualAdmin'})" v-if="isLogged"></sipsder-btn>
                    <sipsder-btn btnType="add" :text="$t('community.images.load_content')" @onClick="addMore" v-if="filterParams.page<meta.totalPages" style="text-align:right"></sipsder-btn>
                </div>
            </div>
            <transition name="fade">
                <div class="pop-up" v-if="isPreview">
                    <div class="pop-up-container">
                        <div class="buttons">
                            <sipsder-btn btnType="edit_pen" style="text-align:left" v-if="isAdministrator  || (isLogged && userId == currentUser.id)" @onClick="editImage(items[itemIndex].id)"></sipsder-btn>
                            <sipsder-btn btnType="cancel" text="" style="" @onClick="closePreview"></sipsder-btn>
                        </div>
                        <div class="body-grid">
                            <div class="image-container">
                                <span v-if="isAdministrator || (isLogged && userId == currentUser.id)"><b>{{items[itemIndex].statusName}}</b></span>
                                <span v-b-tooltip.hover :title="items[itemIndex].title"><h2>{{items[itemIndex].title}}</h2></span>
                                <b>{{$t( 'community.images.geoParent' )}} </b> {{items[itemIndex].nameGeographyParent}} - <b>{{$t( 'community.images.geoChild' )}} </b> {{items[itemIndex].nameGeography}}
                                <br>
                                <span>{{$t( 'library.visor.addFor' )}} <i class="fas fa-user"></i> {{items[itemIndex].userName}} {{items[itemIndex].userLastName}}, {{items[itemIndex].userType}}</span>
                                <br>
                                <br>
                                <div class="audiovisual" :style="{'border-color': items[itemIndex].ruralModelColor, 'border-style': 'solid','border-width': '7px' }">
                                    <iframe :src="items[itemIndex].url" 
                                        v-if="items[itemIndex].idType== ATTACHMENT_TYPE.VIDEO && isYouTube(items[itemIndex].url)" 
                                        frameborder="0"  
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen>
                                    </iframe>
                                    <b-embed v-else-if="items[itemIndex].idType== ATTACHMENT_TYPE.VIDEO && !isYouTube(items[itemIndex].url)"
                                        type="video" aspect="16by9" controls style="border: 1px solid black; height:386px;">
                                        <source :src="getVideoURL(items[itemIndex].url)" type="video/mp4">
                                    </b-embed>
                                    <img :src="getImgURL(items[itemIndex].url)" v-else >
                                </div>
                                <div class="colors-container">
                                    <div class="colors" key="j"
                                        :style="{'background-color': items[itemIndex].ruralModelColor}" v-b-tooltip.hover :title="items[itemIndex].ruralModelName">
                                    </div>
                                </div>
                                <div class="participate"><social-networks-share :exactUrl="items[itemIndex].url"></social-networks-share>
                                <report-component :contentId="items[itemIndex].idDecript" 
                                    :content-type="REPORT_CONTENT_TYPES.ATTACHMENT"></report-component>
                                 <score-component :idContent="items[itemIndex].idDecript" 
                                :idType="SCORE_CONTENT_TYPE.ATTACHMENT"
                                :likes="items[itemIndex].likes"
                                :dislikes="items[itemIndex].dislikes"></score-component></div>
                            </div>
                            <div class="info-container">
                                {{$t( 'community.images.imageCreated' )}} {{ items[itemIndex].createdAt  | moment( "DD [del] MM [del] YYYY, h:mm:ss a" )}} <br>
                                <hr>
                                <div v-html="items[itemIndex].description" class="info"></div>
                                <div>
                                    <s-comment :parentId="items[itemIndex].idDecript" typeParent="attachment"></s-comment>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </transition>
            <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>     
        </div>
        <b-modal ref="alertModal" :title="$t('modal.title')" hide-footer size="lg">
          <b-row class="w-100 center" >
            <div v-html="$t('community.images.logNote')"></div>
            <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="accept" :text="$t('community.images.btn_close')" @onClick="closeModal('alertModal')"></sipsder-btn>
                <sipsder-btn btnType="login" :text="$t('community.images.btn_action')" v-b-modal.login></sipsder-btn>
            </div>
          </b-row>
      </b-modal>  
    </div>
</template>

<script>
import { Stack, StackItem } from 'vue-stack-grid';
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, MODULES, ATTACHMENT_TYPE} from '../../../domain_constants'
import VAPI from '../../../http_common';
import moment from 'moment';
import 'moment/locale/es' ;
import RichText from '../../shared/RichText.vue'
import RichTextPreview from '../../shared/RichTextPreview.vue'
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import { SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
import CommentCmp from "../../shared/comment/CommentComponent.vue"
import S_UTIL from "../../../util/sipsder_util";

export default {
    components: { 
        Stack,
        StackItem ,
        Treeselect,
        "v-select": vSelect,
        RichText,
        RichTextPreview,
        SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        "s-comment" : CommentCmp,
    },
    data(){
        return{
            SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES,
            isEditNote: false,
            note: null,
            isPreview: false,
            itemIndex: 0,
            ATTACHMENT_TYPE,
            ruralModels: [],
            selectedQueryModel: [],
            filterQ: "",
            filterType: null,
            filterOrderOps:[
                {
                value: "createdAt,desc",
                label: this.$t( 'community.images.recent' )
                },
                {
                value: "title,desc",
                label: this.$t( 'community.images.titleF' )+" ↓"
                },
                {          
                value: "title,asc",
                label: this.$t( 'community.images.titleF' )+" ↑"
                },
                 {
                value: "author,desc",
                label: this.$t( 'community.images.author' )+" ↓"
                },
                {          
                value: "author,asc",
                label: this.$t( 'community.images.author' )+" ↑"
                }
            ],
            filterOrder:{value: "createdAt,desc", label: this.$t( 'community.images.recent' )},
            radioOptions:[
                {
                    text: this.$t('community.images.filter_image'),
                    value: ATTACHMENT_TYPE.PUBLIC_IMAGE
                },
                {
                    text: this.$t('community.images.filter_video'),
                    value: ATTACHMENT_TYPE.VIDEO
                }
            ],
             filterParams: {
                page: 1,                    // Page number
                size: 25,                   // Page size
            },
            items:[],
            meta: null,
            customToolbar: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ['link', 'image', 'video', 'formula'],
                [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }]
            ],
        }
    },
    async beforeMount(){
        document.documentElement.style.overflow = 'auto'
        try{
            let response3 = await VAPI.get(`/${SERVICE_NAMES.RURAL_IMAGES}` + this.buildQuery());
            this.items= response3.data.data;
            this.meta = response3.data.meta

            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
            this.ruralModels = response.data.data;

            let response2 = await VAPI.get(`/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.RURAL_IMAGES}`);
            this.note = response2.data.data;
        }
        catch( error ) {
            console.log( 'Error fetching images', error );
        }
        if(!this.isLogged) this.showModal("alertModal")
    },
    beforeDestroy(){
        document.documentElement.style.overflow = 'auto'
    },
    computed:{
         isAdministrator() {
            let isAdmin = false;
            if (this.$store.getters.isAuthenticated)
                if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                isAdmin = true     
            return isAdmin;
        },
        isLogged() {
            return this.$store.getters.isAuthenticated
        },
        currentUser(){
            return this.$store.getters.getCurrentUser
        }
    },
    watch: {
      isPreview: function (isOpen) {
        if (isOpen) {
          document.documentElement.style.overflow = 'hidden'
          // document.documentElement is the same as using document.querySelector('#root')
        } else {
          document.documentElement.style.overflow = 'auto'
        }
      }
    },
    methods:{
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        getVideoURL (url) {
            return S_UTIL.getVideoURL(url);
        },
        isYouTube(url) {
            return url.length > 0 && url.search("youtube")>0;
        },
        editImage(id){
            document.documentElement.style.overflow = 'auto'
            this.$router.push({name: 'AudiovisualModify', params:{id:id}})
        },
        buildQuery() {
            let query = '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;
            query += '&status=2'
            if( this.filterType !== null ) query += '&type=' + this.filterType;
            else query += '&type=2,3'
            if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
            if(this.selectedQueryModel.length > 0) query += '&ruralModels=' + this.selectedQueryModel;
            if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value + "&sort=id,desc"
            else query += '&sort=createdAt,desc&sort=id,desc'
            return query;
        },
        async loadMore(){
            this.items=[]
            this.meta=[]
            try{
                const response3 = await VAPI.get(`/${SERVICE_NAMES.RURAL_IMAGES}` + this.buildQuery());
                this.items= response3.data.data;
                this.meta = response3.data.meta
            }
            catch( error ) {
                console.log( 'Error fetching images', error );
            }
        },
        openModal(index){
            this.isPreview = true
            this.itemIndex = index
        },
        closePreview(){
            this.isPreview = false
            this.itemIndex = 0
        },
        async addMore(){
            this.filterParams.page += 1
            if(this.filterParams.page>this.meta.totalPages) this.filterParams.page= this.meta.totalPages
            try{
                const response3 = await VAPI.get(`/${SERVICE_NAMES.RURAL_IMAGES}` + this.buildQuery());
                this.items = this.items.concat(response3.data.data);
                this.meta = response3.data.meta
            }
            catch( error ) {
                console.log( 'Error fetching images', error );
            }
        },
        clearfilter(){
            this.filterParams = { page: 1, size: 25, }
            this.filterOrder = {value: "createdAt,desc", label: this.$t( 'community.images.recent' )}
            this.filterQ = ""
            this.filterType =  null
            this.selectedQueryModel = []
            this.loadMore()
        },
        getYTvideoCode(item){
            let url =""
            if(item.idType == ATTACHMENT_TYPE.VIDEO){
                if(item.url.search("youtube")>0) {
                    url= item.url
                    var res = url.split("/")
                    var rel = res[4].split("?")
                    return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
                } else {
                    return this.getVideoURL(item.url)
                }
            }
            else{
                return this.getImgURL(item.url)
            }
        },
        async reloadNotes(){
            try{
                let response2 = await VAPI.get( `/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.RURAL_IMAGES}` );
                this.note = response2.data.data
            }
            catch( error ) {
                console.log( 'Error fetching Notes', error );
            }
        },
        unSetEdit(){
            this.isEditNote = false
            this.reloadNotes()
        },
        updateNote(note){
            VAPI.put(`/${SERVICE_NAMES.SIPSDER_NOTE}/update`, note).then((output)=>{
                this.unSetEdit()
            }).catch((e)=>{
                alert("Error actualizando Nota. "+ e)
            })
        },
        changeValueNote(value){
            this.note[0].content = value
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
    }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@media screen  and (max-width: $widthTablet)
    h2
        font-size: 1rem !important
    .col-90
        width: 80% !important
    .grid-col
        grid-template-columns: 100% !important
    .item-image
        max-width: 300px !important

    .pop-up-container
        width: 80% !important
        margin: 0 auto
        .body-grid
            grid-template-columns: 100% !important
            .image-container
                height: 100%
                span
                    display: block
                    h2
                        display: block
                        white-space: nowrap
                        overflow: hidden
                        text-overflow: ellipsis
                .audiovisual
                    width: 100%
                    background: #eee
                    height: 400px
                    img
                        display: block
                        margin: auto
                        width: auto
                        max-width: 100%

                        height: 100%
                    iframe
                        width: 100%
                        height: 100%
                .participate
                    display: flex
                    & > div
                        margin-right: 15px
            .info-container
                word-wrap: break-word
                height: 100%
                hr
                    border-image-source: linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)
                    border-image-slice: 1
                .info
                    max-height: 25%
                    overflow-y: auto
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
    .info-filter
        height: 90px !important
        .info
            position: unset !important
        .sort
            position: unset !important
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_3.png)
  background-repeat: no-repeat
  background-size: 100% 100%
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
    background: rgba(255,255,255,.8)
.protector
    position: absolute
    top: 0
    left: 0
    height: 100%
    width: 100%
    z-index: 3
    background: rgba(0,0,0,.3)
.colors-container
    width: 100%
    height: 30px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: right
.pop-up
    position: fixed
    top: 16%
    left: 0
    max-height: 83vh
    width: 100%
    background: rgba(0,0,0,.8)
    padding: 20px 5%
    z-index: 4
    overflow: auto
    .pop-up-container
        position: relative
        .buttons
            position: absolute
            top: -60px
            right: 0
        .body-grid
            color:#fff
            margin-top: 50px 
            display: grid
            grid-template-columns: 48% 48%
            grid-gap: 2%
            .image-container
                height: 100%
                span
                    display: block
                    h2
                        display: block
                        white-space: nowrap
                        overflow: hidden
                        text-overflow: ellipsis
                .audiovisual
                    width: 100%
                    background: #eee
                    height: 400px
                    img
                        display: block
                        margin: auto
                        width: auto
                        max-width: 100%

                        height: 100%
                    iframe
                        width: 100%
                        height: 100%
                .participate
                    display: flex
                    & > div
                        margin-right: 15px
            .info-container
                word-wrap: break-word
                height: 100%
                hr
                    border-image-source: linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)
                    border-image-slice: 1
                .info
                    max-height: 25%
                    overflow-y: auto
img.imgPure
    width: 100%
    cursor: pointer
img.imgPlay
    width: 50px
.imgPlaceHolder
    padding: 5px
    width: 100%
    min-height: 25%
    height: auto
    position: absolute
    bottom: 0
    background-color: rgba(0,0,0,.5)
    color: #fff
    opacity: 0
    transition: all .2s ease-in-out
    display: flex
    justify-content: flex-end
    flex-direction: column
    span
        display: block
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
.item-image
    margin: 12px
    max-width: 338px
    transition: all .2s ease-in-out
    &:hover
         transform: scale(0.95)
         .imgPlaceHolder
            opacity: 100 !important
.item-relative
    position: relative
    .item-absolute
        position: absolute
.grid-col
    display: grid
    grid-template-columns: 29% 19% 23% 23%
    grid-gap: 2%
    align-items: center
    justify-items: center
.image-list
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    min-height: 500px
    margin-top: 20px
    padding: 30px 15px 15px 15px
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    .info-filter
        position: relative
        height: 60px
        margin-bottom: 50px
        padding-top: 40px
        text-align: right
        .info
            position: absolute
            top: 0 
            left: 0
            text-align: left
        .sort
            position: absolute
            top: 0 
            right: 0
            min-width: 160px
    hr
        border-bottom: 3px solid $colorTitle
        margin-left: -15px
        width: calc(100% + 30px)
.filter-box
    background: $colorTitleDark
    padding: 15px 15px 15px 15px
    border-radius: 10px
    .legend
        color: #fff
        font-weight: bold
        font-family: $fontBody
        font-size: 2rem
        margin-bottom: 15px
.grid-footer
    display: grid
    grid-template-columns: 1fr 1fr
.fade-enter-active, .fade-leave-active 
    transition: opacity .5s
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ 
    opacity: 0
.dot
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
.grey-label-text
  color: grey
</style>
