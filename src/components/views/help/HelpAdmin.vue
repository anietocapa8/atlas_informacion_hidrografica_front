<template>
  <div class="container container-form">
    <b-container v-if="manual">
      <sipsder-title :title="$t('help.admin.title')" type="admin" section="configuration" />
      <b-form @submit.prevent="validateManual">
        <b-row>
          <b-col cols="12">
          <b-form-group
            class="form-group required"
            label-cols-md="3"
            :label="$t('help.admin.manual_type')"
            horizontal
          >
            <b-form-select
              :options="manualOpts"
              v-validate="'required'"
              name="status"
              v-model="selected"
            />
          </b-form-group>
          </b-col>
        </b-row>
        <b-row class="right-btn-container">
          <b-col cols="12">
            <b-form-checkbox v-model="manual.enabled" />
            <span>{{ $t('help.admin.enable') }}</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="auto">
            <input
              ref="uploadDocument"
              type="file"
              accept="application/pdf"
              v-show="false"
              @change="uploadFile($event)"
            />
            <sipsder-btn
              btnType="uploadImage"
              :text="$t('help.admin.choose_file')"
              @onClick="onUpload"
            />
          </b-col>
          <b-col class="valign">
            <span v-if="file">{{file.name}}</span>
          </b-col>
          <b-col cols="auto" class="right-btn-container valign">
            <span class="far fa-eye fa-3x" @click="toDetail" />
          </b-col>
        </b-row>
        <b-row>
          <b-alert variant="danger" :show="errorUpload">{{ $t('help.admin.file_size') }}</b-alert>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group
              class="form-group required"
              label-cols="4"
              :label="$t('help.admin.date')"
              horizontal
            >
              <el-date-picker
                name="date"
                class="full-width"
                v-model="manual.date"
                :data-vv-as="$t('help.admin.date')"
                v-validate="'required|nonFutureDate'"
                type="datetime"
                :placeholder="$t('util.insertDate')"
                format="dd/MM/yyyy HH:mm"
                prefix-icon="far fa-calendar-alt"
                :picker-options="pickerOpts"
              />
              <b-alert variant="danger" :show="errors.has('date')">{{ errors.first("date") }}</b-alert>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              class="form-group required"
              label-cols="5"
              :label="$t('help.admin.version')"
              horizontal
            >
              <b-form-input
                name="version"
                type="text"
                :data-vv-as="$t('help.admin.version')"
                v-validate="'required'"
                v-model="manual.version"
              />
              <b-alert variant="danger" :show="errors.has('version')">{{ errors.first("version") }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group class="form-group required" :label="$t('help.admin.description_lbl')" x>
              <b-form-textarea
                type="text"
                v-validate="'required|max:280'"
                name="description"
                :placeholder="$t('help.admin.description')"
                :data-vv-as="$t('help.admin.description')"
                v-model="manual.description"
                rows="3"
                max-rows="5"
                no-resize
              />
              <b-alert
                variant="danger"
                :show="errors.has('description')"
              >{{ errors.first("description") }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="text-center">
          <sipsder-btn class="button-group" btnType="back" @onClick="shownModal = 'discard'" />
          <sipsder-btn
            class="button-group"
            btnType="accept"
            :text="$t('button.save')"
            @onClick="validateManual"
          />
        </div>
      </b-form>
    </b-container>
    <modal
      :modals="modals"
      :activeModalName="shownModal"
      i18n="help.admin"
      @closed="shownModal = undefined"
    />
  </div>
</template>

<script>
import Modal from "@/components/shared/Modal";
import VAPI from "@/http_common";
import { SERVICE_NAMES, HTTP_STATUS, ROLES } from "@/sipsder_constants";
import { PERMISSIONS_TYPES } from "@/domain_constants";

export default {
  components: { Modal },
  data() {
    return {
      selected: undefined,
      manual: undefined,
      manualOpts: undefined,
      errorUpload: false,
      file: undefined,
      /*            DATEPICKER OPTIONS            */
      pickerOpts: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      /*            MODAL VALUES            */
      shownModal: undefined,
      manualTitle: undefined,
      modals: {
        save: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.saveManual(),
          onCancel: () => (this.shownModal = undefined)
        },
        success: {
          nonClosable: true,
          cancelable: false,
          onAccept: async () => {
            await this.$store.dispatch("getHelp");
            this.goTo("Help");
          }
        },
        error: {
          nonClosable: false,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        },
        discard: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => this.$router.go(-1),
          onCancel: () => (this.shownModal = undefined)
        },
        invalid: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        }
      }
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    help() {
      return this.$store.getters.getHelp;
    }
  },
  beforeCreate() {
    this.$validator.extend("nonFutureDate", {
      getMessage: field => this.$t("help.admin.date_before"),
      validate: value => value <= new Date()
    });
  },
  async created() {
    if (!this.isAdmin) {
      this.$destroy();
      this.goTo("Help");
      return;
    }
    if (this.help === undefined) {
      await this.$store.dispatch("getHelp");
    }
    const manualId = parseInt(this.$route.params.id);
    if (manualId) {
      this.selected = this.$store.getters.getManual(manualId);
    } else {
      this.selected = this.help.helpDocuments[0];
    }
    this.manual = { ...this.selected };
    if (typeof this.manual.date === "number") {
      this.manual.date = new Date(this.manual.date);
    }
    this.manualOpts = this.help.helpDocuments.map(manual => {
      return { value: manual, text: manual.title };
    });
  },
  watch: {
    selected(selected) {
      this.manual = { ...selected };
      this.file = undefined;
      if (this.$route.params.title !== this.manual.title.split(" ").join("-")) {
        this.completeRoute();
      }
    },
    manual(manual) {
      this.modals.save.message =
        "<p>" +
        this.$t("help.admin.save_1") +
        "<b>" +
        manual.title +
        "</b>" +
        this.$t("help.admin.save_2") +
        "</p>" +
        this.$t("help.admin.confirm_save");
    }
  },
  methods: {
    createParams() {
      return {
        id: this.manual.cryptedId,
        title: this.manual.title.split(" ").join("-")
      };
    },
    toDetail() {
      this.goTo("HelpDetail", this.createParams());
    },
    onUpload() {
      this.$refs.uploadDocument.value = "";
      this.$refs.uploadDocument.click();
      this.errorUpload = false;
    },
    uploadFile(e) {
      if (e.target.files.length) {
        if (
          e.target.files[0].type === "application/pdf" &&
          e.target.files[0].size <= 10000000
        ) {
          this.errorUpload = false;
          this.file = e.target.files[0];
        } else {
          this.errorUpload = true;
          this.file = undefined;
        }
      }
    },
    validateManual() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.shownModal = "save";
        } else {
          this.shownModal = "invalid";
        }
      });
    },
    saveManual() {
      const body = new FormData();
      body.append(
        "helpDocument",
        new Blob([JSON.stringify(this.manual)], {
          type: "application/json"
        })
      );
      body.append("file", this.file);
      const headers = { headers: { "Content-Type": "multipart/form-data" } };
      VAPI.put(`${SERVICE_NAMES.HELP}/document`, body, headers)
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.shownModal = "success";
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred saving the manual " + e.toString());
          this.shownModal = "error";
        });
    },
    completeRoute() {
      const params = this.createParams()
      this.$router.replace({ params });
    },
    goTo(componentName, params) {
      this.$router.push({ name: componentName, params });
    }
  }
};
</script>

<style lang="sass" scoped>
.row
  margin-top: 15px
  margin-bottom: 15px

.full-width
  width: 100%
  
.valign
  display: inline-flex
  align-items: center
</style>
