<template class="full-width">
  <div v-if="procedure">
    <div class="feed-title no-print">{{ $t('procedure.detail.title').toUpperCase() }}</div>
    <div class="container container-form col-90">
      <div class="centered">
        <h2>
          <b>
            {{ $t('procedure.detail.name_label') }}
            {{ procedure.name }}
          </b>
        </h2>
      </div>
      <b-row>
        <b-col class="right-btn-container">
          <sipsder-btn
            v-if="isAdministrator"
            class="no-print"
            :text="$t('procedure.detail.edit_btn')"
            btnType="edit_pen"
            @onClick="edit"
          />
        </b-col>
      </b-row>
      <b-row class="colors-container">
        <span
          class="colors"
          v-for="(r, j) in procedure.ruralModels"
          :key="j"
          :style="{'background-color': r.color}"
          :title="r.name"
          v-b-tooltip.hover
        />
      </b-row>
      <b-row>
        <b-col>
          <p>
            <b v-t="'procedure.detail.summary_label'" />
            {{ procedure.summary }}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b v-t="'procedure.detail.description_label'" />
          <rich-text-preview :content="procedure.description" />
        </b-col>
      </b-row>
      <br />
      <b-row v-if="procedure.institutions && procedure.institutions.length">
        <b-col>
          <b v-t="'procedure.detail.inst_label'" />
          <br>
          <div class="collapser-container" v-for="item of procedure.institutions" :key="item.id">
            <b-button class="collapser" @click="item.show = !item.show">
              <b-row v-if="item.institution">
                <b-col cols="6" class="collapser-item right-border">{{ item.institution.name }}</b-col>
                <b-col
                  cols="1-5"
                  class="collapser-item right-border centered"
                  v-if="instTypes && item.institution.institutionTypeId"
                >{{ item.institution.type }}</b-col>
                <b-col
                  cols="4"
                  class="collapser-item"
                  v-if="sectors && item.institution.sectorId"
                >{{ item.institution.sector }}</b-col>
                <a>
                  <i class="fa fa-chevron-up fa-2x icon-middle" v-show="item.show"/>
                  <i class="fa fa-chevron-down fa-2x icon-middle" v-show="!item.show"/>
                </a>
              </b-row>
            </b-button>
            <b-collapse :id="'collapse-inst-' + item.institution.id" v-model="item.show">
              <b-card>
                <p>{{ item.description }}</p>
                <span>
                  {{ $t('procedure.detail.url_inst_label_1') }}
                  <a
                    href="#"
                    @click="redirect(item.url)"
                  >{{ item.url }}</a>
                  <template
                    v-if="item.institution.offices && item.institution.offices.length"
                  >{{ $t('procedure.detail.url_inst_label_2') }}</template>
                </span>
                <br>
                <br v-if="item.institution.offices && item.institution.offices.length">
                <div
                  class="collapser-container"
                  v-for="office of item.institution.offices"
                  :key="office.id"
                >
                  <b-button class="collapser" @click="office.show = !office.show">
                    <b-row>
                      <b-col class="collapser-item" cols="11-5">{{ office.name }}</b-col>
                      <a>
                        <i class="fa fa-chevron-up fa-2x icon-middle" v-show="office.show"/>
                        <i class="fa fa-chevron-down fa-2x icon-middle" v-show="!office.show"/>
                      </a>
                    </b-row>
                  </b-button>
                  <b-collapse :id="'collapse-office-' + office.id" v-model="office.show">
                    <b-card>
                      <b-row class="marginless">
                        <b-col cols="6" class="widget-col">
                          <icon-text-widget
                            :data="[office.address, office.cityName]"
                            icon="fa fa-map-marker-alt"
                          />
                        </b-col>
                        <b-col
                          cols="6"
                          class="widget-col"
                          v-if="office.emailContacts && office.emailContacts.length"
                        >
                          <icon-text-widget
                            :data="office.emailContacts"
                            field="value"
                            icon="fa fa-envelope"
                          />
                        </b-col>
                        <b-col
                          cols="6"
                          class="widget-col"
                          v-if="office.phoneContacts && office.phoneContacts.length"
                        >
                          <icon-text-widget
                            :data="office.phoneContacts"
                            field="value"
                            icon="fa fa-phone"
                          />
                        </b-col>
                        <b-col cols="6" class="widget-col">
                          <icon-text-widget
                            :data="[office.attentionHours]"
                            field="value"
                            icon="fa fa-clock"
                          />
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-collapse>
                </div>
              </b-card>
            </b-collapse>
          </div>
        </b-col>
      </b-row>
      <span class="info-line">
        <b v-t="'procedure.detail.url_label'" />
        <a href="#" @click="redirect(procedure.url)">{{ procedure.url }}</a>
      </span>
      <b-row>
        <b-col class="inline-div">
          <span v-t="'procedure.detail.useful_label'" />
          <b-form-radio-group
            id="useful-info"
            class="button-group"
            v-model="procedure.usefulInfo"
            :options="usefulOpts"
            :disabled="disableUsefulInput"
            @change="usefulChanged = true"
          />
          <b-tooltip v-if="!isLogged" :show.sync="showLogTooltip" target="useful-info">
            <span
              v-b-modal.login
              @mouseover="showLogTooltip = true"
              @mouseleave="showLogTooltip = false"
            >
              {{ $t('procedure.detail.login_tooltip') }}
              <u>{{$t('procedure.detail.here_tooltip')}} </u>
            </span>
          </b-tooltip>
        </b-col>
        <b-col cols="auto" class="inline-item centered">
          <print-component>
            <b-row>
              <b-col class="d-flex justify-content-center">
                <h2>
                  <b>
                    {{ $t('procedure.detail.name_label') }}
                    {{ procedure.name }}
                  </b>
                </h2>
              </b-col>
            </b-row>
            <b-row class="colors-container">
              <b-col v-for="(r, j) in procedure.ruralModels" :key="j">
                <span
                  class="colors-print"
                  :style="{'background-color': r.color}"
                  :title="r.name"
                  v-b-tooltip.hover
                />
                {{r.name}}
              </b-col>
            </b-row>
            <br>
            <hr>
            <br><br>
            <b-row>
              <b-col>
                <rich-text-preview :content="procedure.description"/>
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col class="d-flex justify-content-start">
                <span class="info-line">
                  <b>{{ $t('procedure.detail.url_label') }}</b>
                  <a
                    href="#"
                    @click="redirect(procedure.url)"
                  >{{ procedure.url }}</a>
                </span>
              </b-col>
            </b-row>
            <b-row v-if="procedure.institutions && procedure.institutions.length">
              <b-col class="d-flex justify-content-center">
                <b><u>{{$t('procedure.detail.inst_label')}}</u></b>
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col>
                <div class="collapser-container" v-for="item of procedure.institutions" :key="item.id">
                  <b-button class="collapser">
                    <b-row>
                      <b-col cols="6" class="collapser-item right-border">
                        {{ item.institution.name }}
                      </b-col>
                      <b-col
                        cols="1-5"
                        class="collapser-item right-border centered"
                        v-if="instTypes && item.institution.institutionTypeId"
                      >{{ item.institution.type }}</b-col>
                      <b-col
                        cols="4"
                        class="collapser-item"
                        v-if="sectors && item.institution.sectorId"
                      >{{ item.institution.sector }}</b-col>
                    </b-row>
                  </b-button>
                  <b-collapse :id="'collapse-inst-' + item.institution.id" visible >
                    <b-card>
                      <p>{{ item.description }}</p>
                      <span>
                        {{ $t('procedure.detail.url_inst_label_1') }}
                        <a
                          href="#"
                          @click="redirect(item.url)"
                        >{{ item.url }}</a>
                        <template
                          v-if="item.institution.offices && item.institution.offices.length"
                        >{{ $t('procedure.detail.url_inst_label_2') }}</template>
                      </span>
                      <br>
                      <br v-if="item.institution.offices && item.institution.offices.length">
                      <div
                        class="collapser-container"
                        v-for="office of item.institution.offices"
                        :key="office.id"
                      >
                        <b-button class="collapser" @click="office.show = !office.show">
                          <b-row>
                            <b-col class="collapser-item" cols="11-5">{{ office.name }}</b-col>
                            <a>
                              <i class="fa fa-chevron-up fa-2x icon-middle" v-show="office.show"/>
                              <i class="fa fa-chevron-down fa-2x icon-middle" v-show="!office.show"/>
                            </a>
                          </b-row>
                        </b-button>
                        <b-collapse :id="'collapse-office-' + office.id" v-model="office.show">
                          <b-card>
                            <b-row class="marginless">
                              <b-col cols="6" class="widget-col">
                                <icon-text-widget
                                  :data="[office.address, office.cityName]"
                                  icon="fa fa-map-marker-alt"
                                />
                              </b-col>
                              <b-col
                                cols="6"
                                class="widget-col"
                                v-if="office.emailContacts && office.emailContacts.length"
                              >
                                <icon-text-widget
                                  :data="office.emailContacts"
                                  field="value"
                                  icon="fa fa-envelope"
                                />
                              </b-col>
                              <b-col
                                cols="6"
                                class="widget-col"
                                v-if="office.phoneContacts && office.phoneContacts.length"
                              >
                                <icon-text-widget
                                  :data="office.phoneContacts"
                                  field="value"
                                  icon="fa fa-phone"
                                />
                              </b-col>
                              <b-col cols="6" class="widget-col">
                                <icon-text-widget
                                  :data="[office.attentionHours]"
                                  field="value"
                                  icon="fa fa-clock"
                                />
                              </b-col>
                            </b-row>
                          </b-card>
                        </b-collapse>
                      </div>
                    </b-card>
                  </b-collapse>
                </div>
              </b-col>
            </b-row>
            <hr>
            <b-row v-if="legalNote">
              <b-col>
                <h4>
                  <b>{{ $t('procedure.detail.legal_note')}}</b>
                </h4>
                <rich-text-preview :content="legalNote.content"/>
              </b-col>
            </b-row>
          </print-component>
        </b-col>
        <b-col cols="auto" >
          <social-networks-share/>
        </b-col>
        <b-col cols="auto" class="d-flex align-items-center">
          <report-component
            :contentId="procedure.rawId"
            :content-type="REPORT_CONTENT_TYPES.PROCEDURES"
          />
        </b-col>
        <b-col cols="auto" class="d-flex align-items-center">
          <score-component
            :idContent="procedure.id"
            :idType="SCORE_CONTENT_TYPE.PROCEDURES"
            :likes="procedure.likes"
            :dislikes="procedure.dislikes"
          />
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <rich-text-preview v-if="linkNote" :content="linkNote.content"/>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <span v-if="legalNote">
            <h4>
              <b>{{ $t('procedure.detail.legal_note')}}</b>
            </h4>
            <rich-text-preview :content="legalNote.content"/>
          </span>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="d-flex justify-content-center">
          <sipsder-btn btnType="back" @onClick="$router.go(-1)"/>
          <sipsder-btn
            class="button-group no-print"
            btnType="back"
            :text="$t('procedure.detail.to_list_btn')"
            @onClick="$router.push({name: 'ProcedureIndex'})"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextPreview from "../../shared/RichTextPreview";
