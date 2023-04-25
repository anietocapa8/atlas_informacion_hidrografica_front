<template>
	<div class="pt-5 pb-5">
	  <div v-if="type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE || type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE ||
				type == SURVEY_QUESTION_TYPE.DROPDOWN_LIST">
	    <b-form-group v-for="( answer, i ) in answers" :key="i">
	    	<b-row align-v="center">
	    		<b-col cols="1" class="text-right">
	    			<i class="far fa-dot-circle" 
	    				v-if="type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE"></i>
			    	<i class="far fa-check-square" 
			    		v-if="type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE"></i>
			    	<i class="font-weight-bold" 
			    		v-if="type == SURVEY_QUESTION_TYPE.DROPDOWN_LIST">{{ i + 1 }}</i>
	    		</b-col>
	    		<b-col cols="4">
	    			<b-form-input :placeholder="answer.other ? $t( 'survey.question.add_other' ) : $t( 'survey.question.add_option' )" 
		        		v-model="answer.answer"
		        		:disabled="answer.other"
								class="materialized-input"
								:id="'answer-' + i"
								:name="'answer-' + i"
								v-validate="{ required: true, max: 280 }"
                :data-vv-as="$t( 'survey.question.answer' )">
            </b-form-input>
            <span class="bar"></span>
            <span v-if="errors.has( 'answer-' + i )" class="required">
              {{ errors.first( 'answer-' + i ) }}
            </span>
	    		</b-col>
	    		<b-col cols="1">
	    			<i class="fas fa-times-circle" 
	    				v-if="answers.length > 2" 
	    				@click="deleteOption( i )"></i>
	    		</b-col>
					<b-col cols="5" offset="1" v-if="condition">
						<vue-select :options="sectionList"
								v-model="answer.target"
								index="id"
								name="section-jump-selector" 
								:placeholder="$t( 'survey.question.jump' )" 
								class="w-100">
								<template slot="selected-option" slot-scope="option" v-if="option">
									{{ findJumpObject( option.label ) }}
								</template>
						</vue-select>
					</b-col>
	    	</b-row>	    
	    </b-form-group>
			<b-row>
				<sipsder-btn btnType="add" 
          :text="$t( 'survey.question.add_option' )" 
          @onClick="addAnswer( false )"
					class="pl-5 pr-5">
				</sipsder-btn>
				<sipsder-btn btnType="add" 
						v-if="hasOtherOption"
						:text="$t( 'survey.question.add_other_btn' )" 
						@onClick="addAnswer( true )"
						class="pl-5 pr-5">
				</sipsder-btn>
			</b-row>
	  </div>
    <div v-if="type == SURVEY_QUESTION_TYPE.SHORT_TEXT">
	    <b-form-group>
	    	<b-row align-v="center">
	    		<b-col cols="1" class="text-right">
            <i class="fas fa-stream"></i>
	    		</b-col>
	    		<b-col cols="10">
	    			<b-form-input :placeholder="$t( 'survey.question.add_short_option' )"
		        		:disabled="true">
					  </b-form-input>
	    		</b-col>
	    	</b-row>	    
	    </b-form-group>
	  </div>
    <div v-if="type == SURVEY_QUESTION_TYPE.LONG_TEXT">
	    <b-form-group>
	    	<b-row align-v="center">
	    		<b-col cols="1" class="text-right">
            <i class="fas fa-align-justify"></i>
	    		</b-col>
	    		<b-col cols="10">
	    			<b-form-textarea :placeholder="$t( 'survey.question.add_long_option' )"
                :disabled="true"
                :rows="3"
              ></b-form-textarea>
	    		</b-col>
	    	</b-row>	    
	    </b-form-group>
	  </div>
    <div v-if="type == SURVEY_QUESTION_TYPE.DATE">
	    <b-form-group>
	    	<b-row align-v="center">
	    		<b-col cols="1" class="text-right">
            <i class="far fa-calendar-alt"></i>
	    		</b-col>
	    		<b-col cols="10">
	    			<span>{{ $t( 'survey.question.add_date_option' ) }}</span>
	    		</b-col>
	    	</b-row>	    
	    </b-form-group>
	  </div>
    <div v-if="type == SURVEY_QUESTION_TYPE.SCALE">
      <b-form-group>
        <b-row align-v="center" align-h="center" class="pb-3 pt-3">
		      <div>
            {{ $t( 'survey.question.from' ) }}
          </div>
          <b-col cols="2">
            <vue-select :options="minimumScale"  index="value" 
              v-model="scale.min"
              id="scale-question-min"
              name="scale-question-min"
			        :clearable="false">
          </vue-select>
          </b-col>
          <div>
            {{ $t( 'survey.question.to' ) }}
          </div>
          <b-col cols="2">
            <vue-select :options="maximumScale" index="value" 
              v-model="scale.max"
              id="scale-question-max"
              name="scale-question-max"
			        :clearable="false">
          </vue-select>
          </b-col>
        </b-row>
	    </b-form-group>
	    <b-form-group v-for="( option, i ) in rangedOptions" :key="i">
	    	<b-row align-v="center">
	    		<b-col cols="1" class="text-right">
			    	<i class="font-weight-bold">{{ option }}</i><span class="required"> *</span>
	    		</b-col>
	    		<b-col cols="6">
	    			<b-form-input :placeholder="$t( 'survey.question.add_scale_label' )"
                v-model="answers[ option - 1 ].answer"
                @change="scaleModelModifier( option - 1, $event )"
                class="materialized-input"
                :id="'answer-' + i"
                :name="'answer-' + i"
								v-validate="{ required: true, max: 280 }"
                :data-vv-as="$t( 'survey.question.scale_label' ) + ' ' + option">
            </b-form-input>
            <span class="bar"></span>
            <span v-if="errors.has( 'answer-' + i )" class="required">
              {{ errors.first( 'answer-' + i ) }}
            </span>
	    		</b-col>
	    	</b-row>
	    </b-form-group>
      
	  </div>
  </div>
