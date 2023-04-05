<template>
    <div>
        <b-container>
            <b-row class="border-hidden">
                <b-col cols="3">
                    <label>Seleccionar nueva Imagen</label>
                </b-col>
                <b-col>
                    <b-form-file v-model="file"
                                 ref="refFormFile"
                                 :state="Boolean(file)"
                                 :placeholder="$t('audiovisual_media.imageDetail.uploadImageModal.filePickerPlaceholder')"
                                 accept=".png, .jpg"
                                 @input="saveImage"
                    >
                    </b-form-file>
                </b-col>
                <!--
                <sipsder-btn :text="$t('audiovisual_media.imageDetail.addBtn')"
                             btnType="add"
                             @onClick="openFilePicker"></sipsder-btn>
                             -->
            </b-row>
            <b-form-fieldset class="border-row">
                <b-row>
                    <b-col cols="3">
                        <label>{{$t("audiovisual_media.imageDetail.label")}}</label>
                    </b-col>
                    <b-col cols="6">
                        <b-form-input v-model="searchQuery"></b-form-input>
                    </b-col>
                    <b-col>
                        <sipsder-btn :text="$t('audiovisual_media.imageDetail.searchBtn')"
                                     btnType="search"
                                     @onClick="makeQuery"></sipsder-btn>
                    </b-col>
                </b-row>
            </b-form-fieldset>
            <b-row class="carousel-container">
                <b-carousel
                        id="carousel1"
                        style="text-shadow: 1px 1px 2px #333;"
                        controls
                        indicators
                        background="#ababab"
                        :interval="0"
                        v-model="slide"
                        img-height="100"
                        img-width="120"
                        @sliding-start="onSlideStart"
                        @sliding-end="onSlideEnd"
                        class="carousel-style"
                >
                    <b-carousel-slide
                            v-for="(image, index) in images"
                            :img-src="image.url"
                            :caption="image.title"
                            img-alt="  Imagen no disponible  "
                            img-height="100"
                            img-width="120"
                            :key="index"
                    ></b-carousel-slide>
                    <!--
                    <b-carousel-slide
                            caption="First slide"
                            text=""
                            img-src="https://picsum.photos/1024/480/?image=52"
                    >
                        <h1>Hello Word!</h1>
                    </b-carousel-slide>
                    <b-carousel-slide
                            img-src="https://picsum.photos/1024/480/?image=58"
                    ></b-carousel-slide>
                    <b-carousel-slide
                            img-src="https://picsum.photos/1024/480/?image=55"
                    ></b-carousel-slide>
                    -->
                </b-carousel>

                <!--
                <carousel-thumbnail></carousel-thumbnail>-->
            </b-row>
            <!-- thumbnails carousel-->

            <b-row class="thumbnail-style">
                <b-col>
                    <b-img thumbnail fluid v-for="(image, index) in images" :src="image.url" :key="index"
                           width="120"
                           height="50"
                           @click="imageClick(index)"
                           alt="Imagen"
                           class="img-margins"
                    ></b-img>
                </b-col>
            </b-row>

            <!-- thumbnails carousel-->

            <!--
                <br>
                <Carousel :perPage="4">
                    <Slide v-for="(image, index) in images" :key="index">
                        <div class="thumb-carousel">
                            <div @click="imageClick(index)" class="thumbnail-style" :style="{ backgroundImage: 'url(' + image.url + ')'}" style="width: 200px; height: 100px;background-size: cover; ">
                            </div>
                        </div>
                        <p>{{image.title}}</p>
                    </Slide>
                </Carousel> -->

        </b-container>

        <b-modal ref="refFilePicker"
                 :hide-footer="true"
                 :title="$t('audiovisual_media.imageDetail.uploadImageModal.title')">

            <b-row>
                <b-form-file v-model="file"
                             v-validate="'required'"
                             name="FilePicker"
                             :state="Boolean(file)"
                             :placeholder="$t('audiovisual_media.imageDetail.uploadImageModal.filePickerPlaceholder')"
                             accept=".png, .jpg"
                             class="custom-file-input:lang(sp) custom-file-label"
                >
                </b-form-file>
                <span class="error">{{errors.first("FilePicker")}}</span>
            </b-row>
            <b-row class="button-container">
                <b-col>
                    <sipsder-btn :text="$t('audiovisual_media.imageDetail.uploadImageModal.saveBtn')"
                                 @onClick="saveImage"
                                 btnType="add"
                    ></sipsder-btn>
                </b-col>
                <b-col>
                    <sipsder-btn :text="$t('audiovisual_media.imageDetail.uploadImageModal.cancelBtn')"
                                 @onClick="cancelImage"
                                 btnType="cancel"
                    ></sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
    import VAPI from '../../../http_common'
    import ElSlPanel from "element-ui/packages/color-picker/src/components/sv-panel";
    import {SERVICE_NAMES} from "../../../sipsder_constants";


    export default {
        props: {
            width: 120,
            height: 60,
        },
        name: "ImageDetail",
        methods: {
            openFilePicker() {
                this.$refs.refFilePicker.show();
            },

            imageClick(index) {
                this.slide = index;
            },
            onSlideStart() {
                this.sliding = true;
            },
            onSlideEnd() {
                this.sliding = false;
                this.$emit("slideChange", this.slide, this.images);
            },
            saveImage() {
                //upload image
                let self = this;
                if (self.file === null && self.file === '') {
                    // console.log("empty file")
                } else {
                    // create new save object
                    // save file
                    self.addedImageUrl = URL.createObjectURL(this.file);
                    if (self.images !== undefined && self.images !== null && self.images.length > 0 && self.images[0].id !== -1) {
                        self.images.unshift(this.resourceDescription);
                    }
                    self.images[0].url = self.addedImageUrl;
                    self.images[0].title = self.$t('audiovisual_media.stageImageTitle');
                    self.resourceDescription.url = this.addedImageUrl;
                    this.slide = 0;
                }
            },

            cancelImage() {
                //hide the modal and clear the v-model
                this.file = '';
                this.images = [];
                this.makeQuery();
                this.clear();
            },

            getFile() {
                return this.file;
            },

            makeQuery() {
                let self = this;
                if (this.searchQuery !== null && this.searchQuery !== undefined && this.searchQuery !== '') {
                    let query = encodeURI(this.searchQuery);
                    VAPI.get('/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA + '?resourceType=3&keyWord=' + query).then(response => {
                        self.images = response.data.data;
                        if (self.images !== undefined && self.images !== null && self.images[0].id !== -1) {
                            self.images.unshift(this.resourceDescription);
                        }
                    }).catch(ex => {
                        console.log("Fail on Load " + ex);
                    })
                } else {
                    VAPI.get('/' + SERVICE_NAMES.AUDIOVISUAL_MEDIA + '?resourceType=3').then(response => {
                        if (response.status === 204) {
                            self.images = [];
                            if (self.images !== undefined && self.images !== null && self.images[0].id !== -1) {
                                self.images.unshift(this.resourceDescription);
                            }
                        } else {
                            self.images = response.data.data;
                            if (self.images !== undefined && self.images !== null && self.images[0].id !== -1) {
                                self.images.unshift(this.resourceDescription);
                            }
                        }
                    }).catch(ex => {
                        console.log("Fail on Load " + ex);
                        self.images = []
                    })
                }

            },

            clear() {
                this.file = '';
                this.searchQuery = '';
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
                this.slide = 0;
                this.images = [];
                this.makeQuery();
                this.$refs.refFormFile.reset();
            }

        },
        data() {
            return {
                showErrorMessage: false,
                addedImage: false,
                slide: 0,
                sliding: null,
                file: null,
                url: null,
                addedImageUrl: null,
                searchQuery: '',
                images: [],
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
            ElSlPanel
        },

        beforeMount: function () {
            this.makeQuery();

        },

        watch: {
            images: function (val) {
                // generate carousel
                // this.images = val;
                // this.$emit("slideChange", this.slide, this.images);
            },
            slide: function (newSlide) {
                this.slide = newSlide;
                this.$emit("slideChange", this.slide, this.images);

            },
            searchQuery: function (val) {
                this.searchQuery = val;
                this.makeQuery();
            }
        },

    }
