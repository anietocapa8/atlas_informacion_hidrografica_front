<template>
  <div>
    <sipsder-btn
      v-if="display.uploadButton"
      class="centered w-100"
      btnType="uploadImage"
      :text="uploadButtonText"
      @onClick="showAVModal = true"
    />

    <div class="container audiovisual-container" v-if="attachments.length">
      <div v-if="display.preview" class="preview w-100 centered">
        <template v-if="attSelected.typeName == 'Video'">
          <iframe class="w-100" :src="attSelected.url"/>
        </template>
        <template v-else>
          <img :src="getImgURL(attSelected.url)" :alt="'Image preview'">
        </template>
      </div>

      <carousel class="carousel" :perPageCustom="perPage" :navigationEnabled="true">
        <slide v-for="(att, i) in attachments" :key="i" class="centered">
          <div
            class="centered slide-overlay"
            v-bind:class="{'no-overlay': display.preview === undefined, selected: att === attSelected}"
            @click="attSelected = att"
          >
            <template v-if="att.typeName == 'Video' && !isVideoYT(att.url)">
              <iframe :src="att.url"/>
              <div class="cover" @click="att === attSelected"/>
            </template>
            <img
              v-else
              :src="(att.typeName === 'Video') ? getImageYT(att.url) : getImgURL(att.url)"
              :alt="att.description"
            >
          </div>
        </slide>
      </carousel>
      <b-row class="centered">
        <b-col v-if="display.main" cols="2" class="centered">
          <b-form-radio
            v-model="attSelected.main"
            :value="true"
            @change="selectMain"
          >{{ $t('admin_carousel.main') }}</b-form-radio>
        </b-col>
        <b-col v-if="display.delete" cols="2" class="centered">
          <span @click="shownModal = 'deleteAttachment'">
            <i class="fas fa-times"/>
            {{ $t('admin_carousel.delete') }}
          </span>
        </b-col>
      </b-row>
    </div>

    <b-modal
      v-if="display.uploadButton"
      size="lg"
      class="image-modal"
      :title="$t('audiovisual_media.index.title_modal')"
      v-model="showAVModal"
      centered
      hide-footer
    >
      <audio-visual-media
        :media-options="mediaOptions"
        allowSelection
        @created_image="createdAudioVisual($event)"
        @cancel="showAVModal = false"
      />
    </b-modal>

    <modal
      v-if="display.delete"
      :modals="modals"
      :activeModalName="shownModal"
      i18n="admin_carousel"
      @closed="shownModal = undefined"
    />
  </div>
</template>

<script>
import AudioVisualMedia from "../views/audiovisual_media/AudioVisualIndex";
import { Carousel, Slide } from "vue-carousel";
import { ATTACHMENT_TYPE } from '../../domain_constants'
import Modal from "./Modal";
import S_UTIL from '../../util/sipsder_util'

export default {
  components: { AudioVisualMedia, Carousel, Slide, Modal },
  props: {
    attachments: {
      type: Array,
      default: () => []
    },
    perPage: {
      type: Array,
      default: () => [[480, 1], [768, 2], [1024, 3]]
    },
    display: {
      type: Object,
      default: () => ({
        uploadButton: true,
        preview: true,
        main: true,
        delete: true
      })
    },
    uploadButtonText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      attSelected: this.attachments.length ? this.attachments[0] : undefined,
      showAVModal: false,
      mediaOptions: [
        {value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption")},
        {value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption")}
      ],
      shownModal: undefined,
      modals: {
        deleteAttachment: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.deleteSelected(),
          onCancel: () => (this.shownModal = undefined)
        },
        alreadyAdded: {
          nonClosable: false,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        }
      }
    };
  },
  computed: {
    attachmentsLength() {
      return this.attachments.length;
    }
  },
  watch: {
    attachmentsLength(newLen, prevLen) {
      if (prevLen === 0) this.attSelected = this.attachments[0];
    }
  },
  methods: {
    getImgURL(url){
        return S_UTIL.getImgURL(url);
    },
    createdAudioVisual(model) {
      let image = this.attachments.find(att => att.id === model[0]);
      if (image) {
        this.shownModal = "alreadyAdded";
      } else {
        let attachment = {
          id: model[0],
          url: model[1],
          typeName: model[2],
          main: this.attachments.length === 0
        };
        if (attachment.main) {
          this.attSelected = attachment;
        }
        this.attachments.push(attachment);
      }
      this.showAVModal = false;
    },
    deleteSelected() {
      let idx = this.attachments.indexOf(this.attSelected);
      this.attachments.splice(idx, 1);
      if (this.attachments.length) {
        idx = idx > 0 ? idx - 1 : idx;
        const wasMain = this.attSelected.main;
        this.attSelected = this.attachments[idx];
        if (wasMain) {
          this.attSelected.main = true;
        }
      }
      this.shownModal = undefined;
    },
    selectMain() {
      this.attachments
        .filter(att => att.main)
        .forEach(att => {
          att.main = false;
        });
      this.attSelected.main = true;
    },
    isVideoYT(url) {
      return url.indexOf("youtube") !== -1;
    },
    getImageYT(url) {
      var res = url.split("/");
      var rel = res[4].split("?");
      return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
    }
  }
};
</script>

<style lang="sass" scoped>
.w-100
  width: 100% !important
  max-width: 100% !important

.centered
  display: flex
  justify-content: center
  align-items: center

.audiovisual-container
  padding: 20px
  border: 1px solid rgba(0, 0, 0, 0.1)

.preview
  margin-bottom: 20px
  height: 500px

  iframe
    height: 100%
  
  img
    object-fit: contain
    width: 100%
    height: 100%

.carousel
  margin: 25px
  
.slide-overlay
  filter: contrast(50%) brightness(150%)

  &.no-overlay
    filter: none

  &.selected
    filter: none

  *
    position: relative
    height: 150px
    max-width: 350px

  .cover
    width: 100%
    background: transparent
    position: absolute
</style>