</template>
<script>
import { SURVEY_QUESTION_TYPE } from '../../../../domain_constants';
import VAPI from '../../../../http_common';
import vueSelect from "vue-select";
import _ from 'lodash';

export default {
	components: {
    vueSelect
	},
	async beforeMount( ) {
		if( this.answers.length == 0 ) {
			this.addAnswer( false )
			this.addAnswer( false )
		}
		else {
      if( this.type == SURVEY_QUESTION_TYPE.SCALE ) {
        this.scale.max = this.answers.length;
      }
			this.answers.forEach( answer => {
				if( answer.other ) {
					this.hasOther = true;
				}
			});	
		}
	},
  data: () => ({
  	SURVEY_QUESTION_TYPE,
    hasOther: false,
    minimumScale: [
      { value: 1, label: '1' }
    ],
    maximumScale: [
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10' },
    ],
    scale: {
      min: 1,
      max: 2
    }
	}),
	props: {
    type: {
			type: Number,
			default: () => (1)
		},
		answers: {
      type: Array,
      default: () => ([])
		},
		deleted: {
      type: Array,
      default: () => ([])
		},
		condition: {
			type: Boolean,
			default: false
    },
		sectionList: {
			type: Array,
			default: () => ([])
		}
	},
	methods: {
    createAnswer( other ) {
      return {
				id: null,
				answer: null,
				other: other,
				condition: false,
				source: null,
				target: null
			};
    },
		addAnswer( other ) {
			this.answers.push( this.createAnswer( other ) );
			if( other ) this.hasOther = true;
		},
		deleteOption( index ) {
			let deleted = this.answers.splice( index, 1 );
			if( deleted[ 0 ].other ) this.hasOther = false;
			if( deleted[ 0 ].id != null ) this.deleted.push( deleted[ 0 ] );
		},
		findJumpObject( key ) {
			if( this.sectionList !== null && this.sectionList.length > 0 ) {
				let label = this.sectionList.find(section => {
					return section.id === key;
				}).label;
				if( label.length > 35 ) {
					return label.substring(0, 35) + '...';
				}
				else {
					return label;
				}
			}
    },
    scaleModelModifier( index, event ) {
      if( this.answers[ index ].answer.split( ' - ' )[ 0 ] != '' + ( index + 1 ) ) {
        this.answers[ index ].answer = (index + 1) + ' - ' + this.answers[ index ].answer
      }
    }
	},
	computed: {
		hasOtherOption( ) {
      return ( this.type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_SINGLE || 
        this.type == SURVEY_QUESTION_TYPE.MULTIPLE_CHOICE_MULTIPLE ||
        this.type == SURVEY_QUESTION_TYPE.DROPDOWN_LIST ) &&
				!this.hasOther
    },
    rangedOptions( ) {
      if( this.type == SURVEY_QUESTION_TYPE.SCALE ) {
        let difference = this.scale.max - this.answers.length
        // Add answer objects to array
        if( difference > 0 ) {
          for (let index = 0; index < difference; index++ ) {
            this.answers.push( this.createAnswer( false ) );
          }
        }
        // Pop items from array
        else if( difference < 0 ) {
          for (let index = 0; index > difference; index--) {
            let deletedScale = this.answers.pop( );
            if( deletedScale.id != null ) this.deleted.push( deletedScale );
          }
        }
        return _.range( this.scale.min, this.scale.max + 1, 1 );
      }
    }
	},
	watch: {
    scale: {
      handler: function( after ) {
      },
      deep: true,
    }
	}
}
</script>
<style scoped>
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
</style>