import SocialNetworksShare from "../../shared/social_networks_share/SocialNetworksShare";
import ReportComponent from "../../shared/ReportComponent.vue";
import ScoreComponent from "../../shared/ScoreComponent.vue";
import IconTextWidget from "../../shared/IconTextWidget";
import PrintComponent from "../../shared/PrintComponent";

import {
  CONTACT_TYPE,
  INSTITUTION_TYPE,
  MODULES,
  PERMISSIONS_TYPES
} from "../../../domain_constants";
import {
  SERVICE_NAMES,
  HTTP_STATUS,
  SCORE_CONTENT_TYPE,
  REPORT_CONTENT_TYPES
} from "../../../sipsder_constants";
import VAPI from "../../../http_common";

export default {
  name: "ProcedureDetail",
  components: {
    RichTextPreview,
    ReportComponent,
    ScoreComponent,
    SocialNetworksShare,
    IconTextWidget,
    PrintComponent
  },
  data() {
    return {
      SCORE_CONTENT_TYPE,
      REPORT_CONTENT_TYPES,
      CONTACT_TYPE,
      procedure: this.$store.getters.getProcedure,
      instTypes: undefined,
      sectors: undefined,
      linkNote: undefined,
      legalNote: undefined,
      showLogTooltip: false,
      usefulChanged: false,
      usefulOpts: [
        {
          text: this.$t("util.yes"),
          value: true,
          disabled: this.disableUsefulInput
        },
        {
          text: this.$t("util.no"),
          value: false,
          disabled: this.disableUsefulInput
        }
      ]
    };
  },
  async beforeMount() {
    await this.loadProcedure();
    if (this.procedure === undefined) {
      this.$destroy();
      this.$router.push({ name: "ProcedureIndex" });
      return;
    }
    try {
      const instTypesPromise = VAPI.get("/" + SERVICE_NAMES.INSTITUTION_TYPE);
      instTypesPromise.then(response => {
        if (response && response.status === HTTP_STATUS.OK) {
          this.instTypes = response.data.data;
        }
      });
      const sectorsPromise = VAPI.get(
        "/" + SERVICE_NAMES.ADMINISTRATIVE_SECTOR
      );
      sectorsPromise.then(response => {
        if (response && response.status === HTTP_STATUS.OK) {
          this.sectors = response.data.data;
        }
      });
      Promise.all([instTypesPromise, sectorsPromise]).then(() => {
        this.setProcedureFields();
      });
      VAPI.get("/" + SERVICE_NAMES.SIPSDER_NOTE + "/" + MODULES.PROCEDURE).then(
        response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const notes = response.data.data;
            this.linkNote = notes.find(n => n.key === "link");
            this.legalNote = notes.find(n => n.key === "legal");
          }
        }
      );
    } catch (e) {
      console.error("Error loading notes: " + e);
    }
  },
  destroyed() {
    this.$store.dispatch("removeProcedure");
  },
  computed: {
    disableUsefulInput() {
      return (this.procedure && this.procedure.usefulInfo !== null) || !this.isLogged;
    },
    useful() {
      if (this.procedure)
        return this.procedure.usefulInfo;
      return false;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdministrator() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    getHTML() {
      return this.$el;
    }
  },
  watch: {
    useful(u) {
      if (this.usefulChanged) {
        VAPI.post(`/${SERVICE_NAMES.PROCEDURE}/useful`, {
          id: this.procedure.id,
          useful: u
        })
          .then(response => {
            this.usefulChanged = false;
            if (!response || response.status !== HTTP_STATUS.OK)
              throw new Error("response error");
          })
          .catch(error => {
            this.usefulChanged = false;
            if (this.procedure)
              this.procedure.usefulInfo = undefined;
            console.error(
              "A problem has ocurred saving the information: " +
                error.toString()
            );
          });
      }
    }
  },
  methods: {
    async loadProcedure() {
      if (this.$route.params.id) {
        await this.$store.dispatch("getProcedure", this.$route.params.id);
      } else {
        this.$router.go(-1);
        return;
      }
      this.procedure = this.$store.getters.getProcedure;
    },
    setProcedureFields() {
      for (let instProcedure of this.procedure.institutions) {
        const inst = instProcedure.institution;
        if (inst.institutionTypeId !== INSTITUTION_TYPE.NATIONAL)
          inst.institutionTypeId = INSTITUTION_TYPE.DISTRITAL;
        inst.type = this.findById(inst.institutionTypeId, this.instTypes).type;
        inst.sector = this.findById(inst.sectorId, this.sectors).name;
        for (let office of inst.offices) {
          office.phoneContacts = office.contacts.filter(
            c => c.contactTypeId === CONTACT_TYPE.PHONE
          );
          office.emailContacts = office.contacts.filter(
            c => c.contactTypeId === CONTACT_TYPE.EMAIL_ADDRESS
          );
        }
        inst.offices.sort((o1, o2) => o2.main - o1.main);
      }
    },
    findById(id, collection) {
      return collection.find(item => item.id === id);
    },
    edit() {
      this.$router.push({
        name: "ProcedureCreate",
        params: { id: this.procedure.id }
      });
    },
    redirect(link) {
      window.open(this.getLink(link), "_blank");
    },
    getLink(link) {
      if (/^https?:\/\//.test(link)) {
        return link;
      }
      return `https://${link}`;
    }
  }
};
</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.full-width
  width: 100%

