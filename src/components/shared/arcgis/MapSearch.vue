<template>
  <div>
    <b-input-group>
      <b-form-input v-model="selectedMap.title" :placeholder="placeholder" disabled />
      <b-input-group-append v-show="selectedMap.title">
        <b-button variant="danger" :disabled="disabled" @click="selectedMap = {}">
          <i class="fas fa-lg fa-fw fa-times" />
        </b-button>
      </b-input-group-append>
      <b-input-group-append id="search-btn">
        <b-button variant="info" :disabled="disabled" @click="showIndex = !showIndex">
          <i class="fas fa-lg fa-fw fa-search" />
        </b-button>
        <b-tooltip v-if="disabled" target="search-btn">{{ $t('arcgis.unavailable_server') }}</b-tooltip>
      </b-input-group-append>
    </b-input-group>
    <map-preview class="w-50 mt-3 mx-auto" v-if="selectedMap.id" v-model="selectedMap" />
    <b-modal :title="$t('arcgis.map_search')" v-model="showIndex" size="xl" hide-footer>
      <map-index v-model="selectedMap" :tag="tag" @on-error="disableComponent" />
    </b-modal>
  </div>
</template>

<script>
/**
 * Get sure to have added
 * Consultar /arcgis GET permission
 * for Page where this is used
 **/
import { ARCGIS_TAGS } from "@/domain_constants";
import MapIndex from "./MapIndex";
import MapPreview from "./MapPreview";

export default {
  components: { MapIndex, MapPreview },
  props: {
    value: String,
    placeholder: {
      type: String,
      default() {
        return this.$t("arcgis.map_plho");
      }
    },
    tag: {
      type: String,
      validator: tag => Object.values(ARCGIS_TAGS).indexOf(tag) !== -1
    }
  },
  data() {
    return {
      disabled: false,
      selectedMap: { id: this.value },
      showIndex: false
    };
  },
  watch: {
    selectedMap(n) {
      this.showIndex = false;
      this.$emit("input", n.id);
    },
    value(n) {
      this.selectedMap = { id: this.value };
    }
  },
  methods: {
    disableComponent() {
      this.disabled = true;
    }
  }
};
</script>