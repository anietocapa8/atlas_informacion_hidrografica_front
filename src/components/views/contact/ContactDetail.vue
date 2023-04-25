<template>
  <div class="contact-container">
    <sipsder-title :title="$t('contact.detailTitle').toUpperCase()"
                          section="Contáctenos">
        <b-row slot="content" v-if="info">
          <b-col>
              <h3> <b>{{$t('contact.detailTitleContent')}}</b> </h3>
              {{info.content}}
          </b-col>
        </b-row>
    </sipsder-title>  
    <div class="content-center">              
      <div class="content-form">
        <div style="padding: 0 20px">
            <b-row>

              <b-col cols="3">
                <h4><strong>{{$t('contact.code')}}</strong></h4>
                <h4 v-if="info != null" >{{info.code}}</h4>
                <br>
                <h4><strong>{{$t('contact.date')}}</strong></h4>
                <h4 v-if="info != null">{{info.startDate}}</h4>
              </b-col>
              <b-col cols="9">
                <div class="checkbox-container">
                  <div class="group" v-for="v in requestTypesDetail" :key="v.id">
                    <input type="checkbox" :id="v.id" :value="v.id" disabled checked>
                    <label for="consulta">{{v.type}}</label>
                  </div>
                </div>
              </b-col>

            </b-row>
            <br>
            <b-row>

              <b-col cols="12" >
                <div class="modal-info">
                  <h4><strong>{{$t('contact.userType')}}</strong></h4>
                  <h4 v-if="info != null">{{info.typeName}}</h4>
                </div>
                <div class="modal-info">
                  <h4><strong>{{$t('contact.country')}}</strong></h4>
                  <h4 v-if="info != null">{{info.country}}</h4>
                </div>
                <div class="modal-info">
                  <h4><strong>{{$t('contact.city')}}</strong></h4>
                  <h4 v-if="info != null">{{info.geo}}</h4>
                </div>
                <div class="modal-info">
                  <h4><strong>{{$t('contact.localidad')}}</strong></h4>
                  <h4 v-if="info != null">{{info.geo}}</h4>
                </div>
              </b-col>
              
            </b-row>
            <br>
            <b-row>

              <b-col cols="3">
                <h4><strong>{{$t('contact.email')}}</strong></h4>
                <h4 v-if="info != null">{{info.userEmail}}</h4>
              </b-col>
              <b-col cols="9">
                <h4><strong>{{$t('contact.userName')}}</strong></h4>
                <h4 v-if="info != null">{{info.userFirstName + " " + info.userLastName}}</h4>
              </b-col>

            </b-row>
            <br>
            <b-row>

              <b-col cols="12">
                <div v-if="info=== null || info.replyDate === null" class="modal-info">
                  <h4><strong>{{$t('contact.state')}}</strong></h4>
                  <b-form-select v-model="state_selected_answer" :options="options_state_answer" />
                </div>
                <div v-if="info && info.replyDate" class="modal-info">
                  <h4><strong>{{$t('contact.state')}}</strong></h4>
                  <b-form-select v-model="state_selected_answer" :options="options_state_answer" disabled/>
                </div>
                <div class="modal-info">
                  <h4><strong>{{$t('contact.responseMedium')}}</strong></h4>
                  <h4 v-if="info != null">{{info.channel}}</h4>
                </div>
                <div v-if="info && info.replyDate" class="modal-info">
                  <h4><strong>{{$t('contact.responseDate')}}</strong></h4>
                  <h4 v-if="info != null">{{info.replyDate}}</h4>
                </div>
                <div v-if="info && info.adminFirstName" class="modal-info">
                  <h4><strong>{{$t('contact.responseUser')}}</strong></h4>
                  <h4 v-if="info != null">{{info.adminFirstName + " " + info.adminLastName}}</h4>
                </div>
              </b-col>

            </b-row>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-end">
                  <sipsder-btn :text="$t('contact.saveChanges')"
                        btnType="accept"
                        @onClick="changeStatus"></sipsder-btn>
                  <sipsder-btn 
                        btnType="cancel"
                        @onClick="resetChanges"></sipsder-btn>
              </b-col>
            </b-row>

          </div>
          <div>
            
          </div>

      </div>
      
    </div>
    <br>
    <div class="content-center">    
      <div class="attachment">
        <div class="table">
          <b-table striped hover :items="mini_attachment" :fields="fields" v-if="mini_attachment && mini_attachment.length > 0">
            <template slot="nombre" slot-scope="row" style="width: 60%">
              {{row.value}}
            </template>
            <template slot="actions" slot-scope="row">
              <sipsder-btn btnType="search" :text="$t('contact.detail')" @onClick="detail(row.item)" title="Detalles">
              </sipsder-btn>
            </template>
          </b-table>
          <b-row v-else>
            <b-col class="d-flex justify-content-center">
              <h1>{{$t('contact.emptyTable')}}</h1>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <div>
      <b-row v-if="current_attachment">
        <b-col>
          <document-view :key="current_attachment" :id="current_attachment"></document-view>
        </b-col>
      </b-row>
    </div>
    <hr>
    <b-row>
      <b-col class="d-flex justify-content-center">
        <sipsder-btn  btnType="back"
                    @onClick="sureBack"></sipsder-btn>
      </b-col>
    </b-row>
      
    <b-modal ref="info" :title="$t('contact.information')" size="lg" centered hideFooter>
      
    </b-modal>
    <b-modal ref="save_success" :title="$t('contact.correct')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b><label > {{$t('contact.changedCorrectly')}} </label></b>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeSuccessModal" btnType="accept" :title="$t('contact.getIt')">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
      <b-modal ref="ask_discard" :title="$t('contact.systemAlert')" centered hideFooter>
        <div>
          <b-row>

            <b-col cols="12">
              <b><label > {{$t('contact.alertMsg')}} </label></b>
            </b-col>

          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="cancelBack" btnType="cancel" :title="$t('contact.getIt')">
              </sipsder-btn>
              <sipsder-btn @onClick="sureBack" btnType="accept" :title="$t('contact.getIt')">
              </sipsder-btn>
            </b-col>
          </b-row>
        </div>
      </b-modal>
  </div>
