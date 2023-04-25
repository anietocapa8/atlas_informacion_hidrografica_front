<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.announcement.create.title' )}}</div>
        <div class="col-90 container-form">
            <div>{{$t( 'proyectTool.announcement.create.message' )}}</div>
            <br>
            <div class="state-grid">
                <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.state' )+asterisk" class="state-g" v-if="isAdministrator && !isNew">
                    <v-select v-model.trim="state" label="label" :placeholder="$t( 'community.survey.status' )" :options="stateOps"  class="font-size-14" v-if="oldState == stateOps[2].value"></v-select>
                    <span v-else><b>{{announcement.nameStatus}}</b><br></span>
                    <span v-if="isAdministrator && !isNew"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{announcement.userName}} {{announcement.userLastName}}, {{announcement.userType}}</span>
                </b-form-group> 
                <b-form-group :label-cols="4"
                        label-class="font-weight-bold"
                        label="&nbsp;" style="text-align: right;float:right;" class="enabled-g" v-if="oldState != stateOps[1].value">
                            <b-form-checkbox id="checkbox1" v-model="announcement.enabled">
                            <b>{{$t( 'proyectTool.announcement.create.enabled' )}} </b>
                        </b-form-checkbox>
                </b-form-group>   
            </div>
             <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!announcement.enabled || announcement.enabled=='false'" :label="$t( 'proyectTool.methodology.disableReason' )+asterisk">
                <b-form-input placeholder="" v-model="announcement.reasonDisable"  v-validate="'max:70'"></b-form-input>
            </b-form-group>
            <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.announcement.name' )+asterisk">
                <b-form-input :placeholder="$t( 'proyectTool.announcement.name' )" v-model="announcement.name" v-validate="'max:70'"></b-form-input>
            </b-form-group>
            <b-form-group
              :label-cols="4"
              label-class="font-weight-bold"
              :label="$t( 'proyectTool.announcement.create.summary' )+asterisk"
              :description="$t( 'proyectTool.announcement.create.characters' )+(280-announcement.summary.length)"
            >
              <textarea  maxlength="280"  id="textarea1" v-model="announcement.summary" :rows="3"
            :max-rows="6" :placeholder="$t( 'proyectTool.announcement.create.summary' )"></textarea>
            </b-form-group>
            <div class="valid-grid">
                <b-form-group :label="$t('survey.create.form.startDate')+asterisk"
                    label-class="font-weight-bold">
                    <datepicker 
                    :placeholder="$t('util.insertDate')" 
                    v-model="announcement.startDate"
                    id="announcement-start-date"
                    name="announcement-start-date"
                    class="date-picker"
                    :language = "languages[ currentLocale ]"
                    :calendar-button = "true"
                    calendar-button-icon = "fa fa-calendar"
                    :disabledDates = "disabledStartDate"
                    :clear-button = "true"
                    v-if="isNew">
                    </datepicker>
                    <datepicker 
                    :placeholder="$t('util.insertDate')" 
                    v-model="announcement.startDate"
                    id="announcement-start-date"
                    name="announcement-start-date"
                    class="date-picker"
                    :language = "languages[ currentLocale ]"
                    :calendar-button = "true"
                    calendar-button-icon = "fa fa-calendar"
                    :clear-button = "true"
                    v-else>
                    </datepicker>
                </b-form-group>
                <b-form-group
                    :label="$t('survey.create.form.endDate')+asterisk"
                    label-class="font-weight-bold">
                    <datepicker 
                    :placeholder="$t('util.insertDate')" 
                    v-model="announcement.endDate"
                    id="announcement-finish-date"
                    name="announcement-finish-date"
                    class="date-picker"
                    :language = "languages[ currentLocale ]"
                    :calendar-button = "true"
                    calendar-button-icon = "fa fa-calendar"
                    :disabledDates = "disabledFinishDate"
                    :clear-button = "true">
                    </datepicker>
                </b-form-group>
                <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.announcement.create.valid' )+asterisk">
                    <b-form-input :placeholder="''" v-model="valid" v-validate="'max:70'" disabled></b-form-input>
                </b-form-group>
            </div>
            <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.announcement.create.requirement' )+asterisk">
                <rich-text :options="customToolbar" @changeValue="changeValueRequirement" :newContent="announcement.requirement" style="overflow: auto; max-width: none; padding: 0px"></rich-text>
            </b-form-group>
            <b-form-group label-class="font-weight-bold" :label="$t( 'calendar.institution')+asterisk">
                <v-select v-if="institutions" v-model.trim="institution" label="name" :placeholder="$t( 'calendar.institution')" :options="institutions"></v-select>
            </b-form-group>
            <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.announcement.create.url' )+asterisk">
                <b-form-input :placeholder="''" v-model="announcement.url" v-validate="'max:150'"></b-form-input>
            </b-form-group>

            <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.geo' )+asterisk" description= "">
                <div style="display: grid; grid-template-columns: 11fr 1fr">
                    <v-select v-model.trim="geo" label="name" :placeholder="$t( 'proyectTool.fundingSource.typePlaceholder' )" :options="geoLocal" v-if="geoLocal != null"  class="font-size-14"></v-select>
                    <sipsder-btn btnType="add" text="" @onClick="addSelectedG()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                </div>
                
                <b-col cols=12 v-if="geoSel.length > 0" class="d-flex justify-content-center">
                    <b-table responsive striped hover small :fields="fields.geo" :items="geoSel">
                        <!-- Columna definida para la acciones -->
                        <template slot="actions" slot-scope="row">
                            <div  class="d-flex justify-content-center">
                                <sipsder-btn btnType="delete" text="" @onClick="removeElementG(row.item)">
                                </sipsder-btn>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols=12 v-else class="d-flex justify-content-center">
                    {{emptyGMessage}}
                </b-col>
            </b-form-group>

            <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.projectS' )" description= "">
                <div style="display: grid; grid-template-columns: 11fr 1fr">
                    <v-select v-model.trim="project" label="name" :placeholder="$t( 'proyectTool.fundingSource.typePlaceholder' )" :options="projects"  v-if="projects != null" class="font-size-14"></v-select>
                    <sipsder-btn btnType="add" text="" @onClick="addSelectedP()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                </div>
                
                <b-col cols=12 v-if="projectSel.length > 0" class="d-flex justify-content-center">
                    <b-table responsive striped hover small :fields="fields.project" :items="projectSel">
                        <!-- Columna definida para la acciones -->
                        <template slot="actions" slot-scope="row">
                            <div  class="d-flex justify-content-center">
                                <sipsder-btn btnType="delete" text="" @onClick="removeElementP(row.item)">
                                </sipsder-btn>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols=12 v-else class="d-flex justify-content-center">
                    {{emptyPMessage}}
                </b-col>
            </b-form-group>


             <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.fundingS' )" description= "">
                <div style="display: grid; grid-template-columns: 11fr 1fr">
                    <v-select v-model.trim="funding" label="name" :placeholder="$t( 'proyectTool.announcement.create.typeF' )" :options="fundings" v-if="fundings != null" class="font-size-14"></v-select>
                    <sipsder-btn btnType="add" text="" @onClick="addSelectedF()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                </div>
                
                <b-col cols=12 v-if="fundingSel.length > 0" class="d-flex justify-content-center">
                    <b-table responsive striped hover small :fields="fields.funding" :items="fundingSel">
                        <!-- Columna definida para la acciones -->
                        <template slot="actions" slot-scope="row">
                            <div  class="d-flex justify-content-center">
                                <sipsder-btn btnType="delete" text="" @onClick="removeElementF(row.item)">
                                </sipsder-btn>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols=12 v-else class="d-flex justify-content-center">
                    {{emptyFMessage}}
                </b-col>
            </b-form-group>

             <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.announcement.create.ruralS' )+asterisk" description= "">
                <div style="display: grid; grid-template-columns: 11fr 1fr">
                    <treeselect v-model="selectedQueryModel" 
                        :multiple="false" 
                        :options="rurals"
                        v-if="rurals != null"
                        :openDirection="'below'"
                        :placeholder="$t( 'faqs.modal.rural_select' )"
                        :clearable="true"
                        :disable-branch-nodes="true"
                        :default-expand-level="1"
                        :show-count="true">
                        <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                            <img v-if="node.raw.url != null" :src="getImgURL(node.raw.url)" height="16" width="16"> 
                            <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                            <span> {{ node.label.split('/')[0] }} </span>
                            <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                            <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                        </label>
                    </treeselect>

                    <sipsder-btn btnType="add" text="" @onClick="addSelectedR()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                </div>
                
                <b-col cols=12 v-if="ruralSel.length > 0" class="d-flex justify-content-center">
                    <b-table responsive striped hover small :fields="fields.rural" :items="ruralSel">
                        <!-- Columna definida para la acciones -->
                        <template slot="principal" slot-scope="data">
                            <div  class="justify-content-center" style="cursor: pointer" @click="changeRuralThematicPrincipal(data.item.id)">
                                 <b-form-checkbox
                                            :id="'check'+data.item.id"
                                            :disabled="true"
                                            :value="true"
                                            :unchecked-value="false"
                                            v-model="data.item.principal" >
                                            </b-form-checkbox>
                            </div>
                        </template>

                        <template slot="actions" slot-scope="row">
                            <div  class="d-flex justify-content-center">
                                <sipsder-btn btnType="delete" text="" @onClick="removeElementR(row.item)">
                                </sipsder-btn>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col cols=12 v-else class="d-flex justify-content-center">
                    {{emptyRMessage}}
                </b-col>
            </b-form-group>

             <b-form-group :label="$t('news.create.tags')+asterisk" 
            label-class="font-weight-bold">
              <tags-input
                  v-model="tag"
                  :placeholder="$t('norm.create.form.tags_enter')"
                  :tags="tags"                       
                  @tags-changed="newTags => tags = newTags"
              ></tags-input>
            </b-form-group>
            <div style="text-align: center;">
                <sipsder-btn btnType="back" @onClick="returnBack"></sipsder-btn>
                <sipsder-btn
                    btnType="add"
                    :text="isAdministrator ? $t( 'proyectTool.announcement.create.save' ): $t( 'proyectTool.announcement.create.saveNoAdmin' ) "
                    @onClick="validate"
                ></sipsder-btn>
            </div>
        </div>
        <b-modal ref="errorEvent" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="closeModal('errorEvent')"
            @cancel="closeModal('errorEvent')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent2" :title="$t( 'proyectTool.concepts.alert' )"
        @ok="$router.go(-1)"
        @cancel="closeModal('errorEvent2')"
        >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.announcement.create.discart' )"></div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent3" :title="$t( 'proyectTool.concepts.alert' )"
        @ok="save"
        @cancel="closeModal('errorEvent3')"
        >
            <div v-if="isNew">
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.announcement.create.saveF' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="announcement.saveText"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
            <div v-else-if="this.state.value == this.stateOps[1].value">
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.announcement.create.refusedM' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="announcement.saveText"
                                v-validate="'required'"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
           <div v-else>
                <b-row class="w-100 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.announcement.create.edit' )"></div>
                    <div class="w-100 red">
                         <b-form-group
                        :label-cols="4"
                        label-class="font-weight-bold"
                        :label="$t( 'proyectTool.announcement.create.reason' )+asterisk"
                        >
                            <b-form-textarea
                                id="textarea2"
                                v-model="announcement.saveText"
                                v-validate="'required'"
                                :placeholder="$t( 'proyectTool.announcement.create.reason' )"
                                :rows="3"
                                :max-rows="6"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </div>
                </b-row>
            </div>
        </b-modal>
         <b-modal ref="errorEvent4" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="redirect"
            @cancel="redirect"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
    </div>
