<template>
  <div class="audiovisual-index">
    
    <b-container class="container-form">
        <s-note-rich-text
          :showEdition="isAdminHome" :module="modules.AUDIO_VISUAL"
          keyVal="legal" :textPenEdition="$t('note.editLegal')"
        ></s-note-rich-text>
        
        <hr>

        <b-row>
            <b-col cols="11">
                <b-form-group
                    :label="$t('audiovisual_media.index.type') + TEMPLATES.MANDATORY_SYMBOL"
                    label-class="font-weight-bold">
  
                    <b-form-input v-if="selectionMode"
                      :value="selectedMedia(selectedOption)"
                      disabled
                    ></b-form-input>
                    <b-form-select
                        :options="mediaOptions"
                        v-model="selectedOption"
                        v-else
                    ></b-form-select>
                    
                </b-form-group>
            </b-col>
            <b-col cols="1" class="d-flex align-items-center justify-content-start">
                  <i class="fas fa-question-circle question-icon" v-b-tooltip.hover :title="$t('audiovisual_media.modify.imageSpecification')" placement="bottomleft"></i>
            </b-col>
        </b-row>
        
        <b-row v-if="isImage">
            <b-col>
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            :label="$t('audiovisual_media.index.new') + TEMPLATES.MANDATORY_SYMBOL"
                            label-class="font-weight-bold"
                            :invalid-feedback="errors.first('file')"
                        >
                            <input  type="file" @change="getImage"
                                :disabled="selected !== null"
                                :v-model="fileAux"
                                :state="validateState('file')"
                                v-validate="{size:1024, mimes:['image/*']}" 
                                name="file" data-vv-as="Imagen"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12">
                        <span class="error" v-if="errors.first('file')">{{$t('audiovisual_media.index.image_error')}}</span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col>
                <b-form-group
                    :label="$t('audiovisual_media.index.url') + TEMPLATES.MANDATORY_SYMBOL"
                    label-class="font-weight-bold"
                    :invalid-feedback="errors.first('url')"
                >
                    <b-form-input 
                        type="text" v-model="url"
                        :disabled="selected !== null"
                        :state="validateState(`url`)"
                        v-validate="{required:true, min:3, max:500}" name="url" data-vv-as="URL"
                    ></b-form-input>    
                </b-form-group>
                
            </b-col>
        </b-row>
        <b-row v-if="isVideo && isYouTube">
            <b-col>
                <iframe :src="getImgURL(showURL)" 
                    style="width: 100%; height: 350px; margin: 10px 0px"></iframe>
            </b-col>
        </b-row>
        <b-row v-if="isVideo && !isYouTube">
            <b-col>
                <b-embed type="video" aspect="16by9" controls style="border: 1px solid black;">
                  <source :src="showURL" type="video/mp4">
                </b-embed>
            </b-col>
        </b-row>
        <b-row v-if="urlImage.length > 0 && selectedOption != attachmentTypes.VIDEO">
            <b-col>
                <img :src="getImgURL(urlImage)" 
                    style="width: 100%; height: 350px; margin: 10px 0px">
            </b-col>
        </b-row>

        <hr>
        
        <b-row v-if="allowSelection">
            <b-col>
                <b-row>
                    <b-col>
                        <b-form-group
                            :label="$t('audiovisual_media.index.search')"
                            label-class="font-weight-bold">
                            <div class="inline">
                                <b-form-input  type="text" v-model="q"></b-form-input>
                                <sipsder-btn 
                                  style="margin-left: 5px"
                                  btnType="search"
                                  @onClick="newSearch"
                                ></sipsder-btn>  
                            </div>
                                
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <carousel :perPageCustom="[[480, 4], [768, 4], [1024, 4]]" :navigationEnabled="true"
                            class="w-unset col-100 padding-5">
                                <slide v-for="(image, i) in options" :key="i">
                                    <template v-if="selectedOption == attachmentTypes.PUBLIC_IMAGE">
                                        <img 
                                        @click="selection(image)"
                                        :src="getImgURL(image.url)" :alt="'Image'" width="150" height="150">
                                    </template>
                                    <template v-if="selectedOption == attachmentTypes.VIDEO">
                                        <div style="position: relative; width: 150px; height: 150px;" class="center"
                                        >
                                        <iframe class="center" width="150" height="150"
                                            :src="getImgURL(image.url)"
                                        >
                                        </iframe>
                                        <div class="cover"
                                        @click="selection(image)"></div>
                                        </div>
                                        
                                    </template>
                                    <template v-if="selectedOption == attachmentTypes.BANNER">
                                        <!-- <div style="position: relative; width: 150px; height: 150px;" class="center"
                                        >
                                        <img class="center" width="150" height="150"
                                            :src="getImgURL(image.url)"
                                        >
                                        </img>
                                        <div class="cover"
                                        @click="selection(image)"></div>
                                        </div> -->
                                        <img 
                                          @click="selection(image)"
                                          :src="getImgURL(image.url)" :alt="'Image'" width="150" height="150">
                                    </template>
                                </slide>
                        </carousel>
                    </b-col>
                </b-row>

                

            </b-col>
        </b-row>

        <b-row>
            <b-col cols="12" md="6">
                <b-form-group
                    :label="$t('audiovisual_media.index.title') + TEMPLATES.MANDATORY_SYMBOL"
                    label-class="font-weight-bold"
                    :invalid-feedback="errors.first('title')"
                >
                    <b-form-input type="text" v-model="title"
                        :disabled="selected !== null"
                        :state="validateState(`title`)"
                        v-validate="{required:true,min:3, max:80}" 
                        name="title" :data-vv-as="$t('audiovisual_media.index.title')"
                    ></b-form-input>          
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
                <b-form-group
                    :label="$t('audiovisual_media.index.source') + TEMPLATES.MANDATORY_SYMBOL"
                    label-class="font-weight-bold"
                    :invalid-feedback="errors.first('source')"
                >
                    <b-form-input type="text" v-model="source"
                      :disabled="selected !== null"
                      :state="validateState(`source`)"
                      v-validate="{required:true, min:3, max:180}" 
                      name="source" :data-vv-as="$t('audiovisual_media.index.source')"
                    ></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
                <b-col cols="12" md="6">
                    <b-form-group
                        :label="$t('audiovisual_media.index.author') + TEMPLATES.MANDATORY_SYMBOL"
                        label-class="font-weight-bold"
                        :invalid-feedback="errors.first('author')"
                    >
                        <b-form-input type="text" v-model="author"
                        :disabled="selected !== null"
                        :state="validateState(`author`)"
                        v-validate="{required:true, min:3, max:120}" 
                        name="author" :data-vv-as="$t('audiovisual_media.index.author')"></b-form-input>       
                    </b-form-group>
                </b-col>

                <b-col>
                    <b-form-group
                        :label="$t('audiovisual_media.index.description') + TEMPLATES.MANDATORY_SYMBOL"
                        label-class="font-weight-bold"
                        :invalid-feedback="errors.first('description')"
                    >
                        <b-form-input type="text" v-model="description"
                          :disabled="selected !== null"
                          :state="validateState(`description`)"
                          v-validate="{required:true, min:3, max:280}" 
                          name="description" :data-vv-as="$t('audiovisual_media.index.description')"
                        ></b-form-input>  
                    </b-form-group>
                </b-col>
        </b-row>

        <b-row>
            <b-col>
                <b-form-group
                    :label="$t('audiovisual_media.modify.ruralThemeTitle')"
                    label-class='font-weight-bold'
                > 
                    <!-- <b-form-input v-if="selected !== null"
                      :value="fields.ruralTheme"
                      disabled
                    ></b-form-input> -->
                    <treeselect v-model="fields.ruralTheme" 
                        :disabled= "selected !== null"
                        :options="autocomplets.ruralModels"
                        :multiple="false"
                        :searchable="true" 
                        :clearable="true"
                        :openDirection="'below'"
                        :placeholder="$t( 'faqs.modal.rural_select' )"
                        :disable-branch-nodes="true"
                        :default-expand-level="1">
                        <label slot="option-label" slot-scope="{ node }">
                            <img v-if="node.raw && node.raw.url != null" 
                                    :src="getImgURL(node.raw.url)" height="16" width="16">
                            <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>
                            {{ node.label }}
                        </label>
                    </treeselect>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
          <b-col cols="12" md="6">
            <b-form-group
              :label="$t('audiovisual_media.admin.filter.localidad')"
              label-class="font-weight-bold">

              <b-form-input v-if="selected !== null"
                  :value="getLocationText(fields.localidad)"
                  disabled
              ></b-form-input>
              <vue-select v-else
                v-model="fields.localidad" 
                label="text" :options="autocomplets.localidades">
              </vue-select>

            </b-form-group>
          </b-col>
          
          <b-col cols="12" md="6">
            <b-form-group
              :label="$t('audiovisual_media.admin.filter.village')"
              label-class="font-weight-bold">

              <b-form-input v-if="selected !== null"
                  :value="getLocationText(fields.village)"
                  disabled
              ></b-form-input>
              <vue-select v-else
                v-model="fields.village" 
                label="text" :options="autocomplets.villagesFilter" >
              </vue-select>

            </b-form-group>
          </b-col>
        </b-row>

        <b-row align-h="center" v-if="!isAdministrator && !selectionMode">
          <b-col cols="12" md="12">
            <b-form-group
                label-class="font-weight-bold"
                :label="$t('audiovisual_media.addModal.cause') + TEMPLATES.MANDATORY_SYMBOL"
                :invalid-feedback="errors.first('causeAddModal')">
                <b-form-textarea 
                    v-model="fields.message"
                    :rows="4"
                    :max-rows="6"
                    :no-resize="true"
                    :placeholder="$t('audiovisual_media.editModal.causePlaceholder')" 
                    name="causeAddModal"
                    v-validate="{max: 500, required: !isAdministrator && !selectionMode}"
                    :data-vv-as="$t('audiovisual_media.addModal.cause')"
                    :state="validateState('causeAddModal')"
                ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="selectionMode">
            <b-col cols="12" md="6">
                <b-form-group
                    :label="$t('audiovisual_media.index.user')"
                    label-class="font-weight-bold">
                    
                    <b-form-input 
                        type="text" v-model="user"
                        :disabled="true"
                    ></b-form-input>       
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
                <b-form-group
                    :label="$t('audiovisual_media.index.date')"
                    label-class="font-weight-bold">

                    <b-form-input 
                        type="date" v-model="created"
                        :disabled="true"
                    ></b-form-input>  
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-if="showValidError">
          <b-col class="error-msg d-flex justify-content-center">
            {{$t('audiovisual_media.index.fieldsError')}}
          </b-col>
        </b-row>
        <b-row class="button-container">
            <b-col class="d-flex justify-content-center">

                <!-- <sipsder-btn btnType="back" @onClick="showModal('backModal')">
                </sipsder-btn> -->
                
                <sipsder-btn :text="$t('audiovisual_media.closeBtn')"
                    btnType="cancel"
                    @onClick="cancelAction"></sipsder-btn>

                
                <sipsder-btn :text="textBtn"
                  btnType="add"
                  @onClick="addAction" v-if="isAdministrator"
                ></sipsder-btn>
                <sipsder-btn :text="textBtn"
                    btnType="add"
                    @onClick="addAction" v-else
                ></sipsder-btn>
                
                
            </b-col>
        </b-row>
            
    </b-container>
    
    <!-- modales -->
    <b-modal ref="validationError" :title="$t('profile.validationError.title')" hideFooter >
        <i class="fas fa-exclamation-triangle error-msg"></i>
        {{$t('profile.validationError.text')}}
        <br>
        <b-row>
            <b-col class="d-flex justify-content-center">
                <sipsder-btn 
                    btnType="accept"
                    @onClick="hideModal('validationError')"
                ></sipsder-btn>
            </b-col>
        </b-row>
    </b-modal>

    <b-modal ref="success" :title="$t('util.modals.success.title')" hideFooter>
        <p> {{$t('util.modals.success.text')}} </p>
        
        <br>
        <sipsder-btn btnType="accept"
                    @onClick="hideModal('success')"
        ></sipsder-btn>
    </b-modal>

    <b-modal ref="backModal" size="md" :title="$t('util.modals.back.title')" centered hideFooter>
        <b-row>
            <b-col class="alert-msg d-flex justify-content-center">
                {{$t('util.modals.back.text')}}
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                
                <sipsder-btn  btnType="accept" @onClick="$router.go(-1)">
                </sipsder-btn>

            </b-col>
            <b-col class="text-left">

                <sipsder-btn btnType="cancel" @onClick="hideModal('backModal')">
                </sipsder-btn>

            </b-col>
        </b-row>
    </b-modal>

    <b-modal ref="error" :title="$t('util.modals.error.title')" hideFooter >
        <i class="fas fa-exclamation-triangle error-msg"></i>
        {{$t('util.modals.error.text')}}
        <br>
        <b-row>
            <b-col class="d-flex justify-content-center">
                <sipsder-btn 
                    btnType="accept"
                    @onClick="hideModal('error')"
                ></sipsder-btn>
            </b-col>
        </b-row>
    </b-modal>

    <!-- <b-modal ref="addModal" size="md" :title="$t('audiovisual_media.addModal.title')" centered hideFooter>
        <b-row>
            <b-col >
                {{$t('audiovisual_media.addModal.textMain')}}
            </b-col>
        </b-row>
        <b-row>
            <b-col >
                {{$t('audiovisual_media.addModal.textField')}}
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group
                    label-size="lg"
                    label-class="font-weight-bold"
                    :label="$t('audiovisual_media.addModal.cause') + $t('util.obligatorySymbol')"
                    :invalid-feedback="errors.first('causeAddModal')"
                >
                    <b-form-textarea 
                        v-model="fields.message"
                        :rows="4"
                        :max-rows="6"
                        :no-resize="true"
                        :placeholder="$t('audiovisual_media.editModal.causePlaceholder')" 
                        name="causeAddModal"
                        v-validate="{max: 500}"
                        :data-vv-as="$t('audiovisual_media.addModal.cause')"
                        :state="validateState('causeAddModal')"
                    ></b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col cols="12" class="d-flex justify-content-center">
                
                <sipsder-btn  btnType="accept" @onClick="addAction">
                </sipsder-btn>

            </b-col>
        </b-row>
    </b-modal> -->

  </div>
