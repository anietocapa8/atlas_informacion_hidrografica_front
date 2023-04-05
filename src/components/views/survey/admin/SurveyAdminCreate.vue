<template>
  <div class="container container-form">
  <!-- Bad Request modal -->
  <b-modal ref="badRequestModal" :title="$t('registration.warning')" hideFooter>
    <div class="mg-top-10 w-100 center-text red">
      <p>{{$t('survey.create.bad_request')}}</p>
    </div>
    <b-row class="mg-top-30">
      <b-col class="center-text">
        <sipsder-btn btnType="back" :text="$t('survey.create.buttons.accept')" @onClick="closeModal( 'badRequestModal')" />
      </b-col>
    </b-row>
  </b-modal>
  <!-- Errors modal -->
  <b-modal ref="errorModal" :title="$t('registration.warning')" hideFooter>
    <div class="mg-top-10 w-100 center-text red">
      <p v-for="(err,i) in errors.items" :key="i"> {{err.msg}} </p>
      <p v-for="(error,j) in formErrors" :key="j"> {{error}} </p>
    </div>
    <b-row class="mg-top-30">
      <b-col class="center-text">
        <sipsder-btn btnType="back" :text="$t('survey.create.buttons.back')" @onClick="closeModal( 'errorModal' )" />
      </b-col>
    </b-row>
  </b-modal>
  <!-- Cancel Modal-->
  <b-modal ref="cancelModal" :title="$t('registration.warning')" hideFooter>
    <div class="mg-top-10 w-100 center-text red">
      <p> {{$t('survey.create.popup.dicard_changes')}} </p>
    </div>
    <b-row class="mg-top-30">
      <b-col class="center-text">
        <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goSurveys()" />
      </b-col>
      <b-col class="center-text">
        <sipsder-btn btnType="back" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('cancelModal')" />
      </b-col>
    </b-row>
  </b-modal>
  <!-- Save Modal-->
  <b-modal ref="saveModal" :title="$t('registration.warning')" 
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    :hide-header-close="true"
    hideFooter>
    <div class="mg-top-10 w-100 center-text">
      <p>
        {{ $t( 'survey.create.popup.success_save' ) }} 
        {{ survey.code }} 
        {{ $t( 'survey.create.popup.success_save2' ) }} 
      </p>
      <p> {{$t('survey.create.popup.go_to_form')}} </p>
    </div>
    <b-row class="mg-top-30">
      <b-col class="center-text">
        <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.yes')" @onClick="goForm()" />
      </b-col>
      <b-col class="center-text">
        <sipsder-btn btnType="back" :text="$t('survey.create.buttons.other_moment')" @onClick="goSurveys()" />
      </b-col>
    </b-row>
  </b-modal>
  <!-- Save Modal-->
  <b-modal ref="savePublishedModal" :title="$t('registration.warning')" hideFooter>
    <div class="mg-top-10 w-100 center-text">
      <p>
        {{ $t( 'survey.create.popup.success_save' ) }} 
        {{ survey.code }} 
        {{ $t( 'survey.create.popup.success_update' ) }} 
      </p>
    </div>
    <b-row class="mg-top-30">
      <b-col class="center-text">
        <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="goSurveys( )"></sipsder-btn>
      </b-col>
    </b-row>
  </b-modal>
  <!-- DESCRIPTION -->
  <sipsder-title :title="$t('survey.create.title')" type="admin"></sipsder-title>
  <div class="w-100 message">
    <p>{{ $t('survey.create.claim') }}</p>
    <p v-if="isEditing">{{ $t('survey.create.claim_2') }}</p>
  </div>
  <!-- INFO -->
  <div class="mg-top-30"/>
  <div class="font-weight-bold inline wrap" >
    <div class="wrap">
      <p> {{$t('survey.create.form.code')}} </p>
      <div class="w-30">
        <b-form-group>
          <b-form-input type="text" :placeholder="survey.code || 'SIN ASIGNAR'" class="grey-box center-text" disabled />
        </b-form-group>
      </div>
      <div class="col-lg-4">
        <h2 class="bold red">{{statusLabel}}</h2>
      </div>
    </div>
  </div>
  <div class="mg-top-20 "/>
    <div class="font-weight-bold inline">
      <b-row class="wrap" align-h="end">
        <b-form-checkbox v-model="survey.enabled">{{$t('survey.create.form.enable')}}</b-form-checkbox>
      </b-row>
      <div v-if="isEditing && !survey.published">
        <sipsder-btn btnType="preview" 
          :text="$t('survey.create.go_form')" 
          @onClick="goForm()" />
      </div>
      <div v-if="isEditing && survey.published">
        <sipsder-btn btnType="preview" 
          :text="$t('survey.create.preview')" 
          @onClick="previewSurvey( )" />
      </div>
    </div>
    <!-- SUBTITLE -->
    <div class="mg-top-10 w-100">
      <div class="survey-container">
        <h2 class="bold">{{$t('survey.create.subtitle')}}</h2>
      </div>
    </div>
    <!-- BEGIN THE FORM -->
    <div class="form-container">
      <div v-if="!survey.enabled" class="w-100 pb-5">
        <b-form-group
          :label="$t('survey.create.form.reason')+asterisk"
          label-class="font-weight-bold">
        </b-form-group>
        <b-form-textarea v-model="survey.reason"
          :rows="3" :max-rows="6"
          v-validate="'required|min:8|max:130'" name="survey.reason" :data-vv-as="$t('survey.create.form.reason')"/>
        <span class="error">{{ errors.first('survey.reason') }}</span>
      </div>
      <div class="w-100">
        <b-form-group
          :label="$t('survey.create.form.name')+asterisk"
          label-class="font-weight-bold">
          <b-form-input type="text" v-model="survey.title"
            v-validate="'required|min:4|max:180'" name="survey.title" :data-vv-as="$t('survey.create.form.name')" />
        </b-form-group>
        <span class="error">{{ errors.first('survey.title') }}</span>
      </div>
      <div class="mg-top-30 w-100">
        <b-form-group
          :label="$t('survey.create.form.description')+asterisk"
          label-class="font-weight-bold">
          <b-form-textarea v-model="survey.description" 
            :rows="3" :max-rows="6"
            v-validate="'required|min:8|max:280'" name="survey.description" :data-vv-as="$t('survey.create.form.description')"/>
        </b-form-group>
        <span class="error">{{ errors.first('survey.description') }}</span>
      </div>
      <div class="mg-top-30 w-100">
        <b-form-group
          :label="$t('survey.create.form.initialMessage')+asterisk"
          label-class="font-weight-bold mg-top">
          <b-form-input type="text" v-model="survey.initialMessage"
            v-validate="'required|min:3|max:280'" name="survey.initialMessage" :data-vv-as="$t('survey.create.form.initialMessage')" />
          <span class="error">{{ errors.first('survey.initialMessage') }}</span>
        </b-form-group>
      </div>
      <div class="mg-top-30 w-100">
        <b-form-group
          label-class="font-weight-bold"
          :description="$t('survey.create.select_option')"
          :label="$t('survey.create.form.targetAudience')+asterisk"
          :invalid-feedback="errors.first('survey.targetAudienceId')">
          <b-form-select v-model="survey.targetAudienceId" v-validate="'required'" name="survey.targetAudienceId" :data-vv-as="$t('survey.create.form.targetAudience')" :disabled="isEditing && survey.published">
            <option v-for="(audience,i) in surveyAudience" :key="i" :value="audience.id">{{audience.domain}}</option>
          </b-form-select>
        </b-form-group>
      </div>
      <div class="w-100">
        <div v-if="survey.targetAudienceId==surveyAudienceConstant.SPECIFIC">
          <b-form-group
            :label="$t('survey.create.form.userType')+asterisk"
            label-class="font-weight-bold"
            :invalid-feedback="errors.first('survey.userType')">
          </b-form-group>
          <div v-for="(user,i) in userType" :key="i" class="checkbox">
            <input type="checkbox" :value="user.id" v-model="survey.userTypesIds" @change="checkDeletedUser(user.id)" :disabled="isEditing && survey.published">
            <label class="mg-left-5">{{user.value}}</label>
          </div>
        </div>
      </div>
      <div class="mg-top-30 w-100">
        <b-form-group
          :label="$t('survey.create.form.url')"
          label-class="font-weight-bold">
          <div class="w-100 boxed-text">
            <p class="pd-10">{{ getSurveyUrl( survey.url ) }}</p>
          </div>
        </b-form-group>
      </div>
      <div v-if="survey.targetAudienceId==surveyAudienceConstant.PROTECTED" class="w-100 mg-top-30">
        <div class="w-100">
          <b-form-group
            label-class="font-weight-bold"
            :description="$t('survey.create.form.passwordTitle')"
            :label="$t('survey.create.form.passwordTitle')+asterisk">
            <vue-password v-model="survey.password"></vue-password>
            <span class="error"
              v-if="survey.password.length < min_length_password || survey.password.length > max_length_password"
              >{{$t('survey.create.form.password_error')}}</span>
          </b-form-group>
        </div>
      </div>
      <div class="w-100 mg-top-30" v-if="survey.targetAudienceId == surveyAudienceConstant.SPECIFIC || survey.targetAudienceId == surveyAudienceConstant.AUTHENTICATED">
        <b-form-group
          :label="$t('survey.create.form.multipleAnswersTitle')+asterisk"
          label-class="font-weight-bold">
        </b-form-group>
        <b-form-checkbox v-model="survey.multipleAnswers">
          {{$t('survey.create.form.multipleAnswers')}}
        </b-form-checkbox>
      </div>
      <div class="mg-top-30 w-100">
        <b-form-group
          label-class="font-weight-bold"
          :description="$t('survey.create.select_option')"
          :label="$t('survey.create.form.resultVisibility')+asterisk"
          :invalid-feedback="errors.first('survey.resultVisibilityId')">
          <b-form-select v-model="survey.resultVisibilityId" v-validate="'required'" 
            name="survey.resultVisibilityId" 
            :data-vv-as="$t('survey.create.form.resultVisibility')">
            <option v-for="(v,i) in filterVisibility( surveyVisibilities )" :key="i" :value="v.id">{{v.verResultado}}</option>
          </b-form-select>
        </b-form-group>
      </div>
      <!-- TEMATICA RURAL -->
      <div class="mg-top-10 w-100">
        <b-form-group
          :label="$t('survey.create.form.ruralModels')+asterisk"
          label-class="font-weight-bold"
          :invalid-feedback="errors.first('ruralSelect')"
          >
          <div class="multiple">
            <treeselect v-model="selectedRuralModel" 
                :data-vv-as="$t('survey.create.form.ruralModels')"
                required
                name="ruralSelect"
                class="pt-2"
                :multiple="false" 
                :options="ruralModels"
                :placeholder="$t( 'faqs.modal.rural_select')"
                :clearable="true"
                :default-expand-level="1"
                :disable-branch-nodes="true"
                :show-count="true">
              <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                <img v-if="node.raw && node.raw.url != null" 
                    :src="getImgURL(node.raw.url)" height="16" width="16">
                <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>        
                <span> {{ node.label.split('/')[0] }} </span>
                <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
              </label>
            </treeselect>
            <sipsder-btn btnType="add" text="" @onClick="addNewRuralThematic"></sipsder-btn>
          </div>
        </b-form-group>
      </div>
      <span class="error" v-if="survey.ruralModels.length  === 0"
        >{{$t('survey.create.form.errorRural')}}</span>
      <div class="mg-top-10 w-100 center" v-if="survey.ruralModels.length > 0">
        <div class="w-25 grey">
          Estructura
        </div>
        <div class="w-25 grey">
          Componente
        </div>
        <div class="w-25 grey">
          Subcomponente
        </div>
        <div class="w-9 grey">
          Principal
        </div>
        <div class="w-7 grey">
          &nbsp;
        </div>
      </div>
      <div class="w-100 center" v-for="(v,i) in survey.ruralModels" :key="i">
        <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
          {{getFirstLevel(v)}}
        </div>
        <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
          {{getSecondLevel(v)}}
        </div>
        <div class="w-25" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
          {{getThirdLevel(v)}}
        </div>
        <div class="w-9" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
          <input type="checkbox" v-model="survey.ruralModelsPrincipal[i]" 
            :disabled="survey.ruralModelsPrincipal[i]"
            @change="changeRuralThematicPrincipal(i)"/>
        </div>
        <div class="w-7" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
          <sipsder-btn btnType="delete" :text="''" @onClick="deleteRuralThematic(i)"></sipsder-btn>
        </div>
      </div>
      <div class="mg-top-20 w-100">
        <b-form-group
          :label="$t('survey.create.form.finalMessage')+asterisk"
          label-class="font-weight-bold mg-top">
          <b-form-input type="text" v-model="survey.finalMessage"
            v-validate="'required|min:3|max:280'" name="survey.finalMessage" :data-vv-as="$t('survey.create.form.finalMessage')" />
        </b-form-group>
        <span class="error">{{ errors.first('survey.finalMessage') }}</span>
      </div>
      <b-row class="mg-top-30 w-100">
        <b-col cols="6">
          <b-form-group :label="$t('survey.create.form.startDate')+asterisk"
            label-class="font-weight-bold">
            <datepicker 
              :placeholder="$t('util.insertDate')" 
              v-model="startDate"
              id="survey-start-date"
              name="survey-start-date"
              class="date-picker"
              :language = "languages[ currentLocale ]"
              :calendar-button = "true"
              calendar-button-icon = "fa fa-calendar"
              :disabledDates = "disabledStartDate"
              :clear-button = "true"
              :disabled="survey.published && this.survey.enabled">
            </datepicker>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group
            :label="$t('survey.create.form.endDate')+asterisk"
            label-class="font-weight-bold">
            <datepicker 
              :placeholder="$t('util.insertDate')" 
              v-model="endDate"
              id="survey-finish-date"
              name="survey-finish-date"
              class="date-picker"
              :language = "languages[ currentLocale ]"
              :calendar-button = "true"
              calendar-button-icon = "fa fa-calendar"
              :disabledDates = "disabledFinishDate"
              :clear-button = "true">
            </datepicker>
          </b-form-group>
        </b-col>
      </b-row>
      <span class="error"
        v-if="validateDate"
        >{{$t('survey.create.form.errorDate')}}</span>
      <div class="center-text mg-top-50">
        <sipsder-btn :btnType="'back'" @onClick="showModal('cancelModal')" class="pr-3"></sipsder-btn>
        <sipsder-btn :btnType="'save'" @onClick="saveSurveyRequest()" class="pl-3" :text="$t('survey.create.save')"></sipsder-btn>
      </div>
    </div>
  </div>
