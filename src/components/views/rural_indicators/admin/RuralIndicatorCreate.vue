<template>
	<b-container class='container-form'>
    <sipsder-title :title="$t( 'rural_indicators.admin.title' )" type="admin"></sipsder-title>
    <b-row>
        <div class="pb-5">
            {{ $t( 'rural_indicators.admin.claim' ) }}
        </div>
    </b-row>
    <b-row class="pb-5 w-100">
        <div class="arrow">
            <ul>
                <li><a @click="setActiveTab(0)" :class="{ active: activeTab == 0 }">{{ $t( 'rural_indicators.admin.indicator_first_stage' )}}</a></li>
                <li><a @click="setActiveTab(1)" :class="{ active: activeTab == 1, disabled: this.currentIndicator.id == null }">{{ $t( 'rural_indicators.admin.indicator_second_stage' )}}</a></li>
            </ul>
        </div>
    </b-row>

    <b-row v-show="activeTab == 0" class="div-90">
        <b-row class="w-100" align-v="center">
            <b-col cols="10">
                <b-form-group :label="$t( 'rural_indicators.admin.created_by' )" label-class="font-weight-bold" class="w-50">
                    <b-form-input type="text" v-model="currentIndicator.createdBy" disabled/>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <span :style="{ color: getStatusColor( currentIndicator.status ), fontSize: 'x-large' }"><strong>{{ getStatusLabel( currentIndicator.status ) }}</strong></span>
            </b-col>
        </b-row>
        <b-row class="w-100 pb-5">
          <b-col cols="10">
              <b-form-group :label="$t( 'rural_indicators.type' )" label-class="font-weight-bold" class="w-50">
                  <vue-select :options="typeOptions" name="ruralIndicatorSelector" v-model="selectedTypeOptions" :placeholder="$t( 'rural_indicators.type_placeholder' )"
                      class="bg-white" v-validate="{ required: true }" :disabled="isEditing" :data-vv-as="$t( 'rural_indicators.type' )">
                  </vue-select>
                  <span class="error pt-3" v-if="!isValidType">{{ $t( 'rural_indicators.admin.validation_errors.one' ) }}</span>
              </b-form-group>
          </b-col>
          <b-col cols="2">
              <b-row class="pt-5" align-v="start" align-h="start">
                  <b-form-checkbox id="indicatorEnabled"
                    class="inline-control pt-1"
                    v-model="currentIndicator.enabled"
                    :value="true"
                    :unchecked-value="false">
                  </b-form-checkbox>
                  <div class="inline-title">{{ $t( 'rural_indicators.admin.enabled' ) }}</div>
              </b-row>
          </b-col>
        </b-row>

        <b-row class="w-100 pl-5" align-h="center">
            <b-form @submit.prevent="submit">
                <b-row class="pt-2" align-v="center" v-if="!currentIndicator.enabled">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.reason' ) }}<span class="required"> *</span></template>
                        <b-form-textarea name="ruralIndicatorDisabledReason" class="inline-control" :rows="3" :max-rows="6"
                            v-model="currentIndicator.disabledReason" v-validate="{ required: !currentIndicator.enabled, max: 280 }" :data-vv-as="$t( 'rural_indicators.admin.reason' )"
                            data-vv-scope="form1">
                        </b-form-textarea>
                        <span v-if="errors.has( 'form1.ruralIndicatorDisabledReason' )" class="error">
                            {{ errors.first( 'form1.ruralIndicatorDisabledReason' ) }}
                        </span>
                    </b-form-group>
                </b-row>
                <b-row class="pt-2">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.indicator_name' ) }}<span class="required"> *</span></template>
                        <b-form-input type="text" name="indicatorName" :data-vv-as="$t('rural_indicators.admin.indicator_name')" 
                              v-model="currentIndicator.name" v-validate="{ required: true, max: 180 }" data-vv-scope="form1"/>
                        <span class="error pt-3" v-if="errors.has( 'form1.indicatorName' )">{{ errors.first( 'form1.indicatorName' ) }}</span>
                    </b-form-group>
                </b-row>
                <b-row class="pt-2">
                  <b-form-group label-class="font-weight-bold" class="w-100">
                    <template slot="label">{{ $t( 'rural_indicators.admin.map' ) }}<span class="required"> *</span></template>
                    <map-search v-if="currentIndicator.map" v-model="currentIndicator.map.url" :tag="ARCGIS_TAGS.INDICATORS" class="bg-white" :placeholder="$t( 'rural_indicators.admin.map_placeholder' )"
                        name="ruralIndicatorMap" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.map' )" data-vv-scope="form1"/>
                    <span v-if="errors.has( 'form1.ruralIndicatorMap' )" class="error"> {{ errors.first( 'form1.ruralIndicatorMap' ) }} </span>
                  </b-form-group>
                </b-row>
                <b-row class="pt-2">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.indicator_summary' ) }}<span class="required"> *</span></template>
                        <b-form-textarea name="indicatorSummary" class="inline-control" :rows="3" :max-rows="6"
                            v-model="currentIndicator.summary" v-validate="{ required: true, max: 280 }" :data-vv-as="$t( 'rural_indicators.admin.indicator_summary' )"
                            data-vv-scope="form1">
                        </b-form-textarea>
                        <span class="error pt-3" v-if="errors.has( 'form1.indicatorSummary' )">{{ errors.first( 'form1.indicatorSummary' ) }}</span>
                    </b-form-group>
                </b-row>
                <b-row class="pt-2">
                    <b-col cols="6" class="pl-0">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.geographic_coverage' ) }}<span class="required"> *</span></template>
                            <vue-select :options="geographicCoverage" name="indicatorGeographicCoverage" v-model="currentIndicator.geographic" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.geographic_coverage' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorGeographicCoverage' )" class="error"> {{ errors.first( 'form1.indicatorGeographicCoverage' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6" class="pr-0">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.last_update' ) }}<span class="required"> *</span></template>
                            <datepicker :placeholder="$t('util.insertDate')" v-model="currentIndicator.updateDate" name="ruralIndicatorDate" class="date-picker"
                              v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.last_update' )" data-vv-scope="form1" :language="languages[ currentLocale ]" 
                              :calendar-button="true" calendar-button-icon="fa fa-calendar" :disabledDates="disabledDates" :clear-button="true">
                            </datepicker>
                            <span v-if="errors.has( 'form1.ruralIndicatorDate' )" class="error"> {{ errors.first( 'form1.ruralIndicatorDate' ) }} </span>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row class="pt-2">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.rural_thematic' ) }}<span class="required"> *</span></template>
                        <table-select v-model="currentIndicator.ruralModels" :label="$t( 'rural_indicators.admin.rural_thematic2' )" :key="currentIndicator.name"
                            :labelBold="true" :treeselect="true" :options="ruralThemes" :tableFields="ruralThemeColumns" :clearable="true" :disableBranch="true" name="ruralModelSelector"/>
                        <span v-if="currentIndicator.ruralModels != null && currentIndicator.ruralModels.length == 0" class="error">{{ $t( 'rural_indicators.admin.rural_error' ) }}</span>
                    </b-form-group>
                </b-row>

                <b-row class="pt-2" align-v="center">
                  <b-col cols="3">
                    <div class="font-weight-bold">{{ $t( 'rural_indicators.admin.indicator_curriculum' ) }}<span class="required"> *</span></div>
                  </b-col>
                  <b-col cols="3">
                    <input type="file"
                        name="curriculumSelector" @change="setCurriculum($event)"
                        v-validate="'mimes:application/pdf|size:5000'" ref="curriculumSelector"
                        class="hidden-input" :data-vv-as="$t( 'rural_indicators.admin.indicator_curriculum' )"
                        data-vv-scope="form1"/>
                    <sipsder-btn btnType="uploadImage" 
                        class="padded-buttons"
                        :text="$t( 'rural_indicators.admin.indicator_select_curriculum' )"
                        @onClick="$refs.curriculumSelector.click()">                                          
                    </sipsder-btn>
                  </b-col>
                  <b-col cols="4">
                      <div v-if="currentIndicator.curriculum != null">
                          {{selectedCurriculum | truncate30chars}}
                      </div>
                  </b-col>
                  <b-col cols="2" v-if="currentIndicator.curriculumId != null">
                      <sipsder-btn btnType="preview" 
                          :text="''"
                          @onClick="previewDocument(currentIndicator.curriculumId)">                                          
                      </sipsder-btn>
                  </b-col>
                  <div v-if="errors.has( 'form1.curriculumSelector' )" class="error pb-3"> {{ $t('rural_indicators.admin.indicator_curriculum_error') }} </div>
                </b-row>

                
                <b-row class="bordered-container pt-2" align-v="start">
                    <b-col cols="12" class="pt-3">
                        <div class="font-weight-bold">{{$t('rural_indicators.admin.indicator_basic')}}</div>
                    </b-col>
                    <b-col cols="12" class="pt-3">
                        <b-form-group label-class="font-weight-bold">
                            <template slot="label">{{ $t('rural_indicators.admin.indicator_definition') }}<span class="required"> *</span></template>
                            <rich-text :options="customToolbar" @changeValue="changeValueDefinition" :newContent="currentIndicator.definition"></rich-text>
                            <span class="error" v-if="currentIndicator.definition == null || currentIndicator.definition == ''">
                                {{ $t('rural_indicators.admin.definition_error' )}}
                            </span> 
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_measure_unit' ) }}<span class="required"> *</span></template>
                            <vue-select :options="measureUnit" name="indicatorMeasureUnit" v-model="currentIndicator.measureUnit" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.indicator_measure_unit' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorMeasureUnit' )" class="error"> {{ errors.first( 'form1.indicatorMeasureUnit' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_periodicity' ) }}<span class="required"> *</span></template>
                            <vue-select :options="periodicity" name="indicatorPeriodicity" v-model="currentIndicator.periodicity" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.indicator_periodicity' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorPeriodicity' )" class="error"> {{ errors.first( 'form1.indicatorPeriodicity' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_gathering_method' ) }}<span class="required"> *</span></template>
                            <vue-select :options="gatheringMethod" name="indicatorGatheringMethod" v-model="currentIndicator.gatheringMethod" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.indicator_gathering_method' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorGatheringMethod' )" class="error"> {{ errors.first( 'form1.indicatorGatheringMethod' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_disaggregation' ) }}<span class="required"> *</span></template>
                            <vue-select :options="disaggregation" name="indicatorDisaggregation" v-model="currentIndicator.disaggregation" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.indicator_disaggregation' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorDisaggregation' )" class="error"> {{ errors.first( 'form1.indicatorDisaggregation' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" class="pt-2">
                        <b-form-group label-class="font-weight-bold">
                            <template slot="label">{{ $t('rural_indicators.admin.source') }}<span class="required"> *</span></template>
                            <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="currentIndicator.source"></rich-text>
                            <span class="error" v-if="currentIndicator.source == null || currentIndicator.source == ''">
                              {{ $t('rural_indicators.admin.source_error' )}}
                            </span> 
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_calculation_type' ) }}<span class="required"> *</span></template>
                            <vue-select :options="calculationType" name="indicatorCalculationType" v-model="currentIndicator.calculationType" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.indicator_calculation_type' )" data-vv-scope="form1">
                            </vue-select>
                            <span v-if="errors.has( 'form1.indicatorCalculationType' )" class="error"> {{ errors.first( 'form1.indicatorCalculationType' ) }} </span>
                        </b-form-group>
                    </b-col>
                    <div class="w-100">
                        <hr class="faded">
                    </div>
                    <b-col cols="12">
                        <b-form-group label-class="font-weight-bold" class="w-100" v-if="currentIndicator.policies">
                            <template slot="label">{{ $t( 'rural_indicators.admin.indicator_policies' ) }}</template>
                            <table-select v-model="currentIndicator.policies" labelSelect="label" :taggable="true" :options="policies" :tableFields="policiesColumns" :clearable="true" :key="currentIndicator.name">
                                <div slot="actionsCol" slot-scope="{row}">
                                    <div class="d-flex justify-content-center">
                                        <sipsder-btn btnType="search" text="" @onClick="previewNorm(row.item.value)"></sipsder-btn>
                                    </div>
                                </div>
                            </table-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row align-h="center" class="pt-5">
                    <sipsder-btn btnType="back" @onClick="showModal('discardChangesModal')"></sipsder-btn>
                    <sipsder-btn btnType="send" :text="$t('rural_indicators.admin.indicator_continue')" @onClick="saveAndContinue()"></sipsder-btn>
                    <sipsder-btn btnType="accept" :text="$t('rural_indicators.admin.indicator_skip')" @onClick="saveAndLeave()"></sipsder-btn>
                </b-row>
            </b-form>
        </b-row>
    </b-row>

    <b-row v-show="activeTab == 1" class="div-90">
        <b-row class="w-100" align-v="center">
            <b-col cols="10">
                <b-form-group :label="$t( 'rural_indicators.admin.created_by' )" label-class="font-weight-bold" class="w-50">
                    <b-form-input type="text" v-model="currentIndicator.createdBy" disabled/>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <span :style="{ color: getStatusColor( currentIndicator.status ), fontSize: 'x-large' }"><strong>{{ getStatusLabel( currentIndicator.status ) }}</strong></span>
            </b-col>
        </b-row>
        <b-row class="w-100 pb-5">
          <b-col cols="10">
              <b-form-group :label="$t( 'rural_indicators.type' )" label-class="font-weight-bold" class="w-50">
                  <vue-select :options="typeOptions" name="ruralIndicatorSelector" v-model="selectedTypeOptions" :placeholder="$t( 'rural_indicators.type_placeholder' )"
                      class="bg-white" v-validate="{ required: true }" :disabled="isEditing" :data-vv-as="$t( 'rural_indicators.type' )">
                  </vue-select>
                  <span class="error pt-3" v-if="!isValidType">{{ $t( 'rural_indicators.admin.validation_errors.one' ) }}</span>
              </b-form-group>
          </b-col>
          <b-col cols="2">
              <b-row class="pt-5" align-v="start" align-h="start">
                  <b-form-checkbox id="indicatorEnabled"
                    class="inline-control pt-1"
                    v-model="currentIndicator.enabled"
                    :value="true"
                    :unchecked-value="false">
                  </b-form-checkbox>
                  <div class="inline-title">{{ $t( 'rural_indicators.admin.enabled' ) }}</div>
              </b-row>
          </b-col>
        </b-row>

        <b-row class="w-100 pl-5" align-h="center">
            <b-form @submit.prevent="submit" class="w-100">
                <b-row class="pt-2" align-v="center" v-if="!currentIndicator.enabled">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.reason' ) }}<span class="required"> *</span></template>
                        <b-form-textarea name="ruralIndicatorDisabledReason" class="inline-control" :rows="3" :max-rows="6"
                            v-model="currentIndicator.disabledReason" v-validate="{ required: !currentIndicator.enabled, max: 280 }" :data-vv-as="$t( 'rural_indicators.admin.reason' )"
                            data-vv-scope="form2">
                        </b-form-textarea>
                        <span v-if="errors.has( 'form2.ruralIndicatorDisabledReason' )" class="error">
                            {{ errors.first( 'form2.ruralIndicatorDisabledReason' ) }}
                        </span>
                    </b-form-group>
                </b-row>
                <b-row class="pt-2">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t( 'rural_indicators.admin.indicator_name' ) }}<span class="required"> *</span></template>
                        <b-form-input type="text" name="indicatorName" :data-vv-as="$t('rural_indicators.admin.indicator_name')" 
                              v-model="currentIndicator.name" v-validate="{ required: true, max: 180 }" data-vv-scope="form2"/>
                        <span class="error pt-3" v-if="errors.has( 'form2.indicatorName' )">{{ errors.first( 'form2.indicatorName' ) }}</span>
                    </b-form-group>
                </b-row>
                <div class="w-100">
                    <hr class="faded">
                </div>
                <b-row class="bordered-container pt-2" align-v="center">
                    <b-col cols="12 pt-3">
                        <div class="font-weight-bold">{{$t('rural_indicators.admin.indicator_description')}}</div>
                    </b-col>
                    <b-col cols="12 pt-3">
                        <b-form-group class="w-100">
                              <template slot="label">{{ $t( 'rural_indicators.admin.indicator_calculation' ) }}<span class="required"> *</span></template>
                              <b-form-textarea name="ruralIndicatorCalculationType" class="inline-control" :rows="3" :max-rows="6"
                                  v-model="currentIndicator.calculationMethod" v-validate="{ required: true, max: 1000 }" :data-vv-as="$t( 'rural_indicators.admin.indicator_calculation' )"
                                  data-vv-scope="form2">
                              </b-form-textarea>
                              <span v-if="errors.has( 'form2.ruralIndicatorCalculationType' )" class="error">{{ errors.first( 'form2.ruralIndicatorCalculationType' ) }}</span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group class="w-100">
                              <template slot="label">{{ $t( 'rural_indicators.admin.indicator_terminology' ) }}</template>
                              <b-form-textarea name="ruralIndicatorTerminology" class="inline-control" :rows="3" :max-rows="6"
                                  v-model="currentIndicator.glossary" v-validate="{ required: false, max: 1500 }" :data-vv-as="$t( 'rural_indicators.admin.indicator_terminology' )"
                                  data-vv-scope="form2">
                              </b-form-textarea>
                              <span v-if="errors.has( 'form2.ruralIndicatorTerminology' )" class="error">{{ errors.first( 'form2.ruralIndicatorTerminology' ) }}</span>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group class="w-100">
                              <template slot="label">{{ $t( 'rural_indicators.admin.indicator_observations' ) }}</template>
                              <b-form-textarea name="ruralIndicatorObservation" class="inline-control" :rows="3" :max-rows="6"
                                  v-model="currentIndicator.observation" v-validate="{ required: false, max: 1000 }" :data-vv-as="$t( 'rural_indicators.admin.indicator_observations' )"
                                  data-vv-scope="form2">
                              </b-form-textarea>
                              <span v-if="errors.has( 'form2.ruralIndicatorObservation' )" class="error">{{ errors.first( 'form2.ruralIndicatorObservation' ) }}</span>
                        </b-form-group>
                    </b-col>
                    <div class="w-100">
                        <hr class="faded">
                    </div>
                    <b-col cols="12">
                        <div class="font-weight-bold">{{$t('rural_indicators.admin.links')}}</div>
                    </b-col>
                    <b-col cols="12" class="px-5 pt-3">
                        <div v-if="currentIndicator.links.length > 0">
                          <b-col cols="12" v-for="(item,i) in currentIndicator.links" :key="i" class="link-container my-3" align-v="center">
                              <b-row>
                                  <b-col cols="1">
                                        <b-form-checkbox :id="'linksSelector-'+i" :value="i" :unchecked-value="null" v-model="checkedLink" @change="disabledCheckedLink = true" :disabled="disabledCheckedLink"></b-form-checkbox>
                                  </b-col>
                                  <b-col cols="11" v-if="checkedLink == i" >
                                      <b-row class="px-3" align-v="center">
                                          <b-col cols="3">
                                              <b-form-group label-class="font-weight-bold" class="w-100">
                                                  <template slot="label">{{ $t( 'rural_indicators.admin.link' ) }}<span class="required"> *</span></template>
                                                  <b-form-input type="text" :name="'linkUrl-'+i" :data-vv-as="$t('rural_indicators.admin.link')" data-vv-scope="link" v-model="item.url" v-validate="{ required: true, max: 800 }"/>
                                              </b-form-group>
                                          </b-col>
                                          <b-col cols="3">
                                              <b-form-group label-class="font-weight-bold" class="w-100">
                                                  <template slot="label">{{ $t( 'rural_indicators.admin.link_name' ) }}<span class="required"> *</span></template>
                                                  <b-form-input type="text" :name="'linkName-'+i" :data-vv-as="$t('rural_indicators.admin.link_name')" data-vv-scope="link" v-model="item.name" v-validate="{ required: true, max: 80 }"/>
                                              </b-form-group>
                                          </b-col>
                                          <b-col cols="3">
                                              <b-form-group label-class="font-weight-bold" class="w-100">
                                                  <template slot="label">{{ $t( 'rural_indicators.admin.link_description' ) }}<span class="required"> *</span></template>
                                                  <b-form-input type="text" :name="'linkDescription-'+i" :data-vv-as="$t('rural_indicators.admin.link_description')" data-vv-scope="link" v-model="item.description" v-validate="{ required: true, max: 100 }"/>
                                              </b-form-group>
                                          </b-col>
                                          <b-col cols="3">
                                              <sipsder-btn btnType="accept" :text="''" @onClick="confirmLink( )"></sipsder-btn>
                                              <sipsder-btn btnType="cancel" :text="''" @onClick="deleteLink( checkedLink )"></sipsder-btn>
                                          </b-col>
                                          <b-col cols="12" v-if="linksHasError" class="pb-3">
                                              <span class="error">{{ $t( 'rural_indicators.admin.link_error' ) }}</span>
                                          </b-col>
                                      </b-row>
                                  </b-col>
                                  <b-col cols="9" v-else>
                                      <b-row>
                                          <div class="px-3">
                                              <a :href="item.url" target="_blank" v-b-tooltip.hover :title="item.description">{{ item.name }}</a>
                                          </div>
                                          <div>
                                              {{item.description | truncate30chars}}
                                          </div>
                                      </b-row>
                                  </b-col>
                                  <b-col cols="2" v-if="checkedLink == null">
                                        <sipsder-btn class="marginless-button" btnType="edit" :text="''" @onClick="checkedLink = i"></sipsder-btn>
                                  </b-col>
                              </b-row>
                          </b-col>
                        </div>
                        <div v-else>
                            <b-row align-h="center" class="w-100 py-3">{{ $t( 'rural_indicators.admin.links_empty')}}</b-row>
                        </div>
                        <b-row align-h="end" class="w-100">
                            <sipsder-btn btnType="add" :text="''" :disabled="currentIndicator.links.length >= 5" @onClick="addLink( )"></sipsder-btn>
                            <sipsder-btn btnType="export" :text="''" :disabled="checkedLink == null" @onClick="swapUp( checkedLink )"></sipsder-btn>
                            <sipsder-btn btnType="download" :text="''" :disabled="checkedLink == null" @onClick="swapDown( checkedLink )"></sipsder-btn>
                            <sipsder-btn btnType="delete" :text="''" :disabled="checkedLink == null" @onClick="deleteLink( checkedLink )"></sipsder-btn>
                        </b-row>
                    </b-col>
                    <div class="w-100">
                        <hr class="faded">
                    </div>
                    <b-col cols="12">
                        <b-form-group label-class="font-weight-bold" class="w-100">
                          <template slot="label">{{ $t( 'rural_indicators.admin.documents' ) }}</template>
                            <table-select v-model="currentIndicator.ruralDocuments" :label="$t( 'rural_indicators.admin.documents_exists' )" labelSelect="label" :taggable="true" :key="currentIndicator.name"
                                :labelBold="false" :options="ruralDocuments" :tableFields="ruralDocumentColumns" :clearable="true" name="ruralDocumentSelector">
                                <div slot="actionsCol" slot-scope="{row}">
                                    <div class="d-flex justify-content-center">
                                        <sipsder-btn btnType="search" text="" @onClick="previewDocument(row.item.value)"></sipsder-btn>
                                    </div>
                                </div>
                            </table-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row class="bordered-container pt-2" align-v="center">
                    <b-col cols="12" class="pt-3">
                        <div class="font-weight-bold">{{$t('rural_indicators.admin.responsible.title')}}</div>
                        <div>{{$t('rural_indicators.admin.responsible.claim')}}</div>
                    </b-col>
                    <b-col cols="12" xl="6" class="pt-5">
                        <b-form-group :label="$t('rural_indicators.admin.responsible.entity')">
                            <vue-bootstrap-typeahead :data="query.institutions" v-model="entitySearch" ref="entitySearchTypeahead" class="w-100" :serializer="entity => entity.name"
                              :placeholder="$t('rural_indicators.admin.responsible.placeholder')" size="lg" @hit="setSelectedInstitution($event)">
                            </vue-bootstrap-typeahead>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6" xl="3" class="pt-5">
                        <b-form-group :label="$t('rural_indicators.admin.responsible.type')">
                            <b-form-input type="text" v-model="query.selectedInstitution.sector.institutionType.type" disabled/>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6" xl="3" class="pt-5">
                        <b-form-group :label="$t('rural_indicators.admin.responsible.sector')">
                            <b-form-input type="text" v-model="query.selectedInstitution.sector.name" disabled/>
                        </b-form-group>
                    </b-col>
                    <b-row align-h="end" class="w-100">
                        <sipsder-btn btnType="add" @onClick="showModal('addResponsibleModal')" :text="$t('rural_indicators.admin.responsible.add')" :disabled="query.selectedInstitution.name == null"></sipsder-btn>
                    </b-row>
                    <b-row class="w-100 px-5">
                        <b-col cols="6">
                            <b-form-group :label="$t('rural_indicators.admin.responsible.dependency')">
                                <b-form-input type="text" v-model="modal.responsible.dependency" disabled/>
                            </b-form-group>
                            <b-form-group :label="$t('rural_indicators.admin.responsible.position')">
                                <b-form-input type="text" v-model="modal.responsible.position" disabled/>
                            </b-form-group>
                            <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                <b-form-input type="text" v-model="modal.responsible.telephone" disabled/>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group :label="$t('rural_indicators.admin.responsible.name_responsible')">
                                <b-form-input type="text" v-model="modal.responsible.name" disabled/>
                            </b-form-group>
                            <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                <b-form-input type="text" v-model="modal.responsible.email" disabled/>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-col cols="12" class="py-5">
                        <div class="font-weight-bold">{{ $t( 'rural_indicators.admin.responsible.popup.responsible_dice_long' ) }}</div>
                    </b-col>
                    <b-row class="w-100 px-5">
                        <b-col cols="6">
                            <b-form-group :label="$t('rural_indicators.admin.responsible.name')">
                                <b-form-input type="text" v-model="modal.dice.name" disabled/>
                            </b-form-group>
                            <b-form-group :label="$t('rural_indicators.admin.responsible.phone')">
                                <b-form-input type="text" v-model="modal.dice.telephone" disabled/>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group :label="$t('rural_indicators.admin.responsible.email')">
                                <b-form-input type="text" v-model="modal.dice.email" disabled/>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-col cols="12" class="py-5 required" v-if="!hasAssociatedResponsibles">
                        {{ $t('rural_indicators.admin.responsible.association_error')}}
                    </b-col>
                </b-row>
                <b-row class="pt-2">
                    <b-form-group label-class="font-weight-bold" class="w-100">
                        <template slot="label">{{ $t('rural_indicators.admin.tags') }}<span class="required"> *</span></template>
                        <tags-input class="w-100 tag-container" name="tags" v-model="tag" :data-vv-as="$t('rural_indicators.admin.tags')"
                          :placeholder="$t('rural_indicators.admin.tags_placeholder')" :tags.sync="currentIndicator.tags"
                          @tags-changed="newtags => currentIndicator.tags = newtags"/>
                        <span class="error" v-if="currentIndicator.tags != null && currentIndicator.tags.length == 0">{{ $t('rural_indicators.admin.tags_error') }}</span>
                    </b-form-group>
                </b-row>
                <b-row align-h="center" class="pt-5">
                    <sipsder-btn btnType="back" @onClick="showModal('discardChangesModal')"></sipsder-btn>
                    <sipsder-btn btnType="accept" @onClick="showModal('savePublishModal')" :text="$t('rural_indicators.admin.indicator_save')"></sipsder-btn>
                </b-row>
            </b-form>
        </b-row>
    </b-row>
    
    <!-- Begin of discard changes modal -->
    <b-modal ref="discardChangesModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          {{ $t('rural_indicators.admin.popup.discard_changes') }}
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="$router.go(-1)"></sipsder-btn>
        <sipsder-btn btnType="cancel" @onClick="hideModal('discardChangesModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of discard changes modal -->

    <!-- Begin of errors modal -->
    <b-modal ref="errorsModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          {{ $t('rural_indicators.admin.popup.validation_error') }}
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="hideModal('errorsModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of errors modal -->

    <!-- Begin of partial save modal -->
    <b-modal ref="partialSaveModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          <span>{{ $t('rural_indicators.admin.popup.indicator_success1') }}</span> &nbsp;
          <span><strong>{{ $t('rural_indicators.admin.popup.indicator_success2') }}</strong></span> &nbsp;
          <span>{{ $t('rural_indicators.admin.popup.indicator_success3') }}</span>
        </b-col>
        <b-col cols="10" class="pt-3">
          <span>{{ $t('rural_indicators.admin.popup.indicator_success5') }}</span>
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="partialSave()"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of partial save modal -->

    <!-- Begin of complete save modal -->
    <b-modal ref="savePublishModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          <span>{{ $t('rural_indicators.admin.popup.indicator_save1') }}</span>
        </b-col>
        <b-col cols="10" class="pt-3">
          <span>{{ $t('rural_indicators.admin.popup.indicator_save2') }}</span>
        </b-col>
        <b-col cols="10" class="pt-3">
          <span>{{ $t('rural_indicators.admin.popup.indicator_save3') }}</span>
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="saveAndPublish()"></sipsder-btn>
        <sipsder-btn btnType="cancel" @onClick="hideModal('savePublishModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of complete save modal -->

    <!-- Begin of continue save modal -->
    <b-modal ref="continueSaveModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          <span>{{ $t('rural_indicators.admin.popup.indicator_success1') }}</span> &nbsp;
          <span><strong>{{ $t('rural_indicators.admin.popup.indicator_success2') }}</strong></span> &nbsp;
          <span>{{ $t('rural_indicators.admin.popup.indicator_success3') }}</span>
        </b-col>
        <b-col cols="10" class="pt-2">
          <span>{{ $t('rural_indicators.admin.popup.indicator_success4') }}</span>
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="continueSave()"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of continue save modal -->

    <!-- Begin of error adding responsibles modal -->
    <b-modal ref="errorAddingResponsiblesModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          {{ $t('rural_indicators.admin.popup.responsibles_error') }}
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="hideModal('errorAddingResponsiblesModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of error adding responsibles modal -->

    <!-- Begin of error submitting form modal -->
    <b-modal ref="errorSubmitFormModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          {{ $t('rural_indicators.admin.popup.indicator_error') }}
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="hideModal('errorSubmitFormModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of error submitting form modal -->

    <!-- Begin of success modal -->
    <b-modal ref="successModal" :title="$t('rural_indicators.admin.popup.title')" hideFooter
      :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">
      <b-row align-h="center">
        <b-col cols="10">
          <div>
            {{ $t('rural_indicators.admin.popup.success1') }}
          </div>
          <div class="pt-3">
            {{ $t('rural_indicators.admin.popup.success2') }}
          </div>
          <div class="pt-3">
            {{ $t('rural_indicators.admin.popup.success3') }}
          </div>
        </b-col>
      </b-row>
      <b-row class="btn-container" align-h="center">
        <sipsder-btn btnType="accept" @onClick="closeAndRedirect()"></sipsder-btn>
        <sipsder-btn btnType="cancel" @onClick="hideModal('successModal')"></sipsder-btn>
      </b-row>
    </b-modal>
    <!-- End of success modal -->

    <!-- Begin of add/edit responsible modal -->
    <b-modal ref="addResponsibleModal" :title="$t('rural_indicators.admin.responsible.popup.title')" hideFooter size="lg">
      <b-form @submit.prevent="validateResponsibles">
        <b-row align-h="center" class="px-5">
          <b-form-group :label="$t('rural_indicators.admin.responsible.entity')" label-class="font-weight-bold" class="w-100">
            <b-form-input type="text" v-model="query.selectedInstitution.name" disabled/>
          </b-form-group>
          <b-col cols="12">
            {{ $t('rural_indicators.admin.responsible.popup.claim') }}
          </b-col>
        </b-row>
        <b-row class="px-5 pt-5">
          <b-col cols="12" xl="6" md="6">
            <b-form-group :label="$t('rural_indicators.admin.responsible.popup.responsible')" label-class="font-weight-bold">
              <vue-bootstrap-typeahead :data="query.usersByInstitution" v-model="userByInstitutionSearch" ref="userByInstitutionSearch" class="w-100" 
                :serializer="user => user.name" size="lg" @hit="setSelectedUser($event)"
                :placeholder="$t('rural_indicators.admin.responsible.popup.placeholder')" >
              </vue-bootstrap-typeahead>
            </b-form-group>
          </b-col>
          <b-col cols="12" xl="6" md="6">
            <sipsder-btn btnType="accept" @onClick="setModalResponsible" :text="''" :disabled="this.query.selectedUser == null"></sipsder-btn>
            <sipsder-btn btnType="clean" @onClick="clearModalResponsible"></sipsder-btn>
          </b-col>
        </b-row>
        <b-row class="px-5 pt-2">
          <b-col cols="12">
            {{ $t('rural_indicators.admin.responsible.popup.claim2') }}
          </b-col>
          <b-col cols="12" class="pt-3">
            {{ $t('rural_indicators.admin.responsible.popup.claim3') }}
          </b-col>
        </b-row>
        <b-row class="px-5 pt-3">
          <b-col cols="6">
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.dependency') }}<span class="required"> *</span></template>
              <b-form-input type="text" 
                  name="modalResponsibleDependency" 
                  :data-vv-as="$t('rural_indicators.admin.responsible.dependency')"
                  data-vv-scope="modal"
                  v-model="modal.responsible.dependency" 
                  v-validate="{required: true, max:100}"/>
              <span class="error pt-3" v-if="errors.has('modalResponsibleDependency')">{{ errors.first('modalResponsibleDependency') }}</span>
            </b-form-group>
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.position') }}<span class="required"> *</span></template>
              <b-form-input type="text" 
                  name="modalResponsiblePosition" 
                  :data-vv-as="$t('rural_indicators.admin.responsible.position')"
                  data-vv-scope="modal"
                  v-model="modal.responsible.position"
                  v-validate="{required: true, max:50}"/>
              <span class="error pt-3" v-if="errors.has('modalResponsiblePosition')">{{ errors.first('modalResponsiblePosition') }}</span>
            </b-form-group>
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.phone') }}<span class="required"> *</span></template>
              <b-form-input type="text" 
                  name="modalResponsiblePhone" 
                  :data-vv-as="$t('rural_indicators.admin.responsible.phone')"
                  data-vv-scope="modal"
                  v-model="modal.responsible.telephone"
                  v-validate="{required: true, max:30, numeric: true}"/>
              <span class="error pt-3" v-if="errors.has('modalResponsiblePhone')">{{ errors.first('modalResponsiblePhone') }}</span>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.name_responsible') }}<span class="required"> *</span></template>
              <b-form-input type="text" v-model="modal.responsible.name" disabled/>
            </b-form-group>
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.email') }}<span class="required"> *</span></template>
              <b-form-input type="text" v-model="modal.responsible.email" disabled/>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="px-5">
          <hr class="faded">
        </div>
        <b-row class="px-5">
          <b-col cols="12">
            {{ $t('rural_indicators.admin.responsible.popup.claim4') }}
          </b-col>
        </b-row>
        <b-row class="px-5 pt-5">
          <b-col cols="12" xl="6" md="6">
            <b-form-group :label="$t('rural_indicators.admin.responsible.popup.responsible_dice')" label-class="font-weight-bold">
              <vue-bootstrap-typeahead :data="query.usersBySdp" v-model="userBySdpSearch" ref="userBySdpSearch" class="w-100" 
                :serializer="user => user.name" size="lg" @hit="setSelectedSdpUser($event)"
                :placeholder="$t('rural_indicators.admin.responsible.popup.placeholder_dice')" >
              </vue-bootstrap-typeahead>
            </b-form-group>
          </b-col>
          <b-col cols="12" xl="6" md="6">
            <sipsder-btn btnType="accept" @onClick="setModalDice" :text="''" :disabled="this.query.selectedSdpUser == null"></sipsder-btn>
            <sipsder-btn btnType="clean" @onClick="clearModalDice"></sipsder-btn>
          </b-col>
        </b-row>
        <b-row class="px-5 pt-2">
          <b-col cols="12">
            {{ $t('rural_indicators.admin.responsible.popup.claim5') }}
          </b-col>
        </b-row>
        <b-row class="px-5 pt-3">
          <b-col cols="6">
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.name') }}<span class="required"> *</span></template>
              <b-form-input type="text" 
                  name="modalDiceName"
                  v-model="modal.dice.name"
                  disabled/>
            </b-form-group>
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.phone') }}<span class="required"> *</span></template>
              <b-form-input type="text" 
                  name="modalDicePhone" 
                  :data-vv-as="$t('rural_indicators.admin.responsible.phone')"
                  data-vv-scope="modal"
                  v-model="modal.dice.telephone"
                  v-validate="{required: true, max:30, numeric: true}"/>
              <span class="error pt-3" v-if="errors.has('modalDicePhone')">{{ errors.first('modalDicePhone') }}</span>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.responsible.email') }}<span class="required"> *</span></template>
              <b-form-input type="text" v-model="modal.dice.email" disabled/>
            </b-form-group>
          </b-col>
          <span class="error pt-3" v-if="showErrorModal">{{ $t('rural_indicators.admin.responsible.popup.error') }}</span>
        </b-row>
        <b-row class="btn-container" align-h="center">
          <sipsder-btn btnType="cancel" @onClick="closeReponsableModal"></sipsder-btn>
          <sipsder-btn btnType="accept" type="submit" :text="$t('rural_indicators.admin.responsible.popup.ok')"></sipsder-btn>
        </b-row>
      </b-form>
    </b-modal>
    <!-- End of add/edit responsible modal -->

	</b-container>
