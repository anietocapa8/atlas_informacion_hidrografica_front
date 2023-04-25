<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.announcement.title' )}}</div>
        
        <div class="col-90 container-form">
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'announcement'" :showEdition="onlyAdmin" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
            <br>
            <div class="filter-box" :class="{'alt-no-admin' : !onlyAdmin}">
                <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
                 <div class="t-enabled grid-col" v-if="onlyAdmin">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                        <v-select v-model.trim="filterEnabled" label="label" :placeholder="$t( 'proyectTool.announcement.create.enabled' )" :options="filterEnabledOps"  class="font-size-14"></v-select>
                    </b-form-group>                
                </div>
                <div class="t-state grid-col" v-if="onlyAdmin">
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
                        <b-form-input :placeholder="$t( 'proyectTool.announcement.name' )" v-model="filterName" v-validate="'max:70'"></b-form-input>
                    </b-form-group>
                </div>
                <div class="t-institution grid-col" v-show="isAdvance && institutions">
                     <b-form-group label-class="font-weight-bold">
                        <v-select v-if="institutions" v-model.trim="filterInstitution" label="name" :placeholder="$t( 'calendar.institution')" :options="institutions"></v-select>
                    </b-form-group>
                </div>
                <div class="t-valid" v-show="isAdvance">
                    <b-form-group
                        :label-cols="4"
                        label="" >
                        <b-form-radio-group id="radios1" label="label" :options="radioOptions" v-model="filterValid" name="radioOpenions" :staked="false" style="color: #fff"></b-form-radio-group>
                    </b-form-group>
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
                <div class="t-geo grid-col" v-show="isAdvance && geoLocal">
                      <b-form-group label-class="font-weight-bold">
                        <v-select v-if="geoLocal" v-model.trim="filterGeo" label="name" :placeholder="$t( 'calendar.geo')" :options="geoLocal"></v-select>
                    </b-form-group>
                </div>
                <div class="grid-col buttons-col t-buttons">
                    <sipsder-btn btnType="search" @onClick="loadMore"></sipsder-btn>
                    <sipsder-btn btnType="clean"  @onClick="clearAll"></sipsder-btn>
                </div>
            </div>
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
                    <sipsder-btn btnType="add" @onClick="$router.push({ name: 'ProyectToolAnnouncementAdmin'})"></sipsder-btn>
                </div>

                <div class="source-item item" v-for="(announcement,i) in announcements" :key="i">
                    <div class="grid-content">
                        <div class="content">
                            <div class="area-a">
                                <span v-html="getStatus(announcement)+getEnabled(announcement)" v-if="isAdministrator"></span><span v-if="currentUser != null"><sipsder-btn btnType="edit_pen" text="" v-if="onlyAdmin || announcement.idUser === currentUser.id" style="transform: scale(0.7)" @onClick="$router.push({ name: 'ProyectToolAnnouncementAdmin', params:{id: announcement.id}})"></sipsder-btn></span><br> 
                                <div><h2><b>{{announcement.name}}</b></h2></div>
                                <div v-if="onlyAdmin"><b>{{$t( 'library.visor.addFor' )}}</b>&nbsp; <i class="fas fa-user"></i> {{announcement.userName}} {{announcement.userLastName}}, {{announcement.userType}}</div>
                                <div><b>{{$t( 'proyectTool.fundingSource.institution' )}}: </b>{{announcement.nameInstitution}}</div>
                                <div><b>{{$t( 'proyectTool.announcement.geo' )}}: </b> <span v-for="(g,i) in announcement.geographies" :key="i">{{g.name}}<span v-if="i<announcement.geographies.length-1">,</span> </span></div>
                            </div>
                            <div class="area-b">
                                <div class="colors-container" >
                                     <span v-html="getValid(announcement.startDate, announcement.endDate)" v-if="isAdministrator"></span> &nbsp; <span v-if="getValidBool(announcement.startDate, announcement.endDate)"><b>{{$t( 'proyectTool.announcement.startDate' )}}</b> {{announcement.startDate | moment("DD-MM-YYYY")}}
                                     - </span><b>{{$t( 'proyectTool.announcement.endDate' )}}</b> {{announcement.endDate | moment("DD-MM-YYYY")}} &nbsp; &nbsp;
                                    <div class="colors" v-for="(r, j) in announcement.ruralModels" :key="j"
                                        :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name">
                                    </div>
                                </div>
                                <br>
                                <span class="link"><a :href="announcement.url" target="_blank">{{$t( 'proyectTool.announcement.oficialSite' )}}</a></span>
                            </div>
                            <div class="area-c">
                                <div><b>{{$t('proyectTool.announcement.summary')}}:</b> {{announcement.summary}}</div>
                                <br>
                                <div class="requirement">
                                    <rich-text-preview :content="announcement.requirement" />
                                </div>                           
                                <div v-if="announcement.projects!=null">
                                    <div v-if="announcement.projects.length>0">
                                        <br>
                                        <b>{{$t( 'proyectTool.fundingSource.projectS' )}}</b><br>
                                        <router-link v-for="(p,i) in announcement.projects" :to="{name: 'ProyectToolProyectDetail', params:{id: p.id}}" :key="i">{{p.name}}</router-link>
                                    </div>
                                </div>
                                <div v-if="announcement.fundingSources!=null">
                                    <div v-if="announcement.fundingSources.length>0">
                                        <br>
                                        <b>{{$t( 'proyectTool.announcement.funding' )}}</b><br>
                                        <router-link v-for="(p,i) in announcement.fundingSources" :to="{name: 'ProyectToolFundingSource', query:{q: p.name}}" :key="i" class="link-u">{{p.name}}</router-link>
                                    </div>
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
        <b-modal ref="alertModal" :title="$t('modal.title')" hide-footer size="lg">
          <b-row class="w-100 center">
            <rich-text-preview class="w-100 red" :content="$t( 'proyectTool.announcement.loggin' )"/>
            <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="accept" :text="$t('community.images.btn_close')" @onClick="closeModal('alertModal')"></sipsder-btn>
                <sipsder-btn btnType="login" :text="$t('community.images.btn_action')" v-b-modal.login></sipsder-btn>
            </div>
          </b-row>
      </b-modal>  
    </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import NoteRichText from '../../shared/editableMessages/NoteRichText.vue'
