<template>
  <div class="container container-form">
    <b-container>
      <sipsder-title :title="$t('config.arcgis.title')" type="admin" />
      <b-form v-if="configs" @submit.prevent="validateConfig">
        <b-row class="my-2" v-for="(config, i) in configs" :key="i">
          <b-col>
            <b-form-group :class="{ required: !config.key.includes('map-id') }" :label="$t(config.label)" horizontal>
              <map-search
                v-if="config.key.includes('map-id')"
                class="bg-white"
                :name="config.key"
                :data-vv-as="$t(config.label)"
                v-validate="validation(config.key)"
                v-model="config.content"
              />
              <b-form-input
                v-else
                :name="config.key"
                :type="config.key.includes('password') ? 'password' : 'text'"
                :data-vv-as="$t(config.label)"
                v-validate="validation(config.key)"
                v-model="config.content"
              />
              <b-alert
                variant="danger"
                :show="errors.has(config.key)"
              >{{ errors.first(config.key) }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-center btn-group">
            <sipsder-btn btnType="back" @onClick="shownModal = 'discard'" />
          </b-col>
          <b-col class="text-center btn-group">
            <sipsder-btn btnType="accept" :text="$t('button.save')" @onClick="validateConfig" />
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <modal
      :modals="modals"
      :active-modal-name="shownModal"
      i18n="config.arcgis"
      @closed="shownModal = undefined"
    />
  </div>
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS, ROLES } from "@/sipsder_constants";
import { PERMISSIONS_TYPES } from "@/domain_constants";
import VAPI from "@/http_common";
import Modal from "@/components/shared/Modal";
import MapSearch from "@/components/shared/arcgis/MapSearch";

export default {
  components: { MapSearch, Modal },
  data() {
    return {
      configs: undefined,
      /*            MODAL VALUES            */
      shownModal: undefined,
      modals: {
        save: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.saveConfig(),
          onCancel: () => (this.shownModal = undefined)
        },
        success: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => this.$router.push({ name: "Home" })
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
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    }
  },
  created() {
    if (!this.isLogged || !this.isAdmin) {
      this.$router.push({ name: "Home" });
      return;
    }
    VAPI.get(`${SERVICE_NAMES.SYSTEM_CONFIG}/arcgis`)
      .then(response => {
        if (response && response.status === HTTP_STATUS.OK) {
          response.data.forEach(c => (c.label = c.key.replace("sipsder", "config")));
          this.configs = response.data;
        } else {
          throw new Error("Response error");
        }
      })
      .catch(e => {
        console.error(
          "An error occurred loading ArcGIS configuration " + e.toString()
        );
      });
  },
  methods: {
    validation(key) {
      return {
        required: !key.includes('map-id'),
        max: 180,
        url: key.includes("url") ? { require_protocol: true } : false
      };
    },
    validateConfig() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.shownModal = "save";
        } else {
          this.shownModal = "invalid";
        }
      });
    },
    saveConfig() {
      const config = this.configs.map(c => ({
        key: c.key,
        content: c.content
      }));
      VAPI.put(SERVICE_NAMES.SYSTEM_CONFIG, config)
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.shownModal = "success";
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error(
            "An error occurred updating the system configurations " +
              e.toString()
          );
        });
    }
  }
};
</script>

<style lang="sass">
.form-group.required legend:after,
.label.required:after
  content: " *"
  color: red
</style>