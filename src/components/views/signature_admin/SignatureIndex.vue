<template>
  <div class="banner-admin container-form">
    <b-row>
      <b-col cols="12">
        <sipsder-title :title="$t('signature.title').toUpperCase()"
                              type="admin"
                              section="configuration"
                              >
        </sipsder-title>
      </b-col>
    </b-row>

     <b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse1 variant="info">{{$t('home.report').toUpperCase()}}</b-button>
        </b-card-header>
        <b-collapse id="collapse1" visible class="mt-2" > 
          <b-card no-body class="config-card">
            <b-card-body style="width: 100%;">
              <b-row>
                <b-col cols="12" class="d-flex justify-content-left space-top-bottom">
                  <label class="control-label label-url col-6">{{$t('home.report')}}</label>
                  <b-form-checkbox :switch="true" size="lg" class="col-6" v-model="systemConfiguration['reportEnabled']" unchecked-value="false" value="true">{{systemConfiguration['reportEnabled'] === "true" ? $t('banner_admin.active') : $t('banner_admin.inactive')}}</b-form-checkbox>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse1 variant="info">{{$t('signature.location_conf_title')}}</b-button>
        </b-card-header>
        <b-collapse id="collapse1" visible class="mt-2" > 
          <b-card class="config-card">
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left space-top-bottom">
                <label class="control-label label-url">{{$t('signature.location_conf_images')}}</label>
                <input class="form-control col" type="text" name="url" data-vv-delay="100" maxlength="180"  v-validate="'required'" v-model="systemConfiguration['sipsder.images-dir']">
              </b-col>
              <b-col cols="12" class="d-flex justify-content-left space-top-bottom">
                <label class="control-label label-url">{{$t('signature.location_conf_documents')}}</label>
                <input class="form-control col" type="text" name="url" data-vv-delay="100" maxlength="180" v-validate="'required'" v-model="systemConfiguration['sipsder.documents-dir']">
              </b-col>
              <b-col cols="12" class="d-flex justify-content-left space-top-bottom">
                <label class="control-label label-url">{{$t('signature.location_conf_templates')}}</label>
                <input class="form-control col" type="text" name="url" data-vv-delay="100" maxlength="180" v-validate="'required'" v-model="systemConfiguration['sipsder.templates-dir']">
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse2 variant="info">{{$t('signature.signature_conf_title')}}</b-button>
        </b-card-header>
        <b-collapse id="collapse2" class="mt-2">
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.signature_conf_description')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.signature_conf_label')}}</label>
                <input class="form-control col" type="text" name="url" data-vv-delay="100" maxlength="180" v-validate="'required'" v-model="systemConfiguration['sipsder.system-signature']">
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <!-- Plantilla de correo verificacion registro nuevo -->
    <b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse3 variant="info">{{$t('signature.email_template_title')}}</b-button>
        </b-card-header>
        <b-collapse id="collapse3" class="mt-2">
          <!-- -->
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.email_template_description')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.email_template_label')}}</label>
                <input type="file"
                  name="register_template"
                  @change="chargeTemplate($event)" 
                  ref="registerTemplate"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.registerTemplate.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['register_template'] !== null" style="margin: 0 100px"> {{templates_file["register_template"]}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['register_template'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadTemplate(TEMPLATES_FILES.WELCOME)"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
          <!-- -->
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.email_template_description_2')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.email_template_label')}}</label>
                <input type="file"
                  name="change_mail"
                  @change="chargeTemplate($event)" 
                  ref="changeMail"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.changeMail.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['change_mail'] !== null" style="margin: 0 100px"> {{templates_file["change_mail"]}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['change_mail'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadTemplate(TEMPLATES_FILES.CHANGE_MAIL)"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
          <!-- -->
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.email_template_description_3')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.email_template_label')}}</label>
                <input type="file"
                  name="recover_account"
                  @change="chargeTemplate($event)" 
                  ref="recoverAccount"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.recoverAccount.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['recover_account'] !== null" style="margin: 0 100px"> {{templates_file["recover_account"]}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['recover_account'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadTemplate(TEMPLATES_FILES.RECOVER_ACCOUNT_MAIL)"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
          <!-- -->
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.email_template_description_4')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.email_template_label')}}</label>
                <input type="file"
                  name="indicator"
                  @change="chargeTemplate($event)" 
                  ref="indicator"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.indicator.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['indicator'] !== null" style="margin: 0 100px"> {{templates_file["indicator"]}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['indicator'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadTemplate(TEMPLATES_FILES.INDICATOR)"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <!-- Plantilla de descarga de reportes del sistema -->
    <b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse4 variant="info">{{$t('signature.download_template_title')}}</b-button>
        </b-card-header>
        <b-collapse id="collapse4" class="mt-2">
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.download_template_description')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.download_template_label')}}</label>
                <input type="file"
                  name="report_template"
                  @change="loadImage($event)" 
                  ref="reportsTemplate"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.reportsTemplate.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['report_template'] !== null" style="margin: 0 100px"> {{templates_file['report_template']}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['report_template'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadCurrentTemplateImage('report')"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <!-- Plantilla de correo de notificación de eventos -->
    <!--<b-row>
      <b-col cols="8" offset="2">
        <b-card-header header-tag="header" class="mt-2" role="tab">
          <b-button block href="#"  v-b-toggle.collapse5 variant="info">{{$t('signature.events_template_title')}}</b-button>
        </b-card-header>
        <b-collapse id="collapse5" class="mt-2">
          <b-card class="config-card">
            <p class="card-text">{{$t('signature.events_template_description')}}</p>
            <b-row>
              <b-col cols="12" class="d-flex justify-content-left">
                <label class="control-label label-url">{{$t('signature.events_template_label')}}</label>
                <input type="file"
                  name="event_template"
                  @change="chargeTemplate($event)" 
                  ref="eventsTemplate"
                  style="display: none"
                  data-vv-as="icono"/>
                <sipsder-btn btnType="uploadImage" 
                  :text="$t( 'signature.change_template' )"
                  @onClick="$refs.eventsTemplate.click()">                                            
                </sipsder-btn>
                <p v-if="templates_file['event_template'] !== null" style="margin: 0 100px"> {{templates_file['event_template']}} <br> <strong>{{$t('signature.please_save')}}</strong> </p>
                <a v-if="templates_file['event_template'] === null" style="margin: 0 100px; color: blue;cursor: pointer;" @click="loadTemplate(TEMPLATES_FILES.EVENT)"> Ver archivo actual </a>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>-->
    <b-row>
      <b-col cols="12" class="d-flex justify-content-center">
        <sipsder-btn title="Regresar"
                btnType="back"
                @onClick="resetChanges">
        </sipsder-btn>
        <sipsder-btn @onClick="changeConfig" btnType="accept"  text="Guardar" title="Guardar">
        </sipsder-btn>
      </b-col>
    </b-row>
    <!--Success modal -->
    <b-modal ref="successModal" id="successModal" centered :title="$t('signature.success_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('signature.success_modal_description')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptChanges" btnType="accept" :title="$t('signature.success_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!--Preview modal -->
    <b-modal ref="previewModal" id="previewModal" size="xl" centered title="" hide-footer>
        <b-row>
          <b-col cols="12">
            <iframe
              :srcdoc="template_code"
              width="100%"
              height="500px"
              frameborder="0"
              v-if="template_code !== undefined"
            ></iframe>
            <div v-if="template_code === undefined" class="d-flex justify-content-center"><h2>No hay archivo actualmente</h2></div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptPreview" btnType="accept" :title="$t('signature.success_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!--Preview Image modal -->
    <b-modal ref="previewImageModal" id="previewImageModal" size="xl" centered title="" hide-footer>
        <b-row>
          <b-col cols="12">
            <div v-if="template_image !== undefined">
                <img :src="template_image" style="max-width: 100%"/>
            </div> 
            <div v-if="template_image === undefined" class="d-flex justify-content-center"><h2>No hay archivo actualmente</h2></div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptPreviewImage" btnType="accept" :title="$t('signature.success_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!--Error modal -->
    <b-modal ref="errorModal" id="errorModal" centered :title="$t('signature.error_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('signature.error_modal_description')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptError" btnType="accept" :title="$t('signature.error_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!-- Warning modal -->
    <b-modal ref="modalWarning" id="modalWarning" centered :title="$t('signature.back_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('signature.back_modal_description')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="closeWarningModal" btnType="cancel" :title="$t('signature.back_modal_back_button')">
            </sipsder-btn>
            <sipsder-btn @onClick="sureResetChanges" btnType="accept" :title="$t('signature.back_modal_yes_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!-- Empty modal -->
    <b-modal ref="modalEmpty" id="modalEmpty" centered :title="$t('signature.empty_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('signature.empty_modal_description')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="closeEmptyModal" btnType="accept" :title="$t('signature.error_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!--Error Format modal Html -->
    <b-modal ref="errorFormatModal" id="errorFormatModal" centered :title="$t('signature.error_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('document_upload.format_error')}}</label></b>
            <b><label >{{$t('document_upload.format_error_extension_html')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptErrorFormat" btnType="accept" :title="$t('signature.error_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    <!--Error Format modal PNG -->
    <b-modal ref="errorFormatPNGModal" id="errorFormatPNGModal" centered :title="$t('signature.error_modal_title')" hide-footer>
        <b-row>
          <b-col cols="12">
            <b><label >{{$t('document_upload.format_error')}}</label></b>
            <b><label >{{$t('document_upload.format_error_extension_png')}}</label></b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="acceptErrorFormat" btnType="accept" :title="$t('signature.error_modal_accept_button')">
            </sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
  </div>
</template>
<script>

  import VAPI from '../../../http_common';
  import { SERVICE_NAMES, HTTP_STATUS, TEMPLATES_FILES } from '../../../sipsder_constants';

  export default {
    data(){
      return {
        system: null,
        systemConfiguration: {
        },
        systemConfigurationHis: {
        },
        templates_file: {
          "register_template" : null,
          "report_template"  : null,
          "event_template"   : null,
          'indicator': null,
          'recover_account': null,
          'change_mail': null
        },
        changed_templates: {},
        template_code: null,
        template_image: null,
        TEMPLATES_FILES,
      }
    },
    async beforeMount(){
      const system = await this.fetchSystemConfiguration();
      let paths = ["sipsder.system-signature","sipsder.images-dir","sipsder.documents-dir","sipsder.templates-dir", "reportEnabled"];
      for (const index in system.data) {
        const prop = system.data[index] 
        if(paths.includes(prop.key) ){
          this.systemConfiguration[prop.key] = prop.content;
        }
      }
      this.systemConfiguration = Object.assign({}, this.systemConfiguration);
      this.systemConfigurationHis = Object.assign({}, this.systemConfiguration);
    },
    watch: {
    },
    methods: {
      resetChanges(){
        this.$refs.modalWarning.show()
      },
      closeWarningModal(){
        this.$refs.modalWarning.hide()
      },
      closeEmptyModal(){
        this.$refs.modalEmpty.hide()
      },
      sureResetChanges(){
        window.history.back();
      },
      acceptChanges(){
        this.$refs.successModal.hide()
      },
      acceptError(){
        this.$refs.errorModal.hide()
      },
      acceptPreview(){
        this.$refs.previewModal.hide()
      },
      acceptErrorFormat(){
        this.$refs.errorFormatModal.hide()
      },
      acceptPreviewImage(){
        this.$refs.previewImageModal.hide()
      },
      async changeConfig(){
        let changed_paths = [];
        let paths = ["sipsder.system-signature","sipsder.images-dir","sipsder.documents-dir","sipsder.templates-dir", "reportEnabled"];
        for (const index in this.systemConfiguration) {
          if( this.systemConfiguration[index] !== this.systemConfigurationHis[index] ){

            if(this.systemConfiguration[index] == null || this.systemConfiguration[index] == undefined || this.systemConfiguration[index] == "" ){
              changed_paths = []
              this.$refs.modalEmpty.show()
              break;
            }else{
              if(paths.includes(index) ){
                changed_paths.push(
                  {
                    key: index,
                    content: this.systemConfiguration[index]
                  } 
                )
              }
            }
          }
        }
        let save_templates = true;
        if(changed_paths.length > 0 ){
          try {
            const response = await VAPI.put( `${SERVICE_NAMES.SYSTEM_CONFIG}`, changed_paths );
            
            if(response.status === HTTP_STATUS.OK){
              this.$refs.successModal.show()
            }else{
              save_templates = false;
              this.$refs.errorModal.show()
            }
          }
          catch( error ) {
            console.log( 'Error fetching system configurations ', error );
          }
        }
        if(Object.keys(this.changed_templates).length > 0 && save_templates){
          let correcto = true;
          for (const index in this.changed_templates) {
            let template = this.changed_templates[index]
            try {
              const response = await VAPI.post( `${SERVICE_NAMES.SYSTEM_CONFIG}/templates`, this.assemblePayload( index, template ), { headers: { 'Content-Type': 'multipart/form-data' } } );
              if(response.status !== HTTP_STATUS.OK){
                this.$refs.errorModal.show();
                correcto = false;
                break;
              }
            }
            catch( error ) {
              this.$refs.errorModal.show();
              correcto = false;
              break;
              console.log( 'Error fetching system configurations ', error );
            }
          }
          if(correcto){
            this.$refs.successModal.show()
            const system = await this.fetchSystemConfiguration( );
            let paths = ["sipsder.system-signature","sipsder.images-dir","sipsder.documents-dir","sipsder.templates-dir", "reportEnabled"]
            for (const index in system.data) {
              const prop = system.data[index] 
              if(paths.includes(prop.key) ){
                this.systemConfiguration[prop.key] = prop.content;
              }
            }
            for (const index in this.templates_file) {
              this.templates_file[index] = null
            }
            this.templates_file = Object.assign({}, this.templates_file);
            this.systemConfiguration = Object.assign({}, this.systemConfiguration);
            this.systemConfigurationHis = Object.assign({}, this.systemConfiguration);
          }
        }
      },
      async fetchSystemConfiguration( ) {
        try {
          const response = await VAPI.get( `${SERVICE_NAMES.SYSTEM_CONFIG}` );
          return response.data;
        }
        catch( error ) {
          console.log( 'Error fetching system configurations ', error );
        }
      },
      assemblePayload( key, file ) {
        let formData = new FormData();
        formData.append( 'key', key );
        if( file != null ){
          formData.append( 'file',  file );               
        }
        return formData;
      },
      chargeTemplate(e) {
        if(e.target.files[0].type === "text/html"){
          this.changed_templates[e.target.name] = e.target.files[0];
          this.templates_file[e.target.name] = e.target.files[0].name;
          this.templates_file = Object.assign({}, this.templates_file);
        } else{
          this.$refs.errorFormatModal.show()
        }
      },
      loadImage(e) {
        if(e.target.files[0].type === "image/png"){
          this.changed_templates[e.target.name] = e.target.files[0];
          this.templates_file[e.target.name] = e.target.files[0].name;
          this.templates_file = Object.assign({}, this.templates_file);
        } else{
          this.$refs.errorFormatPNGModal.show()
        }
      },
      async loadTemplate(key) {
        this.template_code = null;
         try {
            const response = await VAPI.get( `${SERVICE_NAMES.TEMPLATE}/${key}` );
            this.template_code = response.data.data
            this.$refs.previewModal.show()
          }
          catch( error ) {
            console.log( 'Error fetching system configurations ', error );
          }
      },
      async loadCurrentTemplateImage(key) {
        this.template_image = null;
         try {
            const response = await VAPI.get( `${SERVICE_NAMES.TEMPLATE_IMAGE}/${key}` );
            this.template_image = "data:image/png;base64," + response.data.data
            this.$refs.previewImageModal.show()
          }
          catch( error ) {
            console.log( 'Error fetching system configurations ', error );
          }
      }
    },
    computed: {
      test(){
        
      }
    },
    components: {
    }
  } 

</script>


<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.banner-admin
  width: 100%
  padding: 0 5%
  +flexbox
  +flex-direction(column)
  .space-top-bottom
    margin: 20px
  .label-url
    min-width: 30%
    max-width: 30%
  .config-card
    +flexbox
    +flex-direction(column)
    align-items: flex-start
  .card-body
    +flex-direction(column)
    align-items: flex-start
  input
    margin: 0 1rem
    max-width: 60%
    
  .control-label:after 
    content: "*";
    color: red;
  span
    color: red;
  .error 
    color: red;
    
</style>


