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
              <p v-for="(error,i) in errors.items" :key="'item'+i"> {{error.msg}} </p>
              <p v-for="(error,i) in formErrors" :key="'form'+i"> {{error}} </p>
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
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goNormogram()" />
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
              <p> {{$t('norm.create.popup.save')}} </p>
              <p> {{$t('norm.create.popup.confirmation')}} </p>
            </div>
            <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="saveNorm()" />
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
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goNormogram()" />
              </b-col>
        </b-row>
    </b-modal>

    <!-- TITULO -->
    <sipsder-title :title="$t('norm.create.title')" type="admin"></sipsder-title>

    <!-- DESCRIPTION -->
    <div class="w-100 message">
      <p>{{ $t('norm.create.claim') }}</p>
    </div>
    <div class="mg-top-50"/>
    <p v-if="isEditing" class="font-weight-bold">{{$t('norm.create.created_by_user')}}</p>
    <div class="font-weight-bold">
      <div class="wrap-between">
        <div v-if="!isEditing" class="w-50" />
        <div v-if="isEditing" class="w-50">
          <p class="boxed-text">{{userName}}</p>
        </div>
        <b-form-checkbox
          @change="enableNorm()"
          v-model="norm.status"
          class="text-h3"
        >{{$t('norm.create.enabled')}}</b-form-checkbox>
      </div>
    </div>

    <!-- BEGIN THE FORM -->
    <div class="form-container">
      <div v-show="!norm.status" class="w-100 mg-top-30">
        <b-form-group
          :label="$t('norm.create.form.reason')+asterisk"
          label-class="font-weight-bold"
        >
          <b-textarea
            v-model="norm.reason"
            :rows="3"
            :max-rows="6"
            v-validate="'required|min:8|max:180'"
            name="norm_reason"
            maxlength="180"
            :data-vv-as="$t('norm.create.form.reason')"
            :disabled="norm.status"
          />
        </b-form-group>
        <span class="error">{{ errors.first('norm_reason') }}</span>
      </div>

      <div class="mg-top-50">
        <h2 class="font-weight-bold">{{ $t('norm.create.load_norm') }}</h2>
        <div class="inline mg-top-20">
        
          <input type="file"
              name="register_template"
              @change="loadFile($event)" 
              ref="uploadDocument"
              style="display: none"
              data-vv-as="icono"/>
            <sipsder-btn btnType="uploadImage" 
              :text="$t( 'document_upload.upload_file' )"
              @onClick="$refs.uploadDocument.click()">                                            
            </sipsder-btn>
          
          <div class="mg-left-10p">
            <sipsder-btn btnType="delete" @onClick="deleteFile()"></sipsder-btn>
            <h4 v-if="fileName" class="mg-left-20">{{fileName}}</h4>
            <h4 v-if="!fileName" class="mg-left-20">{{$t('norm.create.form.no_file')}}</h4>
          </div>
        </div>
        <div class="mg-top-20"/>
        <span v-if="errorDoc" class="error">{{$t('norm.create.form.doc_error')}}</span>
      </div>

      <b-form-group
        class="mg-top-30"
        :label="$t('norm.create.form.url')"
        label-class="font-weight-bold"
      >
        <b-form-input type="text" v-model="document.urlSource" v-validate="'max:800|url'" name="norm_url" :data-vv-as="$t('norm.create.form.url_field')"/>
        <span class="error">{{ errors.first('norm_url') }}</span>
      </b-form-group>

      <div class="mg-top-30 wrap-start">
        <div class="w-40">
          <b-form-group
            label-class="font-weight-bold"
            :label="$t('norm.create.form.type')+asterisk"
            :invalid-feedback="errors.first('norm.create.form.type')"
          >
            <b-form-select
              v-model="norm.typeId"
              name="norm_type"
              :data-vv-as="$t('norm.create.form.type')"
            >
              <option v-for="(type,i) in types" :key="i" :value="type.id">{{type.value}}</option>
            </b-form-select>
            <span class="error">{{ errors.first('norm.create.form.type') }}</span>
          </b-form-group>
        </div>

        <div class="w-30 mg-left-20">
          <b-form-group
            :label="$t('norm.create.form.code')+asterisk"
            label-class="font-weight-bold"
          >
            <b-form-input
              type="text"
              v-model="norm.code"
              name="norm_code"
              v-validate="'required|min:1|max:50'"
              maxlength="50"
              :data-vv-as="$t('norm.create.form.code')"
            />
            <span class="error">{{ errors.first('norm_code') }}</span>
          </b-form-group>
        </div>

        <div class="w-30 mg-left-20">
          <b-form-group
            :label="$t('norm.create.form.date')+asterisk"
            label-class="font-weight-bold"
          >
            <datepicker
              :placeholder="$t('util.insertDate')"
              v-model="date"
              v-validate="'required|nonFutureDate'"
              class="date-picker"
              :language="languages[ currentLocale ]"
              :calendar-button="true"
              calendar-button-icon="fa fa-calendar"
              :clear-button="true"
              :disabled-dates="{ from: new Date() }"
            ></datepicker>
          </b-form-group>
        </div>
      </div>

    <!-- ENTIDAD ENCARGADA -->
      <div v-if="autocomplets.institutions.length" class="mg-top-30 font-weigth-bold">
        <s-table-select
            v-model="documentList.institutions"
            :label="$t('document.admin.listLabels.institution')+asterisk"
            :labelBold="true"
            labelSelect="name"
            :options="autocomplets.institutions"
            :tableFields="documentListFields.institution"
        ></s-table-select>  
        <span class="error">{{ errors.first('document.admin.listLabels.institution') }}</span>     
      </div>
    
      <!-- Rural policy -->
      <b-form-group
        :label="$t('norm.create.form.have_rural_policy')"
        label-cols="10"
        label-class="font-weight-bold"
        horizontal
        class="mt-2 form-group required"
      >
        <b-form-radio-group
          class="text-right"
          v-model="norm.politic"
          name="ruralPolicy"
          v-validate="'required'"
          :data-vv-as="$t('norm.create.form.rural_policy')">
          <b-form-radio :value="true">{{$t('util.yes')}}</b-form-radio>
          <b-form-radio :value="false">{{$t('util.no')}}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group
        v-show="norm.politic"
        class="mt-2 required"
        label-class="font-weight-bold"
        :label="$t('norm.create.form.policy_name')"
      >
        <b-form-input
          name="policyName"
          type="text"
          :data-vv-as="$t('norm.create.form.policy_name')"
          v-validate="'required|max:150'"
          v-model="norm.policyName"
          :disabled="!norm.politic"
        />
        <span class="error" v-show="errors.has('policyName')">{{ errors.first('policyName') }}</span>     
      </b-form-group>

    <!-- RURAL MODEL -->
      <div v-if="autocomplets.ruralTheme.length" class="mg-top-30 font-weigth-bold">
        <s-table-select
            v-model="documentList.ruralModels"
            :label="$t('document.admin.listLabels.ruralModel')+asterisk"
            :labelBold="true"
            :treeselect="true"
            :options="autocomplets.ruralTheme"
            :tableFields="documentListFields.ruralTheme"
            :clearable="true"
            :disableBranch="true"
        ></s-table-select> 
        <span class="error">{{ errors.first('document.admin.listLabels.ruralModel') }}</span>     
      </div>

      <div class="mg-top-30">
        <b-form-group
          :label="'Tags' + TEMPLATES.MANDATORY_SYMBOL"
          label-class="font-weight-bold"
        >
          <tags-input
              v-model="tag"
              :placeholder="$t('norm.create.form.tags_enter')"
              :tags="tags"                       
              @tags-changed="newTags => tags = newTags"
          ></tags-input>
        </b-form-group>
        <!--<span class="error">{{ errors.first('util.obligatorySymbol') }}</span>-->     
      </div>

      <div class="center-text mg-top-40">
        <sipsder-btn :btnType="'back'" @onClick="showModal('cancelModal')" :variant="'info'"></sipsder-btn>
        <sipsder-btn :btnType="'save'" @onClick="showModal('confirmationModal')" :variant="'info'"></sipsder-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS, DOCUMENT, TEMPLATES } from '../../../sipsder_constants';
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import TableSelect from "@/components/shared/TableSelect";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import VAPI from "../../../http_common";
import moment from "moment";


