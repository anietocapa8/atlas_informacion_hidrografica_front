<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.projects.title' )}}</div>
        <div class="col-90 container-form">
            <div v-if="onlyAdmin"><sipsder-btn btnType="export_data" @onClick="getStatistics" :text="$t( 'faqs.export_statistics' )"></sipsder-btn></div>
            <div class="welcome">{{ $t( 'proyectTool.projects.welcome')}}</div>
            <br>
            <div class="filter-box" :class="{'alt-no-admin' : !onlyAdmin}">
                <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
                <div class="t-enabled grid-col" v-if="isAdministrator">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                        <v-select v-model.trim="filterEnabled" label="label" :placeholder="$t( 'proyectTool.announcement.create.enabled' )" :options="filterEnabledOps"  class="font-size-14"></v-select>
                    </b-form-group>                
                </div>
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
                <div class="t-advance" @click="isAdvance=!isAdvance">
                    {{$t( 'proyectTool.announcement.advance' )}}  <i :class="{'fas fa-angle-up': isAdvance, 'fas fa-angle-down': !isAdvance}"></i>
                </div>
                <div class="t-name grid-col" v-show="isAdvance">
                    <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                        <b-form-input :placeholder="$t( 'proyectTool.projects.name' )" v-model="filterName" v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                </div>
                <div class="t-institution grid-col" v-show="isAdvance && institutions">
                     <b-form-group label-class="font-weight-bold">
                        <v-select v-if="institutions" v-model.trim="filterInstitution" label="name" :placeholder="$t( 'calendar.institution')" :options="institutions"></v-select>
                    </b-form-group>
                </div>
                <div class="t-myproject" v-show="isAdvance" v-if="isAdministrator">
                        <b-form-checkbox id="checkbox1" v-model="user">
                            <b>{{$t( 'proyectTool.projects.myProjects' )}} </b>
                        </b-form-checkbox>
                </div>
                <div class="t-rural grid-col" v-show="isAdvance">
                    <treeselect v-model="selectedQueryModel" 
                        :multiple="false" 
                        :options="ruralModels"
                        :openDirection="'below'"
                        :placeholder="$t( 'faqs.modal.rural_select' )"
                        :clearable="true"
                        :default-expand-level="1">
                        <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                            <img v-if="node.raw.url != null" :src="getImgURL(node.raw.url)" height="16" width="16"> 
                            <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>      
                            <span> {{ node.label.split('/')[0] }} </span>
                            <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                            <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                        </label>
                    </treeselect>
                </div>
                <div class="t-products grid-col" v-show="isAdvance ">
                    <b-form-group label-class="font-weight-bold">
                        <v-select v-model.trim="filterProducts" label="typePlusName" :placeholder="$t( 'proyectTool.projects.products' )" :options="products"></v-select>
                    </b-form-group>
                </div>
                <div class="t-local grid-col" v-show="isAdvance ">
                    <b-form-group label-class="font-weight-bold">
                        <v-select v-model.trim="filterLocalities" label="text" :clearable="false" :placeholder="$t('prototype.create.form.locality')" :options="localities"></v-select>
                    </b-form-group>
                </div>
                <div class="t-neigh grid-col" v-show="isAdvance ">
                    <b-form-group label-class="font-weight-bold">
                        <v-select v-model.trim="filterVillages" label="text"  :clearable="false" :placeholder="$t('prototype.create.form.sub_locality')" :options="villagesFilter" :disabled="Object.entries(filterLocalities).length === 0 && filterLocalities.constructor === Object"></v-select>
                    </b-form-group>
                </div>
                <div class="grid-col buttons-col t-buttons">
                    <sipsder-btn btnType="search" @onClick="loadMore" ></sipsder-btn>
                    <sipsder-btn btnType="clean"  @onClick="clearAll"></sipsder-btn>
                </div>
            </div>
            <br>
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'projects'" :showEdition="onlyAdmin" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
             <div class="filter-sources">
                <div class="item">
                    <div class="info-filter">
                    <div class="info" v-if="meta.totalElements != undefined && meta.totalElements != null ">
                        {{meta.totalElements}} {{$t( 'library.results' )}}
                    </div>
                    <div class="sort" v-if="isAdministrator">
                        <b-form-group :label-cols="4" label-class="font-weight-bold">
                        {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderAdminOps"></v-select>
                        </b-form-group>
                    </div>
                    <div class="sort" v-else>
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
                    <sipsder-btn btnType="add" @onClick="$router.push({ name: 'ProyectToolProyectAdmin'})"></sipsder-btn>
                </div>

                <div class="source-item item" v-for="(project,i) in projects" :key="i">
                    <div class="grid-content">
                        <div class="content">
                            <div class="area-a">
                                <span v-html="getStatus(project)+getEnabled(project)" v-if="isAdministrator"></span><span v-if="currentUser != null"><sipsder-btn btnType="edit_pen" text="" v-if="onlyAdmin || project.idUser === currentUser.id" style="transform: scale(0.7)" @onClick="$router.push({ name: 'ProyectToolProyectAdmin', params:{id: project.id}})"></sipsder-btn></span><br> 
                                <div v-if="project.idStatus != 4"><router-link :to="{name: 'ProyectToolProyectDetail', params:{id: project.id}}"><h2><b>{{project.name}}</b></h2></router-link></div>
                                <div v-else><h2><b>{{project.name}}</b></h2></div>
                                <div><b>{{$t( 'proyectTool.projects.institution' )}}: </b>{{project.institutionPrincipalUser}}</div>
                                <div v-if="isAdministrator"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{project.userName}} {{project.userLastName}}, {{project.userType}}</div>
                                <div v-if="isAdministrator"><b>{{$t( 'proyectTool.projects.create.creationDate' )}}</b>&nbsp; {{project.creationDateT| moment("DD MMM YYYY - h:mm a")}}</div>
                                <div><b>{{$t( 'proyectTool.projects.products' )}}: </b>{{project.nameprincipalProduct}}</div>
                                <div v-if="project.geos.length>0" class="geosL">
                                    <div><b>{{$t('proyectTool.projects.localities')}} </b></div>
                                    <ul v-for="(geo, i) in project.geos" :key="i">
                                        
                                        <li v-if="geo.typeParent == GEOGRAPHY_TYPE.LOCALIDAD"><b>{{$t('prototype.create.form.locality')}}:</b> {{geo.nameParent}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{geo.name}}</li>
                                        <li v-else><b>{{$t('prototype.create.form.locality')}}:</b> {{geo.name}} - <b>{{$t('prototype.create.form.sub_locality')}}:</b> {{$t( 'proyectTool.projects.detail.all' )}}</li>
                                    </ul>
                                </div>
                                <div><b>{{$t('proyectTool.announcement.summary')}}:</b> {{project.summary}}</div>
                                <div class="colors-container" >
                                    <div class="colors" v-for="(r, j) in project.ruralModels" :key="j"
                                        :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                    </div>
                                </div>   
                            </div>
                            <div class="area-b" v-if="project.attachment">
                                <div class="container-i" :style="{'border-color': project.ruralModels[0].color, 'border-style': 'solid','border-width': '7px' }">
                                    <img :src="getYTvideoCode(project.attachment)" v-if="project.attachment.typePrincipalAttachment== ATTACHMENT_TYPE.VIDEO">
                                    <img  :src="getImgURL(project.attachment.urlPrincipalAttachment)"  v-else>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div><b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements != undefined && meta.totalElements != null "
                                @input="loadMore()"
                                :per-page="filterParams.size"></b-pagination>
                </div>
            </div>
            <br>
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'projects-link'" :showEdition="onlyAdmin" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
        </div>
         <br>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
    </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import NoteRichText from '../../shared/editableMessages/NoteRichText.vue'
