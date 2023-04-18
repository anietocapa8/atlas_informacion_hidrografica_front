<template>
<div class="container container-form">

    <!-- Bad Request modal -->
    <b-modal ref="badRequestModal" :title="$t('registration.warning')" hideFooter>
          <div class="mg-top-10 w-100 center-text red">
              <p>{{$t('survey.create.bad_request')}}</p>
          </div>
          <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.accept')" @onClick="closeModal( 'badRequestModal')" />
              </b-col>
        </b-row>
      </b-modal>

    <!-- Erros modal -->
    <b-modal ref="errorModal" :title="$t('registration.warning')" hideFooter>
          <div class="mg-top-10 w-100 center-text red">
              <p v-for="(error,i) in formErrors" :key="`${i}-${error}`"> {{error}} </p>
          </div>
          <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.back')" @onClick="closeModal( 'errorModal' )" />
              </b-col>
        </b-row>
      </b-modal>

    <!-- Cancel Modal-->
    <b-modal ref="cancelModal" :title="$t('registration.warning')" hideFooter>
          <div class="mg-top-10 w-100 center-text red">
              <p> {{$t('survey.create.popup.dicard_changes')}} </p>
          </div>
          <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goPrototypes()" />
              </b-col>
              <b-col class="center-text">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('cancelModal')" />
              </b-col>
        </b-row>
      </b-modal>

    <!-- Confirmation Modal-->
    <b-modal ref="confirmationModal" :title="$t('registration.warning')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
            <div class="mg-top-10 w-100 center-text">
              <p> {{$t('prototype.create.popup.save')}} </p>
              <p> {{$t('prototype.create.popup.confirmation')}} </p>
            </div>
            <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="confirmedSave()" />
              </b-col>
              <b-col class="center-text">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('confirmationModal')" />
              </b-col>
        </b-row>
    </b-modal>

    <!-- Saved Modal-->
    <b-modal ref="savedModal" :title="$t('registration.warning')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
            <div class="mg-top-10 w-100 center-text">
              <p> {{$t('norm.create.popup.saved')}} </p>
            </div>
            <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goPrototypes()" />
              </b-col>
        </b-row>
    </b-modal>

    <!-- ATTACHMENTS MODAL -->
    <b-modal
        ref="addImageModal"
        id="addImageModal"
        size="lg"
        class="image-modal"
        centered
        :title="$t('audiovisual_media.index.title_modal')"
        hide-footer>
        <audiovisualmedia
          @created_image="created_image($event)"
          @cancel="closeAttachModal('addImageModal')"
          :allowSelection="true"
          v-if="showAttachmentModal"
          :message="message">
        </audiovisualmedia>
    </b-modal>
      
    <b-modal
        ref="deleteImage"
        :title="$t('registration.warning')"
        @ok="deleteAttachment(imageSelected)"
        @cancel="closeModal('deleteImage')">
        <b-row class="w-100 center">
          <div class="w-75">{{$t('news.create.delete')}}</div>
        </b-row>
    </b-modal>

    <!-- DOCUMENT MODAL -->
    <b-modal ref="documentModal" :title="$t('prototype.create.document.add_button')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>

        <b-form-group
            :label="$t('prototype.create.form.name_doc')+asterisk" class="bold mg-top-30">
            <b-form-textarea v-model="document.title" :rows="1" :max-rows="2" maxlength="180"
                v-validate="'required|min:4|max:180'" name="doc_title" :data-vv-as="$t('prototype.create.document.name')"/>
            <span class="error">{{ errors.first('doc_title') }}</span>
        </b-form-group>

        <b-form-group
            :label="$t('prototype.create.form.description_doc')+asterisk" class="bold mg-top-30">
            <b-form-textarea v-model="document.summary" :rows="3" :max-rows="6" maxlength="280"
                v-validate="'required|min:4|max:280'" name="doc_desc" :data-vv-as="$t('prototype.create.form.description_doc')"/>
                <span class="error">{{ errors.first('doc_desc') }}</span>
        </b-form-group>
        
        <h4 class="mg-top-10" v-if="filename && !fileError">{{$t('prototype.create.document.selected_file')}}: {{filename}}</h4>
        <h4 v-if="fileSizeError" class="mg-top-10 error">{{$t('prototype.create.document.size_error')}}</h4>
        <h4 v-if="fileExtError" class="mg-top-10 error">{{$t('prototype.create.document.pdf_error')}}</h4>

        <div class="flex mg-top-10">
            <input type="file"
              name="register_template"
              @change="loadFile($event)" 
              ref="uploadFile"
              style="display: none"/>
            <sipsder-btn btnType="export" 
              :text="$t( 'prototype.create.document.modal_butt_1' )"
              @onClick="$refs.uploadFile.click()">                                            
            </sipsder-btn>

            <input type="file"
              name="register_template"
              @change="loadPdfFile($event)"
              accept="application/pdf"
              ref="uploadDocument"
              style="display: none"/>
            <sipsder-btn btnType="uploadImage" 
              :text="$t( 'prototype.create.document.modal_butt_2' )"
              @onClick="$refs.uploadDocument.click()">                                            
            </sipsder-btn>

        </div>
        <h4 v-if="!filename" class="mg-top-10 error">{{$t('prototype.create.document.no_file')}}</h4>

        <div class="rigth mg-top-10">
            <sipsder-btn btnType="back" @onClick="deleteFile()" :text="$t('prototype.create.document.modal_butt_cancel')" ></sipsder-btn>
            <sipsder-btn btnType="save" @onClick="saveDocument()" :text="$t('prototype.create.document.modal_butt_save')" :disabled="!filename" ></sipsder-btn>
        </div>

    </b-modal>


    <!-- TITULO -->
    <sipsder-title :title="$t('prototype.create.title')" type="admin"></sipsder-title>

    <h3>{{$t('prototype.create.claim')}}</h3>

    <br>
    <div class="bold rigth">
        <b-form-checkbox @change="prototype.state = !prototype.state;" v-model="prototype.state">{{$t('prototype.create.enable')}}</b-form-checkbox>
    </div>

    <!-- BEGIN THE FORM -->
    <div class="form-container">

        <div v-if="!prototype.state">
            <b-form-group
                :label="$t('prototype.create.form.reason')+asterisk"
                class="bold mg-top-30">
            </b-form-group>
            <b-form-textarea v-model="prototype.reason"
            :rows="3" :max-rows="6"
            maxlength="280"/>
        </div>

        <b-row class="mg-top-30">
            <b-col cols="7">
                <b-form-group
                    :label="$t('prototype.create.form.name')+asterisk"
                    class="bold">
                    <b-form-input type="text" v-model="prototype.name" maxlength="180" />
                </b-form-group>
            </b-col>

            <b-col cols="5">
                <b-form-group :label="$t('prototype.create.form.date')+asterisk"
                label-class="font-weight-bold">
                    <datepicker 
                        :placeholder="$t('util.insertDate')" 
                        v-model="date"
                        class="date-picker"
                        :language = "languages[ currentLocale ]"
                        :calendar-button = "true"
                        calendar-button-icon = "fa fa-calendar"
                        :clear-button = "true">
                    </datepicker>
                </b-form-group>
            </b-col>
        </b-row>

        <b-form-group :label="$t('prototype.create.form.general_description')+asterisk" class="bold mg-top-30">
        </b-form-group>
        <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="prototype.generalDescription"></rich-text>

        <b-form-group :label="$t('prototype.create.form.summary')+asterisk" class="bold mg-top-20"> 
            <b-form-textarea v-model="prototype.description" :rows="4" :max-rows="6" maxlength="280"/>
        </b-form-group>

        <b-form-group :label="$t('prototype.create.form.description')+asterisk" class="bold mg-top-30"> 
            <b-form-textarea v-model="prototype.locationDescription" :rows="4" :max-rows="6" maxlength="280"/>
        </b-form-group>

        <b-row class="mg-top-30">    
            <b-col cols="5">
                <b-form-group :label="$t('prototype.create.form.locality')+asterisk" class="bold">
                    <b-form-select  v-model="selectedLocality">
                        <option v-for="(locality, i) in autocomplets.localities" :key="i" :value="locality" :placeholder="locality.name">{{locality.name}}</option>
                    </b-form-select>
                </b-form-group>
            </b-col>

            <b-col cols="2">
                <br>
                <div class="bold center" style="margin-top: 10px">
                    <b-form-checkbox @change="allLocality = !allLocality" v-model="allLocality" :disabled="!selectedLocality">
                        {{$t('prototype.create.form.all_locality')}}
                    </b-form-checkbox>
                </div>
            </b-col>

            <b-col cols="4">
                <b-form-group :label="$t('prototype.create.form.sub_locality')+asterisk" class="bold">
                    <b-form-select  v-model="selectedNeighborhood" :disabled="allLocality">
                        <option v-for="(neighbor, i) in autocomplets.neighborhood" :key="i" :value="neighbor" :placeholder="neighbor.name">{{neighbor.name}}</option>
                    </b-form-select>
                </b-form-group>
            </b-col>

            <b-col cols="1" style="margin-top: 10px">
                <sipsder-btn :disabled="!selectedLocality" btnType="add" :text="''" @onClick="addLocality()" />
            </b-col>
        </b-row>

        <!-- LOCALITIES -->
        <b-row v-if="localities.length" class="center mg-top-30">
            <b-col cols=8 class="d-flex center-text">
                <b-table responsive striped hover small 
                    class="justify-content-center"
                    :fields="[
                        {key: 'locality', label: 'Localidad', sortable: true},
                        {key: 'subLocality', label: 'Vereda', sortable: true},
                        {key: 'actions', label: 'Acciones'}
                        ]" :items="localities">
                        <!-- Columna definida para la acciones -->
                    <template slot="actions" slot-scope="row">
                        <div  class="d-flex justify-content-center">
                            <sipsder-btn btnType="delete" :text="''" @onClick="deleteLocality(row.index)" />
                        </div>
                    </template>
                </b-table>
            </b-col>
        </b-row>

        <!-- IMAGE ATTACHMENTS -->
        <sipsder-btn class="mg-top-30" btnType="uploadImage" @onClick="showAttachModal('addImageModal')" :text="$t('prototype.create.form.attachment_button')" ></sipsder-btn><span style='color: red'>*</span>
        
        <b-row v-if="imageSelected != null">
            <div class="w-100 box">                
                <template v-if="imageSelected.type == 'Video' && !isVideoYT(imageSelected.url)">
                <iframe class="w-100" height="450" :src="imageSelected.url"></iframe>
                </template>
                <template v-else>
                <img v-if="imageSelected.type != 'Video'"
                    :src="getImgURL(imageSelected.url)" 
                    :alt="'Image'" class="w-100" style="height: 450px">
                <iframe v-else :src="getImgURL(imageSelected.url)" 
                    :alt="'Video'" class="w-100" style="height: 450px"></iframe>
                </template>
            </div>
            </b-row>
            <carousel :perPageCustom="[[480, 1], [768, 2], [1024, 3]]" :navigationEnabled="true">
            <slide v-for="(image, i) in showedAttachments" :key="i">
                <template v-if="image.type == 'Video' && !isVideoYT(image.url)" >
                <div style="position: relative; width: 150px; height: 150px;" class="center box">
                    <iframe class="center box" style="width: 150px; height: 150px;" :src="image.url"></iframe>
                    <div class="cover" @click="imageSelected = image"></div>
                </div>
                </template>
                <template v-else>
                <img
                    @click="imageSelected = image"
                    :src="(image.type === 'Video') ? getImageYT(image.url) : getImgURL(image.url)"
                    :alt="'Image'"
                    style="width: 150px; height: 150px;"
                    class="box"
                >
                </template>
            </slide>
            </carousel>
            <b-row>
            <div class="w-100 center">
                <div
                class="w-30"
                v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`) && attachments[`${imageSelected.id}`][0]"
                >
                <b-form-radio-group
                    v-model="attachments[`${imageSelected.id}`][1]"
                    @input="selectPrincipal"
                >
                    <b-form-radio :value="true">Principal</b-form-radio>
                </b-form-radio-group>
                </div>
                <div
                @click="showModal('deleteImage')"
                class="w-30"
                v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`)"
                >
                <div>
                    <i class="fas fa-times"></i>
                    {{$t('news.create.eliminate')}}
                </div>
                </div>
            </div>
        </b-row>

      <!-- END IMAGE ATTACHMENTS -->

        <div v-if="!isEnabledAttachments" class="flex mg-top-30">
            <sipsder-btn btnType="back" @onClick="showModal('cancelModal')" :text="$t('prototype.create.form.back')" ></sipsder-btn>
            <sipsder-btn btnType="add" @onClick="saveAndEnableDocuments()" :text="$t('prototype.create.form.save_attachment')" ></sipsder-btn>
            <sipsder-btn btnType="save" @onClick="savePrototype(false)" :text="$t('prototype.create.form.save_no_attachment')" ></sipsder-btn>
        </div>

        <!-- BEGIN DOCUMENTS -->

        <div class="mg-top-30" v-if="isEnabledAttachments">
            <hr>
            <div class="mg-top-30 flex-even">
                <h3 class="bold">{{$t('prototype.create.document.title')}} <span style='color: red'>*</span> </h3>
                <sipsder-btn btnType="add" @onClick="showModal('documentModal')" :text="$t('prototype.create.document.add_button')" ></sipsder-btn>
            </div>

            <b-row v-if="surveys" class="mg-top-30">
                <b-col cols="6">
                    <b-form-checkbox @change="isSurveyEnable = !isSurveyEnable" v-model="isSurveyEnable">{{$t('prototype.create.document.survey_check')}}</b-form-checkbox>
                </b-col>
                <b-col cols="6">
                    <b-form-group  class="bold">
                        <b-form-select  v-model="prototype.survey" :disabled="!isSurveyEnable">
                            <option v-for="(survey, i) in surveys" :key="i" :value="survey.id" :placeholder="survey.title">{{survey.title}}</option>
                        </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="center">
                <b-col cols="5" v-for="(document,i) in documents" :key="`${i}-${document}`"  class="mg-top-30 box" style="height: 26vh; padding: 3px">
                    <div style="height: 5vh; padding: 3px">
                        <h3 class="bold">{{document.title}}</h3> 
                    </div>
                    <div style="height: 13vh; padding: 3px; overflow: auto">{{document.summary}}</div>
                    <div class="flex-even" style="height: 5vh">
                        <sipsder-btn v-if="document.ext == 'application/pdf'" btnType="preview" @onClick="previewDocument(document)" :text="$t('prototype.create.document.view')" ></sipsder-btn>
                        <!-- <sipsder-btn v-else btnType="download" @onClick="downloadDocument(document)" :text="$t('prototype.create.document.download')" ></sipsder-btn> -->
                        <download-document v-else :id="document.id"></download-document>
                        <div>
                            <sipsder-btn btnType="delete" @onClick="deleteDocument(document, i)" :text="''" ></sipsder-btn>
                            <!-- <sipsder-btn btnType="edit" @onClick="editDocument(document)" :text="''" ></sipsder-btn> -->
                        </div>
                    </div>
                </b-col>
            </b-row>

            <div v-if="isEnabledAttachments" class="center mg-top-30">
                <sipsder-btn btnType="back" @onClick="showModal('cancelModal')" :text="$t('prototype.create.form.back')" ></sipsder-btn>
                <sipsder-btn btnType="add" @onClick="savePrototype(true)" :text="$t('prototype.create.document.save')" ></sipsder-btn>
            </div>
            
        </div>



    </div>
    

