<template>
  <div>
    <div class="feed-title">{{$t( 'rurality_stories.index.title' )}}</div>
    <div>
      <b-container class="col-90 marginless">
        <b-row class="mb-3">
          <b-col>
            <rich-text-preview :content="description"  />
          </b-col>
        </b-row>
      </b-container>

      <b-container fluid class="filter-container my-4" v-if="loadedDomains">
        <b-row>
          <b-col class="legend mb-2" lg="2">{{ $t('rurality_stories.index.filter') }}</b-col>
          <b-col lg="2">
            <b-form-group v-if="isLogged && (isAdmin || owner)">
              <v-select
                v-model="filter.enabled"
                :placeholder="$t('rurality_stories.index.enabled')"
                :options="opts.enabled"
                index="id"
                label="state"
                class="font-size-14"
              />
            </b-form-group>
          </b-col>
          <b-col lg="2">
            <b-form-group v-if="isLogged && (isAdmin || owner)">
              <v-select
                v-model="filter.state"
                :placeholder="$t('rurality_stories.index.status')"
                :options="opts.states"
                index="id"
                label="state"
                class="font-size-14"
              />
            </b-form-group>
          </b-col>
          <b-col lg="3">
            <b-form-group>
              <v-select
                v-model="filter.category"
                :placeholder="$t('rurality_stories.index.category')"
                :options="opts.categories"
                index="id"
                label="name"
                class="font-size-14"
              />
            </b-form-group>
          </b-col>
          <b-col lg="3">
            <b-form-group>
              <b-form-input
                :placeholder="$t('rurality_stories.index.keyword')"
                v-model="filter.q"
                v-validate="'max:70'"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="9">
            <b-form-group>
              <treeselect
                v-model="filter.ruralModel"
                :options="opts.ruralModels"
                :placeholder="$t('rurality_stories.index.rural_model')"
                disable-branch-nodes
              >
                <label slot="option-label" slot-scope="{ node }">
                  <img v-if="node.raw.url" :src="getImgURL(node.raw.url)" class="dot" />
                  <span v-else-if="node.raw.color" class="dot" :style="{ background: node.raw.color }"></span>
                  <span>{{ node.label.split('/')[0] }}</span>
                  <span
                    class="grey-label-text"
                    v-if="node.label.split('/')[1] !== undefined"
                  >{{ ' / ' + node.label.split('/')[1] }}</span>
                </label>
              </treeselect>
            </b-form-group>
          </b-col>
          <b-col lg="3">
            <b-form-group>
              <v-select
                v-model="filter.locality"
                :placeholder="$t('rurality_stories.index.locality')"
                :options="opts.localities"
                index="id"
                label="name"
                class="font-size-14"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="9">
            <b-form-group>
              <v-select
                v-model="filter.project"
                :placeholder="$t('rurality_stories.index.project')"
                :options="opts.projects"
                index="id"
                label="name"
                class="font-size-14"
              />
            </b-form-group>
          </b-col>
          <b-col class="radio-buttons">
            <label
              class="form-check-label"
              for="rural_housing_radio"
            >{{ $t('rurality_stories.index.rural_housing') }}</label>
            <input
              id="rural_housing_radio"
              class="form-check-input"
              type="radio"
              value="true"
              @click="filter.ruralHousing = !filter.ruralHousing"
              v-model="filter.ruralHousing"
            />
          </b-col>
          <b-col class="radio-buttons" v-if="isLogged && (isAdmin || owner)">
            <label
              class="form-check-label"
              for="own_stories_radio"
            >{{ $t('rurality_stories.index.own_stories') }}</label>
            <input
              id="own_stories_radio"
              class="form-check-input"
              type="radio"
              value="true"
              @click="filter.own = !filter.own"
              v-model="filter.own"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-center">
            <sipsder-btn class="button-group" btn-type="search" @onClick="search" />
            <sipsder-btn class="button-group" btn-type="clean" @onClick="resetFilter" />
          </b-col>
        </b-row>
      </b-container>
      <b-container fluid class="container-margin container-form">
        <b-row v-if="meta">
          <b-col v-if="meta.totalElements === 1" v-t="'rurality_stories.index.found_result'" />
          <b-col
            v-if="meta.totalElements > 1"
            v-t="{ path: 'rurality_stories.index.found_results', args: { amount: meta.totalElements } }"
          />
          <b-col class="align-right" cols="2">
            <b-form-group>
              {{ $t('rurality_stories.index.order_by') }}
              <v-select v-model="filter.orderBy" :options="opts.orders" index="id" @input="search" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-right">
            <sipsder-btn
              v-show="isLogged"
              btn-type="add"
              :text="$t('rurality_stories.index.add_story')"
              @onClick="toStoryCreation"
            />
          </b-col>
        </b-row>
        <template v-if="stories.length && ruralModels.length">
          <b-row id="pagination-top">
            <b-col>
              <b-pagination
                class="justify-content-md-center"
                :total-rows="meta.totalElements"
                v-model="filter.page"
                v-if="meta !== undefined"
                :per-page="filter.size"
              />
            </b-col>
          </b-row>
          <div class="item-rows">
            <div v-for="(story, k) in stories" :key="k" class="py-4 px-5 index-item">
              <b-row v-bind:style="{ 'flex-direction': k % 2 === 0 ? '' : 'row-reverse' }" align-v="center">
                <b-col md="4">
                  <img
                    :style="{'border-color': ruralModels[story.ruralModels[0]].color}"
                    class="clickable rural-img img-resized"
                    :src="story.attachmentType === 'Video' ? getImageYT(story.attachment) : getImgURL(story.attachment)"
                    @click="toDetail(story.encryptedId)"
                  />
                  <b-col class="colors-container mt-1" cols="auto" v-if="story.ruralModels">
                    <b-row align-h="end">
                      <div
                        v-for="(r, j) in story.ruralModels"
                        :key="j"
                        class="colors"
                        :style="{ background: ruralModels[r].color }"
                        v-b-tooltip.hover="ruralModels[r].label"
                      ></div>
                    </b-row>
                  </b-col>
                </b-col>
                <b-col md="8">
                  <div
                    class="text-right"
                    v-show="isLogged && (isAdmin || story.userId === currentUserId)"
                  >
                    <sipsder-btn
                      btn-type="edit_pen"
                      class="small-btn"
                      @onClick="editStory(story.encryptedId)"
                      text
                    />
                  </div>
                  <div
                    class="font-weight-bold text-uppercase"
                    v-if="(isLogged && isAdmin) || (isLogged && story.userId === currentUserId)"
                  >
                    <span
                      v-if="story.state.id === STORY_STATES.PUBLISHED"
                      v-bind:class="{ 'green-lbl': story.enabled, 'red-lbl': !story.enabled }"
                    >{{ story.enabled ? $t('util.enabled') : $t('util.disabled') }}</span>
                    <span
                      v-else
                      :class="{
                    'orange-lbl': story.state.id === STORY_STATES.AWAIT,
                    'red-lbl': story.state.id === STORY_STATES.REJECTED
                  }"
                    >{{ story.state.id === STORY_STATES.AWAIT ? $t('rurality_stories.index.await') : $t('rurality_stories.index.rejected') }}</span>
                  </div>
                  <span class="font-weight-bold">{{ $t('rurality_stories.index.category_lbl') }}</span>
                  {{ story.categories }}
                  <br />
                  <span class="font-weight-bold">{{ $t('rurality_stories.index.author_lbl') }}</span>
                  {{ story.userName }}, {{ story.date }}
                  <br />
                  <span class="font-weight-bold">{{ $t('rurality_stories.index.locality_lbl') }}</span>
                  {{ story.localities }}
                  <br />
                  <span
                    class="font-weight-bold h2 clickable"
                    @click="toDetail(story.encryptedId)"
                  >{{ story.name }}</span>
                  <br />
                  <span>{{ story.summary }}</span>
                  <br />
                  <template v-if="story.project">
                    <span class="font-weight-bold">{{ $t('rurality_stories.index.project_lbl') }}</span>
                    {{ story.project }}
                  </template>
                  <br />
                  <span
                    v-if="opts.ruralModels && relatedRuralHousing(story.ruralModels)"
                  >{{ $t('rurality_stories.index.rural_housing_lbl') }}</span>
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row>
            <b-col>
              <b-pagination
                class="mt-3 justify-content-md-center"
                :total-rows="meta.totalElements"
                v-model="filter.page"
                v-if="meta !== undefined"
                :per-page="filter.size"
              />
            </b-col>
          </b-row>
        </template>
        <div v-else class="no-results">{{ $t('rurality_stories.index.no_stories') }}</div>
      </b-container>

      <div class="text-center">
        <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)" />
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import vSelect from "vue-select";
import moment from "moment";
import RichTextPreview from "@/components/shared/RichTextPreview";
import { SERVICE_NAMES, HTTP_STATUS } from "@/sipsder_constants";
import {
  GEOGRAPHY_TYPE,
  STORY_STATES,
  PERMISSIONS_TYPES,
  RURALMODEL,
} from "@/domain_constants";
import VAPI from "@/http_common";
import S_UTIL from "../../../../util/sipsder_util";

