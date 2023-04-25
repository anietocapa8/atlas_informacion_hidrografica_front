<template>
  <div class="normogram">
      <div class="feed-title">{{$t( 'normogram_detail.title' ).toUpperCase()}}</div>
      <div class="normogram-body container-form" >
        <b-row >
          <b-col cols="12" class="d-flex justify-content-center flex-column">
              <b-row>
                <b-col v-if="norm && norm.status" cols="6" class="d-flex justify-content-start align-self-center" style="color: #5a5;">
                  <span>{{$t('normogram_detail.enable').toUpperCase()}}</span>
                </b-col>
                <b-col v-if="norm && !norm.status" cols="6" class="d-flex justify-content-start align-self-center" style="color: #e35;">
                  <span>{{$t('normogram_detail.not_enable').toUpperCase()}}</span>
                </b-col>
                <b-col cols="6" class="d-flex justify-content-end align-self-center">
                  <sipsder-btn v-if="isAdmin" :title="$t('normogram_detail.edit_admin')"
                    :text="$t('normogram_detail.edit_admin')"
                    btnType="edit_pen"
                    @onClick="normogramEdit"></sipsder-btn>
                </b-col>
              </b-row>
          </b-col>
          <b-col cols="12" class="mt-2 d-flex justify-content-center flex-column" v-if="norm">
              <h4 v-if="norm">{{norm.typeName}} {{norm.code}} {{$t('normogram_detail.from')}} 
                {{norm.date}} {{$t('normogram_detail.emited')}} {{norm.serialIntitutions}} {{ norm.policyName }}
              </h4>
          </b-col>
          <b-col cols="12" class="mt-2 d-flex justify-content-start flex-row" v-if="norm">
              <div v-for="(rural, i) in norm.ruralmodels" :key="i"
                class="circle" :style="{ background: rural.ruralModel.color }"
                v-b-tooltip.hover="rural.ruralModel.name">
              </div>
          </b-col>
        </b-row>
        
        <b-row>
          <b-col cols="12" class="mt-3 d-flex justify-content-center flex-column" v-if="norm">
              <b-row>
                <b-col v-if="norm.policyName && norm.indicators > 0" cols="auto" class="d-flex justify-content-start align-self-center" @click="seeIndicators">
                  <icon-text-widget
                    class="icon-text-widget clickable"
                    :data="$t('normogram_detail.see_indicators')"
                    :textStacked="norm.indicators || '0'"
                    icon="far fa-square"
                  />
                </b-col>
                <b-col v-if="isAdmin" cols="auto" class="d-flex justify-content-start align-self-center">
                  <icon-text-widget
                    class="icon-text-widget"
                    :data="$t('normogram_detail.created') + ' ' + norm.userName"
                    icon="fas fa-2x fa-user"
                  />
                </b-col>
                <b-col cols="auto" class="d-flex justify-content-end ml-auto">
                  <b-row>
                    <b-col cols="auto" class="d-flex justify-content-end align-self-center">
                      <s-share-question :detailed-url="''"></s-share-question>
                    </b-col>
                    <b-col cols="auto" class="d-flex justify-content-end align-self-center">
                      <report-component :contentId="norm.documentEncryptedId" 
                        :content-type="REPORT_CONTENT_TYPES.DOCUMENTS">
                      </report-component>
                    </b-col>
                    <b-col cols="auto" class="d-flex justify-content-end align-self-center">
                      <score-component :idContent="norm.cryptedId" 
                        :idType="SCORE_CONTENT_TYPE.DOCUMENTS"
                        :likes="norm.likes"
                        :dislikes="norm.dislikes"></score-component>
                    </b-col>
                    
                  </b-row>                
                </b-col>
              </b-row>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="document-viewer">
              <div v-if="norm" class="container-form">
                <document-view :id="norm.cryptedId" />
              </div>
              <div v-else class="col-90 container-form">
                <div class="message"> {{$t( 'library.visor.noDocument' )}} </div>
              </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col v-if="norm && norm.url" cols="12" class="d-flex justify-content-end back-button">
            
            <h4>
              {{$t( 'normogram_detail.consult' )}}
              <a href="#" @click="redirect(norm.url)">
                {{$t( 'normogram_detail.consult_here' )}}
              </a>
            </h4>
                            
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6" class="d-flex justify-content-end back-button">
            
            <sipsder-btn title="Regresar"
                    btnType="back"
                    @onClick="back"></sipsder-btn>
                            
          </b-col>
          <b-col cols="6" class="d-flex justify-content-start back-button">
            
            <sipsder-btn :title="$t('normogram_detail.go_to_normogram')"
                    :text="$t('normogram_detail.go_to_normogram')"
                    btnType="back"
                    @onClick="normogram"></sipsder-btn>
                            
          </b-col>
        </b-row>
        
      </div>

  </div>
