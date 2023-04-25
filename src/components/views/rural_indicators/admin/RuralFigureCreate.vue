<template>
	<b-container class='container-form'>
    <sipsder-title :title="$t( 'rural_indicators.admin.title' )" type="admin"></sipsder-title>
    <b-row>
      <div class="pb-5">
        {{ $t( 'rural_indicators.admin.claim' ) }}
      </div>
    </b-row>
    <b-row>
      <b-form-group :label="$t( 'rural_indicators.admin.created_by' )" label-class="font-weight-bold" class="w-50">
        <b-form-input type="text" v-model="currentIndicator.createdBy" disabled/>
      </b-form-group>
    </b-row>
    <b-row>
      <b-form-group :label="$t( 'rural_indicators.type' )" label-class="font-weight-bold" class="w-50">
        <vue-select :options="typeOptions" name="ruralIndicatorSelector" v-model="selectedTypeOptions" :placeholder="$t( 'rural_indicators.type_placeholder' )"
            class="bg-white" v-validate="{ required: true }" :disabled="isEditing" :data-vv-as="$t( 'rural_indicators.type' )">
        </vue-select>
        <span class="error pt-3" v-if="!isValidType">{{ $t( 'rural_indicators.admin.validation_errors.one' ) }}</span>
      </b-form-group>
    </b-row>

    <div v-if="isValidType && this.selectedTypeOptions.value == RURAL_INDICATOR_TYPES.FIGURE">
      <b-form @submit.prevent="submit">
        <b-row class="pt-2" align-v="start" align-h="end">
          <b-form-checkbox id="indicatorEnabled"
            class="inline-control pt-1"
            v-model="currentIndicator.enabled"
            :value="true"
            :unchecked-value="false">
          </b-form-checkbox>
          <div class="inline-title">{{ $t( 'rural_indicators.admin.enabled' ) }}</div>
        </b-row>
        <b-row class="pt-2" align-v="center" v-if="!currentIndicator.enabled">
          <b-form-group label-class="font-weight-bold" class="w-100">
            <template slot="label">{{ $t( 'rural_indicators.admin.reason' ) }}<span class="required"> *</span></template>
            <b-form-textarea name="ruralIndicatorDisabledReason" class="inline-control" :rows="3" :max-rows="6"
              v-model="currentIndicator.disabledReason" v-validate="{ required: !currentIndicator.enabled, max: 280 }" :data-vv-as="$t( 'rural_indicators.admin.reason' )"
              data-vv-scope="form">
            </b-form-textarea>
            <span v-if="errors.has( 'form.ruralIndicatorDisabledReason' )" class="error">
              {{ errors.first( 'form.ruralIndicatorDisabledReason' ) }}
            </span>
          </b-form-group>
        </b-row>
        <b-row class="pt-2">
          <b-form-group label-class="font-weight-bold" class="w-100">
            <template slot="label">{{ $t( 'rural_indicators.admin.map' ) }}<span class="required"> *</span></template>
            <map-search v-if="currentIndicator.map" v-model="currentIndicator.map.url" :tag="ARCGIS_TAGS.FIGURES" class="bg-white" :placeholder="$t( 'rural_indicators.admin.map_placeholder' )"
                name="ruralIndicatorMap" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.map' )" data-vv-scope="form"/>
            <span v-if="errors.has( 'form.ruralIndicatorMap' )" class="error"> {{ errors.first( 'form.ruralIndicatorMap' ) }} </span>
          </b-form-group>
        </b-row>
        <b-row class="pt-2">
          <b-form-group label-class="font-weight-bold" class="w-100">
            <template slot="label">{{ $t( 'rural_indicators.admin.figure_name' ) }}<span class="required"> *</span></template>
            <b-form-input type="text" name="indicatorName" :data-vv-as="$t('rural_indicators.admin.figure_name')" 
                v-model="currentIndicator.name" v-validate="{ required: true, max: 180 }" data-vv-scope="form"/>
            <span class="error pt-3" v-if="errors.has( 'form.indicatorName' )">{{ errors.first( 'form.indicatorName' ) }}</span>
          </b-form-group>
        </b-row>
        <b-row class="pt-2">
          <b-form-group label-class="font-weight-bold" class="w-100">
            <template slot="label">{{ $t( 'rural_indicators.admin.figure_summary' ) }}<span class="required"> *</span></template>
            <b-form-textarea name="indicatorSummary" class="inline-control" :rows="3" :max-rows="6"
              v-model="currentIndicator.summary" v-validate="{ required: true, max: 280 }" :data-vv-as="$t( 'rural_indicators.admin.figure_summary' )"
              data-vv-scope="form">
            </b-form-textarea>
            <span class="error pt-3" v-if="errors.has( 'form.indicatorSummary' )">{{ errors.first( 'form.indicatorSummary' ) }}</span>
          </b-form-group>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="6" class="pl-0">
            <b-form-group label-class="font-weight-bold" class="w-100">
              <template slot="label">{{ $t( 'rural_indicators.admin.geographic_coverage' ) }}<span class="required"> *</span></template>
              <vue-select :options="geographicCoverage" name="indicatorGeographicCoverage" v-model="currentIndicator.geographic" :placeholder="$t( 'rural_indicators.admin.geo_placeholder' )"
                  class="bg-white" v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.geographic_coverage' )" data-vv-scope="form">
              </vue-select>
              <span v-if="errors.has( 'form.indicatorGeographicCoverage' )" class="error"> {{ errors.first( 'form.indicatorGeographicCoverage' ) }} </span>
            </b-form-group>
          </b-col>
          <b-col cols="6" class="pr-0">
            <b-form-group label-class="font-weight-bold" class="w-100">
              <template slot="label">{{ $t( 'rural_indicators.admin.last_update' ) }}<span class="required"> *</span></template>
              <datepicker :placeholder="$t('util.insertDate')" v-model="currentIndicator.updateDate" name="ruralIndicatorDate" class="date-picker"
                v-validate="{ required: true }" :data-vv-as="$t( 'rural_indicators.admin.last_update' )" data-vv-scope="form" :language="languages[ currentLocale ]" 
                :calendar-button="true" calendar-button-icon="fa fa-calendar" :disabledDates="disabledDates" :clear-button="true">
              </datepicker>
              <span v-if="errors.has( 'form.ruralIndicatorDate' )" class="error"> {{ errors.first( 'form.ruralIndicatorDate' ) }} </span>
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
        <!-- Sources, documents and links box -->
        <b-row class="bordered-container pt-2" align-v="center">
          <b-col cols="12">
            <div class="font-weight-bold">{{$t('rural_indicators.admin.source_title')}}</div>
          </b-col>
          <b-col cols="12">
            <b-form-group>
              <template slot="label">{{ $t('rural_indicators.admin.source') }}<span class="required"> *</span></template>
              <rich-text :options="customToolbar" @changeValue="changeValueDescription" :newContent="currentIndicator.source"></rich-text>
              <span class="error" v-if="currentIndicator.source == null || currentIndicator.source == ''">
                {{ $t('rural_indicators.admin.source_error' )}}
              </span> 
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
                      <b-form-checkbox :id="'linksSelector-'+i" :value="i" :unchecked-value="null" v-model="checkedLink" @change="disabledCheckedLink = true" :disabled="disabledCheckedLink">
                      </b-form-checkbox>
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
            <div class="font-weight-bold">{{$t('rural_indicators.admin.documents')}}</div>
          </b-col>
          <b-col cols="12" class="px-5 pt-3">
            <b-form-group label-class="font-weight-bold" class="w-100">
              <!-- <template slot="label">{{ $t( 'rural_indicators.admin.documents_exists' ) }}</template> -->
              <table-select v-model="currentIndicator.ruralDocuments" :label="$t( 'rural_indicators.admin.documents_exists' )" labelSelect="label" :taggable="true"
                :labelBold="false" :options="ruralDocuments" :tableFields="ruralDocumentColumns" :clearable="true" name="ruralDocumentSelector" :key="currentIndicator.name">
                <div slot="actionsCol" slot-scope="{row}">
                  <div class="d-flex justify-content-center">
                    <sipsder-btn btnType="search" text="" @onClick="previewDocument(row.item.value)">
                    </sipsder-btn>
                  </div>
                </div>
              </table-select>
            </b-form-group>
          </b-col>
        </b-row>
        <!-- Responsibles box -->
        <b-row class="bordered-container pt-2" align-v="center">
          <b-col cols="12">
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
          <sipsder-btn btnType="accept" type="submit"></sipsder-btn>
        </b-row>
      </b-form>
    </div>
    
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
          {{ $t('rural_indicators.admin.popup.figure_error') }}
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
import { ARCGIS_TAGS, RURAL_INDICATOR_TYPES, PERMISSIONS_TYPES, INSTITUTION } from '../../../../domain_constants';
import { SERVICE_NAMES } from '../../../../sipsder_constants';
import VAPI from '../../../../http_common';
import _ from "lodash";

