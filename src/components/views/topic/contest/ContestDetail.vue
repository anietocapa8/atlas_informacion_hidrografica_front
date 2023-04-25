<template>
  <div v-if="contest">
    <div class="feed-title">{{ $t('contests.detail.title') }}</div>
    <b-container class="container-form">
      <b-row class="mb-5">
        <b-col cols="12">
          <h3 class="info">{{ $t('contests.detail.description') }}</h3>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col cols="auto">
          <b-row v-show="isAdmin">
            <b-col
              v-bind:class="{ 'enabled-lbl': contest.status, 'disabled-lbl': !contest.status }"
              v-show="isAdmin && isLogged"
            >
              <b>{{ contest.status ? $t('util.enabled') : $t('util.disabled') }}</b>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="h2">
              <b>{{ contest.name }}</b>
            </b-col>
          </b-row>
          <b-row>
            <b-col>{{ contest.date }}</b-col>
          </b-row>
        </b-col>
        <b-col cols="auto" class="ml-auto">
          <sipsder-btn
            v-show="isAdmin"
            class="button-group"
            btnType="edit_pen"
            :text="$t('contests.detail.edit_btn')"
            @onClick="goToCreation(contest.id)"
          />
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col lg="6" v-if="contest.attachments.length">
          <compact-carousel
            :attachments="contest.attachments"
            :fields="carouselFields"
            :ruralModels="[]"
            :delay="20"
          />
        </b-col>
        <b-col :lg="(contest.attachments.length) ? 6 : 12" class="summary">
          <span>
            <b>{{ $t('contests.detail.summary') }}</b>
            {{ contest.summary }}
          </span>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col cols="auto" class="inline-item centered">
          <social-networks-share/>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <report-component :contentId="contest.id" :content-type="REPORT_CONTENT_TYPES.CONTESTS"/>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <print-component>
            <!-- PRINT TEMPLATE -->
            <div>
              <div>
                <h2>{{ contest.name }}</h2>
                <h3>{{ contest.date }}</h3>
              </div>
              <div>
                <h4>{{ contest.summary }}</h4>
              </div>

              <div v-if="contest.attachments.length">
                <div>
                  <img
                    v-if="contest.attachments[0].typeName === 'Video'"
                    :src="getImageYT(contest.attachments[0].url)"
                    :alt="contest.attachments[0].description"
                  >
                  <img
                    v-else
                    :src="getImgURL(contest.attachments[0].url)"
                    :alt="contest.attachments[0].description"
                  >
                </div>
                <div>
                  <div>{{ contest.attachments[0].title }}</div>
                  <div>{{ $t('contests.detail.author') + contest.attachments[0].author }}</div>
                </div>
              </div>

              <div>
                <rich-text-preview :content="contest.generalities"/>
                <rich-text-preview :content="contest.moreInfo"/>
                <div>{{ contest._tags }}</div>
              </div>
            </div>
          </print-component>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <score-component
            :idContent="contest.id"
            :idType="SCORE_CONTENT_TYPE.CONTESTS"
            :likes="contest.likes"
            :dislikes="contest.dislikes"
          />
        </b-col>
        <b-col cols="auto" class="inline-item centered" @click="scrollToComments">
          <span v-if="contest.comments < 1000" class="fa-stack fa-1x">
            <i class="far fa-comment fa-stack-2x"/>
            <span class="fa fa-stack-1x icon-text">{{ contest.comments }}</span>
          </span>
          <span v-else class="centered">
            <i class="far fa-comment fa-2x mr-2"/>
            <span>{{ contest.comments }}</span>
          </span>
        </b-col>
      </b-row>

      <div class="w-100 mb-4 tabs">
        <div class="A">
          <div class="tab-design" :class="{active : tabIndex==0 }" @click="tabIndex = 0">
            <div>
              <span>{{ $t('contests.generalities') }}</span>
            </div>
          </div>
          <div class="tab-design" :class="{active : tabIndex==1 }" @click="tabIndex = 1">
            <div>
              <span>{{ $t('contests.more_info') }}</span>
            </div>
          </div>
        </div>
        <rich-text-preview class="B" v-if="tabIndex==0" :content="contest.generalities"/>
        <rich-text-preview class="B" v-if="tabIndex==1" :content="contest.moreInfo"/>
      </div>

      <comment-component class="comments" :parentId="contest.id" typeParent="contests"/>

      <div class="centered">
        <sipsder-btn
          class="button-group"
          btnType="back"
          :text="$t('contests.detail.rural_housing_btn')"
          @onClick="$router.push({ name: 'RuralHousingIndex' })"
        />
        <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)"/>
      </div>
    </b-container>
  </div>
