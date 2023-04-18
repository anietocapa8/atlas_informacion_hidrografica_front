<template>
   <div class="rural-model">
       <div class="feed-title">{{$t( 'rural_model.index.title' )}}</div>
        <div  v-if="isAdministrator" style="text-align:right" class="div-90">
            <sipsder-btn btnType="edit_pen" :text="$t('rural_model.edit_page')" @onClick="setEdit()" v-if="!isEdit"></sipsder-btn>
            <sipsder-btn btnType="cancel" @onClick="cancelAndClean" v-if="isEdit"></sipsder-btn>
            <sipsder-btn :text="$t('button.save')" btnType="add" @onClick="createAndUpdate" v-if="isEdit"></sipsder-btn>       
            <sipsder-btn btnType="edit_pen"
                        :text="$t( 'rural_model.admin.popup' )"                       
                        v-if="isAdministrator"
                        @onClick="adminRuralModel">
            </sipsder-btn>
        </div>
        <div class="ruralModel div-90">
            <div class="divA">
                <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{ $t('rural_model.index.sustainable_rural_model') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{ $t('rural_model.index.sustainable_rural_model_dimensions') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{ $t('rural_model.index.technical_alignments') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{ $t('rural_model.index.strategic_components') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==4 }" @click="setTabIndex(4)"><div><span>{{ $t('rural_model.index.rural_management') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==5 }" @click="setTabIndex(5)"><div><span>{{ $t('rural_model.index.planning_instruments') }}</span></div></div>
                <div class="tab-design" :class="{active : tabIndex==6 }" @click="setTabIndex(6)"><div><span>{{ $t('rural_model.index.bogotaRural') }}</span></div></div>
            </div>
            <div class="divB">
                <div class="containRuralModel" v-show="tabIndex==0">
                    <rich-text-preview class="text" :content="ruralModel.general" v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueGeneral" :newContent="ruralModel.general" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==1">
                    <rich-text-preview class="text" :content="ruralModel.objective" v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueObjective" :newContent="ruralModel.objective" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==2">
                    <rich-text-preview class="text" :content="ruralModel.specificObjective" v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueSpecificObjective" :newContent="ruralModel.specificObjective" v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==3">
                    <rich-text-preview class="text" :content="ruralModel.structure"  v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueStructure" :newContent="ruralModel.structure"  v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==4">
                    <rich-text-preview class="text" :content="ruralModel.tool"  v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueTool" :newContent="ruralModel.tool"  v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==5">
                    <rich-text-preview class="text" :content="ruralModel.coordination"  v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueCoordination" :newContent="ruralModel.coordination"  v-if="isEdit && isAdministrator"></rich-text>
                </div>
                <div class="containRuralModel" v-show="tabIndex==6">
                    <rich-text-preview class="text" :content="ruralModel.diagnostic"  v-if="!isEdit"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueDiagnostic" :newContent="ruralModel.diagnostic"  v-if="isEdit && isAdministrator"></rich-text>
                </div>
            </div>
            <div class="divC"  v-if="!isEdit">
                <div v-if="ruralModel.infoType=='Video'">
                    <iframe :src="getImgURL(ruralModel.infoImage)" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                    <img :src="getImgURL(ruralModel.infoImage)">
                </div>
            </div>
            <div class="divC"  v-if="isEdit && isAdministrator">
                <div v-if="ruralModel.infoType=='Video'">
                    <iframe :src="getImgURL(ruralModel.infoImage)" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                    <img :src="getImgURL(ruralModel.infoImage)">
                </div>
            </div>
        </div>
        <div style="text-align:right" class="div-90"><sipsder-btn btnType="uploadImage" variant="primary" :text="$t('rural_model.index.edit_audiovisual')" @onClick="showModal('addImageModal')" v-if="isEdit && isAdministrator"></sipsder-btn></div>
        <div class="library div-90">
            <sipsder-btn btnType="link" variant="primary" class="btn-library" :text="$t('rural_model.consult_card')" style="float:left" @onClick="$router.push({name:'LibraryView', params:{id:ruralModel.idBook}})"></sipsder-btn>
            <router-link :to="{name: 'LibraryIndex'}" style="float:right">{{ $t('rural_model.index.documents') }}</router-link>
        </div>
        <div class="div-90" style=""><hr></div>
        <div  v-if="isAdministrator" style="text-align:right" class="div-90">
            <sipsder-btn btnType="edit_pen" :text="$t('rural_model.edit_page')" @onClick="setEditDesc()" v-if="!isEditDesc"></sipsder-btn>  
            <sipsder-btn btnType="cancel" @onClick="cancelAndClean" v-if="isEditDesc"></sipsder-btn>
            <sipsder-btn :text="$t('button.save')" btnType="add" @onClick="createAndUpdate" v-if="isEditDesc"></sipsder-btn>
        </div>
        <div class="div-90" style="margin-bottom: 10px">
            <rich-text-preview class="text" :content="ruralModel.modelDescription"  v-if="!isEditDesc"/>
            <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="ruralModel.modelDescription"  v-if="isEditDesc && isAdministrator"></rich-text>
        </div>

        <div class="div-90">
            <rural-model-figure ref="childRef" :optionalImage="ruralModel.optionalImage" :optionalType="ruralModel.optionalType" :isEdit="isEditDesc"></rural-model-figure>
            <div style="text-align:left">
                <sipsder-btn btnType="uploadImage" variant="primary" :text="$t('rural_model.index.edit_opt_audiovisual')" @onClick="showModal('addImageModalOp')" v-if="isEditDesc && isAdministrator"></sipsder-btn>
                <sipsder-btn btnType="delete" variant="primary" :text="$t('rural_model.index.remove_opt_image')" @onClick="setNullOptional" v-if="isEditDesc && isAdministrator && ruralModel.optionalImage!=null"></sipsder-btn>
            </div>
        </div>

        <div class="more-news div-90">
        <div class="title">
          <b>{{$t( 'rural_model.index.news_title' )}}</b>
        </div>
        <news-carousel :related="related"></news-carousel>
      </div>
       <div style="text-align:center"><sipsder-btn :text="$t('rural_model.index.more_news')" btnType="ubication" @onClick="$router.push({ name: 'NewsIndex' })"></sipsder-btn></div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="goBack"></sipsder-btn></div>

        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
         <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>

        <b-modal ref="addImageModalOp" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
         <audiovisualmedia @created_image="created_imageOp($event)" @cancel="closeModal('addImageModalOp')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>

        <b-modal ref="iconModelModal" id="iconModelModal"  size="lg" class="image-modal" centered :title="$t('rural_model.index.iconography')" hide-footer>
         <div>{{ $t('rural_model.index.iconography') }}</div>
        </b-modal>

       <b-modal ref="errorEvent" :title="$t('rural_model.index.error')"
        @ok="closeModal('errorEvent')"
        @cancel="closeModal('errorEvent')"
        >
          <b-row class="w-100 center">
            <div class="w-50 red">{{ $t('rural_model.index.non_saved_elements') }}</div>
          </b-row>
      </b-modal>  
   </div>
</template>

<script>
    import RuralModelFigure from './RuralModelFigure.vue';
    import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
    import RichText from '../../shared/RichText.vue'
    import RichTextPreview from '../../shared/RichTextPreview.vue'
    import NewsCarousel from "../../shared/NewsCarousel.vue";
    import VAPI from '../../../http_common';
    import _ from 'lodash';
    import { SERVICE_NAMES } from '@/sipsder_constants';
    import { PERMISSIONS_TYPES, ATTACHMENT_TYPE } from '../../../domain_constants'
    import S_UTIL from "@/util/sipsder_util";

    export default {  
        data(){
            return {
                PERMISSIONS_TYPES,
                related: null,
                tabIndex:0,
                isEdit:false,
                isEditDesc:false,
                ruralModel:{},
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
                    {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
                ]
            }
        },
        beforeMount(){
            VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/general?book=false`).then((output) => {
                this.ruralModel=output.data;
            }).catch((e) => {
                
            });
            VAPI.get(`/${SERVICE_NAMES.NEWS}/related-model`).then((output) => {
                this.related=output.data.data;
            }).catch((e) => {
                
            });
        },
        methods: {
            getImgURL(url) {
                return S_UTIL.getImgURL(url)
            },
            goBack(){
                if(this.isEdit==false || this.isEditDesc==false){
                    this.$router.go(-1)
                }
                else{
                    this.showModal("errorEvent")
                }
            },
            setNullOptional(){
                this.ruralModel.idOptionalImage=null
                this.ruralModel.optionalImage=null
                this.ruralModel.optionalType=null
            },
            setTabIndex(index){
                this.tabIndex=index
            },
            changeValueGeneral(value){
                this.ruralModel.general = value
            },
            changeValueObjective(value){
                this.ruralModel.objective = value
            },
            changeValueSpecificObjective(value){
                this.ruralModel.specificObjective = value
            },
            changeValueStructure(value){
                this.ruralModel.structure = value
            },
            changeValueTool(value){
                this.ruralModel.tool = value
            },
            changeValueCoordination(value){
                this.ruralModel.coordination = value
            },
            changeValueDiagnostic(value){
                this.ruralModel.diagnostic = value
            },
            changeValueDescription(value){
                this.ruralModel.modelDescription = value
            },
            setEdit(){
                this.isEdit = true
            },
            setEditDesc(){
                this.isEditDesc = true
            },
             cancelAndClean(){
                //this.ruralModel={}
                VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/general`).then((output) => {
                this.ruralModel=output.data;
                }).catch((e) => {
                
                });
                this.isEdit=false
                this.isEditDesc=false
            },
            createAndUpdate(){
                VAPI.put(`/${SERVICE_NAMES.RURAL_MODEL}/general`, this.ruralModel).then((output)=>{
                this.cancelAndClean()
                }).catch((e)=>{
                alert("Error creando evento.") // TODO: Alert refactor
                })
                this.$refs.childRef.createAndUpdate();
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
                this.ruralModel.idInfoImage=response[0]
                this.ruralModel.infoImage=response[1]
                this.ruralModel.infoType=response[2]
                }
            },
            adminRuralModel( ) {
                this.$store.dispatch( 'setRuralModelAdminStatus', 'addRuralModel' );
                this.$router.push( { name: 'RuralModelAdmin' } );
            },
            created_imageOp(response){
                this.closeModal('addImageModal')
                let image = _.find(this.eventAttach, { 'id': response[0]});
                if(!image){
                this.ruralModel.idOptionalImage=response[0]
                this.ruralModel.optionalImage=response[1]
                this.ruralModel.optionalType=response[2]
                }
            }
        },
        computed: {
            isAdministrator( ) {
                if( this.$store.getters.isAuthenticated &&
                    this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
                    return true;
                return false;
            }
        },
         components: {
            RichText,
            RichTextPreview,
            Audiovisualmedia,
            RuralModelFigure,
            NewsCarousel
        }
    }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

@media screen  and (max-width: $widthMobile)
    .div-90
        width: 85% !important
    .rural-model
        font-size: 1rem !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
    .tab-design
        div
            span
                font-size: 0.8rem !important
@media screen  and (max-width: 800px)
    .div-90
        width: 80% !important
    .ruralModel
        grid-template-areas: "c c" "a b" !important
        grid-template-columns: 40% 60% !important
        max-height: 900px !important
    
.div-90
    width: 90%
    margin-left: auto
    margin-right: auto 

.more-news
    position: relative
    width: 85%
    margin-bottom: 2%
    margin-left: 5%
    
.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../assets/title/barra_sola_2.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    min-height: 90px
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 20px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff

.rural-model
    padding: 0 15px
    font-size: 1.5rem
    font-family: "Open Sans", sans-serif
.ruralModel
  display: grid
  grid-template-areas: "a b c"
  grid-template-columns: 18% 42% 40%
  width: 90%
  max-height: 600px
  margin-left: auto
  margin-right: auto
  overflow: hidden
  .divA
    height: 100%
    margin-top: 10px
    grid-area: a
    z-index: 2
  .divB
    max-height: 480px
    grid-area: b
    z-index: 3
    div.containRuralModel
      background-color:#fff
      height: 110%
      width: 99%
      border-left: 3px solid $colorTitleDark
      border-radius: 3px
      padding: 15px
      text-align: justify
      max-height: 480px
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
    padding: 6px 3.5em 11px 0.7em
    span
      display: block
      transform: rotate(-4deg)
      font-size: 1.1rem
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
.library
    margin-top: 20px
    min-height: 60px



</style>