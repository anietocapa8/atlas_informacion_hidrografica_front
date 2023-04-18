<template>
  <b-container class="mt-3" fluid>
    <b-form @submit.prevent="loadMaps">
      <b-row align-v="center">
        <b-col>
          <b-form-group class="mb-0" :label="$t('arcgis.keyword')" label-cols="4" horizontal>
            <b-form-input v-model="query" :placeholder="$t('arcgis.keyword_plho')" />
          </b-form-group>
        </b-col>
        <b-col cols="auto">
          <sipsder-btn class="mr-3" btn-type="search" type="submit" @onClick="search" />
          <sipsder-btn btn-type="clean" @onClick="cleanQuery" />
        </b-col>
      </b-row>
    </b-form>
    <b-row>
      <template v-if="maps.length">
        <h3 class="w-100 my-3 text-center font-weight-bold" v-t="'arcgis.map_gallery'" />
        <b-col cols="12">{{ $t('arcgis.total_results', { totalElements } ) }}</b-col>
        <b-col class="mt-3 px-2" cols="12" sm="12" md="6" lg="4" v-for="(map, k) in maps" :key="k">
          <map-preview
            class="map-preview"
            :class="{ 'selected-map': selected ? selected.id === map.id : false }"
            :value="map"
            selectable
            @click="selected = map"
            @change-keyword="query = $event"
          />
        </b-col>
      </template>
      <b-col class="no-results" v-else>
        <span>{{ $t('arcgis.no_content') }}</span>
      </b-col>
    </b-row>
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
    <b-row v-if="selected" align-h="center">
      <b-col cols="auto">
        <sipsder-btn
          class="justify-content-center"
          btn-type="accept"
          @onClick="$emit('input', selected)"
          :disabled="selected.id === undefined"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VAPI from "@/http_common";
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";
import { ARCGIS_TAGS } from "@/domain_constants";
import MapPreview from "./MapPreview";

export default {
  components: { MapPreview },
  props: {
    ids: Array,
    value: Object,
    tag: {
      type: String,
      validator: tag => Object.values(ARCGIS_TAGS).indexOf(tag) !== -1
    }
  },
  data() {
    return {
      selected: this.value,
      query: undefined,
      params: {
        query: undefined,
        page: 1,
        size: 9,
        tag: this.tag
      },
      totalElements: 0,
      maps: []
    };
  },
  created() {
    this.loadMaps();
  },
  computed: {
    mapIds() {
      return this.ids ? this.ids.join() : undefined;
    }
  },
  watch: {
    value(n) {
      if (this.selected !== n) {
        this.selected = n;
      }
    },
    "params.page"() {
      this.loadMaps();
    },
    ids() {
      this.loadMaps();
    },
    selected(map) {
      this.$emit("selected", map);
    }
  },
  methods: {
    cleanQuery() {
      this.query = undefined;
      this.params.query = this.query;
      this.loadMaps();
    },
    search() {
      this.params.query = this.query;
    },
    loadMaps() {
      this.params.ids = this.mapIds;
      const queryStrings = Object.entries(this.params)
          .filter(entry => entry[1])
          .map(entry => {
            if (entry[0] === "page") entry[1]--;
            return `${entry[0]}=${entry[1]}`;
          }),
        params = `?${queryStrings.join("&")}`;
      VAPI.get(`${SERVICE_NAMES.ARCGIS}${params}`)
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.maps = response.data.data;
            this.totalElements = response.data.meta.totalElements;
          } else if (response && response.status === HTTP_STATUS.NO_CONTENT) {
            this.maps = [];
            this.totalElements = 0;
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          this.$emit("on-error");
          console.error("An error has occurred loading maps " + e.toString());
        });
    }
  }
};
</script>

<style lang="sass" scoped>
@import '@/stylesheets/style.sass'

.map-preview
  &:hover:not(.selected-map)
    background: rgba(245, 245, 245, 0.8)
    border: 1px solid #cdd1d5 !important
    cursor: pointer

  &.selected-map
    border-color: #17a2b8 !important
    background: rgba(23, 162, 184, 0.3) !important

.no-results
  background: rgba(250, 250, 250, 0.8)
  padding: 30px
  font-size: 1.5rem
  border: 3px solid $colorTitle
  border-radius: 1.5rem
</style>