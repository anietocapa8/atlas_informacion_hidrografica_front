<template>
  <div class="logos-index-container container container-form">
    <sipsder-title :title="$t( 'logos.title' )" type="admin"></sipsder-title>
    <b-modal
      ref="discardChangesModal"
      :title="$t( 'logos.popup.alert' )"
      hideFooter>
      <b-row>
        <b-col cols="10">
          {{ $t( 'logos.popup.discard') }}
        </b-col>
      </b-row>
      <div class="btn-container">
        <sipsder-btn btnType="accept" @onClick="$router.go(-1)"></sipsder-btn>
        <sipsder-btn btnType="cancel" @onClick="hideModal('discardChangesModal')"></sipsder-btn>
      </div>
    </b-modal>

    <b-modal
      ref="successModal"
      :title="$t( 'logos.popup.alert' )"
      hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          {{ $t( 'logos.success' ) }}
        </b-col>
      </b-row>
      <div class="btn-container">
        <sipsder-btn btnType="accept" @onClick="$router.push( { name: 'Home' } )"></sipsder-btn>
      </div>
    </b-modal>

    <b-modal
      ref="invalidModal"
      :title="$t( 'logos.popup.alert' )"
      hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          <div class="error">
            {{ $t( 'logos.invalid' ) }}
          </div>
        </b-col>
      </b-row>
      <div class="btn-container">
        <sipsder-btn btnType="accept" @onClick="hideModal('invalidModal')"></sipsder-btn>
      </div>
    </b-modal>

    <b-modal
      ref="errorsModal"
      :title="$t( 'logos.popup.alert' )"
      hideFooter>
      <b-row align-h="center">
        <b-col cols="10">
          <div class="error">
            {{ $t( 'logos.error' ) }}
          </div>
        </b-col>
      </b-row>
      <div class="btn-container">
        <sipsder-btn btnType="accept" @onClick="hideModal('errorsModal')"></sipsder-btn>
      </div>
    </b-modal>

    <b-row class="center">
      <b-col cols="10">
        <b-nav tabs>

          <b-nav-item
              class="tab-design"
              :active="currentTab === 1"
              @click="currentTab = 1">
            <span>{{ $t( 'logos.logo_tab' ) }}</span>
          </b-nav-item>

          <b-nav-item
              class="tab-design"
              :active="currentTab === 2"
              @click="currentTab = 2">
            <span>{{ $t( 'logos.link_tab' ) }}</span>
          </b-nav-item>

          <b-nav-item
              class="tab-design"
              :active="currentTab === 3"
              @click="currentTab = 3">
            <span>{{ $t( 'logos.color_tab' ) }}</span>
          </b-nav-item>

        </b-nav>
      </b-col>
    </b-row>

    <b-row class="center content" v-if="currentTab === 1">
      <b-col cols="10" class="border" style="background:#fff">
        <div class="padded-title">
          {{ $t( 'logos.logos.title') }}
        </div>
        <b-form @submit.prevent="submitLogos">
          <div class="image-row">
            <b-col cols="3">
              <b-row align-h="center" align-v="end">
                <img class="logo-img" v-if="object.logos.sipsder.logoUrl != null" id="preview" :src="getImgURL(object.logos.sipsder.logoUrl)" width="128" height="128"/>
                <div class="img-placeholder" v-else> {{ $t( 'logos.logos.empty') }} </div>
                <i id="image-help" class="far fa-question-circle pl-1"></i>
                <b-tooltip target="image-help" 
                  :title="$t( 'rural_model.admin.logo_tooltip' )">           
                </b-tooltip>
              </b-row>
            </b-col>
            <div class="additional-information">
              <b-form-group :label="$t( 'logos.logos.bogotaRural' )" label-class="font-weight-bold">
                <input type="file"
                  name="sipsderIconSelector" 
                  @change="previewImage('sipsder', $event)"
                  v-validate="'mimes:image/*|size:200'" 
                  ref="sipsderIconUpload"
                  class="hidden-input"
                  :data-vv-as="$t( 'logos.logos.bogotaRural' )"/>
                <sipsder-btn btnType="uploadImage"
                  class="padded-buttons"
                  :text="$t( 'logos.logos.choose' )"
                  @onClick="$refs.sipsderIconUpload.click()">                                          
                </sipsder-btn>
              </b-form-group>
              <b-form-checkbox
                  v-model="object.logos.sipsder.enabled"
                  id="selectedEnabledSipsder"
                  :value="true"
                  :unchecked-value="false">
                {{ $t( 'logos.logos.enable' ) }}
              </b-form-checkbox>
              <b-row>
                <span class="error pt-3" v-if="errors.has('sipsderIconSelector')">{{ $t( 'logos.logos.error' ) }}</span>
              </b-row>
            </div>
          </div>

          <div class="image-row">
            <b-col cols="3">
              <b-row align-h="center" align-v="end">
                <img class="logo-img" v-if="object.logos.sdp.logoUrl != null" id="preview" :src="getImgURL(object.logos.sdp.logoUrl)" width="128" height="128"/>
                <div class="img-placeholder" v-else> {{ $t( 'logos.logos.empty') }} </div>
                <i id="image-help" class="far fa-question-circle pl-1"></i>
                <b-tooltip target="image-help" 
                  :title="$t( 'rural_model.admin.logo_tooltip' )">           
                </b-tooltip>
              </b-row>
            </b-col>
            <div class="additional-information">
              <b-form-group :label="$t( 'logos.logos.sdp' )"
                label-class="font-weight-bold">
                
                <b-row align-v="center">
                    <b-col cols="2">
                        <div>{{ $t( 'logos.logos.url' ) }} <span class="required">*</span></div>
                    </b-col>
                    <b-col cols="10">
                        <b-form-input
                            type="text"
                            class="my-3"
                            v-model="object.logos.sdp.clickUrl"
                            v-validate="{ required: true, url:true }"
                            :data-vv-as="$t( 'logos.logos.url' )"
                            name="sdpUrl">
                        </b-form-input>
                    </b-col>
                </b-row>
                

                <input type="file"
                  name="sdpIconSelector" 
                  @change="previewImage('sdp', $event)"
                  v-validate="'mimes:image/*|size:200'" 
                  ref="sdpIconUpload"
                  class="hidden-input"
                  :data-vv-as="$t( 'logos.logos.sdp' )"/>

                <sipsder-btn btnType="uploadImage" 
                  class="padded-buttons"
                  :text="$t( 'logos.logos.choose' )"
                  @onClick="$refs.sdpIconUpload.click()">                                          
                </sipsder-btn>

              </b-form-group>

              <b-form-checkbox
                  v-model="object.logos.sdp.enabled"
                  id="selectedEnabledSdp"
                  :value="true"
                  :unchecked-value="false">
                {{ $t( 'logos.logos.enable' ) }}
              </b-form-checkbox>
              <b-row>
                <span class="error pt-3" v-if="errors.has('sdpIconSelector')">{{ $t( 'logos.logos.error' ) }}</span>
                <span class="error pt-3" v-if="errors.has('sdpUrl')">{{ $t( 'logos.logos.error_text' ) }}</span>
              </b-row>
            </div>
          </div>

          <div class="image-row">
            <b-col cols="3">
              <b-row align-h="center" align-v="end">
                <img class="logo-img" v-if="object.logos.mayor.logoUrl != null" id="preview" :src="getImgURL(object.logos.mayor.logoUrl)" width="128" height="128"/>
                <div class="img-placeholder" v-else> {{ $t( 'logos.logos.empty') }} </div>
                <i id="image-help" class="far fa-question-circle pl-1"></i>
                <b-tooltip target="image-help" 
                  :title="$t( 'rural_model.admin.logo_tooltip' )">           
                </b-tooltip>
              </b-row>
            </b-col>
            <div class="additional-information">
              <b-form-group :label="$t( 'logos.logos.bogota' )"
                label-class="font-weight-bold">

                <b-row align-v="center">
                    <b-col cols="2">
                        <div>{{ $t( 'logos.logos.url' ) }} <span class="required">*</span></div>
                    </b-col>
                    <b-col cols="10">
                        <b-form-input
                            type="text"
                            class="my-3"
                            v-model="object.logos.mayor.clickUrl"
                            v-validate="{ required: true, url:true }"
                            :data-vv-as="$t( 'logos.logos.url' )"
                            name="bogotaUrl">
                        </b-form-input>
                    </b-col>
                </b-row>

                <input type="file"
                  name="mayorIconSelector" 
                  @change="previewImage('mayor', $event)"
                  v-validate="'mimes:image/*|size:200'" 
                  ref="mayorIconUpload"
                  class="hidden-input"
                  :data-vv-as="$t( 'logos.logos.bogota' )"/>

                <sipsder-btn btnType="uploadImage" 
                  class="padded-buttons"
                  :text="$t( 'logos.logos.choose' )"
                  @onClick="$refs.mayorIconUpload.click()">                                          
                </sipsder-btn>

              </b-form-group>

              <b-form-checkbox
                  v-model="object.logos.mayor.enabled" true
                  id="selectEnabledBogota"
                  :value="true"
                  :unchecked-value="false">
                {{ $t( 'logos.logos.enable' ) }}
              </b-form-checkbox>
              <b-row>
                <span class="error pt-3" v-if="errors.has('mayorIconSelector')">{{ $t( 'logos.logos.error' ) }}</span>
                <span class="error pt-3" v-if="errors.has('bogotaUrl')">{{ $t( 'logos.logos.error_text' ) }}</span>
              </b-row>
            </div>
          </div>

          <div class="image-row">
            <b-col cols="3">
              <b-row align-h="center" align-v="end">
                <img class="logo-img" v-if="object.logos.country.logoUrl != null" id="preview" :src="getImgURL(object.logos.country.logoUrl)" width="128" height="128"/>
                <div class="img-placeholder" v-else> {{ $t( 'logos.logos.empty') }} </div>
                <i id="image-help" class="far fa-question-circle pl-1"></i>
                <b-tooltip target="image-help" 
                  :title="$t( 'rural_model.admin.logo_tooltip' )">           
                </b-tooltip>
              </b-row>
            </b-col>
            <div class="additional-information">
              <b-form-group :label="$t( 'logos.logos.colombia' )"
                label-class="font-weight-bold">
                
                <b-row align-v="center">
                    <b-col cols="2">
                        <div>{{ $t( 'logos.logos.url' ) }} <span class="required">*</span></div>
                    </b-col>
                    <b-col cols="10">
                        <b-form-input
                            type="text"
                            class="my-3"
                            v-model="object.logos.country.clickUrl"
                            v-validate="{ required: true, url:true }"
                            :data-vv-as="$t( 'logos.logos.url' )"
                            name="colombiaUrl">
                        </b-form-input>
                    </b-col>
                </b-row>

                <input type="file"
                  name="countryIconSelector" 
                  @change="previewImage('country', $event)"
                  v-validate="'mimes:image/*|size:200'" 
                  ref="countryIconUpload"
                  class="hidden-input"
                  :data-vv-as="$t( 'logos.logos.colombia' )"/>

                <sipsder-btn btnType="uploadImage" 
                  class="padded-buttons"
                  :text="$t( 'logos.logos.choose' )"
                  @onClick="$refs.countryIconUpload.click()">                                          
                </sipsder-btn>

              </b-form-group>

              <b-form-checkbox
                  v-model="object.logos.country.enabled"
                  id="selectedEnabledColombia"
                  :value="true"
                  :unchecked-value="false">
                {{ $t( 'logos.logos.enable' ) }}
              </b-form-checkbox>
              <b-row>
                <span class="error pt-3" v-if="errors.has('countryIconSelector')">{{ $t( 'logos.logos.error' ) }}</span>
                <span class="error pt-3" v-if="errors.has('colombiaUrl')">{{ $t( 'logos.logos.error_text' ) }}</span>
              </b-row>
            </div>
          </div>

          <div class="btn-container">
            <sipsder-btn btnType="cancel" @onClick="showModal('discardChangesModal')" :text="$t( 'logos.back' )"></sipsder-btn>
            <sipsder-btn btnType="accept" type="submit" :text="$t( 'logos.save' )"></sipsder-btn>
          </div>
        </b-form>
      </b-col>
    </b-row>

    <b-row class="center content" v-if="currentTab === 2">
      <b-col cols="10" class="border" style="background:#fff">
        <div class="padded-title">
          {{ $t( 'logos.links.title') }}
        </div>
        <b-row class="add-container" align-h="end">
          <sipsder-btn btnType="add" @onClick="addLink('addLink')" :text="$t( 'logos.links.add' )"></sipsder-btn>
        </b-row>
        <b-modal
          ref="addLink"
          :title="$t( 'logos.links.popup.title' )"
          hideFooter>
          <b-row>
            <b-col cols="12">
              <b-form-group :label="$t( 'logos.links.popup.name' )+asterisk" label-class="font-weight-bold">
                <b-form-input
                  type="text"
                  class="my-3"
                  v-model="linkName"
                  v-validate="{ required: true, min: 3, max: 80 }"
                  :data-vv-as="$t( 'logos.links.popup.name' )"
                  name="linkName">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-row>
              <span class="error px-5 pb-3">{{ errors.first('linkName') }}</span>
            </b-row>
            <b-col cols="12">
              <b-form-group :label="$t( 'logos.links.popup.link' )+asterisk" label-class="font-weight-bold">
                <b-form-input
                  type="text"
                  class="my-3"
                  v-model="linkUrl"
                  v-validate="{ required: true, url: true, max: 450 }"
                  :data-vv-as="$t( 'logos.links.popup.link' )"
                  name="link">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-row>
              <span class="error px-5 pb-3">{{ errors.first('link') }}</span>
            </b-row>
            <b-col cols="12">
              <b-form-group :label="$t( 'logos.links.popup.description' )" label-class="font-weight-bold">
                <b-form-input
                  type="text"
                  class="my-3"
                  v-model="linkDescription"
                  v-validate="{ required: false, max: 150 }"
                  maxlength="150"
                  :data-vv-as="$t( 'logos.links.popup.description' )"
                  name="description">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-row>
              <span class="error px-5 pb-3">{{ errors.first('description') }}</span>
            </b-row>
            <b-col cols="12">
              <b-form-group :label="$t( 'logos.links.popup.status' )" label-class="font-weight-bold">
                <b-form-select v-model="linkStatus" :options="optionsLink"/>
              </b-form-group>
            </b-col>
            <b-col cols="12" class="mt-4">
              <b-form-group :label="$t( 'logos.links.popup.upper' )" label-class="font-weight-bold">
                <b-form-select v-model="linkUpper" :options="optionsLinkUpper"/>
              </b-form-group>
            </b-col>
            <b-row align-h="center" class="w-100">
              <span class="error">{{ errorMessage }}</span>
            </b-row>

            <b-row class="mt-4">
              <b-col cols="5">
                <b-row align-h="center" align-v="end">
                  <img class="logo-img" v-if="linkFileUrl" id="preview" :src="getImgURL(linkFileUrl)" width="128" height="128">
                  <div class="img-placeholder" v-else> {{ $t( 'logos.logos.empty') }} </div>
                  <i id="image-help" class="far fa-question-circle pl-1"></i>
                  <b-tooltip target="image-help" 
                    :title="$t( 'rural_model.admin.logo_tooltip' )">           
                  </b-tooltip>
                </b-row>
              </b-col>
              <b-col cols="7">
                <b-form-group :label="$t( 'logos.links.popup.logo' )"
                  label-class="font-weight-bold">
                  <input type="file"
                    name="linkIconSelector" 
                    @change="previewLinkImage($event)"
                    v-validate="'mimes:image/*|size:200'" 
                    ref="linkIconUpload"
                    class="hidden-input"
                    :data-vv-as="$t( 'logos.links.popup.logo' )"/>
                  <sipsder-btn btnType="uploadImage" 
                    class="padded-buttons"
                    :text="$t( 'logos.logos.choose' )"
                    @onClick="$refs.linkIconUpload.click()">                                          
                  </sipsder-btn>
                </b-form-group>
                <b-row>
                  <span class="error pt-3" v-if="errors.has('linkIconSelector')">{{ $t( 'logos.logos.error' ) }}</span>
                </b-row>
              </b-col>
            </b-row>
            
          </b-row>
          <b-row align-h="center" class="mt-3">
              <div class="btn-container">
                <sipsder-btn 
                  btnType="accept" 
                  @onClick="createOrUpdateLink"
                  :disabled="errors.has('linkIconSelector')"
                ></sipsder-btn>
                <sipsder-btn btnType="cancel" @onClick="hideModal('addLink')"></sipsder-btn>
              </div>
            </b-row>
        </b-modal>
        <filter-table
          :optionsTable="options_table"
          :perPage="linkSize"
          :items="items"
          @action="action($event)"
          :externalQuery="linksQuery"
          :fields="fields_t"
        ></filter-table>
        
        <div class="btn-container">
          <sipsder-btn btnType="cancel" @onClick="showModal('discardChangesModal')" :text="$t( 'logos.back' )"></sipsder-btn>
          <sipsder-btn btnType="accept" @onClick="$router.push( { name: 'Home' } )" :text="$t( 'logos.save' )"></sipsder-btn>
        </div>
        
      </b-col>
    </b-row>

    <b-row class="center content" v-if="currentTab === 3">
      <b-col cols="10" class="border" style="background:#fff">
        <div class="padded-title">
          {{ $t( 'logos.colors.title') }}
        </div>
        <b-form @submit.prevent="submitColors">
          <b-row class="container-bordered">
            <b-col cols="12">
              <strong>{{ $t( 'logos.colors.links' ) }}</strong>
            </b-col>
            <b-col cols="5">
              <div class="py-3">
                {{ $t( 'logos.colors.color' ) }} <span v-html="asterisk"></span>
              </div>
              <b-form-input type="text"
                  v-model="object.colors.linkFooterColor"
                  v-validate="{ required: true, regex: rgbRegex }"
                  :data-vv-as="$t( 'logos.colors.links' )"
                  :placeholder="$t( 'logos.colors.placeholder' )"
                  name="linkColor">
              </b-form-input>
            </b-col>
            <b-col>
              <div class="color-sample" :style="{backgroundColor: object.colors.linkFooterColor}"></div>
              <span class="error pt-3" v-if="errors.has( 'linkColor' )">{{ $t( 'logos.colors.error' ) }}</span>
            </b-col>
          </b-row>

          <b-row class="container-bordered">
            <b-col cols="12">
              <strong>{{ $t( 'logos.colors.contact' ) }}</strong>
            </b-col>
            <b-col cols="5">
              <div class="py-3">
                {{ $t( 'logos.colors.color' ) }} <span v-html="asterisk"></span>
              </div>
              <b-form-input type="text"
                  v-model="object.colors.contactFooterColor"
                  v-validate="{ required: true, regex: rgbRegex }"
                  :data-vv-as="$t( 'logos.colors.contact' )"
                  :placeholder="$t( 'logos.colors.placeholder' )"
                  name="contactColor">
              </b-form-input>
            </b-col>
            <b-col>
              <div class="color-sample" :style="{backgroundColor: object.colors.contactFooterColor}"></div>
              <span class="error pt-3" v-if="errors.has( 'contactColor' )">{{ $t( 'logos.colors.error' ) }}</span>
            </b-col>
          </b-row>

          <b-row class="container-bordered">
            <b-col cols="12">
              <strong>{{ $t( 'logos.colors.copyright' ) }}</strong>
            </b-col>
            <b-col cols="5">
              <div class="py-3">
                {{ $t( 'logos.colors.color' ) }} <span v-html="asterisk"></span>
              </div>
              <b-form-input type="text"
                  v-model="object.colors.copyrightFooterColor"
                  v-validate="{ required: true, regex: rgbRegex }"
                  :data-vv-as="$t( 'logos.colors.copyright' )"
                  :placeholder="$t( 'logos.colors.placeholder' )"
                  name="copyrightColor">
              </b-form-input>
            </b-col>
            <b-col>
              <div class="color-sample" :style="{backgroundColor: object.colors.copyrightFooterColor}"></div>
              <span class="error pt-3" v-if="errors.has( 'copyrightColor' )">{{ $t( 'logos.colors.error' ) }}</span>
            </b-col>
          </b-row>
          
          <div class="btn-container">
            <sipsder-btn btnType="cancel" @onClick="showModal('discardChangesModal')" :text="$t( 'logos.back' )"></sipsder-btn>
            <sipsder-btn btnType="accept" type="submit" :text="$t( 'logos.save' )"></sipsder-btn>
          </div>
        </b-form>
      </b-col>
    </b-row>

    <sipsder-btn btnType="back" @onClick="$router.go(-1)" class="center"></sipsder-btn>
  </div>
