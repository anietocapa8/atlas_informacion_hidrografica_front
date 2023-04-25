<template>
  <div class="news-add-container container-form">
    <sipsder-title :title="$t('calendar.title')"
    type="admin" :text="$t('event.message')"></sipsder-title>
    <div class="w-100 center">
      <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.index.title_modal')" hide-footer>
        <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="true" v-if="show"
        :media-options="mediaOptions"
        :message="message"></audiovisualmedia>
      </b-modal>
      
      <b-modal ref="returnNews" size="md" :title="$t('util.modals.back.title')" centered hideFooter>
        <b-row>
            <b-col class="alert-msg d-flex justify-content-center">
                {{$t('util.modals.back.text')}}
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                
                <sipsder-btn  btnType="accept" @onClick="$router.go(-1)">
                </sipsder-btn>

            </b-col>
            <b-col class="text-left">

                <sipsder-btn btnType="cancel" @onClick="closeModal('returnNews')">
                </sipsder-btn>

            </b-col>
        </b-row>
      </b-modal>
       <b-modal ref="invalid" :title="$t('registration.warning')"        
        hideFooter
        >
          <b-row class="w-100 center">
            <div class="w-75">
              {{$t('event.modal.invalid')}}
            </div>
            <b-row>
            <b-col class="text-center">
              <sipsder-btn
                @onClick="closeModal('invalid')"
                btnType="accept" title="Entendido"
              ></sipsder-btn>
            </b-col>
          </b-row>
          </b-row>
      </b-modal>
      <b-modal ref="eventCreation" :title="$t('registration.warning')"
        :hide-header-close="true" hideFooter
      >
          <b-row class="w-100 center">
            <b-col>
              <div class="w-75">
                {{modalMessage}}
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center">
              <sipsder-btn
                @onClick="$router.push({
                  name: 'CalendarIndex'
                })"
                btnType="accept" title="Entendido"
              ></sipsder-btn>
            </b-col>
          </b-row>
      </b-modal>
      <b-modal ref="saveNews" :title="$t('registration.warning')"
        :hide-footer="true">
          <b-row class="w-100 center">
            <div class="w-75">
              {{$t('event.modal.verification')}}
            </div>
            <div class="w-75">
              <b-form-group
              :label="'Justificación'+asterisk"
              label-class="font-weight-bold">
            </b-form-group>
              <textarea class="w-100" rows="5" v-model="justification"></textarea>
            </div>
            <span class="error mg-top-10" v-if="justification.length  < 3">{{$t('event.validation.justification')}}</span>
            <div class="w-100 center mg-top-10">
              <b-button class="w-50" @click="saveEventRequest('saveNews')">Aceptar</b-button>
            </div>
            
          </b-row>
      </b-modal>
      <b-modal ref="editEvent" :title="$t('registration.warning')"
        :hide-footer="true">
          <b-row class="w-100 center">
            <div class="w-75">
              {{$t('event.modal.edit_verification')}}
            </div>
            <div class="w-75">
              <b-form-group
              :label="$t('calendar.summary_of_changes')+asterisk"
              label-class="font-weight-bold">
            </b-form-group>
              <b-form-textarea class="w-100" rows="5" v-model="justification"></b-form-textarea>
            </div>
            <span class="error mg-top-10" v-if="justification.length  < 3">{{$t('event.validation.justification')}}</span>
            <div class="w-100 center mg-top-10">
              <b-button class="w-50" @click="saveEventRequest('editEvent')">{{$t('button.accept')}}</b-button>
            </div>
            
          </b-row>
      </b-modal>
    </div>
    <!-- <div class="w-100 message">
      {{$t('event.message')}}
    </div> -->
    <div class="event-container">
      <div class="w-50" v-if="event != null && showStatus">
        <b-form-group
          :label="$t('event.status')+asterisk"
          label-class="font-weight-bold">
        </b-form-group>
        <b-form-select v-model="status" :options="statusEvent"
        @change="statusChange" />

      </div>
      <div class="w-50" v-if="event != null && isAdmin">
        <b-form-group
          :label="$t('event.user')"
          label-class="font-weight-bold"
          class="mg-left">
          <b-form-input  type="text" class="w-100"  :disabled="true" :value="`${event.event.user.firstName} ${event.event.user.lastName}`"></b-form-input>
        </b-form-group>

      </div>
      <div class="mg-top-10 w-100" v-if="event != null && (status === rejected || status === disabled)">
        <b-form-group
          :label="$t('event.motive')"
          label-class="font-weight-bold">
        </b-form-group>
        <b-form-textarea cols="15" rows="5" class="w-100" 
          maxlength="250" v-model="motive"
        ></b-form-textarea>
      </div>
    </div>
    <div class="mg-top-10 w-100">
      <b-form-group
        :label="$t('event.name')+asterisk"
        label-class="font-weight-bold">
        <b-form-input type="text" v-model="name" class="w-100"
          v-validate="'required|min:3'" name="name" :data-vv-as="$t('event.name')"></b-form-input>
      </b-form-group>
      
      <span class="error">{{ errors.first('name') }}</span>
    </div>
    <div class="mg-top-10 w-100 picker">
      <b-form-group
        :label="$t('event.time')"
        label-class="font-weight-bold">
      </b-form-group>
       <el-date-picker
        v-model="range"
        type="datetimerange"
        range-separator="-"
        start-placeholder="Inicio"
        end-placeholder="Fin"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <div class="mg-top-10 w-100">
      <b-form-group
        :label="$t('event.entity')+asterisk"
        label-class="font-weight-bold">
        <div class="w-100 center">
          <vue-bootstrap-typeahead
            :data="entities"
            v-model="entitySearch"
            class="w-100"
            :serializer="s => s.name"
            :placeholder="$t('calendar.placeholder_entity')"
            @hit="selectedEntity = $event"
          ></vue-bootstrap-typeahead>
          <sipsder-btn btnType="add" text="" @onClick="addNewEntity"></sipsder-btn>
        </div>
        
      </b-form-group>
      <span class="error" v-if="entitiesNew.length  === 0">{{$t('event.validation.entity')}}</span>

    </div>
    <div class="w-100 center" v-if="entitiesNew.length > 0">
      <div class="w-50 grey">{{$t('event.entity')}}</div>
      <div class="w-25 grey">{{$t('event.principal')}}</div>
      <div class="w-25 grey">
        {{$t('event.actions')}}
      </div>
    </div>
    <div class="w-100 multiple" v-for="(v,i) in entitiesNew" :key="i">
      <div class="w-50" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
        {{entitiesNew[i]}}
      </div>
      <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
        <b-form-checkbox v-model="entitiesNewPrincipal[i]" 
        :disabled="entitiesNewPrincipal[i]"
        @input="changeEntityPrincipal(i)"/>
      </div>
      <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
        <sipsder-btn btnType="delete" text="" @onClick="deleteNewEntity(i)"></sipsder-btn>
      </div>
    </div>
    <div class="mg-top-10 w-100 center">
       <div class="w-50">
          <div class="mg-top-10 w-100">
              <b-form-group
                :label="$t('event.place')+asterisk"
                label-class="font-weight-bold">
                <b-form-input class="w-90" type="text" v-model="place"
                  v-validate="'required|min:3'" name="place" :data-vv-as="$t('event.place')"
                ></b-form-input>
              </b-form-group>
          </div>
          <span class="error">{{ errors.first('place') }}</span>
       </div>
       <div class="w-50">
          <div class="mg-top-10 w-100">
              <b-form-group
                :label="$t('event.person')+asterisk"
                label-class="font-weight-bold">
                <b-form-input class="w-90" type="text" v-model="personName"
                  v-validate="'required|min:3'" name="person" :data-vv-as="$t('event.person')"
                ></b-form-input>
              </b-form-group>
              
          </div>
          <span class="error">{{ errors.first('person') }}</span>
       </div>
    </div>
    <div class="mg-top-10 w-100 center">
       <div class="w-50">
          <div class="mg-top-10 w-100">
              <b-form-group
                :label="$t('event.phone')+asterisk"
                label-class="font-weight-bold">
                <b-form-input class="w-90" type="text" v-model="phone"
                  v-validate="'required|min:5|numeric'" name="phone" :data-vv-as="$t('event.phone')"
                ></b-form-input>
              </b-form-group>
              
          </div>
          <span class="error">{{ errors.first('phone') }}</span>

       </div>
       <div class="w-50">
          <div class="mg-top-10 w-100">
              <b-form-group
                :label="$t('event.email')+asterisk"
                label-class="font-weight-bold">
                <b-form-input class="w-90" type="text" v-model="email"
                  v-validate="'required|email'" name="email" :data-vv-as="$t('event.email')"
                ></b-form-input>
              </b-form-group>
              
          </div>
          <span class="error">{{ errors.first('email') }}</span>
       </div>
    </div>
    <div class="mg-top-10 w-100">
      <b-form-group
        :label="$t('event.tags')+asterisk"
        label-class="font-weight-bold">
        <tags-input
            name="tags"
            :data-vv-as="$t('event.tags')"
            v-model="tag"
            v-validate="{min: 3}"
            :placeholder="$t('norm.create.form.tags_enter')"
            :tags="tags"
            @tags-changed="newTags => tags = newTags"            
        ></tags-input>
      </b-form-group>
      
    </div>
    <span class="error">{{ errors.first('tags') }}</span>

    <div class="mg-top-10 w-100">
      <b-form-group
        :label="$t('event.locality')+asterisk"
        label-class="font-weight-bold">
        <div class="w-100 center">
          <vue-bootstrap-typeahead
            :data="localities"
            v-model="localitySearch"
            class="w-100"
            :serializer="s => s.name"
            :placeholder="$t('calendar.placeholder_location')"
            @hit="selectedLocality = $event"
          ></vue-bootstrap-typeahead>
          <sipsder-btn btnType="add" text="" @onClick="addNewLocality"></sipsder-btn>
        </div>
        
      </b-form-group>
    </div>
    <span class="error" v-if="localitiesNew.length  === 0">{{$t('event.validation.locality')}}</span>

    <div class="w-100 center" v-if="localitiesNew.length > 0">
      <div class="w-50 grey">{{$t('event.locality')}}</div>
      <div class="w-25 grey">
        {{$t('event.actions')}}
      </div>
    </div>
    <div class="w-100 center" v-for="(v,i) in localitiesNew" :key="v">
      <div class="w-50" :class="{'light': i%2 == 0, 'white': i%2 != 0}">{{v}}</div>
      <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
        <sipsder-btn btnType="delete" text="" @onClick="deleteNewLocality(i)"></sipsder-btn>
      </div>
    </div>
    <div class="mg-top-10 w-100">
       <b-form-group
        :label="$t('event.summary')+asterisk"
        label-class="font-weight-bold">
      </b-form-group>
      <textarea  maxlength="180" v-model="summary" ></textarea>
      <div>Caracteres restantes:{{ (180-summary.length)}}</div>
    </div>
    
    <div class="mg-top-10 w-100">
       <b-form-group
        :label="$t('event.description')+asterisk"
        label-class="font-weight-bold">
      </b-form-group>
      <rich-text :options="customToolbar" @changeValue="changeValue" :newContent="description"></rich-text>
    </div>
    <span class="error" v-if="description.length  === 0">{{$t('event.validation.description')}}</span>

    <div class="mg-top-10 w-100">
       <b-form-group
        :label="$t('event.note')"
        label-class="font-weight-bold">
      </b-form-group>
      <rich-text :options="customToolbar" @changeValue="changeValueNote" :newContent="note"></rich-text>
    </div>

    <div class="mg-top-10 w-100">
      <b-row>
        <b-col>
          <hr class="w-80">
          <s-table-select
              v-model="selectables.ruralTheme"
              :label="$t('event.rural')+asterisk"
              labelSelect="texto"
              :treeselect="true"
              :options="autocomplets.ruralTheme"
              :tableFields="tableFields.ruralTheme"
              :disableBranch="true"
          ></s-table-select>           
        </b-col>
      </b-row>
      <span class="error" v-if="selectables.ruralTheme.length  === 0">
        {{$t('event.validation.rural')}}
      </span>
    </div>
    
    <div class="text mg-top-50">
      <b>{{$t('event.images')}}</b> <span style='color: red'>*</span>
    </div>
    
    <div class="w-100 mg-top-10">
      <sipsder-btn btnType="uploadImage" variant="primary" :text="$t('calendar.upload_img')"
        @onClick="showModal('addImageModal')">
      </sipsder-btn>
      
    </div>
    <span class="error" v-if="newsAttachments.length  === 0">{{$t('event.validation.images')}}</span>
    <template v-if="imageSelected != null">
      <div class="w-100 mg-top-10">
        <template v-if="imageSelected.type == 'Video'">
          <iframe class="w-100" height="450"
            :src="getImgURL(imageSelected.url)">
          </iframe>
          </template>
          <template v-else>
            <img :src="getImgURL(imageSelected.url)" :alt="'Image'" class="w-100" style="height: 450px">
          </template>
      </div>
    </template>
    <!-- <span class="error" v-if="newsAttachments.length === 0">La noticia debe tener mínimo un adjunto</span> -->
    <carousel :perPageCustom="[[480, 1], [768, 2], [1024, 3]]" :navigationEnabled="true">
      <slide v-for="(image, i) in newsAttachments" :key="i">
        <template v-if="image.type == 'Video'">
          <div style="position: relative; width: 150px; height: 150px;" class="center"
          >
            <iframe class="center" style="width: 150px; height: 150px;"
              :src="getImgURL(image.url)"
            >
            </iframe>
            <div class="cover"
              @click="imageSelected = image"
            ></div>
          </div>
        </template>
        <template v-else>
          <img 
          @click="imageSelected = image"
          :src="getImgURL(image.url)" :alt="'Image'" style="width: 150px; height: 150px;">
        </template>
      </slide>
    </carousel>
    <div class="w-100 center">
      <div class="w-30" v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`) && attachments[`${imageSelected.id}`][0]">
        <b-form-radio-group v-model="attachments[`${imageSelected.id}`][1]"
        @input="selectPrincipal">
        <b-form-radio :value="true">{{$t('event.principal')}}</b-form-radio>
        </b-form-radio-group>
      </div>
      <div @click="deleteAttachment(imageSelected)" class="w-30" v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`)">
        
        <div>
          <i class="fas fa-times" ></i>{{$t('event.delete')}}</div>
        </div>
    </div>

    <div class="message">
      {{$t('event.required')}}<span style='color: red'>*</span> {{$t('event.required_two')}}
    </div>

    <div class="w-100 center mg-top-10">
      <sipsder-btn btnType="back" @onClick="showModal('returnNews')"></sipsder-btn>
      <sipsder-btn btnType="accept" :text="text" @onClick="saveEvent"></sipsder-btn>

    </div>

  </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import VAPI from '../../../http_common'
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import RichText from '../../shared/RichText.vue'
import Treeselect from '@riophae/vue-treeselect';
import { Carousel, Slide } from 'vue-carousel';
import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
import moment from 'moment'
import { PERMISSIONS_TYPES, EVENT_STATE, ATTACHMENT_TYPE } from '../../../domain_constants'
import TableSelect from "@/components/shared/TableSelect";
import S_UTIL from "../../../util/sipsder_util";

