<template>
  <div id="audiovisual">
    <b-modal ref="unUsedMedia" :title="$t('audiovisual_media.admin.alert')"
      @ok="deleteUnusedMedia('unUsedMedia')"
      @cancel="closeModal('unUsedMedia')"
    >
        <b-row >
          <b-col cols="12">
            {{$t('audiovisual_media.admin.masive_one')}} {{quantityOfItemsToDelete}} {{$t('audiovisual_media.admin.masive_two')}}
            <br>
            {{$t('audiovisual_media.admin.masive_three')}}
          </b-col>
        </b-row>
    </b-modal>

    <b-modal ref="usedMedia" :title="$t('audiovisual_media.admin.alert')"
      @ok="deleteUsedMedia('usedMedia')"
      @cancel="closeModal('usedMedia')"
    >
        <b-row>
          <b-col cols="12">
            {{$t('audiovisual_media.admin.used')}}
            <br><br>
            <div class="d-flex justify-content-center">
              {{$t('audiovisual_media.admin.used_two')}}
            </div>
          </b-col>
        </b-row>
    </b-modal>

    <b-modal ref="success_deleted" :title="$t('audiovisual_media.admin.alert')" hide-footer
      :no-close-on-backdrop="true" :no-close-on-esc="true" hide-header-close>
        <b-row>
          <b-col cols="12">
            {{$t('audiovisual_media.admin.success_deleted')}}
            <br><br>
            <sipsder-btn btnType="accept" @onClick="$router.go(0)"></sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>

    <b-modal ref="no_unused_media" :title="$t('audiovisual_media.admin.alert')" hide-footer
      :no-close-on-backdrop="true" :no-close-on-esc="true" hide-header-close>
        <b-row>
          <b-col cols="12">
            {{$t('audiovisual_media.admin.no_unused_deleted')}}
            <br><br>
            <sipsder-btn btnType="accept" @onClick="closeModal('no_unused_media')"></sipsder-btn>
          </b-col>
        </b-row>
    </b-modal>
    

    <b-modal ref="addImageModal" id="addImageModal"  size="lg" class="image-modal" centered :title="$t('audiovisual_media.admin.modal_title')" hide-footer
      :no-close-on-backdrop="true" :no-close-on-esc="true" hide-header-close>
        <audiovisualmedia @created_image="created_image($event)" @cancel="closeModal('addImageModal')" :allowSelection="false" v-if="show"
          :media-options="mediaOptions"
          :showSummary="showSummary"
          :media="media"
          :message="message"></audiovisualmedia>

    </b-modal>   


 <div class="feed-title">{{ $t('audiovisual_media.admin.title').toUpperCase( ) }}</div>
    <b-container class="container-form div-90">

      <p class="mb-5">{{text}}</p>
      
      <div class="filter-container">
        <b-row style="grid-area: a;">
          <b-col cols="12" md="12" >
            <div>
              <h1 class="font-weight-bold">{{$t('audiovisual_media.admin.filterText')}}</h1>
            </div>
          </b-col>
        </b-row>

        <b-row style="grid-area: b;">
          <b-col cols="12" md="12" >
            <b-form-group
              label=""
              label-class="font-weight-bold">
              <b-form-input v-model="search"
                :placeholder="$t('audiovisual_media.admin.filter.key_word')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row style="grid-area: c;">
          <b-col cols="12" md="12"  style="text-align: right;">
            <i @click="isAdvanced = !isAdvanced" :class="{'fas fa-angle-down': !isAdvanced, 'fas fa-angle-up': isAdvanced}" style="cursor: pointer; font-size: 22px"></i>
            <b class="ml-2">{{$t('audiovisual_media.admin.filter.advanced_search')}}</b>
          </b-col>
        </b-row>

        <b-row v-show="isAdvanced" style="grid-area: d;">
          <b-col cols="12" md="12">
            <b-form-group
              :label="$t('audiovisual_media.admin.filter.type')"
              label-class="font-weight-bold">

              <b-form-select
                :options="typeOptions"
                v-model="filter.type">
              </b-form-select>

            </b-form-group>
          </b-col>
         </b-row>
        <b-row v-show="isAdvanced" style="grid-area: e;">
          <b-col cols="12" md="12" >
            <b-form-group :label="$t('audiovisual_media.admin.filter.state')"
              label-class="font-weight-bold">
              <b-form-select                
                :options="autocomplets.states" 
                v-model="filter.state" 
              />
            </b-form-group>
          </b-col>
         </b-row>

        <b-row v-show="isAdvanced" style="grid-area: f;">
          <b-col cols="12" md="12" >
            <b-form-group :label="$t('audiovisual_media.admin.filter.enabled')"
              label-class="font-weight-bold">
              <b-form-select                
                :options="autocomplets.enabled" 
                v-model="filter.enabled" 
              />
            </b-form-group>
          </b-col>
         </b-row>

        <b-row v-show="isAdvanced" style="grid-area: g;">
          <b-col cols="12" md="12" >
            <b-form-group
              :label="$t('audiovisual_media.admin.filter.localidad')"
              label-class="font-weight-bold">
            
              <vue-select 
                v-model="filter.localidad" 
                label="text" :options="autocomplets.localidades">
              </vue-select>

            </b-form-group>
          </b-col>
           </b-row>
        <b-row v-show="isAdvanced" style="grid-area: h;">
          <b-col cols="12" md="12" >
            <b-form-group
              :label="$t('audiovisual_media.admin.filter.village')"
              label-class="font-weight-bold">
            
              <vue-select 
                v-model="filter.village" 
                label="text" :options="autocomplets.villagesFilter" >
              </vue-select>

            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-show="isAdvanced" style="grid-area: i;">
          <b-col cols="12" md="12" >
            <div v-if="isAdmin">
              <div class="border-user">
                <b-row>
                  <b-col cols="6">
                    <b-form-group
                      :label="$t('audiovisual_media.admin.user_load') + ':'"
                      label-class="font-weight-bold">
                    
                      <b-form-checkbox
                                    v-model="adminDifferent"
                                    :value="true"
                                    :unchecked-value="false">
                        {{$t('audiovisual_media.admin.not_admin')}}
                      </b-form-checkbox>

                    </b-form-group>
                    
                  </b-col>

                  <b-col cols="6" v-if="!adminDifferent">
                      <b-form-group
                        :label="$t('audiovisual_media.admin.user') + ':'"
                        label-class="font-weight-bold">
                        <vue-bootstrap-typeahead
                          ref="userSearch"
                          :data="users"
                          v-model="user"
                          :serializer="s => `${s.firstName} ${s.lastName} (${s.email})`"
                          placeholder="Escriba el nombre o email de un usuario..."
                          @hit="userValue = $event.id"
                        ></vue-bootstrap-typeahead>
                      </b-form-group>
                  </b-col>
                </b-row>
                
              </div>
            </div>

          </b-col>
        </b-row>
        <div class="d-flex justify-content-center" style="grid-area: j;">
        <div >
          <sipsder-btn btnType="search"
            @onClick="doSearch()"
          ></sipsder-btn>
          <sipsder-btn btnType="clean"
            @onClick="clear"
          ></sipsder-btn>

        </div>
      </div>

      </div>

      <hr/>

      <b-row>
        <b-col class="d-flex justify-content-center">
          <h2>{{$t('audiovisual_media.admin.subtitle')}}</h2>
        </b-col>
      </b-row>

      <div class="d-flex justify-content-between">
        <div v-if="isAdmin">
          <!-- ENABLE: Habilitar para borrado masivo de imagenes -->
          <sipsder-btn 
            btnType="delete" 
            disabled
            :text="$t('audiovisual_media.admin.delete')" 
            @onClick="unusedMedia"></sipsder-btn>
        </div>
        <div class="big-btn" v-if="isAdmin">
          <sipsder-btn 
            btnType="imageMedia" 
            :text="$t('audiovisual_media.admin.default')" 
            :disabled="filter.type == null"
            @onClick="showDefaultImage = !showDefaultImage"></sipsder-btn>
        </div>
        <div class="big-btn" v-if="isAuthenticated">
          <sipsder-btn 
            btnType="add" 
            :text="$t('audiovisual_media.admin.add')" 
            @onClick="addImage"></sipsder-btn>
        </div>
      </div>

      <hr>
      
      <b-row>
        <b-col cols="12">
          <div v-if="showDefaultImage">
            <div class="relative"
            sytle="width: 200px; height: 200px">
              <template v-if="filter.type == attachmentType.PUBLIC_IMAGE && imageDefault.length">
                <b-row>
                  <b-col v-for="image in imageDefault" :key="image.url">
                    <img :src="getImgURL(image.url)" :alt="image.title"
                      style="width: 200px; height: 200px">
                  </b-col>
                </b-row>
              </template>

              <template v-if="filter.type == attachmentType.BANNER && bannerDefault.length">
                <b-row>
                  <b-col v-for="banner in bannerDefault" :key="banner.url">
                    <img :src="getImgURL(banner.url)" :alt="banner.title"
                      style="width: 200px; height: 200px">
                  </b-col>
                </b-row>
              </template>

               <template v-if="filter.type == attachmentType.VIDEO">
                 <b-row>
                   <b-col v-for="video in videoDefault" :key="video.url">

                     <div v-if="isYouTube(video.url)">
                        <iframe :src="video.url"
                          style="width: 200px; height: 200px"></iframe>
                      </div>

                      <div v-else>
                        <div style="position: relative; width: 300px; padding: 3px;">
                          <b-embed type="video"  aspect="16by9"  controls style="border: 1px solid black;">
                            <source :src="getVideoURL(video.url)" type="video/mp4">
                          </b-embed>
                        </div>
                      </div>
                      
                   </b-col>
                 </b-row>
              </template>

              
              
              <div class="right-cross" @click="showDefaultImage = false">
                <i class="far fa-times-circle"></i>
              </div>
            </div>
            
          </div>
        </b-col>
      </b-row>
      <hr>
      
      <b-row>
        <b-col v-if="meta !== null && meta.totalElements > 0" class="d-flex justify-content-center">
          <b-pagination size="md" :total-rows="meta.totalElements" 
            v-model="page"
            @input="doSearch()"
            :per-page="size"
            style="margin-top: 25px">
          </b-pagination>
        </b-col>
      </b-row>

      <div v-if="messageNoContent" class="border-msg">
        <b-row>
          <b-col cols="12" class="text-justify text-wrap">
            <h2>{{$t('audiovisual_media.noContent')}}</h2>
          </b-col>
        </b-row>
      </div>
      
      <div v-if="messageEmpty && !messageNoContent" class="border-msg">
        <b-row>
          <b-col cols="12" class="text-center">
            <h2>{{$t('audiovisual_media.noListMsg')}}</h2>
          </b-col>
        </b-row>
      </div>

      <b-row class="d-flex flex-row-reverse" v-if="!messageEmpty && meta && meta.totalElements > 0">
        <b-col cols="4">
        
          <b-form-group 
            :label="$t('audiovisual_media.admin.sort_by')"
            label-class="font-weight-bold">
            <b-form-select
              :options="sortOptions"
              v-model="sort">
            </b-form-select>
          </b-form-group>
          
        </b-col>

        <!-- <b-col cols="1">
          <sipsder-btn 
            btnType="delete" text="" @onClick="usedMedia" 
            :disabled=
            v-if="showIndividualDelete">
          </sipsder-btn>
        </b-col> -->

        <b-col cols="1">
          <sipsder-btn
            btnType="delete" text="" @onClick="usedMedia" 
            :disabled="emptyImagesToDestroy">
          </sipsder-btn>
        </b-col>
      </b-row>

      <div class="flex-wrap" v-if="results">
        <b-row  v-for="(v,i) in results" :key="i" class="multimedia-row">
          <b-col cols="12" md="4">
            <template v-if="v.typeName == 'Banner' || v.typeName == 'Imágen pública'">
              <img :src="getImgURL(v.url)" :alt="v.description" style="width: 300px; height: 200px">
            </template>

            <template v-else-if="isYouTube(v.url)">
              <div style="position: relative; width: 300px; height: 200px">
                <iframe :src="v.url" style="width: 300px; height: 200px"></iframe>
                <div class="cover"></div>
              </div>
            </template>

            <template v-else>
              <div style="position: relative; width: 300px; height: 200px">
                <b-embed type="video" aspect="16by9" controls style="border: 1px solid black;">
                  <source :src="getVideoURL(v.url)" type="video/mp4">
                </b-embed>
                <div class="cover"></div>
              </div>
            </template>
          </b-col>

          <b-col cols="12" md="4" class="filter">
            <div>
              <div>
                {{v.createdAt | moment("DD MMM YYYY-h:mm:ss a")}}
              </div>
              <div class="text-wrap text-break font-weight-bold">
                <h2>{{v.title}}</h2>
              </div>
              <div class="text-truncate">
                {{v.description}}
              </div>
              <div class="text-wrap text-break">
                {{v.typeName}}
              </div>
              <div class="font-italic">
                <b>{{v.user.firstName}} {{v.user.lastName}}</b>
              </div>
              <div v-if="v.location">
                <b>{{v.location.name}}, {{v.location.parent.name}}</b>
              </div>
              <div v-if="v.defaultImage !== null && v.defaultImage">
                <b>{{$t('audiovisual_media.admin.defaultMedia')}}</b>
              </div>
              <div class="link" @click="showDetails(v)">
                
                {{$t('audiovisual_media.admin.more')}}
              </div>
            </div>
          </b-col>
          
          <b-col cols="12" md="3" class="d-flex justify-content-start">
            <h3 :class="{'media-wait': v.status.id == 1, 'media-enabled': (v.status.id == 2 && v.enabled), 'media-disabled': (v.status.id == 3 || (v.status.id == 2 && !v.enabled))}">{{statusMessage(v)}}</h3>
          </b-col>

          <b-col cols="12" md="1">
            <b-form-checkbox 
              type="checkbox" :id="'checkbox' + v.id" v-model="imagesToDestroy[i]" @change="selectImage(v, $event)"
              v-if="(v.defaultImage === null || !v.defaultImage)">
            </b-form-checkbox>
          </b-col>          

        </b-row>

      </div>
      

      <b-row>
        <b-col v-if="meta !== null && meta.totalElements > 0" class="d-flex justify-content-center">
          <b-pagination size="md"
            :total-rows="meta.totalElements" v-model="page"
            @input="doSearch()"
            :per-page="size">
          </b-pagination>
        </b-col>
      </b-row>
      
      <b-row>
        <b-col class="d-flex justify-content-center">
          <sipsder-btn btnType="back" class="center" @onClick="$router.go(-1)"></sipsder-btn>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import VAPI from '../../../http_common'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import Audiovisualmedia from '../audiovisual_media/AudioVisualIndex.vue';