</template>

<script>
import VAPI from '../../../http_common'
//import VueRecaptcha from 'vue-recaptcha'
import RichText from '../../shared/RichText.vue'
import FilterTable from '../../shared/FilterTable.vue'
import {SERVICE_NAMES, HTTP_STATUS} from "../../../sipsder_constants";
import DocumentView from '../../shared/DocumentView.vue';

export default {
  data(){
    return {
      info: null,
      requestTypes: null,
      requestTypesDetail: null,
      responseChannel: [],
      attachments: [],
      mini_attachment: [],
      current_attachment: null,
      current_image: null,
      fields: [ 
          {
            key: 'nombre',
            label: 'Nombre',
            thStyle: 'width: 80%'
          },
          {
            key: 'actions',
            label: 'Detalles'
          }
       ],
      info: null,
      options_state_answer: [
          {
            value: null,
            text: 'Sin responder'
          },
          {
            value: 1,
            text: 'Respondido'
          }
      ],
      state_selected_answer: null
    }
  },
  computed: {
    isMenuFixed(){
      return this.$store.getters.isMenuFixed
    },
    isResponsive(){
      return this.$store.getters.isResponsive
    },
    isMobile(){
      return this.$store.getters.isMobile
    },
    isLogged(){
      return this.$store.getters.isAuthenticated
    },
    isAdmin(){
      let isAdmin = false;
      if (this.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) {
        isAdmin = true     
      }
      return isAdmin;
    },
    isntAdmin(){
      return !this.isAdmin;
    },
    currentUser(){
      return this.$store.getters.getCurrentUser
    },
    dataContact(){
      return this.dataContactdata
    },
    termsAndCondition(){
      return this.termsAndConditionContact
    }
    
  },
  methods: {
    detail(item){
      // console.info("Attachment seleccionado", item, this.attachments[item.id]);
      this.current_attachment = this.attachments[item.id].id;
    },
    changeStatus(){
      
      if( this.info.replyDate === null && this.state_selected_answer !== null ){

        VAPI.put(`${SERVICE_NAMES.REQUEST}/change-status/${this.$route.params.id}`)
        .then(response => {
            
            this.info.replyDate = response.data.replyDate;
            localStorage.setItem('contact', JSON.stringify(this.info));
            this.$refs.save_success.show()

        })

      }
       

    },
    closeSuccessModal(){
      
      this.$refs.save_success.hide()
    },
    resetChanges(){
      if( this.info.replyDate === null && this.state_selected_answer !== null ){
        this.$refs.ask_discard.show()
      }else{
        window.history.back();
      }
    },
    sureBack(){
      window.history.back();
    },
    cancelBack(){
      this.$refs.ask_discard.hide()
    }
  },
  components: {
    //'vue-recaptcha': VueRecaptcha,
    "document-view": DocumentView,
    RichText,
    FilterTable
  },
  async mounted(){
    
    window.scrollTo(0, 0);

    try {
        let response = await VAPI.get(`${SERVICE_NAMES.REQUEST}/${this.$route.params.id}`);

        if (response.status == HTTP_STATUS.OK) {
          this.info = response.data.request;
          if(this.info.replyDate !== null) {
            this.state_selected_answer = 1
          }
          this.requestTypesDetail = response.data.types;

          this.attachments = response.data.attachments;
          var index = 0;
          for (var attach in this.attachments) {
            var temp = {
                "id": index,
                "nombre": this.attachments[attach].title,
            }
            index += 1;
            this.mini_attachment.push( temp );
          }

        } else {
          console.info("Contacto no encontrado", response);
        }
        
    } catch(ex) {
      console.info("Problemas al cargar el contacto", ex);
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.content-center
  width: 100%
  +flexbox
  +justify-content(center)
.modal-info
  display: inline-block
  min-width: 23%
  margin: 0px 1% 
.btn-container
  margin: 25px
  +flexbox
  +justify-content(center)
  +align-items(center)
  flex-direction: column
  padding: 1%
  .btn
    margin: 1% 0
    font-size: 1.5rem
.table
  font-size: 1.5rem
  text-align: center
.right
  margin: 10px 0
  align-self: flex-end !important
  input[type="checkbox"]
    margin-right: 10px
.border
  border: 1px solid black
  padding: 1%
  height: 250px
  overflow-y: auto
  justify-content: flex-start !important
.select-group
  width: 100%
  +flexbox
  +justify-content(flex-start)
  +align-items(center)
.col-50
  width: 45% !important
  margin-right: 5%
.red
  color: $colorDanger
.contact-container
  width: 100%
  +flexbox
  +justify-content(flex-start)
  +flex-direction(column)
  padding: 1% 5%
.title
  text-align: center
  font-size: 2.5rem
  font-weight: 600
  font-family: $fontBody
  text-transform: uppercase
.content-form
  margin-top: 15px
  padding: 1%
  width: 100%
  border: 1px solid black
  max-width: 60%
  +flexbox
  +justify-content(flex-start)
  +flex-direction(column) 
.request-type-form
  margin-top: 15px
  width: 100%
  +flexbox
  +justify-content(center)
  +align-items(flex-start)
  +flex-direction(column)
  textarea
    margin-top: 5px
    width: 100%
    border-radius: unset
    padding: 1.5%
.checkbox-container
  width: 100%
  padding: 1.5%
  +flexbox
  +justify-content(flex-start)
  +align-items(center)
  +flex-wrap(wrap)
  .group
    margin-top: 5px
    width: 25%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    flex-wrap: nowrap
    input[type="checkbox"]
      width: 1.2rem
      height: 1.2rem
      margin-right: 10px
    label
      padding: unset
      margin: unset
.attachment
  width: 60%
  text-align: center
  +flexbox
  +justify-content(center)
  +align-items(center)
  +flex-wrap(wrap)
.table
  a
    display: block

@media screen and (max-width: $widthTablet)
  h4, .h4
    font-size: 1rem !important
  .modal-info
    display: block !important
  .col-3, col-9
    flex: unset !important
    max-width: unset !important
</style>
