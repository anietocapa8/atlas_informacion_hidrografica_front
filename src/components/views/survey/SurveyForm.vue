<template>
	<div id="contenedor">
		<!-- Begin of Unsaved Changes Modal-->
    <b-modal ref="unsavedChanges" :title="$t( 'survey.form.popup.alert_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-100 required pt-2 pb-4" align="center">
          <strong>{{ $t( 'survey.form.popup.discard_alert' ) }}</strong>
        </div>          
        <sipsder-btn btnType="accept" 
            :text="$t( 'survey.form.popup.ok_btn' )" 
            @onClick="back( )">
        </sipsder-btn>     
        <sipsder-btn btnType="cancel" 
            :text="$t( 'survey.form.popup.cancel_btn' )" 
            @onClick="closeModal( 'unsavedChanges' )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unsaved Changes Modal-->

    <!-- Begin of Send Modal-->
    <b-modal ref="sendModal" :title="$t( 'survey.form.popup.alert_title' )" hideFooter
        :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4" align="center">
          {{ $t( 'survey.form.popup.send_survey' ) }}
        </div>  
        <div class="w-100 pt-2 pb-4" align="center" v-if="survey">
          <strong>{{ survey.finalMessage }}</strong>
        </div>            
        <sipsder-btn btnType="accept" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="downloadCertificate( )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Send Modal-->

    <!-- Begin of Failed Modal-->
    <b-modal ref="failedModal" :title="$t( 'survey.form.popup.alert_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-2 pb-4" align="center">
          {{ $t( 'survey.form.popup.failed_send' ) }}
        </div>         
        <sipsder-btn btnType="accept" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="closeModal( 'failedModal' )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Failed Modal-->

    <!-- Begin of Failed Receive Modal-->
    <b-modal ref="failedReceiveModal" :title="$t( 'survey.form.popup.alert_title' )" hideFooter
      :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-2 pb-4" align="center">
          {{ $t( 'survey.form.popup.failed_receive' ) }}
        </div>         
        <sipsder-btn btnType="accept" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="backAfterFail( 'failedReceiveModal' )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Failed Receive Modal-->

    <!-- Begin of Already Filled Modal-->
    <b-modal ref="alreadyFilledModal" :title="$t( 'survey.form.popup.alert_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4 px-3 row" align="center">
          {{ $t( 'survey.form.popup.already_filled' ) }}
        </div>         
        <sipsder-btn btnType="back" 
            :text="$t( 'survey.form.popup.back_btn' )" 
            @onClick="backAfterFail( 'alreadyFilledModal' )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Already Filled Modal-->

    <!-- Begin of Unauthenticated Modal-->
    <b-modal ref="unauthenticatedModal" :title="$t( 'survey.form.popup.survey_title' )" hideFooter 
    	size="lg" :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true" >      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4" align="center" v-if="survey">
          <div :style="{ fontSize: 'x-large', fontWeight: 'bold' }">{{ survey.title }}</div>
        </div>             
        <div class="box-container" align="center">
          {{ $t( 'survey.form.popup.authentication_required' ) }}
        </div>             
        <sipsder-btn btnType="cancel" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="backToMain( )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unauthenticated Modal-->

    <!-- Begin of Unauthorized Modal-->
    <b-modal ref="unauthorizedModal" :title="$t( 'survey.form.popup.survey_title' )" hideFooter 
    	size="lg" :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true" >      
      <b-row align-v="center" align-h="center">
        <div class="w-100 required pt-4 pb-4" align="center">
          <strong>{{ $t( 'survey.form.popup.unauthorized_error' ) }}</strong>
        </div>
        <sipsder-btn btnType="back" 
            :text="$t( 'survey.form.popup.back_btn' )" 
            @onClick="backToMain( )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unauthorized Modal-->

    <!-- Begin of Unauthorized Preview Modal-->
    <b-modal ref="unauthorizedPreviewModal" :title="$t( 'survey.form.popup.survey_title' )" hideFooter 
      size="lg" :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true" >      
      <b-row align-v="center" align-h="center">
        <div class="w-100 required pt-2 pb-4" align="center">
          <strong>{{ $t( 'survey.form.popup.unauthorized_preview_error' ) }}</strong>
        </div>
        <sipsder-btn btnType="cancel" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="backToList( )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unauthorized Preview Modal-->

    <!-- Begin of Password Required Modal-->
    <b-modal ref="passwordRequiredModal" :title="$t( 'survey.form.popup.survey_title' )" hideFooter 
    	size="lg" :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true" >
      <b-row class="w-100 pt-2 pb-4" align-h="center" v-if="survey">
        <div :style="{ fontSize: 'x-large', fontWeight: 'bold' }">{{ survey.title }}</div>
      </b-row>             
    	<b-row align-v="center" align-h="center" class="box-container">
    		<div class="pr-3"> {{ $t( 'survey.form.popup.password_required' ) }} </div>
        <b-form-group class="mb-0">
          <b-form-input v-model="passwordRequired" :disabled="checkPasswordCorrectness"></b-form-input>
        </b-form-group>
    	</b-row>      	
      <b-row v-if="!checkPasswordCorrectness" class="required" align-h="center">
      	{{ $t( 'survey.form.popup.password_error' ) }}
      </b-row>
      <b-row align-h="center">
        <sipsder-btn btnType="cancel" 
            :text="$t( 'survey.form.popup.close_btn' )" 
            @onClick="back( )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unauthenticated Modal-->

    <!-- Begin of Welcome Modal-->
    <b-modal ref="welcomeModal" :title="$t( 'survey.form.popup.survey_title' )" hideFooter 
    	size="lg" :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true" >      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4" align="center" v-if="survey">
          <div :style="{ fontSize: 'x-large', fontWeight: 'bold' }">{{ survey.title }}</div>
        </div>             
        <div class="w-75 box-container" align="center" v-if="survey">
          {{ survey.initialMessage }}
        </div>
        <div class="w-75" v-if="survey">
          <b-form-textarea
              id="termsAndConditions"
              v-model="survey.termsAndConditions"
              disabled
              :rows="6"
              :max-rows="6">
          </b-form-textarea>
          <b-form-checkbox
              id="accept_terms"
              v-model="hasAcceptedTerms"
              class="pt-3 pb-3"
              :value="true"
              :unchecked-value="false">
            <strong>{{ $t( 'survey.form.popup.terms_n_conditions' ) }}</strong>
          </b-form-checkbox>
        </div>
        <div class="w-100" align="center">
        	<sipsder-btn btnType="back" 
              class="pr-2"
	            :text="$t( 'survey.form.popup.back_btn' )" 
	            @onClick="backToList( )">
	        </sipsder-btn>
          <sipsder-btn btnType="accept"
              class="pl-2"
              v-if="hasAcceptedTerms"
	            :text="$t( 'survey.form.popup.fill_btn' )" 
	            @onClick="allowSurveyDisplay()">
	        </sipsder-btn>
        </div>
      </b-row>
    </b-modal>
    <!-- End of Welcome Modal-->

    <!-- Begin of Errors Modal-->
    <b-modal ref="errorModal" :title="$t( 'survey.form.popup.alert_title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 text-justify required pt-2 pb-4" align="center">
          {{ $t( 'survey.form.popup.validation_errors' ) }}
        </div>      
        <sipsder-btn btnType="accept" 
            :text="$t( 'survey.form.popup.ok_btn' )" 
            @onClick="closeModal( 'errorModal' )">
        </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Errors Modal-->

		<b-container class="container-form" v-if="allowSurvey && survey">
			<b-row>
				<div class="feed-title" v-if="!previewMode">{{ $t( 'survey.form.title' ).toUpperCase( ) }}</div>
        <div class="feed-title" v-else>{{ $t( 'survey.form.preview' ).toUpperCase( ) }}</div>        
      </b-row>
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
        <div class="pl-3 pr-3" v-if="survey.endDate">
        	<span class="font-italic">{{ $t( "survey.form.end_date" ) }}:</span> {{ survey.endDate | moment( "DD-MM-YYYY" ) }} 
       	</div>
      </b-row>
      <b-row align-v="center" class="pt-5 pb-5">
      	<b-col cols="12" lg="8">
      		<b-row class="pl-3">
		        <div v-for="(model, i) in survey.ruralModels" :key="i"
		          class="circle" :style="{ background: model.color }"
		           v-b-tooltip.hover="model.name">
		        </div>
		      </b-row>
      	</b-col>
        <b-col cols="6" lg="3" sm="6">
          <social-networks-share></social-networks-share>
        </b-col>
        <b-col cols="6" lg="1" sm="1" v-if="!previewMode">
          <report-component :contentId="survey.id" 
                            :cntReport="survey.reports"
                            :contentType="REPORT_CONTENT_TYPES.SURVEY">
          </report-component>
        </b-col>
      </b-row>
      <b-row>
        <b-card class="w-100">
          <b-card-header header-tag="header" role="tab">
            <b-row @click="collapsedDescription = !collapsedDescription" style="cursor: pointer;">
            	<b-col cols="11" class="font-weight-bold pb-4">{{ $t( "survey.form.description" ) }}</b-col>
            	<b-col cols="1">
            		<div class="incoming_msg_chevron" align="center">
                  <i v-if="collapsedDescription" class="fas fa-chevron-down"></i>
                  <i v-else class="fas fa-chevron-up"></i>
                </div>  
            	</b-col>
            	<b-col cols="12" class="description pb-3" :class="{ 'line-clamp' : collapsedDescription }">
            		{{ survey.description }}
            	</b-col>            	
            </b-row>
          </b-card-header>
        </b-card>  
      </b-row>
      <b-row v-if="!authenticationRequired">
        <div v-if="survey.sections.length > 0" class="w-100">
        	<b-row class="pt-5">
        		<b-col cols="12" class="section-title">
              {{ survey.sections[ currentSection ].title }}
        		</b-col>
        		<b-col>
        		  <div>{{ survey.sections[ currentSection ].description }}</div>
              <span class="faded"></span>          
              <b-row align-v="center" align-h="center" class="w-100 pt-5 pb-5 pl-5 pr-3">
                <b-row v-for="( question, qIndex ) in survey.sections[ currentSection ].questions" :key="qIndex" class="w-100">
                  <div v-if="( question.typeId != SURVEY_QUESTION_TYPE.CONTROL && question.typeId != SURVEY_QUESTION_TYPE.CONTROL_END ) && question.dependsAnswerId == null || ( question.dependsAnswerId != null && currentAnswers.includes( question.dependsAnswerId ) )" class="box-container">
                    <div class="question-title">
                      {{question.question}}
                      <span class="required" v-if="question.mandatory">*</span>
                    </div>

                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE">
                      <!-- Multiple answer, single choice -->
                      <b-form-radio-group 
                          v-model.number="answers[ currentSection ][ question.id ].answer"
                          @change="getSectionConditions( question, $event )"
                          :name="`question-${question.id}-options`"
                          :id="`question-${question.id}-options`"
                          :options="question.formAnswers"                        
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory }"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`"
                          class="pt-3 pl-3"
                          stacked>
                      </b-form-radio-group>
                    </b-form-group>
                    
                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE">
                      <!-- Multiple answer, multiple choice -->
                      <b-form-checkbox-group 
                          v-model="answers[ currentSection ][ question.id ].answer"
                          @change="getSectionConditions( question, $event )"
                          :name="`question-${question.id}-options`"
                          :id="`question-${question.id}-options`"
                          :options="question.formAnswers"                        
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory }"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`"
                          class="pt-3 pl-3"
                          stacked>
                      </b-form-checkbox-group>
                    </b-form-group>

                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.DROPDOWN_LIST">
                      <!-- Dropdown List -->
                      <b-form-select
                          v-model.number="answers[ currentSection ][ question.id ].answer"
                          @change="getSectionConditions( question, $event )"
                          :name="`question-${question.id}-options`"
                          :id="`question-${question.id}-options`"
                          :options="question.formAnswers"                        
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory }"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`">
                      </b-form-select>
                    </b-form-group>

                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.SHORT_TEXT">
                      <!-- Short text -->
                      <b-form-input
                          v-model="answers[ currentSection ][ question.id ].textAnswer"
                          :name="`question-${question.id}-options`"
                          :id="`question-${question.id}-options`"               
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory, max: 300 }"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`">
                      </b-form-input>
                    </b-form-group>

                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.LONG_TEXT">
                      <!-- Long text -->
                      <b-form-textarea
                          v-model="answers[ currentSection ][ question.id ].textAnswer"
                          :name="`question-${question.id}-options`"
                          :id="`question-${question.id}-options`"               
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory, max: 800 }"
                          :rows="5"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`">
                      </b-form-textarea>
                    </b-form-group>

                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.DATE">
                      <!-- Date -->
                      <datepicker
                        v-model="answers[ currentSection ][ question.id ].dateAnswer"
                        :placeholder="$t('util.insertDate')"
                        class="date-picker"
                        :name="`question-${question.id}-options`"
                        :id="`question-${question.id}-options`"         
                        :language="languages[language]"
                        :calendar-button="true"
                        calendar-button-icon="fa fa-calendar"
                        :clear-button="true"
                        :required="question.mandatory"
                        v-validate="{ required: question.mandatory }"
                        :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`">
                      </datepicker>
                    </b-form-group>


                    <b-form-group v-if="question.typeId == SURVEY_QUESTION_TYPE.SCALE" class="pt-3 pb-3">
                      <!-- Scale -->
                      <b-form-radio-group 
                          :id="`question-${question.id}-options`" 
                          :name="`question-${question.id}-options`" 
                          v-model.number="answers[ currentSection ][ question.id ].answer"
                          @change="getSectionConditions( question, $event )"
                          :required="question.mandatory"
                          v-validate="{ required: question.mandatory }"
                          :data-vv-as="`${ $t('survey.form.question') }: \'${ question.question }\'`">
                        <table class="scale-options">
                          <tr>
                            <td v-for="( option, i ) in question.formAnswers" :key="i">{{ option.text }}</td>
                          </tr>
                          <tr >
                            <td v-for="( option, i ) in question.formAnswers" :key="i">
                              <b-form-radio :value="option.value"> </b-form-radio>
                            </td>
                          </tr>
                        </table>
                      </b-form-radio-group>
                    </b-form-group>
                    
                    <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'survey.form.which' )"
                        v-if="hasOtherOption( question, answers[ currentSection ][ question.id ] )"
                        class="pl-3">
                      <b-form-input v-model.trim="answers[ currentSection ][ question.id ].other"
                          :name="`question-${question.id}-other`"
                          :id="`question-${question.id}-other`"
                          v-validate="{ required: hasOtherOption( question, answers[ currentSection ][ question.id ] ) }"
                          :data-vv-as="`${ $t('survey.form.other') }`">
                      </b-form-input>
                    </b-form-group>

                    <span v-if="errors.has( `question-${question.id}-other` )" class="required">
                      {{ errors.first( `question-${question.id}-other` ) }}
                    </span>
                    <span v-if="errors.has( `question-${question.id}-options` )" class="required">
                      {{ errors.first( `question-${question.id}-options` ) }}
                    </span>
                    <!-- {{question}} -->
                  </div>
                </b-row>
              </b-row>
              <span class="faded"></span>
        		</b-col>
        	</b-row>
  	      <b-row align-v="center" class="w-100">
  	      	<b-col>
  		      	<b-row align-h="start">
  		      		<sipsder-btn :disabled="sectionTraversal.length == 1"
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
  	      	</b-col>
  	      	<b-col>
  		      	<b-row align-h="end">
  		      		<sipsder-btn 
  		      			v-if="currentSection == survey.sections.length - 1"
  		      			:disabled="previewMode"
  		      			btnType="accept" 
  		      			:text="$t( 'survey.form.send_btn' )" 
  		      			@onClick="sendSurvey( )">
  		        	</sipsder-btn>
  		      	</b-row>
  	      	</b-col>
  	      </b-row>
        </div>
        <div v-else class="w-100">
          <b-row class="box-container" align-h="center" align-v="center">
            {{ $t( 'survey.form.popup.no_sections_yet' ) }}
          </b-row>
        </div>
    	</b-row>
      <b-row v-else align-h="center" class="pt-5 pb-5">
    		<div align="center">
    			{{ $t( 'survey.form.popup.authentication_required' ) }}
    			<a v-b-modal.login href="#">{{ $t( 'survey.form.popup.authentication_placeholder' ) }}</a>   			
    		</div>
    	</b-row>
      <b-row align-h="center">
    		<sipsder-btn 
    			btnType="back" 
    			:text="$t( 'survey.form.back_btn' )" 
    			@onClick="previewMode ? back( ) : showModal( 'unsavedChanges' )">
      	</sipsder-btn>
    	</b-row>
    </b-container>
    <b-container class="container-form" v-else>
      <b-row>
        <div class="feed-title">{{ $t( 'survey.form.title' ).toUpperCase( ) }}</div>
      </b-row>
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
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES, HTTP_STATUS } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, TARGET_AUDIENCE, SURVEY_FORM_MODE, SURVEY_QUESTION_TYPE, SURVEY_STATUS } from '../../../domain_constants';
import surveyUtils from '../../../util/survey/surveyUtil';
import VAPI from '../../../http_common';
import Vue from 'vue';