import { SERVICE_NAMES, HTTP_STATUS, DOMAINS } from '../../../sipsder_constants';
import { PERMISSIONS_TYPES, GEOGRAPHY_TYPE, ATTACHMENT_TYPE } from '../../../domain_constants'
import vSelect from "vue-select";
import S_UTIL from "../../../util/sipsder_util";

export default {
  data(){
    return {
      isAdvanced: false,
      text: this.$t('audiovisual_media.admin.message_one'),
      adminDifferent: false,
      showSummary: false,
      media: null,
      message: "",
      mediaOptions: [
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")},
        {value: ATTACHMENT_TYPE.BANNER, text: this.$t('audiovisual_media.bannerOption')},
        {value: "image default", text: this.$t('audiovisual_media.imageDefaultOption')},
        {value: 'banner default', text: this.$t('audiovisual_media.bannerDefaultOption')},
        {value: 'video default', text: this.$t('audiovisual_media.videoDefaultOption')}
      ],
      show: false,
      ids: [],
      search: '',
      meta: null,
      imagesToDestroy: {},
      sort: "createdAt,DESC",
      imageDefault: null,
      bannerDefault: null,
      videoDefault: null,
      showDefaultImage: false,
      messageEmpty: false,
      messageNoContent: false,
      sortOptions: [
        {value: "createdAt,DESC", text: this.$t('audiovisual_media.admin.sort_text')},
        {value: "createdAt,ASC", text: this.$t('audiovisual_media.admin.sort_text_one')},
        {value: "title,DESC", text: this.$t('audiovisual_media.admin.sort_text_two')},
        {value: "title,ASC", text: this.$t('audiovisual_media.admin.sort_text_three')},
      ],
      users: [],
      quantityOfItemsToDelete: 0,
      user: '',
      page: 1,
      userValue: null,
      size: 10,
      typeOptions: [],
      results: [],
      current: this.$t("audiovisual_media.imageOption"),
      filter: {
        type: null,//this.$t("audiovisual_media.all"),
        localidad: null,
        village: null,
        state: null,
        keyword: "",
        enabled: null,
      },
      autocomplets: {
        localidades: [],
        villages: [],
        villagesFilter: [],
        states: [],
        enabled: [
          {text: this.$t("audiovisual_media.all"), value: null},
          {text: this.$t("audiovisual_media.admin.filter.enabled_true"), value: true},
          {text: this.$t("audiovisual_media.admin.filter.enabled_false"), value: false}
        ],
      }
    }
  },
  watch: {
    sort: function(){
      // this.searchRequest(this.userValue)
      this.doSearch();
    },
    'filter.localidad' : function(newVal) {
      
      if (!newVal) {
        this.autocomplets.villagesFilter = this.autocomplets.villages;
        this.filter.village = null;
      } else {
        this.autocomplets.villagesFilter = this.autocomplets.villages.filter(loc => {
          return loc.value.parentId == newVal.value.id;
        });
      }
      
      if (this.filter.village && newVal && this.filter.village.value.parentId != newVal.value.id) {
          this.filter.village = null;
      }
    },
    'filter.village' : function(newVal) {
      if (newVal && (!this.filter.localidad || this.filter.localidad.value.id != newVal.value.parentId)) {
        this.filter.localidad = this.autocomplets.localidades.find(loc => loc.value.id == newVal.value.parentId);
      }
    },
    user: _.debounce(function(user) { 
      if(user.length === 0)
        this.userValue = null;
      if(user.length > 0)
        this.getUsers(user) ;
    }, 500),
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    getVideoURL (url) {
      return S_UTIL.getVideoURL(url);
    },
    isYouTube(url) {
        return url.length > 0 && url.search("youtube")>0;
    },
    addImage(){
      this.$router.push({name: 'AudiovisualModify'});
    },
    showDetails(v){
      this.$router.push({name: 'AudiovisualModify', params: {id: v.encryptedId}});
    },
    async created_image(event){
      this.closeModal("addImageModal")
      await this.searchRequest(this.userValue)
      await this.loadDefaultMedia()
    },
    showModal(ref){
      this.$refs[ref].show();
    },
    closeModal(ref){      
      this.show = false;
      this.$refs[ref].hide();
      this.showSummary = false;
      this.media = null;
    },
    selectImage(image, event){
      if(event){
        this.imagesToDestroy[image.id] = true
        this.ids.push(image.id)
      }else{
        delete this.imagesToDestroy[image.id]
        this.ids.splice(this.ids.indexOf(image.id), 1)
      }
    },
    usedMedia(){
      this.showModal("usedMedia")
    },
    async deleteUsedMedia(ref) {
      try {
        let request = await VAPI.put(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/used`, {
          ids: this.ids,
        });
        // await this.searchRequest(this.userValue);
        this.closeModal("usedMedia");
        this.showModal('success_deleted')
      } catch (e) {
        console.info("Problema eliminando media", e);
      }
    },
    async deleteUnusedMedia(ref) {
      try {
        let request = await VAPI.delete(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/unused`);
        this.closeModal(ref);
        this.showModal('success_deleted')
      } catch(e) {
        console.info("Problema eliminando user media", e);
      }
    },
    async unusedMedia(){
      try {
        let request = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/count`)
        this.quantityOfItemsToDelete = request.data.data.length;
        if(this.quantityOfItemsToDelete && this.quantityOfItemsToDelete > 0){
          this.showModal("unUsedMedia")
        }else{
          this.showModal("no_unused_media")
        }
      } catch (e) {
        console.info("Problema usando user media", e);
      }
    },
    async getUsers(user){
      try {
        let request = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/user-search?q=${user}`)
        this.users = request.data.data
      } catch (e) {
        console.info("Problema obteniendo usuarios", e);
      }
    },
    clear() {
      if(this.isAdmin){
        this.$refs.userSearch.inputValue = '';
        this.filter.type = null;//ATTACHMENT_TYPE.PUBLIC_IMAGE;// 'Imágen pública';
        this.current = null;//ATTACHMENT_TYPE.PUBLIC_IMAGE; //'Imágen pública';
        this.user = '';
        this.search = '';
        // this.userValue = -1;
        this.userValue = null
        this.adminDifferent = false
        this.autocomplets.villagesFilter = this.autocomplets.villages;
        this.filter.localidad = null;
        this.filter.village = null;
        this.filter.state = null;
        this.filter.enabled = null;
        this.filter.keyword = null

        this.page = 1
      }else{
        this.filter.type = null;//ATTACHMENT_TYPE.PUBLIC_IMAGE;// 'Imágen pública';
        this.current = null;//ATTACHMENT_TYPE.PUBLIC_IMAGE; //'Imágen pública';
        this.search = '';
        this.autocomplets.villagesFilter = this.autocomplets.villages;
        this.filter.localidad = null;
        this.filter.village = null;
        this.filter.state = null;
        this.filter.enabled = null;
        this.filter.keyword = null
      }

      this.doSearch();
    },
    buildQuery() {
      let query = `${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/filter?`;
      let filterFields = {
        page: this.page - 1,
        size: this.size,
        sort: this.sort,
      };
      if (this.filter.state) {
        filterFields.state = this.filter.state.id;
      }
      if (this.filter.type) {
        filterFields.type = this.filter.type;
      }
      if (this.filter.village) {
        filterFields.location = this.filter.village.value.id;
      } else if (this.filter.localidad) {
        filterFields.location = this.filter.localidad.value.id;
      }

      if (this.filter.enabled != null) {
        filterFields.enabled = this.filter.enabled;
      }

      if (this.search) {
        filterFields.q = this.search;
      }

      // OJO USER FILTER
      // if (this.user && this.user.id) {
      //   filterFields.userId = this.user.id;
      // }

      if (this.userValue && this.userValue > 0) {
        filterFields.userId = this.userValue;
      }

      if (this.adminDifferent) {
        filterFields.notAdmin = this.adminDifferent;
      }

      let first = true;
      for (var key in filterFields) {
        if (!first) {
          query += "&";
        }
        query += `${key}=${filterFields[key]}`;
        first = false;
      }

      return query;
    },
    async doSearch() {
      try {

        if(this.adminDifferent){
          this.user = '';
          this.userValue = null
        }

        let path = this.buildQuery();
        let response = await VAPI.get(path);

        if (response && response.status == HTTP_STATUS.OK) {
          this.results = response.data.data;
          this.meta = response.data.meta;
          if (this.meta.totalElements < 1) {
            this.messageNoContent = true
          }else{
            this.messageNoContent = false
          }
        } else {
          console.info("Problemas con la busqueda: ", response);
        }
        return true;
      } catch (e) {
        console.info("Problemas con la busqueda: ", e);
      }
      return false;
    },
    async searchRequest(user) {
      try {
        if(this.filter.type != this.$t("audiovisual_media.all")) {
          this.current = this.filter.type;
        }
        let path = `${SERVICE_NAMES.AUDIOVISUAL_MEDIA}?type=${this.filter.type}&q=${this.search}&user=${user}&not-admin=${this.adminDifferent}&page=${this.page - 1}&size=${this.size}&sort=${this.sort}`;
        let request = await VAPI.get(path);
        if (request.status == HTTP_STATUS.OK) {
          this.results = request.data.data;
          this.meta = request.data.meta;
          this.imagesToDestroy = {};
          // this.results.forEach(v => {
          //   this.imagesToDestroy.push(false)
          // })
        } else {
          console.info("Problemas al cargar medios audiovisuales", request);  
        }
      } catch(e) {
        console.info("Problemas al cargar medios audiovisuales", e);
      }
    },
    async loadDefaultMedia(){
      try {
        let imageDefault = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/default?type=${ATTACHMENT_TYPE.PUBLIC_IMAGE}`)
        // console.info("Imagen defecto: ", imageDefault);
        if (imageDefault && imageDefault.status == HTTP_STATUS.OK) {
          this.imageDefault = imageDefault.data.data
        } else {
          console.info("Problemas al cargar medios audiovisuales por defecto Imagen", imageDefault);  
        }

        let videoDefault = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/default?type=${ATTACHMENT_TYPE.VIDEO}`)
        // console.info("Video defecto: ", videoDefault);
        if (videoDefault && videoDefault.status == HTTP_STATUS.OK) {
          this.videoDefault = videoDefault.data.data
        } else {
          console.info("Problemas al cargar medios audiovisuales por defecto Video", videoDefault);  
        }

        let bannerDefault = await VAPI.get(`${SERVICE_NAMES.AUDIOVISUAL_MEDIA}/default?type=${ATTACHMENT_TYPE.BANNER}`)
        // console.info("bannerDefault defecto: ", bannerDefault);
        if (bannerDefault && bannerDefault.status == HTTP_STATUS.OK) {
          this.bannerDefault = bannerDefault.data.data
        } else {
          console.info("Problemas al cargar medios audiovisuales por defecto Video", bannerDefault);  
        }
      
      } catch (e) {
        console.info("Problemas al cargar medios audiovisuales por defecto", e);
      }
    },
    async loadDomains() {
      try {
        let response = await VAPI.get(`${SERVICE_NAMES.DOMAINS}/${DOMAINS.ATTACHMENT_STATE}`);
        // console.info("Dominios: ", response);
        if (response && response.status == HTTP_STATUS.OK) {
          this.autocomplets.states = response.data.data.map(state => {
            return {text: state.value, value: state};
          });
        } else {
          console.info('Problemas al cargar los Geografias', response);  
        }
      } catch (e) {
        console.info('Problemas al cargar los Geografias', e);
      }
    },
    async loadGeograpies() {
      try {
        let response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`);
        if (response.status == HTTP_STATUS.OK) {
          this.autocomplets.localidades = response.data.map(ubication => {
            return {text: ubication.name, value: ubication};
          });
        } else {
          console.info("Error al consumir localidad", response.status);  
        }
        response = await VAPI.get(`${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.VEREDA}`);
        if (response.status == HTTP_STATUS.OK) {
          this.autocomplets.villages = response.data.map(ubication => {
            return {text: ubication.name, value: ubication};
          });;
          this.autocomplets.villagesFilter = this.autocomplets.villages;
        } else {
          console.info("Error al consumir vereda", response.status);  
        }
      } catch (e) {
        console.info("Error al consumir geografias", e);
      }
    },
    statusMessage(audiovisual) {
      let msg = ""
      if (audiovisual.status.id == 1) {
        msg = this.$t('audiovisual_media.admin.fileStatus.await');
      }
      if (audiovisual.status.id == 2) {
        if (audiovisual.enabled) {
          msg = this.$t('audiovisual_media.admin.fileStatus.publishEnabled');
        } else {
          msg = this.$t('audiovisual_media.admin.fileStatus.publishDisabled');
        }
      }
      if (audiovisual.status.id == 3) {
        msg = this.$t('audiovisual_media.admin.fileStatus.reject');
      }
      return msg;
    }
  },
  computed: {
    emptyImagesToDestroy(){
      return this.ids.length < 1
    },
    // showIndividualDelete(){
    //   for (let index = 0; index < this.imagesToDestroy.length; index++) {
    //     if(this.imagesToDestroy[index])
    //       return true
    //   }
    //   return false
    // },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      let admin = false
      if (this.isAuthenticated && this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) {
          admin = true
      }
      return admin;
    },
    attachmentType() {
      return ATTACHMENT_TYPE;
    }
  },
  async mounted(){
    let user = await this.$store.getters.getCurrentUser;
    // console.info("Usuario logeado", user, this.isAdmin);

    if(!this.isAdmin){
      if (user && user.id) {
        this.userValue = user.id
      }
      // console.info("UserValue", this.userValue);
      this.text = this.$t('audiovisual_media.admin.message_two')
      
      this.typeOptions =  [
        {value: null, text: this.$t("audiovisual_media.all")},
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
      ]
      
    } else {
      this.text = this.$t('audiovisual_media.admin.message_one')
      this.typeOptions = [
        {value: null, text: this.$t("audiovisual_media.all")},
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")},
        {value: ATTACHMENT_TYPE.BANNER, text: this.$t("audiovisual_media.bannerOption")}
      ]
    }
    // await this.searchRequest(this.userValue);
    await this.loadDefaultMedia();
    await this.loadGeograpies();
    
    await this.loadDomains();

    // console.info("User Value:", this.userValue);
    await this.doSearch();

    if (!this.results || this.results.length == 0) {
      this.messageEmpty = true;
    }
  },
  components: {
    VueBootstrapTypeahead,
    Audiovisualmedia,
    "vue-select": vSelect,
  }
}
</script>
<style lang="sass" scoped>
@import '../../../stylesheets/style.sass';
@media screen  and (max-width: $widthMobile)
  .div-90
      width: 80% !important
  .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
@media screen  and (max-width: $widthTablet)
  .div-90
      width: 80% !important
      margin: 0 auto
  .d-flex
    display: block !important
</style>
<style lang="scss" scoped>
@import '../../../stylesheets/style.sass';
.feed-title{
  position: relative;
  display: inline-block;
  color: #fff;
  background: url(../../../assets/title/barra_sola_3.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 90px;
  width: 105%;
  font-size: 40px;
  font-weight: bold;
  font-family: $fontBody;
  margin-left: -10%;
  margin-top: 15px;
  margin-bottom: 3%;
  padding-left: calc(12% + 40px);
  padding-top: 20px;

  a{
    text-decoration: none;
    color: #fff;
  }
}
.container-form{
  max-width: 90% !important
}
.filter-container{
    width: 100%;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-wrap: nowrap;
    padding: 15px 15px 5px 15px;
    border-radius: 10px;
    background-color: $colorTitleDark;
    color: white;
    display: grid;
    grid-template-areas: "a b b c" "d e e f" "g g  h h" "i i i i" "j j j j";
    grid-template-columns: 2fr 1fr 1fr 2fr;
    grid-gap: 5px;
    .v-select {
      background: white;
    }

    .border-user {
      border: 1px solid white;
      padding: 0px 4px;
    }
}
.filter{
  font-size: 14px
}
.multimedia-row {
  margin: 3rem 0rem;
}

.border-msg {
  border: 3px solid black;
  padding: 1rem;
  margin: 1rem;
}

.media-wait {
  color: rgb(247, 135, 7);
}

.media-enabled {
  color: rgb(8, 233, 27);
}

.media-disabled {
  color: rgb(247, 55, 7);
}
.link {
  color: rgb(7, 55, 247);
  cursor: pointer;
  text-decoration: underline;
}

@media  only screen and (max-width: 800px) {
  .filter-container{
    grid-template-areas: "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" !important;
    grid-template-columns: 100% !important;
  }

}
</style>



