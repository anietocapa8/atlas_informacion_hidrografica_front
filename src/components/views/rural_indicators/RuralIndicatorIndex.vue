<template>
  <div class="rural-indicators">
    <div class="feed-title">{{$t( 'rural_indicators.index.title' )}}</div>
    <div class="legal-note">
        <note-rich-text :showEdition="isAdministrator" :module="MODULES.RURAL_INDICATORS" 
            keyVal="general" :textPenEdition="$t('rural_indicators.index.edit_legal_note')">
        </note-rich-text>
    </div>
    <div style="text-align:right" class="div-90">
        <sipsder-btn btnType="add" :text="$t('rural_indicators.index.add_element')" @onClick="showModal('addElementModal')" v-if="isAdministrator"></sipsder-btn>
    </div>
    <div class="text content-panel A2 div-90">
        <div class="A">
            <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{ $t('rural_indicators.option_figure') }}</span></div></div>
            <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{ $t('rural_indicators.option_indicator') }}</span></div></div>
            <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{ $t('rural_indicators.option_index') }}</span></div></div>
            <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)"><div><span>{{ $t('rural_indicators.option_bulletin') }}</span></div></div>
        </div>
        <div v-if="tabIndex == 0" class="B">
            <s-figure-list></s-figure-list>
        </div>
        <div v-if="tabIndex == 1" class="B">
            <s-indicator-list></s-indicator-list>
        </div>
        <div v-if="tabIndex == 2" class="B">
            <s-index-list></s-index-list>
        </div>
        <div v-if="tabIndex == 3" class="B">
            <s-bulletin-list></s-bulletin-list>
        </div>
    </div>
    <div class="btn-container">
        <sipsder-btn btnType="back" :text="$t( 'rural_indicators.detail.figure.back' )" @onClick="$router.go(-1)"></sipsder-btn>
    </div>
    <!-- Begin of add element modal -->
    <b-modal ref="addElementModal" :title="$t( 'rural_indicators.index.popup.title' )" hideFooter size="lg">
        <b-row align-h="center">
            <b-col cols="10">
                <b-form-group :label="$t('rural_indicators.type')" label-class="font-weight-bold">
                    <b-form-select v-model="selectedTypeOptions" :options="typeOptions"/>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row class="btn-container" align-h="center">
            <sipsder-btn btnType="accept" @onClick="redirectToCreation"></sipsder-btn>
            <sipsder-btn btnType="cancel" @onClick="hideModal('addElementModal')"></sipsder-btn>
        </b-row>
    </b-modal>
    <!-- End of add element modal -->
    <!-- Temporal hasta desarrollo de página detalle indicador -->
    <b-modal v-if="selected" id="mapModal" :title="selected.name" size="xl" hide-footer>
      <map-preview :value="selected.mapUrl" display-map />
    </b-modal>
  </div>
</template>
<script>
import { RURAL_INDICATOR_TYPES, PERMISSIONS_TYPES, MODULES } from '../../../domain_constants';
import VueSelect from "vue-select";
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue'
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import RuralFigureList from './list/RuralFigureList.vue';
import RuralIndicatorList from './list/RuralIndicatorList.vue';
import RuralIndexList from './list/RuralIndexList.vue';
import RuralBulletinList from './list/RuralBulletinList.vue';

