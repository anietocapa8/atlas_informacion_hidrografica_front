<template>
<div class="prototype">
    <div class="feed-title">{{$t( 'prototype.title' ).toUpperCase()}}</div>
    <div v-if="prototype" class="prototype-body container-form">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center flex-column">
              <b-row>
                <b-col v-if="prototype.state" cols="6" class="d-flex justify-content-start align-self-center" style="color: #5a5;">
                  <span>{{$t('normogram_detail.enable').toUpperCase()}}</span>
                </b-col>
                <b-col v-if="!prototype.state" cols="6" class="d-flex justify-content-start align-self-center" style="color: #e35;">
                  <span>{{$t('normogram_detail.not_enable').toUpperCase()}}</span>
                </b-col>
                <b-col cols="6" class="d-flex justify-content-end align-self-center">
                  <sipsder-btn v-if="isAdmin" :title="$t('normogram_detail.edit_admin')"
                    :text="$t('prototype.detail.edit_button')"
                    btnType="edit_pen"
                    @onClick="prototypeEdit()"></sipsder-btn>
                </b-col>
              </b-row>
          </b-col>
          <b-col cols="12" class="d-flex justify-content-center flex-column" v-if="prototype">
              <h1>{{prototype.name}}</h1>
          </b-col>
        </b-row>
        <b-row class="center">
          <b-col cols="12" class="d-flex justify-content-center flex-column" v-if="prototype">
              <b-row>
                <b-col cols="6" class="d-flex justify-content-start align-self-center" style="font-size: 0.9em">
                  <p style="font-size: 1em" class="w-100">{{new Date(prototype.date) | moment("DD/MM/YYYY") }}</p>
                </b-col>
                <b-col cols="6" class="d-flex justify-content-end" style="width: 100%">
                  <b-row style="width: 100%">
                    <b-col cols="12" class="d-flex justify-content-end align-self-center">
                      <div class="align-self-center mx-4">
                        <s-share-question />
                      </div>
                      <div class="align-self-center mx-2">
                        <report-component :contentId="prototype.id" 
                          :content-type="REPORT_CONTENT_TYPES.PROTOTYPE">
                        </report-component>
                      </div>
                      <div class="align-self-center mx-4">
                        <score-component :idContent="prototype.id" 
                          :idType="SCORE_CONTENT_TYPE.PROTOTYPE"
                          :likes="prototype.likes"
                          :dislikes="prototype.dislikes"></score-component>
                      </div>
                    </b-col>
                  </b-row>                
                </b-col>
              </b-row>
          </b-col>
        </b-row>
        <b-row v-if="prototype" style="margin-top: 30px">
            <b-col cols="6" class="upper-body">
                <rich-text-preview style="overflow: auto" :content="prototype.generalDescription"/>
            </b-col>
            <b-col cols="6" class="upper-body">
                <compact-carousel 
                    :attachments="prototype.attachments" 
                    :ruralModels="[]"
                    :showInfo= "false"
                    :delay="15">
                </compact-carousel>
            </b-col>
        </b-row>

        <div class="tabs" style="margin-top: 5%">
          <div class="A">
              <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t( 'prototype.detail.attachments_tab')}}</span></div></div>
              <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t( 'prototype.detail.location_tab')}}</span></div></div>
              <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{$t( 'prototype.detail.witness_tab')}}</span></div></div>
              <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{$t( 'prototype.detail.projects_tab')}}</span></div></div>
          </div>
          <div v-if="tabIndex==0" class="B">
            <div class="event-grid-legend">
              <div v-if="!prototype.documents.length">
                <p>{{$t('prototype.detail.no_attachments')}}</p>
              </div>  
              <div v-else>
                <p v-if="!isAuth">{{$t('prototype.detail.attachments_no_auth')}}</p>
                <div v-else>
                  <div v-if="prototype.survey">
                    <p>{{$t('prototype.detail.attachments_claim1')}} <span>
                        <router-link :to="{ name: 'SurveyForm', params: { id: getUrl( prototype.survey )[ 0 ], url: getUrl( prototype.survey )[ 1 ] } }"
                            target="_blank">{{$t('prototype.detail.attachments_survey')}}
                        </router-link>
                      </span> {{$t('prototype.detail.attachments_survey2')}} </p>
                    <p>{{$t('prototype.detail.attachments_claim2')}}</p>
                  </div>
                </div>
                <b-row class="center" style="margin-top: 40px">
                    <b-col cols="5" v-for="(document,i) in prototype.documents" :key="`${i}-${document}`"  class="box" style="height: 250px; padding: 5px">
                        <div style="height: 45px; padding: 5px">
                            <h3 class="bold">{{document.title}}</h3> 
                        </div>
                        <div style="height: 125px; padding: 5px; overflow: auto">{{document.summary}}</div>

                        <div v-if="!isAuth" style="text-align: center" v-b-tooltip.hover :title="$t('prototype.detail.log_in_download')">
                            <sipsder-btn v-if="document.format == 'application/pdf'" :disabled="!prototype.filledSurvey || !isAuth" btnType="preview" 
                              @onClick="previewDocument(document)" 
                              :text="$t('prototype.create.document.view')" ></sipsder-btn>
                            <div v-else :disabled="!prototype.filledSurvey || !isAuth">
                              <download-document :id="document.id" :disabled="true"></download-document>
                            </div>
                        </div>
                        <div v-if="isAuth" style="text-align: center">
                            <sipsder-btn v-if="document.format == 'application/pdf'" :disabled="!prototype.filledSurvey || !isAuth" btnType="preview" 
                              @onClick="previewDocument(document)" 
                              :text="$t('prototype.create.document.view')" ></sipsder-btn>
                            <div v-else :disabled="!prototype.filledSurvey || !isAuth">
                              <download-document :id="document.id" ></download-document>
                            </div>
                        </div>
                    </b-col>
                </b-row>
              </div>
            </div>
          </div>

          <div v-if="tabIndex==1" class="B">
            <div class="event-grid-legend">
              <b-row class="center" style="padding: 10px">
                <b-col>
                  <p>{{prototype.locationDescription}}</p>
                </b-col>
              </b-row>
              <div class="map-index">
                <template v-if="ruralHousing.mapIds && ruralHousing.mapIds.length">
                  <h3>{{ $t('prototype.detail.filter_search') }}</h3>
                  <map-index
                    :ids="ruralHousing.mapIds"
                    @selected="onMapSelect" />
                </template>
                <span v-else>{{ $t('prototype.detail.no_maps') }}</span>
              </div>
            </div>
          </div>
          <!-- WITNESS -->
          <div v-if="tabIndex==2" class="B">
            <div class="event-grid-legend">
                <b-row>
                  <b-col cols="12">
                    <div v-b-tooltip.hover :title="$t('prototype.detail.log_in')" class="float-right">
                      <sipsder-btn btnType="add" :text="$t( 'prototype.detail.add_witness' )" 
                      @onClick="goCreateWitness()" :disabled="!isAuth" >
                      </sipsder-btn>
                    </div>
                  </b-col>
                </b-row>
                <div v-if="prototype.stories.length" class="border border-dark">
                  <b-row class="p-5">
                    <b-col class="mt-2 mb-2" cols="6" v-for="(story, i) in prototype.stories"  :key="i">
                      <b-row>
                        <b-col cols="6">
                          <img style="width: 95%; height: 140px " :src="getImgURL(story.imageUrl)">
                        </b-col>
                        <b-col cols="6">
                          <b-row class="p-2">
                            <b-col cols="11">
                              <img v-if="story.userImage" style="width: 45px; height: 45px" class="mr-3 border border-dark rounded-circle" :src="getImgURL(story.userImage)">
                              <img v-else style="width: 45px; height: 45px" class="mr-3 border border-dark rounded-circle" src="@/assets/profile.png" >
                              <span style="display: inline-block;"></span>
                              {{story.userName}}
                            </b-col>
                          </b-row>
                          <p class="mt-2">{{story.name}}</p>
                          <router-link :to="{ name: 'CommunityStoryDetail', params: {id: story.id}}" target="_blank">
                            {{$t('prototype.detail.link')}}
                          </router-link>
                        </b-col>
                      </b-row>    
                    </b-col>
                    <b-col cols="12">
                      <h3>
                        <router-link :to="{name: 'CommunityStoryIndex', query: {housing: true}}" class="float-right mt-5" style="margin-bottom: -5px">
                          {{$t('prototype.detail.housing_link')}}
                        </router-link>
                      </h3>
                    </b-col>
                  </b-row>
                </div>
                <div v-else class="border border-dark p-4">
                  <b-row>
                    <b-col cols="8">
                      <p>{{$t('prototype.detail.no_witness')}}</p>
                    </b-col>
                    <b-col cols="4">
                      <i class="fa fa-user-plus mr-3" aria-hidden="true"></i>
                      <router-link :to="{ name: 'CommunityStoryIndex' }" class="d-inline">
                        {{$t('prototype.detail.rural_link')}}
                      </router-link>
                    </b-col>
                  </b-row>
                </div>
            </div>
          </div>

          <div v-if="tabIndex==3" class="B">
            <div class="event-grid-legend">
              <!-- PROCEDURES -->
              <div class="collapse-bar">
                <div class="collapse-title" @click="toogleCollapsedBar1()">{{$t('prototype.detail.procedures_title')}}</div>
                <div class="collapse-button" @click="toogleCollapsedBar1()"><i v-if="!collapsedBar1" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                <div class="collapse-body" v-if="!collapsedBar1">
                  <div v-if="prototype.procedures.length">
                    <div v-for="(procedure, i) in prototype.procedures" :key="i">
                      <h3 style="margin: 10px 30px; color: blue">
                        <div @click="procedureDetail(procedure)" style="cursor: pointer;">{{procedure.name}}</div>
                      </h3>
                      <hr>
                    </div>
                    <h3 style="text-align: right; margin: 5px 30px">
                      <router-link v-if="prototype.procedures.length > 5" :to="{name: 'ProcedureIndex'}">{{$t('prototype.detail.procedures_list')}}</router-link>
                    </h3>
                  </div>
                  <div v-else>
                    <h3>{{$t('prototype.detail.procedures_empty')}}</h3>
                    <h3 style="text-align: right; margin: 5px 30px">
                      <router-link v-if="prototype.procedures" :to="{name: 'ProcedureIndex'}">{{$t('prototype.detail.procedures_list_empty')}}</router-link>
                    </h3>
                  </div>
                </div>
              </div>
              <!-- PROJECTS -->
              <div class="collapse-bar">
                <div class="collapse-title" @click="toogleCollapsedBar2()">{{$t('prototype.detail.projects_title')}}</div>
                <div class="collapse-button" @click="toogleCollapsedBar2()"><i v-if="!collapsedBar2" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i></div>
                <div class="collapse-body" v-if="!collapsedBar2">
                  <div v-if="prototype.projects.length">
                    <div v-for="(project, i) in prototype.projects" :key="i">
                      <h3 style="margin: 10px 30px; color: blue">
                        <div @click="projectDetail(project)" style="cursor: pointer;">{{project.name}}</div>
                      </h3>
                      <hr>
                    </div>
                    <h3 style="text-align: right; margin: 5px 30px">
                      <router-link v-if="prototype.projects.length > 5" :to="{name: 'ProyectToolProyectIndex', query: {housing: true}}">{{$t('prototype.detail.projects_list')}}</router-link>
                    </h3>
                  </div>
                  <div v-else>
                    <h3>{{$t('prototype.detail.projects_empty')}}</h3>
                    <h3 style="text-align: right; margin: 5px 30px">
                      <router-link :to="{name: 'ProyectToolProyectIndex'}">{{$t('prototype.detail.projects_list_empty')}}</router-link>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>


        <b-row style="margin-top: 30px">
          <b-col cols="6" class="d-flex justify-content-end back-button">
            <sipsder-btn :text="$t('prototype.detail.rural_button')" btnType="uploadImage" @onClick="goTopics()"></sipsder-btn>               
          </b-col>
          <b-col cols="6" class="d-flex justify-content-start back-button">
            <sipsder-btn title="Regresar" btnType="back" @onClick="goPrototypes()"></sipsder-btn>    
          </b-col>
        </b-row>
    </div>
    <div v-else class="prototype-body container-form" style="text-align: center">{{$t('prototype.detail.loading')}}</div>
