<template>
  <div class="geo-index">
    <div v-show="!selected" class="item-index">
      <div class="title-c text-center mb-3">
        <h1 v-t="'geo_viewer.info'" />
      </div>
      <div v-if="params.ruralModel" class="text-center">{{ ruralModel.name }}</div>
      <div class="mt-3">
        <template v-if="list">
          <h3 v-t="'geo_viewer.filter_search'" />
          <b-form @submit.prevent="getItems">
            <b-row align-v="center">
              <b-col>
                <b-form-group
                  class="mb-0"
                  :label="$t('geo_viewer.keyword')"
                  label-cols="4"
                  horizontal
                >
                  <b-form-input
                    v-model="params.keyword"
                    :placeholder="$t('geo_viewer.keyword_plho')"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="auto">
                <sipsder-btn class="mr-3" btn-type="search" type="submit" />
                <sipsder-btn btn-type="clean" @onClick="clean" />
              </b-col>
            </b-row>
          </b-form>
          <b-row v-if="list.length">
            <b-col cols="12" v-t="{path: 'geo_viewer.total_results', args: { totalElements }}" />
            <b-col
              v-for="(item, i) in list"
              :key="i"
              sm="12"
              md="6"
              lg="4"
              class="mt-3"
              @click="onSelect(item)"
            >
              <div 
                class="p-3 item border rounded-lg d-flex flex-column"
                style="cursor: pointer"
              >
                <div class="h4 font-weight-bold text-center mb-3" v-t="item.name" />
                <map-preview :value="item.mapUrl" :show-title="false" display-simple />
              </div>
            </b-col>
          </b-row>
          <span v-else v-t="`geo_viewer.no_${tabIndex}`" />
        </template>
      </div>
      <b-row align-h="center">
        <b-col cols="auto">
          <b-pagination
            class="mt-3"
            v-model="params.page"
            :total-rows="totalElements"
            :per-page="params.size"
          />
        </b-col>
      </b-row>
    </div>
    <div v-if="selected">
      <map-preview :value="selected.mapUrl" display-map />
      <b-row align-h="between">
        <b-col cols="auto">
          <sipsder-btn
            :text="$t('geo_viewer.back')"
            btn-type="back"
            @onClick="selected = undefined"
          />
        </b-col>
        <b-col cols="auto">
          <sipsder-btn :text="$t('geo_viewer.detail')" btn-type="link" @onClick="toMapDetail" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";
import MapPreview from "@/components/shared/arcgis/MapPreview";
import VAPI from "@/http_common";

export default {
  components: {
    MapPreview
  },
  props: {
    ruralModel: Object,
    tabIndex: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      params: {
        ruralModel: undefined,
        keyword: undefined,
        sort: "updateDate,desc",
        page: 1,
        size: 9,
        status: true
      },
      list: undefined,
      selected: undefined,
    };
  },
  watch: {
    ruralModel(value) {
      if (value) {
        this.$set(this.params, "ruralModel", value.id);
      } else {
        this.$set(this.params, "ruralModel", undefined);
      }
      this.resetVariables();
    },
    tabIndex(value) {
      this.resetVariables();
    },
    "params.page"(value) {
      this.getItems();
    }
  },
  created() {
    this.resetVariables();
  },
  methods: {
    clean() {
      this.$set(this.params, "ruralModel", undefined);
      this.resetVariables();
    },
    resetVariables() {
      this.list = [];
      this.selected = undefined;
      this.totalElements = 0;
      this.params.page = 1;
      this.params.keyword = undefined;
      this.params.status = this.tabIndex === "indicators" ? 1 : true;
      this.getItems();
    },
    async getItems() {
      const queryStrings = Object.entries(this.params)
          .filter(entry => entry[1])
          .map(entry => {
            if (entry[0] === "page") entry[1]--;
            return `${entry[0]}=${entry[1]}`;
          }),
        params = `?${queryStrings.join("&")}`;
      try {
        const response = await VAPI.get(
          `${SERVICE_NAMES.RURAL_INDICATORS}/all/${this.tabIndex}${params}`
        );
        if (response.status === HTTP_STATUS.OK) {
          this.list = response.data.data;
          this.totalElements = response.data.meta.totalElements;
        } else if (response.status === HTTP_STATUS.NO_CONTENT) {
          this.list = [];
          this.totalElements = 0;
        } else {
          throw new Error("Response error");
        }
      } catch (error) {
        console.error(`Error fetching rural ${this.tabIndex} tree`, error);
      }
    },
    onSelect(tabItem) {
      this.selected = tabItem;
    },
    onBack() {
      onSelect(null);
    },
    toMapDetail() {
      let routeName;
      switch (this.tabIndex) {
        case "figures":
          routeName = "RuralFigureDetail";
          break;
        case "indicators":
          routeName = "RuralIndicatorDetail";
          break;
        case "indexes":
          routeName = "RuralIndexDetail";
          break;
      }
      this.$router.push({
        name: routeName,
        params: { id: this.selected.id }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.item-index
  background: rgba(250, 250, 250, 0.8)
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem

.item
  background: rgba(250, 250, 250, 0.8)
</style>
