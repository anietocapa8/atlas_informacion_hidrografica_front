<template>
  <div>
      <div class="feed-title">{{$t( 'normogram.title' )}}</div>
      <div class="container-margin container-form container-fluid col-90">
        <b-row>
          <b-col cols="12" v-if="isAdmin" class="d-flex justify-content-end">
            <sipsder-btn :text="$t('normogram_detail.add_norm')"
                                  btnType="add"
                                  @onClick="newNorm"></sipsder-btn>
          </b-col>   
        </b-row>
        <b-row class="filter">
          <b-col cols="12" class="d-flex justify-content-center flex-column filter-margin">
              <b-row class="mt-2">
                <b-col md="12" lg="4" class="filter-title">
                  <h1 class="">{{$t('normogram.filter_title')}}</h1>
                </b-col>
                <b-col sm="6" md="4" class="d-flex justify-content-right"  v-if="isAdmin">
                  <b-form-group>
                    <b-form-select v-model="status_selected" :options="status" class="status-select"/>
                  </b-form-group>
                </b-col>
                <b-col sm="6" :lg="isAdmin ? 2 : 6" class="d-flex justify-content-right">
                  <b-form-group>
                    <input class="form-control col status-select" type="text" name="url" data-vv-delay="100" :placeholder="$t('normogram.filter_keyword')" v-validate="'required'" v-model="keyword">
                  </b-form-group>
                </b-col>
                <b-col md="auto" lg="2" class="ml-auto label-white" @click="expandfilter">
                  <p class="centered">
                    {{$t('normogram.filter_advance')}} <i :class="'ml-3 fas ' + expandicon + ' expand'"></i>
                  </p>
                </b-col>
              </b-row>
              <b-row v-if="expand">
                <b-col lg="4" class="d-flex justify-content-center w-100">
                  <b-form-group label-class="font-weight-bold">
                    <vue-select label="name" :placeholder="$t('normogram.filter_type')" class="select-white" :options="normtypes" v-model="type_norm"></vue-select>
                  </b-form-group>
                </b-col>
                <b-col lg="4" class="px-0 d-flex justify-content-center">
                  <b-row class="w-100">
                    <b-col cols="4" class="d-flex justify-content-center">
                      <b-form-group>
                        <input class="form-control" type="text" name="url" data-vv-delay="100" :placeholder="$t('normogram.filter_law_number')" v-validate="'required'" v-model="filter_law_number">
                      </b-form-group>
                    </b-col>
                    <b-col cols="4" class="d-flex justify-content-center">
                      <b-form-group>
                        <datepicker :placeholder="$t('normogram.filter_start_date')" 
                                  :calendar-button = "true"
                                  class="date-picker"
                                  calendar-button-icon = "fa fa-calendar"
                                  :clear-button = "true"
                                  v-model="searchDateStart"
                                  >
                        </datepicker>
                      </b-form-group>
                    </b-col>
                    <b-col cols="4" class="d-flex justify-content-center">
                      <b-form-group>
                        <datepicker :placeholder="$t('normogram.filter_end_date')" 
                                  :calendar-button = "true"
                                  calendar-button-icon = "fa fa-calendar"
                                  class="date-picker"
                                  :clear-button = "true"
                                  v-model="searchDateEnd"
                                  :disabledDates="searchenddisabledDates"
                                  >
                        </datepicker>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="4" align-h="between" class="px-0 d-flex justify-content-center">
                  <b-row class="w-100">
                    <b-col md="6" class="d-flex justify-content-center">
                      <b-form-group>
                        <datepicker :placeholder="$t('normogram.filter_exact_date')" 
                                  :calendar-button = "true"
                                  calendar-button-icon = "fa fa-calendar"
                                  class="date-picker"
                                  :clear-button = "true"
                                  v-model="expidationDate"
                                  style="width: 100%"
                                  >
                        </datepicker>
                      </b-form-group>
                    </b-col>
                    <b-col md="auto" class="pt-2 mr-1 label-white">
                        <label>
                          <input
                            type="radio"
                            value="true"
                            @click="filterRuralPolicy = !filterRuralPolicy"
                            v-model="filterRuralPolicy"
                          />
                          {{ $t('normogram.rural_policy') }}
                        </label>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row v-if="expand">
                <b-col md="4" class="d-flex justify-content-center">
                  <b-form-group label-class="font-weight-bold">
                    <vue-select label="name" :placeholder="$t('normogram.filter_expedition_entity') + ' 1'" class="select-white" :options="institutions" v-model="institution1"></vue-select>
                  </b-form-group>
                </b-col>
                <b-col md="4" class="d-flex justify-content-center">
                  <b-form-group label-class="font-weight-bold">
                    <vue-select label="name" :placeholder="$t('normogram.filter_expedition_entity') + ' 2'" class="select-white" :options="institutions" v-model="institution2"></vue-select>
                  </b-form-group>
                </b-col>
                <b-col md="4" class="d-flex justify-content-center">
                  <b-form-group label-class="font-weight-bold">
                    <vue-select label="name" :placeholder="$t('normogram.filter_expedition_entity') + ' 3'" class="select-white" :options="institutions" v-model="institution3"></vue-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row v-if="expand">
                <b-col md="8" lg="4" class="d-flex justify-content-center">
                  <b-form-group>
                    <treeselect 
                        class="normogram-treeselect"
                        v-model="rural_selected"
                        :options="options_rural"
                        :multiple="false" 
                        :searchable="true"
                        :openDirection="'below'"
                        :placeholder="$t('normogram.filter_tree')"
                        :clearable="true"
                    >
                      <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                        <img v-if="node.raw && node.raw.url != null" 
                            :src="getImgURL(node.raw.url)" height="16" width="16">
                        <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                        <span> {{ node.label.split('/')[0] }} </span>
                        <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                        <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                      </label>
                    </treeselect>
                  </b-form-group>
                </b-col>
                <b-col md="4" v-if="isAdmin" class="d-flex justify-content-center">
                    <b-form-group>
                      <vue-select label="name" :placeholder="$t('normogram.filter_user_created')" class="select-white" :options="users" v-model="created_user"></vue-select>
                    </b-form-group>
                </b-col>
                <b-col cols="4" class="d-flex justify-content-center">
                </b-col>
              </b-row>
              <b-row>
                  <b-col cols="6" class="d-flex justify-content-end">
                    <sipsder-btn :text="$t('userAdmin.searcherForm.searchBtn')"
                                  btnType="search"
                                  @onClick="search"></sipsder-btn>
                  </b-col>
                  <b-col cols="6" class="d-flex justify-content-start">
                      <sipsder-btn :text="$t('userAdmin.searcherForm.clearBtn')"
                                  btnType="clean"
                                  @onClick="clean"></sipsder-btn>
                  </b-col>
              </b-row>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" class="d-flex justify-content-center">
            <h1 class="h1-title" style="margin: 10px 0 0 0; height: 10px">{{searchTitle}}</h1>
          </b-col>
          <b-col cols="12" style="margin: 0">
              <filter-table :optionsTable="options_table" :perPage="normsQuery['size']" :items="items" @action="action($event)" :externalQuery="normsQuery" :fields="fields_t"></filter-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center back-button">
            
            <sipsder-btn title="Regresar"
                    btnType="back"
                    @onClick="back"></sipsder-btn>
                            
          </b-col>
        </b-row>
        
        <!--modal de error de fechas -->
        <b-modal ref="dateserror" :title="$t('normogram.date_error_title')" centered hideFooter>
          <div>
            <b-row>
              <b-col cols="2" class="text-right">
                <span class="fill-cols fa fa-exclamation-circle"></span>
              </b-col>
              <b-col cols="10">
                <b><label >{{ $t('normogram.date_error_msg') }}</label></b>
              </b-col>
            </b-row>

          </div>
          <div>
            <b-row>
              <b-col class="text-center">
                <sipsder-btn @onClick="closeErrorModal" btnType="accept" title="Entiendo">
                </sipsder-btn>
                <!-- <b-btn size="sm" variant="outline-info" @click="closeModal('termsAndConditionsModal')">
                  {{$t('registration.continue')}}
                </b-btn> -->
              </b-col>
            </b-row>
          </div>
        </b-modal>
    </div>

  </div>
