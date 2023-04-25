<template>
  <div id="contenedor">
    <b-container class="container-form">
      <b-form>
        <b-row>
          <b-col>
            <sipsder-title
              title="Prueba de componentes"
              text="Contenido del header, aca se ve una prueba del uso del componente de titulo de las paginas"
              section="registry"
            ></sipsder-title>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="6">
            <b-form-group
              label-class="font-weight-bold"
              description="Descripcion del input calendar"
              label="Prueba input calendar"
            >
              <!-- <b-form-input type="date">
              </b-form-input>-->
              <!-- Se puede encontrar un ejemplo de uso :
              https://codesandbox.io/s/mpklq49wp-->
              <datepicker
                :placeholder="$t('util.insertDate')"
                class="date-picker"
                :language="languages[language]"
                :calendar-button="true"
                calendar-button-icon="fa fa-calendar"
                :clear-button="true"
              ></datepicker>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="vue-passwor"
              label="Prueba de componente input password"
            >
              <vue-password v-model="textPassword"></vue-password>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="form input type number"
              label="Prueba Input text number"
            >
              <!-- referencias en https://bootstrap-vue.js.org/docs/components/form-input/ -->
              <b-form-input type="number"></b-form-input>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="select"
              label="Prueba de select one"
            >
              <b-form-select :options="options"/>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="b form radio group"
              label="Radios using <code>options</code>"
            >
              <b-form-radio-group id="radios1" :options="options" name="radioOpenions"></b-form-radio-group>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="vue select"
              label="Prueba autocomplet select"
            >
              <vue-select :options="autocomplete"></vue-select>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="vue bootstrap typeahead"
              label="Prueba autocomplet typeahead"
            >
              <vue-bootstrap-typeahead
                :data="localities"
                v-model="localitySearch"
                class="w-100"
                :serializer="s => s.name"
                placeholder="placeholder"
                @hit="selectedLocality = $event"
              ></vue-bootstrap-typeahead>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="b form input"
              label="Prueba Input"
            >
              <b-form-input></b-form-input>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="b form textarea"
              label="Prueba Text area"
            >
              <b-form-textarea
                id="textarea1"
                v-model="textoArea"
                placeholder="Ingrese algo"
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
            </b-form-group>

            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              description="b form checkbox"
              label="Prueba checkbox"
            >
              <b-form-checkbox
                id="checkbox1"
                value="accepted"
                unchecked-value="not_accepted"
              >I accept the terms and use</b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-container>
      <b-modal ref="testModal" :title="$t('registration.warning')">
        <div>Algo en el contenido.</div>
      </b-modal>
      <sipsder-title title="Pruebas Modal" text="Texto que no se vera" type="admin">
        <b-row slot="content">
          <sipsder-btn btnType="export" @onClick="showModal('testModal')"></sipsder-btn>
          <sipsder-btn btnType="export_data" text @onClick="showModal('testModal')"></sipsder-btn>
        </b-row>
      </sipsder-title>
    </b-container>

    <hr>
    <b-container>
      <sipsder-title title="Prueba de carga de documentos"></sipsder-title>
      <b-row>
        <b-col>
          <document-upload></document-upload>
        </b-col>

      </b-row>
      <b-row>
        <b-col cols="12" class="d-flex justify-content-left">

          <h2>Descarga</h2>

        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" class="d-flex justify-content-center flex-column">
          <input v-model="idDocument" />
          <download-document :id="idDocument"></download-document>
        </b-col>
        <b-col cols="4" class="d-flex justify-content-center">
          
          <sipsder-btn btnType="accept" :text="$t('document_upload.save')" :title="$t('document_upload.save')">
          </sipsder-btn>
                          
        </b-col>
        <b-col cols="4" class="d-flex justify-content-center">
          
                          
        </b-col>
      </b-row>
      
    </b-container>
    <hr>
    <b-container class="container-form">
      <sipsder-title title="Prueba de componente de notas del sistema"></sipsder-title>
      <b-row>
        <b-col>
          <s-note-rich-text
            :showEdition="true" :module="modules.RURAL_LIBRARY" keyVal="welcome" :textPenEdition="$t('note.editText')"
          ></s-note-rich-text>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <s-note-rich-text
            :showEdition="false" :module="modules.AUDIO_VISUAL" keyVal="legal" :textPenEdition="$t('note.editText')"
          ></s-note-rich-text>
        </b-col>
      </b-row>
    </b-container>

    <hr>
    <b-container>
      <sipsder-title title="Pruebas de Onclick"></sipsder-title>
      <sipsder-btn btnType="delete" @onClick="consoleClick('mensaje')"></sipsder-btn>

      <sipsder-btn btnType="back" @onClick="backPage"></sipsder-btn>

      <sipsder-btn btnType="add" text="Prueba" @onClick="alertClick"></sipsder-btn>

      <sipsder-title type="configuration"></sipsder-title>

      <b-row>
        <b-col>
          <!-- <comment-list :parentId="19" typeParent="news">
          </comment-list>-->
          <s-comment :parentId="1" typeParent="news"></s-comment>
        </b-col>
        PERMISSIONS_TYPES.PARTICIPATE: {{pComment}}
        <br>
        PERMISSIONS_TYPES.ADMIN: {{pCreate}}
      </b-row>

      <div v-for="vari in variable" :key="vari">
        <hr>
        <hr>
        <hr>
        <h3>{{vari}}</h3>
        <b-row>
          <b-col cols="6">
            <div v-for="tipo in buttonTypes.slice(0, buttonTypes.length / 2)" :key="tipo">
              <sipsder-btn :btnType="tipo" @click="alert('aca')" :variant="vari"></sipsder-btn>
            </div>
          </b-col>
          <b-col cols="6">
            <div
              v-for="tipo in buttonTypes.slice(buttonTypes.length / 2, buttonTypes.length)"
              :key="tipo"
            >
              <sipsder-btn :btnType="tipo" :variant="vari"></sipsder-btn>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-container>

    <!-- Pruebas Modal -->
    <b-container class="container-form">
      <b-row>
        <sipsder-title title="Prueba de componente modal"/>
      </b-row>
      <b-row class="centered">
        <b-col>
          <sipsder-btn btnType="uploadImage" text="Default modal" @onClick="_showModal('default')"/>
          <sipsder-btn btnType="uploadImage" text="CamelCased modal" @onClick="_showModal('camelCased')"/>
          <sipsder-btn btnType="uploadImage" text="Error modal" @onClick="_showModal('error')"/>
          <sipsder-btn btnType="uploadImage" text="Discard modal" @onClick="_showModal('discard')"/>
          <sipsder-btn btnType="uploadImage" text="Invalid modal" @onClick="_showModal('invalid')"/>
        </b-col>
      </b-row>
    </b-container>
    <modal
      :modals="modals"
      :activeModalName="shownModal"
      i18n="test_components"
      @closed="shownModal = undefined"
    />

    <!-- Pruebas Print -->
    <b-container class="container-form">
      <b-row>
        <sipsder-title title="Prueba de componente de impresión"/>
      </b-row>
      <print-component>
        <div class="h2">
          Title to be printed
        </div>
        <div v-for="index in 10" :key="index">
          {{index}}
        </div>
        <div class="h3">
          And whatever you want
        </div>
      </print-component>
    </b-container>

    <!-- Pruebas Rich text editor y preview -->
    <b-container class="container-form">
      <b-row>
        <sipsder-title title="Prueba de componente de texto enriquecido"/>
      </b-row>
      <rich-text v-model="richtext"/>
      <rich-text-preview :content="richtext"/>
    </b-container>
    <!-- Pruebas table select -->
    <b-container class="container-form">
      <b-row>
        <sipsder-title title="Prueba de componente de tabla"/>
      </b-row>
      <s-table-select
              v-model="tableData"
              :label="$t('event.rural') + asterisk"
              labelSelect="texto"
              :options="tableOptions"
              :tableFields="tableFields.ruralTheme"
              :disableBranch="true"
          >
            <div slot="actionsCol">
              Hola mundo
            </div>
      </s-table-select>  
    </b-container>

    <!-- Pruebas componentes ArcGIS -->
    <b-container class="container-form">
      <b-row>
        <sipsder-title title="Prueba de componentes de ArcGIS" />
      </b-row>
      <div v-if="arcgisMap">
        <span>Previsualización</span>
        <b-row>
          <b-col>
            <map-preview :value="arcgisMap" display-map />
          </b-col>
        </b-row>
      </div>
      <b-row class="mt-3">
        <b-col>
          <b-form-group class="form-group required" label="Selección de mapa">
            <map-search v-model="arcgisMap" :tag="ARCGIS_TAGS.FIGURES" v-validate="'required'" name="map" data-vv-as="Mapa" />
          </b-form-group>
          <b-alert variant="danger" :show="errors.has('map')">{{ errors.first("map") }}</b-alert>
        </b-col>
      </b-row>
    </b-container>
    
  </div>