</template>

<script>
import VAPI from '../../../http_common';
import {SERVICE_NAMES, HTTP_STATUS, DOMAINS, TEMPLATES} from "../../../sipsder_constants";
import { Carousel, Slide } from 'vue-carousel';
import { PERMISSIONS_TYPES, MODULES, ATTACHMENT_TYPE, GEOGRAPHY_TYPE, ATTACHMENT_STATES} from '../../../domain_constants';
import moment from 'moment';
import S_UTIL from "../../../util/sipsder_util";

import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue'
import vSelect from "vue-select";
import Treeselect from '@riophae/vue-treeselect';

export default {
  name: "AudioVisualIndex",
  data(){
    return {
      TEMPLATES:TEMPLATES,
      text: "",
      selectedOption: null,
      title: "",
      source: "",
      author: "",
      user: "",
      created: "",
      description: "",
      url: "",
      showURL: "",
      urlImage: "",
      image: null,
      selected: null,
      options: [],
      q: "",
      summary: [],
      fileAux : null,
      SummaryFields: [
        {
          key: 'section',
          sortable: true
        },
        {
          key: 'count',
          sortable: true
        },
      ],
      autocomplets: {
        localidades: [],
        villages: [],
        villagesFilter: [],
        ruralModels: [],
        status: []
      },
      fields: {
        localidad: null,
        village: null,
        ruralTheme: null,
        status: null,
        enabled: null,
        message: null,
        criptedId: null,
      },
      prevAttachment: null,
      mapMediaIdToText : {},
      showValidError: false,
    }
  },
  props:{
    showSummary: {
      type: Boolean,
      default: false
    },
    banner: {
      type: Boolean,
      default: false
    },
    allowSelection: {
      type: Boolean,
      default: false
    },
    mediaOptions: {
      type: Array,
      default: function () {
        return [
          { value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption") },
          { value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption") }
        ];
      }
    },
  },
  watch:{
    url: function(val) {
      this.getYouTubeUrl()
    },
    'fields.localidad' : function(newVal) {
      
      if (!newVal) {
        this.autocomplets.villagesFilter = this.autocomplets.villages;
        this.fields.village = null;
      } else {
        this.autocomplets.villagesFilter = this.autocomplets.villages.filter(loc => {
          return loc.value.parentId == newVal.value.id;
        });
      }
      
      if (this.fields.village && newVal && this.fields.village.value.parentId != newVal.value.id) {
          this.fields.village = null;
      }
      // console.info("Cambio localidad: ", newVal ,this.fields.village);
    },
    'fields.village' : function(newVal) {
      if (newVal && (!this.fields.localidad || this.fields.localidad.value.id != newVal.value.parentId)) {
        this.fields.localidad = this.autocomplets.localidades.find(loc => loc.value.id == newVal.value.parentId);
      }
      // console.info("Cambio village: ", newVal ,this.fields.localidad);
    },
    'fields.status' : function(newVal){
      if (newVal.id == ATTACHMENT_STATES.REJECTED) {
        this.fields.enabled = false;
      }
    },
    'selectedOption' : async function(newVal) {
      let res = await this.loadAudioVisual();
      return res;
    }
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    getVideoURL (url) {
      return S_UTIL.getVideoURL(url);
    },
    selection(image){
      this.fields.criptedId = image.encryptedId;
      this.selected = image
      this.copyFields(image);
    },
    async addAction(){
      
      let valid = await this.getValidateResults();
      // if (!this.isAdministrator) {
      //   valid &= (this.fields.message && this.fields.message.length > 0);
      // }
      if (this.isImage && !this.urlImage) {
        valid = false;
      }
      this.showValidError = false;
      if (!valid) {
          this.showValidError = true;
          return;
      }
      if (!this.fields.criptedId || this.fields.criptedId == null) { // creation
        let formAttachment = await this.handleAttachment();

        try{
            let result;
            result = await VAPI.post(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/upload`, formAttachment);
            if(result && result.status == HTTP_STATUS.OK) {
                this.clear();
                this.$validator.reset();
                this.returnImage([ result.data.data.id, result.data.data.url, result.data.data.typeName, result.data.data.typeId ]);
            } else {
                this.showValidError = true;
                // this.showModal("error");
            }
        }catch(e){
            console.info("Problemas al cargar resultados:",e)
            this.showValidError = true;
        }
      } else {
        
        this.returnImage([ this.selected.id, this.selected.url, this.selected.typeName, this.selected.typeId ] );
      }
      
    },
    getImage(e) {
      this.image = e.target.files[0];
      if (this.image) {
        this.urlImage = URL.createObjectURL(this.image);
      }
    },
    getId(url) {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    },
    getYouTubeUrl(){
      if(this.url.search("youtube")>0){
        let vId = this.getId(this.url);
        this.showURL = `https://www.youtube.com/embed/${vId}?rel=0`;
      }
      else{
        this.showURL = this.getVideoURL(this.url);
      }
    },
    cancelAction() {
      this.showValidError= false;
      this.clear();
      this.$validator.reset();
      this.selectedOption = null;
      this.fileAux=null;
      this.$emit('cancel');
    },
    clear(){
      this.fields.criptedId = null;
      this.selected = null;
      this.title = "";
      this.source = "";
      this.author = "";
      this.description = "";
      this.url = "";
      this.showURL = "";
      this.urlImage = "";
      this.fields.village = null;
      this.fields.localidad = null;
      this.fields.ruralTheme = null;
      this.image = null;
    },
    async newSearch(){
      let text = ATTACHMENT_TYPE.VIDEO;
      if(this.selectedOption == ATTACHMENT_TYPE.PUBLIC_IMAGE){
        text = ATTACHMENT_TYPE.PUBLIC_IMAGE
      }
      let results = await this.search(text, this.q)
      this.options = results.data.data
    },
    search(type, q){
        let path = `/${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/search`;
        // '/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA + "/search"
        return VAPI.get(path, {
            params: {
              type: type,
              q: q
            }
        });
    },
    validateState(name) {

        if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
            
            return !this.errors.has(name);
        }
        return null;
    },
    async loadDomains() {
        try {
            let path = `${SERVICE_NAMES.DOMAINS}/${DOMAINS.ATTACHMENT_STATE}`
            let response = await VAPI.get( path );
            
            if (response && response.status == HTTP_STATUS.OK) {
                this.autocomplets.states = response.data.data.map(state => {
                  return {text: state.value, value: state};
                });
            } else {
                console.info("Problemas al cargar el Domains", response);
            }
            return true;
        } catch (e) {
            console.info("Problemas al cargar el Domains", e);
            return false;
        }
    },
    async loadRuralModels() {
        try {
            let path = `${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );

            if (response && response.status == HTTP_STATUS.OK) {
                this.autocomplets.ruralModels = response.data.data;
            } else {
                console.info("Problemas al cargar el modelo rural", response);
            }
            return true;
        } catch (e) {
            console.info("Problemas al cargar el modelo rural", e);
        }
        return false;
    },
    async loadGeograpies() {
      try {
        let response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`);
        if (response.status == HTTP_STATUS.OK) {
          this.autocomplets.localidades = response.data.map(ubication => {
            return {text: ubication.name, value: ubication};
          });
        } else {
          console.info("Error al consumir localidad", response.status);  
        }
        response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.VEREDA}`);
        if (response.status == HTTP_STATUS.OK) {
          this.autocomplets.villages = response.data.map(ubication => {
            return {text: ubication.name, value: ubication};
          });;
          this.autocomplets.villagesFilter = this.autocomplets.villages;
        } else {
          console.info("Error al consumir vereda", response.status);  
        }
        return true;
      } catch (e) {
        console.info("Error al consumir geografias", e);
        return false;
      }
    },
    async getValidateResults() {
        return await this.$validator.validateAll();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    async handleAttachment() {
      let formData = new FormData();
      let attachment = {
        type: this.selectedOption,
        url: this.showURL,
        title: this.title,
        source: this.source,
        description: this.description,
        author: this.author,
        ruralTheme: this.fields.ruralTheme,
        geography: null,
        status: this.fields.status,
        enabled: this.fields.enabled,
        isCommunity: false
      }

      if (this.fields.localidad) {
        attachment.geography = this.fields.localidad.value;
      }
      // console.info("Existe village: ", this.fields.village);
      if (this.fields.village) {
        attachment.geography = this.fields.village.value;
      }

      if (this.isImage && this.image) {
        formData.append('file', this.image);
        attachment.url= null;
      }
      if (this.fields.message) {
        formData.append('message', this.fields.message);
      }

      formData.append('attachment',  JSON.stringify(attachment));

      return formData;
    },
    selectedMedia(id) {
      return this.mapMediaIdToText[id];
    },
    copyFields (pAttachment) {
      this.author = pAttachment.author;
      this.title = pAttachment.title;
      this.source = pAttachment.source;
      this.description = pAttachment.description;
      this.user =  pAttachment.user.firstName + " " + pAttachment.user.lastName;
      this.created =  moment(new Date(pAttachment.createdAt)).format('YYYY-MM-DD');

      // this.selectedOption = {value: pAttachment.typeId, text: this.selectedMedia(pAttachment.typeId)};
      this.selectedOption = pAttachment.typeId;
      
      this.fields.enabled = pAttachment.enabled;
      if (pAttachment.status && pAttachment.status.id) {
        this.fields.status = pAttachment.status;
      }

      if (pAttachment.location) {
        if (pAttachment.location.type.id === GEOGRAPHY_TYPE.LOCALIDAD) {
          // this.fields.localidad = {text: pAttachment.location.name, value: pAttachment.location};
          this.fields.localidad = this.autocomplets.localidades.find(loc => loc.value.id == pAttachment.location.id);
        } else {
          // this.fields.village = {text: pAttachment.location.name, value: pAttachment.location};
          this.fields.village = this.autocomplets.villages.find(loc => loc.value.id == pAttachment.location.id);
        }
      } else {
        this.fields.localidad = null;
        this.fields.village = null;
      }

      if(pAttachment.typeId === ATTACHMENT_TYPE.VIDEO) {
        this.showURL = pAttachment.url;
        this.url = pAttachment.url;
      }else {
        this.urlImage = pAttachment.url
        this.showURL = pAttachment.url;
      }

      if (pAttachment.ruralModelId) {
        this.fields.ruralTheme = pAttachment.ruralModelId;
      }
      
    },
    async loadAudioVisual() {
      try {
        if (this.selectedOption) {
          let params = {
            type: this.selectedOption,//`${this.selectedOption}`,
            q: this.q
          }
          let response = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/search`, {params});

          if (response && response.status == HTTP_STATUS.OK) {
            this.options = response.data.data;
          } else {
            console.info("Error al consumir Medios audiovisuales", response);    
          }
        } else {
          console.info("Error al consumir Medios audiovisuales", e);  
          alert("Seleccione un tipo de medio audiovisual");
        }
      } catch (e) {
        console.info("Error al consumir Medios audiovisuales", e);
      }
      return false;
    },
    getLocationText(location) {
      let text = "";
      if (location && location.text){
        text = location.text;
      }
      
      return text;
    },
    returnImage(values){
      this.clear();
      // console.info("Mostrando imagen retornada: ", values);
      this.$emit('created_image', values)
    },
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdministrator( ) {
        let isAdmin = false;
        if (this.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) {
                isAdmin = true     
        }
        return isAdmin;
    },
    isAdminHome() {
      // console.info("Admin home", this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN));
      return this.isAuthenticated && this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    modules() {
        return MODULES;
    },
    isImage() {
        return this.selectedOption == ATTACHMENT_TYPE.PUBLIC_IMAGE || this.selectedOption == ATTACHMENT_TYPE.BANNER
            || this.selectedOption == ATTACHMENT_TYPE.CONTACT;
    },
    isYouTube() {
        return this.url.length > 0 && this.url.search("youtube")>0;
    },
    isVideo() {
        return this.url.length > 0 && this.selectedOption == ATTACHMENT_TYPE.VIDEO;
    },
    attachmentTypes() {
        return ATTACHMENT_TYPE;
    },
    selectionMode() {
        return this.fields.criptedId != null;
    },
    textBtn() {
      if (this.selectionMode) {
        return this.$t('audiovisual_media.modify.edit');
      }
      return this.$t('audiovisual_media.addBtn');
    },
    isRejected() {      
      return this.fields.status && this.fields.status.id == ATTACHMENT_STATES.REJECTED;
    },
  },
  components: {
    Carousel,
    Slide,
    "s-note-rich-text": NoteRichText,
    "vue-select": vSelect,
    Treeselect,
  },  
  async created(){
  },
  async mounted(){
    // this.text = this.$t('audiovisual_media.addBtn');
    await this.loadGeograpies();
    await this.loadRuralModels();
    await this.loadDomains();
    
    let changeMediaOptions = true;
    if (this.mediaOptions != []) {
      changeMediaOptions = false;
    }
    if (changeMediaOptions) {
      this.mediaOptions = [
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")},
      ];
    }
    this.mapMediaIdToText[ATTACHMENT_TYPE.PUBLIC_IMAGE] = this.$t("audiovisual_media.imageOption");
    this.mapMediaIdToText[ATTACHMENT_TYPE.VIDEO] = this.$t("audiovisual_media.videoOption");
    this.mapMediaIdToText[ATTACHMENT_TYPE.BANNER] = this.$t('audiovisual_media.bannerOption');
    
    if (this.isAdministrator && changeMediaOptions) {
        // console.info("Opciones de media:", this.mediaOptions);
        this.mediaOptions.push(
            {value: ATTACHMENT_TYPE.BANNER, text: this.$t('audiovisual_media.bannerOption')}
        );
    }
    
    this.summary = []
    if(this.fields.criptedId) {
      try {
        let response = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/${this.fields.criptedId}`)
        this.prevAttachment = response.data;

        this.copyFields(this.prevAttachment);

      } catch (e) {
        console.info("Problemas en la carga del documento", e);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question-icon {
    color:#0db8bb;
    font-size: 2.5rem;
}
.v-select {
    background: white;
}
.dropdown-toggle {
    border: 1px solid rgba(17, 17, 17, 0.96);
}
.dot {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
}

.error-msg {
    color: #F00;
    font-size: 2rem;
}
</style>


<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .overflow-y
    height: 200px
    overflow-y: auto
    overflow-x: hidden
    
  .w-unset
    width: unset !important
  .cover
    width: 150px
    height: 150px
    background: transparent
    position: absolute
    top: 0
    left: 0
  .border
    border: 1px solid black
  .padding-5
    padding: 5px 
  .error
    color: $colorDanger
    font-size: 1rem
  .inline
    +flexbox
    +justify-content(flex-start)
    +align-items(center)

  .button-container
    +flexbox
    +justify-content(flex-end)
    +align-items(center)
    div
      padding: 0 5px
  .scroll
    height: 400px
    overflow-y: auto
</style>