.right-btn-container
  text-align: right
  margin-bottom: 20px

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_5.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 110%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 15px
  padding-left: calc(10% + 20px)
  padding-top: 20px

.colors-container
    height: 30px
    margin-bottom: 10px
    margin-top: 10px
    .colors
        margin: 5px 0 0 5px
        width: 25px
        height: 25px
        border-radius: 50%
        float: left

.colors-print
  margin: 5px 0 0 5px
  width: 30px
  height: 30px
  border-radius: 50%
  float: left

.collapser-container
  width: 100%
  padding: 20px 30px 0px 30px

.collapser:hover, 
.btn-secondary:not(:disabled):not(.disabled):active,
  background-color: #00b7ba
  border-color: #00b7ba

.collapser
  background-color: #02747c
  border-color: #02747c
  width: 100%
  text-align: left
  
.icon-middle
  color: #9A9A9A
  float: right
  position: relative
  top: 25%

.collapser-item
  font-size: large
  padding: 10px 20px

.right-border
  border-right: solid   
  border-color: #9A9A9A

.col-11-5
  flex: 0 0 calc(100% / 12 * 11.5)
  max-width: calc(100% / 12 * 11.5)

.col-1-5
  flex: 0 0 12.5%
  max-width: 12.5%

.marginless
  margin: 0px

.widget-col
  padding: 0px 35px

.inline-div
  display: inline-flex

.inline-item
  height: 48px
    
.info-line
  display: block
  margin: 20px 0px

.content-table
  max-width: 50%
  margin: auto
  margin-bottom: 20px

.legal-note
  font-size: 13px

.centered
  text-align: center

.button-group
  margin: 0px 20px 0px 20px

@media screen  and (max-width: $widthMobile)
  .col-90
      width: 80% !important
  .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
@media screen  and (max-width: $widthTablet)
  .col-90
      width: 80% !important
  .collapser-container
    padding: 0 5px !important
    .collapser-item
      font-size: 1rem !important
    .right-border
      border: unset !important
    .col-4, .col-6, .col-1-5
      flex: unset !important
      max-width: unset !important

@media print

  .no-print, .no-print *
    display: none !important
</style>