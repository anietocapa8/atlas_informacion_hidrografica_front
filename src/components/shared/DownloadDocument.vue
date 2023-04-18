<template>
  <div class="document-upload">
    <b-row>
      <b-col cols="12" class="d-flex justify-content-center flex-column">
        <sipsder-btn @onClick="openModal()" btnType="download" 
          :disabled="disabled"
          :text="$t('download_file.download')" :title="$t('download_file.download')">
        </sipsder-btn>  
      </b-col>
    </b-row>


    <!--Justification modal -->
    <b-modal ref="justificationModal" id="justificationModal" centered :title="$t('download_file.modal_title')" hide-footer>
  
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center flex-column">
            <b><label class="text-center">{{$t('download_file.modal_description')}}</label></b>
            <b><label class="text-center">{{$t('download_file.modal_description_thanks')}}</label></b>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" class="d-flex justify-content-center flex-column">
            <b><label>{{$t('download_file.modal_title')}}</label></b>
            <b-form-select v-model="option_selected" name="justification" v-validate="'required'" :options="options"/>
          </b-col>
          <b-col cols="12" v-if="option_selected === undefined" class="d-flex justify-content-center flex-row" style="margin: 20px 0">
            <label class="control-label file-label" style="min-width: 30%">{{$t('download_file.modal_other')}}</label>
            <input class="form-control col file-input" style="max-width: 70%" maxlength="100" type="text" data-vv-delay="100" name="url" v-validate="'required'" v-model="other">
          </b-col>
        </b-row>
        <b-row v-if="error" style="margin: 20px 0">
          <b-col cols="12" class="d-flex justify-content-center flex-column">
            <b ><label>{{$t('download_file.error')}}</label></b>
          </b-col>
        </b-row>
        

        <b-row>
          <b-col cols="12" class="d-flex justify-content-center" >
            <sipsder-btn @onClick="getDocument()" btnType="accept" :title="$t('download_file.modal_button')"
              :disabled="disabled">
            </sipsder-btn>
          </b-col>
        </b-row>

    </b-modal>
  </div>
</template>

<script>

import VAPI from '../../http_common';
import Router from "../../router/router";
import {SERVICE_NAMES, HTTP_STATUS} from '../../sipsder_constants';

export default {
  
  props: {
    id: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      justification: {
        idDocument: null,
        page: null,
        justification: null
      },
      option_selected: null,
      other: null,
      error: false,
      options: [
        {
          value: null,
          text: 'Seleccione una opción'
        },
        {
          value: 'Consulta general',
          text: 'Consulta general'
        },
        {
          value: 'Investigación académica',
          text: 'Investigación académica'
        },
        {
          value: 'Solicitud institucional',
          text: 'Solicitud institucional'
        },
        {
          value: undefined,
          text: 'Otro'
        }
      ]
    }
  },
  watch: {

    
  },
  computed: {
  
  },
  methods: {
    async getDocument(){

      this.justification["id"] = this.id;
      this.justification["page"] = Router.currentRoute.name;

      if( this.option_selected !== null ){

        if( this.option_selected !== undefined || (this.option_selected === undefined && this.other !== "" && this.other !== undefined) ){
          if(this.option_selected !== undefined){
            this.justification["justification"] = this.option_selected;
          }else{
            this.justification["justification"] = this.other;
          }

          try{
              let response = await VAPI.post(`/${SERVICE_NAMES.DOCUMENTS}/download`, this.justification , {
                  responseType: "blob",
              });
              let fileName = response.headers['content-disposition'].split('=')[1];
              

              let url = window.URL.createObjectURL(new Blob([response.data]));
              let link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", fileName);

              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              this.closeModal();

          }catch(error){
              console.log(error);
          }
        }else{
          this.error = true;
        }

      }else{
        this.error = true;
      }

      
    },
    openModal( ){
      this.$refs.justificationModal.show();
    },
    closeModal(){
      this.$refs.justificationModal.hide();
    }
  }
}
</script>

<style lang="sass" scoped>
  .download-document
    width: 100%
  .container-form
    margin: auto
  .text-center
    width: 100%
    text-align: center;
</style>


