<template>
	<div id="contenedor">
    <!-- Begin of Success Modal-->
    <b-modal ref="successModal" :title="$t( 'faqs.modal.title' )" hideFooter 
      :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3">
          {{ $t( 'faqs.modal.save_success') }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="back( )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Success Modal-->

    <!-- Begin of Errors Modal-->
    <b-modal ref="errorsModal" :title="$t( 'faqs.modal.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3" style="color: red;">
          {{ $t( 'faqs.modal.save_fail') }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="closeModal( 'errorsModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Errors Modal-->

    <!-- Begin of Validation Errors Modal-->
    <b-modal ref="validationsModal" :title="$t( 'faqs.modal.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3" style="color: red;">
          {{ $t( 'faqs.modal.form_errors' ) }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="closeModal( 'validationsModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Validation Errors Modal-->

    <!-- Begin of Unsaved Changes Modal-->
    <b-modal ref="unsavedChanges" :title="$t( 'faqs.modal.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-100 pt-2 pb-4" align="center">
          {{ $t( 'faqs.modal.discard_alert' ) }}
        </div>          
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="back( )">
          </sipsder-btn>     
          <sipsder-btn btnType="cancel" 
              :text="$t( 'faqs.modal.cancel' )" 
              @onClick="closeModal( 'unsavedChanges' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Unsaved Changes Modal-->

    <b-container class='container-form'>
    	<sipsder-title :title="$t('faqs.admin_title')" type="admin"></sipsder-title>
      <b-row align-h="center" class="pb-5 pt-5 mb-5">
        {{ $t( 'faqs.modal.claim' ) }}
      </b-row>
      <b-form @submit.prevent="onSubmit">      	
      	<b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
            	{{ $t( 'faqs.modal.question' ) }}
            	<span class="required">*</span>
           	</div>
          </b-col>
          <b-col cols="10" align-self="center">
            <b-form-group class="mb-0">
              <b-form-input v-model="currentFAQ.question" 
                name="questionTitle"
                :data-vv-as="$t( 'faqs.modal.question' )"
                required
                v-validate="'required|max:380'">
          		</b-form-input>
            </b-form-group>
            <span v-if="errors.has( 'questionTitle' )" 
                class="error-msg">
              {{ errors.first( 'questionTitle' ) }}
            </span>
          </b-col>
        </b-row>

        <b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
            	{{ $t( 'faqs.modal.answer' ) }}
            	<span class="required">*</span>
           	</div>
          </b-col>
          <b-col cols="10">
            <rich-text :options="customToolbar" 
                    :newContent="currentFAQ.answer" 
                    @changeValue="setAnswer" 
                    class="anti-container">
            </rich-text>
            <span class="error-msg" v-if="currentFAQ.answer.length < 1 || currentFAQ.answer.length > 4000">
          		{{ $t('faqs.modal.answer_required' )}}
          	</span> 
          </b-col>
        </b-row>

        <b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
            	{{ $t( 'faqs.modal.rural' ) }}
            	<span class="required">*</span>
           	</div>
          </b-col>
          <b-col cols="10">
            <treeselect v-model="selectedRuralModel" 
                    required
                    v-validate="'required'"
                    :data-vv-as="$t( 'faqs.modal.rural' )"
                    name="ruralSelect"
                    class="pt-2"
                    :multiple="false" 
                    :options="ruralModels"
                    :placeholder="$t( 'faqs.modal.rural_select' )"
                    :clearable="true"
                    :default-expand-level="1"
                    :disable-branch-nodes="true"
                    :show-count="true">
	            <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
	              <img v-if="node.raw && node.raw.url != null" 
                    :src="getImgURL(node.raw.url)" height="16" width="16">
                <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                <span> {{ node.label.split('/')[0] }} </span>
                <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
	            </label>
	          </treeselect>
            <span v-if="errors.has( 'ruralSelect' )"
                class="error-msg">
              {{ errors.first( 'ruralSelect' ) }}
            </span>
          </b-col>
        </b-row>

        <b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
              {{ $t( 'faqs.modal.tags' ) }}
              <span class="required">*</span>
            </div>
          </b-col>
          <b-col cols="10">
            <tags-input class="w-100 tag-container" name="tags" v-model="tag" :data-vv-as="$t('rural_indicators.admin.tags')"
              :placeholder="$t('rural_indicators.admin.tags_placeholder')" :tags.sync="currentFAQ.tags"
              @tags-changed="newtags => currentFAQ.tags = newtags"/>

            <span v-if="errors.has( 'questionTags' )"
                class="error-msg">
              {{ errors.first( 'questionTags' ) }}
            </span>
          </b-col>
        </b-row>

        <b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
              {{ $t( 'faqs.modal.status' ) }}
              <span class="required">*</span>
            </div>
          </b-col>
          <b-col cols="10">
            <vue-select :options="status"
                    name="statusSelect"
                    v-model="selectedStatus"
                    required
                    v-validate="'required'"
                    :data-vv-as="$t( 'faqs.modal.status' )">
            </vue-select>
            <span v-if="errors.has( 'statusSelect' )"
                class="error-msg">
              {{ errors.first( 'statusSelect' ) }}
            </span> 
          </b-col>
        </b-row>

        <b-row align-v="center" class="pb-5">
          <b-col>
            <div class="inline-title">
              {{ $t( 'faqs.modal.entity' ) }}
            </div>
          </b-col>
          <b-col cols="10">
            <b-form-group>
            <div class="multiple">
              <vue-bootstrap-typeahead
                :data="entities"
                v-model="entitySearch"
                ref="entitySearch"
                class="w-100"
                :serializer="entity => entity.name"
                :placeholder="$t( 'faqs.modal.name_plho')"
                @hit="selectedEntity = $event"
              ></vue-bootstrap-typeahead>
              <sipsder-btn btnType="add" text="" @onClick="addNewEntity"></sipsder-btn>
            </div>

            <div class="multiple" v-for="(entity, index) in entitiesAdded" :key="index">
              <b-form-input v-model="entitiesAdded[ index ]" :disabled="true"></b-form-input>
              <sipsder-btn btnType="cancel" text="" @onClick="deleteNewEntity( index )"></sipsder-btn>
            </div>
          </b-form-group>
          </b-col>
        </b-row>

        <b-row align-h="center">
          <sipsder-btn btnType="accept" class="pr-3" type="submit" :text="$t( 'faqs.modal.save' )">
          </sipsder-btn>
          <sipsder-btn btnType="cancel" class="pl-3" :text="$t( 'faqs.modal.cancel' )" @onClick="showModal( 'unsavedChanges' )">
          </sipsder-btn>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>
<script>
  import vSelect from "vue-select";
  import RichText from '../../shared/RichText.vue';
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
  import VAPI from '../../../http_common';
  import { SERVICE_NAMES } from '../../../sipsder_constants';
  import { PERMISSIONS_TYPES } from "../../../domain_constants";
  import VeeValidate from 'vee-validate';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import _ from "lodash";
  import S_UTIL from "../../../util/sipsder_util";

  export default {
    components: {
      'vue-select': vSelect,
      RichText,
      VueBootstrapTypeahead,
      Treeselect,
    },
    async beforeMount( ) {
      const ruralModelTree = await this.fetchRuralModelTree( );
      this.ruralModels = ruralModelTree;

      if( this.$route.params.id ) {
        this.$store.dispatch( 'setAdminFAQModalStatus', 'editQuestion' );
        const question = await this.fetchFAQ( this.$route.params.id );
        this.currentFAQ = question;
        let tagsAssociated = [];
        question.tags.split( ',' ).forEach(tag => {
          tagsAssociated.push( { "text": tag, "tiClasses": [ "ti-valid" ] } );
        });
        this.currentFAQ.tags = tagsAssociated;
        this.selectedStatus = this.status.find( (status) => { return status.value == this.currentFAQ.status } );
        this.selectedRuralModel = this.currentFAQ.ruralModel.id;
        if( this.currentFAQ.institutions.length > 0 ) {
          this.currentFAQ.institutions.forEach( ins => {
            this.entitiesAdded.push( ins.name );
            this.entitiesAddedIds.add( ins.id );
          });          
        }
      }
      else {
        this.$store.dispatch( 'setAdminFAQModalStatus', 'addQuestion' );
      }      
    },
    data: ( ) => ({
      entities: [],
      questions: [],
      meta: null,
      currentExpanded: null,
      currentPage: 1,
      entitySearch: '',
      selectedEntity: null,
      entitiesAdded: [],
      entitiesAddedIds: new Set( ),
      ruralModels: [],
      selectedStatus: null,
      selectedRuralModel: null,
      selectedQueryModel: null,
      filteredStatus: null,
      tag: '',
      customToolbar: [
        [ { 'font': [ ] } ],
        [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
        [ "bold", "italic", "underline" ],
        [ { list: "ordered" }, { list: "bullet" } ],
        [ 'link', 'image', 'video', 'formula' ],
        [ {'align': ''}, {'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' } ],
        [ { 'color': [ ] }, { 'background': [ ] } ],
        [ { 'script': 'sub' }, { 'script': 'super' } ],
        [ { 'header': [ false, 1, 2, 3, 4, 5, 6, ] } ]
      ],
      currentFAQ: {
        id: null,
        question: "",
        answer: "",
        tags: [],
        status: null,
        ruralModelId: null,
        institutionIds: []
      },
    }),
    methods: {
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      showModal( ref ){
      this.$refs[ ref ].show( );
      },
      closeModal( ref ){
        this.$refs[ ref ].hide( );
      },
      previousPage( ) {
        this.$router.go( -1 );
      },
      setAnswer( value ) {
        this.currentFAQ.answer = value;
      },
      getEntities( query ) {
        let response = VAPI.get('/' + SERVICE_NAMES.INSTITUTION + `/search?q=${query}`);
        return response;
      },
      getEntityNames( institutions ) {
        let names = [];
        institutions.forEach( institution => { names.push( institution.name ) } );
        return names.join( ", " );
      },
      addNewEntity( ){
        if( this.selectedEntity !== null ) {
          if( !this.entitiesAddedIds.has( this.selectedEntity.id ) ){
            this.entitiesAddedIds.add( this.selectedEntity.id );
            this.entitiesAdded.push( this.selectedEntity.name );
          }
          this.selectedEntity = null;
          this.entities = [];
          this.entitySearch = '';
          this.$refs.entitySearch.inputValue = '';
        }
      },
      deleteNewEntity( id ) {
        this.entitiesAdded.splice( id, 1 );
        var array = Array.from( this.entitiesAddedIds );
        var item = array.splice( id, 1 )[ 0 ];
        this.entitiesAddedIds.delete( item );
      },
      isFormValid( ) {
        return ( this.currentFAQ.answer.length > 0 ) &&
               ( this.currentFAQ.tags.length > 0 ) &&
               ( this.currentFAQ.answer.length < 4001 ) &&
               ( this.selectedRuralModel != null ) &&
               ( this.selectedStatus != null );
      },
      async fetchFAQ( id ) {
        try {
          const response = await VAPI.get(`${SERVICE_NAMES.FAQ}/${id}`);
          return response.data;
        }
        catch( error ) {
          console.log( 'Error fetching FAQ data', error );
        }
      },
      async fetchRuralModelTree( ) {
        try {
          const response = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree`);
          return response.data.data;
        }
        catch( error ) {
          console.log( 'Error fetching rural model tree structure', error );
        }
      },
      assemblePayload( ) {
        let payload = {
          id: this.currentFAQ.id,
          question: this.currentFAQ.question,
          answer: this.currentFAQ.answer,
          status: this.currentFAQ.status,
          ruralModelId: this.currentFAQ.ruralModelId,
          institutionIds: this.currentFAQ.institutionIds,
        };
        let tagList = [];
        this.currentFAQ.tags.forEach( tag => {
          tagList.push( tag.text );
        });
        payload.tags = tagList.join(',');
        if( this.entitiesAddedIds.size != 0 ) {
          payload.institutionIds = [ ...this.entitiesAddedIds ];
        }
        else{
          payload.institutionIds = [];
        }
        return payload;
      },
      async onSubmit( event ) {
        if( this.isFormValid( ) ) {
          if( this.modalStatus == 'addQuestion' ) {
            await VAPI.post(`${SERVICE_NAMES.FAQ}/admin`, this.assemblePayload( ) ).then(
              ( success ) => {
                this.showModal( 'successModal' );
              },
              ( error ) => {
                console.log( error.data );
                this.showModal( 'errorsModal' );
              }
            ); 
          }
          if( this.modalStatus == 'editQuestion' ) {
            await VAPI.put(`${SERVICE_NAMES.FAQ}/admin/${this.currentFAQ.id}`, this.assemblePayload( ) ).then(
              ( success ) => {
                this.showModal( 'successModal' );
              },
              ( error ) => {
                console.log( error.data );
                this.showModal( 'errorsModal' );
              }
            ); 
          }            
        }  
        else {
          this.showModal( 'validationsModal' );
        }             
      },
      back( ) {
        this.$router.push( { name:'FrequentlyAskedQuestionsIndex' } );
      }
    }, 
    computed: {
      isAdministrator( ) {
        
        return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
      },
      isUserLogged( ) {
        return this.$store.getters.isAuthenticated;
      },
      modalStatus( ) {
        return this.$store.getters.getAdminFAQModalStatus;
      },
      status( ) {
        return [
          { label: this.$i18n.t( 'faqs.enabled' ), value: true },
          { label: this.$i18n.t( 'faqs.disabled' ), value: false }
        ]
      },
      yesNo( ) {
        return [
          { text: this.$i18n.t( 'faqs.profit.yes' ), value: true },
          { text: this.$i18n.t( 'faqs.profit.no' ), value: false }
        ]
      }
    },
    watch: {
      selectedStatus( ) {
        if( this.selectedStatus != null ) {
          this.currentFAQ.status = this.selectedStatus.value;
        }
      },
      selectedRuralModel( ) {
        if( this.selectedRuralModel != null ) {
          this.currentFAQ.ruralModelId = this.selectedRuralModel;
        }
      },
      entitySearch: _.debounce( function( query ) {
        if( query.length > 0 ) {
          this.getEntities( query ).then( ( success ) => {
            this.entities = success.data.data;
          });
        }
      }, 500)
    }
  }
</script>

<style scoped>
  p {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .required {
  	color: red;
  	font-weight: bold;
  }
  .title {
    font-style: italic;
    color: white;
    font-weight: bolder;
  }
  .inline-title {
  	padding: 0px 15px 0px 5px;
  }
  .search-bar {
    background-color: #02747C;
    padding: 15px 15px 5px 15px;
    border-radius: 10px;
  }
  .error-msg {
  	color: red;
    font-size: 14px;
    padding: 15px 15px 10px 0px;
  }
  .results-management {
    padding: 30px 0px 30px 0px;
  }
  .right-aligned {
    text-align: right;
    align-self: center;
  }
  .left-aligned {
    text-align: left;
    align-self: center;
  }
  .center-aligned {
    text-align: center;
    align-self: center;
  }
  .disabled {
    background-color: #f5d4d4;
  }
  .sipsder-like-button {
    display: inline-block;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    margin-right: 5px;
    width: 35px;
    height: 0;
    border: 5px solid rgba(0,0,0,0);
    border-top: 0 solid;
    border-bottom: 42px solid lightsalmon;
    -webkit-border-radius: 20px 20px 10px 10px;
    border-radius: 10px 10px 5px 5px;
    color: rgba(0,0,0,1);
    -o-text-overflow: clip;
    text-overflow: clip;
    -webkit-transform: rotateZ(-99.12169855763241deg)   skewX(5deg) skewY(-2deg);
    transform: rotateZ(-99.12169855763241deg)   skewX(5deg) skewY(-2deg);
  }
  .card-header {
    background-color: transparent;
    border-bottom: none;
  }
  .card-body {
    padding-top: 0px;
    padding-bottom: 25px;
    padding-right: 15px;
  }
  .card-footer {
    background-color: transparent;
  }
  .options-padded {
    padding-left: 15px;
  }
  .collapsable-accordion {
    width: 100%;
  }
  .accordion-clickable {
    cursor: pointer;
  }
  img { 
    max-width: 100%;
  }
  .incoming_msg {
    align-items: center;
  }
  .incoming_msg_img {
    display: inline-block;
    width: 6%;
    margin-right: 10px;
  }
  .incoming_msg_chevron {
    display: inline-block;
    width: 8%;
    align-content: center;
    font-size: 25px;
  }
  .received_msg {
    display: inline-block;
    width: 85%;
  }
  .received_withd_msg {
    background: #ebebeb;
    border-radius: .4em;
    width: 100%;
    position: relative;
  }
  .received_withd_msg:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #ebebeb;
    border-left: 0;
    margin-top: -10px;
    margin-left: -10px;
  }
  .received_withd_msg p {
    padding: 12px 12px 12px 20px;
  } 
  .edit_question {
    width: 100%;
  }
  .mini-button {
    background: none;
    border: none;
    width: 3%;
    padding: 0px 0px 0px 0px;
  }  
  .outgoing_msg_img {
    display: inline-block;
    width: 6%;
    margin-left: 15px;
    margin-right: 10px;
    align-self: center;
  }
  .outgoing_msg {
    display: inline-block;
    width: 54%;
  }
  .outgoing_withd_msg {
    background: #ebebeb;
    border-radius: .4em;
    width: 100%;
    position: relative;
  }
  .outgoing_withd_msg:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-left-color: #ebebeb;
    border-right: 0;
    margin-top: -10px;
    margin-right: -10px;
  }
  .outgoing_withd_msg p {
    padding: 12px 12px 12px 20px;
  }
  .anti-container {
    padding-left: 0px;
    padding-right: 0px;
  }
  .multiple {
    width: 100%;
    display: flex;
    -moz-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -moz-align-items: center;
    align-items: center;
  }
  .dot {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: inline-block;
  }
  .grey-label-text {
    color: grey;
  }
</style>