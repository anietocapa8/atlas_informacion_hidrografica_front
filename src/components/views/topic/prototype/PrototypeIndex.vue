<template>
    <div class="procedure-index">
        <div class="feed-title">{{$t( 'prototype.title' ).toUpperCase()}}</div>
        <div class="col-90 container-form">
            <div class="note">
              <div class=text v-if="legalNote">
                    <div v-for="(note, i) in legalNote"  :key="i">
                        <div v-if="isAdministrator">
                            <sipsder-btn btnType="edit_pen" :text="$t( 'prototype.index.legatNote_edit' )" @onClick="isEditLegalNote = true" v-if="!isEditLegalNote"></sipsder-btn>
                            <sipsder-btn :text="$t( 'prototype.cancel' )" btnType="cancel" @onClick="unSetEditLegal" v-if="isEditLegalNote"></sipsder-btn>
                            <sipsder-btn :text="$t( 'prototype.save' )" btnType="add" @onClick="updateNote(note)" v-if="isEditLegalNote"></sipsder-btn> 
                            <span> &nbsp; {{$t( 'prototype.index.legalNoteMessage' )}}</span>    
                        </div>
                        <rich-text-preview :content="note.content" v-if="!isEditLegalNote"/>
                        <rich-text :options="customToolbar" @changeValue="changeValueLegalNote" :newContent="note.content" v-else></rich-text>
                    </div>
              </div>
            </div>
            <br>
            <div class="filter-box">
                <div class="legend">{{$t( 'community.survey.filter' ).toUpperCase()}}</div>
                <div class="t-geo grid-col">   
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                        <v-select 
                            :placeholder="$t('prototype.create.form.locality')"
                            v-model="filter.localidad" 
                            label="text" :options="autocomplets.localidades">
                        </v-select>
                    </b-form-group>
                </div>
                <div class="t-subgeo grid-col">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                         <v-select 
                            :placeholder="$t('prototype.create.form.sub_locality')"
                            v-model="filter.village" 
                            label="text" :options="autocomplets.villagesFilter"
                            :disabled="!filter.localidad">
                        </v-select>
                    </b-form-group>
                </div>
                <div class="t-input grid-col">
                        <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                            <b-form-input :placeholder="$t( 'calendar.q')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
                        </b-form-group>
                </div>
                <div class="t-state grid-col" v-if="isAdministrator">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                        <v-select v-model.trim="filterState" label="label" :placeholder="$t( 'community.survey.status' )" :options="filterStateOps"  class="font-size-14"></v-select>
                    </b-form-group>                
                </div>
                <div ref="procedure-list" class="grid-col buttons-col t-buttons">
                    <sipsder-btn btnType="search" @onClick="loadMore" ></sipsder-btn>
                    <sipsder-btn btnType="clean" @onClick="clearfilter"></sipsder-btn>
                </div>
            </div>
            <div v-if="meta" class="procedure-list">
                <div class="item">
                <div class="info-filter">
                  <div class="info">
                    {{meta.totalElements}} {{$t( 'library.results' )}}
                  </div>
                  <div class="sort" v-if="!isAdministrator">
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                      {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterDate" label="label" :placeholder="'Orden'" :options="filterDateOps"></v-select>
                    </b-form-group>
                  </div>
                  <div class="sort" v-else>
                    <b-form-group :label-cols="4" label-class="font-weight-bold">
                      {{$t( 'library.orderBy' )}} <v-select v-model.trim="filterDate" label="label" :placeholder="'Orden'" :options="filterDateOpsAdmin"></v-select>
                    </b-form-group>
                  </div>
                </div>
                <b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
                        @input="loadMore()"
                        :per-page="filterParams.size"></b-pagination>
                </div>
                <div style="text-align:right"><sipsder-btn btnType="add"  v-if="isAdministrator" @onClick="prototypeCreate()"></sipsder-btn></div>
                <div class="procedure-item item" v-for="(prototype,i) in prototypes" :key="i">
                    <div class="grid-content">
                        <template v-if="prototype.attachment.typeName == 'Video' && !isVideoYT(prototype.attachment.url)">
                            <iframe :src="prototype.attachment.url"/>
                            <div class="box-image" @click="prototypeDetail(prototype)"/>
                        </template>
                        <img
                            v-else
                            class="box-image"
                            @click="prototypeDetail(prototype)"
                            :src="(prototype.attachment.typeName === 'Video') ? getImageYT(prototype.attachment.url) : getImgURL(prototype.attachment.url)"
                            >
                        <div>
                            <span v-html="getStatus(prototype.state)" v-if="isAdministrator"></span><br>
                            <b><div style="cursor: pointer" @click="prototypeDetail(prototype)">{{prototype.name}}</div></b><br>
                            <rich-text-preview :content="prototype.description" style="display:inline-block; overflow: hidden;text-overflow: ellipsis; width:auto; max-width:100%; max-height: 50px"/>
                            <p style="font-size: 0.7em">{{new Date(prototype.date) | moment("DD/MM/YYYY") }}</p>
                            <br>
                        </div>
                        <div style="justify-self:end">
                            <sipsder-btn btnType="edit_pen" text=""  @onClick="prototypeEdit(prototype)" v-if="isAdministrator"></sipsder-btn><br>
                            <sipsder-btn btnType="search" :text="$t('prototype.index.watch')" @onClick="prototypeDetail(prototype)"></sipsder-btn><br>
                        </div>
                    </div>
                </div>
                <br>
                <div><b-pagination size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
                                @input="loadMore()"
                                :per-page="filterParams.size"></b-pagination>
                </div>
            </div>
            <div v-else class="no-elements mt-5">
                <p>{{$t( 'prototype.index.no_elements' )}}</p>
                <div style="text-align:right">
                    <sipsder-btn btnType="add" v-if="isAdministrator" @onClick="prototypeCreate()"></sipsder-btn>
                </div>
            </div>
        </div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
    </div>
</template>

<script>
import RichText from '../../../shared/RichText.vue'
import RichTextPreview from '../../../shared/RichTextPreview'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../../http_common';
import _ from 'lodash';
import moment from 'moment';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../../sipsder_constants';
import { PERMISSIONS_TYPES, MODULES, GEOGRAPHY_TYPE} from '../../../../domain_constants'
import S_UTIL from "../../../../util/sipsder_util";

export default {
    components: {
        RichText,
        RichTextPreview,
        Treeselect,
        "v-select": vSelect 
    },
    data(){
        return{
            prototypes: [],
            meta:[],
            notes:[],
            isEditLegalNote: false,
            geographies: null,
            villages: null,
            villagesFilter: null,
            selectedQueryModel: [],
            village: {},
            filterQ: '',
            filterState: {},
            autocomplets: {
                localidades: [],
                villages: [],
                villagesFilter: [],
            },
            filter: {
                localidad: null,
                village: null,
            },
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
            filterDateOps:[
                {
                    value: "name,asc",
                    label: this.$t( 'procedure.index.name' )+" ↓"
                },
                {
                    value: "name,desc",
                    label: this.$t( 'procedure.index.name' )+" ↑"
                },
                {
                    value: "date,desc",
                    label: this.$t( 'prototype.index.date' )+" ↓"
                },
                {
                    value: "date,asc",
                    label: this.$t( 'prototype.index.date' )+" ↑"
                },
            ],
            filterDateOpsAdmin:[
                {
                    value: "lastModifiedDate,desc",
                    label: this.$t( 'prototype.index.edition_date' )+" ↓"
                },
                {
                    value: "lastModifiedDate,asc",
                    label: this.$t( 'prototype.index.edition_date' )+" ↑"
                },
                {
                    value: "date,desc",
                    label: this.$t( 'prototype.index.date' )+" ↓"
                },
                {
                    value: "date,asc",
                    label: this.$t( 'prototype.index.date' )+" ↑"
                },
                {
                    value: "name,asc",
                    label: this.$t( 'procedure.index.name' )+" ↓"
                },
                {
                    value: "name,desc",
                    label: this.$t( 'procedure.index.name' )+" ↑"
                },
            ],
            filterDate:{value: "name,asc", label: this.$t( 'procedure.index.name' )+" ↓"},
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
    async beforeMount(){
        // LOAD PROTOTYPES
        try{
            let query = this.buildQuery()
            let response3 = await VAPI.get(`/${SERVICE_NAMES.PROTOTYPE}` + query );
            this.prototypes = response3.data.data;
            this.meta = response3.data.meta
        }
        catch(e) {
            console.log( 'Error fetching PROTOTYPES', e );
        }
        // LOAD NOTES
        try{
            let response2 = await VAPI.get(`/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.RURAL_HOUSING}`);
            this.notes = response2.data.data;
        }catch(e){
            console.log( 'Error fetching NOTES', e );
        }
        // LOAD GEOGRAPHIES
        try {
            let response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`);
            if (response.status == HTTP_STATUS.OK) {

                this.autocomplets.localidades = response.data.map(ubication => {
                    return {text: ubication.name, value: ubication};
                    });
            } else {
                console.info("Error al consumir localidad", response.status);  
            }
            response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.BARRIO}`);
            if (response.status == HTTP_STATUS.OK) {
                this.autocomplets.villages = response.data.map(ubication => {
                    return {text: ubication.name, value: ubication};
                });;
                this.autocomplets.villagesFilter = this.autocomplets.villages;
            } else {
                console.info("Error al consumir vereda", response.status);  
            }
        } catch (e) {
            console.info("Error al consumir geografias", e);
        }
    },
    computed:{
        legalNote(){
            if(this.notes.length)
                return this.notes.filter(e=>{ return e.key=="descripcion-prototipo"})
        },
        isAdministrator() {
            let isAdmin = false;
            if (this.$store.getters.isAuthenticated)
                if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                    isAdmin = true 
            return isAdmin;
        },
    },
    watch:{
        filterDate : {
            handler: function(val, oldVal) {
                this.loadMore();
            },
            deep: true
        },
        'filter.localidad' : function(newVal) {
            this.filter.village = null;
            if (!newVal) {
                this.autocomplets.villagesFilter = this.autocomplets.villages;
            } else {
                this.autocomplets.villagesFilter = this.autocomplets.villages.filter(loc => {
                    return loc.value.parentId == newVal.value.id;
                });
            }
            },
            'filter.village' : function(newVal) {
                if (newVal) {
                    this.filter.localidad = this.autocomplets.localidades.find(loc => loc.value.id == newVal.value.parentId);
                }
            },
    },
    methods:{
        getImgURL (url) {
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
        scrollMeTo(refName) {
            var element = this.$refs[refName];
            element.scrollIntoView({  behavior: 'smooth' });
        },
        buildQuery() {
            // console.info('PAGE ', this.filterParams.page-1)
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
            if(this.filter.localidad && !this.filter.village){
                query += '&geography=' + this.filter.localidad.value.id;
            }else if(this.filter.localidad && this.filter.village){
                query += '&geography=' + this.filter.village.value.id;
            }
            if(this.filterDate.value!=null){ 
                query += '&sort=' + this.filterDate.value ;
                } 
            else if(this.isAdministrator){
                query += 'lastModifiedDate,desc'
            } 
            else {
                query += 'name,desc'
            }

            return query;
        },
        async loadMore(){
            this.prototypes=[]
            this.meta=[]
            let query = this.buildQuery()
            try{
                const response3 = await VAPI.get(`/${SERVICE_NAMES.PROTOTYPE}` + query );
                this.prototypes = response3.data.data;
                this.meta = response3.data.meta
            }
            catch( error ) {
                console.log( 'Error fetching Procedure', error );
            }
            this.scrollMeTo('procedure-list')
        },
        clearfilter(){
            this.filterParams = { page: 1, size: 10, }
            if(this.isAdministrator){
                this.filterDate = {value: "lastModifiedDate,desc", label: this.$t( 'prototype.index.edition_date' )+" ↓"}
            }else{
                this.filterDate = {value: "name,desc", label: this.$t( 'procedure.index.name' )+" ↓"}
            }
            this.filterQ = ""
            this.filterState =  {}
            this.autocomplets.villagesFilter = this.autocomplets.villages;
            this.filter.localidad = null;
            this.filter.village = null;
            this.loadMore()
        },
        async reloadNotes(){
            try{
                let response2 = await VAPI.get( `/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.RURAL_HOUSING}` );
                this.notes = response2.data.data
            }
            catch( error ) {
                console.log( 'Error fetching Notes', error );
            }
        },
        getStatus(status){
            if(status == true){
                return "<span style='color: #5a5; font-weight: bold;'>"+this.$t( 'prototype.index.enabled' ).toUpperCase()+"</span>"
            }
            else if(status == false){
                return "<span style='color: #e35; font-weight: bold;'>"+this.$t( 'prototype.index.disabled' ).toUpperCase()+"</span>"
            }
            else{
                return ""
            }
        },
        changeValueLegalNote(value){
            this.legalNote[0].content = value
        },
        unSetEditLegal(){
            this.isEditLegalNote = false
            this.reloadNotes()
        },
        updateNote(note){
            VAPI.put(`/${SERVICE_NAMES.SIPSDER_NOTE}/update`, note).then((output)=>{
                this.unSetEditLegal()
            }).catch((e)=>{
                alert("Error actualizando Nota. "+ e)
            })
        },
        prototypeDetail(item) {
            this.$router.push({ name: 'PrototypesDetail', params: {id: item.id} });
        },
        prototypeCreate(){
            this.$router.push({ name: 'PrototypesCreate' });
        },
        prototypeEdit(item){
            this.$router.push({ name: 'PrototypesCreate' , params: {id: item.id} });
        },

    }
}
</script>

<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'
.no-elements
    padding: 30px
    text-align: center
.box-image
    width: 250px
    height: 250px
    border-radius: 20px
    background-color: white
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
    cursor: pointer
.note
    padding: 25px;
    margin-bottom: 10px;
    .text
        text-align: justify
.procedure-index
    width: 100%
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto 
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../../assets/title/barra_sola_4.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    height: 90px
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 20px)
    padding-top: 20px
.filter-box
    display: grid
    grid-template-columns: 1fr 1fr 1fr
    grid-template-areas: 'a b c' 'd e f'
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
    .t-geo
        grid-area: d
    .t-subgeo
        grid-area: e
    .t-state
        grid-area: b
    .t-input
        grid-area: c
    .t-buttons
        grid-area: f
        text-align: center
.procedure-list
    background: linear-gradient(#fff,#fff) padding-box, linear-gradient(to bottom, transparent, $colorTitle) border-box
    min-height: 500px
    margin-top: 20px
    padding: 30px 15px 15px 15px
    border-bottom-left-radius: 10px
    border-bottom-right-radius: 10px
    border: 3px solid transparent
    .procedure-item
        border-bottom: 3px solid
        border-image-source: linear-gradient(90deg, transparent 0%, $colorTitle 50%, transparent 100%)
        border-image-slice: 1
        &:last-child
            border: none
        padding: 15px
        .grid-content
            display: grid
            grid-template-columns: 30% 50% 20%
            align-items: center
            padding: 20px
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
        grid-template-areas: 'a' 'b' 'c' 'd' 'e' 'f' !important
    .procedure-list
        .procedure-item
            .grid-content
                grid-template-columns: 100% !important
    .info-filter
        height: 100px !important
        .info
            position: unset !important
        .sort
            position: unset !important
</style>