export default {
  components: {
    's-figure-list': RuralFigureList,
    's-indicator-list': RuralIndicatorList,
    's-index-list': RuralIndexList,
    's-bulletin-list': RuralBulletinList,
    NoteRichText,
    VueSelect
  },
  data() {
    return {
      RURAL_INDICATOR_TYPES,
      PERMISSIONS_TYPES,
      MODULES,
      selected: undefined,
      selectedTypeOptions: 1,
      typeOptions: [
        { text: this.$t('rural_indicators.option_figure'), value: RURAL_INDICATOR_TYPES.FIGURE },
        { text: this.$t('rural_indicators.option_index'), value: RURAL_INDICATOR_TYPES.INDEX },
        { text: this.$t('rural_indicators.option_indicator'), value: RURAL_INDICATOR_TYPES.INDICATOR },
        { text: this.$t('rural_indicators.option_bulletin'), value: RURAL_INDICATOR_TYPES.BULLETIN }
      ],
      collapse:{
        d1: false,
        d2: false
      },
      tabIndex: 0
    }
  },
  methods: {
    hideModal(ref) { 
      this.$refs[ref].hide();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    redirectToCreation( ) {
      switch( this.selectedTypeOptions ) {
        case RURAL_INDICATOR_TYPES.FIGURE:
          this.$router.push( { name: 'RuralFigureCreate'} )
          break;
        case RURAL_INDICATOR_TYPES.INDICATOR:
          this.$router.push( { name: 'RuralIndicatorCreate'} )
          break;
        case RURAL_INDICATOR_TYPES.INDEX:
          this.$router.push( { name: 'RuralIndexCreate'} )
          break;
        case RURAL_INDICATOR_TYPES.BULLETIN:
          this.$router.push( { name: 'RuralBulletinCreate'} )
          break;
      }
    },
    setTabIndex(index) {
      this.tabIndex = index;
    }
  },
  computed: {
    isAdministrator( ) {
      if( this.$store.getters.isAuthenticated &&
          this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
        return true;
      return false;
    }
  },
  async beforeMount(){
    if(this.$route.query.norm){
      this.setTabIndex(1)
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.collapse
  height: 0

.menu
  cursor: pointer
  height: 40px

.avoid-padding
  margin: 0px
  max-width: none
  padding: 0px

.bordered-blue-container
  padding: 20px
  border: 2px solid $colorTitle
  border-radius: 15px

.faded
  border: 0
  height: 2px
  background: #fff
  background: linear-gradient(to left, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,.75) 50%, hsla(0,0%,0%,.1) 100%)
  +flexbox

.title
  background: $colorTitle
  color: #fff
  padding: 0 10px

.rural-indicators
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.rural-detail-body
  font-family: "Open Sans", sans-serif
  font-size: 1.5rem
  display: grid
  grid-gap: 15px
  grid-template-columns: 25% 75%
  grid-template-areas: 'a b' '. c'

.filter-panel
  grid-area: a
  border: 2px solid $colorTitle
  padding: 10px
  border-radius: 15px;
  
.content-panel
  grid-area: b

.div-90
  width: 90%
  margin-left: auto
  margin-right: auto

.collapse-menu
  height: auto
  max-height: 800px
  overflow-y: auto
  overflow-x: hidden
  background: #fff 
  box-shadow: 0px 0px 3px #333
  border-top: 10px solid $colorTitle
  border-bottom: 10px solid $colorTitle
    
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
  margin-bottom: 3%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
    text-decoration: none
    color: #fff

.btn-container
  margin-top: 15px;
  width: 100%
  +flexbox
  +justify-content(center)
  +align-items(center)
  .sipsder-button
    margin: 0 1%

.selected
    color: $colorDanger

.text
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 50px auto
    min-height: 600px
    .A
        margin-left: 15px
        display: inline-flex
    .B
        margin-top: -10px
        background: #fff
        box-shadow: 0px 0px 3px #555
        border-radius: 3px
        z-index: 3
        padding: 20px
        overflow: hidden
        overflow-y: auto 
        border: 1px solid $colorTitle
        min-height: 1900px;
        .titlep
            text-align: center
            font-weight: bold

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

.enabled
  color: #009E11
.disabled
  color: #660000
.indicator-status
  font-size: larger
.indicator-name
  font-size: larger
  color: black
.colors-container
  width: 100%
  height: 30px
  .colors
    margin: 5px 0 0 5px
    width: 25px
    height: 25px
    border-radius: 50%
    float: left
.legal-note
  margin-top: 20px
  margin-left: 80px
  margin-right: 80px
  margin-bottom: 50px
.inner-legal-note
  margin-top: 0px
  margin-left: 20px
  margin-right: 20px
  margin-bottom: 20px

@media screen  and (max-width: $widthDesktop)
    .tab-design
        font-size: 1.1rem !important
    .rural-detail-body
        font-size: 1.2rem !important
        grid-template-columns: 30% 70% !important
    .related-buttons
        font-size: 1.1rem !important
        .item
            height: 300px !important
            .body
                img
                    height: 100px !important
            .foot
                width: 80%  !important
    .collapse-bar
        font-size: 1.1rem !important
        white-space: nowrap !important
    .filter-panel , .content-panel
        max-width: 712px

@media screen  and (max-width: $widthTablet)
    .tab-design
        font-size: 1.2rem !important
    .rural-detail-body
        grid-template-columns: 100% !important
        grid-template-areas: 'a' 'b' 'c' !important
    .related-buttons
        grid-template-columns: 100% !important
    .collapse-bar
        font-size: 1.2rem !important
        white-space: nowrap !important
    .filter-panel , .content-panel
        max-width: 712px
    .div-90
        width: 80% !important
@media screen  and (max-width: $widthMobile)
    .div-90
        width: 85% !important
    .text
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
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
    .filter-panel , .content-panel
        max-width: 412px
</style>


    