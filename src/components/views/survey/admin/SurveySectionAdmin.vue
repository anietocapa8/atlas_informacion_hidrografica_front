<template>
  <div id="contenedor">
    <!-- Begin of Success Modal-->
    <b-modal ref="successModal" :title="$t( 'survey.section.popup.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3">
          {{ successMessage }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="backToList( )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Success Modal-->

    <!-- Begin of Errors Modal-->
    <b-modal ref="errorsModal" :title="$t( 'survey.section.popup.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 required pt-3 pb-3">
          {{ $t( 'survey.section.popup.errors' ) }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="closeModal( 'errorsModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Errors Modal-->

    <!-- Begin of Unauthorized Modal-->
    <b-modal ref="unauthorizedEditModal" :title="$t( 'survey.section.popup.title' )" hideFooter
      :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
      <b-row align-v="center" align-h="center">
        <div class="w-75 required pt-3 pb-3">
          {{ $t( 'survey.section.popup.unauthorized' ) }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="back( )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unauthorized Modal-->

    <!-- Begin of Delete Question or Section Modal-->
    <b-modal ref="discardSectionOrQuestionModal" :title="$t( 'survey.section.popup.title' )" hideFooter>  
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3">
          {{ $t( 'survey.section.popup.discard_alert' ) }}
        </div>          
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="deleteSection( deleteSectionId )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'survey.section.popup.cancel_btn' )" 
              @onClick="closeModal( 'discardSectionOrQuestionModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Delete Question or Section Modal-->

    <!-- Begin of Unsaved Changes Modal-->
    <b-modal ref="unsavedChangesModal" :title="$t( 'survey.section.popup.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4" align="center">
          {{ $t( 'survey.section.popup.discard_alert' ) }}
        </div>          
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="back( )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'survey.section.popup.cancel_btn' )" 
              @onClick="closeModal( 'unsavedChangesModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unsaved Changes Modal-->

    <!-- Begin of Partial Save Modal-->
    <b-modal ref="partialSaveModal" :title="$t( 'survey.section.popup.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75">
          <p>
            {{ $t( 'survey.section.popup.partial_claim' ) }}
            <strong>"{{ $t( 'survey.section.popup.partial_status' ) }}"</strong>
            {{ $t( 'survey.section.popup.partial_claim2' ) }}
          </p>
          <p>{{ $t( 'survey.section.popup.partial_claim3' ) }}</p>
          <p>{{ $t( 'survey.section.popup.partial_confirmation' )}}</p>
        </div>          
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="submitSections( false, 'partialSaveModal' )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'survey.section.popup.cancel_btn' )" 
              @onClick="closeModal( 'partialSaveModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Partial Save Modal-->

    <!-- Begin of Total Save Modal-->
    <b-modal ref="totalSaveModal" :title="$t( 'survey.section.popup.title' )" hideFooter v-if="survey">      
      <b-row align-v="center" align-h="center">
        <div class="w-75">
          <p>{{ $t( 'survey.section.popup.total_claim' ) }}
            <strong>{{ survey.startDate | moment("DD-MM-YYYY") }}</strong>
            {{ $t( 'survey.section.popup.total_claim2' ) }}</p>
          <p>{{ $t( 'survey.section.popup.save_confirmation' ) }}</p>
        </div>          
          <sipsder-btn btnType="accept" 
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="submitSections( true, 'totalSaveModal' )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'survey.section.popup.cancel_btn' )" 
              @onClick="closeModal( 'totalSaveModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Total Save Modal-->

    <!-- Begin of Date Adjust Modal-->
    <b-modal ref="adjustDatesBeforeSaveModal" :title="$t( 'survey.section.popup.title' )" hideFooter v-if="survey">      
      <b-row align-v="center" align-h="center">
        <div class="w-75">
          <p>{{ $t( 'survey.section.popup.code_prefix' ) }}
            <strong>{{ survey.code }}</strong>
            {{ $t( 'survey.section.popup.code_suffix2' ) }}</p>
          <p>{{ $t( 'survey.section.popup.date_adjust' ) }}</p>
          <div class="row pb-5 pt-3">
            <div class="col-md-6 col-sm-12">
              {{ $t( 'survey.section.popup.start_date' ) }}<span class="required">*</span>
              <b-form-group>
                <datepicker :placeholder="$t('util.insertDate')" 
                  v-model="newPublicationDate"
                  id="survey-start-date"
                  name="survey-start-date"
                  class="date-picker"
                  :language = "languages[ currentLocale ]"
                  :calendar-button = "true"
                  calendar-button-icon = "fa fa-calendar"
                  :disabledDates = "disabledStartDate"
                  :clear-button = "true">
                </datepicker>
              </b-form-group>
            </div>
            <div class="col-md-6 col-sm-12">
              {{ $t( 'survey.section.popup.end_date' ) }}
              <b-form-group>
                <datepicker :placeholder="$t('util.insertDate')" 
                  v-model="newClosingDate"
                  id="survey-end-date"
                  name="survey-end-date"
                  class="date-picker"
                  :language = "languages[ currentLocale ]"
                  :calendar-button = "true"
                  calendar-button-icon = "fa fa-calendar"
                  :disabledDates = "disabledFinishDate"
                  :clear-button = "true">
                </datepicker>
              </b-form-group>
            </div>
            <div class="required col-md-12" v-if="!publicationDatesAreCorrect">
              {{ $t( 'survey.section.popup.date_adjust_alert' ) }}
            </div>
          </div>
          <p>{{ $t( 'survey.section.popup.date_adjust2' ) }}</p>
          <p>{{ $t( 'survey.section.popup.save_confirmation' ) }}</p>
        </div>          
          <sipsder-btn btnType="accept" 
              :disabled="!publicationDatesAreCorrect"
              :text="$t( 'survey.section.popup.ok_btn' )" 
              @onClick="validateNewDates( 'adjustDatesBeforeSaveModal' )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'survey.section.popup.cancel_btn' )" 
              @onClick="closeModal( 'adjustDatesBeforeSaveModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Date Adjust Modal-->

    <b-container class='container-form' v-if="survey">
      <b-row>
        <sipsder-title :title="$t( 'survey.section.title' )" type="admin"></sipsder-title>
      </b-row>
      <b-row align-h="center" class="pt-5 pb-5">
        <div>{{ $t( 'survey.section.claim' ) }}</div>
      </b-row>
      <b-row align-v="center">
        <b-col cols="6">
          <div class="survey-title">{{ survey.title }}</div>
        </b-col>
        <b-col>
          <b-row align-h="end" align-v="center">
            <b-col cols="6">
              <div class="pr-3" align="end">{{ $t( 'survey.section.code' ) }}</div>
            </b-col>
            <b-col cols="6">
              <b-form-group>              
                <b-form-input v-model="survey.code"
                  name="surveyCode"
                  class="mb-0"
                  disabled>
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>          
        </b-col>
      </b-row>
      <b-row align-v="center">
        <b-col>
          <div>{{ $t( 'survey.section.subtitle' ) }}</div>
        </b-col>
        <b-col>
          <b-row align-h="end">
            <sipsder-btn btnType="preview" 
              :text="$t( 'survey.section.preview_btn' )"
              @onClick="previewSurvey( )">
            </sipsder-btn>
          </b-row>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-row>
          <sipsder-btn btnType="add" 
            :text="$t( 'survey.section.add_section_btn' )"
            @onClick="addSection()">
          </sipsder-btn>
        </b-row>
        <b-row v-for="( section, sectionIndex ) in sections" :key="sectionIndex" class="box-container">
          <b-row align-h="center" class="w-100 pt-3 pb-3">
            <b-col cols="10">
              <b-form-group>
                <b-form-input v-model="section.title"
                  :name="'section-title-' + sectionIndex"
                  :id="'section-title-' + sectionIndex"
                  class="materialized-input section-name"
                  :placeholder="$t( 'survey.section.section_placeholder' )"
                  v-validate="{ required: true, max: 280 }"
                  :data-vv-as="$t( 'survey.section.section_placeholder' )">
                </b-form-input>
                <span class="bar"></span>
                <span v-if="errors.has( 'section-title-' + sectionIndex )" class="error-msg">
                  {{ errors.first( 'section-title-' + sectionIndex ) }}
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-row align-h="end">
                <i v-if="sectionIndex != 0" @click="moveSectionUp( sectionIndex )" class="fas fa-arrow-circle-up circle-button"></i>
                <i v-if="sectionIndex != sections.length - 1" @click="moveSectionDown( sectionIndex )" class="fas fa-arrow-circle-down circle-button"></i>
                <i v-if="sections.length > 1" class="fas fa-trash-alt circle-button" @click="deleteSectionId = sectionIndex; showModal( 'discardSectionOrQuestionModal' )"></i>
              </b-row>
            </b-col>
          </b-row>
          <b-row align-v="center" class="w-100 pt-3 pb-3">
            <b-col md="auto">
              <div>
                {{ $t( 'survey.section.description' ) }}
                <span class="required">*</span>
              </div>
            </b-col>
            <b-col>
              <b-form-group>                
                <b-form-input v-model="section.description"
                  :name="'section-description-' + sectionIndex"
                  :id="'section-description-' + sectionIndex"
                  class="materialized-input w-100"
                  :placeholder="$t( 'survey.section.description_placeholder' )"
                  v-validate="{ required: true, max: 280 }"
                  :data-vv-as="$t( 'survey.section.description' )">
                </b-form-input>
                <span class="bar"></span>
                <span v-if="errors.has( 'section-description-' + sectionIndex )" class="error-msg">
                  {{ errors.first( 'section-description-' + sectionIndex ) }}
                </span>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="end" class="w-100">
            <sipsder-btn btnType="next" 
              :text="$t( 'survey.section.manage_question_btn' )"
              @onClick="manageQuestions( sectionIndex )">
            </sipsder-btn>
          </b-row>
        </b-row>
        <b-row>
          <sipsder-btn btnType="add" 
            :text="$t( 'survey.section.add_section_btn' )"
            @onClick="addSection()">
          </sipsder-btn>
        </b-row>
        <b-row class="w-100" align-h="center">
          <sipsder-btn btnType="back" 
            :text="$t( 'survey.section.back_btn' )"
            @onClick="showModal( 'unsavedChangesModal' )"
            class="pl-3 pr-3">
          </sipsder-btn>
          <sipsder-btn btnType="partial_save" 
            type="submit" 
            :text="$t( 'survey.section.partial_save_btn' )"
            @onClick="partialSaveModal( )"
            class="pl-3 pr-3">
          </sipsder-btn>
          <sipsder-btn btnType="accept" 
            :text="$t( 'survey.section.save_btn' )"
            @onClick="totalSaveModal( )"
            class="pl-3 pr-3">
          </sipsder-btn>
        </b-row>
      </b-row>
    </b-container>
    <b-container class='container-form' v-else>
      <b-row>
        <sipsder-title :title="$t( 'survey.section.title' )" type="admin"></sipsder-title>
      </b-row>
      <b-row align-h="center" align-v="center" class="not-found">
        {{ $t( 'survey.section.loading' ) }}
      </b-row>
      <b-row class="w-100" align-h="center">
        <sipsder-btn btnType="back" 
          :text="$t( 'survey.section.back_btn' )"
          @onClick="back( )"
          class="pl-3 pr-3">
        </sipsder-btn>
      </b-row>
    </b-container> 
  </div>
</template>
<script>

import Vue from 'vue';
import VAPI from '../../../../http_common';
import vSelect from "vue-select";
import moment from 'moment';
import * as lang from "vuejs-datepicker/src/locale";
import Datepicker from 'vuejs-datepicker';
import { SERVICE_NAMES } from '@/sipsder_constants';
import { SURVEY_QUESTION_TYPE } from '../../../../domain_constants';

export default {
  async beforeMount( ){
    const survey = await this.fetchSurveySections( );
    this.survey = survey;
    this.survey.sections.forEach( ( section ) => {
      this.sections.push( section );
    });
    if( this.sections.length == 0 ) {
      this.addSection( );
    }
  },
  components: {
    Datepicker,
    "v-select": vSelect 
  },
  data( ) {
    return {
      coso: null,
      languages: lang,
      survey: null,
      sections: [ ],
      created: [ ],
      modified: [ ],
      deleted: [ ],
      newPublicationDate: null,
      newClosingDate: null,
      successMessage: null
    }
  },
  methods: {
    showModal( ref ){
      this.$refs[ ref ].show( );
    },
    closeModal( ref ){
      this.$refs[ ref ].hide( );
    },
    async fetchSurveySections( ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section`);
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching survey basic structure', error );
      }
    },
    defaultMessage( ) {
      alert( 'En construcción!')
    },
    createSection( ordinal ) {
      return {
        title: undefined,
        description: undefined,
        order: ordinal,
        condition: false,
      }
    },
    addSection( ) {
      this.sections.push( this.createSection( this.sections.length + 1 ) );
    },
    async manageQuestions( sectionId ) {
      //It should save the section first and then continue
      let section = this.sections[ sectionId ];
      if( section.id == null ) {
        if( section.title != null && section.description != null ) {
          const response = await this.submitPartialSingleSection( section );
          if( response != null ) {
            this.$router.push( { name: 'SurveyQuestionAdmin', params: { section: response.id, relatedSurvey: this.$route.params.code } } );
          }
          else {
            this.showModal( 'errorsModal' );
          }
        }         
      }
      else {
        this.$router.push( { name: 'SurveyQuestionAdmin', params: { section: section.id, relatedSurvey: this.$route.params.code } } );
      }
    },
    deleteSection( index ) {
      var deleted = this.sections.splice( index, 1 );
      if( deleted[ 0 ].id )
        this.deleted.push( deleted[ 0 ] );
      this.closeModal( 'discardSectionOrQuestionModal' );
    },
    moveSectionUp( index ) {
      this.sections[ index ].order -= 1 
      this.sections[ index - 1 ].order += 1 
      this.arraySwap( this.sections, index, index - 1 );
    },
    moveSectionDown( index ) {
      this.sections[ index ].order += 1 
      this.sections[ index + 1 ].order -= 1 
      this.arraySwap( this.sections, index, index + 1 );
    },
    arraySwap( array, source, target ) {
      let tmp = array[ source ];
      Vue.set( array, source, array[ target ] );
      Vue.set( array, target, tmp );
    },
    partialSaveModal( ) {
      this.$validator.validate( ).then( valid => {
        if( valid ) {
          this.showModal( 'partialSaveModal' );
        }
        else {
          this.showModal( 'errorsModal' );
        }
      });
    },
    totalSaveModal( ) {
      this.$validator.validate( ).then( valid => {
        if( valid ) {
          let now = new Date( );
          now.setHours( 0, 0, 0, 0 );
          let start = new Date( this.survey.startDate );
          if( now > start ) {
            this.showModal( 'adjustDatesBeforeSaveModal' );
          }
          else {
            this.showModal( 'totalSaveModal' );
          }
        }
        else {
          this.showModal( 'errorsModal' );
        }
      });
    },
    fixSectionOrders( ) {
      let counter = 1;
      this.sections.forEach( section => {
        section.order = counter;
        counter += 1; 
      });
    },
    filterSections( ) {
      this.fixSectionOrders( );
      this.created = [];
      this.modified = [];
      this.sections.forEach( newSection => {
        if( newSection.id == null ) {
          this.created.push( newSection );
        }
        else {
          this.modified.push( newSection );
        }
      });
    },
    assemblePayload( publishStatus ) {
      let base = {
        created: this.created,
        modified: this.modified,
        deleted: this.deleted,
      }
      if( this.newPublicationDate != null ) {
        this.newPublicationDate.setHours( 0, 0, 0, 0 );
        base.startDate = this.newPublicationDate;
      }
      if( this.newClosingDate != null ){
        this.newClosingDate.setHours( 0, 0, 0, 0 );
        base.endDate = this.newClosingDate;
      }
      if( publishStatus != null )
        base.publish = publishStatus;
      return base;
    },
    validateNewDates( ref ) {
      if( this.publicationDatesAreCorrect ) {
        this.submitSections( true, ref );
      }
    },
    setSuccessMessage( ref ) {
      if( ref == 'partialSaveModal') {
        this.successMessage = this.partialSuccessMessage;
      }
      else if( ref == 'totalSaveModal' || ref == 'adjustDatesBeforeSaveModal' ) {
        this.successMessage = this.totalSuccessMessage;
      } 
    },
    async submitPartialSingleSection( section ) {
      try {
        const response = await VAPI.post(`${SERVICE_NAMES.SURVEY}/admin/${this.survey.id}/section/single`, section );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Server error trying to create a new section.', error );
      }
    },
    async submitSections( publishStatus, ref ) {
      this.closeModal( ref );
      this.filterSections( );
      try {
        await VAPI.post(`${SERVICE_NAMES.SURVEY}/admin/${this.survey.id}/section`, this.assemblePayload( publishStatus ) )
        .then( 
          ( success ) => {
            this.setSuccessMessage( ref );
            this.showModal( 'successModal' );
          }, ( error ) => {
            this.showModal( 'errorsModal' );
          }
        );      
      }
      catch( error ) {
        console.log( 'Error del servidor al intentar almacenar', error );
      }
    },
    getUrl( survey ) {
      return survey.url.split('/');
    },
    previewSurvey( ) {
      this.$router.push( { name: 'SurveyForm', 
        params: { id: this.getUrl( this.survey )[ 0 ], url: this.getUrl( this.survey )[ 1 ] }, 
        query: { mode: 'preview' } } );
    },
    back( ) { 
      this.$router.go( -1 );
    },
    backToList( ) {
      this.closeModal( 'successModal' );
      this.$router.push( { name: 'CommunitySurvey' } );
    }
  },
  watch: {
    sections: {
      handler( val, oldVal ) {
        //console.log( val );
      },
      deep: true
    },
    survey( ) {
      if( this.survey && this.survey.published ) {
        this.showModal( 'unauthorizedEditModal' );
      }
    }
  },
  computed: {
    currentLocale( ) {
      return this.$i18n.locale;
    },
    partialSuccessMessage( ) {
      return this.$i18n.t( 'survey.section.popup.success_partial' ) + 
        " " + this.survey.code + " " + this.$i18n.t( 'survey.section.popup.success_partial2' );
    },
    totalSuccessMessage( ) {
      let message = this.$i18n.t( 'survey.section.popup.success_total' ) + 
      " " + this.survey.code + " " + this.$i18n.t( 'survey.section.popup.success_total2' ) + " ";
      if( this.newPublicationDate != null )
        message += moment( this.newPublicationDate ).format( "DD-MM-YYYY" );
      else
        message += moment( this.survey.startDate ).format( "DD-MM-YYYY" );
      return message;
    },
    disabledStartDate( ) {
      let publicationDate = new Date( );
      publicationDate.setHours( 0, 0, 0, 0 );
      return {
        to: publicationDate
      }
    },
    disabledFinishDate( ) {
      let closingDate = new Date( this.newPublicationDate );
      closingDate.setDate( closingDate.getDate( ) + 1 );
      return {
        to: closingDate
      }
    },
    publicationDatesAreCorrect( ) {
      if( this.newPublicationDate != null && 
          this.newClosingDate == null) {
        return true;
      }
      else {
        return ( this.newPublicationDate != null ) && 
          ( this.newClosingDate != null ) && 
          ( this.newPublicationDate < this.newClosingDate );
      }
    }
  }
}
</script>
<style scoped>
.not-found {
  border: 2px solid black;
  padding: 30px 0px 30px 0px;
  margin: 40px 0px 40px 0px;
}
.error-msg {
  color: red;
  padding: 10px 15px 10px 15px;
}
.required {
  color: red;
}
.form-group {
  margin-bottom: 0rem;
}
.survey-title {
  font-weight: bold;
  font-size: 25px;
}
.section-name {
  font-size: 20px;
  font-weight: bold;
}
.question-name {
  font-weight: normal;
  font-size: 18px;
}
.question-container {
  padding: 15px;
  width: 100%;
}
.circle-button {
  padding: 5px;
  font-size: larger;
  cursor: pointer;
}
.faded {
  display: block;
  border: none;
  color: white;
  height: 1px;
  background: black;
  background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 550, from(#000), to(#fff));
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.box-container {
  border: 2px solid black;
  padding: 30px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.materialized-input {
  padding: 10px 10px 10px 5px;
  display: block;
  border: none;
  color: black;
  border-bottom: 1px solid #d0d0d0;
}
.materialized-input:focus { 
  outline: none;
  box-shadow: none;
}
.bar { 
  position: relative; 
  display: block;
}
.bar:before, .bar:after {
  content: '';
  height: 2px; 
  width: 0;
  bottom:1px; 
  position: absolute;
  background: #00b7ba; 
  transition: 0.2s ease all; 
  -moz-transition: 0.2s ease all; 
  -webkit-transition: 0.2s ease all;
}
.bar:before {
  left: 50%;
}
.bar:after {
  right: 50%; 
}
.materialized-input:focus ~ .bar:before, .materialized-input:focus ~ .bar:after {
  width:50%;
}
</style>


