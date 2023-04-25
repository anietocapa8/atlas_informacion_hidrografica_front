<template>
    <div>
        <div class="feed-title">{{$t( 'proyectTool.concepts.title' )}}</div>
        <div class="col-90 container-form">
             <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          label="&nbsp;" style="text-align: right;float:right;"  v-if="isAdministrator">
                        <div class="enabled" style="cursor: pointer;" @click="changeEnabled">
                            <div class="control"></div>
                              <b-form-checkbox id="checkbox1"
                                                :value="true"
                                                :unchecked-value="false" v-model="enabled" disabled>
                                <b>{{$t( 'proyectTool.concepts.state' )}} </b>
                            </b-form-checkbox>
                        </div>
            </b-form-group>
            <div ref="head">&nbsp;</div>
             <div v-if="isAdministrator" style="text-align: right; float:right; margin-right: 15px"><sipsder-btn btnType="export_data" @onClick="getStatistics" :text="$t( 'faqs.export_statistics' )"></sipsder-btn></div>
            <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'welcome-concepts'" :showEdition="isAdministrator" :textPenEdition="$t( 'proyectTool.concepts.edit' )"></note-sipsder>
            <br>
            
            <div v-if="concepts != null && progress!=null" >
                <div class="wizard">
                    <div v-for="(item,i) in conceptTitle" :key="i" class="item" :class="{'focus': i == conceptSelected, 'completed': progress.length>i}"  v-b-tooltip.hover :title="item">
                        <div class="text">{{item}}</div>
                    </div>
                </div>
                <br>
                <div class="button-legend" v-if="!isStarted && !isAdministrator">{{$t( 'proyectTool.concepts.wait1' )}} {{timerP}}  {{$t( 'proyectTool.concepts.wait2' )}}</div>
                <br>
                <div style="text-align:right"  v-if="isAdministrator">
                    <sipsder-btn btnType="edit_pen"  v-if="!isEditBody" @onClick="isEditBody=true"></sipsder-btn>
                    <sipsder-btn btnType="uploadImage" variant="primary" :text="$t( 'proyectTool.concepts.editImageB' )" @onClick="showModal('addImageModal')" v-if="isEditBody"></sipsder-btn>
                    <sipsder-btn :text="$t( 'proyectTool.concepts.cancelB' )" btnType="cancel"  v-if="isEditBody" @onClick="showModal('errorEvent2')"></sipsder-btn>
                    <sipsder-btn :text="$t( 'proyectTool.concepts.saveB' )" btnType="add"  v-if="isEditBody" @onClick="showModal('errorEvent3')"></sipsder-btn>
                </div>
                <div class="concept background">
                    <div class="summary">
                        <div class="auto">
                            <div class="scroll">
                                <rich-text-preview :content="concepts[conceptSelected].summary" v-if="!isEditBody" :class="{'area-a' : conceptSelected == 0 , 'area-b': conceptSelected != 0}"/>
                                <rich-text :options="customToolbar" @changeValue="changeValueSummary" :newContent="concepts[conceptSelected].summary" v-else :class="{'area-a' : conceptSelected ==0 , 'area-b': conceptSelected != 0}"></rich-text>
                            </div>
                        </div>
                        <iframe :src="getImgURL(concepts[conceptSelected].urlAttachment)" v-if="concepts[conceptSelected].idTypeAttachment== ATTACHMENT_TYPE.VIDEO" frameborder="0"  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen :class="{'area-b' : conceptSelected == 0 , 'area-a': conceptSelected != 0}"></iframe>
                        <img  :src="getImgURL(concepts[conceptSelected].urlAttachment)" :class="{'area-b' : conceptSelected == 0 , 'area-a': conceptSelected != 0}" v-else >
                        

                    </div>
                    <div class="description">
                        <rich-text-preview :content="concepts[conceptSelected].description" v-if="!isEditBody"/>
                        <rich-text :options="customToolbar" @changeValue="changeValueDesc" :newContent="concepts[conceptSelected].description" v-else ></rich-text>
                    </div>
                    <div class="progress-c"  v-if="isLogged && !isAdministrator">
                        {{$t( 'proyectTool.concepts.message' )}}  <router-link :to="{name: 'ProyectToolMethodology'}" > {{$t( 'proyectTool.concepts.here' )}} </router-link>
                        <div class="bar">
                            <div class="desc">{{$t( 'proyectTool.concepts.progress' )}} {{progressPrecentage()}}% </div>
                            <div class="n-bar" :class="{'completed': isCompleted(1)}"></div>
                            <div class="n-bar" :class="{'completed': isCompleted(2)}"></div>
                            <div class="n-bar" :class="{'completed': isCompleted(3)}"></div>
                            <div class="n-bar" :class="{'completed': isCompleted(4)}"></div>
                            <div class="n-bar" :class="{'completed': isCompleted(5)}"></div>
                        </div>
                    </div>
                    <div class="buttons">
                        <div class="button-legend" v-if="!isStarted && !isAdministrator">{{$t( 'proyectTool.concepts.wait1' )}} {{timerP}}  {{$t( 'proyectTool.concepts.wait2' )}}</div>
                        <sipsder-btn :text="$t( 'proyectTool.concepts.back' )" btnType="export" @onClick="beforeC" v-if="(isStarted && conceptSelected>0) || (isAdministrator)"></sipsder-btn>
                        <sipsder-btn :text="$t( 'proyectTool.concepts.end' )" btnType="save" @onClick="onlyEnd" v-if="(isStarted && !isAdministrator && isLogged && !isCompleted(5) && isCompleted(4))"></sipsder-btn>
                        <sipsder-btn :text="$t( 'proyectTool.concepts.save' )" btnType="save" @onClick="onlySave(false)" v-if="(isStarted && !isAdministrator && isLogged && !isCompleted(4)) "></sipsder-btn>
                        <sipsder-btn :text="$t( 'proyectTool.concepts.next' )" btnType="download"  @onClick="nextC" v-if="(!isAdministrator && isStarted && conceptSelected<4)"></sipsder-btn>
                        <sipsder-btn :text="$t( 'proyectTool.concepts.onlyNext' )" btnType="download"  @onClick="onlyNext" v-if="conceptSelected<4 && isAdministrator"></sipsder-btn>
                    </div>
                </div>
            </div>
            <br>
            <div class="participate" v-if="concepts != null && progress!=null">
                <note-sipsder :module="MODULES.PROYECT_TOOL" :keyVal="'end-concepts'" :showEdition="isAdministrator" :textPenEdition="$t( 'proyectTool.concepts.edit' )" v-if="isCompleted(4) || isAdministrator"></note-sipsder>
                <div v-else v-html="'<b>'+$t( 'proyectTool.concepts.share' )+'</b>'"></div>
                <br>
                <div class="box" v-if="concepts != null">
                    <report-component :contentId="concepts[0].id" :content-type="REPORT_CONTENT_TYPES.CONCEPTS" v-if="isCompleted(4) || isAdministrator"></report-component>
                    <social-networks-share ></social-networks-share>
                    <div v-if="isLogged">
                        <print-component >
                            <div class="wizard-print">
                                <div v-for="(item,i) in conceptTitle" :key="i" class="item" :class="{'focus': i == conceptSelected}"  v-b-tooltip.hover :title="item" v-show="progress.length>=i">
                                    <div class="text">{{item}}</div>
                                </div>
                            </div>
                            <div class="concept">
                                <div class="summary">
                                    <div class="auto">
                                        <div class="scroll">
                                            <rich-text-preview :content="concepts[conceptSelected].summary" v-if="!isEditBody" :class="{'area-a' : conceptSelected == 0 , 'area-b': conceptSelected != 0}"/>
                                            <rich-text :options="customToolbar" @changeValue="changeValueSummary" :newContent="concepts[conceptSelected].summary" v-else :class="{'area-a' : conceptSelected ==0 , 'area-b': conceptSelected != 0}"></rich-text>
                                        </div>
                                    </div>
                                    <iframe :src="getImgURL(concepts[conceptSelected].urlAttachment)" v-if="concepts[conceptSelected].idTypeAttachment== ATTACHMENT_TYPE.VIDEO" frameborder="0"  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen :class="{'area-b' : conceptSelected == 0 , 'area-a': conceptSelected != 0}"></iframe>
                                    <img  :src="getImgURL(concepts[conceptSelected].urlAttachment)" :class="{'area-b' : conceptSelected == 0 , 'area-a': conceptSelected != 0}" v-else >
                                    
                                </div>
                                <div class="description">
                                    <rich-text-preview :content="concepts[conceptSelected].description" v-if="!isEditBody"/>
                                    <rich-text :options="customToolbar" @changeValue="changeValueDesc" :newContent="concepts[conceptSelected].description" v-else ></rich-text>
                                </div>
                                <div class="progress-c" v-if="isLogged && !isAdministrator">
                                    {{$t( 'proyectTool.concepts.message' )}}  <router-link :to="{name: 'ProyectToolMethodology'}" > {{$t( 'proyectTool.concepts.here' )}} </router-link>
                                    <div class="bar">
                                        <div class="desc">{{$t( 'proyectTool.concepts.progress' )}} {{progressPrecentage()}}% </div>
                                        <div class="n-bar" :class="{'completed': isCompleted(1)}"></div>
                                        <div class="n-bar" :class="{'completed': isCompleted(2)}"></div>
                                        <div class="n-bar" :class="{'completed': isCompleted(3)}"></div>
                                        <div class="n-bar" :class="{'completed': isCompleted(4)}"></div>
                                        <div class="n-bar" :class="{'completed': isCompleted(5)}"></div>
                                    </div>
                                </div>
                            </div>
                        </print-component >
                    </div>
                    <score-component :idContent="concepts[0].id" :idType="SCORE_CONTENT_TYPE.CONCEPTS" :likes="concepts[0].likes" :dislikes="concepts[0].dislikes" v-if="isCompleted(4) || isAdministrator"></score-component>
                </div>
                <br>
                <s-comment :parentId="concepts[0].id" typeParent="concepts" v-if="isCompleted(4) || isAdministrator"></s-comment>
            </div>
        </div>
    
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
        <b-modal ref="errorEvent1" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="updatePublic"
            @cancel="closeModal('errorEvent1')"
            >
            <b-row class="w-100 center" v-if="enabled">
                <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm1' )">
                </div>
            </b-row>
             <b-row class="w-100 center" v-else>
                <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm2' )">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent2" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="isEditBody=false; closeModal('errorEvent2')"
            @cancel="closeModal('errorEvent2')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm3' )">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent3" :title="$t( 'proyectTool.concepts.alert' )"
            @ok="saveConcept"
            @cancel="closeModal('errorEvent3')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm4' )">
                </div>
            </b-row>
        </b-modal>
         <b-modal ref="errorEvent4" :title="$t( 'proyectTool.concepts.congratulations' )" hide-footer size="lg">
            <div style="display: flex">
                <b-row class="w-50 center">
                    <img class="icon" src="../../../assets/proyect-tools/medallamedalla.png">
                </b-row>
                <b-row class="w-50 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm5' )+conceptTitle[conceptSelected] ">
                    </div>
                </b-row>
            </div>
             <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="save" :text="$t( 'proyectTool.concepts.save' )" @onClick="onlySave(true)"></sipsder-btn>
                <sipsder-btn btnType="download" :text="$t( 'proyectTool.concepts.nextSection' )"  @onClick="nextAndSave"></sipsder-btn>
            </div>
        </b-modal>
        <b-modal ref="errorEvent5" :title="$t( 'proyectTool.concepts.congratulations' )" hide-footer size="lg">
            <div style="display: flex">
                <b-row class="w-50 center">
                    <img class="icon" src="../../../assets/proyect-tools/medallamedalla.png">
                </b-row>
                <b-row class="w-50 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm6' )+conceptTitle[conceptSelected] +'<br>'+$t( 'proyectTool.concepts.modalm7' )">
                    </div>
                </b-row>
            </div>
             <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="accept" text="Aceptar" @onClick="saveProgress"></sipsder-btn>
            </div>
        </b-modal>
        <b-modal ref="errorEvent6" :title="$t( 'proyectTool.concepts.congratulations' )" hide-footer size="lg">
            <div style="display: flex">
                <b-row class="w-50 center">
                    <img class="icon" src="../../../assets/proyect-tools/medallamedalla.png">
                </b-row>
                <b-row class="w-50 center">
                    <div class="w-100 red" v-html="$t( 'proyectTool.concepts.modalm8' )">
                    </div>
                </b-row>
            </div>
             <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="accept" text="Aceptar" @onClick="saveProgress"></sipsder-btn>
            </div>
        </b-modal>
        <b-modal ref="alertModal" :title="$t('modal.title')" hide-footer size="lg">
          <b-row class="w-100 center">
            <rich-text-preview class="w-100 red" :content="$t( 'proyectTool.concepts.loggin' )"/>
            <div class="w-100 center" style="text-align: center">
                <sipsder-btn btnType="accept" :text="$t('community.images.btn_close')" @onClick="closeModal('alertModal')"></sipsder-btn>
                <sipsder-btn btnType="login" :text="$t('community.images.btn_action')" v-b-modal.login></sipsder-btn>
            </div>
          </b-row>
      </b-modal>  
        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>
    </div>
