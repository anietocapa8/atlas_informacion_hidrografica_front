<template>
    <div class="container content-scroll">
        <b-form @submit.prevent="addAction">
          
            <b-container>
                <b-row class="row-padding">
                    <b-form-group>
                        <b-row v-if="!popup">
                            <b-col cols="3"><label>{{$t("audiovisual_media.type")}}</label></b-col>
                            <b-col>
                                <b-form-select
                                        :options="mediaOptions"
                                        v-model="selectedOption"
                                >
                                </b-form-select>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-row>
                <b-row>
                    <resource-description-form ref="resourceDescription"
                                               :resource-description="resourceDescription"
                                               @successValidation="successValidation"
                                               @failValidation="failValidation"
                    ></resource-description-form>
                </b-row>
                <b-row v-if="showErrorMessage" class="alert">
                    <b-alert variant="danger" :show="validationError && !internalServerError">
                        {{$t('audiovisual_media.failModal.messageValidation')}}
                    </b-alert>
                    <b-alert variant="danger" :show="internalServerError">
                        {{$t('audiovisual_media.failModal.messageValidation')}}
                    </b-alert>
                </b-row>
                <b-row v-else-if="successSaved">
                    <b-alert variant="success">{{$t('audiovisual_media.successModal.message')}}</b-alert>
                </b-row>
                <image-detail ref="imageComponent" v-if="selectedOption==='image'" @slideChange="slideChange"
                              @successImageValidation="successValidation"
                              @failImageValidation="failValidation"
                ></image-detail>
                <video-detail ref="videoComponent" v-else @failValidation="failValidation"
                              @successValidation="successValidation"
                ></video-detail>
                <b-row>
                    <b-col cols="6"></b-col>
                    <b-col>
                        <b-row class="button-container">
                            <b-col>
                                <sipsder-btn :text="$t('audiovisual_media.cancelBtn')"
                                             btnType="cancel"
                                             @onClick="cancelAction"></sipsder-btn>
                            </b-col>
                            <b-col>
                                <sipsder-btn :text="$t('audiovisual_media.addBtn')"
                                             v-if="!savedObject"
                                             btnType="add"
                                             @onClick="addAction"></sipsder-btn>

                                <sipsder-btn :text="$t('audiovisual_media.selectBtn')"
                                             v-else
                                             btnType="uploadImage"
                                             @onClick="selectAction"></sipsder-btn>
                                <!--<b-button @click="addAction">{{$t("audiovisual_media.addBtn")}}</b-button>-->
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>

        <b-modal ref="cancelModal"
                 :title="$t('audiovisual_media.cancelModal.title')"
                 :hide-footer="true"
        >
            <b-row>
                {{$t("audiovisual_media.cancelModal.message")}}
            </b-row>
            <b-row>
                <b-col>
                    <sipsder-btn :text="$t('audiovisual_media.cancelModal.yesBtn')"
                                 btnType="accept"
                                 @onClick="cancelConfirm"></sipsder-btn>
                </b-col>
                <b-col>
                    <sipsder-btn :text="$t('audiovisual_media.cancelModal.noBtn')"
                                 btnType="cancel"
                                 @onClick="cancelDecline"></sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal ref="confirmSave"
                 :title="$t('audiovisual_media.confirmModal.tile')"
                 @ok="saveObject"
                 @cancel="cancelSave"
        >
            <b-row v-if="selectedOption==='image'">
                {{$t('audiovisual_media.confirmModal.imageMessage')}}
            </b-row>
            <b-row v-else>
                {{$t('audiovisual_media.confirmModal.videoMessage')}}
            </b-row>
        </b-modal>

        <b-modal ref="successSave"
                 :title="$t('audiovisual_media.successModal.title')"
                 cancel-disabled
                 @ok="successClose"
        >
            <b-row>
                {{$t('audiovisual_media.successModal.message')}}
            </b-row>
        </b-modal>

        <b-modal ref="failSaveRef"
                 :title="$t('audiovisual_media.failModal.title')"
                 cancel-disabled
                 @ok="errorClose"
        >
            <b-row v-if="!fullValidation">
                {{$t('audiovisual_media.failModal.message')}}
            </b-row>
            <b-row v-else>
                {{$t('audiovisual_media.failModal.messageValidation')}}
            </b-row>

        </b-modal>
    </div>
