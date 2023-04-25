<template>
    <div>
        <div class="library-header">
            <div class="filter">
              <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                <b-form-input :placeholder="$t('library.keyword')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
              </b-form-group>
              <div>
                <sipsder-btn btnType="search" text="" @onClick="loadMore()"></sipsder-btn>
                <sipsder-btn btnType="clean" @onClick="clear()" ></sipsder-btn>
              </div>
            </div>
            <div>
              <div style="text-align:right"><sipsder-btn btnType="add" :text="$t('library.add_document')" @onClick="$router.push({ name: $route.meta.nextCreate})" v-if="isAdministrator && !isCommunityPage"></sipsder-btn></div>
              <div style="text-align:right"><sipsder-btn btnType="add" :text="$t('library.add_document')" @onClick="moveCreateDocument()" v-if="!isAdministrator && isCommunityPage && isLogged"></sipsder-btn></div>
            </div>
          </div>         
          <div class="library-body">
            <div class="col-a">
              <div class="head-title">{{$t( 'library.filter' )}}</div>
              <div class="filter-item item">
                <div class="title">{{$t( 'library.year' )}}</div>
                <div>
                  <div v-for="(year,i) in filterYearsOps" :key="i" class="select-item"  :class="{ 'selected' : year.alias == filterYear.alias, 'not-show' : year.alias != filterYear.alias && filterYear.alias != undefined}">
                    <div class="name" @click="filterYear=year ; loadMore()"  v-b-tooltip.hover :title="year.name">{{year.name}}</div><div class="count" v-if="(year.alias != filterYear.alias)" @click="filterYear=year ; loadMore()">{{year.count}}</div><div class="count" @click="filterYear={} ; loadMore()" v-else><i class="fas fa-times-circle"></i></div>
                  </div>
                  <div class="select-item" :class="{ 'selected' : filterYear.alias == 'Y99', 'not-show' :  filterYear.alias != 'Y99' && filterYear.alias != undefined }">
                     <div class="name" @click="filterYear={alias: 'Y99', name: $t( 'library.yearSpecs')} ">{{$t( 'library.yearSpecs' )}}</div><div class="count" @click="filterYear={}; filterYearHigher=''; filterYearLess='' ; loadMore()" v-if="filterYear.alias=='Y99'"><i class="fas fa-times-circle"></i></div>
                  </div>
                </div>
              </div>
              <!-- -->
              <div class="item item-grid" v-if="filterYear.alias == 'Y99'">
                <i class="fas fa-chevron-right"></i>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                  <b-form-input @keydown.native="onlyNumber" v-model="filterYearLess" v-validate="'max:4'" maxlength="4"></b-form-input>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                  <b-form-input @keydown.native="onlyNumber" v-model="filterYearHigher" v-validate="'max:4'" maxlength="4"></b-form-input>
                </b-form-group>
                <i class="fas fa-chevron-left"></i>
                <sipsder-btn btnType="search" text=""  @onClick="loadMore()"></sipsder-btn>
              </div>
              <!-- -->
               <div class="filter-item item">
                <div class="title">{{$t( 'library.type' )}}</div>
                <div>
                  <div v-for="(type,i) in filterTypesOps" :key="i" class="select-item" :class="{ 'selected' : type.alias == filterType.alias , 'not-show' : type.alias != filterType.alias && filterType.alias != undefined}">
                    <div class="name"  @click="filterType=type ; loadMore()" v-b-tooltip.hover :title="type.name">{{type.name}}</div><div class="count" v-if="(type.alias != filterType.alias)"  @click="filterType=type ; loadMore()">{{type.count}}</div><div class="count" @click="filterType={} ; loadMore()" v-else><i class="fas fa-times-circle"></i></div>
                  </div>
                </div>
              </div>
              <!-- -->
              <div class="item">
                {{$t( 'library.rural' )}}
                <div class="item-grid2">
                  <treeselect v-model="selectedQueryModel" 
                    :multiple="false" 
                    :options="ruralModels"
                    :openDirection="'below'"
                    :placeholder="$t( 'faqs.modal.rural_select' )"
                    :clearable="true"
                    :default-expand-level="1">
                    <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                      <img v-if="node.raw && node.raw.url != null" 
                          :src="node.raw.url" height="16" width="16">
                      <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                      <span> {{ node.label.split('/')[0] }} </span>
                      <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                      <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                    </label>
                  </treeselect>
                  <sipsder-btn btnType="search" text="" @onClick="loadMore()"></sipsder-btn>
                </div>
              </div>
              <!-- -->
              <div class="item">
                {{$t( 'library.author' )}}
                <div class="item-grid3">
                  <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t('library.author_name')" v-model="filterAuthorName" v-validate="'max:70'"></b-form-input>
                  </b-form-group>
                  <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t('library.author_lastname')" v-model="filterAuthorLastName" v-validate="'max:70'"></b-form-input>
                  </b-form-group>
                  <sipsder-btn btnType="search" text="" @onClick="loadMore()"></sipsder-btn>
                </div>
              </div>
              <!-- -->
              <div class="item" v-if="isAdministrator">
                {{$t( 'library.status' )}}
                <div class="item-grid2">
                  <b-form-group :label-cols="4" label-class="font-weight-bold">
                    <v-select v-model.trim="filterState" label="name" :placeholder="$t( 'community.survey.status' )" :options="filterStateOpsAdmin"></v-select>
                  </b-form-group>
                  <sipsder-btn btnType="search" text="" @onClick="loadMore()"></sipsder-btn>
                </div>
              </div>
              <div class="item" v-if="isAdministrator">
                {{$t( 'library.enabled' )}}
                <div class="item-grid2">
                  <b-form-group :label-cols="4" label-class="font-weight-bold" disabled>
                    <v-select v-model="filterEnabled" label="name" :placeholder="$t( 'library.enabled' )" :options="filterEnabledOpsAdmin" ></v-select>
                  </b-form-group>
                  <sipsder-btn btnType="search" text="" @onClick="loadMore()" ></sipsder-btn>
                </div>
              </div>
              <!-- -->
              <div class="filter-item item" v-if="isAdministrator">
                <div class="title">{{$t( 'library.userType' )}}</div>
                <div>
                  <div v-for="(user,i) in filterUserTypesOps" :key="i" class="select-item" :class="{ 'selected' : user.alias == filterUserType.alias, 'not-show' : user.alias != filterUserType.alias && filterUserType.alias != undefined }">
                    <div class="name" @click="filterUserType=user ; loadMore()" v-b-tooltip.hover :title="user.name">{{user.name}}</div>
                    <div class="count" @click="filterUserType=user ; loadMore()" v-if="user.alias != filterUserType.alias && filterUserOps[i]" >
                      {{filterUserOps[i].count}}
                      </div>
                    <div class="count" @click="filterUserType={} ; loadMore()" v-else>
                      <i class="fas fa-times-circle"></i>
                    </div>
                  </div>
                </div>
              </div>
              <!-- -->
              <div class="item" v-if="filterUserType.alias == 'U1' || filterUserType.alias== 'U2' && isAdministrator">
                {{$t( 'library.user' )}}
                <div class="item-grid2">
                  <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t('library.user_added')" v-model="filterSpecificUser" v-validate="'max:70'"></b-form-input>
                  </b-form-group>
                  <sipsder-btn btnType="search" text="" @onClick="loadMore()" ></sipsder-btn>
                </div>
              </div>
              <!-- -->
              <div class="item">
                {{$t( 'library.rulesMessage' )}} <router-link :to="{ name: 'NormogramIndex'}" >{{$t( 'library.here' )}}</router-link>
              </div>
            </div>
            <!-- -->
            <div class="col-b">
              <div class="item">
                <div class="info-filter">
                  <div class="info" v-if="meta">
                    {{$t( 'library.youCan' )}} {{meta.totalElements}} {{$t( 'library.results' )}}
                  </div>
                  <div class="sort" v-if="isAdministrator">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                      {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderAdminOps"></v-select>
                    </b-form-group>
                  </div>
                  <div class="sort" v-else>
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                      {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderOps"></v-select>
                    </b-form-group>
                  </div>
                </div>
                <div class="resume-filters" v-if="isFiltered">
                  {{$t( 'library.filterResume' )}} 
                  <span class="selected" v-if="filterQ != ''">{{filterQ}} <span @click="filterQ=''; loadMore()" style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterYear.name != undefined && filterYear.alias!='Y99'">{{filterYear.name}} <span @click="filterYear={}; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterYear.name != undefined && filterYear.alias=='Y99' && (filterYearLess != '' || filterYearHigher != '')"><span v-if="filterYearLess != ''"><i class="fas fa-chevron-right"></i> {{filterYearLess}}</span><span v-if="filterYearHigher != '' && filterYearLess != ''"> - </span><span v-if="filterYearHigher != ''">{{filterYearHigher}} <i class="fas fa-chevron-left"></i> </span><span></span> <span @click="filterYear={}; filterYearHigher=''; filterYearLess='' ; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterType.name != undefined">{{filterType.name}} <span @click="filterType={}; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="selectedRuralModels != ''">{{selectedRuralModels}} <span @click="selectedQueryModel = undefined ; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterAuthorName != '' || filterAuthorLastName != ''">{{filterAuthorName}} {{filterAuthorLastName}} <span @click="filterAuthorName=''; filterAuthorLastName=''; loadMore()" style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterState.name != undefined">{{filterState.name}} <span @click="filterState={} ; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterEnabled.name != undefined">{{filterEnabled.name}} <span @click="filterEnabled={} ; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterUserType.name != undefined">{{filterUserType.name}} <span @click="filterUserType={} ; loadMore()"  style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  <span class="selected" v-if="filterSpecificUser != ''">{{filterSpecificUser}} <span @click="filterSpecificUser='' ; loadMore()" style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                </div>
                <br>

                <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null" class="pagination-top"
                  @input="loadMore()"
                  :per-page="filterParams.size"
                ></b-pagination>

              </div>
              <div class="document-item item" v-for="(document,i) in documents" :key="i">
                <div class="grid-content">
                  <div>
                    <div v-if="isLogged">
                      <span v-html="getStatus(document.statusId)"></span>
                      <span v-if="(isAdministrator || isOwner(document)) && document.statusId == DOCUMENT_STATES.PUBLISH"> - </span>
                      <span v-if="isAdministrator || isOwner(document)" v-html="getEnabled(document.statusId, document.enabled)"></span><br>
                    </div>
                    <br>
                    <div v-if="document.title">
                      <b>
                        <router-link :to="{ name: $route.meta.nextView , params: { id: document.id }}" style="color: black">{{document.title}}</router-link>
                      </b>
                    </div>
                    <div v-else>
                      <b>
                      <router-link :to="{ name: $route.meta.nextView , params: { id: document.id }}" style="color: black">{{ $t('library.see_document' ) }}</router-link>
                      </b>
                    </div>
                    <div v-if="document.userId && isLogged">
                      <b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{document.userName}} {{document.userLastName}}, {{document.userType}}
                    </div>
                    <br>
                      {{document.summary}}
                    <br>
                    <span v-for="(author,i) in document.authors" :key="i">{{author.name}} {{author.lastName}} ,</span> {{document.year}}<br>
                    <div class="colors-container" >
                      <div class="colors" v-for="(r, j) in document.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                    </div>
                  </div>
                  <div class="icon">
                    <img :src="document.icon"><br>
                    <span style="display: inline-block; margin-top: -10px">{{document.typeName}}</span>
                    
                     <!-- <div class="share" v-if="documents.length>0">
                      <social-networks-share :detailedUrl="'/view-document/'+document.id"></social-networks-share> -->
                      
                     <!--  <score-component :idContent="document.id" 
                      :idType="SCORE_CONTENT_TYPE.DOCUMENTS"
                      :likes="document.likes"
                      :dislikes="document.dislikes"></score-component>

                      <report-component :contentId="document.id" 
                      :content-type="REPORT_CONTENT_TYPES.DOCUMENTS"></report-component>  -->

                    <!-- </div> -->
                  </div>
                </div>
              </div>
              <br>
              <div>
                <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
                  @input="loadMore()"
                  :per-page="filterParams.size"
                ></b-pagination>
              </div>
            </div>
          </div>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../http_common';
import SocialNetworksShare from './social_networks_share/SocialNetworksShare.vue';
import ReportComponent from './ReportComponent.vue';
import ScoreComponent from './ScoreComponent.vue';
import { SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES, HTTP_STATUS, SERVICE_NAMES } from '../../sipsder_constants';
import { PERMISSIONS_TYPES, DOCUMENT_STATES} from '../../domain_constants'
import _ from 'lodash';

export default {
   components:{
    Treeselect,
    vSelect,
    SocialNetworksShare,
    ReportComponent,
    ScoreComponent,
  },
  props:["ruralModel"],
  data(){
    return {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      DOCUMENT_STATES,
      counts:[],
      documents:[],
      meta:[],
      isFiltered: false,
      ruralModels: [],
      selectedQueryModel: undefined,
      filterQ: "",
      filterAuthorName: "",
      filterAuthorLastName: "",
      filterOrderAdminOps:[
        {
          value: "year,desc",
          label: this.$t( 'library.date' )+" ↓"
        },
          {
          value: "year,asc",
          label: this.$t( 'library.date' )+" ↑"
        },
         {
          value: "document.title,desc",
          label: this.$t( 'community.survey.titleT' )+" ↓"
        },
        {
          value: "document.title,asc",
          label: this.$t( 'community.survey.titleT' )+" ↑"
        },
        {
          value: "status,desc",
          label: this.$t( 'community.survey.status' )+" ↓"
        },
         {
          value: "status,asc",
          label: this.$t( 'community.survey.status' )+" ↑"
        },
        {
          value: "authors.author.name,desc",
          label: this.$t( 'library.author' )+" ↓"
        },
         {
          value: "authors.author.name,asc",
          label: this.$t( 'library.author' )+" ↑"
        },
        {
          value: "lastModifiedDate,desc",
          label: this.$t( 'library.lastModified' )+" ↓"
        },
      ],
      filterOrderOps:[
        {
          value: "year,desc",
          label: this.$t( 'library.date' )+" ↓"
        },
          {
          value: "year,asc",
          label: this.$t( 'library.date' )+" ↑"
        },
         {
          value: "document.title,desc",
          label: this.$t( 'community.survey.titleT' )+" ↓"
        },
        {
          value: "document.title,asc",
          label: this.$t( 'community.survey.titleT' )+" ↑"
        },
         {
          value: "authors.author.name,desc",
          label: this.$t( 'library.author' )+" ↓"
        },
         {
          value: "authors.author.name,asc",
          label: this.$t( 'library.author' )+" ↑"
        },
        {
          value: "status,desc",
          label: this.$t( 'community.survey.status' )+" ↓"
        },
         {
          value: "status,asc",
          label: this.$t( 'community.survey.status' )+" ↑"
        },
      ],
      filterOrder:{value: "year,desc", label: this.$t( 'library.date' )+" ↓"},
      filterState: {},
      filterStateOpsAdmin:[
        {
          id: DOCUMENT_STATES.PUBLISH,
          name: this.$t( 'library.show' )
        },
        {
          id: DOCUMENT_STATES.REJECTED,
          name: this.$t( 'library.noShow' )
        },
        {
          id: DOCUMENT_STATES.AWAITED,
          name: this.$t( 'library.futureShow' )
        },
      ],
      filterEnabled: {},
      filterEnabledOpsAdmin:[
        {
          id: true,
          name: this.$t( 'library.enabled' )
        },
        {
          id: false,
          name: this.$t( 'library.disabled' )
        },
      ],
      filterSpecificUser: "",
      filterYear:{},
      filterYearLess: "",
      filterYearHigher: "",
      filterType:{},
      filterUserTypesOps:[
        {
          name: this.$t( 'library.createdForMe' ),
          alias: "U0",
          count: 0
        },/*,
        {
          name: "Agregados por otros administradores",
          alias: "U1",
          count: 0
        },*/
        {
          name: this.$t( 'library.otherUser'),
          alias: "U2",
          count: 0
        }
      ],
      filterUserType:{},
      filterParams: {
          page: 1,                    // Page number
          size: 10,                   // Page size
      },
      cntLoadMore: 0,
    }
  },
   watch:{
    filterOrder : {
       handler: function(val, oldVal) {
        if (this.cntLoadMore > 0) {
          this.loadMore();
        }
        this.cntLoadMore += 1;
      },
      deep: true
    },
    selectedQueryModel : {
       handler: function(val, oldVal) {
        this.loadMore();
      },
      deep: true
    }
  },
  computed: {
    selectedRuralModels(){
      let ruralName ="";
      if(this.selectedQueryModel !=undefined){
        let id = this.selectedQueryModel
        this.ruralModels.forEach(e=>{
          if(e.id == id){
            let name = e.label
            ruralName=name
          }
          if(e.children){
            e.children.forEach(e=>{
              if(e.id == id){
                let name = e.label
                ruralName=name
              }
              if(e.children){
                e.children.forEach(e=>{
                  if(e.id == id){
                    let name = e.label
                    ruralName=name
                  }
                  if(e.children){
                    e.children.forEach(e=>{
                      if(e.id == id){
                        let name = e.label
                        ruralName=name
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      return ruralName
    },
    filterYearsOps(){
      return this.counts.filter(e=>{return e.alias.indexOf("Y")== 0})
    },
    filterTypesOps(){
      return this.counts.filter(e=>{return e.alias.indexOf("T")== 0})
    },
    filterUserOps(){
      return this.counts.filter(e=>{return e.alias.indexOf("U")== 0})
    },
    isAdministrator( ) {
      let isAdmin = false;
      if (this.$store.getters.isAuthenticated)
        if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
          isAdmin = true     
      return isAdmin;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated
    },
    isCommunityPage() {
      return (this.$route.meta.community);
    },
    communtyLink(){
      if(this.$route.meta.community){
        return '/community'
      }
      return ''
    }
  },
  async beforeMount() {
    try{
      if(this.isAdministrator){
        this.filterOrder={
          value: "lastModifiedDate,desc",
          label: this.$t( 'library.lastModified' )+" ↓"
        }
      }

      if(this.$route.meta.community){
        let response2 = await VAPI.get(`${SERVICE_NAMES.RURAL_DOCUMENTS}/count-community`);
        this.counts = response2.data.data;
      }else{
        let response2 = await VAPI.get(`${SERVICE_NAMES.RURAL_DOCUMENTS}/count-library`);
        this.counts = response2.data.data;
      }

      let response = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree`);
      this.ruralModels = response.data.data;

      if(this.ruralModel != null && this.selectedQueryModel == undefined ){
        this.selectedQueryModel=[this.ruralModel];
      } else {
        if (this.$route.params.ruralModelId) {
          this.selectedQueryModel = this.$route.params.ruralModelId;
        }
        let response3 = await VAPI.get(SERVICE_NAMES.RURAL_DOCUMENTS + this.buildQuery());
        if (response3.status === HTTP_STATUS.OK) {
          this.documents= response3.data.data;
          this.meta = response3.data.meta      
        }
      }
    } catch( error ) {
      console.log( 'Error fetching rural model tree', error );
    }
  },
  methods:{
    isOwner(document){
      if( Number(document.userId) == Number(this.$store.getters.getCurrentUser.id) ){
          return true
      }
      return false
    },
    async loadMore(){
      // console.info("Entrado en cargar mas.", this.filterOrder, this.selectedQueryModel);
      try{
          const response3 = await VAPI.get(SERVICE_NAMES.RURAL_DOCUMENTS + this.buildQuery());
          if (response3.status === HTTP_STATUS.OK) {
            this.documents= response3.data.data;
            this.meta = response3.data.meta
            if (this.meta.totalPages && this.meta.totalPages < this.filterParams.page) {
              this.filterParams.page = 1;
            }
          } else {
            this.meta= {
              totalElements : 0,
              totalPages: 0,
            }
            this.documents=[]
            this.filterParams.page = 1
          }
          this.isFiltered=true
          this.$scrollTo('.pagination-top', 500, {offset: -100,});
      } catch( error ) {
          console.log( 'Error fetching rural model tree', error );
          this.meta=[]
          this.documents=[]
      }
    },
    clear(){
      this.filterQ = ""
      this.filterAuthorName = ""
      this.filterAuthorLastName = ""
      this.filterOrder = {value: "year,desc", label: this.$t( 'library.date' )+" ↓"}
      if(this.isAdministrator){
        this.filterOrder={
          value: "lastModifiedDate,desc",
          label: this.$t( 'library.lastModified' )+" ↓"
        }
      }
      this.filterState = {}
      this.filterEnabled = {}
      this.filterSpecificUser = "",
      this.filterYear = {}
      this.filterYearLess = ""
      this.filterYearHigher = ""
      this.filterType = {}
      this.filterUserType = {},
      this.filterParams = {
          page: 1,                    // Page number
          size: 10,                   // Page size
      }
      this.loadMore()
    },
    buildQuery() {
      const toTwoDigits = num => num < 10 ? '0' + num : num;
      let today = new Date();
      let date= today.getFullYear()+"-"+toTwoDigits(today.getMonth()+1)+"-"+toTwoDigits(today.getDate())+" "+toTwoDigits(today.getHours())+":"+toTwoDigits(today.getMinutes())+":"+toTwoDigits(today.getSeconds())
      let query = this.communtyLink

      query += '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;
      if( this.isAdministrator ) {
          // query += '&enabled=' + this.filterEnabled.id;
          if(this.filterEnabled.id != null){
            query += '&enabled=' + this.filterEnabled.id;
          }
      }else{
          query += '&enabled=' + true
      }
      if( this.filterState.id != undefined) {
          query += '&status=' + this.filterState.id;
      }
      else if(this.isAdministrator &&  this.filterState.id  == undefined){
          query += '&statusA=1,2,4'
      }
      else if(this.filterState.id  == undefined && !this.isLogged){
          query += '&status=1'
      }
      if( this.filterYear.alias != undefined) {
          if(this.filterYear.alias == "Y99"){
            if(this.filterYearHigher != '')
              query += '&endYear=' + this.filterYearHigher;
            if(this.filterYearLess != '')
              query += '&startYear=' + this.filterYearLess
          }
          else if(this.filterYear.alias == "Y0"){
            query += '&startYear=' + 0 +'&endYear=' + 9999;
          }
          else if(this.filterYear.alias == "Y1"){
            query += '&startYear=' + (today.getFullYear()-5) +'&endYear=' + 9999;
          }
          else if(this.filterYear.alias == "Y2"){
            query += '&startYear=' + (today.getFullYear()-10) +'&endYear=' + 9999;
          }
          else if(this.filterYear.alias == "Y3"){
            query += '&startYear=' + (today.getFullYear()-25) +'&endYear=' + 9999;
          }
      }
      if( this.filterUserType.alias != undefined) {
        if(this.filterUserType.alias == 'U0') query += '&userType=' + this.filterUserType.alias.slice(1, this.filterUserType.alias.length)
        if( (this.filterUserType.alias == 'U1' || this.filterUserType.alias == 'U2') && this.filterSpecificUser != ""){
          query += '&userName=' + this.filterSpecificUser
        }
      }
      if( this.filterType.alias != undefined) {
        query += "&type=" + this.filterType.alias.slice(1, this.filterType.alias.length)
      }
      if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
      if( this.filterAuthorName !== '' ) query += '&authorName=' + this.filterAuthorName;
      if( this.filterAuthorLastName !== '' ) query += '&authorLastName=' + this.filterAuthorLastName;
      if(this.selectedQueryModel != undefined) query += '&ruralModels=' + this.selectedQueryModel;
      if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value + '&sort=id,desc';
      else query += '&sort=year,desc&sort=id,desc'

      return query;
    },
    getEnabled(status, enabled){
      let msg = ""
      if(status == DOCUMENT_STATES.PUBLISH){
        if(enabled){
          msg = "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'library.enabled' ).toUpperCase()+"</span>";
        } else {
          msg = "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'library.disabled' ).toUpperCase()+"</span>"
        }
      }
      return msg;
    },
    getStatus(status){
      let msg = ""
      if(status == DOCUMENT_STATES.PUBLISH){
        msg = "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'library.show' ).toUpperCase()+"</span>";
        
      } else if(status == DOCUMENT_STATES.REJECTED){
        msg = "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'library.noShow' ).toUpperCase()+"</span>"
      } else if(status == DOCUMENT_STATES.AWAITED){
        msg = "<span style='color: #65e; font-weight: bold;'>"+this.$t( 'library.futureShow' ).toUpperCase()+"</span>"
      }
      return msg;
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57 ) && keyCode !== 46 && keyCode>31) { 
          $event.preventDefault();
      }
    },
    moveCreateDocument() {
      this.$router.push({ name: this.$route.meta.nextCreate, params: {initialOfficial: false}})
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../stylesheets/style.sass'
.dot
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
.grey-label-text
  color: grey
.library-header
  display: grid
  grid-template-columns: 50% 50%
  grid-gap: 15px
  margin-bottom: 15px
  .filter
    display: grid
    grid-template-columns: 5fr 2fr 
    align-items: center
    position: relative
    .form-group
      z-index: 2
      margin: 0 !important
.library-body
  display: grid
  grid-template-columns: 25% 75%
  grid-gap: 20px
  .col-a
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    padding: 10px
    max-height: 1400px
    .head-title
      text-align: center
      margin-bottom: 10px
      font-size: 2rem
      font-weight: bold
    .item
      margin-bottom: 15px
    .item-grid
      display: grid
      grid-template-columns: 1fr 4fr 4fr 1fr 2fr
      grid-gap: 5px
      align-items: center
      justify-items: center
    .item-grid2
      display: grid
      grid-template-columns: 5fr 1fr 
      grid-gap: 5px
      align-items: center
    .item-grid3
      display: grid
      grid-template-columns: 2.5fr 2.5fr 1fr 
      grid-gap: 5px
      align-items: center
    .filter-item
      background: #fff 
      box-shadow: 0px 0px 3px #333
      border-top: 10px solid $colorTitle
      border-bottom: 10px solid $colorTitle
      max-height: 425px
      overflow: auto
      .title
        background: $colorTitle
        color: #fff
        padding: 0 10px
      .select-item
        display: grid
        cursor: pointer
        grid-template-columns: 75% 25%
        padding: 5px
        &:hover
          color: $colorDanger
        .name
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        .count
          text-align: right
      .selected
        color: $colorDanger
      .not-show
        display: none
  .col-b
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    padding: 10px
    .document-item
      border-bottom: 3px solid
      border-image-source: linear-gradient(90deg, transparent 0%, $colorTitle 50%, transparent 100%)
      border-image-slice: 1
      &:last-child
        border: none
    .info-filter
      position: relative
      height: 60px
      .info
        font-size: 2rem
        font-weight: bold
        position: absolute
        top: 0 
        left: 0
      .sort
        position: absolute
        top: 0 
        right: 0
        min-width: 160px
    .resume-filters
      .selected
        color: $colorDanger
        display: inline-block
        margin: 0 10px
    .document-item
      padding: 15px
      .grid-content
        display: grid
        grid-template-columns: 70% 30%
        align-items: center
        .icon
          width: 80%
          text-align: center
          justify-self: end
          img
            height: 110px
        .colors-container
          width: 100%
          height: 30px
          .colors
            margin: 5px 0 0 5px
            width: 25px
            height: 25px
            border-radius: 50%
            float: left
      .share
        margin-top: 25px
        height: 50px
        display: flex
        justify-content: center
        align-content: center
        div
          display: inline-block
          height: 50px
          margin-right: 25px
@media screen and (max-width: $widthDesktop)
  .library-header
    grid-template-columns: 60% 40% !important
  .library-body
    grid-template-columns: 30% 70% !important
  .document-item
    .grid-content
      grid-template-columns: 50% 50% !important
  .share
    div
      margin-right: 15px !important
@media screen and (max-width: $widthTablet)
  .library-header
    grid-template-columns: 90% 10% !important
  .library-body
    grid-template-columns: 90% !important
    .col-a
      .head-title
        font-size: 1.3rem
    .col-b
      .info-filter
        height: auto !important
        .info
          position: relative !important
          font-size: 1.3rem
        .sort
          position: relative !important

  .share
    div
      margin-right: 15px !important
@media screen and (max-width: $widthMobile)
  .library-header
    grid-template-columns: 90% !important
    .filter
      grid-template-columns: 3fr 4fr !important
  .icon
    img
      height: 50px !important
</style>
