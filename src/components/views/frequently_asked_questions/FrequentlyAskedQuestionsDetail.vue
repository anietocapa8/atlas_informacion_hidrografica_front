<template>
  <div id="contenedor">
    <b-container class='container-form'>
      <b-row>
        <b-col>
            <sipsder-title :title="$t('faqs.title')" section="registry"></sipsder-title>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <div class="w-100">
          <b-card v-if="question != null && question.status == true && validUrl"
            :style="{ border: '2px solid ' + question.ruralModel.color }" 
            :class="{ 'disabled': !question.status }">
            <b-card-header>
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
            </b-card-header>
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
                <b-col cols="6" lg="6" sm="6">
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
                <b-col cols="3" lg="3" sm="6">
                  <s-share-question :detailed-url="getQuestionURL( question.url )"></s-share-question>
                </b-col>
                <b-col cols="1" lg="1" sm="6">
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
          </b-card>  
          <b-card v-if="question == null || question.status == false || !validUrl">
            <b-card-body>
              <b-row align-h="center" align-v="center">
                {{ $t( 'faqs.not_found' ) }}
              </b-row>
            </b-card-body>
          </b-card>          
        </div>
      </b-row>
      <b-row align-h="center" align-v="center">
        <sipsder-btn btnType="back" :text="$t('faqs.back_all')" @onClick="returnToList( )"></sipsder-btn>
      </b-row>
    </b-container>

  </div>    
</template>

<script>
  import VAPI from '../../../http_common';
  import RichTextPreview from "../../shared/RichTextPreview";
  import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
  import ReportComponent from '../../shared/ReportComponent.vue';
  import ScoreComponent from '../../shared/ScoreComponent.vue';
  import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';

  export default {
    components: {
      RichTextPreview,
      's-share-question': SocialNetworksShare,
      ReportComponent,
      ScoreComponent
    },
    data( ) {
      return {
        question: null,
        SCORE_CONTENT_TYPE,
        REPORT_CONTENT_TYPES
      }        
    },
    async beforeMount( ){
      await VAPI.get(`${SERVICE_NAMES.FAQ}/${this.$route.params.id}`).then(
        ( success ) => {
          this.question = success.data;
        },
        ( error ) => {
          console.log( error.data );
        }
      );
    },
    methods: {
      returnToList( ) {
        this.$router.push( { name: 'FrequentlyAskedQuestionsIndex' } );
      },
      getEntityNames( institutions ) {
        let names = [];
        institutions.forEach( institution => { names.push( institution.name ) } );
        return names.join( ", " );
      },
      getQuestionURL( url ) {
        let currentHref = window.location.href;
        if( currentHref.substr( -1 ) == '/' )
          return url;
        else
          return '/' + url;
      },
      async scoreUseful( questionId, event ) {
        await VAPI.post(`${SERVICE_NAMES.FAQ}/${questionId}/useful`, { score: event } ).then(
          ( success ) => {
            //
          },
          ( error ) => {
            console.log( error.data );
            alert( this.$t( 'faqs.modal.save_fail' )); // TODO: Alert refactor
          }
        ); 
      }
    },
    computed: {
      isUserLogged( ) {
        return this.$store.getters.isAuthenticated;
      },
      validUrl(){
        let url = undefined
        if(this.question && this.$route.params.url){
          url = this.question.url.substring(this.question.url.indexOf("/") + 1);
        }
        return url == this.$route.params.url
      },
      yesNo( ) {
        return [
          { text: this.$i18n.t( 'faqs.profit.yes' ), value: true, disabled: !this.isUserLogged },
          { text: this.$i18n.t( 'faqs.profit.no' ), value: false, disabled: !this.isUserLogged }
        ]
      } 
    }
  }
</script>

<style scoped>
  .disabled {
    background-color: #f5d4d4;
  }
  .card-header {
    background-color: transparent;
    border-bottom: none;
    padding-top: 10px;
  }
  .card-body {
    padding-top: 15px;
    padding-left: 15px;
    padding-bottom: 15px;
    padding-right: 15px;
  }
  .card-footer {
    background-color: transparent;
  }
  .options-padded {
    padding-left: 15px;
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
</style>