</template>

<script>

import VAPI from '../../../http_common';
import Router from "../../../router/router";
import Datepicker from 'vuejs-datepicker';
import vSelect from "vue-select";
import Treeselect from '@riophae/vue-treeselect';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import FilterTable from '../../shared/FilterTable.vue'
import _ from 'lodash';
import { PERMISSIONS_TYPES, RURALMODEL} from '../../../domain_constants'
import S_UTIL from "../../../util/sipsder_util";

export default {
  
  data() {
    return {
      dates: "0",
      selected: null,
      //Filters variables
      expand: false,
      status_selected: null,
      keyword: null,
      type_norm: null,
      filter_law_number: null,
      filterRuralPolicy: false,
      expidationDate: null,
      institution1: null,
      institution2: null,
      institution3: null,
      rural_selected: null,
      expandicon: "fa-angle-down",
      created_user: null, 
      //External query data
      searchDateStart: null,
      searchDateEnd: null,
      justification: {
        page: null,
        justification: null,
        document: null
      },
      option_selected: null,
      other: null,
      error: false,
      //Opciones de filtros
      status: [{"value": null, "text": this.$t('normogram.status')}],
      autocomplete: [
        "componenetes",
        "opcion1",
        "opcion2",
        "opcion3",
        "opcion4",
        "autocmopletes"
      ],
      options_rural: null,
      disabledDates: {
          to: new Date(), // Disable all dates after specific date
      },
      searchenddisabledDates: {
        to: new Date(this.searchDateStart), // Disable all dates after specific date
      },
      //Tabla
      searchTitle: "LISTA DE NORMAS",
      normtypes: [],
      options_table: {
        "detail": {
          "id": 0,
          "class": "btn-success",
          "label": "",
          "icon": 'search'
        }   
      },
      normsQuery: {
        "size": 10
      },
      items: 'getNorms',
      fields_t: [
        {
          key: 'typeName',
          label: this.$t('normogram.type'),
          class: 'text-center'
        },
        {
          key: 'code',
          label: this.$t('normogram.code'),
          'class': 'text-center'
        },
        {
          key: 'date',
          label: this.$t('normogram.date'),
          'class': 'text-center'
        },
        {
          key: 'serialIntitutions',
          label: this.$t('normogram.entity'),
          'class': 'text-center'
        },
        {
          key: 'politic',
          label: this.$t('normogram.rural_policy'),
          class: 'text-center',
          type: Boolean,
        },
        {
          key: 'actions',
          label: this.$t('normogram.actions'),
          class: 'text-center',
        }
      ],
      before_isadmin: false
    }
  },
  watch: {
    searchDateStart: function (newVal, oldVal) {
      this.searchenddisabledDates = {
        to: new Date(this.searchDateStart), // Disable all dates after specific date
      }
    }
    
  },
  computed: {
    institutions(){
      return this.$store.getters.getInstitutionsF.sort(function (a, b) {
          return a.name.localeCompare(b.name);
      });
    },
    users(){
      return this.$store.getters.getUsers
    },
    isAdmin(){
      
      
      let isadmin = this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )
      if( this.before_isadmin !== isadmin ){
        this.$store.commit('resetNormsPages', this.normsQuery)
        this.$store.dispatch('getNormsQuery', this.normsQuery)
        this.$store.dispatch('getNormsPages', { ...this.normsQuery })
        this.before_isadmin = isadmin
      }
       
      if( isadmin ){
        this.fields_t = [
          {
            key: 'typeName',
            label: this.$t('normogram.type'),
            'class': 'text-center'
          },
          {
            key: 'code',
            label: this.$t('normogram.code'),
            'class': 'text-center'
          },
          {
            key: 'date',
            label: this.$t('normogram.date'),
            'class': 'text-center'
          },
          {
            key: 'serialIntitutions',
            label: this.$t('normogram.entity'),
            'class': 'text-center'
          },
          {
            key: 'politic',
            label: this.$t('normogram.rural_policy'),
            class: 'text-center',
            type: Boolean,
          },
          {
            key: 'status',
            label: this.$t('normogram.status'),
            'class': 'text-center',
            type: Boolean,
          },
          {
            key: 'actions',
            label: this.$t('normogram.actions'),
            class: 'text-center',
          }
        ]
      }
      return isadmin
    }

  },
  async created(){
    this.$store.dispatch( 'getInstitutionsF');
    //Agregar valores con i18n
    this.status.push(
      {"value": true, "text": this.$t('normogram.filter_status_active') }
    )
    this.status.push(
      {"value": false, "text": this.$t('normogram.filter_status_inactive') }
    )

    try {
        let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
        let response = await VAPI.get( path );
        if (response.status == HTTP_STATUS.OK){
            this.options_rural = response.data.data;
        }
    } catch (error) {
        console.info("Fallo al obtener Modelos rurales", error);
    }

    try {
        let path = `/${SERVICE_NAMES.NORMS_TYPES}`
        let response = await VAPI.get( path );
        if (response.status == HTTP_STATUS.OK){
            this.normtypes = response.data;
        }
    } catch (error) {
        console.info("Fallo al obtener tipos de norma", error);
    }

    if(this.$route.query.housing) {
        this.rural_selected = RURALMODEL.HOUSING;
    }
     
     // agregado para filtrado desde modelo rural
    if(this.$route.query.ruralModel) {
        this.rural_selected = this.$route.query.ruralModel
    }

    // make up the initial query
    this.search();
      

  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    action(index){
 
      switch(index.id) {
        case 0:
          this.$router.push( { name: 'NormogramDetail', params: { id: index.item.encryptedId } } );
          break;
        default:
          alert("ningun caso")    // TODO: Alert refactor
      }
      
    },
    search(){
        
      this.searchTitle = this.$t('normogram.search_results');
      this.normsQuery = {
        "size": 10,
        "startDate": this.customFormatterStart(this.searchDateStart),
        "endDate": this.customFormatterEnd(this.searchDateEnd),
        "status": this.status_selected,
        "keyword": this.keyword,
        "law-number": this.filter_law_number,
        "expedition": this.customFormatterExpedition(this.expidationDate),
        "rural": this.rural_selected
      }
      if (this.filterRuralPolicy) {
        this.normsQuery["rural-policy"] = true;
      }
      if( this.created_user !== null ){
        this.normsQuery["user"] = this.created_user.id
      }
      if( this.type_norm !== null ){
        this.normsQuery["type_norm"] = this.type_norm.id
      }
      if( this.institution1 !== null ){
        this.normsQuery["institution1"] = this.institution1.id
      }
      if( this.institution2 !== null ){
        this.normsQuery["institution2"] = this.institution2.id
      }
      if( this.institution3 !== null ){
        this.normsQuery["institution3"] = this.institution3.id
      }

    },
      clean(){
        this.searchTitle = this.$t('normogram.norm_list');
        this.searchDateStart = null
        this.searchDateEnd = null
        this.status_selected = null;
        this.keyword = null;
        this.filter_law_number = null;
        this.expidationDate = null;
        this.rural_selected = null;
        this.type_norm = null;
        this.institution1 = null;
        this.institution2 = null;
        this.institution3 = null;
        
        this.normsQuery = {
          "size": 10
        }
      },
      customFormatterStart(date) {
        let day = null 
        if(date !== null){
          let year = this.searchDateStart.getFullYear()
          let month = this.searchDateStart.getMonth() + 1
          let date = this.searchDateStart.getDate()
          day = date + "-" + month + "-" + year
        }
        return day;
      },
      customFormatterEnd(date) {
        let day = null 
        if(date !== null){
          let year = this.searchDateEnd.getFullYear()
          let month = this.searchDateEnd.getMonth() + 1
          let date = this.searchDateEnd.getDate()
          day = date + "-" + month + "-" + year
        }
        return day;
      },
      customFormatterExpedition(date) {
        let day = null 
        if(date !== null){
          let year = this.expidationDate.getFullYear()
          let month = this.expidationDate.getMonth() + 1
          let date = this.expidationDate.getDate()
          day = date + "-" + month + "-" + year
        }
        return day;
      },
      expandfilter() {

        this.expand = !this.expand
        if( this.expandicon ===  'fa-angle-down' ){
          this.expandicon =  'fa-angle-up'
        }else{
          this.expandicon =  'fa-angle-down'
        }
        this.expandicon

      },
      closeErrorModal(){
        this.$refs.dateserror.hide()
      },
      back(){
        window.history.back();
      },
      newNorm(){
        this.$router.push( { name: 'NormCreate' } );
      }
  },
  components: {
    Datepicker,
    "vue-select": vSelect,
    Treeselect,
    FilterTable
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@import '../../../stylesheets/helpers/_variables.sass'

.container-margin
  margin-left: 3.5%
  margin-right: 3.5%
  width: 93%
  padding: 0
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_3.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 5%
    padding-left: calc(10% + 20px)
    padding-top: 20px
.filter
  background-color: $colorTitleDark
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  text-align: justify;
  border-radius: 10px;
  margin: 10px;
  .filter-title
    h1
      font-style: italic;
      color: white
      font-weight: bold;
.centered
  display: flex
  justify-content: center
  align-items: center
.text-center
  width: 100%
  text-align: center;
.dates-container
  width: 80%
  margin: 0 10%
  border: 1px solid black
  border-radius: 20px
  +flexbox
  text-align: center
.date-picker-container
  width: 40%
.filter-margin
  margin: 1% 0 0 0
.filter-margin-children
  margin: 0 0 2% 0  
.status-select
  min-width: 40%
  height: 100%
.dot
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
.select-white
  background-color: white
  height: 35px
  border-radius: 5px;
.label-white
  font-size: 0.8em
  color: white
.expand
  font-size: 3rem
  color: white
  font-weight: 600
.h1-title
  font-size: 2rem
  font-weight: 500
  padding: 2% 0
.back-button
  margin: 10px 10px 30px 0 
.no-margin
  margin: 0
.grey-label-text
  color: grey
.form-group
  width: 100%
  height: 42px
  border-radius: 0.5rem
  font-weight: 400
  font-style: normal
  input, .select-white
    height: 42px

@media screen  and (max-width: $widthMobile)
  .col-90
      width: 80% !important
  .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
        margin: 0 auto
</style>

<style lang="sass">
.normogram-treeselect
  .vue-treeselect__control
    height: 42px
    .vue-treeselect__placeholder
      color: #7e7e7e
</style>