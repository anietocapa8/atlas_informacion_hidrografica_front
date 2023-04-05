<template>
     <div ref="table" class="time-line-admin">
        <div class="feed-title">{{$t( 'topic.ruralHousing.title' )}}</div>
        <div class="container-form col-90">
            <div style="padding-left: 15px">{{ $t('topic.timeline_admin.claim') }}</div>
            <div class="add-button text-right">
            <sipsder-btn :text="$t('topic.timeline_admin.add_event')"
                                    btnType="add"
                                    @onClick="addNew" v-if="!addEventActive"></sipsder-btn>
            </div>
            <div  class="terms-table">
            <b-form-group :label-cols="4" label-class="font-weight-bold" label="&nbsp;">
              <b-form-checkbox id="checkbox1" value="true" unchecked-value="false" v-model="onlyContest">
                  <b>{{ $t('topic.ruralHousing.only_contest_related') }}</b> 
              </b-form-checkbox>
            </b-form-group>
            <filter-table :optionsTable="options_table" :perPage="timeLinesQuery['size']" :items="items" @action="action($event)" :externalQuery="timeLinesQuery" :fields="fields_t"></filter-table>
            </div>

            <div ref="event-modal">
            <transition name="fade">
                <div class="add-event" v-show="addEventActive">
                <div class="divA">
                    <b-form-group :label-cols="4"
                                label-class="font-weight-bold"
                                description= ""
                                :label="$t('topic.timeline_admin.name') + asterisk">
                    <b-form-input v-model="newEvent.event" v-validate="'required|max:70'"></b-form-input>
                    </b-form-group>
                </div>
                <div class="divB">
                    <b-form-group label-class="font-weight-bold"
                                description= ""
                                :label="$t('topic.timeline_admin.date') + asterisk">
                    <datepicker :placeholder="$t('util.insertDate')" 
                                :calendar-button = "true"
                                class="date-picker"
                                calendar-button-icon = "fa fa-calendar"
                                :clear-button = "true"
                                v-model="newEvent.vanilaDate">
                    </datepicker>
                    </b-form-group>
                </div>
                <div class="divC">
                    <b-form-group :label-cols="4"
                                label-class="font-weight-bold"
                                label="&nbsp;">
                    <b-form-checkbox id="checkbox1"
                                        value="true"
                                        unchecked-value="false" v-model="newEvent.state">
                        <b>{{ $t('topic.timeline_admin.enable') }} </b> <span style='color: red'>*</span>
                    </b-form-checkbox>
                    </b-form-group>
                </div>
                <div class="divD">
                    <div class="label"><b>{{ $t('topic.timeline_admin.description') }}</b> <span style='color: red'>*</span></div>
                    <rich-text :options="customToolbar" @changeValue="changeValue" :newContent="newEvent.description"></rich-text>
                </div>
                <div class="divG">
                    <b-form-group :label-cols="4"
                                label-class="font-weight-bold"
                                label="&nbsp;">
                      <b>{{ $t('topic.timeline_admin.contest_related') }}</b> <span style='color: red'>*</span>
                      <b-form-radio-group id="radios1" label="label" :options="radioOptions" v-model="newEvent.contestState" name="radioOpenions" ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group v-if="contestList && (newEvent.contestState == 'true' || newEvent.contestState == true)" :label-cols="4"
                                label-class="font-weight-bold"
                                label="&nbsp;">
                      <b>{{ $t('topic.timeline_admin.create_contest') }}</b>
                      <v-select  v-model="contestSelect" label="name" placeholder="Concurso" :options="contestList"></v-select>
                      
                    </b-form-group>
                    <div v-if="contestSelect!=null"><h2 @click="goToContestDetail"><router-link to="">{{ $t('topic.ruralHousing.view_contest') }}</router-link></h2></div>
                </div>
                <div class="divE">
                    <b>{{ $t('topic.timeline_admin.audiovisual_related') }}</b> <span style='color: red'>*</span><br>
                    <sipsder-btn btnType="uploadImage" variant="primary" :text="'Agregar Imágenes o Videos'"
                    @onClick="showModal('addImageModal')"></sipsder-btn>
                    <div class="carrousel" v-if="eventAttach.length!=0">

                      <div class="bigOne" :key="index">
                        <div v-if="selectImage.type=='Video'">
                        <iframe  :src="getImgURL(selectImage.url)" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
                    <sipsder-btn btnType="cancel" @onClick="goClean"></sipsder-btn>
                    <sipsder-btn v-if="newEvent.contestState == 'true' && (contestSelect == null || contestSelect == undefined)" :text="$t('topic.timeline_admin.save_create_contest')"
                                btnType="add"
                                @onClick="showModal('errorEvent5')"></sipsder-btn>
                    <sipsder-btn v-else :text="$t('topic.timeline_admin.save_publish')"
                              btnType="add"
                              @onClick="showModal('errorEvent4')"></sipsder-btn>

                                
                </div>
                </div>
            </transition>
            </div>

            <div style="text-align:center"><sipsder-btn btnType="back" @onClick="goBack"></sipsder-btn></div>
        </div>

        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>

        <b-modal ref="errorEvent" :title="$t('modal.title')"
            @ok="closeModal('errorEvent')"
            @cancel="closeModal('errorEvent')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent2" :title="$t('modal.title')"
            @ok="closeModalClear('errorEvent2')"
            @cancel="closeModal('errorEvent2')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal> 
        <b-modal ref="errorEvent3" :title="$t('modal.title')"
            @ok="closeModalBack('errorEvent3')"
            @cancel="closeModal('errorEvent3')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="error">
                </div>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent4" :title="$t('modal.title')"
            @ok="createAndUpdate"
            @cancel="closeModal('errorEvent4')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="'<span>'+$t('topic.timeline_admin.save_no_contest')+'</span>'"/>
            </b-row>
        </b-modal>
        <b-modal ref="errorEvent5" :title="$t('modal.title')"
            @ok="createAndUpdateWContest"
            @cancel="closeModal('errorEvent5')"
            >
            <b-row class="w-100 center">
                <div class="w-100 red" v-html="'<span>'+$t('topic.timeline_admin.save_contest')+'</span>'"/>
            </b-row>
        </b-modal>   
  </div>
