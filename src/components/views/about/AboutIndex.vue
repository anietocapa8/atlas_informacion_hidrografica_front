<template>
    <div class="about-index container-form">
      <sipsder-title :title="$t('about.page_title')"
                            type="admin"
                            section="configuration"  v-if="isAdministrator"></sipsder-title>
      <sipsder-title :title="$t('about.page_title')"
                            section="registry"  v-if="!isAdministrator"></sipsder-title>
      <div  v-if="isAdministrator" style="text-align:right">
        <sipsder-btn btnType="edit_pen" :text="$t( 'about.edit_sipsder' )" @onClick="setEditSipsder(sipsder)" v-if="!isEdit"></sipsder-btn>
        <sipsder-btn btnType="cancel" @onClick="cancelAndClean" v-if="isEdit"></sipsder-btn>
            <sipsder-btn :text="$t( 'button.save' )" btnType="add" @onClick="createAndUpdate" v-if="isEdit"></sipsder-btn>
      </div>
      <div class="sipsder">
        <div class="divA">
          <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t('about.tabs.generalities')}}</span></div></div>
          <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t('about.tabs.general_objective')}}</span></div></div>
          <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{$t('about.tabs.specific_objectives')}}</span></div></div>
          <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{$t('about.tabs.principles')}}</span></div></div>
        </div>
        <div class="divB">
          <div class="containAbout" v-show="tabIndex==0">
            <rich-text-preview class="text" :content="sipsder.general" v-if="!isEdit "/>
            <rich-text :options="customToolbar" @changeValue="changeValueGeneral" :newContent="sipsder.general" v-if="isEdit && isAdministrator"></rich-text>
          </div>
          <div class="containAbout" v-show="tabIndex==1">
            <rich-text-preview class="text" :content="sipsder.objective" v-if="!isEdit "/>
            <rich-text :options="customToolbar" @changeValue="changeValueObjective" :newContent="sipsder.objective" v-if="isEdit && isAdministrator"></rich-text>
          </div>
          <div class="containAbout" v-show="tabIndex==2">
            <rich-text-preview class="text" :content="sipsder.antecedent" v-if="!isEdit"/>
            <rich-text :options="customToolbar" @changeValue="changeValueAntecedent" :newContent="sipsder.antecedent" v-if="isEdit && isAdministrator"></rich-text>
          </div>
          <div class="containAbout" v-show="tabIndex==3">
            <rich-text-preview class="text" :content="sipsder.rule"  v-if="!isEdit "/>
            <rich-text :options="customToolbar" @changeValue="changeValueRule" :newContent="sipsder.rule"  v-if="isEdit && isAdministrator"></rich-text>
          </div>
        </div>
        <div class="divC"  v-if="!isEdit">
          <div v-if="sipsder.type=='Video'">
            <iframe :src="sipsder.imageUrl" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div v-else>
            <img :src="getImgURL(sipsder.imageUrl)">
          </div>
        </div>
        <div class="divC"  v-if="isEdit && isAdministrator">
          <div v-if="sipsder.type=='Video'">
            <iframe :src="sipsder.imageUrl" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div v-else>
            <img :src="getImgURL(sipsder.imageUrl)">
          </div>
        </div>
      </div>
      <div style="text-align:right"><sipsder-btn btnType="uploadImage" variant="primary" :text="$t('about.buttons.edit_image')" @onClick="showModal('addImageModal')" v-if="isEdit && isAdministrator"></sipsder-btn></div>
      <div><hr></div>
      <div style="text-align:right"> <sipsder-btn btnType="edit_pen" :text="$t('about.buttons.edit_events')" @onClick="goEditEvents" v-if="isAdministrator"></sipsder-btn></div>
      <time-line></time-line>
      <br>
      <b-row>
        <b-col>
          <print-component >
            <sipsder-title :title="$t('about.page_title')"
                type="admin"
                section="configuration"  v-if="isAdministrator"></sipsder-title>
            <sipsder-title :title="$t('about.page_title')"
                section="registry"  v-if="!isAdministrator"></sipsder-title>
            <div class="sipsder">
              <div class="divA">
                <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{$t('about.tabs.generalities')}}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{$t('about.tabs.general_objective')}}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{$t('about.tabs.specific_objectives')}}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{$t('about.tabs.principles')}}</span></div></div>
              </div>
              <div class="divB">
                <div class="containAbout" v-show="tabIndex==0">
                  <rich-text-preview class="text" :content="sipsder.general" v-if="!isEdit "/>
                  <rich-text :options="customToolbar" @changeValue="changeValueGeneral" :newContent="sipsder.general" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containAbout" v-show="tabIndex==1">
                  <rich-text-preview class="text" :content="sipsder.objective" v-if="!isEdit "/>
                  <rich-text :options="customToolbar" @changeValue="changeValueObjective" :newContent="sipsder.objective" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containAbout" v-show="tabIndex==2">
                  <rich-text-preview class="text" :content="sipsder.antecedent" v-if="!isEdit"/>
                  <rich-text :options="customToolbar" @changeValue="changeValueAntecedent" :newContent="sipsder.antecedent" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containAbout" v-show="tabIndex==3">
                  <rich-text-preview class="text" :content="sipsder.rule"  v-if="!isEdit "/>
                  <rich-text :options="customToolbar" @changeValue="changeValueRule" :newContent="sipsder.rule"  v-if="isEdit && isAdministrator"></rich-text>
                </div>
              </div>
              <div class="divC"  v-if="!isEdit">
                <div v-if="sipsder.type=='Video'">
                  <iframe :src="sipsder.imageUrl" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                  <img :src="getImgURL(sipsder.imageUrl)">
                </div>
              </div>
              <div class="divC"  v-if="isEdit && isAdministrator">
                <div v-if="sipsder.type=='Video'">
                  <iframe :src="sipsder.imageUrl" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                  <img :src="getImgURL(sipsder.imageUrl)">
                </div>
              </div>
            </div>

            <time-line :selectedIdx="0"></time-line>
          </print-component>
        </b-col>
      </b-row>
      <div style="text-align:center"><sipsder-btn btnType="back" @onClick="goBack" ></sipsder-btn></div>
      <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
         <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
      </b-modal>
       <b-modal ref="errorEvent" :title="'Error'"
        @ok="closeModal('errorEvent')"
        @cancel="closeModal('errorEvent')"
       >
          <b-row class="w-100 center">
            <div class="w-50 red" v-html="error">
            </div>
          </b-row>
      </b-modal>  
   </div>