</template>
<script>
import VuePassword from "vue-password";
import Treeselect from '@riophae/vue-treeselect';
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import VAPI from '../../../../http_common';
import moment from 'moment';
import {
  PERMISSIONS_TYPES,
  SURVEY_STATUS,
  TARGET_AUDIENCE,
  SURVEY_STATUS_LABEL,
  SURVEY_RESULT_VISIBILITY
}
from '../../../../domain_constants'
import {
  SERVICE_NAMES,
  USER_DOMAINS
}
from '../../../../sipsder_constants'
import surveyUtils from '../../../../util/survey/surveyUtil';
import S_UTIL from "../../../../util/sipsder_util";

export default {
  components: {
    datepicker: Datepicker,
    "vue-select": vSelect,
    Treeselect,
    "vue-password": VuePassword,
  },
  async beforeMount() {
    const ruralResponse = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree`);
    if (ruralResponse.data.data != null) {
      this.ruralModels = ruralResponse.data.data;
    }
    const userTypesResponse = await VAPI.get(SERVICE_NAMES.USER_DOMAINS + '/' + USER_DOMAINS.USER_TYPE);
    if (userTypesResponse.data.data != null) {
      this.userType = userTypesResponse.data.data;
    }
    const surTargetAudienceRes = await VAPI.get(`${SERVICE_NAMES.SURVEY}/audiences`);
    if (surTargetAudienceRes.data.data != null) {
      this.surveyAudience = surTargetAudienceRes.data.data;
    }
    const surResultVisibilityRes = await VAPI.get(`${SERVICE_NAMES.SURVEY}/visibilities`);
    if (surResultVisibilityRes.data.data != null) {
      this.surveyVisibilities = surResultVisibilityRes.data.data;
    }
    this.survey.statusId = this.surveyStatusConstant.EDITING;
    if (this.$route.params.code) {
      let result = await VAPI.get(`${SERVICE_NAMES.SURVEY}/${this.$route.params.code}`);
      this.isEditing = true;
      let fetchData = result.data.data;
      let surv = fetchData.survey;
      this.surveyId = surv.id;
      this.startDate = surv.startDate;
      this.endDate = surv.endDate;
      this.survey.startDate = surv.startDate;
      this.survey.endDate = surv.endDate;
      this.survey.code = surv.code;
      this.survey.title = surv.title;
      this.survey.description = surv.description;
      this.survey.initialMessage = surv.initialMessage;
      this.survey.finalMessage = surv.finalMessage;
      this.survey.url = surv.url;
      this.survey.multipleAnswers = surv.multipleAnswers;
      this.survey.password = surv.password;
      this.survey.reason = surv.reason;
      this.survey.enabled = surv.enabled;
      this.survey.published = surv.published;
      if (this.survey.password == null) {
        this.survey.password = '';
      }
      if (this.survey.reason == null) {
        this.survey.reason = '';
      }
      this.survey.statusId = surveyUtils.getSurveyStatus(this.survey);
      this.survey.targetAudienceId = surv.target.id;
      this.survey.resultVisibilityId = surv.resultVisibility.id;
      fetchData.userTypes.forEach(u => {
        this.survey.userTypesIds.push(u.userType.id);
        this.inititalUserTypesIds.push(u.userType.id);
      });
      fetchData.models.forEach(m => {
        this.initialRuralModels.push(m.ruralModel.id);
        this.survey.ruralModels.push(m.ruralModel.id);
        this.survey.ruralModelsPrincipal.push(m.principal);
      });
    }
  },
  data() {
    return {
      min_length_password: 4,
      max_length_password: 10,
      languages: lang,
      ruralModels: [],
      selectedRuralModel: null,
      ruralThematicIds: [],
      ruralThematicPrincipal: [],
      userType: [],
      userTypesIds: [],
      surveyStatuses: null,
      surveyAudience: null,
      surveyVisibilities: null,
      errorDate: true,
      formErrors: [],
      surveyStatusConstant: SURVEY_STATUS,
      surveyAudienceConstant: TARGET_AUDIENCE,
      surveyStatusLabelConstant: SURVEY_STATUS_LABEL,
      surveyVisibilityConstant: SURVEY_RESULT_VISIBILITY,
      startDate: null,
      endDate: null,
      isEditing: false,
      validForm: false,
      inititalUserTypesIds: [],
      initialRuralModels: [],
      newsRuralModelDeleted: [],
      asterisk: "<span style='color: red'>*</span>",
      surveyId: null,
      surveyPosted: null,
      survey: {
        enabled: true,
        published: false,
        code: null,
        title: null,
        description: null,
        initialMessage: null,
        finalMessage: null,
        url: 'SIN ASIGNAR',
        multipleAnswers: true,
        password: '',
        reason: '',
        dates: [],
        userTypesIds: [],
        ruralModels: [],
        ruralModelsPrincipal: [],
        statusId: null,
        targetAudienceId: null,
        resultVisibilityId: null,
        userTypesIds: [],
        deletedUserTypes: [],
        deletedRuralModels: [],
        ruralModels: [],
        ruralModelsPrincipal: []
      }
    }
  },
  computed: {
    validateDate() {
      if (this.endDate <= this.startDate) {
        this.errorDate = true;
      }
      else {
        this.errorDate = false
      }
      return this.errorDate;
    },
    disabledStartDate() {
      let publicationDate = new Date();
      publicationDate.setHours(0, 0, 0, 0);
      return {
        to: publicationDate
      }
    },
    disabledFinishDate() {
      let closingDate = new Date(this.startDate);
      closingDate.setDate(closingDate.getDate() + 1);
      return {
        to: closingDate
      }
    },
    currentLocale() {
      return this.$i18n.locale;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN) // ANTIGUO PERMISO PUBLICAR
    },
    statusLabel() {
      if (this.survey.statusId) {
        switch (this.survey.statusId) {
          case this.surveyStatusConstant.EDITING:
            if (this.survey.enabled) return this.surveyStatusLabelConstant.EDITING + '-' + this.surveyStatusLabelConstant.ENABLED;
            else return this.surveyStatusLabelConstant.EDITING + '-' + this.surveyStatusLabelConstant.DISABLED;
            break;
          case this.surveyStatusConstant.PUBLISHING_PROCESS:
            return this.surveyStatusLabelConstant.PUBLISHING_PROCESS
            break;
          case this.surveyStatusConstant.PUBLISHED:
            if (this.survey.enabled) return this.surveyStatusLabelConstant.PUBLISH + '-' + this.surveyStatusLabelConstant.ENABLED;
            else return this.surveyStatusLabelConstant.PUBLISH + '-' + this.surveyStatusLabelConstant.DISABLED;
            break;
          case this.surveyStatusConstant.CLOSED:
            return this.surveyStatusLabelConstant.CLOSED;
            break;
        }
      }
    }
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    goForm() {
      let code = null;
      if (this.isEditing) {
        code = this.survey.code;
      }
      else {
        code = this.surveyPosted.data.code;
      }
      this.$router.push({
        name: 'SurveySectionAdmin',
        params: {
          code: code
        }
      });
    },
    goSurveys() {
      this.$router.push({
        name: 'CommunitySurvey'
      });
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    closeModal(ref) {
      this.$refs[ref].hide();
    },
    checkDeletedUser(input) {
      if (this.isEditing && this.inititalUserTypesIds.length > 0) {
        if (this.inititalUserTypesIds.includes(input)) {
          if (!this.survey.deletedUserTypes.includes(input)) {
            this.survey.deletedUserTypes.push(input);
          }
        }
      }
    },
    changeRuralThematicPrincipal(i) {
      if (this.survey.ruralModelsPrincipal[i]) {
        for (let index = 0; index < this.survey.ruralModelsPrincipal.length; index++) {
          this.survey.ruralModelsPrincipal[index] = false
        }
        this.survey.ruralModelsPrincipal[i] = true
      }
    },
    deleteRuralThematic(i) {
      if (this.isEditing) {
        if (this.initialRuralModels.includes(this.survey.ruralModels[i])) {
          if (!this.survey.deletedRuralModels.includes(this.survey.ruralModels[i])) {
            this.survey.deletedRuralModels.push(this.survey.ruralModels[i]);
          }
        }
      }
      this.survey.ruralModels.splice(i, 1)
      this.survey.ruralModelsPrincipal.splice(i, 1)
      if (!this.survey.ruralModelsPrincipal.includes(true) && this.survey.ruralModelsPrincipal.length > 0) this.survey.ruralModelsPrincipal[0] = true
    },
    addNewRuralThematic() {
      if (this.selectedRuralModel !== null && this.selectedRuralModel !== undefined) {
        this.survey.ruralModels.push(this.selectedRuralModel)
        const length = this.survey.ruralModels.length
        this.survey.ruralModels = new Set(this.survey.ruralModels);
        this.survey.ruralModels = Array.from(this.survey.ruralModels);
        if (this.survey.ruralModels.length == 1) this.survey.ruralModelsPrincipal.push(true)
        else if (length == this.survey.ruralModels.length) this.survey.ruralModelsPrincipal.push(false)
        this.selectedRuralModel = null
      }
    },
    getFirstLevel(v) {
      let label = ""
      this.ruralModels.forEach(r => {
        if (r.id === v) {
          label = r.label;
          return;
        } 
        if (r.children) {
          r.children.forEach(c => {
            if (c.id === v) {
              label = c.label;
              return;
            } 
            if (c.children) {
              c.children.forEach(z => {
                if (z.id === v) {
                  label = c.label;
                  return;
                }
                if (z.children) {
                  z.children.forEach(w => {
                    if (w.id === v) label = c.label
                  })
                }
              })
            }
          })
        }
      })
      return label
    },
    getSecondLevel(v) {
      let label = ""
      this.ruralModels.forEach(r => {
        if (r.id === v) {
          label = "";
          return;
        } 
        if (r.children) {
          r.children.forEach(c => {
            if (c.id === v) {
              label = "";
              return;
            } 
            if (c.children) {
              c.children.forEach(z => {
                if (z.id === v) {
                  label = z.label;
                  return;
                }
                if (z.children) {
                  z.children.forEach(w => {
                    if (w.id === v) label = z.label
                  })
                }
              })
            }
          })
        }
      })
      return label
    },
    getThirdLevel(v) {
      let label = ""
      this.ruralModels.forEach(r => {
        if (r.id === v) {
          label = "";
          return;
        } 
        if (r.children) {
          r.children.forEach(c => {
            if (c.id === v) {
              label = "";
              return;
            } 
            if (c.children) {
              c.children.forEach(z => {
                if (z.id === v) {
                  label = "";
                  return;
                }
                if (z.children) {
                  z.children.forEach(w => {
                    if (w.id === v) label = w.label
                  })
                }
              })
            }
          })
        }
      })
      return label
    },
    async validateForm() {
      this.formErrors = [];
      this.$validator.validateAll();
      if (this.survey.targetAudienceId == this.surveyAudienceConstant.SPECIFIC && this.survey.userTypesIds.length < 1) {
        this.formErrors.push(this.$t('survey.create.form.userType_error'));
      }
      if (this.survey.targetAudienceId == this.surveyAudienceConstant.PROTECTED && (this.survey.password.length < this.min_length_password || this.survey.password.length > this.max_length_password)) {
        this.formErrors.push(this.$t('survey.create.form.password_error'));
      }
      if (this.survey.ruralModelsPrincipal.length < 1) {
        this.formErrors.push(this.$t('survey.create.form.errorRural'));
      }
      let now = new Date().setHours(0, 0, 0, 0);
      let start = new Date(this.startDate).setHours(0, 0, 0, 0);
      if ((now > start && !this.survey.published && !this.survey.enabled) || this.validateDate) {
        this.formErrors.push(this.$t('survey.create.form.errorDate'));
      }
      else {
        let start = new Date(this.startDate);
        start.setHours(0, 0, 0, 0);
        let end = new Date(this.endDate);
        end.setHours(0, 0, 0, 0);
        this.survey.dates[0] = moment(start).valueOf();
        this.survey.dates[1] = moment(end).valueOf();
      }
      this.validForm = false;
      if (this.formErrors.length < 1) {
        await this.$validator.validate().then(valid => {
          if (valid) {
            this.validForm = true;
            return true;
          }
        });
      }
      return this.validForm;
    },
    postSurvey() {},
    async saveSurveyRequest() {
      if (await this.validateForm()) {
        if (this.isEditing) {
          let id = Number(this.surveyId);
          try {
            let response = await VAPI.put(`${SERVICE_NAMES.SURVEY}/admin/${id}`, this.survey);
            if (response.status == 200) {
              this.surveyPosted = response;
              if (this.survey.published) this.showModal('savePublishedModal');
              else this.showModal('saveModal');
            }
            else {
              this.showModal('badRequestModal');
            }
          }
          catch (e) {
            this.showModal('badRequestModal');
          }
        }
        else {
          try {
            let response = await VAPI.post(`${SERVICE_NAMES.SURVEY}/admin`, this.survey)
            if (response.status == 200) {
              this.surveyPosted = response;
              this.showModal('saveModal');
            }
            else {
              this.showModal('badRequestModal');
            }
          }
          catch (e) {
            this.showModal('badRequestModal');
          }
        }
      }
      else {
        this.showModal('errorModal');
      }
    },
    getSurveyUrl(url) {
      return window.location.origin + '/community/survey/' + url;
    },
    getUrl(survey) {
      return survey.url.split('/');
    },
    previewSurvey() {
      this.$router.push({
        name: 'SurveyForm',
        params: {
          id: this.getUrl(this.survey)[0],
          url: this.getUrl(this.survey)[1]
        },
        query: {
          mode: 'preview'
        }
      });
    },
    filterVisibility( visibility ) {
      if( visibility ) {
        if( this.survey.targetAudienceId != null && this.survey.targetAudienceId == this.surveyAudienceConstant.SPECIFIC  ) { 
          return visibility;
        }
        return visibility.filter( vis => vis.id != this.surveyVisibilityConstant.AUTHORIZED )
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../../../stylesheets/style.sass'

.dot
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;

.grey-label-text
  color: grey

.multiple
    display: flex
    align-items: center
    justify-content: flex-start

.wrap
    display: flex
    justify-content: space-between

.error
    color: red
    width: 100%

.bold
    font-weight: bold

.inline
    display: inline

.align-rigth
    text-align: rigth

.boxed
    background: lightgrey
    width: 50%

.boxed-text
    background: #E5E5E5
    border: 1px solid black
    border-radius: 5px
    font-weight: bold

.pd-10
    padding: 10px

.grey-box
    background: lightgrey

.red
    color: red

.w-25
    width: 25%

.w-7
    width: 7.5%

.w-9
    width: 9%

.w-30
    width: 30%

.w-50
    width: 50%

.w-100
    width: 100%

.grey
    display: flex
    justify-content: center
    background: #A9A9A9
    color: white  
    font-weight: 600
    border-left: 1px solid white
    border-right: 1px solid white
    padding: 5px

.light
    font-size: 1.2rem
    font-weight: 500
    display: flex
    align-items: center
    height: 60px
    background: #D7F3F4
    color: black  
    border-left: 1px solid white
    border-right: 1px solid white
    padding: 5px

.white
    font-size: 1.2rem
    display: flex
    align-items: center
    height: 60px
    background: white
    color: black  
    border-left: 1px solid black
    border-right: 1px solid black
    padding: 5px

.form-container
    width: 100%

.center
    display: flex
    justify-content: center
    align-items: center

.center-text
    text-align: center


.mg-top-10
    margin-top: 10px

.mg-top-20
    margin-top: 20px

.mg-top-30
    margin-top: 30px

.mg-top-40
    margin-top: 40px

.mg-top-50
    margin-top: 50px

.mg-bot-20
    margin-bot: 20px

.mg-bot-30
    margin-top: 30px

.mg-left-5
    margin-left: 5px

.message
    font-size: 1.5rem

.survey-container
    display: flex
    align-items: flex-start
    justify-content: flex-start
    padding: 50px 0px
    flex-direction: column

.checkbox
  display: inline-block;
  margin-right: 10px; 
</style>