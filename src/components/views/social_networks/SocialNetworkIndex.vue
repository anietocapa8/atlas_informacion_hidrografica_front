<template>
<div class="container container-form">
    <!-- Cancel Modal-->
    <b-modal ref="cancelModal" :title="$t('registration.warning')" hideFooter>
        <div class="text-center error">
            <h5> {{$t('survey.create.popup.dicard_changes')}} </h5>
        </div>
        <b-row class="mt-5">
            <b-col class="text-center">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="$router.go(-1)" />
            </b-col>
            <b-col class="center-text">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('cancelModal')" />
            </b-col>
        </b-row>
    </b-modal>

    <!-- Errors modal -->
    <b-modal ref="errorModal" :title="$t('registration.warning')" hideFooter>
          <div class="text-center error">
              <h5 v-for="(error,i) in errors.items" :key="`${i}-${error.msg}`"> {{error.msg}} </h5>
              <h5 v-if="filename == null && this.social.iconUrl == null"> {{$t('social_network.no_file')}} </h5>
          </div>
          <b-row class="mt-5">
              <b-col class="text-center">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.back')" @onClick="closeModal( 'errorModal' )" />
              </b-col>
        </b-row>
    </b-modal>
    <!-- Confirmation Modal-->
    <b-modal ref="confirmationModal" :title="$t('registration.warning')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
            <div class="center-text">
              <p> {{$t('social_network.confirmation')}} </p>
              <p> {{$t('prototype.create.popup.confirmation')}} </p>
            </div>
            <b-row class="mt-5">
              <b-col class="text-center">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="saveSocial()" />
              </b-col>
              <b-col class="text-center">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('confirmationModal')" />
              </b-col>
        </b-row>
    </b-modal>
    <!-- Confirmation Delete Modal-->
    <b-modal ref="deleteModal" :title="$t('registration.warning')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
            <div class="text-center error">
              <p> {{$t('social_network.del_confirmation_1')}} </p>
              <p> {{$t('social_network.del_confirmation_2')}} </p>
            </div>
            <b-row class="mt-5">
              <b-col class="text-center">
                <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.accept')" @onClick="confirmDelete()" />
              </b-col>
              <b-col class="text-center">
                <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('deleteModal')" />
              </b-col>
        </b-row>
    </b-modal>
    <!-- Saved Modal-->
    <b-modal ref="savedModal" :title="$t('registration.warning')" 
        :no-close-on-esc="true"
        :no-close-on-backdrop="true"
        :hide-header-close="true"
        hideFooter>
            <div class="mg-top-10 w-100 center-text">
              <p> {{$t('social_network.succed')}} </p>
            </div>
            <b-row class="mg-top-30">
              <b-col class="center-text">
                <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="confirmSaved()" />
              </b-col>
        </b-row>
    </b-modal>

    <!-- MAIN PAGE -->
    <div class="container">

        <sipsder-title :title="$t('social_network.title')" :text="$t('social_network.claim')" type="admin"></sipsder-title>

        <div class="w-50 container mb-5">
            <div class="row mt-3">
                <div class="col-md-6">
                    <b-form-group :label="$t('social_network.select')">
                        <v-select v-model="social" :options="autocomplets.socials" @change="deleteFile()" 
                            label="name" style="font-weight: normal"></v-select>  
                    </b-form-group>
                </div>
                <div class="col-md-6 text-center">
                    <b-form-group :label="$t('social_network.create_new')">
                        <sipsder-btn btnType="add" :text="$t('social_network.new')" @onClick="newSocial()" />                        
                    </b-form-group>
                </div>
            </div>
        </div>

        <div v-if="social.name != null" class="social-network-box borderer">
            <div class="row mt-3">
                <div class="col-md-6">
                    <b-form-group :label="$t('social_network.name')+asterisk" class="font-weight-bold" >
                        <b-form-input v-model="social.name" maxlength="120" v-validate="'required|min:3|max:120'"
                        name="social_name" :data-vv-as="$t('social_network.name')" :disabled="social.type != socialNetworkIds.OTHER"></b-form-input>
                        <span class="error">{{ errors.first('social_name') }}</span>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <b-form-group :label="$t('social_network.enabled')+asterisk" class="font-weight-bold mt-4  ml-3">
                    <b-form-radio-group v-model="social.enableIcon">
                        <b-form-radio class="mt-2" :value="true">{{$t('social_network.advanced.yes')}}</b-form-radio>
                        <b-form-radio class="mt-2 ml-5" :value="false">{{$t('social_network.advanced.no')}}</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <p class="mt-2 ml-3">{{$t('social_network.enabled_claim')}}</p>
            </div>

            <b-form-group :label="$t('social_network.icon')+social_name+asterisk" class="font-weight-bold mt-3" />
            <div class="row">
                <div v-if="social.iconUrl || previewImage" class="md-col-2">
                    <img v-if="previewImage" :src="previewImage" alt="Icono" class="social-logo">
                    <img v-else :src="getImgURL(social.iconUrl)" alt="Icono" class="social-logo">
                </div>
                <div class="col-md-4 ml-4">
                    <input type="file"
                        accept="image/*"
                        name="register_template"
                        @change="loadIconFile($event)" 
                        ref="uploadFile"
                        style="display: none"/>
                    <sipsder-btn btnType="export" 
                        :text="$t( 'social_network.select_file' )" @onClick="$refs.uploadFile.click()">                                            
                    </sipsder-btn>
                </div>
                <div class="col-md-4 text-muted">
                    <p v-if="filename && !fileError" style="margin-top: 15px"> {{`${$t('social_network.selected_file')}: ${filename}`}} </p>
                    <p v-if="filename == null && !fileError && social.iconUrl == null" class="error" style="margin-top: 15px">{{$t('social_network.no_file')}}</p>
                    <p v-if="fileSizeError" class="mt-2 error">{{$t('social_network.file_error_size')}}</p>
                    <p v-if="fileExtError" class="mt-2 error">{{$t('social_network.file_error_type')}}</p>
                </div>
            </div>
            <p class="mt-2">{{$t('social_network.file_claim')}}</p>
            <div>
                <p class="font-weight-bold mt-2 mr-2" style="display: inline-block">{{`${$t('social_network.file_type_claim')}: `}}</p>
                <p class="mt-2" style="display: inline-block">{{$t('social_network.file_type')}}</p>
            </div>
            <div>
                <p class="font-weight-bold mr-2" style="display: inline-block">{{`${$t('social_network.file_size_claim')}: `}}</p>
                <p style="display: inline-block">{{$t('social_network.file_size')}}</p>
            </div>

            <b-form-group :label="$t('social_network.url')+social_name+asterisk" class="font-weight-bold mt-4">
                <b-form-input v-model="social.url" maxlength="500" v-validate="'required|min:4|max:500'" 
                        name="social_url" :data-vv-as="$t('social_network.url_error')"></b-form-input>
                <span class="error">{{ errors.first('social_url') }}</span>
            </b-form-group>

            <p v-html="$t('social_network.url_claim') + social_name" class="mb-5" style="font-size: 0.8em"></p>

            <div role="tablist">
                <div class="">
                    <p style="font-size: 1.1em; color: blue;">
                        <u @click="toggleCollapse()" style="cursor: pointer">{{$t('social_network.advanced.title')}}</u>
                    </p>
                </div>
                <b-card no-body class="mb-1">
                    <b-collapse id="advanced-collapse" role="tabpanel">
                        <b-card-body>
                            <b-form-group :label="$t('social_network.advanced.radio_label')+asterisk" class="font-weight-bold mt-4  ml-5">
                                <b-form-radio-group v-model="social.initPage">
                                    <b-form-radio class="mt-2" :value="true">{{$t('social_network.advanced.yes')}}</b-form-radio>
                                    <b-form-radio class="mt-2" :value="false">{{$t('social_network.advanced.no')}}</b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>
                            <p class="mt-3 mb-3 ml-5 mr-5">{{$t('social_network.advanced.radio_description')}}</p>
                            <div v-if="social.initPage">
                                <div class="row mt-5  ml-4">
                                    <div class="col-md-3">
                                        <b-form-group :label="$t('social_network.advanced.user')+asterisk" class="font-weight-bold"/>
                                    </div>
                                    <div class="col-md-7">
                                        <b-form-input v-model="social.user" maxlength="200" v-validate="'required|min:3|max:200'"
                                                name="social_user" :data-vv-as="$t('social_network.advanced.user')" :disabled="disabledUser"></b-form-input>          
                                        <span class="error">{{ errors.first('social_user') }}</span>
                                    </div>
                                </div>
                                <div class="row mt-3 mb-4  ml-4">
                                    <div class="col-md-3">
                                        <b-form-group :label="$t('social_network.advanced.token')+asterisk" class="font-weight-bold"/>
                                    </div>
                                    <div class="col-md-7">
                                        <b-form-input v-model="social.token" maxlength="600" v-validate="'required|min:3|max:600'"
                                                name="social_token" :data-vv-as="$t('social_network.advanced.token')" :disabled="disabledToken"></b-form-input>  
                                        <span class="error">{{ errors.first('social_token') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="row mt-5  ml-4">
                                    <div class="col-md-3">
                                        <b-form-group :label="$t('social_network.advanced.user')" class="font-weight-bold"/>
                                    </div>
                                    <div class="col-md-7">
                                        <b-form-input v-model="social.user" maxlength="200"></b-form-input>          
                                    </div>
                                </div>
                                <div class="row mt-3 mb-4  ml-4">
                                    <div class="col-md-3">
                                        <b-form-group :label="$t('social_network.advanced.token')" class="font-weight-bold"/>
                                    </div>
                                    <div class="col-md-7">
                                        <b-form-input v-model="social.token" maxlength="600" :disabled="disabledToken"></b-form-input>  
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3 mb-4  ml-4">
                                <sipsder-btn v-if="social.id != 0 && social.type == socialNetworkIds.OTHER" btnType="cancel" :text="$t('social_network.delete')" @onClick="deleteSocial()" />
                            </div>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>

            <b-row class="text-center mt-5 mb-2">
                <b-col>
                    <sipsder-btn btnType="back" :text="$t('social_network.back')" @onClick="cancelSocial()" />
                </b-col>
                <b-col>
                    <sipsder-btn btnType="accept" :text="$t('social_network.save')" @onClick="confirmationModal()" />
                </b-col>
            </b-row>

        </div>

        <div v-else class="text-center mt-5 mb-2">
            <sipsder-btn btnType="back" :text="$t('social_network.back')" @onClick="$router.go(-1)" />
        </div>

    </div>

</div>
</template>

<script>
import vSelect from "vue-select";
import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS, ICON } from '@/sipsder_constants';
import {LOGO_TYPE, SOCIAL_NETWORKS_IDS} from '../../../domain_constants';
import S_UTIL from "../../../util/sipsder_util";

export default {
    components: {
        vSelect
    },
    data(){
        return {
            asterisk: "<span style='color: red'>*</span>",

            socialNetworkIds: null,

            file: {},
            filename: null,
            fileSizeError: false,
            fileExtError: false,
            fileError: false,
            previewImage: null,

            collapsed: false,

            autocomplets: {
                socials: [],
            },

            social: {
                id: 0,
                name: null,
                initPage: null,
                type: null,
                url: null,
                iconUrl: null,
                enableIcon: null,
                user: null,
                token: null
            }
        }
    },
    computed: {
        social_name(){
            return `<span style='color: blue'>${this.social.name}</span>`
        },
        disabledUser(){
            if(this.social.type == SOCIAL_NETWORKS_IDS.INSTAGRAM) 
                return true
            return false
        },
        disabledToken(){
            if(this.social.type == SOCIAL_NETWORKS_IDS.TWITTER) 
                return true
            else if(this.social.type == SOCIAL_NETWORKS_IDS.FLICKR)
                return true
            return false
        }
    },
    methods: {
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        showModal(ref) {
            this.$refs[ref].show();
        },
        closeModal(ref) {
            this.$refs[ref].hide();
        },
        toggleCollapse(){
            this.collapsed = !this.collapsed
            this.$root.$emit('bv::toggle::collapse', 'advanced-collapse')
        },
        confirmSaved(){
            this.closeModal('savedModal')
            this.$store.dispatch('setActiveSocialNetworks', {
                active: 1
            })
            this.$router.go()
        },
        newSocial(){
            this.social = {
                id: 0,
                name: 'NUEVA',
                initPage: false,
                type: SOCIAL_NETWORKS_IDS.OTHER,
                url: null,
                iconUrl: null,
                enableIcon: true,
                user: null,
                token: null
            }
        },
        deleteFile(){
            if(this.collapsed){
                this.toggleCollapse()
            }
            this.file = {}
            this.filename = null
            this.fileSizeError = false
            this.fileExtError = false
            this.fileError = false
            this.previewImage = null
        },
        async confirmationModal(){
            if(await this.$validator.validateAll() && (this.filename != null || this.social.iconUrl != null)){
                this.showModal('confirmationModal')
            }else{
                this.showModal('errorModal')
                if(!this.collapsed){
                    this.toggleCollapse()
                }
            }
        },
        loadIconFile(e) {
            if(e.target.files[0].type === "image/gif" || e.target.files[0].type === "image/jpeg" 
                || e.target.files[0].type === "image/png" || e.target.files[0].type === "image/svg+xml" ){
                if(e.target.files[0].size <= ICON.MAX_SIZE){
                    this.file = e.target.files[0];
                    this.filename = e.target.files[0].name;
                    //Preview the image
                    const reader = new FileReader();
                    reader.readAsDataURL(this.file);
                    reader.onload = e =>{
                        this.previewImage = e.target.result;
                    };
                    //Errors on file
                    this.fileSizeError = false;
                    this.fileExtError = false;
                    this.fileError = false;
                }else{
                    this.fileSizeError = true;
                }
            }else{
                this.fileExtError = true;
                this.fileError = true;
            }
        },
        cancelSocial(){
            this.showModal('cancelModal')
        },
        assemblePayload() {

            let formData = new FormData();
            formData.append( 'id', this.social.id)
            formData.append( 'name', this.social.name)
            formData.append( 'initPage', this.social.initPage)
            formData.append( 'url', this.social.url)
            formData.append( 'type', this.social.type)
            formData.append( 'enableIcon', this.social.enableIcon)
            formData.append( 'user', this.social.user)
            formData.append( 'token', this.social.token)
            
            if(this.filename != null){
                formData.append( 'file',  this.file );
            }else if(this.iconUrl != null){
                formData.append( 'iconUrl',  this.social.iconUrl );                
            }
            return formData
        },
        deleteSocial(){
            this.showModal('deleteModal')
        },
        async confirmDelete(){
            let response = await VAPI.delete(`/${SERVICE_NAMES.SOCIAL_NETWORK}/${this.social.id}`)
            if(response.status == HTTP_STATUS.OK){
                    this.showModal('savedModal')
                }
        },
        async saveSocial(){
            if(await this.$validator.validateAll() && (this.filename != null || this.social.iconUrl != null)){
                let assembled = this.assemblePayload()
                let response = await VAPI.post(`/${SERVICE_NAMES.SOCIAL_NETWORK}`, assembled, { headers: { 'Content-Type': 'multipart/form-data' } })
                if(response.status == HTTP_STATUS.OK){
                    this.showModal('savedModal')
                }
            }
        },
        async loadSocial(){
            this.$store.dispatch('setActiveSocialNetworks', {
                active: 1
            })
            this.social = {
                id: null, name: null, initPage: null, type: null, url: null, 
                iconUrl: null, enableIcon: null, user: null, token: null
            }
            try{
                let response1 = await VAPI.get(`/${SERVICE_NAMES.SOCIAL_NETWORK}`);
                if(response1.status == HTTP_STATUS.OK){
                    this.autocomplets.socials = response1.data.data.map(e => {
                        return {
                            id: e.id,
                            name: e.name,
                            initPage: e.initPage,
                            url: e.logo.url,
                            type: e.tipo.id,
                            iconUrl: e.logo.attachment.url,
                            enableIcon: e.logo.active,
                            user: e.user,
                            token: e.token
                        }
                    })
                }
            }catch(e){
                console.log(e)
            }
        }
    },
    async beforeMount(){
        this.socialNetworkIds = SOCIAL_NETWORKS_IDS
        await this.loadSocial()
    }
}
</script>

<style lang="sass" scoped>

.social-network-box
    max-width: 850px
    min-widht: 750px
    min-height: 850px
    padding: 30px 50px
    margin: auto

.borderer
    border: 2px solid #a19d9e
    border-radius: 15px
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)

.error
    color: red
    font-size: 0.9em
    font-weight: normal

.social-logo
    margin-left: 10px
    margin-top: 7px
    width: 55px
    heigth: 55px
p
    font-size: 0.9em
   
</style>