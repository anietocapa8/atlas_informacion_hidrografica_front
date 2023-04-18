<template>
    <div class="rural-detail">
        <!-- Begin of create or update tracking element modal -->
        <b-modal ref="createTrackingItemModal" :title="$t( 'rural_indicators.detail.indicator.popup_title' )" hideFooter size="md">
            <b-row align-h="center" class="px-5">
                <b-form-group :label="$t('rural_indicators.detail.indicator.popup_claim')">
                    <b-form-textarea v-model="currentTracking.description" rows="4"/>
                </b-form-group>
                <div class="text-red py-3" v-if="currentTracking.description.length < 1 || currentTracking.description.length > 400">{{ $t('rural_indicators.detail.indicator.popup_error') }}</div>
                <div class="text-red">{{ $t('rural_indicators.detail.indicator.popup_alert') }}</div>
            </b-row>
            <b-row class="btn-container" align-h="center">
                <sipsder-btn btnType="cancel" @onClick="hideModal('createTrackingItemModal')"></sipsder-btn>
                <sipsder-btn btnType="accept" :disabled="currentTracking.description.length < 1 || currentTracking.description.length > 400" @onClick="createOrUpdateTracking()"></sipsder-btn>
            </b-row>
        </b-modal>
        <!-- End of create or update tracking element modal -->
        <!-- Begin of get tracking element modal -->
        <b-modal ref="getTrackingElementModal" :title="$t( 'rural_indicators.detail.indicator.popup_title' )" hideFooter size="md">
            <b-row align-h="center" class="px-5">
                <div class="bordered-container w-100"> {{ currentTracking.description }} </div>
            </b-row>
            <b-row class="btn-container" align-h="center">
                <sipsder-btn btnType="accept" @onClick="hideModal('getTrackingElementModal')"></sipsder-btn>
            </b-row>
        </b-modal>
        <!-- End of get tracking element modal -->
        <div class="feed-title">{{ $t( 'rural_indicators.detail.indicator.title' ).toUpperCase() }}</div>
        <div v-if="indicator">
            <b-row class="div-90 pt-5 pb-2">
                <b-col cols="10" lg="10" xs="12" sm="12">
                    <div v-if="isAdministrator" class="indicator-status" 
                      :class="{ enabled: indicator.enabled && indicator.status == RURAL_INDICATOR_STATUS.PUBLISHED, 
                                disabled: !indicator.enabled && indicator.status == RURAL_INDICATOR_STATUS.PUBLISHED,
                                editing: indicator.status == RURAL_INDICATOR_STATUS.EDITING }"> 
                        {{ getStatusLabel(indicator.enabled, indicator.status) }}
                    </div>
                    <div class="indicator-name">{{ indicator.name }}</div>
                    <div v-if="indicator.policies.length > 0">
                        <strong>{{ $t('rural_indicators.detail.indicator.policy') }}:</strong> 
                        <div v-for="policy in indicator.policies" :key="policy.id">
                            {{ policy.name }} <a href="#" @click="previewNorm(policy.value)">{{$t('rural_indicators.detail.indicator.normogram')}}</a>
                        </div>
                    </div>
                    <div><strong>{{ $t('rural_indicators.detail.indicator.geographic_coverage') }}:</strong> {{ indicator.geographicCoverage }}, <strong>{{ $t( 'rural_indicators.detail.indicator.date' ) }}:</strong> {{ indicator.updateDate | moment("DD/MM/YYYY") }}</div>
                    <div class="colors-container" >
                        <div class="colors" v-for="(r, j) in indicator.ruralModels" :key="j" :style="{'background-color': r.color}" v-b-tooltip.hover :title="r.name"></div>
                    </div>
                </b-col>
                <b-col cols="2" lg="2" xs="12" sm="12">
                    <b-row align-h="end" align-v="center">
                        <sipsder-btn btnType="edit_pen" :text="$t( 'rural_indicators.detail.indicator.edit' )" @onClick="$router.push( { name: 'RuralIndicatorCreate', params: { id: $route.params.id } } )" v-if="isAdministrator"></sipsder-btn>
                    </b-row>
                </b-col>
            </b-row>
            <b-row class="div-90 pt-5 pb-2">
                <div class="title">{{ $t( 'rural_indicators.detail.indicator.summary' ) }}</div>
                <div>{{ indicator.summary }}</div>
            </b-row>
            <b-row class="div-90 pt-2 pb-3">
                <div><span class="title">{{ $t( 'rural_indicators.detail.indicator.tags' ) }}: </span>{{ indicator.tags }}</div>
            </b-row>
            <b-row class="div-90 px-1 py-1 my-1" align-v="center" align-h="center">
                <b-col>
                  <map-preview :value="indicator.map.url" display-map new-tab-button />
                </b-col>
            </b-row>
            <b-row class="div-90 pb-5">
                <b-col cols="12">
                    <span class="title">{{ $t( 'rural_indicators.detail.indicator.curriculum' ) }}</span>&nbsp;
                    <a href="#" @click="previewDocument(indicator.curriculum)">{{ $t( 'rural_indicators.detail.indicator.get_curriculum' ) }}</a>
                </b-col>
                <b-col v-if="isInstitutional" cols="12" class="pt-3">
                    <span>{{ $t( 'rural_indicators.detail.indicator.excel_curriculum' ) }}</span>&nbsp;
                    <a href="#" @click="downloadDocument(indicator.template)">{{ $t( 'rural_indicators.detail.indicator.excel_here' ) }}</a>
                </b-col>
            </b-row>
            <b-row class="pt-3">
                <div class="text div-90">
                    <div class="A">
                        <div class="tab-design" :class="{active : tabIndex==0 }" @click="setTabIndex(0)"><div><span>{{ $t( 'rural_indicators.detail.indicator.tabs.basic' ) }}</span></div></div>
                        <div class="tab-design" :class="{active : tabIndex==1 }" @click="setTabIndex(1)"><div><span>{{ $t( 'rural_indicators.detail.indicator.tabs.description' ) }}</span></div></div>
                        <div class="tab-design" :class="{active : tabIndex==2 }" @click="setTabIndex(2)"><div><span>{{ $t( 'rural_indicators.detail.indicator.tabs.responsible' ) }}</span></div></div>
                        <div class="tab-design" :class="{active : tabIndex==3 }" @click="setTabIndex(3)" v-if="isAdministrator || isAuthor"><div><span>{{ $t( 'rural_indicators.detail.indicator.tabs.tracking' ) }}</span></div></div>
                    </div>
                    <div v-if="tabIndex == 0" class="B">
                        <b-row class="px-5" align-v="start">
                            <b-col cols="12" class="pt-3">
                                <b-form-group label-class="font-weight-bold">
                                    <template slot="label">{{ $t('rural_indicators.admin.indicator_definition') }}</template>
                                    <div v-html="indicator.definition" class="py-3"></div> 
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" lg="6">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_measure_unit' ) }}</template>
                                    <b-form-input type="text" disabled v-model="indicator.measureUnit"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" lg="6">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_periodicity' ) }}</template>
                                    <b-form-input type="text" disabled v-model="indicator.periodicity"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" lg="6">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_gathering_method' ) }}</template>
                                    <b-form-input type="text" disabled v-model="indicator.gatheringMethod"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" lg="6">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_disaggregation' ) }}</template>
                                    <b-form-input type="text" disabled v-model="indicator.disaggregation"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" class="pt-2">
                                <b-form-group label-class="font-weight-bold">
                                    <template slot="label">{{ $t('rural_indicators.admin.source') }}</template>
                                    <div v-html="indicator.source" class="py-3"></div>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_calculation_type' ) }}</template>
                                    <b-form-input type="text" disabled v-model="indicator.calculationType"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <div class="w-100">
                                <hr class="faded">
                            </div>
                            <b-col cols="12" v-if="indicator.policies && indicator.policies.length > 0">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_policies' ) }}</template>
                                    <b-table striped hover stacked="md" class="bordered" :key="indicator.name" :items="indicator.policies" :fields="policiesColumns">
                                        <div slot="date" slot-scope="row">
                                            {{row.item.date | moment("DD/MM/YYYY")}}
                                        </div>
                                        <div slot="actions" slot-scope="row">
                                            <div class="d-flex justify-content-center">
                                                <sipsder-btn btnType="search" text="" @onClick="previewNorm(row.item.value)"></sipsder-btn>
                                            </div>
                                        </div>
                                    </b-table>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12" v-else>
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                    <template slot="label">{{ $t( 'rural_indicators.admin.indicator_policies' ) }}</template>
                                    <div class="py-5" align="center">
                                      {{ $t( 'rural_indicators.no_elements' ) }}
                                    </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-if="tabIndex == 1" class="B">
                        <b-row class="pt-2 px-5" align-v="center">
                            <b-col cols="12 pt-3">
                                <b-form-group class="w-100" label-class="font-weight-bold">
                                      <template slot="label">{{ $t( 'rural_indicators.admin.indicator_calculation' ) }}</template>
                                      <b-form-textarea name="ruralIndicatorCalculationType" class="inline-control" :rows="3" :max-rows="6"
                                          v-model="indicator.calculationMethod" disabled>
                                      </b-form-textarea>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group class="w-100" label-class="font-weight-bold">
                                      <template slot="label">{{ $t( 'rural_indicators.admin.indicator_terminology' ) }}</template>
                                      <b-form-textarea name="ruralIndicatorTerminology" class="inline-control" :rows="3" :max-rows="6"
                                          v-model="indicator.glossary" disabled>
                                      </b-form-textarea>
                                </b-form-group>
                            </b-col>
                            <b-col cols="12">
                                <b-form-group class="w-100" label-class="font-weight-bold">
                                      <template slot="label">{{ $t( 'rural_indicators.admin.indicator_observations' ) }}</template>
                                      <b-form-textarea name="ruralIndicatorObservation" class="inline-control" :rows="3" :max-rows="6"
                                          v-model="indicator.observation" disabled>
                                      </b-form-textarea>
                                </b-form-group>
                            </b-col>
                            <div class="w-100">
                                <hr class="faded">
                            </div>
                            <b-col cols="12">
                                <div class="font-weight-bold">{{$t('rural_indicators.detail.figure.link')}}</div>
                            </b-col>
                            <b-col cols="12" class="px-5 pt-3">
                                <div v-if="indicator.links.length > 0">
                                  <b-col cols="12" v-for="(item,i) in indicator.links" :key="i" class="link-container my-3" align-v="center">
                                      <b-row>
                                          <b-col cols="9">
                                              <b-row>
                                                  <div class="px-3">
                                                      <a :href="item.url" target="_blank" v-b-tooltip.hover :title="item.description">{{ item.name }}</a>
                                                  </div>
                                                  <div>
                                                      {{item.description | truncate30chars}}
                                                  </div>
                                              </b-row>
                                          </b-col>
                                      </b-row>
                                  </b-col>
                                </div>
                                <div v-else>
                                    <b-row align-h="center" class="w-100 py-3">{{ $t( 'rural_indicators.admin.links_empty')}}</b-row>
                                </div>
                            </b-col>
                            <div class="w-100">
                                <hr class="faded">
                            </div>
                            <b-col cols="12">
                                <b-form-group label-class="font-weight-bold" class="w-100">
                                  <template slot="label">{{ $t( 'rural_indicators.admin.documents' ) }}</template>
                                  <b-table striped hover stacked="md" class="bordered" :key="indicator.name" :items="indicator.ruralDocuments" :fields="ruralDocumentColumns">
                                      <div slot="actions" slot-scope="row">
                                          <div class="d-flex justify-content-center">
                                              <sipsder-btn btnType="search" text="" @onClick="previewDocument(row.item.value)"></sipsder-btn>
                                          </div>
                                      </div>
                                  </b-table>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-if="tabIndex == 2" class="B">
                        <b-row class="py-2 px-5" align-v="center">
                            <b-col cols="12">
                                <div class="font-weight-bold">{{$t('rural_indicators.admin.responsible.title')}}</div>
                            </b-col>
                            <b-col cols="12" xl="6" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.entity')">
                                    <b-form-input type="text" v-model="indicator.institution.name" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6" xl="3" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.type')">
                                    <b-form-input type="text" v-model="indicator.institution.sector.institutionType.type" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-col cols="6" xl="3" class="pt-5">
                                <b-form-group :label="$t('rural_indicators.admin.responsible.sector')">
                                    <b-form-input type="text" v-model="indicator.institution.sector.name" disabled/>
                                </b-form-group>
                            </b-col>
                            <b-row class="w-100 px-3 py-5">
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.dependency')">
                                        <b-form-input type="text" v-model="indicator.responsibleObject.dependency" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.position')">
                                        <b-form-input type="text" v-model="indicator.responsibleObject.position" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                        <b-form-input type="text" v-model="indicator.responsibleObject.telephone" disabled/>
                                    </b-form-group>
                                </b-col>
                              <b-col cols="6">
                                  <b-form-group :label="$t('rural_indicators.admin.responsible.name_responsible')">
                                      <b-form-input type="text" v-model="indicator.responsibleObject.name" disabled/>
                                  </b-form-group>
                                  <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                      <b-form-input type="text" v-model="indicator.responsibleObject.email" disabled/>
                                  </b-form-group>
                              </b-col>
                            </b-row>
                            <b-col cols="12" class="pb-5">
                                <div class="font-weight-bold">{{ $t( 'rural_indicators.admin.responsible.popup.responsible_dice_long' ) }}</div>
                            </b-col>
                            <b-row class="w-100 px-3">
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.name')">
                                        <b-form-input type="text" v-model="indicator.diceObject.name" disabled/>
                                    </b-form-group>
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                        <b-form-input type="text" v-model="indicator.diceObject.telephone" disabled/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6">
                                    <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                        <b-form-input type="text" v-model="indicator.diceObject.email" disabled/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-row>
                    </div>
                    <div v-if="tabIndex == 3" class="B">
                        <b-row class="py-2 px-5" align-v="center">
                            <b-col cols="12">
                                <div>{{$t('rural_indicators.detail.indicator.tracking_claim')}}</div>
                            </b-col>
                            <b-col cols="12" class="py-5">
                                <div class="font-weight-bold text-center">{{$t('rural_indicators.detail.indicator.table_title').toUpperCase( )}}</div>
                                <div class="text-right py-3" v-if="isAuthor">
                                    <sipsder-btn btnType="add" :text="$t( 'rural_indicators.detail.indicator.add_tracking' )" @onClick="resetModal(); showModal('createTrackingItemModal')">
                                    </sipsder-btn>
                                </div>
                                <div v-if="trackingData.length > 0">
                                    <b-table striped hover stacked="md" class="bordered" :key="indicator.name" :items="trackingData" :fields="trackingColumns">
                                        <div slot="date" slot-scope="row">
                                            {{row.item.date | moment("DD/MM/YYYY")}}
                                        </div>
                                        <div slot="description" slot-scope="row">
                                            {{ row.item.description | truncate30chars }}
                                        </div>
                                        <div slot="actions" slot-scope="row">
                                            <div class="d-flex justify-content-center">
                                                <sipsder-btn btnType="search" text="" @onClick="seeTrackingElement(row.item)"></sipsder-btn>
                                                <sipsder-btn  v-if="row.item.canEdit" btnType="edit_pen" text="" @onClick="editTrackingElement(row.item)"></sipsder-btn>
                                            </div>  
                                        </div>
                                    </b-table>
                                    <b-pagination size="lg" style="justify-content: center;" :total-rows="meta.totalElements" v-model="filterParams.page" v-if="meta.totalElements > 0"
                                        @input="loadTrackingData()"
                                        :per-page="filterParams.size">
                                    </b-pagination>
                                </div>
                                <div class="bordered-blue-container text-center" align="center" v-else>
                                    {{ $t('rural_indicators.detail.indicator.no_data') }}
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </b-row>
            <b-row class="div-90 pt-5 pb-2">
                <div class="title">{{ $t( 'rural_indicators.detail.figure.legal' ) }}</div>
                <note-rich-text :module="MODULES.RURAL_INDICATORS" keyVal="indicator"></note-rich-text>
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
import { RURAL_INDICATOR_TYPES, PERMISSIONS_TYPES, MODULES, RURAL_INDICATOR_STATUS } from '@/domain_constants';
import { SERVICE_NAMES, HTTP_STATUS } from '@/sipsder_constants';
import VAPI from '@/http_common';
import MapPreview from '@/components/shared/arcgis/MapPreview';
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue';
import S_UTIL from "@/util/sipsder_util";
import Router from "../../../../router/router";
import TableSelect from "@/components/shared/TableSelect";
import moment from 'moment';
export default {
  components: {
    MapPreview,
    NoteRichText,
    TableSelect
  },
  async beforeMount( ) {
    this.indicator = await this.getRuralIndicator( this.$route.params.id );
  },
  data( ) {
    return {
      SERVICE_NAMES,
      MODULES,
      RURAL_INDICATOR_STATUS,
      indicator: null,
      tabIndex: 0,
      ruralDocumentColumns: [
        { key: 'label', label: this.$t('rural_indicators.admin.documents_sructure.document'), sortable: true },
        { key: 'summary', label: this.$t('rural_indicators.admin.documents_sructure.summary'), sortable: true },
        { key: 'actions', label: this.$t('rural_indicators.admin.documents_sructure.actions') }
      ],
      policiesColumns: [
        { key: 'label', label: this.$t('rural_indicators.admin.policies_sructure.policy'), sortable: true },
        { key: 'type', label: this.$t('rural_indicators.admin.policies_sructure.type'), sortable: true },
        { key: 'number', label: this.$t('rural_indicators.admin.policies_sructure.number'), sortable: true },
        { key: 'date', label: this.$t('rural_indicators.admin.policies_sructure.date'), sortable: true },
        { key: 'entities', label: this.$t('rural_indicators.admin.policies_sructure.entities'), sortable: true },
        { key: 'actions', label: this.$t('rural_indicators.admin.policies_sructure.actions') }
      ],
      trackingColumns: [
        { key: 'date', label: this.$t('rural_indicators.detail.indicator.date'), sortable: true },
        { key: 'description', label: this.$t('rural_indicators.detail.indicator.description'), sortable: true },
        { key: 'author', label: this.$t('rural_indicators.detail.indicator.user'), sortable: true },
        { key: 'email', label: this.$t('rural_indicators.detail.indicator.email'), sortable: true },
        { key: 'phone', label: this.$t('rural_indicators.detail.indicator.phone'), sortable: true },
        { key: 'actions', label: this.$t('rural_indicators.detail.indicator.actions') }
      ],
      ruralDocuments: [],
      selectedRuralDocuments: [],
      trackingData: [],
      currentTracking: {
        id: null,
        description: ''
      },
      filterParams: {
          page: 1,                    // Page number
          size: 10,                   // Page size
      },
      meta: {
        totalPages: 0,
        totalElements: 0,
        elementsPage: 0
      }
    }
  },
  methods: {
    hideModal(ref) { 
      this.$refs[ref].hide();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    async getRuralIndicator( id ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/detail/indicator/${id}` );
        return response.data.data;
      }
      catch( error ) {
        console.log( 'Error fetching rural indicator detail', error );
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
    previewNorm( documentId ){
      let routeData = this.$router.resolve({
        name: 'NormogramDetail',
        params: { id: documentId }
      });
      window.open(routeData.href, '_blank');
    },
    async downloadDocument( id ) {
      let justification = {
        id: id,
        page: Router.currentRoute.name,
        justification: this.$i18n.t( 'rural_indicators.download_justification' )
      }
      try{
          let response = await VAPI.post(`/${SERVICE_NAMES.DOCUMENTS}/download`, justification , {
              responseType: "blob",
          });
          let fileName = response.headers['content-disposition'].split('=')[1];
          

          let url = window.URL.createObjectURL(new Blob([response.data]));
          let link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);

          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
      }catch(error){
          console.log(error);
      }
    },
    getStatusLabel( enabled, status ) {
      if( status == RURAL_INDICATOR_STATUS.PUBLISHED && enabled )
        return this.$t( 'rural_indicators.index.indicator_status.enabled' );
      else if( status == RURAL_INDICATOR_STATUS.PUBLISHED && !enabled )
        return this.$t( 'rural_indicators.index.indicator_status.disabled' );
      else if( status == RURAL_INDICATOR_STATUS.EDITING )
        return this.$t( 'rural_indicators.index.indicator_status.editing' );
    },
    async createOrUpdateTracking( ) {
      if( this.currentTracking.id == null ) {
        try {
          await VAPI.post( `/${SERVICE_NAMES.RURAL_INDICATORS}/detail/indicator/${this.indicator.id}/tracking`,
          {
            description: this.currentTracking.description
          });
          this.hideModal('createTrackingItemModal');
          this.loadTrackingData( );
        }
        catch( error ) {
          console.log( 'Error posting tracking data', error );
        }
      }
      else {
        try {
          await VAPI.put( `/${SERVICE_NAMES.RURAL_INDICATORS}/detail/indicator/${this.indicator.id}/tracking/${this.currentTracking.id}`,
          {
            description: this.currentTracking.description
          });
          this.hideModal('createTrackingItemModal');
          this.loadTrackingData( );
        }
        catch( error ) {
          console.log( 'Error putting tracking data', error );
        }
      }
    },
    async getTrackingData( ) {
      try {
        const response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/detail/indicator/${this.indicator.id}/tracking-list?page=${this.filterParams.page - 1}&size=${this.filterParams.size}` );
        if( response.data != "" ) {
          response.data.content.forEach(item => {
            item.canEdit = this.canEdit( item.date );
          });
        }
        return response;
      }
      catch( error ) {
        console.log( 'Error fetching tracking list', error );
      }
    },
    async loadTrackingData( ) {
      let response = await this.getTrackingData( );
      if( response.status == HTTP_STATUS.OK ) {
        this.meta.totalPages = response.data.totalPages;
        this.meta.totalElements = response.data.totalElements;
        this.meta.elementsPage = response.data.size;
        this.trackingData = response.data.content;
      }
      else {
        this.meta = {
          totalPages: 0,
          totalElements: 0,
          elementsPage: 0
        };
        this.trackingData = [];
      }
    },
    resetModal( ) {
      this.currentTracking = {
        id: null,
        description: ''
      }
    },
    seeTrackingElement( row ) {
      this.resetModal( );
      this.currentTracking = row;
      this.showModal( 'getTrackingElementModal' )
    },
    editTrackingElement( row ) {
      this.resetModal( );
      this.currentTracking = Object.assign({}, row);
      this.showModal( 'createTrackingItemModal' )
    },
    canEdit( date ) {
      let creation = new Date(date);
      let now = new Date();
      var difference = now.getTime( ) - creation.getTime();
      var days = difference / (1000 * 3600 * 24); 
      return days < 10 && this.isAuthor;
    }
  },
  computed: {
    isAdministrator( ) {
      if( this.$store.getters.isAuthenticated &&
          this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN ) )
        return true;
      return false;
    },
    isInstitutional( ) {
      if( this.$store.getters.isAuthenticated &&
          this.$store.getters.hasPermission( PERMISSIONS_TYPES.DOWNLOAD ) )
        return true;
      return false;
    },
    isAuthor( ) {
      if( this.$store.getters.getCurrentUser != null && this.indicator.responsibleObject != null )
        return this.indicator.responsibleObject.id == this.$store.getters.getCurrentUser.id;
      return false;
    }
  },
  watch: {
    indicator( ) {
      if( this.indicator ) {
        if( !this.indicator.enabled && 
              this.indicator.status != RURAL_INDICATOR_STATUS.PUBLISHED &&
              !this.isAdministrator ) {
          this.$router.push( { name: 'RuralIndicatorIndex'} )
        }
        if( this.indicator.institution == null) {
          this.indicator.institution =  {
            sector: {
              institutionType: {}
            }
          }
          this.indicator.responsibleObject = {}
          this.indicator.diceObject = {}
        }
      }
    },
    tabIndex( ) {
      if( this.tabIndex == 3 ) {
        this.loadTrackingData( );
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
.editing
  color: #ff990c

.indicator-status
  font-size: larger
  font-weight: bold

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

.text-red
  color: red
.bordered-container
  border: 1px solid black
  padding: 15px
.bordered
  border: 1px solid black
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