<template>
  
  <div class="banner-admin container-form">
    <b-row>
      <b-col cols="12">

        <sipsder-title :title="$t('banner_admin.title')"
                              type="admin"
                              section="configuration">
          <h3 style="text-align: left" slot="content" v-html="$t('banner_admin.claim')" />
        </sipsder-title>
        <b-row>
          <b-col cols="12" class="d-flex flex-lg-row-reverse">
            <sipsder-btn @onClick="newBanner" btnType="add" :text="$t('banner_admin.add')" />
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="d-flex flex-lg-row-reverse">
            <sipsder-btn @onClick="addNewImage" btnType="edit_pen" :text="$t('banner_admin.edit_image')" />            
          </b-col>
        </b-row>

        <b-row v-if="this.new">
          <b-col cols="12" class="d-flex flex-lg-row-reverse">
            <sipsder-btn @onClick="addNewImage" btnType="add" :text="$t('banner_admin.add_image')" />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="banner-show">
            <b-row  class="justify-content-md-center">
              <b-carousel id="carousel1"
                          style="text-shadow: 1px 1px 2px #333;"
                          background="#ababab"
                          v-model="slide">
                <b-carousel-slide  style="display: inline-block" 
                      :caption="current_image.name"
                      :text="current_image.description" :key="current_image.id">

                  <img slot="img" class="cursor-pointer"
                    :src="getImgURL(current_image.imageUrl)" alt="image slot" > 

                </b-carousel-slide>
              </b-carousel> 
            </b-row>
            <br>
            <!-- thumbnails carousel-->
            <br>
            <Carousel :perPage="7">
              <Slide v-for="(image, index) in images" :key="index">
                <div class="thumb-carousel">
                  <div @click="imageClick(index)" class="thumbnail-style" :style="{ backgroundImage: 'url(' + getImgURL(image.imageUrl) + ')'}" style="width: 200px; height: 100px;background-size: cover; ">
                  </div>
                </div>
                <p>{{image.name}}</p>
              </Slide>
            </Carousel>
          </b-col>
        </b-row>

        <b-row>
          
          <b-col cols="12">
            <h3 class="mb-5 mt-5 text-left">{{$t('banner_admin.claim2')}}</h3>

            <label class="control-label">{{ $t('banner_admin.url') }}</label>
            <input class="form-control col" type="text" name="url" data-vv-delay="100" v-validate="'required'" v-model="current_image.url" :data-vv-as="$t('banner_admin.url')">
            <span  v-if="submitted && errors.has('url')" >{{ errors.first('url') }}</span>
          </b-col>

          <b-col cols="12" class="banner-code">
            <b-row>
              <b-col cols="6">
                <label class="control-label">{{ $t('banner_admin.code') }}</label>
                <input class="form-control col" type="text" v-model="current_image.code" name="code" disabled>
              </b-col>
              
              <b-col cols="6">
                <label class="control-label">{{ $t('banner_admin.status') }}</label>
                <b-col cols="12">
                  <b-form-select v-model="current_image.status" name="status" v-validate="'required'" :options="options" :data-vv-as="$t('banner_admin.status')"/>
                  <span  v-if="submitted && errors.has('status')" >{{ errors.first('status') }}</span>
                </b-col>
              </b-col>  
            </b-row>
            
          </b-col>

          <b-col cols="12" class="banner-name">
            <label class="control-label">{{ $t('banner_admin.name') }}</label>
            <input class="form-control col" maxlength="30" type="text" data-vv-delay="100" name="name" v-validate="'required'" v-model="current_image.name" :data-vv-as="$t('banner_admin.name')">
            <span  v-if="submitted && errors.has('name')" >{{ errors.first('name') }}</span>
          </b-col>
          
          <b-col cols="12" class="banner-name">
            <br>
            <label>{{ $t('banner_admin.description') }}</label>
            <textarea class="form-control col" type="text" maxlength="130" name="description" v-model="current_image.description" :data-vv-as="$t('banner_admin.description')"/>
            <span  v-if="submitted && errors.has('description')" >{{ errors.first('description') }}</span>
          </b-col>


          <b-col cols="12" v-if="current_image.status == 2" class="dates">
            <label class="control-label">{{ $t('event.time') }}</label>
            <b-row class="d-flex justify-content-center">
                <el-date-picker
                  name="date"
                  :data-vv-as="$t('event.time')"
                  v-validate="'required'"
                  v-model="range"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="Inicio"
                  end-placeholder="Fin"
                  :picker-options="null">
                </el-date-picker>
            </b-row>
            <span class="text-center" v-if="errors.has('date')" >{{ errors.first('date') }}</span>
          </b-col>

          <b-col cols="12">
            <b-row>
              <b-col cols="12" >
                <sipsder-btn btnType="back" @onClick="sureResetChanges"></sipsder-btn>
                <sipsder-btn @onClick="changeBanner" btnType="save" :text="$t('banner_admin.save_changes')" />
              </b-col>
            </b-row>
          </b-col>
          

        </b-row>        

      </b-col>
    </b-row>

    <!-- Add image modal -->
    <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
      <audiovisualmedia @created_image="created_image($event)" :banner="true" @cancel="hideNewImage" v-if="show"
      :media-options="mediaOptions" :allow-selection="true"></audiovisualmedia>
    </b-modal>

    <!-- Correct modal -->
    <b-modal ref="creaction_success" :title="$t('banner_admin.success_creation_mdl_title')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="12">
              <b><label>{{ $t('banner_admin.success_creation_mdl_text') }}</label></b>
            </b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn @onClick="closeSuccessModal" btnType="accept"/>
            </b-col>
          </b-row>
        </div>
      </b-modal>

      <!-- Error modal -->

    <b-modal ref="creaction_error" :title="$t('banner_admin.failed_creation_mdl_title')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="12">
              <b><label>{{ $t('banner_admin.failed_creation_mdl_text') }}</label></b>
            </b-col>
          </b-row>

        </div>
        <div>
          <b-row class="text-right">
            <b-col cols="12" class="text-right">
              <sipsder-btn @onClick="closeErrorModal" btnType="accept"/>
            </b-col>
          </b-row>
        </div>
      </b-modal>

      <!-- Correct modal -->

    <b-modal ref="modification_success" :title="$t('banner_admin.success_edit_mdl_title')" centered hideFooter>
        <div>
          <b-row>
            <b-col cols="12">
              <b><label>{{ $t('banner_admin.success_edit_mdl_text') }}</label></b>
            </b-col>
          </b-row>

        </div>
        <div>
          <b-row>
            <b-col class="text-right">
              <sipsder-btn @onClick="closeModifySuccessModal" btnType="accept"/>
            </b-col>
          </b-row>
        </div>
      </b-modal>

      <!-- Error modal -->

    <b-modal ref="modification_error" :title="$t('banner_admin.failed_edit_mdl_title')"  hideFooter>
          <b-row>
            <b-col cols="12">
              <b><label>{{ $t('banner_admin.failed_edit_mdl_text') }}</label></b>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="12" class="d-flex justify-content-center" >
              <sipsder-btn @onClick="closeModifyErrorModal" btnType="accept"/>
            </b-col>
          </b-row>
      </b-modal>

      <!-- Warning modal -->
      <b-modal ref="modalWarning" id="modalWarning" centered :title="$t('banner_admin.details')" hide-footer>
          <b-row>
            <b-col cols="12">
              <b><label>{{ $t('banner_admin.discard_mdl') }}</label></b>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" class="d-flex justify-content-center" >
              <sipsder-btn @onClick="closeWarningModal" btnType="cancel"/>
              <sipsder-btn @onClick="resetChanges" btnType="accept"/>
            </b-col>
          </b-row>
      </b-modal>
      
  </div>

