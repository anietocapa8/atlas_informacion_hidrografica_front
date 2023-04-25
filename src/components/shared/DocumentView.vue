<template>
    <div>
        <div @contextmenu="handler($event)" class="view">
            <div class="tools">
                <div style="text-align: left; margin-top: -15px" v-if="canDownload"><download-document :id="this.id"></download-document></div>
                <div style="text-align: center; font-size: 1.2rem; white-space: nowrap;" v-if="document == null && isLogged && timer">{{ $t('document_viewer.download_doc') }}</div>
                <div style="text-align: center; font-size: 1.2rem; white-space: nowrap;" v-if="document == null && !isLogged && timer">{{ $t('document_viewer.download_doc_no_log') }}</div>
                <div style="text-align: center" v-if="document != null"><span><v-select @change="reloadDocument" v-model.trim="actualPage" label="label" :placeholder="$t( 'community.survey.status' )" :options="optionsPageV"></v-select> {{ $t('document_viewer.total_pages', {totalPages: document.realTotalPage}) }}</span></div>
                <div style="text-align: center" v-if="document != null"><span class="tool" @click="zoomC(1)"><i class="fas fa-search-plus"></i></span>  &nbsp; &nbsp; <span class="tool" @click="zoomC(-1)"><i class="fas fa-search-minus"></i></span></div>
                <div style="text-align: right" v-if="document != null"><span @click="changePage(2)" class="tool"><i class="fas fa-chevron-left"></i></span> &nbsp; &nbsp; <span @click="changePage(1)" class="tool"><i class="fas fa-chevron-right"></i></span></div>
            </div>
            <div class="display" >
                <div v-if="document == null"  class="pages" style="color:#fff">{{ $t('document_viewer.loading') }}</div>
                <div v-for="(documentPage,i) in document.pages" :key="i" class="pages" v-else><img draggable="false" :src="'data:image/jpeg;base64, '+ documentPage" :style="zoom"></div>
            </div>
        </div>
     </div>
</template>

<script>
import SocialNetworksShare from './social_networks_share/SocialNetworksShare.vue';
import ReportComponent from './ReportComponent.vue';
import ScoreComponent from './ScoreComponent.vue';
import DownloadDocument from "./DownloadDocument.vue";
import { PERMISSIONS_TYPES} from '../../domain_constants'
import VAPI from '../../http_common';
import vSelect from "vue-select";
import { SERVICE_NAMES, SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../sipsder_constants';
import _ from 'lodash';
import moment from 'moment';
export default {
    components:{
        SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        DownloadDocument,
        "v-select": vSelect,
    },
    props:["id"],
    data(){
        return{
            
            document: null,
            actualPage: {label:"1 - 5", value: 1 },
            optionsPageV: [],
            zoom:{
                width: '50%'
            },
            timer: false,
            zoomIndex: 3,
            zoomFactor: ['20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']
        }
    },
    watch: {
        actualPage: function (newVal) {
            this.reloadDocument();
        }
    },
    computed: {
        isAdministrator( ) {
            let isAdmin = false;
            if (this.$store.getters.isAuthenticated)
                if(	this.detail.userId == this.$store.getters.getCurrentUser.id || this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                    isAdmin = true     
            return isAdmin;
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        },
        canDownload(){
            return this.$store.getters.hasPermission( PERMISSIONS_TYPES.DOWNLOAD )
        }
    },
    async beforeMount() {
            let self = this
            setTimeout(function(){ self.timer= true }, 30000);
            try{
                let response2 = await VAPI.get(`${SERVICE_NAMES.DOCUMENTS}/visor?id=${this.id}&page=${this.actualPage.value}`);
                this.document = response2.data;
                this.document.id = this.id
                this.optionsPage()
            }
            catch( error ) {
                console.log( 'Error fetching Document', error );
            }    
    },
    methods : {
       
        handler: function(e) {
            e.preventDefault();
        },
        async reloadDocument(){
            try{
                let response2 = await VAPI.get(`${SERVICE_NAMES.DOCUMENTS}/visor?id=${this.id}&page=${this.actualPage.value}`);
                this.document = response2.data;
                this.document.id = this.id
                this.optionsPage()
            }
            catch( error ) {
                console.log( 'Error fetching Document', error );
            }
        },
        changePage(factor){
            let temp = 1
            if(factor == 2){
                temp = this.actualPage.value - 1
            }
            if(factor == 1){
                temp = this.actualPage.value + 1
            }
            if(temp < 1) temp = 1
            if(temp > this.document.totalPage) temp = this.document.totalPage
            this.actualPage = this.optionsPageV[temp-1]
            this.reloadDocument()
        },
        zoomC(factor){
            this.zoomIndex += factor
            if(this.zoomIndex < 0) this.zoomIndex = 0
            if(this.zoomIndex > this.zoomFactor.length-1) this.zoomIndex = this.zoomFactor.length-1
            this.zoom.width = this.zoomFactor[this.zoomIndex]
        },
        optionsPage (){
            if(this.document!= null){
                this.timer= false
                for(let i=1; i<=this.document.totalPage; i++){
                    let end = ((i*this.document.pages.length)> this.document.realTotalPage)?this.document.realTotalPage: (i*this.document.pages.length)
                    this.optionsPageV.push( 
                        {
                            label: ((i-1)*5)+1 +" - "+ end,
                            value: i
                        }
                    )
                }
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import '../../stylesheets/style.sass'
.v-select
    display: inline-block
    min-width: 115px
    color: #fff
    background:#fff !important
    border-radius: 4px

.view
    background: $colorTitleDark
    padding-bottom: 5px
    .tools
        display: grid
        grid-gap: 15px
        grid-template-columns: 1fr 1fr 1fr 1fr
        color:#fff
        font-weight: bold
        height: 60px
        background: $colorTitle
        border-bottom: 5px solid $colorTitle
        padding: 10px
        line-height: 30px
        .tool
            cursor: pointer
            display: inline-block
            height: 40px
            width: 40px
            text-align: center
            line-height: 20px
            &:hover
                font-size: 1.7rem
    .display
        padding: 5px
        max-height: 800px
        overflow: auto
        .pages
            cursor: -webkit-grab
            cursor: grab
            margin: 5px auto
            text-align: center
            -webkit-user-select: none
            -khtml-user-select: none
            -moz-user-select: none
            -o-user-select: none
            user-select: none
            img
                box-shadow: 0px 0px 3px #000
                pointer-events: none
.top-grid
    display: grid
    grid-template-columns: 50% 50%
@media screen and (max-width: $widthTablet)
    .share-grid
        grid-template-columns: 100% !important
    .view
        .tools
            grid-template-columns: 2fr 1fr 1fr !important
    .top-grid
        grid-template-columns: 100% !important


</style>