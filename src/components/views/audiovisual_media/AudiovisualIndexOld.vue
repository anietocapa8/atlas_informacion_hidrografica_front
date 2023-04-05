<template>
  <div class="container container-form scroll">
    <div class="col-100 center">
    <!-- <div class="col-100 center" v-if="selected === null"> -->
      <b-form-group
        :label="$t('audiovisual_media.index.type')+asterisk"
        label-class="font-weight-bold"
        class="col-100">
        <b-form-select
          :options="mediaOptions"
          v-model="selectedOption"
          @input="changeOption">
        </b-form-select>
      </b-form-group>
      <i class="fas fa-question-circle question-size center" style="margin: 0 10px; color:#0db8bb" v-b-tooltip.hover :title="message" placement="bottomleft"></i>
    </div>

    <div class="row" v-if="selectedOption == 'image' || selectedOption == 'banner'
    || selectedOption == 'image default' || selectedOption == 'banner default' || selectedOption == 'contact'">
      <div class="col-100">
        <b-form-group
          :label="$t('audiovisual_media.index.new')+asterisk"
          label-class="font-weight-bold"
          class="col-100">
          <input  type="file" @change="getImage"
            :disabled="selected !== null"
            v-validate="'size:1024|mimes:image/*'" name="file" data-vv-as="Imagen"/>
        </b-form-group>
        
      </div>
      <div class="col-100">
        <span class="error" v-if="errors.first('file')">{{$t('audiovisual_media.index.image_error')}}</span>
      </div>
    </div>
    <div class="col-100" v-else>
      <b-form-group
        :label="$t('audiovisual_media.index.url')+asterisk"
        label-class="font-weight-bold">
        <b-form-input type="text" v-model="url"
        :disabled="selected !== null"
        v-validate="'required|min:3'" name="url" data-vv-as="URL"></b-form-input>    
      </b-form-group>
      <div class="col-100">
        <span class="error">{{ errors.first('description') }}</span>
      </div>
    </div>

    <iframe :src="showURL" v-if="url.length > 0 && selectedOption == 'video'"
      style="width: 100%; height: 350px; margin: 10px 0px"></iframe>

    <img :src="urlImage" v-if="urlImage.length > 0"
    style="width: 100%; height: 350px; margin: 10px 0px">

    <div class="row mg-10" v-if="allowSelection">
      <div class="col-100 border padding-5">
        <b-form-group
          :label="$t('audiovisual_media.index.search')"
          label-class="font-weight-bold">
          <div class="inline">
            <b-form-input  type="text" v-model="q"></b-form-input>
            <sipsder-btn 
            style="margin-left: 5px"
            btnType="search"
            @onClick="newSearch"></sipsder-btn>  
          </div>
                
        </b-form-group>
      </div>

      <carousel :perPageCustom="[[480, 2], [768, 2], [1024, 2]]" :navigationEnabled="true"
      class="w-unset col-100 padding-5">
        <slide v-for="(image, i) in options" :key="i">
          <template v-if="selectedOption == 'image'">
            <img 
            @click="selection(image)"
            :src="image.url" :alt="'Image'" width="150" height="150">
          </template>
          <template v-if="selectedOption == 'video'">
            <div style="position: relative; width: 150px; height: 150px;" class="center"
            >
              <iframe class="center" width="150" height="150"
                :src="image.url"
              >
              </iframe>
              <div class="cover"
              @click="selection(image)"></div>
            </div>
            
          </template>
          <template v-if="selectedOption == 'banner'">
            <div style="position: relative; width: 150px; height: 150px;" class="center"
            >
              <iframe class="center" width="150" height="150"
                :src="image.url"
              >
              </iframe>
              <div class="cover"
              @click="selection(image)"></div>
            </div>
            
          </template>
        </slide>
      </carousel>
    </div>

    <div class="row">
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.title')+asterisk"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="title"
          :disabled="selected !== null"
          v-validate="'required|min:3'" name="title" data-vv-as="Titulo"
          ></b-form-input>          
        </b-form-group>
        <div class="col-100">
          <span class="error">{{ errors.first('title') }}</span>
        </div>
      </div>
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.source')+asterisk"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="source"
          :disabled="selected !== null"
          v-validate="'required|min:3'" name="source" data-vv-as="Fuente"></b-form-input>        
        </b-form-group>
        <div class="col-100">
          <span class="error">{{ errors.first('source') }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.author')+asterisk"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="author"
          :disabled="selected !== null"
          v-validate="'required|min:3'" name="author" data-vv-as="Autor"></b-form-input>       
        </b-form-group>
        <div class="col-100">
          <span class="error">{{ errors.first('author') }}</span>
        </div>
      </div>
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.description')+asterisk"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="description"
          :disabled="selected !== null"
          v-validate="'required|min:3'" name="description" data-vv-as="Descripcion"></b-form-input>  
        </b-form-group>
        <div class="col-100">
          <span class="error">{{ errors.first('description') }}</span>
        </div>
      </div>
    </div>

    <div class="row" v-if="media != null">
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.user')"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="user"
          :disabled="true"
          ></b-form-input>       
        </b-form-group>
      </div>
      <div class="col-50">
        <b-form-group
          :label="$t('audiovisual_media.index.date')"
          label-class="font-weight-bold">
          <b-form-input type="date" v-model="created"
          :disabled="true"
          ></b-form-input>  
        </b-form-group>
      </div>
    </div>

    <div class="col-100 center" v-if="showSummary">
      <div class="col-75 overflow-y">
          <b-table striped hover :items="summary" :fields="SummaryFields"></b-table>
      </div>
    </div>
    
    <div class="button-container">
      <sipsder-btn :text="$t('audiovisual_media.cancelBtn')"
        btnType="cancel"
        @onClick="cancelAction"></sipsder-btn>
      <sipsder-btn :text="text"
        btnType="add"
        @onClick="addAction"></sipsder-btn>
    </div>
  </div>
</template>

<script>
import VAPI from '../../../http_common'
import {SERVICE_NAMES} from "../../../sipsder_constants";
import { Carousel, Slide } from 'vue-carousel';
import moment from 'moment'
import S_UTIL from "../util/sipsder_util";


export default {
  data(){
    return {
      text: "",
      asterisk: "<span style='color: red'>*</span>",
      selectedOption: "image",
      title: "",
      source: "",
      author: "",
      user: "",
      created: "",
      description: "",
      url: "",
      showURL: "",
      urlImage: "",
      image: null,
      selected: null,
      options: [],
      q: "",
      summary: [],
      SummaryFields: [
        {
          key: 'section',
          sortable: true
        },
        {
          key: 'count',
          sortable: true
        },
      ]
    }
  },
  props:{
    showSummary: {
      type: Boolean,
      default: false
    },
    media: {
      type: Object,
      default: null
    },
    message: {
      type: String,
      default: ""
    },
    mediaOptions: {
      type: Array,
      default: () => []
    },
    banner: {
      type: Boolean,
      default: false
    },
    allowSelection: {
      type: Boolean,
      default: false
    }
  },
  watch:{
    url: function(val) {
      this.getYouTubeUrl()
    }
  },
  methods: {
    getVideoURL (url) {
      return S_UTIL.getVideoURL(url);
    },
    selection(image){
      this.selected = image
      this.author = image.author
      this.title = image.title
      this.source = image.source
      this.description = image.description
      if (this.selectedOption === 'video') {
        this.showURL = image.url
        this.url = image.url
      } else {
        this.urlImage = image.url
      }
      this.text = this.$t('audiovisual_media.selectBtn')
    },
    async changeOption(){
      let results = null
      if(this.selectedOption == 'image'){
        results = await this.search("Imágen pública", this.q)
      }else if(this.selectedOption == 'video') {
        results = await this.search("Video", this.q)
      }else {
        results = await this.search("Banner", this.q)
      }
      this.options = results.data.data
    },
    async addAction(){
      let finalUrl = ''
      let type = ''
      if(this.selected){
        this.createdImage([ this.selected.id, this.selected.url, this.selected.type.type ] )
      }else {
        if(this.title.length >= 3 && this.source.length >= 3 && this.description.length >= 3 && this.author.length > 3 && 
        (this.image != null || this.url.length >= 3)){
          if(this.selectedOption == 'image' || this.selectedOption == 'banner'
          || this.selectedOption == 'image default' || this.selectedOption == 'banner default' || this.selectedOption == 'contact'){
            let formData = new FormData();
            formData.append('file', this.image);
            formData.append('type', 'image');
            let response = await VAPI.post("/" + SERVICE_NAMES.UPLOAD, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            finalUrl = response.data.data.fileDownloadUri
          }else if(this.selectedOption == 'video' || this.selectedOption == 'video default') {
            finalUrl = this.showURL
          }
        }else if(this.media) {
          finalUrl = this.media.url
        }
        switch (this.selectedOption) {
            case "banner":
              type = "Banner"
              break;
            case "image":
              type = 'Imágen pública'
              break;
            case "video":
              type = 'Video'
              break;
            case "image default":
              type = 'Imágen defecto'
              break;
            case "banner default":
              type = "Banner defecto"
              break;
            case "video default":
              type = "Video defecto"
              break;
            case 'contact': 
              type = "Contacto"
              break;
            default:
              type = 'Imágen pública'
              break;
          }
          
          let mediaObject = {
            type: type,
            url: finalUrl,
            title: this.title,
            source: this.source,
            description: this.description,
            author: this.author
          }

          try{
            let result;
            if(this.media === null){
              result = await VAPI.post('/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA, mediaObject)            
            }else {
              result = await VAPI.put(`/${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/${this.media.id}`, mediaObject)            
            }
            if(result.status == 200){
              result.data += '}}';
              result = JSON.parse(result.data)
              this.createdImage([ result.data.id, result.data.url, result.data.type.type ] )
            }
          }catch(e){
            console.log(e)
          }
        
      }
    },
    createdImage(values){
      this.clear()
      this.$emit('created_image', values)
    },
    getImage(e) {
      this.image = e.target.files[0];
      this.urlImage = URL.createObjectURL(this.image);
    },
    getId(url) {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    },

    getYouTubeUrl(){
      if(this.url.search("youtube")>0){
        let vId = this.getId(this.url);
        this.showURL = `https://www.youtube.com/embed/${vId}?rel=0`;
      }
      else{
        this.showURL = this.getVideoURL(this.url);
      }
    },
    cancelAction() {
      this.clear()
      if(this.selected){
        this.text = this.$t('audiovisual_media.addBtn')
        this.selected = null
      }else {
        this.selected = null
        this.$emit('cancel')
      }
    },
    clear(){
      this.title = ""
      this.source = ""
      this.author = ""
      this.description = ""
      this.url = ""
      this.showURL = ""
      this.urlImage = ""
    },
    async newSearch(){
      let text = "Video"
      if(this.selectedOption == "image"){
        text = "Imágen pública"
      }
      let results = await this.search(text, this.q)
      this.options = results.data.data
    },
    search(type, q){
      return VAPI.get('/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA + "/search", {
        params: {
          type: type,
          q: q
        }
      })    
    } 
  },
  components: {
    Carousel,
    Slide
  },  
  async mounted(){
    this.text = this.$t('audiovisual_media.addBtn')
    if(this.banner){
      this.selectedOption = "banner"
      let results = await this.search("Banner", this.q)
      this.options = results.data.data
    }else {
      let results = await this.search("Imágen pública", this.q)
      this.options = results.data.data
    }
    this.selectedOption = this.mediaOptions[0].value
    this.summary = []
    if(this.showSummary){
      let summary = await VAPI.get(`/audiovisual-media/summary/${this.media.id}`)
      this.summary = summary.data.data

      this.author = this.media.author
      this.title = this.media.title
      this.source = this.media.source
      this.description = this.media.description
      this.user =  this.media.user.firstName + " " + this.media.user.lastName
      this.created =  moment(new Date(this.media.createdAt)).format('YYYY-MM-DD')

      if(this.media.type.type == 'Video'){
        this.selectedOption = 'video'
      }else if(this.media.type.type == 'Banner') {
        this.selectedOption = 'banner'
      }
      if(this.media.type.type === 'Video'){
        this.showURL = this.media.url
        this.url = this.media.url
      }else {
        this.urlImage = this.media.url
      }
    }
  }
}
</script>


<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .col-75
    width: 75%
  .overflow-y
    height: 200px
    overflow-y: auto
    overflow-x: hidden
  .question-size
    font-size: 2.5rem
  .w-unset
    width: unset !important
  .cover
    width: 150px
    height: 150px
    background: transparent
    position: absolute
    top: 0
    left: 0
  .mg-10
    margin: 10px 0
  .border
    border: 1px solid black
  .padding-5
    padding: 5px 
  .error
    color: $colorDanger
    font-size: 1rem
  input
    width: 100%
  .inline
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .row
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    flex-wrap: wrap
  .col-50
    width: 45%
    margin: 0 2.5%
  .col-100
    width: 100% !important
  .button-container
    +flexbox
    +justify-content(flex-end)
    +align-items(center)
    div
      padding: 0 5px
  .center
    +flexbox
    +justify-content(center)
    +align-items(center)
  .scroll
    height: 400px
    overflow-y: auto
</style>
