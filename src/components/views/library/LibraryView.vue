<template>
    <div>
        <div class="feed-title">{{$t( 'library.visor.title' )}}</div>
        <div v-if=" (documentName != undefined &&  documentName != '' ) || (id != undefined && id != '')" class="col-90 container-form">
            <div>
                <div v-if="detail" class="info">
                    <div class="top-grid">
                        <div class="float-right">
                            <sipsder-btn btnType="add" :text="$t('library.visor.edit_document')" 
                                @onClick="$router.push({ name: $route.meta.nextCreate, params:{id: detail.id}})" 
                                v-if="isAdministrator && !isTrackingBulletin"
                            ></sipsder-btn>
                        </div>
                    </div>
                    <div class="info-document">
                        <div class="icon">
                            <span v-html="getStatus(detail.statusId)" v-if="isAdministrator" ></span>
                            <img :src="detail.icon"><br>
                            <span style="display: inline-block; margin-top: -10px">{{detail.typeName}}</span>
                        </div>
                        <div class="text">
                            <b>{{detail.title}}</b><br>
                            {{$t( 'library.author' )}}: <span v-for="(author,i) in detail.authors" :key="i">{{author.name}} {{author.lastName}} ,</span><br>
                            {{$t( 'library.year' )}}: {{detail.year}}<br>
                            {{detail.summary}}<br>
                            <div class="colors-container" >
                                <div class="colors" v-for="(r, j) in detail.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                            </div><br>
                            <div class="load">{{$t( 'library.visor.addFor' )}} <i class="fas fa-user"></i> {{detail.userName}} {{detail.userLastName}}, {{detail.userType}}</div>
                        </div>
                    </div> 
                    <div class="share-grid">
                        <div class="share" v-if="detail != null">
                            
                            <social-networks-share></social-networks-share>
                            
                            <score-component :idContent="detail.id" 
                            :idType="SCORE_CONTENT_TYPE.DOCUMENTS"
                            :likes="detail.likes"
                            :dislikes="detail.dislikes"></score-component>

                            <report-component :contentId="detail.id" 
                            :content-type="REPORT_CONTENT_TYPES.DOCUMENTS"></report-component> 
                        </div>
                    </div>  
                </div>
            </div>
            <document-view :id="Number(id)"></document-view>
        </div>
        <div v-else class="col-90 container-form">
           <div class="message"> {{$t( 'library.visor.noDocument' )}} </div>
        </div>
        <div style="text-align:center">
            <sipsder-btn btnType="back" @onClick="$router.go(-1)">
            </sipsder-btn> 
            <sipsder-btn btnType="back" v-if="!isTrackingBulletin" :text="$t( 'library.visor.returnLibrary' )" @onClick="$router.push( { name: $route.meta.prevList } )">
            </sipsder-btn>
        </div>
    </div>
</template>

<script>
import DocumentView from '../../shared/DocumentView.vue';
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import DownloadDocument from "../../shared/DownloadDocument.vue";
import { PERMISSIONS_TYPES, DOCUMENT_TYPES } from '../../../domain_constants'
import VAPI from '../../../http_common';
import vSelect from "vue-select";
import { SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES, SERVICE_NAMES } from '../../../sipsder_constants';
import _ from 'lodash';
import moment from 'moment';
export default {
    components:{
        "document-view": DocumentView,
        SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        DownloadDocument,
        "v-select": vSelect,
    },
    data(){
      return{
            SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES,
            documentName: null,
            detail: null,
            id: null,
      }
    },
    computed: {
        isAdministrator( ) {
            if(this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) && !this.$route.meta.isCommunity) 
                return true
            
            let isAdmin = false;
            if (this.$store.getters.isAuthenticated && this.$route.meta.isCommunity)
                if(	this.detail.userId == this.$store.getters.getCurrentUser.id || this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                    isAdmin = true
            return isAdmin;
        },
        isTrackingBulletin( ) {
            if (this.detail != null) {
                return this.detail.typeId == DOCUMENT_TYPES.RURAL_INDICATOR_BULLETIN;
            }
        }
    },
    created() {
        this.id = this.$route.params.id
    },
    async beforeMount() { 
        try{
            let response = await VAPI.get(`${SERVICE_NAMES.RURAL_DOCUMENTS}/detail?id=${this.id}`);
            this.detail = response.data;
        } catch( error ) {
            console.log( 'Error fetching Document', error );
        }
    },
    methods : {
         getStatus(status){
            if(status== 1){
                return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'library.show' ).toUpperCase()+"</span>"
            }
            else if(status== 2){
                return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'library.noShow' ).toUpperCase()+"</span>"
            }
            else if(status== 3){
                return "<span style='color: #65e; font-weight: bold;'>"+this.$t( 'library.futureShow' ).toUpperCase()+"</span>"
            }
            else{
                return ""
            }
        },
    }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_2.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
    text-decoration: none
    color: #fff
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
    .message
        padding: 10px
        text-align: center
        background: $colorTitleDark
        color: #fff
        font-size: 1.5rem
        font-family: $fontBody
        font-weight: bold
.info
    padding: 20px
    border: 3px solid $colorTitle
    position: relative
    .info-document
        display: grid
        grid-gap: 15px
        grid-template-columns: 18% 82%
        .icon
            width: 80%
            text-align: center
            justify-self: start
            img
                width: 80%
        .text
            position: relative
            .load
                position: absolute
                bottom: 0
            .colors-container
                width: 100%
                height: 30px
                .colors
                    margin: 5px 0 0 5px
                    width: 25px
                    height: 25px
                    border-radius: 50%
                    float: left
    .share-grid
        position: absolute
        bottom: 10px
        right: 0px
        margin-top: 25px
        .load
            line-height: 60px
        .share
            height: 50px
            display: -webkit-box
            justify-content: end
            div
                display: inline-block
                height: 50px
                margin-right: 25px
@media screen  and (max-width: $widthTablet)
  .info
      min-height: 300px
      .share-grid
          margin-left: 2px
          bottom: 15px !important
          .share
              div
                  display: block !important
  .col-90
    width: 80% !important
@media screen  and (max-width: $widthMobile)
  .col-90
    width: 80% !important
  .feed-title
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
</style>
