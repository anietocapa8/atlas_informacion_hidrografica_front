<template>
  <div class="geo-viewer">
    <div class="feed-title" v-t="'geo_viewer.title'" />
    <b-container fluid class="div-90">
      <b-row>
        <b-col md="3" class style="margin-bottom: 5px;">
          <b-form-group>
            <b-form-input
              :placeholder="$t('geo_viewer.keyword')"
              v-model="filterQ"
              v-validate="'max:70'"
              name="keyword"
              :data-vv-as="$t('geo_viewer.keyword')"
            />
          </b-form-group>
          <div class="collapse-menu">
            <tree-menu
              v-for="(r,i) in filterRuralModel"
              :key="i"
              :node="r"
              @emitId="ruralModelId = $event"
              :isSearching="isSearching"
            />
          </div>
        </b-col>
        <b-col class="tabs">
          <div class="A">
            <div class="tab-design" :class="{active: tabIndex==='figures'}" @click="tabIndex='figures'">
              <div>
                <span v-t="'geo_viewer.figure_tab'" />
              </div>
            </div>
            <div class="tab-design" :class="{active: tabIndex==='indicators'}" @click="tabIndex='indicators'">
              <div>
                <span v-t="'geo_viewer.indicator_tab'" />
              </div>
            </div>
            <div class="tab-design" :class="{active: tabIndex==='indexes'}" @click="tabIndex='indexes'">
              <div>
                <span v-t="'geo_viewer.index_tab'" />
              </div>
            </div>
          </div>
          <div class="B">
            <geo-index :rural-model="ruralModelSelected" :tab-index="tabIndex" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";
import GeoIndex from "./GeoIndex";
import TreeMenu from "@/components/shared/TreeMenu.vue";
import VAPI from "@/http_common";

export default {
  components: {
    GeoIndex,
    TreeMenu,
  },
  data() {
    return {
      isSearching: false,
      filterQ: "",
      ruralModelTree: null,
      ruralModelId: null,
      ruralModelSelected: null,
      tabIndex: "figures",
    };
  },
  computed: {
    filterRuralModel() {
      const result = [];
      if (this.ruralModelTree === null) return null;
      if (this.filterQ === "") return this.ruralModelTree;
      const getAll = (p) => {
        let aux = false;
        JSON.parse(JSON.stringify(p)).forEach(e => {
          if (e.children) aux = getAll(e.children);
          if (
            e.label.toLowerCase().includes(this.filterQ.toLowerCase()) ||
            aux
          ) {
            e.label = e.label
              .toLowerCase()
              .replace(
                this.filterQ.toLowerCase(),
                '<span style="font-weight:bold">' +
                  this.filterQ.toLowerCase() +
                  "</span>"
              );
            result.push(e);
          }
        });
      };
      getAll(this.ruralModelTree);
      return result;
    }
  },
  watch: {
    filterQ(val) {
      if (val === "") this.isSearching = false;
      else this.isSearching = true;
    },
    ruralModelId(value) {
      this.getModel(value);
    },
  },
  async beforeCreate() {
    try {
      const response = await VAPI.get(
        `${SERVICE_NAMES.RURAL_MODEL}/tree?active=true`
      );
      this.ruralModelTree = response.data.data;
    } catch (error) {
      console.error("Error fetching rural model tree " + error.toString());
    }
    if (this.$route.params.ruralId) {
      this.ruralModelId = this.$route.params.ruralId;
    }
  },
  methods: {
    async getModel(id) {
      try {
        const response = await VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/${id}`);
        if (response.status === HTTP_STATUS.OK) {
          this.ruralModelSelected = response.data;
          this.tabIndex = "figures";
        } else {
          throw new Error("Response error")
        }
      } catch (error) {
        console.error("Error fetching rural model " + error.toString());
      }
    },
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.collapse-menu
  height: auto
  background: #fff 
  box-shadow: 0px 0px 3px #333
  border-top: 10px solid $colorTitle
  border-bottom: 10px solid $colorTitle

.geo-viewer
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_2.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 110%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 5%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
    text-decoration: none
    color: #fff

.tabs
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 70px auto
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
.div-90
      width: 90% !important
      margin: 0 auto
@media screen  and (max-width: $widthDesktop)
  .tab-design
    font-size: 1.1rem !important
  .geo-viewer
    font-size: 1.2rem !important
    grid-template-columns: 30% 70% !important

@media screen  and (max-width: $widthTablet)
  .tab-design
    font-size: 1.2rem !important
  .geo-viewer
    grid-template-columns: 100% !important
    grid-template-areas: 'a' 'b' 'c' !important
  .div-90
      width: 80% !important
  .tab-design
      font-size: 1.1rem !important
@media screen  and (max-width: $widthMobile)
  .div-90
      width: 80% !important
  .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
  .tabs
      min-height: unset !important
      grid-template-rows: unset !important
      .A
          display: flex !important
          flex-wrap: wrap
          width: 100%
          margin-left: 0 !important
      .B
          width: 100%
  .tab-design  
      height: 70px !important
      max-width: unset !important
      margin: 5px
      width: 40%
      div
          height: 70px !important
          span
              height: 70px !important
</style>