</div>
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS, DOCUMENT } from '../../../../sipsder_constants'; 
import { GEOGRAPHY_TYPE, SURVEY_STATUS, SURVEY_STATUS_LABEL, TARGET_AUDIENCE, ATTACHMENT_TYPE  } from '../../../../domain_constants';
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import TableSelect from "@/components/shared/TableSelect";
import RichText from '../../../shared/RichText.vue'
import VAPI from "../../../../http_common";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import Audiovisualmedia from "@/components/views/audiovisual_media/AudioVisualIndex.vue";
import DownloadDocument from "../../../shared/DownloadDocument.vue";
import { Carousel, Slide } from "vue-carousel";
import moment from "moment";
import S_UTIL from "@/util/sipsder_util";

export default {

    components: {
        VueBootstrapTypeahead,
        "s-table-select": TableSelect,
        RichText,
        datepicker: Datepicker,
        Audiovisualmedia,
        Carousel,
        Slide,
        DownloadDocument
    },

    data(){
        return {
            asterisk: "<span style='color: red'>*</span>",
            languages: lang,
            formErrors: [],
            //For localities
            selectedLocality: null,
            selectedNeighborhood: null,
            allLocality: true,
            localities: [],
            //For Image Attachments
            index: 0,
            showAttachmentModal: false,
            attachments: {},
            showedAttachments: [],
            imageSelected: null,
            //For Document Attachments
            isEnabledAttachments: false,
            withDocuments: false,
            fileSizeError: false,
            fileExtError: false,
            //
            date: null,
            isEditing: false,
            surveys: null,

            localityIds: [],
            subLocalityIds: [],

            //FOR THE DOCUMENTS
            isSurveyEnable: false,
            document: {
                id: null,
                filename: null,
                title: '',
                summary: '',
                ext: null
            },
            documents: [],

            hasInitDocuments: false,

            file: {},
            filename: null,
            errorDoc: false,
            /////
            prototypeId: null,

            initialAttachments: [],
            initialGeographies: [],
            initialDocuments: [],

            prototype:{
                state: true,
                reason: '',
                name: '',
                date: null,
                generalDescription: '',
                description: '',
                locationDescription: '',
                survey: null,
                geographies: [],
                attachments: [],
                attachmentsPrincipal: [],
                documents: [],
                deletedAttachments: [],
                deletedGeographies: [],
                deletedDocuments: []
            },

            autocomplets: {
                localities: [],
                neighborhood: []
            },

            message: this.$t("news.create.message"),
            customToolbar: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ['link', 'image', 'video', 'formula'],
                [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }]
            ],
        }
    },
    computed:{
        currentLocale() {
            return this.$i18n.locale;
        },
        isLogged() {
            return this.$store.getters.isAuthenticated
        },
    },
     watch:{
        'selectedLocality.id': function (newVal, oldVal){
            if(newVal)
                this.loadNeighborhoods(newVal);
        },
        'attachments': function (newVal, oldVal){
            if(newVal) {
                // console.info('CAMBIO ATTACH', this.attachments)
            }
        }
    },
    methods:{
        getImgURL(url) {
            return S_UTIL.getImgURL(url)
        },
        getVideoURL () {
            return S_UTIL.getImgURL(url)
        },
        isVideoYT(url) {
            return url.indexOf("youtube") !== -1;
        },
        getImageYT(url) {
            var res = url.split("/");
            var rel = res[4].split("?");
            return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
        },
        goPrototypes(){
            this.$router.push({
                name: 'PrototypesIndex'
            })
        },
        showAttachModal(ref) {
            this.showAttachmentModal = true;
            this.$refs[ref].show();
        },
        closeAttachModal(ref) {
            this.showAttachmentModal = false;
            this.$refs[ref].hide();
        },
        showModal(ref) {
            this.$refs[ref].show();
        },
        closeModal(ref) {
            this.$refs[ref].hide();
        },
        changeValueDescription(value){
            this.prototype.generalDescription = value
        },
        previewDocument(document){
            let routeData = this.$router.resolve({
                name: 'PrototypesDocument',
                params: { id: document.id }
            });
            window.open(routeData.href, '_blank');
        },
        async downloadDocument(doc){
            let justification = {};
            justification["document"] = doc.filename
            justification["page"] = this.$router.currentRoute.name
            try{
                let response = await VAPI.post(`/${SERVICE_NAMES.DOCUMENTS}/download`, justification , {
                    responseType: "blob",
                });
                let response2 = await VAPI.get(`/${SERVICE_NAMES.DOCUMENTS}/download/${doc.id}`)
                let filename = null;
                if (response2.status == HTTP_STATUS.OK){
                    filename = response2.data.filename;
                }

                let url = window.URL.createObjectURL(new Blob([response.data]));
                let link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${filename}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }catch(error){
                console.log(error);
            }
        },
        buildQuerySurvey() {
            const toTwoDigits = num => num < 10 ? '0' + num : num;
            let today = new Date( );
            let date = today.getFullYear()+"-"+toTwoDigits(today.getMonth()+1)+"-"+toTwoDigits(today.getDate());

            let query = '?page=' + 0  + '&size=' + 1000;

            query += '&status=' + SURVEY_STATUS.PUBLISHED;
            query += '&enabled=true';
            query += '&target=' + TARGET_AUDIENCE.EVERYONE 
                + ',' + TARGET_AUDIENCE.AUTHENTICATED + ',' + 
                TARGET_AUDIENCE.SPECIFIC + ',' + 
                TARGET_AUDIENCE.PROTECTED;

            query += '&sort=lastModifiedDate,desc'

            return query;
        },
        deleteDocument(doc, i){
            this.documents.splice(i, 1);
            // this.prototype.documents.splice(this.prototype.documents.indexOf(doc.id), 1);
            this.prototype.deletedDocuments.push(doc.unhashedId);
        },
        editDocument(){},
        loadFile(e) {
            if(e.target.files[0].size <= DOCUMENT.MAX_SIZE){
                this.errorDoc = false;
                this.file = e.target.files[0];
                this.filename = e.target.files[0].name;
                this.document.ext = 'other'
                this.fileSizeError = false;
                this.fileExtError = false;
                this.fileError = false;
            } else{
                this.fileSizeError = true;
                this.fileExtError = false;
                this.fileError = true;
            }
        },  
        loadPdfFile(e) {
            if(e.target.files[0].type === "application/pdf"){
                if(e.target.files[0].size <= DOCUMENT.MAX_SIZE){
                    this.errorDoc = false;
                    this.file = e.target.files[0];
                    this.filename = e.target.files[0].name;
                    this.document.ext = 'pdf'
                    this.fileSizeError = false;
                    this.fileExtError = false;
                    this.fileError = false;
                }else{
                    this.fileSizeError = true;
                }
            }else{
                this.fileExtError = true;
                this.fileError = true;
            }
        },
        addLocality(){
            if(this.selectedNeighborhood){
                if(!this.subLocalityIds.includes(this.selectedNeighborhood.id)){
                    this.subLocalityIds.push(this.selectedNeighborhood.id);
                    this.localityIds.push(this.selectedNeighborhood.id);
                    this.localities.push({
                        locality: this.selectedLocality.name,
                        subLocality: this.selectedNeighborhood ? this.selectedNeighborhood.name : 'TODA',
                        localityId: this.selectedLocality.id,
                        subLocalityId: this.selectedNeighborhood ? this.selectedNeighborhood.id : 0
                    })
                }
            }else if(!this.localityIds.includes(this.selectedLocality.id)){
                this.localityIds.push(this.selectedLocality.id);
                this.localities.push({
                    locality: this.selectedLocality.name,
                    subLocality: this.selectedNeighborhood ? this.selectedNeighborhood.name : 'TODA',
                    localityId: this.selectedLocality.id,
                    subLocalityId: this.selectedNeighborhood ? this.selectedNeighborhood.id : 0
                })
            }
            this.selectedLocality = null;
            this.selectedNeighborhood = null;
            this.allLocality = true;
        },
        deleteLocality(index){
            this.localities.splice(index, 1)
        },
        saveAndEnableDocuments(){
            //this.savePrototype(true);
            this.isEnabledAttachments = true;
        },
        async loadNeighborhoods(locality){
            //GET NEIGHBORHOOD
            try {
                let path = `${SERVICE_NAMES.GEOGRAPHY}/parent/${this.selectedLocality.id}`;
                let response = await VAPI.get( path );
                if (response.status == HTTP_STATUS.OK){
                    this.autocomplets.neighborhood = response.data;
                }
            } catch (error) {
                console.info("Fallo al obtener Veredas", error);
            }
        },
        created_image(response) {
            this.closeModal("addImageModal");
            let image = _.find(this.showedAttachments, { id: response[0] });
            if (!image) {
                this.showedAttachments.push({
                    id: response[0],
                    url: response[1],
                    type: response[2]
                });
                if (this.showedAttachments.length === 1) {
                this.attachments["" + response[0]] = [true, true];
                this.imageSelected = this.showedAttachments[this.index];
                } else {
                this.attachments["" + response[0]] = [true, false];
                }
            }
        },
        deleteAttachment(image) {
            
            delete this.attachments[image.id];
            let i = 0;
            for (let index = 0; index < this.showedAttachments.length; index++) {
                if (this.showedAttachments[index].id == image.id) i = index;
            }
            this.showedAttachments.splice(i, 1);
            let principal = false;
            Object.keys(this.attachments).forEach(a => {
                if (this.attachments[a][1]) principal = true;
            });

            if (!principal && Object.keys(this.attachments).length > 0)
                this.attachments[Object.keys(this.attachments)[0]][1] = true;

            if (this.showedAttachments.length > 0) {
                this.imageSelected = this.showedAttachments[0];
            } else {
                this.imageSelected = null;
            }
            this.closeModal("deleteImage");
        },
        selectPrincipal(checked) {
            this.attachments["" + this.imageSelected.id][1] = checked;
            let self = this;
            if (checked) {
                Object.keys(this.attachments).forEach(k => {
                if (k + "" !== "" + this.imageSelected.id) {
                        this.attachments["" + k][1] = false;
                    }
                });
            }
        },
        
        validateAndSetData(){

            this.formErrors = [];

            //Name validate
            if(this.prototype.name.length < 4 || this.prototype.name.length > 180){
                this.formErrors.push(this.$t('prototype.create.form.name_error'));
            }

            if(!this.prototype.state && (!this.prototype.reason || this.prototype.reason.length < 1)){
                this.formErrors.push(this.$t('prototype.create.form.reason_error'));   
            }

            //Date set and validate
            if(!this.date){
                this.formErrors.push(this.$t('norm.create.form.date_error'));
            }else{
                this.prototype.date = moment(this.date).valueOf();
            }

            //General Description validate
            if(this.prototype.generalDescription.length < 1){
                this.formErrors.push(this.$t('prototype.create.form.gen_description_error'));
            }

            //Description validate
            if(this.prototype.description.length < 1 || this.prototype.description.length > 280){
                this.formErrors.push(this.$t('prototype.create.form.summary_error'));
            }

            //Description validate
            if(this.prototype.locationDescription.length < 1 || this.prototype.locationDescription.length > 280){
                this.formErrors.push(this.$t('prototype.create.form.description_error'));
            }

            //Localities map and validate
            if(this.localities.length > 0){
                this.prototype.geographies = [];
                this.localities.forEach(element => {
                    if(!this.prototype.geographies.includes(element.localityId)){
                        this.prototype.geographies.push(element.localityId);
                    }
                    if(!this.prototype.geographies.includes(element.subLocalityId) && element.subLocalityId != 0){
                        this.prototype.geographies.push(element.subLocalityId);
                    }
                });
            }else{
                this.formErrors.push(this.$t('prototype.create.form.locality_error'));
            }

            //Attachments map and validate
            if(Object.keys(this.attachments).length == 0){
                this.formErrors.push(this.$t('prototype.create.form.attachment_error'));
            }else{
                this.prototype.attachments = [];
                this.prototype.attachmentsPrincipal = [];
                for(var key in this.attachments){
                    this.prototype.attachments.push(Number(key));
                    this.prototype.attachmentsPrincipal.push(this.attachments[key][1]);
                }
            }
    
            // if(this.$route.params.id && this.$route.params.id != 0){
            //     if(this.withDocuments && this.initialDocuments.length < 1){
            //         this.formErrors.push(this.$t('prototype.create.document.error'));
            //     }
            // }else{
            //     if(this.withDocuments && this.prototype.documents.length < 1){
            //         this.formErrors.push(this.$t('prototype.create.document.error'));
            //     }
            // }


            //deleted localities
            if(this.initialGeographies.length){
                this.initialGeographies.forEach(e => {
                if(!this.prototype.geographies.includes(e) && !this.prototype.deletedGeographies.includes(e)){
                    this.prototype.deletedGeographies.push(e);
                    }
                });
            }

            //deleted attachments
            if(this.initialAttachments.length){
                this.initialAttachments.forEach(e => {
                if(!this.prototype.attachments.includes(e) && !this.prototype.deletedAttachments.includes(e)){
                    this.prototype.deletedAttachments.push(e);
                    }
                });
            }

            //Survey disabled
            if(!this.isSurveyEnable){
                this.prototype.survey = null;
            }

            return this.formErrors.length < 1;
        },
        async savePrototype(hasDocuments){
            this.withDocuments = hasDocuments;
            if(this.validateAndSetData()){
                this.showModal('confirmationModal');
            }else{
                this.showModal('errorModal');
            } 
        },
        async confirmedSave(){
            if(this.isEditing){
                let response = null;
                try{
                    const response = await VAPI.put(`/${SERVICE_NAMES.PROTOTYPE}/admin/${this.prototypeId}`, this.prototype);
                    if(response.status == 200){
                        this.prototypePosted = response;
                        this.showModal('savedModal')
                    }else{
                        this.showModal('badRequestModal');
                    }
                }catch(e){
                    console.info(e)
                    this.showModal('badRequestModal');
                }
            }else {
                try{
                let response = await VAPI.post(`/${SERVICE_NAMES.PROTOTYPE}/admin`, this.prototype)
                    if(response.status == 200){
                        this.prototypePosted = response;
                        this.showModal('savedModal')
                    }else{
                        this.showModal('badRequestModal');
                    }
                }catch(e){
                    this.showModal('badRequestModal');
                }
            }
        },
        assemblePayload() {
            let formData = new FormData();

            formData.append( 'name', this.filename);
            formData.append( 'author', '' );
            formData.append( 'url', '' );
            formData.append( 'type', 'public_without_signature');
            formData.append( 'file',  this.file );
            formData.append( 'title', this.document.title);
            formData.append( 'summary', this.document.summary);
            formData.append( 'enabled', true );          
                        
            return formData;
        },
        deleteFile(){
            this.closeModal('documentModal')
            this.fileSizeError = false;
            this.fileExtError = false;
            this.file = {};
            this.filename = null;
            this.document = {
                    id: null,
                    filename: null,
                    title: '',
                    summary: '',
                    ext: null
                }
        },
        async saveDocument(){
            let valid = await this.$validator.validateAll();

            if(valid){
                let response = null;
                let assembled = this.assemblePayload();
                try{
                    response = await VAPI.post(`/${SERVICE_NAMES.PROTOTYPE}/upload-document`, assembled, { headers: { 'Content-Type': 'multipart/form-data' } } );
                    if(response.status == 200){
                        this.documents.push({
                            id: response.data.hashedId,
                            filename: response.data.name,
                            title: response.data.title,
                            summary: response.data.summary,
                            ext: response.data.format
                        });
                        this.prototype.documents.push(response.data.id);
                        this.deleteFile();
                    }
                }catch(e){
                    console.log(e)
                }
            }
        }
    },
    async beforeMount(){
        if(this.$route.params.id && this.$route.params.id != 0){
            let result = await VAPI.get(`/${SERVICE_NAMES.PROTOTYPE}/admin/${this.$route.params.id}`);
            this.isEditing = true;
            let fetchData = result.data;
            this.prototypeId = this.$route.params.id;

            this.prototype.state = fetchData.state;
            this.prototype.reason = fetchData.reason;
            this.prototype.name =  fetchData.name;
            this.date = fetchData.date;
            this.prototype.generalDescription = fetchData.generalDescription;
            this.prototype.description = fetchData.description;
            this.prototype.locationDescription =  fetchData.locationDescription;
            if(fetchData.survey){
                this.prototype.survey = fetchData.survey.id;
                this.isSurveyEnable = true;
            } 
            if(this.prototype.reason == null){
                this.prototype.reason = '';
            }

            //SET GEOGRAPHIES
            let geoIds = [];
            fetchData.geographies.forEach(geo => {
                this.initialGeographies.push(geo.id);
                geoIds.push(geo.id);
            });
            let parents = [];
            for(let i=0; i<geoIds.length; i++){
                if(geoIds.includes(fetchData.geographies[i].parentId)){
                    if(!parents.includes(fetchData.geographies[i].parentId)){
                        parents.push(fetchData.geographies[i].parentId);
                    }
                    this.localities.push({
                        locality: fetchData.geographies[geoIds.indexOf(fetchData.geographies[i].parentId)].name,
                        subLocality: fetchData.geographies[i].name,
                        localityId: fetchData.geographies[geoIds.indexOf(fetchData.geographies[i].parentId)].id,
                        subLocalityId: fetchData.geographies[i].id
                    })
                }else{
                    this.localities.push({
                        locality: fetchData.geographies[i].name,
                        subLocality: 'TODA',
                        localityId: fetchData.geographies[i].id,
                        subLocalityId: 0
                    })
                }
            }
            parents.forEach(parent => {
                this.localities.splice(geoIds.indexOf(parent), 1);
            });
            //SET ATTACHMENTS
            fetchData.attachments.forEach(att => {
                this.initialAttachments.push(att.id);
                this.prototype.attachments.push(att.id);
                this.showedAttachments.push({
                    id: att.id,
                    url: att.url,
                    type: att.typeName
                });
                this.attachments["" + att.id] = [true, att.status];
            })
            if (this.showedAttachments.length > 0){
                this.imageSelected = this.showedAttachments[0];
            }

            //SET DOCUMENTS
            if(fetchData.documents.length > 0){
                this.isEnabledAttachments = true;
                fetchData.documents.forEach(doc => {
                    this.initialDocuments.push(doc.id);
                    // this.prototype.documents.push(doc.id);
                    this.hasInitDocuments = true
                    this.documents.push({
                            id: doc.hashedId,
                            unhashedId: doc.id,
                            filename: doc.name,
                            title: doc.title,
                            summary: doc.summary,
                            ext: doc.format
                        });
                })
            }


        }
        //GET LOCALITIES
        try {
            let path = `${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`;
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.localities = response.data;
            }
        } catch (error) {
            console.info("Fallo al obtener Localidades", error);
        }

        //GET SURVEYS
        try {
            const response = await VAPI.get(SERVICE_NAMES.SURVEY + this.buildQuerySurvey());
            if (response.status == HTTP_STATUS.OK){
                this.surveys = response.data.data;
            }
        } catch (error) {
            console.info("Fallo al obtener Localidades", error);
        }

    }
    
}
</script>

<style scoped>
.fa-times{
    color: red;
    font-size: 2rem;
    padding: 0 10px;
}

.center-text{
    text-align: center;
}
.inline * {
  display: inline-block;
}
.error {
  color: red;
  width: 100%;
}
.red{
    color: red;
}
.bold {
  font-weight: bold;
}
.rigth{
    text-align: end;
}
.w-100 {
  width: 100%;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box{
    margin: 10px;
    border: 1px solid black;
    border-radius: 5px;
}
.flex{
  display: flex;
  justify-content: space-evenly;
}
.flex-even{
    display: flex;
    justify-content: space-between;
}
.mg-top-10 {
  margin-top: 10px;
}
.mg-top-30 {
  margin-top: 30px;
}
.message {
  font-size: 1.5rem;
}

</style>