</template>

<script>
import VAPI from "../../../../http_common";
import {
  SERVICE_NAMES,
  HTTP_STATUS,
  ROLES,
  SCORE_CONTENT_TYPE,
  REPORT_CONTENT_TYPES
} from "../../../../sipsder_constants";
import {PERMISSIONS_TYPES} from "../../../../domain_constants";
import CompactCarousel from "../../event/CompactCarousel";
import RichTextPreview from "../../../shared/RichTextPreview";
import SocialNetworksShare from "../../../shared/social_networks_share/SocialNetworksShare";
import ReportComponent from "../../../shared/ReportComponent";
import ScoreComponent from "../../../shared/ScoreComponent";
import PrintComponent from "../../../shared/PrintComponent";
import CommentComponent from "../../../shared/comment/CommentComponent";
import S_UTIL from "@/util/sipsder_util";

export default {
  components: {
    CompactCarousel,
    RichTextPreview,
    SocialNetworksShare,
    ReportComponent,
    ScoreComponent,
    PrintComponent,
    CommentComponent
  },
  data() {
    return {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      contest: undefined,
      carouselFields: [
        { name: "title", style: ["strong"] },
        { name: "author", prev: this.$t("contests.detail.author") }
      ],
      tabIndex: 0
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    }
  },
  async created() {
    let id = undefined
    if(this.$route.params.id){
      id = this.$route.params.id
    }else{
      id = this.$store.getters.getContestId;
    }
    if (id === undefined) {
      this.$router.go(-1);
      return;
    }
    try {
      const response = await VAPI.get(`${SERVICE_NAMES.CONTEST}/${id}`);
      if (response && response.status === HTTP_STATUS.OK) {
        if (response.data.tags) {
          response.data._tags = response.data.tags.join(", ");
          response.data.tags = response.data.tags.map(tag => ({ text: tag }));
        }
        response.data.date = new Date(response.data.date).toLocaleDateString();
        this.contest = Object.assign({}, this.contest, response.data);
      } else {
        throw new Error("Response error");
      }
    } catch (error) {
      console.error("Error fetching detailed contest info", error);
      this.$router.go(-1);
    }
  },
  methods: {
    getImgURL(url) {
      return S_UTIL.getImgURL(url)
    },
    goToCreation(id) {
      this.$store.dispatch("setContestId", id);
      this.$router.push({ name: "ContestCreate" });
    },
    scrollToComments() {
      this.$scrollTo(".comments", 500);
    },
    isVideoYT(url) {
      return url.indexOf("youtube") === -1;
    },
    getImageYT(url) {
      if (url.indexOf("youtube") !== -1) {
        var res = url.split("/");
        var rel = res[4].split("?");
        return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
      }
      return url;
    }
  }
};
</script>

<style scoped lang='sass'>
@import '../../../../stylesheets/style.sass'

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../assets/title/barra_sola_4.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(12% + 40px)
  padding-top: 20px

.enabled-lbl
  color: green

.disabled-lbl
  color: red

.centered
  display: flex
  justify-content: center
  align-items: center

.summary
  display: flex
  justify-content: center
  align-content: center
  flex-direction: column
  
.inline-item
  height: 48px
  
.icon-text
  font-size: 1.2rem


.tabs
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 70px auto
  min-height: 600px
  .A
    margin-left: 15px
    display: inline-flex
  .B
    padding: 10px
    margin-top: -25px
    background: #fff
    box-shadow: 0px 0px 3px #555
    border-radius: 3px
    z-index: 3
    overflow: hidden
    overflow-y: auto 
    max-height: 600px
    border: 5px solid #fff

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


@media screen  and (max-width: $widthTablet)
  .calendar-grid
    grid-template-columns: 100% !important
  .event-grid
    grid-template-columns: 100% !important
  .filter-admin
    grid-template-columns: 100% !important
  .filter-public
    grid-template-columns: 100% !important
  .tab-design 
    font-size: 1.2rem !important
@media screen  and (max-width: $widthMobile)
  .event-grid
    width: 80% !important
  .tab-design 
    font-size: 1.0rem !important
</style>