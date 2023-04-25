<template>
  <div class="terms-and-conditions-index container-form">
    <sipsder-title :title="$t('policiesAdmin.title').toUpperCase()"
                           type="admin"
                           section="configuration"></sipsder-title>

    <div class="mb-5">
      <div class="p">{{$t('terms_and_conditions.claim')}}</div>
    </div>

    <div class="search-container mt-2">
      <div class="fields-container">
        <div class="row">
          <div class="title">{{ $t('terms_n_conditions.state_lbl') }}</div>
          <b-form-select v-model="state_selected" :options="options_state" />
        </div>  
  
        <div class="row">
          <div class="title">{{ $t('terms_n_conditions.section') }}</div>
          <b-form-select v-model="seccion_selected" :options="pages" />
        </div>

        <div class="row">
          <div class="title">{{ $t('terms_n_conditions.type') }}</div>
          <b-form-select v-model="type_selected" :options="options_type" />
        </div>
      </div>
      <b-row class="dates-container">
        <b-col class="data-space flex-centerAll">
          <p>{{ $t('terms_n_conditions.active_dates') }}</p>
        </b-col>
        <b-col >
          <b-form-group label-class="font-weight-bold"
                        :label="$t('terms_n_conditions.since_lbl')">
            <datepicker :placeholder="$t('util.insertDate')" 
                      :calendar-button = "true"
                      class="date-picker"
                      calendar-button-icon = "fa fa-calendar"
                      :clear-button = "true"
                      v-model="searchDateStart"
                      >
            </datepicker>
          </b-form-group>
        </b-col>
        <b-col >
          <b-row>
            <b-col>
              <b-form-group label-class="font-weight-bold"
                        :label="$t('terms_n_conditions.until_lbl')">
              <datepicker :placeholder="$t('util.insertDate')" 
                          :calendar-button = "true"
                          calendar-button-icon = "fa fa-calendar"
                          class="date-picker"
                          :clear-button = "true"
                          v-model="searchDateEnd"
                          :disabledDates="{to: new Date(searchDateStart)}"
                          >
                </datepicker>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  
    <div class="button-search">
        <b-row>
            <b-col>
                <b-row>
                    <b-col>
                      <sipsder-btn btnType="search" @onClick="search" />
                    </b-col>
                    <b-col>
                      <sipsder-btn btnType="clean" @onClick="clean" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
  
    <div class="h2">{{searchTitle}}</div>
    <div class="p">{{ $t('terms_n_conditions.claim') }}</div>
    
    <div class="termsAndConditions__Add">
      <sipsder-btn :text="$t('terms_n_conditions.add_policies')"
                             btnType="add"
                             @onClick="addNew"></sipsder-btn>
      
    </div>
    
    <div class="terms-table">
  
      <filter-table :optionsTable="options_table" :perPage="termsAndConditionsQuery['size']" :items="items" @action="action($event)" :externalQuery="termsAndConditionsQuery" :fields="fields_t"></filter-table>
  
    </div>  

    <div v-if="termAndConditionDetail != null && termAndConditionDetail != undefined" class="term-detail">
       <terms-and-conditions-detail v-if="checkDetail" :term="termAndConditionDetail" @warning="warning($event)" class="mt-5"></terms-and-conditions-detail>
    </div>

    <b-row>
      <b-col cols="12" style="margin: 30px 0px 30px 0" >
        <sipsder-btn
                btnType="back"
                @onClick="resetChanges"></sipsder-btn>
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal ref="myModalRef" id="modalInfo" centered :title="$t('terms_n_conditions.details')" ok-only>
      <div class="row" v-for="(value, attribute) in termAndConditionDetail" :key="`${value} ${attribute}`">
        <b-col sm="3"><label for="input-none"> {{ attribute }} </label></b-col>
        <b-col sm="9">
          <b-form-input id="input-none" :state="null" :value="value" type="text" placeholder="No validation" disabled></b-form-input>
        </b-col>
      </div>

    </b-modal>

    <!-- Add modal -->
    <b-modal ref="addModal" id="addModal" centered :title="$t('terms_n_conditions.add_mdl_title')" hide-footer>
      <p>{{ $t('terms_n_conditions.add_mdl_text') }}</p>
      <b-container fluid>
        <div class="create-container">
          <div class="create-fields-container">
            <div class="create-fields-container-fields">     
              <div class="title font-weight-bold">{{ $t('terms_n_conditions.type') }}</div>
              <b-form-select class="create-select" name="type" v-model="newTermAndCondition.type.id" data-vv-rules="required" :options="options_type" />
              <span  v-if="submitted && errors.has('type')" >{{ errors.first('type') }}</span>
            </div>
            <div v-if="newTermAndCondition.type.id === '2' ">     
              <div class="title font-weight-bold">{{ $t('terms_n_conditions.section') }}</div>
              <b-form-select class="create-select" name="section" v-model="newTermAndCondition.page.id" :options="pages" />
              <span  v-if="submitted && errors.has('section')" >{{ errors.first('section') }}</span>
            </div>
          </div>
          <div class="create-dates-container">
            <div class="create-date-title">{{ $t('terms_n_conditions.start_date') }}</div>
              <b-form-checkbox v-if="newTermAndCondition.startDate == null && newTermAndCondition.enableNow" class="ml-4 mt-2" 
              v-model="newTermAndCondition.enableNow" :options="[true, false]"
              >{{ $t('terms_n_conditions.enable_today') }}</b-form-checkbox>
            <datepicker
                      v-if="!newTermAndCondition.enableNow"
                      :placeholder="$t('util.insertDate')" 
                      :calendar-button = "true"
                      calendar-button-icon = "fa fa-calendar"
                      class="date-picker"
                      :clear-button = "true"
                      v-model="newTermAndCondition.startDate"
                      :disabledDates="{to: new Date() }"
                      >
            </datepicker>
          </div>
        </div>

        <div class="create-textarea">
          <h3>{{ $t("terms_n_conditions.tool_policies") }}</h3>
          <b-form-textarea id="textarea1" v-validate="'required'"
                     v-model="newTermAndCondition.content"
                     placeholder="Ingrese el contenido"
                     name="content"
                     :data-vv-as="$t('terms_n_conditions.tool_policies')"
                     :rows="3"
                     :max-rows="6">
          </b-form-textarea>
          <span style="color: red" v-if="submitted && errors.has('content')" >{{ errors.first('content') }}</span>
        </div>

        <div class="button-search">
          <b-row>
            <b-col>
              <sipsder-btn btnType="add" @onClick="createToolPolicy" :disabled="!newTermAndCondition.startDate && !newTermAndCondition.enableNow" />
            </b-col>
            <b-col>
              <sipsder-btn btnType="cancel" @onClick="closeAddModal" />
            </b-col>
          </b-row>
        </div>

      </b-container>


    </b-modal>
  
    <!-- Warning modal -->
    <b-modal ref="modalWarning" id="modalWarning" centered :title="$t('terms_n_conditions.details')"
        no-close-on-esc
        no-close-on-backdrop
        hide-header-close
        hide-footer>
      <p>
        {{ $t('terms_n_conditions.warning_mdl_text', { page: $t(`route.${toolWarning.pageName}`) }) }}
        <b>{{ $t('terms_n_conditions.warning_mdl_question') }}</b>
      </p>
      <b-container fluid>
        <div class="text-center">
          <sipsder-btn btnType="cancel" :text="$t('terms_n_conditions.inactivate')" @onClick="inactivateToolPolicy" />
          <sipsder-btn btnType="back" @onClick="closeWarningModal" />
        </div>
      </b-container>
    </b-modal>

    <b-modal ref="dateserror" :title="$t('terms_n_conditions.date_error_mdl_title')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="2" class="text-right">
              <span class="fill-cols fa fa-exclamation-circle"></span>
            </b-col>
            <b-col cols="10">
              <b><label>{{ $t('terms_n_conditions.start_date_error') }}</label></b>
            </b-col>
          </b-row>
        </div>

        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeErrorModal" btnType="accept"/>
            </b-col>
          </b-row>
        </div>
      </b-modal>

  </div>