</template>

<script>

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../../http_common';
import RichText from '../../../shared/RichText.vue'
import { SERVICE_NAMES,HTTP_STATUS } from '../../../../sipsder_constants';
import { PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES} from '../../../../domain_constants'
import S_UTIL from "../../../../util/sipsder_util";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import moment from 'moment';

export default {
    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        Treeselect,
        RichText,
        datepicker: Datepicker,
    },
    data(){
        return{
            oldState: null,
            oldEnabled: null,
            isNew: true,
            languages: lang,
            asterisk: "<span style='color: red'>*</span>",
            tags:[],
            tag:'',
            announcement: {
                id: undefined,
                idStatus: null,
                nameStatus: '',
                enabled: null,
                reasonDisable: '',
                name: '',
                startDate: this.getDate(),
                endDate: null,
                summary: '',
                requirement: '',
                url: '',
                tags: '',
                idInstitution: null,
                nameInstitution: '',
                saveText: '',
                projects: [],
                fundingSources:[],
                geographies:[],
                ruralModels:[]
            },
            institution: {},
            state:{},
            stateOps:[
                {
                    label: this.$t( 'proyectTool.announcement.create.publish' ),
                    value: 1
                },
                {
                    label: this.$t( 'proyectTool.announcement.create.refused' ),
                    value: 2
                },
                {
                    label: this.$t( 'proyectTool.announcement.create.waiting' ),
                    value: 3
                }
            ],
            valid :"",
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
            fields:{
                project: [{
                    key: "name",
                    label: this.$t("rurality_stories.create.project"),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],
                geo: [{
                    key: "name",
                    label: this.$t( 'proyectTool.announcement.create.geo' ),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],
                funding: [{
                    key: "name",
                    label: this.$t( 'proyectTool.announcement.create.funding' ),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }],
                rural: [{
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
                    key: 'principal',
                    label: this.$t('document.admin.tableTitles.ruralModel.main'),
                    sortable: true,
                },
                {
                    key: 'actions',
                    label: ""
                }]
            },
            geo: {},
            geoSel: [],
            emptyGMessage: this.$t( 'proyectTool.announcement.create.emptyGMessage' ),
            projects: [],
            project: {},
            projectSel: [],
            emptyPMessage: this.$t( 'proyectTool.announcement.create.emptyPMessage' ),
            fundings: [],
            funding: {},
            fundingSel: [],
            emptyFMessage: this.$t( 'proyectTool.announcement.create.emptyFMessage' ),
            rurals: [],
            selectedQueryModel:undefined,
            ruralSel: [],
            emptyRMessage: this.$t( 'proyectTool.announcement.create.emptyRMessage' ),
            error: '',
            isError: false
        } 
    },
    async created(){
        this.$store.dispatch( 'getGeoLocal');
        this.$store.dispatch( 'getInstitutionsF');
    },
    async beforeMount() {
        if(!this.isAdministrator){
            this.state = {
                label: this.$t( 'proyectTool.announcement.create.waiting' ),
                value: 3
            }
        }
        else{
            this.state = {
                label: this.$t( 'proyectTool.announcement.create.publish' ),
                value: 1
            }
        }
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.PROJECT}/simple`)
            if(response.status == 200){
                this.projects= response.data;
                
            }
        }
        catch( error ) {
            console.log( 'Error fetching proyects', error );
        }
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/funding-source/select`)
            if(response.status == 200){
                this.fundings= response.data.data;
                
            }
        }
        catch( error ) {
            console.log( 'Error fetching funding sources', error );
        }
        try {
            let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
            let response = await VAPI.get( path );
            if (response.status == HTTP_STATUS.OK){
                this.rurals = this.toRuralFormat(response.data.data);
            }
        } catch (error) {
            console.error("Fallo al obtener Modelos rurales", error);
        }

        if(this.$route.params.id !==null && this.$route.params.id !==undefined )
        {
            this.isNew = false
            let id = this.$route.params.id
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/announcements/one/${id}`);
                if(response.status == 200){
                    this.announcement= response.data;
                    if((this.announcement.idUser !== this.currentUser.id) && !this.isAdministrator) this.$router.push({name: 'ProyectToolAnnouncementIndex'})
                    this.oldState = this.announcement.idStatus
                    this.oldEnabled = this.announcement.enabled
                    this.state = {
                        label: this.announcement.nameStatus,
                        value: this.announcement.idStatus
                    }
                    this.institution = {
                        name: this.announcement.nameInstitution,
                        id: this.announcement.idInstitution
                    }
                    this.geoSel = JSON.parse(JSON.stringify(this.announcement.geographies))  
                    this.projectSel = JSON.parse(JSON.stringify(this.announcement.projects))
                    this.fundingSel = JSON.parse(JSON.stringify(this.announcement.fundingSources))
                    this.announcement.ruralModels.forEach(e=>{
                        var temp = this.findInTree(this.rurals, e.id)
                        temp.principal = e.principal
                        this.ruralSel.push(temp)
                    })
                    var tagsArr = this.announcement.tags.split(",")
                    this.tags=tagsArr.map(tag => ({
                            text: tag
                    }));
                }
            }
            catch( error ) {
                console.log( 'Error fetching Announcement', error );
            }
        }
        

    },
    computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) 
        },
        onlyControl(){
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL )
        },
        geoLocal(){
            return this.$store.getters.getGeoLocal
        },
        institutions(){
             return this.$store.getters.getInstitutionsF
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        },
        disabledStartDate() {
            let startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            return {
                to: startDate
            }
        },
        disabledFinishDate() {
            let closingDate = new Date(this.announcement.startDate);
            closingDate.setDate(closingDate.getDate() + 1);
            return {
                to: closingDate
            }
        },
        currentLocale() {
            return this.$i18n.locale;
        },
        currentUser(){
            return this.$store.state.session.currentUser
        }
    },
    watch:{
        state: {
            deep: true,      
            handler(){
                if(this.isNew){
                 if(this.state.value === 2){
                     this.announcement.enabled = false
                     this.announcement.reasonDisable = "Rechazada"
                 } 
                 else this.announcement.enabled = true
                }
            }
        },
        "announcement.startDate": function(newValue, oldValue) {
            this.isValid()
        },
        "announcement.endDate": function(newValue, oldValue) {
            this.isValid()
        },
    },
    methods: {
        redirect(){
            this.$router.push({name: 'ProyectToolAnnouncementIndex'})
            this.closeModal('errorEvent4')
        },
        returnBack(){
            this.showModal('errorEvent2')
        },
        validate(){
            this.error = this.$t('proyectTool.home.error')+'<br>'
            this.announcement.tags = this.tags.map(tag => tag.text).join(',');
             if(this.state.value === 2){
                this.announcement.enabled = false
                this.announcement.reasonDisable = "Rechazada"
            } 
            if(this.announcement.enabled == false || this.announcement.enabled == 'false'){
                if(this.announcement.reasonDisable == null || this.announcement.reasonDisable==""){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.errorEnd')
                    this.isError = true
                }
                if(this.announcement.reasonDisable.length>120){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.limit')
                    this.isError = true
                }
            }
            if(this.state== null || this.state == undefined){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.state' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.name.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.name' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.name.length>120){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.name' )+this.$t('proyectTool.methodology.limit')
                this.isError = true
            }
            if(this.announcement.requirement.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.requirement' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.summary.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.summary' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.summary.length>280){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.summary' )+this.$t('proyectTool.methodology.limit')
                this.isError = true
            }
            if(this.institution.id == null || this.institution.id == undefined){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'calendar.institution')+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.url.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.url' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.url.length>800){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.url' )+this.$t('proyectTool.methodology.limit')
                this.isError = true
            }
            if(this.announcement.geographies.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.geo' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.ruralModels.length<1){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t( 'proyectTool.announcement.create.ruralS' )+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.tags<3){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('news.create.tags')+this.$t('proyectTool.methodology.errorEnd')
                this.isError = true
            }
            if(this.announcement.tags>100){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('news.create.tags')+this.$t('proyectTool.methodology.limit')
                this.isError = true
            }

            var search = this.announcement.url.indexOf('http://')
            if(search === -1) {
                search = this.announcement.url.indexOf('https://')
                if(search === -1)
                    this.announcement.url = 'https://' + this.announcement.url
            }

            if(this.isError ){
                this.showModal("errorEvent")
                this.isError = false
            }
            else{
                if(this.state.value == this.stateOps[1].value){
                    this.announcement.enabled = false
                    this.announcement.saveText = "Rechazado"
                }
                if(((this.isNew && this.isAdministrator) ||  ((this.oldEnabled != this.announcement.enabled || this.oldState != this.state.value) && this.isAdministrator) || (this.announcement.idUser == this.currentUser.id && this.isAdministrator)) && this.state.value != this.stateOps[1].value ) {
                         
                    this.save()
                }
                /*else if(this.state.value == this.stateOps[1].value && this.isAdministrator){
                    this.save()
                }*/
                else {
                    this.showModal("errorEvent3")
                } 
            }
        },
        async save(){
            this.announcement.nameStatus = this.state.label
            this.announcement.idStatus = this.state.value
            this.announcement.nameInstitution =  this.institution.name
            this.announcement.idInstitution =  this.institution.id
            if(this.isNew){
                try {
                    let path = `${SERVICE_NAMES.PROYECT_TOOL}/announcements`
                    let response = await VAPI.post( path, this.announcement);
                    if (response.status == HTTP_STATUS.OK){
                        this.error= this.$t( 'proyectTool.announcement.create.saved' )
                        this.showModal('errorEvent4')
                    }
                } catch (error) {
                    console.error("Fallo al salvar convocatorias rurales", error);
                }
            }
            else{
                try {
                    let path = `${SERVICE_NAMES.PROYECT_TOOL}/announcements`
                    let response = await VAPI.put( path, this.announcement);
                    if (response.status == HTTP_STATUS.OK){
                        this.error=  this.$t( 'proyectTool.announcement.create.updated' )
                        this.showModal('errorEvent4')
                    }
                } catch (error) {
                    console.error("Fallo al salvar convocatorias rurales", error);
                }
            }
            
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        getDate () {            
            return  new Date();
        },
        isValid(){
            let today = new Date();
            if( this.announcement.startDate !== null && this.announcement.endDate !== null){
                     if(today<this.announcement.startDate){
                       this.valid = this.$t( 'proyectTool.announcement.next' )
                    }
                    else if(today >= this.announcement.startDate && today<= this.announcement.endDate){
                       this.valid = this.$t( 'proyectTool.announcement.valid' )
                    }
                    else if(today>this.announcement.endDate){
                        this.valid =this.$t( 'proyectTool.announcement.noValid' )
                    }
                    else{
                        this.valid =""
                    }
            }
            else{
               this.valid =""
            }
        },
        changeValueRequirement(value){
            this.announcement.requirement = value
        },
        addSelectedP(){
            self = this
            let insert =true
            this.projectSel.forEach(e=>{
               if(e.id == self.project.id){
                   insert= false
               }
            })
            if(this.project.id === undefined) insert= false
            if( insert){
                this.projectSel.push(this.project)
                let projectT = {
                    id: this.project.id,
                    name: this.project.name,
                    color: null,
                    action: 1,
                }
                this.announcement.projects.push(projectT)
            }
        },
        removeElementP(element){
            let deletev = false
            this.projectSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.projectSel.indexOf(element);
                this.projectSel.splice(idx, 1);

                const idz = this.announcement.projects.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.announcement.projects[idz].action === 1){
                    this.announcement.projects.splice(idz, 1);
                }
                else{
                     this.announcement.projects[idz].action = 2
                }
                   
            }
        },
        addSelectedG(){
            self = this
            let insert =true
            this.geoSel.forEach(e=>{
               if(e.id == self.geo.id){
                   insert= false
               }
            })
            if(this.geo.id === undefined) insert= false
            if( insert){
                this.geoSel.push(this.geo)
                let geoT = {
                    id: this.geo.id,
                    name: this.geo.name,
                    color: null,
                    action: 1,
                }
                this.announcement.geographies.push(geoT)
            }
        },
        removeElementG(element){
            let deletev = false
            this.geoSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.geoSel.indexOf(element);
                this.geoSel.splice(idx, 1);

                const idz = this.announcement.geographies.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.announcement.geographies[idz].action === 1){
                    this.announcement.geographies.splice(idz, 1);
                }
                else{
                     this.announcement.geographies[idz].action = 2
                }
                   
            }
        },
        addSelectedF(){
            self = this
            let insert =true
            this.fundingSel.forEach(e=>{
               if(e.id == self.funding.id){
                   insert= false
               }
            })
            if(this.funding.id === undefined) insert= false
            if( insert){
                this.fundingSel.push(this.funding)
                let fundingT = {
                    id: this.funding.id,
                    name: this.funding.name,
                    color: null,
                    action: 1,
                }
                this.announcement.fundingSources.push(fundingT)
            }
        },
        removeElementF(element){
            let deletev = false
            this.fundingSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.fundingSel.indexOf(element);
                this.fundingSel.splice(idx, 1);

                const idz = this.announcement.fundingSources.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.announcement.fundingSources[idz].action === 1){
                    this.announcement.fundingSources.splice(idz, 1);
                }
                else{
                     this.announcement.fundingSources[idz].action = 2
                }
                   
            }
        },
        changeRuralThematicPrincipal(i) {
            this.ruralSel.forEach(e=>{
              e.principal = false
              if(e.id === i){
                  e.principal = true
              }
            })
            this.ruralSel = JSON.parse(JSON.stringify(this.ruralSel))
             this.announcement.ruralModels.forEach(e=>{
                if(e.action == 0)  e.action = 1
                e.principal = false
                if(e.id === i){
                    e.principal = true
                }
            })
        },
        addSelectedR(){
            self = this
            let insert =true
            var temp = this.findInTree(this.rurals, this.selectedQueryModel)
            if(this.ruralSel.length<1) temp.principal = true
            else temp.principal =false

            this.ruralSel.forEach(e=>{
               if(e.id == temp.id){
                   insert= false
               }
            })
            if(temp.id === undefined) insert= false
            if( insert){
                this.ruralSel.push(temp)
                let ruralT = {
                    id: temp.id,
                    name: temp.label,
                    color: null,
                    principal: temp.principal,
                    action: 1,
                }
                this.announcement.ruralModels.push(ruralT)
            }
        },
        removeElementR(element){
            let deletev = false
            this.ruralSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.ruralSel.indexOf(element);
                this.ruralSel.splice(idx, 1);

                const idz = this.announcement.ruralModels.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.announcement.ruralModels[idz].action === 1){
                    this.announcement.ruralModels.splice(idz, 1);
                }
                else{
                     this.announcement.ruralModels[idz].action = 2
                     this.announcement.ruralModels[idz].principal=false
                     var temp = this.announcement.ruralModels[idz]
                     this.announcement.ruralModels.splice(idz, 1)
                     this.announcement.ruralModels.push(temp)
                }
                if( this.ruralSel.length>0){
                    this.ruralSel[0].principal=true
                }
                if( this.announcement.ruralModels.length>0){
                    this.announcement.ruralModels[0].principal=true
                }
            }
        },
        findInTree(node, id){
            for(var ix= 0 ; ix< node.length; ix++){
               let val = this.findRecursive(node[ix], id)
               if (val) {
                   return val;
               }
            }           
        },
        findRecursive(node, id){
             var nNode = node
                if (nNode.id == id) {
                    return nNode;
                }
                var res = null;
                
                for (var idx = 0;nNode.children && idx < nNode.children.length; idx++) {
                    var mNode = nNode.children[idx];
                    let val = this.findRecursive(mNode, id);
                    if (val) {
                        res = val;
                        break;
                    }
                }

                return res;
        },
        findRuralModel (rural) {
            if(!rural || !this.rurals)
                return rural;

            let models = [];
            
            rural.forEach(item => {
                this.rurals.forEach(node => {
                    let value = this.findRecursive(node, item.id);
                    if (value){
                    value.status = item.status
                    models.push(value);
                    }
                    
                });
            })

            return models;
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
    },
}
</script>

<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'
textarea
  resize: none
  height: 200px
  width: 100%
.dot 
    height: 16px
    width: 16px
    border-radius: 50%
    display: inline-block
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../../assets/title/barra_sola_6.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    min-height: 90px
    width: 105%
    font-size: 36px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 40px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
    background: #fff

.state-grid
    display: grid
    grid-template-columns: 1fr 1fr

.valid-grid
    display: grid
    grid-template-columns: 1fr 1fr 1fr
    grid-gap: 15px
</style>