</template>

<script>

import VAPI from '../../../http_common';
import DocumentView from '../../shared/DocumentView.vue';
import Router from "../../../router/router";
import { SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES, SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import DownloadDocument from "../../shared/DownloadDocument.vue";
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import IconTextWidget from "../../shared/IconTextWidget";
import ReportComponent from '../../shared/ReportComponent.vue';
import { PERMISSIONS_TYPES } from '../../../domain_constants';

export default {
  
  data() {
    return {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      dates: "0",
      norm: null,
    }
  },
  watch: {
    
  },
  computed: {
    institutions(){
      return this.$store.getters.getInstitutionsF
    },
    isAdmin(){
      
      return this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )

    },
    isAuthenticated(){
      
      return this.$store.getters.isAuthenticated

    }

  },
  async mounted(){
    
    if( this.$route.params.id ){
      try{
        let path_norm = `/${SERVICE_NAMES.NORMS}` + '/user/' + this.$route.params.id
        let response_norm = await VAPI.get( path_norm );
        if (response_norm.status == HTTP_STATUS.OK){
          this.norm = response_norm.data.data;
          this.norm.cryptedId = this.$route.params.id;
        }        
      }catch(error){
        console.error("Failed to load norm " + error.toString())
      }
    }


  },
  methods: {
    action(index){
      alert("Hizo Clic")
    },
    back(){
      window.history.back();
    },
    redirect(link) {
      window.open(this.getLink(link), "_blank");
    },
    getLink(link) {
      if (/^https?:\/\//.test(link)) {
        return link;
      }
      return `https://${link}`;
    },
    normogramEdit(){
      this.$router.push( { name: 'NormCreate', params: {id: this.$route.params.id} } );
    },
    normogram(){
      this.$router.push( { name: 'NormogramIndex' } );
    },
    seeIndicators() {
      this.$router.push( { name: 'RuralIndicatorIndex', query: {norm: this.$route.params.id} } );
    }
  },
  components: {
    DocumentView,
    DownloadDocument,
    IconTextWidget,
    's-share-question': SocialNetworksShare,
    ReportComponent,
    ScoreComponent
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@import '../../../stylesheets/helpers/_variables.sass'

.normogram
  width: 100%
.normogram-body
  width: 80%
  margin: 0 10%
.document-viewer
  margin: 20px 0
.h1-title
  font-size: 2rem
  font-weight: 500
  padding: 2% 0
.back-button
  margin: 10px 0px 30px 0 
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
.circle
  border-radius: 50%
  height: 20px
  width: 20px
  border: 3px solid transparent
  margin: 0px 5px 0px 5px
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_3.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    height: 90px
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 5%
    padding-left: calc(10% + 20px)
    padding-top: 20px

.icon-text-widget
  font-size: 0.8em
  &.clickable
    text-decoration: underline
  &.clickable:hover
    font-weight: 600
    cursor: pointer
@media screen  and (max-width: $widthMobile)
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
</style>
