<template>
  <div v-if="story">
    <div class="feed-title">{{ $t('rurality_stories.detail.title') }}</div>
    <div class="col-90">
      <b-container class="container-form">
        <b-row v-show="isLogged && (isAdmin || isOwner)">
          <b-col class="font-weight-bold">
            <span
              v-bind:class="{
                'enabled-lbl': story.state.id === STORY_STATES.PUBLISHED,
                'disabled-lbl': story.state.id === STORY_STATES.REJECTED,
                'publishing-lbl': story.state.id === STORY_STATES.AWAIT,
              }"
            >
              {{
              story.state.id === STORY_STATES.PUBLISHED
              ? $t('rurality_stories.detail.published')
              : (story.state.id === STORY_STATES.AWAIT
              ? $t('rurality_stories.detail.await')
              : $t('rurality_stories.detail.rejected'))
              }}
              <span
                v-if="story.state.id === STORY_STATES.PUBLISHED"
                v-bind:class="{
              'enabled-lbl': story.enabled,
              'disabled-lbl': !story.enabled
              }"
              >{{ story.enabled ? $t('util.enabled') : $t('util.disabled') }}</span>
            </span>
          </b-col>
          <b-col md="auto" class="text-right">
            <sipsder-btn
              class="button-group"
              btn-type="edit_pen"
              :text="$t('rurality_stories.detail.edit_btn')"
              @onClick="goToCreation(story.encryptedId)"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="h2">
            <b>{{ story.name }}</b>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col>
            <b>{{ $t('rurality_stories.detail.locality') }}</b>
            {{ story.localities }}
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col lg="6" v-if="story.attachments.length">
            <compact-carousel
              :attachments="story.attachments"
              :fields="carouselFields"
              :rural-models="story.ruralModels"
              :fillImage="true"
              :delay="20"
            />
          </b-col>
          <b-col :lg="(story.attachments.length) ? 6 : 12" class="info">
            <span>
              {{ $t('rurality_stories.detail.created_by') }}
              <div class="profile-image">
                <img :src="getProfileImage(story.userImage)" />
              </div>
              {{ story.userInfo }}
              <br />
              {{ $t('rurality_stories.detail.date', {date: story.date}) }}
            </span>
            <span>
              <b>{{ $t('rurality_stories.detail.category') }}</b>
              {{ story.categories }}
            </span>
            <span>
              <b>{{ $t('rurality_stories.detail.summary') }}</b>
              {{ story.summary }}
            </span>
            <span v-if="story.project">
              <b>{{ $t('rurality_stories.detail.project') }}</b>
              {{ story.project.name }}
            </span>
            <span v-if="story.ruralHousing">{{ $t('rurality_stories.detail.rural_housing') }}</span>
          </b-col>
        </b-row>

        <b-row class="mb-4">
          <b-col cols="auto" class="inline-item centered">
            <social-networks-share />
          </b-col>
          <b-col cols="auto" class="inline-item centered">
            <report-component
              v-if="story"
              :content-id="story.id"
              :content-type="REPORT_CONTENT_TYPES.STORIES"
            />
          </b-col>
          <b-col cols="auto" class="inline-item centered">
            <print-component>
              <!-- PRINT TEMPLATE -->
              <div>
                <div>
                  <h2>{{ story.name }}</h2>
                  <h3>{{ story.date }}</h3>
                </div>
                <div>
                  <h4>{{ story.summary }}</h4>
                </div>

                <div v-if="story.attachments.length">
                  <div class="print-image">
                    <img
                      v-if="story.attachments[0].typeName === 'Video'"
                      :src="getImageYT(story.attachments[0].url)"
                      :alt="story.attachments[0].description"
                    />
                    <img
                      v-else
                      :src="getImgURL(story.attachments[0].url)"
                      :alt="story.attachments[0].description"
                    />
                  </div>
                  <div>
                    <div>{{ story.attachments[0].title }}</div>
                    <div>{{ $t('rurality_stories.detail.author') + story.attachments[0].author }}</div>
                  </div>
                </div>

                <div>
                  <rich-text-preview :content="story.description" />
                  <div>{{ story._tags }}</div>
                </div>
              </div>
            </print-component>
          </b-col>
          <b-col cols="auto" class="inline-item centered">
            <score-component
              :id-content="story.encryptedId"
              :id-type="SCORE_CONTENT_TYPE.STORIES"
              :likes="story.likes"
              :dislikes="story.dislikes"
            />
          </b-col>
          <b-col cols="auto" class="inline-item centered" @click="scrollToComments">
            <span v-if="story.comments < 1000" class="fa-stack fa-1x">
              <i class="far fa-comment fa-stack-2x" />
              <span class="fa fa-stack-1x icon-text">{{ story.comments }}</span>
            </span>
            <span v-else class="centered">
              <i class="far fa-comment fa-2x mr-2" />
              <span>{{ story.comments }}</span>
            </span>
          </b-col>
        </b-row>

        <h3 class="font-weight-bold my-4" v-t="'rurality_stories.detail.description_lbl'" />
        <rich-text-preview class="mb-3" :content="story.description" />

        <div class="my-4">{{ $t('rurality_stories.detail.tags_lbl') + story._tags }}</div>

        <comment-component v-if="story" class="comments" :parent-id="story.id" type-parent="stories" />

        <b-row class="mt-4" v-if="stories.length > 0">
          <h3>{{ $t('rurality_stories.detail.related_title') }}</h3>
          <rural-carousel
            :related="stories"
            image-field="attachment"
            type-field="attachmentType"
            @toDetail="toRelatedStory"
          >
            <template slot="info" slot-scope="{ item }">
              <span>
                <b>{{ item.name }}</b>
              </span>
              <br />
              <small>{{ $t('rurality_stories.detail.category') + item.categories }}</small>
              <br />
              <small>{{ $t('rurality_stories.detail.locality') + item.localities }}</small>
            </template>
          </rural-carousel>
        </b-row>

        <div class="centered">
          <sipsder-btn
            class="button-group"
            btn-type="back"
            :text="$t('rurality_stories.detail.redirect_stories')"
            @onClick="$router.push({ name: 'CommunityStory' })"
          />
          <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)" />
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VAPI from "@/http_common";
import {
  SERVICE_NAMES,
  HTTP_STATUS,
  SCORE_CONTENT_TYPE,
  REPORT_CONTENT_TYPES
} from "@/sipsder_constants";
import { PERMISSIONS_TYPES, STORY_STATES, RURALMODEL } from "@/domain_constants";
import S_UTIL from "@/util/sipsder_util";
import CompactCarousel from "../../event/CompactCarousel";
import RuralCarousel from "../../../shared/RuralCarousel";
import RichTextPreview from "../../../shared/RichTextPreview";
import SocialNetworksShare from "../../../shared/social_networks_share/SocialNetworksShare";
import ReportComponent from "../../../shared/ReportComponent";
import ScoreComponent from "../../../shared/ScoreComponent";
import PrintComponent from "../../../shared/PrintComponent";
import CommentComponent from "../../../shared/comment/CommentComponent";

