<template>
    <div>
        <div class="feed-title">{{$t( 'topic.ruralHousing.title' )}}</div>
        <div class="col-90 container-form">
            <div v-if="ruralHousing" class="manual-grid">
                <div class="general" style="min-height: 700px;">
                    <div v-if="isAdministrator">
                                <sipsder-btn btnType="edit_pen" :text="$t('topic.ruralHousing.edit_description')" @onClick="isEditDescription = true" v-if="!isEditDescription"></sipsder-btn>
                                <sipsder-btn btnType="cancel" @onClick="unSetEdit" v-if="isEditDescription"></sipsder-btn>
                                <sipsder-btn :text="$t('button.save')" btnType="add" @onClick="update(ruralHousing)" v-if="isEditDescription"></sipsder-btn>
                    </div>
                    <h2>{{ $t( 'topic.ruralHousing.general_description' ) }}</h2>
                    <rich-text-preview :content="ruralHousing.description" class="text" v-if="!isEditDescription"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="ruralHousing.description" v-else style="overflow: auto;"></rich-text>
                    <div class="img">
                        <div v-if="ruralHousing.typeAtchDescription=='Video'">
                            <iframe :src="ruralHousing.urlAtchDescription" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div v-else>
                            <img :src="getImgURL(ruralHousing.urlAtchDescription)">
                        </div>
                        <div style="text-align:right"><sipsder-btn btnType="uploadImage" variant="primary" :text="$t('topic.ruralHousing.edit_audiovisual')" @onClick="showModal('addImageModal', 0)" v-if="isEditDescription && isAdministrator"></sipsder-btn></div>
                    </div>
                </div>
                <div>
                    <div class="body-grid">
                        <div>
                            <div class="manual-grid" v-if="isAdministrator">
                                <h3>{{ruralHousing.titleDocument}}</h3>
                                <div v-if="isAdministrator" style="text-align: right;">
                                    <sipsder-btn btnType="edit_pen" @onClick="$router.push({ name: 'CommunityCreateDocument', params:{id: ruralHousing.idDocument}})" text=""></sipsder-btn>
                                </div>
                            </div>
                            <h3 v-else>{{ruralHousing.titleDocument}}</h3>
                            <rich-text-preview :content="ruralHousing.descriptionDocument"/>
                        </div>
                        <div class="img fix-button" @mouseenter="isHoverD = true;" @mouseleave="isHoverD = false;">
                            <img :src="getImgURL(ruralHousing.urlAtchDocument)" @click="$router.push({name:'LibraryView', params:{id:ruralHousing.idDocument}})">
                            <div class="fix" style="text-align:right"><sipsder-btn btnType="uploadImage" variant="primary" :text="$t('topic.ruralHousing.edit_audiovisual')" @onClick="showModal('addImageModal2', 1)" v-if="isAdministrator && isHoverD"></sipsder-btn></div>
                        </div>   
                    </div>
                    <div class="body-grid">
                        <div>
                            <div class="manual-grid" v-if="isAdministrator">
                                <h3>{{ruralHousing.titleBookGuide}}</h3>
                                <div v-if="isAdministrator" style="text-align: right;">
                                    <sipsder-btn btnType="edit_pen" @onClick="$router.push({ name: 'CommunityCreateDocument', params:{id: ruralHousing.idBookGuide}})" text=""></sipsder-btn>
                                </div>
                            </div>
                            <h3 v-else>{{ruralHousing.titleBookGuide}}</h3>
                            <rich-text-preview :content="ruralHousing.descriptionBookGuide"/>
                        </div>
                        <div class="img fix-button" @mouseenter="isHoverG = true;" @mouseleave="isHoverG = false;">
                            <img :src="getImgURL(ruralHousing.urlAtchBookGuide)" @click="$router.push({name:'LibraryView', params:{id:ruralHousing.idBookGuide}})">
                            <div class="fix" style="text-align:right"><sipsder-btn btnType="uploadImage" variant="primary" :text="$t('topic.ruralHousing.edit_audiovisual')" @onClick="showModal('addImageModal2', 2)" v-if="isAdministrator && isHoverG"></sipsder-btn></div>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="grid-buttons">
                <div class="button color1">
                    <img src="../../../../assets/icons-button-svg/viviendabtn1.svg" alt="" @click="$router.push({name:'PrototypesIndex'})">
                    <div class="alt">{{ $t('topic.ruralHousing.prototypes') }}</div>
                </div>
                <div class="button color2">
                    <img src="../../../../assets/icons-button-svg/viviendabtn2.svg" alt="" @click="$router.push({name:'RuralIndicatorIndex', query: {housing: true} })">
                    <div class="alt">{{ $t('topic.ruralHousing.indicators') }}</div>
                </div>
                <div class="button color3">
                    <img src="../../../../assets/icons-button-svg/viviendabtn3.svg" alt="" @click="$router.push({name:'ProcedureIndex', query: {housing: true} })">
                    <div class="alt">{{ $t('topic.ruralHousing.subsity_n_procedures') }}</div>
                </div>
                <div class="button color4">
                    <img src="../../../../assets/icons-button-svg/viviendabtn4.svg" alt="" @click="$router.push({name:'ProyectToolProyectIndex', params:{ruralModelsId : ruralHousing.idRuralModels}, query: {housing: true}})">
                    <div class="alt">{{ $t('topic.ruralHousing.projects') }}</div>
                </div>
                <div class="button color5">
                    <img src="../../../../assets/icons-button-svg/viviendabtn5.svg" alt="" @click="$router.push({name:'NormogramIndex', query:{housing: true}})">
                    <div class="alt">{{ $t('topic.ruralHousing.norms') }}</div>
                </div>
                <div class="button color6">
                    <img src="../../../../assets/icons-button-svg/viviendabtn6.svg" alt="" @click="$router.push({name:'CommunityStoryIndex', query: {housing: true} })">
                    <div class="alt">{{ $t('topic.ruralHousing.testimonies') }}</div>
                </div>
            </div>
            <div class="tabs">
              <div class="A">
                  <div class="tab-design" :class="{active : tabIndex==0 }" @click="tabIndex=0"><div><span>{{$t( 'topic.ruralHousing.listEvents' )}}</span></div></div>
                  <div class="tab-design" :class="{active : tabIndex==1 }" @click="tabIndex=1"><div><span>{{$t( 'topic.ruralHousing.general' )}}</span></div></div>
                  <div class="tab-design" :class="{active : tabIndex==2 }" @click="tabIndex=2"><div><span>{{$t( 'topic.ruralHousing.listGeo' )}}</span></div></div>
              </div>
              <div v-if="tabIndex==0" class="B map-index">
                <div style="text-align: right; margin-right: 15px;"><sipsder-btn btnType="edit_pen" :text="$t('topic.ruralHousing.edit_events')" @onClick="$router.push({ name: 'TimeLineAdmin'})" v-if="isAdministrator"></sipsder-btn></div>
                  <div style="text-align: left; margin-left: 15px;">
                      <b-form-group :label-cols="4" label-class="font-weight-bold" label="&nbsp;">
                      <b-form-checkbox id="checkbox1" :value="1" :unchecked-value="0" @change="onlyContestChange" v-model="onlyContest">
                          <b>{{ $t('topic.ruralHousing.only_contest_related') }}</b> 
                      </b-form-checkbox>
                      </b-form-group>
                  </div>
                <div class="timeline" v-if="selectedEvent">           
                    <!-- // Vertical Timeline -->
                    <div class="grid-timeline">
                    <div>
                      
                        <div class="grid-events">
                            <div class="title"></div>
                            <div class="eventItems" v-for="(v, i) in filteredEvents" :key="i" @click="selectedEvent=v" :class="{active : v.id == selectedEvent.id}"><div class="dateBox" v-if="v.vanilaDate" >{{getDate(v.vanilaDate)}}</div><div class="infoBox">{{String("0" + (i+1)).slice(-2)}} - {{v.event}}</div></div>
                            <div class="title"></div>
                        </div>
                    </div>
                    <div class="events-detail" v-if="selectedEvent != undefined">
                        <div class="title">{{selectedEvent.event}}<hr></div>
                        <div class="image" v-if="selectedEvent.images.length>0">
                        <div v-if="selectedEvent.images[index].type=='Video'">
                            <iframe :src="selectedEvent.images[index].url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div v-else>
                            <img :src="getImgURL(selectedEvent.images[index].url)">
                        </div>
                        <button class="button previmg" @click="prevImg()" v-if="selectedEvent.images.length>1 && index!=0"><i class="fas fa-caret-left"></i></button>
                        <button class="nextimg" @click="nextImg()" v-if="selectedEvent.images.length>1 && index!=selectedEvent.images.length-1"><i class="fas fa-caret-right"></i></button>
                        </div>
                        <div class="dateItem" v-if="selectedEvent.vanilaDate"><hr> {{getDate(selectedEvent.vanilaDate)}}</div>
                        <rich-text-preview class="description" :content="selectedEvent.description"/>
                        <div v-if="selectedEvent.contestState == true" style="margin-top:25px; text-align: center;">
                            <h2 @click="goToContestDetail"><router-link to="">{{ $t('topic.ruralHousing.view_contest') }}</router-link></h2>
                        </div>
                        
                    </div>
                    </div>
                </div>
              </div>
              <div v-if="tabIndex==1" class="B map-index">
                  <div v-if="isAdministrator">
                        <sipsder-btn btnType="edit_pen" :text="$t('topic.ruralHousing.edit_description')" @onClick="isEditGeneral = true" v-if="!isEditGeneral"></sipsder-btn>
                        <sipsder-btn btnType="cancel" @onClick="unSetEdit2" v-if="isEditGeneral"></sipsder-btn>
                        <sipsder-btn :text="$t('button.save')" btnType="add" @onClick="update(ruralHousing)" v-if="isEditGeneral"></sipsder-btn>
                    </div>
                    <rich-text-preview :content="ruralHousing.general" class="text" v-if="!isEditGeneral"/>
                    <rich-text :options="customToolbar" @changeValue="changeValueGeneral" :newContent="ruralHousing.general" v-else style="overflow: auto;"></rich-text>
              </div>
              <div v-if="tabIndex==2" class="B map-index p-5">
                <b-row>
                  <b-col>
                    <h3>{{ $t('topic.ruralHousing.filter_search') }}</h3>
                  </b-col>
                </b-row>
                <map-index
                  v-if="ruralHousing.mapIds && ruralHousing.mapIds.length" 
                  :ids="ruralHousing.mapIds"
                  @selected="onMapSelect" />
                <span v-else>{{ $t('topic.ruralHousing.no_maps') }}</span>
              </div>
            </div>
            
            <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>
        </div>

        <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions"></audiovisualmedia>
        </b-modal>
        <b-modal ref="addImageModal2" id="addImageModal2"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
            <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true"  :media-options="mediaOptions2"></audiovisualmedia>
        </b-modal>
    </div>
