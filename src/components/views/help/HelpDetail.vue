<template>
  <b-container v-if="manual">
    <sipsder-title :title="$t('help.detail.title')"/>
    <div class="bordered">
      <b-row>
        <b-col>
          <div
            v-bind:class="{ 'enabled-lbl': manual.enabled, 'disabled-lbl': !manual.enabled }"
            v-show="isAdmin && isLogged"
          >
            <b>{{ manual.enabled ? $t('help.detail.enabled') : $t('help.detail.disabled') }}</b>
          </div>
        </b-col>
        <b-col cols="auto" v-show="isAdmin && isLogged">
          <sipsder-btn :text="$t('help.detail.edit')" btnType="add" @onClick="toAdmin" />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="auto" class="info-col">
          <b>{{ $t('help.detail.manual_type')}}</b>
          {{ manual.title }}
        </b-col>
        <b-col cols="auto" class="info-col">
          <b>{{ $t('help.detail.date') }}</b>
          {{ manual.dateDisplay }}
        </b-col>
        <b-col cols="auto" class="info-col">
          <b>{{ $t('help.detail.version')}}</b>
          {{ manual.version }}
        </b-col>
      </b-row>
      <b-row>
        <b-col class="info-col">
          <b>{{ $t('help.detail.description')}}</b>
          {{ manual.description }}
        </b-col>
      </b-row>
      <b-row>
        <b-col class="info-col">
          <b>{{ $t('help.detail.created_by')}}</b>
          <div class="profile-image">
            <img :src="getProfileImage(manual.creatorPhoto)">
          </div>
          <span class="profile-name">{{ manual.creatorName + $t('help.detail.creator_type')}}</span>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <social-networks-share/>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <report-component :content-id="manual.id" :content-type="REPORT_CONTENT_TYPES.DOCUMENTS"/>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <score-component
            :idContent="manual.cryptedId"
            :idType="SCORE_CONTENT_TYPE.DOCUMENTS"
            :likes="manual.likes"
            :dislikes="manual.dislikes"
          />
        </b-col>
      </b-row>
    </div>
    <div>
      <document-view :id="manual.cryptedId"/>
    </div>
    <div class="centered">
      <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)"/>
      <sipsder-btn
        class="button-group"
        :text="$t('help.detail.redirect_help_page')"
        btnType="back"
        @onClick="goTo('Help')"
      />
    </div>
  </b-container>
</template>

<script>
import DocumentView from "@/components/shared/DocumentView";
import DownloadDocument from "@/components/shared/DownloadDocument";
import SocialNetworksShare from "@/components/shared/social_networks_share/SocialNetworksShare";
import ScoreComponent from "@/components/shared/ScoreComponent";
import ReportComponent from "@/components/shared/ReportComponent";
import {
  SCORE_CONTENT_TYPE,
  REPORT_CONTENT_TYPES
} from "@/sipsder_constants";
import { PERMISSIONS_TYPES } from "@/domain_constants";
import S_UTIL from "@/util/sipsder_util";

export default {
  components: {
    DocumentView,
    DownloadDocument,
    ReportComponent,
    ScoreComponent,
    SocialNetworksShare
  },
  data() {
    return {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      manual: undefined,
      showLogTooltip: false
    };
  },
  async created() {
    let { id, title } = this.$route.params;
    id = parseInt(id);
    if (id) {
      if (this.$store.getters.getHelp === undefined) {
        await this.$store.dispatch("getHelp");
      }
      this.manual = this.$store.getters.getManual(id);
      if (this.manual && this.validateAccessibility()) {
        if (title !== this.manual.title.split(" ").join("-")) {
          this.completeRoute();
        }
        if (typeof this.manual.date === "number") {
          this.manual.date = new Date(this.manual.date);
          this.manual.dateDisplay = this.manual.date
            .toJSON()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/");
        }
        return;
      }
    }
    this.$destroy();
    this.goTo("Help");
    return;
  },
  computed: {
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    isControl() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.CONTROL);
    },
    isParticipate() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
    }
  },
  methods: {
    validateAccessibility() {
      if(this.isAdmin){
        return true;
      } else if(this.isControl) {
          if (this.manual.enabled && this.manual.title.includes("inst")) {
            return true;
          }
      } else {
          if (this.manual.enabled && this.manual.title.includes("ciudad")) {
            return true;
          }
      }
      return false;
    },
    completeRoute() {
      let params = this.createParams();
      this.$router.replace({ params });
    },
    goTo(componentName, params) {
      this.$router.push({ name: componentName, params });
    },
    createParams() {
      return {
        id: this.manual.cryptedId,
        title: this.manual.title.split(" ").join("-")
      };
    },
    getProfileImage(url) {
      return url ? S_UTIL.getImgURL(url) : require("../../../assets/profile.png");
    },
    toAdmin(manual) {
      this.goTo("HelpAdmin", this.createParams());
    }
  }
};
</script>

<style lang="sass" scoped>
.bordered
  border: 2px solid #0db8bb
  padding: 1rem

.enabled-lbl
  color: green

.disabled-lbl
  color: red

.btn-disabled, .btn-disabled:hover, .btn-disabled:active, .btn-disabled:focus
  cursor: default !important
  opacity: 0.65 !important

  > :not(img)
    opacity: 0.65 !important

.right-btn-container
  text-align: right
  margin-bottom: 20px

.inline-item
  height: 48px

.profile-image
  display: inline-block
  width: 30px
  height: 30px
  margin-left: 5px
  border-radius: 50%
  border: 2px solid #777  
  img
    width: 100%
    height: 100%
    border-radius: 50%
    
.profile-name
  padding-left: 5px
  padding-top: 5px
  width: 95px
  font-size: 1rem
  font-weight: 600

.info-col
  margin: 5px

.centered
  text-align: center

.button-group
  margin: 0px 20px 0px 20px
</style>

<style lang="sass">
.tooltip
  top: 10px !important
</style>