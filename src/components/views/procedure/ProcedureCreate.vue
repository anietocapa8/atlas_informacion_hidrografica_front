<template>
<div class="container container-form">

    <!-- Bad Request modal -->
    <b-modal ref="badRequestModal" :title="$t('registration.warning')" hideFooter>
          <div class="mg-top-10 w-100 center-text">
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
          <div class="mg-top-10 w-100 center-text">
              <p v-for="(error,i) in errors.items" :key="`${i}-${error.msg}`"> {{error.msg}} </p>
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
          <div class="mg-top-10 w-100 center-text">
              <p> {{$t('survey.create.popup.dicard_changes')}} </p>
          </div>
          <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goProcedures()" />
              </b-col>
              <b-col class="center-text">
                <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('cancelModal')" />
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
              <p> {{$t('procedure.create.popup.save')}} </p>
              <p> {{$t('procedure.create.popup.confirmation')}} </p>
            </div>
            <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="saveProcedure()" />
              </b-col>
              <b-col class="center-text">
                <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('confirmationModal')" />
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
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goProcedures()" />
              </b-col>
        </b-row>
    </b-modal>

    <!-- TITULO -->
    <sipsder-title :title="$t('procedure.create.title')" type="admin">
        <b-row slot="content">
            <div class="w-100 message">
                {{ $t('procedure.create.claim') }} <router-link :to="{ name: 'InstitutionFormAdmin'}"> {{$t('procedure.create.here')}} </router-link>
            </div>
        </b-row>
    </sipsder-title>


    <div class="bold rigth mg-top-30">
        <b-form-checkbox @change="enableProcedure()" v-model="procedure.state">{{$t('procedure.create.enable')}}</b-form-checkbox>
    </div>

    <!-- BEGIN THE FORM -->

    <div class="form-container">

        <div v-if="!procedure.state">
            <b-form-group
                :label="$t('procedure.create.form.reason')+asterisk"
                class="bold mg-top-30">
            </b-form-group>
            <b-form-textarea v-model="procedure.reason"
                :rows="3" :max-rows="6"
                v-validate="'required|min:8|max:280'" name="procedure_reason" maxlength="280" :data-vv-as="$t('procedure.create.form.reason')"/>
        </div>
        <span class="error">{{ errors.first('procedure_reason') }}</span>

        <b-form-group
            :label="$t('procedure.create.form.name')+asterisk"
            class="bold mg-top-30">
            <b-form-input type="text" v-model="procedure.name"
                v-validate="'required|min:4|max:180'" name="procedure_name" maxlength="180" :data-vv-as="$t('procedure.create.form.name')" />
        </b-form-group>
        <span class="error">{{ errors.first('procedure_name') }}</span>  

        <b-form-group
            :label="$t('procedure.create.form.summary')+asterisk+$t('procedure.create.form.summary_validation')"
            class="bold mg-top-30">
            <b-form-textarea type="text" name="procedure_summary" v-model="procedure.summary" :data-vv-as="$t('procedure.create.form.summary')"
                v-validate="'required|min:4|max:280'" rows="3" max-rows="5" no-resize
            />
        </b-form-group>
        <span class="error">{{ errors.first('procedure_summary') }}</span>  

        <b-form-group 
            :label="$t('procedure.create.form.description')+asterisk" 
            class="bold mg-top-30"></b-form-group>
                <rich-text :options="customToolbar" v-model="procedure.description"></rich-text>

        <b-form-group
            :label="$t('procedure.create.form.url')+asterisk"
            class="bold mg-top-30">
            <b-form-input type="text" v-model="procedure.url"
                v-validate="'required|min:4|max:500'" name="procedure_url" maxlength="800" :data-vv-as="$t('procedure.create.form.url')" />
        </b-form-group>
        <span class="error">{{ errors.first('procedure_url') }}</span>

        <!-- Institutions -->
        <b-form-group
            :label="$t('procedure.create.form.institutions')+asterisk"
            class="bold mg-top-30">
        </b-form-group>
        <p>{{$t('procedure.create.form.institutions_claim')}}</p>
        <div class="box">
            <b-row v-for="(link,i) in institutions" :key="i" class="no-legend grid-legend">
                <b-form-checkbox :id="'checkbox'+i" :value="i" :unchecked-value="null" v-model="selectLink"></b-form-checkbox>
                <div class="grid-input">
                    <div v-if="i >= institutions.length - 1">{{$t('procedure.create.form.institution.name')}}:
                        <b-form-select  v-model="link.institution" :disabled="i < institutions.length - 1">
                            <option v-for="(institution,i) in autocomplets.institutions" :key="i" :value="institution" :placeholder="institution.name">{{institution.name}}</option>
                        </b-form-select>
                    </div>
                     <div v-if="i < institutions.length - 1">{{$t('procedure.create.form.institution.name')}}: <b-form-input v-model="link.institutionName" disabled></b-form-input></div>
                    <div>{{$t('procedure.create.form.institution.description')}}: <b-form-input v-model="link.description" :disabled="i < institutions.length - 1" maxlength="280" :placeholder="$t('procedure.create.placeholder_enter')"></b-form-input></div>
                    <div>{{$t('procedure.create.form.institution.responsible_office')}}: <b-form-input v-model="link.responsibleOffice" :disabled="i < institutions.length - 1" maxlength="180" :placeholder="$t('procedure.create.placeholder_enter')"></b-form-input></div>
                    <div>{{$t('procedure.create.form.institution.url')}}: <b-form-input v-model="link.url" :disabled="i < institutions.length - 1" maxlength="800" :placeholder="$t('procedure.create.placeholder_enter')"></b-form-input></div>
                </div>
                <div style="float:right; margin-top: -20px; text-align: right">
                    <sipsder-btn v-if="i == institutions.length - 1" btnType="add" text="" @onClick="addLink(link, i)"></sipsder-btn>
                </div>
            </b-row>
            <b-row>
                <b-col class="d-flex justify-content-end">
                    <sipsder-btn btnType="export" text="" :disabled="selectLink == null  || selectLink == 0 || selectLink == institutions.length -1" @onClick="moveLink(selectLink, selectLink-1)"></sipsder-btn>
                    <sipsder-btn btnType="download" text="" :disabled="selectLink == null  || selectLink == institutions.length -1 || selectLink == institutions.length -2" @onClick="moveLink(selectLink, selectLink+1)"></sipsder-btn>
                    <sipsder-btn btnType="delete" :text="$t('procedure.create.button.delete')" :disabled="selectLink == null || (selectLink==0 && institutions.length <= 1) || selectLink == institutions.length -1" @onClick="deleteSelectedLink()"></sipsder-btn>
                </b-col>
            </b-row>
        </div>

        <span class="error">{{ errors.first('procedure_institutions') }}</span>

        <!-- Tags -->
        <b-form-group
          :label="'Tags' + TEMPLATES.MANDATORY_SYMBOL"
          class="bold mg-top-30">
          <tags-input
              v-model="tag"
              :placeholder="$t('norm.create.form.tags_enter')"
              :tags="tags"                       
              @tags-changed="newTags => tags = newTags"
          ></tags-input>
        </b-form-group>
        <!--<span class="error">{{ errors.first('util.obligatorySymbol') }}</span>-->

        <!-- RURAL MODEL -->
        <div class="mg-top-30" v-if="documentList.ruralModels || !isEditing">
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

        <div class="center mg-top-40">
            <sipsder-btn btnType="back" :text="$t('procedure.create.button.back')" @onClick="showModal('cancelModal')" :variant="'info'"></sipsder-btn>
            <sipsder-btn btnType="save" :text="$t('procedure.create.button.save')" @onClick="showModal('confirmationModal')" :variant="'info'"></sipsder-btn>
        </div>

    </div>
