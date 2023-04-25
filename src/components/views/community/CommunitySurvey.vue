<template>
  <div class="community-survey">
      <div class="feed-title">{{$t( 'community.survey.title' ).toUpperCase()}}</div>
      <div class="col-90 container-form">
        <div class="filter-box">
          <div class="grid-col">
            <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
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
            </div>
            <div class="grid-col">
              <div class="grid-col-50">
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                  <b-form-input :placeholder="$t( 'calendar.q')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
                </b-form-group>
                <b-form-group :label-cols="3" label-class="font-weight-bold" description= ""  v-if="isAdministrator">
                  <b-form-input :placeholder="$t( 'community.survey.surveyCode' )" v-model="filterSurveyCode" v-validate="'max:70'"></b-form-input>
                </b-form-group>
              </div>
              <div>
                <b-form-group :label-cols="4" label-class="font-weight-bold" v-if="isAdministrator">
                  <v-select v-model.trim="filterState" label="name" :placeholder="$t( 'community.survey.status' )" :options="filterStateOpsAdmin" class="font-size-14"></v-select>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" v-else>
                  <v-select v-model.trim="filterState" label="name" :placeholder="$t( 'community.survey.status' )" :options="filterStateOpsUser"  class="font-size-14"></v-select>
                </b-form-group>                
              </div>              
            </div>
            <div class="grid-col buttons-col">
                <sipsder-btn btnType="search" @onClick="loadMore(true)"></sipsder-btn>
                <sipsder-btn btnType="clean" @onClick="cleanFilter"></sipsder-btn>
            </div>
        </div>
        <div class="survey-list">
          <div class="info-filter">
            <div class="info">
              {{$t( 'community.survey.found' )}} {{totalSurveys}} {{$t( 'community.survey.results' )}}
            </div>
            <div class="sort">
              <b-form-group :label-cols="4" label-class="font-weight-bold">
                <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderOps"></v-select>
              </b-form-group>
            </div>
          </div>
          <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
            @input="loadMore(false)"
            :per-page="filterParams.size">
          </b-pagination>
          <div style="text-align:right" v-if="isAdministrator"><sipsder-btn btnType="add" :text="$t('community.survey.add')" @onClick="goToCreateSurveyPage( )"></sipsder-btn></div>
          <div class="survey-item" v-for="(survey,i) in surveys" :key="i" :style="{'border-bottom-color':  getStatusColor( survey ), 'border-bottom-style': 'solid','border-bottom-width': '7px' }">
            <div>
              <div>
                <b>{{survey.title}}</b> <br>
                {{$t( 'community.survey.startDate' )}} {{survey.startDate  | moment("DD MMM YYYY - h:mm a")}} - {{survey.answers}} {{$t( 'community.survey.answers' )}} <span v-if="survey.endDate!=null"> - {{$t( 'community.survey.endDate' )}} {{survey.endDate  | moment("DD MMM YYYY - h:mm a")}}</span>
              </div>
              <div class="grid-col rext" v-if="isAdministrator">
                <div><b>{{survey.code}}</b></div> 
                <div v-if="survey.password">
                  <span class="faded"></span>
                  <b>{{$t('community.survey.url')}}:</b>&nbsp;
                  {{survey.url}}
                </div> 
                <div v-if="survey.password">
                  <b>{{$t('community.survey.password')}}:</b>&nbsp;
                  {{survey.password}}
                  <span class="faded"></span>
                </div>
              </div>
              <div class="colors-container" >
                <div class="colors" v-for="(r, j) in survey.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
              </div>
            </div>
            <div>
              <div v-html="getStatusLabel(survey)"></div>
              <div v-if="isAdministrator && !isCloseState(survey.endDate, survey.published)"><router-link :to="{ name: 'SurveyAdminCreate', params: { code: survey.code }}" >{{$t( 'community.survey.edit' )}}</router-link></div>
              <div v-if="!isAdministrator && !isCloseState(survey.endDate, survey.published)"><router-link :to="{ name: 'SurveyForm', params: { id: getUrlId( survey ), url: getUrlText( survey ) } }" >{{$t( 'community.survey.fillIn' )}}</router-link></div>
              <div v-if="isCloseState(survey.endDate, survey.published)"><router-link :to="{ name: 'SurveyResult', params: { id: getUrlId( survey ), url: getUrlText( survey ) }  }" >{{$t( 'community.survey.viewResults' )}}</router-link></div>
            </div>
          </div>
           <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
            @input="loadMore(false)"
            :per-page="filterParams.size">
          </b-pagination>
        </div>
      </div>
      <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
  </div>