</template>

<script>
    const detail = null;

  import TimeLine from './TimeLine.vue'
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
  import RichText from '../../shared/RichText.vue'
  import RichTextPreview from '../../shared/RichTextPreview';
  import FilterTable from '../../shared/FilterTable.vue'
  import VAPI from '../../../http_common';
  import _ from 'lodash';
  import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
  import { PERMISSIONS_TYPES, ATTACHMENT_TYPE} from '../../../domain_constants'
  import S_UTIL from "../../../util/sipsder_util";
  import PrintComponent from "../../shared/PrintComponent";

  export default {  
    
    data() {
      return {
        error:"",
        sipsder:{},
        tabIndex:0,
        isEdit:false,
        adminFlag: true,//eliminar despues
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
      }
    },
    beforeMount(){
      VAPI.get(`${SERVICE_NAMES.ABOUT}`).then((output) => {
         this.sipsder=output.data;
        }).catch((e) => {
          
        });
    },
    computed: {
       isAdministrator( ) {
        let isAdmin = false;
        if (this.$store.getters.isAuthenticated)
            if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
              isAdmin = true     
        return isAdmin;
      }
    },
    methods: {
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      goBack(){
        this.$router.go(-1)
      },
      setTabIndex(index){
        this.tabIndex=index
      },
      setEditSipsder(sipsder){
        this.isEdit=true
      },
      cancelAndClean(){
        this.sipsder={}
        VAPI.get(`/${SERVICE_NAMES.ABOUT}`).then((output) => {
         this.sipsder=output.data;
        }).catch((e) => {
          
        });
        this.isEdit=false
      },
      createAndUpdate(){
        VAPI.put(`/${SERVICE_NAMES.ABOUT}/${this.sipsder.id}`, this.sipsder).then((output)=>{
          this.cancelAndClean()
        }).catch((e)=>{
          alert("Error creando evento.")
        })
      },
      goEditEvents(){
        this.$router.push({name: 'TimeLineCreate'})
      },
      showModal(ref){
        this.$refs[ref].show();
      },
      closeModal(ref){
        this.$refs[ref].hide();
      },
      changeValueGeneral(value){
        this.sipsder.general = value
      },
      changeValueObjective(value){
        this.sipsder.objective = value
      },
      changeValueAntecedent(value){
        this.sipsder.antecedent = value
      },
      changeValueRule(value){
        this.sipsder.rule = value
      },
      created_image(response){
        this.closeModal('addImageModal')
        let image = _.find(this.eventAttach, { 'id': response[0]});
        if(!image){
          this.sipsder.imageId=response[0]
          this.sipsder.imageUrl=response[1]
          this.sipsder.type=response[2]
        }
      }
    },
    components: {
      TimeLine,
      RichText,
      RichTextPreview,
      Audiovisualmedia,
      PrintComponent
    }
  
  }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

@media screen  and (max-width: 800px)
  .sipsder
    grid-template-areas: "c c" "a b" !important
    grid-template-columns: 40% 60% !important
    max-height: 800px !important
.about-index
  width: 100%
  margin: 0 10%
.sipsder
  display: grid
  grid-template-areas: "a b c"
  grid-template-columns: 15% 45% 40%
  margin-bottom: 5%
  width: 99%
  max-height: 400px
  margin-left: auto
  margin-right: auto
  .divA
    height: 100%
    margin-top: 10px
    grid-area: a
    z-index: 2
  .divB
    grid-area: b
    z-index: 3
    div.containAbout
      background-color:#fff
      height: 110%
      width: 99%
      border-left: 3px solid $colorTitleDark
      border-radius: 3px
      padding: 15px
      text-align: justify
      max-height: 400px
      overflow-y: auto
        
  .divC
    grid-area: c
    z-index: 2
    div
      width: 98%
      height: 100%
      margin: 0 auto
      self-align: center
      img
        border: 3px solid $colorTitle
        display:block
        margin:auto
        width: 100%
        max-height: 400px
      iframe
        border: 3px solid $colorTitle
        width: 100%
        height: 100%
.tab-design  
  margin-right: -5px !important
  margin-bottom: 10px !important
  transform: rotate(3deg)
  width: 100%
  div
    cursor: pointer
    width: 105%
    background: $colorTitle
    color: white
    border-radius: 10px
    padding: 10px 3.5em 14px 1em
    span
      display: block
      transform: rotate(-4deg)
  &.active
    div
      box-shadow: 0px 0px 3px #333
      background: $colorTitleDark
      color: white
      border-color: unset
      transition: 0.5s
  &:hover
    div
      box-shadow: 0px 0px 3px #333
</style>