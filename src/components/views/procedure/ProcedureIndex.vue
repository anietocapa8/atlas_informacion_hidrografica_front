<template>
    <div class="procedure-index">
        <div class="feed-title">{{$t( 'procedure.title' ).toUpperCase()}}</div>
        <div class="col-90 container-form">
            <div v-if="!isAdministrator"><h3>{{$t( 'procedure.index.noAdmin' )}}</h3></div>
            <div v-else><h3>{{$t( 'procedure.index.admin' )}}</h3></div>
            <br>
            <div v-if="isAdministrator"><sipsder-btn btnType="export_data" @onClick="getStatistics" :text="$t( 'faqs.export_statistics' )"></sipsder-btn></div>
            <b-row class="filter-box">
                <b-col>
                    <b-row>
                        <b-col>
                            <div class="legend">
                                {{$t( 'community.survey.filter' ).toUpperCase()}}
                            </div>
                        </b-col>
                        <b-col>
                            <b-form-group :label-cols="4" label-class="font-weight-bold" description= "">
                                <b-form-input :placeholder="$t('calendar.q')" v-model="filterQ" v-validate="'max:70'"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col v-if="isAdministrator" class="t-state grid-col" >
                                <b-form-group :label-cols="4" label-class="font-weight-bold">
                                    <v-select v-model.trim="filterState" label="label" :placeholder="$t( 'community.survey.status' )" :options="filterStateOps"  class="font-size-14"></v-select>
                                </b-form-group>                
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="t-select grid-col" md="8">
                            <treeselect v-model="selectedQueryModel" 
                                :multiple="true" 
                                :options="ruralModels"
                                :openDirection="'below'"
                                :placeholder="$t( 'faqs.modal.rural_select' )"
                                :clearable="true"
                                :default-expand-level="1">
                                <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                                    <img v-if="node.raw && node.raw.url != null" 
                                        :src="getImgURL(node.raw.url)" height="16" width="16">
                                    <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                                    <span> {{ node.label.split('/')[0] }} </span>
                                    <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                                    <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                                </label>
                            </treeselect>
                        </b-col>
                        <b-col>
                            <div class="grid-col buttons-col t-buttons">
                                <sipsder-btn btnType="search" @onClick="loadMore" ></sipsder-btn>
                                <sipsder-btn btnType="clean" @onClick="clearfilter"></sipsder-btn>
                            </div>    
                        </b-col>
                    </b-row>       
                </b-col>   
            </b-row>
            <div class="note">
              <div class=text v-if="legalNote != undefined && legalNote != null">
                    
                    <div v-for="(note, i) in legalNote"  :key="i">
                        <div v-if="isAdministrator">
                            <sipsder-btn btnType="edit_pen" :text="$t('procedure.index.edit_btn')" @onClick="isEditLegalNote = true" v-if="!isEditLegalNote"></sipsder-btn>
                            <sipsder-btn btnType="cancel" @onClick="unSetEditLegal" v-if="isEditLegalNote"></sipsder-btn>
                            <sipsder-btn btnType="save" @onClick="updateNote(note)" v-if="isEditLegalNote"></sipsder-btn> 
                            <span> &nbsp; {{$t( 'procedure.index.legalNoteMessage' )}}</span>    
                        </div>
                        <h2>{{$t( 'procedure.index.legalNote' )}}</h2>
                        <rich-text-preview :content="note.content" v-if="!isEditLegalNote"/>
                        <rich-text :options="customToolbar" @changeValue="changeValueLegalNote" :newContent="note.content" v-else></rich-text>
                    </div>
              </div>
            </div>
            <div class="procedure-list" v-if="meta">
                <div class="item">
                    <div class="info-filter">
                    <div class="info">
                        {{meta.totalElements}} {{$t( 'library.results' )}}
                    </div>
                    <div class="sort">
                        <b-form-group :label-cols="4" label-class="font-weight-bold">
                            {{$t( 'library.orderBy' )}} 
                            <v-select v-model.trim="filterOrder" label="label" :placeholder="'Orden'" :options="filterOrderOps">

                            </v-select>
                        </b-form-group>
                    </div>
                    </div>

                    <b-pagination ref="pagination-top" size="md" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
                            @input="loadMore()"
                            :per-page="filterParams.size"
                    ></b-pagination>
                </div>

                <div style="text-align:right"><sipsder-btn btnType="add" v-if="isAdministrator" @onClick="procedureCreate"></sipsder-btn></div>
                <div class="procedure-item item" v-for="(procedure,i) in procedures" :key="i">
                    <div class="grid-content">
                        <div>
                            <span v-if="isAdministrator && !procedure.state"
                                style='color: #e35; font-weight: bold;'
                                v-t="'procedure.index.disabled'"/>
                            <br>
                            <b><div @click="procedureDetail(procedure.id)" v-if="procedure && procedure.name">{{ procedure.name }}</div></b>
                            <p>{{ procedure.summary }}</p>
                            <div class="colors-container" >
                            <div class="colors" v-for="(r, j) in procedure.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                            </div>
                        </div>
                        <div style="justify-self:end">
                            <sipsder-btn btnType="edit_pen" text=""  @onClick="procedureEdit(procedure.id)" v-if="isAdministrator"></sipsder-btn><br>
                            <sipsder-btn btnType="search" :text="$t('util.view')" @onClick="procedureDetail(procedure.id)"></sipsder-btn><br>
                        </div>
                    </div>
                </div>
                <br>
                <div>
                    <b-pagination ref="pagination-bottom" size="md" style="justify-content: center;" 
                            :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta !== null"
                            @change="loadMore()"
                            :per-page="filterParams.size"
                    ></b-pagination>
                </div>
            </div>
            <template v-else>
                <div class="text-right">
                    <sipsder-btn btn-type="add" v-if="isAdministrator" @onClick="procedureCreate"/>
                </div>
                <b-row class="no-results">
                    <b-col>
                        {{ $t('procedure.index.no_procedures') }}
                    </b-col>
                </b-row>
            </template>
            <div class="note">
                <div class=text v-if="otherNote != undefined && otherNote != null">
                     <div v-for="(note, i) in otherNote"  :key="i" >
                         <div v-if="isAdministrator">
                            <sipsder-btn btnType="edit_pen" :text="$t('procedure.index.edit_btn')" @onClick="isEditOtherNote = true"  v-if="!isEditOtherNote"></sipsder-btn>
                            <sipsder-btn btnType="cancel" @onClick="unSetEditOther" v-if="isEditOtherNote"></sipsder-btn>
                            <sipsder-btn :text="$t('button.save')" btnType="add"  @onClick="updateNote(note)" v-if="isEditOtherNote"></sipsder-btn>
                            <span> &nbsp; {{$t( 'procedure.index.otherNoteMessage' )}}</span>       
                        </div>
                        <rich-text-preview :content="note.content" v-if="!isEditOtherNote"/>
                        <rich-text :options="customToolbar" @changeValue="changeValueOtherNote" :newContent="note.content" v-else></rich-text>
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
    </div>
