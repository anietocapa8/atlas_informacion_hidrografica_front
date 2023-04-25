<template>
  <div>
    <div class="feed-title">{{$t( 'rurality_stories.main.title' )}}</div>
    <div v-if="general" class="col-90">
      <b-container>
        <b-row>
          <b-col>
            <sipsder-btn
              v-show="isAdmin && !editingDescription"
              btnType="edit_pen"
              :text="$t('rurality_stories.main.edit_description')"
              @onClick="editingDescription = true"
            />
            <template v-if="isAdmin && editingDescription">
              <sipsder-btn btnType="save" @onClick="saveDescription" />
              <sipsder-btn btnType="cancel" @onClick="cancelDescription" />
            </template>
          </b-col>
          <b-col cols="auto">
            <sipsder-btn
              v-show="isAdmin"
              btnType="export"
              :text="$t('rurality_stories.main.export_statistics')"
              @onClick="downloadStatistics"
            />
          </b-col>
        </b-row>
        <b-row class="mb-3" align-v="center">
          <b-col v-if="isAdmin" v-show="editingDescription">
            <rich-text
              class="restricted-editor"
              v-model="generalModel.description"
              name="description"
              :fixed-size="true"
              v-validate="'required|max:4000'"
              :data-vv-as="$t('rurality_stories.main.description')"
            />
            <b-alert
              variant="danger"
              :show="errors.has('description')"
            >{{ errors.first("description") }}</b-alert>
          </b-col>
          <b-col v-show="!editingDescription">
            <rich-text-preview :content="general.description" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <sipsder-btn
              v-show="isAdmin && !editingSummary"
              btnType="edit_pen"
              :text="$t('rurality_stories.main.edit_summary')"
              @onClick="editingSummary = true"
            />
            <template v-if="isAdmin && editingSummary">
              <sipsder-btn btnType="save" @onClick="saveSummary" />
              <sipsder-btn btnType="cancel" @onClick="cancelSummary" />
            </template>
          </b-col>
        </b-row>
        <b-row class="mb-3" align-v="center">
          <b-col v-if="isAdmin" v-show="editingSummary">
            <rich-text
              class="info-mh"
              v-model="generalModel.summary"
              name="summary"
              :fixed-size="true"
              v-validate="'required|max:4000'"
              :data-vv-as="$t('rurality_stories.main.summary')"
            />
            <b-alert variant="danger" :show="errors.has('summary')">{{ errors.first("summary") }}</b-alert>
          </b-col>
          <b-col v-if="!editingSummary">
            <rich-text-preview class="info-mh overflowy" :content="general.summary" />
          </b-col>
          <b-col md="5" class="text-right">
            <div class="audiovisual info-mh">
              <iframe
                v-if="general.attachment.type.type === 'Video'"
                :src="general.attachment.url"
                frameborder="0"
                allowfullscreen
              />
              <img v-else :src="getImgURL(general.attachment.url)" />
            </div>
            <sipsder-btn
              v-show="isAdmin"
              btnType="imageMedia"
              :text="$t('rurality_stories.main.change_audiovisual')"
              @onClick="showAVModal = true"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <sipsder-btn
              v-show="isAdmin"
              btnType="edit_pen"
              :text="$t('rurality_stories.main.manage_categories')"
              @onClick="$router.push({ name: 'CommunityCategoryAdmin' })"
            />
          </b-col>
          <b-col cols="auto">
            <sipsder-btn
              v-show="isLogged"
              btnType="add"
              :text="$t('rurality_stories.main.add_story')"
              @onClick="toStoryCreation"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4" v-for="(cat, j) in general.categories" :key="j" class="mb-4">
            <b-card
              v-b-tooltip="cat.description"
              :title="cat.name"
              :img-src="getImgURL(cat.attachment.url)"
              img-alt="Image"
              class="cat-card"
              @click="filterByCategory(cat)"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="h4 text-right">
            <router-link :to="{ name: 'CommunityStoryIndex' }">
              <span v-on:click="toIndex">{{ $t('rurality_stories.main.view_stories') }}</span>
            </router-link>
          </b-col>
        </b-row>
      </b-container>

      <div class="text-center">
        <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)" />
      </div>
    </div>
    <b-modal ref="notLogged" :title="$t( 'rurality_stories.main.alert' )" size="lg" hideFooter>
      <b-row>
        <b-col class="text-center mx-5">
          <p>{{$t('rurality_stories.main.text_welcome')}}</p>
          <p>{{$t('rurality_stories.main.text_content')}}</p>
          <p>{{$t('rurality_stories.main.text_alert')}}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="btn-group">
          <sipsder-btn
            btnType="accept"
            :text="$t('rurality_stories.main.btn_close')"
            @onClick="hideModal('notLogged')"
          />
          <sipsder-btn
            btnType="login"
            :text="$t('rurality_stories.main.btn_action')"
            v-b-modal.login
          />
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      v-if="isAdmin"
      size="lg"
      class="image-modal"
      :title="$t('audiovisual_media.index.title_modal')"
      v-model="showAVModal"
      centered
      hide-footer
    >
      <audio-visual-media
        allowSelection
        @created_image="createdAudioVisual($event)"
        @cancel="showAVModal = false"
      />
    </b-modal>

    <modal :modals="modals" :activeModalName="shownModal" i18n="rurality_stories.main" />
  </div>
