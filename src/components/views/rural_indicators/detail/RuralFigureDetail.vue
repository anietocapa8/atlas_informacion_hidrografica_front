<template>
    <div class="rural-detail">
        <div class="feed-title">{{ $t( 'rural_indicators.detail.figure.title' ) }}</div>
        <div v-if="figure">
            <b-row class="div-90 pt-5 pb-2">
                <b-col cols="10" lg="10" xs="12" sm="12">
                    <div v-if="isAdministrator" class="indicator-status" :class="{ enabled: figure.enabled, disabled: !figure.enabled }"> {{ figure.enabled? $t('rural_indicators.index.status.enabled') : $t('rural_indicators.index.status.disabled') }}</div>
                    <div class="indicator-name">{{ figure.name }}</div>
                    <div><strong>{{ $t('rural_indicators.detail.figure.geographic_coverage') }}:</strong> {{ figure.geographicCoverage }}, <strong>{{ $t( 'rural_indicators.detail.figure.date' ) }}:</strong> {{ figure.updateDate | moment("DD/MM/YYYY") }}</div>
                    <div class="colors-container" >
                        <div class="colors" v-for="(r, j) in figure.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                    </div>
                </b-col>
                <b-col cols="2" lg="2" xs="12" sm="12">
                    <b-row align-h="end" align-v="center">
                        <sipsder-btn btnType="edit_pen" :text="$t( 'rural_indicators.detail.figure.edit' )" @onClick="$router.push( { name: 'RuralFigureCreate', params: { id: $route.params.id } } )" v-if="isAdministrator"></sipsder-btn>
                    </b-row>
                </b-col>
            </b-row>
            <b-row class="div-90 pt-5 pb-2">
                <div class="title">{{ $t( 'rural_indicators.detail.figure.summary' ) }}</div>
                <div>{{ figure.summary }}</div>
            </b-row>
            <b-row class="div-90 pt-2 pb-3">
                <div><span class="title">{{ $t( 'rural_indicators.detail.figure.tags' ) }}: </span>{{ figure.tags }}</div>
            </b-row>
            <b-row class="div-90 px-1 py-1 my-1" align-v="center" align-h="center">
                <b-col>
                  <map-preview :value="figure.map.url" display-map new-tab-button />
                </b-col>
            </b-row>
            <b-row class="div-90 pb-5">
                <div class="title">{{ $t( 'rural_indicators.detail.figure.metadata' ) }}</div>
            </b-row>
            <b-row>
                <div class="text div-90">
                    <div class="A">
                        <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{ $t( 'rural_indicators.detail.figure.sources' ) }}</span></div></div>
                        <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{ $t( 'rural_indicators.detail.figure.responsible' ) }}</span></div></div>
                    </div>
                    <div v-if="tabIndex == 0" class="B">
                        <b-row class="py-2 px-5">
                            <div class="title pb-3">{{ $t( 'rural_indicators.detail.figure.sources' ) }}</div>
                            <div v-html="figure.source"></div>
                        </b-row>
                        <b-row align-h="center">
                            <div class="w-75" align="center">
                                <hr class="faded">
                            </div>
                        </b-row>
                        <b-row class="py-2 px-5">
                            <div class="title pb-3">{{ $t( 'rural_indicators.detail.figure.link' ) }}</div>
                            <div v-if="figure.links.length > 0" class="w-100">
                                <b-col cols="12" v-for="(item,i) in figure.links" :key="i" class="link-container my-3" align-v="center">
                                    <b-row><div class="px-5"><a :href="item.url" target="_blank" v-b-tooltip.hover :title="item.description">{{ item.name }}</a></div></b-row>
                                </b-col>
                            </div>
                            <div class="div-90" v-else>
                                <div class="text-center py-5">{{ $t( 'rural_indicators.detail.figure.empty' ) }}</div>
                            </div>
                        </b-row>
                        <b-row align-h="center">
                            <div class="w-75" align="center">
                                <hr class="faded">
                            </div>
                        </b-row>
                        <b-row class="py-2 px-5">
                            <div class="title pb-3 w-100">{{ $t( 'rural_indicators.detail.figure.document' ) }}</div>
                            <div class="title pb-5 w-100">{{ $t( 'rural_indicators.detail.figure.document2' ) }}</div>
                            <div class="div-90" v-if="figure.ruralDocuments.length > 0">
                                <b-table responsive striped outlined hover :fields="ruralDocumentColumns" :items="figure.ruralDocuments" size="sm">
                                    <template slot="label" slot-scope="data">
                                        <div class="d-flex justify-content-center">                                
                                            {{ data.item.label }}
                                        </div>
                                    </template>
                                    <template slot="summary" slot-scope="data">
                                        <div class="d-flex justify-content-center">                                
                                            {{ data.item.summary }}
                                        </div>
                                    </template>
                                    <template slot="actions" slot-scope="data">
                                        <div class="d-flex justify-content-center">                                
                                            <sipsder-btn btnType="search" text="" @onClick="previewDocument(data.item.value)"></sipsder-btn>
                                        </div>
                                    </template>
                                </b-table>
                            </div>
                            <div class="div-90" v-else>
                                <div class="text-center py-5">{{ $t( 'rural_indicators.detail.figure.empty' ) }}</div>
                            </div>
                        </b-row>
                    </div>
                    <div v-if="tabIndex == 1" class="B">
                        <b-row class="py-2 px-5" align-v="center">
                            <b-col cols="12">
                                <div class="font-weight-bold">{{$t('rural_indicators.admin.responsible.title')}}</div>
                            </b-col>
                            <b-col cols="12" xl="6" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.entity')">
                                    <b-form-input type="text" v-model="figure.institution.name" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6" xl="3" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.type')">
                                    <b-form-input type="text" v-model="figure.institution.sector.institutionType.type" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6" xl="3" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.sector')">
                                    <b-form-input type="text" v-model="figure.institution.sector.name" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-row class="w-100 px-3 py-5">
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.dependency')">
                                        <b-form-input type="text" v-model="figure.responsibleObject.dependency" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.position')">
                                        <b-form-input type="text" v-model="figure.responsibleObject.position" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                        <b-form-input type="text" v-model="figure.responsibleObject.telephone" disabled/>
                                    </b-form-group>
                                </b-col>
                              <b-col cols="6">
                                  <b-form-group :label="$t('rural_indicators.admin.responsible.name_responsible')">
                                      <b-form-input type="text" v-model="figure.responsibleObject.name" disabled/>
                                  </b-form-group>
                                  <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                      <b-form-input type="text" v-model="figure.responsibleObject.email" disabled/>
                                  </b-form-group>
                              </b-col>
                            </b-row>
                            <b-col cols="12" class="pb-5">
                                <div class="font-weight-bold">{{ $t( 'rural_indicators.admin.responsible.popup.responsible_dice_long' ) }}</div>
                            </b-col>
                            <b-row class="w-100 px-3">
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.name')">
                                        <b-form-input type="text" v-model="figure.diceObject.name" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                        <b-form-input type="text" v-model="figure.diceObject.telephone" disabled/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                        <b-form-input type="text" v-model="figure.diceObject.email" disabled/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-row>
                    </div>
                </div>
            </b-row>
            <b-row class="div-90 pt-5 pb-2">
                <div class="title">{{ $t( 'rural_indicators.detail.figure.legal' ) }}</div>
                <note-rich-text :module="MODULES.RURAL_INDICATORS" keyVal="figure"></note-rich-text>
            </b-row>
            <b-row class="div-90 pt-5 pb-2" align-h="center" align-v="center">
                <sipsder-btn btnType="back" :text="$t( 'rural_indicators.detail.figure.back' )" @onClick="$router.go(-1)"></sipsder-btn>
            </b-row>
        </div>
        <div v-else>
            <b-row class="px-5 py-3" align-h="center" align-v="center">
                <div class="bordered-blue-container w-50 text-center">
                    {{ $t('rural_indicators.detail.figure.not_found') }}
                </div>
            </b-row>
        </div>
    </div>
    
