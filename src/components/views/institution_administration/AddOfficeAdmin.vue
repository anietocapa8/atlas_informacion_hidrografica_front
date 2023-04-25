<template>
  <div class="container container-form">
    <b-container>
      <sipsder-title
        :title="this.$t('institutionAdmin.add_office.title').toUpperCase()"
        type="admin"
        section="configuration"
      />
    </b-container>
    <b-form data-vv-scope="formOffice" @submit.prevent="onAccept">
      <b-row>
        <b-col cols="3">
          <label class="label required">{{$t("institutionAdmin.add_office.name")}}</label>
        </b-col>
        <b-col cols="9">
          <b-form-group class="required">
            <b-form-input
              type="text"
              name="name"
              data-vv-as="Nombre de sede"
              v-validate="'required|max:120'"
              v-model="office.name"
            />
            <b-alert variant="danger" :show="errors.has('formOffice.name')">
              {{ errors.first("formOffice.name") }}
            </b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label class="label required">{{ $t('institutionAdmin.add_office.city') }}</label>
        </b-col>
        <b-col cols="9">
          <b-form-group class="required">
            <vue-select
              name="city"
              label="name"
              data-vv-as="Ciudad"
              :options="cityOpts"
              v-model="office.city"
              v-validate="'required'"
            />
            <b-alert variant="danger" :show="errors.has('formOffice.city')">
              {{ errors.first("formOffice.city") }}
            </b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label class="label required">{{ $t('institutionAdmin.add_office.address') }}</label>
        </b-col>
        <b-col cols="9">
          <b-form-group class="required">
            <b-form-input
              name="address"
              type="text"
              data-vv-as="Dirección"
              v-validate="'required|max:180'"
              v-model="office.address"
            />
            <b-alert variant="danger" :show="errors.has('formOffice.address')">
              {{ errors.first("formOffice.address") }}
            </b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label class="label required">{{ $t('institutionAdmin.add_office.attention_hours') }}</label>
        </b-col>
        <b-col cols="9">
          <b-form-group class="required">
            <b-form-input
              type="text"
              name="attentionHours"
              data-vv-as="Horario de atención"
              v-validate="'required|max:300'"
              v-model="office.attentionHours"
            />
            <b-alert variant="danger" :show="errors.has('formOffice.attentionHours')">
              {{ errors.first("formOffice.attentionHours") }}
            </b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="centered">
        <sipsder-btn class="button-group" btnType="cancel" @onClick="onCancel"/>
        <sipsder-btn class="button-group" btnType="add" type="submit"/>
      </div>
    </b-form>
  </div>
</template>

<script>
import { SERVICE_NAMES, HTTP_STATUS } from "../../../sipsder_constants";
import { GEOGRAPHY_TYPE } from "../../../domain_constants";
import VAPI from "../../../http_common";
import VueSelect from "vue-select";

export default {
  name: "AddOfficeAdmin",
  components: { VueSelect },
  props: {
    shown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      office: {
        name: undefined,
        address: undefined,
        city: undefined,
        attentionHours: undefined
      },
      cityOpts: [],
    };
  },
  methods: {
    getCities() {
      VAPI.get("/" + SERVICE_NAMES.GEOGRAPHY + "?type=" + GEOGRAPHY_TYPE.MUNICIPIO)
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            response.data.sort((c1, c2) => c1.name.localeCompare(c2.name));
            this.cityOpts.push(...response.data);
          } else {
            throw new Error('response error');
          }
        })
        .catch(e => {
          console.error("An error has occurred loading Geographies " + e.toString());
        });
    },
    onAccept() {
      this.$validator.validateAll('formOffice').then(result => {
        if (result) {
          const office = {...this.office}
          office.cityId = office.city.id;
          office.cityName = office.city.name;
          delete office['city'];
          this.$emit("create-office", office);
        }
      });
    },
    onCancel() {
      this.$emit("cancel-creation");
    },
  },
  beforeMount() {
    this.getCities();
  },
  watch: {
    shown(shown) {
      if (shown) {
        this.$validator.reset('formOffice');
      } else {
        this.office = {};
      }
    },
  },
};
</script>

<style scpoed>
.form-group {
  width: 100%;
}
.form-group.required legend:after {
  content: " *";
  color: red;
}
</style>