export default {
  components: {
    RichTextPreview,
    Treeselect,
    vSelect
  },
  data() {
    return {
      STORY_STATES,
      loadedDomains: false,
      ruralHousingModels: [],
      ruralModels: [],
      opts: {
        categories: [],
        localities: [],
        ruralModels: [],
        states: [],
        enabled: [
          {
            id: "true",
            state: this.$t("rurality_stories.index.enabled")
          },
          {
            id: "false",
            state: this.$t("rurality_stories.index.disabled")
          }
        ],
        projects: [],
        pageCount: 0,
        orders: [
          {
            id: "date,desc",
            label: this.$t("rurality_stories.index.date") + " ↓"
          },
          {
            id: "date,asc",
            label: this.$t("rurality_stories.index.date") + " ↑"
          },
          {
            id: "name,asc",
            label: this.$t("rurality_stories.index.name") + " ↓"
          },
          {
            id: "name,desc",
            label: this.$t("rurality_stories.index.name") + " ↑"
          },
          {
            id: "categories,asc",
            label: this.$t("rurality_stories.index.category") + " ↓"
          },
          {
            id: "categories,desc",
            label: this.$t("rurality_stories.index.category") + " ↑"
          },
          {
            id: "userName,desc",
            label: this.$t("rurality_stories.index.author") + " ↓"
          },
          {
            id: "userName,asc",
            label: this.$t("rurality_stories.index.author") + " ↑"
          }
        ]
      }
    };
  },
  computed: {
    owner() {
      if (this.$store.getters.getStoryGeneral)
        return this.$store.getters.getStoryGeneral.isUserOwner;
      return undefined;
    },
    description() {
      if (this.$store.getters.getStoryGeneral)
        return this.$store.getters.getStoryGeneral.description;
      this.$store.dispatch("getStoryGeneral");
      return undefined;
    },
    stories() {
      return this.$store.getters.getStories.map(story => {
        if (typeof story.date === "number")
          story.date = moment(new Date(story.date)).format("DD/MM/YYYY");
        if (story.categories instanceof Array)
          story.categories = story.categories.join(", ");
        if (story.localities instanceof Array)
          story.localities = story.localities.join(", ");
        return story;
      });
    },
    meta() {
      return this.$store.getters.getStoriesMeta;
    },
    page() {
      return this.$store.getters.getStoriesPage;
    },
    currentUserId() {
      return this.$store.getters.getCurrentUser
        ? this.$store.getters.getCurrentUser.id
        : undefined;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    filter: {
      get() {
        return this.$store.getters.getStoriesFilter;
      },
      set(value) {
        this.$store.dispatch("setStoriesFilter", value);
      }
    }
  },
  watch: {
    "filter.page": function() {
      this.loadStories();
    }
  },
  created() {
    this.getDomains();
    this.loadStories();
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    relatedRuralHousing(ruralModels) {
      return this.ruralHousingModels.every(r => ruralModels.includes(r));
    },
    search() {
      this.filter.page = 1;
      this.loadStories();
    },
    async loadStories() {

      if(this.$route.query.housing && (this.pageCount == undefined || this.pageCount == 0) ){
        this.filter.ruralHousing = true
      }
      if(this.$route.query.idProject != undefined && this.$route.query.idProject != null){
        this.filter.project = this.$route.query.idProject
      }
      await this.$store.dispatch("getStories");
      this.$scrollTo("#pagination-top", { offset: -100 });

      this.pageCount += 1
    },
    resetFilter() {
      this.$store.dispatch("removeStoriesFilter");
    },
    getDomains() {
      const ruralModelPromise = VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
      const projectPromise = VAPI.get(`/${SERVICE_NAMES.PROJECT}/simple`);
      const geographyPromise = VAPI.get(
        `${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`
      );
      const statePromise = VAPI.get(`/${SERVICE_NAMES.STORY}/states`);
      const categoryPromise = VAPI.get(`/${SERVICE_NAMES.STORY}/categories`);

      ruralModelPromise.then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.toRuralFormat(response.data.data);
          this.opts.ruralModels = response.data.data;
        } else {
          throw new Error("Response error");
        }
      });
      projectPromise.then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.opts.projects = response.data;
        } else {
          throw new Error("Response error");
        }
      });
      geographyPromise.then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.opts.localities = response.data;
        } else {
          throw new Error("Response error");
        }
      });
      categoryPromise.then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.opts.categories = response.data;
        } else {
          throw new Error("Response error");
        }
      });
      statePromise.then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.opts.states = response.data;
        } else {
          throw new Error("Response error");
        }
      });
      Promise.all([
        ruralModelPromise,
        projectPromise,
        geographyPromise,
        statePromise,
        categoryPromise
      ])
        .then(() => {
          this.loadedDomains = true;
        })
        .catch(e => {
          console.error("An error ocurred loading domains" + e.toString());
        });
    },
    toRuralFormat(list) {
      for (let ruralModel of list || []) {
        this.ruralModels[ruralModel.id] = ruralModel;
        if (ruralModel.id === RURALMODEL.HOUSING) {
          if (ruralModel.children) {
            this.ruralHousingModels = ruralModel.children.map(r => r.id);
          } else {
            this.ruralHousingModels = [RURALMODEL.HOUSING];
          }
        }
        this.toRuralFormat(ruralModel.children);
      }
    },
    editStory(storyId) {
      this.$router.push({
        name: "CommunityStoryCreate",
        params: { id: storyId }
      });
    },
    getImageYT(url) {
      var res = url.split("/");
      var rel = res[4].split("?");
      return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
    },
    toStoryCreation() {
      this.$router.push({ name: "CommunityStoryCreate" });
    },
    toDetail(storyId) {
      this.$router.push({
        name: "CommunityStoryDetail",
        params: { id: storyId }
      });
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

.container-margin
  margin-left: 3.5%
  margin-right: 3.5%
  width: 93%
  padding: 0
  
.marginless
  max-width: none
  width: 94%

.filter-container
  @extend .container-margin
  padding: 2rem
  color: #fff
  background: $colorTitleDark
  border-radius: 1.5rem

  .legend
    font-weight: bold
    font-family: "Open Sans", sans-serif
    font-size: 2rem

  .form-group
    color: #495057;
    font-size: 17px
    border-radius: 0.5rem
    background-color: white

  .radio-buttons
    padding-top: 8px
    margin-right: 1.5rem

  .form-check-label
    font-size: 15px

  .form-check-input
    margin-top: 0.3rem
    margin-left: 0.5rem

.dot
  height: 16px
  width: 16px
  border-radius: 50%
  margin-right: 5px
  display: inline-block

.grey-label-text
  color: grey

.no-results
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem

.item-rows
  border: 3px solid $colorTitle
  border-radius: 1.5rem

.index-item:not(:last-child)
  border-bottom: 3px solid $colorTitle
  border-image-source: linear-gradient(90deg, #0db8bb 0%, #e4f7f8 50%, #0db8bb 100%)
  border-image-slice: 1

.clickable:hover
  cursor: pointer
  font-weight: 600
  text-decoration: underline

.colors-container
  height: 30px

  .colors
    margin: 0px 5px 0px 5px
    width: 20px
    height: 20px
    border-radius: 50%
    border: 3px solid transparent

.rural-img
  border-style: solid
  border-width: 3px

.img-resized
  max-width: 100%
  max-height: 500px
  object-fit: contain

.red-lbl
  color: red

.orange-lbl
  color: orange

.green-lbl
  color: green
</style>

<style lang="sass">   
.small-btn > *
  height: 4rem !important

.vue-treeselect__control
  height: 42px

.vue-treeselect__placeholder
  padding: 0.375rem 0.75rem
</style>
