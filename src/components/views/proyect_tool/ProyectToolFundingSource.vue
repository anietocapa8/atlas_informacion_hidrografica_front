<template>
    <div>
     <div class="feed-title">{{$t( 'proyectTool.fundingSource.title' )}}</div>
        <div class="col-90 container-form">
            <div class="note">
                <div class=text v-if="description != undefined && description != null">
                    
                    <div v-for="(note, i) in description"  :key="i">
                        <div v-if="isAdministrator">
                            <sipsder-btn btnType="edit_pen" :text="$t( 'proyectTool.fundingSource.noteMessage' )" @onClick="isEditDesc = true" v-if="!isEditDesc"></sipsder-btn>
                            <sipsder-btn text="Cancelar" btnType="cancel" @onClick="unSetEditDesc" v-if="isEditDesc"></sipsder-btn>
                            <sipsder-btn text="Guardar" btnType="add" @onClick="updateNote(note)" v-if="isEditDesc"></sipsder-btn>  
                        </div>
                        <rich-text-preview :content="note.content" v-if="!isEditDesc"/>
                        <rich-text :options="customToolbar" @changeValue="changeValueDesc" :newContent="note.content" v-else></rich-text>
                    </div>
                </div>
            </div>
            <br>
            <div class="filter-box">
                <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
                <div class="t-state grid-col" v-if="isAdministrator">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                        <v-select v-model.trim="filterState" label="label" :placeholder="$t( 'community.survey.status' )" :options="filterStateOps"  class="font-size-14"></v-select>
                    </b-form-group>                
                </div>
                <div class="t-input grid-col">
                        <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                            <b-form-input :placeholder="$t( 'calendar.q')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
                        </b-form-group>
                </div>
                <div class="grid-col buttons-col t-buttons">
                    <sipsder-btn btnType="search" @onClick="loadMore"></sipsder-btn>
                    <sipsder-btn btnType="clean"  @onClick="clearFilter"></sipsder-btn>
                </div>
            </div>
            <div class="filter-sources">
                <div class="item">
                    <div class="info-filter">
                    <div class="info" v-if="meta.totalElements != undefined && meta.totalElements != null ">
                        {{meta.totalElements}} {{$t( 'library.results' )}}
                    </div>
                    <div class="sort">
                        <b-form-group :label-cols="4" label-class="font-weight-bold">
                        {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderOps"></v-select>
                        </b-form-group>
                    </div>
                    </div>
                    <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements != undefined && meta.totalElements != null"
                            @input="loadMore()"
                            :per-page="filterParams.size"></b-pagination>
                </div>
                <div style="text-align:right"  v-if="isAdministrator">
                    <sipsder-btn btnType="add"  v-if="!isEdit" @onClick="createEdit()"></sipsder-btn>
                    <sipsder-btn text="Cancelar" btnType="cancel"  v-if="isEdit" @onClick="showModal('errorEvent2')"></sipsder-btn>
                    <sipsder-btn text="Guardar" btnType="add"  v-if="isEdit" @onClick="validate"></sipsder-btn>
                </div>
                <div class="item edit" v-if="isAdministrator" v-show="isEdit" ref="editD">
                    <div> 
                        <span style="color:red;"> 
                            {{$t( 'proyectTool.fundingSource.message' )}} 
                        </span>
                    </div>
                    <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          label="&nbsp;">
                        <b-form-checkbox id="checkbox1"
                                            value="true"
                                            unchecked-value="false" v-model="source.status">
                            <b>{{$t( 'proyectTool.methodology.state' )}} </b> <span style='color: red'>*</span>
                        </b-form-checkbox>
                    </b-form-group>

                    <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!source.status || source.status=='false'" :label="$t( 'proyectTool.methodology.disableReason' )+asterisk">
                        <b-form-input placeholder="" v-model="source.reasonDisable"  v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                    <div class="institution">
                        <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.fundingSource.name' )+asterisk" description= "">
                            <b-form-input placeholder="" v-model="source.name" v-validate="'max:70'"></b-form-input>
                        </b-form-group>
                        <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.fundingSource.type' )+asterisk" description= "">
                            <v-select v-model.trim="typeOption" label="label" :placeholder="$t( 'proyectTool.fundingSource.typeS' )" :options="typeOptions"  class="font-size-14"></v-select>
                        </b-form-group>    
                    </div>
                    <b-form-group :label-cols="4" label-class="font-weight-bold"  :description="'Caracteres restantes: '+(300-source.summary.length)" :label="$t( 'proyectTool.methodology.summary' )+asterisk">
                        <b-form-textarea
                            id="textarea1"
                            v-model="source.summary"
                            placeholder=""
                            :rows="3"
                            :max-rows="6"
                            v-validate="'max:300'"
                            max-length="300"
                        ></b-form-textarea>
                    </b-form-group>

                    <div class="institution">
                        <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.methodology.institutionE' )+asterisk">
                             <vue-bootstrap-typeahead
                                :data="institutions"
                                v-model="qInstitutions"
                                ref="typeahead"
                                class="w-100"
                                :serializer="s => s.name"
                                :placeholder="$t( 'proyectTool.fundingSource.institutionName' )"
                                :value="qInstitutions"
                                @hit="institution = $event"
                            ></vue-bootstrap-typeahead>
                        </b-form-group>

                        <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.methodology.url' )+asterisk" description= "">
                            <b-form-input placeholder="" v-model="source.url" v-validate="'max:70'"></b-form-input>
                        </b-form-group>
                    </div>
                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.fundingSource.project' )" description= "">
                        <div style="display: grid; grid-template-columns: 11fr 1fr">
                            <v-select v-model.trim="project" label="name" :placeholder="$t( 'proyectTool.fundingSource.typePlaceholder' )" :options="projects"  class="font-size-14"></v-select>
                            <sipsder-btn btnType="add" text="" @onClick="addSelected()" style="transform: scale(0.9); margin-top: -8%"></sipsder-btn>
                        </div>
                        
                        <b-col cols=12 v-if="projectSel.length > 0" class="d-flex justify-content-center">
                            <b-table responsive striped hover small :fields="fields.project" :items="projectSel">
                                <!-- Columna definida para la acciones -->
                                <template slot="actions" slot-scope="row">
                                    <div  class="d-flex justify-content-center">
                                        <sipsder-btn btnType="delete" text="" @onClick="removeElement(row.item)">
                                        </sipsder-btn>
                                    </div>
                                </template>
                            </b-table>
                        </b-col>
                        <b-col cols=12 v-else class="d-flex justify-content-center">
                            {{emptyMessage}}
                        </b-col>
                    </b-form-group>   
                </div>

                 <div class="source-item item" v-for="(source,i) in sources" :key="i">
                    <div class="grid-content">
                        <div>
                            <span v-html="getStatus(source.status)" v-if="isAdministrator"></span><sipsder-btn btnType="edit_pen" text="" @onClick="changeEdit(i)"  v-if="isAdministrator" style="transform: scale(0.7)"></sipsder-btn><br> 
                            <div><h2><b>{{source.name}}</b></h2></div>
                            <div><b>{{$t( 'proyectTool.fundingSource.type' )}}: </b>{{source.nameType}}</div>
                            <div><b>{{$t( 'proyectTool.fundingSource.institution' )}}: </b>{{source.nameInstitution}}</div>
                            <div>{{source.summary}}</div>
                            <span><a :href="source.url" target="_blank">{{$t( 'proyectTool.fundingSource.oficialSite' )}}</a></span>
                            <div v-if="source.projects!=null">
                                <div v-if="source.projects.length>0">
                                    <br>
                                    <b>{{$t( 'proyectTool.fundingSource.projectS' )}}</b><br>
                                    <router-link v-for="(p,i) in source.projects" :to="{name: 'ProyectToolProyectDetail', params:{id: p.id}}" :key="i" class="link-u">{{p.name}}</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div><b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements != undefined && meta.totalElements != null "
                                @input="loadMore()"
                                :per-page="filterParams.size"></b-pagination>
                </div>
            </div>
        </div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
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
            @ok="clear"
            @cancel="closeModal('errorEvent2')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.fundingSource.discart' )">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent3" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="save"
            @cancel="closeModal('errorEvent3')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.fundingSource.save' )">
                </div>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import RichText from '../../shared/RichText.vue'
import RichTextPreview from '../../shared/RichTextPreview';
import TableSelect from "@/components/shared/TableSelect";
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES} from '../../../domain_constants'