export default {
  components: {
    VueBootstrapTypeahead,
    datepicker: Datepicker,
    "s-table-select": TableSelect,
  },
  data() {
    return {
        TEMPLATES:TEMPLATES,
        documentListFields: {
                ruralTheme: [
                    {
                        key: 'structure',
                        label: this.$t('document.admin.tableTitles.ruralModel.structure'),
                        sortable: true,
                    },
                    {
                        key: 'component',
                        label: this.$t('document.admin.tableTitles.ruralModel.component'),
                        sortable: true,
                    },
                    {
                        key: 'subComponent',
                        label: this.$t('document.admin.tableTitles.ruralModel.subcomponent'),
                        sortable: true,
                    },
                    {
                        key: 'status',
                        label: this.$t('document.admin.tableTitles.ruralModel.main'),
                        sortable: true,
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
                institution: [
                    {
                        key: 'name',
                        label: this.$t('document.admin.tableTitles.institution.institution'),
                        sortable: true,
                    },
                    {
                        key: 'actions',
                        label: ""
                    }
                ],
            },

        autocomplets: {
                ruralTheme: [],
                institutions: [],
            },
        documentList: {
          ruralModels: [],
          institutions: [],
        },

      file: {},

      types: [],

      date: null,

      languages: lang,
      asterisk: "<span style='color: red'>*</span>",

      statusDisplay: this.$t("norm.create.enabled"),

      isEditing: false,
      tag: '',
      tags: [],
      errorDoc: false,
      formErrors: [],

      userName: null,
      normId: null,
      normPosted: null,
      fileName: null,

      initialInstitutions: [],
      initialRuralModels: [],

      document: {
        author: null,
        urlSource: null,
      },

      norm: {
        code: '',
        reason: '',
        date: null,
        tags: [],
        status: true,
        politic: null,
        institutions: [],
        ruralModels: [],
        ruralModelsPrincipal: [],
        typeId: null,
        deletedInstitutions: [],
        deletedRuralModels: []
      }
    };
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale;
    }
  },
  methods: {
    showModal(ref) {
      this.$refs[ref].show();
    },
    closeModal(ref) {
      this.$refs[ref].hide();
    },
    goNormogram(){
      this.$router.push( { 
        name: 'NormogramIndex'
        } );
    },
    loadFile(e) {
      if(e.target.files[0].type === "application/pdf" && e.target.files[0].size <= DOCUMENT.MAX_SIZE){
        this.errorDoc = false;
        this.file = e.target.files[0];
        this.fileName = this.file.name;
      } else{
        this.errorDoc = true;
      }
    },
    deleteFile(){
      this.file = {};
      this.errorDoc = false;
      if (this.normId) {
        this.fileName = this.$t('norm.create.loaded_file');
      } else {
        this.fileName = null;
      }
    },
    enableNorm() {
      this.norm.status = !this.norm.status;
      if (this.norm.status) {
        this.norm.reason = "";
      }
    },
    toRuralFormat(ruralList) {
            
            ruralList.forEach(level1=>{

                // level1.theme = level1.label;
                if (level1.children){
                    level1.children.forEach(level2 => {
                        
                        level2.structure = level2.label;
                        if (level2.children){

                            level2.children.forEach(level3 => {
                                level3.structure = level2.label;
                                level3.component = level3.label;

                                if (level3.children){

                                    level3.children.forEach(level4 => {
                                        level4.structure = level2.label;
                                        level4.component = level3.label;
                                        level4.subComponent = level4.label;
                                    });
                                }
                            });
                        }
                    });
                }
            });

            return ruralList;
        },
    async validateFormData(){
      this.formErrors = [];
      const result = await this.$validator.validateAll();
      //Document validate
      if(this.errorDoc){
        this.formErrors.push(this.$t('norm.create.form.file_error'));
      }else if(!this.fileName){
        this.formErrors.push(this.$t('norm.create.form.file_empty'));
      }
      // Norm type validate
      if(!this.norm.typeId){
        this.formErrors.push(this.$t('norm.create.form.type_error'));
      }
      // Norm code
      if(this.norm.code ? this.norm.code.length < 1 : false) {
        this.formErrors.push(this.$t('norm.create.form.code_error'));
      }
      //map date and validate
      if(!this.date){
        this.formErrors.push(this.$t('norm.create.form.date_error'));
      }else{
        this.norm.date = moment(this.date).valueOf();
      }
      //Rural model map and validate
      if(this.documentList.ruralModels.length < 1){
        this.formErrors.push(this.$t('norm.create.form.rural_model_error'));
      }else{
        this.norm.ruralModels = [];
        this.documentList.ruralModels.map(element => {
          this.norm.ruralModels.push(element.id);
        });
      }
      //deleted rural models
      if(this.initialRuralModels){
        this.initialRuralModels.forEach(e => {
          if(!this.norm.ruralModels.includes(e)){
            this.norm.deletedRuralModels.push(e);
          }
        });
      }
      //Instituions map and validate
      if(this.documentList.institutions.length < 1){
        this.formErrors.push(this.$t('norm.create.form.institutions_error'));
      }else{
        this.norm.institutions = [];
        this.documentList.institutions.map(element => {
          this.norm.institutions.push(element.id);
        });
      }
      //deleted intitutions
      if(this.initialInstitutions){
        this.initialInstitutions.forEach(e => {
          if(!this.norm.institutions.includes(e)){
            this.norm.deletedInstitutions.push(e);
          }
        });
      }
      //Rural model principal map and validate
      var principals = new Array(this.norm.ruralModels.length).fill(false);
      for(let i=0; i<principals.length; i++){
        if(this.documentList.ruralModels[i].status){
          principals[i] = true;
        }
      }
      this.norm.ruralModelsPrincipal = principals;
      //Tags map and validate
      if(this.tags.length < 1){
        this.formErrors.push(this.$t('norm.create.form.tags_error'));
      }else{
        this.norm.tags = [];
        this.tags.map(element => {
          this.norm.tags.push(element.text);
        });
      }

      if(this.formErrors.length < 1){
        await this.$validator.validate().then( valid => {
          if( valid ) {
            this.validForm = true;
            return true;
            }
          });
        }
        return this.validForm;
    },
    assemblePayload() {
      let formData = new FormData();

      formData.append( 'file',  this.file );
      formData.append( 'document', JSON.stringify(this.document));
      formData.append( 'norm', JSON.stringify(this.norm));
                  
      return formData;
    },
    async saveNorm(){
      if(await this.validateFormData()){
        let response = null;
        let assembled = this.assemblePayload();
        this.showModal('confirmationModal');
        if(this.isEditing){
            try{
              if(this.file.name){
                response = await VAPI.post(`/${SERVICE_NAMES.NORMS}/admin-doc/${this.normId}`, assembled, { headers: { 'Content-Type': 'multipart/form-data' } } );
              }else{
                response = await VAPI.put(`/${SERVICE_NAMES.NORMS}/admin-nodoc/${this.normId}`, {"norm": this.norm, "document": this.document});
              }
                if(response.status === HTTP_STATUS.OK){
                  this.normPosted = response;
                    this.showModal('savedModal')
                }else{
                  this.showModal('badRequestModal');
                }
            }catch(e){
              this.showModal('badRequestModal');
            }
        }else {
            try{
                const response = await VAPI.post( `/${SERVICE_NAMES.NORMS}/admin`, assembled, { headers: { 'Content-Type': 'multipart/form-data' } } );
                if(response.status === HTTP_STATUS.OK){
                    this.normPosted = response;
                    this.showModal('savedModal')
                }else{
                    this.showModal('badRequestModal');
                }
            }catch(e){
                this.showModal('badRequestModal');
            }
        }
    }else{
        this.showModal('errorModal');
      } 
    }
  },
  beforeCreate() {
    this.$validator.extend("nonFutureDate", {
      getMessage: field => this.$t("help.admin.date_before"),
      validate: value => value <= new Date()
    });
  },
  async beforeMount(){
    this.normId = this.$route.params.id;
    if(this.normId){
            let result = await VAPI.get(`/${SERVICE_NAMES.NORMS}/${this.normId}`);
            this.isEditing = true;

            let fetchData = result.data.data;
            let norm = fetchData.norm;
            let doc = fetchData.document;

            this.userName = norm.user.firstName + ' ' + norm.user.lastName;
            this.document.urlSource = doc.urlSource;
            this.norm.status = doc.enabled;
            this.norm.reason = doc.reason;
            if(doc.id){
              this.fileName = this.$t('norm.create.loaded_file');
            }

            this.file = {};
            
            this.date = new Date(norm.date);
            this.norm.code = doc.title;
            this.norm.politic = norm.politic;
            this.norm.policyName = norm.policyName;
            if (doc.tags) {
              doc.tags.split(",").forEach(tag => {
                this.tags.push({
                    "text": tag,
                    "tiClasses": [
                      "ti-valid"
                    ]
                  });
              });
            }
            this.tags.pop();

            if(this.norm.reason == null){
                this.norm.reason = '';
            }
            
            this.norm.typeId = norm.type.id;

            fetchData.institutions.forEach(u => {
                this.initialInstitutions.push(u.institution.id);
                this.documentList.institutions.push({"id": u.institution.id, "name": u.institution.name });
            });

            let ruralModels = fetchData.ruralmodels;
            for(let i=0; i<ruralModels.length; i++){
              this.initialRuralModels.push(ruralModels[i].ruralModel.id);
              this.documentList.ruralModels.push({
                  "id": ruralModels[i].ruralModel.id,
                  "status": ruralModels[i].principal,
                  "idOrigin": ruralModels[i].ruralModel.idOrigin,
                  "color": ruralModels[i].ruralModel.color,
                  "label": ruralModels[i].ruralModel.name,
                  "level": ruralModels[i].ruralModel.level,
                  "parentId": ruralModels[i].ruralModel.parent ? ruralModels[i].ruralModel.parent.id : 0,
                  "theme": ruralModels[i].ruralModel.name,
                  "typeId": ruralModels[i].ruralModel.type.id,
                  "typeName": ruralModels[i].ruralModel.name,
              });
              this.norm.ruralModelsPrincipal.push(ruralModels[i].principal);
            }
        }
    //GET RURAL MODELS
      try {
            let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK) {
                this.autocomplets.ruralTheme = this.toRuralFormat(response.data.data);
              this.documentList.ruralModels.forEach((ruralModel, idx, arr) => {
                let findRuralModel = (current, ruralModel) => {
                  if (current.id === ruralModel.id) return current;
                  if (current.level === ruralModel.level - 1) {
                    if (current.id === ruralModel.parentId) {
                      return current.children.find(r => r.id === ruralModel.id)
                    } else {
                      return;
                    }
                  } else if (current.level < ruralModel.level && current.children) {
                    for (let c of current.children) {
                      const found = findRuralModel(c, ruralModel);
                      if (found)
                        return found;
                    }
                  };
                  return;
                }
                const found = findRuralModel({level: -1, children: this.autocomplets.ruralTheme}, ruralModel)
                found.status = arr[idx].status;
                if (found)
                  arr[idx] = found;
              });
            }
        } catch (error) {
            console.info("Fallo al obtener Modelos rurales", error);
        }   
      //GET INSTITUTIONS
      try {
            let path = `/${SERVICE_NAMES.INSTITUTION}/all`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.institutions = response.data.data;
              this.documentList.institutions.forEach((institution, idx, arr) => {
                const found = this.autocomplets.institutions.find(inst => inst.id === institution.id)
                if (found)
                  arr[idx] = found;
              });
            }
        } catch (error) {
            console.info("Fallo al obtener Instituciones", error);
        }
      // GET NORM TYPES
      try {
            let path = `/${SERVICE_NAMES.DOMAINS}/${SERVICE_NAMES.NORM_TYPE}`;
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.types = response.data.data;
            }
        } catch (error) {
            console.info("Fallo al obtener Tipos norma", error);
        }
    },  

};
</script>

<style>
.form-group.required legend:after {
  content: " *";
  color: red;
}
</style>

<style scoped>
.wrap-between {
  display: flex;
  justify-content: space-between;
}
.wrap-start {
  display: flex;
  justify-content: flex-start;
}

.boxed-text {
    background: #E5E5E5;
    border: 1px solid black;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
}

.wrap-around {
  display: flex;
  justify-content: space-around;
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
.inline * {
  display: inline-block;
}
.w-30 {
  width: 30%;
}
.w-40 {
  width: 40%;
}
.w-50 {
  width: 50%;
}
.w-100 {
  width: 100%;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-h3 {
  font-size: 20px;
}
.center-text {
  text-align: center;
}
.mg-top-10 {
  margin-top: 10px;
}
.mg-left-20 {
  margin-left: 20px;
}
.mg-left-10p {
  margin-left: 10%;
}
.mg-top-20 {
  margin-top: 20px;
}
.mg-top-30 {
  margin-top: 30px;
}
.mg-top-40 {
  margin-top: 40px;
}
.mg-top-50 {
  margin-top: 50px;
}
.message {
  font-size: 1.5rem;
}
</style>
