<template>
  <div ref="table" class="time-line-create container-form">
    <sipsder-title :title="$t( 'about.event_admin_title' ).toUpperCase()"
                            type="admin"
                            section="configuration">
      <b-row slot="content">
        <b-col style="padding-left: 15px">
            {{$t('about.page_msg')}}
        </b-col>
        <div class="add-button text-right">
          <sipsder-btn :text="$t('about.buttons.add_event')"
                                btnType="add"
                                @onClick="addNew" v-if="!addEventActive"></sipsder-btn>
        </div>
      </b-row>  
      
    </sipsder-title>
    <div  class="terms-table">
      <filter-table :optionsTable="options_table" :perPage="timeLineQuery['size']" :items="items" @action="action($event)" :externalQuery="timeLineQuery" :fields="fields_t"></filter-table>
    </div>

    <div ref="event-modal">
      <transition name="fade">
        <div class="add-event" v-show="addEventActive">
          <div class="divA">
            <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          description= ""
                          :label="$t('about.event_name')+TEMPLATES.MANDATORY_SYMBOL">
              <b-form-input v-model="newEvent.event" v-validate="'required|max:70'" :data-vv-as="$t('about.event_name')"></b-form-input>
            </b-form-group>
          </div>
          <div class="divB">
            <b-form-group label-class="font-weight-bold"
                          description= ""
                          :label="$t('about.date')+TEMPLATES.MANDATORY_SYMBOL">
              <datepicker :placeholder="$t('util.insertDate')" 
                          :calendar-button = "true"
                          class="date-picker"
                          calendar-button-icon = "fa fa-calendar"
                          :clear-button = "true"
                          v-model="newEvent.date">
              </datepicker>
            </b-form-group>
          </div>
          <div class="divC">
            <b-form-group :label-cols="4"
                          label-class="font-weight-bold"
                          label="&nbsp;">
              <b-form-checkbox id="checkbox1"
                              value="true"
                              unchecked-value="false" v-model="newEvent.status">
                  <b> {{ $t('about.enable') }} <span style='color:red'>*</span> </b> 
              </b-form-checkbox>
            </b-form-group>
          </div>
          <div class="divD">
            <div class="label">
              <b> {{$t('about.description')}} <span style='color:red'>*</span> </b> 
            </div>
            <rich-text :options="customToolbar" @changeValue="changeValue" :newContent="newEvent.description"></rich-text>
          </div>
          <div class="divE">
            <sipsder-btn btnType="uploadImage" variant="primary" :text="$t('about.buttons.modify_audiovisual')"
              @onClick="showModal('addImageModal')"
            ></sipsder-btn> <span style='color: red'>*</span>
            <div class="carrousel" v-if="eventAttach.length!=0">

              <div class="bigOne">
                <div v-if="selectImage.type=='Video'">
                  <iframe  :src="selectImage.url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div v-else>
                  <img :src="getImgURL(selectImage.url)">
                </div>
              </div>
              <div class="scroll" >
                <div v-for="(image,i) in eventAttach" :key="i" @click="setSelectImage(i)"  
                  v-bind:class="{ activeSlide: (image.id==selectImage.id) }">
                  <img :src="getImgURL(getYTvideoCode(image.url))" alt="" >
                </div>
              </div>
            </div>
            <div class="carrouselOptions" v-if="eventAttach.length!=0">
              <div><button @click="scroll_left"><i class="fas fa-caret-left"></i></button></div>
              <div>
                <div>
                  <button @click="setImagePrincipal"> {{$t('about.main')}} 
                    <b-form-checkbox id="checkbox2"
                                value="true"
                                unchecked-value="false" v-model="selectImage.principal"
                    ></b-form-checkbox>
                  </button>
                </div>
                <div>
                  <sipsder-btn :text="$t('button.delete')"
                          btnType="cancel" @onClick="deleteImage"
                  ></sipsder-btn></div>
                </div>
              <div><button @click="scroll_right"><i class="fas fa-caret-right"></i></button></div>
            </div>
          </div>
          <div class="divF">
            <sipsder-btn  btnType="cancel"
                          @onClick="goClean"></sipsder-btn>
            <sipsder-btn :text="$t('button.save')"
                        btnType="add"
                        @onClick="createAndUpdate"></sipsder-btn>
          </div>
        </div>
      </transition>
    </div>

    <div style="text-align:center"><sipsder-btn btnType="back" @onClick="goBack"></sipsder-btn></div>

    <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
        <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
    </b-modal>

    <b-modal ref="errorEvent" :title="$t('about.modals.error_title')"
        @ok="closeModal('errorEvent')"
        @cancel="closeModal('errorEvent')"
        >
        <b-row class="w-100 center">
            <div class="w-100 red" v-html="error">
            </div>
        </b-row>
    </b-modal>
    <b-modal ref="errorEvent2" :title="$t('about.modals.error_title')"
        @ok="closeModalClear('errorEvent2')"
        @cancel="closeModal('errorEvent2')"
        >
        <b-row class="w-100 center">
            <div class="w-100 red" v-html="error">
            </div>
        </b-row>
    </b-modal> 
    <b-modal ref="errorEvent3" :title="$t('about.modals.error_title')"
        @ok="closeModalBack('errorEvent3')"
        @cancel="closeModal('errorEvent3')"
        >
        <b-row class="w-100 center">
            <div class="w-100 red" v-html="error">
            </div>
        </b-row>
      </b-modal>
  </div>
