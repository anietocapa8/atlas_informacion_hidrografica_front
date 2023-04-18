<template>
  <div class="admin-visit-container container">
    {{getPages}}
    {{getUserTypes}}
    <sipsder-title :title="$t('visit.title')"
      type="admin" />
    
    <div class="filter-box">
      <div class="legend">
        {{$t( 'community.survey.filter' ).toUpperCase()}}
      </div>
        <div class="t-geo grid-col">   
            <b-form-group :label-cols="4" label-class="font-weight-bold" style="color: white"
              :label="$t('visit.year')" >
              <b-form-select v-model="yearSelected" :options="years"
                @input="changeYear" />
            </b-form-group>
        </div>

        <div class="t-subgeo grid-col">
            <b-form-group
              :label="$t('visit.month')" :label-cols="4"
              label-class="font-weight-bold" style="color: white">
              <b-form-select v-model="monthSelected" :options="months" :disabled="yearSelected === 'Todos'" 
              @input="changeMonth" />
            </b-form-group>
        </div>

        <div class="t-input grid-col">
          <b-form-group :label-cols="4"
            :label="$t('visit.user')"
            label-class="font-weight-bold" style="color: white">
          <b-form-select v-model="userTypeSelected" :options="userTypes" 
          @input="changeUserType" />
          </b-form-group>
        </div>

        <div class="t-state grid-col">
          <b-form-group :label-cols="4"
            :label="$t('visit.section')"
            label-class="font-weight-bold" style="color: white">
          <b-form-select v-model="pageSelected" :options="pages" 
          @input="changePage"/>
          </b-form-group>
        </div>
    </div>

      <div class="btn-container mt-3">
        <sipsder-btn btnType="export_data" @onClick="download" variant="primary">
        </sipsder-btn>
      </div>

    <chartjs-horizontal-bar class="main-chart"  
      :datalabel="$t('visit.number')" :labels="labels" :data="dataset" :bind="true"
      :option="myOption">
    </chartjs-horizontal-bar>

    <sipsder-btn btnType="back"  @onClick="$router.go(-1)" class="center"></sipsder-btn>

  </div>
</template>

<script>
import _ from 'lodash';
import VAPI from '../../../http_common'
import moment from 'moment';
import { SERVICE_NAMES } from '@/sipsder_constants';

