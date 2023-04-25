<template>
    <div id="contenedor">
    	<!-- Begin of Delete Question Modal-->
	    <b-modal ref="discardQuestionModal" :title="$t( 'survey.question.popup.title' )" hideFooter>  
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 pt-3 pb-3">
	          {{ $t( 'survey.question.popup.discard_alert' ) }}
	        </div>          
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.question.popup.ok_btn' )" 
	              @onClick="deleteQuestion( deleteQuestionId )">
	          </sipsder-btn>     
	          <sipsder-btn btnType="cancel" 
	              :text="$t( 'survey.question.popup.cancel_btn' )" 
	              @onClick="closeModal( 'discardQuestionModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Delete Question Modal-->

	    <!-- Begin of Move Question To Section Modal-->
	    <b-modal ref="moveQuestionModal" :title="$t( 'survey.question.popup.title' )" hideFooter>  
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 pt-3 pb-3">
	          {{ $t( 'survey.question.popup.move' ) }}
	        </div>          
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.question.popup.ok_btn' )" 
	              @onClick="moveQuestionToSection( moveSectionId )">
	          </sipsder-btn>     
	          <sipsder-btn btnType="cancel" 
	              :text="$t( 'survey.question.popup.cancel_btn' )" 
	              @onClick="closeModal( 'moveQuestionModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Move Question To Section Modal-->

	    <!-- Begin of Move Success Modal-->
	    <b-modal ref="moveSuccessModal" :title="$t( 'survey.question.popup.title' )" hideFooter>      
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 pt-3 pb-3">
	          {{ $t( 'survey.question.popup.move_success' ) }}
	        </div>    
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.section.popup.ok_btn' )" 
	              @onClick="closeModal( 'moveSuccessModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Move Success Modal-->

      <!-- Begin of ShowIfQuestionHasAnswer Modal-->
	    <b-modal ref="showIdQuestionHasAnswerModal" :title="$t( 'survey.question.popup.title' )" hideFooter>      
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 pt-3 pb-3">
	          {{ $t( 'survey.question.popup.visibility_constraint' ) }}
	        </div>    
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.section.popup.ok_btn' )" 
	              @onClick="closeModal( 'showIdQuestionHasAnswerModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of ShowIfQuestionHasAnswer Modal-->

	    <!-- Begin of Success Modal-->
	    <b-modal ref="successModal" :title="$t( 'survey.question.popup.title' )" hideFooter
	    		:noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 pt-3 pb-3">
	          {{ $t( 'survey.question.popup.success' ) }}
	        </div>    
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.section.popup.ok_btn' )" 
	              @onClick="backToSectionList( 'successModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Success Modal-->

	    <!-- Begin of Errors Modal-->
	    <b-modal ref="errorsModal" :title="$t( 'survey.question.popup.title' )" hideFooter>      
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 required pt-3 pb-3">
	          {{ $t( 'survey.question.popup.error' ) }}
	        </div>    
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.section.popup.ok_btn' )" 
	              @onClick="closeModal( 'errorsModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Errors Modal-->

	    <!-- Begin of Errors Modal-->
	    <b-modal ref="errorsModal" :title="$t( 'survey.question.popup.title' )" hideFooter>      
	      <b-row align-v="center" align-h="center">
	        <div class="w-75 required pt-3 pb-3">
	          {{ $t( 'survey.question.popup.error' ) }}
	        </div>    
	          <sipsder-btn btnType="accept" 
	              :text="$t( 'survey.section.popup.ok_btn' )" 
	              @onClick="closeModal( 'errorsModal' )">
	          </sipsder-btn>
	      </b-row>
	    </b-modal>
	    <!-- End of Errors Modal-->

    	<b-container class='container-form' v-if="section">
	      <b-row>
	        <sipsder-title :title="$t( 'survey.question.title' )" type="admin"></sipsder-title>
	      </b-row>
        <b-row align-h="center" class="pb-5">
          <div class="section-name">{{ section.title }}</div>
        </b-row>
        <b-row align-h="end">
          <sipsder-btn btnType="add" 
            :text="$t( 'survey.question.add_question_btn' )" 
            @onClick="addQuestion( section.questions.length + 1 )">
          </sipsder-btn>
        </b-row>
	      <b-row v-for="(question, questionIndex) in section.questions" :key="questionIndex" class="box-container question-container" align-v="center">
      		<div class="pl-15 pb-5 pt-5">{{ $t( 'survey.question.move_to' ) }}<span class="required">*</span></div>
      		<b-col cols="6" lg="6" sm="8" class="pb-5 pt-5">
	      		<v-select :options="sectionList"
	      				v-model="question.moveToSection"
								name="section-move-selector" 
								:placeholder="section.title" 
								class="w-100">
						</v-select>
					</b-col>
					<sipsder-btn btnType="send"
	          :text="$t( 'survey.question.move' )"
	          @onClick="moveSectionId = questionIndex; showModal( 'moveQuestionModal' )"
	          :disabled="question.moveToSection == null || section.questions.length < 2 || 
            question.hasDependency || question.hasCondition">
	        </sipsder-btn>
          <i :id="'image-help-'+questionIndex" class="far fa-question-circle pl-2"></i>
          <b-tooltip :target="'image-help-'+questionIndex" 
            :title="$t( 'survey.question.constraints' )">           
          </b-tooltip>
          <b-col cols="5" lg="5" sm="12">
            <b-form-group>
              <b-form-input v-model="question.question"
                :name="'question-title-' + questionIndex"
                :id="'question-title-' + questionIndex"
                class="materialized-input question-name"
                :placeholder="$t( 'survey.question.title_placeholder' )"
                v-validate="{ required: true, max: 280 }"
                :data-vv-as="$t( 'survey.question.title_placeholder' )">
              </b-form-input>
              <span class="bar"></span>
              <span v-if="errors.has( 'question-title-' + questionIndex )" class="required">
                {{ errors.first( 'question-title-' + questionIndex ) }}
              </span>
            </b-form-group>
          </b-col>
          <b-col cols="7">
            <b-row align-v="center">
              <b-col cols="3" lg="3" sm="6" class="pl-0 pr-0">
                <div>
                  {{ $t( 'survey.question.type' ) }}
                  <span class="required">*</span>
                </div>   
              </b-col>
              <b-col cols="6" lg="6" sm="12" class="pr-0 pl-0">
                <v-select :options="questionTypes"
                    v-model="question.typeId"
                    index="value"
                    :name="'question-type-selector-' + questionIndex"
                    :id="'question-type-selector-' + questionIndex"
                    :placeholder="$t( 'survey.question.type_placeholder' )" 
                    class="w-100"
                    v-validate="{ required: true }"
                    :data-vv-as="$t( 'survey.question.type' )">
                    <template slot="selected-option" slot-scope="option">
                      {{ questionTypes[ option.label - 1 ].label.length > 14 ? questionTypes[ option.label - 1 ].label.substring(0, 26) + '...' : questionTypes[ option.label - 1 ].label  }}
                    </template>
                </v-select>
                <span v-if="errors.has( 'question-type-selector-' + questionIndex )" class="required">
                  {{ errors.first( 'question-type-selector-' + questionIndex ) }}
                </span>
              </b-col>
              <b-col cols="2" lg="2" sm="6">
                <i v-if="questionIndex != 0" @click="moveQuestionUp( questionIndex )" class="fas fa-arrow-circle-up circle-button pr-2"></i>
                <i v-if="questionIndex != section.questions.length - 1" @click="moveQuestionDown( questionIndex )" class="fas fa-arrow-circle-down circle-button pl-2"></i>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12">
            <answer-component :ref="'answer-component-' + questionIndex" 
                :answers="question.answers" 
                :type="question.typeId" 
                :condition="question.hasCondition" 
                :section-list="sectionList" 
                :deleted="aDeleted">
            </answer-component>
          </b-col>
          <b-col>             
            <b-row align-v="center">
              <div class="pl-15">
              	<b-form-checkbox
              		v-model="question.hasDependency"
              		:value="true"
                  :unchecked-value="false"
                  @change="showModal('showIdQuestionHasAnswerModal')">
                </b-form-checkbox>   
                {{ $t( 'survey.question.show_if' ) }}
              </div>
              <b-col cols="3">
                  <v-select :options="filterQuestionList( question.id )"
                  		v-model="question.showIf"
                      :placeholder="$t( 'survey.question.question' )"
                      :disabled="!question.hasDependency"
                      class="w-100">
                    <template slot="selected-option" slot-scope="option">
                      {{ transform( option.label, 15 ) }}
                    </template>
                  </v-select>                  
              </b-col>
              <div>
                {{ $t( 'survey.question.has' ) }}
              </div>
              <b-col cols="3">
                  <v-select :options="question.showIf ? question.showIf.answers : []"
                  		v-model="question.has"
                      :placeholder="$t( 'survey.question.answer' )" 
                      :disabled="!question.hasDependency"
                      class="w-100">
                    <template slot="selected-option" slot-scope="option">
                      {{ transform( option.label, 15 ) }}
                    </template>
                  </v-select>                  
              </b-col>   
              <b-col>
                <b-row align-v="center">
                  <i @click="cloneQuestion( questionIndex )" class="far fa-clone pl-2 pr-2"></i>
                  <i @click="deleteQuestionId = questionIndex; showModal( 'discardQuestionModal' )" class="fas fa-trash-alt pl-2 pr-2" v-if="section.questions.length > 1"></i>
                  {{ $t( 'survey.question.mandatory' ) }}
                  <toggle-button class="pl-2 mb-0" v-model="question.mandatory"/>
                </b-row>
              </b-col>              
            </b-row>
            <b-row class="pt-3" v-if="question.typeId == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE || question.typeId == SURVEY_QUESTION_TYPE.DROPDOWN_LIST">
              <b-col>
                <b-form-checkbox
                  v-model="question.hasCondition"
                  :value="true"
                  :unchecked-value="false">
                </b-form-checkbox>         
                {{ $t( 'survey.question.jump' ) }}     
              </b-col>
    				</b-row>	
          </b-col>
        </b-row>
        <b-row align-h="end">
          <sipsder-btn btnType="add" 
            :text="$t( 'survey.question.add_question_btn' )" 
            @onClick="addQuestion( section.questions.length + 1 )">
          </sipsder-btn>
        </b-row>
        <b-row class="pt-5" align-v="center" align-h="center">
        	<sipsder-btn btnType="back"
        		class="pr-3"
        		:text="$t( 'survey.question.back' )"
        		@onClick="back()">
        	</sipsder-btn>
        	<sipsder-btn btnType="accept"
        		:text="$t( 'survey.question.save' )"
        		class="pl-3"
        		@onClick="saveForm()">
        	</sipsder-btn>
        </b-row>
    </b-container>
    </div>
