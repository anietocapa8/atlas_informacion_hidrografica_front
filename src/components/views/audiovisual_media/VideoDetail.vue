<template>
    <div>
        <b-container>
            <b-form class="form-group required">
            <b-row>
                <b-col cols="6">
                    <b-row>
                        <b-col cols="3">
                            <label class="control-label">{{$t("audiovisual_media.videoDetail.label")}}</label>
                        </b-col>
                        <b-col>
                            <b-form-input v-model="videoUrl" @change="getYouTubeUrl" v-validate="'required|max:120'" name="video URL"></b-form-input>
                            <span class="error">{{errors.first("video URL")}}</span>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col>

                </b-col>
            </b-row>
                <b-row class="video-container">
                    <!-- video -->
                    <b-embed type="iframe"
                             v-if="isYouTube"
                             aspect="16by9"
                             :src="showURL"
                             controls
                    ></b-embed>
                    <b-embed type="video"
                             v-if="!isYouTube"
                             aspect="16by9"
                             controls 
                             style="border: 1px solid black;"
                    >
                        <source :src="showURL" type="video/mp4">
                    </b-embed>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
    import S_UTIL from "../util/sipsder_util";
    export default {
        name: "videoDetail",
        data(){
            return {
                videoUrl: '',
                showURL: '',
                validation: false
            }
        },
        methods:{
            getVideoURL (url) {
            return S_UTIL.getVideoURL(url);
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
                if(this.videoUrl.search("youtube")>0){
                    let vId = this.getId(this.videoUrl);
                    this.showURL = `https://www.youtube.com/embed/${vId}?rel=0`;
                }
                else{
                    this.showURL = this.getVideoURL(this.videoUrl);
                }
            },

            getValidation(){
                return this.$validator.validateAll();
            },

            clear(){
                this.showURL = ''
                this.videoUrl = '';
                this.$validator.reset();
                this.$validator.errors.clear();
            },

            getURL(){
                return this.showURL;
            },
            isYouTube() {
                return this.videoUrl.length > 0 && this.videoUrl.search("youtube")>0;
            }
        }
    }
</script>

<style scoped>
    .form-group.required .control-label:after {
        content:"*";
        color:red;
    }

    .error {
        color: red;
    }

    .video-container{
        margin-top: 3%;
    }

</style>