export default {
  
  data(){
    return {
      pickerOptions: {
        disabledDate (date) {
          const today = new Date()
          const yesterday =  new Date().setTime(today.getTime() - 3600 * 1000 * 24 )
          return date < yesterday
        }
      },
      showStatus: false,
      rejected: EVENT_STATE.REJECTED,
      disabled: EVENT_STATE.PUBLISH_DISABLED,
      modalMessage: "",
      newsAttachmentDeleted: [],
      newsRuralModelDeleted: [],
      newsEntitiesDeleted: [],
      newsGeographyDeleted: [],
      name: '',
      description: '',
      summary: '',
      place: '',
      personName: '',
      tag: '',
      tags: [],
      phone: "",
      email: "",
      message: "",
      mediaOptions: [
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
      ],
      text: this.$t('event.create'),
      asterisk: "<span style='color: red'>*</span>",
      statusEvent: [],
      status: EVENT_STATE.PENDING,
      event: null,
      isEditing: false,
      motive: '',
      range: null,
      entities: [],
      entitySearch: '',
      selectedEntity: null, 
      entitiesNew: [],
      entitiesNewIds: [],
      entitiesNewPrincipal: [],
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
      note: '',
      localities: [],
      localitySearch: '',
      selectedLocality: null,
      localitiesNew: [],
      localitiesNewIds: [],
      ruralModels: [],
      selectedRuralModel: null,
      ruralThematicIds: [],
      ruralThematicPrincipal: [],
      index: 0,
      imageSelected: null,
      newsAttachments: [],
      attachments: {},
      show: false,
      justification: "",
      tableFields: {
        ruralTheme: [
            {
              key: 'structure',
              label: this.$t('document.admin.tableTitles.ruralModel.structure'),
              sortable: true,
            },
            {
              key: 'component',
              label: this.$t('document.admin.tableTitles.ruralModel.component'),
              sortable: true,
            },
            {
              key: 'subComponent',
              label: this.$t('document.admin.tableTitles.ruralModel.subcomponent'),
              sortable: true,
            },
            {
              key: 'status',
              label: this.$t('document.admin.tableTitles.ruralModel.main'),
              sortable: true,
            },
            {
              key: 'actions',
              label: ""
            }
        ],
      },
      autocomplets: {
        ruralTheme: []
      },
      selectables: {
        ruralTheme: []
      },
      oldRuralTheme: null,
    }
  },
  computed: {
    isFormInvalid() {
      return Object.keys(this.veeFields).some(key => this.veeFields[key].invalid);
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN)
    }
  },
  watch: {
    entitySearch: _.debounce(function(entity) { 
      if(entity.length > 0)
        this.getEntities(entity) 
    }, 500),
    localitySearch: _.debounce(function(locality) { 
      if(locality.length > 0)
        this.getLocalities(locality) 
    }, 500),
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    saveEvent(){
      if(!this.isFormInvalid && this.localitiesNewIds.length > 0 && this.description.length > 0 && this.summary.length > 0  && this.entitiesNewIds.length > 0 &&
          this.selectables.ruralTheme.length > 0 && this.newsAttachments.length > 0){
       
        if(this.isEditing){
          if(this.isAdmin)
            this.saveEventRequest("")
          else if(this.event.event.status === EVENT_STATE.PUBLISH)
            this.showModal("editEvent")
          else
            this.saveEventRequest("")
        }else {
           if(this.isAdmin)
            this.saveEventRequest("")
           else
            this.showModal('saveNews')
        }
        
      }else {
        this.showModal('invalid')
      }
    },
    async saveEventRequest(title){
      if(this.justification.length > 0 || this.isAdmin){
        if(title.length > 0)
          this.closeModal(title)
        let dates = []
        if(this.range !== null){
          dates[0] = moment(this.range[0]).valueOf()
          dates[1] = moment(this.range[1]).valueOf()
        }
        let status = EVENT_STATE.PENDING;
        if(this.isAdmin && !this.isEditing)
          status = EVENT_STATE.PUBLISH
        else
          status = this.status;
        
        let tagText = this.tags.map(function(elem){
          return elem.text;
        }).join(",");
        

        let body = {
          routerName: this.$route.name,
          path: this.$route.path,
          status: status,
          name: this.name,
          dates: dates,
          entities: this.entitiesNewIds,
          entitiesPrincipal: this.entitiesNewPrincipal,
          place: this.place,
          person: this.personName,
          phone: this.phone,
          email: this.email,
          tags: tagText,
          localities: this.localitiesNewIds,
          descripcion: this.description,
          summary: this.summary,
          note: this.note,
          attachments: this.attachments,
          motive: this.motive,
          justification: this.justification,
          deletedAttachment: this.newsAttachmentDeleted,
          deletedRuralModel: this.newsRuralModelDeleted,
          deletedEntites: this.newsEntitiesDeleted,
          deletedGeographies: this.newsGeographyDeleted
        }

        if( this.selectables.ruralTheme.length > 0 ) {
          let ruralModelIds = []
          let ruralModelsPrincipal = null;    
          this.selectables.ruralTheme.forEach( ruralTheme => {
            ruralModelIds.push(ruralTheme.id)
            if(ruralTheme.status) {
              ruralModelsPrincipal = ruralTheme.id
            }
          })

          if(ruralModelsPrincipal == null) {
            ruralModelsPrincipal = ruralModelIds[0]
          }
          body.ruralModelIds = ruralModelIds;
          body.ruralModelsPrincipal = ruralModelsPrincipal;

          // Deleted
          if( this.oldRuralTheme != null && this.oldRuralTheme.length > 0 ) {
            this.oldRuralTheme.forEach( old => {
              if( !ruralModelIds.includes(old.id)) {
                body.deletedRuralModel.push(old.id);
              }
            });
          }
        }

        try {
          if(this.isEditing){
            var response = await VAPI.put(`${SERVICE_NAMES.EVENT}/${this.event.event.id}`, body);
            if (response && response.status == HTTP_STATUS.OK){
              this.modalMessage = "El evento fue actualizado exitosamente";
            } else {
              this.modalMessage = "Problemas al actualzar el evento, intente mas tarde o comuniquese con un administrador del sistema.";
            }
            this.showModal('eventCreation')
          }else {
            var response = await VAPI.post(SERVICE_NAMES.EVENT, body);
            if (response && response.status == HTTP_STATUS.OK){
              this.modalMessage = "El evento fue creado exitosamente"
            } else {
              this.modalMessage = "Problemas al crear el evento, intente mas tarde o comuniquese con un administrador del sistema.";
            }
            this.showModal('eventCreation')
          }
        } catch (error) {
          this.modalMessage = "Problemas al crear el evento, intente mas tarde o comuniquese con un administrador del sistema."
          this.showModal('eventCreation')
        }
      }
    },
    created_image(response){
      this.closeModal('addImageModal')
      let image = _.find(this.newsAttachments, { 'id': response[0]});
      if(!image){
        this.newsAttachments.push({
          id: response[0],
          url: response[1],
          type: response[2]
        })
        if(this.newsAttachments.length === 1) {
          this.attachments[""+response[0]] = [true,true]
          this.imageSelected = this.newsAttachments[this.index]
        }else {
          this.attachments[""+response[0]] = [true,false]
        }
      }
    },
    showModal(ref){
      this.show = true
      this.$refs[ref].show();
    },
    closeModal(ref){
      this.show = false
      this.$refs[ref].hide();
    },
    deleteAttachment(image) {
      if(this.isEditing)
        this.newsAttachmentDeleted.push(image.id)
      delete this.attachments[image.id]
      let i = 0
      for (let index = 0; index < this.newsAttachments.length; index++) {
        if(this.newsAttachments[index].id == image.id)
          i = index
      }
      this.newsAttachments.splice(i,1)
      let principal = false
      Object.keys(this.attachments).forEach(a => {
        if(this.attachments[a][1])
          principal = true
      })

      if(!principal && Object.keys(this.attachments).length > 0)
        this.attachments[Object.keys(this.attachments)[0]][1] = true

      if(this.newsAttachments.length > 0){
        this.imageSelected = this.newsAttachments[0]
      }else {
        this.imageSelected = null
      }
    },
    selectPrincipal(checked){
      this.attachments[""+this.imageSelected.id][1] = checked
      let self = this
      if(checked){
        Object.keys(this.attachments).forEach(k => {
          if(k+"" !== ""+this.imageSelected.id){
            this.attachments[""+k][1] = false
          }
        })
      }

    },
    statusChange(){
      if(this.status === EVENT_STATE.PUBLISH) {
        this.motive = ''
      }
    },
    addNewEntity(){
      if(this.selectedEntity !== null){
        const index = this.entitiesNew.length
        this.entitiesNew.push(this.selectedEntity.name)
        this.entitiesNewIds.push(this.selectedEntity.id)
        this.entitiesNew = new Set(this.entitiesNew);
        this.entitiesNew = Array.from(this.entitiesNew);
        this.entitiesNewIds = new Set(this.entitiesNewIds);
        this.entitiesNewIds = Array.from(this.entitiesNewIds);
        this.selectedEntity = null
        this.entities = []
        this.entitySearch = ""
        if(this.entitiesNew.length > index){
          if(index === 0){
            this.entitiesNewPrincipal.push(true)
          }else {
            this.entitiesNewPrincipal.push(false)
          }
        }
      }
    },
    deleteNewEntity(i){
      if(this.isEditing)
        this.newsEntitiesDeleted.push(this.entitiesNewIds[i])
      this.entitiesNew.splice(i, 1);
      this.entitiesNewIds.splice(i, 1);
      this.entitiesNewPrincipal.splice(i,1);
      if(!this.entitiesNewPrincipal.includes(true) && this.entitiesNewPrincipal.length > 0)
        this.entitiesNewPrincipal[0] = true
    },
    changeEntityPrincipal(i){
      if(this.entitiesNewPrincipal[i] ){
        for (let index = 0; index < this.entitiesNewPrincipal.length; index++) {
          this.entitiesNewPrincipal[index] = false
        }
        this.entitiesNewPrincipal[i] = true
      }
      
    },
    async getEntities(entity) {
      let response = await VAPI.get('/' + SERVICE_NAMES.INSTITUTION + `/search?q=${entity}`);
      this.entities = response.data.data
    },
    changeValue(value){
     this.description = value
    },
    changeValueNote(value){
      this.note = value
    },
    async getLocalities(locality){
      let response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}/search?q=${locality}&type=Localidad`);
      this.localities = response.data.data
    },
    addNewLocality(i){
      if(this.selectedLocality !== null){
        this.localitiesNew.push(this.selectedLocality.name)
        this.localitiesNewIds.push(this.selectedLocality.id)
        this.localitiesNew = new Set(this.localitiesNew);
        this.localitiesNew = Array.from(this.localitiesNew);
        this.localitiesNewIds = new Set(this.localitiesNewIds);
        this.localitiesNewIds = Array.from(this.localitiesNewIds);
        this.selectedLocality = null
        this.localities = []
        this.localitySearch = ""
      }
    },
    deleteNewLocality(i){
      if(this.isEditing)
        this.newsGeographyDeleted.push(this.localitiesNewIds[i])
      this.localitiesNew.splice(i, 1);
      this.localitiesNewIds.splice(i, 1)
    },
    findInTree(node, id){
      if (node.id == id) {
          return node;
      }

      var res = null;
      
      for (var idx = 0;node.children && idx < node.children.length; idx++) {
          var nNode = node.children[idx];
          let val = this.findInTree(nNode, id);
          if (val) {
              res = val;
              break;
          }
      }

      return res;
    },
    findRuralModel (rural) {
        if(!rural || !this.autocomplets.ruralTheme)
            return rural;

        let models = [];
        
        rural.forEach(item => {
            this.autocomplets.ruralTheme.forEach(node => {
                let value = this.findInTree(node, item.id);
                if (value){
                  value.status = item.status
                  models.push(value);
                }
                
            });
        })

        return models;
    },
    toRuralFormat(ruralList) {
            
        ruralList.forEach(level1=>{

            // level1.theme = level1.label;
            if (level1.children){
                level1.children.forEach(level2 => {
                    
                    level2.structure = level2.label;
                    if (level2.children){

                        level2.children.forEach(level3 => {
                            level3.structure = level2.label;
                            level3.component = level3.label;

                            if (level3.children){

                                level3.children.forEach(level4 => {
                                    level4.structure = level2.label;
                                    level4.component = level3.label;
                                    level4.subComponent = level4.label;
                                });
                            }
                        });
                    }
                });
            }
        });

        return ruralList;
    },
  },
  async beforeMount(){
    try {
      let path = `/${SERVICE_NAMES.RURAL_MODEL}/tree`
      let response = await VAPI.get( path );
      if (response.status == HTTP_STATUS.OK){
          this.autocomplets.ruralTheme = this.toRuralFormat(response.data.data);
      }
    } catch (error) {
        console.error("Fallo al obtener Modelos rurales", error);
    }
    const responseThree = await VAPI.get(`${SERVICE_NAMES.EVENT}/states`);
    const states = responseThree.data.data

    if(this.$route.params.id){
      let result = await VAPI.get(`${SERVICE_NAMES.EVENT}/${this.$route.params.id}`)
      this.event = result.data.data
      this.status = this.event.event.status
      this.isEditing = true
      if(this.event.event.status === EVENT_STATE.PUBLISH) {
        const publish = states.filter( e => {
          return e.id === EVENT_STATE.PUBLISH
        });
        const disabled = states.filter( e => {
          return e.id === EVENT_STATE.PUBLISH_DISABLED
        });
        this.statusEvent = [
          { value: EVENT_STATE.PUBLISH, text: publish[0].state },
          { value: EVENT_STATE.PUBLISH_DISABLED, text: disabled[0].state}
        ]
        this.showStatus = true
      }
      else if(this.event.event.status === EVENT_STATE.PENDING){
        if(this.isAdmin){
          const publish = states.filter( e => {
            return e.id === EVENT_STATE.PUBLISH
          });
          const pending = states.filter( e => {
            return e.id === EVENT_STATE.PENDING
          });
          const rejected = states.filter( e => {
            return e.id === EVENT_STATE.REJECTED
          });
          this.statusEvent = [
            { value: EVENT_STATE.PENDING, text: pending[0].state},
            { value: EVENT_STATE.REJECTED, text: rejected[0].state},
            { value: EVENT_STATE.PUBLISH, text: publish[0].state },
          ]
          this.showStatus = true
        }else {
          this.showStatus = false
        }
      }else if(this.event.event.status === EVENT_STATE.REJECTED){
        if(this.isAdmin){
          const publish = states.filter( e => {
            return e.id === EVENT_STATE.PUBLISH
          });
          const rejected = states.filter( e => {
            return e.id === EVENT_STATE.REJECTED
          });
          this.statusEvent = [
            { value: EVENT_STATE.REJECTED, text: rejected[0].state},
            { value: EVENT_STATE.PUBLISH, text: publish[0].state },
          ]
          this.showStatus = true
        }else {
          this.showStatus = false
        }
      }
      else if(this.isAdmin) {
        this.showStatus = true
      }else {
        this.showStatus = false
      }
      this.name = this.event.event.name
      this.description = this.event.event.description
      this.summary = this.event.event.summary
      this.place = this.event.event.place
      this.personName =  this.event.event.person
      // this.tags = this.event.event.tags.split(',')
      if (this.event.event.tags) {
          this.event.event.tags.split(",").forEach(tag => {
              this.tags.push({
                  "text": tag,
                  "tiClasses": [
                      "ti-valid"
                  ]
                  });
          });

      } else {
          this.tags = [];
      }
      
      this.phone = this.event.event.contactPhone
      this.email = this.event.event.contactEmail
      this.motive = this.event.event.motive === null ? "": this.event.event.motive
      this.note = this.event.event.notes

      this.range = []
      // fix date offset
      let stDate = new Date(this.event.event.startDate);
      let endDate = new Date(this.event.event.endDate);
      stDate.setTime( stDate.getTime() - stDate.getTimezoneOffset()*60*1000 );
      endDate.setTime( endDate.getTime() - endDate.getTimezoneOffset()*60*1000 );
      this.range.push(stDate)
      this.range.push(endDate)

      this.newsAttachments = []
      this.event.attachments.forEach(a => {
        this.newsAttachments.push({
          id: a.attachment.id,
          url: a.attachment.url,
          type: a.attachment.type.type
        })
        this.attachments[""+a.attachment.id] = [true,a.principal]
      })
      if(this.newsAttachments.length > 0)
        this.imageSelected = this.newsAttachments[0]

      let temporalRuralModels = []
      this.event.models.forEach(m => {
        if(m.principal) {
          m.ruralModel.status = true;
        } else {
          m.ruralModel.status = false;
        }
        temporalRuralModels.push(m.ruralModel);
      })

      this.selectables.ruralTheme = this.findRuralModel(temporalRuralModels);
      this.oldRuralTheme = Object.assign( [], this.selectables.ruralTheme);

      this.event.geographies.forEach(g => {
        this.localitiesNew.push(g.geography.name)      
        this.localitiesNewIds.push(g.geography.id)  
      })
      this.event.institutions.forEach(i => {
        this.entitiesNew.push(i.institution.name)
        this.entitiesNewIds.push(i.institution.id)
        this.entitiesNewPrincipal.push(i.principal)
      })

      this.text = this.$i18n.t( 'event.save')
    }
  },
  components: {
    VueBootstrapTypeahead,
    RichText,
    Treeselect,
    Carousel, 
    Slide,
    Audiovisualmedia,
    "s-table-select": TableSelect,
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
  textarea
    width: 100%
  .news-add-container
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +flex-direction(column)
    padding: 1% 5%
  .mg-left
    margin-left: 5%
  .text
    font-size: 1.2rem
  .error
    color: red
    width: 100%
  .red
    color: red
    font-size: 1rem
  .cover
    width: 150px
    height: 150px
    background: transparent
    position: absolute
    top: 0
    left: 0
  .w-7
    width: 7.5%
  .multiple
    display: flex
    align-items: center
    justify-content: flex-start
  .center
    display: flex
    justify-content: center
    align-items: center
  .mg-top-10
    margin-top: 10px
    margin-bottom: 10px
  .mg-top-50
    margin-top: 50px
    margin-bottom: 10px
  .w-100
    width: 100%
  .w-90
    width: 90%
  .message
    font-size: 1.5rem
  .event-container
    display: flex
    align-items: flex-start
    justify-content: flex-start
    flex-wrap: wrap
    padding: 15px
  .w-50
    width: 50%
  .w-25
    width: 25%
  .grey
    display: flex
    justify-content: center
    background: #A9A9A9
    color: white	
    font-weight: 600
    border-left: 1px solid white
    border-right: 1px solid white
    padding: 5px
  .light
    font-size: 1.2rem
    font-weight: 500
    display: flex
    align-items: center
    height: 60px
    background: #D7F3F4
    color: black	
    border-left: 1px solid white
    border-right: 1px solid white
    padding: 5px
  .white
    font-size: 1.2rem
    display: flex
    align-items: center
    height: 60px
    background: white
    color: black	
    border-left: 1px solid black
    border-right: 1px solid black
    padding: 5px
  @media screen and (max-width: $widthMobile)
    .error
      width: 100% !important
    .red
      font-size: 1.3rem
    .cover
    .w-7
      width: 100% !important
    .multiple
      flex-direction: column
      align-items: center
      justify-content: center
    .center
      flex-direction: column
      align-items: center
      justify-content: center
    .mg-top-10
      margin-top: 10px
    .w-100
      width: 100% !important
    .w-90
      width: 100% !important
    .message
      font-size: 1.5rem
    .event-container
      flex-direction: column
    .mg-left
      margin-left: unset
    .w-50
      width: 100% !important
    .w-25
      width: 100% !important
    .grey
    .light
      justify-content: center
    .white
      justify-content: center
</style>