</template>

<script>

import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import _ from 'lodash';
import moment from 'moment';
import { SERVICE_NAMES } from '@/sipsder_constants'
import { PERMISSIONS_TYPES, SURVEY_STATUS, SURVEY_STATUS_LABEL, TARGET_AUDIENCE } from '../../../domain_constants'
import surveyUtils from '../../../util/survey/surveyUtil';
import S_UTIL from "../../../util/sipsder_util";

export default {
  components:{
    Treeselect,
    "v-select": vSelect 
  },
  data(){
    return{
      ruralModels: [],
      selectedQueryModel: [],
      filterQ: '',
      filterState: null,
      filterSurveyCode: '',
      filterStateOpsAdmin:[
        {
          id: 1,
          status: SURVEY_STATUS.EDITING,
          name: SURVEY_STATUS_LABEL.EDITING
        },
        {
          id: 2,
          status: SURVEY_STATUS.PUBLISHING_PROCESS,
          name: SURVEY_STATUS_LABEL.PUBLISHING_PROCESS
        },
        {
          id: 3,
          status: SURVEY_STATUS.PUBLISHED,
          name: SURVEY_STATUS_LABEL.PUBLISH + '-' + SURVEY_STATUS_LABEL.ENABLED,
          enabled: true
        },
        {
          id: 4,
          status: SURVEY_STATUS.PUBLISHED,
          name: SURVEY_STATUS_LABEL.PUBLISH + '-' + SURVEY_STATUS_LABEL.DISABLED,
          enabled: false
        },
        {
          id: 5,
          status: SURVEY_STATUS.CLOSED,
          name: SURVEY_STATUS_LABEL.CLOSED
        },
      ],
      filterStateOpsUser:[
        {
          id: 1,
          status: SURVEY_STATUS.CLOSED,
          name: SURVEY_STATUS_LABEL.CLOSED,
          enabled: true
        },
        {
          id: 2,
          status: SURVEY_STATUS.PUBLISHED,
          name: SURVEY_STATUS_LABEL.ACTIVE,
          enabled: true
        }
      ],
      filterOrderOps:[
        {
          value: "startDate,desc",
          label: this.$t( 'community.survey.creationDate' )+" ↓"
        },
        {
          value: "startDate,asc",
          label: this.$t( 'community.survey.creationDate' )+" ↑"
        },
        {
          value: "lastModifiedDate,desc",
          label: this.$t( 'community.survey.modifiedDate' )+" ↓"
        },
        {
          value: "lastModifiedDate,asc",
          label: this.$t( 'community.survey.modifiedDate' )+" ↑"
        },
        {
          value: "title,desc",
          label: this.$t( 'community.survey.titleT' )+" ↓"
        },
        {          
          value: "title,asc",
          label: this.$t( 'community.survey.titleT' )+" ↑"
        }
      ],
      filterOrder:{value: "lastModifiedDate,desc", label: this.$t( 'community.survey.modifiedDate' )+" ↓"},
      filterParams: {
          page: 1,                    // Page number
          size: 10,                   // Page size
      },
      surveys: null,
      totalSurveys: 0,
      meta:null
    }
  },
  watch:{
    filterOrder : {
       handler: function(val, oldVal) {
        this.loadMore(true);
      },
      deep: true
    }
  },
  async beforeMount() {
    try{
      const ruralModelTree = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree` );
      this.ruralModels = ruralModelTree.data.data;
      const response = await VAPI.get(SERVICE_NAMES.SURVEY + this.buildQuery());
       if( response.data !== "" ){
        this.surveys = response.data.data;
        this.totalSurveys = response.data.meta.totalElements
        this.meta = response.data.meta
       }
    }
    catch( error ) {
        console.log( 'Error fetching rural model tree', error );
    }
  },
  methods:{
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    async loadMore(resetFlag){
      if(resetFlag == true){
        this.filterParams.page = 1
      }
      try{
         const response = await VAPI.get(SERVICE_NAMES.SURVEY + this.buildQuery());
          this.surveys = response.data.data;
          this.totalSurveys = response.data.meta.totalElements
          this.meta = response.data.meta
      }
       catch( error ) {
          console.log( 'Error fetching rural model tree', error );
      }
    },
    cleanFilter() {
      this.selectedQueryModel= []
      this.filterQ =''
      this.filterState = null
      this.filterSurveyCode = ''
      this.filterOrder= {value: "lastModifiedDate,desc", label: "Fecha ↓"}
      this.filterParams= { page: 1, size: 10}
      this.loadMore(false)
    },
    buildQuery() {
      const toTwoDigits = num => num < 10 ? '0' + num : num;
      let today = new Date( );
      let date = today.getFullYear()+"-"+toTwoDigits(today.getMonth()+1)+"-"+toTwoDigits(today.getDate());
      //+" "+toTwoDigits(today.getHours())+":"+toTwoDigits(today.getMinutes())+":"+toTwoDigits(today.getSeconds())

      let query = '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;
      if( this.filterState != null ) {
        if( this.filterState.enabled != null )
          query += '&enabled=' + this.filterState.enabled;
        query += '&status=' + this.filterState.status;
      }
      else {
        if( this.isAdministrator ) {
          query += '&statusA=' + 
            SURVEY_STATUS.EDITING + ',' +
            SURVEY_STATUS.PUBLISHING_PROCESS + ',' + 
            SURVEY_STATUS.PUBLISHED + ',' +
            SURVEY_STATUS.CLOSED;
        }
        else {
          query += '&status=' + SURVEY_STATUS.PUBLISHED + ',' + SURVEY_STATUS.CLOSED;
          query += '&enabled=true';
        }
      }
      if( !this.isLogged ) {
        query += '&target=' + TARGET_AUDIENCE.EVERYONE;
      }
      else if( this.isLogged && this.isAdministrator ) {
        query += '&target=' + TARGET_AUDIENCE.EVERYONE + ',' + 
          TARGET_AUDIENCE.AUTHENTICATED + ',' + 
          TARGET_AUDIENCE.SPECIFIC + ',' + 
          TARGET_AUDIENCE.PROTECTED;
      }
      else if( this.isLogged && !this.isAdministrator ) {
        query += '&target=' + TARGET_AUDIENCE.EVERYONE + ',' + 
          TARGET_AUDIENCE.AUTHENTICATED + ',' + 
          TARGET_AUDIENCE.SPECIFIC;
        query += '&userType=' + this.getUserTypes
      }
      if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
      if( this.filterSurveyCode !== '' ) query += '&code=' + this.filterSurveyCode;
      if(this.selectedQueryModel.length>0) query += '&ruralModels=' + this.selectedQueryModel;
      if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value;
      else query += '&sort=lastModifiedDate,desc'
      return query;
    },
    isCloseState( endDate, published ){
      let today = new Date( );
      let end = new Date( endDate );
      if( today >= end && published )
        return true;
      return false;
    },
    getStatusColor( survey ){
      let status = surveyUtils.getSurveyStatus( survey );
      if( status == SURVEY_STATUS.EDITING ){
        return "#65e"
      }
      else if( status == SURVEY_STATUS.CLOSED ) {
        return "#e35"
      }
      else if( status == SURVEY_STATUS.PUBLISHED && !survey.enabled ){
        return "#fc1"
      }
      else if( status == SURVEY_STATUS.PUBLISHING_PROCESS ){
        return "#444"
      }
      else if( status == SURVEY_STATUS.PUBLISHED && survey.enabled && !this.isAdministrator ){
        return "#5a5" //Active
      }
      else if( status == SURVEY_STATUS.PUBLISHED && survey.enabled && this.isAdministrator ){
         return "#5a5" //Published-Enabled
      }
    },
    getStatusLabel( survey ){
      let status = surveyUtils.getSurveyStatus( survey );
      if( status == SURVEY_STATUS.EDITING ) {
        return "<span style='color: #65e; font-weight: bold'>"+SURVEY_STATUS_LABEL.EDITING+"</span>";
      }
      else if( status == SURVEY_STATUS.CLOSED ) {
        return "<span style='color: #e35; font-weight: bold;'>"+SURVEY_STATUS_LABEL.CLOSED+"</span>";
      }
      else if( status == SURVEY_STATUS.PUBLISHED && !survey.enabled ) {
        return "<span style='color: #fc1; font-weight: bold;'>"
          + SURVEY_STATUS_LABEL.PUBLISH + '-' + SURVEY_STATUS_LABEL.DISABLED +
          "</span>";
      }
      else if( status == SURVEY_STATUS.PUBLISHING_PROCESS ){
        return "<span style='color: #444; font-weight: bold;'>" + 
          SURVEY_STATUS_LABEL.PUBLISHING_PROCESS + 
          "</span>";
      }
      else if( status == SURVEY_STATUS.PUBLISHED && survey.enabled && !this.isAdministrator ) {
        return "<span style='color: #5a5; font-weight: bold;'>" + SURVEY_STATUS_LABEL.ACTIVE + "</span>";
      }
      else if( status == SURVEY_STATUS.PUBLISHED && survey.enabled && this.isAdministrator ) {
        return "<span style='color: #5a5; font-weight: bold;'>"
          + SURVEY_STATUS_LABEL.PUBLISH + '-' + SURVEY_STATUS_LABEL.ENABLED +
          "</span>";
      }
    },
    getUrlId( survey ) {
      return survey.url.split('/').slice(-2)[0];
    },
    getUrlText( survey ) {
      return survey.url.split('/').slice(-2)[1];
    },
    goToCreateSurveyPage( ) {
      this.$router.push( { name: 'SurveyAdminCreate' } );
    },
  },
  computed:{
    isLogged() {
      return this.$store.getters.isAuthenticated
    },
    getUserTypes() {
      return this.$store.getters.getCurrentUser.userType.id
    },
    isAdministrator( ) {
      let isAdmin = false;
      if (this.$store.getters.isAuthenticated)
        if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
          isAdmin = true     
      return isAdmin;
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .dot
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: inline-block;
  .grey-label-text
    color: grey
  .font-size-14
    font-size: 14px
  .faded
    display: block
    border: none
    color: white
    height: 1px
    background: black
    background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 550, from(#000), to(#fff))
    width: 95%
    margin-top: 10px
    margin-bottom: 10px
  .col-90
    width: 90%
    margin-left: auto
    margin-right: auto 
  .community-survey
    width: 100%
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
    padding-left: calc(10% + 40px)
    padding-top: 20px
  .filter-box
    display: grid
    grid-template-columns: 2fr 2fr 1fr
    grid-gap: 15px
    background: $colorTitleDark
    padding: 15px 15px 15px 15px
    border-radius: 10px
    .legend
      color: #fff
      font-weight: bold
      font-family: $fontBody
      font-size: 2rem
    .grid-col
      display: grid
      grid-gap: 15px
      grid-template-rows: 50px 50px
      .form-group input, .b-form-group, .form-group
        height: 100% !important
        max-height: 50px !important
        border-radius: 4px !important
        div
          height: 100% !important
          background: #fff !important
          border-radius: 4px !important
      button
        margin-top: -15px
      .buttons
        text-align: center
        margin-top: -15px
      .grid-col-50
        display: grid
        grid-template-columns: 2fr 1fr
        grid-gap: 15px
      .v-select, .dropdown-toggle
        padding: 0px !important
        height: 30px !important
      .selected-tag
        font-size: 17px !important
        margin: 0 !important
  .survey-list
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
      .info
        position: absolute
        top: 0 
        left: 0
      .sort
        position: absolute
        top: 0 
        right: 0
        min-width: 160px
    .survey-item
      display: grid
      grid-template-columns: 80% 20%
      margin: 10px 
      box-shadow: 0px 0px 3px #555
      padding: 15px
      .colors-container
        width: 100%
        height: 30px
        .colors
          margin: 5px 0 0 5px
          width: 25px
          height: 25px
          border-radius: 50%
          float: left
      .rext
        overflow-x: auto
  @media screen and (max-width: $widthTablet)
    .filter-box
        grid-template-columns: 100% !important
        .buttons-col
            grid-template-rows: 50px !important
            grid-template-columns: 50% 50%
    .col-90
      width: 80% !important
  @media screen and (max-width: $widthMobile)
    .col-90
      width: 80% !important
    .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
      margin-top: 40px !important
    .info-filter
      height: 90px !important
      .info
        position: unset !important
      .sort
        position: unset !important
</style>


