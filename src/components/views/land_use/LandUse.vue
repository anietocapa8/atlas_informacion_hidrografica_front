<template>
  <div class="land-use">
    <sipsder-title :title="$t('land_use.title')" section="configuration" type="admin" />
    <map-preview v-if="map" :value="map" display-map />
  </div>
</template>

<script>
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";
import MapPreview from "@/components/shared/arcgis/MapPreview";
import VAPI from "@/http_common";

export default {
  components: { MapPreview },
  data() {
    return {
      map: undefined
    };
  },
  beforeCreate() {
    VAPI.get(`${SERVICE_NAMES.ARCGIS}/land-use`)
      .then(response => {
        if (response && response.status == HTTP_STATUS.OK) {
          this.map = response.data;
        } else {
          throw new Error("Response error");
        }
      })
      .catch(e => {
        console.error("An error has occurred loading map info " + e.toString());
      });
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.land-use
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.div-90
      width: 90% !important
      margin: 0 auto

@media screen  and (max-width: $widthTablet)
  .div-90
      width: 80% !important

@media screen  and (max-width: $widthMobile)
  .div-90
      width: 80% !important

</style>