</template>

<script>

  import VAPI from '../../../http_common';
  import Datepicker from 'vuejs-datepicker';
  import audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
  import { Carousel, Slide } from 'vue-carousel';
  import { SERVICE_NAMES } from "@/sipsder_constants";
  import { ATTACHMENT_TYPE } from "../../../domain_constants";
  import S_UTIL from "@/util/sipsder_util";
import moment from 'moment'

  export default {

    data(){
      return {
        range: null,
        mediaOptions: [
          {value: ATTACHMENT_TYPE.BANNER, text: this.$t('audiovisual_media.bannerOption')},
        ],
        show: false,
        submitted: false,
        slide: 0,
        sliding: null,
        images: [{"imageUrl": "https://picsum.photos/1024/480/?image=988", "name":"Cargando"}],
        current_image: {"status": 3},
        backup: {},
        new: false,
        options: [
          {
            value: 1,
            text: this.$t('banner_admin.active')
          },
          {
            value: 2,
            text: this.$t('banner_admin.temporal')
          },
          {
            value: 3,
            text: this.$t('banner_admin.inactive')
          }
        ],
        status: null,
        searchDateStart: null,
        searchDateEnd: null,
        disabledDates: {
          to: new Date(), // Disable all dates after specific date
        },
        searchenddisabledDates: {
          to: new Date(this.searchDateStart), // Disable all dates after specific date
        }
      }
    },
    mounted(){
      
      VAPI.get(`${SERVICE_NAMES.BANNER}`).then((output) => {
        
        this.images = output.data.data.sort((a, b) => {
          return new Date(b.startDate) - new Date(a.startDate);
        });
        this.current_image = this.images[0]

      }).catch((e) => {
        console.error(e.toString());
      });

      this.range = []
      this.range.push(new Date(this.current_image.startDate))
      this.range.push(new Date(this.current_image.endDate))
    },
    watch: {

      status: function (newVal,oldVal){
        /*if(oldVal !== null){
          VAPI.get( `/${SERVICE_NAMES.BANNER}/status/${this.current_image.id}`).then((output) => {
          
            alert('cambio correcto'); // TODO: Alert refactor

          }).catch((e) => {
            alert("error en cambio de estado"); // TODO: Alert refactor
            console.error(e.toString());
          });
        }*/
      }

    },
    methods: {
      getImgURL(url) {
        return S_UTIL.getImgURL(url)
      },
      setDates(){
        if(this.range !== null){
          this.current_image.startDate = moment(this.range[0]).valueOf()
          this.current_image.endDate= moment(this.range[1]).valueOf()
        }
      },
      created_image(response){

        this.current_image.imageId = response[0];
        this.current_image.imageUrl = response[1];
        this.hideNewImage()
        
      },
      onSlideStart (slide) {
        this.sliding = true
      },
      onSlideEnd (slide) {
        this.sliding = false
      },
      toImage(url) {
        //window.location.href = url;
        this.$router.push(url)
      },
      changeBanner(){
        
        if (this.current_image.url && this.current_image.url.includes("www") && !this.current_image.url.includes("http")) {
          this.current_image.url = "https://" + this.current_image.url;
        }

        this.setDates()
        
        if(!this.new){
          
          this.current_image['image'] = {}
          this.current_image['image']['id'] = this.current_image.imageId
          this.current_image['image']['url'] = this.current_image.imageUrl

          this.submitted = true
          this.$validator.validate().then(valid => {

            VAPI.put(`${SERVICE_NAMES.BANNER}/${this.current_image.id.toString()}`, this.current_image )
              .then((output) => {
              //alert("Modificado correctamente")
              this.$refs.modification_success.show()
              }).catch((e) => {
              //alert("error en modificación")
              this.$refs.modification_error.show()
              });
          });
        }else{

          this.current_image['image'] = {}
          this.current_image['image']['id'] = this.current_image.imageId
          this.current_image['image']['url'] = this.current_image.imageUrl

          this.submitted = true
          this.$validator.validate().then(valid => {
            VAPI.post(`${SERVICE_NAMES.BANNER}` , this.current_image ).then((output) => {
              //alert("Creado correctamente")
              this.$refs.creaction_success.show()
            }).catch((e) => {
              //alert("error en modificación")
              this.$refs.creaction_error.show()
            }); 
          });

        }

      },
      addNewImage(){
        this.show = true
        this.$refs.addImageModal.show();

      },
      hideNewImage(){
        this.show = false
        this.$refs.addImageModal.hide();

      },
      sureResetChanges(){
        this.$refs.modalWarning.show()
      },
      resetChanges(){
        this.new = false;
        
        VAPI.get(`${SERVICE_NAMES.BANNER}`).then((output) => {
          
          this.images = output.data.data.sort((a, b) => {
            return new Date(b.startDate) - new Date(a.startDate);
          });
          this.current_image = this.images[0]

        }).catch((e) => {
          console.error(e.toString());
        });

        this.$refs.modalWarning.hide()
        window.history.back();
      },
      imageClick(index){
        this.slide = index;
        this.current_image = this.images[index]
        this.range = []
        this.range.push(new Date(this.current_image.startDate))
        this.range.push(new Date(this.current_image.endDate))
      },
      newBanner(){
        this.new = true;
        this.backup = this.images;
        this.images = {};
        this.current_image = { 
          "name": null, 
          "url": null, 
          "status": 1, 
          "description": null, 
          "startDate": null, 
          "endDate": null, 
          "imageId": 2, 
          "imageUrl": "https://picsum.photos/1024/480/?image=1000" 
        }
      },
      closeSuccessModal(){
        this.$refs.creaction_success.hide()
        this.$router.go()
      },
      closeErrorModal(){
        this.$refs.creaction_error.hide()
      },
      closeModifySuccessModal(){
        this.$refs.modification_success.hide()
        this.$router.go()
      },
      closeModifyErrorModal(){
        this.$refs.modification_error.hide()
      },
      closeWarningModal(){
        this.$refs.modalWarning.hide()
      },
    },
    computed: {
      checkEndDate(){
        return { to: new Date(this.current_image.startDate)}
      }
    },
    components: {
      Datepicker,
      audiovisualmedia,
      Carousel,
      Slide
    }
  } 