</template>

<script>
import FilterTable from "../../shared/FilterTable.vue";
import VAPI from "../../../http_common";
import { LOGO_TYPE, LOGO_TYPE_KEYS } from "../../../domain_constants";
import { SERVICE_NAMES } from '../../../sipsder_constants';
import S_UTIL from "../../../util/sipsder_util";

export default {
  components: {
    FilterTable
  },
  async beforeMount( ) {
    const response = await this.getLogosAndColors( );
    // Set logos
    Object.keys(response.data.logos).forEach(key => {
      if( response.data.logos[key] != null ) {
        this.object.logos[key] = response.data.logos[key];
      }
    });
    // Set links
    const links = await this.getLinks( );
    this.object.links = links.data;
    this.linkMeta = links.meta;
    this.linkPages = links.pages;
    // Set colors
    this.object.colors.linkFooterColor = response.data.colors.linkFooterColor
    this.object.colors.contactFooterColor = response.data.colors.contactFooterColor
    this.object.colors.copyrightFooterColor = response.data.colors.copyrightFooterColor
  },
  data() {
    return {
      SERVICE_NAMES,
      LOGO_TYPE,
      LOGO_TYPE_KEYS,
      rgbRegex: /^#(?:[0-9a-f]{3}){1,2}$/i,
      asterisk: "<span style='color: red'>*</span>",
      currentTab: 1,
      object: {
        logos: {
            sipsder: {},
            sdp: {},
            mayor: {},
            country: {}
        },
        links: [],
        colors: {
          linkFooterColor:	null,
          contactFooterColor:	null,
          copyrightFooterColor:	null
        }
      },
      options_table: {
        "detail": {
          "id": 0,
          "class": "btn-success",
          "label": "",
          "icon": "edit_pen"
        }   
      },
      linkId : null,
      linkName: null,
      linkUrl: null,
      linkDescription: null,
      linkStatus: true,
      linkUpper: false,
      linkFile: null,
      linkFileUrl: null,
      linkSize: 5,
      items: "getLinks",
      errorMessage: "",
      linksQuery: {
        size: this.linkSize
      },
      linkMeta: null,
      linkPages: null,
      currentLinkPage: 0,
      optionsLink: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false }
      ],
      optionsLinkUpper: [
        { text: "Si", value: true },
        { text: "No", value: false }
      ],
      fields_t: [
        {
          key: "shownName",
          label: "Nombre",
          sortable: true,
          class: "text-center"
        },
        {
          key: "url",
          label: "URL",
          sortable: true,
          class: "text-center"
        },
        {
          key: "active",
          label: "Estado",
          sortable: true,
          class: "text-center"
        },
        {
          key: "upper",
          label: "Superior",
          type: Boolean,
          class: "text-center"
        },
        {
          key: "actions",
          label: "Acciones",
          class: "text-center"
        }
      ],
    };
  },
  methods: {
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    },
    customLogoValidator( ) {
      status = false;
      // Validate logos
      Object.keys(this.object.logos).forEach(key => {
        if( !this.object.logos[key] == "sipsder" && this.object.logos[key].clickUrl == null ) {
          status = true;
          return;
        }
        // if( this.object.logos[key].logoUrl == null ) {
        //   status = true;
        //   return;
        // }
      });
      return status;
    },
    customColorValidator( ) {
      status = false;
      // Validate colors
      Object.keys(this.object.colors).forEach(key => {
        if( this.object.colors[key] == null ) {
          status = true;
          return;
        }
      });
      return status;
    },
    customLinkValidator( ) {
      // Validate link modal
      if( this.linkName == null || this.linkName == "" || 
          this.linkUrl == null || this.linkUrl == "" ||
          this.linkStatus == null ||
          this.linkUpper == null ) {
        return false;
      }
      return true;
    },
    assembleLogoPayload( ) {
      let formData = new FormData();
      // SIPSDER
      if( this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].id != null ) {
        formData.append( 'idSipsder', this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].id );
      }
      if( this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].enabled != null ) {
        formData.append( 'enabledSipsder', this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].enabled );
      }
      else {
        formData.append( 'enabledSipsder', false );
      }
      if(this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].file != null) {
        formData.append( 'logoSipsder', this.object.logos[ LOGO_TYPE_KEYS.SIPSDER ].file );
      }
      // SDP
      if( this.object.logos[ LOGO_TYPE_KEYS.SDP ].id != null ) {
        formData.append( 'idSdp', this.object.logos[ LOGO_TYPE_KEYS.SDP ].id );
      }
      formData.append( 'urlSdp', this.object.logos[ LOGO_TYPE_KEYS.SDP ].clickUrl );
      if( this.object.logos[ LOGO_TYPE_KEYS.SDP ].enabled != null ) {
        formData.append( 'enabledSdp', this.object.logos[ LOGO_TYPE_KEYS.SDP ].enabled );
      }
      else {
        formData.append( 'enabledSdp', false );
      }
      if(this.object.logos[ LOGO_TYPE_KEYS.SDP ].file != null) {
        formData.append( 'logoSdp', this.object.logos[ LOGO_TYPE_KEYS.SDP ].file );
      }
      // Mayor
      if( this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].id != null ) {
        formData.append( 'idMayor', this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].id );
      }
      formData.append( 'urlMayor', this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].clickUrl );
      if( this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].enabled != null ) {
        formData.append( 'enabledMayor', this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].enabled );
      }
      else {
        formData.append( 'enabledMayor', false );
      }
      if(this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].file != null) {
        formData.append( 'logoMayor', this.object.logos[ LOGO_TYPE_KEYS.MAYOR ].file );
      }
      // Country
      if( this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].id != null ) {
        formData.append( 'idCountry', this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].id );
      }
      formData.append( 'urlCountry', this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].clickUrl );
      if( this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].enabled != null ) {
        formData.append( 'enabledCountry', this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].enabled );
      }
      else {
        formData.append( 'enabledCountry', false );
      }
      if(this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].file != null) {
        formData.append( 'logoCountry', this.object.logos[ LOGO_TYPE_KEYS.COUNTRY ].file );
      }
      return formData;
    },
    assembleColorPayload( ) {
      return {
        colors: {
          linkFooterColor: this.object.colors.linkFooterColor,
          contactFooterColor: this.object.colors.contactFooterColor,
          copyrightFooterColor: this.object.colors.copyrightFooterColor,
        }
      }
    },
    assembleLinkPayload( ) {
      let formData = new FormData();
      if (this.linkId) {
        formData.append('id', this.linkId);
      }
      if (this.linkFile) {
        formData.append('attachment', this.linkFile);
      }
      formData.append('name', this.linkName);
      formData.append('url', this.linkUrl);
      formData.append('description', this.linkDescription);
      formData.append('status', this.linkStatus);
      formData.append('upper', this.linkUpper);

      return formData;
    },
    async submitLogos(e) {
      this.$validator.validateAll( ).then( valid => {
        if( valid && this.customLogoValidator( ) == 'false' ) {
          try {
            let path = SERVICE_NAMES.LOGOS_LINKS_COLORS + '/logos';
            let payload = this.assembleLogoPayload( )
            let headers = { headers: { 'Content-Type': 'multipart/form-data' } };
            VAPI.post( path, payload, headers )
            .then( 
              ( success ) => {
                this.showModal( 'successModal' );
              }, ( error ) => {
                this.showModal( 'errorsModal' );
                console.error( error );
              }
            );       
          }
          catch( error ) {
            this.showModal( 'errorsModal' );
            console.error( error );
          }
        }
        else {
          this.showModal( 'invalidModal' );
        }
      });
    },
    async submitColors(e) {
      const invalid = Object.keys(this.veeFields).some(
        key => this.veeFields[key].invalid
      );
      if( !invalid && this.customColorValidator( ) == 'false' ) {
        try {
          await VAPI.post( SERVICE_NAMES.LOGOS_LINKS_COLORS + '/links-colors', this.assembleColorPayload( ) )
          .then( 
            ( success ) => {
              this.showModal( 'successModal' );
              this.$store.dispatch("setLogosColors", {});
            }, ( error ) => {
              this.showModal( 'errorsModal' );
              console.error( error );
            }
          );       
        }
        catch( error ) {
          this.showModal( 'errorsModal' );
          console.error( error );
        }
      }
      else{
        this.showModal( 'invalidModal' );
      }
    },
    async fetchLogosAndColors( ) {
        try {
            const response = await VAPI.get( SERVICE_NAMES.LOGOS_LINKS_COLORS );
            return response.data;
        }
        catch( err ) {
            console.error( 'Error fetching logos and colors with message:' , err );
        }
    },
    async getLogosAndColors( ) {
        const payload = await this.fetchLogosAndColors( );
        return payload;
    },
    buildQuery( ) {
      return SERVICE_NAMES.LOGOS_LINKS_COLORS + `/links?page=${this.currentLinkPage}&size=${this.linkSize}&sort=creationDate,asc`
    },
    async fetchLinks( ) {
        try {
            const response = await VAPI.get( this.buildQuery() );
            return response.data;
        }
        catch( err ) {
            console.error( 'Error fetching links with message:' , err );
        }
    },
    async getLinks( ) {
        const payload = await this.fetchLinks( );
        return payload;
    },
    action(index) {
      switch (index.id) {
        case 0: //Edit
          this.linkId = index.item.id;
          this.linkName = index.item.shownName;
          this.linkUrl = index.item.url;
          this.linkDescription = index.item.description;
          this.linkStatus = index.item.active === "Activo" ? true : false;
          this.linkFileUrl = index.item.attachment ? index.item.attachment.url : null;
          this.linkUpper = index.item.upper;
          this.errorMessage = "";
          this.showModal( 'addLink' );
          break;
      }
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    previewLinkImage(e) {
      this.linkFile = e.target.files[0];
      this.linkFileUrl = URL.createObjectURL(this.linkFile);
    },
    previewImage(index, e) {
      this.object.logos[index].file = e.target.files[0];
      this.object.logos[index].logoUrl = URL.createObjectURL(this.object.logos[index].file);
    },
    async createOrUpdateLink(e) {
      const invalid = Object.keys(this.veeFields).some(
        key => this.veeFields[key].invalid
      );
      if( !invalid && this.customLinkValidator( ) ) {
        try {
          let path = SERVICE_NAMES.LOGOS_LINKS_COLORS + '/links-create';
          let payload = this.assembleLinkPayload( )
          let headers = { headers: { 'Content-Type': 'multipart/form-data' } };

          VAPI.post( path, payload, headers )
          .then( 
            ( success ) => {
              this.$store.dispatch("getLinksPages", {});
              this.$store.dispatch("setActiveLinks", {});
            }, ( error ) => {
              this.showModal( 'errorsModal' );
              console.error( error );
            }
          );       
        }
        catch( error ) {
          this.showModal( 'errorsModal' );
          console.error( error );
        }
        this.hideModal('addLink')
      }
      else {
        this.errorMessage = this.$t( 'logos.links.popup.error2' )
      }
    },
    addLink( ref ) {
      this.linkId = null;
      this.linkName = null;
      this.linkUrl = null;
      this.linkDescription = null;
      this.status = true;
      this.upper = false;
      this.linkFile = null;
      this.linkFileUrl = null;
      this.errorMessage = "";
      this.showModal( ref );
    },
  }
};
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .required
    color: red;
  .padded-title
    padding: 25px;
  .color-sample
    width: 100%;
    border: 2px solid;
    border-radius: 3px;
    height: 60px;
    margin-top: 10px;
  .container-bordered
    border: 2px solid;
    margin-left: 10px;
    padding: 25px;
    margin-bottom: 10px;
    margin-right: 10px;
  .img-placeholder
    display: inline-block;
    border: 1px solid;
    padding: 10px 5px 10px 5px;
    width: 128px;
    height: 128px;
    word-wrap: break-word;
  .logo-img
    background-color: #f5f5f5
  .hidden-input
    visibility: hidden;
    height: 0px !important;
    padding: 0px;
  .padded-buttons
    margin-top: -20px;
  .content
    background: white
  .tab-design  
    margin-right: 10px
    margin-bottom: -5px !important
    transform: rotate(3deg)
    width: 150px
    a
      background: $colorTitle
      color: white
      border-radius: 10px
      padding: 10px 3.5em 14px 1em
      span
        display: block
        transform: rotate(-4deg)
      &.active
        background: $colorTitleDark
        color: white
        border-color: unset
  .add-container
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
    padding: 20px
    cursor: pointer
    .title
      margin-left: 10px
      font-size: 1.5rem
      width: 25%
  .btn-container
    margin-top: 15px;
    width: 100%
    +flexbox
    +justify-content(center)
    +align-items(center)
    .sipsder-button
      margin: 0 1%
  .mg-top
    margin-top: 15px
  .mg-lf
    margin-left: 15px
  .mg-rg
    margin-right: 15px
  .error
    color: $colorDanger
  input
    width: 100%
    padding: 5px
  .image-row
    width: 100%
    padding: 10px
    +flexbox
    +justify-content(flex-start)
    +align-items(center)
  .image
    width: 150px
    height: 150px
    border: 1px dotted black
  .additional-information
    width: 100%
    padding: 15px
    +flexbox
    +justify-content(flex-start)
    +align-items(flex-start)
    align-content: flex-start
    +flex-direction(column)
  .padding
    padding: 0 15px
  .border
    -webkit-box-shadow: 1px 1px 10px 0px $colorTitle
    -moz-box-shadow: 1px 1px 10px 0px $colorTitle
    box-shadow: 1px 1px 10px 0px $colorTitle
    border-radius: 10px
    border: 2px solid $colorTitleDark !important
  .logos-index-container
    width: 100%
    +flexbox
    +justify-content(flex-start)
    +flex-direction(column)
    padding: 1% 5%
  .center
    +flexbox
    +justify-content(center)
    +align-items(center)    
  @media screen and (max-width: $widthMobile)
    .btn-container
      .sipsder-button
        margin: 0 2%
    .mg-top
      margin-top: 25px
    .mg-lf
      margin-left: 25px
    .mg-rg
      margin-right: 25px
    .error
    input
    .image-row
      flex-direction: column
    .image
    .additional-information
      margin: 10px 0
    .padding
    .border
    .logos-index-container
    .center

</style>