import RichTextPreview from "../../shared/RichTextPreview";
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, FUNDING_SOURCE_TYPE,  MODULES} from '../../../domain_constants'
import S_UTIL from "../../../util/sipsder_util";
export default {
    components:{
        "v-select": vSelect,
        VueBootstrapTypeahead,
        Treeselect,
        RichTextPreview,
        'note-sipsder':NoteRichText,
    },
    data(){
        return{
            MODULES,
            meta: {},
            announcements: [],
            isAdvance: false,
            filterQ: '',
            filterName: '',
            filterState: {},
            filterEnabled: {},
            filterInstitution: {},
            filterGeo: {},
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
                }
            ],
            radioOptions:[
                 {
                    text: this.$t( 'proyectTool.announcement.next' ),
                    value: 0
                },
                {
                    text: this.$t( 'proyectTool.announcement.valid' ),
                    value: 1
                },
                {
                    text: this.$t( 'proyectTool.announcement.noValid' ),
                    value: 2
                }
            ],
            filterValid: null,
            ruralModels: [],
            selectedQueryModel: undefined,
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
                {
                    value: "startDate,desc",
                    label: this.$t( 'proyectTool.announcement.dateOrder' )+" ↓"
                },
                {
                    value: "startDate,asc",
                    label: this.$t( 'proyectTool.announcement.dateOrder' )+" ↑"
                }
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
                    value: "startDate,desc",
                    label: this.$t( 'proyectTool.announcement.dateOrder' )+" ↓"
                },
                {
                    value: "startDate,asc",
                    label: this.$t( 'proyectTool.announcement.dateOrder' )+" ↑"
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
            user: true,
        }
    },
    async created(){
        this.$store.dispatch( 'getGeoLocal');
        this.$store.dispatch( 'getInstitutionsF');
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
            this.ruralModels = response.data.data;
        }
        catch( error ) {
            console.log( 'Error fetching rural models', error );
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
            },
            deep: true
        },
        filterEnabled:{
             handler: function(val, oldVal) {
                this.user =false
                this.loadMore();
            },
            deep: true
        }
    },
    async beforeMount() {
        if(this.isAdministrator){
            this.filterOrder = {
                    value: "lastModifiedDate,desc",
                    label: this.$t( 'proyectTool.announcement.editOrder' )+" ↓"
                }
        }
         try{
            let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/announcements` + this.buildQuery());
            if(response.status == 200){
                this.announcements= response.data.data;
                this.meta = response.data.meta
            }
            else{
                this.meta.totalElements = 0
            }
        }
        catch( error ) {
            console.log( 'Error fetching Announcements', error );
        }
        if(!this.isLogged) this.showModal("alertModal")
    },
    computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && (this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) ||this.$store.getters.hasPermission( PERMISSIONS_TYPES.CONTROL ));
        },
        onlyAdmin(){
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )
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
        currentUser(){
            return this.$store.state.session.currentUser
        }
    },
    methods:{
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        async loadMore(){
            try{
                let response = await VAPI.get(`${SERVICE_NAMES.PROYECT_TOOL}/announcements` + this.buildQuery());
                if(response.status == 200){
                    this.announcements= response.data.data;
                    this.meta = response.data.meta
                }
                else{
                    this.announcements= []
                    this.meta.totalElements = 0
                }
            }
            catch( error ) {
                console.log( 'Error fetching Announcements', error );
            }
        },
        clearAll(){
            this.filterQ = ''
            this.filterName = ''
            this.filterState = {}
            this.filterEnabled = {}
            this.filterInstitution = {}
            this.filterGeo = {}
            this.selectedQueryModel = undefined
            this.filterParams = {
                page: 1,                    // Page number
                size: 10,                   // Page size
            }
            this.filterValid = null
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
                query += '&status=1,2,3'
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
            if(this.user && this.isAdministrator){
                query += '&user=true'
            }
            else{
                query += '&user=false'
            }
            if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
            if( this.filterName !== '' ) query += '&name=' + this.filterName;
            if( this.filterGeo.id !== undefined  ) if(this.filterGeo.id !== null ) query += '&geography=' + this.filterGeo.id;
            if( this.filterInstitution.id !== undefined ) query += '&institution=' + this.filterInstitution.id;
            if( this.filterValid!==null && this.filterValid!==undefined) query += '&valid=' + this.filterValid;
            if( this.selectedQueryModel!==null && this.selectedQueryModel!==undefined) query += '&ruralModels=' + this.selectedQueryModel;
            query += '&today=' + this.getDate(null);
            if(this.filterOrder.value!=null) query += '&sort=' + this.filterOrder.value ;
            else query += '&sort=lastModifiedDate,desc'
            return query;
        },
        getDate (date) {
            const toTwoDigits = num => num < 10 ? '0' + num : num;
            if(date==null ){
                
                let today = new Date();
                date= today.getFullYear()+"-"+toTwoDigits(today.getMonth()+1)+"-"+toTwoDigits(today.getDate())+" "+toTwoDigits(today.getHours())+":"+toTwoDigits(today.getMinutes())+":"+toTwoDigits(today.getSeconds())
            }
            else{
                date = moment(date , 'YYYY-MM-DD').format('YYYY-MM-DD') + " 00:00:00" 
            }
            
            return date
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
        getValid(start, end){
            let today = new Date();
            if(today<start){
                return "<span style='color: #ea3; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.next' )+"</span>"
            }
            else if(today >= start && today<= end){
                return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.valid' )+"</span>"
            }
            else if(today>end){
                 return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'proyectTool.announcement.noValid' )+"</span>"
            }
            else{
                return ""
            }
        },
        getValidBool(start, end){
            let today = new Date();
            if(today<start){
                return true
            }
            else if(today >= start && today<= end){
                return true
            }
            else if(today>end){
                 return false
            }
            else{
                return true
            }
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },  
    }
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
.colors-container
    width: 100%
    height: 30px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: right
.alt-no-admin
    grid-template-areas: 'a c c c d' 'e e f f g' 'h h i i .' 'j j j j j' !important
.filter-box
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr
    grid-template-areas: 'a ab b c d' 'e e f f g' 'h h i i .' 'j j j j j'
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
        text-align: right
        cursor: pointer
    .t-institution
        grid-area: f
    .t-valid
        grid-area: g
    .t-rural
        grid-area: h
    .t-geo
        grid-area: i
    .t-buttons
        grid-area: j
        text-align: center
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
            grid-template-columns: 1fr 1fr
            grid-template-areas: "a b" "c c"
        .area-a
            grid-area: a
        .area-b
            grid-area: b
            text-align: right
        .area-c
            grid-area: c
        .requirement
            padding: 15px
            border: 1px solid #333
            border-radius: 10px
            max-height: 350px
            overflow: auto;
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
.link
    font-size: 1.8rem
.link-u
    display: block
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 40px
    .info-filter
        height: 100px !important
        .info
            position: unset !important
        .sort
            position: unset !important
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .alt-no-admin
        grid-template-areas: 'a''c' 'd' 'e' 'f' 'g' 'h' 'i' 'j' !important
    .filter-box
        grid-template-columns: 1fr !important
        grid-template-areas: 'a' 'ab' 'b' 'c' 'd' 'e' 'f' 'g' 'h' 'i' 'j' !important

</style>