</template>

<script>
import VuePassword from "vue-password";
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale"; //importar locale
//import CommentForm from "@/components/views/comment/CommentForm.vue"
import CommentCmp from "@/components/shared/comment/CommentComponent.vue";
import DocumentUpload from "../../shared/DocumentUpload.vue";
import DownloadDocument from "../../shared/DownloadDocument.vue";
import Modal from "../../shared/Modal";
import PrintComponent from "../../shared/PrintComponent";
import RichTextPreview from "../../shared/RichTextPreview";
import RichText from "../../shared/RichText";
import { PERMISSIONS_TYPES, MODULES, ARCGIS_TAGS } from "../../../domain_constants";
import { HTTP_STATUS } from "../../../sipsder_constants";
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import VAPI from '../../../http_common';
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue'
import TableSelect from "@/components/shared/TableSelect";
import MapSearch from "@/components/shared/arcgis/MapSearch";
import MapPreview from "@/components/shared/arcgis/MapPreview";

export default {
    data: function() {
        return {
            ARCGIS_TAGS,
            arcgisMap: undefined,
            buttonTypes: [
                "uploadImage",
                "preview",
                "clean",
                "delete",
                "newSearch",
                "login",
                "link",
                "ubication",
                "export",
                "download",
                "add",
                "edit_pen",
                "edit",
                "imageMedia",
                "message",
                "search",
                "cancel",
                "accept",
                "back",
                "export",
                "save",
                "admin_ins",
                "send"
            ],
            variable: [
                "primary",
                "secondary",
                "success",
                "danger",
                "warning",
                "info",
                "light",
                "dark",
            ],
            language: "es",
            languages: lang,
            textPassword: "",
            options: [
                "opcion1",
                "opcion2",
                "opcion3",
                "opcion4",
            ],
            autocomplete: [
                "componenetes",
                "opcion1",
                "opcion2",
                "opcion3",
                "opcion4",
                "autocmopletes"
            ],
            textoArea : "",
            comments : [
            ],
            localities: [],
            selectedLocality: null,
            localitySearch: '',
            idDocument: 0,

      shownModal: undefined,
      modals: {
        default: {
          // Closable modal with x on top right border, clicking outside or pushing escape
          nonClosable: false,
          cancelable: true,
          onAccept: () => alert('Things to do on accept'),
          onCancel: () => this.shownModal = undefined           // Hide modal
        },
        camelCased: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.componentFunction(),
          onCancel: () => this.shownModal = undefined
        },
        error: {
          nonClosable: false,
          cancelable: false,
          onAccept: () => this.shownModal = undefined
        },
        discard: {
          // Non-closable modal
          nonClosable: true,
          cancelable: true,
          onAccept: () => alert('Accept pressed'),
          onCancel: () => this.shownModal = undefined
        },
        invalid: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => this.shownModal = undefined
        }
      },
      richtext: "",
      tableData : [],
      tableOptions: [{name: "Juan"}, {name: "Felipe"}],
      tableFields: {
        ruralTheme: [
            {
              key: 'name',
              label: this.$t('document.admin.tableTitles.ruralModel.structure'),
              sortable: true,
            },
            {
              key: 'actions',
              label: ""
            }
        ],
      },
    };
  },
  components: {
    VueBootstrapTypeahead,
    "vue-password": VuePassword,
    "vue-select": vSelect,
    datepicker: Datepicker,
    //"comment-form" : CommentForm,
    "s-comment": CommentCmp,
    DocumentUpload,
    DownloadDocument,
    "s-note-rich-text": NoteRichText,
    Modal,
    PrintComponent,
    RichTextPreview,
    RichText,
    "s-table-select": TableSelect,
    MapSearch,
    MapPreview
  },
  methods: {
    alertClick() {
      alert("aca");
    },
    consoleClick(msg) {
      console.log(msg);
    },
    backPage() {
      this.$router.go(-1);
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    async getLocalities(locality){
      let response = await VAPI.get(`/geographies/search?q=${locality}&type=Localidad`);
      this.localities = response.data.data
    },
    componentFunction() {
      alert('Component function on camel case');
    },
    _showModal(modal) {
      this.shownModal = modal;
    }
  },
  mounted() {},
  computed: {
    pComment: function() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
    },
    pCreate: function() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    modules() {
      return MODULES;
    }
  },
  watch: {
    localitySearch: _.debounce(function(locality) { 
      if(locality.length > 0)
        this.getLocalities(locality) 
    }, 500),
  }
};
</script>

<style lang="sass">
.form-group.required legend:after,
.label.required:after
  content: " *"
  color: red
</style>