import RichTextPreview from "../../shared/RichTextPreview";
import { SERVICE_NAMES,HTTP_STATUS } from '../../../sipsder_constants';
import {GEOGRAPHY_TYPE, PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES, ATTACHMENT_TYPE, RURALMODEL} from '../../../domain_constants'
import S_UTIL from "../../../util/sipsder_util";
export default {
    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        Treeselect,
        RichTextPreview,
        'note-sipsder':NoteRichText,
    },
    computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && (this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) ||this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL ));
        },
        onlyAdmin(){
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )
        },
        institutions(){
             return this.$store.getters.getInstitutionsF
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        },
        currentUser(){
            return this.$store.state.session.currentUser
        }
        
    },
    async created(){
        this.$store.dispatch( 'getInstitutionsF');
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
            this.ruralModels = response.data.data;
        }
        catch( error ) {
            console.log( 'Error fetching rural models', error );
        }
    },
    data() {
            return {
                GEOGRAPHY_TYPE,
                ATTACHMENT_TYPE,
                MODULES,
                meta: {},
                projects: [],
                isAdvance: false,
                products:[],
                filterProducts: {},
                filterQ: '',
                filterName: '',
                filterState: {},
                filterEnabled: {},
                filterInstitution: {},
                filterLocalities: {},
                filterVillages: {},
                localities: [],
                villages: [],
                villagesFilter: [],
                ruralModels:[],
                pageCount: 0,
                selectedQueryModel: undefined,
                filterEnabledOps:[
                    {
                        label: this.$t( 'proyectTool.announcement.enabled' ),
                        value: true
                    },
                    {
                        label: this.$t( 'proyectTool.announcement.disabled' ),
                        value: false
                    }
                ],
                filterStateOps:[
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
                    },
                    {
                        label: this.$t( 'proyectTool.announcement.create.editing' ),
                        value: 4
                    }
                ],
                filterParams: {
                    page: 1,                    // Page number
                    size: 10,                   // Page size
                },
                filterOrderOps:[
                    {
                        value: "name,asc",
                        label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↓"
                    },
                    {
                        value: "name,desc",
                        label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↑"
                    },
                ],
                filterOrderAdminOps:[
                    {
                        value: "name,asc",
                        label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↓"
                    },
                    {
                        value: "name,desc",
                        label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↑"
                    },
                    {
                        value: "lastModifiedDate,desc",
                        label: this.$t( 'proyectTool.announcement.editOrder' )+" ↓"
                    },
                    {
                        value: "lastModifiedDate,asc",
                        label: this.$t( 'proyectTool.announcement.editOrder' )+" ↑"
                    }
                ],
                filterOrder:{value: "name,asc", label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↓"},
                user: false,
            }
        },
        watch:{
            filterOrder : {
                handler: function(val, oldVal) {
                    this.loadMore();
                },
                deep: true
            },
            filterState:{
                handler: function(val, oldVal) {
                    this.user =false
                    this.loadMore();
                    if(this.isAdministrator && !this.onlyAdmin && this.filterEnable.value == undefined && val.value !=undefined){
                        this.filterEnabled = {
                            label: this.$t( 'proyectTool.announcement.enabled' ),
                            value: true
                        }
                    }
                },
                deep: true
            },
            filterEnabled:{
                handler: function(val, oldVal) {
                    this.user =false
                    this.loadMore();
                    if(this.isAdministrator && !this.onlyAdmin && this.filterState.value == undefined && val.value !=undefined){
                        this.filterState = {
                            label: this.$t( 'proyectTool.announcement.create.publish' ),
                            value: 1
                        }
                    }
                },
                deep: true
            }
        },
        async beforeMount() {
            if(this.$route.query.housing && this.pageCount == 0){
                this.selectedQueryModel = RURALMODEL.HOUSING;
            }

            if(this.isAdministrator){
                this.filterOrder = {
                        value: "lastModifiedDate,desc",
                        label: this.$t( 'proyectTool.announcement.editOrder' )+" ↓"
                    }
            }
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect` + this.buildQuery());
                if(response.status == 200){
                    this.projects= response.data.data;
                    this.meta = response.data.meta
                }
                else{
                    this.meta.totalElements = 0
                }
            }
            catch( error ) {
                console.log( 'Error fetching Projects', error );
            }
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/products`);
                if(response.status == 200){
                    this.products= response.data;
                }
            }
            catch( error ) {
                console.log( 'Error fetching Products', error );
            }
              // LOAD GEOGRAPHIES
            try {
                let response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`);
                if (response.status == HTTP_STATUS.OK) {

                    this.localities = response.data.map(ubication => {
                        return {text: ubication.name, value: ubication};
                    });
                } else {
                    console.info("Error al consumir localidad", response.status);  
                }
                response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.BARRIO}`);
                if (response.status == HTTP_STATUS.OK) {
                    this.villages = response.data.map(ubication => {
                        return {text: ubication.name, value: ubication};
                    });
                    this.villagesFilter = this.villages;
                } else {
                    console.info("Error al consumir vereda", response.status);  
                }
            } catch (e) {
                console.info("Error al consumir geografias", e);
            }
        },
        methods: {
            getImgURL (url) {
                return S_UTIL.getImgURL(url);
            },
            getYTvideoCode(item){
                let url =""
                if(item.typePrincipalAttachment == ATTACHMENT_TYPE.VIDEO){
                    if(item.urlPrincipalAttachment.search("youtube")>0) {
                        url= item.urlPrincipalAttachment
                        var res = url.split("/")
                        var rel = res[4].split("?")
                        return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
                    } 
                }
                else{
                    return this.getImgURL(item.urlPrincipalAttachment)
                }
            },
            async loadMore(){
                try{
                    let response = await VAPI.get(`${SERVICE_NAMES.PROJECTS}/proyect` + this.buildQuery());
                    if(response.status == 200){
                        this.projects= response.data.data;
                        this.meta = response.data.meta
                    }
                    else{
                        this.projects= [];
                        this.meta.totalElements = 0
                    }
                }
                catch( error ) {
                    console.log( 'Error fetching Projects', error );
                }
            },
            clearAll(){
                this.filterQ = ''
                this.filterName = ''
                this.filterState = {}
                this.filterProducts = {}
                this.filterEnabled = {}
                this.filterInstitution = {}
                this.filterLocalities = {}
                this.filterVillages = {}
                this.selectedQueryModel = undefined
                this.filterParams = {
                    page: 1,                    // Page number
                    size: 10,                   // Page size
                }
                this.filterOrder = {value: "name,asc", label: this.$t( 'proyectTool.announcement.nameOrder' )+" ↓"}
                this.user = true
                this.loadMore()
            },
            buildQuery() {
                let query = '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;

                if( this.filterState.value != undefined) {
                    query += '&status=' + this.filterState.value;
                }
                else if(this.onlyAdmin &&  this.filterState.id  == undefined){
                    query += '&status=1,2,3,4'
                }
                else if(this.filterState.id  == undefined){
                    query += '&status=1'
                }
                if( this.filterEnabled.value != undefined) {
                    query += '&enabled=' + this.filterEnabled.value;
                }
                else if(this.onlyAdmin &&  this.filterEnabled.id  == undefined){
                    query += '&enabled=true,false'
                }
                else if(this.filterEnabled.id  == undefined){
                    query += '&enabled=true'
                }
                if(this.onlyAdmin){
                    query +='&ur=0'
                }
                else if(this.isAdministrator){
                    query +='&ur=1'
                }
                else{
                    query +='&ur=2'
                }
                if(this.user && this.isLogged ){
                    query += '&onlyUser=true'
                }
                else{
                    query += '&onlyUser=false'
                }
                if(this.isLogged && this.filterState.value == undefined && this.filterEnabled.value == undefined) query +='&user=true'
                else query += '&user=false'
                if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
                if( this.filterName !== '' ) query += '&name=' + this.filterName;
                if( this.filterInstitution.id !== undefined ) query += '&institution=' + this.filterInstitution.id;
                if( this.filterProducts.id !== undefined ) query += '&product=' + this.filterProducts.id;
                if( this.selectedQueryModel!==null && this.selectedQueryModel!==undefined) query += '&ruralModels=' + this.selectedQueryModel;
                if(this.filterLocalities.value != undefined  && this.filterVillages.value == undefined){
                    query += '&geography=' + this.filterLocalities.value.id;
                }else if(this.filterLocalities.value != undefined && this.filterVillages.value != undefined){
                    query += '&geography=' + this.filterVillages.value.id;
                }
                //query += '&today=' + this.getDate(null);
                if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value ;
                else query += '&sort=lastModifiedDate,desc'
                this.pageCount += 1
                return query;
            },
            async getStatistics( ) {
                try{
                    let response = await VAPI.get(`/${SERVICE_NAMES.PROJECTS}/proyect/statistics`, {
                        responseType: "blob",
                    });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Reporte de proyectos.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                }catch(error){
                    console.log(error);
                    this.errorMessage = error.response.data.message;
                }
            },
            getStatus(announcement){
                if(announcement.idStatus == 1){
                    return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.publish' )+"</span>"
                }
                else if(announcement.idStatus == 2){
                    return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.refused' )+"</span>"
                }
                else if(announcement.idStatus == 3){
                    return "<span style='color: #ea3; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.waiting' )+"</span>"
                }
                else if(announcement.idStatus == 4){
                    return "<span style='color: #00f; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.create.editing' )+"</span>"
                }
                else{
                    return ""
                }
            },
            getEnabled(announcement){
                if(announcement.enabled == true){
                    return "<span style='color: #5a5; font-weight: bold;'>-"+this.$t( 'proyectTool.announcement.enabled' )+"</span>"
                }
                else if(announcement.enabled == false){
                    return "<span style='color: #e35; font-weight: bold;'>-"+this.$t( 'proyectTool.announcement.disabled' )+"</span>"
                }
                else{
                    return ""
                }
            },
        },
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.dot 
    height: 16px
    width: 16px
    border-radius: 50%
    display: inline-block
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_6.png)
    background-repeat: no-repeat
    background-size: 100% 100%
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
.colors-container
    width: 100%
    height: 30px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: left