export default {
  data(){
    return {
      labels: [],
      dataset: [],
      myOption:{
          barThickness: 'flex',
          responsive:true,
          maintainAspectRatio:false,
          layout: {
        padding: {
            bottom: -20
            }
        },
          title: {
              display: true,
              position: 'bottom',
              text: this.$t('visit.page')
          },
          scales: {
              yAxes: [{
                  stacked: true,
              }],
              xAxes: [{
                ticks: {
                  autoSkip: false,
                  barPercentage: 0.9,
                  categoryPercentage: 0.55
                }
              }]
          },  
      },
      years: [],
      months: [{text:this.$t('visit.all'),value: -1},{text:this.$t('visit.one'),value: 0},{text:this.$t('visit.two'),value: 1},{text: this.$t('visit.three'),value: 2},{text: this.$t('visit.four'),value: 3},{text: this.$t('visit.five'),value: 4},{text: this.$t('visit.six'), value: 5},{text: this.$t('visit.seven'), value: 6},{text: this.$t('visit.eight'),value: 7},{text: this.$t('visit.nine'),value: 8},{text: this.$t('visit.ten'), value: 9},{text: this.$t('visit.eleven'), value: 10},{text: this.$t('visit.twelve'), value: 11}],
      yearSelected: 'Todos',
      monthSelected: -1,
      pages: [],
      pageSelected: -1,
      userTypes: [],
      userTypeSelected: -1,
      name: ''
    }
   
  },
  methods: {
    changeYear(){
      if(this.yearSelected === this.$t('visit.all')){
        this.monthSelected = -1
      }
      this.getValues(this.yearSelected,this.monthSelected,this.userTypeSelected,this.pageSelected)
    },
    changeMonth(){
      this.getValues(this.yearSelected,this.monthSelected,this.userTypeSelected,this.pageSelected)
    },
    changeUserType(){
      this.getValues(this.yearSelected,this.monthSelected,this.userTypeSelected,this.pageSelected)

    },
    changePage(){
      this.getValues(this.yearSelected,this.monthSelected,this.userTypeSelected,this.pageSelected)

    },
    getValues(year,month,userType,page){
      var params = {

      }
      if(year !== this.$t('visit.all')){
        params.year = year
      }
      if(month !== -1){
        params.month = month
      }
      if(userType !== -1){
        params.userType = userType
      }
      if(page !== -1){
        params.page = page
      }
      VAPI.get(`${SERVICE_NAMES.PAGE}/visit`, { params: params }).then(response => {
        this.labels = []
        this.dataset = []
        response.data.data.forEach(element => {
          this.labels.push(this.$t(`route.${element.pagina}`))
          this.dataset.push(element.count)
        });
      }).catch(e => {
        console.log(e)
      })
    },
    async download( ) {
      
      try{
          let response = await VAPI.get(`${SERVICE_NAMES.PAGE}/admin-visits-export`, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          moment("DD_MM_YYYY")
          link.setAttribute("download", "Visitas_sipsder_al"+moment(new Date()).format("DD_MM_YYYY")+".xlsx");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }catch(error){
          console.log(error);
          this.errorMessage = error.response.data.message;
        }

      //return response.data.data;
    }
  },
  computed: {
    getPages(){
      let pages = null 

      if(this.$store.getters.getPages.length === 0) {
        this.pages = [{
          value: -1,
          text: 'Todos'
        }]
        VAPI.get(SERVICE_NAMES.PAGE, { params:{ page: 0, size: 1000} }).then(response => {
          console.info('RESP: ', response)
          pages = response.data.data.map(e => {
          return {
              id: e.id,
              page: this.$t(`route.${e.page}`),
              state: e.state,
              url: e.url
            }
          })
          pages.sort((a, b) => (a.page > b.page) ? 1 : -1)
          this.$store.dispatch('setPages', {pages: pages})
        })
      }else {
        this.pages = [{
          value: -1,
          text: 'Todos'
        }].concat(this.$store.getters.getPages)
      }
    },
    getUserTypes() {
      if(this.$store.getters.getUserTypes.length === 0) {
        this.userTypes = [{
          value: -1,
          text: 'Todos'
        }]
        VAPI.get(SERVICE_NAMES.USER_TYPE).then(response => {
          this.$store.dispatch('setUserTypes', {userTypes: response.data.data})
        })
      }else {
        this.userTypes = [{
          value: -1,
          text: 'Todos'
        },{
          value: "guest",
          text: "Visitantes"
        }].concat(this.$store.getters.getUserTypes)
      }
    }
  },
  mounted(){
    var date = new Date();
    this.name = "Vistas_sipsder_"+date.getDate()+"_"+date.getMonth()+"_"+date.getFullYear()+".xls"
    this.years = _.range(2018, date.getFullYear() + 1);
    this.years = _.reverse(this.years)
    this.years.unshift("Todos")
    this.getValues(this.yearSelected,this.monthSelected -1,this.userTypeSelected,this.pageSelected)
    this.json_data = []
    VAPI.get(`${SERVICE_NAMES.PAGE}/admin-visits`).then(response => {
      response.data.data.forEach(element => {
          var user = "Visitante"
          var date = new Date(element.date)
          if(element.user !== null){
            user = element.user.userType.type
          }
          this.json_data.push({
            section: element.page.page,
            user: user,
            date: date.toString(),
            ip: element.ip
          })
      })
    })
  }
}
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .main-chart
    height: 1000px
  .filter-box
        display: grid
        grid-template-columns: 1fr 1fr 1fr
        grid-template-areas: 'a b c' 'd e f'
        grid-gap: 15px
        background: $colorTitleDark
        padding: 15px 15px 15px 15px
        border-radius: 10px
        .legend
            grid-area: a
            color: #fff
            font-weight: bold
            font-family: $fontBody
            font-size: 2rem
        .grid-col
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
        .t-geo
            grid-area: b
        .t-subgeo
            grid-area: c
        .t-state
            grid-area: e
        .t-input
            grid-area: f
  .center
    +flexbox
    +justify-content(center)
    +align-items(center)   
  .btn-container
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
  .admin-visit-container
    +flexbox
    +flex-direction(column)
    width: 100%
    padding: 2.5%
  .title
    text-align: center
    font-size: 2.5rem
    font-weight: 600
    font-family: $fontBody
    text-transform: uppercase
  .subtitle
    font-size: 1.7rem
    font-weight: 400
    font-family: $fontBody
  .row-visit
    margin: 2% 0
    +flexbox
    +justify-content(center)
    +align-items(center)
  .form
    width: 100%
    padding: 1%
    +flexbox
    +justify-content(flex-start)
    +align-items(flex-start)
    flex-direction: column
    .group
      width: 100%
      padding: 1.5% 2%
      +flexbox
      +justify-content(center)
      +align-items(center)
  .col-35
    width: 35%
    label
      font-size: 1.2rem
      font-weight: 200
      font-family: $fontBody
  .mg-r
    margin-rigth: 5%
  .col-40
    width: 40%
    +flexbox
    +justify-content(flex-start)
    +align-items(flex-start)
    flex-direction: column
  .col-60
    width: 60%
  select
    width: 90%
    height: 2vw
    border-radius: unset
  @media screen and (min-width: $widthMobile) and (max-width: $widthTablet)
    .btn-container
      .btn
        font-size: 1.3rem
    .admin-visit-container
    .title
      font-size: 3.5rem
    .subtitle
      font-size: 2.5rem
    .row-visit
      flex-direction: column
      .col-40
        width: 100% !important
      .col-60
        width: 100% !important
    .form
      .group
    .col-35
      label
        font-size: 1.7rem
    .mg-r
      margin-rigth: 5%
    .col-40
      width: 40%
    .col-60
      width: 60%
    select
      height: 2.5vw
  @media screen and (max-width: $widthMobile)
    .btn-container
      .btn
        font-size: 1.3rem
    .admin-visit-container
    .title
      font-size: 3.0rem
    .subtitle
      font-size: 2.5rem
    .row-visit
      flex-direction: column
      .col-40
        width: 100% !important
      .col-60
        width: 100% !important
    .form
      .group
    .col-35
      label
        font-size: 1.7rem
    .mg-r
      margin-rigth: 5%
    .col-40
      width: 40%
    .col-60
      width: 60%
    select
      height: 5.5vw
</style>