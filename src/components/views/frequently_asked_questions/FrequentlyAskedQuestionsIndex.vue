<template>
  <div id="contenedor">
    <b-container class='container-form div-90'>
      <b-row>
        <b-col>
            <sipsder-title :title="$t('faqs.title')" section="registry"></sipsder-title>
        </b-col>
      </b-row>
      <b-row>
        <sipsder-btn v-if="isAdministrator" btnType="export_data" @onClick="getStatistics" :text="$t( 'faqs.export_statistics' )">
        </sipsder-btn>
      </b-row>
      <!-- Begin of the top search bar -->
      <b-col class="w-100 search-bar">
        <b-row>
          <b-col md="6"><h1 class="title">{{ $t('faqs.filter_title') }}</h1></b-col>
          <b-col md="3">
            <vue-select :options="status" 
                  name="status-query" 
                  :placeholder="$t( 'faqs.status' )" 
                  v-model="filteredStatus"
                  v-if="isAdministrator"
                  class="mb-3 bg-white">
            </vue-select>
          </b-col>
          <b-col md="3">
            <b-form-input v-model="filterParams.token"
                  name="filterToken"
                  :placeholder="$t('faqs.find_placeholder')"
                  size="lg"
                  class="mb-3">
            </b-form-input>
          </b-col>
        </b-row>
        <b-row align-v="center">
          <b-col>
            <treeselect v-model="selectedQueryModel" 
                  :multiple="false" 
                  :options="ruralModels"
                  :placeholder="$t( 'faqs.modal.rural_select' )"
                  :clearable="true"
                  :searchable="true"
                  :openDirection="'below'"
                  :default-expand-level="1">
              <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                <img v-if="node.raw && node.raw.url != null" 
                    :src="getImgURL(node.raw.url)" height="16" width="16">
                <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                <span> {{ node.label.split('/')[0] }} </span>
                <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
              </label>
            </treeselect>
          </b-col>

          <b-col md="3">
            <sipsder-btn btnType="search" 
                    :text="$t( 'faqs.search' )"
                    @onClick="refreshQuestions">
            </sipsder-btn>
            <sipsder-btn btnType="clean" 
                    :text="$t( 'faqs.reset' )"
                    @onClick="resetFilter">
            </sipsder-btn>          
          </b-col>          
        </b-row>
      </b-col>      
      <!-- End of the top search bar -->
      <b-row class="results-management">
        <b-col align-self="center">
          <b-row align-h="start">
            <div v-if="meta !== null"> {{ $t( 'faqs.found_x' ) }} {{ meta.totalElements }} {{ $t( 'faqs.results' ) }} </div>
            <div v-else> {{ $t( 'faqs.found_x' ) }} 0 {{ $t( 'faqs.results' ) }} </div>
          </b-row>           
        </b-col>
        <b-col align-self="center">
          <b-row align-h="center" align-v="center">
            <b-pagination size="lg" align="center" 
                  v-if="meta !== null"
                  v-model="currentPage"
                  :total-rows="meta.totalElements"
                  :per-page="filterParams.size">
            </b-pagination>
          </b-row>
        </b-col>
        <b-col align-self="center">
          <b-row align-h="end">
            <sipsder-btn btnType="add" 
                      :text="$t('faqs.add')"                       
                      v-if="isAdministrator"
                      @onClick="addQuestion">
            </sipsder-btn>
          </b-row>            
        </b-col>          
      </b-row>
      <!-- List of questions -->
      <b-row>
        <div role="tablist" class="collapsable-accordion">
          <b-card v-for="(question, index) in questions" :key="question.id" 
            :style="[ borderedQuestionClass, { border: '2px solid ' + getBorderColor( question ) } ]" 
            :class="{ 'disabled': !question.status }">
            <div class="edit_question" align="right">
              <button v-if="isAdministrator" class="mini-button" @click.prevent="editQuestion( question )">
                <img src="../../../assets/icons-button-svg/editar_fondo.svg" alt="">
              </button>
              <button v-else class="mini-button"></button>
            </div>
            <b-card-header header-tag="header" role="tab">
              <div block v-b-toggle="'accordion-' + question.id" class="accordion-clickable" role="button" @click="changeExpandedStatus( index, $event )" >
                <div class="incoming_msg row">
                  <div class="incoming_msg_img">
                    <img src="../../../assets/profile.png" alt="Usuario">
                  </div>
                  <div class="received_msg">
                    <div class="received_withd_msg">
                      <p>{{ question.question }}</p>
                    </div>
                  </div>
                  <div class="incoming_msg_chevron" align="center">
                    <i v-if="question.expanded == false" class="fas fa-chevron-down"></i>
                    <i v-if="question.expanded == true" class="fas fa-chevron-up"></i>
                  </div>                  
                </div>
              </div>
            </b-card-header>
            <b-collapse :id="'accordion-' + question.id" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <div class="incoming_msg">
                  <b-row align-h="end">
                    <div class="outgoing_msg">
                      <div class="outgoing_withd_msg">
                        <rich-text-preview :content="question.answer"/>
                      </div>
                    </div>
                    <div class="outgoing_msg_img">
                      <img src="../../../assets/sipsder_logo.png" alt="SDP">
                    </div>
                  </b-row>
                </div>
                <br>
                <p>{{ $t( 'faqs.entities' ) }} <i>{{ question.institutions.length == 0 ? $t( 'faqs.nothing' ) : getEntityNames( question.institutions ) }}</i></p>
              </b-card-body>
              <b-card-footer>
                <b-row align-v="center" class="options-padded">
                  <b-col md="6" lg="6" sm="6">
                    <b-row>
                      <p>{{ $t( 'faqs.profit.question' ) }}</p> 
                      <b-form-radio-group class="options-padded"
                          :id="'utilYesNo-' + question.id" 
                          v-model="question.useful"
                          :options="yesNo"  
                          @change="scoreUseful( question.id, $event )"
                          :disabled="!isUserLogged || question.useful != null">
                      </b-form-radio-group>
                      <b-tooltip v-if="!isUserLogged" :target="'utilYesNo-' + question.id" :title="$t( 'faqs.login_tooltip' )"></b-tooltip>
                    </b-row>
                  </b-col>
                  <b-col md="3" lg="3" sm="6">
                    <s-share-question :detailed-url="getQuestionURL( question.url )"></s-share-question>
                  </b-col>
                  <b-col md="1" lg="1" sm="6">
                    <report-component :contentId="question.id" 
                                      :content-type="REPORT_CONTENT_TYPES.FAQS"></report-component>
                  </b-col>
                  <b-col lg="2" sm="6">
                    <score-component :idContent="question.id" 
                                    :idType="SCORE_CONTENT_TYPE.FAQS"
                                    :likes="question.likes"
                                    :dislikes="question.dislikes"></score-component>
                  </b-col>
                </b-row>
              </b-card-footer>
            </b-collapse>
          </b-card>            
        </div>
      </b-row>
      <!-- End of list of questions -->
      <b-col><br>
        <b-row align-h="center" align-v="center">
          <b-pagination size="lg" align="center" 
                v-if="meta !== null"
                v-model="currentPage"
                :total-rows="meta.totalElements"
                :per-page="filterParams.size">
          </b-pagination>
        </b-row>
        <b-row align-h="center" align-v="center">
          <sipsder-btn btnType="back" :text="$t('faqs.back')" @onClick="previousPage( )"></sipsder-btn>
        </b-row>
      </b-col>
      
    </b-container>
    <!-- Begin of Success Modal-->
    <b-modal ref="registeredVoteModal" :title="$t( 'faqs.modal.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3">
          {{ $t( 'faqs.modal.vote_success') }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="closeModal( 'registeredVoteModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Success Modal-->
    <!-- Begin of Success Modal-->
    <b-modal ref="failedVoteModal" :title="$t( 'faqs.modal.title' )" hideFooter>      
      <b-row align-v="center" align-h="center">
        <div class="w-75 pt-3 pb-3">
          {{ $t( 'faqs.modal.vote_fail') }}
        </div>    
          <sipsder-btn btnType="accept" 
              :text="$t( 'faqs.modal.ok' )" 
              @onClick="closeModal( 'failedVoteModal' )">
          </sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of Success Modal-->
  </div>
</template>

<script>
  import vSelect from "vue-select";
  import RichText from '../../shared/RichText.vue';
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
  import VAPI from '../../../http_common';
  import VeeValidate from 'vee-validate';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import RichTextPreview from "../../shared/RichTextPreview";
  import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
  import ReportComponent from '../../shared/ReportComponent.vue';
  import ScoreComponent from '../../shared/ScoreComponent.vue';
  import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
  import { PERMISSIONS_TYPES } from "../../../domain_constants";
  import S_UTIL from "../../../util/sipsder_util";

  export default {
    components: {
      'vue-select': vSelect,
      's-share-question': SocialNetworksShare,
      RichText,
      RichTextPreview,
      VueBootstrapTypeahead,
      Treeselect,
      ReportComponent,
      ScoreComponent
    },
    async created( ) {
      const response = await VAPI.get( '/rural-model/tree' );
      if( response.data.data != null ) {
        this.ruralModels = response.data.data;
      }
      else
        console.log( "Error fetching rural model tree ", error );
      this.refreshQuestions( );
    }, 
    data( ) {
      return {
        SCORE_CONTENT_TYPE,
        REPORT_CONTENT_TYPES,
        asterisk: "<span style='color: red'>&nbsp;*</span>",
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
        filterParams: {
          page: 0,                  // Page number
          size: 10,                 // Page size
          structure: '',            // MODELO_RURAL ids, like 1, 2, 3 or 4
          status: '',               // Show all enabled questions: true, otherwise: false
          token: '',                // Search string
          sort: 'creationDate,desc' // Ordered by FAQ's creation date DESC
        },
        currentFAQ: {
          id: null,
          question: "",
          answer: "",
          tags: "",
          status: null,
          ruralModelId: null,
          institutionIds: []
        },
        borderedQuestionClass: {
          marginTop: '10px',
          marginBottom: '10px',
          borderRadius: '0px'
        },
        excelFields: {
          'Pregunta': 'question',
          'Respuesta': 'answer',
          'Le fue útil': 'useful',
          'No le fue útil': 'useless',
          'Calificación positiva': 'like',
          'Calificación negativa': 'dislike',
          'Fecha': 'date'
        },
        excelStatistics: [ ],
      };    
    },
    methods: {
      showModal( ref ){
        this.$refs[ ref ].show( );
      },
      closeModal( ref ){
        this.$refs[ ref ].hide( );
      },
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      hideAddQuestionModal( ) {
        this.resetModal( );
        this.$refs.addQuestionModal.hide( );
      },
      previousPage( ) {
        this.$router.go( -1 );
      },
      setAnswer( value ) {
        this.currentFAQ.answer = value;
      },
      resetModal( ) {
        this.currentFAQ.id = null;
        this.currentFAQ.question = "";
        this.currentFAQ.answer = "";
        this.currentFAQ.tags = "";
        this.currentFAQ.status = null;
        this.currentFAQ.ruralModelId = null;
        this.currentFAQ.institutionIds = [];
        this.entities = [];
        this.entitySearch = '';
        this.selectedEntity = null;
        this.entitiesAdded = [];
        this.entitiesAddedIds = new Set( );
        this.selectedRuralModel = null;        
        this.selectedStatus = null;
        this.$refs.entitySearch.inputValue = '';
        this.$validator.reset( );
      },
      buildQuery( ) {
        let query = '?page=' + this.filterParams.page  + '&size=' + this.filterParams.size;
        if( this.filterParams.structure !== '' ) query += '&structure=' + this.filterParams.structure;
        if( this.filterParams.status !== '' ) {
          query += '&status=' + this.filterParams.status;
        }
        else {
          if( !this.isAdministrator )
            query += '&status=true';
        }
        if( this.filterParams.token !== '' ) query += '&token=' + this.filterParams.token;
        query += '&sort=' + this.filterParams.sort;
        //console.log( "Query params sent to backend: ", query );
        return query;
      },
      resetFilter( ) {
        this.selectedQueryModel = null;
        this.filteredStatus = null;
        this.filterParams.page = 0;
        this.filterParams.size = 10;
        this.filterParams.structure = '';
        this.filterParams.status = '';
        this.filterParams.token = '';
        this.filterParams.sort = 'creationDate,desc';
        this.refreshQuestions( );
      },
      async refreshQuestions( ) {
        const response = await VAPI.get( '/faq' + this.buildQuery( ) );
        if( response.data != null && response.data.data != null ) {
          response.data.data.forEach( question => {
            question.expanded = false;
          });
          this.questions = response.data.data;
          this.meta = response.data.meta;
        }
        else {
          this.questions = [];
          this.meta = null;
        }
        window.scrollTo( { top: 100, left: 0, behavior: 'smooth' } );
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
               ( this.currentFAQ.answer.length < 4001 ) &&
               ( this.selectedRuralModel != null ) &&
               ( this.selectedStatus != null );
      },
      async onSubmit( event ) {
        if( this.entitiesAddedIds.size != 0 ) {
          this.currentFAQ.institutionIds = [ ...this.entitiesAddedIds ];
        }
        if( this.isFormValid( ) ) {
          if( this.modalStatus == 'addQuestion' ) {
            await VAPI.post( '/faq', this.currentFAQ ).then(
              ( success ) => {
                alert( this.$t( 'faqs.modal.save_success' ) );
                this.hideAddQuestionModal( );
                this.resetFilter( );
                this.refreshQuestions( );
              },
              ( error ) => {
                console.log( error.data );
                alert( this.$t( 'faqs.modal.save_fail' ));
              }
            ); 
          }
          if( this.modalStatus == 'editQuestion' ) {
            await VAPI.put( '/faq/' + this.currentFAQ.id, this.currentFAQ ).then(
              ( success ) => {
                alert( this.$t( 'faqs.modal.edit_success' ) );
                this.hideAddQuestionModal( );
                this.refreshQuestions( );
              },
              ( error ) => {
                console.log( error.data );
                alert( this.$t( 'faqs.modal.edit_fail' ));
              }
            ); 
          }            
        }  
        else {
          alert( this.$t( 'faqs.modal.form_errors' ) );
        }             
      },
      getBorderColor( question ) {
        if( question.ruralModel.color == null )
          if( question.ruralModel.parent.color != null )
            return question.ruralModel.parent.color;
          else
            return question.ruralModel.parent.parent.color;
        return question.ruralModel.color;
      },
      changeExpandedStatus( id, event ) {
        if( this.currentExpanded != null && this.currentExpanded != id )
          this.questions[ this.currentExpanded ].expanded = false;
        this.questions[ id ].expanded = !this.questions[ id ].expanded;
        this.currentExpanded = id;
      },
      addQuestion( ) {
        this.$router.push( { name: 'FrequentlyAskedQuestionsAdmin' } );
      },
      editQuestion( question ) {
        this.$router.push( { name: 'FrequentlyAskedQuestionsAdmin', params: { id: question.id } } );
      },
      getQuestionURL( url ) {
        let currentHref = window.location.href;
        if( currentHref.substr( -1 ) == '/' )
          return 'detail/' + url;
        else
          return '/detail/' + url;
      },
      exportStatistics( ) {
        alert( 'Aquí estarían mis estadísticas... ¡Si tuviera unas!')
      },
      async scoreUseful( questionId, event ) {
        await VAPI.post( '/faq/useful/' + questionId , { score: event } ).then(
          ( success ) => {
            console.log( 'Voto registrado!' );
          },
          ( error ) => {
            console.log( error );
            this.showModal( 'failedVoteModal' );
          }
        );
      },
      async getStatistics( ) {
        try{
          let response = await VAPI.get(`/faq/statistics`, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Reporte-preguntasfrecuentes.xlsx");
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
      isAdministrator( ) {
        return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
      },
      isUserLogged( ) {
        return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
      },
      modalStatus( ) {
        return this.$store.getters.getAdminFAQModalStatus;
      },
      modalTitle( ) {
        if( this.modalStatus == 'addQuestion' )
          return this.$i18n.t( 'faqs.modal.title' );
        else if( this.modalStatus == 'editQuestion' )
          return this.$i18n.t( 'faqs.modal.edit_title' );
      },
      status() {
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
      },
      excelName( ) {
        let today = new Date( );
        return 'preguntas_frecuentes_al_' + today.getDate( ) 
          + '_' + ( parseInt( today.getMonth( ) ) + 1 )  + '_' + today.getFullYear( );
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
      entitySearch( query ) {
        this.getEntities( query ).then( ( success ) => {
          this.entities = success.data.data;
        })
      },
      currentPage( ) {
        if( this.currentPage != null ) {
          this.filterParams.page = this.currentPage - 1;
          this.refreshQuestions( );
        }
      },
      selectedQueryModel( ) {
        if( this.selectedQueryModel != null || this.selectedQueryModel != undefined )
          this.filterParams.structure = this.selectedQueryModel;
        else
          this.filterParams.structure = '';
        this.refreshQuestions( );
      },
      filteredStatus( ) {
        if( this.filteredStatus != null ) {
          this.filterParams.status = this.filteredStatus.value;
        }
        else {
          this.filterParams.status = '';
        }
        this.refreshQuestions( );
      },
      isUserLogged( ) {
        this.resetFilter( );
        this.refreshQuestions( );
      }
    }
  }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
@media screen  and (max-width: $widthMobile)
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
    .news-detail
        padding: unset !important
@media screen  and (max-width: $widthTablet)
    .div-90
        width: 80% !important
        margin: 0 auto  
</style>
<style scoped>
  p {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .title {
    font-style: italic;
    color: white;
    font-weight: bolder;
  }
  .search-bar {
    background-color: #02747C;
    padding: 15px 15px 5px 15px;
    border-radius: 10px;
  }
  .error-msg {
    color: red;
    font-size: 13px;
    padding: 10px 15px 10px 15px;
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
    min-width: 40px;
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
    padding: 15px;
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
    color: grey
  }
</style>