</template>

<script>
  import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
  import RichText from '../../shared/RichText.vue'
  import FilterTable from '../../shared/FilterTable.vue'
  import VAPI from '../../../http_common';
  import _ from 'lodash';
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';
  import * as lang from "vuejs-datepicker/src/locale"; //importar locale
  import {SERVICE_NAMES, TEMPLATES} from '@/sipsder_constants'
  import {PERMISSIONS_TYPES, ATTACHMENT_TYPE} from '../../../domain_constants'
  import S_UTIL from "../../../util/sipsder_util";


  export default {
    components: {
      FilterTable,
      Datepicker,
      RichText,
      Audiovisualmedia
    },
    data () {
      return {
        TEMPLATES:TEMPLATES,
        error:"",
        asterisk: "<span style='color: red'>*</span>",
        addEventActive:false,
        timeLineQuery: {
          "size": 10
        },
        items: 'getTimeLine',
        options_table: {
          "detail": {
            "id": 0,
            "class": "btn-success",
            "label": "",
            "icon": 'edit_pen'
          }
        },
        fields_t: [
          {
            key: 'date',
            label: 'Fecha',
            sortable: true,
            'class': 'text-center'
          },
          {
            key: 'event',
            label: 'Nombre',
            sortable: true
          },
          {
            key: 'status',
            label: 'Habilitado',
            sortable: true
          },
          {
            key: 'actions',
            label: 'Acción'
          }
        ],
        newEvent:{
          id:0,
          date:"",
          event:"",
          status:"true",
          description:"",
          attachments: [],
          deleteAttach:[]
        },
        stateCreate:0,
        attachments:{
          attachmentId:0,
          aboutEventId:0,
          principal:0,
        },
        eventAttach:[],
        selectImage:{
          index:0,
          id:0,
          url:"",
          type:"",
          principal:false
        },
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
  methods: {
    getImgURL (url) {
        return S_UTIL.getImgURL(url);
    },
    action(index){
      switch(index.id) {
        case 0:
          this.cancelAndClean();
          this.addNew();
          this.newEvent.id = index.item.id;
          this.newEvent.event = index.item.event;
          this.newEvent.date = index.item.date;
          this.newEvent.status = index.item.status;
          this.newEvent.description = index.item.description;
          this.getAttach(index.item.id);
          this.stateCreate=2;
          break;
        default:
          alert("ningun caso")
      }
    },
    goBack(){
      if(this.stateCreate==0){
        this.$router.go(-1)
      }
      else{
        this.error="";
        this.error=this.$t('about.time_line.not_saved_elements');
        this.showModal("errorEvent3");
      }
    },
    goClean(){
      if(this.stateCreate==0){
        this.cancelAndClean()
      }
      else{
        this.error=""
        this.error=this.$t('about.time_line.not_saved_elements');
        this.showModal("errorEvent2")
      }
    },
    addNew(){
      this.addEventActive=true;
      this.stateCreate=1;
      this.scrollMeTo("event-modal");
    },
    createAndUpdate(){
      this.error=""
      var noValid=false
      if(this.newEvent.event.length<1){
        this.error+="El campo 'Nombre Evento' esta vacío.<br>"
        noValid= true
      }
       
      if(this.newEvent.date.length<1){
        this.error+="El campo 'Fecha' esta vacío.<br>"
          noValid= true
      }
      if(this.newEvent.description.length<1){
        this.error+="El campo 'Descripción' esta vacío.<br>"
          noValid= true
      }
      if(this.newEvent.attachments.length<1){
        this.error+="Debe existir al menos un anexo.<br>"
          noValid= true
      }
      if(noValid)
        this.showModal("errorEvent")
      if(!noValid && this.stateCreate==1){
        VAPI.post(`${SERVICE_NAMES.ABOUT}/event`, this.newEvent).then((output)=>{
          this.cancelAndClean()
        }).catch((e)=>{
          alert("Error creando evento.")
        })
      }
      else if(!noValid && this.stateCreate==2){
        VAPI.put(`${SERVICE_NAMES.ABOUT}/event/${this.newEvent.id}`, this.newEvent).then((output)=>{
            this.cancelAndClean()
        }).catch((e)=>{
          alert("Error actualizando evento.")
        })
        
      }
    },
    cancelAndClean(){
      this.addEventActive=0;
      this.newEvent.id = 0;
      this.newEvent.event = "";
      this.newEvent.date = "";
      this.newEvent.status = true;
      this.newEvent.description = "";
      this.newEvent.attachments =[];
      this.eventAttach=[];
      this.newEvent.deleteAttach=[]
      this.scrollMeTo("table");
      this.stateCreate=0;
      this.timeLineQuery = {
        "size": 10
      }
    },
    dateFormater(dateSend) {
        let date = null 
        if(date !== null){
          let year = this.dateSend.getFullYear()
          let month = this.dateSend.getMonth() + 1
          let day = this.dateSend.getDate()
          date = day + "-" + month + "-" + year
        }
        return date;
    },
    changeValue(value){
      this.newEvent.description = value
    },
    showModal(ref){
      this.$refs[ref].show();
    },
    closeModal(ref){
      this.$refs[ref].hide();
    },
    closeModalClear(ref){
      this.$refs[ref].hide();
      this.cancelAndClean()
    },
    closeModalBack(ref){
      this.$refs[ref].hide();
      this.$router.go(-1)
    },
    getYTvideoCode(url){
      if(url.search("youtube")>0){
        var res = url.split("/")
        var rel = res[4].split("?")
        return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
      }
      else{
        return url;
      }
    },
    getAttach(id){
        VAPI.get(`${SERVICE_NAMES.ABOUT}/event/attach/${id}`).then((output) => {
         this.eventAttach=output.data.data;
         for(var i=0; i<this.eventAttach.length;i++){
            this.newEvent.attachments.push({
              attachmentId:this.eventAttach[i].id,
              aboutEventId: id,
              principal:this.eventAttach[i].principal
            })
            this.eventAttach[i].db=true
          }
          this.selectImage.index=0
          this.selectImage.id=this.eventAttach[0].id
          this.selectImage.url=this.eventAttach[0].url
          this.selectImage.type=this.eventAttach[0].type
          this.selectImage.principal=this.eventAttach[0].principal
          this.selectImage.db=this.eventAttach[0].db
        }).catch((e) => {
          
        });
    },
    setSelectImage(index){
            this.selectImage.index=index
            this.selectImage.id=this.eventAttach[index].id
            this.selectImage.url=this.eventAttach[index].url
            this.selectImage.type=this.eventAttach[index].type
            this.selectImage.principal=this.eventAttach[index].principal
            this.selectImage.db=this.eventAttach[index].db
    },
    setImagePrincipal(){
      for(var i=0;i<this.eventAttach.length;i++){
        this.eventAttach[i].principal=false
        this.newEvent.attachments[i].principal = false
      }
      this.eventAttach[this.selectImage.index].principal=true
      this.newEvent.attachments[this.selectImage.index].principal = true
      this.selectImage.principal=true
    },
    deleteImage(){
        if(this.selectImage.principal==true){
          this.error=""
          this.error="No puede eliminar el anexo principal."
          this.showModal("errorEvent")
        }
        else{
          this.eventAttach.splice(this.selectImage.index,1)
          this.newEvent.attachments.splice(this.selectImage.index,1)
          if(this.selectImage.db==true){
            this.newEvent.deleteAttach.push({
              attachmentId:this.selectImage.id,
              aboutEventId:this.newEvent.id,
              principal:0
            })
          }
          this.selectImage.index=0
          this.selectImage.id=this.eventAttach[0].id
          this.selectImage.url=this.eventAttach[0].url
          this.selectImage.type=this.eventAttach[0].type
          this.selectImage.principal=this.eventAttach[0].principal
          this.selectImage.db=this.eventAttach[0].db
        }
    },
    created_image(response){
      this.closeModal('addImageModal')
      let image = _.find(this.eventAttach, { 'id': response[0]});
      if(!image){
        
        this.eventAttach.push({
          id: response[0],
          url: response[1],
          type: response[2],
          principal: false,
          db:false
        })

        this.newEvent.attachments.push({
          attachmentId: response[0],
          aboutEventId: this.newEvent.id,
          principal:false
        })

        if(this.eventAttach.length === 1) {
            this.selectImage.index=0
            this.selectImage.id=this.eventAttach[0].id
            this.selectImage.url=this.eventAttach[0].url
            this.selectImage.type=this.eventAttach[0].type
            this.selectImage.db=this.eventAttach[0].db
            this.newEvent.attachments[0].principal = true
            this.eventAttach[0].principal = true
            this.selectImage.principal=this.eventAttach[0].principal
        }else {
        }
      }
    },
    scrollMeTo(refName) {
      var element = this.$refs[refName];
      element.scrollIntoView({  behavior: 'smooth' });
    },
    scroll_left() {
      let content = document.querySelector(".scroll");
      content.scrollLeft -= 70;
    },
    scroll_right() {
      let content = document.querySelector(".scroll");
      content.scrollLeft += 70;
    }
  }
  }
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.title-page
  width: 97%
  margin-left: auto
  margin-right: auto
.activeSlide
  box-shadow: 0px 0px 5px #333
.time-line-create
  width: 100%
  margin: 0 10%
  +flexbox
  +flex-direction(column)
  text-align: justify
  .h1 
    font-size: 2.5rem
    font-weight: 600
    padding: 2% 0 4% 0
  .h2 
    font-size: 2rem
    font-weight: 500
    padding: 2% 0
  .p
    font-size: 1.5rem
    font-weight: 300
  .search-container
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    .fields-container
      +flexbox
      +justify-content(center)
      +align-items(center)
      +flex-wrap(wrap)

      .row
        width: 100%
        padding: 1% 0
        +flexbox
        +justify-content(center)
        +align-items(center)
        .title
          +flexbox
          +justify-content(center)
          +align-items(center)
          width: 30%
          font-size: 1.5rem
        select
          width: 40%
  table
    text-align: center
.add-button
  padding-right: 15px
.fade-enter-active, .fade-leave-active 
  transition: opacity 1s
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ 
  opacity: 0
@media screen  and (max-width: 767px)
  .add-event
    grid-template-areas: "a a a" "b b b" "c c c" "d d d" "e e e" "f f f" !important
    grid-template-columns: 1fr 1fr 1fr !important
  .bigOne
      height: 120px !important
      width: 250px !important
      div
        height: 120px !important
        width: 250px !important
  .carrouselOptions
       div:nth-child(2)
          grid-template-columns: 1fr !important
.add-event
  width: 100%
  max-width: 1505px
  border: 1px solid #808285
  display: grid
  grid-template-areas: "a b c" "d d d" "e e e" "f f f"
  grid-template-columns: 2fr 1fr 1fr
  grid-gap: 15px
  background-color: #fff
  padding: 15px  15px
  margin: 20px auto
  +justify-content(left)
  .divA
    grid-area: a
    padding-left: 15px
  .divB
    grid-area: b
    padding-left: 15px
  .divC
    grid-area: c
    text-align: center
    padding-left: 15px
  .divD
    grid-area: d
    .label
      padding-left: 15px
      padding-bottom: calc(0.375rem + 1px)
    .container
      max-width:100% !important
  .divE
    grid-area: e
    padding-left: 15px
    .carrousel
      display: grid
      grid-template-columns: 1fr
      grid-gap: 15px
    .bigOne
      height: 315px
      width: 560px
      text-align: center
      margin-left: auto
      margin-right: auto
      overflow: hidden
      div
        height: 315px
        width: 560px
        img
          height: 100%
        iframe
          height: 100%
          width: 100%
    .scroll
      display: grid
      grid-auto-flow: column
      align-content: center
      grid-gap: 15px
      height: 200px
      width: 80%
      overflow: hidden
      scroll-behavior: smooth
      margin-left: auto
      margin-right: auto
      div
        padding: 0
        height: 150px
        width: 250px
        margin-left: auto
        margin-right: auto
        background-color: #ccc
        cursor: pointer
        img
          height: 100%
          width: 100%
    .carrouselOptions
       display: grid
       grid-template-columns: 1fr 3fr 1fr
       div
        button
          color: #6c757d
          background-color: #fff
          border: 1px solid #dee2e6
       div:nth-child(1)
          text-align: left
       div:nth-child(2)
          text-align: center
          display: grid
          grid-template-columns: 1fr 1fr
          div:nth-child(1)
            text-align: right
            button
              height: 100%
              cursor: pointer
          div:nth-child(2)
            text-align: left
          button
            margin-left: 5px
            color: #6c757d
            background-color: #fff
            border: none
       div:nth-child(3)
          text-align: right
  .divF
    grid-area: f
    text-align: right
    padding-right: 15px
    

</style>