export default {

    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        RichText,
        RichTextPreview,
        "s-table-select": TableSelect,
    },
    data(){
        return{
            emptyMessage: this.$t( 'proyectTool.fundingSource.emptyMessage' ),
            qInstitutions: "",
            institutions:[],
            institution: {
                name: '',
                id: 0,
                institutionType:{
                    type: ''
                },
                sector: {name: ''}
            },
            fields:{
                project: [{
                    key: "name",
                    label: this.$t("rurality_stories.create.project"),
                    sortable: true
                },
                {
                    key: "actions",
                    label: ""
                }]
            },
            sources: [],
            meta: {},
            source:{
                id: 0,
                status: true,
                reasonDisable: '',
                name: '',
                summary: '',
                url: '',
                idInstitution: 0,
                idType: 0,
                projects : []
            },
            filterQ: '',
            filterState: {},
            filterStateOps:[
                {
                    label: this.$t( 'proyectTool.announcement.enabled' ),
                    value: 1
                },
                {
                    label: this.$t( 'proyectTool.announcement.disabled' ),
                    value: 0
                }
            ],
            filterParams: {
                page: 1,                    // Page number
                size: 10,                   // Page size
            },
            filterOrderOps:[
                {
                    value: "name,asc",
                    label:  this.$t( 'proyectTool.fundingSource.funding' )+" ↓"
                },
                {
                    value: "name,desc",
                    label: this.$t( 'proyectTool.fundingSource.funding' )+" ↑"
                },
                {
                    value: "institution.name,desc",
                    label: this.$t( 'proyectTool.fundingSource.insti' )+" ↓"
                },
                {
                    value: "institution.name,asc",
                    label: this.$t( 'proyectTool.fundingSource.insti' )+" ↑"
                }
            ],
            filterOrder:{value: "name,asc", label: this.$t( 'proyectTool.fundingSource.funding' )+" ↓"},
            isEdit: false,
            isNew : true,
            asterisk: "<span style='color: red'>*</span>",
            error: '',
            isError : false,
            typeOptions: [
                {
                    id:  FUNDING_SOURCE_TYPE.PERMANENTS,
                    label: this.$t("proyectTool.fundingSource.permanents")
                },
                {
                    id:  FUNDING_SOURCE_TYPE.INTERNATIONAL,
                    label: this.$t("proyectTool.fundingSource.international")
                }
            ],
            typeOption: null,
            notes: [],
            description: [],
            isEditDesc: false,
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
            projects: [],
            project: {},
            projectSel: []
        }
    },
     async beforeMount(){
        try {
            if(this.$route.query.q != null && this.$route.query.q != undefined )
                this.filterQ = this.$route.query.q
            let response = await VAPI.get(`/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.PROYECT_TOOL}`);
            this.notes = response.data.data;
            if(this.notes.length>0)
                this.description = this.notes.filter(e=>{ return e.key=="funding"})
        }
        catch( error ) {
            console.log( 'Error fetching Proyect tools description', error );
        }
        try{
            let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/funding-source` + this.buildQuery());
            if(response.status == 200){
                this.sources= response.data.data;
                this.meta = response.data.meta
            }
            else{
                this.meta.totalElements = 0
            }
        }
        catch( error ) {
            console.log( 'Error fetching procedure', error );
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
        
    },
     computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
        },
    },
    watch:{
        qInstitutions: _.debounce(function(intitution) { 
        if(intitution.length > 0)
            this.getIntitutions(intitution) 
        }, 500),
    },
    methods:{
        addSelected(){
            self = this
            let insert =true
            this.projectSel.forEach(e=>{
               if(e.id == self.project.id){
                   insert= false
               }
            })
            if( insert){
                this.projectSel.push(this.project)
                let projectT = {
                    id: this.project.id,
                    name: this.project.name,
                    action: 1,
                }
                this.source.projects.push(projectT)
            }
        },
        removeElement(element){
            let deletev = false
            this.projectSel.forEach(e=>{
               if(e.id == element.id){
                   deletev = true
               }
            })
            if(deletev){
                const idx = this.projectSel.indexOf(element);
                this.projectSel.splice(idx, 1);

                const idz = this.source.projects.findIndex(e=>{
                    return e.id === element.id
                });
                if(this.source.projects[idz].action === 1){
                    this.source.projects.splice(idz, 1);
                }
                else{
                     this.source.projects[idz].action = 2
                }
                   
            }
        },
        updateNote(note){
            VAPI.put(`/${SERVICE_NAMES.SIPSDER_NOTE}/update`, note).then((output)=>{
                this.unSetEditDesc()
            }).catch((e)=>{
                alert("Error actualizando Nota. "+ e)
            })
        },
        unSetEditDesc(){
            this.isEditDesc = false
        },
        changeValueDesc(value){
            this.description[0].content = value
        },
        async getIntitutions(institution){
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.INSTITUTION}/search?q=${institution}`);
                this.institutions = response.data.data
                this.institution=  this.institutions[0]
            }
            catch( error ) {
                console.log( 'Error fetching institutions', error );
            }
        },
        buildQuery() {
            let query = '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;
            if( this.filterState.value != undefined) {
                query += '&status=' + this.filterState.value;
            }
            else if(this.isAdministrator &&  this.filterState.id  == undefined){
                query += '&status=1,0'
            }
            else if(this.filterState.id  == undefined){
                query += '&status=1'
            }
            if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
            if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value ;
            else query += '&sort=lastModifiedDate,desc'
            return query;
        },
        getStatus(status){
            if(status == true){
                return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'proyectTool.show' ).toUpperCase()+"</span>"
            }
            else if(status == false){
                return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'proyectTool.noShow' ).toUpperCase()+"</span>"
            }
            else{
                return ""
            }
        },
        async loadMore(){
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/funding-source` + this.buildQuery());
                if(response.status == 200){
                    this.sources= response.data.data;
                    this.meta = response.data.meta
                }
                else{
                    this.meta.totalElements = 0
                }
            }
            catch( error ) {
                console.log( 'Error fetching procedure', error );
            }
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        validate(){
             this.error = this.$t('proyectTool.home.error')+'<br>'
            if(this.source.status == false || this.source.status == 'false'){
                if(this.source.reasonDisable == null || this.source.reasonDisable==""){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                    this.isError = true
                }
                if(this.source.reasonDisable.length>120){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.limit')+"<br>"
                    this.isError = true
                }
            }
            if(this.institution.id == null || this.institution.id == undefined ||  this.institution.id == 0){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.institutionE')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.typeOption == null || this.typeOption == undefined){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.fundingSource.typeE')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.source.summary == null || this.source.summary==""){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.summary')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.source.url == null || this.source.url==""){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.url')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.source.summary.length>300){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.summary')+this.$t('proyectTool.methodology.limit')+"<br>"
                this.isError = true
            }
            if(this.source.url.length>800){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.url')+this.$t('proyectTool.methodology.limit')+"<br>"
                this.isError = true
            }
            
            if(this.isError ){
                this.showModal("errorEvent")
                this.isError = false
            }
            else{
                var search = this.source.url.indexOf('http://')
                if(search === -1) {
                    search = this.source.url.indexOf('https://')
                    if(search === -1)
                        this.source.url = 'https://' + this.source.url
                }
                this.showModal("errorEvent3")
            }
        },
        async save(){
                this.source.idInstitution = this.institution.id
                this.source.idType = this.typeOption.id
                if(this.isNew){
                    try{
                        let response = await VAPI.post(`${SERVICE_NAMES.PROYECT_TOOL}/funding-source`,this.source );
                        if(response.status == 200){
                           this.loadMore()
                           this.clear()
                        }
                    }
                    catch( error ) {
                        console.log( 'Error fetching procedure', error );
                    }
                }
                else{
                    try{
                        let response = await VAPI.put(`${SERVICE_NAMES.PROYECT_TOOL}/funding-source`,this.source );
                        if(response.status == 200){
                           this.loadMore()
                           this.clear()
                        }
                    }
                    catch( error ) {
                        console.log( 'Error fetching procedure', error );
                    }
                }
        },
        changeEdit(i){
            self = this
            function getLabel(id){
                return (id == FUNDING_SOURCE_TYPE.PERMANENTS) ? self.$t("proyectTool.fundingSource.permanents") 
                :  self.$t("proyectTool.fundingSource.international");
            }
            this.source.id = this.sources[i].id
            this.source.status = this.sources[i].status
            this.source.reasonDisable = this.sources[i].reasonDisable
            if (this.source.reasonDisable == null) this.sources.reasonDisable = ""
            this.source.name = this.sources[i].name
            this.source.summary = this.sources[i].summary
            this.source.url = this.sources[i].url
            this.source.idInstitution = this.sources[i].idInstitution
            this.source.idType =  this.sources[i].idType
            if(this.sources[i].projects != null){
                this.projectSel = JSON.parse(JSON.stringify(this.sources[i].projects))
                this.source.projects = JSON.parse(JSON.stringify(this.sources[i].projects))
            }
            this.typeOption = {
                id: this.sources[i].idType,
                label: getLabel(this.sources[i].idType)
            }
            this.qInstitutions =  this.sources[i].nameInstitution
            this.$refs['typeahead'].$data.inputValue = this.qInstitutions
            
            this.getIntitutions(this.qInstitutions)
            this.institution=  this.institutions[0]
            this.isNew = false
            this.isEdit = true
            var messageDisplay =  this.$refs.editD;
            var top = messageDisplay.offsetTop
            window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
            })
        },
        createEdit(){
            this.source={
                id: 0,
                status: true,
                reasonDisable: '',
                summary: '',
                url: '',
                idInstitution: 0,
                idType: 0,
                projects: []
            }
            this.institution = {
                name: '',
                id: 0,
            }
            this.project={}
            this.projectSel= []
            this.qInstitutions =  ""
            this.$refs['typeahead'].$data.inputValue = this.qInstitutions
            this.isNew = true
            this.isEdit = true
        },
        clear(){
            this.source={
                id: 0,
                status: true,
                reasonDisable: '',
                name: '',
                summary: '',
                url: '',
                idInstitution: 0,
                idType: 0,
            }
            this.institution = {
                name: '',
                id: 0,
            }
            this.typeOption= null
            this.project={}
            this.projectSel= []
            this.isNew = true
            this.isEdit = false
        },
        clearFilter(){
            this.filterQ = ''
            this.filterState = {}
            this.filterParams ={
                page: 1,                    // Page number
                size: 10,                   // Page size
            }
            this.filterOrder = {value: "name,desc", label: "Fuente ↓"},
            this.loadMore()
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_6.png)
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

.filter-box
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr
    grid-template-areas: 'a b c e'
    grid-gap: 15px
    background: $colorTitleDark
    padding: 15px 15px 15px 15px
    border-radius: 10px
    .legend
        grid-area: a
        color: #fff
        font-weight: bold
        font-family: $fontBody
        font-size: 2rem
    .grid-col
        .form-group input, .b-form-group, .form-group
            height: 100% !important
            max-height: 50px !important
            border-radius: 4px !important
            div
                height: 100% !important
                background: #fff !important
                border-radius: 4px !important
        button
            margin-top: -15px
        .buttons
            text-align: center
            margin-top: -15px
        .grid-col-50
            display: grid
            grid-template-columns: 2fr 1fr
            grid-gap: 15px
        .v-select, .dropdown-toggle
            padding: 0px !important
            height: 30px !important
        .selected-tag
            font-size: 17px !important
            margin: 0 !important
    .t-state
        grid-area: b
    .t-input
        grid-area: c
    .t-buttons
        grid-area: e
        text-align: center
.filter-sources
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    min-height: 500px
    margin-top: 20px
    padding: 30px 15px 15px 15px
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    .edit
        border: 3px solid $colorTitle
        border-radius: 10px
        padding: 10px 10px 10px 10px
        .institution
            display: grid
            grid-template-columns: 1fr 1fr
            grid-gap: 5px
    .source-item
        border-bottom: 3px solid
        border-image-source: linear-gradient(90deg, transparent 0%, $colorTitle 50%, transparent 100%)
        border-image-slice: 1
        font-size: 1.3rem
        &:last-child
            border: none
        padding: 15px
        .grid-content
            display: grid
            grid-template-columns: 100%
            align-items: center
    .info-filter
        position: relative
        height: 60px
    .info
        font-size: 2rem
        font-weight: bold
        position: absolute
        top: 0 
        left: 0
    .sort
        position: absolute
        top: 0 
        right: 0
        min-width: 160px
.link-u
    display: block
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 30px
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .filter-box
        grid-template-columns: 1fr !important
        grid-template-areas: 'a' 'b' 'c' 'e' !important
    .info-filter
        height: 100px !important
        .info
            position: unset !important
        .sort
            position: unset !important
    .edit
        .institution
            grid-template-columns: 1fr !important
</style>