</script>

<style>
  .el-date-range-picker__content table {
    border: none
  }
  .el-date-range-picker__content table tbody {
    border: none
  }
  .el-date-range-picker__content table tbody tr {
    border: none
  }
  .el-date-range-picker__content table tbody tr td {
    border: none
  }
  .el-picker-panel__body {
    width: 100%
  }
  @media only screen and (max-width: 480px) {
    .el-date-editor {
      width: 300px !important;
    }
    .el-picker-panel {
      display: flex;
      width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column
    }
    .el-picker-panel__body {
      display: flex;
      width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column
    }
    .el-date-range-picker__time-header {
      display: flex;
      width: 300px;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column
    }
  }
  
</style>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.banner-admin
  width: 100%
  padding: 0 5%
  +flexbox
  +flex-direction(column)
  text-align: center
  // div
  //   display: inline-block
  text-area
    height: 150px 
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
  .description
    +flexbox
    +flex-direction(column)
    align-items: flex-start
    text-align: left
    .p
      margin: 10px 0
  .w-100
    width: 100%;
    height: 327px;
  .banner-show
    margin: 50px 0
  .banner-detail
    +flexbox
    +flex-direction(column)
  .custom-select
    width: 100%
  .banner-code
    margin: 30px 0
  .banner-name
    margin: 2 0px 0
    text-align: left 
  .dates
    margin: 40px 0
  input
    border: 1px solid rgba(black, .3)
    border-radius: 4px
    padding: 0 3px 
  .change-buttons
    margin: 30px 0  
  .image-modal
    width: 100%
    height: 100%
  .thumbnail-style
    
    margin: 0 1px
    padding: 10px 10px;
  .thumb-carousel
    padding: 10px 10px;
    border: 1px solid
  .control-label:after 
    content: "*";
    color: red;
  span
    color: red;
  .error 
    color: red;
    
</style>