</template>

<script>
    import ResourceDescriptionForm from './ResourceDescriptionForm'
    import ImageDetail from './ImageDetail'
    import VideoDetail from './VideoDetail'
    import VAPI from '../../../http_common'
    import {SERVICE_NAMES} from "../../../sipsder_constants";
    import { ATTACHMENT_TYPE } from '../../../domain_constants'

    export default {
        name: "AudiovisualIndex",
        
        props: {

          popup: {
            type: Boolean,
            required: true,
            default: () => false

          }

        },
        data() {
            return {
                mediaOptions: [
                    {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
                    {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
                ],
                savedObject: false,
                showErrorMessage: true,
                successSaved: false,
                validationError: false,
                internalServerError: false,
                validationErrorGeneralResource: true,
                validationErrorUrlVideo: true,
                validationErrorUrlImage: true,
                selectedOption: "image",
                fullValidation: true,
                imageType: 3,
                videoType: 4,
                imagesArray: [],
                resourceDescription: {
                    id: -1,
                    title: '',
                    url: '',
                    author: '',
                    source: '',
                    description: '',
                    status: true,
                    type: {
                        id: 0
                    }
                }
            }
        },
        components: {
            ResourceDescriptionForm,
            ImageDetail,
            VideoDetail
        },
        methods: {
            created_image (response) {
              //alert("emit del popup")
              this.$emit('created_image', response )
            },
            selectAction() {
                let currentResource = JSON.parse(JSON.stringify(this.resourceDescription));
                this.clearAll();
                this.$emit("selectEvent", currentResource);
                this.$emit('created_image', [currentResource.id,currentResource.url,currentResource.typeName] )
            },
            successValidation(origin) {
                // print validation success origin
                if (origin === 'resource-description') {
                    this.validationErrorGeneralResource = false;
                } else if (origin === 'videoURL') {
                    this.validationErrorUrlVideo = false;
                } else if (origin === 'imageResource') {
                    this.validationErrorUrlImage = false;
                }
            },
            slideChange(index, array) {
                this.resourceDescription = array[index];
            },
            successClose() {
                this.$refs.successSave.hide();
                this.clearAll();
            },
            errorClose() {
                //this.$refs.successSave.hide();
                this.$refs.failSaveRef.hide();
            },
            saveObject() {
                let self = this;
                // get object to save
                let resourceData = this.$refs.resourceDescription.getResourceDescription();
                // check for save image or video
                if (this.selectedOption === "image") {
                    // save image
                    let imageFile = this.$refs.imageComponent.getFile();
                    resourceData.type.id = this.imageType;
                    resourceData.type.type = "Image"
                    //persists image file
                    //check file
                    if (imageFile !== null && imageFile !== '') {
                        // save file
                        let formData = new FormData();
                        formData.append('file', imageFile);
                        formData.append('type', 'image');
                        VAPI.post("/" + SERVICE_NAMES.UPLOAD, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(response => {
                            // console.log("Respuesta " + response.data.data.fileDownloadUri);
                            resourceData.url = response.data.data.fileDownloadUri;
                            self.saveMedia(resourceData);
                        }).catch(ex => {
                            self.internalServerError = true;
                            console.log("Error upload " + ex.toString());
                        });
                    }

                } else {
                    // get video url
                    let videoUrl = this.$refs.videoComponent.getURL();
                    // save video
                    resourceData.url = videoUrl;
                    resourceData.type.id = this.videoType;
                    resourceData.type.type = "Video"
                    this.saveMedia(resourceData);
                }

            },

            saveMedia(mediaObject) {
                let self = this;
                VAPI.post('/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA, mediaObject).then(response => {
                    self.savedObject = true;
                    self.successSaved = true;
                    self.showErrorMessage = false;
                    if(mediaObject.type.type === 'Image') 
                       self.$refs.imageComponent.clear();
                    else
                       self.$refs.videoComponent.clear();
                    this.$refs.resourceDescription.clearValidationResults();
                    self.resourceDescription = {
                        id: -1,
                        title: '',
                        url: '',
                        author: '',
                        source: '',
                        description: '',
                        status: true,
                        type: {
                            id: 0
                        }
                    };
                    self.created_image( [ response.data.id, response.data.url, response.data.type.type ] );
                    //this.created_image( { response.data.id, response.data.url} );
                }).catch(ex => {
                    console.log("Error creating anexo " + ex.toString());
                    self.savedObject = false;
                    self.validationError = false;
                    self.internalServerError = true;
                })
            },
            cancelSave() {
                this.$refs.confirmSave.hide();
            },
            failValidation(failEmiter) {
                if (failEmiter === 'resource-description') {
                    this.validationErrorGeneralResource = true;
                } else if (failEmiter === 'videoURL') {
                    this.validationErrorUrlVideo = true;
                } else if (failEmiter === 'imageResource') {
                    this.validationErrorUrlImage = true;
                }
            },
            cancelAction() {
                this.clearAll();
                this.$refs.cancelModal.show();
            },
            cancelConfirm() {
                this.clearAll();
                this.$refs.cancelModal.hide();
            },
            cancelDecline() {
                this.$refs.cancelModal.hide();
            },
            clearAll() {
                // clear all components
                this.fullValidation = undefined;
                if (this.selectedOption === "video") {
                    this.$refs.videoComponent.clear();
                } else {
                    this.$refs.imageComponent.clear();
                }
                this.resourceDescription = {
                    id: -1,
                    title: '',
                    url: '',
                    author: '',
                    source: '',
                    description: '',
                    status: true,
                    type: {
                        id: 0
                    }
                };
                // clear error messages
                this.$refs.resourceDescription.clearValidationResults();
                this.showErrorMessage = false;
                this.validationError = false;
            },
            async validation() {
                let self = this;
                let fileUrl = '';
                self.validationErrorGeneralResource = await this.$refs.resourceDescription.getValidateResults();
                if (self.selectedOption === "video") {
                    self.validationErrorUrlVideo = await this.$refs.videoComponent.getValidation();
                } else {
                    fileUrl = this.$refs.imageComponent.getFile();
                }

                // verify validation results
                if (this.validationErrorGeneralResource) {
                    if (this.selectedOption === 'video') {
                        if (this.validationErrorUrlVideo) {
                            // save video
                            this.saveObject();
                        } else {
                            self.showErrorMessage = true;
                            self.validationError = true;
                        }
                    } else {
                        if (fileUrl !== '') {
                            // save image
                            this.saveObject();
                        } else {
                            self.showErrorMessage = true;
                            self.validationError = true;
                        }

                    }
                } else {
                    // general validation error
                    self.showErrorMessage = true;
                    self.validationError = true;
                }

            },
            addAction() {
                this.validation();
            }
        },

        watch: {
            resourceDescription: function (newResourceDescription) {
                            if (newResourceDescription.id !== -1) {
                                this.savedObject = true;
                            } else {
                                this.savedObject = false;
                            }
            }
        }
    }
</script>

<style scoped>
    .row-padding {
        margin-top: 2%;
    }

    .button-container {
        text-align: right;
    }

    .alert {
        text-align: center;
    }

    .content-scroll {
        height: 500px;
        overflow-y: scroll;
        overflow-x: scroll;
    }

</style>