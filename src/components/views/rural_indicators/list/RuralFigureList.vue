<template>
    <div>
        <div class="inner-legal-note">
            <note-rich-text :showEdition="isAdministrator" :module="MODULES.RURAL_INDICATORS" 
                keyVal="figure" :textPenEdition="$t('rural_indicators.index.edit_legal_note')">
            </note-rich-text>
        </div>
        <div>
          <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
              <b-row align-v="center">
                <b-col cols="6"><b-form-input :placeholder="$t('rural_indicators.index.keyword_placeholder')" v-validate="'max:70'" v-model="queryKeyword"></b-form-input></b-col>
                <b-col cols="2" class="avoid-padding"> <sipsder-btn btnType="search" @onClick="assembleQuery" :text="''"></sipsder-btn> <sipsder-btn btnType="clean" @onClick="resetFilters()"></sipsder-btn> </b-col>
              </b-row>
          </b-form-group>
        </div>
        <div class="rural-detail-body">
            <div>
                <div class="filter-panel">
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                    <b-form-input :placeholder="$t('rural_indicators.index.model_placeholder')" v-validate="'max:70'" v-model="queryModelKeyword"></b-form-input>  
                </b-form-group>
                <div class="collapse-menu">
                    <div :class="{'collapse': collapse.d1}">
                        <tree-menu v-for="(r,i) in filterRuralModel" :key="i" :node="r" @emitId="onClickChild" :isSearching="isSearching"></tree-menu>
                    </div>
                </div>
                <div class="pt-5">
                    <router-link :to="{name: 'RuralModel' }">{{$t('rural_indicators.index.model_redirect')}}</router-link>
                </div>
                <b-form-group class="pt-5">
                    <b-row align-v="center">
                        <b-col cols="12" class="font-weight-bold">{{$t('rural_indicators.index.insititution_filter')}}</b-col>
                        <b-col><vue-select label="name" :options="entities" v-model="queryEntity" :placeholder="$t( 'rural_indicators.index.insititution_placeholder' )" class="bg-white"></vue-select></b-col>
                        <b-col cols="2" class="avoid-padding"> <sipsder-btn btnType="search" @onClick="assembleQuery" :text="''"></sipsder-btn> </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group class="pt-3">
                    <b-row align-v="center">
                        <b-col cols="12" class="font-weight-bold">{{$t('rural_indicators.index.geographic_filter')}}</b-col>
                        <b-col><vue-select :options="geographicCoverages" v-model="queryGeoCoverage" :placeholder="$t( 'rural_indicators.index.geographic_placeholder' )" class="bg-white"></vue-select></b-col>
                        <b-col cols="2" class="avoid-padding"> <sipsder-btn btnType="search" @onClick="assembleQuery" :text="''"></sipsder-btn> </b-col>
                    </b-row>
                </b-form-group>
                <b-form-group class="pt-3" v-if="isAdministrator">
                    <b-row align-v="center">
                        <b-col cols="12" class="font-weight-bold">{{$t('rural_indicators.index.status_filter')}}</b-col>
                        <b-col><vue-select :options="status" v-model="queryStatus" :placeholder="$t('rural_indicators.index.status_placeholder')" class="bg-white"></vue-select></b-col>
                        <b-col cols="2" class="avoid-padding"> <sipsder-btn btnType="search" @onClick="assembleQuery" :text="''"></sipsder-btn> </b-col>
                    </b-row>
                </b-form-group>
                </div>
            </div>
            <div class="content-panel">
              <b-row class="px-3 py-3">
                  <b-col cols="8">
                    <div class="font-weight-bold"> {{ meta.totalElements }} {{ $t('rural_indicators.index.results')}} </div>
                    <div> {{ $t('rural_indicators.index.filter_summary') }} </div>
                  </b-col>
                  <b-col cols="4">
                      <div class="sort" v-if="isAdministrator">
                          <b-form-group :label-cols="4" label-class="font-weight-bold">
                              {{$t( 'library.orderBy' )}} 
                              <vue-select v-model="queryOrder" label="label" :options="filterOrderAdminOps"></vue-select>
                          </b-form-group>
                      </div>
                      <div class="sort" v-else>
                          <b-form-group :label-cols="4" label-class="font-weight-bold">
                              {{$t( 'library.orderBy' )}}
                              <vue-select v-model="queryOrder" label="label" :options="filterOrderOps"></vue-select>
                          </b-form-group>
                      </div>
                  </b-col>
              </b-row>
              <b-row class="px-3 py-3">
                  <div v-for="(item, i) in queryObject" :key="i">
                      <span class="selected px-2">{{ item.text }} <span @click="deleteQueryItem(item)" style="cursor:pointer"><i class="fas fa-times-circle"></i></span></span>
                  </div>
              </b-row>
              <b-pagination size="lg" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements > 0"
                  @input="loadMore()"
                  :per-page="filterParams.size">
              </b-pagination>
              <b-row class="px-5 py-3" align-h="center" align-v="center" v-if="indicators != null && indicators.length == 0">
                <div class="bordered-blue-container">
                  {{ $t('rural_indicators.index.not_found') }}
                </div>
              </b-row>
              <b-row class="px-5 py-3" align-v="center" v-else>
                <b-row v-for="(indicator, i) in indicators" :key="i" class="w-100">
                    <b-col cols="2" class="p-0">
                      <map-preview :value="indicator.mapUrl" display-simple />
                    </b-col>
                    <b-col cols="10">
                        <b-row class="px-3" align-v="center">
                            <b-col>
                                <div v-if="isAdministrator" class="indicator-status" :class="{ enabled: indicator.enabled, disabled: !indicator.enabled }"> {{ indicator.enabled? $t('rural_indicators.index.status.enabled') : $t('rural_indicators.index.status.disabled') }}</div>
                                <router-link :to="{ name: 'RuralFigureDetail' , params: { id: indicator.id }}" class="indicator-name">{{ indicator.name }}</router-link>
                                <div><strong>{{ $t('rural_indicators.admin.geographic_coverage') }}:</strong> {{ indicator.geographic }}, <strong>{{ $t('rural_indicators.index.update') }}:</strong> {{ indicator.updateDate | moment("DD/MM/YYYY") }}</div>
                                <div class="colors-container" >
                                    <div class="colors" v-for="(r, j) in indicator.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                                </div>
                            </b-col>
                            <b-col cols="1" v-if="isAdministrator">
                                <div class="avoid-padding"> <sipsder-btn btnType="edit" :text="''" @onClick="editFigure( indicator.id )"></sipsder-btn> </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col class="px-5 w-100">
                        <hr class="faded">
                    </b-col>
                </b-row>
              </b-row>
              <b-pagination size="lg" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements > 0"
                  @input="loadMore()"
                  :per-page="filterParams.size">
              </b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { PERMISSIONS_TYPES, MODULES } from '../../../../domain_constants';
