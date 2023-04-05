<template>
  <div class="container container-form" v-if="loadedDomains">
    <b-container>
      <sipsder-title
        :title="this.institution.id ?
            this.$t('institutionAdmin.form.edit_title') :
            this.$t('institutionAdmin.form.add_title') "
        type="admin"
        section="configuration"
      />
    </b-container>
    <b-form data-vv-scope="formInst" @submit.prevent="saveInstitution">
      <b-container fluid>
        <b-row>
          <b-col class="row-margin">
            <b-form-group
              class="form-group required"
              :label-cols="4"
              :label="$t('institutionAdmin.form.institution_name')"
            >
              <b-form-input
                type="text"
                v-validate="'required|max:80'"
                name="name"
                :placeholder="$t('institutionAdmin.form.name')"
                :data-vv-as="$t('institutionAdmin.form.institution_name')"
                v-model="institution.name"
              />
              <b-alert
                variant="danger"
                :show="errors.has('formInst.name')"
              >{{ errors.first("formInst.name") }}</b-alert>
            </b-form-group>
          </b-col>
          <b-col class="row-margin">
            <b-form-group
              class="form-group required"
              :label="$t('institutionAdmin.form.user_type')"
              :label-cols="4"
            >
              <b-form-select
                :options="opts.userType"
                v-validate="'required'"
                :data-vv-as="$t('institutionAdmin.form.user_type')"
                name="userType"
                v-model="institution.userTypeId"
              />
              <b-alert
                variant="danger"
                :show="errors.has('formInst.userType')"
              >{{ errors.first("formInst.userType") }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row
          v-show="institution.userTypeId === USER_TYPES.INSTITUTION_GOVERNMENTAL || institution.userTypeId === USER_TYPES.INSTITUTION_SDP"
        >
          <b-col class="row-margin">
            <b-form-group
              class="form-group required"
              :label-cols="4"
              :label="$t('institutionAdmin.form.institution_type')"
            >
              <b-form-select
                :options="opts.instType"
                v-validate="'required'"
                name="institutionType"
                :data-vv-as="$t('institutionAdmin.form.institution_type')"
                v-model="institution.institutionTypeId"
                :disabled="institution.userTypeId !== USER_TYPES.INSTITUTION_GOVERNMENTAL && institution.userTypeId !== USER_TYPES.INSTITUTION_SDP"
              />
              <b-alert
                variant="danger"
                :show="errors.has('formInst.institutionType')"
              >{{ errors.first("formInst.institutionType") }}</b-alert>
            </b-form-group>
          </b-col>
          <b-col class="row-margin">
            <b-form-group
              class="form-group required"
              :label="$t('institutionAdmin.form.administrative_sector')"
              :label-cols="4"
            >
              <b-form-select
                :options="opts.sector"
                v-validate="'required'"
                name="administrativeSector"
                :data-vv-as="$t('institutionAdmin.form.administrative_sector')"
                v-model="institution.sectorId"
                :disabled="typeof institution.institutionTypeId !== 'number'"
              />
              <b-alert
                variant="danger"
                :show="errors.has('formInst.administrativeSector')"
              >{{ errors.first("formInst.administrativeSector") }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="row-margin">
            <b-form-group :label-cols="4" :label="$t('institutionAdmin.form.creation_user')">
              <b-form-input class="username-input" readonly v-model="institution.creationUser" />
            </b-form-group>
          </b-col>
          <b-col class="row-margin">
            <b-form-group
              class="form-group required"
              :label="$t('institutionAdmin.form.status')"
              :label-cols="4"
            >
              <b-form-select
                :options="opts.status"
                v-validate="'required'"
                name="status"
                v-model="institution.status"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-container>
        <b-row align-v="center">
          <b-col md="4" offset-md="4" align="center">
            <span class="h4">{{$t("institutionAdmin.form.office_title")}}</span>
          </b-col>
          <b-col md="4" class="text-right">
            <sipsder-btn
              :text="$t('institutionAdmin.form.add_office_btn')"
              btnType="add"
              @onClick="showAddOfficeModal"
            />
          </b-col>
        </b-row>
        <b-row>
          <div class="table">
            <b-table
              striped
              show-empty
              stacked="sm"
              :fields="tables.office.fields"
              :items="institution.offices"
              :empty-text="$t('institutionAdmin.form.tables.office.empty_msg')"
            >
              <template slot="main" slot-scope="data">
                <div class="centered on-table">
                  <b-form-checkbox
                    v-model="data.item.main"
                    :disabled="data.item.main"
                    @change="toggledMainOffice(data.item)"
                  />
                </div>
              </template>
              <template slot="actions" slot-scope="data">
                <div class="centered on-table">
                  <sipsder-btn btnType="delete" @onClick="toDelete('offices', data)" text />
                </div>
              </template>
            </b-table>
          </div>
        </b-row>
        <b-form data-vv-scope="formContact" @submit.prevent="saveContact">
          <b-row class="aligned-row">
            <b-col cols="2">
              <label class="label required">{{$t("institutionAdmin.form.contact_title")}}</label>
            </b-col>
            <b-col cols="2">
              <b-form-group>
                <b-form-select
                  v-model="contact.office"
                  :options="opts.office"
                  :data-vv-as="$t('institutionAdmin.form.office')"
                  name="office"
                  v-validate="'required'"
                />
                <b-alert
                  variant="danger"
                  :show="errors.has('formContact.office')"
                >{{ errors.first("formContact.office") }}</b-alert>
              </b-form-group>
            </b-col>
            <b-col cols="2">
              <b-form-group>
                <b-form-select
                  v-model="contact.type"
                  :options="opts.contactType"
                  :data-vv-as="$t('institutionAdmin.form.contact_type')"
                  name="contactType"
                  v-validate="'required'"
                />
                <b-alert
                  variant="danger"
                  :show="errors.has('formContact.contactType')"
                >{{ errors.first("formContact.contactType") }}</b-alert>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group>
                <b-form-input
                  v-model="contact.value"
                  name="value"
                  :data-vv-as="contactTypeValue"
                  :placeholder="contactTypeValue"
                  v-validate="contactValidations"
                />
                <b-alert
                  variant="danger"
                  :show="errors.has('formContact.value')"
                >{{ errors.first("formContact.value") }}</b-alert>
              </b-form-group>
            </b-col>
            <b-col class="right-btn-container">
              <sipsder-btn
                :text="$t('institutionAdmin.form.add_contact_btn')"
                btnType="add"
                type="submit"
              />
            </b-col>
          </b-row>
          <b-alert variant="danger" :show="errorMsgs.contact !== undefined">{{ errorMsgs.contact }}</b-alert>
        </b-form>
        <b-row>
          <div class="table">
            <b-table
              striped
              show-empty
              stacked="sm"
              :fields="tables.contact.fields"
              :items="institution.contacts"
              :empty-text="$t('institutionAdmin.form.tables.contact.empty_msg')"
            >
              <template slot="actions" slot-scope="data">
                <div class="centered on-table">
                  <sipsder-btn btnType="delete" @onClick="toDelete('contacts', data)" text />
                </div>
              </template>
            </b-table>
          </div>
        </b-row>
        <b-form data-vv-scope="formEmailDomain" @submit.prevent="saveDomain">
          <b-row class="aligned-row">
            <b-col cols="2">
              <label class="label required">{{$t("institutionAdmin.form.domain_title")}}</label>
            </b-col>
            <b-col cols="7">
              <b-form-group>
                <b-form-input
                  v-model="domain"
                  v-validate="'required|max:30'"
                  name="value"
                  :data-vv-as="$t('institutionAdmin.form.domain')"
                  :placeholder="$t('institutionAdmin.form.domain_hint')"
                />
                <b-alert
                  variant="danger"
                  :show="errors.has('formEmailDomain.value') || errorMsgs.domain !== undefined"
                >
                  {{ (errors.has('formEmailDomain.value')) ?
                  errors.first("formEmailDomain.value") :
                  errorMsgs.domain }}
                </b-alert>
              </b-form-group>
            </b-col>
            <b-col class="right-btn-container">
              <sipsder-btn
                :text="$t('institutionAdmin.form.add_domain_btn')"
                btnType="add"
                type="submit"
              />
            </b-col>
          </b-row>
        </b-form>
        <b-row>
          <div class="table">
            <b-table
              striped
              show-empty
              :fields="tables.domain.fields"
              :items="institution.emailDomains"
              :empty-text="$t('institutionAdmin.form.tables.domain.empty_msg')"
            >
              <template slot="actions" slot-scope="data">
                <div class="centered on-table">
                  <sipsder-btn btnType="delete" @onClick="toDelete('emailDomains', data)" text />
                </div>
              </template>
            </b-table>
          </div>
        </b-row>
      </b-container>
      <div class="centered">
        <sipsder-btn class="button-group" btnType="back" @onClick="showModal('discard')" />
        <sipsder-btn class="button-group" btnType="accept" :text="$t('button.save')" type="submit" />
      </div>
    </b-form>
    <b-modal
      ref="commonModal"
      :title="modal.text.title"
      v-model="showCommonModal"
      hide-footer
      :hide-header-close="modal.value.nonClosable"
      :no-close-on-esc="modal.value.nonClosable"
      :no-close-on-backdrop="modal.value.nonClosable"
    >
      <b-row class="modal-msg centered" v-html="modal.text.message" />
      <b-row class="centered">
        <b-col>
          <sipsder-btn btnType="accept" @onClick="modal.value.onAccept" />
        </b-col>
        <b-col v-if="modal.value.cancelable">
          <sipsder-btn btnType="cancel" @onClick="modal.value.onCancel" />
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      ref="officeModal"
      :title="this.$t('institutionAdmin.add_office.title')"
      size="xl"
      v-model="showOfficeModal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @hidden="onOfficeModalClosed"
    >
      <add-office-admin
        onModal
        :shown="creatingOffice"
        @create-office="addOffice"
        @cancel-creation="cancelOfficeCreation"
      />
    </b-modal>
  </div>
</template>

<script>
import VAPI from "../../../http_common";
import { SERVICE_NAMES, HTTP_STATUS } from "../../../sipsder_constants";
import {
  USER_TYPES,
  INSTITUTION_TYPE,
  CONTACT_TYPE
} from "../../../domain_constants";
import AddOfficeAdmin from "./AddOfficeAdmin";

export default {
  name: "IntitutionFormAdmin",
  components: { AddOfficeAdmin },
  data() {
    return {
      /*            CONSTANTS            */
      USER_TYPES,
      INSTITUTION_TYPE,
      CONTACT_TYPE,
      /*            MODELS            */
      institution: Object.assign(
        {
          status: true,
          creationUser:
            this.$store.getters.getCurrentUser.firstName +
            " " +
            this.$store.getters.getCurrentUser.lastName,
          userTypeId: undefined,
          institutionTypeId: undefined,
          offices: [],
          contacts: [],
          emailDomains: []
        },
        this.$store.getters.getInstitution
      ),
      contact: {},
      domain: undefined,
      toRemove: undefined,
      contactTypeValue: this.$t("institutionAdmin.form.value"),
      loadedDomains: false,
      disableInstTypes: true,
      disableSectors: true,
      showCommonModal: false,
      showOfficeModal: false,
      creatingOffice: false,
      errorMsgs: {
        instName: undefined,
        contact: undefined,
        domain: undefined
      },
      /*            MODAL VALUES            */
      modals: {
        successSave: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => this.$router.push({ name: "InstitutionAdmin" })
        },
        discard: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.$router.go(-1),
          onCancel: () => (this.showCommonModal = false)
        },
        discardOffice: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => {
            this.showCommonModal = false;
            this.onOfficeModalClosed();
          },
          onCancel: () => this.showAddOfficeModal()
        },
        invalid: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => (this.showCommonModal = false)
        },
        delete: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => {
            this.deleteModel();
            this.showCommonModal = false;
          },
          onCancel: () => (this.showCommonModal = false)
        }
      },
      modal: {
        text: {
          title: "",
          message: ""
        },
        value: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => {},
          onCancel: () => (this.showCommonModal = false)
        }
      },
      /*            TABLES            */
      tables: {
        office: {
          fields: [
            {
              key: "name",
              label: this.$t("institutionAdmin.add_office.name"),
              sortable: true,
              sortDirection: "desc"
            },
            {
              key: "address",
              label: this.$t("institutionAdmin.add_office.address")
            },
            {
              key: "cityName",
              label: this.$t("institutionAdmin.add_office.city")
            },
            {
              key: "attentionHours",
              label: this.$t("institutionAdmin.add_office.attention_hours")
            },
            {
              key: "main",
              label: this.$t("institutionAdmin.add_office.main")
            },
            {
              key: "actions",
              label: this.$t("institutionAdmin.actions")
            }
          ]
        },
        contact: {
          fields: [
            {
              key: "office.name",
              label: this.$t("institutionAdmin.office")
            },
            {
              key: "type",
              label: this.$t("institutionAdmin.contact_type"),
              formatter: id =>
                this.opts.contactType.find(ct => ct.value === id).text
            },
            {
              key: "value",
              label: this.$t("institutionAdmin.contact_value")
            },
            {
              key: "actions",
              label: this.$t("institutionAdmin.actions")
            }
          ]
        },
        domain: {
          fields: [
            {
              key: "domain",
              label: this.$t("institutionAdmin.domain"),
              sortable: true,
              sortDirection: "desc",
              formatter: domain => "@" + domain
            },
            {
              key: "actions",
              label: this.$t("institutionAdmin.actions")
            }
          ]
        }
      },
      /*            RETRIEVED DATA (Types)            */
      sectors: [],
      /*            SELECT OPTIONS            */
      opts: {
        status: [
          { value: true, text: this.$t("institutionAdmin.form.active") },
          { value: false, text: this.$t("institutionAdmin.form.inactive") }
        ],
        userType: [],
        instType: [],
        sector: [],
        office: [
          {
            value: undefined,
            text: this.$t("institutionAdmin.form.office"),
            disabled: true
          }
        ],
        contactType: [
          {
            value: undefined,
            text: this.$t("institutionAdmin.form.contact_type"),
            disabled: true
          }
        ]
      }
    };
  },
  computed: {
    contactValidations: function() {
      return {
        required: true,
        max: 80,
        email: this.contact.type === CONTACT_TYPE.EMAIL_ADDRESS,
        url: this.contact.type === CONTACT_TYPE.WEBSITE,
      };
    }
  },
  watch: {
    "institution.userTypeId": function(userType) {
      switch (userType) {
        case USER_TYPES.INSTITUTION_GOVERNMENTAL:
          this.institution.institutionTypeId = undefined;
          this.institution.sectorId = undefined;
          this.disableInstTypes = false;
          this.disableSectors = true;
          break;
        case USER_TYPES.INSTITUTION_SDP:
          this.institution.institutionTypeId = INSTITUTION_TYPE.DIST_CENTRAL;
          this.institution.sectorId = undefined;
          this.disableInstTypes = true;
          this.disableSectors = false;
          break;
        case USER_TYPES.INSTITUTION_ACADEMIC:
        case USER_TYPES.INSTITUTION_ENTERPRISE:
        default:
          this.institution.institutionTypeId = undefined;
          this.institution.sectorId = undefined;
          this.disableInstTypes = true;
          this.disableSectors = true;
          break;
      }
    },
    "institution.institutionTypeId": function(institutionType) {
      switch (institutionType) {
        case INSTITUTION_TYPE.NATIONAL:
          this.disableSectors = false;
          this.institution.sectorId = undefined;
          this.filterSectorOpts(INSTITUTION_TYPE.NATIONAL);
          break;
        case INSTITUTION_TYPE.DIST_DESCENTRALIZED:
        case INSTITUTION_TYPE.DIST_GOVERNMENT:
        case INSTITUTION_TYPE.DIST_CENTRAL:
          this.disableSectors = false;
          this.institution.sectorId = undefined;
          this.filterSectorOpts(INSTITUTION_TYPE.DISTRITAL);
          break;
        default:
          this.disableSectors = true;
          this.institution.sectorId = undefined;
          break;
      }
    },
    "contact.type": function(contactType) {
      contactType = this.opts.contactType.find(ct => ct.value === contactType);
      if (contactType === undefined) {
        this.contactTypeValue = $t("institutionAdmin.form.value");
      } else {
        this.contactTypeValue = contactType.text
          .toLowerCase()
          .split(" ")
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      }
      if (this.$validator.fields.find("formContact.value").flags.invalid) {
        setTimeout(() => this.$validator.validate("formContact.value"), 100);
      }
    }
  },
  beforeMount() {
    this.loadTypes();
    this.setOfficeOpts();
  },
  destroyed() {
    this.$store.dispatch("removeInstitution", this.id);
  },
  methods: {
    filterSectorOpts(instTypeId) {
      this.opts.sector = this.sectors
        .filter(item => item.institutionType.id === instTypeId)
        .map(item => {
          return {
            value: item.id,
            text: item.name
          };
        });
    },
    toggledMainOffice(e) {
      this.institution.offices.map(office => {
        office.main = false;
        return office;
      });
    },
    onOfficeModalClosed() {
      // If not on discardOffice modal
      if (!this.showCommonModal) this.creatingOffice = false;
    },
    showAddOfficeModal() {
      this.creatingOffice = true;
      this.showOfficeModal = true;
    },
    cancelOfficeCreation() {
      this.showOfficeModal = false;
      this.showModal("discardOffice");
    },
    showModal(name) {
      this.showCommonModal = false;
      // Sets modal fields
      for (let field in this.modal.value)
        if (this.modals[name].hasOwnProperty(field))
          this.modal.value[field] = this.modals[name][field];
      // Sets modal
      const nameSnakeCase = name
        .split(/(?=[A-Z])/)
        .join("_")
        .toLowerCase();
      for (let field in this.modal.text)
        this.modal.text[field] = this.$t(
          "institutionAdmin.form.modals." + nameSnakeCase + "." + field
        );
      this.showCommonModal = true;
    },
    addOffice(office) {
      office.main = this.institution.offices.length === 0;
      this.institution.offices.push(office);
      this.opts.office.push({ value: office, text: office.name });
      this.showOfficeModal = false;
    },
    saveContact() {
      this.$validator.validateAll("formContact").then(result => {
        if (result) {
          if (this.contact.type === CONTACT_TYPE.EMAIL_ADDRESS) {
            const contactDomain = this.contact.value.split("@")[1];
            const filtered = this.institution.emailDomains.filter(
              domain => domain.domain === contactDomain
            );
            if (filtered.length === 0) {
              this.addEmailDomain(contactDomain, false)
                .then(result => {
                  if (!result) {
                    this.errorMsgs.contact = this.$t(
                      "institutionAdmin.form.contact_error_msg"
                    );
                    return;
                  }
                  this.errorMsgs.contact = undefined;
                  this.addContact();
                })
                .catch(e => {
                  console.error(
                    "An error has occurred verifying domain existence: " +
                      e.toString()
                  );
                });
              return;
            }
          }
          this.errorMsgs.contact = undefined;
          this.addContact();
        }
      });
    },
    addContact() {
      this.institution.contacts.push(this.contact);
      this.contact = {};
      this.$validator.reset("formContact");
    },
    saveDomain() {
      this.$validator.validateAll("formEmailDomain").then(valid => {
        if (valid) {
          let domain = this.domain;
          if (domain[0] === "@") domain = domain.slice(1);
          this.addEmailDomain(domain, true);
        } else {
          this.errorMsgs.domain = this.$t(
            "institutionAdmin.form.domain_error_msg"
          );
        }
      });
    },
    async addEmailDomain(domain, fromForm) {
      const filtered = this.institution.emailDomains.filter(
        d => domain === d.domain
      );
      if (filtered.length === 0) {
        try {
          const response = await VAPI.get(
            "/" + SERVICE_NAMES.EMAIL_DOMAIN + "?domain=" + domain
          );
          if (response && response.status === HTTP_STATUS.NO_CONTENT) {
            this.institution.emailDomains.push({
              id: undefined,
              domain: domain
            });
            this.errorMsgs.domain = undefined;
            if (fromForm) {
              this.domain = undefined;
              this.$validator.reset("formEmailDomain");
              return;
            } else {
              return true;
            }
          } else {
            throw new Error("response error");
          }
        } catch (e) {
          console.error(
            "An error has occurred verifying domain existence: " + e.toString()
          );
        }
      }
      if (fromForm)
        this.errorMsgs.domain = this.$t(
          "institutionAdmin.form.domain_error_msg"
        );
      return false;
    },
    toDelete(field, data) {
      this.toRemove = { field: field, data: data.item };
      this.showModal("delete");
    },
    deleteModel() {
      let { field, data } = this.toRemove;
      const arr = this.institution[field];
      const elemIdx = arr.indexOf(data);
      if (elemIdx > -1) {
        arr.splice(elemIdx, 1);
        if (data.main && arr.length != 0) arr[0].main = true;
      }
      if (field === "offices") {
        this.institution.contacts = this.institution.contacts.filter(
          contact => contact.office !== data
        );
        this.opts.office = this.opts.office.filter(
          option => option.value !== data
        );
        this.contact.office = undefined;
      } else if (field === "emailDomains") {
        this.institution.contacts = this.institution.contacts.filter(
          contact =>
            contact.type !== CONTACT_TYPE.EMAIL_ADDRESS ||
            !contact.value.includes(data.domain)
        );
      }
    },
    setContacts() {
      if (this.institution.contacts !== undefined) {
        for (let office of this.institution.offices) {
          this.institution.contacts.push(
            ...office.contacts.map(contact => {
              contact.office = office;
              contact.type = contact.contactTypeId;
              return contact;
            })
          );
          delete office["contacts"];
        }
      }
    },
    setOfficeOpts() {
      this.opts.office.push(
        ...this.institution.offices.map(office => {
          return { value: office, text: office.name };
        })
      );
    },
    /*        Requests to back        */
    loadTypes() {
      const instTypePromise = VAPI.get(SERVICE_NAMES.INSTITUTION_TYPE),
        userTypePromise = VAPI.get(
          SERVICE_NAMES.USER_TYPE + "?type=institucional"
        ),
        contactTypePromise = VAPI.get(SERVICE_NAMES.CONTACT_TYPE),
        sectorsPromise = VAPI.get(SERVICE_NAMES.ADMINISTRATIVE_SECTOR);
      /*        User types        */
      userTypePromise
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const data = response.data.data;
            this.opts.userType.push(
              ...data.map(item => {
                return {
                  value: item.id,
                  text: item.type
                };
              })
            );
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error(
            "An error has occurred loading UserTypes " + e.toString()
          );
        });
      /*        Institution types        */
      instTypePromise
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const data = response.data.data;
            this.opts.instType.push(
              ...data
                .filter(instType => instType.id !== INSTITUTION_TYPE.DISTRITAL)
                .map(item => {
                  return {
                    value: item.id,
                    text: item.type
                  };
                })
            );
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error(
            "An error has occurred loading InstitutionTypes " + e.toString()
          );
        });
      /*        Administrative sectors        */
      sectorsPromise
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const data = response.data.data;
            this.sectors.push(...data);
            if (this.institution.institutionTypeId) {
              if (
                this.institution.institutionTypeId === INSTITUTION_TYPE.NATIONAL
              ) {
                this.filterSectorOpts(INSTITUTION_TYPE.NATIONAL);
              } else {
                this.filterSectorOpts(INSTITUTION_TYPE.DISTRITAL);
              }
            }
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error(
            "An error has occurred loading AdministrativeSectors " +
              e.toString()
          );
        });
      /*        Contact types        */
      contactTypePromise
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            const data = response.data.data;
            this.opts.contactType.push(
              ...data.map(item => {
                return {
                  value: item.id,
                  text: item.type
                };
              })
            );
            this.setContacts();
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error(
            "An error has occurred loading ContactTypes " + e.toString()
          );
        });
      Promise.all([
        userTypePromise,
        instTypePromise,
        contactTypePromise,
        sectorsPromise
      ])
        .then(() => {
          this.loadedDomains = true;
        })
        .catch(e => {
          console.error("An error ocurred loading domains" + e.toString());
        });
    },
    validContacts() {
      const offices = this.institution.offices;
      const contacts = this.institution.contacts;

      if (contacts.length === 0 || contacts.length < offices.length)
        return false;
      let filtered = offices.filter(
        o => contacts.find(c => c.office === o) === undefined
      );
      return filtered.length === 0;
    },
    saveInstitution() {
      this.$validator.validateAll("formInst").then(valid => {
        let hasErrors = false;
        const discardMsgs = [];
        if (!valid) {
          hasErrors = true;
        }
        if (this.institution.offices.length === 0) {
          discardMsgs.push(this.$t("institutionAdmin.form.no_office_msg"));
          hasErrors = true;
        }
        if (!this.validContacts()) {
          discardMsgs.push(this.$t("institutionAdmin.form.no_contact_msg"));
          hasErrors = true;
        }
        if (this.institution.emailDomains.length === 0) {
          discardMsgs.push(this.$t("institutionAdmin.form.no_domain_msg"));
          hasErrors = true;
        }
        if (hasErrors) {
          this.showModal("invalid");
          discardMsgs.forEach(msg => {
            this.modal.text.message +=
              '<div class="alert alert-danger modal-alert">' + msg + "</div>";
          });
          return;
        }
        // Create institution body
        const body = { ...this.institution };
        body.offices = this.institution.offices.map(office => {
          let o = { ...office };
          o.contacts = this.institution.contacts
            .filter(contact => office === contact.office)
            .map(contact => ({
              id: contact.id,
              contactTypeId: contact.type,
              value: contact.value
            }));
          return o;
        });
        delete body["id"];
        delete body["contacts"];
        delete body["creationUser"];

        let request, msg;
        if (this.institution.id) {
          request = VAPI.put(
            "/" + SERVICE_NAMES.INSTITUTION + "/" + this.institution.id,
            body
          );
          msg = "updat";
        } else {
          request = VAPI.post("/" + SERVICE_NAMES.INSTITUTION, body);
          msg = "creat";
        }
        request
          .then(response => {
            if (response && response.status === HTTP_STATUS.OK) {
              this.showModal("successSave");
            } else {
              throw new Error("response error");
            }
          })
          .catch(e => {
            console.error("Error " + msg + "ing institution " + e.toString());
            this.showModal("invalid");
            if (e.response.status === HTTP_STATUS.CONFLICT) {
              this.modal.text.message +=
                '<div class="alert alert-danger modal-alert">' +
                this.$t("institutionAdmin.form.inst_name_error_msg") +
                "</div>";
            }
          });
      });
    }
  }
};
</script>

<style scpoed>
.right-btn-container {
  text-align: right;
}
.form-group.required legend:after,
.label.required:after {
  content: " *";
  color: red;
}
.form-control.username-input {
  text-transform: uppercase;
}
.table {
  border-color: transparent !important;
  background-color: transparent !important;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
.table td {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.centered {
  text-align: center;
}
.centered .custom-control {
  margin: 0;
}
.centered.on-table .sipsder-button img {
  width: 50px !important;
  height: 50px !important;
}
.modal-msg {
  padding: 0 10px 20px 10px;
  flex-flow: column;
}
.button-group {
  margin: 0px 20px 0px 20px;
}
.aligned-row {
  display: flex;
  align-items: center;
}
.modal-alert {
  margin-top: 20px !important;
  margin-bottom: 0 !important;
}
</style>