</template>
<script>
import Vue from 'vue';
import VAPI from '../../../../http_common';
import AnswerComponent from './AnswerComponent.vue';
import { SERVICE_NAMES } from '@/sipsder_constants';
import { SURVEY_QUESTION_TYPE } from '../../../../domain_constants';
import vSelect from "vue-select";
import { ToggleButton } from 'vue-js-toggle-button';

export default {
	components: {
		AnswerComponent,
    "v-select": vSelect,
    ToggleButton
	},
	async beforeMount( ){
		const section = await this.fetchSectionStructure( );
		this.section = section;
		if( this.section.questions.length == 0 ) {
		  this.addQuestion( 1 )
		}
		this.section.questions.forEach( question => {
      let answers = [];
			question.answers.forEach( answer => {
				if( answer.condition ) {
					question.hasCondition = true;
        }
        if( !answer.other ){
          answers.push( { id: answer.id, label: answer.answer } );
        }
      });
      if( question.typeId != SURVEY_QUESTION_TYPE.SHORT_TEXT && 
           question.typeId != SURVEY_QUESTION_TYPE.LONG_TEXT && 
           question.typeId != SURVEY_QUESTION_TYPE.DATE ) {
        
        this.questionList.push( { id: question.id, label: question.question, answers: answers } );
      }
		});

		//Set dependencies :/
		this.section.questions.forEach( question => {
			if( question.dependsAnswerId ) {
				question.hasDependency = true;
				this.setQuestionDependencyObject( question, question.dependsAnswerId );
			}
		});

		const surveyStructure = await this.fetchSurveySections( );
		surveyStructure.sections.forEach( section => {
			if( section.id != this.$route.params.section ) {
				this.sectionList.push({
					id: section.id,
					label: section.title
				});
			}
		})
  },
  data( ) {
    return {
      SURVEY_QUESTION_TYPE,
      section: null,
      sectionList: [],
      questionList: [],
      answerList: [],
      questionTypes:[
        {
          value: SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE,
          label: this.$t( `survey.question.types.one` )
        },
        {
          value: SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE,
          label: this.$t( `survey.question.types.two` )
        },
        {
          value: SURVEY_QUESTION_TYPE.DROPDOWN_LIST,
          label: this.$t( `survey.question.types.three` )
        },
        {
          value: SURVEY_QUESTION_TYPE.SHORT_TEXT,
          label: this.$t( `survey.question.types.four` )
        },
        {
          value: SURVEY_QUESTION_TYPE.LONG_TEXT,
          label: this.$t( `survey.question.types.five` )
        },
        {
          value: SURVEY_QUESTION_TYPE.DATE,
          label: this.$t( `survey.question.types.six` )
        },
        {
          value: SURVEY_QUESTION_TYPE.SCALE,
          label: this.$t( `survey.question.types.seven` )
        },
      ],
      created: [],
      modified: [],
      deleted: [],
      aDeleted: [],
    }
  },
  methods: {
  	async fetchSectionStructure( ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section/${this.$route.params.section}` );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching survey basic structure', error );
      }
    },
    async fetchSurveySections( ) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section` );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching survey basic structure', error );
      }
    },
    transform( str, upper ) {
    	if( str.length > upper ) {
    		return str.substring( 0, upper ) + '...';
    	}
    	else {
    		return str
    	}
    },
    addQuestion( ordinal ) {
      let question = this.newQuestion( ordinal )
      this.section.questions.push( question );
    },
    newQuestion( ordinal ) {
    	return {
    		id: null,
    		question: null,
    		description: null,
    		order: ordinal,
    		mandatory: false,
    		typeId: 1,
    		groupId: null,
        dependsId: null,
        hasCondition: false,
        hasDependency: false,
    		answers: []
    	}
    },
    deleteQuestion( index ) {
      var deleted = this.section.questions.splice( index, 1 );
      if( deleted[ 0 ].id )
        this.deleted.push( deleted[ 0 ] );
      this.closeModal( 'discardQuestionModal' );
    },
    moveQuestionUp( index ) {
      this.section.questions[ index ].order -= 1 
      this.section.questions[ index - 1 ].order += 1 
      this.arraySwap( this.section.questions, index, index - 1 );
    },
    moveQuestionDown( index ) {
      this.section.questions[ index ].order += 1 
      this.section.questions[ index + 1 ].order -= 1 
      this.arraySwap( this.section.questions, index, index + 1 );
    },
    arraySwap( array, source, target ) {
      let tmp = array[ source ];
      Vue.set( array, source, array[ target ] );
      Vue.set( array, target, tmp );
    },
    cloneQuestion( index ) {
      let clone = Object.assign( {}, this.section.questions[ index ] );
      clone.id = null;
      clone.question = this.$t( 'survey.question.copy_of' ) + clone.question;
      clone.order = this.section.questions.length + 1;
      clone.answers = JSON.parse( JSON.stringify( this.section.questions[ index ].answers ) );
      clone.answers.forEach( answer => {
      	answer.id = null;
      })
      this.section.questions.splice( this.section.questions.length + 1, 0, clone )
    },
    moveQuestionToSection( id ) {
    	const promises = [];
    	promises.push( this.$validator.validate( 'question-title-' + id ) );
    	promises.push( this.$validator.validate( 'question-type-selector-' + id ) );
    	promises.push( this.$refs[ 'answer-component-' + id ][ 0 ].$validator.validate( ) );

    	Promise.all( promises ).then( validations => {
    		if( validations.some( validation => validation === false ) ){
    			this.closeModal( 'moveQuestionModal' );
    			this.showModal( 'errorsModal' );
    			return;
    		}
    		this.closeModal( 'moveQuestionModal' );
    		let body = this.prepareSingleQuestionPayload( this.section.questions[ id ] );
    		let payload = {};
    		if( body.id == null ) {
    			delete body.id;
    			payload = { created: [ body ], modified: [], deleted: [] };
    			this.moveSection( this.section.questions[ id ].moveToSection.id, payload );
    		}
    		else {
    			this.moveCreatedSection( this.$route.params.section, this.section.questions[ id ].moveToSection.id, body.id );
    		}
    		this.section.questions.splice( id, 1 );
    		
    	});
    },
    async saveForm( ) {
    	const promises = [];
    	promises.push( this.$validator.validate( ) );
    	for( let i = 0; i < this.section.questions.length; i++ ) {
    		promises.push( this.$refs[ 'answer-component-' + i ][ 0 ].$validator.validate( ) );
    	}
    	let flag = false;

    	Promise.all( promises ).then( validations => {
    		if( validations.some( validation => validation === false ) ){
    			this.showModal( 'errorsModal' );
    		}
    		else {
          let body = this.prepareAllQuestionsPayload( );
	    		this.submit( this.$route.params.section, body );
    		}
    	});
    },
    async moveSection( id, payload ) {
    	try {
    		let URI = `${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section/${id}/question`;
        await VAPI.post( URI, payload ).then( ( success ) => {
      		this.showModal( 'moveSuccessModal' );
        }, ( error ) => {
        	console.error( error );
        	this.showModal( 'errorsModal' );
        });
      }
      catch( error ) {
        console.error( 'Server error trying to move question to another section.', error );
        this.showModal( 'errorsModal' );
      }
    },
    async moveCreatedSection( id, target, question ) {
    	try {
    		let URI = `${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section/${id}/move/${question}/to/${target}`;
        await VAPI.post( URI, {moved: true} ).then( ( success ) => {
      		this.showModal( 'moveSuccessModal' );
        }, ( error ) => {
        	console.error( error );
        	this.showModal( 'errorsModal' );
        });
      }
      catch( error ) {
        console.error( 'Server error trying to move question to another section.', error );
        this.showModal( 'errorsModal' );
      }
    },
    filterQuestionList( index ) {
      let filter = this.questionList.filter( question => {
        return question.id != index;
      })
      return filter;
    },
    setQuestionDependencyObject( questionObject, id ) {
			this.questionList.forEach( question => {
				question.answers.forEach( answer => {
					if( answer.id == id ) {
						questionObject.showIf = question
						questionObject.has = answer
					}
				});
			});
			return null;
		},
    backToSectionList( ref ) {
    	this.closeModal( ref );
    	this.back( );
    },
    back( ) {
    	this.$router.push({
        name: 'SurveySectionAdmin',
        params: {
          code: this.$route.params.code
        }
      });
    },
    prepareAllQuestionsPayload( ) {
    	let created = [];
    	let modified = [];
    	let deleted = this.deleted;
    	this.section.questions.forEach( question => {
    		let questionObj = this.prepareSingleQuestionPayload( question );
    		if( questionObj.id != null ) {
    			modified.push( questionObj );
    		}
    		else {
    			created.push( questionObj );
    		}
    	});
    	this.deleted.forEach( question => {
    		question.answers = this.prepareAnswerPayload( question.typeId, question.hasCondition, question.answers, true );
    	});
    	return { created: created, modified: modified, deleted: deleted };
    },
    prepareSingleQuestionPayload( questionObject ) {
  		let questionObj = {
  			id: questionObject.id,
    		question: questionObject.question,
    		description: questionObject.description,
    		order: questionObject.order,
    		mandatory: questionObject.mandatory,
    		typeId: parseInt( questionObject.typeId, 10 ),
    		groupId: questionObject.groupId,
        dependsId: questionObject.dependsId
  		}
  		if( questionObject.hasDependency && questionObject.has ) {
  			questionObj.dependsId = questionObject.has.id;
      }
      else if( !questionObject.hasDependency ) {
        questionObj.dependsId = null;
      }
      questionObj.answers = this.prepareAnswerPayload( questionObj.typeId, questionObject.hasCondition, questionObject.answers, false );
  		return questionObj; 
    },
    prepareAnswerPayload( questionType, hasCondition, answers, markForDeletion ) {
      // These question types does not require answers, just question and result.
      if( questionType == SURVEY_QUESTION_TYPE.SHORT_TEXT ||
          questionType == SURVEY_QUESTION_TYPE.LONG_TEXT ||
          questionType == SURVEY_QUESTION_TYPE.DATE ) {
        return { created: [], modified: [], deleted: [] };
      }
      //Otherwise
    	let created = [];
    	let modified = [];
    	let deleted = [ ...this.aDeleted ];
    	answers.forEach( answer => {
    		if( answer.other ){
    			answer.answer = 'Otro...'
    		}
    		if( answer.target != null && hasCondition ){
    			answer.condition = true;
    			answer.source = parseInt( this.$route.params.section, 10 );
    		}
    		else if( answer.target != null && !hasCondition ){
    			answer.target = null;
    		}

    		if( answer.id != null ) {
          if( markForDeletion ) {
            deleted.push( answer );
          }
          else {
            modified.push( answer );
          }
    		}
    		else if( !markForDeletion ){
    			created.push( answer );
    		}
    	});
    	return { created: created, modified: modified, deleted: deleted };
    },
    async submit( id, payload ) {
    	try {
        let URI = `${SERVICE_NAMES.SURVEY}/admin/${this.$route.params.code}/section/${id}/question`;
        await VAPI.post( URI, payload ).then( ( success ) => {
      		this.showModal( 'successModal' );
        }, ( error ) => {
        	console.error( error );
        	this.showModal( 'errorsModal' );
        });
      }
      catch( error ) {
        console.error( 'Server error trying to manage questions in section.', error );
        this.showModal( 'errorsModal' );
      }
    },
    showModal( ref ){
      this.$refs[ ref ].show( );
    },
    closeModal( ref ){
      this.$refs[ ref ].hide( );
    },
  }
}
</script>
<style scoped>
.pl-15 {
	padding-left: 15px;
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
.required {
  color: red;
}
.question-container {
  padding: 15px;
  width: 100%;
}
.question-name {
  font-weight: normal;
  font-size: 22px;
}
.section-name {
  font-weight: bolder;
  font-size: 25px;
}
</style>