export default {
  components: {
    VueBootstrapTypeahead,
    VueSelect,
    Datepicker,
    TableSelect,
    RichText,
    MapSearch,
  },
  async mounted() {
    this.selectedTypeOptions = this.typeOptions.filter( item => item.value == parseInt(RURAL_INDICATOR_TYPES.FIGURE))[ 0 ];
    this.ruralThemes = await this.getRuralModels( );
    this.ruralDocuments = await this.getRuralDocuments( );
    this.geographicCoverage = await this.getGeographicCoverages( );
    if ( this.isEditing ) {
      this.currentIndicator = await this.getRuralFigure( this.$route.params.id );
      this.selectedTypeOptions = this.typeOptions.filter( item => item.value == parseInt(this.currentIndicator.type))[ 0 ];
      this.currentIndicator.geographic = this.geographicCoverage.filter( geo => geo.value == this.currentIndicator.geographicCoverage)[ 0 ];
      this.currentIndicator.ruralModels = this.findRuralModel(this.currentIndicator.ruralModels);
      let ruralDocumentsAssociated = [];
      this.currentIndicator.ruralDocuments.forEach( hashedId => {
        ruralDocumentsAssociated.push( this.ruralDocuments.filter( doc => doc.value == hashedId)[ 0 ] );
      })
      this.currentIndicator.ruralDocuments = ruralDocumentsAssociated;
      let tagsAssociated = [];
      this.currentIndicator.tags.split( ',' ).forEach(tag => {
        tagsAssociated.push( { "text": tag, "tiClasses": [ "ti-valid" ] } );
      });
      this.currentIndicator.tags = tagsAssociated;

      this.query.selectedInstitution = this.currentIndicator.institution;
      this.entitySearch = this.currentIndicator.institution.name;

      this.userByInstitutionSearch = this.currentIndicator.responsibleObject.name;
      this.query.selectedUser = this.currentIndicator.responsibleObject;
      this.modal.responsible = this.currentIndicator.responsibleObject;

      this.userBySdpSearch = this.currentIndicator.diceObject.name;
      this.query.selectedSdpUser = this.currentIndicator.diceObject;
      this.modal.dice = this.currentIndicator.diceObject;

      this.$nextTick( ( ) => {
        if (this.isValidType && this.selectedTypeOptions.value == RURAL_INDICATOR_TYPES.FIGURE) {
          this.$refs['entitySearchTypeahead'].$data.inputValue = this.currentIndicator.institution.name;
          this.$refs['userByInstitutionSearch'].$data.inputValue = this.currentIndicator.responsibleObject.name;
          this.$refs['userBySdpSearch'].$data.inputValue = this.currentIndicator.diceObject.name;
        }
      });
    }
  },
  data() {
    return {
      ARCGIS_TAGS,
      RURAL_INDICATOR_TYPES,
      INSTITUTION,
      asterisk: '<span class="required"> *</span>',
      selectedTypeOptions: null,
      languages: lang,
      typeOptions: [
        { label: this.$t('rural_indicators.option_figure'), value: RURAL_INDICATOR_TYPES.FIGURE },
        { label: this.$t('rural_indicators.option_index'), value: RURAL_INDICATOR_TYPES.INDEX },
        { label: this.$t('rural_indicators.option_indicator'), value: RURAL_INDICATOR_TYPES.INDICATOR },
        { label: this.$t('rural_indicators.option_bulletin'), value: RURAL_INDICATOR_TYPES.BULLETIN }
      ],
      geographicCoverage: [],
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
      ruralThemes: [],
      ruralDocuments: [],
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
        createdBy: '',
        source: null,
        enabled: true,
        links: [],
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
    async getRuralDocuments() {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/document/search` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching rural documents ', err )
      }
    },
    async getRuralFigure( id ) {
      try {
        let response = await VAPI.get( `/${SERVICE_NAMES.RURAL_INDICATORS}/admin/figure/${id}` );
        return response.data.data;
      }
      catch( err ) { 
        console.error( 'Error fetching rural figure ', err )
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
    assemblePayload( ) {
      let payload = {
        type: this.selectedTypeOptions.value,
        enabled: this.currentIndicator.enabled,
        map: this.currentIndicator.map,
        name: this.currentIndicator.name,
        summary: this.currentIndicator.summary,
        geographicCoverage: this.currentIndicator.geographic.value,
        updateDate: this.currentIndicator.updateDate,
        source: this.currentIndicator.source,
        links: this.currentIndicator.links,
        deletedLinks: this.deletedLinks,
        responsible: this.currentIndicator.responsible,
        dice: this.currentIndicator.dice,
      };
      payload.disabledReason = !payload.enabled? this.currentIndicator.disabledReason : null;
      let ruralModels = [];
      this.currentIndicator.ruralModels.forEach( model => {
        let currentStatus = model.status != null ? model.status : false;
        ruralModels.push( { id: model.id, principal: currentStatus } );
      });
      payload.ruralModels = ruralModels;

      let ruralDocuments = [];
      if( this.currentIndicator.ruralDocuments != null ) {
        this.currentIndicator.ruralDocuments.forEach( document => {
          ruralDocuments.push( document.value );
        });
      }
      payload.ruralDocuments = ruralDocuments;

      let tags = [];
      this.currentIndicator.tags.forEach( tag => {
        tags.push( tag.text );
      });
      payload.tags = tags.join(',');

      return payload;
    },
    validateForm() {
      let isValid = this.isValidType && this.currentIndicator.ruralModels != null && this.currentIndicator.ruralModels.length > 0
        && this.currentIndicator.tags != null && this.currentIndicator.tags.length > 0 && this.currentIndicator.responsible != null
        && this.currentIndicator.dice != null;

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
      path += !this.isEditing ? `figure/create` : `figure/update/${this.$route.params.id}`

      if( !this.isEditing ) {
        try {
          await VAPI.post( path, payload )
          .then( 
            ( success ) => {
              this.showModal( 'successModal' );
            }, ( error ) => {
              console.error( 'Error trying to post figure', error );
              this.showModal( 'errorSubmitFormModal' );
            }
          );      
        }
        catch( error ) {
          console.error( 'Error trying to post responsibles', error );
          this.showModal( 'errorsModal' );
        }
      }
      else { 
        try {
          await VAPI.put( path, payload )
          .then( 
            ( success ) => {
              this.showModal( 'successModal' );
            }, ( error ) => {
              console.error( 'Error trying to put figure', error );
              this.showModal( 'errorSubmitFormModal' );
            }
          );      
        }
        catch( error ) {
          console.error( 'Error trying to put responsibles', error );
          this.showModal( 'errorsModal' );
        }
      }
    },
    submit() {
      this.$validator.validateAll( 'form' ).then( valid => {
        if( valid && this.validateForm( ) ) {
          let payload = this.assemblePayload( );
          this.submitIndicator( payload );
        }
        else {
          this.showModal( 'errorsModal' );
        }
      })
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
          case RURAL_INDICATOR_TYPES.INDICATOR:
            this.$router.push({name: 'RuralIndicatorCreate'})
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
</style>


