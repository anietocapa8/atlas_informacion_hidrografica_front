<template>
  <div class="news-add-container container-form">
    <sipsder-title :title="$t('news.create.title')" type="admin"></sipsder-title>
    <b-row class="center">
      <b-modal
        ref="addImageModal"
        id="addImageModal"
        size="lg"
        class="image-modal"
        centered
        :title="$t('audiovisual_media.index.title_modal')"
        hide-footer
      >
        <audiovisualmedia
          @created_image="created_image($event)"
          @cancel="closeModal('addImageModal')"
          :allowSelection="true"
          v-if="show"
          :media-options="mediaOptions"
          :message="message"
        ></audiovisualmedia>
      </b-modal>
      <b-modal
        ref="deleteImage"
        :title="$t('registration.warning')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">{{$t('news.create.delete')}}</div>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="deleteAttachment(imageSelected)" />
          </b-col>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('deleteImage')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
        ref="disabledNews"
        :title="$t('registration.warning')"
        @ok="closeModal('disabledNews')"
        @cancel="enableNews('disabledNews')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">
            {{$t('news.create.disable')}}
            <br>
            <br>
            <div style="color: black">{{$t('news.create.disable_reason')}}<span style="color: red">*</span></div>
            <b-form-textarea rows="4" cols="50" maxlength="400" v-model="motive"></b-form-textarea>
          </div>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="closeModal('disabledNews')" />
          </b-col>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="enableNews('disabledNews')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
        ref="returnNews"
        :title="$t('registration.warning')"
        @ok="$router.go(-1)"
        @cancel="closeModal('returnNews')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">{{$t('news.create.back')}}</div>
        </b-row>

        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="$router.go(-1)" />
          </b-col>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('returnNews')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
        ref="saveNews"
        :title="$t('registration.warning')"
        @ok="saveNews('saveNews')"
        @cancel="closeModal('saveNews')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">{{$t('news.create.save')}}</div>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="saveNews('saveNews')" />
          </b-col>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="cancel" :text="$t('survey.create.buttons.cancel')" @onClick="closeModal('saveNews')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
        ref="motiveNews"
        :title="$t('news.create.disable_reason')"
        @ok="closeModal('motiveNews')"
        @cancel="closeModal('motiveNews')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">{{motive}}</div>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="closeModal('motiveNews')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
        ref="errorNews"
        :title="'Error'"
        @ok="closeModal('errorNews')"
        @cancel="closeModal('errorNews')"
        hide-footer
      >
        <b-row class="w-100 center">
          <div class="w-75">{{$t('news.create.error')}}</div>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center">
            <sipsder-btn btnType="accept" :text="$t('survey.create.buttons.accept')" @onClick="closeModal('errorNews')" />
          </b-col>
        </b-row>
      </b-modal>
      <b-col cols="6">
        <b-nav tabs>
          <b-nav-item
            v-for="(l, i) in languages"
            :key="i"
            class="tab-design"
            :active="selectedLanguage == i"
            @click="selectedLanguage = i"
          >
            <span>{{l.language}}</span>
          </b-nav-item>
        </b-nav>
      </b-col>
      <div cols="3" v-if="motive.length > 0">
        <b-button @click="showModal('motiveNews')">{{$t('motive')}}</b-button>
      </div>
      <b-col cols="3">
        <div class="enable">
          <b-form-checkbox
            id="enableNews"
            @input="changeVisibility"
            v-model="enable"
            :value="true"
            :unchecked-value="false"
          >
            {{$t('news.create.enable')}}
          </b-form-checkbox>
        </div>
      </b-col>
    </b-row>
    <b-row class="center content" v-if="values.length > 0">
      <b-col cols="10" class="border">
        <b-row>
          <b-col cols="12" class="padding">
            <b-form-group :label="$t('news.create.title')+asterisk" label-class="font-weight-bold"></b-form-group>
            <b-form-input type="text" v-model="values[selectedLanguage].title" maxlength="150"></b-form-input>
            <span
              class="error"
              v-if="values[selectedLanguage].title.length < 3 || values[selectedLanguage].title.length > 150"
            >{{$t('news.validation.title')}}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="padding">
            <b-form-group
              :label="$t('news.create.summary')+asterisk"
              label-class="font-weight-bold"
            ></b-form-group>
            <textarea v-model="values[selectedLanguage].summary" cols="10" rows="5" maxlength="280"></textarea>
            <div
              class="w-100 right message"
            >{{$t('news.create.remaining_charaters')}} {{280-values[selectedLanguage].summary.length}}</div>
            <span
              class="error"
              v-if="values[selectedLanguage].summary.length < 3 || values[selectedLanguage].summary.length > 280"
            >{{$t('news.validation.summary')}}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="padding">
            <b-form-group :label="$t('news.create.detail')+asterisk" label-class="font-weight-bold"></b-form-group>
            <rich-text
              :options="customToolbar"
              @changeValue="changeValue"
              :newContent="values[selectedLanguage].content"
            ></rich-text>
            <span
              class="error"
              v-if="values[selectedLanguage].content.length < 3"
            >{{$t('news.validation.content')}}</span>
          </b-col>
        </b-row>
        <b-row class="mg-mobile">
          <b-col cols="12" class="padding">
            <b-form-group :label="$t('news.create.tags')+asterisk" 
            label-class="font-weight-bold">
              <tags-input
                  v-model="tag"
                  :placeholder="$t('norm.create.form.tags_enter')"
                  :tags="values[selectedLanguage].tags"                       
                  @tags-changed="newTags => values[selectedLanguage].tags = newTags"
              ></tags-input>
            </b-form-group>
            <span
              class="error"
              v-if="tag.length < 3 || tag > 400 || values[selectedLanguage].tags.map(tag => tag.text).join(',').length > 400"
            >{{$t('news.validation.tags')}}</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <hr>
    <b-row class="center mg-top">
      <b-col cols="10">
        <b-form-group 
          :label="$t('news.create.date')+asterisk" label-class="font-weight-bold"
          :invalid-feedback="errors.first('dateNews')">
          <datepicker :placeholder="$t('util.insertDate')" 
              class="date-picker"
              name="dateNews"
              :state="validateState(`message`)"
              v-validate="{required: true}"
              :data-vv-as="$t('news.create.date')"
              :language = "languages_date[language]"
              :calendar-button = "true"
              calendar-button-icon = "fa fa-calendar"
              :clear-button = "true"
              v-model="news_date"
              >
          </datepicker>
        </b-form-group>
      </b-col>
      <b-col cols="10">
        <b-row>
          <b-col cols="12" class="padding">
            <b-form-group :label="$t('news.create.entity')+asterisk" label-class="font-weight-bold">
              <div class="multiple">
                <vue-bootstrap-typeahead
                  :data="entities"
                  v-model="entitySearch"
                  class="w-100"
                  :serializer="s => s.name"
                  :placeholder="$t('news.create.placeholder_entity')"
                  @hit="selectedEntity = $event"
                ></vue-bootstrap-typeahead>
                <sipsder-btn btnType="add" text @onClick="addNewEntity"></sipsder-btn>
              </div>
            </b-form-group>
            <span class="error" v-if="entitiesNew.length === 0">{{$t('news.validation.entity')}}</span>
            <div v-if="entitiesNew.length > 0" class="center">
              <div class="w-70 grey">{{$t('news.create.name')}}</div>
              <div class="w-30 grey">{{$t('news.create.actions')}}</div>
            </div>
            <div class="multiple w-100" v-for="(v, i) in entitiesNew" :key="i">
              <div class="center w-100" style="border-bottom: 1px solid black">
                <div class="w-70" :class="{'light': i%2 == 0, 'white': i%2 != 0}">{{v}}</div>
                <div class="w-30 center" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
                  <sipsder-btn btnType="delete" text @onClick="deleteNewEntity(i)"></sipsder-btn>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" class="padding">
            <b-form-group :label="$t('news.create.author')+asterisk" label-class="font-weight-bold"></b-form-group>
            <b-form-input type="text" v-model="authors" maxlength="200"></b-form-input>
            <span
              class="error"
              v-if="authors.length < 3 || authors.length > 200"
            >{{$t('news.validation.author')}}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" lg="12" xl="12" md="12" class="padding">
            <b-form-group :label="$t('news.create.rural')+asterisk" label-class="font-weight-bold">
              <div class="multiple">
                <treeselect
                    v-model="selectedRuralModel"
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
                <sipsder-btn btnType="add" text @onClick="addNewRuralThematic"></sipsder-btn>
              </div>
            </b-form-group>
            <span class="error" v-if="ruralThematicIds.length === 0">{{$t('news.validation.rural')}}</span>
            <div v-if="ruralThematicIds.length > 0" class="center">
              <div class="w-30 grey">{{$t('news.create.structure')}}</div>
              <div class="w-30 grey">{{$t('news.create.component')}}</div>
              <div class="w-30 grey">{{$t('news.create.sub')}}</div>
              <div class="w-10 grey">{{$t('news.create.principal')}}</div>
              <div class="w-10 grey">{{$t('news.create.actions')}}</div>
            </div>
            <div class="multiple" v-for="(v, i) in ruralThematicIds" :key="i">
              <div class="center w-100" style="border-bottom: 1px solid black">
                <div
                  class="w-30"
                  :class="{'light': i%2 == 0, 'white': i%2 != 0}"
                >{{getFirstLevel(v)}}</div>
                <div
                  class="w-30"
                  :class="{'light': i%2 == 0, 'white': i%2 != 0}"
                >{{getSecondLevel(v)}}</div>
                <div
                  class="w-30"
                  :class="{'light': i%2 == 0, 'white': i%2 != 0}"
                >{{getThirdLevel(v)}}</div>
                <div class="w-10 center" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
                  <b-form-checkbox
                    v-model="ruralThematicPrincipal[i]"
                    :disabled="ruralThematicPrincipal[i]"
                    @input="changeRuralThematicPrincipal(i)"
                  />
                </div>
                <div class="w-10 center" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
                  <sipsder-btn btnType="delete" :text="''" @onClick="deleteRuralThematic(i)"></sipsder-btn>
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" lg="12" xl="12" md="12" class="padding">
            <b-form-group :label="$t('news.create.locality')" label-class="font-weight-bold">
              <div class="multiple">
                <vue-bootstrap-typeahead
                  :data="localities"
                  v-model="localitySearch"
                  class="w-100"
                  :serializer="s => s.name"
                  :placeholder="$t('news.create.placeholder_locality')"
                  @hit="selectedLocality = $event"
                ></vue-bootstrap-typeahead>
                <sipsder-btn btnType="add" text @onClick="addNewLocality"></sipsder-btn>
              </div>
            </b-form-group>
            <div
              class="multiple w-100"
              v-if="localitiesNew.length > 0"
              style="flex-direction: column"
            >
              <div class="w-75 center">
                <div class="w-75 grey">{{$t('news.create.locality')}}</div>
                <div class="w-25 grey">{{$t('news.create.actions')}}</div>
              </div>
              <div
                class="w-75 center"
                v-for="(v,i) in localitiesNew"
                :key="i"
                style="border-bottom: 1px solid black"
              >
                <div class="w-75" :class="{'light': i%2 == 0, 'white': i%2 != 0}">{{v}}</div>
                <div class="w-25 center" :class="{'light': i%2 == 0, 'white': i%2 != 0}">
                  <sipsder-btn btnType="delete" :text="''" @onClick="deleteNewLocality(i)"></sipsder-btn>
                </div>
              </div>

              <!-- <sipsder-btn btnType="cancel" text="" @onClick="deleteNewLocality(i)"></sipsder-btn> -->
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <div class="text">
      <b>{{$t('news.create.images')}}</b>
      <span style="color: red">*</span>
    </div>
    <b-row class="multiple left">
      <sipsder-btn
        btnType="uploadImage"
        variant="primary"
        :text="$t('news.create.loadImage')"
        @onClick="showModal('addImageModal')"
      ></sipsder-btn>
    </b-row>
    <div class="text">
      {{$t('news.create.required')}}
      <span style="color: red">*</span>
      {{$t('news.create.required_two')}}
    </div>
    <span class="error" v-if="newsAttachments.length === 0">
      {{$t('news.create.attachment_error')}}
    </span>
    <b-row v-if="imageSelected != null">
      <div class="w-100 mg">
        <template v-if="imageSelected.type == 'Video'">
          <iframe class="w-100" height="450" :src="getImgURL(imageSelected.url)"></iframe>
        </template>
        <template v-else>
          <img :src="getImgURL(imageSelected.url)" :alt="'Image'" class="w-100" style="height: 450px">
        </template>
      </div>
    </b-row>
    <carousel :perPageCustom="[[480, 1], [768, 2], [1024, 3]]" :navigationEnabled="true">
      <slide v-for="(image, i) in newsAttachments" :key="i">
        <template v-if="image.type == 'Video'">
          <div style="position: relative; width: 150px; height: 150px;" class="center">
            <iframe class="center" style="width: 150px; height: 150px;" :src="getImgURL(image.url)"></iframe>
            <div class="cover" @click="imageSelected = image"></div>
          </div>
        </template>
        <template v-else>
          <img
            @click="imageSelected = image"
            :src="getImgURL(image.url)"
            :alt="'Image'"
            style="width: 150px; height: 150px;"
          >
        </template>
      </slide>
    </carousel>
    <b-row>
      <div class="w-100 center">
        <div
          class="w-30"
          v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`) && attachments[`${imageSelected.id}`][0]"
        >
          <b-form-radio-group
            v-model="attachments[`${imageSelected.id}`][1]"
            @input="selectPrincipal"
          >
            <b-form-radio :value="true">{{$t('news.create.main')}}</b-form-radio>
          </b-form-radio-group>
        </div>
        <div
          @click="showModal('deleteImage')"
          class="w-30"
          v-if="imageSelected!== null && attachments.hasOwnProperty(`${imageSelected.id}`)"
        >
          <div>
            <i class="fas fa-times"></i>
            {{$t('news.create.eliminate')}}
          </div>
        </div>
      </div>
    </b-row>
    <div class="btn-container">
      <sipsder-btn btnType="back" @onClick="showModal('returnNews')"></sipsder-btn>
      <sipsder-btn
        btnType="add"
        :text="$t('news.create.save_button')"
        @onClick="showModal('saveNews')"
      ></sipsder-btn>
    </div>
  </div>
</template>

<script>
import Audiovisualmedia from "../audiovisual_media/AudioVisualIndex.vue";
import RichText from "../../shared/RichText.vue";
import VAPI from "../../../http_common";
import { SERVICE_NAMES } from '../../../sipsder_constants';
import { ATTACHMENT_TYPE } from '../../../domain_constants'
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import _ from "lodash";
import { Carousel, Slide } from "vue-carousel";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import S_UTIL from "../../../util/sipsder_util";
import Datepicker from 'vuejs-datepicker';
import * as lang from "vuejs-datepicker/src/locale"; //importar locale

export default {
  data: function() {
    return {
      newsAttachmentDeleted: [],
      newsRuralModelDeleted: [],
      newsEntitiesDeleted: [],
      newsGeographyDeleted: [],
      news: null,
      isEditing: false,
      message: this.$t("news.create.message"),
      mediaOptions: [
        { value: ATTACHMENT_TYPE.PUBLIC_IMAGE, text: this.$t("audiovisual_media.imageOption") },
        { value: ATTACHMENT_TYPE.VIDEO, text: this.$t("audiovisual_media.videoOption") }
      ],
      show: false,
      includeImageOptions: [
        { value: false, text: this.$t("news.createt.exc") },
        { value: true, text: this.$t("news.createt.inc") }
      ],
      motive: "",
      includeImage: false,
      attachments: {},
      index: 0,
      imageSelected: null,
      newsAttachments: [],
      selectedLanguage: 0,
      languages: [],
      values: [],
      ruralModels: [],
      selectedRuralModel: null,
      authors: "",
      entities: [],
      entitySearch: "",
      localities: [],
      localitySearch: "",
      selectedLocality: null,
      selectedEntity: null,
      enable: true,
      asterisk: "<span style='color: red'>*</span>",
      entitiesNew: [],
      entitiesNewIds: [],
      localitiesNew: [],
      localitiesNewIds: [],
      ruralThematicIds: [],
      ruralThematicPrincipal: [],
      customToolbar: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video", "formula"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [false, 1, 2, 3, 4, 5, 6] }]
      ],
      language: "es",
      languages_date: lang,
      tag: "",
      news_date: null,
    };
  },
  async beforeMount() {
    if (this.$route.params.id) {
      let result = await VAPI.get(`${SERVICE_NAMES.NEWS}/${this.$route.params.id}`);
      this.news = result.data.data;
      this.isEditing = true;
    }
    this.newsAttachments = [];
    this.imageSelected = null;
    let response = await VAPI.get(`${SERVICE_NAMES.NEWS}/languages`);
    this.languages = response.data.data;
    this.values = [];
    let self = this;
    this.languages.forEach(function(v) {
      self.values.push({
        title: "",
        summary: "",
        content: "",
        tags: [],
        language: v.id
      });
    });
    const responseTwo = await VAPI.get(`${SERVICE_NAMES.RURAL_MODEL}/tree`);
    if (responseTwo.data.data != null) {
      this.ruralModels = responseTwo.data.data;
    }

    if (this.news) {
      this.newsAttachments = [];
      this.news.attachments.forEach(a => {
        this.newsAttachments.push({
          id: a.attachmentId,
          url: a.attachment.url,
          type: a.attachment.type.type
        });
        this.attachments["" + a.attachmentId] = [a.state, a.principal];
      });
      if (this.newsAttachments.length > 0)
        this.imageSelected = this.newsAttachments[0];

      this.news.models.forEach(m => {
        this.ruralThematicIds.push(m.ruralModelId);
        this.ruralThematicPrincipal.push(m.principal);
      });
      this.news.geographies.forEach(g => {
        this.localitiesNew.push(g.geography.name);
        this.localitiesNewIds.push(g.geography.id);
      });
      this.news.institutions.forEach(i => {
        this.entitiesNew.push(i.institution.name);
        this.entitiesNewIds.push(i.institution.id);
      });
      this.authors = this.news.news.author;
      this.values = [];
      this.enable = this.news.news.state;
      this.motive = this.news.news.motive === null ? "" : this.news.news.motive;
      this.news_date = new Date(this.news.news.date);

      let auxTags = []
      if (this.news.news.tags) {
        this.news.news.tags.split(",").forEach(tag => {
          auxTags.push({
              "text": tag,
              "tiClasses": [
                "ti-valid"
              ]
            });
        });
      }
      
      this.values.push({
        id: this.news.news.id,
        title: this.news.news.headline,
        summary: this.news.news.description,
        content: this.news.news.content,
        tags: auxTags,
        language: this.news.news.language.id
      });
      
      this.news.child.forEach(c => {
        let auxChildTags = []
        if (c.tags) {
            c.tags.split(",").forEach(tag => {
              auxChildTags.push({
                  "text": tag,
                  "tiClasses": [
                    "ti-valid"
                  ]
              });
            });
        }
        this.values.push({
          id: c.id,
          title: c.headline,
          summary: c.description,
          content: c.content,
          tags: auxChildTags,
          language: c.language.id
        });
      });
      this.languages.forEach(v => {
        const temp = this.values.filter(l => {
          l.language == v.id;
        });
        if (temp.length === 0) {
          this.values.push({
            title: "",
            summary: "",
            content: "",
            tags: [],
            language: v.id
          });
        }
      });
    }
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    validateState(name) {

        if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
            
            return !this.errors.has(name);
        }
        return null;
    },
    created_image(response) {
      this.closeModal("addImageModal");
      let image = _.find(this.newsAttachments, { id: response[0] });
      if (!image) {
        this.newsAttachments.push({
          id: response[0],
          url: response[1],
          type: response[2]
        });
        if (this.newsAttachments.length === 1) {
          this.attachments["" + response[0]] = [true, true];
          this.imageSelected = this.newsAttachments[this.index];
        } else {
          this.attachments["" + response[0]] = [true, false];
        }
      }
    },
    async saveNews(ref) {
      let validNews = [];
      let valid = await this.$validator.validateAll();
      if (!valid) {
        this.showModal("errorNews");
        return;
      }
      let savedLanguages = []
      this.values.forEach(v => {
        
        let tagAux = v.tags.map(tag => tag.text).join(',');

        if (
          v.title.length >= 3 &&
          v.title.length <= 150 &&
          (v.summary.length >= 3 && v.summary.length <= 280) &&
          v.content.length > 3 &&
          (this.authors.length >= 3 && this.authors.length <= 200) &&
          this.entitiesNewIds.length > 0 &&
          this.ruralThematicIds.length > 0 &&
          this.newsAttachments.length > 0 &&
          tagAux.length > 3 && tagAux.length <= 400 &&
          this.news_date
        ) {
          let nv = JSON.parse(JSON.stringify(v));
          nv.tags = tagAux;
          nv.date = this.news_date.getTime();
          validNews.push({
            news: nv,
            motive: this.motive,
            authors: this.authors,
            ruralThematics: this.ruralThematicIds,
            ruralThematicsPrincipal: this.ruralThematicPrincipal,
            entities: this.entitiesNewIds,
            localities: this.localitiesNewIds,
            attachments: this.attachments,
            enable: this.enable,
            deletedAttachment: this.newsAttachmentDeleted,
            deletedRuralModel: this.newsRuralModelDeleted,
            deletedEntites: this.newsEntitiesDeleted,
            deletedGeographies: this.newsGeographyDeleted
          });
          savedLanguages.push(v.language);
        } 
      });
      // console.info("Noticias validas:", validNews.length);
      this.closeModal(ref);
      if (validNews.length == 0) {
        this.showModal("errorNews");
      } else {
        try {
          if (this.news) {
            let response = await VAPI.put(
              `${SERVICE_NAMES.NEWS}/${this.news.news.id}`,
              validNews
            );
            this.$router.push({
              name: "NewsIndex"
            });
          } else {
            let response = await VAPI.post(SERVICE_NAMES.NEWS, validNews);
            this.$router.push({
              name: "NewsIndex"
            });
          }
        } catch (ex) {
          console.log(ex);
        }

        //Make the request
      }
    },
    changeVisibility() {
      if (!this.enable) {
        this.showModal("disabledNews");
      } else {
        this.motive = "";
      }
    },
    showModal(ref) {
      this.show = true;
      this.$refs[ref].show();
    },
    closeModal(ref) {
      this.show = false;
      this.$refs[ref].hide();
    },
    enableNews(ref) {
      this.enable = true;
      this.$refs[ref].hide();
    },
    selectPrincipal(checked) {
      this.attachments["" + this.imageSelected.id][1] = checked;
      let self = this;
      if (checked) {
        Object.keys(this.attachments).forEach(k => {
          if (k + "" !== "" + this.imageSelected.id) {
            this.attachments["" + k][1] = false;
          }
        });
      }
    },
    async getEntities(entity) {
      let response = await VAPI.get('/' + SERVICE_NAMES.INSTITUTION + `/search?q=${entity}`);
      this.entities = response.data.data;
    },
    async getLocalities(locality) {
      let response = await VAPI.get(
        `${SERVICE_NAMES.GEOGRAPHY}/search?q=${locality}&type=Localidad`
      );
      this.localities = response.data.data;
    },
    changeRuralThematicPrincipal(i) {
      if (this.ruralThematicPrincipal[i]) {
        for (
          let index = 0;
          index < this.ruralThematicPrincipal.length;
          index++
        ) {
          this.ruralThematicPrincipal[index] = false;
        }
        this.ruralThematicPrincipal[i] = true;
      }
    },
    deleteRuralThematic(i) {
      if (this.isEditing)
        this.newsRuralModelDeleted.push(this.ruralThematicIds[i]);
      this.ruralThematicIds.splice(i, 1);
      this.ruralThematicPrincipal.splice(i, 1);
      if (
        !this.ruralThematicPrincipal.includes(true) &&
        this.ruralThematicPrincipal.length > 0
      )
        this.ruralThematicPrincipal[0] = true;
    },
    addNewRuralThematic() {
      if (this.selectedRuralModel) {
        this.ruralThematicIds.push(this.selectedRuralModel);
        const length = this.ruralThematicIds.length;
        this.ruralThematicIds = new Set(this.ruralThematicIds);
        this.ruralThematicIds = Array.from(this.ruralThematicIds);

        if (this.ruralThematicIds.length == 1)
          this.ruralThematicPrincipal.push(true);
        else if (length == this.ruralThematicIds.length)
          this.ruralThematicPrincipal.push(false);
        this.selectedRuralModel = null;
      }
    },
    addNewEntity() {
      if (this.selectedEntity !== null) {
        this.entitiesNew.push(this.selectedEntity.name);
        this.entitiesNewIds.push(this.selectedEntity.id);
        this.entitiesNew = new Set(this.entitiesNew);
        this.entitiesNew = Array.from(this.entitiesNew);
        this.entitiesNewIds = new Set(this.entitiesNewIds);
        this.entitiesNewIds = Array.from(this.entitiesNewIds);
        this.selectedEntity = null;
        this.entities = [];
        this.entitySearch = "";
      }
    },
    deleteNewEntity(i) {
      if (this.isEditing) this.deleteNewEntity.push(this.entitiesNewIds[i]);
      this.entitiesNew.splice(i, 1);
      this.entitiesNewIds.splice(i, 1);
    },
    addNewLocality(i) {
      if (this.selectedLocality !== null) {
        this.localitiesNew.push(this.selectedLocality.name);
        this.localitiesNewIds.push(this.selectedLocality.id);
        this.localitiesNew = new Set(this.localitiesNew);
        this.localitiesNew = Array.from(this.localitiesNew);
        this.localitiesNewIds = new Set(this.localitiesNewIds);
        this.localitiesNewIds = Array.from(this.localitiesNewIds);
        this.selectedLocality = null;
        this.localities = [];
        this.localitySearch = "";
      }
    },
    deleteAttachment(image) {
      if (this.isEditing) this.newsAttachmentDeleted.push(image.id);
      delete this.attachments[image.id];
      let i = 0;
      for (let index = 0; index < this.newsAttachments.length; index++) {
        if (this.newsAttachments[index].id == image.id) i = index;
      }
      this.newsAttachments.splice(i, 1);
      let principal = false;
      Object.keys(this.attachments).forEach(a => {
        if (this.attachments[a][1]) principal = true;
      });

      if (!principal && Object.keys(this.attachments).length > 0)
        this.attachments[Object.keys(this.attachments)[0]][1] = true;

      if (this.newsAttachments.length > 0) {
        this.imageSelected = this.newsAttachments[0];
      } else {
        this.imageSelected = null;
      }
      this.closeModal("deleteImage");
    },
    deleteNewLocality(i) {
      if (this.isEditing)
        this.newsGeographyDeleted.push(this.localitiesNewIds[i]);
      this.localitiesNew.splice(i, 1);
      this.localitiesNewIds.splice(i, 1);
    },
    changeEnglishValue(value) {
      this.contentEnglishNew = value;
    },
    changeValue(value) {
      this.values[this.selectedLanguage].content = value;
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
                    if (w.id === v) {
                      label = z.label
                    }
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
    }
  },
  components: {
    VueBootstrapTypeahead,
    RichText,
    Carousel,
    Slide,
    Audiovisualmedia,
    Treeselect,
    "datepicker": Datepicker,
  },
  watch: {
    localitySearch: _.debounce(function(locality) {
      if (locality.length > 0) this.getLocalities(locality);
    }, 500),
    entitySearch: _.debounce(function(entity) {
      if (entity.length > 0) this.getEntities(entity);
    }, 500)
  }
};
</script>

<style lang="sass" scoped>
  .fa-times
    color: red
    font-size: 2rem
    padding: 0 10px
  .w-70
    width: 100%
  .w-30
    width: 30%
  .w-10
    width: 12.5%
  .trash-black
    color: black
    cursor: pointer
  .trash-white
    cursor: pointer
    color: white
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
  .grey
    display: flex
    justify-content: center
    background: #A9A9A9
    color: white	
    font-weight: 600
    border-left: 1px solid white
    border-right: 1px solid white
    padding: 5px
  .cover
    width: 150px
    height: 150px
    background: transparent
    position: absolute
    top: 0
    left: 0
  .modal-content
    margin: 135px 0
  .mg
    margin: 10px 0
  .slick-list 
    margin: 0 -9px
  .item
    padding: 0 9px
  .slick-next
    &.slick-arrow
      background: black !important
  .slick-prev
    &.slick-arrow
      background: black !important
</style>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .dot
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: inline-block;
  .grey-label-text
    color: grey
  .right
    text-align: right
  .message
    font-size: 0.8rem
    margin: 5px 0
  .error
    font-size: 0.8rem
    margin: 5px 0
    color: $colorDanger
  .mg-mobile
    margin: unset
  .red
    color: red
    font-size: 1.3rem
  .w-50
    width: 50%
  .w-100
    width: 100%
  .text
    width: 100%
    font-size: 1rem
    color: $colorMenuMobile
  .btn-container
    +flexbox
    +justify-content(center)
    +align-items(center)
    .btn
      margin: 0 15px
  .tab-design  
    margin-right: 10px
    margin-bottom: -5px !important
    transform: rotate(3deg)
    width: 150px
    a
      background: $colorSidebarMobile
      color: white
      border-radius: 10px
      padding: 10px 3.5em 14px 1em
      span
        display: block
        transform: rotate(-4deg)
      &.active
        background: $colorSidebarDark
        color: white
        border-color: unset
  .content
    background: white
  .mg-top
    margin-top: 10px
  .left
    margin: 0 5px
    justify-content: flex-start !important
    align-items: center
  .multiple
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
  textarea
    font-size: 17px
    padding: 5px
    width: 100%
  input
    height: 42px
    font-size: 17px
    padding: 5px
    width: 100%
  .enable
    text-align: right
  .news-add-container
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +flex-direction(column)
    padding: 1% 5%
  .w-33
    width: 33%
  .center
    +flexbox
    +justify-content(center)
    +align-items(center)  
  .padding
    padding: 10px
  .border
    -webkit-box-shadow: 1px 1px 20px 0px $colorSidebarMobile
    -moz-box-shadow: 1px 1px 20px 0px $colorSidebarMobile
    box-shadow: 1px 1px 20px 0px $colorSidebarMobile
    border-radius: 10px
    border: 2px solid $colorSidebarMobile !important
  @media screen and (min-width: $widthMobile) and (max-width: $widthTablet)
    .center
      flex-direction: column
    .w-30
      width: 100%
    .w-10
      width: 100%
      display: flex
      justify-content: center
    .red
      color: red
      font-size: 1.5rem
    .w-50
      width: 100%
    .w-100
      width: 100%
    .text
      font-size: 1.5rem
    .btn-container
      .btn
        margin: 10px 15px
    .tab-design  
      a
        span
        &.active
    .content
    .mg-top
      margin-top: 20px
    .multiple
    textarea
    input
    .enable
    .news-add-container
      padding: 2% 6%
    .center
    .padding
      padding: 20px
    .border
  @media screen and (max-width: $widthMobile)
    .center
      flex-direction: column
    .w-30
      width: 100%
    .w-70
      width: 100%
    .w-10
      width: 100%
      display: flex
      justify-content: center
    .mg-mobile
      margin: 60px 0 30px
    .red
      color: red
      font-size: 1.5rem
    .w-50
      width: 100%
    .w-100
      width: 100%
    .text
      font-size: 1.5rem
    .btn-container
      .btn
        margin: 10px 15px
    .tab-design  
      a
        span
        &.active
    .content
    .mg-top
      margin-top: 20px
    .multiple
    textarea
    input
    .enable
    .news-add-container
      padding: 2% 6%
    .center
    .padding
      padding: 20px
    .border
</style>
