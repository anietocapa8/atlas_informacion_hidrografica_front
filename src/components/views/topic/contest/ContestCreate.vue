<template>
  <div class="container container-form">
    <sipsder-title :title="$t('contests.create.title')" type="admin" section="configuration"/>
    <h3 class="info">{{ $t('contests.create.description') }}</h3>
    <br>
    <b-form @submit.prevent="validateContest">
      <b-row>
        <b-col cols="6">
          <label class="label required">{{ $t("contests.create.reason") }}</label>
        </b-col>
        <b-col cols="6" class="text-right">
          <b-form-checkbox v-model="contest.status"/>
          <span>{{ $t('help.admin.enable') }}</span>
        </b-col>
      </b-row>
      <b-form-group class="form-group required">
        <b-form-input
          name="reason"
          type="text"
          :data-vv-as="$t('contests.create.reason')"
          v-validate="'required'"
          v-model="contest.disableReason"
          :disabled="contest.status"
        />
        <b-alert variant="danger" :show="errors.has('reason')">{{ errors.first("reason") }}</b-alert>
      </b-form-group>
      <b-row>
        <b-col md="8">
          <b-form-group class="form-group required" :label="$t('contests.create.name')">
            <b-form-input
              name="name"
              type="text"
              :data-vv-as="$t('contests.create.name')"
              v-validate="'required'"
              v-model="contest.name"
            />
            <b-alert variant="danger" :show="errors.has('name')">{{ errors.first("name") }}</b-alert>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group class="form-group required" :label="$t('contests.create.date')">
            <el-date-picker
              name="date"
              class="w-100"
              type="date"
              format="dd/MM/yyyy"
              prefix-icon="far fa-calendar-alt"
              v-model="contest.date"
              v-validate="'required'"
              :data-vv-as="$t('contests.create.date')"
              :placeholder="$t('util.insertDate')"
            />
            <b-alert variant="danger" :show="errors.has('date')">{{ errors.first("date") }}</b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group class="form-group required" :label="$t('contests.create.summary_lbl')" x>
        <b-form-textarea
          type="text"
          v-validate="'required|max:280'"
          name="summary"
          :data-vv-as="$t('contests.create.summary')"
          v-model="contest.summary"
          rows="3"
          max-rows="5"
          no-resize
        />
        <b-alert variant="danger" :show="errors.has('summary')">{{ errors.first("summary") }}</b-alert>
      </b-form-group>
      <b-form-group class="form-group required" :label="$t('contests.generalities')">
        <rich-text
          v-model="contest.generalities"
          name="generalities"
          :data-vv-as="$t('contests.generalities')"
          v-validate="'required'"
        />
        <b-alert
          variant="danger"
          :show="errors.has('generalities')"
        >{{ errors.first("generalities") }}</b-alert>
      </b-form-group>
      <b-form-group class="form-group required" :label="$t('contests.more_info')">
        <rich-text
          v-model="contest.moreInfo"
          name="moreInfo"
          :data-vv-as="$t('contests.more_info')"
          v-validate="'required'"
        />
        <b-alert variant="danger" :show="errors.has('moreInfo')">{{ errors.first("moreInfo") }}</b-alert>
      </b-form-group>
      <b-form-group class="form-group required" :label="$t('contests.create.tags')">
        <tags-input
          class="w-100"
          name="tags"
          v-model="tag"
          :data-vv-as="$t('contests.create.tags')"
          :placeholder="$t('util.tags_hint')"
          :tags="contest.tags"
          @tags-changed="tags => contest.tags = tags"
        />
        <b-alert variant="danger" :show="errors.has('tags')">{{ errors.first("tags") }}</b-alert>
      </b-form-group>
    </b-form>

    <hr>

    <admin-carousel
      :attachments="contest.attachments"
      :uploadButtonText="$t('contests.create.attachments_btn')"
    />

    <div class="centered">
      <sipsder-btn class="button-group" btnType="back" @onClick="shownModal = 'discard'"/>
      <sipsder-btn class="button-group" btnType="save" @onClick="validateContest"/>
    </div>

    <modal
      :modals="modals"
      :activeModalName="shownModal"
      i18n="contests.create"
      @closed="shownModal = undefined"
    />
  </div>
</template>

<script>
import VAPI from "../../../../http_common";
import {
  SERVICE_NAMES,
  ROLES,
  HTTP_STATUS
} from "../../../../sipsder_constants";
import Modal from "../../../shared/Modal";
import RichText from "../../../shared/RichText";
import AdminCarousel from "../../../shared/AdminCarousel";
import {PERMISSIONS_TYPES} from "../../../../domain_constants";

export default {
  components: { AdminCarousel, RichText, Modal },
  data() {
    return {
      contest: {
        attachments: [],
        date: new Date(),
        status: true,
        disableReason: undefined,
        generalities: "",
        moreInfo: "",
        name: "",
        summary: "",
        tags: []
      },
      tag: "",
      /*            MODAL VALUES            */
      shownModal: undefined,
      modals: {
        save: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.saveContest(),
          onCancel: () => (this.shownModal = undefined)
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
      },
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    }
  },
  watch: {
    "contest.status": function(enabled) {
      if (enabled) {
        this.contest.disableReason = undefined;
      }
    },
    "contest.tags": function(tags) {
      this.validTags();
    }
  },
  async created() {
    if (!this.isLogged || !this.isAdmin) {
      this.$router.go(-1);
      return;
    } 
    const id = this.$store.getters.getContestId;
    if (id) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.CONTEST}/${id}`);
        if (response && response.status === HTTP_STATUS.OK) {
          if (response.data.tags) {
            response.data.tags = response.data.tags.map(tag => ({ text: tag }));
          }
          this.contest = Object.assign({}, this.contest, response.data);
        } else {
          throw new Exception("Response error");
        }
      } catch (error) {
        console.error("Error fetching contest: ", error);
        this.$router.go(-1);
      }
    }
  },
  methods: {
    validateContest() {
      const areTagsValid = this.validTags();
      this.$validator.validateAll().then(result => {
        if (result && areTagsValid) {
          this.shownModal = "save";
        } else {
          this.shownModal = "invalid";
        }
      });
    },
    validTags() {
      if (this.contest.tags.length === 0) {
        if (!this.$validator.errors.has("tags")) {
          this.$validator.errors.add({
            field: "tags",
            msg: this.$t("contests.create.tags_required")
          });
        }
        return false;
      } else {
        this.$validator.errors.remove("tags");
        return true;
      }
    },
    saveContest() {
      this.shownModal = undefined;
      // Create contest body
      const body = { ...this.contest };
      body.tags = body.tags.map(tag => tag.text);
      let request, msg;
      if (body.id) {
        request = VAPI.put("/" + SERVICE_NAMES.CONTEST, body);
        msg = "updat";
      } else {
        request = VAPI.post("/" + SERVICE_NAMES.CONTEST, body);
        msg = "creat";
      }
      request
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.$store.dispatch('setContestId', response.data.id);
            this.$router.push({ name: "ContestDetail" });
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error("Error " + msg + "ing contest " + e.toString());
          this.shownModal = "error";
        });
    }
  }
};
</script>

<style lang="sass" scoped>
.w-100
  width: 100% !important
  max-width: 100% !important

.centered
  display: flex
  justify-content: center
  align-items: center

.form-group
  margin-bottom: 15px

  .container
    padding: 0px
    height: auto
</style>