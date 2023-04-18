<template>
    <div>
        <div class="inner-legal-note">
            <note-rich-text :showEdition="isAdministrator" :module="MODULES.RURAL_INDICATORS" 
                keyVal="bulletin" :textPenEdition="$t('rural_indicators.index.edit_legal_note')">
            </note-rich-text>
        </div>

        <div class="w-100">
            <div class="search-box mb-5">
                <b-row>
                    <b-col cols="3" class="title">
                        {{ 'Filtrar busqueda'.toUpperCase()}}
                    </b-col>
                    <b-col cols="4">
                        <b-form-group class="pt-3" v-if="isAdministrator">
                            <b-row align-v="center">
                                <b-col><vue-select :options="status" v-model="queryStatus" :placeholder="$t('rural_indicators.index.status_placeholder')" class="bg-white"></vue-select></b-col>
                            </b-row>
                        </b-form-group>
                    </b-col>
                    <b-col cols="4">
                      <b-form-group class="pt-3">
                          <b-row align-v="center">
                            <b-col><b-form-input :placeholder="$t('rural_indicators.index.keyword_placeholder')" v-validate="'max:70'" v-model="queryKeyword"></b-form-input></b-col>
                          </b-row>
                      </b-form-group>
                    </b-col>
                </b-row>
                <b-row align-h="center" px-5>
                    <sipsder-btn btnType="search" @onClick="assembleQuery"></sipsder-btn>
                    <sipsder-btn btnType="clean" @onClick="resetFilters()"></sipsder-btn>
                </b-row>
            </div>
            <div>
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
                  class="paginator-color"
                  :per-page="filterParams.size">
              </b-pagination>
              <b-row class="px-5 py-3" align-h="center" align-v="center" v-if="indexes != null && indexes.length == 0">
                <div class="bordered-blue-container">
                  {{ $t('rural_indicators.index.not_found') }}
                </div>
              </b-row>
              <b-row class="px-5 py-3" align-v="center" v-else>
                <b-row v-for="(index, i) in indexes" :key="i" class="w-100">
                    <b-col cols="12">
                        <b-row class="px-3" align-v="center">
                            <b-col>
                                <div v-if="isAdministrator" class="indicator-status" :class="{ enabled: index.enabled, disabled: !index.enabled }"> {{ index.enabled? $t('rural_indicators.index.status.enabled') : $t('rural_indicators.index.status.disabled') }}</div>
                                <router-link :to="{ name: 'LibraryView' , params: { id: index.id }}" class="indicator-name">{{ index.name }}</router-link>
                                <div><strong>{{ $t('rural_indicators.admin.summary') }}:</strong> {{ index.summary }}</div>
                                <div>{{ index.author }}. {{ index.year }}</div>
                                <div class="colors-container" >
                                    <div class="colors" v-for="(r, j) in index.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                                </div>
                            </b-col>
                            <b-col cols="1" v-if="isAdministrator">
                                <div class="avoid-padding"> <sipsder-btn btnType="edit" :text="''" @onClick="editIndex( index.id )"></sipsder-btn> </div>
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
import { SERVICE_NAMES, HTTP_STATUS } from '../../../../sipsder_constants';
import { RURALMODEL } from '../../../../domain_constants';
import VAPI from '../../../../http_common';
import moment from 'moment';

export default {
  components: {
    TreeMenu,
    VueSelect,
    NoteRichText
  },
  async beforeMount( ) {
    this.assembleQuery( );
  },
  data() {
    return {
      PERMISSIONS_TYPES,
      MODULES,
      geographicCoverages: [],
      indexes: [],
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
      filterOrderOps:[
        { value: "name,asc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↑" },
        { value: "name,desc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↓" },
        { value: "year,asc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↑" },
        { value: "year,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
      ],
      filterOrderAdminOps:[
        { value: "name,asc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↑" },
        { value: "name,desc", label: this.$t( 'rural_indicators.index.filter.name' )+" ↓" },
        { value: "year,asc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↑" },
        { value: "year,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
        { value: "lastModifiedDate,asc", label: this.$t( 'rural_indicators.index.filter.update' )+" ↑" },
        { value: "lastModifiedDate,desc", label: this.$t( 'rural_indicators.index.filter.update' )+" ↓" },
      ],
      queryOrder: { value: "year,desc", label: this.$t( 'rural_indicators.index.filter.date' )+" ↓" },
      filterParams: {
          page: 1,                    // Page number
          size: 10,                   // Page size
      },
      pageCount: 0,
      queryString: '',
      queryObject: [],
      queryStatus: null,
      queryKeyword: ''
    }
  },
  methods: {
    async getIndexes( ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/all/bulletin${this.queryString}` );
        return response;
      }
      catch( error ) {
        console.log( 'Error fetching bulletins', error );
      }
    },
    deleteQueryItem( item ) {
      this.queryObject.splice( this.queryObject.indexOf( item ), 1 );
      this[ item.query ] = null;
      this.assembleQuery( );
    },
    assembleQuery( ) {
      let query = [];
      let object = [];

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
      this.queryStatus = null;
      this.queryKeyword = '';
      this.assembleQuery( );
    },
    loadMore( ) {
      this.assembleQuery( );
      window.scrollTo( { top: 100, left: 0, behavior: 'smooth' } );
    },
    editIndex( index ) {
      this.$router.push({
        name: 'RuralBulletinCreate',
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
    }
  },
  watch: {
    async queryString( ) {
      let response = await this.getIndexes( );
      if( response.status == HTTP_STATUS.OK ) {
        this.meta = response.data.meta;
        this.indexes = response.data.data;
      }
      else {
        this.meta = {
          totalPages: 0,
          totalElements: 0,
          elementsPage: 0
        };
        this.indexes = [];
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
.title
  color: white;
  font-weight: bolder;
  font-size: x-large;
  padding-top: 10px;
  padding-left: 20px;
.search-box
  background-color: #02747C
  color: black
  padding: 15px 15px 5px 15px
  border-radius: 10px
.page-item.active .page-link
  background-color: red !important;  
  border-color: red !important;  

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