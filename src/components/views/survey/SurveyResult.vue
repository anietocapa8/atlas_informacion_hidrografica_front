<template>
<div id="contenedor">
  <div class="feed-title" ref="top">{{ $t( 'survey.result.title' ).toUpperCase( ) }}</div>
  <b-container class="container-form col-90" v-if="surveyFlag==1">
    <b-row align-h="center" align-v="center">
      <div class="survey-title">{{ survey.title }}</div>
    </b-row>
    <b-row>
      <div class="pl-3 pr-5">
        <span class="font-italic">{{ $t( "survey.form.start_date" ) }}:</span> {{ survey.startDate | moment( "DD-MM-YYYY" ) }} 
      </div>
      <div class="pl-5 pr-5">
        {{ survey.answers }} {{ $t( "survey.form.answers" ) }}
      </div>
      <div class="pl-5 pr-3" v-if="survey.endDate">
        <span class="font-italic">{{ $t( "survey.form.end_date" ) }}:</span> {{ survey.endDate | moment( "DD-MM-YYYY" ) }} 
      </div>
    </b-row>
    <b-row align-v="center" class="pt-5 pb-5">
      <b-col cols="12" lg="6">
        <b-row class="pl-3">
          <div v-for="(model, i) in survey.ruralModels" :key="i"
            class="circle" :style="{ background: model.color }"
              v-b-tooltip.hover="model.name">
          </div>
        </b-row>
      </b-col>
      <b-col cols="12" lg="3" sm="6">
        <social-networks-share></social-networks-share>
      </b-col>
      <b-col cols="6" lg="1" sm="1">
        <report-component :contentId="survey.id" 
                          :content-type="REPORT_CONTENT_TYPES.SURVEY">
        </report-component>
      </b-col>
      <b-col cols="6" lg="2" sm="3">
        <score-component :idContent="survey.id" 
                        :idType="SCORE_CONTENT_TYPE.SURVEY"
                        :likes="survey.likes"
                        :dislikes="survey.dislikes">
        </score-component>
      </b-col>
    </b-row>
    <b-row align-h="end" v-if="isVisible">
      <sipsder-btn 
        btnType="export_data" 
        :text="$t('survey.result.export_btn')" 
        @onClick="downloadStatistics( )">
      </sipsder-btn>
    </b-row>
    
    <b-row>
      <b-card class="w-100">
        <b-card-header header-tag="header" role="tab">
          <b-row @click="collapsedDescription = !collapsedDescription" style="cursor: pointer;">
            <b-col cols="11" class="section-title">{{ $t( "survey.form.description" ) }}</b-col>
            <b-col cols="1">
              <div class="incoming_msg_chevron" align="center">
                <i v-if="collapsedDescription" class="fas fa-chevron-down"></i>
                <i v-else class="fas fa-chevron-up"></i>
              </div>  
            </b-col>
            <b-col cols="12" class="description pb-3" :class="{ 'line-clamp' : collapsedDescription }">
              {{ survey.description }}
              <br>
              {{getAverageResult() | moment( "DD-MM-YYYY HH:mm:ss" )}}
            </b-col>            	
          </b-row>
        </b-card-header>
      </b-card>  
    </b-row>

    <b-row v-if="isVisible">
      <div v-if="survey.sections.length > 0" class="w-100">
      	<b-row class="box-container">
      		<b-col cols="12" class="section-title">
            {{ survey.sections[ currentSection ].title }}
      		</b-col>
      		<b-col>
      		  <div>{{ survey.sections[ currentSection ].description }}</div>
            <span class="faded"></span>          
            <b-row align-v="center" align-h="center" class="w-100 pt-5 pb-5">
              <div v-for="(question,i) in survey.sections[ currentSection ].questions" :key="i" class="box">
                <div v-if="question.idType != SURVEY_QUESTION_TYPE.CONTROL && question.idType != SURVEY_QUESTION_TYPE.CONTROL_END" class="question-box">
                  {{question.question}} - {{question.nameType}}
                  <span class="faded"></span>
                  <span style="color: #aaa" v-if=" question.idType != SURVEY_QUESTION_TYPE.MATRIX_SINGLE  && question.idType != SURVEY_QUESTION_TYPE.MATRIX_MULTIPLE">{{question.totalResults}} Respuestas</span>
                  <span style="color: #aaa" v-else>{{getTotalMatrixResults(question.group)}} Respuestas</span>
                  <div v-if="(question.idType == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE || question.idType == SURVEY_QUESTION_TYPE.DROPDOWN_LIST) && question.totalResults>0">
                    <chartjs-doughnut :labels="getLabels(question.resultsAnswers)" :data="getCount(question.resultsAnswers)" :bind="true" :backgroundcolor="getColor(question.resultsAnswers, .7)" :hoverbackgroundcolor="getColor(question.resultsAnswers, 1)" :option="dougOption"></chartjs-doughnut>
                    <br>
                    <span style="color: #aaa" v-if="getOtherResult(question.resultsAnswers).length>0">Otras Respuestas</span>
                    <br>
                    <div v-for="(result,i) in getOtherResult(question.resultsAnswers)" :key="i" class="short-text">
                      {{result}}
                    </div>
                  </div>
                  <div v-else-if="question.idType == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE && question.totalResults>0">
                    <chartjs-horizontal-bar :labels="getLabels(question.resultsAnswers)" :data="getCount(question.resultsAnswers)" :backgroundcolor="getColor(question.resultsAnswers,1)" datalabel="Cantidad" :bind="true" :option="setHorizontalOptions(question.resultsAnswers)"></chartjs-horizontal-bar>
                    <br>
                    <span style="color: #aaa" v-if="getOtherResult(question.resultsAnswers).length>0">Otras Respuestas</span>
                    <br>
                    <div v-for="(result,i) in getOtherResult(question.resultsAnswers)" :key="i" class="short-text">
                      {{result}}
                    </div>
                  </div>
                  <div v-else-if="(question.idType == SURVEY_QUESTION_TYPE.SHORT_TEXT || question.idType == SURVEY_QUESTION_TYPE.LONG_TEXT) && question.totalResults>0">
                    <div v-for="(result,i) in question.resultsAnswers" :key="i" class="short-text">
                      {{result.answer}}
                    </div>
                  </div>
                  <div v-else-if="question.idType == SURVEY_QUESTION_TYPE.DATE && question.totalResults>0">
                    <div v-for="(result,i) in question.resultsAnswers" :key="i" class="date-text">
                      <b>{{result.answerDate  | moment( "DD-MM-YYYY" )}}</b> - <span class="circle">{{result.count}}</span>
                    </div>
                  </div>
                  <div v-else-if="question.idType == SURVEY_QUESTION_TYPE.SCALE && question.totalResults>0">
                    <chartjs-bar :labels="getLabels(question.resultsAnswers)" :data="getCount(question.resultsAnswers)" :backgroundcolor="getColor(question.resultsAnswers,1)" datalabel="Cantidad" :bind="true" :option="setVerticalOptions(question.resultsAnswers)"></chartjs-bar>
                  </div>
                  <div v-else-if="(question.idType == SURVEY_QUESTION_TYPE.MATRIX_SINGLE || question.idType == SURVEY_QUESTION_TYPE.MATRIX_MULTIPLE) && getTotalMatrixResults(question.group)>0">
                    <chartjs-bar :labels="getMatrixLabels(question.group)" :datasets="getMatrixCount(question.group)" :backgroundcolor="getColor(question.resultsAnswers,1)" datalabel="Cantidad" :bind="true" :option="setVerticalMOptions(question.group)"></chartjs-bar>
                  </div>
                </div>
              </div>
            </b-row>
            <span class="faded"></span>  
      		</b-col>
      	</b-row>
	      <b-row align-v="center" class="w-100" align-h="start">
          <sipsder-btn :disabled="currentSection == 0"
            btnType="previous" 
            class="pr-2"
            :text="$t( 'survey.form.prev_btn' )" 
            @onClick="prevSection( )">
          </sipsder-btn>
          <sipsder-btn :disabled="currentSection == survey.sections.length - 1"
            class="pl-2"
            btnType="next" 
            :text="$t( 'survey.form.next_btn' )" 
            @onClick="nextSection( )">
          </sipsder-btn>
	      </b-row>
      </div>
      <div v-else class="w-100">
        <b-row class="box-container" align-h="center" align-v="center">
          {{ $t( 'survey.form.popup.no_sections_yet' ) }}
        </b-row>
      </div>
  	</b-row>

    <b-row v-else>
      <div v-if="hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.AUTHENTICATED )"
        class="box-container pt-5 pb-5" 
        align="center">
          {{ $t( 'survey.result.unauthenticated_error' ) }}
          <a v-b-modal.login href="#">{{ $t( 'survey.result.unauthenticated_placeholder' ) }}</a>       
      </div>
      <div v-if="hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.ADMINISTRATOR ) || hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.AUTHORIZED )" 
        class="box-container pt-5 pb-5" 
        align="center">
          {{ $t( 'survey.result.unauthorized_error' ) }}     
      </div>
    </b-row>

    <b-row align-h="center">
  		<sipsder-btn 
  			btnType="back" 
  			:text="$t( 'survey.form.back_btn' )" 
  			@onClick="back( )">
    	</sipsder-btn>
  	</b-row>
  </b-container>

  <b-container class="container-form" v-else-if="surveyFlag==0">
    <b-row>
      <div class="box-container pb-5 pt-5" align="center">
        {{ $t( 'survey.loading' ) }}
      </div>
    </b-row>
    <b-row align-h="center">
      <sipsder-btn 
        btnType="back" 
        :text="$t( 'survey.form.back_btn' )" 
        @onClick="back( )">
      </sipsder-btn>
    </b-row>
  </b-container>

  <b-container class="container-form" v-else>
    <b-row>
      <div class="box-container pb-5 pt-5" align="center">
        {{ $t( 'survey.loading' ) }}
      </div>
    </b-row>
    <b-row align-h="center">
      <sipsder-btn 
        btnType="back" 
        :text="$t( 'survey.form.back_btn' )" 
        @onClick="back( )">
      </sipsder-btn>
    </b-row>
  </b-container>