</template>

<script>
import RichText from '../../../shared/RichText.vue'
import RichTextPreview from '../../../shared/RichTextPreview'
import MapIndex from '@/components/shared/arcgis/MapIndex'
import Audiovisualmedia from '../../audiovisual_media/AudioVisualIndex.vue';
import { PERMISSIONS_TYPES, ATTACHMENT_TYPE} from '../../../../domain_constants'
import VAPI from '../../../../http_common';
import { SERVICE_NAMES} from '../../../../sipsder_constants';
import _ from 'lodash';
import moment from 'moment';
import S_UTIL from "../../../../util/sipsder_util";

export default {
     components:{
        RichText,
        RichTextPreview,
        Audiovisualmedia,
        MapIndex,
    },
    data(){
        return{
            tabIndex: 0,
            ruralHousing:null,
            isEditDescription: false,
            isEditGeneral: false,
            media: null,
            isHoverD: false,
            isHoverG: false,
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
             mediaOptions2: [
                {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
            ],
            index: 0,
            events: [],
            filteredEvents: [],
            selectedEvent:{},
            onlyContest: 0
        }
    },
    async beforeMount(){
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_HOUSING}`);
            this.formatRuralFigures(response.data);
            this.ruralHousing = response.data;
        }
        catch( error ) {
            console.log( 'Error fetching rural housing', error );
        }
        try{
            let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_HOUSING}/timeline-list`);
            this.events = response.data.data;
            this.filteredEvents = response.data.data;
            this.selectedEvent = this.events[0]
        }
        catch( error ) {
            console.log( 'Error fetching event housing', error );
        }
    },
    computed:{
        isAdministrator() {
            let isAdmin = false;
            if (this.$store.getters.isAuthenticated)
                if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                isAdmin = true     
            return isAdmin;
        },

    },
    methods:{
        onlyContestChange(){
          if(this.onlyContest === 0) {
            const filtered = this.events.filter(el=> ( el.contestState === true ))
            this.filteredEvents = filtered;
            this.selectedEvent = filtered[0];
          }
          else {
            this.filteredEvents = this.events;
            this.selectedEvent = this.events[0]
          }
        },
        getImgURL (url) {
          return S_UTIL.getImgURL(url);
        },
        goToContestDetail() {
          this.$store.dispatch('setContestId', this.selectedEvent.idContest);
          this.$router.push({ name: "ContestDetail" });
        },
        async reloadRuralHousing(){
            try{
                let response = await VAPI.get(`/${SERVICE_NAMES.RURAL_HOUSING}`);
                this.formatRuralFigures(response.data);
                this.ruralHousing= response.data;
            }
            catch( error ) {
                console.log( 'Error fetching rural housing', error );
            }
        },
        update(data){
            VAPI.put(`/${SERVICE_NAMES.RURAL_HOUSING}`, data).then((output)=>{
                this.unSetEdit()
                this.unSetEdit2()
            }).catch((e)=>{
                alert("Error editando Vivienda rural.") // TODO: Alert refactor
                console.log("Error editando Vivienda rural.", e)
            })
        },
        changeValueDescription(value){
            this.ruralHousing.description = value
        },
        changeValueGeneral(value){
            this.ruralHousing.general = value
        },
        unSetEdit(){
            this.isEditDescription = false
            this.reloadRuralHousing()
        },
        unSetEdit2(){
            this.isEditGeneral = false
            this.reloadRuralHousing()
        },
        showModal(ref, media){
            this.$refs[ref].show();
            this.media = media
        },
        closeModal(ref){
            this.$refs[ref].hide();
        },
        created_image(response){
            let image = _.find(this.eventAttach, { 'id': response[0]});
            if(!image){
                if(this.media==0){
                    this.closeModal('addImageModal')
                    this.ruralHousing.idAtchDescription=response[0]
                    this.ruralHousing.urlAtchDescription=response[1]
                    this.ruralHousing.typeAtchDescription=response[2]
                }
                else if(this.media ==1){
                    this.closeModal('addImageModal2')
                    this.ruralHousing.idAtchDocument=response[0]
                    this.ruralHousing.urlAtchDocument=response[1]
                    this.update(this.ruralHousing)
                }
                else if(this.media ==2){
                    this.closeModal('addImageModal2')
                    this.ruralHousing.idAtchBookGuide=response[0]
                    this.ruralHousing.urlAtchBookGuide=response[1]
                    this.update(this.ruralHousing)
                }
                
            }
      },
      nextImg(){
        if((this.index+1)>=(this.selectedEvent.images.length-1)){
            this.index=this.selectedEvent.images.length-1
        }
        else{
            this.index++
        }
      },
      prevImg(){
        if((this.index-1)<=0){
            this.index=0
        }
        else{
            this.index--
        }
      },
       getDate:function(date){
           let dateBreak = new Date(date)
        let newDate = dateBreak.getDate() + " " + this.$t( 'util.months.'+ String("0" + (dateBreak.getMonth()+1)).slice(-2) ) + " " + dateBreak.getFullYear() 
        return newDate
      },
      formatRuralFigures(ruralHousing) {
        ruralHousing.mapIds = ruralHousing.ruralFigures
          .map(ruralFigure => ruralFigure.map.url);
        const obj = {}
        ruralHousing.ruralFigures
          .forEach(ruralFigure => {
            obj[ruralFigure.map.url] = ruralFigure
          });
        ruralHousing.ruralFigDict = obj;
      },
      onMapSelect(map) {
        const figure = this.ruralHousing.ruralFigDict[map.id];
        if (figure.indicator) {
          this.$router.push({ name: 'RuralIndicatorDetail', params: { id: figure.indicator.id }});
        } else {
          this.$router.push({ name: 'RuralFigureDetail', params: { id: figure.id }});
        }
      },
    }
}
</script>