</template>

<script>
import moment from "moment";
import {
  SERVICE_NAMES,
  HTTP_STATUS
} from "../../../../sipsder_constants";
import {PERMISSIONS_TYPES} from "../../../../domain_constants";
import VAPI from "../../../../http_common";
import S_UTIL from "@/util/sipsder_util";
import AudioVisualMedia from "../../audiovisual_media/AudioVisualIndex";
import RichText from "../../../shared/RichText";
import RichTextPreview from "../../../shared/RichTextPreview";
import Modal from "../../../shared/Modal";

export default {
  components: {
    AudioVisualMedia,
    Modal,
    RichText,
    RichTextPreview
  },
  data() {
    return {
      editingDescription: false,
      editingSummary: false,
      showAVModal: false,
      generalModel: undefined,
      shownModal: undefined,
      modals: {
        invalid: {
          nonClosable: false,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        }
      }
    };
  },
  computed: {
    general() {
      return this.$store.getters.getStoryGeneral;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    }
  },
  watch: {
    general(general) {
      if (this.generalModel === undefined) {
        this.generalModel = { ...general };
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch("getStoryGeneral").then(() => {
      if (this.general === undefined) {
        this.$router.push({ name: "Home" });
      }
    });
  },
  mounted() {
    if (!this.isLogged) {
      this.showModal("notLogged");
    }
  },
  methods: {
    cancelDescription() {
      this.generalModel.description = this.general.description;
      this.editingDescription = false;
    },
    cancelSummary() {
      this.generalModel.summary = this.general.summary;
      this.editingSummary = false;
    },
    async saveDescription() {
      if (this.$validator.errors.has("description")) {
        this.shownModal = "invalid";
      } else {
        const model = {
          id: this.general.id,
          description: this.generalModel.description
        };
        const callback = () => {
          this.editingDescription = false;
          this.generalModel.description = this.general.description;
        };
        this.updateStoryGeneral(model, callback);
      }
    },
    async saveSummary() {
      if (this.$validator.errors.has("summary")) {
        this.shownModal = "invalid";
      } else {
        const model = {
          id: this.general.id,
          summary: this.generalModel.summary
        };
        const callback = () => {
          this.editingSummary = false;
          this.generalModel.summary = this.general.summary;
        };
        this.updateStoryGeneral(model, callback);
      }
    },
    createdAudioVisual(att) {
      if (this.general.attachment.id !== att[0]) {
        const model = {
          id: this.general.id,
          attachment: { id: att[0] }
        };
        const callback = () => {
          this.generalModel.attachment = this.general.attachment;
          this.showAVModal = false;
        };
        this.updateStoryGeneral(model, callback);
      } else {
        this.showAVModal = false;
      }
    },
    downloadStatistics() {
      VAPI.get(`/${SERVICE_NAMES.STORY}/statistics`, { responseType: "blob" })
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.download =
              "Historias al " +
              moment(new Date()).format("DD-MM-YYYY") +
              ".xlsx";
            link.href = url;
            link.click();
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred loading statistics " + e.toString());
        });
    },
    async updateStoryGeneral(model, callback) {
      await this.$store.dispatch("updateStoryGeneral", model);
      callback();
    },
    filterByCategory(category) {
      this.$store.dispatch("setStoriesFilter", { category: category.id });
      this.$router.push({ name: "CommunityStoryIndex" });
    },
    toIndex() {
      this.$store.dispatch("removeStoriesFilter");
    },
    toStoryCreation() {
      this.$router.push({ name: "CommunityStoryCreate" });
    },
    hideModal(modal) {
      this.$refs[modal].hide();
    },
    showModal(modal) {
      this.$refs[modal].show();
    },
    getImgURL(url) {
      return S_UTIL.getImgURL(url);
    }
  }
};
</script>

<style lang="sass" scoped>   
@import '../../../../stylesheets/style.sass'

@media screen  and (max-width: $widthTablet)
  .col-90
    width: 80% !important
    margin-left: auto
    margin-right: auto
@media screen  and (max-width: $widthMobile)
  .col-90
    width: 80% !important
  .feed-title
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
    margin-top: 40px !important

.feed-title
    position: relative
    display: inline-block
    color: #fff
    background: url(../../../../assets/title/barra_sola_3.png)
    background-repeat: no-repeat
    background-size: 100% 100%
    width: 110%
    font-size: 40px
    font-weight: bold
    font-family: $fontBody
    margin-left: -10%
    margin-top: 15px
    margin-bottom: 3%
    padding-left: calc(10% + 20px)
    padding-top: 20px
    a
        text-decoration: none
        color: #fff

.info-mh
  max-height: 350px

.overflowy
  overflow-y: scroll

.audiovisual
  height: 250px
  img, iframe
    object-fit: contain
    width: 100%
    height: 100%

.cat-card
  height: 300px
  background: rgba(0, 183, 186, .3)
  border-radius: 1rem

  &:hover
    cursor: pointer
    filter: drop-shadow(0px 0px 1px rgba(0, 113, 115, .5)) drop-shadow(0px 0px 10px rgba(0, 113, 115, .3))

  .card-img
    height: 250px
    border-radius: 1.5rem
    object-fit: cover
    padding: 5px
    filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, .3)) drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))

  .card-body > .card-title
    text-align: center
    font-size: large
</style>