.filter-box
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
    grid-template-areas: 'a a ab b c c d d' 'e e e i i i g g' 'h h f f k k l l' 'j j j j j j j j'
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
    .t-enabled
        grid-area: ab
    .t-state
        grid-area: b
    .t-input
        grid-area: c
    .t-name
        grid-area: e
    .t-advance
        grid-area: d
        color: #fff
        text-align: center
        cursor: pointer
    .t-institution
        grid-area: f
    .t-myproject
        grid-area: g
        color: #fff
        text-align: center
    .t-rural
        grid-area: h
    .t-products
        grid-area: i
    .t-buttons
        grid-area: j
        text-align: center
    .t-local
        grid-area: k
    .t-neigh
        grid-area: l
.filter-sources
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    min-height: 500px
    margin-top: 20px
    padding: 30px 15px 15px 15px
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    .source-item
        border: 3px solid $colorTitle
        font-size: 1.3rem
        margin-bottom: 10px
        &:last-child
            border: none
        padding: 15px
        .grid-content
            display: grid
            grid-template-columns: 100%
            align-items: center
        .content
            display: grid
            grid-template-columns: 48% 48%
            grid-gap: 2%
            grid-template-areas: "a b"
        .area-a
            grid-area: a
            a
                color: #000
                text-decoration: none
        .area-b
            grid-area: b
            .container-i
                width: 50%
                height: 250px
                text-align: center
                float: right
                overflow: hidden
            img
                height: 100%
                max-width: 100%
        .requirement
            padding: 15px
            border: 1px solid #333
            border-radius: 10px
            max-height: 350px
            overflow: auto;
        .geosL
            span
                &:not(1)
                    &:before
                      content: ','  
                    
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

@media screen  and (max-width: $widthTablet)
    .filter-box
        grid-template-columns: 100% !important
        grid-template-areas: 'a' 'ab' 'b' 'c' 'd' 'e' 'i' 'g' 'h' 'f' 'k' 'l' 'j' !important
    .filter-sources 
        .source-item 
            .area-b 
                .container-i
                    width: 100% !important
    .col-90
        width: 80% !important
    .content
        grid-template-columns: 1fr !important
        grid-template-areas: 'a' 'b' !important
        .area-b
            .container-i
                width: 50%
                height: 250px
                text-align: center
                float: none !important
                overflow: hidden
            img
                height: 100%
                max-width: 100%
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 50px
    .info-filter
        height: 100px !important
        .info
            position: unset !important
        .sort
            position: unset !important
</style>