</div>    
</template>
<script>
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, SURVEY_RESULT_VISIBILITY, SURVEY_QUESTION_TYPE } from '../../../domain_constants';
import VAPI from '../../../http_common';
import moment from 'moment';
import faqs_admin from '../../../store/modules/faqs_admin';
export default {
  components: {
		SocialNetworksShare,
		ReportComponent,
		ScoreComponent
	},
  async beforeMount( ) {
    this.surveyFlag = 0
    const surveyData = await this.fetchSurveyResults( );
    this.survey = surveyData;

    if(this.survey == null || this.survey==undefined)
      this.surveyFlag = 3
    else
      this.surveyFlag = 1

    this.isVisible = this.checkResultVisibility( );
  },
  data: ( ) => ({
    SCORE_CONTENT_TYPE,
		REPORT_CONTENT_TYPES,
    SURVEY_RESULT_VISIBILITY,
    SURVEY_QUESTION_TYPE,
		collapsedDescription: true,
		currentSection: 0,
    isVisible: false,
    survey: null,
    surveyFlag: 0,
    dougOption:{
        responsive:true,
        cutoutPercentage:50,
        legend: {
                position: 'right',
                labels: {
                    boxWidth: 20,
                    padding: 20
                }
        },
        plugins: {
          labels: {
            render: 'percentage',
            fontSize: 14,
            fontStyle: 'bold',
            fontColor: 'black' ,/*function (data) {
              let h = data.dataset.backgroundColor[data.index]
              let p ={r : 0, g : 0, b : 0}
              let sep = h.indexOf(",") > -1 ? "," : " ";
              h = h.substr(5).split(")")[0].split(sep);
              p.r = "0x" + ("00" + Number(h[0]).toString(16)).substr(-2); 
              p.g = "0x" + ("00" + Number(h[1]).toString(16)).substr(-2);
              p.b = "0x" + ("00" + Number(h[2]).toString(16)).substr(-2);
              var rgb = p
              var threshold = 140;
              var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
              return luminance > threshold ? 'black' : 'white';
            },*/
            precision: 2
          }
        }
    },
  }),
  methods: {
    scrollMeTo(refName) {
      window.scrollTo(200, 0); 
    },
    getLabels(data){
      let arrayLabels = []
      let dat = JSON.parse(JSON.stringify(data))
      dat.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
      dat.forEach(e => {
        if(e.answer.length > 40){
          arrayLabels.push(e.answer.substring(0,37)+"...");
        }else{
          arrayLabels.push(e.answer)
        }
      });
      return arrayLabels
    },
    getMatrixLabels(data){
      let arrayLabels = []
      let dat = JSON.parse(JSON.stringify(data))
      dat.forEach(e => {
        arrayLabels.push(e.question)
      });
      return arrayLabels
    },
    getMatrixCount(data){
      let arrayCount = []
      let dat = JSON.parse(JSON.stringify(data))
      dat[0].resultsAnswers.forEach((e,i)=>{
        arrayCount.push({
          label: e.answer,
          backgroundColor: this.getColor(dat,1)[i],
          borderWidth: 1,
          data:[0,0,0]
        })
      })
      dat.forEach((e,i)=>{
        e.resultsAnswers.forEach((el,il)=>{
            arrayCount[il].data[i]=el.count
        })
      })

      return arrayCount
    },
    getCount(data){
      let arrayCount = []
      let dat = JSON.parse(JSON.stringify(data))
      dat.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
      dat.forEach(e => {
        arrayCount.push(e.count)
      });
      return arrayCount
    },
    getColor(data, alpha){
      let arrayCount =  ["rgba(236,112,99,"+alpha+")", "rgba(249,235,99,"+alpha+")", "rgba(218,247,99,"+alpha+")", "rgba(255,195,0,"+alpha+")","rgba(255,87,51,"+alpha+")", "rgba(199,0,57,"+alpha+")", "rgba(46,134,193,"+alpha+")", "rgba(33,97,140,"+alpha+")", "rgba(46,204,113,"+alpha+")", "rgba(244,208,63,"+alpha+")"]
      data.forEach((e,i) => {
        if(i>9){
          var o = Math.round, r = Math.random, s = 255;
          arrayCount.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + alpha + ')')
        }
      });
      return arrayCount
    },
    getTotalMatrixResults(data){
      let total = 0
      data.forEach(e=>{
        if(total < e.totalResults){
          total=e.totalResults
        }
      })
      return total
    },
    getOtherResult(data){
      let array = []
      data.forEach(e => {
        if(e.other==true){
          array = e.otherList
        }
      })
      return array
    },
    setHorizontalOptions(data){
      let countp = 0
      data.forEach(e => {
        countp+=e.count
      });
      let horizontalOption ={
        responsive:true,
        legend: { display: false },
        scales: {
            yAxes: [{
                stacked: true
            }],
          xAxes: [
            {
              ticks: {
                min: 0,
                max: countp,
                callback: function (value) {
                  return (value / countp * 100).toFixed(0) + '%'; // convert it to percentage
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'Percentage',
              },
            },
          ]
        },
      }
      return horizontalOption;
    },
    setVerticalOptions(data){
      let countp = 0
      data.forEach(e => {
        countp+=e.count
      });
      // console.log(countp)
      let verticalOption ={
        responsive:true,
        title: {
            display: true,
            position: "top",
            fontSize: 24,
            text: " "
        },
        legend: {
              display: false
          },
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: countp,
                  callback: function (value) {
                    return (value / countp * 100).toFixed(0) + '%'; // convert it to percentage
                  },
                },
              },
            ]
        },
        plugins: {
          labels: {
            render: 'percentage',
            fontSize: 14,
            fontStyle: 'bold',
            fontColor: function (data) {
              let h = data.dataset.backgroundColor[data.index]
              let p ={r : 0, g : 0, b : 0}
              // 3 digits
              if (h.length == 4) {
                p.r = "0x" + h[1] + h[1];
                p.g = "0x" + h[2] + h[2];
                p.b = "0x" + h[3] + h[3];

              // 6 digits
              } else if (h.length == 7) {
                p.r = "0x" + h[1] + h[2];
                p.g = "0x" + h[3] + h[4];
                p.b = "0x" + h[5] + h[6];
              }
              var rgb = p
              var threshold = 140;
              var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
              return luminance > threshold ? 'black' : 'white';
            },
            precision: 2
          }
        }
      }
      return verticalOption;
    },
    setVerticalMOptions(data){
      let countp = this.getTotalMatrixResults(data)
      // console.log(countp)
      let verticalOption ={
        barValueSpacing: 20,
        responsive:true,
        title: {
            display: true,
            position: "top",
            fontSize: 24,
            text: " "
        },
        legend: {
              display: true,
              position: "bottom"
          },
        scales: {
            xAxes: [{
                stacked: false
            }],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: countp,
                  callback: function (value) {
                    return (value / countp * 100).toFixed(0) + '%'; // convert it to percentage
                  },
                },
              },
            ]
        },
      }
      return verticalOption;
    },
    defaultMessage( ) {
      alert( 'En construcción' );
    },
    async downloadStatistics( ) {
      try {
        let response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/results/${this.$route.params.id}/statistics`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Reporte-resultados-encuestas.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
      catch( error ) {
        console.log( 'Error fetching survey statistics', error );
      }
    },
    getAverageResult(){
      let length = this.survey.sections.length
      let initQ = null
      let endQ = null
      this.survey.sections[0].questions.forEach(el=>{
        if(el.idType == SURVEY_QUESTION_TYPE.CONTROL){
            initQ = el.resultsAnswers
        }
      })
      this.survey.sections[length-1].questions.forEach(el=>{
        if(el.idType == SURVEY_QUESTION_TYPE.CONTROL_END){
            endQ = el.resultsAnswers
        }
      })
      //console.log(initQ.length)
      //console.log(endQ.length)
      let initAver = 0
      let endAver = 0
      initQ.forEach((e,i)=>{
        //console.log(i) 
        if(i<=endQ.length-1)
          initAver+=e.answerDate
      })
      initAver=initAver/endQ.length
      endQ.forEach(e=>{
        endAver+=e.answerDate
      })
      endAver=endAver/endQ.length

      let averTime = moment(endAver).diff(moment(initAver), "minutes")
      if(averTime > 60 && averTime <=1440){
        let averH = Math.floor(averTime / 60)
        let averM = averTime-(averH*60)
        return "Tiempo de respuesta promedio: " + averH + " hora(s) " + averM + " minuto(s)"
      }
      else if(averTime > 1440){
        let averD = Math.floor( averTime / 1440)
        let averH = Math.floor((averTime - ( averD * 1440))/60)
        let averM = averTime-(averH*60)-(averD*1440)
        return "Tiempo de respuesta promedio: " + averD + " dia(s) "+ averH + " hora(s) " + averM + " minuto(s)"
      }
      else
        return "Tiempo de respuesta promedio: " + averTime + " minuto(s)"
    },
    back( ) {
      this.$router.go( -1 );
    },
    prevSection( ) {
			if( this.currentSection > 0 ){
        this.currentSection -= 1;
        this.scrollMeTo("top")
      }
      
		},
		nextSection( ) {
			if( this.currentSection < this.survey.sections.length - 1 ){
        this.currentSection += 1;
        this.scrollMeTo("top")
      }
    },
    showModal( ref ){
      this.$refs[ ref ].show( );
    },
    closeModal( ref ){
      this.$refs[ ref ].hide( );
    },
    async fetchSurveyResults( ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/results/${this.$route.params.id}`);
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching survey results', error );
      }
    },
    checkResultVisibility( ) {
      if( this.hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.UNAUTHENTICATED ) ) {
        return true;
      }
      else if( this.hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.AUTHENTICATED ) ) {
        return this.isAuthenticated;
      }
      else if( this.hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.ADMINISTRATOR ) ) {
        return this.isAdministrator;
      }
      else if( this.hasVisibilityPermission( SURVEY_RESULT_VISIBILITY.AUTHORIZED ) && this.isAuthenticated ) {
        return this.survey.userTypes.includes( this.$store.getters.getCurrentUser.userType.id );
      }
    },
    hasVisibilityPermission( permission ) {
      return permission == this.survey.resultVisibility;
    }
  },
  computed: {
    isAuthenticated( ) {
      return this.$store.getters.isAuthenticated;
    },
    isAdministrator( ) {
      return this.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
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
  margin-bottom: 2%
  padding-left: calc(10% + 40px)
  padding-top: 20px
  a
	  text-decoration: none
	  color: #fff
.survey-title
	padding: 25px 0px 25px 0px
	font-size: 30px
	font-weight: bold
.section-title
  padding-bottom: 15px
  padding-top: 10px
  font-weight: bold
.circle
  border-radius: 50%
  height: 20px
  width: 20px
  border: 3px solid transparent
  margin: 0px 5px 0px 5px
.description
	overflow: hidden
.line-clamp
  white-space: nowrap
  text-overflow: ellipsis
  transition: height 2s
.faded
  display: block
  border: none
  color: white
  height: 1px
  background: black
  background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 550, from(#000), to(#fff))
  width: 100%
  margin-top: 10px
  margin-bottom: 10px
.card-header
  background-color: transparent
  border-bottom: none
.box-container
  border: 2px solid black
  padding: 30px
  width: 100%
  margin-top: 10px
  margin-bottom: 10px
  margin-left: 0px
  margin-right: 0px
.box
  width: 100%
.question-box
  border: 1px solid #000
  padding: 20px
  margin-bottom: 10px
  width: 100%
  max-height: 800px
  overflow: auto
  .date-text
    padding: 10px
    &:nth-child(odd)
      .circle
        background: rgba(13, 184, 187, .5)
    &:nth-child(even)
      .circle
        background: rgba(2, 116, 124, .5)
    .circle
      display: inline-block
      border-radius: 50px
      height: 30px
      width: 30px
      text-align: center
      color: #fff
  .short-text
    padding: 10px
    color: #fff
    max-height: 100px
    overflow: auto
    &:nth-child(odd)
      background: rgba(13, 184, 187, .5)
    &:nth-child(even)
    background: rgba(2, 116, 124, .5)
@media screen  and (max-width: $widthTablet)
  .col-90
    width: 80% !important
@media screen  and (max-width: $widthMobile)
  .col-90
    width: 80% !important
  .feed-title
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
</style>