export default { 
	components: {
		SocialNetworksShare,
		ReportComponent,
    ScoreComponent,
    datepicker: Datepicker,
	},
	async mounted( ) {
    if( this.$route.query.mode && this.$route.query.mode == this.SURVEY_FORM_MODE.PREVIEW ) {
      this.previewMode = true;
      this.allowSurvey = true;
      if( !this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) ) {
        this.showModal( 'unauthorizedPreviewModal' );
        this.allowSurvey = false;
      }
    }
		const surveyData = await this.fetchSurveyStructure( );
    this.survey = surveyData;
    this.survey.sections.forEach( section => {
      this.sectionIds.push( section.id );
    });
    //Always starts with first section
    this.sectionTraversal.push( 0 );
    this.checkIfCachedQuestions( 0 );
	},
	data: () => ({
		SCORE_CONTENT_TYPE,
		REPORT_CONTENT_TYPES,
		TARGET_AUDIENCE,
    SURVEY_FORM_MODE,
    SURVEY_QUESTION_TYPE,
    SURVEY_STATUS,
    HTTP_STATUS,
		previewMode: false,
		collapsedDescription: true,
    currentSection: 0,
    currentSectionConditions: {},
		passwordRequired: null,
    survey: null,
    sectionIds: [],
    sectionTraversal: [], //This attribute represents the actual section traversal made by the user
    answers: {},
    hasAcceptedTerms: false,
    language: "es",
    languages: lang,
    allowSurvey: false,
    certificateData: null,
	}),
	methods: {
		showModal( ref ){
      this.$refs[ ref ].show( );
    },
    closeModal( ref ){
      this.$refs[ ref ].hide( );
    },
    async fetchSurveyStructure( ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/form/${this.$route.params.id}`);
        return response.data.data;
      }
      catch( error ) {
        if( error.response.status == HTTP_STATUS.UNAUTHORIZED ) {
          this.showModal( 'alreadyFilledModal' );
        }
        else{
          console.log( 'Error fetching survey basic structure', error );
          this.showModal( 'failedReceiveModal' );
        }
      }
    },
    async fetchQuestionsPerSection( sectionId ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/section/${sectionId}`);
        return response.data.data.questions;
      }
      catch( error ) {
        console.log( 'Error fetching questions in section: ' + sectionId, error );
        this.showModal( 'failedReceiveModal' );
      }
    },
    setWelcomeScreen( ) {
    	if( !this.previewMode ) {
    		if( this.survey ) {
    			if( this.TARGET_AUDIENCE.PROTECTED == this.survey.targetAudience ) {
		    		this.showModal( 'passwordRequiredModal' );
		    	}
		    	else if( this.TARGET_AUDIENCE.SPECIFIC == this.survey.targetAudience ) {
		    		if( !( this.isAuthenticated && 
		    				this.survey.userTypes.includes( this.$store.getters.getCurrentUser.userType.id ) ) ) {
		    			this.showModal( 'unauthorizedModal' ); 	
		    		}
            else {
              this.showModal( 'welcomeModal' );
            }
		    	}
		    	else if( this.TARGET_AUDIENCE.EVERYONE == this.survey.targetAudience || this.TARGET_AUDIENCE.AUTHENTICATED == this.survey.targetAudience ) {
		    		this.showModal( 'welcomeModal' );
		    	}
    		}	
	    }
    },
    allowSurveyDisplay() {
      this.allowSurvey = true;
      this.closeModal( 'welcomeModal' );
    },
    sendSurvey( ) {
      this.$validator.validate( ).then( valid => {
        if( valid ) {
          this.survey.sections[ this.currentSection ].answers = this.currentAnswers.slice( 0 );
          let answerIds = [];
          Object.values( this.answers ).forEach( section => {
            Object.values( section ).forEach( question => {
              if( question != null ) {
                if( Array.isArray( question.answer ) ) {
                  answerIds.push( ...question.answer );
                }
                else { 
                  answerIds.push( question.answer );
                }
              }
            })
          });
          let payload = this.getSurveyUserAnswers( answerIds );
          this.submitAnswers( { sessionId: this.survey.session, results: payload } );
        }
        else {
          this.showModal( 'errorModal' ); 
        }
      });
    },
    getSurveyUserAnswers( answerIdArray ) {
      let answers = [];
      this.sectionTraversal.forEach( sectionId => {
        Object.keys( this.answers[ sectionId ] ).forEach( questionId => {
          if( this.answers[ sectionId ][ questionId ].answer != null ) {
            if( this.answers[ sectionId ][ questionId ].depends != null && 
                !answerIdArray.includes( this.answers[ sectionId ][ questionId ].depends ) ) {
              return;
            }
            let answerIds = this.answers[ sectionId ][ questionId ].answer;
            answers.push({
              section: this.survey.sections[ sectionId ].id,
              question: parseInt( questionId, 10 ),
              answer: Array.isArray( answerIds ) ? answerIds : [ answerIds ], // Array of answer IDs
              textAnswer: null,
              dateAnswer: null,
              other: this.answers[ sectionId ][ questionId ].other
            });
          }
          else if( this.answers[ sectionId ][ questionId ].textAnswer || this.answers[ sectionId ][ questionId ].dateAnswer ) {
            answers.push({
              section: this.survey.sections[ sectionId ].id,
              question: parseInt( questionId, 10 ),
              answer: null,
              textAnswer: this.answers[ sectionId ][ questionId ].textAnswer ? this.answers[ sectionId ][ questionId ].textAnswer : null,
              dateAnswer: this.answers[ sectionId ][ questionId ].dateAnswer ? this.answers[ sectionId ][ questionId ].dateAnswer.setHours(0, 0, 0, 0) : null,
              other: this.answers[ sectionId ][ questionId ].other
            });  
          }
        });
      });
      return answers;
    },
    async submitAnswers( payload ) {
      try {
        await VAPI.post(`${SERVICE_NAMES.SURVEY}/${this.$route.params.id}/answers`, payload, {
          responseType: "blob",
        })
        .then( 
          ( success ) => {
            this.showModal( 'sendModal' );
            this.certificateData = success.data;
          }, ( error ) => {
            this.showModal( 'failedModal' );
          }
        );      
      }
      catch( error ) {
        console.log( 'Error trying to post answers', error );
        this.showModal( 'failedModal' );
      }
    },
    downloadCertificate( ) {
      this.closeModal( 'sendModal' );
      const url = window.URL.createObjectURL(new Blob([this.certificateData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificado-encuestas.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      this.backToList( );
    },
    async checkIfCachedQuestions( sectionId ) {
      if( !this.survey.sections[ sectionId ].questions || this.survey.sections[ 0 ].questions == null ) {
        let questions = await this.fetchQuestionsPerSection( this.survey.sections[ sectionId ].id );
        Vue.set( this.answers, sectionId, {} );  
        questions.forEach( question => {
          let answerObj = {
            answer: null,
            other: null,
            depends: question.dependsAnswerId
          };
          Vue.set( this.answers[ sectionId ], question.id, answerObj );  
        });
        Vue.set( this.survey.sections[ sectionId ], 'questions', questions );
      }
    },
		prevSection( ) {
      this.sectionTraversal.pop( );
      this.currentSection = this.sectionTraversal[ this.sectionTraversal.length - 1 ];
      this.currentSectionConditions = this.survey.sections[ this.currentSection ].conditions;
      this.checkIfCachedQuestions( this.currentSection );
		},
		nextSection( ) {
      this.$validator.validate( ).then( valid => {
        if( valid ) {
          let possibleConditions = Object.values( this.currentSectionConditions );
          // Section jump
          if( possibleConditions.length > 0 ) {
            let sectionIndex = this.sectionIds.indexOf( possibleConditions[ 0 ] );
            if( sectionIndex != -1 ) {
              this.sectionTraversal.push( sectionIndex );
              this.survey.sections[ this.currentSection ].conditions = Object.assign({}, this.currentSectionConditions);
              this.survey.sections[ this.currentSection ].answers = this.currentAnswers.slice( 0 );
              this.currentSection = sectionIndex;
              this.currentSectionConditions = {};
            }
          }
          // The natural section order must be followed
          else {
            if( this.currentSection < this.survey.sections.length - 1 ) {
              this.currentSection += 1;
              this.sectionTraversal.push( this.currentSection );
            }
          }
          this.checkIfCachedQuestions( this.currentSection );
        }
        else {
          this.showModal( 'errorModal' );
        }
      });
		},
		back( ) {
      this.$router.go( -1 );
    },
    backAfterFail( ref ) {
      this.closeModal( ref );
      this.backToList( ); 
    },
    backToList( ) {
      this.$router.push( { name: 'CommunitySurvey' } );
    },
    backToMain( ) {
      this.$router.push( { name: 'Home' } );
    },
    getAnswerById( question, answerId ) {
      return question.formAnswers.find( e => { return e.value == answerId } )
    },
    transformText( answers ) {
      answers.forEach( answer => {
        answer.text=""
      });
      return answers;
    },
    hasOtherOption( question, answer ) {
      let questionObj = this.getAnswerById( question, answer.answer );
      if( questionObj ) {
        let hasOther = questionObj.other;
        if( !hasOther ) answer.other = null;
        return hasOther;
      }
      return false;
    },
    getSectionConditions( question, $event ) {
      let answerIndex = $event;
      if( Array.isArray( $event ) ) {
        answerIndex = $event[ $event.length - 1 ];
      }
      let answerObj = this.getAnswerById( question, answerIndex );
      if( answerObj && answerObj.condition != undefined && answerObj.condition ) {
        this.currentSectionConditions[ question.id ] = answerObj.target;
      }
    }
	},
	computed: {
		checkPasswordCorrectness( ) {
			if( this.survey && this.survey.password != null ) {
				return this.passwordRequired === this.survey.password;
			}
			return false;
		},
		isAuthenticated( ) {
			return this.$store.getters.isAuthenticated;
		},
		authenticationRequired( ) {
			if( !this.previewMode ){
				if( this.survey ) {
				return this.TARGET_AUDIENCE.AUTHENTICATED == this.survey.targetAudience &&
					!this.isAuthenticated;
				}
			}
			return false;
    },
    currentAnswers( ) {
      let answers = Object.values( this.answers[ this.currentSection ] );
      let currentAnswers = [];
      answers.forEach( answer => {
        if( answer.answer != null ) {
          if( Array.isArray( answer.answer ) ) {
            currentAnswers.push( ...answer.answer );
          }
          else {
            currentAnswers.push( answer.answer );
          }
        }
      });
      return currentAnswers;
    }
 	},
	watch: {
		checkPasswordCorrectness( ) {
			if( this.checkPasswordCorrectness && !this.previewMode ) {
        this.closeModal( 'passwordRequiredModal' );
				this.showModal( 'welcomeModal' );
			}
		},
		survey( ) {
			if( this.survey ) {
        let status = surveyUtils.getSurveyStatus( this.survey );
        if( status == SURVEY_STATUS.CLOSED ) {
          this.showModal( 'unauthorizedModal' );
          this.allowSurvey = false;
        }
        else {
          this.setWelcomeScreen( );
        }
			}
		}
	}
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
td
  border-left: none;
  border-right: none;
  height: 30px;
  vertical-align: middle;
.scale-options
  width: 100%;
  text-align: center;
  table-layout: fixed;
.required
	color: red
.survey-title
	padding: 25px 0px 25px 0px
	font-size: 30px
	font-weight: bold
.section-title
  padding-bottom: 15px
  padding-top: 10px
  font-weight: bold
  font-size: 25px
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
  margin-bottom: 2%
  padding-left: calc(10% + 40px)
  padding-top: 20px
  a
	  text-decoration: none
	  color: #fff
.vertical-stack
  display: block
  padding: 5px 0px 5px 30px
.question-title
  font-size: larger
  padding-bottom: 10px
</style>