</template>
<script>
import { RURAL_INDICATOR_TYPES, PERMISSIONS_TYPES, MODULES } from '@/domain_constants';
import { SERVICE_NAMES, HTTP_STATUS } from '@/sipsder_constants';
import VAPI from '@/http_common';
import MapPreview from '@/components/shared/arcgis/MapPreview';
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue';
import S_UTIL from "@/util/sipsder_util";

export default {
  components: {
    NoteRichText,
    MapPreview
  },
  async beforeMount( ) {
    this.figure = await this.getRuralFigure( this.$route.params.id );
  },
  data( ) {
    return {
      SERVICE_NAMES,
      MODULES,
      figure: null,
      tabIndex: 0,
      ruralDocumentColumns: [
        { key: 'label', label: this.$t('rural_indicators.admin.documents_sructure.document'), sortable: true },
        { key: 'summary', label: this.$t('rural_indicators.admin.documents_sructure.summary'), sortable: true },
        { key: 'actions', label: this.$t('rural_indicators.admin.documents_sructure.actions') }
      ],
      ruralDocuments: [],
      selectedRuralDocuments: []
    }
  },
  methods: {
    async getRuralFigure( id ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/detail/figure/${id}` );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching rural figure details', error );
      }
    },
    setTabIndex( index ) {
      this.tabIndex = index;
    },
    previewDocument( documentId ){
      let routeData = this.$router.resolve({
        name: 'RuralIndicatorDocumentPreview',
        params: { id: documentId }
      });
      window.open(routeData.href, '_blank');
    },
  },
  computed: {
    isAdministrator( ) {
      if( this.$store.getters.isAuthenticated &&
          this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
        return true;
      return false;
    },
  },
  watch: {
    figure( ) {
      if( this.figure ) {
        if( !this.figure.enabled && !this.isAdministrator ) {
          this.$router.push( { name: 'RuralIndicatorIndex'} )
        }
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'

.rural-detail
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.bordered-blue-container
  padding: 20px
  border: 2px solid $colorTitle
  border-radius: 15px

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../assets/title/barra_sola_2.png)
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

.div-90
  width: 90%
  margin-left: auto
  margin-right: auto

.enabled
  color: #009E11

.disabled
  color: #660000

.indicator-status
  font-size: larger

.indicator-name
  font-size: x-large
  color: black
  font-weight: bold

.title
  font-size: large
  color: black
  font-weight: bold
  width: 100%

.colors-container
  width: 100%
  height: 30px
  .colors
    margin: 5px 0 0 5px
    width: 25px
    height: 25px
    border-radius: 50%
    float: left

.text
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 50px auto
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
        min-height: auto;
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
.faded
  border: 0
  height: 2px
  background: #fff
  background: linear-gradient(to left, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,.75) 50%, hsla(0,0%,0%,.1) 100%)
  +flexbox

.link-container
  background-color: #eee
  padding: 20px
  border-radius: 15px
@media screen  and (max-width: $widthMobile)
    .div-90
        width: 80% !important
    .feed-title
        padding-left: calc(10% + 40px) !important
        font-size: 20px !important
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
@media screen  and (max-width: $widthTablet)
    .tab-design
        font-size: 1.1rem !important
    .div-90
        width: 80% !important
    
</style>