</template>

<script>
import Audiovisualmedia from '../../../audiovisual_media/AudioVisualIndex.vue';
import RichText from '../../../../shared/RichText.vue'
import FilterTable from '../../../../shared/FilterTable.vue'
import VAPI from '../../../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS} from '../../../../../sipsder_constants';
import { ATTACHMENT_TYPE} from '../../../../../domain_constants';
import vSelect from "vue-select"
import _ from 'lodash';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import * as lang from "vuejs-datepicker/src/locale";
import S_UTIL from "../../../../../util/sipsder_util";

export default {
  components: {
      FilterTable,
      Datepicker,
      RichText,
      Audiovisualmedia,
      "v-select": vSelect 
  },
  data () {
      return {
        contest: {
          attachments: [],
          date: new Date(),
          status: true,
          disableReason: undefined,
          generalities: " ",
          moreInfo: " ",
          name: " ",
          summary: " ",
          tags: ["Concurso"]
        },
        index: 0,
        error:"",
        asterisk: "<span style='color: red'>*</span>",
        addEventActive:false,
        timeLinesQuery: {
          "size": 10
        },
        items: 'getTimeLines',
        onlyContest: "false",
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
            key: 'vanilaDate',
            label: this.$t('topic.timeline_admin.date'),
            sortable: true,
            'class': 'text-center'
          },
          {
            key: 'event',
            label: this.$t('topic.timeline_admin.name_field'),
            sortable: true
          },
          {
            key: 'state',
            label: this.$t('topic.timeline_admin.enabled'),
            sortable: true
          },
           {
             key: 'contestState',
            label: this.$t('topic.timeline_admin.contest'),
            sortable: true
          },
          {
            key: 'actions',
            label: this.$t('topic.timeline_admin.actions'),
          }
        ],
        radioOptions:[
          {
            text: this.$t('util.yes'),
            value: "true"
          },
          {
            text: this.$t('util.no'),
            value: "false"
          }
        ],
        newEvent:{
          id:0,
          vanilaDate:"",
          event:"",
          state:"true",
          contestState:"false",
          description:"",
          images: [],
          deleteImages:[]
        },
        stateCreate:0,
        eventAttach:[],
        selectImage:{},
        contestList:null,
        contestSelect:null,
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
        ],
      }
    },
  async beforeMount(){
      try {
        let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_HOUSING}/contest`);
          this.contestList= response.data.data;
      }
      catch( error ) {
          console.log( 'Error fetching contest list', error );
      }
  },
  watch:{
    onlyContest:function(val) {
      if(val=="true"){
        this.timeLinesQuery =  {
          "size": 10,
          "contest": ["true"]
        }
      }
      else if(val == "false"){
        this.timeLinesQuery ={
          "size": 10
        }
      }

    },
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    goToContestDetail() {
        this.$store.dispatch('setContestId', this.contestSelect.id);
        this.$router.push({ name: "ContestDetail" });
    },
    action(index){
      switch(index.id) {
        case 0:
          this.cancelAndClean();
          this.addNew();
          this.newEvent.id = index.item.id;
          this.newEvent.event = index.item.event;
          this.newEvent.vanilaDate = index.item.vanilaDate;
          this.newEvent.state = index.item.state;
          this.newEvent.contestState = index.item.contestState;
          this.newEvent.idContest = index.item.idContest;
          this.newEvent.description = index.item.description;
          this.eventAttach = JSON.parse(JSON.stringify(index.item.images))
          
          this.newEvent.images = JSON.parse(JSON.stringify(index.item.images))
          for(var i=0; i<this.eventAttach.length;i++){
            this.eventAttach[i].db=true
          }
          if(this.newEvent.contestState){
            this.contestSelect = this.contestList.find(el=>{
              return el.id==this.newEvent.idContest;
            })
          }
          this.stateCreate=2;
          this.selectImage.index=0
          this.selectImage.id=this.eventAttach[0].id
          this.selectImage.url=this.eventAttach[0].url
          this.selectImage.type=this.eventAttach[0].type
          this.selectImage.principal=this.eventAttach[0].principal
          this.selectImage.db=this.eventAttach[0].db
         
          break;
        default:
          alert("ningun caso")
      }
    },
    goBack(){
      if(this.stateCreate===0){
        this.$router.go(-1)
      }
      else{
        this.error=""
        this.error=this.$t('topic.timeline_admin.non_saved_elements');
        this.showModal("errorEvent3")
      }
    },
    goClean(){
      if(this.stateCreate==0){
        this.cancelAndClean()
      }
      else{
        this.error=""
        this.error=this.$t('topic.timeline_admin.non_saved_elements');
        this.showModal("errorEvent2")
      }
    },
    addNew(){
      this.addEventActive=true;
      this.stateCreate=1;
      this.scrollMeTo("event-modal");
    },
    createAndUpdateWContest(){
      this.error=""
      var noValid=false
      if(this.newEvent.event.length<1){
        this.error+=this.$t('topic.timeline_admin.name_error')+'<br>';
        noValid= true
      }
       
      if(this.newEvent.vanilaDate.length<1){
        this.error+=this.$t('topic.timeline_admin.date_error')+'<br>';
        noValid= true
      }
      if(this.newEvent.description.length<1){
        this.error+=this.$t('topic.timeline_admin.description_error')+'<br>';
        noValid= true
      }
      if(this.newEvent.images.length<1){
        this.error+=this.$t('topic.timeline_admin.attachment_error')+'<br>';
          noValid= true
      }
      if(this.newEvent.contestState == "true"){
        if(this.contestSelect!=null){
        this.error+=this.$t('topic.timeline_admin.contest_error')+'<br>';
          noValid= true
        }
      }
      if(noValid)
        this.showModal("errorEvent")
      if(!noValid){
        const body = { ...this.contest };
        body.name = "Concurso Automatico de -" + this.newEvent.event
        body.tags = body.tags.map(tag => tag.text);
        let request = VAPI.post("/" + SERVICE_NAMES.CONTEST, body);
        request.then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.newEvent.idContest = response.data.id
            if(this.stateCreate==1){
              VAPI.post(`/${SERVICE_NAMES.RURAL_HOUSING}/timeline`, this.newEvent).then((output)=>{
                if (output && output.status === HTTP_STATUS.OK) {
                  this.cancelAndClean()
                  this.goToContestCreate(response.data.id);
                }
                else {
                    throw new Error("response error");
                }
              }).catch((e)=>{
                alert("Error creando evento.")
              })
            }
            else if(this.stateCreate==2){
              VAPI.put(`/${SERVICE_NAMES.RURAL_HOUSING}/timeline`, this.newEvent).then((output)=>{
                if (output && output.status === HTTP_STATUS.OK) {
                  this.cancelAndClean()
                  this.goToContestCreate(response.data.id);
                }
                else {
                    throw new Error("response error");
                }
              }).catch((e)=>{
                alert("Error actualizando evento.")
              })
            }
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
           alert("Error creando concurso.")
        });
      }
     
    },
    createAndUpdate(){
      this.error=""
      var noValid=false
      if(this.newEvent.event.length<1){
        this.error+=this.$t('topic.timeline_admin.name_error')+'<br>';
        noValid= true
      }
       
      if(this.newEvent.vanilaDate.length<1){
        this.error+=this.$t('topic.timeline_admin.date_error')+'<br>';
        noValid= true
      }
      if(this.newEvent.description.length<1){
        this.error+=this.$t('topic.timeline_admin.description_error')+'<br>';
        noValid= true
      }
      if(this.newEvent.images.length<1){
        this.error+=this.$t('topic.timeline_admin.attachment_error')+'<br>';
        noValid= true
      }
      if(this.newEvent.contestState == "true"){
        if(this.contestSelect!=null){
          this.newEvent.idContest = this.contestSelect.id;
        }
        else{
          this.error+=this.$t('topic.timeline_admin.contest_choose_error')+'<br>';
          noValid= true
        }
      }
      if(noValid)
        this.showModal("errorEvent")
        
      if(!noValid && this.stateCreate==1){
        VAPI.post(`/${SERVICE_NAMES.RURAL_HOUSING}/timeline`, this.newEvent).then((output)=>{
          if (output && output.status === HTTP_STATUS.OK) {
            this.cancelAndClean()
          }
          else {
              throw new Error("response error");
          }
        }).catch((e)=>{
          alert("Error creando evento.")
        })
      }
      else if(!noValid && this.stateCreate==2){
        VAPI.put(`/${SERVICE_NAMES.RURAL_HOUSING}/timeline`, this.newEvent).then((output)=>{
          if (output && output.status === HTTP_STATUS.OK) {
            this.cancelAndClean()
          }
          else {
              throw new Error("response error");
          }
        }).catch((e)=>{
          alert("Error actualizando evento.")
        })
        
      }
    },
    goToContestCreate(id) {
      this.$store.dispatch('setContestId', id);
      this.$router.push({ name: "ContestCreate" });
    },
    cancelAndClean(){
      this.addEventActive=0;
      this.newEvent.id = 0;
      this.newEvent.event = "";
      this.newEvent.vanilaDate = "";
      this.newEvent.state = true;
      this.newEvent.contestState = false;
      this.newEvent.description = "";
      this.newEvent.images =[];
      this.newEvent.deleteImages=[]
      this.eventAttach = []
      this.selectImage = {}
      this.scrollMeTo("table");
      this.stateCreate=0;
      this.contestSelect= null
      if(this.onlyContest=="true"){
        this.timeLinesQuery =  {
          "size": 10,
          "contest": ["true"]
        }
      }
      else if(this.onlyContest == "false"){
        this.timeLinesQuery ={
          "size": 10
        }
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
        return this.getImgURL(url)
      }
    },
    setSelectImage(index){
        this.selectImage.index=index
        this.index=index
        this.selectImage.id=this.eventAttach[index].id
        this.selectImage.url=this.eventAttach[index].url
        this.selectImage.type=this.eventAttach[index].type
        this.selectImage.principal=this.eventAttach[index].principal
        this.selectImage.db=this.eventAttach[index].db
    },
    setImagePrincipal(){
      for(var i=0;i<this.eventAttach.length;i++){
        this.eventAttach[i].principal=false
        this.newEvent.images[i].principal = false
      }
      this.eventAttach[this.selectImage.index].principal=true
      this.newEvent.images[this.selectImage.index].principal = true
    },
    deleteImage(){
        if(this.selectImage.principal==true){
          this.error=""
          this.error=this.$t('topic.timeline_admin.attachment_delete_error');
          this.showModal("errorEvent")
        }
        else{
          this.eventAttach.splice(this.selectImage.index,1)
          this.newEvent.images.splice(this.selectImage.index,1)
          
          if(this.selectImage.db==true){
            this.newEvent.deleteImages.push({
              id:this.selectImage.id,
              idEvent:this.newEvent.id,
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

        this.newEvent.images.push({
          id: response[0],
          idEvent: this.newEvent.id,
          url: response[1],
          type: response[2],
          principal:false,
        })

        if(this.eventAttach.length === 1) {
            this.selectImage.index=0
            this.selectImage.id=this.eventAttach[0].id
            this.selectImage.url=this.eventAttach[0].url
            this.selectImage.type=this.eventAttach[0].type
            this.selectImage.db=this.eventAttach[0].db
            this.newEvent.images[0].principal = true
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
@import '../../../../../stylesheets/style.sass'
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../../assets/title/barra_sola_4.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(12% + 40px)
  padding-top: 20px
  a
    text-decoration: none
    color: #fff
.title-page
  width: 97%
  margin-left: auto
  margin-right: auto
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
    background: rgba(255,255,255,.8)
.activeSlide
  box-shadow: 0px 0px 5px #333
.time-line-admin
  width: 100%
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
@media screen  and (max-width: 800px)
  .add-event
    grid-template-areas: "a a a" "b b b" "c c c" "d d d" "g g g" "e e e" "f f f" !important
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
  grid-template-areas: "a b c" "d d d" "g g g" "e e e" "f f f"
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
  .divG
    grid-area: g
    padding-left: 15px
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