</template>

<script>
import VAPI from '../../../http_common';
import RichText from '../../shared/RichText.vue'
import RichTextPreview from '../../shared/RichTextPreview.vue'
import NoteRichText from '../../shared/editableMessages/NoteRichText.vue'
import SocialNetworksShare from '../../shared/social_networks_share/SocialNetworksShare.vue';
import ReportComponent from '../../shared/ReportComponent.vue';
import ScoreComponent from '../../shared/ScoreComponent.vue';
import { SERVICE_NAMES,  SCORE_CONTENT_TYPE, REPORT_CONTENT_TYPES } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES,  MODULES, ATTACHMENT_TYPE} from '../../../domain_constants'
import CommentCmp from "../../shared/comment/CommentComponent.vue"
import S_UTIL from "../../../util/sipsder_util";
import PrintComponent from "../../shared/PrintComponent";
import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';

export default {
    components:{
        RichText,
        'note-sipsder':NoteRichText,
        RichTextPreview,
        SocialNetworksShare,
        ReportComponent,
        ScoreComponent,
        "s-comment" : CommentCmp,
        PrintComponent,
        Audiovisualmedia
    },
     data(){
        return{
            SCORE_CONTENT_TYPE,
            REPORT_CONTENT_TYPES,
            ATTACHMENT_TYPE,
            MODULES,
            conceptSelected: 0,
            concepts: null,
            progress: null,
            isEditBody: false,
            isStarted: false,
            enabled: false,
            timerP: "",
            interval: "",
            conceptTitle:[
                this.$t( 'proyectTool.concepts.item1' ),
                this.$t( 'proyectTool.concepts.item2' ),
                this.$t( 'proyectTool.concepts.item3' ),
                this.$t( 'proyectTool.concepts.item4' ),
                this.$t( 'proyectTool.concepts.item5' )
            ],
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
            mediaOptions: [
                {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
                {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")},
            ],
            onlyS: false
        }
    },
     async beforeMount(){
        clearInterval(this.interval)
        this.timerP = ''
        try {
            let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts`);
            this.concepts = response.data.data;
            this.enabled =  this.concepts[0].status
            if(this.enabled == false && !this.isAdministrator) this.$router.push({name:'ProyectToolIndex'})
        }
        catch( error ) {
            console.log( 'Error fetching Proyect tools description', error );
        }
         var user = 0
        if(this.$store.state.session.currentUser != null) user = this.$store.state.session.currentUser.id
        try {
            let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts/progress/${user}`);
            this.progress = response.data.data;
        }
        catch( error ) {
            console.log( 'Error fetching Proyect tools description', error );
        }

        if(this.progress.length>0 && this.progress.length<5){
            this.conceptSelected = this.progress.length
        }
        else{
            this.conceptSelected = 0
        }
        if(!this.isCompleted(5) && this.isLogged) {
            self= this
            var fiveMinutes = 60 * 5
            this.startTimer(fiveMinutes)
        }
        else{
            this.isStarted = true
        }
        if(!this.isLogged) this.showModal("alertModal")
     },
     computed:{
        isAdministrator() {   
            return this.$store.getters.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN );
        },
        isLogged(){
            return this.$store.getters.isAuthenticated
        }
    },
     methods: {
        startTimer(duration) {
            var timer = duration, minutes, seconds;
            self= this
             self.isStarted = false
            this.interval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                self.timerP = minutes + ":" + seconds;

                if (--timer < 0) {
                    self.isStarted = true
                    timer = duration;
                    clearInterval(self.interval)
                }
            }, 1000);
        },
        getURL(){
            var url = window.location.href
            return url 
        },
        async getStatistics( ) {
            try{
                let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts/statistics`, {
                    responseType: "blob",
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Reporte-conceptos de proyecto.xlsx");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }catch(error){
                console.log(error);
                this.errorMessage = error.response.data.message;
            }
      },
        async updatePublic(){
            this.enabled = !this.enabled
            try {
                let response = await VAPI.put(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts/status/${this.enabled}`);
                this.closeModal('errorEvent1')
            }
            catch( error ) {
                console.log( 'Error updating Proyect tools concepts state', error );
            }
        },
        async saveConcept(){
            try {
                let response = await VAPI.put(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts`, this.concepts[this.conceptSelected] );
                this.isEditBody = false

            }
            catch( error ) {
                console.log( 'Error updating Proyect tools concepts state', error );
            }
        },
        beforeC(){
            this.conceptSelected = this.conceptSelected-1
            this.scrollMeTo('head')
        },
        nextC(){
            if(this.progress.length<5 &&  this.progress.length<this.conceptSelected+1 && this.isLogged){
                 this.showModal('errorEvent4')
            }
            else if(this.progress.length==4){
                this.conceptSelected = this.conceptSelected+1
            }
            else{
                this.conceptSelected = this.conceptSelected+1
            }
            this.scrollMeTo('head')
        },
        onlyNext(){
            this.conceptSelected = this.conceptSelected+1
            this.scrollMeTo('head')
        },
        nextAndSave(){
            this.closeModal('errorEvent4')
            if(this.progress.length<5 &&  this.progress.length<this.conceptSelected+1){
                 this.saveProgress()
            }
            this.conceptSelected = this.conceptSelected+1
            this.scrollMeTo('head')
        },
        onlySave(close){
            this.onlyS = true
            if(close){ 
                this.closeModal('errorEvent4')
                this.saveProgress()
            }
            else {
                this.showModal('errorEvent5')
            }
        },
        onlyEnd(){
            this.showModal('errorEvent6')
        },
        scrollMeTo(refName) {
            var element = this.$refs[refName];
            element.scrollIntoView({  behavior: 'smooth' });
        },
        async saveProgress(){
            clearInterval(this.interval)
            try {
                let response = await VAPI.put(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts/progress/${this.conceptSelected+1}`);
            }
            catch( error ) {
                console.log( 'Error fetching Proyect tools concepts progress', error );
            }
            if(this.onlyS){
                this.$router.push({name: 'ProyectToolIndex', query:{reload:true}})
            }
            var user = 0
            if(this.$store.state.session.currentUser != null) user = this.$store.state.session.currentUser.id
            try {
                let response = await VAPI.get(`/${SERVICE_NAMES.PROYECT_TOOL}/concepts/progress/${user}`);
                this.progress = response.data.data;
            }
            catch( error ) {
                console.log( 'Error fetching Proyect tools description', error );
            }
            if(this.progress.length<5){
                self= this
                var fiveMinutes = 60 * 5
                this.startTimer(fiveMinutes)
            }
            this.closeModal('errorEvent5')
            this.closeModal('errorEvent6')
            window.scrollTo({
            top: 100,
            left: 0,
            behavior: 'smooth'
            })
        },
        getImgURL(url){
            return S_UTIL.getImgURL(url);
        },
        changeValueSummary(value){
            this.concepts[this.conceptSelected].summary = value
        },
        changeValueDesc(value){
            this.concepts[this.conceptSelected].description = value
        },
        changeEnabled(){
            this.showModal('errorEvent1')
        },
        progressPrecentage(){
            if (this.progress == null) return 0
            return (this.progress.length / 5) * 100
        },
        isCompleted(i){
            if (this.progress == null) return false
            let index = this.progress.findIndex( el=>{ return i == el.idConcept;})
            return index >=0 ;
        },
        showModal(ref){
            this.$refs[ref].show();
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        created_image(response){
            this.closeModal('addImageModal')
            let image = _.find(this.eventAttach, { 'id': response[0]});
            if(!image){
                this.concepts[this.conceptSelected].idAttachment = response[0]
                this.concepts[this.conceptSelected].urlAttachment = response[1]
                this.concepts[this.conceptSelected].idTypeAttachment = response[3]
            }
        }
     },
     beforeDestroy() {
        clearInterval(this.interval)
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
.button-legend
    background-color: #6c757d
    color: #fff
    border-radius: 0.25rem
    font-family: "PT Sans Narrow"
    text-align: center
    padding: 5px
.wizard-print
    display: grid
    grid-template-columns: repeat(5, 19.5%) 2.5%
    margin-bottom: 20px
    .item
        cursor: pointer
        height: 80px
        padding: 12px
        position: relative
        margin-left: 46px
    .focus
        text-weight: bold
.wizard
    display: grid
    grid-template-columns: repeat(5, 19.5%) 2.5%
    margin-bottom: 20px
    .item
        cursor: pointer
        height: 80px
        padding: 12px
        background:  #1554b0aa
        color: #fff
        position: relative
        margin-left: 46px
        transition: all .2s ease-in-out
        .text
            overflow: hidden
            text-overflow: ellipsis
        &:after
            transition: all .2s ease-in-out
            content: ''
            position: absolute
            left: 100%
            top: 0
            width: 0
            height: 0
            border-top: 40px solid transparent
            border-bottom: 40px solid transparent
            border-left: 40px solid #1554b0aa
            clear: both
        &:before
            transition: all .2s ease-in-out
            content: ""
            position: absolute
            top: 0
            right: 100%
            border-top: 40px solid #1554b0aa
            border-bottom: 40px solid #1554b0aa
            border-left: 40px solid transparent
            border-right: 1px solid #1554b0aa
        &:nth-of-type(1)
            &:before
                content: ""
                position: absolute
                top: 0
                right: 100%
                border-top: 40px solid #1554b0aa
                border-bottom: 40px solid #1554b0aa
                border-left: 40px solid #1554b0aa
                border-right: 1px solid #1554b0aa
    .focus
        background:  #1554b0 !important
        transform: scale(0.85)
        &:after
            border-left: 40px solid #1554b0 !important
        &:before
            border-top: 40px solid #1554b0 !important
            border-bottom: 40px solid #1554b0 !important
            border-right: 1px solid #1554b0 !important
        &:nth-of-type(1)
            &:before
                border-top: 40px solid #1554b0 !important
                border-bottom: 40px solid #1554b0 !important
                border-left: 40px solid #1554b0 !important
                border-right: 1px solid #1554b0 !important
    .completed
        background:  #1554b0 !important
        &:after
            border-left: 40px solid #1554b0 !important
        &:before
            border-top: 40px solid #1554b0 !important
            border-bottom: 40px solid #1554b0 !important
            border-right: 1px solid #1554b0 !important
        &:nth-of-type(1)
            &:before
                border-top: 40px solid #1554b0 !important
                border-bottom: 40px solid #1554b0 !important
                border-left: 40px solid #1554b0 !important
                border-right: 1px solid #1554b0 !important
.enabled
    position: relative
    float: right
    label
        cursor: pointer !important
    .control
        position: absolute
        top: 0 
        left: 0
        height: 100%
        width: 100%
        z-index: 3
.background
     background: #fffc
.concept
    .summary
        display: grid
        grid-template-columns: 49% 49%
        grid-gap: 2%
        grid-template-areas: "a b"
        margin-bottom: 20px
        height: 400px
        .auto
            height: 400px
            overflow-y: auto
            .scroll
                height: auto
        .area-a
            grid-area: a
        .area-b
            grid-area: b
        img
            max-height: 400px
        iframe
            height: 400px
            width: 100%
    .description
        margin-bottom: 20px
        
    .progress-c 
        padding: 20px
        margin-bottom: 20px
        .bar
            margin: 20px 0
            display: grid
            grid-template-columns: 20% repeat(6, 16%)
            .desc
                text-align: center
            .n-bar
                border-top: 1px solid #333
                border-bottom: 1px solid #333
                border-left: 1px solid #333
                &:last-child
                     border-right: 1px solid #333
            .completed
                background: #1554b0aa
    .buttons
        text-align: right
.participate
    .box
        display: flex
        align-items: center
        &>div
            margin-right: 15px
.icon 
    height: 150px
@media screen  and (max-width: $widthMobile)
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
        margin-top: 30px
    .wizard
        grid-template-columns: 80% !important
        grid-gap: 5px
    .concept
        .summary
           grid-template-columns: 80% !important
           grid-template-areas: 'b' 'a'
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
</style>