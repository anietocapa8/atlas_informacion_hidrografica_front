<template>
  <div @click="emitClick">
    <template v-if="map.title">
      <div class="map-preview border rounded-lg" :class="{ 'pt-3': showTitle, 'pb-3': !displaySimple }">
        <b-container class="d-flex flex-column" fluid>
          <b-row v-if="showTitle" class="mb-2">
            <b-col>
              <h4 class="font-weight-bold text-center text-truncate">{{ map.title }}</h4>
            </b-col>
          </b-row>
          <b-row class="align-items-center" v-if="!showEmbed">
            <b-col
              class="pr-0"
              :md="displaySimple ? 12 : 4"
              :lg="displaySimple ? 12 : 6"
              :class="{ 'pl-0': displaySimple }"
            >
              <img :src="map.thumbnail" :alt="$t('arcgis.thumbnail_alt')" width="100%" />
            </b-col>
            <b-col v-if="!displaySimple" :style="{ 'font-size': displayMap ? '15px' : '12px' }">
              <p>{{ map.snippet }}</p>
              <div v-if="map.tags">
                <span>{{ $t("arcgis.tags") }}</span>
                <div class="tags-div">
                  <template v-for="(tag, i) in map.tags">
                    <b-badge
                      :key="i"
                      class="text-truncate mw-100 ml-1"
                      :class="{ 'selectable-tag': selectable }"
                      variant="info"
                      @click="$emit('change-keyword', tag)"
                    >{{ getTag(tag, i) }}</b-badge>
                  </template>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row v-if="showEmbed && !displaySimple">
            <b-col>
              <iframe
                class="map-display"
                :src="map.url"
                frameborder="0"
                scrolling="yes"
                marginheight="0"
                marginwidth="0"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <b-row v-if="newTabButton" align-h="end">
        <sipsder-btn btn-type="send" :text="$t('arcgis.new_tab')" @onClick="openMapNewTab" />
      </b-row>
    </template>
    <b-container
      v-else-if="error"
      v-b-tooltip.hover
      :title="$t('arcgis.unavailable_map')"
      :class="{ 'p-3': showTitle }"
      class="map-preview border rounded-lg mw-15vw"
      fluid
    >
      <b-row v-if="showTitle" class="mb-2">
        <b-col>
          <h4 class="font-weight-bold text-center text-truncate" v-t="'Mapa no disponible'" />
        </b-col>
      </b-row>
      <b-row class="align-items-center">
        <b-col :class="{ 'p-0': displaySimple }">
          <img :src="defaultMap()" :alt="$t('arcgis.thumbnail_alt')" width="100%" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/**
 * Get sure to have added
 * Consultar /arcgis GET permission
 * for Page where this is used
 **/
import VAPI from "@/http_common";
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";

export default {
  props: {
    value: { type: [Object, String], required: true },
    showTitle: { type: Boolean, default: true },
    displayMap: { type: Boolean, default: false },
    displaySimple: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    newTabButton: { type: Boolean, default: false },
  },
  data() {
    return {
      error: false,
      showEmbed: this.displayMap,
      map: {}
    };
  },
  watch: {
    value(map) {
      this.validateValue(map);
    }
  },
  created() {
    this.validateValue(this.value);
  },
  methods: {
    getTag(tag, el) {
      let t = tag;
      if (tag.length > 40) {
        t = tag.slice(0, 30) + "...";
      }
      return t;
    },
    emitClick(ev) {
      if (ev.target.classList && !ev.target.classList.contains("badge")) {
        this.$emit("click");
      }
    },
    validateValue(map) {
      if (map.title === undefined) {
        let mapPromise;
        if (map instanceof Object) {
          mapPromise = VAPI.get(`${SERVICE_NAMES.ARCGIS}/${map.id}`);
        } else {
          mapPromise = VAPI.get(`${SERVICE_NAMES.ARCGIS}/${map}`);
        }
        mapPromise
          .then(response => {
            if (response && response.status == HTTP_STATUS.OK && response.data.id) {
              this.$emit("input", response.data);
              this.map = response.data;
              this.validateEmbed();
            } else {
              throw new Error("Response error");
            }
          })
          .catch(e => {
            this.$emit("on-error");
            this.error = true;
            console.error(
              "An error has occurred loading map info " + e.toString()
            );
          });
      } else {
        this.map = map;
        this.validateEmbed();
      }
    },
    validateEmbed() {
      if (this.displayMap) {
        this.showEmbed = /^https?:\/\/.*/i.test(this.map.url);
      }
    },
    defaultMap() {
      return require("@/assets/default_map.png");
    },
    openMapNewTab(){
      window.open(this.map.url, '_blank');
    },
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass';
.map-preview
  background: rgba(250, 250, 250, 0.8)

.map-display
  width: 100%
  min-height: 620px

.description-text
  font-size: 11px

.tags-div
  display: inline
  vertical-align: sub

.selectable-tag:hover
  @extend .selectable:hover
  color: #fff
  background-color: #117a8b

.selectable:hover
  cursor: pointer

.mw-15vw
  max-width: 15vw

@media screen  and (max-width: $widthMobile)
  .map-preview
    width: 200px
</style>