import TreeMenu from '../../../shared/TreeMenu.vue';
import VueSelect from "vue-select";
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue'
import MapPreview from '@/components/shared/arcgis/MapPreview';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../../sipsder_constants';
import { RURALMODEL } from '../../../../domain_constants';
import VAPI from '../../../../http_common';
import moment from 'moment';

export default {
  components: {
    TreeMenu,
    VueSelect,
    NoteRichText,
    MapPreview,
  },
  async beforeMount( ) {
    this.ruralModelTree = await this.getRuralModelTree( true );
    this.entities = await this.getEntities( );
    this.geographicCoverages = await this.getGeographicCoverages( );
    if(this.$route.params.rural !==null && this.$route.params.rural !==undefined ){
      this.queryModel = this.findRuralModel( this.$route.params.rural);
      this.assembleQuery( );
      this.isSearching = true
      this.getIndicators()
    }
    this.assembleQuery( );
  },
  data() {
    return {
      PERMISSIONS_TYPES,
      MODULES,
      entities: [],
      geographicCoverages: [],
      indicators: [],
      meta:{
        totalPages: 0,
        totalElements: 0,
        elementsPage: 0
      },
      status: [
        {label: this.$t('rural_indicators.index.status.all'), value: null},
        {label: this.$t('rural_indicators.index.status.enabled'), value: true},
        {label: this.$t('rural_indicators.index.status.disabled'), value: false}
      ],
      //Filters
      isSearching: false,
      ruralModelTree: null,
      filterOrderOps:[
        { value: "name,asc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↑" },
        { value: "name,desc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↓" },
        { value: "updateDate,asc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↑" },
        { value: "updateDate,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
      ],
      filterOrderAdminOps:[
        { value: "name,asc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↑" },
        { value: "name,desc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↓" },
        { value: "updateDate,asc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↑" },
        { value: "updateDate,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
        { value: "lastModifiedDate,asc", label: this.$t( 'rural_indicators.index.filter.update' )+" ↑" },
        { value: "lastModifiedDate,desc", label: this.$t( 'rural_indicators.index.filter.update' )+" ↓" },
      ],
      queryOrder: { value: "updateDate,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
      filterParams: {
          page: 1,                    // Page number
          size: 10,                   // Page size
      },
      collapse:{
        d1: false,
        d2: false
      },
      pageCount: 0,
      queryString: '',
      queryObject: [],
      queryModelKeyword: '',
      queryModel: null,
      queryEntity: null,
      queryGeoCoverage: null,
      queryStatus: null,
      queryKeyword: ''
    }
  },
  methods: {
    async getRuralModelTree( active ) {
      try {
        let path = active ? `/${SERVICE_NAMES.RURAL_MODEL}/tree?active=true` : `/${SERVICE_NAMES.RURAL_MODEL}/tree`;
        const response = await VAPI.get( path );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching rural model tree', error );
      }
    },
    async getEntities( ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.INSTITUTION}/all` );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching rural model tree', error );
      }
    },
    async getGeographicCoverages() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/list/geographic/search` );
        let allOptions = [];
        response.data.data.forEach(option => {
          allOptions.push( option.value );
        })
        response.data.data.unshift({label: this.$t('rural_indicators.index.status.all'), value: allOptions.join(',')});
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching geographic coverages ', err )
      }
    },
    async getIndicators( ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/all/figures${this.queryString}` );
        return response;
      }
      catch( error ) {
        console.log( 'Error fetching rural model tree', error );
      }
    },
    onClickChild( event ) {
      this.queryModel = this.findRuralModel( event );
      this.assembleQuery( );
    },
    findInTree( node, id ){
      if ( node.id == id ) {
        return node;
      }
      var res = null;
      for ( var idx = 0;node.children && idx < node.children.length; idx++ ) {
        var nNode = node.children[ idx ];
        let val = this.findInTree( nNode, id );
        if ( val ) {
          res = val;
          break;
        }
      }
      return res;
    },
    findRuralModel( rural ) {
      if( !this.ruralModelTree )
          return rural;
      let model = null;
      this.ruralModelTree.forEach( node => { 
        let value = this.findInTree( node, rural );
        if ( value ) {
          model = value;
        }
      });
      return model;
    },
    deleteQueryItem( item ) {
      this.queryObject.splice( this.queryObject.indexOf( item ), 1 );
      this[ item.query ] = null;
      this.assembleQuery( );
    },
    assembleQuery( ) {
      let query = [];
      let object = [];

      if(this.$route.query.housing && this.pageCount == 0){
        this.queryModel = this.findRuralModel( RURALMODEL.HOUSING );
      }

      if( this.queryModel != null ) {
        query.push( "ruralModel=" + this.queryModel.id );
        object.push( { text: this.queryModel.label, query: 'queryModel' } );
      }
      if( this.queryEntity != null ){
        query.push( "entity=" + this.queryEntity.id );
        object.push( { text: this.queryEntity.name, query: 'queryEntity' }  );
      } 
      if( this.queryGeoCoverage != null ) {
        query.push( "geographic=" + this.queryGeoCoverage.value );
        object.push( { text: this.queryGeoCoverage.label, query: 'queryGeoCoverage' }  );
      } 
      if( this.queryStatus != null ) {
        if( this.queryStatus.value != null ) {
          query.push( "status=" + this.queryStatus.value );
        }
        object.push( { text: this.queryStatus.label, query: 'queryStatus' }  );
      }
      if( this.queryKeyword != null && this.queryKeyword != '' ) {
        query.push( "keyword=" + this.queryKeyword );
        object.push( { text: "Palabra clave: '" + this.queryKeyword + "'", query: 'queryKeyword' }  );
      }
      
      this.queryString = '?' + query.join('&');
      if( query.length > 0 ) this.queryString += '&';
      this.queryString += `sort=${this.queryOrder.value}&size=${this.filterParams.size}&page=${this.filterParams.page - 1}`;

      if( !this.isAdministrator ) {
        this.queryString += '&status=true';
      }

      this.pageCount += 1
      this.queryObject = object;
    },
    resetFilters() {
      this.queryOrder = { value: "updateDate,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" };
      this.filterParams.page = 1;
      this.filterParams.size =  10;
      this.queryModelKeyword = '';
      this.queryModel = null;
      this.queryEntity = null;
      this.queryGeoCoverage = null;
      this.queryStatus = null;
      this.queryKeyword = '';
      this.assembleQuery( );
    },
    loadMore( ) {
      this.assembleQuery( );
      window.scrollTo( { top: 100, left: 0, behavior: 'smooth' } );
    },
    editFigure( index ) {
      this.$router.push({
        name: 'RuralFigureCreate',
        params: {
          id: '' + index
        }
      });
    }
  },
  computed: {
    isAdministrator( ) {
      if( this.$store.getters.isAuthenticated &&
          this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
        return true;
      return false;
    },
    filterRuralModel( ) {
      const self = this
      var result = []
      function getAll(p){
        var aux = false
        JSON.parse(JSON.stringify(p)).forEach(e=>{
          if (e.children) aux = getAll(e.children)
          if(e.label.toLowerCase().includes(self.queryModelKeyword.toLowerCase()) || aux) {
            e.label= e.label.toLowerCase().replace(self.queryModelKeyword.toLowerCase(), '<span style="font-weight:bold">'+self.queryModelKeyword.toLowerCase()+'</span>')
            result.push(e)
          } 
        })
      }
      if( this.ruralModelTree == null)
        return null
      if( self.queryModelKeyword === '')
        return this.ruralModelTree
      getAll(this.ruralModelTree)
      return result 
    },
  },
  watch: {
    queryModelKeyword: function (val) {
      if(val === '')
        this.isSearching = false
      else
        this.isSearching = true
    },
    async queryString( ) {
      let response = await this.getIndicators( );
      if( response.status == HTTP_STATUS.OK ) {
        this.meta = response.data.meta;
        this.indicators = response.data.data;
      }
      else {
        this.meta = {
          totalPages: 0,
          totalElements: 0,
          elementsPage: 0
        };
        this.indicators = [];
      }
      
    },
    queryOrder() {
      this.assembleQuery();
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'
.collapse
  height: 0

.menu
  cursor: pointer
  height: 40px

.avoid-padding
  margin: 0px
  max-width: none
  padding: 0px

.bordered-blue-container
  padding: 20px
  border: 2px solid $colorTitle
  border-radius: 15px

.faded
  border: 0
  height: 2px
  background: #fff
  background: linear-gradient(to left, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,.75) 50%, hsla(0,0%,0%,.1) 100%)
  +flexbox

.title
  background: $colorTitle
  color: #fff
  padding: 0 10px

.rural-indicators
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.rural-detail-body
  font-family: "Open Sans", sans-serif
  font-size: 1.5rem
  display: grid
  grid-gap: 15px
  grid-template-columns: 25% 75%
  grid-template-areas: 'a b' '. c'

.filter-panel
  grid-area: a
  border: 2px solid $colorTitle
  padding: 10px
  border-radius: 15px;
  
.content-panel
  grid-area: b

.div-90
  width: 90%
  margin-left: auto
  margin-right: auto

.collapse-menu
  height: auto
  max-height: 800px
  overflow-y: auto
  overflow-x: hidden
  background: #fff 
  box-shadow: 0px 0px 3px #333
  border-top: 10px solid $colorTitle
  border-bottom: 10px solid $colorTitle
    
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../assets/title/barra_sola_2.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 110%
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

.btn-container
  margin-top: 15px;
  width: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .sipsder-button
    margin: 0 1%

.selected
    color: $colorDanger

.text
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 50px auto
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
        padding: 20px
        overflow: hidden
        overflow-y: auto 
        border: 1px solid $colorTitle
        min-height: 1900px;
        .titlep
            text-align: center
            font-weight: bold

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

.enabled
  color: #009E11
.disabled
  color: #660000
.indicator-status
  font-size: larger
.indicator-name
  font-size: larger
  color: black
.colors-container
  width: 100%
  height: 30px
  .colors
    margin: 5px 0 0 5px
    width: 25px
    height: 25px
    border-radius: 50%
    float: left
.legal-note
  margin-top: 20px
  margin-left: 80px
  margin-right: 80px
  margin-bottom: 50px
.inner-legal-note
  margin-top: 0px
  margin-left: 20px
  margin-right: 20px
  margin-bottom: 20px

@media screen  and (max-width: $widthDesktop)
    .tab-design
        font-size: 1.1rem !important
    .rural-detail-body
        font-size: 1.2rem !important
        grid-template-columns: 30% 70% !important
    .related-buttons
        font-size: 1.1rem !important
        .item
            height: 300px !important
            .body
                img
                    height: 100px !important
            .foot
                width: 80%  !important
    .collapse-bar
        font-size: 1.1rem !important
        white-space: nowrap !important
    .filter-panel , .content-panel
        max-width: 712px

@media screen  and (max-width: $widthTablet)
    .tab-design
        font-size: 1.2rem !important
    .rural-detail-body
        grid-template-columns: 100% !important
        grid-template-areas: 'a' 'b' 'c' !important
    .related-buttons
        grid-template-columns: 100% !important
    .collapse-bar
        font-size: 1.2rem !important
        white-space: nowrap !important
    .filter-panel , .content-panel
        max-width: 712px

@media screen  and (max-width: $widthMobile)

    .filter-panel , .content-panel
        max-width: 412px
</style>