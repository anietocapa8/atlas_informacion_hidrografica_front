<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.methodology.title' )}}</div>
        <div class="col-90 container-form">
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'methodology'" :showEdition="isAdministrator" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
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
            <div class="filter-methods">
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
                    <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          label="&nbsp;">
                        <b-form-checkbox id="checkbox1"
                                            value="true"
                                            unchecked-value="false" v-model="methodology.status">
                            <b>{{$t( 'proyectTool.methodology.state' )}} </b> <span style='color: red'>*</span>
                        </b-form-checkbox>
                    </b-form-group>

                    <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" v-if="!methodology.status || methodology.status=='false'" :label="$t( 'proyectTool.methodology.disableReason' )+asterisk">
                        <b-form-input placeholder="" v-model="methodology.reasonDisable"  v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                    <div class="institution" v-if="institutions !== undefined && institutions!== null">
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

                        <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.methodology.typeE' )+asterisk" v-if="institution.institutionType">
                            <b-form-input placeholder="" v-model="institution.institutionType.type " v-validate="'max:70'" readonly></b-form-input>
                        </b-form-group>

                        <b-form-group :label-cols="4" label-class="font-weight-bold" description= "" :label="$t( 'proyectTool.methodology.sectorE' )+asterisk" v-if="institution.sector">
                            <b-form-input placeholder="" v-model="institution.sector.name" v-validate="'max:70'" readonly></b-form-input>
                        </b-form-group>
                    </div>
                    

                    <b-form-group :label-cols="4" label-class="font-weight-bold"  :description="'Caracteres restantes: '+(300-methodology.summary.length)" :label="$t( 'proyectTool.methodology.summary' )+asterisk">
                        <b-form-textarea
                            id="textarea1"
                            v-model="methodology.summary"
                            placeholder=""
                            :rows="3"
                            :max-rows="6"
                            v-validate="'max:300'"
                            max-length="300"
                        ></b-form-textarea>
                    </b-form-group>

                    <b-form-group :label-cols="4" label-class="font-weight-bold" :label="$t( 'proyectTool.methodology.url' )+asterisk" description= "">
                        <b-form-input placeholder="" v-model="methodology.url" v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                </div>

                 <div class="method-item item" v-for="(method,i) in methodologies" :key="i">
                    <div class="grid-content">
                        <div>
                            <span v-html="getStatus(method.status)" v-if="isAdministrator"></span><sipsder-btn btnType="edit_pen" text="" @onClick="changeEdit(i)"  v-if="isAdministrator" style="transform: scale(0.7)"></sipsder-btn><br> 
                            <div><h2><b>{{method.nameInstitution}}</b></h2></div>
                            <div><span v-if="method.typeInstitution"><b>{{$t( 'proyectTool.methodology.type' )}}</b> {{method.typeInstitution}},</span><span v-if="method.sectorInstitution"> <b>{{$t( 'proyectTool.methodology.sector' )}}</b> {{method.sectorInstitution}}</span></div><br>
                            <div>{{method.summary}}</div>
                            <span><a :href="method.url" target="_blank">{{$t( 'proyectTool.fundingSource.oficialSite' )}}</a></span>
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
import vSelect from "vue-select";
import NoteRichText from '../../shared/editableMessages/NoteRichText.vue'
import VAPI from '../../../http_common';
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, MODULES} from '../../../domain_constants'
export default {
    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        'note-sipsder':NoteRichText,
    },
    data(){
        return{
            MODULES,
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
            methodologies: [],
            meta: {},
            methodology:{
                id: 0,
                status: true,
                reasonDisable: '',
                summary: '',
                url: '',
                idInstitution: 0
            },
            filterQ: '',
            filterState: {},
            filterStateOps:[
                {
                    label: "Habilitado",
                    value: 1
                },
                {
                    label: "Inhabilitado",
                    value: 0
                }
            ],
            filterParams: {
                page: 1,                    // Page number
                size: 10,                   // Page size
            },
            filterOrderOps:[
                {
                    value: "lastModifiedDate,desc",
                    label: "Fecha de Modificacion ↓"
                },
                {
                    value: "lastModifiedDate,asc",
                    label: "Fecha de Modificacion ↑"
                },
                {
                    value: "institution.name,desc",
                    label: "Institucion ↓"
                },
                {
                    value: "institution.name,asc",
                    label: "Institucion ↑"
                }
            ],
            filterOrder:{value: "lastModifiedDate,desc", label: "Fecha de Modificacion ↓"},
            isEdit: false,
            isNew : true,
            asterisk: "<span style='color: red'>*</span>",
            error: '',
            isError : false
        }
    },
    async beforeMount(){
        try{
            let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/methodology` + this.buildQuery());
            if(response.status == 200){
                this.methodologies= response.data.data;
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
    watch:{
        qInstitutions: _.debounce(function(intitution) { 
        if(intitution.length > 0)
            this.getIntitutions(intitution) 
        }, 500),
    },
    computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
        },
    },
    methods:{
        async getIntitutions(institution){
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.INSTITUTION}/governmental?q=${institution}`);
                this.institutions = response.data.data
                this.institution =  this.institutions[0]
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
                let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/methodology` + this.buildQuery());
                if(response.status == 200){
                    this.methodologies= response.data.data;
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
            if(this.methodology.status == false || this.methodology.status == 'false'){
                if(this.methodology.reasonDisable == null || this.methodology.reasonDisable==""){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                    this.isError = true
                }
                if(this.methodology.reasonDisable.length>120){
                    this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.disableReason')+this.$t('proyectTool.methodology.limit')+"<br>"
                    this.isError = true
                }
            }
            if(this.institution.id == null || this.institution.id == undefined || this.institution.id == 0){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.institutionE')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.methodology.summary == null || this.methodology.summary==""){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.summary')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.methodology.url == null || this.methodology.url==""){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.url')+this.$t('proyectTool.methodology.errorEnd')+"<br>"
                this.isError = true
            }
            if(this.methodology.summary.length>300){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.summary')+this.$t('proyectTool.methodology.limit')+"<br>"
                this.isError = true
            }
            if(this.methodology.url.length>800){
                this.error+= this.$t('proyectTool.methodology.errorStart')+this.$t('proyectTool.methodology.url')+this.$t('proyectTool.methodology.limit')+"<br>"
                this.isError = true
            }

            if(this.isError ){
                this.showModal("errorEvent")
                this.isError = false
            }
            else{
                var search = this.methodology.url.indexOf('http://')
                if(search === -1) {
                    search = this.methodology.url.indexOf('https://')
                    if(search === -1)
                        this.methodology.url = 'https://' + this.methodology.url
                }
                this.showModal("errorEvent3")
            }
        },
        async save(){
                this.methodology.idInstitution = this.institution.id
                if(this.isNew){
                    try{
                        let response = await VAPI.post(`${SERVICE_NAMES.PROYECT_TOOL}/methodology`,this.methodology );
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
                        let response = await VAPI.put(`${SERVICE_NAMES.PROYECT_TOOL}/methodology`,this.methodology );
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
            this.methodology.id = this.methodologies[i].id
            this.methodology.status = this.methodologies[i].status
            this.methodology.reasonDisable = this.methodologies[i].reasonDisable
            if (this.methodology.reasonDisable == null) this.methodology.reasonDisable = ""
            this.methodology.summary = this.methodologies[i].summary
            this.methodology.url = this.methodologies[i].url
            this.methodology.idInstitution = this.methodologies[i].idInstitution
            this.qInstitutions =  this.methodologies[i].nameInstitution
            this.$refs['typeahead'].$data.inputValue = this.qInstitutions
            this.getIntitutions(this.qInstitutions)
            this.institution=  this.institutions[0]
            if(this.institution == undefined){
                this.institution = {
                    name: '',
                    id: 0,
                    institutionType:{
                        type: ''
                    },
                    sector: {name: ''}
                }
            }
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
            this.methodology={
                id: 0,
                status: true,
                reasonDisable: '',
                summary: '',
                url: '',
                idInstitution: 0
            }
            this.institution = {
                name: '',
                id: 0,
                institutionType:{
                    type: ''
                },
                sector: {name: ''}
            }
            this.isNew = true
            this.isEdit = true
        },
        clear(){
            this.methodology={
                id: 0,
                status: true,
                reasonDisable: '',
                summary: '',
                url: '',
                idInstitution: 0
            }
            this.institution = {
                name: '',
                id: 0,
                institutionType:{
                    type: ''
                },
                sector: {name: ''}
            }
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
            this.filterOrder = {value: "lastModifiedDate,desc", label: "Fecha de Modificacion ↓" }
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
.filter-methods
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
            grid-template-columns: 1fr 1fr 1fr
            grid-gap: 5px
    .method-item
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