</template>

<script>
  
  const detail = null;

  import FilterTable from '../../shared/FilterTable.vue'
  import TermsAndConditionsDetail from './TermsAndConditionsDetail.vue'
  import VAPI from '../../../http_common'
  import _ from 'lodash'
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment'
  import * as lang from "vuejs-datepicker/src/locale"; //importar locale
  import { SERVICE_NAMES } from "@/sipsder_constants";
  import vSelect from "vue-select";
  

  export default {  
    data() {
      return {
        //validate
        submitted: false,
        //Table data
        items: 'getTermsAndConditions',
        pages: [{"value": null, "text": this.$t('terms_n_conditions.section_default')}],
        options_table: {
          "detail": {
            "id": 0,
            "class": "btn-success",
            "label": "",
            "icon": 'search'
          }   
        },
        fields_t: [
          {
            key: 'typeName',
            label: this.$t('terms_n_conditions.type'),
            'class': 'text-center'
          },
          {
            key: 'pageName',
            label: this.$t('terms_n_conditions.section'),
            formatter: (value, key, item) => {
              return this.$t(`route.${value}`)
            }
          },
          {
            key: 'startDate',
            label: this.$t('terms_n_conditions.start'),
          },
          {
            key: 'endDate',
            label: this.$t('terms_n_conditions.end'),
            sortable: true
          },
          {
            key: 'createdBy',
            label: this.$t('terms_n_conditions.creator_user'),
          },
          {
            key: 'closedBy',
            label: this.$t('terms_n_conditions.closer_user'),
          },
          {
            key: 'actions',
            label: this.$t('terms_n_conditions.details'),
          }
        ],
        termsAndConditionsQuery: {
          "size": 5,
          "sort": "endDate,desc&sort=startDate,desc" 
        },
        termAndCondition: {
          "typeId": 0,
          "typeName": "",
          "startDate": "",
          "endDate": "",
          "content": "",
          "pageId": null
        },
        //External query data
        searchDateStart: null,
        searchDateEnd: null,
        seccion_selected: null,
        state_selected: null,
        type_selected: null,
        //Add Policy data
        newTermAndCondition: {
          "enableNow": true,
          "section": "",
          "startDate": null,
          "content": "",
          "type": {
            "id": null
          },
          "page": {
            "id": null
          }
        },
        text: "",
        //Warning PopUp
        toolWarning: "",
        searchTitle: this.$t("terms_n_conditions.tool_policies"),
        detail: detail,
        termAndConditionDetail: undefined,
        options_state: [
          {
            value: null,
            text: this.$t("terms_n_conditions.state_default"),
          },
          {
            value: 1,
            text: this.$t("terms_n_conditions.state_active"),
          },
          {
            value: 0,
            text: this.$t("terms_n_conditions.state_inactive"),
          }
        ],
        options_type: [
          {
            value: null,
            text: this.$t("terms_n_conditions.type_default"),
          },
          {
            value: '1',
            text: this.$t("terms_n_conditions.type_tool"),
          },
          {
            value: '2',
            text: this.$t("terms_n_conditions.type_sections"),
          },
          {
            value: '3',
            text: this.$t("terms_n_conditions.type_data_protection"),
          }
        ],
      disabledDates: {
          to: new Date(new Date().setDate(new Date().getDate()-1)) // Disable all dates after yesterday
      },
      searchenddisabledDates: {
          to: new Date(this.searchDateStart), // Disable all dates after specific date
        }
      }
    },
    created(){
      var self = this
      VAPI.get(`${SERVICE_NAMES.PAGE}?size=10000`).then((output) => {
        this.pages = _.map(output.data.data, function(item){
            return {value: item.id, text: self.$t(`route.${item.page}`) }
        }),
        this.pages.unshift( {value: null, text: this.$t('terms_n_conditions.section_default')} )
      }).catch((e) => {
        console.error(e.toString());
      });
    },
    computed: {
      checkDetail(){
        return this.termAndConditionDetail !== undefined
      },
      getPages(){
        return this.termAndConditionDetail !== undefined
      }
    },
    methods: {
      getDate() {
        const toTwoDigits = num => num < 10 ? '0' + num : num;
        let today = new Date();
        let year = today.getFullYear();
        let month = toTwoDigits(today.getMonth() + 1);
        let day = toTwoDigits(today.getDate());
        return year + "-" + month + "-" + day;
      },
      search(){
        this.termAndConditionDetail = null
        //alert( this.searchDateEnd !== null )
        //this.searchDateStart =  this.customFormatter(this.searchDateStart)
        if( this.searchDateEnd === null ){
            this.searchTitle = this.$t("terms_n_conditions.search_results")
            this.termsAndConditionsQuery = {
              "size": 5,
              "startDate": this.customFormatterStart(this.searchDateStart),
              "endDate": null,
              "pageId": this.seccion_selected,
              "typeId": this.type_selected,
              "sort": "endDate,desc&sort=startDate,desc",
            }
            if( this.state_selected !== null ){
              this.termsAndConditionsQuery['status'] = this.state_selected
            }
          
        }else{
          if( this.searchDateStart <  this.searchDateEnd ){
            this.searchTitle = this.$t("terms_n_conditions.search_results")
            this.termsAndConditionsQuery = {
              "size": 5,
              "startDate": this.customFormatterStart(this.searchDateStart),
              "endDate": this.customFormatterEnd(this.searchDateEnd),
              "pageId": this.seccion_selected,
              "typeId": this.type_selected,
              "sort": "endDate,desc&sort=startDate,desc",
            }
            if( this.state_selected !== null ){
              this.termsAndConditionsQuery['status'] = this.state_selected
            }
          }else{
            this.$refs.dateserror.show()
          }
        }
      },
      addNew(){
        
        this.newTermAndCondition["section"] = null
        this.newTermAndCondition["startDate"] = null
        this.newTermAndCondition["content"] = null   
        this.newTermAndCondition["enableNow"] = true   
        this.newTermAndCondition["type"] = {"id": null}
        this.newTermAndCondition["page"] = {"id": null}
        
        this.$refs.addModal.show()
      },
      closeAddModal(){
        this.$refs.addModal.hide()
      },
      createToolPolicy(){
        if( this.newTermAndCondition.page.id === null){
          this.newTermAndCondition.page.id = 1
        }
        this.submitted = true
        this.$validator.validate().then(valid => {
              if (valid) {
                  VAPI.post(`${SERVICE_NAMES.POLICY_TOOL}`,this.newTermAndCondition).then((output) => {
                  this.$refs.addModal.hide()
                  this.clean()
                })
              }
          }); 
      },
      clean(){
        this.termAndConditionDetail = null
        this.searchTitle = this.$t("terms_n_conditions.tool_policies");
        this.searchDateStart = null
        this.searchDateEnd = null
        this.seccion_selected = null
        this.type_selected = null
        this.state_selected = null
        
        this.termsAndConditionsQuery = {
          "size": 5,
          "startDate": this.searchDateStart,
          "endDate": this.searchDateEnd,
          "pageId": this.seccion_selected,
          "typeId": this.type_selected,
          "sort": "endDate,desc&sort=startDate,desc",
        }
      },
      action(index){
        switch(index.id) {
            case 0:
                this.termAndConditionDetail = index.item
                this.$scrollTo('.term-detail', 500, {offset: -80, x: false, y: true})
                //this.$refs.myModalRef.show()
                break;
            default:
                console.log("ningun caso")
        }
      },
      
      warning(index){
        this.toolWarning = index
        this.$refs.modalWarning.show()
      },
      closeWarningModal(){
        this.termAndConditionDetail = Object.assign({}, this.termAndConditionDetail);
        this.$refs.modalWarning.hide()
      },
      closeErrorModal(){
        this.$refs.dateserror.hide()
      },
      inactivateToolPolicy(){
        VAPI.get(`${SERVICE_NAMES.POLICY_TOOL}/disable/${this.toolWarning.id}`).then((output) => {
          this.$refs.modalWarning.hide()
          this.$store.dispatch('getTermsAndConditionsQuery', {"page": 1,"drop": true} )
        })

        this.$router.go()

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
      resetChanges(){
        window.history.back();
      }
        
    },
    components: {
      "v-select": vSelect,
      FilterTable,
      TermsAndConditionsDetail,
      Datepicker
    }
  
  }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.terms-and-conditions-index
  width: 100%
  margin: 0 10%
  +flexbox
  +flex-direction(column)
  text-align: center
  .h1 
    font-size: 2.5rem
    font-weight: 600
    padding: 2% 0 4% 0
  .h2 
    font-size: 2rem
    font-weight: 500
    padding: 2% 0
  .p
    font-size: 1.5rem
    font-weight: 300
  .search-container
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    .fields-container
      width: 40%
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-wrap(wrap)

      .row
        width: 100%
        padding: 1% 0
        +flexbox
        +justify-content(center)
        +align-items(center)
        .title
          +flexbox
          +justify-content(center)
          +align-items(center)
          width: 30%
          font-size: 1.5rem
        select
          width: 40%
  .terms-table
    
    width: 100%
    margin: 0 auto
  

.dates-container
  width: 45%
  border: 1px solid black
  border-radius: 20px
  +flexbox
  justify-content: center
  padding: 0% 0%  


.flex-centerAll
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

.data-space
  padding: 3px 

.button-container
  display: flex

.button-margin
  padding: 1% 1%
  margin: 5% 1% 1% 1%
.termsAndConditions__Add
  display: flex;
  margin: 1%
  padding: 0% 6%
  width: 50%
  align: left
  align-items: center
.add___text
  height: 100%
  width: 200px
  margin: 0%
.add___text p
  height: 100%
  margin: 0% 2%
.create-container
  width: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
.create-fields-container
  width: 40%
  +flexbox
  +justify-content(center)
  +align-items(center)
  flex-direction: column
  div 
    margin: 0% 2%
  .create-select
    margin: 0% 5%
.create-fields-container-fields
  flex-direction: row
.create-dates-container
  width: 60%
  +flexbox
  +justify-content(center)
  +align-items(center)
  flex-direction: column
.create-date-title
  width: 50%
  margin: 0% 5%
.create-textarea
  +flexbox
  +justify-content(center)
  +align-items(center)
  flex-direction: column
  padding: 5% 5%
#textarea1
  height: 200px

@media screen and (max-width: $widthMobile)
  .search-container
    flex-direction: column
    .row
      flex-direction: column
  .dates-container
    width: 100%
    flex-direction: column
</style>
