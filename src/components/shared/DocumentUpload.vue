<template>
  <div class="document-upload">
    <br>
    <b-row>
      <b-col cols="12" class="d-flex justify-content-center">
        <sipsder-title :title="$t('document_upload.title').toUpperCase()"
                              type="admin"
                              section="configuration"
                              >
        </sipsder-title>
      </b-col>    
    </b-row>
    <b-container class="container-form">
      
      <b-row>
        <b-col cols="6" class="d-flex justify-content-center">
          <b-form-group :label="$t('document_upload.upload_title')" label-class="font-weight-bold">
            <input type="file"
                name="register_template"
                @change="loadImage($event)" 
                ref="uploadDocument"
                style="display: none"
                data-vv-as="icono"/>
              <sipsder-btn btnType="uploadImage" 
                :text="$t( 'document_upload.upload_file' )"
                @onClick="$refs.uploadDocument.click()">                                            
              </sipsder-btn>
              <h4 v-if="file">{{file.name}}</h4>

          </b-form-group>
          
        
        </b-col>
        <b-col cols="6" class="d-flex justify-content-center">
            <h4 class="signature-label">{{$t('document_upload.signature_type')}}</h4>
            <b-form-select v-model="signature_type" name="signature" v-validate="'required'" :options="options" class="file-input" :data-vv-as="$t('document_upload.signature_type')"/>
            <span  v-if="submitted && errors.has('status')" >{{ errors.first('status') }}</span>
        </b-col>
      </b-row>
      <b-row class="container-form">
        <b-col cols="12" v-if="error" class="d-flex justify-content-center">
            <span style="color: red">{{$t('document_upload.description')}}</span>
        </b-col>    
        
        <b-col cols="12" class="d-flex file-form justify-content-center">
          <label class="control-label file-label">{{$t('document_upload.author')}}</label>
          <input class="form-control col file-input" maxlength="100" type="text" data-vv-delay="100" name="author" v-validate="'required'" v-model="author" :data-vv-as="$t('document_upload.author')">
        </b-col>
        <span  v-if="submitted && errors.has('author')" >{{ errors.first('author') }}</span>
        <b-col cols="12" class="d-flex justify-content-center">
          <label class="control-label file-label">{{$t('document_upload.url')}}</label>
          <input class="form-control col file-input"  maxlength="100" type="text" data-vv-delay="100" name="url" v-validate="'required'" v-model="url" :data-vv-as="$t('document_upload.url')">
        </b-col>
        <span  v-if="submitted && errors.has('url')" >{{ errors.first('url') }}</span>
      </b-row>
      <b-row>
      
        <b-col cols="12" class="d-flex justify-content-center">
          
          <sipsder-btn @onClick="save" btnType="accept"  :text="$t('document_upload.save')" :title="$t('document_upload.save')">
          </sipsder-btn>
                          
        </b-col>
      </b-row>
    </b-container>

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


  </div>
</template>



<script>

import VAPI from '../../http_common';
import { SERVICE_NAMES } from '@/sipsder_constants';

export default {
  
 
  data() {
    return {
      file: null,
      signature_type: null,
      author: null,
      url: null,
      error: false,
      filename: null,
      submitted: false,
      options: [
        {
          value: null,
          text: 'Seleccione una opción'
        },
        {
          value: 'public_signature',
          text: 'Público con firma'
        },
        {
          value: 'public_without_signature',
          text: 'Público sin firma'
        },
        {
          value: 'private',
          text: 'Privado'
        }
      ]
    }
  },
  watch: {

    
  },
  computed: {
  
  },
  methods: {
    loadImage(e) {
      if(e.target.files[0].type === "application/pdf" && e.target.files[0].size <= 2000000){
        this.error = false;
        this.file = e.target.files[0];
      } else{
        this.error = true;
      }
      
    },
    async save(){
      this.submitted = true;
      try {
        const response = await VAPI.post(`${SERVICE_NAMES.DOCUMENTS}/upload`, this.assemblePayload( ), { headers: { 'Content-Type': 'multipart/form-data' } } );
        
        if(response.status === 200){
          this.$refs.successModal.show();
        }else{
          this.$refs.errorModal.show();
        }

      }
      catch( error ) {
        console.log( 'Error fetching system configurations ', error );
      }
    },
    assemblePayload( ) {
      let formData = new FormData();
      formData.append( 'author', this.author );
      formData.append( 'url', this.url );
      formData.append( 'type', this.signature_type );
      if( this.file != null ){
        formData.append( 'file',  this.file );               
      }
      return formData;
    },
    acceptChanges( ){
      this.$refs.successModal.hide();
    },
    acceptError( ){
      this.$refs.errorModal.hide();
    }
  }
}
</script>

<style lang="sass" scoped>
  .document-upload
    width: 100%
  .container-form
    margin: auto
  .signature-label
    min-width: 25%
  .file-label
    min-width: 10%
  .file-input
    max-width: 50%
  .control-label:after 
    content: "*";
    color: red;
  .file-form
    margin: 3% 0
</style>