</div>
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS, TEMPLATES } from '../../../sipsder_constants';
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import TableSelect from "@/components/shared/TableSelect";
import RichText from '../../shared/RichText.vue'
import VAPI from "../../../http_common";

export default {

    components: {
        VueBootstrapTypeahead,
        "s-table-select": TableSelect,
        RichText,
    },
    computed: {
        isEditing() {
            return Boolean(this.$route.params.id);
        },
    },
    data(){
        return {
            TEMPLATES:TEMPLATES,
            asterisk: "<span style='color: red'>*</span>",
            enabledProcedure: true,
            tag: '',
            tags: [],
            selectLink: null,
            formErrors: [],
            selectedInstitution: null,
            initialRuralModels: [],
            initialInstitutions: [],
            institutionsIds: [],

            procedure: {
                state: true,
                reason: '',
                name: '',
                summary: '',
                description: '',
                url: '',
                tags: [],
                ruralModels: [],
                ruralModelsPrincipal: [],
                institutions: [],
                deletedRuralModels: [],
                deletedInstitutions: [],
                deletedUsers: []
            },
            
            procedureInstitution: {
                description: '',
                url: '',
                responsibleOffice: '',
                priority: null,
                idInstitution: null
            },

            institutions: [
                {
                    description: '',
                    url: '',
                    responsibleOffice: '',
                    priority: null,
                    institutionName: '',
                    idProcedure: null,
                    idInstitution: null
                }
            ],

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
            },

            autocomplets: {
                ruralTheme: [],
                institutions: []
            },
            documentList: {
                ruralModels: undefined,
            },

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

    methods: {
        showModal(ref) {
            this.$refs[ref].show();
        },
        closeModal(ref) {
            this.$refs[ref].hide();
        },
        enableProcedure() {
            this.procedure.state = !this.procedure.state;
        },
        goProcedures(){ 
            this.$router.push({
                name: 'ProcedureIndex'
            });
        },
        addLink(link, i){
            if(link.description && link.url && link.responsibleOffice && link.institution){
                if(!this.institutionsIds.includes(link.institution.id)){
                    this.institutionsIds.push(link.institution.id);
                    this.institutions.pop();
                    this.institutions.push({
                        "description": link.description,
                        "url": link.url,
                        "responsibleOffice": link.responsibleOffice,
                        "priority": i,
                        "idInstitution": link.institution.id,
                        "institutionName": link.institution.name
                    });
                    this.institutions.push(Object.assign({}, this.procedureInstitution));
                }
            }
        },
        moveLink(i , newI){
            Array.prototype.move = function(from,to){
                this.splice(to,0,this.splice(from,1)[0]);
                return this;
            };
            var auxPriority = this.institutions[newI].priority
            this.institutions[newI].priority = this.institutions[i].priority
            this.institutions[i].priority =  auxPriority
            this.institutions.move(i,newI)
            this.selectLink = newI;
        },
        deleteSelectedLink(){
            for(var i= this.selectLink ; i < this.institutions.length -1 ; i++){
                this.moveLink(i , i+1)
            }
            for(var i = this.selectLink+1 ; i < this.institutions.length; i++ ){
                    this.institutions[i].priority= i-1
            }
            this.institutions.splice(this.selectLink, 1)
            
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
            this.$validator.validateAll();
                
            // Summary validate
            if(this.procedure.summary.length < 4 || this.procedure.summary.length > 280){
                this.formErrors.push(this.$t('procedure.create.form.summary_error'));
            }

            //Description validate
            if(this.procedure.description.length < 1){
                this.formErrors.push(this.$t('procedure.create.form.description_error'));
            }

            //Rural model map and validate
            if (this.documentList.ruralModels && this.documentList.ruralModels.length) {
                this.procedure.ruralModels = this.documentList.ruralModels.map(element => element.id);
            } else {
                this.formErrors.push(this.$t('norm.create.form.rural_model_error'));
            }
            //Rural model principal map and validate
            var principals = new Array(this.procedure.ruralModels.length).fill(false);
            for(let i=0; i<principals.length; i++){
                if(this.documentList.ruralModels[i] && this.documentList.ruralModels[i].status){
                    principals[i] = true;
                }
            }
            this.procedure.ruralModelsPrincipal = principals;
            //deleted rural models
            if(this.initialRuralModels){
                this.initialRuralModels.forEach(e => {
                if(!this.procedure.ruralModels.includes(e) && !this.procedure.deletedRuralModels.includes(e)){
                    this.procedure.deletedRuralModels.push(e);
                    }
                });
            }
            //Institutions map and validate
            if(this.institutions.length > 1){
                this.procedure.institutions = [...this.institutions];
                this.procedure.institutions.pop();
            }else{
                this.formErrors.push(this.$t('procedure.create.form.institutions_error'));
            }
            //deleted intitutions
            if(this.initialInstitutions){
                let institutionsIds = [];
                this.procedure.institutions.forEach(i =>{
                    institutionsIds.push(i.idInstitution);
                });
                this.initialInstitutions.forEach(e => {
                if(!institutionsIds.includes(e)){
                    this.procedure.deletedInstitutions.push(e);
                    }
                });
            }

            //Tags map and validate
            if(this.tags.length < 1 || this.tags.length > 200){
                this.formErrors.push(this.$t('norm.create.form.tags_error'));
            }else{
                this.procedure.tags = [];
                this.tags.map(element => {
                    this.procedure.tags.push(element.text);
                });
            }

            let validForm = false;

            if(this.formErrors.length < 1){
                await this.$validator.validate( ).then( valid => {
                    if( valid ) {
                        validForm = true;
                        return true;
                    }
                });
            }
            return validForm;
            
        },
        async saveProcedure(){
        if(await this.validateFormData()){
            let response = null;
            this.showModal('confirmationModal');
            if(this.isEditing){
                let id = this.procedureId;
                try{
                    const response = await VAPI.put(`/${SERVICE_NAMES.PROCEDURE}/admin/${id}`, this.procedure);
                    if (response.status === HTTP_STATUS.OK) {
                        this.procedurePosted = response;
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
                let response = await VAPI.post(`/${SERVICE_NAMES.PROCEDURE}/admin`, this.procedure)
                    if(response.status === HTTP_STATUS.OK){
                        this.procedurePosted = response;
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
        },
        findInTree(node, id){
            if (node.id == id) {
                return node;
            }
            
            for (let idx = 0;node.children && idx < node.children.length; idx++) {
                const nNode = node.children[idx];
                const val = this.findInTree(nNode, id);
                if (val) {
                    return val;
                }
            }

            return;
        },
        findRuralModel (rural) {
            if (!rural || !this.autocomplets.ruralTheme)
                return rural;

            let models = [];

            rural.forEach(item => {
                for (let node of this.autocomplets.ruralTheme) {
                    let value = this.findInTree(node, item.id);
                    if (value) {
                        value.status = item.status
                        models.push(value);
                        break;
                    }
                }
            });
            return models;
        },
    },
    async beforeMount(){
        //GET RURAL MODELS
        try {
            let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.autocomplets.ruralTheme = this.toRuralFormat(response.data.data);
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
            }
        } catch (error) {
            console.info("Fallo al obtener Instituciones", error);
        }

        if (this.$route.params.id) {
            let result = await VAPI.get(`/${SERVICE_NAMES.PROCEDURE}/admin/${this.$route.params.id}`);
            if (result.status === HTTP_STATUS.OK) {
                let fetchData = result.data.data;
                this.procedureId = this.$route.params.id;

                this.procedure.state = fetchData.state;
                this.procedure.reason = fetchData.reason;
                this.procedure.name =  fetchData.name;
                this.procedure.summary =  fetchData.summary;
                this.procedure.description =  fetchData.description;
                this.procedure.url = fetchData.url;

                fetchData.tags.split(",").forEach(tag => {
                    this.tags.push({
                        "text": tag,
                    "tiClasses": [
                        "ti-valid"
                    ]
                    });
                });
                this.tags.pop();

                if(this.procedure.reason == null){
                    this.procedure.reason = '';
                }

                let institutions = fetchData.institutions;
                this.institutions.pop();
                for(let i=0; i<institutions.length; i++){
                    this.initialInstitutions.push(institutions[i].idInstitution);
                    this.institutions.push({
                        "description": institutions[i].description,
                        "url": institutions[i].url,
                        "responsibleOffice": institutions[i].responsibleOffice,
                        "priority": institutions[i].priority,
                        "idInstitution": institutions[i].idInstitution,
                        "institutionName": institutions[i].nameInstitution
                    })
                }
                this.institutions.push(Object.assign({}, this.procedureInstitution));
                this.documentList.ruralModels = this.findRuralModel(fetchData.ruralmodels);

                // let ruralModels = fetchData.ruralmodels;
                for(let i=0; i<this.documentList.ruralModels.length; i++){
                    this.initialRuralModels.push(this.documentList.ruralModels[i].id);
                    //   this.documentList.ruralModels.push({
                    //       "id": ruralModels[i].id,
                    //       "status": ruralModels[i].status,
                    //       "idOrigin": ruralModels[i].idOrigin,
                    //       "color": ruralModels[i].color,
                    //       "label": ruralModels[i].name,
                    //       "level": ruralModels[i].level,
                    //       "parentId": ruralModels[i].parentId ? ruralModels[i].parentId : 0,
                    //       "theme": ruralModels[i].name,
                    //       "typeId": ruralModels[i].typeId,
                    //       "typeName": ruralModels[i].name,
                    //   });
                    this.procedure.ruralModelsPrincipal.push(this.documentList.ruralModels[i].status);
                }
            }
        }
    }
    
}
</script>

<style scoped>

.grid-legend{
    display: grid;
    grid-template-columns: 4% 92% 4%;
}
.grid-input{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 5px;
        margin-top: -17px;
        align-items: center;
        font-size: 0.7em;
        font-weight: bold;
}
.no-legend{
    padding: 20px;
    max-height: 70px;
    height: 70px;
    margin-bottom: 10px;
    width: 100%;
    
}

.center-text{
    text-align: center;
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
    margin: 5px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px 20px;
}
.flex{
  display: flex;
  justify-content: space-between;
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