</template>

<script>
import RichText from '../../shared/RichText.vue'
import RichTextPreview from '../../shared/RichTextPreview'
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import _ from 'lodash';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, MODULES, RURALMODEL} from '../../../domain_constants'
import S_UTIL from "../../../util/sipsder_util";

export default {
    components:{
        RichText,
        RichTextPreview,
        Treeselect,
        "v-select": vSelect 
    },
    data(){
        return{
            loadingPage : true,
            procedures: [],
            meta:[],
            notes:[],
            isEditLegalNote: false,
            isEditOtherNote: false,
            ruralModels: [],
            selectedQueryModel: [],
            filterQ: '',
            filterState: {},
            filterStateOps:[
                {
                    label: this.$t( 'procedure.index.enabled' ),
                    value: 1
                },
                {
                    label: this.$t( 'procedure.index.disabled' ),
                    value: 0
                }
            ],
            filterParams: {
                page: 1,                    // Page number
                size: 10,                   // Page size
            },
            filterOrderOps:[
                {
                    value: "count.count,desc",
                    label: this.$t( 'procedure.index.moreVisited' )+" ↓"
                },
                {
                    value: "count.count,asc",
                    label: this.$t( 'procedure.index.moreVisited' )+" ↑"
                },
                {
                    value: "name,desc",
                    label: this.$t( 'procedure.index.name' )+" ↓"
                },
                {
                    value: "name,asc",
                    label: this.$t( 'procedure.index.name' )+" ↑"
                }
            ],
            filterOrder:{value: "count.count,desc", label: this.$t( 'procedure.index.moreVisited' )+" ↓"},
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

        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
            this.ruralModels = response.data.data;

            if(this.$route.params.ruralModelsId != null && this.$route.params.ruralModelsId != undefined ) {
                this.selectedQueryModel = this.$route.params.ruralModelsId
            }

            if(this.$route.query.housing) {
                this.selectedQueryModel = [RURALMODEL.HOUSING];
            }

            let response2 = await VAPI.get(`/${SERVICE_NAMES.PROCEDURE}` + this.buildQuery());
            this.procedures = response2.data.data;
            this.meta = response2.data.meta;

            let response3 = await VAPI.get(`/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.PROCEDURE}`);
            this.notes = response3.data.data;
        }
        catch( error ) {
            console.log( 'Error fetching procedure', error );
        }
    },
    computed:{
        legalNote(){
            if(this.notes.length>0)
                return this.notes.filter(e=>{ return e.key=="legal"})
        },
        otherNote(){
            if(this.notes.length>0)
                return this.notes.filter(e=>{ return e.key !="legal"})
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
        filterOrder : {
            handler: function(val, oldVal) {
                this.loadMore();
            },
            deep: true
        },
        procedures : {
            handler: function (val, oldVal) {
                this.scrollTo('pagination-top');
            },
            deep: true,
        }
    },
    methods:{
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        scrollTo(refName) {
            var element = this.$refs[refName];
            if (element && element.$el && !this.loadingPage) {
                var top = element.$el.offsetTop - 3 * element.$el.offsetHeight;
                window.scrollTo({left: 0, top: top, behavior: 'smooth'});
            }
        },
        buildQuery() {
            let query = '?page=' + (this.filterParams.page-1)  + '&size=' + this.filterParams.size;
            if( this.filterState && this.filterState.value != undefined) {
                query += '&status=' + this.filterState.value;
            }
            else if(this.isAdministrator &&  this.filterState.id  == undefined){
               query += '&status=1,0'
            }
            else if(this.filterState.id  == undefined){
                query += '&status=1'
            }
            if( this.filterQ !== '' ) query += '&q=' + this.filterQ;
            if(this.selectedQueryModel.length > 0) query += '&ruralModels=' + this.selectedQueryModel;

            // query += '&sort=nvl(count.count,0)'
            if(this.filterOrder.value!=null) {
                query += '&sort=' + this.filterOrder.value ;
            } else {
                query += '&sort=count.count,desc'
            }

            return query;
        },
        async loadMore(){
            // this.meta={elementsPage: 10, totalElements: 0, totalPages: 0};
            try{
                const response3 = await VAPI.get(`/${SERVICE_NAMES.PROCEDURE}` + this.buildQuery() );
                if (response3.status == HTTP_STATUS.OK) {
                    this.procedures= response3.data.data;
                    this.meta = response3.data.meta
                } else {
                    this.procedures=[]
                    this.meta={elementsPage: 10, totalElements: 0, totalPages: 1};
                    console.log( 'Error fetching Procedure status', response3 );
                }
                this.loadingPage = false;
            } catch( error ) {
                this.procedures=[];
                this.meta={elementsPage: 10, totalElements: 0, totalPages: 1};
                console.log( 'Error fetching Procedure', error );
            }
        },
        clearfilter(){
            this.filterParams = { page: 1, size: 10, }
            this.filterOrder = {value: "count.count,desc", label: this.$t( 'procedure.index.moreVisited' )+" ↓"}
            this.filterQ = ""
            this.filterState =  {}
            this.selectedQueryModel = []
            this.loadMore()
        },
        async reloadNotes(){
            try{
                let response2 = await VAPI.get( `/${SERVICE_NAMES.SIPSDER_NOTE}/${MODULES.PROCEDURE}` );
                this.notes = response2.data.data
            }
            catch( error ) {
                console.log( 'Error fetching Notes', error );
            }
        },
        changeValueLegalNote(value){
            this.legalNote[0].content = value
        },
        changeValueOtherNote(value){
            this.otherNote[0].content = value
        },
        unSetEditLegal(){
            this.isEditLegalNote = false
            this.reloadNotes()
        },
        unSetEditOther(){
            this.isEditOtherNote = false
            this.reloadNotes()
        },
        updateNote(note){
            VAPI.put(`/${SERVICE_NAMES.SIPSDER_NOTE}/update`, note).then((output)=>{
                this.unSetEditLegal()
                this.unSetEditOther()
            }).catch((e)=>{
                alert("Error actualizando Nota. "+ e)
            })
        },
        procedureDetail(id) {
            this.$router.push({ name: 'ProcedureDetail', params: { id } });
        },
        procedureCreate() {
            this.$router.push({ name: 'ProcedureCreate' });
        },
        procedureEdit(id) {
            this.$router.push({ name: 'ProcedureCreate' , params: { id } });
        },
        async getStatistics( ) {
            try{
                let response = await VAPI.get(`/${SERVICE_NAMES.PROCEDURE}/statistics`, {
                    responseType: "blob",
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Reporte-tramites.xlsx");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }catch(error){
                console.log(error);
                this.errorMessage = error.response.data.message;
            }
      },
    }
}
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.dot
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: inline-block;

.grey-label-text
    color: grey
    
.note
    padding: 25px;
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
    background: url(../../../assets/title/barra_sola_5.png)
    background-repeat: no-repeat
    background-size: 100% 100%
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
    .t-select
        grid-area: d
    .t-state
        grid-area: b
    .t-input
        grid-area: c
    .t-buttons
        grid-area: e
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
            grid-template-columns: 70% 30%
            align-items: center
            .colors-container
                width: 100%
                height: 30px
                .colors
                    margin: 5px 0 0 5px
                    width: 25px
                    height: 25px
                    border-radius: 50%
                    float: left
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

.no-results
    padding: 30px
    font-size: 1.5rem
    border: 3px solid $colorTitle
    border-radius: 1.5rem
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .filter-box
        margin: 0 !important
        .row
            margin: 0 !important
    .buttons-col
        margin-top: 15px
    .info-filter
        height: 100px !important
        .info
            position: unset !important
        .sort
            position: unset !important
</style>