<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../assets/title/barra_sola_4.png)
  background-repeat: no-repeat
  background-size: 100% 100%
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
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
    background: rgba(255,255,255,.8)
.general
    margin-bottom: 15px
    padding-bottom: 20px
    border-right: 3px solid
    border-image-source: linear-gradient(0deg, transparent 0%, $colorTitle 50%, transparent 100%)
    border-image-slice: 1
    .text
        margin-bottom: 15px
        max-height: 110px
        overflow-y: auto
    .img
        text-align: center
        img
            width: 90%
            border: 3px solid $colorTitle
            max-height: 400px
        iframe
            width: 90%
            border: 3px solid $colorTitle
            height: 400px
.grid-buttons
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 40px
    .button
        padding: 10px
        text-align: center
        overflow: hidden
        margin-right: calc(20vw / 5)
        height: calc(70vw / 6)
        width: calc(80vw / 6)
        border: 4px solid
        border-image-slice: 1
        cursor: pointer
        transition: all .2s ease-in-out
        position: relative
        .control
          width: 100%
          height: 100%
          position: absolute
          top: 0
          left: 0
          opacity: 0
          &:hover
            opacity: 100
        img
            height: 60%
            transition: all .2s ease-in-out
        .alt
            font-size: 1.4rem
            margin-top: 10px
            font-weight: bold
            transition: all .2s ease-in-out
        &:hover
            transform: scale(0.95)
            img
                height: 100%
            .alt
                opacity: 0
        &:last-child
            margin-right: 0px
        &:before
    .color1
        border-image-source: linear-gradient(45deg, #64b66e, #b2dbb7);
    .color2
        border-image-source: linear-gradient(45deg, #184f78, #38929a);
    .color3
        border-image-source: linear-gradient(45deg, #88a80d, #c3d386);
    .color4
        border-image-source: linear-gradient(45deg, #f7931e, #f9d10b);
    .color5
        border-image-source: linear-gradient(45deg, #f6b900, #f9d35e);
    .color6
        border-image-source: linear-gradient(45deg, #29abe2, #4fb7e3);
.manual-grid
    display: grid
    grid-template-columns: 54% 45%
    grid-gap: 1%
.fix-button
    position: relative
    .fix
        position: absolute
        right: 5px
        bottom: 2px
.body-grid
    display: grid
    grid-template-columns: 42% 52%
    grid-gap: 4%
    padding-bottom: 20px
    margin: 15px 0
    .img
        max-height: 250px
        overflow: hidden
        text-align: center
        img
            height: 97%
            width: 97%
            max-height: 250px
            border: 3px solid $colorTitle
            cursor: pointer
.tabs
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 70px auto
  min-height: 600px
  .A
    margin-left: 15px
    display: inline-flex
  .B
    margin-top: -10px
    background: #fff
    z-index: 3
    border: 3px solid $colorTitle
    .img-contain
      position: relative
      padding: 15px
      overflow: hidden
      img
        width: 100%
        max-height: 700px
      .control
        width: 98%
        position: absolute
        top: 15px
        left: 15px
        opacity: 0
        &:hover
          opacity: 100
      

.tab-design  
  margin-bottom: 10px !important
  transform: rotate(3deg)
  max-width: 50%
  margin-right: 20px
  font-size: 1.34rem
  div
      cursor: pointer
      width: 105%
      background: $colorTitle
      color: white
      border-radius: 10px
      min-height: 70px
      padding: 10px 3.5em 14px 1em
      span
          display: block
          transform: rotate(-4deg)
  &.active
      div
          box-shadow: 0px 0px 3px #555
          background: $colorTitleDark
          color: white
          border-color: unset
          transition: 0.5s
  &:hover
      div
          box-shadow: 0px 0px 3px #555
@media screen  and (max-width: 1280px)
  .grid-buttons
      .button
          img
              height: 50%
              transition: all .2s ease-in-out
          .alt
              font-size: 1.2rem

@media screen  and (max-width: $widthTablet)
  .grid-buttons
      .button
          img
              height: 50%
              transition: all .2s ease-in-out
          .alt
              font-size: 1.2rem
  .tab-design 
      font-size: 1.2rem !important
@media screen  and (max-width: $widthMobile)
  .grid-buttons
      .button
          padding: 6px 1px 0 1px
          img
              height: 40%
              transition: all .2s ease-in-out
          .alt
              font-size: 1rem
  .tab-design 
      font-size: 1.0rem !important
@media screen  and (max-width: 1720px)
  .infoBox:before
    content: none !important
    display: none !important
@media screen  and (max-width: 1280px)
  .grid-timeline
      grid-template-columns: 1fr !important
      .grid-events
        max-height: 200px !important

@media screen  and (max-width: 800px)
  .grid-timeline
      grid-template-columns: 1fr !important
      .grid-events
        max-height: 200px !important
        .eventItems
          .dateBox
            font-size: 12px
          .infoBox
            font-size: 12px
            margin-left: 0 !important
            padding-left: 9px !important
            padding-top: 9px !important
            overflow: hidden
      .events-detail
        .image
          min-height: 100px !important
          div
            height: auto !important
            min-height: 100px !important
            img
              width: 100%
              height: auto !important
          .previmg
            left: -10px !important
          .nextimg
            right: -10px !important
.timeline
  width: 100%
  font-size: 18px
*, *:before, *:after 
  box-sizing: border-box
.active
  .infoBox
    background: $colorTitle
    color: #ffffff
    transition: 0.5s
.grid-timeline
  display: grid
  grid-template-columns: 1fr 1fr
  background-color: #ffffff
  border-radius: 5px
  padding: 30px
  .grid-events
    //display: grid
    //grid-template-columns: 1fr
    max-height: 850px
    overflow-y: auto
    .title
      background: $colorTitle
      color: #ffffff
      padding: 15px
      text-align: center
      width: 5em
      height: 5em
      border-radius: 5em
      border-radius: 3em
    .eventItems
      margin-left: 2.5em
      border-left: 5px solid $colorTitle
      padding: 15px 0 15px 15px
      margin-top: -5px
      margin-bottom: -5px  
      display: grid
      grid-template-columns: 20% 70%
      .dateBox
        display: inline-block
        width: 5em
        height: 5em
        border-radius: 5em
        margin-left: -3.5em
        background: $colorTitle
        color: #ffffff
        text-align: center
        padding-top: 1em
      .infoBox
        cursor: pointer
        display: inline-block
        height: 5em
        padding-top: 1.5em
        padding-left: 30px
        margin-left: -3em
        border-radius: 3em
        box-shadow: 0px 0px 3px
        &:before
          content: ""
          position: relative
          display: inline-block
          width: 0px
          height: 0px
          border-top: 10px solid transparent
          border-bottom: 10px solid transparent
          border-left: 10px solid $colorTitle
          border-radius: 5px
          left: -60px
        &:hover
          background: $colorTitle
          color: #ffffff
          transition: 0.5s
  .events-detail
    height: 100%
    align-self: center
    overflow-y: auto 
    padding: 0 1rem
    .title
      text-align: center
      font-size: 24px
      color: $colorTitle
      padding: 15px
      font-weight: bold
    .image
      min-height: 300px
      padding: 15px
      position: relative
      div
        width: 90%
        height: 300px
        min-height: 300px
        margin: 0 auto
        text-align: center
        img
          height: 100%
          margin: 0 auto
        iframe
          width: 100%
          height: 300px
          margin: 0 auto
      button
        background: transparent
        border: 3px solid $colorTitle
        border-radius: 3px
        font-size: 24px
        color: $colorTitle
        font-weight: bold
      .previmg
        position: absolute
        left: 10px
        top: 0
        height: 100%
        border-right: 1px solid transparent
      .nextimg
        position: absolute
        right: 10px
        top: 0
        height: 100%
        border-left: 1px solid transparent

    .dateItem
      text-align: center
      padding: 15px
    .description
      text-align: justify
      padding: 15px
      height: 300px
      overflow-y: auto

.map-index
  background: rgba(250, 250, 250, 0.8)
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem
@media screen  and (max-width: $widthTablet)
    .col-90
        width: 80% !important
    .grid-image
        grid-template-columns: 100% !important
    .tab-design 
        font-size: 0.8rem !important
    .manual-grid
      grid-template-columns: 100% !important
    .general
      border-right: unset !important
      border-image-source: unset !important
      border-image-slice: unset !important
    .grid-buttons
      display: grid !important
      grid-template-columns: 1fr 1fr 1fr
      grid-gap: 5px
      .button
        height: 100px !important
        width: 100px  !important
    .map-index
       padding: 5px !important
@media screen  and (max-width: $widthMobile)
    .tabs
        grid-template-rows: unset !important
        .A
            display: flex !important
            flex-wrap: wrap
            width: 100%
            margin-left: 0 !important
        .B
           width: 100%
    .tab-design  
        height: 70px !important
        max-width: unset !important
        margin: 5px
        width: 40%
        div
            height: 70px !important
            span
                height: 70px !important
    .col-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important


</style>

<style scoped>
@import '../../../../stylesheets/style.sass';

.timeline{
  width: 100%;
}
  *, *:before, *:after {
  box-sizing: border-box;
}


/*===== Vertical Timeline =====*/
.container-timeline {
  width: 100%;
  background: #e6e6e6;
  display: flex;
  justify-content: left;
  align-items: left;
  align-content: flex-start;
  flex-wrap: wrap;
  position: relative;
}


.information-container {
	display: flex;
	justify-content: left;
	align-items: left;
	width: 100%;
	position: relative;
}

.information-container i {
	position: absolute;
	left: 73.5%;
    top: -2%;
	font-size: 1.5rem;
	cursor: pointer;
	
}

.information-container i:hover {
	color: red;
	
}

.information {
	background: #e6e6e6;
	font-size: 1.2rem;
	width: 50%;
	color: white;
	font-weight: bold;
	text-align: center;
	padding: 2.5%
}


.container-timeline .timeline-line {
  position: absolute;
  width: 3px;
  height: 100%;
  top: 0;
  left: 3%;
  margin-left: -2px;
  background: #00b0bd;
  z-index: 2;
	
}

.timeline-content {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-items: left;
}

.row-timeline {
	margin-top: 2.5%;
	margin-bottom: 2.5%;
	width: 50%;
	justify-content: flex-start;
	align-items: left;
	display: flex;
	flex-wrap: nowrap;
	position: relative;
}

.content {
   cursor: pointer;
   display: flex;
   justify-content: flex-start;
   align-items: left;
  
   
}

.content .number {
    height: 150px;
	width: 30%;
	color: #00b0bd;
	font-size: 2.5rem;
	background: white;
	display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in;
    border-radius: 60px 0 0 60px;
    
}

.content .title-timeline {
   height: 150px;
   color: black;
   width: 70%;
   font-size: 1.2rem;
   background: white;
   display: flex;
   justify-content: flex-start;
   align-items: center;
   transition: all 1s ease-in;
   border-radius: 0 60px 60px 0;
   
}

.number.selected {
	background: #00B84D !important;
}
.title-timeline.selected {
	background: #00B84D !important;
}

.row-timeline .content {
	width: 80%;
	padding: 5.5% 0;
	
}

.date {
	top: 25%;
	left: 100%;
	margin-left: 50px;
	background: #00b0bd;
	width: 100px;
    height: 100px;
    border-radius: 50%;
    color: white;
	display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    position: absolute;
    z-index: 2;
}

.row-timeline {
	align-self: flex-end;
	justify-content: flex-end;
} 

.row-timeline .content {
	margin-right: 5.5%;	
} 

.row-timeline .content:after {
	right: 85.5%;
	top: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(255, 255, 255, 0);
	border-right-color: #ffffff;
	border-width: 15px;
	margin-top: -15px;
}

.row-timeline .date {
	left: 0%;
	margin-left: -50px;
} 


.container-timeline .title {
	width: 25%;
	text-align: center;
	font-size: 2.5rem;
	background: #00b0bd;
	color: white;
	padding: 2%;
	font-weight: 600;
	z-index: 2;
	
}

.portlet-header {
	display: none;
}

@media only screen and (max-width: 800px) {
  .row-timeline .content {
	width: 70%;
	padding: 5.5% 0;
  }
  
  .row-timeline:nth-child(2n + 1) .content:after {
	left: 75.5%;
  }
  
  .row-timeline:nth-child(2n) .content:after {
	right: 75.5%;
  }
  .content .number {
    height: 250px;
    font-size: 2.0rem;
    
  }

  .content .title-timeline {
    height: 250px;
   
  }
  .date {
  	top: 33%
  }
	
}

@media only screen and (max-width: 400px) {
    /*===== Vertical Timeline =====*/
  .container-timeline {
    justify-content: flex-end;
  }


  .information-container i {
    left: 93.5%
  }

  .information {
    font-size: 2.0rem;
    width: 100%;
  }


  .container-timeline .timeline-line {
    left: 100%;	
  }

  .row-timeline {
    width: 100%;
  }


  .content .number {
      height: 250px;
      display: none;    
      
  }

  .content .title-timeline {
    height: 250px;
    width: 100%;
    border-radius: 60px
    
  }

  .row-timeline .content {
    width: 75%;
    padding: 5.5% 0;
    
  }

  .date {
    top: 35%;
    left: 100%;
    width: 75px;
    height: 75px;
  }


  .row-timeline:nth-child(2n + 1) {
    align-self: flex-start;
  }

  .row-timeline:nth-child(2n + 1) .content:after {
    content: none;
  }

  .row-timeline:nth-child(2n + 1) .content {
    margin-left: 2.5%;
    margin-right: 0%;
  } 

  .row-timeline:nth-child(2n + 1) .date {
    margin-right: -50px;
  } 

  .row-timeline:nth-child(2n) {
    align-self: flex-start;
    justify-content: flex-start;
  } 

  .row-timeline:nth-child(2n) .content {
    margin-left: 2.5%;
    margin-right: 0%;	
  } 

  .row-timeline:nth-child(2n) .content:after {
    content: none;
  }


  .row-timeline:nth-child(2n) .date {
    left: 100%;
    margin-left: -50px;
  } 


  .container-timeline .title {
    width: 50%;
    
  }

}

</style>