</div>
</template>

<script>
import VAPI from "../../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../../sipsder_constants'; 
import { PERMISSIONS_TYPES } from '../../../../domain_constants';
import SocialNetworksShare from '../../../shared/social_networks_share/SocialNetworksShare.vue';
import ScoreComponent from '../../../shared/ScoreComponent.vue';
import ReportComponent from '../../../shared/ReportComponent.vue';
import MapIndex from '@/components/shared/arcgis/MapIndex';
import CompactCarousel from '@/components/views/event/CompactCarousel.vue';
import RichText from '../../../shared/RichText.vue'
import RichTextPreview from '../../../shared/RichTextPreview'
import DownloadDocument from "../../../shared/DownloadDocument.vue";
import S_UTIL from "../../../../util/sipsder_util";

export default {
    components: {
        CompactCarousel,
        MapIndex,
        RichTextPreview,
        's-share-question': SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        DownloadDocument
    },
    data(){
        return {
            tabIndex: 0,
            SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES,
            prototype: null,
            ruralHousing: null,
            collapsedBar1: true,
            collapsedBar2: true
        }
    },
    computed: {
        isAdmin(){
          return this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
        },
        isAuth(){
          return this.$store.getters.isAuthenticated;
        },
    },
    methods: {
        goCreateWitness(){
          this.$router.push({name: 'CommunityStoryCreate', query: {housing: true}})
        },
        getImgURL (url) {
          return S_UTIL.getImgURL(url);
        },
        goTopics(){
          this.$router.push({name: 'RuralHousingIndex'})
        },
        goPrototypes(){
            this.$router.push({name: 'PrototypesIndex'})
        },
        toogleCollapsedBar1(){
            this.collapsedBar1 = !this.collapsedBar1
        },
        toogleCollapsedBar2(){
            this.collapsedBar2 = !this.collapsedBar2
        },
        getUrl(survey) {
          return survey.url.split('/');
        },
        procedureDetail(item) {
            let routeData = this.$router.resolve({ name: 'ProcedureDetail', params: {id: item.id} });
            window.open(routeData.href, '_blank');
        },
        projectDetail(item){
          let routeData = this.$router.resolve({ name: 'ProyectDetail', params: {id: item.id}  });
          window.open(routeData.href, '_blank');
        },
        goProcedures(){
            this.$router.push({ name: 'Procedureindex' });
        },
        previewDocument(document){
            let routeData = this.$router.resolve({
                name: 'PrototypesDocument',
                params: { id: document.id }
            });
            window.open(routeData.href, '_blank');
        },
        setTabIndex(index){
            this.tabIndex=index
        },
        back(){
            window.history.back();
        },
        goTopics(){
            this.$router.push( { name: 'RuralHousingIndex' } );
        },
        hashedId(item){
            let index = item.url.lastIndexOf('/');
            return Number(item.url.substring(index+1));
        },
        prototypeEdit(){
            let id = this.hashedId(this.prototype);
            this.$router.push({ name: 'PrototypesCreate' , params: {id: id} });
        },
        formatRuralFigures(ruralHousing) {
          ruralHousing.mapIds = ruralHousing.ruralFigures
            .map(ruralFigure => ruralFigure.map.url);
          const obj = {}
          ruralHousing.ruralFigures
            .forEach(ruralFigure => {
              obj[ruralFigure.map.url] = ruralFigure
            });
          ruralHousing.ruralFigures = obj;
        },
        onMapSelect(map) {
          const figure = this.ruralHousing.ruralFigures[map.id];
          if (figure.indicator) {
            this.$router.push({ name: 'RuralIndicatorDetail', params: { id: figure.indicator.id }});
          } else {
            this.$router.push({ name: 'RuralFigureDetail', params: { id: figure.id }});
          }
        },
    },
    async beforeMount(){
        try {
          let response = await VAPI.get(SERVICE_NAMES.RURAL_HOUSING);
          this.formatRuralFigures(response.data);
          this.ruralHousing = response.data;
        } catch (error) {
          console.error('Error fetching rural housing', error);
        }
        let result = await VAPI.get(`/${SERVICE_NAMES.PROTOTYPE}/${this.$route.params.id}`);
        this.prototype = result.data;
        if(!this.prototype.survey){
          this.prototype.filledSurvey = true;
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'
.prototype
    width: 100%
.prototype-body
    width: 80%
    margin: 0 10%
.upper-body
    height: 370px
    overflow: auto
.center
  display: flex
  justify-content: center
  align-items: center
.center-image
  display: block
  margin-left: auto
  margin-right: auto
.collapse-title
    line-height: 50px
    height: 50px
    padding: 0 15px
    color: #fff
    font-weight: bold
    background: $colorTitle
.bold
  font-weight: bold;
.parent
  position: relative
  top: 0
  left: 0
.imageA
  position: relative
  top: 0
  left: 0
.imageB
  position: absolute
  top: 0
  left: 0
.box
  margin-top: 30px
  margin: 10px
  border: 1px solid black
  border-radius: 5px
.document-viewer
    margin: 20px 0
.h1-title
    font-size: 2rem
    font-weight: 500
    padding: 2% 0
.back-button
    margin: 10px 0px 30px 0 
.tabs
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 70px auto
    min-height: 600px
    .A
        margin-left: 15px
        display: inline-flex
    .B
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        overflow: hidden
        overflow-y: auto 
        min-height: 400px
        max-height: 600px
        border: 5px solid #fff
        background: #F3F8FA
    .event-grid-legend
            display: grid
            grid-template-columns: 100%
            grid-gap: 15px
            margin: 15px
            padding: 10px
.tab-design  
    margin-bottom: 10px !important
    transform: rotate(3deg)
    max-width: 50%
    margin-right: 20px
    font-size: 1.34rem
    div
        cursor: pointer
        width: 105%
        background: $colorTitle
        color: white
        border-radius: 10px
        min-height: 70px
        padding: 10px 3.5em 14px 1em
        span
            display: block
            transform: rotate(-4deg)
    &.active
        div
            box-shadow: 0px 0px 3px #555
            background: $colorTitleDark
            color: white
            border-color: unset
            transition: 0.5s
    &:hover
        div
            box-shadow: 0px 0px 3px #555

.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../../assets/title/barra_sola_4.png)
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
.collapse-bar
  position: relative
  margin-top: 30px
  min-height: 50px
  box-shadow: 0px 0px 3px #555
  border: 2px solid #777
  border-radius: 5px
.collapse-body
    padding: 20px
.collapse-button
    position: absolute
    top: 5px
    right: 15px
    color: #fff
    font-size: 2rem
.collapse-title
    line-height: 50px
    height: 50px
    padding: 0 15px
    color: #fff
    font-weight: bold
    cursor: pointer

.map-index
  background: rgba(250, 250, 250, 0.8)
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem

@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 30px
    .tabs
        grid-template-rows: unset !important
        .A
            display: flex !important
            flex-wrap: wrap
            width: 100%
            margin-left: 0 !important
        .B
           width: 100%
    .tab-design  
        height: 70px !important
        max-width: unset !important
        margin: 5px
        width: 40%
        div
            height: 70px !important
            span
                height: 70px !important
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .col-6
      max-width: 100% !important
      flex: unset !important
    .col-12
      padding-left: unset !important
    .tab-design 
      font-size: 0.8rem !important
</style>