export default {
  components: {
    CompactCarousel,
    RuralCarousel,
    RichTextPreview,
    SocialNetworksShare,
    ReportComponent,
    ScoreComponent,
    PrintComponent,
    CommentComponent
  },
  data() {
    return {
      STORY_STATES,
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      story: undefined,
      stories: [],
      ruralModels: [],
      ruralHousingModels: [],
      carouselFields: [
        { name: "title", style: ["strong"] },
        { name: "author", prev: this.$t("rurality_stories.detail.author") }
      ]
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    currentUserId() {
      return this.$store.getters.getCurrentUser
        ? this.$store.getters.getCurrentUser.id
        : undefined;
    },
    isOwner() {
      return this.story ? this.story.userId === this.currentUserId : undefined;
    }
  },
  created() {
    const id = this.$route.params.id;
    if (id === undefined) {
      this.$router.go(-1);
      return;
    }
    this.getStories();
    this.getStory(id);
    this.getRuralModels();
  },
  methods: {
    async getStory(id) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.STORY}/${id}`);
        
        if (response && response.status === HTTP_STATUS.OK) {
          if (
            !this.isAdmin &&
            (!this.isLogged || this.currentUserId !== response.data.userId) &&
            (!response.data.enabled ||
              response.data.state.id !== STORY_STATES.PUBLISHED)
          ) {
            this.$router.push({ name: "CommunityStoriesIndex" });
          }
          if (response.data.tags) {
            response.data._tags = response.data.tags.join(", ");
          }
          response.data.date = moment(new Date(response.data.date)).format(
            "DD/MM/YYYY"
          );
          response.data.localities = response.data.localities
            .map(l => l.name)
            .join(", ");
          response.data.categories = response.data.categories
            .map(c => c.name)
            .join(", ");
          response.data.userInfo =
            response.data.userName + ", " + response.data.userType;
          if (
            response.data.userType.includes("Institucional") &&
            response.data.userEntity
          ) {
            response.data.userInfo += ", " + response.data.userEntity;
          }
          if (this.ruralHousingModels.length) {
            let storyRuralModels = response.data.ruralModels.map(r => r.id);
            response.data.ruralHousing = this.ruralHousingModels.every(r =>
              storyRuralModels.includes(r)
            );
          }
          this.story = response.data;
        } else {
          throw new Error("Response error");
        }
      } catch (error) {
        console.error("Error fetching detailed story info", error);
        this.$router.go(-1);
      }
    },
    goToCreation(storyId) {
      this.$router.push({ name: "CommunityStoryCreate", params: { id: storyId } });
    },
    scrollToComments() {
      this.$scrollTo(".comments", 500);
    },
    toRelatedStory(story) {
      let storyId = story.encryptedId;
      this.$router.push({ name: "CommunityStoryDetail", params: { id: storyId } });
    },
    getProfileImage(url) {
      return url ? this.getImgURL(url) : require("../../../../assets/profile.png");
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
    },
    getStories() {
      VAPI.get(`/${SERVICE_NAMES.STORY}`)
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.stories = response.data.data;
          } else if (response && response.status === HTTP_STATUS.NO_CONTENT) {
            this.stories = [];
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred loading stories " + e.toString());
        });
    },
    getRuralModels() {
      VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`)
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.setRuralValues(response.data.data);
            for (let story of this.stories) {
              story.ruralModels = story.ruralModels.map(
                r => this.ruralModels[r]
              );
            }
            if (this.story) {
              let storyRuralModels = this.story.ruralModels.map(r => r.id);
              this.story.ruralHousing = this.ruralHousingModels.every(r =>
                storyRuralModels.includes(r)
              );
            }
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error(
            "An error occurred loading rural models " + e.toString()
          );
        });
    },
    setRuralValues(children) {
      for (let ruralModel of children || []) {
        this.ruralModels[ruralModel.id] = ruralModel;
        if (ruralModel.id === RURALMODEL.HOUSING) {
          if (ruralModel.children) {
            this.ruralHousingModels = ruralModel.children.map(r => r.id);
          } else {
            this.ruralHousingModels = [RURALMODEL.HOUSING];
          }
        }
        this.setRuralValues(ruralModel.children);
      }
    },
    getImgURL(url) {
      return S_UTIL.getImgURL(url);
    }
  }
};
</script>

<style scoped lang='sass'>
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

.print-image
  max-width: 50%

.enabled-lbl
  color: green

.publishing-lbl
  color: orange

.disabled-lbl
  color: red

.centered
  display: flex
  justify-content: center
  align-items: center

.info
  display: flex
  justify-content: center
  align-content: center
  flex-direction: column
  
.profile-image
  display: inline-block
  width: 30px
  height: 30px
  margin-left: 5px
  border-radius: 50%
  border: 2px solid #777  
  vertical-align: middle
  img
    width: 100%
    height: 100%
    border-radius: 50%
    vertical-align: baseline

.inline-item
  height: 48px
  
.icon-text
  font-size: 1.2rem
  
</style>