</template>
<script>
import Vue from 'vue';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import VueSelect from "vue-select";
import * as lang from "vuejs-datepicker/src/locale";
import Datepicker from 'vuejs-datepicker';
import TableSelect from "@/components/shared/TableSelect";
import RichText from '@/components/shared/RichText.vue'
import MapSearch from '@/components/shared/arcgis/MapSearch';
import { ARCGIS_TAGS, RURAL_INDICATOR_TYPES, RURAL_INDICATOR_STATUS, RURAL_INDICATOR_STATUS_LABEL, PERMISSIONS_TYPES, INSTITUTION } from '../../../../domain_constants';
import { SERVICE_NAMES } from '../../../../sipsder_constants';
import VAPI from '../../../../http_common';
import moment from 'moment';
import _ from "lodash";

export default {
  components: {
    VueBootstrapTypeahead,
    VueSelect,
    Datepicker,
    MapSearch,
    TableSelect,
    RichText
  },
  async mounted( ) {
    this.selectedTypeOptions = this.typeOptions.filter( item => item.value == parseInt(RURAL_INDICATOR_TYPES.INDICATOR))[ 0 ];
    this.ruralThemes = await this.getRuralModels( );
    this.ruralDocuments = await this.getRuralDocuments( );
    this.policies = await this.getNormPolicies( );
    this.geographicCoverage = await this.getGeographicCoverages( );
    this.measureUnit = await this.getMeasureUnits( );
    this.periodicity = await this.getPeriodicities( );
    this.gatheringMethod = await this.getGatheringMethods( );
    this.disaggregation = await this.getDisaggregationMethods( );
    this.calculationType = await this.getCalculationTypes( );
    if ( this.isEditing ) {
      this.currentIndicator = await this.getRuralIndicator( this.$route.params.id );
      this.selectedTypeOptions = this.typeOptions.filter( item => item.value == parseInt(this.currentIndicator.type))[ 0 ];
      this.currentIndicator.geographic = this.geographicCoverage.filter( geo => geo.value == this.currentIndicator.geographicCoverage)[ 0 ];
      this.currentIndicator.measureUnit = this.measureUnit.filter( mu => mu.value == this.currentIndicator.measureUnit)[ 0 ];
      this.currentIndicator.periodicity = this.periodicity.filter( pe => pe.value == this.currentIndicator.periodicity)[ 0 ];
      this.currentIndicator.gatheringMethod = this.gatheringMethod.filter( gm => gm.value == this.currentIndicator.gatheringMethod)[ 0 ];
      this.currentIndicator.disaggregation = this.disaggregation.filter( pd => pd.value == this.currentIndicator.disaggregation)[ 0 ];
      this.currentIndicator.calculationType = this.calculationType.filter( ct => ct.value == this.currentIndicator.calculationType)[ 0 ];
      this.currentIndicator.ruralModels = this.findRuralModel(JSON.parse(this.currentIndicator.ruralModels));
      this.currentIndicator.links = JSON.parse(this.currentIndicator.links);
      let ruralDocumentsAssociated = [];
      this.currentIndicator.ruralDocuments.forEach( hashedId => {
        ruralDocumentsAssociated.push( this.ruralDocuments.filter( doc => doc.value == hashedId)[ 0 ] );
      })
      this.currentIndicator.ruralDocuments = ruralDocumentsAssociated;

      let normsAssociated = [];
      this.currentIndicator.policies.forEach( hashedId => {
        normsAssociated.push( this.policies.filter( doc => doc.value == hashedId)[ 0 ] );
      })
      Vue.set(this.currentIndicator, 'policies', normsAssociated);

      let tagsAssociated = [];
      if( this.currentIndicator.tags != null ) {
        this.currentIndicator.tags.split( ',' ).forEach(tag => {
          tagsAssociated.push( { "text": tag, "tiClasses": [ "ti-valid" ] } );
        });
      }
      this.currentIndicator.tags = tagsAssociated;

      if( this.currentIndicator.institution != null ) {
        this.query.selectedInstitution = this.currentIndicator.institution;
        this.entitySearch = this.currentIndicator.institution.name;

        this.userByInstitutionSearch = this.currentIndicator.responsibleObject.name;
        this.query.selectedUser = this.currentIndicator.responsibleObject;
        this.modal.responsible = this.currentIndicator.responsibleObject;

        this.userBySdpSearch = this.currentIndicator.diceObject.name;
        this.query.selectedSdpUser = this.currentIndicator.diceObject;
        this.modal.dice = this.currentIndicator.diceObject;

        this.$nextTick( ( ) => {
          this.$refs['userByInstitutionSearch'].$data.inputValue = this.currentIndicator.responsibleObject.name;
          this.$refs['userBySdpSearch'].$data.inputValue = this.currentIndicator.diceObject.name;
          this.$refs['entitySearchTypeahead'].$data.inputValue = this.currentIndicator.institution.name;
        });
      }
      this.showTable = false;
      this.showTable = true;
    }
  },
  data() {
    return {
      ARCGIS_TAGS,
      RURAL_INDICATOR_TYPES,
      INSTITUTION,
      asterisk: '<span class="required"> *</span>',
      activeTab: 0,
      selectedTypeOptions: null,
      selectedCurriculum: '',
      languages: lang,
      showTable: true,
      typeOptions: [
        { label: this.$t('rural_indicators.option_figure'), value: RURAL_INDICATOR_TYPES.FIGURE },
        { label: this.$t('rural_indicators.option_index'), value: RURAL_INDICATOR_TYPES.INDEX },
        { label: this.$t('rural_indicators.option_indicator'), value: RURAL_INDICATOR_TYPES.INDICATOR },
        { label: this.$t('rural_indicators.option_bulletin'), value: RURAL_INDICATOR_TYPES.BULLETIN }
      ],
      geographicCoverage: [],
      measureUnit: [],
      periodicity: [],
      gatheringMethod: [],
      disaggregation: [],
      calculationType: [],
      ruralThemeColumns: [
        { key: 'structure', label: this.$t('document.admin.tableTitles.ruralModel.structure'), sortable: true },
        { key: 'component', label: this.$t('document.admin.tableTitles.ruralModel.component'), sortable: true },
        { key: 'subComponent', label: this.$t('document.admin.tableTitles.ruralModel.subcomponent'), sortable: true },
        { key: 'status', label: this.$t('document.admin.tableTitles.ruralModel.main'), sortable: true },
        { key: 'actions', label: "" }
      ],
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
      ruralThemes: [],
      ruralDocuments: [],
      policies: [],
      entitySearch: '',
      userByInstitutionSearch: '',
      userBySdpSearch: '',
      showErrorModal: false,
      linksHasError: false,
      query: {
        institutions: [],
        usersByInstitution: [],
        usersBySdp: [],
        selectedInstitution: {
          sector: {
            institutionType: {
              type: null
            }
          }
        },
        selectedUser: null,
        selecetedSdpUser: null,
      },
      modal: {
        responsible: {
          dependency: undefined,
          name: undefined, 
          position: undefined,
          email: undefined,
          telephone: undefined
        },
        dice: {
          name: undefined,
          email: undefined,
          telephone: undefined
        }
      },
      tag: "",
      checkedLink: null,
      disabledCheckedLink: false,
      currentIndicator: {
        status: RURAL_INDICATOR_STATUS.EDITING,
        createdBy: '',
        source: null,
        definition: null,
        enabled: true,
        links: [],
        policies: [],
        map: {}
      },
      deletedLinks: [],
      customToolbar: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ['link', 'image', 'video', 'formula'],
        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }]
      ],
    }
  },
  methods: {
    hideModal(ref) { 
      this.$refs[ref].hide();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    async getEntities(query) {
      try {
        let response = await VAPI.get(`/${SERVICE_NAMES.INSTITUTION}/governmental?q=${query}`);
        return response;
      }
      catch( err ) { 
        console.error( 'Error fetching entities ', err )
      }
    },
    async getUserByInstitution(query,institution) {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/responsible/search?q=${query}&institution=${institution}` );
        return response;
      }
      catch( err ) { 
        console.error( 'Error fetching users by institution ', err )
      }
    },
    async getUserBySdp(query) {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/responsible/search?q=${query}&institution=${INSTITUTION.SDP}` );
        return response;
      }
      catch( err ) { 
        console.error( 'Error fetching users ', err )
      }
    },
    async getRuralModels() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_MODEL}/tree` );
        return this.toRuralFormat(response.data.data);
      }
      catch( err ) { 
        console.error( 'Error fetching rural model tree ', err )
      }
    },
    async getGeographicCoverages() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/list/geographic/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching geographic coverages ', err )
      }
    },
    async getMeasureUnits() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/measure/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching measure units ', err )
      }
    },
    async getPeriodicities() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/periodicity/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching periodicities ', err )
      }
    },
    async getGatheringMethods() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/method/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching gathering methods ', err )
      }
    },
    async getDisaggregationMethods() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/disaggregation/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching disaggregation methods ', err )
      }
    },
    async getCalculationTypes() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/calculation/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching calculation types ', err )
      }
    },
    async getRuralDocuments() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/document/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching rural documents ', err )
      }
    },
    async getNormPolicies() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/list/norm/search` );
        let raw = response.data.data;
        raw.forEach( item => {
          item.date = moment(item.date).format("DD/MM/YYYY");
        })
        return raw;
      }
      catch( err ) { 
        console.error( 'Error fetching norm policies ', err )
      }
    },
    async getRuralIndicator( id ) {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/indicator/${id}` );
        response.data.data.map = JSON.parse(response.data.data.map);
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching rural indicator ', err )
      }
    },
    setActiveTab( id ) {
      if( id == 1 && this.currentIndicator.id == null ) {
        return;
      }
      this.activeTab = id;
    },
    getStatusColor( status ) {
      switch( status ) {
        case RURAL_INDICATOR_STATUS.EDITING:
          return '#ff9b56'
          break;
        case RURAL_INDICATOR_STATUS.PUBLISHED:
          return '#009E11'
          break;
      }
    },
    getStatusLabel( status ) {
      switch( status ) {
        case RURAL_INDICATOR_STATUS.EDITING:
          return RURAL_INDICATOR_STATUS_LABEL.EDITING
          break;
        case RURAL_INDICATOR_STATUS.PUBLISHED:
          return RURAL_INDICATOR_STATUS_LABEL.PUBLISHED
          break;
      }
    },
    toRuralFormat(ruralList) {
      ruralList.forEach( level1 => {
        if ( level1.children ) {
          level1.children.forEach( level2 => {
            level2.structure = level2.label;
            if ( level2.children ) {
              level2.children.forEach( level3 => {
                level3.structure = level2.label;
                level3.component = level3.label;
                if ( level3.children ) {
                  level3.children.forEach( level4 => {
                    level4.structure = level2.label;
                    level4.component = level3.label;
                    level4.subComponent = level4.label;
                  });
                }
              });
            }
          });
        }
      });
      return ruralList;
    },
    findInTree( node, id ){
      if ( node.id == id ) {
        return node;
      }
      var res = null;
      for ( var idx = 0;node.children && idx < node.children.length; idx++ ) {
        var nNode = node.children[ idx ];
        let val = this.findInTree( nNode, id );
        if ( val ) {
          res = val;
          break;
        }
      }
      return res;
    },
    findRuralModel( rural ) {
      if( !rural || !this.ruralThemes )
          return rural;
      let models = [];
      rural.forEach(item => {
        this.ruralThemes.forEach( node => {
          let value = this.findInTree( node, item.id );
          if ( value ) {
            value.status = item.principal
            models.push( value );
          }
        });
      })
      return models;
    },
    changeValueDescription( value ){
      this.currentIndicator.source = value
    },
    changeValueDefinition( value ){
      this.currentIndicator.definition = value
    },
    setCurriculum(e) {
      if( e.target.files[0].size < 5.0e6 ) {
        this.currentIndicator.curriculum = e.target.files[0];
        this.selectedCurriculum = this.currentIndicator.curriculum.name
      }
      else {
        this.selectedCurriculum = ''
      }
    },
    arraySwap( array, source, target ) {
      let tmp = array[ source ];
      Vue.set( array, source, array[ target ] );
      Vue.set( array, target, tmp );
    },
    swapUp( currentIdx ) {
      if( currentIdx > 0 ) {
        this.currentIndicator.links[ currentIdx ].order -= 1
        this.currentIndicator.links[ currentIdx - 1 ].order += 1
        this.arraySwap( this.currentIndicator.links, currentIdx, currentIdx - 1 )
        this.checkedLink = currentIdx - 1;
      }
    },
    swapDown( currentIdx ) {
      if( currentIdx < this.currentIndicator.links.length - 1 ) {
        this.currentIndicator.links[ currentIdx ].order += 1
        this.currentIndicator.links[ currentIdx + 1 ].order -= 1
        this.arraySwap( this.currentIndicator.links, currentIdx, currentIdx + 1 )
        this.checkedLink = currentIdx + 1;
      }
    },
    deleteLink( currentIdx ) {
      let deleted = this.currentIndicator.links.splice( currentIdx, 1 );
      if( deleted[0].id != null ) {
        this.deletedLinks.push( deleted[0].id );
      }
      for (let idx = 0; idx < this.currentIndicator.links.length; idx++) {
        this.currentIndicator.links[idx].order = idx + 1;
      }
      this.checkedLink = null;
      this.disabledCheckedLink = false;
    },
    addLink( ) {
      this.$validator.validateAll( 'link' ).then( valid => {
        if( valid && this.currentIndicator.links.length < 5 ) {
            let newLink = {
            id: null,
            url: "",
            name: "",
            description: "",
            order: this.currentIndicator.links.length + 1
          };
          this.currentIndicator.links.push( newLink )
          this.checkedLink = this.currentIndicator.links.length - 1;
          this.disabledCheckedLink = true;
        }
      });
    },
    confirmLink( ) {
      this.$validator.validateAll( 'link' ).then( valid => {
        if( valid ) {
          this.linksHasError = false;
          this.checkedLink = null;
          this.disabledCheckedLink = false;
        }
        else {
          this.linksHasError = true;
        }
      });
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
    validateResponsibleModal() {
      return this.query.selectedUser != null && this.query.selectedSdpUser != null && this.modal.responsible.name != undefined && this.modal.dice.name != undefined;
    },
    validateResponsibles() {
      this.$validator.validateAll( 'modal' ).then( valid => {
        if( valid && this.validateResponsibleModal( ) ) {
          this.showErrorModal = false;
          this.submitResponsibles( );
        }
        else {
          this.showErrorModal = true;
        }
      })
    },
    async submitResponsibles( ) {
      try {
        await VAPI.post( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/responsible/create`, this.modal )
        .then( 
          ( success ) => {
            Vue.set( this.currentIndicator, 'responsible', this.modal.responsible.id );
            Vue.set( this.currentIndicator, 'dice', this.modal.dice.id );
            this.hideModal( 'addResponsibleModal' )
          }, ( error ) => {
            this.hideModal( 'addResponsibleModal' );
            this.showModal( 'errorAddingResponsiblesModal' );
          }
        );      
      }
      catch( error ) {
        console.error( 'Error trying to post responsibles', error );
        this.hideModal( 'addResponsibleModal' );
        this.showModal( 'errorsModal' );
      }
    },
    setSelectedInstitution( value ) {
      Vue.set( this.query, 'selectedInstitution', value );
    },
    setSelectedUser( value ) {
      Vue.set( this.query, 'selectedUser', value );
    },
    setModalResponsible() {
      if (this.query.selectedUser != null) {
        Vue.set( this.modal, 'responsible', this.query.selectedUser );
      }
    },
    setSelectedSdpUser( value ) {
      Vue.set( this.query, 'selectedSdpUser', value );
    },
    setModalDice() {
      if (this.query.selectedSdpUser != null) {
        Vue.set( this.modal, 'dice', this.query.selectedSdpUser );
      }
    },
    clearModalResponsible() { 
      this.$refs.userByInstitutionSearch.inputValue = '';
      this.query.selectedUser = null;
      this.userByInstitutionSearch = '';
      this.modal.responsible.dependency = undefined;
      this.modal.responsible.name = undefined;
      this.modal.responsible.position = undefined;
      this.modal.responsible.email = undefined;
      this.modal.responsible.telephone = undefined;
    },
    clearModalDice() { 
      this.$refs.userBySdpSearch.inputValue = '';
      this.query.selectedSdpUser = null;
      this.userBySdpSearch = '';
      this.modal.dice.name = undefined;
      this.modal.dice.email = undefined;
      this.modal.dice.telephone = undefined;
    },
    closeReponsableModal() {
      this.showErrorModal = false;
      this.hideModal('addResponsibleModal');
    },
    assemblePayload( status ) {
      let formData = new FormData();
      formData.append( 'type', this.selectedTypeOptions.value );
      formData.append( 'enabled', this.currentIndicator.enabled );
      if( !this.currentIndicator.enabled ) formData.append( 'disabledReason', this.currentIndicator.disabledReason );
      formData.append( 'status', status );
      formData.append( 'map',  JSON.stringify( this.currentIndicator.map ) );
      formData.append( 'name', this.currentIndicator.name );
      formData.append( 'summary', this.currentIndicator.summary );
      formData.append( 'geographicCoverage', this.currentIndicator.geographic.value );
      formData.append( 'updateDate', moment(this.currentIndicator.updateDate).format("DD/MM/YYYY"));
      formData.append( 'source', this.currentIndicator.source );
      if( this.currentIndicator.links.length > 0 ) formData.append( 'links', JSON.stringify( this.currentIndicator.links ) );
      if( this.deletedLinks.length > 0 ) formData.append( 'deletedLinks', JSON.stringify( this.deletedLinks ) );
      if( this.currentIndicator.responsible != null ) formData.append( 'responsible', this.currentIndicator.responsible );
      if( this.currentIndicator.dice != null ) formData.append( 'dice', this.currentIndicator.dice );
      formData.append( 'definition', this.currentIndicator.definition );
      formData.append( 'measureUnit', this.currentIndicator.measureUnit.value );
      formData.append( 'periodicity', this.currentIndicator.periodicity.value );
      formData.append( 'gatheringMethod', this.currentIndicator.gatheringMethod.value );
      formData.append( 'disaggregation', this.currentIndicator.disaggregation.value );
      formData.append( 'calculationType', this.currentIndicator.calculationType.value );
      formData.append( 'calculationMethod', this.currentIndicator.calculationMethod );
      if( this.currentIndicator.glossary != null ) formData.append( 'glossary', this.currentIndicator.glossary );
      if( this.currentIndicator.observation != null ) formData.append( 'observation', this.currentIndicator.observation );
      if( this.currentIndicator.curriculum != null ) {
        formData.append( 'curriculum', this.currentIndicator.curriculum );
      }

      let ruralModels = [];
      this.currentIndicator.ruralModels.forEach( model => {
        let currentStatus = model.status != null ? model.status : false;
        ruralModels.push( { id: model.id, principal: currentStatus } );
      });
      formData.append( 'ruralModels', JSON.stringify( ruralModels ) );

      let ruralDocuments = [];
      if( this.currentIndicator.ruralDocuments != null ) {
        this.currentIndicator.ruralDocuments.forEach( document => {
          ruralDocuments.push( document.value );
        });
      }
      formData.append( 'ruralDocuments', ruralDocuments );

      let policies = [];
      if( this.currentIndicator.policies != null ) {
        this.currentIndicator.policies.forEach( norm => {
          policies.push( norm.value );
        });
      }
      formData.append( 'policies', policies );

      let tags = [];
      if( this.currentIndicator.tags != null ) {
        this.currentIndicator.tags.forEach( tag => {
          tags.push( tag.text );
        });
      }
      if( tags.length > 0 ) {
        formData.append( 'tags', tags.join(',') );
      }
      return formData;
    },
    validateFirstStage( ) {
      let isValid = this.isValidType && 
        this.currentIndicator.ruralModels != null && 
        this.currentIndicator.ruralModels.length > 0 &&
        this.currentIndicator.definition != null && this.currentIndicator.definition != '' &&
        this.currentIndicator.source != null && this.currentIndicator.source != '' &&
        ( this.currentIndicator.curriculum != null || this.currentIndicator.curriculumId != null)
      return isValid;
    },
    validateSecondStage( ) {
      let isValid = this.isValidType && 
        this.currentIndicator.ruralModels != null && 
        this.currentIndicator.ruralModels.length > 0 &&
        ( this.currentIndicator.curriculum != null || this.currentIndicator.curriculumId != null) &&
        this.currentIndicator.tags != null && 
        this.currentIndicator.tags.length > 0 && 
        this.currentIndicator.responsible != null && 
        this.currentIndicator.dice != null;

      this.currentIndicator.links.forEach( link => { 
        if( link.url.length <= 0 || link.url.length > 800 || link.name.length <= 0 || link.name.length > 80 || 
            link.description.length <= 0 || link.description.length > 100 ) {
          isValid &= false;
        }
      });
      return isValid;
    },
    async submitIndicator( payload ) {
      let path = `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/`;
      path += !this.isEditing ? `indicator/create` : `indicator/update/${this.currentIndicator.id}`
      let returned = null;
      try {
        await VAPI.post( path, payload )
        .then( 
          ( success ) => {
            returned = success.data;
          }, ( error ) => {
            console.error( 'Error trying to post indicator', error );
            this.showModal( 'errorSubmitFormModal' );
          }
        );      
      }
      catch( error ) {
        console.error( 'Error trying to post indicator', error );
        this.showModal( 'errorsModal' );
      }
      return returned;
    },
    saveAndContinue( ) {
      this.$validator.validateAll( 'form1' ).then( valid => {
        let formIsValid = valid && this.validateFirstStage( );
        if( formIsValid ) {
          let payload = this.assemblePayload( RURAL_INDICATOR_STATUS.EDITING );
          this.saveAndContinueSubmit( payload );
        }
        else {
          this.showModal( 'errorsModal' );
        }
      })
    },
    async saveAndContinueSubmit( payload ) {
      let response = await this.submitIndicator( payload );
      this.currentIndicator.id = response.data.id;
      this.currentIndicator.status = RURAL_INDICATOR_STATUS.EDITING;
      this.showModal('continueSaveModal');
    },
    continueSave( ) {
      this.hideModal( 'continueSaveModal' );
      this.setActiveTab(1);
      window.scrollTo( { top: 100, left: 0, behavior: 'smooth' } );
    },
    saveAndLeave( ) {
      this.$validator.validateAll( 'form1' ).then( valid => {
        let formIsValid = valid && this.validateFirstStage( );
        if( formIsValid ) {
          let payload = this.assemblePayload( RURAL_INDICATOR_STATUS.EDITING );
          this.saveAndLeaveSubmit( payload );
        }
        else {
          this.showModal( 'errorsModal' );
        }
      })
    },
    async saveAndLeaveSubmit( payload ) {
      const response = await this.submitIndicator( payload );
      if (response) {
        this.showModal( 'partialSaveModal' );      
      }    
    },
    partialSave( ) {
      this.hideModal( 'partialSaveModal' );
      this.$router.push( { name: 'RuralIndicatorIndex' } )
    },
    saveAndPublish( ) {
      this.$validator.validateAll( 'form2' ).then( valid => {
        let formIsValid = valid && this.validateSecondStage( );
        if( formIsValid ) {
          let payload = this.assemblePayload( RURAL_INDICATOR_STATUS.PUBLISHED );
          this.publish( payload );
        }
        else {
          this.showModal( 'errorsModal' );
        }
      })
    },
    async publish( payload ) {
      let response = await this.submitIndicator( payload );
      this.hideModal( 'savePublishModal' );
      this.$router.push( { name: 'RuralIndicatorIndex' } )
    },
    closeAndRedirect( ) {
      this.hideModal('successModal');
      this.$router.push( { name: 'RuralIndicatorIndex' } );
    }
  },
  computed: {
    isEditing() {
      return this.$route.params.id !== undefined || this.currentIndicator.id != null;
    },
    isValidType() {
      if( this.selectedTypeOptions == null )
        return false;
      return this.selectedTypeOptions.value >= 1 && this.selectedTypeOptions.value <= 4;
    },
    currentLocale( ) {
      return this.$i18n.locale;
    },
    disabledDates( ) {
      let now = new Date( );
      now.setHours( 0, 0, 0, 0 );
      return {
        from: now
      }
    },
    hasAssociatedResponsibles( ) {
      return this.currentIndicator.responsible != null && this.currentIndicator.dice != null;
    }
  },
  watch: {
    entitySearch: _.debounce(function (query) {
      if (query.length > 0) {
        this.getEntities(query).then((success) => {
          this.query.institutions = success.data.data;
        });
      }
    },500),
    userByInstitutionSearch: _.debounce(function (query) {
      if (query.length > 0) {
        this.getUserByInstitution(query, this.query.selectedInstitution.id).then((success) => {
          this.query.usersByInstitution = success.data.data;
        });
      }
    },500),
    userBySdpSearch: _.debounce(function (query) {
      if (query.length > 0) {
        this.getUserBySdp(query).then((success) => {
          this.query.usersBySdp = success.data.data;
        });
      }
    },500),
    selectedTypeOptions( ) {
      switch( this.selectedTypeOptions.value ) {
          case RURAL_INDICATOR_TYPES.FIGURE:
            this.$router.push({name: 'RuralFigureCreate'})
            break;
          case RURAL_INDICATOR_TYPES.INDEX:
            this.$router.push({name: 'RuralIndexCreate'})
            break;
          case RURAL_INDICATOR_TYPES.BULLETIN:
            this.$router.push({name: 'RuralBulletinCreate'})
            break;
          default:
            break;
        }
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../../../../stylesheets/style.sass'
  .div-90
    width: 90%
    margin-left: auto
    margin-right: auto
  .required
    color: red
  .error
    color: red
    padding: 5px
  .bordered-container
    padding: 20px
    border: 2px solid black
    margin-top: 10px
    margin-bottom: 10px
  .faded
    border: 0
    height: 2px
    background: #fff
    background: linear-gradient(to left, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,.75) 50%, hsla(0,0%,0%,.1) 100%)
    +flexbox
  .tag-container
    max-width: none
  .inline-title
    padding: 0px 15px 0px 5px
  .checkbox-looking-radio
    -webkit-appearance: checkbox
    -moz-appearance: checkbox 
    -ms-appearance: checkbox
  .link-container
    background-color: #eee
    padding: 20px
    border-radius: 15px
  html, .custom-control-label
    width: 100% !important
    color: red
  .marginless-button
    margin-top: -20px
    margin-bottom: -20px
  .hidden-input
    visibility: hidden;
    height: 0px !important;
    padding: 0px;
  .padded-buttons
    margin-top: -20px;

  .arrow
    text-align: center
    ul
      list-style: none
      display: inline-table
      li
        display: inline
        a
          cursor: pointer
          display: block
          float: left
          height: 80px
          background: #0db8bb
          text-align: center
          padding: 25px 40px 0 80px
          position: relative
          margin: 0 10px 0 0
          font-size: 20px
          text-decoration: none
          color: #fff
          &:after
            content: ""
            border-top: 40px solid transparent
            border-bottom: 40px solid transparent
            border-left: 40px solid #0db8bb
            position: absolute
            right: -40px
            top: 0
            z-index: 1
          &:before
            content: ""
            border-top: 40px solid transparent
            border-bottom: 40px solid transparent
            border-left: 40px solid #fff
            position: absolute
            left: 0
            top: 0
        &:first-child a
          border-top-left-radius: 10px
          border-bottom-left-radius: 10px
          &:before
            display: none
        &:last-child a
          padding-right: 80px
          border-top-right-radius: 10px
          border-bottom-right-radius: 10px
          &:after
            display: none
        a
          &:hover, &.active
            background: #02747C
            color: #fff
          &.disabled
            background: gray
            color: #fff
          &:hover:after, &.active:after
            border-left-color: #02747C
    @media (max-width: 991px)
      .arrow ul
        display: block
        li
          display: block
          width: 100%
          a
            float: none
            padding: 20px 0 0 0
            margin: 0 0 5px 0
            &:before, &:after
              border-top: 0
              border-bottom: 0
              border-left: 0
          &:first-child a
            border-radius: 0
            border-top-left-radius: 10px
            border-top-right-radius: 10px
          &:last-child a
            border-radius: 0
            border-bottom-left-radius: 10px
            border-bottom-right-radius: 10px
            padding-right: 0
  
</style>