</script>

<style lang="scss" scoped>
    .border-row {
        width: 100%;
        border: 1px solid #7F8C8D;
        border-radius: 5px;
        padding-top: 2%;
        padding-left: 1%;
        padding-bottom: 1%;
    }

    .border-hidden {
        border-style: hidden;
        padding-top: 2%;
        padding-bottom: 1%;
        text-align: left;
    }

    .carousel-style {
        width: auto;
        margin-top: 1%;
        margin-bottom: 1%;
        padding-top: 1%;
        padding-bottom: 1%;
    }

    .button-container {
        margin-top: 2%;
        text-align: center;
    }

    .thumbnail-style {
        margin-top: 1%;
        margin-bottom: 1%;
        background: black;
        overflow-y: hidden;
        padding-bottom: 1%;
        padding-top: 1%;
    }

    .error {
        color: red;
    }

    .image-size {
        padding-top: 1%;
        padding-bottom: 1%;
        width: 100%;
        height: auto;
    }

    .border-show {
        border-style: solid;
        border-radius: 5px;
    }

    .thumbnail-style {
        margin: 0 1px;
        padding: 10px 10px;
    }

    .thumb-carousel {
        padding: 10px 10px;
        border: 1px solid;
    }

    .img-margins {
        margin-left: 2%;
    }

</style>