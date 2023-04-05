<template>
  <div class="download-document container-form">
      <sipsder-title :title="$t('download_report.title').toUpperCase()"
                            :text="$t('download_report.description')"
                            type="admin"
                            section="configuration"></sipsder-title>
      <b-row>
        <b-col cols="12" class="d-flex flex-column">
          <p>{{$t('download_report.select_report')}}</p>
        </b-col>
        <b-col cols="12">
          <b-form-group>
            <b-form-radio-group id="some-radios" v-model="dates" stacked>
              <b-form-radio name="some-radios" value="0">{{$t('download_report.all_reports')}}</b-form-radio>
              <b-form-radio name="some-radios" value="1">{{$t('download_report.reports_per_dates')}}</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if ="dates == '1'" class="dates-container">
        <b-col class="date-picker-container">
          <!-- <div class="date-title">Desde</div> -->
          <b-form-group label-class="font-weight-bold"
                        label="Desde">
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
        <b-col class="date-picker-container">
          <b-row>
            <b-col>
              <b-form-group label-class="font-weight-bold"
                        label="Hasta">
              <datepicker :placeholder="$t('util.insertDate')" 
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
      </b-row>

      <b-row>
        <b-col>
          <p>{{$t('download_report.pages')}}</p>  
        </b-col>
        <b-col cols="12">
          <!-- <b-form-select v-model="page_selected" :options="pages" class="page-select"/> -->
          <b-form-select
            v-model="page_selected"
            :options="pages"
            class="page-select"
            value-field="page"
            text-field="text"
          ></b-form-select>
        </b-col>
      </b-row>
      
      <b-row>
        <b-col cols="12" class="text-center">
          <sipsder-btn @onClick="getReport()" btnType="download"  :text="$t('download_file.download')" :title="$t('download_file.download')">
          </sipsder-btn>
        </b-col>
      </b-row>

  </div>
</template>

<script>

import VAPI from '../../../http_common';
import Router from "../../../router/router";
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
import {SERVICE_NAMES} from '../../../sipsder_constants';

export default {
  
  data() {
    return {
      
      dates: "0",
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
      page_selected: null,
      options: [
        {
          value: null,
          text: 'Seleccione una opción'
        },
        {
          value: 'Consulta general',
          text: 'Consulta general'
        },
        {
          value: 'Investigación académica',
          text: 'Investigación académica'
        },
        {
          value: 'Solicitud institucional',
          text: 'Solicitud institucional'
        },
        {
          value: undefined,
          text: 'Otro'
        }
      ],
      pages: [{"value": null, "text": "Todas"}],
      disabledDates: {
          to: new Date(), // Disable all dates after specific date
      },
      searchenddisabledDates: {
        to: new Date(this.searchDateStart), // Disable all dates after specific date
      }
    
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
    
  },
  beforeMount(){
      
    VAPI.get(`${SERVICE_NAMES.PAGE}?size=10000`).then((output) => {

      this.pages = output.data.data.map(item => {
        return {
            value: this.$t(`route.${item.page}`), 
            text: this.$t(`route.${item.page}`),
            page: item.page
          }
      })

      this.pages.sort((a, b) => (a.value > b.value) ? 1 : -1)
      this.pages.unshift( {value: null, text: 'Todas', page: null} )
      
    }).catch((e) => {
      console.log(e);
    });
    
  },
  methods: {
    async getReport(){
      let query = '';
      query = this.constructQuery();
      try{
          let response = await VAPI.get(`${SERVICE_NAMES.DOCUMENTS}/admin-report` + query, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          moment("DD_MM_YYYY")
          link.setAttribute("download", "reporte_descarga_de_documentos_al"+moment(new Date()).format("DD_MM_YYYY")+".xlsx");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }catch(error){
          alert("errror!")
          console.log(error);
          this.errorMessage = error.response.data.message;
        }

      
    },
    openModal( ){
      this.$refs.justificationModal.show();
    },
    constructQuery( ){
      let query = '?'
      if( this.dates == "1" ){
        if( this.searchDateStart !== null ){
          query += 'startDate=' + this.customFormatterStart(this.searchDateStart) + '&'
        }
        if( this.searchDateEnd !== null ){
          query += 'endDate=' + this.customFormatterEnd(this.searchDateEnd) + '&'
        } 
      } 

      if( this.page_selected !== null ){
        query += 'page=' + this.page_selected
      }
      
      return query
    },
    customFormatterStart(date) {
      let day = null 
      if(date !== null){
        let year = this.searchDateStart.getFullYear()
        let month = this.searchDateStart.getMonth() + 1
        let date = this.searchDateStart.getDate()
        day = year + "-" + month + "-" + date
      }
      return day;
    },
    customFormatterEnd(date) {
      let day = null 
      if(date !== null){
        let year = this.searchDateEnd.getFullYear() 
        let month = this.searchDateEnd.getMonth() + 1
        let date = this.searchDateEnd.getDate() + 1
        day = year + "-" + month + "-" + date
      }
      return day;
    }
  },
  components: {
    Datepicker
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.download-document
  width: 100%
  margin: 0 10%
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
.page-select
  max-width: 40%
</style>


